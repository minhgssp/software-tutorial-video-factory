#!/usr/bin/env python3
"""kudo-talk-clean — tự dọn video talking head trước khi dựng.

Xử lý: khoảng lặng dài, lặng đầu/cuối, từ đệm (ờ, ừm…), tiếng phát ra mà ASR không
ghi thành chữ (đệm/nói vấp), lặp từ/cụm, câu nói lại (giữ lần cuối), và đoạn người
dùng/agent chỉ định bỏ (--drop "cụm chữ"). Điểm cắt bám chỗ năng lượng thấp nhất,
mỗi mối nối có fade âm 12 ms để không lách tách.

Lệnh:
  talkclean.py plan  VIDEO WORDS.json OUT_DIR [--drop "cụm"]... [--keep-pause 0.22]
  talkclean.py render OUT_DIR             (dùng OUT_DIR/edl.json, ra OUT_DIR/clean.mp4)

WORDS.json: danh sách {w, s, e, p} (faster-whisper word_timestamps).
Kết quả: edl.json (đoạn giữ, đoạn bỏ + lý do), words.clean.json (thời gian sau cắt),
report.md (để người/agent đọc và duyệt).
"""
import argparse
import array
import json
import math
import pathlib
import re
import subprocess
import sys
import unicodedata

SR = 16000
HOP = 0.01
WIN = 0.02

FILLERS = {"ờ", "ơ", "ừ", "ừm", "ưm", "ậm", "à", "á", "hừm", "hmm", "uh", "um", "ah", "eh", "ừa", "ầy"}
# "à"/"á" cũng là trợ từ thật ("đúng không à") → chỉ coi là đệm khi đứng tách bởi khoảng nghỉ.
SOFT_FILLERS = {"à", "á"}


def sh(cmd):
    return subprocess.run([str(c) for c in cmd], check=True, capture_output=True)


def norm(w):
    w = unicodedata.normalize("NFC", w.lower())
    return re.sub(r"[^\w]", "", w)


def pcm(src):
    raw = subprocess.run(["ffmpeg", "-nostdin", "-v", "error", "-i", str(src), "-ac", "1", "-ar", str(SR),
                          "-f", "s16le", "-"], capture_output=True, check=True).stdout
    a = array.array("h")
    a.frombytes(raw[:len(raw) // 2 * 2])
    if sys.byteorder == "big":
        a.byteswap()
    return a


def rms_curve(a):
    n, h = int(SR * WIN), int(SR * HOP)
    out = []
    for i in range(0, max(len(a) - n, 0) + 1, h):
        seg = a[i:i + n]
        out.append(math.sqrt(sum(x * x for x in seg) / n))
    return out


def db(x):
    return 20 * math.log10(max(x, 1.0) / 32768)


class Energy:
    def __init__(self, curve):
        self.c = [db(x) for x in curve]
        s = sorted(self.c)
        self.floor = s[int(len(s) * 0.10)]          # nền tạp âm
        self.speech = s[int(len(s) * 0.80)]         # mức nói điển hình
        self.thr = self.floor + max(6.0, (self.speech - self.floor) * 0.35)

    def idx(self, t):
        return min(len(self.c) - 1, max(0, int(round((t - WIN / 2) / HOP))))

    def t(self, i):
        return i * HOP + WIN / 2

    def quietest(self, lo, hi, prefer="mid"):
        i0, i1 = self.idx(lo), self.idx(hi)
        if i1 < i0:
            return (lo + hi) / 2
        mid = (i0 + i1) / 2
        best = min(range(i0, i1 + 1), key=lambda i: (round(self.c[i]), abs(i - mid) if prefer == "mid" else
                                                     (-i if prefer == "late" else i)))
        return self.t(best)

    def voiced(self, lo, hi, min_len=0.12):
        """Các đoạn có tiếng (trên ngưỡng) dài ≥ min_len trong [lo, hi]."""
        out, start = [], None
        for i in range(self.idx(lo), self.idx(hi) + 1):
            on = self.c[i] > self.thr
            if on and start is None:
                start = i
            if (not on or i == self.idx(hi)) and start is not None:
                if (i - start) * HOP >= min_len:
                    out.append((self.t(start), self.t(i)))
                start = None
        return out


def refine(words, en):
    """Whisper hay nuốt khoảng lặng vào độ dài từ. Co biên mỗi từ về phần có tiếng thật
    (ngưỡng thấp hơn ngưỡng nói để không cắt phụ âm cuối), giữ tối thiểu 60 ms."""
    lo_thr = en.floor + 8.0
    out = []
    for w in words:
        i0, i1 = en.idx(w["s"]), en.idx(w["e"])
        while i1 - i0 > 6 and en.c[i0] < lo_thr:
            i0 += 1
        while i1 - i0 > 6 and en.c[i1] < lo_thr:
            i1 -= 1
        out.append(dict(w, s=round(max(w["s"], en.t(i0) - 0.03), 3), e=round(min(w["e"], en.t(i1) + 0.04), 3)))
    return out


# ---------- phát hiện lỗi trên chuỗi từ ----------

def phrases(words, gap=0.28):
    """Tách cụm theo khoảng nghỉ ≥ gap. Trả list (i0, i1) chỉ số từ, i1 bao gồm."""
    out, i0 = [], 0
    for i in range(1, len(words) + 1):
        if i == len(words) or words[i]["s"] - words[i - 1]["e"] >= gap:
            out.append((i0, i - 1))
            i0 = i
    return out


def mark_fillers(words, drop):
    for i, w in enumerate(words):
        n = norm(w["w"])
        if n not in FILLERS:
            continue
        if n in SOFT_FILLERS:
            before = w["s"] - words[i - 1]["e"] if i else 1
            after = words[i + 1]["s"] - w["e"] if i + 1 < len(words) else 1
            if min(before, after) < 0.12:
                continue
        drop[i] = "từ đệm"


def mark_repeats(words, drop, max_n=6):
    """Lặp liền nhau: A B A B → bỏ bản đầu. Từ lắp: tôi tôi → bỏ bản đầu."""
    toks = [norm(w["w"]) for w in words]
    i = 0
    while i < len(toks):
        hit = 0
        for n in range(max_n, 0, -1):
            if i + 2 * n <= len(toks) and toks[i:i + n] == toks[i + n:i + 2 * n] and all(toks[i:i + n]):
                # lặp ngắn (1–2 từ) chỉ là lắp khi hai bản sát nhau; có nghỉ thì thường là
                # ranh giới câu thật ("gồm 4 phần. Phần 1…")
                if n <= 2 and words[i + n]["s"] - words[i + n - 1]["e"] >= 0.3:
                    continue
                if words[i + n]["w"][:1].isupper() and not words[i]["w"][:1].isupper():
                    continue                            # ASR đã thấy ranh giới câu
                hit = n
                break
        if hit:
            for k in range(i, i + hit):
                drop.setdefault(k, f"lặp {hit} từ")
            i += hit
        else:
            i += 1


def mark_restarts(words, drop, look=2):
    """Câu nói lại: cụm A ngắt nghỉ, cụm sau bắt đầu giống A ≥2 từ → A là lần hỏng, giữ lần cuối.
    Cũng bắt cụm A là tiền tố cụt của B (nói dở rồi nói lại)."""
    ph = phrases(words)
    toks = [norm(w["w"]) for w in words]
    for a in range(len(ph)):
        a0, a1 = ph[a]
        ta = toks[a0:a1 + 1]
        for b in range(a + 1, min(a + 1 + look, len(ph))):
            b0, b1 = ph[b]
            tb = toks[b0:b1 + 1]
            k = 0
            while k < min(len(ta), len(tb)) and ta[k] == tb[k]:
                k += 1
            if k >= 2 or (k >= 1 and len(ta) == 1 and len(tb) > 1):
                for j in range(a0, a1 + 1):
                    drop.setdefault(j, "nói lại (giữ lần sau)")
                # các cụm nằm giữa a và b cũng là phần hỏng
                for m in range(a + 1, b):
                    for j in range(ph[m][0], ph[m][1] + 1):
                        drop.setdefault(j, "nói lại (giữ lần sau)")
                break


def mark_user_drops(words, drop, pats):
    toks = [norm(w["w"]) for w in words]
    misses = []
    for p in pats:
        pt = [norm(x) for x in p.split() if norm(x)]
        found = False
        for i in range(len(toks) - len(pt) + 1):
            if toks[i:i + len(pt)] == pt:
                for k in range(i, i + len(pt)):
                    drop[k] = f"chỉ định bỏ: {p}"
                found = True
        if not found:
            misses.append(p)
    return misses


def suspects(words, drop):
    """Gợi ý cho người/agent duyệt (không tự cắt): cụm cụt trước nghỉ dài, từ tin cậy thấp."""
    out = []
    for a0, a1 in phrases(words, gap=0.9):
        nxt = a1 + 1
        if nxt < len(words) and words[nxt]["s"] - words[a1]["e"] >= 0.9 and not all(k in drop for k in range(a0, a1 + 1)):
            seg = " ".join(w["w"] for w in words[max(a0, a1 - 7):a1 + 1])
            out.append({"t": words[a1]["e"], "kind": "nghỉ dài sau cụm — kiểm tra câu có bị bỏ dở",
                        "text": seg, "pause": round(words[nxt]["s"] - words[a1]["e"], 2)})
    for i, w in enumerate(words):
        if w.get("p", 1) < 0.45 and i not in drop:
            out.append({"t": w["s"], "kind": "ASR kém tin cậy — nghe lại", "text": w["w"], "p": w["p"]})
    return out


# ---------- dựng danh sách đoạn giữ ----------

def build_edl(words, en, dur, drop, keep_pause, comma_pause, max_gap, lead):
    keep = [i for i in range(len(words)) if i not in drop]
    if not keep:
        raise SystemExit("không còn từ nào sau khi dọn")
    removed, segs = [], []

    # tiếng có năng lượng mà không có chữ (ờ/ừm bị ASR bỏ, nói vấp) → bỏ
    def unworded(lo, hi):
        return [v for v in en.voiced(lo + 0.12, hi - 0.12) if v[1] - v[0] >= 0.15]

    start = en.quietest(max(0, words[keep[0]]["s"] - lead), max(0.0, words[keep[0]]["s"] - 0.02), "late")
    if start > 0.05:
        removed.append({"s": 0, "e": round(start, 3), "why": "lặng/nhiễu đầu video"})
    cur = start
    for a, b in zip(keep, keep[1:] + [None]):
        wa = words[a]
        if b is None:
            end = min(dur, en.quietest(wa["e"] + 0.04, min(dur, wa["e"] + 0.45), "early") + 0.12)
            segs.append([cur, end])
            if dur - end > 0.05:
                removed.append({"s": round(end, 3), "e": round(dur, 3), "why": "lặng/nhiễu cuối video"})
            break
        wb = words[b]
        gap = wb["s"] - wa["e"]
        contiguous = b == a + 1
        noise = unworded(wa["e"], wb["s"]) if gap > 0.3 else []
        sentence = bool(re.search(r"[.!?…]$", wa["w"])) or gap >= 0.45
        want = keep_pause if sentence else comma_pause
        if contiguous and gap <= max_gap and not noise:
            continue                                    # nói liền, giữ nguyên nhịp
        # cắt: giữ một khoảng nghỉ `want` tách đều hai phía của chỗ lặng
        if gap <= want + 0.04 and contiguous and not noise:
            continue
        tail = min(want / 2, max(0.03, gap / 2))
        e = en.quietest(wa["e"] + 0.02, wa["e"] + max(0.05, tail + 0.06), "early")
        s = en.quietest(wb["s"] - max(0.05, tail + 0.06), wb["s"] - 0.02, "late")
        e = max(e, wa["e"] + 0.06)
        s = min(s, wb["s"] - 0.06)
        if s <= e:
            continue
        segs.append([cur, e])
        if contiguous:
            why = "nghỉ dài có tiếng không thành lời" if noise else f"nghỉ dài {gap:.2f}s"
        else:
            reasons = sorted({drop[k] for k in range(a + 1, b)})
            why = "; ".join(reasons)
        removed.append({"s": round(e, 3), "e": round(s, 3), "why": why,
                        "text": " ".join(words[k]["w"] for k in range(a + 1, b))})
        cur = s
    # gộp đoạn quá ngắn (< 0.12s) vào đoạn kề để tránh nháy hình
    merged = []
    for s, e in segs:
        if merged and s - merged[-1][1] < 0.02:
            merged[-1][1] = e
        else:
            merged.append([s, e])
    return merged, removed


def snap_frames(segs, fps, dur):
    """Điểm cắt phải trùng biên khung hình: concat cắt hình theo khung còn tiếng theo mẫu,
    lệch nhau thì ffmpeg chèn lặng vào tiếng → trôi tiếng và nhép môi sai dần."""
    out = []
    for s, e in segs:
        s, e = round(s * fps) / fps, min(round(e * fps) / fps, math.floor(dur * fps) / fps)
        if out and s <= out[-1][1]:
            out[-1][1] = e
        elif e - s >= 2 / fps:
            out.append([s, e])
    return [[round(s, 4), round(e, 4)] for s, e in out]


def remap(t, segs):
    out = 0.0
    for s, e in segs:
        if t < s:
            return round(out, 3)
        if t <= e:
            return round(out + t - s, 3)
        out += e - s
    return round(out, 3)


def probe_dur(src):
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(src)],
                       capture_output=True, text=True, check=True)
    return float(r.stdout.strip())


def probe_fps(src):
    r = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=r_frame_rate",
                        "-of", "csv=p=0", str(src)], capture_output=True, text=True, check=True)
    n, d = r.stdout.strip().split("/")
    return float(n) / float(d)


def cmd_plan(a):
    out = pathlib.Path(a.out)
    out.mkdir(parents=True, exist_ok=True)
    dur = probe_dur(a.video)
    en = Energy(rms_curve(pcm(a.video)))
    words = refine(json.load(open(a.words)), en)
    drop = {}
    misses = mark_user_drops(words, drop, a.drop or [])
    mark_fillers(words, drop)
    mark_repeats(words, drop)
    mark_restarts(words, drop)
    segs, removed = build_edl(words, en, dur, drop, a.keep_pause, a.comma_pause, a.max_gap, a.lead)
    fps = probe_fps(a.video)
    segs = snap_frames(segs, fps, dur)
    kept = [dict(w, s=remap(w["s"], segs), e=remap(w["e"], segs)) for i, w in enumerate(words) if i not in drop]
    total = round(sum(e - s for s, e in segs), 3)
    edl = {"source": str(pathlib.Path(a.video).resolve()), "fps": fps, "source_dur": round(dur, 3), "clean_dur": total,
           "segments": [{"src_s": s, "src_e": e, "out_s": remap(s, segs), "out_e": remap(e, segs) or total}
                        for s, e in segs],
           "removed": removed, "suspects": suspects(words, drop), "drop_patterns_not_found": misses,
           "energy_db": {"floor": round(en.floor, 1), "speech": round(en.speech, 1), "thr": round(en.thr, 1)}}
    for i, sg in enumerate(edl["segments"]):
        sg["out_e"] = round(sg["out_s"] + sg["src_e"] - sg["src_s"], 3)
    json.dump(edl, open(out / "edl.json", "w"), ensure_ascii=False, indent=1)
    json.dump(kept, open(out / "words.clean.json", "w"), ensure_ascii=False, indent=0)
    lines = [f"# Báo cáo dọn talking head", "", f"- Gốc: {dur:.2f}s → sau dọn: {total:.2f}s "
             f"(bớt {dur - total:.2f}s, {len(segs)} đoạn, {len(segs) - 1} mối nối)", ""]
    lines += ["## Đã bỏ", "", "| Từ (s) | Đến (s) | Dài | Lý do | Chữ |", "|---|---|---|---|---|"]
    for r in removed:
        lines.append(f"| {r['s']:.2f} | {r['e']:.2f} | {r['e'] - r['s']:.2f} | {r['why']} | {r.get('text', '')} |")
    lines += ["", "## Cần người/agent nghe lại (chưa tự cắt)", ""]
    for s in edl["suspects"]:
        lines.append(f"- {s['t']:.2f}s · {s['kind']} · “{s['text']}”" + (f" · nghỉ {s['pause']}s" if 'pause' in s else ""))
    if misses:
        lines += ["", "## Mẫu --drop không tìm thấy", ""] + [f"- {m}" for m in misses]
    (out / "report.md").write_text("\n".join(lines) + "\n")
    print("\n".join(lines))


def cmd_render(a):
    out = pathlib.Path(a.out)
    edl = json.load(open(out / "edl.json"))
    src = edl["source"]
    fade = 0.012
    parts, labels = [], []
    for i, sg in enumerate(edl["segments"]):
        s, e = sg["src_s"], sg["src_e"]
        d = e - s
        parts.append(f"[0:v]trim=start={s}:end={e},setpts=PTS-STARTPTS[v{i}]")
        parts.append(f"[0:a]atrim=start={s}:end={e},asetpts=PTS-STARTPTS,"
                     f"afade=t=in:d={fade},afade=t=out:st={max(0, d - fade):.4f}:d={fade}[a{i}]")
        labels.append(f"[v{i}][a{i}]")
    parts.append("".join(labels) + f"concat=n={len(labels)}:v=1:a=1[v][a]")
    (out / "filter.txt").write_text(";\n".join(parts))
    sh(["ffmpeg", "-nostdin", "-v", "error", "-y", "-i", src, "-filter_complex_script", out / "filter.txt",
        "-map", "[v]", "-map", "[a]", "-c:v", "libx264", "-crf", "16", "-preset", "medium", "-pix_fmt", "yuv420p",
        "-c:a", "pcm_s16le", "-ar", "48000", out / "clean.mov"])
    print(out / "clean.mov", probe_dur(out / "clean.mov"))


def main():
    p = argparse.ArgumentParser()
    sp = p.add_subparsers(dest="cmd", required=True)
    q = sp.add_parser("plan")
    q.add_argument("video")
    q.add_argument("words")
    q.add_argument("out")
    q.add_argument("--drop", action="append", help="cụm chữ cần bỏ (khớp theo từ, bỏ mọi lần xuất hiện)")
    q.add_argument("--keep-pause", type=float, default=0.24, help="nghỉ giữ lại giữa hai câu")
    q.add_argument("--comma-pause", type=float, default=0.14, help="nghỉ giữ lại giữa hai vế")
    q.add_argument("--max-gap", type=float, default=0.30, help="nghỉ ngắn hơn thì để nguyên")
    q.add_argument("--lead", type=float, default=0.25, help="giữ tối đa bao nhiêu lặng trước từ đầu tiên")
    q.set_defaults(fn=cmd_plan)
    r = sp.add_parser("render")
    r.add_argument("out")
    r.set_defaults(fn=cmd_render)
    a = p.parse_args()
    a.fn(a)


if __name__ == "__main__":
    main()
