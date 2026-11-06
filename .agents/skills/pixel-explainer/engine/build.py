#!/usr/bin/env python3
"""Đóng gói một khung hình (dọc/ngang) thành dự án HyperFrames: index.html + assets.

Dùng: python3 build.py --run RUN_DIR --orient doc|ngang --out PROJECT_DIR [--library DIR ...] [--audio WAV]
Sprite tìm theo thứ tự: <run>/work/library (nếu có), các --library khai thêm, rồi thư viện chung.
Đọc: RUN/work/direction-<orient>.json (cảnh), RUN/work/voice_timeline.json (thời điểm từng từ),
RUN/docs/performance.txt (cụm phụ đề tách bằng / và //).
Sprite lấy từ thư viện Aseprite (sheet.png + sheet.json); mỗi cel cắt sát, quy về chỉ số palette chung,
trùng thì dùng lại. Engine mặc định là engine.js cùng thư mục (đổi bằng --engine); dữ liệu nhúng vào chỗ __DATA__.
"""
from __future__ import annotations

import argparse
import base64
import json
import shutil
from pathlib import Path

from PIL import Image

HERE = Path(__file__).resolve().parent
SKILL = HERE.parent
FONTS = SKILL / "assets/fonts"
LIBRARY = Path("{{KUDO_WORK}}/pixel-explainer/_library")
HF = "0.8.135"

VI = "U+0102-0103,U+0110-0111,U+0128-0129,U+0168-0169,U+01A0-01A1,U+01AF-01B0,U+0300-0301,U+0303-0304,U+0308-0309,U+0323,U+0329,U+1EA0-1EF9,U+20AB"
LX = "U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF"
LA = "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD"
FACES = [("VT323", "vt323", 400), ("Be Vietnam Pro", "be-vietnam-pro", 700), ("Be Vietnam Pro", "be-vietnam-pro", 900),
         ("JetBrains Mono", "jetbrains-mono", 500)]
SUBSETS = [("vietnamese", VI), ("latin-ext", LX), ("latin", LA)]

# Khung hình: kích thước px, vùng an toàn [x0, y0, x1, y1] px, vùng nội dung (vùng an toàn trừ dải phụ đề,
# camera chỉ đóng khung trong vùng này), cỡ và vị trí phụ đề.
FRAMES = {
    "doc": {"W": 1080, "H": 1920, "safe": [90, 170, 950, 1460], "content": [90, 170, 950, 1290],
            "sub": {"size": 44, "maxw": 860, "padX": 30, "padY": 18, "bottom": 1458}},
    "ngang": {"W": 1920, "H": 1080, "safe": [96, 54, 1824, 1026], "content": [96, 54, 1824, 930],
              "sub": {"size": 40, "maxw": 1500, "padX": 30, "padY": 14, "bottom": 1020}},
}


def font_css() -> str:
    out = []
    for family, slug, weight in FACES:
        for sub, rng in SUBSETS:
            out.append(f"@font-face{{font-family:'{family}';font-style:normal;font-weight:{weight};font-display:block;"
                       f"src:url(assets/fonts/{slug}-{sub}-{weight}-normal.woff2) format('woff2');unicode-range:{rng};}}")
    return "\n".join(out)


class Pack:
    """Gom sprite từ thư viện thành palette chung + danh sách cel đã khử trùng."""

    def __init__(self, libraries: list[Path]):
        self.libraries = libraries
        self.palette: list[str] = []
        self.pindex: dict[str, int] = {}
        self.cels: list[dict] = []
        self.seen: dict[tuple, int] = {}
        self.sprites: dict[str, dict] = {}

    def color(self, rgb: tuple[int, int, int]) -> int:
        h = "#%02x%02x%02x" % rgb
        if h not in self.pindex:
            self.palette.append(h)
            self.pindex[h] = len(self.palette)
        return self.pindex[h]

    def cel(self, img: Image.Image) -> int:
        box = img.getchannel("A").getbbox()
        if not box:
            return -1
        crop = img.crop(box)
        w, h = crop.size
        px = crop.load()
        data = bytearray(w * h)
        for y in range(h):
            for x in range(w):
                r, g, b, a = px[x, y]
                data[y * w + x] = self.color((r, g, b)) if a else 0
        key = (box[0], box[1], w, h, bytes(data))
        if key not in self.seen:
            self.seen[key] = len(self.cels)
            self.cels.append({"x": box[0], "y": box[1], "w": w, "h": h, "d": base64.b64encode(bytes(data)).decode()})
        return self.seen[key]

    def sprite(self, sid: str) -> None:
        if sid in self.sprites:
            return
        folder = next((lib / sid for lib in self.libraries if (lib / sid / "manifest.json").is_file()), None)
        if folder is None:
            raise SystemExit(f"{sid}: không có trong thư viện nào ({', '.join(map(str, self.libraries))})")
        manifest = json.loads((folder / "manifest.json").read_text())
        if manifest["critic"]["verdict"] != "PASS":
            raise SystemExit(f"{sid}: manifest chưa PASS")
        sheet = json.loads((folder / "sheet.json").read_text())
        png = Image.open(folder / "sheet.png").convert("RGBA")
        rects = {}
        for fr in sheet["frames"]:
            layer, frame = fr["filename"].rsplit("|", 1)
            rects[(layer, int(frame))] = fr["frame"]
        layers = [l["name"] for l in sheet["meta"]["layers"]]
        n = manifest["frames"]
        cels = []
        for name in layers:
            row = []
            for fi in range(n):
                r = rects.get((name, fi))
                row.append(-1 if r is None else self.cel(png.crop((r["x"], r["y"], r["x"] + r["w"], r["y"] + r["h"]))))
            cels.append(row)
        w, h = manifest["size"]
        self.sprites[sid] = {
            "w": w, "h": h, "layers": layers, "nframes": n, "durations": manifest["durations_ms"],
            "tags": {t["name"]: [t["from"], t["to"]] for t in manifest["tags"]}, "cels": cels,
            "role": manifest.get("role"),
        }


def clusters(performance: str) -> list[list[str]]:
    out = []
    for chunk in performance.replace("//", "/").split("/"):
        words = [w for w in chunk.split() if w != "…"]
        if words:
            out.append(words)
    return out


def subtitles(run: Path, offset: float, hide: list[list[float]]) -> list[dict]:
    words = json.loads((run / "work/voice_timeline.json").read_text())["words"]
    groups = clusters((run / "docs/performance.txt").read_text())
    flat = [w for g in groups for w in g]
    if len(flat) != len(words):
        raise SystemExit(f"phụ đề lệch: {len(flat)} từ trong performance, {len(words)} từ trong timeline")
    for a, b in zip(flat, words):
        if a.strip(".,?!").lower() != b["text"].strip(".,?!").lower():
            raise SystemExit(f"phụ đề lệch tại '{a}' / '{b['text']}'")
    subs, i = [], 0
    for g in groups:
        ws = words[i:i + len(g)]
        subs.append({"from": round(ws[0]["start_ms"] / 1000 + offset, 3),
                     "words": [{"text": w["text"], "t": round(w["start_ms"] / 1000 + offset, 3)} for w in ws],
                     "end": round(ws[-1]["end_ms"] / 1000 + offset, 3)})
        i += len(g)
    for k, s in enumerate(subs):
        nxt = subs[k + 1]["from"] if k + 1 < len(subs) else s["end"] + 1.2
        # Cụm cuối câu giữ thêm tối đa 1,2 giây nếu khoảng lặng dài, không để trống chữ giữa hai cụm sát nhau.
        s["to"] = round(min(nxt, s["end"] + 1.2), 3)
        del s["end"]
    return [s for s in subs if not any(a <= s["from"] < b for a, b in hide)]


def collect_sprites(scenes: list[dict]) -> list[str]:
    ids = []
    for sc in scenes:
        for it in sc["items"]:
            if it["kind"] == "sprite" and it["sprite"] not in ids:
                ids.append(it["sprite"])
    return ids


def collect_photos(run: Path, scenes: list[dict], block: int = 6) -> dict:
    """Ảnh thật (kind "photo"): đọc it["src"] (đường dẫn tương đối với run), thu về đúng w×h block × 2 (nét khi camera
    phóng), nhúng JPEG data URI. Thiếu h thì tính theo tỉ lệ ảnh; ghi h ngược lại vào item."""
    import base64
    import io
    out: dict[str, dict] = {}
    for sc in scenes:
        for it in sc["items"]:
            if it["kind"] != "photo":
                continue
            src = (run / it.pop("src")).resolve() if "src" in it else None
            pid = it["photo"]
            if pid in out:
                it.setdefault("h", out[pid]["h"])
                continue
            if not src or not src.is_file():
                raise SystemExit(f"photo {pid}: thiếu file src")
            im = Image.open(src).convert("RGB")
            if it.get("crop"):
                l, t_, r, b = it.pop("crop")
                im = im.crop((round(l * im.width), round(t_ * im.height), round(r * im.width), round(b * im.height)))
            it.setdefault("h", max(1, round(it["w"] * im.height / im.width)))
            im = im.resize((it["w"] * block * 2, it["h"] * block * 2), Image.LANCZOS)
            buf = io.BytesIO()
            im.save(buf, "JPEG", quality=88)
            out[pid] = {"src": "data:image/jpeg;base64," + base64.b64encode(buf.getvalue()).decode(), "w": it["w"], "h": it["h"]}
    return out


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--run", type=Path, required=True)
    ap.add_argument("--orient", choices=list(FRAMES), required=True)
    ap.add_argument("--out", type=Path, required=True)
    ap.add_argument("--library", type=Path, action="append", default=[])
    ap.add_argument("--audio", type=Path)
    ap.add_argument("--engine", type=Path, default=HERE / "engine.js")
    args = ap.parse_args()
    run, out = args.run.resolve(), args.out.resolve()
    direction = json.loads((run / f"work/direction-{args.orient}.json").read_text())
    fr = FRAMES[args.orient]
    libs = [run / "work/library"] if (run / "work/library").is_dir() else []
    libs += [lib.resolve() for lib in args.library if lib.resolve() not in libs]
    if LIBRARY not in libs:
        libs.append(LIBRARY)
    pack = Pack(libs)
    for sid in collect_sprites(direction["scenes"]):
        pack.sprite(sid)
    hide = [[sc["from"], direction["scenes"][k + 1]["from"] if k + 1 < len(direction["scenes"]) else direction["dur"]]
            for k, sc in enumerate(direction["scenes"]) if sc.get("noSubs")]
    data = {
        "W": fr["W"], "H": fr["H"], "block": 6, "safe": fr["safe"], "content": fr["content"], "sub": fr["sub"], "dur": direction["dur"],
        "palette": pack.palette, "sprites": pack.sprites, "cels": pack.cels, "scenes": direction["scenes"],
        "subs": subtitles(run, direction["offset"], hide),
        "photos": collect_photos(run, direction["scenes"]),
    }
    engine = args.engine.read_text()
    dur = direction["dur"]
    css = (f"html,body{{margin:0;padding:0;background:#1a1c2c;width:{fr['W']}px;height:{fr['H']}px;overflow:hidden}}"
           f"#stage{{display:block;width:{fr['W']}px;height:{fr['H']}px;image-rendering:pixelated}}")
    html = (
        f'<!doctype html><html lang="vi"><head><meta charset="UTF-8" />'
        f'<meta name="viewport" content="width={fr["W"]}, height={fr["H"]}" />\n'
        f'<script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>'
        f"<style>{font_css()}\n{css}</style></head><body>\n"
        f'<div id="root" data-composition-id="main" data-start="0" data-duration="{dur}" '
        f'data-width="{fr["W"]}" data-height="{fr["H"]}">\n'
        f'<canvas id="stage" width="{fr["W"]}" height="{fr["H"]}"></canvas>\n'
        f'<audio id="song" src="assets/song.wav" data-start="0" data-duration="{dur}" data-track-index="0" data-volume="1"></audio>\n'
        f"</div><script>{engine.replace('__DATA__', json.dumps(data, ensure_ascii=False, separators=(',', ':')))}</script>"
        f"</body></html>\n"
    )
    (out / "assets/fonts").mkdir(parents=True, exist_ok=True)
    (out / "index.html").write_text(html)
    (out / "hyperframes.json").write_text(json.dumps({
        "$schema": "https://hyperframes.heygen.com/schema/hyperframes.json",
        "registry": "https://raw.githubusercontent.com/heygen-com/hyperframes/main/registry",
        "paths": {"blocks": "compositions", "components": "compositions/components", "assets": "assets"},
        "media": {"autoProxy": True}}, indent=2) + "\n")
    (out / "package.json").write_text(json.dumps({
        "name": "project", "private": True, "type": "module",
        "scripts": {k: f"npx --yes hyperframes@{HF} {k if k != 'dev' else 'preview'}" for k in ("dev", "check", "render", "publish")}},
        indent=2) + "\n")
    for _, slug, weight in FACES:
        for sub, _ in SUBSETS:
            name = f"{slug}-{sub}-{weight}-normal.woff2"
            shutil.copyfile(FONTS / name, out / "assets/fonts" / name)
    lic = out / "assets/fonts/LICENSES"
    lic.mkdir(exist_ok=True)
    for f in (FONTS / "LICENSES").iterdir():
        shutil.copyfile(f, lic / f.name)
    audio = args.audio or run / "work/mix-final.wav"
    shutil.copyfile(audio, out / "assets/song.wav")
    print(json.dumps({"out": str(out), "sprites": len(pack.sprites), "cels": len(pack.cels), "palette": len(pack.palette),
                      "subs": len(data["subs"]), "html_kb": round(len(html.encode()) / 1024)}, ensure_ascii=False))


if __name__ == "__main__":
    main()
