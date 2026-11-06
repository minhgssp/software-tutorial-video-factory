"""The scenes on one timeline → video/timeline.js, then the page's own check (`reelcrew render --data`).

Usage: build-timeline.py <project-dir> [--no-check]
Lists the scenes of scenes.json (scene-01, scene-02 …, or each scene's "name") with their images in video/scenes/,
their start times (scene k starts at its first subtitle, scene 1 at 0), the voice's length (audio/vo.wav, none for
an SRT alone) and the engine options of whiteboard.json. Without scenes.json, every video/scenes/<name>.annotation.json
with its image is a scene, in name order, with no voice. The regions themselves stay in the annotation files: the page
reads them at every render, so an edit saved in the Studio shows without running this again (a new scene, a new
voice or a changed option needs it again). Then it reads the page's PROBLEMS, SCENES and SFX_CUES and prints the
times for the numbered-box stills (SKILL.md step 6) and for the scene checks (step 8).
"""
import json
import sys

sys.dont_write_bytecode = True  # keep the skill folder clean (no __pycache__ next to the scripts)
from wb_common import SCENES, VO, duration, load, page_data, project_dir, scene_image, scene_name  # noqa: E402

proj = project_dir()
cfg = load(proj)
scenes_dir = proj / "video/scenes"
if (proj / SCENES).exists():
    plan = json.loads((proj / SCENES).read_text(encoding="utf8")).get("scenes", [])
    scenes = [{"name": scene_name(s), "startMs": int(s["startMs"])} for s in plan]
else:
    scenes = [{"name": f.name[:-len(".annotation.json")], "startMs": 0} for f in sorted(scenes_dir.glob("*.annotation.json"))]
if not scenes:
    raise SystemExit(f"no scene: run parse-srt.py (or put <name>.png and <name>.annotation.json in video/scenes/)")
missing = []
for s in scenes:
    img = scene_image(proj, s["name"])
    if img is None:
        missing.append(f"video/scenes/{s['name']}.png (or .jpg): line-art.py makes it")
    else:
        s["image"] = f"scenes/{img.name}"
    if not (scenes_dir / f"{s['name']}.annotation.json").exists():
        missing.append(f"video/scenes/{s['name']}.annotation.json: write it (SKILL.md step 5)")
if missing:
    raise SystemExit("missing:\n  " + "\n  ".join(missing))
voice_ms = round(duration(proj / VO) * 1000) if (proj / VO).exists() else None
timeline = {"size": cfg["size"], "voiceMs": voice_ms, "engine": cfg.get("engine", {}), "scenes": scenes}
(proj / "video/timeline.js").write_text(
    "// Written by build-timeline.py: the scenes, their start times, the voice's length and the engine options.\n"
    f"window.TIMELINE = {json.dumps(timeline, ensure_ascii=False, indent=2)};\n", encoding="utf8")
print(f"{len(scenes)} scenes, {'voice ' + format(voice_ms / 1000, '.2f') + ' s' if voice_ms else 'no voice'} → video/timeline.js")
if "--no-check" in sys.argv:
    raise SystemExit(0)
page = proj / "video/index.html"
data = {name: page_data(proj, name) for name in ("PROBLEMS", "SCENES", "SFX_CUES")}
for p in data["PROBLEMS"]:
    print(f"! {p}")
if any(not p.startswith("no hand image") for p in data["PROBLEMS"]):
    raise SystemExit("the page cannot draw: fix the problems above")
for s in data["SCENES"]:
    regions = s["regions"]
    late = [r["id"] for r in regions if r["end"] > s["start"] + s["duration"] + 1e-6]
    print(f"  {s['name']}  {s['start']:7.2f} s  {s['duration']:6.2f} s  {len(regions)} regions"
          + (f"  ! drawn past the scene's end (cut by the next scene): {', '.join(late)}" if late else ""))
total = data["SCENES"][-1]["start"] + data["SCENES"][-1]["duration"]
boxes = ",".join(f"{s['start'] + min(0.5, s['duration'] / 2):.2f}" for s in data["SCENES"])
print(f"video {total:.2f} s; {len(data['SFX_CUES'])} pencil stretches")
print(f"numbered boxes (step 6): reelcrew render {proj / 'video/boxes.html'} --stills {boxes} --out-dir {proj / 'review/boxes'}")
for s in data["SCENES"]:
    mid = s["regions"][1] if len(s["regions"]) > 1 else s["regions"][0]  # the second region: next to a drawn one
    times = [s["start"] + 0.05, (mid["start"] + mid["end"]) / 2, s["start"] + s["duration"] - 0.05]
    print(f"scene check {s['name']} (step 8): reelcrew render {page} --stills {','.join(f'{t:.2f}' for t in times)} "
          f"--out-dir {proj / ('review/' + s['name'])}; then --from {s['start']:.2f} --to {s['start'] + s['duration']:.2f}")
