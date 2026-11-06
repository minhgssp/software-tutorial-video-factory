"""A review page of every scene's regions → review/regions.html (for machines without the Studio).

Usage: review-regions.py <project-dir>
Each scene's image with its numbered boxes, protected areas and pen directions, and a table of its regions (number,
label, role, start, end, subtitle). The page links the images in video/scenes/, so open it from the project folder
in any browser; the user asks for changes in chat and the agent edits the annotation files, then runs
check-regions.py and this again.
"""
import html
import json
import sys

sys.dont_write_bytecode = True  # keep the skill folder clean (no __pycache__ next to the scripts)
from wb_common import SCENES, load_scenes, project_dir, scene_image, scene_name  # noqa: E402

proj = project_dir()
sdir = proj / "video/scenes"
names = [scene_name(s) for s in load_scenes(proj)] if (proj / SCENES).exists() else \
    [f.name[:-len(".annotation.json")] for f in sorted(sdir.glob("*.annotation.json"))]
e_ = html.escape
parts = []
for name in names:
    f = sdir / f"{name}.annotation.json"
    img = scene_image(proj, name)
    if not f.exists() or img is None:
        parts.append(f"<section><h2>{e_(name)}</h2><p class=bad>missing {'annotation' if not f.exists() else 'image'}</p></section>")
        continue
    ann = json.loads(f.read_text(encoding="utf8"))
    W, H = ann["canvas"]["width"], ann["canvas"]["height"]
    els = sorted(ann.get("elements", []), key=lambda e: e["reveal"]["startMs"])
    svg, rows = [], []
    for i, el in enumerate(els, 1):
        r = el["region"]
        hue = (i - 1) * 67 % 360
        svg.append(f'<rect x="{r["x"]}" y="{r["y"]}" width="{r["width"]}" height="{r["height"]}" style="stroke:hsl({hue} 80% 40%);fill:hsl({hue} 80% 40% / .12)"/>'
                   f'<text x="{r["x"] + 10}" y="{r["y"] + 44}" style="fill:hsl({hue} 80% 30%)">{i}</text>')
        for p in (el["reveal"].get("protectedRegions") or []):
            svg.append(f'<rect class=prot x="{p["x"]}" y="{p["y"]}" width="{p["width"]}" height="{p["height"]}"/>')
        hp = el.get("handPath") or {}
        if hp.get("start") and hp.get("end"):
            svg.append(f'<line x1="{hp["start"][0]}" y1="{hp["start"][1]}" x2="{hp["end"][0]}" y2="{hp["end"][1]}" '
                       f'style="stroke:hsl({hue} 80% 40%)" marker-end="url(#arrow)"/>')
        s, d = el["reveal"]["startMs"], el["reveal"]["durationMs"]
        rows.append(f"<tr><td>{i}</td><td>{e_(str(el.get('label') or el.get('id')))}</td><td>{e_(str(el.get('narrativeRole') or ''))}</td>"
                    f"<td>{s / 1000:.1f}</td><td>{(s + d) / 1000:.1f}</td><td>{e_(str(el.get('subtitle') or ''))}</td></tr>")
    parts.append(f'<section><h2>{e_(name)} <small>{W}×{H}, {ann.get("sceneDurationMs", 0) / 1000:.1f} s</small></h2>'
                 f'<div class=pic><img src="../video/scenes/{e_(img.name)}"><svg viewBox="0 0 {W} {H}">{"".join(svg)}</svg></div>'
                 f'<table><tr><th>#</th><th>Region</th><th>Role</th><th>Start s</th><th>End s</th><th>Subtitle</th></tr>{"".join(rows)}</table></section>')
page = f"""<!doctype html><html><head><meta charset="utf-8"><title>Regions</title><style>
body{{font:15px/1.4 sans-serif;margin:24px;background:#faf7ef;color:#222}} section{{margin-bottom:40px}}
.pic{{position:relative;max-width:1100px}} .pic img{{width:100%;display:block}} .pic svg{{position:absolute;inset:0;width:100%;height:100%}}
rect{{stroke-width:5}} rect.prot{{fill:none;stroke:#b00020;stroke-dasharray:14 10}} line{{stroke-width:5}}
text{{font:bold 44px sans-serif}} table{{border-collapse:collapse;margin-top:10px}} td,th{{border:1px solid #ccc;padding:4px 8px;text-align:left}}
.bad{{color:#b00020}}</style></head><body><svg width="0" height="0"><defs><marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5"
markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10z"/></marker></defs></svg>
<h1>Regions: what each scene draws and when</h1><p>Numbers follow the drawing order (startMs). Dashed red: protected areas.</p>
{"".join(parts)}</body></html>
"""
out = proj / "review/regions.html"
out.parent.mkdir(parents=True, exist_ok=True)
out.write_text(page, encoding="utf8")
print(f"{len(names)} scene(s) → {out}  (open it in a browser; changes are asked in chat)")
