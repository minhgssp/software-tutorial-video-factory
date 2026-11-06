#!/usr/bin/env python3
"""Chọn đoạn hay từ nguồn dài (video YouTube, buổi live) để làm talking head ngắn.

  pick.py fetch URL DIR                      tải video + phụ đề vi (yt-dlp)
  pick.py json3 IN.json3 OUT.json            phụ đề YouTube → words.json [{w,s,e,p}]
  pick.py candidates words.json --length 60  xếp hạng các khung câu ứng viên → in bảng + ghi .candidates.json
  pick.py cut SRC "a-b,c-d" OUT.mp4          nối các đoạn (giây) thành một clip

Chỉ dùng thư viện chuẩn + ffmpeg/yt-dlp. Điểm số chỉ để agent chọn nhanh,
người duyệt vẫn đọc lời từng ứng viên trước khi cắt.
"""
import json
import re
import shutil
import subprocess
import sys
from pathlib import Path

FILLERS = {"ờ", "ừ", "à", "ừm", "ờm", "ơ", "hmm", "uh", "um"}
# câu mở bằng các từ này thường bám vào câu trước, cắt từ đây dễ hụt ngữ cảnh
CONNECT = ("và", "thì", "rồi", "nhưng mà", "còn", "xong", "tại vì", "nên", "cho nên", "thế thì", "vậy thì")
# chỉ trỏ màn hình: lời phụ thuộc hình gốc, cắt riêng ra sẽ vô nghĩa
POINTING = ("ở đây", "chỗ này", "cái này", "bấm vào", "nhấn vào", "kéo xuống", "như mọi người thấy", "trên màn hình", "click")
LIST = re.compile(r"\b(thứ nhất|thứ hai|thứ ba|đầu tiên|tiếp theo|cuối cùng|key|bước \d|số \d)\b", re.I)
HOOK = re.compile(r"(\?|bí mật|sai lầm|đừng|không ai|thật ra|quan trọng nhất|khác biệt|tại sao|vì sao)", re.I)


def norm(w):
    return re.sub(r"[^\wÀ-ỹ]", "", w.lower())


def fetch(url, out):
    if not shutil.which("yt-dlp"):
        sys.exit("thiếu yt-dlp: brew install yt-dlp (hoặc pip install yt-dlp)")
    out = Path(out)
    out.mkdir(parents=True, exist_ok=True)
    subprocess.run(["yt-dlp", "-f", "bv*[height<=1080][ext=mp4]+ba[ext=m4a]/b[ext=mp4]/b",
                    "--merge-output-format", "mp4", "--write-info-json",
                    "--write-subs", "--write-auto-subs", "--sub-langs", "vi.*,vi", "--sub-format", "json3",
                    "-o", str(out / "video.%(ext)s"), url], check=True)
    subs = sorted(out.glob("video*.json3"))
    print(f"video: {out / 'video.mp4'}")
    print(f"phụ đề: {subs[0] if subs else 'KHÔNG CÓ — chạy asr.py trên audio'}")


def json3(src, dst):
    ev = json.loads(Path(src).read_text(encoding="utf-8"))["events"]
    words = []
    for e in ev:
        t0, end = e.get("tStartMs", 0), e.get("tStartMs", 0) + e.get("dDurationMs", 0)
        for s in e.get("segs") or []:
            w = s.get("utf8", "").strip()
            if w:
                words.append({"w": w, "s": (t0 + s.get("tOffsetMs", 0)) / 1000, "e": end / 1000, "p": 1.0})
    for a, b in zip(words, words[1:]):
        a["e"] = round(min(a["e"], b["s"]), 3)  # từ kết thúc khi từ sau bắt đầu
    Path(dst).write_text(json.dumps(words, ensure_ascii=False), encoding="utf-8")
    print(f"{len(words)} từ → {dst}")


def sentences(words):
    out, cur = [], []
    for i, w in enumerate(words):
        cur.append(w)
        gap = words[i + 1]["s"] - w["e"] if i + 1 < len(words) else 9
        if re.search(r"[.?!…]$", w["w"]) or gap > 0.9:
            out.append(cur)
            cur = []
    if cur:
        out.append(cur)
    return [{"s": c[0]["s"], "e": c[-1]["e"], "text": " ".join(x["w"] for x in c),
             "n": len(c), "fill": sum(norm(x["w"]) in FILLERS for x in c)} for c in out]


def score(win, topic):
    text = " ".join(s["text"] for s in win).lower()
    n = sum(s["n"] for s in win) or 1
    first = win[0]["text"].lower().lstrip("ờừà, ")
    sc = 0.0
    sc -= 6 * sum(s["fill"] for s in win) / n * 10           # mật độ từ đệm
    sc -= 3 if first.startswith(CONNECT) else 0              # mở bằng từ nối
    sc -= 2 * sum(p in text for p in POINTING)               # lời phụ thuộc màn hình gốc
    sc += 2 * min(3, len(LIST.findall(text)))                # có cấu trúc liệt kê
    sc += 2 if HOOK.search(win[0]["text"]) else 0            # câu đầu là móc
    sc += 1 if re.search(r"[.!?]$", win[-1]["text"]) else 0  # kết trọn câu
    if topic:
        keys = {norm(k) for k in topic.split() if len(k) > 2}
        sc += 1.5 * sum(norm(w) in keys for w in text.split()) / max(1, len(keys))
    return round(sc, 2)


def candidates(src, length, topic, top):
    words = json.loads(Path(src).read_text(encoding="utf-8"))
    sents = sentences(words)
    cands = []
    for i in range(len(sents)):
        for j in range(i, len(sents)):
            dur = sents[j]["e"] - sents[i]["s"]
            if dur > length * 1.15:
                break
            if dur >= length * 0.25:  # khung ngắn để ghép nhiều đoạn thành một clip
                win = sents[i:j + 1]
                cands.append({"s": round(win[0]["s"], 2), "e": round(win[-1]["e"], 2), "dur": round(dur, 1),
                              "score": score(win, topic), "text": " ".join(s["text"] for s in win)})
    cands.sort(key=lambda c: -c["score"])
    picked = []
    for c in cands:  # bỏ khung chồng lấn khung đã chọn
        if all(c["e"] <= p["s"] or c["s"] >= p["e"] for p in picked):
            picked.append(c)
        if len(picked) >= top:
            break
    out = Path(src).with_suffix(".candidates.json")
    out.write_text(json.dumps(picked, ensure_ascii=False, indent=1), encoding="utf-8")
    for k, c in enumerate(picked, 1):
        print(f"#{k} [{c['s']:.2f}-{c['e']:.2f}] {c['dur']}s điểm {c['score']}\n   {c['text'][:220]}")
    print(f"→ {out}")


def cut(src, spans, dst):
    segs = [tuple(map(float, s.split("-"))) for s in spans.split(",")]
    parts = "".join(f"[0:v]trim={a}:{b},setpts=PTS-STARTPTS[v{i}];[0:a]atrim={a}:{b},asetpts=PTS-STARTPTS[a{i}];"
                    for i, (a, b) in enumerate(segs))
    cat = "".join(f"[v{i}][a{i}]" for i in range(len(segs))) + f"concat=n={len(segs)}:v=1:a=1[v][a]"
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", src, "-filter_complex", parts + cat,
                    "-map", "[v]", "-map", "[a]", "-c:v", "libx264", "-crf", "16", "-c:a", "aac", dst], check=True)
    Path(dst).with_suffix(".segments.txt").write_text(
        " | ".join(f"{chr(65 + i)} src {a}-{b}" for i, (a, b) in enumerate(segs)) + "\n", encoding="utf-8")
    print(f"{dst} ({sum(b - a for a, b in segs):.1f}s, {len(segs)} đoạn)")


if __name__ == "__main__":
    a = sys.argv[1:]
    if not a:
        sys.exit(__doc__)
    if a[0] == "fetch":
        fetch(a[1], a[2])
    elif a[0] == "json3":
        json3(a[1], a[2])
    elif a[0] == "candidates":
        opt = dict(zip(a[2::2], a[3::2]))
        candidates(a[1], float(opt.get("--length", 60)), opt.get("--topic", ""), int(opt.get("--top", 8)))
    elif a[0] == "cut":
        cut(a[1], a[2], a[3])
    else:
        sys.exit(__doc__)
