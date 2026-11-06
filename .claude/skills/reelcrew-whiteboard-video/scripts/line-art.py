"""One line-art image per scene → video/scenes/<scene>.png, through `reelcrew image create` (paid: ask first).

Usage: line-art.py <project-dir> [--only scene-02,scene-03] [--force] [--dry-run]
The prompt is prompts/line-art.txt (the visual rules every scene shares) followed by the scene's "subject" from
scenes.json (written at stop 1); it is saved as prompts/<scene>.txt. The frame follows whiteboard.json "aspect".
Every call passes --reuse: an image already made from the same prompt is taken from the reelcrew library at no cost.
An image already at video/scenes/<scene>.png|.jpg is kept (the user's own, or one made by the agent) unless --force.
--dry-run writes the prompts and lists what would be made, with no call. Images are made one after another.
"""
import json
import sys

sys.dont_write_bytecode = True  # keep the skill folder clean (no __pycache__ next to the scripts)
from wb_common import SCENES, arg, image_size, load, load_scenes, project_dir, reelcrew, scene_image, scene_name  # noqa: E402

proj = project_dir()
cfg = load(proj)
scenes = load_scenes(proj)
only = [s for s in (arg("--only") or "").split(",") if s]
rules = (proj / "prompts/line-art.txt").read_text(encoding="utf8").strip()
todo = []
for s in scenes:
    name = scene_name(s)
    if only and name not in only:
        continue
    if not (s.get("subject") or "").strip():
        raise SystemExit(f"{name} has no \"subject\" in {SCENES}: write what its picture shows (stop 1) first")
    prompt = proj / f"prompts/{name}.txt"
    prompt.write_text(f"{rules}\n\nScene: {s['subject'].strip()}\n", encoding="utf8")
    have = scene_image(proj, name)
    if have and "--force" not in sys.argv:
        print(f"{name}: kept {have.relative_to(proj)} {image_size(have)}")
        continue
    todo.append((name, prompt))
if "--dry-run" in sys.argv or not todo:
    for name, prompt in todo:
        print(f"{name}: would make video/scenes/{name}.png from {prompt.relative_to(proj)}")
    raise SystemExit(0)
for name, prompt in todo:
    out = proj / f"video/scenes/{name}.png"
    r = reelcrew("image", "create", "--prompt-file", prompt, "--aspect", cfg["aspect"], "--out", out, "--reuse")
    item = (r.get("results") or [r])[0]
    print(f"{name}: {'reused from the library' if item.get('reused') else 'new'} → video/scenes/{name}.png {image_size(out)}")
print(json.dumps({"made": [n for n, _ in todo]}))
print("next: show the images to the user (stop 2), then the regions (step 5)")
