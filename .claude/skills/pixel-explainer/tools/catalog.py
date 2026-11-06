#!/usr/bin/env python3
"""Liệt kê sprite có thể dùng: vai, kích thước (ô lưới), layer, tag hoạt cảnh, slice.

Dùng: python3 catalog.py [--run <run>] [--library DIR …] [--sheet out.png] [--json]

Thứ tự tìm giống build.py: <run>/work/library (sprite riêng của run), các --library, rồi thư viện chung.
--sheet: ghép khung đầu (đủ mọi layer) của từng sprite thành một ảnh để NHÌN trước khi chọn — tên không đủ
để biết hình trông thế nào.
"""
from __future__ import annotations

import argparse
import json
from pathlib import Path

SHARED_LIBRARY = Path("{{KUDO_WORK}}/pixel-explainer/_library")


def libraries(run: Path | None, extra: list[Path]) -> list[Path]:
    libs = [run / "work/library"] if run and (run / "work/library").is_dir() else []
    libs += [p.resolve() for p in extra if p.is_dir()]
    libs.append(SHARED_LIBRARY)
    return libs


def collect(libs: list[Path]) -> list[dict]:
    seen, out = set(), []
    for lib in libs:
        for mf in sorted(lib.glob("*/manifest.json")):
            m = json.loads(mf.read_text())
            if m["id"] in seen:
                continue
            seen.add(m["id"])
            out.append({
                "id": m["id"], "role": m["role"], "size": m["size"], "frames": m["frames"],
                "layers": m["layers"], "tags": [t["name"] for t in m.get("tags", [])],
                "slices": [s["name"] for s in m.get("slices", [])], "library": str(lib), "dir": str(mf.parent),
            })
    return out


def first_frame(entry: dict):
    from PIL import Image
    d = Path(entry["dir"])
    sheet = Image.open(d / "sheet.png").convert("RGBA")
    meta = json.loads((d / "sheet.json").read_text())
    w, h = entry["size"]
    im = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    for fr in meta["frames"]:
        name, idx = fr["filename"].rsplit("|", 1)
        if idx != "0":
            continue
        f, s = fr["frame"], fr["spriteSourceSize"]
        cel = sheet.crop((f["x"], f["y"], f["x"] + f["w"], f["y"] + f["h"]))
        im.alpha_composite(cel, (s["x"], s["y"]))
    return im


def contact(entries: list[dict], out: Path, cell: int = 200) -> None:
    from PIL import Image, ImageDraw
    cols = 6
    rows = -(-len(entries) // cols)
    sheet = Image.new("RGB", (cols * cell, rows * (cell + 34)), (26, 28, 44))
    dr = ImageDraw.Draw(sheet)
    for i, e in enumerate(entries):
        im = first_frame(e)
        k = max(1, min((cell - 16) // im.width, (cell - 16) // im.height))
        im = im.resize((im.width * k, im.height * k), Image.NEAREST)
        x0, y0 = (i % cols) * cell, (i // cols) * (cell + 34)
        sheet.paste(im, (x0 + (cell - im.width) // 2, y0 + (cell - im.height) // 2), im)
        dr.text((x0 + 6, y0 + cell + 2), f"{e['id']}", fill=(255, 205, 117))
        dr.text((x0 + 6, y0 + cell + 16), f"{e['role']} {e['size'][0]}x{e['size'][1]}", fill=(148, 176, 194))
    sheet.save(out)


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--run", type=Path)
    ap.add_argument("--library", type=Path, action="append", default=[])
    ap.add_argument("--sheet", type=Path)
    ap.add_argument("--json", action="store_true")
    a = ap.parse_args()
    entries = collect(libraries(a.run.resolve() if a.run else None, a.library))
    if a.json:
        print(json.dumps(entries, ensure_ascii=False, indent=1))
    else:
        for role in ("model", "actor", "draw", "still"):
            group = [e for e in entries if e["role"] == role]
            if not group:
                continue
            print(f"\n== {role} ({len(group)})")
            for e in group:
                extra = []
                if len(e["layers"]) > 1:
                    extra.append("layers=" + ",".join(e["layers"]))
                if e["tags"]:
                    extra.append("tags=" + ",".join(e["tags"]))
                if e["slices"]:
                    extra.append("slices=" + ",".join(e["slices"]))
                print(f"  {e['id']:<20} {e['size'][0]:>3}x{e['size'][1]:<3} ô  {'  '.join(extra)}")
    if a.sheet:
        contact(entries, a.sheet)
        print(f"\nảnh tổng hợp: {a.sheet}")


if __name__ == "__main__":
    main()
