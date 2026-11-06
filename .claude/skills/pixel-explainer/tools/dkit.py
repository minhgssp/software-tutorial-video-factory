#!/usr/bin/env python3
"""Bộ hàm viết direction cho pixel-explainer. Đạo diễn viết <run>/direction.py dùng module này.

    import sys; sys.path.insert(0, "{{KUDO_HOME}}/skills/pixel-explainer/tools")
    from dkit import *
    init(__file__)                       # run = thư mục chứa direction.py; offset 0,5 giây; dur tự tính

    def scenes(o):                       # o = "doc" (9:16) hoặc "ngang" (16:9)
        t = T("câu lệnh ít khi")         # giây (đã cộng offset) của từ đầu cụm, lấy từ voice_timeline.json
        return [scene(0, [S("robot-ai", v(o, 74, 144), 60, t, 2, "trace")], tin=tin("cut"))]

    write(scenes)                        # ghi work/direction-doc.json và work/direction-ngang.json

Mọi toạ độ là ô lưới logic (1 ô = 6 px): dọc 180×320, ngang 320×180. Xem references/DIRECTION.md.
"""
from __future__ import annotations

import json
import math
import re
import sys
from pathlib import Path

SHARED_LIBRARY = Path("{{KUDO_WORK}}/pixel-explainer/_library")
GRID = {"doc": (180, 320), "ngang": (320, 180)}
# Vùng an toàn và vùng nội dung theo ô lưới (px / 6). Chữ phải nằm trong CONTENT, sprite trong SAFE.
SAFE = {"doc": (15, 28, 158, 243), "ngang": (16, 9, 304, 171)}
CONTENT = {"doc": (15, 28, 158, 215), "ngang": (16, 9, 304, 155)}

# Bảng màu (khớp assets/sprites/core.py).
INK, NAVY, GREY, WHITE = "#1a1c2c", "#29366f", "#94b0c2", "#f4f4f4"
RED, ORANGE, YELLOW, LIME, GREEN, TEAL = "#b13e53", "#ef7d57", "#ffcd75", "#a7f070", "#38b764", "#257179"
BLUE, SKY, CYAN, PURPLE, SKIN, BROWN, NIGHT, SLATE = "#3b5dc9", "#41a6f6", "#73eff7", "#5d275d", "#f2c19e", "#3d2a26", "#20284a", "#333c57"
# Tem cho câu chốt tiêu cực (thất bại, tuyệt vọng, sai): Lb(..., plate="stamp", style=STAMP_BAD). Tem mặc định xanh = tích cực.
STAMP_BAD = {"edge": RED, "color": ORANGE}

_S: dict = {"run": None, "offset": 0.5, "dur": None, "words": [], "norm": [], "libs": []}


def norm(s: str) -> str:
    return re.sub(r"[^\w]", "", s.lower())


def init(direction_file: str, offset: float = 0.5, dur: float | None = None, tail: float = 2.5) -> None:
    """Nạp voice_timeline.json của run. dur mặc định = hết giọng + offset + đuôi, làm tròn lên 0,5 giây."""
    run = Path(direction_file).resolve().parent
    words = json.loads((run / "work/voice_timeline.json").read_text())["words"]
    _S.update(run=run, offset=offset, words=words, norm=[norm(w["text"]) for w in words])
    end = words[-1]["end_ms"] / 1000 + offset + tail
    _S["dur"] = dur or math.ceil(end * 2) / 2
    _S["libs"] = [p for p in (run / "work/library", SHARED_LIBRARY) if p.is_dir()]


def DUR() -> float:
    return _S["dur"]


def word_index(phrase: str, after: float = 0.0) -> int:
    toks = [norm(t) for t in phrase.split()]
    W, N = _S["words"], _S["norm"]
    for i in range(len(N) - len(toks) + 1):
        if N[i:i + len(toks)] == toks and W[i]["start_ms"] / 1000 + _S["offset"] >= after:
            return i
    raise SystemExit(f"không thấy cụm '{phrase}' sau giây {after} trong voice_timeline.json")


def T(phrase: str, after: float = 0.0) -> float:
    """Giây bắt đầu từ đầu tiên của cụm (tìm lần xuất hiện đầu tiên sau `after`)."""
    return round(_S["words"][word_index(phrase, after)]["start_ms"] / 1000 + _S["offset"], 3)


def TE(phrase: str, after: float = 0.0) -> float:
    """Giây kết thúc từ cuối cùng của cụm."""
    i = word_index(phrase, after) + len(phrase.split()) - 1
    return round(_S["words"][i]["end_ms"] / 1000 + _S["offset"], 3)


def v(o: str, doc, ngang):
    """Chọn giá trị theo khung."""
    return doc if o == "doc" else ngang


def manifest(sid: str) -> dict:
    for lib in _S["libs"] or [SHARED_LIBRARY]:
        p = lib / sid / "manifest.json"
        if p.is_file():
            return json.loads(p.read_text())
    raise SystemExit(f"sprite '{sid}' không có trong thư viện (chạy tools/catalog.py để xem danh sách)")


def size(sid: str, scale: int = 1) -> tuple[int, int]:
    w, h = manifest(sid)["size"]
    return w * scale, h * scale


def C(sid: str, x: float, y: float, scale: int = 1) -> tuple[float, float]:
    """Tâm sprite đặt ở (x, y) góc trên trái."""
    w, h = size(sid, scale)
    return (x + w / 2, y + h / 2)


def centered(o: str, sid: str, scale: int = 1, cy: float | None = None) -> tuple[int, int]:
    """Góc trên trái để sprite nằm giữa vùng nội dung theo chiều ngang (và theo cy nếu có)."""
    w, h = size(sid, scale)
    x0, y0, x1, y1 = CONTENT[o]
    cy = (y0 + y1) / 2 if cy is None else cy
    return round((x0 + x1) / 2 - w / 2), round(cy - h / 2)


def lab_rows(size_px: int = 64, lines: int = 1) -> int:
    """Chiều cao tấm nhãn theo ô lưới (khớp labelLayout trong engine)."""
    pad = round(size_px * 0.22 / 6) * 6
    return -(-(lines * size_px + 2 * pad + size_px * 0.12) // 6)


def r3(t):
    return round(float(t), 3)


# ------------------------------------------------------------- item
def S(sid, x, y, at, scale=1, reveal="none", **kw):
    return {"kind": "sprite", "sprite": sid, "x": x, "y": y, "at": r3(at), "scale": scale, "reveal": reveal, **kw}


def P(pid, src, x, y, w, at, reveal="pop", **kw):
    """Ảnh thật: src tương đối với run (vd "assets/tac-gia.jpg"), w tính bằng block; h tự tính theo tỉ lệ ảnh.
    kw: h, crop=[l,t,r,b] (tỉ lệ 0–1), out (giây), dim, move, border (block), color, accent, mosaic (px, cho style pixel)."""
    return {"kind": "photo", "photo": pid, "src": src, "x": x, "y": y, "w": w, "at": r3(at), "reveal": reveal, **kw}


def Lb(text, x, y, at, size=64, plate="dark", **kw):
    if isinstance(text, list):
        text = [[r3(a), b] for a, b in text]
    return {"kind": "label", "text": text, "x": x, "y": y, "at": r3(at), "size": size, "plate": plate, **kw}


def H(words, x, y, size=80, maxw=None, **kw):
    """Tiêu đề lớn. words = [(chữ, giây, nhấn?)…]."""
    it = {"kind": "headline", "x": x, "y": y, "size": size, "at": r3(words[0][1]),
          "words": [{"text": w, "t": r3(t), **({"hl": True} if len(rest) and rest[0] else {})} for w, t, *rest in words], **kw}
    if maxw:
        it["maxw"] = maxw
    return it


def Ar(x0, y0, x1, y1, at, **kw):
    return {"kind": "arrow", "x0": x0, "y0": y0, "x1": x1, "y1": y1, "at": r3(at), **kw}


def Fr(x, y, w, h, at, **kw):
    return {"kind": "frame", "x": x, "y": y, "w": w, "h": h, "at": r3(at), **kw}


def Bu(x, y, at, **kw):
    return {"kind": "burst", "x": x, "y": y, "at": r3(at), **kw}


def Em(x, y, w, h, frm, to, **kw):
    return {"kind": "emit", "x": x, "y": y, "w": w, "h": h, "from": r3(frm), "to": r3(to), **kw}


def Ri(x, y, r0, r1, at, **kw):
    return {"kind": "ring", "x": x, "y": y, "r0": r0, "r1": r1, "at": r3(at), **kw}


def Ba(x, y, segs, at, steps, **kw):
    return {"kind": "bar", "x": x, "y": y, "segs": segs, "at": r3(at), "steps": [[r3(a), b] for a, b in steps], **kw}


def Fl(at, color=YELLOW, frm="top", every=1.2, dur=0.6, length=0.28, **kw):
    """Tia năng lượng chạy dọc một layer (dùng trong layers={...: {"flow": Fl(...)}})."""
    return {"from": frm, "at": r3(at), "every": every, "dur": dur, "len": length, "color": color, **kw}


def out(at, dur=0.4, kind="dither"):
    """Sprite rời cảnh."""
    return {"at": r3(at), "dur": dur, "kind": kind}


# ------------------------------------------------------------- cảnh
def tin(kind="cut", dur=None, dir=None):
    d = {"kind": kind}
    if kind != "cut":
        d["dur"] = dur if dur is not None else {"wipe": 0.45, "whip": 0.35, "pixelate": 0.5, "dither": 0.5, "block": 0.5}.get(kind, 0.4)
    if dir:
        d["dir"] = dir
    return d


def scene(frm, items, tin_=None, **kw):
    """Một cảnh bắt đầu từ giây frm. kw: punch, shake, flash, bg, cam, zmax, drift, iris, noSubs, camInherit, fx."""
    sc = {"from": r3(frm), "items": items, **kw}
    if tin_ is not None:
        sc["tin"] = tin_
    if "tin" in kw:
        sc["tin"] = kw["tin"]
    for key in ("punch", "shake", "flash", "bg"):
        if key in sc:
            sc[key] = [[r3(e[0]), *e[1:]] for e in sc[key]]
    return sc


def write(scenes_fn, orients=("doc", "ngang"), cast: dict | None = None) -> None:
    """cast = {"Tên|Bí danh": ["sprite", "sprite#layer"], …}: mỗi tên riêng trong lời và vật đại diện cho nó.
    validate.py bắt lỗi khi lời nhắc tên mà vật của tên đó không hiện trong khoảng [−0,3; +1,2] giây."""
    run = _S["run"]
    if run is None:
        raise SystemExit("gọi init(__file__) trước")
    for o in orients:
        sc = sorted(scenes_fn(o), key=lambda s: s["from"])
        data = {"orient": o, "offset": _S["offset"], "dur": _S["dur"], "scenes": sc}
        if cast:
            data["cast"] = cast
        path = run / f"work/direction-{o}.json"
        path.write_text(json.dumps(data, ensure_ascii=False, indent=1) + "\n")
        n = sum(len(s["items"]) for s in sc)
        print(f"{path}  {len(sc)} cảnh, {n} item, dur {_S['dur']}")


__all__ = [k for k in dir(sys.modules[__name__]) if not k.startswith("_") and k not in ("annotations", "json", "math", "re", "sys", "Path")]
