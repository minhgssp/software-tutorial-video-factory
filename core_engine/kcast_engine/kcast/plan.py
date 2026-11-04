"""Phần thuần của engine quay màn hình: nhận diện nội dung hợp quay, khớp lời với nhịp, tính camera,
con trỏ, khối tô, nét bút, phụ đề và mốc tiếng động. Chỉ dùng thư viện chuẩn để test được không cần trình duyệt."""

from __future__ import annotations

import math
import re
import unicodedata

W, H, FPS = 1080, 1920, 30
# Khung trình duyệt trong video dọc (nằm trong vùng an toàn x 90–950 nới ra mép thẻ, y 170–1460).
CARD = {"x": 40, "y": 470, "w": 1000, "h": 860, "chrome": 52}
CONTENT_W = CARD["w"]
CONTENT_H = CARD["h"] - CARD["chrome"]
Z_MAX = 2.4          # ảnh chụp ở mật độ 2x: phóng quá 2,56 lần sẽ nhoè
MOVE = 0.55          # giây camera/con trỏ di chuyển trước khi tới từ khoá
LEAD = 0.30          # cảnh mới bắt đầu sớm hơn lời đầu tiên của cảnh
WORDS_PER_SEC = 2.9  # ước lượng khi chưa có giọng

LABELS = {"open": "Mở", "click": "Bấm", "point": "Xem", "focus": "Xem", "scroll": "Cuộn", "type": "Gõ",
          "mark": "Chú ý", "show": "", "copy": "Chép", "hover": "Xem"}

# ---------------------------------------------------------------- nhận diện nội dung hợp quay màn hình

_TRIGGERS = [
    (r"\bhướng dẫn\b|\bcách (làm|dùng|cài|tạo|đăng|thiết lập|chạy)\b|\bhow ?to\b|\btutorial\b|\bwalkthrough\b", 3, "dạng hướng dẫn / how-to"),
    (r"\bdemo\b|\bthử ngay\b|\bxem thử\b|\btrải nghiệm\b|\bshowcase\b", 2, "cần demo thực tế"),
    (r"\b(cài đặt|install|setup|thiết lập|cấu hình|đăng nhập|đăng ký)\b", 2, "có thao tác cài/thiết lập"),
    (r"\b(repo|github|website|trang web|web ?app|ứng dụng|app|công cụ|tool|extension|plugin|skill|dashboard|phần mềm)\b", 1, "nói về công cụ/sản phẩm số"),
    (r"https?://|\bwww\.|\.(com|dev|io|ai|app|vn)\b", 2, "có đường link cụ thể"),
    (r"\b(bước \d|bước một|step \d|từng bước|step[- ]by[- ]step)\b", 2, "trình bày theo bước"),
    (r"\b(bấm|nhấn|click|chọn nút|kéo|gõ lệnh|copy|dán)\b", 2, "có hành động trên màn hình"),
    (r"\bquay màn hình\b|\bscreen ?record|\bscreencast\b|\bquay (cảnh )?gõ\b", 5, "được yêu cầu trực tiếp"),
]
# Có đoạn gõ phím/lệnh: nên có cảnh `terminal` (lệnh thật) hoặc `live` có `type` (gõ vào ô nhập thật).
_TYPING = (r"\b(gõ|typing|nhập lệnh|dòng lệnh|câu lệnh|terminal|command line|cli|npm|npx|pip|git clone|brew|"
           r"cài bằng lệnh|ô tìm kiếm|ô nhập|prompt)\b")


def suggest(brief: str) -> dict:
    """Chấm điểm brief: >= 3 thì nên quay màn hình. Trả lý do để agent nói rõ vì sao chọn,
    cờ `typing` (nên quay cảnh gõ) và các loại cảnh nên dùng (`kinds`)."""
    text = brief.lower()
    score, reasons = 0, []
    for pattern, weight, reason in _TRIGGERS:
        if re.search(pattern, text):
            score += weight
            reasons.append(reason)
    typing = bool(re.search(_TYPING, text))
    if typing:
        score += 2
        reasons.append("có đoạn gõ phím/lệnh")
    urls = re.findall(r"https?://[^\s)>\"']+", brief)
    kinds = ["screen"] + (["terminal", "live"] if typing else []) + (["demo"] if re.search(r"demo|kết quả", text) else [])
    return {"screencast": score >= 3, "score": score, "reasons": reasons, "urls": urls, "typing": typing, "kinds": kinds}


# ---------------------------------------------------------------- lời và mốc thời gian

def fold(s: str) -> str:
    s = unicodedata.normalize("NFD", s.lower()).replace("đ", "d")
    return "".join(c for c in s if unicodedata.category(c) != "Mn")


def tokens(text: str) -> list[str]:
    return text.split()


def _key(tok: str) -> str:
    return re.sub(r"[^\w]", "", fold(tok))


def find_phrase(toks: list[str], phrase: str, start: int = 0) -> int:
    """Chỉ số từ đầu tiên của cụm `phrase` trong lời (không phân biệt hoa thường, dấu câu, dấu thanh). -1 nếu không có."""
    want = [_key(t) for t in phrase.split() if _key(t)]
    keys = [_key(t) for t in toks]
    if not want:
        return -1
    for i in range(start, len(keys) - len(want) + 1):
        if keys[i:i + len(want)] == want:
            return i
    return -1


def estimate_words(says: list[str], pause: float = 0.45) -> list[dict]:
    """Mốc từ giả lập khi chưa có giọng: đều theo số ký tự, nghỉ ở dấu câu và giữa các cảnh."""
    words, t = [], 0.25
    for say in says:
        for tok in tokens(say):
            dur = max(0.18, (len(tok) + 1) / (WORDS_PER_SEC * 5.2))
            words.append({"text": tok, "start": round(t, 3), "end": round(t + dur, 3)})
            t += dur + (0.22 if tok[-1:] in ",;:" else 0.38 if tok[-1:] in ".!?" else 0.0)
        t += pause
    return words


def split_words(says: list[str], words: list[dict]) -> list[list[dict]]:
    """Chia danh sách từ đã căn (theo thứ tự) về từng cảnh theo số từ của lời mỗi cảnh."""
    counts = [len(tokens(s)) for s in says]
    if sum(counts) != len(words):
        raise ValueError(f"WORD_COUNT_MISMATCH: lời có {sum(counts)} từ, giọng căn được {len(words)} từ")
    out, i = [], 0
    for c in counts:
        out.append(words[i:i + c])
        i += c
    return out


def shot_spans(per_shot: list[list[dict]], tail: float = 1.4, min_dur: float = 2.2) -> list[tuple[float, float]]:
    spans = []
    for k, ws in enumerate(per_shot):
        t0 = 0.0 if k == 0 else max(spans[-1][0] + min_dur, (ws[0]["start"] if ws else spans[-1][1]) - LEAD)
        spans.append([t0, None])
        if k:
            spans[k - 1][1] = t0
    last_end = per_shot[-1][-1]["end"] if per_shot[-1] else spans[-1][0] + min_dur
    spans[-1][1] = max(spans[-1][0] + min_dur, last_end + tail)
    return [(round(a, 3), round(b, 3)) for a, b in spans]


def captions(words: list[dict], max_chars: int = 30, max_words: int = 7) -> list[dict]:
    """Gom từ thành cụm phụ đề ngắn, ngắt ở dấu câu; mỗi cụm giữ mốc từng từ để tô từ đang đọc."""
    chunks, cur = [], []
    for w in words:
        cur.append(w)
        text = " ".join(x["text"] for x in cur)
        if w["text"][-1:] in ".!?,;:" or len(text) >= max_chars or len(cur) >= max_words:
            chunks.append(cur)
            cur = []
    if cur:
        chunks.append(cur)
    out = []
    for i, c in enumerate(chunks):
        end = c[-1]["end"] + 0.25
        if i + 1 < len(chunks):
            end = min(end, chunks[i + 1][0]["start"])
        out.append({"t0": c[0]["start"], "t1": round(max(end, c[-1]["end"]), 3),
                     "words": [{"text": x["text"], "t0": x["start"], "t1": x["end"]} for x in c]})
    return out


# ---------------------------------------------------------------- camera

def zoom_for(rect: dict, view_w: float, do: str, override: float | None = None) -> float:
    if override:
        return max(1.0, min(Z_MAX, override))
    if do in ("show", "open"):
        return 1.0
    if do == "scroll":
        return 1.12
    s0 = CONTENT_W / view_w
    z = min(0.62 * CONTENT_W / max(rect["w"] * s0, 1), 0.42 * CONTENT_H / max(rect["h"] * s0, 1))
    return round(max(1.15, min(Z_MAX, z)), 3)


def clamp_cam(cx: float, cy: float, z: float, page_w: float, page_h: float, view_w: float) -> dict:
    s = CONTENT_W / view_w * z
    half_w, half_h = CONTENT_W / (2 * s), CONTENT_H / (2 * s)
    cx = page_w / 2 if page_w <= 2 * half_w else min(max(cx, half_w), page_w - half_w)
    cy = page_h / 2 if page_h <= 2 * half_h else min(max(cy, half_h), page_h - half_h)
    return {"cx": round(cx, 2), "cy": round(cy, 2), "z": round(z, 3)}


def opening_cam(page_w: float, page_h: float, view_w: float) -> dict:
    return clamp_cam(page_w / 2, 0, 1.0, page_w, page_h, view_w)


# ---------------------------------------------------------------- dựng kế hoạch một cảnh màn hình

def _center(r: dict) -> tuple[float, float]:
    return r["x"] + r["w"] / 2, r["y"] + r["h"] / 2


def beat_times(beats: list[dict], say: str, ws: list[dict], t0: float, t1: float) -> list[float]:
    """Mốc mỗi nhịp: từ khoá `at` trong lời; nhịp không có `at` (hoặc không tìm thấy) rải đều phần còn lại."""
    toks = tokens(say)
    times: list[float | None] = []
    cursor = 0
    for b in beats:
        idx = find_phrase(toks, b["at"], cursor) if b.get("at") else -1
        if idx < 0 and b.get("at"):
            idx = find_phrase(toks, b["at"], 0)
        if idx >= 0 and idx < len(ws):
            times.append(ws[idx]["start"])
            cursor = idx + 1
        else:
            times.append(None)
    # Nhịp thiếu mốc: nội suy tuyến tính giữa hai nhịp có mốc gần nhất (hai đầu là đầu/cuối cảnh).
    known = [(-1, t0 + 0.6)] + [(i, t) for i, t in enumerate(times) if t is not None] + [(len(times), t1 - 0.6)]
    for i, t in enumerate(times):
        if t is None:
            (ia, ta), (ib, tb) = max(k for k in known if k[0] < i), min(k for k in known if k[0] > i)
            times[i] = ta + (tb - ta) * (i - ia) / (ib - ia)
    out, last = [], t0 + 0.6
    for t in times:
        t = max(t, last + 0.7)
        out.append(round(min(t, t1 - 0.35), 3))
        last = t
    return out


def plan_screen(shot: dict, cap: dict, ws: list[dict], t0: float, t1: float) -> dict:
    """Biến nhịp (beats) + vùng đích đã quay thành các đoạn camera, con trỏ, khối tô, nét bút, cú bấm."""
    states = cap["states"]
    view_w = cap["viewport"]["w"]
    beats = [b for b in cap["beats"] if b.get("rect")]
    times = beat_times(beats, shot.get("say", ""), ws, t0, t1)
    st0 = states[0]
    cam = [{"t0": t0, "t1": t0, "state": 0, **opening_cam(st0["w"], st0["h"], view_w)}]
    # Mở cảnh: camera đứng toàn trang rồi đẩy nhẹ vào nửa trên (không có khung chết).
    first = cam[0]
    cam.append({"t0": t0 + 0.05, "t1": t0 + 1.6, "state": 0,
                **clamp_cam(first["cx"], first["cy"] + 40, 1.06, st0["w"], st0["h"], view_w)})
    cursor = [{"t0": t0, "t1": t0, "x": st0["w"] * 0.72, "y": min(st0["h"], 640.0), "state": 0}]
    clicks, spots, marks, labels, swaps = [], [], [], [], []
    for i, (b, t) in enumerate(zip(beats, times)):
        st = states[b["state"]]
        r = b["rect"]
        do = b.get("do", "focus")
        cx, cy = _center(r)
        z = zoom_for(r, view_w, do, b.get("zoom"))
        c = clamp_cam(cx, cy, z, st["w"], st["h"], view_w)
        t_end = times[i + 1] - MOVE if i + 1 < len(times) else t1
        cam.append({"t0": round(t - MOVE, 3), "t1": t, "state": b["state"], **c})
        # Giữ nhịp: đẩy rất chậm thêm 3% để hình không đứng (không có khung chết).
        hold_end = max(t + 0.3, t_end)
        cam.append({"t0": t, "t1": round(hold_end, 3), "state": b["state"],
                    **clamp_cam(c["cx"], c["cy"], min(Z_MAX, c["z"] * 1.03), st["w"], st["h"], view_w)})
        if do != "show":
            # Con trỏ hút vào tâm nút; với dải chữ dài thì dừng ở đầu dải chữ cho dễ đọc.
            px = cx if (b.get("actionable") or r["w"] < 320) else r["x"] + min(60, r["w"] * 0.2)
            cursor.append({"t0": round(t - MOVE * 0.9, 3), "t1": round(t - 0.05, 3), "x": round(px, 1), "y": round(cy, 1),
                           "state": b["state"]})
            label = b.get("label", LABELS.get(do, ""))
            if label:
                labels.append({"t0": t, "t1": round(min(t + 1.6, hold_end), 3), "text": label})
        if do in ("click", "open") or b.get("navigate"):
            clicks.append(round(t + 0.12, 3))
        if b.get("spot", do in ("focus", "click", "point", "mark")):
            spots.append({"t0": t, "t1": round(hold_end, 3), "state": b["state"], "rect": _pad(r, 10)})
        mark = b.get("mark", default_mark(do))
        if mark and mark != "none":
            marks.append({"t0": round(t + 0.12, 3), "t1": round(hold_end, 3), "kind": mark, "state": b["state"],
                          "rect": _pad(r, 8), "seed": i + 1})
        if b.get("navigate") and b["state"] + 1 < len(states):
            swaps.append({"t": round(t + 0.35, 3), "state": b["state"] + 1})
            ns = states[b["state"] + 1]
            cam.append({"t0": round(t + 0.35, 3), "t1": round(t + 0.36, 3), "state": b["state"] + 1,
                        **opening_cam(ns["w"], ns["h"], view_w)})
    return {"cam": cam, "cursor": cursor, "clicks": clicks, "spots": spots, "marks": _limit_marks(marks),
            "labels": labels, "swaps": swaps, "beat_times": times}


TYPE_CPS = 17.0      # tốc độ gõ dựng lại trong cảnh terminal (ký tự/giây)
OUT_MAX = 1.4        # đầu ra dài hơn thì tua nhanh cho vừa 1,4 s
TERM_LINES = 12      # mỗi lệnh hiện tối đa 12 dòng đầu ra (giữ đầu và cuối, giữa ghi "…")
OUT_HOLD = 1.2       # đầu ra cuối phải đứng trên màn hình ít nhất 1,2 s trước khi hết cảnh


def trim_output(lines: list[dict], keep: int = TERM_LINES) -> list[dict]:
    if len(lines) <= keep:
        return lines
    head = keep // 3
    tail = keep - head - 1
    mid = {"t": lines[head]["t"], "text": f"… ({len(lines) - head - tail} dòng)", "elided": True}
    return lines[:head] + [mid] + lines[-tail:]


def plan_terminal(shot: dict, cap: dict, ws: list[dict], t0: float, t1: float) -> dict:
    """Cảnh terminal: lệnh gõ từng ký tự rồi hiện đầu ra THẬT đã ghi lúc quay (mốc thời gian thật, tua nhanh nếu dài).
    Mỗi lệnh có thể có `at` (cụm từ trong lời), `highlight` (regex dòng đầu ra cần khung sáng) và `highlight_at` (cụm từ để bật khung)."""
    specs = shot.get("steps", [])
    toks = tokens(shot.get("say", ""))
    steps, typing, marks = [], [], []
    cursor = t0 + 0.7
    line_no = 0
    for i, st in enumerate(cap["steps"]):
        spec = specs[i] if i < len(specs) else {}
        want = cursor
        if spec.get("at"):
            k = find_phrase(toks, spec["at"])
            if 0 <= k < len(ws):
                want = max(cursor, ws[k]["start"] - 0.15)
        cmd = st["cmd"]
        tdur = min(2.4, max(0.5, len(cmd) / TYPE_CPS))
        ts, te = round(want, 3), round(want + tdur, 3)
        enter = round(te + 0.2, 3)
        out = trim_output(st["out"], spec.get("max_lines", TERM_LINES))
        real = max([o["t"] for o in out] + [0.0])
        rate = max(1.0, real / OUT_MAX)
        out = [{"text": o["text"], "t": round(enter + 0.12 + o["t"] / rate, 3), **({"elided": True} if o.get("elided") else {})}
               for o in out]
        end = out[-1]["t"] if out else enter
        steps.append({"cmd": cmd, "t0": ts, "t1": te, "enter": enter, "out": out, "code": st.get("code", 0),
                      "line0": line_no})
        typing.append({"t0": ts, "t1": te, "text": cmd})
        if spec.get("highlight"):
            for j, o in enumerate(out):
                if re.search(spec["highlight"], o["text"]):
                    t_hl = o["t"] + 0.15
                    k = find_phrase(toks, spec["highlight_at"]) if spec.get("highlight_at") else -1
                    if k >= 0:  # khung sáng bật đúng lúc lời nhắc tới dòng đó
                        t_hl = max(t_hl, ws[k]["start"] - 0.1)
                    marks.append({"t0": round(t_hl, 3), "t1": None, "kind": "frame", "line": line_no + 1 + j})
                    break
        line_no += 1 + len(out)
        cursor = end + 0.5
    for m, nxt in zip(marks, marks[1:] + [None]):
        m["t0"] = min(m["t0"], round(t1 - 0.8, 3))  # lời nhắc quá muộn thì vẫn giữ khung đủ lâu để thấy
        m["t1"] = round(nxt["t0"] if nxt else t1 - 0.25, 3)
    return {"term": {"prompt": shot.get("prompt", "~/demo"), "steps": steps}, "typing": typing, "marks": marks,
            "clicks": [s["enter"] for s in steps], "late": round(max(0.0, cursor - 0.5 + OUT_HOLD - t1), 3)}


def default_mark(do: str) -> str | None:
    """Hiệu ứng nổi bật mặc định theo hành động. Nét bút tay (circle/underline) chỉ dùng khi kịch bản ghi rõ,
    vì người dùng chê nét gạch tay là rẻ tiền (22/10/2026)."""
    return {"focus": "frame", "mark": "frame", "point": "sweep", "click": "pulse", "open": "pulse",
            "type": "frame"}.get(do)


def _pad(r: dict, p: float) -> dict:
    return {"x": r["x"] - p, "y": r["y"] - p, "w": r["w"] + 2 * p, "h": r["h"] + 2 * p}


def _limit_marks(marks: list[dict], max_on_screen: int = 3) -> list[dict]:
    """Chuẩn hình ảnh: tối đa 3 hiệu ứng nổi bật cùng lúc trên màn hình."""
    out = []
    for m in marks:
        live = [x for x in out if x["t1"] > m["t0"]]
        if len(live) >= max_on_screen:
            live[0]["t1"] = m["t0"]
        out.append(m)
    return out


def auto_beats(say: str, cands: list[dict], n: int) -> list[dict]:
    """Tự chọn vùng quan trọng khi kịch bản không chỉ định: ưu tiên ứng viên có chữ trùng lời đọc, rồi theo trọng số."""
    say_keys = {_key(t) for t in tokens(say) if len(_key(t)) > 3}
    scored = []
    for c in cands:
        ck = {_key(t) for t in c.get("text", "").split() if len(_key(t)) > 3}
        overlap = len(ck & say_keys)
        top_bonus = 0.3 if c["rect"]["y"] < 900 else 0.0
        scored.append((c["weight"] + 0.5 * overlap + top_bonus, c))
    scored.sort(key=lambda x: -x[0])
    out, used = [], []
    for _, c in scored:
        r = c["rect"]
        if any(abs(r["y"] - u["y"]) < 60 and abs(r["x"] - u["x"]) < 200 for u in used):
            continue
        do = {"button": "click", "code": "focus", "heading": "focus", "metric": "point", "media": "focus"}.get(c["kind"], "point")
        out.append({"do": do, "rect": r, "auto": True, "text": c.get("text", "")[:60], "actionable": c["kind"] == "button"})
        used.append(r)
        if len(out) >= n:
            break
    out.sort(key=lambda b: (b["rect"]["y"], b["rect"]["x"]))
    return out


# ---------------------------------------------------------------- tiếng động khớp hình

def sfx_cues(plan: dict) -> dict:
    hits = []
    shots = plan["shots"]
    for k, s in enumerate(shots):
        hits.append({"t": round(max(0.0, s["t0"]), 3), "sfx": "whoosh" if k else "impact",
                     "args": {"dur": 0.5} if k else {"kind": "soft", "size": 0.5}, "gain": -9 if k else -6})
        for c in s.get("clicks", []):
            hits.append({"t": c, "sfx": "click", "gain": -6})
        for m in s.get("marks", []):
            hits.append({"t": m["t0"], "sfx": "swish", "gain": -14})
        for ty in s.get("typing", []):
            n = max(1, len(ty["text"]))
            hits.append({"t": ty["t0"], "sfx": "typing", "gain": -12,
                         "args": {"n_keys": n, "rate": round(n / max(ty["t1"] - ty["t0"], 0.1), 2), "kind": "keyboard"}})
    hits.sort(key=lambda h: h["t"])
    dedup = []
    for h in hits:
        if dedup and h["sfx"] == dedup[-1]["sfx"] and h["t"] - dedup[-1]["t"] < 0.25:
            continue
        dedup.append(h)
    drop = shots[1]["t0"] if len(shots) > 1 else 0.0
    return {"_note": "Mốc tiếng động sinh tự động từ plan.json (engine screencast).", "drop": drop,
            "outro": shots[-1]["t0"], "hits": dedup}


def wobble_path(rect: dict, kind: str, seed: int) -> str:
    """Nét bút tay hơi rung (vòng tròn, gạch chân, mũi tên, khung) theo toạ độ trang; cùng seed ra cùng nét.
    Hiệu ứng khung sáng (frame/sweep/lift/pulse) dựng trong stage.js nên không cần path."""
    if kind not in ("circle", "underline", "box", "arrow"):
        return ""
    rnd = _rng(seed)
    x, y, w, h = rect["x"], rect["y"], rect["w"], rect["h"]
    if kind == "underline":
        y0 = y + h + 4
        pts = [(x + w * i / 8, y0 + (rnd() - 0.5) * 5 + math.sin(i * 1.3) * 1.5) for i in range(9)]
        return _smooth(pts)
    if kind == "box":
        pts = [(x - 4 + rnd() * 3, y - 3), (x + w + 3, y - 5 + rnd() * 3), (x + w + 5, y + h + 3), (x - 3, y + h + 5 - rnd() * 3), (x - 6, y + 2)]
        return _smooth(pts)
    if kind == "arrow":
        tx, ty = x - 8, y + h / 2
        sx, sy = tx - 150, ty + 110
        mx, my = tx - 120 + rnd() * 20, ty + 10
        head = f" M {tx - 26:.1f} {ty - 6:.1f} L {tx:.1f} {ty:.1f} L {tx - 18:.1f} {ty + 22:.1f}"
        return f"M {sx:.1f} {sy:.1f} Q {mx:.1f} {my:.1f} {tx:.1f} {ty:.1f}" + head
    # circle: elip hơi lệch, vẽ quá 1,1 vòng như nét tay thật
    cx, cy = x + w / 2, y + h / 2
    rx, ry = w / 2 + 14, h / 2 + 12
    start = -2.2 + rnd() * 0.4
    pts = []
    for i in range(29):
        a = start + i / 28 * math.tau * 1.1
        k = 1 + (rnd() - 0.5) * 0.05 + 0.03 * i / 28
        pts.append((cx + math.cos(a) * rx * k, cy + math.sin(a) * ry * k))
    return _smooth(pts)


def _rng(seed: int):
    state = [seed * 9301 + 49297]

    def nxt() -> float:
        state[0] = (state[0] * 9301 + 49297) % 233280
        return state[0] / 233280
    return nxt


def _smooth(pts: list[tuple[float, float]]) -> str:
    d = f"M {pts[0][0]:.1f} {pts[0][1]:.1f}"
    for i in range(1, len(pts) - 1):
        mx, my = (pts[i][0] + pts[i + 1][0]) / 2, (pts[i][1] + pts[i + 1][1]) / 2
        d += f" Q {pts[i][0]:.1f} {pts[i][1]:.1f} {mx:.1f} {my:.1f}"
    d += f" L {pts[-1][0]:.1f} {pts[-1][1]:.1f}"
    return d
