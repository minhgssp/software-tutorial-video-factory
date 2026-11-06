"""Check every scene's video/scenes/<scene>.annotation.json before the user sees it, and after every change.

Usage: check-regions.py <project-dir> [--only scene-02]
Errors (exit 1): an annotation that is missing or not JSON; no image; "canvas" not the image's pixel size; no
elements; a region or protectedRegions box that is not whole pixels inside the canvas, or is empty; ids not unique;
"sequence" not 1..n; "reveal.startMs" below 0 or "durationMs" under 100.
Warnings: the sequence order differs from the startMs order (the drawing follows startMs); regions overlap in time
(one pen draws them one after another); a region ends after its scene (the next scene starts over it); no
"subtitle" or "narrativeRole"; two boxes overlap with no protectedRegions on the earlier one (the later region cuts
its pixels out of the earlier one's mask).
"""
import json
import sys

sys.dont_write_bytecode = True  # keep the skill folder clean (no __pycache__ next to the scripts)
from wb_common import SCENES, VO, arg, duration, image_size, load, project_dir, scene_image, scene_name  # noqa: E402

proj = project_dir()
cfg = load(proj)
hold = (cfg.get("engine") or {}).get("holdMs", 1000)
sdir = proj / "video/scenes"
if (proj / SCENES).exists():
    plan = json.loads((proj / SCENES).read_text(encoding="utf8")).get("scenes", [])
    names = [scene_name(s) for s in plan]
    starts = [0] + [int(s["startMs"]) for s in plan[1:]]
else:
    names = [f.name[:-len(".annotation.json")] for f in sorted(sdir.glob("*.annotation.json"))]
    starts = []
voice_ms = round(duration(proj / VO) * 1000) if (proj / VO).exists() and starts else None
only = [s for s in (arg("--only") or "").split(",") if s]
errors, warnings = [], []
is_int = lambda v: isinstance(v, int) and not isinstance(v, bool)  # noqa: E731


def box_ok(where, b, W, H):
    if not isinstance(b, dict) or not all(is_int(b.get(k)) for k in ("x", "y", "width", "height")):
        errors.append(f"{where}: x, y, width, height must be whole pixels")
        return False
    if b["width"] <= 0 or b["height"] <= 0 or b["x"] < 0 or b["y"] < 0 or b["x"] + b["width"] > W or b["y"] + b["height"] > H:
        errors.append(f"{where}: {b['x']},{b['y']} {b['width']}x{b['height']} is not inside the {W}x{H} canvas")
        return False
    return True


for k, name in enumerate(names):
    if only and name not in only:
        continue
    f = sdir / f"{name}.annotation.json"
    img = scene_image(proj, name)
    if img is None:
        errors.append(f"{name}: no image video/scenes/{name}.png (or .jpg)")
    if not f.exists():
        errors.append(f"{name}: no {f.relative_to(proj)}")
        continue
    try:
        ann = json.loads(f.read_text(encoding="utf8"))
    except ValueError as e:
        errors.append(f"{name}: {f.name} is not valid JSON: {e}")
        continue
    canvas = ann.get("canvas") or {}
    W, H = canvas.get("width"), canvas.get("height")
    size = image_size(img) if img else None
    if not (is_int(W) and is_int(H) and W > 0 and H > 0):
        errors.append(f"{name}: canvas.width and canvas.height must be positive whole pixels")
        continue
    if size and (W, H) != tuple(size):
        errors.append(f"{name}: canvas is {W}x{H} but the image is {size[0]}x{size[1]}: use the image's pixel size")
    els = ann.get("elements") or []
    if not els:
        errors.append(f"{name}: no elements")
        continue
    ids = [e.get("id") for e in els]
    if len(set(ids)) != len(ids) or None in ids:
        errors.append(f"{name}: every element needs its own id")
    if sorted(e.get("sequence") for e in els if is_int(e.get("sequence"))) != list(range(1, len(els) + 1)):
        errors.append(f"{name}: sequence must run 1..{len(els)}")
    for e in els:
        at = f"{name} {e.get('id')}"
        box_ok(f"{at} region", e.get("region"), W, H)
        rv = e.get("reveal") or {}
        if not is_int(rv.get("startMs")) or rv["startMs"] < 0:
            errors.append(f"{at}: reveal.startMs must be whole ms ≥ 0")
        if not is_int(rv.get("durationMs")) or rv["durationMs"] < 100:
            errors.append(f"{at}: reveal.durationMs must be whole ms ≥ 100")
        for i, p in enumerate(rv.get("protectedRegions") or []):
            box_ok(f"{at} protectedRegions[{i}]", p, W, H)
        for field in ("subtitle", "narrativeRole"):
            if not str(e.get(field) or "").strip():
                warnings.append(f"{at}: no {field}")
    timed = [e for e in els if is_int((e.get("reveal") or {}).get("startMs")) and is_int((e.get("reveal") or {}).get("durationMs"))]
    by_start = sorted(timed, key=lambda e: e["reveal"]["startMs"])
    if [e.get("id") for e in by_start] != [e.get("id") for e in sorted(timed, key=lambda e: e.get("sequence") or 0)]:
        warnings.append(f"{name}: the sequence order differs from the startMs order; the drawing follows startMs")
    for a, b in zip(by_start, by_start[1:]):
        if b["reveal"]["startMs"] < a["reveal"]["startMs"] + a["reveal"]["durationMs"]:
            warnings.append(f"{name}: {b.get('id')} starts before {a.get('id')} ends; one pen draws them one after another")
    if starts and by_start:
        last = by_start[-1]["reveal"]
        end = last["startMs"] + last["durationMs"]
        window = (starts[k + 1] - starts[k]) if k + 1 < len(starts) else ((voice_ms + hold - starts[k]) if voice_ms else None)
        if window is not None and end + 500 > window:
            warnings.append(f"{name}: the last region ends at {end / 1000:.1f}s, the scene lasts {window / 1000:.1f}s "
                            f"(with the 0.5 s hold): shorten or start the regions earlier")
    for i, a in enumerate(by_start):
        for b in by_start[i + 1:]:
            ra, rb = a.get("region") or {}, b.get("region") or {}
            if not all(is_int(r.get(x)) for r in (ra, rb) for x in ("x", "y", "width", "height")):
                continue
            ox = min(ra["x"] + ra["width"], rb["x"] + rb["width"]) - max(ra["x"], rb["x"])
            oy = min(ra["y"] + ra["height"], rb["y"] + rb["height"]) - max(ra["y"], rb["y"])
            if ox > 0 and oy > 0 and not (a.get("reveal") or {}).get("protectedRegions"):
                warnings.append(f"{name}: {a.get('id')} and {b.get('id')} overlap by {ox}x{oy} px: the overlap belongs to "
                                f"{b.get('id')} (drawn later); add protectedRegions if a subject of {a.get('id')} must stay out")
for w in warnings:
    print(f"warning: {w}")
for e in errors:
    print(f"error: {e}")
print(f"{len(names) if not only else len(only)} scene(s): {len(errors)} errors, {len(warnings)} warnings")
raise SystemExit(1 if errors else 0)
