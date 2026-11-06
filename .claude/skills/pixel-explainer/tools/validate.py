#!/usr/bin/env python3
"""Soát direction JSON trước khi dựng. Bắt lỗi gõ, sai luật khung, khoảng trống hình, hiệu ứng rải cho có.

Dùng: python3 validate.py <run> [--orient doc|ngang] [--json]

Đọc <run>/work/direction-{doc,ngang}.json và voice_timeline.json. Mức:
  LỖI     — phải sửa trước khi build (engine sẽ vẽ sai hoặc vi phạm cổng 3, 5, 7).
  CẢNH BÁO — được phép giữ nếu có lý do; ghi lý do vào QA.md.
Thoát mã 1 khi còn LỖI.
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

SHARED_LIBRARY = Path("{{KUDO_WORK}}/pixel-explainer/_library")
GRID = {"doc": (180, 320), "ngang": (320, 180)}
SAFE = {"doc": (15, 28, 158, 243), "ngang": (16, 9, 304, 171)}
CONTENT = {"doc": (15, 28, 158, 215), "ngang": (16, 9, 304, 155)}
GAP_ERR = 5.0  # giây không có sự kiện hình mới → LỖI
IMG_GAP_ERR = 4.0  # giây chỉ đổi chữ (nhãn, headline, camera, hiệu ứng) mà không có vật nào đổi → LỖI
COMMON_WORDS = {"sau", "con", "cho", "anh", "em", "khi", "neu", "nhung", "hay", "the", "tai", "sao", "bao", "chi", "nhu",
                "vay", "may", "nay", "kia", "mot", "hai", "ba", "bon", "nam", "sau", "tam", "chin", "muoi", "tui", "toi",
                "ban", "minh", "ong", "chung", "cac", "nhieu", "mai", "luon", "chua", "cung", "roi", "xong", "thi", "con",
                "nhanh", "cham", "dung", "sai", "hon", "kem", "gan", "xa", "trong", "ngoai", "tren", "duoi", "giua",
                "theo", "nhu", "ngay", "hom", "dem", "sang", "chieu", "toan", "tung", "moi", "rat", "qua", "lam"}
CAST_WIN = (0.3, 1.2)  # tên riêng được nói ở giây t: vật của nó phải hiện lúc nào đó trong [t − 0,3; t + 1,2]
LABEL_IMG_WIN = (0.6, 1.0)  # hình mới tính là đi cùng nhãn nếu đến trước nhãn ≤ 0,6 giây hoặc sau ≤ 1,0 giây
LABEL_LONE_MAX, LABEL_LONE_FRAC = 2, 0.05

TOP_KEYS = {"orient", "offset", "dur", "scenes", "cast"}
SCENE_KEYS = {"from", "items", "tin", "punch", "shake", "flash", "bg", "cam", "zmax", "drift", "camInherit",
              "noSubs", "iris", "fx"}
COMMON = {"kind", "at", "cam", "fx"}
FIELDS = {
    "sprite": {"sprite", "x", "y", "scale", "reveal", "rdur", "flip", "frame", "anim", "phase", "layers", "spot",
               "move", "bob", "dim", "out", "over"},
    "label": {"text", "x", "y", "size", "plate", "align", "color", "count", "cps", "type", "dim", "lh", "out",
              "strike", "style", "tail", "over"},
    "headline": {"words", "x", "y", "size", "maxw", "live", "font", "over"},
    "arrow": {"x0", "y0", "x1", "y1", "color", "head", "march", "out", "rdur", "th"},
    "frame": {"x", "y", "w", "h", "color", "out", "th"},
    "burst": {"x", "y", "type", "n", "speed", "life", "drag", "grav", "colors", "a0", "a1", "seed"},
    "emit": {"x", "y", "w", "h", "from", "to", "type", "rate", "life", "vx", "vy", "jx", "jy", "grav", "colors",
             "alpha", "seed"},
    "ring": {"x", "y", "r0", "r1", "color", "dur", "every", "until", "faint"},
    "bar": {"x", "y", "segs", "steps", "align", "color", "gap", "h", "sw", "dim", "out", "blinkEmpty"},
    "photo": {"photo", "src", "x", "y", "w", "h", "crop", "reveal", "rdur", "move", "dim", "out", "border", "color",
              "accent", "mosaic"},
}
REQUIRED = {
    "sprite": ("sprite", "x", "y"), "label": ("text", "x", "y", "at"), "headline": ("words", "x", "y", "size"),
    "arrow": ("x0", "y0", "x1", "y1", "at"), "frame": ("x", "y", "w", "h", "at"), "burst": ("x", "y", "at"),
    "emit": ("x", "y", "w", "h", "from", "to"), "ring": ("x", "y", "r0", "r1", "at"),
    "bar": ("x", "y", "segs", "at", "steps"), "photo": ("photo", "src", "x", "y", "w", "at"),
}
ENUM = {
    "reveal": {"none", "pop", "trace", "bloom", "scan", "dither"},
    "plate": {"dark", "accent", "bubble", "stamp", "warn", "outline"},
    "burst.type": {"spark", "star", "confetti", "dust"},
    "emit.type": {"rain", "sparkle", "dot"},
    "tail": {"tl", "tr", "bl", "br"},
    "align": {"l", "r", "c", None},
    "tin": {"cut", "wipe", "whip", "pixelate", "dither", "block"},
    "out.kind": {"dither", "trace", "scan", "bloom", "none"},
}
LAYER_KEYS = {"at", "reveal", "rdur", "hide", "out", "flow"}
FLOW_KEYS = {"from", "at", "every", "dur", "len", "color", "alpha", "until", "head", "fx", "fy"}
SPOT_KEYS = {"node", "from", "to", "keep"}
STRONG = ("punch", "shake", "flash", "stamp", "burst", "tin")


def norm(s: str) -> str:
    return re.sub(r"[^\w]", "", s.lower())


class Report:
    def __init__(self, o: str):
        self.o, self.err, self.warn = o, [], []

    def e(self, where: str, msg: str) -> None:
        self.err.append(f"[{self.o}] {where}: {msg}")

    def w(self, where: str, msg: str) -> None:
        self.warn.append(f"[{self.o}] {where}: {msg}")


def num(v) -> bool:
    return isinstance(v, (int, float)) and not isinstance(v, bool)


def load_manifest(libs: list[Path], sid: str) -> dict | None:
    for lib in libs:
        p = lib / sid / "manifest.json"
        if p.is_file():
            return json.loads(p.read_text())
    return None


def text_w(text: str, size: int) -> float:
    """Ước lượng bề rộng px của một dòng VT323 (≈0,5 em mỗi ký tự; đoạn trong backtick dùng mono ≈0,6 em × 0,74)."""
    w = 0.0
    for k, part in enumerate(text.split("`")):
        w += len(part) * (size * 0.6 * 0.74 if k % 2 else size * 0.5)
    return w


def check(run: Path, o: str, words: list[dict], libs: list[Path]) -> tuple[Report, dict]:
    R = Report(o)
    path = run / f"work/direction-{o}.json"
    if not path.is_file():
        R.e("file", f"thiếu {path}")
        return R, {}
    try:
        d = json.loads(path.read_text())
    except json.JSONDecodeError as exc:
        R.e("file", f"JSON hỏng: {exc}")
        return R, {}
    GW, GH = GRID[o]
    SA, CO = SAFE[o], CONTENT[o]
    for k in set(d) - TOP_KEYS:
        R.w("gốc", f"trường lạ '{k}'")
    if d.get("orient") != o:
        R.e("gốc", f"orient = {d.get('orient')!r}, phải là '{o}'")
    dur, off = d.get("dur"), d.get("offset", 0.5)
    if not num(dur) or dur <= 0:
        R.e("gốc", "dur phải là số giây > 0")
        return R, {}
    last_word = words[-1]["end_ms"] / 1000 + off if words else 0
    if dur < last_word + 1:
        R.e("gốc", f"dur {dur} ngắn hơn hết giọng ({last_word:.2f}) + 1 giây")
    word_starts = [w["start_ms"] / 1000 + off for w in words]
    scenes = d.get("scenes") or []
    if not scenes:
        R.e("gốc", "không có cảnh")
        return R, {}
    if scenes[0].get("from") != 0:
        R.e("cảnh 0", "cảnh đầu phải bắt đầu từ 0")
    check_hook(R, scenes[0], GRID[o])
    events: list[tuple[float, str]] = []  # (giây, mô tả) mọi sự kiện hình mới
    strong: list[tuple[float, str]] = []
    tins: list[str] = []
    sprite_roles: dict[str, int] = {}
    shown: list[tuple] = []  # (sprite, từ giây, tới giây, layers) — cho cổng cast
    stats = {"scenes": len(scenes), "items": 0, "kinds": {}, "tin": {}, "plates": {}, "sizes": {},
             "life": {"idle": 0, "bob": 0, "move": 0, "anim": 0, "flow": 0, "emit": 0}}

    for si, sc in enumerate(scenes):
        W = f"cảnh {si} ({sc.get('from')}s)"
        t0 = sc.get("from")
        t1 = scenes[si + 1].get("from") if si + 1 < len(scenes) else dur
        if not num(t0):
            R.e(W, "from phải là số")
            continue
        if not num(t1) or t1 <= t0:
            R.e(W, f"cảnh sau bắt đầu ở {t1}, phải lớn hơn {t0} (cảnh phải tăng dần)")
            t1 = t0 + 0.01
        if t1 - t0 < 1.2:
            R.w(W, f"cảnh chỉ dài {t1 - t0:.2f} giây — người xem chưa kịp đọc")
        for k in set(sc) - SCENE_KEYS:
            R.w(W, f"trường cảnh lạ '{k}' (gõ sai?)")
        events.append((t0, f"{W} bắt đầu"))
        tin = sc.get("tin")
        if tin is not None:
            if not isinstance(tin, dict) or tin.get("kind") not in ENUM["tin"]:
                R.e(W, f"tin.kind phải thuộc {sorted(ENUM['tin'])}")
            else:
                if si:
                    tins.append(tin["kind"])
                    if tin["kind"] != "cut":
                        strong.append((t0, "tin"))
                if tin.get("dir") not in (None, "left", "right", "up", "down"):
                    R.e(W, "tin.dir phải là left/right/up/down")
                if tin["kind"] != "cut" and not (0.2 <= tin.get("dur", 0.4) <= 0.9):
                    R.w(W, "tin.dur nên trong 0,2–0,9 giây")
        elif si:
            tins.append("cut")
        for key, n in (("punch", 3), ("shake", 3), ("flash", 4), ("bg", 3)):
            for ev in sc.get(key, []) or []:
                if not isinstance(ev, list) or len(ev) < n or not num(ev[0]):
                    R.e(W, f"{key} phải là danh sách [[giây, …]] với ít nhất {n} phần tử mỗi mục")
                    continue
                if not (t0 <= ev[0] < t1):
                    R.e(W, f"{key} ở {ev[0]} nằm ngoài cảnh [{t0}, {t1})")
                events.append((ev[0], key))
                if key in ("punch", "shake", "flash"):
                    strong.append((ev[0], key))
                if key == "punch" and not (0.02 <= ev[1] <= 0.12):
                    R.w(W, f"punch amt {ev[1]} — nên 0,03–0,10 (đập nhẹ, chữ vẫn đọc được)")
                if key == "shake" and ev[1] > 20:
                    R.w(W, f"shake amp {ev[1]} > 20 — rung mạnh làm nhoè chữ")
        cam = sc.get("cam")
        if cam not in (None, "none"):
            if not isinstance(cam, list) or any(not isinstance(k, list) or len(k) != 5 for k in cam):
                R.e(W, "cam phải bỏ trống, 'none' hoặc [[t0, t1, z, fx, fy], …]")
            else:
                for k in cam:
                    if k[1] <= k[0]:
                        R.e(W, f"cam {k}: t1 phải > t0")
                    if not (1 <= k[2] <= 2.2):
                        R.w(W, f"cam z {k[2]} ngoài 1–2,2")
                    events.append((k[0], "cam"))
        iris = sc.get("iris")
        heads = [it for it in sc.get("items", []) if it.get("kind") == "headline"]
        if iris:
            if not num(iris.get("at")) or not num(iris.get("dur")):
                R.e(W, "iris cần at và dur")
            elif "word" in iris:
                if not heads or iris["word"] >= len(heads[0].get("words", [])):
                    R.e(W, "iris.word phải là chỉ số từ của headline đầu tiên trong cảnh")
            elif not (num(iris.get("cx")) and num(iris.get("cy"))):
                R.e(W, "iris cần word hoặc cx, cy")
            if num(iris.get("at")):
                events.append((iris["at"], "iris"))

        boxes: list[tuple] = []
        outlines: list[tuple] = []
        alive = False  # cảnh có vật chuyển động tự thân (idle, bob, move, anim, flow, emit, ring lặp)
        for ii, it in enumerate(sc.get("items", [])):
            kind = it.get("kind")
            Wi = f"{W} item {ii} ({kind}{':' + it['sprite'] if kind == 'sprite' and 'sprite' in it else ''})"
            if kind not in FIELDS:
                R.e(Wi, f"kind phải thuộc {sorted(FIELDS)}")
                continue
            stats["items"] += 1
            stats["kinds"][kind] = stats["kinds"].get(kind, 0) + 1
            for k in set(it) - FIELDS[kind] - COMMON:
                R.w(Wi, f"trường lạ '{k}' — engine bỏ qua (gõ sai?)")
            for k in REQUIRED[kind]:
                if k not in it:
                    R.e(Wi, f"thiếu '{k}'")
            at = it.get("from") if kind == "emit" else it.get("at", t0)
            if not num(at):
                R.e(Wi, "at phải là số giây")
                continue
            if at >= t1:
                R.e(Wi, f"at {at} ≥ hết cảnh {t1} — item không bao giờ hiện")
            elif at < t0 - 0.01 and not sc.get("camInherit"):
                R.w(Wi, f"at {at} trước khi cảnh bắt đầu ({t0}) — hiệu ứng xuất hiện đã chạy xong khi cảnh hiện")
            if at >= t0 - 0.01:
                events.append((at, kind))
            out = it.get("out")
            if out is not None:
                ot = out.get("at") if isinstance(out, dict) else out
                if kind == "sprite" and not isinstance(out, dict):
                    R.e(Wi, "out của sprite phải là {at, dur, kind}")
                elif kind != "sprite" and isinstance(out, dict):
                    R.e(Wi, f"out của {kind} phải là một số giây")
                elif not num(ot) or ot <= at:
                    R.e(Wi, "out phải sau at")
                elif isinstance(out, dict) and out.get("kind", "dither") not in ENUM["out.kind"]:
                    R.e(Wi, f"out.kind phải thuộc {sorted(ENUM['out.kind'])}")
                elif num(ot) and t0 <= ot < t1:
                    events.append((ot, f"{kind} rời"))
            for k in ("x", "y", "x0", "y0", "x1", "y1", "w", "h"):
                if k in it and not num(it[k]):
                    R.e(Wi, f"{k} phải là số (ô lưới)")

            if kind == "photo":
                ot = it.get("out")
                shown.append(("photo:" + str(it.get("photo")), at, min(ot, t1) if num(ot) else t1, {}))
                if not (run / str(it.get("src", ""))).is_file():
                    R.w(Wi, f"không thấy file ảnh src '{it.get('src')}' (tương đối với run)")
            if kind == "sprite":
                m = load_manifest(libs, it.get("sprite", ""))
                if m is None:
                    R.e(Wi, f"sprite '{it.get('sprite')}' không có trong thư viện (xem tools/catalog.py)")
                    continue
                sprite_roles[m["role"]] = sprite_roles.get(m["role"], 0) + 1
                if it.get("reveal", "none") not in ENUM["reveal"]:
                    R.e(Wi, f"reveal phải thuộc {sorted(ENUM['reveal'])}")
                if it.get("reveal") == "bloom":
                    strong.append((at, "burst"))
                sc_ = it.get("scale", 1)
                if not isinstance(sc_, int) or sc_ < 1:
                    R.e(Wi, "scale phải là số nguyên ≥ 1 (pixel art không co giãn lẻ)")
                    sc_ = 1
                w, h = m["size"][0] * sc_, m["size"][1] * sc_
                # Vị trí đứng yên cuối cùng (sau move) phải nằm trên màn hình; vượt SAFE chỉ cảnh báo vì hộp
                # manifest gồm cả viền trong suốt — qa.py đo hộp thật sau camera (__layoutCheck) mới là phán quyết.
                mv = [m_ for m_ in it.get("move", []) or [] if isinstance(m_, list) and len(m_) == 4]
                x, y = (mv[-1][2], mv[-1][3]) if mv else (it.get("x"), it.get("y"))
                if num(x) and num(y):
                    boxes.append((x, y, x + w, y + h))
                    if x + w <= 0 or y + h <= 0 or x >= GW or y >= GH or x < -w / 3 or y < -h / 3 or x + w > GW + w / 3 or y + h > GH + h / 3:
                        R.e(Wi, f"sprite đứng ở ({x},{y})–({x + w},{y + h}) quá nửa ngoài màn hình {GW}×{GH}")
                    elif x < SA[0] - 2 or y < SA[1] - 2 or x + w > SA[2] + 2 or y + h > SA[3] + 2:
                        R.w(Wi, f"hộp sprite ({x},{y})–({x + w},{y + h}) vượt SAFE {SA} — kiểm lại bằng qa.py")
                layers = set(m["layers"])
                tags = {t["name"] for t in m.get("tags", [])}
                Ls = it.get("layers") or {}
                end = out.get("at") if isinstance(out, dict) and num(out.get("at")) else t1
                shown.append((it.get("sprite"), at, min(end, t1), Ls))
                flows = any(isinstance(c, dict) and c.get("flow") for c in Ls.values())
                for k, on in (("idle", "idle" in tags), ("bob", it.get("bob")), ("move", it.get("move")),
                              ("anim", it.get("anim")), ("flow", flows)):
                    if on:
                        stats["life"][k] += 1
                        alive = True
                for name, cfg in Ls.items():
                    if name not in layers:
                        R.e(Wi, f"layer '{name}' không có; sprite có {sorted(layers)}")
                    if not isinstance(cfg, dict):
                        R.e(Wi, f"layers['{name}'] phải là object")
                        continue
                    for k in set(cfg) - LAYER_KEYS:
                        R.w(Wi, f"layers['{name}'] trường lạ '{k}'")
                    if cfg.get("reveal", "none") not in ENUM["reveal"]:
                        R.e(Wi, f"layers['{name}'].reveal sai")
                    if num(cfg.get("at")):
                        if not (t0 - 0.01 <= cfg["at"] < t1):
                            R.e(Wi, f"layers['{name}'].at {cfg['at']} ngoài cảnh")
                        events.append((cfg["at"], f"layer {name}"))
                    for F in ([cfg["flow"]] if isinstance(cfg.get("flow"), dict) else cfg.get("flow") or []):
                        for k in set(F) - FLOW_KEYS:
                            R.w(Wi, f"layers['{name}'].flow trường lạ '{k}'")
                if m["role"] == "model" and "base" in layers and Ls and "base" not in Ls:
                    R.e(Wi, "model có layer 'base' mà layers{} không khai 'base' → nền hiện ngay ở at của item; "
                              "khai rõ, ví dụ \"base\": {\"at\": …, \"reveal\": \"trace\"}")
                nodes = {n[5:] for n in layers if n.startswith("node:")}
                edges = {n[5:] for n in layers if n.startswith("edge:")}
                for sp in it.get("spot", []) or []:
                    for k in set(sp) - SPOT_KEYS:
                        R.w(Wi, f"spot trường lạ '{k}'")
                    if sp.get("node") not in nodes:
                        R.e(Wi, f"spot.node '{sp.get('node')}' không có; node: {sorted(nodes)}")
                    if not (num(sp.get("from")) and num(sp.get("to")) and sp["to"] > sp["from"]):
                        R.e(Wi, "spot cần from < to")
                    else:
                        events.append((sp["from"], "spot"))
                    for k in sp.get("keep", []) or []:
                        if k not in nodes | edges:
                            R.e(Wi, f"spot.keep '{k}' không phải node/edge của sprite")
                for a in it.get("anim", []) or []:
                    if not (isinstance(a, list) and len(a) == 2 and num(a[0])):
                        R.e(Wi, "anim phải là [[giây, tag], …]")
                    elif a[1] not in tags:
                        R.e(Wi, f"tag '{a[1]}' không có; sprite có {sorted(tags) or 'không tag nào'}")
                    else:
                        events.append((a[0], f"anim {a[1]}"))
                for mv in it.get("move", []) or []:
                    if not (isinstance(mv, list) and len(mv) == 4 and mv[1] > mv[0]):
                        R.e(Wi, "move phải là [[t0, t1, x1, y1], …] với t1 > t0")
                    else:
                        events.append((mv[0], "move"))
                if it.get("frame") is not None and not (0 <= it["frame"] < m.get("frames", 1)):
                    R.e(Wi, f"frame {it['frame']} ngoài 0–{m.get('frames', 1) - 1}")

            elif kind in ("label", "headline"):
                size = it.get("size", 64)
                stats["sizes"][size] = stats["sizes"].get(size, 0) + 1
                if size < 64:
                    R.e(Wi, f"cỡ chữ {size} < 64 px (cổng 3)")
                x, y = it.get("x"), it.get("y")
                if num(x) and num(y) and not (CO[0] <= x <= CO[2] and CO[1] <= y <= CO[3]):
                    R.e(Wi, f"điểm neo ({x},{y}) ngoài CONTENT {CO}")
            if kind == "label":
                plate = it.get("plate", "dark")
                stats["plates"][plate] = stats["plates"].get(plate, 0) + 1
                if plate not in ENUM["plate"]:
                    R.e(Wi, f"plate phải thuộc {sorted(ENUM['plate'])}")
                if plate == "stamp":
                    strong.append((at, "stamp"))
                if it.get("tail") is not None and it["tail"] not in ENUM["tail"]:
                    R.e(Wi, "tail phải là tl/tr/bl/br")
                if it.get("align", "c") not in ENUM["align"]:
                    R.e(Wi, "align phải là l/r/c")
                text = it.get("text")
                variants = []
                if isinstance(text, list):
                    ts = [p[0] for p in text if isinstance(p, list) and len(p) == 2]
                    if len(ts) != len(text) or ts != sorted(ts):
                        R.e(Wi, "text dạng danh sách phải là [[giây, chuỗi], …] tăng dần")
                    for p in text:
                        if isinstance(p, list) and len(p) == 2 and num(p[0]):
                            variants.append(str(p[1]))
                            if t0 <= p[0] < t1:
                                events.append((p[0], "nhãn đổi chữ"))
                elif isinstance(text, str):
                    variants.append(text)
                else:
                    R.e(Wi, "text phải là chuỗi hoặc [[giây, chuỗi], …]")
                c = it.get("count")
                if c is not None:
                    if not all(num(c.get(k)) for k in ("from", "to", "t0", "t1")):
                        R.e(Wi, "count cần from, to, t0, t1")
                    if not any("#" in v for v in variants):
                        R.e(Wi, "count cần dấu # trong text để thay số")
                if it.get("strike") is not None and not num((it["strike"] or {}).get("at")):
                    R.e(Wi, "strike cần {at, dur?, color?}")
                size = it.get("size", 64)
                pad = 0 if plate == "outline" else round(size * 0.4 / 6) * 6
                wmax = max((text_w(ln, size) for v in variants for ln in v.split("\n")), default=0) + 2 * pad
                if wmax > (CO[2] - CO[0]) * 6 + 12:
                    R.w(Wi, f"nhãn ước tính rộng {wmax:.0f}px > vùng nội dung {(CO[2] - CO[0]) * 6}px — xuống dòng bằng \\n")
                if plate == "outline":
                    outlines.append((Wi, x, y))
            elif kind == "headline":
                ws = it.get("words") or []
                if not ws:
                    R.e(Wi, "words rỗng")
                prev = -1
                for w in ws:
                    if not isinstance(w, dict) or "text" not in w or not num(w.get("t")):
                        R.e(Wi, "mỗi từ cần {text, t, hl?}")
                        continue
                    if w["t"] < prev:
                        R.e(Wi, "t của các từ phải tăng dần")
                    prev = w["t"]
                    if t0 <= w["t"] < t1:
                        events.append((w["t"], "headline"))
                total = sum(len(w.get("text", "")) for w in ws) * it.get("size", 80) * 0.62
                if it.get("font", "bvp") not in ("bvp", "vt"):
                    R.e(Wi, "font phải là 'bvp' (mặc định) hoặc 'vt'")
                if "maxw" not in it and total > (CO[2] - CO[0]) * 6:
                    R.e(Wi, "headline dài hơn vùng nội dung mà không có maxw (px) để xuống dòng")
            elif kind == "burst":
                if it.get("type", "spark") not in ENUM["burst.type"]:
                    R.e(Wi, f"type phải thuộc {sorted(ENUM['burst.type'])}")
                strong.append((at, "burst"))
            elif kind == "emit":
                stats["life"]["emit"] += 1
                alive = True
                if it.get("type", "dot") not in ENUM["emit.type"]:
                    R.e(Wi, f"type phải thuộc {sorted(ENUM['emit.type'])}")
                if num(it.get("to")) and it["to"] <= at:
                    R.e(Wi, "emit cần from < to")
            elif kind == "bar":
                for s in it.get("steps", []):
                    if not (isinstance(s, list) and len(s) == 2 and num(s[0])):
                        R.e(Wi, "steps phải là [[giây, số ô sáng], …]")
                    elif s[1] > it.get("segs", 0):
                        R.e(Wi, f"steps {s} vượt segs {it.get('segs')}")
                    elif t0 <= s[0] < t1:
                        events.append((s[0], "bar"))
            elif kind == "ring":
                alive = alive or num(it.get("every"))
                if num(it.get("every")) and not num(it.get("until")):
                    R.w(Wi, "ring có every mà không có until — chỉ nở một lần")
            elif kind == "arrow":
                for k in ("x0", "x1"):
                    if num(it.get(k)) and not (SA[0] <= it[k] <= SA[2]):
                        R.e(Wi, f"{k} ngoài SAFE")
                for k in ("y0", "y1"):
                    if num(it.get(k)) and not (SA[1] <= it[k] <= SA[3]):
                        R.e(Wi, f"{k} ngoài SAFE")
            elif kind == "frame":
                if all(num(it.get(k)) for k in "xywh"):
                    x, y, w, h = (it[k] for k in "xywh")
                    if x < SA[0] or y < SA[1] or x + w > SA[2] or y + h > SA[3]:
                        R.e(Wi, "frame ra ngoài SAFE")
        for Wi, x, y in outlines:
            if num(x) and num(y) and any(b[0] <= x <= b[2] and b[1] <= y <= b[3] for b in boxes):
                R.w(Wi, "chữ trần (plate 'outline') neo trên một sprite — dễ chìm, đổi sang 'dark' hoặc dời ra nền trống")
        if t1 - t0 >= 3.5 and not alive:
            R.w(W, f"cảnh {t1 - t0:.1f} giây không có vật sống (idle/bob/move/anim/flow/emit) — vật đứng im như ảnh dán (MOTION.md §1.4)")

    # ---------------------------------------------------------- toàn video
    for k in tins:
        stats["tin"][k] = stats["tin"].get(k, 0) + 1
    if tins:
        top, n = max(stats["tin"].items(), key=lambda kv: kv[1])
        if n / len(tins) > 0.5:
            R.w("chuyển cảnh", f"'{top}' chiếm {n}/{len(tins)} — chọn kiểu theo vai cảnh (MOTION.md §2)")
    ts = sorted({round(t, 2) for t, _ in events if 0 <= t <= dur})
    ts_full = [0.0] + ts + [dur]
    gaps = []
    # Chuẩn skill chặt hơn spec (cổng 5 cho tới 8 giây): video mẫu đạt tối đa 3,3 giây, nên > 5 giây là LỖI.
    for a, b in zip(ts_full, ts_full[1:]):
        if b - a > GAP_ERR:
            R.e("nhịp hình", f"{a:.2f}–{b:.2f}s: {b - a:.1f} giây không có sự kiện hình mới (chuẩn skill ≤ {GAP_ERR:g}; spec cổng 5 ≤ 8)")
        elif b - a > 3:
            gaps.append((a, b))
    for a, b in gaps:
        R.w("nhịp hình", f"{a:.2f}–{b:.2f}s: {b - a:.1f} giây chỉ có chuyển động nền — thêm nhịp nếu lời đang sang ý")
    # Hiệu ứng mạnh phải dính vào đầu một từ (±0,35 giây), không rải đều theo đồng hồ.
    for t, k in strong:
        if k in ("punch", "shake", "stamp") and word_starts and min(abs(t - s) for s in word_starts) > 0.35:
            R.w("nhấn", f"{k} ở {t:.2f}s không trùng đầu từ nào (±0,35 giây) — nhấn phải gắn vào chữ được nói")
    st = sorted(t for t, _ in strong)
    i, flagged = 0, -9.0
    for j, t in enumerate(st):
        while st[i] < t - 2:
            i += 1
        if j - i + 1 >= 5 and t - flagged > 2:
            R.w("súp hiệu ứng", f"{j - i + 1} hiệu ứng mạnh trong 2 giây quanh {t:.2f}s — giữ 1 điểm nhấn chính")
            flagged = t
    # Ý đổi thì hình đổi: chữ đổi liên tục trên cùng một hình là trình chiếu, không phải giải thích.
    def is_img(desc: str) -> bool:
        return (desc in ("sprite", "photo", "arrow", "bar", "frame", "move", "spot") or desc.endswith((" bắt đầu", " rời"))
                and not desc.startswith(("label", "headline"))) or desc.startswith(("layer ", "anim "))
    # Chỉ tính tới hết giọng: khung giữ sau từ cuối là đuôi kết, không phải cảnh đứng.
    voice_end = words[-1]["end_ms"] / 1000 + off if words else dur
    its = [0.0] + sorted({round(t, 2) for t, k in events if 0 <= t <= dur and is_img(k)}) + [dur]
    for a, b in zip(its, its[1:]):
        if min(b, voice_end) - a > IMG_GAP_ERR:
            R.e("hình đứng", f"{a:.2f}–{min(b, voice_end):.2f}s: {min(b, voice_end) - a:.1f} giây không vật nào hiện, rời, đổi layer, spot, anim hay move "
                f"(chỉ đổi chữ hoặc hiệu ứng; tối đa {IMG_GAP_ERR:g}) — ý mới cần hình mới (CRAFT.md §7)")
    stats["max_img_gap"] = round(max(min(b, voice_end) - a for a, b in zip(its, its[1:])), 2)
    # Nhãn mới phải đi cùng hình mới: nhãn hiện (hoặc đổi chữ) mà quanh đó không vật nào hiện, rời, đổi layer, spot,
    # anim, move là chữ dán lên hình cũ — người xem đọc mà không thấy gì đổi.
    img_t = sorted({t for t, k in events if is_img(k)})
    near = lambda t: any(-LABEL_IMG_WIN[0] <= x - t <= LABEL_IMG_WIN[1] for x in img_t)
    lone, n_lab = [], 0
    for sc in d.get("scenes") or []:
        for it in sc.get("items") or []:
            if not isinstance(it, dict) or it.get("kind") != "label":
                continue
            text = it.get("text")
            pts = [(it.get("at", sc.get("from")), text)] if isinstance(text, str) else \
                [tuple(p) for p in text if isinstance(p, list) and len(p) == 2] if isinstance(text, list) else []
            for t, txt in pts:
                if num(t):
                    n_lab += 1
                    if not near(t):
                        lone.append(f"{t:.2f}s '{str(txt).replace(chr(10), ' ')[:28]}'")
    if len(lone) > max(LABEL_LONE_MAX, LABEL_LONE_FRAC * n_lab):
        R.e("nhãn không hình", f"{len(lone)}/{n_lab} lần nhãn hiện hoặc đổi chữ mà trong [−{LABEL_IMG_WIN[0]:g}; +{LABEL_IMG_WIN[1]:g}] giây "
            f"không có vật nào hiện, rời, đổi layer, spot, anim hay move (tối đa {LABEL_LONE_MAX} hoặc "
            f"{round(LABEL_LONE_FRAC * 100)}%) — cho vật lời đang nói tới hiện cùng nhãn (CRAFT.md §7): {lone[:8]}")
    stats["label_lone"] = f"{len(lone)}/{n_lab}"
    check_cast(R, d, words, off, shown, stats)
    stats["roles"] = sprite_roles
    stats["events"] = len(ts)
    stats["max_gap"] = round(max(b - a for a, b in zip(ts_full, ts_full[1:])), 2)
    return R, stats


HOOK_SHOW, HOOK_HIT, HOOK_AREA = 0.15, 0.6, 0.12


def check_hook(R: Report, sc: dict, grid: tuple) -> None:
    """Visual hook (references/HOOK.md): khung 0 giây đã có hình lớn, và có một cú nhấn (punch/flash/shake/burst/tem)
    trước 0,6 giây — người lướt quyết định ở mấy khung đầu, không chờ giọng vào (offset 0,5)."""
    items = [it for it in sc.get("items") or [] if isinstance(it, dict)]
    early = [it for it in items if it.get("kind") in ("sprite", "photo", "headline") and num(it.get("at", 0))
             and it.get("at", 0) <= HOOK_SHOW]
    if not early:
        R.e("hook", f"khung mở đầu trống: không sprite/photo/headline nào hiện ở ≤ {HOOK_SHOW} giây — hình hook phải có ngay khung đầu")
    else:
        # Độ lớn sprite đo bằng mực thật ở qa.py (cổng hook); ở đây chỉ cảnh báo ảnh thật quá nhỏ.
        area = sum(it["w"] * (it.get("h") or it["w"] * 0.56) for it in early if it.get("kind") == "photo" and num(it.get("w")))
        if area and area / (grid[0] * grid[1]) < HOOK_AREA * 0.5:
            R.w("hook", "ảnh mở đầu nhỏ — hook nên chiếm ≥ 12% khung")
    hits = [t for t, *_ in (sc.get("punch") or []) + (sc.get("flash") or []) + (sc.get("shake") or []) if num(t) and t <= HOOK_HIT]
    hits += [it.get("at", 0) for it in items if (it.get("kind") == "burst" or it.get("plate") == "stamp"
             or it.get("reveal") in ("pop", "bloom")) and num(it.get("at", 0)) and it.get("at", 0) <= HOOK_HIT]
    if not hits:
        R.e("hook", f"không có cú nhấn nào ≤ {HOOK_HIT} giây (punch/flash/shake/burst/tem hoặc vật pop/bloom) — mở đầu phải động ngay")


def name_spans(words: list[dict]) -> list[tuple[str, int]]:
    """Cụm từ viết hoa giữa câu (tên riêng): 'Phan Việt', 'Conan School', 'Kudo'. Trả (cụm, chỉ số từ đầu)."""
    out, i, prev = [], 0, "."
    lower = {norm(w["text"]) for w in words if not w["text"].strip()[:1].isupper()}
    while i < len(words):
        t = words[i]["text"].strip()
        mid = not prev.rstrip().endswith((".", "?", "!", ":", "…")) and i > 0
        if mid and t[:1].isupper():
            j = i
            while j + 1 < len(words) and words[j + 1]["text"].strip()[:1].isupper() and not words[j]["text"].rstrip().endswith((",", ".", "?", "!", ":")):
                j += 1
            out.append((" ".join(re.sub(r"[^\w]", "", w["text"]) for w in words[i:j + 1]), i))
            prev, i = words[j]["text"], j + 1
            continue
        # Đầu câu: chỉ coi là tên khi là chữ Latin không dấu, ≥ 3 ký tự, không phải từ thường gặp và dạng viết
        # thường không xuất hiện ở chỗ khác trong lời (Kudo, Facebook…).
        if not mid and t[:1].isupper():
            w = re.sub(r"[^\w]", "", t)
            if len(w) >= 3 and w.isascii() and w.isalpha() and w.lower() not in COMMON_WORDS and w.lower() not in lower:
                out.append((w, i))
        prev, i = t, i + 1
    return out


def check_cast(R: Report, d: dict, words: list[dict], off: float, shown: list[tuple], stats: dict) -> None:
    """Tên riêng được nói phải có hình. `cast` = {"Phan Việt|Việt": ["sprite", "sprite#layer"], …}.
    Mỗi lần lời nhắc một tên, một vật của tên đó phải hiện trong [t − 0,3; t + 1,2]."""
    if not words:
        return
    cast = d.get("cast") or {}
    if not isinstance(cast, dict) or any(not isinstance(v, list) or not v for v in cast.values()):
        R.e("cast", "cast phải là {\"Tên|Bí danh\": [\"sprite\" hoặc \"sprite#layer\", …]} và mỗi tên có ít nhất một vật")
        return
    # Phân biệt hoa thường: tên 'AI' khác đại từ 'ai'.
    N = [re.sub(r"[^\w]", "", w["text"]) for w in words]
    alias = sorted(((name_toks(a), k) for k in cast for a in k.split("|")), key=lambda x: -len(x[0]))
    named = {name_toks(n) for n, _ in name_spans(words)}
    known = {a for a, _ in alias}
    for n in sorted(named - known):
        R.e("cast", f"lời nói tên riêng '{n}' nhưng direction chưa khai cast cho nó — người/vật được gọi tên phải có hình")
    hits, miss, used = 0, [], set()
    for toks, key in alias:
        for i in range(len(N) - len(toks) + 1):
            if tuple(N[i:i + len(toks)]) != toks or any(j in used for j in range(i, i + len(toks))):
                continue
            used.update(range(i, i + len(toks)))
            t = words[i]["start_ms"] / 1000 + off
            lo, hi = t - CAST_WIN[0], t + CAST_WIN[1]
            ok = False
            for ref in cast[key]:
                sid, _, layer = ref.partition("#")
                for s, a, b, Ls in shown:
                    if s != sid:
                        continue
                    if layer:
                        c = Ls.get(layer) or {}
                        if c.get("hide"):
                            continue
                        a = max(a, c["at"]) if num(c.get("at")) else a
                        b = min(b, c["out"]) if num(c.get("out")) else b
                    if a + 0.2 <= hi and b >= lo:
                        ok = True
            hits += ok
            if not ok:
                miss.append(f"'{' '.join(toks)}' ở {t:.2f}s")
    for m in miss:
        R.e("cast", f"lời nhắc {m} nhưng không vật nào của tên đó hiện trong [−{CAST_WIN[0]:g}; +{CAST_WIN[1]:g}] giây")
    stats["cast"] = f"{hits}/{hits + len(miss)}"


def name_toks(s: str) -> tuple:
    return tuple(re.sub(r"[^\w]", "", t) for t in s.split() if re.sub(r"[^\w]", "", t))


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("run", type=Path)
    ap.add_argument("--orient", choices=("doc", "ngang"))
    ap.add_argument("--library", type=Path, action="append", default=[])
    ap.add_argument("--json", action="store_true")
    a = ap.parse_args()
    run = a.run.resolve()
    tl = run / "work/voice_timeline.json"
    words = json.loads(tl.read_text())["words"] if tl.is_file() else []
    libs = [p for p in (run / "work/library", *a.library, SHARED_LIBRARY) if p.is_dir()]
    orients = [a.orient] if a.orient else [o for o in ("doc", "ngang") if (run / f"work/direction-{o}.json").is_file()]
    if not orients:
        raise SystemExit(f"không thấy {run}/work/direction-*.json")
    res, nerr = {}, 0
    if not words:
        print("CẢNH BÁO: không có work/voice_timeline.json — bỏ qua kiểm nhấn theo từ")
    for o in orients:
        R, stats = check(run, o, words, libs)
        nerr += len(R.err)
        res[o] = {"errors": R.err, "warnings": R.warn, "stats": stats}
        if not a.json:
            for m in R.err:
                print("LỖI     ", m)
            for m in R.warn:
                print("CẢNH BÁO", m)
            print(f"[{o}] {len(R.err)} lỗi, {len(R.warn)} cảnh báo — {json.dumps(stats, ensure_ascii=False)}")
    if a.json:
        print(json.dumps(res, ensure_ascii=False, indent=1))
    sys.exit(1 if nerr else 0)


if __name__ == "__main__":
    main()
