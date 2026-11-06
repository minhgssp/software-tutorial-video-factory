"""Music bed(s) for the whole video through `reelcrew music` → audio/music/<cue>.mp3 + manifest.json.

Usage: music.py <project-dir> [--force]
Run after build-timeline.py: the video length is known, so the bed is made to measure (no looping). One track per
lesson.json "music" cue; several cues share the video length and are joined by mix-audio.py with 2 s crossfades.
Tracks are instrumental and kept in the reelcrew library: a rerun with the same prompt and length reuses them
(no credits). --force makes new ones.
"""
import json
import re
import sys

sys.dont_write_bytecode = True  # keep the skill folder clean (no __pycache__ next to the scripts)
from lesson_common import reelcrew, load_lesson, project_dir

XFADE = 2.0
proj = project_dir()
lesson = load_lesson(proj)
cues = lesson.get("music") or []
if not cues:
    raise SystemExit('lesson.json has no "music" cues')
total = json.loads(re.search(r"window\.TIMELINE=(.*);", (proj / "src/timeline.js").read_text()).group(1))["total"]
per = round(min(600.0, max(3.0, (total + XFADE * (len(cues) - 1)) / len(cues))) + 0.5, 1)
out = proj / "audio/music"
out.mkdir(parents=True, exist_ok=True)
manifest = []
for cue in cues:
    dest = out / f"{cue['id']}.mp3"
    r = reelcrew("music", "make", cue["prompt"], "--duration", per, "--out", dest, *([] if "--force" in sys.argv else ["--reuse"]))
    x = r["results"][0]
    manifest.append({"id": cue["id"], "model": x.get("model"), "clips": [{"file": dest.name, "duration": per}]})
    print(f"{cue['id']:<20} {per:6.1f}s  {'reused from library' if x.get('reused') else 'new'}")
(out / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n")
print(f"music for {total}s video: {len(cues)} track(s) of {per}s")
