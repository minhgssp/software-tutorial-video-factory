"""The voice, the music bed ducked under it and the pencil sound → audio/final-mix.wav (writes mix.json, runs
`reelcrew mix`).

Usage: mix-audio.py <project-dir> [--music-vol 0.16] [--pencil-db -26] [--every 0.9]
The video's length and the pencil's stretches come from the page (`reelcrew render --data DURATION|SFX_CUES`: each
region's ink part). The pencil is the free catalog sound `pencil` (`reelcrew sfx need pencil --free` copies it into
audio/sfx/); it repeats every --every seconds through each ink part, quiet, cut at the part's end, silent while the
colour washes in. whiteboard.json "music": false leaves the bed out, "pencil": false the pencil. With no voice
(an SRT alone) the music and the pencil play alone. Then finalize.py.
"""
import sys

sys.dont_write_bytecode = True  # keep the skill folder clean (no __pycache__ next to the scripts)
from wb_common import BED, MIX, VO, duration, load, num, page_data, project_dir, reelcrew, save_json  # noqa: E402

proj = project_dir()
cfg = load(proj)
total = float(page_data(proj, "DURATION"))
plan = {"duration": round(total, 3), "sfx_dir": "audio/sfx"}
have = []
if (proj / VO).exists():
    plan["voice"] = VO
    have.append("voice")
if cfg.get("music", True):
    if not (proj / BED).exists():
        raise SystemExit(f"missing {BED}: run music.py first (or set whiteboard.json \"music\": false)")
    plan["music"] = {"volume": num("--music-vol", 0.16), "duck": "voice" in have,
                     "beds": [{"file": BED, "loop": duration(proj / BED) < total, "fade_in": 1.5, "fade_out": 3}]}
    have.append("music")
cues = []
if cfg.get("pencil", True):
    reelcrew("sfx", "need", "pencil", "--dir", proj / "audio/sfx", "--free", "--out", proj / "audio/sfx-needed.json")
    every, db = num("--every", 0.9), num("--pencil-db", -26)
    for s in page_data(proj, "SFX_CUES"):
        t = s["t"]
        while t < s["end"] - 0.15:
            cues.append({"sound": "pencil", "t": round(t, 3), "db": db, "cut": round(min(every, s["end"] - t), 3)})
            t += every
    plan["cues"] = cues
    have.append(f"{len(cues)} pencil cues")
if not have:
    raise SystemExit("no voice, music or pencil: nothing to mix (finalize.py --silent copies the render as the final file)")
save_json(proj / "mix.json", plan)
r = reelcrew("mix", proj / "mix.json", "--out", proj / MIX, "--force")
for w in r.get("warnings") or []:
    print(f"warning: {w}")
print(f"mixed {r['duration']}s ({', '.join(have)}) at {r['lufs']} LUFS → {MIX}; next: finalize.py")
