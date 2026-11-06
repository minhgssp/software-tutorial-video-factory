"""Mix VO + ducked music + SFX cues → audio/final-mix.wav, aligned to src/timeline.js (writes mix.json, runs `reelcrew mix`).

Usage: mix-audio.py <project-dir> [--music-vol 0.2]
Music: every clip listed in audio/music/manifest.json (in order), joined with 2s crossfades, looped if short, faded to video length.
SFX: sfx-cues.json rows [scene_id, beat_index|null, offset_s|"END", sfx, peak_db]. `sfx` is a named sound
(audio/sfx/<name>.mp3|.wav|.ogg, `reelcrew sfx catalog`), a free default as `<set>:<file>` (e.g.
`kenney:kenney_impact-sounds/Audio/impactGlass_heavy_001.ogg`, found with `reelcrew sfx defaults --search ...`, original
name), or a path to any audio file (relative to the project, or absolute).
Each SFX is peak-normalised to peak_db (e.g. -9 loud accent, -13 ding, -17 subtle click).
A soft whoosh is added automatically on every scene change (when audio/sfx has whoosh-soft).
"""
import json
import re
import sys

sys.dont_write_bytecode = True  # keep the skill folder clean (no __pycache__ next to the scripts)
from lesson_common import reelcrew, load_lesson, project_dir

proj = project_dir()
lesson = load_lesson(proj)
music_vol = float(sys.argv[sys.argv.index("--music-vol") + 1]) if "--music-vol" in sys.argv else 0.2
sfx_dir = lesson.get("sfx_dir", "audio/sfx")
TL = json.loads(re.search(r"window\.TIMELINE=(.*);", (proj / "src/timeline.js").read_text()).group(1))
SC, TOTAL = {s["id"]: s for s in TL["scenes"]}, TL["total"]


def cue_time(scene, beat, off) -> float:
    s = SC[scene]
    if off == "END":
        return s["start"] + s["dur"] - 3.5
    return s["start"] + (s["beats"][beat] if beat is not None else 0) + off


cues = [{"sound": name, "t": round(cue_time(sc, b, o), 3), "db": db} for sc, b, o, name, db in json.loads((proj / "sfx-cues.json").read_text())]
if any((proj / sfx_dir / f"whoosh-soft{e}").exists() for e in (".mp3", ".wav", ".ogg")):
    cues += [{"sound": "whoosh-soft", "t": round(s["start"] - .15, 3), "db": -17} for s in TL["scenes"][1:]]
manifest = json.loads((proj / "audio/music/manifest.json").read_text())
clips = [f"audio/music/{c['file']}" for m in manifest for c in m["clips"]]
plan = {"duration": TOTAL, "voice": "audio/vo-track.wav", "sfx_dir": sfx_dir, "cues": cues,
        "music": {"volume": music_vol, "beds": [{"files": clips, "crossfade": 2, "loop": True, "fade_in": 1.5, "fade_out": 3.5}] if clips else []}}
(proj / "mix.json").write_text(json.dumps(plan, ensure_ascii=False, indent=1))
r = reelcrew("mix", proj / "mix.json", "--out", proj / "audio/final-mix.wav", "--force")
music_len = sum(float(c.get("duration") or 0) for m in manifest for c in m["clips"])
print(f"mixed {r['cues']} sfx cues, {len(clips)} music clips (~{music_len:.0f}s raw) over {TOTAL}s, {r['lufs']} LUFS before finalize"
      + ("  WARNING: music shorter than video, it will loop" if music_len - 2 * (len(clips) - 1) < TOTAL else ""))
