"""Bộ sprite gốc của pixel-explainer (giấy phép: tự làm).

Mỗi asset là dict: id, role (draw|actor|model|still), w, h, layers[{name, frames[Grid]}],
durations (ms mỗi frame), tags [(tên, từ, đến)] đếm từ 0, slices [(tên, x, y, w, h)].
tools/asset_build.py chuyển sang Aseprite (Lua) rồi xuất sheet + manifest vào _library.
Ký tự màu xem PAL; '.' là trong suốt.
"""
from __future__ import annotations

import math

PAL = {
    "k": "#1a1c2c", "K": "#333c57", "g": "#566c86", "G": "#94b0c2", "w": "#f4f4f4",
    "r": "#b13e53", "o": "#ef7d57", "y": "#ffcd75", "l": "#a7f070", "v": "#38b764",
    "V": "#257179", "n": "#29366f", "b": "#3b5dc9", "B": "#41a6f6", "c": "#73eff7",
    "p": "#5d275d", "s": "#f2c19e", "S": "#d08a6a", "h": "#3d2a26", "H": "#7a4a3a",
    "N": "#20284a", "q": "#333c57",
}


class Grid:
    def __init__(self, w: int, h: int):
        self.w, self.h = w, h
        self.px = [["."] * w for _ in range(h)]

    @classmethod
    def rows(cls, rows: list[str], pad_x: int = 0, w: int | None = None) -> "Grid":
        width = w or (len(rows[0]) + 2 * pad_x)
        g = cls(width, len(rows))
        for y, row in enumerate(rows):
            assert len(row) == len(rows[0]), f"row {y} dài {len(row)}: {row!r}"
            for x, c in enumerate(row):
                g.set(x + pad_x, y, c)
        return g

    def copy(self) -> "Grid":
        g = Grid(self.w, self.h)
        g.px = [r[:] for r in self.px]
        return g

    def set(self, x: int, y: int, c: str) -> "Grid":
        if 0 <= x < self.w and 0 <= y < self.h:
            self.px[y][x] = c
        return self

    def get(self, x: int, y: int) -> str:
        return self.px[y][x] if 0 <= x < self.w and 0 <= y < self.h else "."

    def rect(self, x, y, w, h, c):
        for yy in range(y, y + h):
            for xx in range(x, x + w):
                self.set(xx, yy, c)
        return self

    def box(self, x, y, w, h, fill, edge="k"):
        self.rect(x, y, w, h, edge)
        self.rect(x + 1, y + 1, w - 2, h - 2, fill)
        return self

    def line(self, x0, y0, x1, y1, c, thick=1):
        dx, dy = abs(x1 - x0), -abs(y1 - y0)
        sx, sy = (1 if x0 < x1 else -1), (1 if y0 < y1 else -1)
        err = dx + dy
        while True:
            for t in range(thick):
                for u in range(thick):
                    self.set(x0 + t, y0 + u, c)
            if x0 == x1 and y0 == y1:
                break
            e2 = 2 * err
            if e2 >= dy:
                err += dy
                x0 += sx
            if e2 <= dx:
                err += dx
                y0 += sy
        return self

    def path(self, pts, c, thick=2):
        for (x0, y0), (x1, y1) in zip(pts, pts[1:]):
            self.line(x0, y0, x1, y1, c, thick)
        return self

    def disc(self, cx, cy, r, c):
        for y in range(int(cy - r - 1), int(cy + r + 2)):
            for x in range(int(cx - r - 1), int(cx + r + 2)):
                if (x - cx) ** 2 + (y - cy) ** 2 <= r * r:
                    self.set(x, y, c)
        return self

    def ring(self, cx, cy, r, c, thick=2, dotted=0):
        for y in range(int(cy - r - 2), int(cy + r + 3)):
            for x in range(int(cx - r - 2), int(cx + r + 3)):
                d = math.hypot(x - cx, y - cy)
                if r - thick / 2 <= d < r + thick / 2:
                    if dotted and int((math.atan2(y - cy, x - cx) + math.pi) * r / dotted) % 2:
                        continue
                    self.set(x, y, c)
        return self

    def stamp(self, other: "Grid", x: int, y: int) -> "Grid":
        for yy in range(other.h):
            for xx in range(other.w):
                c = other.px[yy][xx]
                if c != ".":
                    self.set(x + xx, y + yy, c)
        return self

    def outline(self, c="k") -> "Grid":
        g = self.copy()
        for y in range(self.h):
            for x in range(self.w):
                if self.px[y][x] == "." and any(self.get(x + dx, y + dy) not in (".", c) for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1))):
                    g.px[y][x] = c
        return g

    def recolor(self, mapping: dict) -> "Grid":
        g = self.copy()
        g.px = [[mapping.get(c, c) for c in r] for r in g.px]
        return g

    def mask(self, art: list[str], c: str, x=0, y=0) -> "Grid":
        """Tô ô '#' của một hình ASCII bằng màu c."""
        for yy, row in enumerate(art):
            for xx, ch in enumerate(row):
                if ch == "#":
                    self.set(x + xx, y + yy, c)
        return self

    def only(self, keep) -> "Grid":
        g = Grid(self.w, self.h)
        for y in range(self.h):
            for x in range(self.w):
                if keep(x, y, self.px[y][x]):
                    g.px[y][x] = self.px[y][x]
        return g


def overlay(base: Grid, part: Grid, edge: str = "k") -> Grid:
    """Đặt part lên base; viền của part chỉ vẽ vào ô base còn trống."""
    out = base.copy()
    for y in range(part.h):
        for x in range(part.w):
            if part.px[y][x] != ".":
                out.px[y][x] = part.px[y][x]
            elif base.px[y][x] == "." and any(part.get(x + dx, y + dy) != "." for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1))):
                out.px[y][x] = edge
    return out


def padded(art: Grid, pad: int = 1) -> Grid:
    g = Grid(art.w + 2 * pad, art.h + 2 * pad)
    return g.stamp(art, pad, pad)


# ---------------------------------------------------------------- nhân vật
CHAR_ROWS = [
    "....................",
    "......kkkkkkkk......",
    "....kkhhhhhhhhkk....",
    "...khhhhhhhhhhhhk...",
    "..khhhHHhhhhhhhhhk..",
    "..khhhhhhhhhhhhhhk..",
    "..khhhssshhssshhhk..",
    "..khsssssssssssshk..",
    "..ksswesssssswessk..",
    "..ksseesssssseessk..",
    "..kSsssssmmsssssSk..",
    "...kSssssssssssSk...",
    "....kkSssssssSkk....",
    ".......kSssSk.......",
    "....kXXXXwwXXXXk....",
    "...kYXXXXXXXXXXYk...",
    "...kYXXXXXXXXXXYk...",
    "...kYXXXXXXXXXXYk...",
    "...kYXXXXXXXXXXYk...",
    "...kYXXXXXXXXXXYk...",
    "...kYXXXXXXXXXXYk...",
    "...ksXXXXXXXXXXsk...",
    "....kqqqqqqqqqqk....",
    ".....kqqqkkqqqk.....",
    ".....kqqqkkqqqk.....",
    ".....kqqqkkqqqk.....",
    ".....kqqqkkqqqk.....",
    ".....kqqqkkqqqk.....",
    ".....kqqqkkqqqk.....",
    "....kggggkkggggk....",
    "....kkkkkkkkkkkk....",
    "....................",
]
P = 2  # đệm hai bên cho tay giơ/chỉ


EYES = (5 + P, 6 + P, 13 + P, 14 + P)


def _blink(g: Grid) -> Grid:
    g = g.copy()
    for x in EYES:
        g.px[8][x] = "s"
        g.px[9][x] = "k"
    return g


def _head_drop(g: Grid, d: int) -> Grid:
    head = g.only(lambda x, y, c: y <= 12)
    body = g.only(lambda x, y, c: y > 12)
    out = body.copy()
    shifted = Grid(g.w, g.h)
    for y in range(12, -1, -1):
        for x in range(g.w):
            if head.px[y][x] != ".":
                shifted.set(x, y + d, head.px[y][x])
    return out.stamp(shifted, 0, 0)


def _arm_off(g: Grid, side: str, shirt: str) -> Grid:
    g = g.copy()
    col = 15 + P if side == "r" else 4 + P
    for y in range(15, 22):
        if g.px[y][col] != "k":
            g.px[y][col] = shirt
    return g


def character(shirt: str, shade: str, hair: str = "h", hair_hi: str = "H") -> tuple[list[Grid], list[int], list[tuple]]:
    base = Grid.rows(CHAR_ROWS, pad_x=P).recolor({"X": shirt, "Y": shade, "h": hair, "H": hair_hi, "e": "k", "m": "r"})
    frames, durs, tags = [], [], []

    def add(tag, grids, ms):
        start = len(frames)
        frames.extend(grids)
        durs.extend(ms if isinstance(ms, list) else [ms] * len(grids))
        tags.append((tag, start, len(frames) - 1))

    add("idle", [base, _blink(base)], [1500, 167])
    typing = []
    for k in range(2):
        g = base.copy()
        for y in range(19, 22):
            for x in (4 + P, 15 + P):
                if g.px[y][x] in "Ys":
                    g.px[y][x] = shirt
        g.set(4 + P, 19, "s")
        g.set(15 + P, 19, "s")
        g.set(6 + P, 20 - k, "s")
        g.set(13 + P, 19 + k, "s")
        typing.append(g)
    add("go", typing, 167)
    sigh = base.copy()
    for x in EYES:
        sigh.px[8][x] = "s"
    sigh.px[10][9 + P] = "k"
    sigh.px[10][10 + P] = "s"
    add("thoidai", [sigh, _head_drop(sigh, 1)], 500)
    sad = _blink(base)
    sad.px[10][9 + P] = sad.px[10][10 + P] = "k"
    sad.px[11][8 + P] = sad.px[11][11 + P] = "k"
    sad = _head_drop(sad, 2)
    drop = sad.copy()
    for x, y, c in ((19, 4, "w"), (19, 5, "c"), (19, 6, "c"), (20, 5, "c")):
        drop.set(x + P - 1, y, c)
    add("guc", [sad, drop], 600)
    arm = Grid(base.w, base.h)
    arm.rect(20, 6, 2, 10, shade).rect(18, 14, 2, 2, shade).rect(20, 3, 2, 3, "s")
    cam = overlay(_arm_off(base, "r", shirt), arm)
    add("cam", [cam], 1000)
    chi = _arm_off(base, "r", shirt)
    for x in range(18, 22):
        chi.set(x, 14, "k")
        chi.set(x, 15, shade)
        chi.set(x, 16, shade)
        chi.set(x, 17, "k")
    chi.set(21, 15, "s")
    chi.set(21, 16, "s")
    chi.set(22, 15, "s")
    chi.set(23, 15, "k")
    chi.set(22, 16, "k")
    chi.set(22, 14, "k")
    add("chi", [chi], 1000)
    walk = []
    for leg in (0, 1):
        g = base.copy()
        x0 = (6 if leg == 0 else 11) + P - 1
        for x in range(x0, x0 + 5):
            for y in range(23, 31):
                g.px[y - 1][x] = g.px[y][x] if g.px[y][x] != "." or y > 28 else g.px[y - 1][x]
            g.px[30][x] = "."
        walk.append(g)
    add("di", walk, 167)
    return frames, durs, tags


def actor(asset_id: str, frames, durs, tags, anchor, extra_slices=()):
    return {"id": asset_id, "role": "actor", "w": frames[0].w, "h": frames[0].h,
            "layers": [{"name": "nhan-vat", "frames": frames}], "durations": durs, "tags": tags,
            "slices": [("anchor", *anchor), *extra_slices]}


# ---------------------------------------------------------------- robot AI
def robot_parts(w=32, light="r"):
    khung, mat, anten = Grid(w, 36), Grid(w, 36), Grid(w, 36)
    khung.box(1, 11, 4, 6, "g").box(27, 11, 4, 6, "g")
    khung.box(4, 6, 24, 16, "G")
    khung.rect(26, 7, 1, 14, "g").rect(5, 20, 21, 1, "g")
    khung.box(13, 21, 6, 3, "g")
    khung.box(3, 25, 5, 9, "g").box(24, 25, 5, 9, "g")
    khung.box(7, 23, 18, 12, "G")
    khung.rect(23, 24, 1, 10, "g")
    khung.box(12, 26, 8, 5, "B").set(14, 28, "c")
    mat.box(7, 9, 18, 10, "N", edge="K")
    mat.rect(11, 12, 3, 3, "c").rect(18, 12, 3, 3, "c").rect(13, 16, 6, 1, "c")
    anten.rect(15, 3, 2, 4, "g")
    anten.box(14, 0, 4, 4, light)
    return khung, mat, anten


def robot_ai():
    k, m, a = robot_parts()
    _, _, a2 = robot_parts(light="p")
    return {"id": "robot-ai", "role": "draw", "w": 32, "h": 36,
            "layers": [{"name": "01-khung", "frames": [k, k]}, {"name": "02-mat", "frames": [m, m]},
                       {"name": "03-anten", "frames": [a, a2]}],
            "durations": [700, 700], "tags": [("idle", 0, 1)], "slices": [("anchor", 14, 34, 4, 2)]}


def kudo_parts(w=40, ox=2, eyes_closed=False, light="y"):
    khung, hoso, thuvien = Grid(w, 40), Grid(w, 40), Grid(w, 40)
    x = ox
    khung.rect(x + 16, 3, 2, 4, "g")
    khung.box(x + 15, 0, 4, 4, light)
    khung.box(x + 2, 11, 4, 6, "b").box(x + 30, 11, 4, 6, "b")
    khung.box(x + 4, 6, 28, 17, "B")
    khung.rect(x + 30, 7, 1, 15, "b").rect(x + 5, 21, 25, 1, "b")
    khung.box(x + 7, 9, 22, 10, "N", edge="K")
    if eyes_closed:
        khung.rect(x + 11, 14, 4, 1, "w").rect(x + 21, 14, 4, 1, "w")
    else:
        khung.rect(x + 11, 12, 4, 4, "w").rect(x + 21, 12, 4, 4, "w")
        khung.rect(x + 13, 13, 2, 2, "k").rect(x + 23, 13, 2, 2, "k")
    khung.rect(x + 15, 17, 6, 1, "y").set(x + 14, 16, "y").set(x + 21, 16, "y")
    khung.box(x + 14, 22, 8, 3, "b")
    khung.box(x + 3, 26, 5, 9, "b").box(x + 28, 26, 5, 9, "b")
    khung.box(x + 6, 24, 24, 15, "B")
    khung.rect(x + 28, 25, 1, 13, "b")
    hoso.box(x + 8, 26, 10, 11, "y")
    hoso.box(x + 9, 28, 8, 6, "w").rect(x + 10, 29, 2, 2, "o").rect(x + 13, 29, 3, 1, "g").rect(x + 13, 31, 3, 1, "g").rect(x + 10, 32, 6, 1, "g")
    hoso.rect(x + 12, 35, 2, 1, "k")
    thuvien.box(x + 18, 26, 10, 11, "o")
    for i, c in enumerate("ywrBw"):
        thuvien.rect(x + 19 + i * 2 - (1 if i else 0) + 1, 28 + (i % 2), 1 if i else 1, 6 - (i % 2), c)
    thuvien.rect(x + 19, 34, 8, 1, "H").rect(x + 22, 35, 2, 1, "k")
    return khung, hoso, thuvien


def kudo_dung():
    k, h, t = kudo_parts()
    return {"id": "kudo-dung", "role": "draw", "w": 40, "h": 40,
            "layers": [{"name": "01-khung-cu", "frames": [k]}, {"name": "02-ngan-ho-so", "frames": [h]},
                       {"name": "03-ngan-thu-vien", "frames": [t]}],
            "durations": [1000], "tags": [], "slices": [("anchor", 18, 38, 4, 2)]}


def kudo_actor():
    def flat(**kw):
        g = Grid(44, 40)
        for part in kudo_parts(w=44, ox=4, **kw):
            g.stamp(part, 0, 0)
        return g
    idle0, idle1 = flat(), flat(eyes_closed=True, light="w")
    chi = flat()
    chi.rect(36, 26, 6, 9, ".")
    chi.box(34, 27, 9, 4, "b").box(40, 26, 4, 6, "B")
    cam = flat()
    cam.rect(36, 26, 6, 9, ".")
    cam.box(36, 16, 4, 12, "b").box(35, 12, 6, 5, "B")
    return {"id": "kudo", "role": "actor", "w": 44, "h": 40,
            "layers": [{"name": "nhan-vat", "frames": [idle0, idle1, chi, cam]}],
            "durations": [1400, 167, 1000, 1000],
            "tags": [("idle", 0, 1), ("chi", 2, 2), ("cam", 3, 3)],
            "slices": [("anchor", 20, 38, 4, 2), ("tay", 37, 10, 2, 2)]}


# ---------------------------------------------------------------- đạo cụ
def still(asset_id, grid, slices=()):
    return {"id": asset_id, "role": "still", "w": grid.w, "h": grid.h,
            "layers": [{"name": "hinh", "frames": [grid]}], "durations": [1000], "tags": [], "slices": list(slices)}


QUESTION = ["..####..", ".######.", "##....##", "......##", "....###.", "...###..", "...##...", "...##...", "........", "...##...", "...##..."]


def dau_hoi():
    g = Grid(10, 13).mask(QUESTION, "y", 1, 1)
    g.set(3, 2, "w").set(4, 2, "w")
    return padded(g, 0).outline()


def page(kind: str) -> Grid:
    g = Grid(24, 30)
    fill = {"xam": "G", "day": "w", "mau": "w"}[kind]
    g.box(1, 1, 22, 28, fill)
    for y in range(1, 6):
        for x in range(23 - 6 + (y - 1), 23):
            g.set(x, y, ".")
    g.line(17, 1, 22, 6, "k")
    g.rect(17, 2, 1, 5, "k" if kind != "xam" else "k").rect(17, 6, 5, 1, "k")
    g.rect(18, 2, 4, 4, ".")
    for y in range(2, 6):
        for x in range(18, 18 + (y - 1)):
            g.set(x, y, "g" if kind == "xam" else "G")
    if kind == "xam":
        for y in (9, 12, 15, 18, 21):
            g.rect(4, y, 16, 1, "g")
        g.rect(8, 24, 2, 1, "K").rect(14, 24, 2, 1, "K")
    elif kind == "day":
        for y in range(8, 27):
            g.rect(4, y, 17 - (3 if y % 5 == 0 else 0), 1, "K" if y % 2 else "g")
    else:
        g.rect(4, 4, 12, 3, "o")
        for y, ln in ((10, 16), (13, 12), (16, 15), (19, 9)):
            g.rect(4, y, ln, 1, "K")
        heart = [".##.##.", "#######", "#######", ".#####.", "..###..", "...#..."]
        g.mask(heart, "r", 12, 21).set(13, 22, "w")
    return g


def share_icon():
    g = Grid(11, 11)
    g.line(3, 5, 8, 2, "B").line(3, 5, 8, 8, "B")
    g.disc(8, 2, 1.6, "B").disc(8, 8, 1.6, "B").disc(2.5, 5, 1.6, "B")
    return padded(g, 1).outline()


def ban_laptop():
    g = Grid(52, 18)
    g.box(18, 0, 18, 11, "G").set(27, 5, "w").set(26, 5, "w").rect(19, 9, 16, 1, "g")
    g.box(0, 10, 52, 4, "H").rect(1, 11, 50, 1, "y" if False else "H")
    g.rect(1, 11, 50, 1, "o").rect(1, 11, 50, 1, "H")
    g.box(2, 13, 48, 5, "h")
    g.rect(1, 10, 50, 1, "k")
    g.rect(3, 11, 46, 1, "o")
    return g


def bang_lenh():
    g = Grid(60, 26)
    g.box(0, 0, 60, 26, "w")
    g.rect(1, 1, 58, 5, "b").rect(1, 6, 58, 1, "k")
    g.rect(3, 3, 2, 2, "r").rect(7, 3, 2, 2, "y").rect(11, 3, 2, 2, "l")
    for y, ln in ((10, 40), (14, 48), (18, 30)):
        g.rect(4, y, ln, 2, "G")
    g.rect(36, 18, 2, 4, "k")
    return g


def bong_den():
    art = ["..####..", ".######.", "########", "########", "########", ".######.", "..####.."]
    g = Grid(10, 14).mask(art, "y", 1, 1)
    g.set(3, 3, "w").set(3, 4, "w").set(4, 2, "w")
    g.rect(3, 8, 4, 1, "y").rect(3, 9, 4, 1, "G").rect(3, 10, 4, 1, "g").rect(3, 11, 4, 1, "G").rect(4, 12, 2, 1, "g")
    return g.outline()


def cuon_giay():
    g = Grid(16, 20)
    g.box(2, 2, 12, 16, "w")
    g.box(0, 0, 16, 4, "H").box(0, 16, 16, 4, "H")
    for y in (6, 9, 12):
        g.rect(4, y, 8 if y != 12 else 5, 1, "g")
    return g


def khung_cau_truc():
    g = Grid(18, 22)
    g.box(0, 0, 18, 22, "w")
    g.rect(2, 2, 14, 4, "B").rect(2, 8, 14, 3, "G").rect(2, 13, 9, 3, "G").rect(2, 18, 12, 2, "G")
    return g


def ngoi_but():
    art = ["..####..", ".######.", ".######.", ".######.", "########", "########", ".######.", "..####..", "...##...", "...##...", "....#..."]
    g = Grid(10, 15)
    g.rect(2, 0, 6, 5, "b")
    g.mask(art, "G", 1, 3)
    g.rect(4, 7, 2, 1, "k").rect(4, 8, 1, 4, "k")
    return g.outline()


def nut_dang():
    g = Grid(48, 18)
    g.box(0, 0, 48, 18, "b")
    g.rect(1, 1, 46, 3, "B").rect(1, 14, 46, 3, "n")
    return g


def o_khoa():
    g = Grid(14, 16)
    g.ring(7, 5.5, 4, "G", thick=2)
    g.rect(0, 6, 14, 10, ".")
    g.box(1, 6, 12, 10, "y").rect(2, 7, 10, 1, "w")
    g.rect(6, 9, 2, 2, "k").rect(6, 11, 1, 2, "k")
    return g.outline()


def dau_tich():
    art = [".........##", "........###", ".......###.", "##....###..", "###..###...", ".#####.....", "..###......"]
    return Grid(13, 9).mask(art, "l", 1, 1).outline()


def dau_x():
    art = ["##...##", "###.###", ".#####.", "..###..", ".#####.", "###.###", "##...##"]
    return Grid(9, 9).mask(art, "r", 1, 1).outline()


def dau_khac():
    g = Grid(18, 16)
    g.rect(2, 4, 14, 3, "y").rect(2, 9, 14, 3, "y")
    g.line(12, 1, 6, 14, "r", 2)
    return g.outline()


def thuoc_do():
    g = Grid(34, 20)
    g.ring(17, 17, 14, "G", thick=3)
    g.rect(0, 18, 34, 2, ".")
    for a in (180, 135, 90, 45, 0):
        r = math.radians(a)
        g.set(round(17 + 9 * math.cos(r)), round(17 - 9 * math.sin(r)), "g")
    g.line(17, 17, 6, 17, "r", 2)
    g.rect(15, 15, 4, 4, "k")
    return g.outline()


def nam_cham():
    art = ["####....####", "####....####", "####....####", "##........##", "###......###", ".##########.", "..########.."]
    g = Grid(16, 13)
    g.mask(art, "r", 2, 2)
    g.rect(2, 2, 4, 2, "G").rect(10, 2, 4, 2, "G")
    return g.outline()


def trai_tim():
    art = [".###..###.", "##########", "##########", "##########", ".########.", "..######..", "...####...", "....##...."]
    g = Grid(14, 12).mask(art, "r", 2, 2)
    g.set(4, 3, "w").set(3, 4, "w")
    return g.outline()


def dong_xu():
    g = Grid(16, 16)
    g.disc(7.5, 7.5, 6.5, "o").disc(7.5, 7.5, 4.6, "y")
    g.rect(7, 4, 2, 8, "o").set(5, 5, "w").set(4, 6, "w")
    return g.outline()


def nhom_khach():
    g = Grid(30, 12)
    for i, c in enumerate("BoV"):
        x = 2 + i * 9
        g.disc(x + 3, 3.5, 2.6, "s")
        g.rect(x + 1, 7, 6, 4, c)
    return g.outline()


def ke_sach():
    khung, cam, xam = Grid(68, 50), Grid(68, 50), Grid(68, 50)
    khung.box(0, 0, 68, 50, "H")
    for y in (15, 31):
        khung.rect(2, y, 64, 2, "h")
    khung.rect(1, 47, 66, 2, "h")
    for shelf, base in enumerate((15, 31, 47)):
        grey = {(0, 3), (0, 9), (1, 5), (2, 1), (2, 8), (2, 11)}
        for i in range(12):
            x = 3 + i * 5
            hgt = 10 + ((i * 7 + shelf * 3) % 3)
            target = xam if (shelf, i) in grey else cam
            fill, band = ("g", "G") if target is xam else (("o", "y") if i % 3 else ("r", "y"))
            target.box(x, base - hgt, 5, hgt, fill)
            target.rect(x + 1, base - hgt + 2, 3, 1, band)
    return {"id": "ke-sach", "role": "draw", "w": 68, "h": 50,
            "layers": [{"name": "01-khung", "frames": [khung]}, {"name": "02-gay-thong-phan", "frames": [cam]},
                       {"name": "03-gay-tu-soan", "frames": [xam]}],
            "durations": [1000], "tags": [], "slices": [("anchor", 32, 48, 4, 2)]}


# ---------------------------------------------------------------- mô hình
def ai_head(g: Grid, x: int, y: int):
    g.rect(x + 11, y - 4, 2, 4, "g").box(x + 10, y - 7, 4, 4, "r")
    g.box(x, y, 24, 17, "G").rect(x + 22, y + 1, 1, 15, "g")
    g.box(x + 3, y + 3, 18, 10, "N", edge="K")
    g.rect(x + 7, y + 6, 3, 3, "c").rect(x + 14, y + 6, 3, 3, "c")
    return g


def page_big(kind: str) -> Grid:
    g = Grid(40, 50)
    fill = "G" if kind == "nhat" else "w"
    g.box(0, 0, 40, 50, fill)
    for y in range(0, 9):
        for x in range(31 + y, 40):
            g.set(x, y, ".")
    g.line(31, 0, 39, 8, "k")
    g.rect(31, 0, 1, 9, "k").rect(31, 8, 9, 1, "k")
    for y in range(1, 8):
        for x in range(32, 32 + y):
            g.set(x, y, "g" if kind == "nhat" else "G")
    if kind == "nhat":
        for y in (12, 16, 20, 24):
            g.rect(5, y, 30, 2, "g")
        g.rect(13, 34, 3, 2, "K").rect(24, 34, 3, 2, "K").rect(15, 41, 10, 2, "K")
    else:
        g.rect(5, 5, 20, 5, "o")
        for y, ln in ((14, 28), (19, 22), (24, 26), (29, 14)):
            g.rect(5, y, ln, 2, "K")
        heart = [".###..###.", "##########", "##########", ".########.", "..######..", "...####...", "....##...."]
        g.mask(heart, "r", 24, 35).set(26, 36, "w")
        for sx, sy in ((7, 38), (12, 42)):
            g.set(sx, sy, "y").set(sx - 1, sy, "y").set(sx + 1, sy, "y").set(sx, sy - 1, "y").set(sx, sy + 1, "y")
    return g


def model(asset_id, w, h, layers):
    return {"id": asset_id, "role": "model", "w": w, "h": h,
            "layers": [{"name": n, "frames": f if isinstance(f, list) else [f]} for n, f in layers],
            "durations": [1000] * max(len(f) if isinstance(f, list) else 1 for _, f in layers), "tags": [], "slices": []}


def dual_track(asset_id, w, h, ai_x, ai_y, split_y, nhat_xy, dung_xy):
    base, ai, e1, e2, n1, n2 = (Grid(w, h) for _ in range(6))
    ai_head(ai, ai_x, ai_y)
    cx = ai_x + 12
    for (px, py), g in ((nhat_xy, n1), (dung_xy, n2)):
        g.stamp(page_big("nhat" if g is n1 else "dung"), px, py)
        base.rect(px + 2, py + 51, 36, 2, "N")
    e1.path([(cx - 1, ai_y + 17), (cx - 1, split_y), (nhat_xy[0] + 19, split_y), (nhat_xy[0] + 19, nhat_xy[1] - 2)], "G")
    e2.path([(cx - 1, ai_y + 17), (cx - 1, split_y), (dung_xy[0] + 19, split_y), (dung_xy[0] + 19, dung_xy[1] - 2)], "y")
    base.rect(ai_x + 2, ai_y + 18, 20, 1, "N")
    return model(asset_id, w, h, [("base", base), ("node:ai", ai), ("edge:ai-nhat", e1), ("edge:ai-dung", e2),
                                  ("node:nhat", n1), ("node:dung", n2)])


def trapezoid(g: Grid, cx: int, top: int, height: int, bottom_w: int, slope: float, fill: str, hi: str):
    for r in range(height):
        half = (bottom_w / 2) - (height - 1 - r) * slope
        x0, x1 = round(cx - half), round(cx + half)
        for x in range(x0, x1):
            g.set(x, top + r, "k" if r in (0, height - 1) or x in (x0, x1 - 1) else (hi if r in (1, 2) else fill))
    return g


def pyramid():
    # Rộng 116 để tầng đáy khi spotlight ×1,167 (≈135 ô) vẫn nằm trong vùng nội dung khung dọc (143 ô).
    w, h = 116, 112
    base, mot, hai, ba, dinh = (Grid(w, h) for _ in range(5))
    trapezoid(mot, 58, 82, 26, 116, 0.45, "b", "B")
    trapezoid(hai, 58, 54, 26, 92, 0.45, "V", "v")
    trapezoid(ba, 58, 26, 26, 68, 0.45, "v", "l")
    for r in range(24):
        half = 1 + r * 0.95
        for x in range(round(58 - half), round(58 + half)):
            dinh.set(x, r, "k" if r == 23 or x in (round(58 - half), round(58 + half) - 1) else ("w" if r < 4 else "y"))
    base.rect(6, 109, 104, 2, "N")
    return model("m-pyramid", w, h, [("base", base), ("node:mot", mot), ("node:hai", hai), ("node:ba", ba), ("node:dinh", dinh)])


def orbit():
    s, c = 120, 60
    base, center, r1, edge = Grid(s, s), Grid(s, s), Grid(s, s), Grid(s, s)
    base.ring(c, c, 32, "K", thick=1, dotted=3).ring(c, c, 54, "K", thick=1, dotted=3)
    head = Grid.rows(CHAR_ROWS[:14]).recolor({"X": "B", "Y": "b", "e": "k", "m": "r"})
    center.disc(c, c, 14, "n").ring(c, c, 14, "B", thick=2)
    center.stamp(head, c - 10, c - 8)
    r1.ring(c, c, 32, "B", thick=2)
    card = Grid(14, 11).box(0, 0, 14, 11, "w")
    card.rect(2, 2, 4, 4, "o").rect(7, 2, 5, 1, "g").rect(7, 4, 5, 1, "g").rect(2, 8, 10, 1, "g")
    r1.stamp(card, c - 7, c - 32 - 5)
    frames = []
    for f in range(8):
        g = Grid(s, s).ring(c, c, 54, "o", thick=2)
        for i in range(6):
            a = math.radians(i * 60 + f * 60 / 8 - 90)
            px, py = round(c + 54 * math.cos(a)), round(c + 54 * math.sin(a))
            g.box(px - 4, py - 5, 9, 11, "w").rect(px - 2, py - 3, 5, 1, "o").rect(px - 2, py - 1, 5, 1, "g").rect(px - 2, py + 1, 4, 1, "g")
        frames.append(g)
    a = math.radians(-30)
    x0, y0 = round(c + 50 * math.cos(a)), round(c + 50 * math.sin(a))
    pts = []
    for i in range(13):
        t = i / 12
        x = round(x0 + (c + 12 - x0) * t)
        y = round(y0 + (c - 6 - y0) * t + (2 if i % 2 else -2))
        pts.append((x, y))
    edge.path(pts, "y", 2)
    return {"id": "m-orbit", "role": "model", "w": s, "h": s,
            "layers": [{"name": "base", "frames": [base] * 8}, {"name": "node:ho-so", "frames": [r1] * 8},
                       {"name": "node:bai-dang", "frames": frames}, {"name": "edge:bai-dang-anh-em", "frames": [edge] * 8},
                       {"name": "node:anh-em", "frames": [center] * 8}],
            "durations": [500] * 8, "tags": [("quay", 0, 7)], "slices": []}


def funnel():
    w, h = 140, 124
    base, keo, tin, ban, nhom, brief, e1, e2, e3, e4 = (Grid(w, h) for _ in range(10))
    keo.stamp(nam_cham(), 14, 2)
    tin.stamp(trai_tim(), 63, 3)
    ban.stamp(dong_xu(), 109, 1)
    for r in range(60):
        half = 62 - r * 0.8
        x0, x1 = round(70 - half), round(70 + half)
        for x in range(x0, x1):
            base.set(x, 26 + r, "k" if r == 0 or x in (x0, x1 - 1) else ("g" if r < 3 else "K"))
    base.box(58, 85, 24, 12, "K")
    for r in range(18, 32):  # dải nhóm khách nằm gọn trong lòng phễu
        half = 62 - r * 0.8 - 1
        nhom.rect(round(70 - half), 26 + r, round(2 * half), 1, "l" if r == 18 else "v")
    nhom.stamp(nhom_khach(), 55, 45)
    brief.box(52, 100, 36, 24, "w").rect(55, 103, 16, 3, "B").rect(55, 109, 22, 2, "G").rect(55, 114, 18, 2, "G")
    brief.stamp(dau_tich(), 72, 109)
    for g, x in ((e1, 22), (e2, 70), (e3, 117)):
        for y in range(18 if x != 70 else 16, 26, 2):
            g.rect(x, y, 2, 1, "y")
    for y in range(97, 100):
        e4.rect(69, y, 2, 1, "y")
    return model("m-funnel", w, h, [("base", base), ("node:keo", keo), ("node:tin", tin), ("node:ban", ban),
                                    ("edge:keo-nhom", e1), ("edge:tin-nhom", e2), ("edge:ban-nhom", e3),
                                    ("node:nhom", nhom), ("edge:nhom-brief", e4), ("node:brief", brief)])


def assets() -> list[dict]:
    out = []
    for asset_id, shirt, shade, hair, hair_hi in (("tui", "o", "r", "h", "H"), ("anh-em", "B", "b", "h", "H"), ("phan-viet", "v", "V", "k", "K")):
        frames, durs, tags = character(shirt, shade, hair, hair_hi)
        out.append(actor(asset_id, frames, durs, tags, (10, 30, 4, 2), [("tay", 20, 4, 2, 2)]))
    out += [robot_ai(), kudo_dung(), kudo_actor(), ke_sach()]
    for asset_id, fn in (("dau-hoi", dau_hoi), ("share", share_icon), ("ban-laptop", ban_laptop), ("bang-lenh", bang_lenh),
                         ("bong-den", bong_den), ("cuon-giay", cuon_giay), ("khung-cau-truc", khung_cau_truc),
                         ("ngoi-but", ngoi_but), ("nut-dang", nut_dang), ("o-khoa", o_khoa), ("dau-tich", dau_tich),
                         ("dau-x", dau_x), ("dau-khac", dau_khac), ("thuoc-do", thuoc_do)):
        out.append(still(asset_id, fn()))
    for kind in ("xam", "day", "mau"):
        out.append(still(f"trang-{kind}", page(kind)))
    out.append(dual_track("m-dual-track-doc", 140, 128, 58, 8, 40, (6, 72), (94, 72)))
    out.append(dual_track("m-dual-track-ngang", 260, 116, 118, 8, 36, (42, 60), (178, 60)))
    out += [pyramid(), orbit(), funnel()]
    return out
