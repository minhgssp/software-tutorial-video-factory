#!/usr/bin/env python3
"""Dựng thư viện sprite qua Aseprite thật: định nghĩa Python → .aseprite → sheet + manifest.

Dùng: python3 asset_build.py [--sprites assets/sprites/core.py] [--library ~/Movies/pixel-explainer/_library] [--only id,id]
Sprite riêng của một run: python3 asset_build.py --sprites <run>/sprites.py --library <run>/work/library
(file đó được `from core import Grid, PAL, ...`; chỉ bộ gốc core.py mới được ghi vào thư viện chung).
Mỗi asset ra <library>/<id>/: <id>.aseprite, sheet.png, sheet.json (Aseprite CLI), manifest.json.
Sau khi xuất, đọc lại sheet và so từng pixel với định nghĩa gốc (khứ hồi); lệch là dừng.
Asset không đổi (source_sha256 trùng manifest) thì bỏ qua.
"""
from __future__ import annotations

import argparse
import hashlib
import importlib.util
import json
import re
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
ASEPRITE = Path("aseprite")
LUA = Path(__file__).with_name("aseprite_build.lua")
LIBRARY = Path("{{KUDO_WORK}}/pixel-explainer/_library")
BUILDER_SHA = hashlib.sha256(Path(__file__).read_bytes() + LUA.read_bytes()).hexdigest()[:16]
ID_RE = re.compile(r"^[a-z0-9]+(-[a-z0-9]+)*$")


def load_sprites(path: Path):
    spec = importlib.util.spec_from_file_location("sprites_core", path)
    module = importlib.util.module_from_spec(spec)
    for folder in (ROOT / "assets/sprites", path.parent):
        if str(folder) not in sys.path:
            sys.path.insert(0, str(folder))
    spec.loader.exec_module(module)
    return module


def to_doc(asset: dict, pal: dict) -> dict:
    used = sorted({c for layer in asset["layers"] for f in layer["frames"] for row in f.px for c in row} - {"."})
    nframes = max(len(layer["frames"]) for layer in asset["layers"])
    durations = list(asset["durations"]) + [asset["durations"][-1]] * (nframes - len(asset["durations"]))
    return {
        "id": asset["id"], "role": asset["role"], "w": asset["w"], "h": asset["h"],
        "colors": {c: pal[c] for c in used}, "palette": used, "nframes": nframes, "durations": durations[:nframes],
        "layers": [{"name": layer["name"], "frames": [["".join(r) for r in f.px] for f in layer["frames"]]} for layer in asset["layers"]],
        "tags": [list(t) for t in asset["tags"]], "slices": [list(s) for s in asset["slices"]],
    }


def critic(doc: dict) -> dict:
    issues = []
    names = [layer["name"] for layer in doc["layers"]]
    tags = {t[0]: t for t in doc["tags"]}
    slices = {s[0] for s in doc["slices"]}
    if not ID_RE.match(doc["id"]):
        issues.append("id phải là kebab-case")
    if len(set(doc["colors"].values())) > 32:
        issues.append("quá 32 màu")
    role = doc["role"]
    if role == "draw":
        staged = [n for n in names if re.match(r"^\d\d-[a-z0-9-]+$", n)]
        if len(staged) < 3:
            issues.append("draw cần ≥3 layer tên NN-<giai-đoạn>")
    elif role == "actor":
        idle = tags.get("idle")
        if not idle or idle[2] - idle[1] + 1 < 2:
            issues.append("actor cần tag idle ≥2 frame")
        if len([t for t in tags if t != "idle"]) < 1:
            issues.append("actor cần ≥1 tag hành động")
        if "anchor" not in slices:
            issues.append("actor cần slice anchor")
    elif role == "model":
        if "base" not in names or not any(n.startswith("node:") for n in names):
            issues.append("model cần layer base và node:<id>")
        nodes = {n[5:] for n in names if n.startswith("node:")}
        for n in names:
            if n.startswith("edge:"):
                ends = n[5:].split("-")
                # id node có thể chứa '-', nên chỉ cần hai đầu ghép lại khớp được tên node.
                if not any(n[5:] == f"{a}-{b}" for a in nodes for b in nodes):
                    issues.append(f"{n}: hai đầu không khớp node ({ends})")
    elif role == "still":
        if doc["nframes"] != 1:
            issues.append("still chỉ 1 frame")
    else:
        issues.append(f"role lạ: {role}")
    return {"verdict": "PASS" if not issues else "FAIL", "issues": issues, "checks": ["palette<=32", "id", f"role:{role}", "roundtrip"]}


def roundtrip(doc: dict, sheet_png: Path, sheet_json: Path) -> list[str]:
    data = json.loads(sheet_json.read_text())
    sheet = Image.open(sheet_png).convert("RGBA")
    rects = {}
    for fr in data["frames"]:
        layer, frame = fr["filename"].rsplit("|", 1)
        rects[(layer, int(frame))] = fr["frame"]
    errors = []
    for layer in doc["layers"]:
        for fi in range(doc["nframes"]):
            rows = layer["frames"][min(fi, len(layer["frames"]) - 1)]
            rect = rects.get((layer["name"], fi))
            if rect is None:
                errors.append(f"thiếu {layer['name']}|{fi}")
                continue
            crop = sheet.crop((rect["x"], rect["y"], rect["x"] + rect["w"], rect["y"] + rect["h"]))
            for y, row in enumerate(rows):
                for x, ch in enumerate(row):
                    r, g, b, a = crop.getpixel((x, y))
                    want = None if ch == "." else doc["colors"][ch].lower()
                    got = None if a == 0 else f"#{r:02x}{g:02x}{b:02x}"
                    if want != got:
                        errors.append(f"{layer['name']}|{fi} ({x},{y}) muốn {want} có {got}")
                        break
                else:
                    continue
                break
    return errors


def build(doc: dict, library: Path) -> dict:
    out = library / doc["id"]
    out.mkdir(parents=True, exist_ok=True)
    blob = json.dumps(doc, sort_keys=True, ensure_ascii=False).encode()
    source_sha = hashlib.sha256(blob).hexdigest()
    manifest_path = out / "manifest.json"
    if manifest_path.is_file():
        old = json.loads(manifest_path.read_text())
        if old.get("source_sha256") == source_sha and old["critic"]["verdict"] == "PASS" and old.get("builder_sha256") == BUILDER_SHA and all((out / f).is_file() for f in (f"{doc['id']}.aseprite", "sheet.png", "sheet.json")):
            return {"id": doc["id"], "status": "cached", "critic": old["critic"]["verdict"]}
    doc_path = out / "source.json"
    doc_path.write_bytes(blob)
    ase = out / f"{doc['id']}.aseprite"
    subprocess.run([str(ASEPRITE), "-b", "--script-param", f"doc={doc_path}", "--script-param", f"out={ase}", "--script", str(LUA)],
                   check=True, capture_output=True, text=True)
    # Thứ tự quan trọng: tuỳ chọn tách layer/tên frame phải đứng trước file nguồn.
    subprocess.run([str(ASEPRITE), "-b", "--split-layers", "--filename-format", "{layer}|{frame}",
                    "--list-layers", "--list-tags", "--list-slices", str(ase),
                    "--sheet", str(out / "sheet.png"), "--data", str(out / "sheet.json"), "--format", "json-array", "--sheet-pack"],
                   check=True, capture_output=True, text=True)
    errors = roundtrip(doc, out / "sheet.png", out / "sheet.json")
    verdict = critic(doc)
    if errors:
        verdict["verdict"] = "FAIL"
        verdict["issues"] += errors[:5]
    meta = json.loads((out / "sheet.json").read_text())["meta"]
    manifest = {
        "id": doc["id"], "role": doc["role"], "size": [doc["w"], doc["h"]],
        "palette": [doc["colors"][c] for c in doc["palette"]],
        "layers": [layer["name"] for layer in meta.get("layers", [])],
        "frames": doc["nframes"], "durations_ms": doc["durations"],
        "tags": [{"name": t["name"], "from": t["from"], "to": t["to"]} for t in meta.get("frameTags", [])],
        "slices": [{"name": s["name"], **s["keys"][0]["bounds"]} for s in meta.get("slices", [])],
        "source_sha256": source_sha, "builder_sha256": BUILDER_SHA, "critic": verdict,
        "aseprite": meta.get("version"), "created_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "license": "self-made",
    }
    manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=1) + "\n")
    return {"id": doc["id"], "status": "built", "critic": verdict["verdict"], "issues": verdict["issues"]}


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--sprites", type=Path, default=ROOT / "assets/sprites/core.py")
    parser.add_argument("--library", type=Path, default=LIBRARY)
    parser.add_argument("--only", default="")
    args = parser.parse_args()
    if args.sprites.resolve() != (ROOT / "assets/sprites/core.py").resolve() and args.library.resolve() == LIBRARY.resolve():
        raise SystemExit("Sprite riêng của run phải ghi vào <run>/work/library (--library), không ghi vào thư viện chung.")
    module = load_sprites(args.sprites)
    only = set(filter(None, args.only.split(",")))
    results = []
    for asset in module.assets():
        if only and asset["id"] not in only:
            continue
        result = build(to_doc(asset, module.PAL), args.library)
        results.append(result)
        print(json.dumps(result, ensure_ascii=False), flush=True)
    failed = [r for r in results if r["critic"] != "PASS"]
    if failed:
        raise SystemExit(f"CRITIC_FAIL: {[r['id'] for r in failed]}")


if __name__ == "__main__":
    main()
