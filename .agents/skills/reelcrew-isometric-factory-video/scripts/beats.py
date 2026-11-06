"""Beat grid of audio/music.wav and the belt check: tempo, bar lines, where the music lifts, a shifts plan for
story.js, then every belt shift (the page's EVENTS) against the nearest bar line.

Usage: beats.py <project-dir> [--bpm 120] [--tolerance 40]
`reelcrew music analyze` does the measuring (no key, no credits) → audio/analysis.json. When it is not sure of the
tempo (half or double time), it says so: listen, then pass the tempo you hear with --bpm.
Each belt shift must start on a bar line (±--tolerance ms): an off shift is printed with the time to move it to.
"""
import json
import sys

sys.dont_write_bytecode = True  # keep the skill folder clean (no __pycache__ next to the scripts)
from iso_common import MUSIC, arg, page_data, project_dir, reelcrew  # noqa: E402

proj = project_dir()
music = proj / MUSIC
if not music.exists():
    raise SystemExit(f"missing {MUSIC}: run music.py first")
events = proj / "audio/events.json"
events.write_text(json.dumps(page_data(proj, "EVENTS")))
story_len = float(page_data(proj, "DURATION"))
out = proj / "audio/analysis.json"
reelcrew("music", "analyze", music, "--events", events, "--grid", "bar", "--tolerance", arg("--tolerance", 40),
         *(["--bpm", arg("--bpm")] if arg("--bpm") else []), "--out", out)
a = json.loads(out.read_text())
bar = round(4 * a["beat"], 3)
bars = a["bars"]
print(f"music {a['duration']}s (sound until {a['sound_end']}s) · {a['bpm']} BPM"
      + ("" if a["confident"] else "  <-- tempo not certain: listen, then --bpm <what you hear>"))
print(f"bar {bar}s · first bar line {bars[0] if bars else '?'}s · {len(bars)} bars: {bars[0]} + {bar}·n")
if a.get("drop"):
    near = min(bars, key=lambda b: abs(b - a["drop"]["t"])) if bars else a["drop"]["t"]
    print(f"biggest lift at {a['drop']['t']}s (+{a['drop']['rise_db']} dB bass) → the act-1 peak event on the bar at {near}s")
if bars:
    half = next((b for b in bars if b >= a["duration"] * 0.4), bars[len(bars) // 2])
    slow, fast = round(2 * bar, 3), bar
    n1 = max(1, int((half - bars[0]) / slow + 1e-6))
    act2 = round(bars[0] + n1 * slow, 3)  # the last slow dwell holds the morph between the acts
    n2 = max(1, int((a["duration"] - act2 - 1.2) / fast + 1e-6) + 1)  # the last shift ends before the music does
    print("a shifts plan for story.js (slow act 1, twice as fast act 2; move the act break to the story's turn):\n"
          f"  duration: {a['duration']},\n"
          f"  shifts: [{{ start: {bars[0]}, every: {slow}, count: {n1}, dur: .9 }}, "
          f"{{ start: {act2}, every: {fast}, count: {n2}, dur: .5 }}],")
if abs(story_len - a["duration"]) > 0.1:
    print(f"! story.js duration is {story_len}s, the music {a['duration']}s: set duration to the music's length")
c = a.get("cues") or {}
print(f"belt shifts on the bar lines: {c.get('on', 0)}/{c.get('checked', 0)} (±{c.get('tolerance_ms')} ms), worst {c.get('worst_ms')} ms")
for x in c.get("off", [])[:20]:
    print(f"  ! shift {x['id']} at {x['t']}s is {x['off_ms']:+d} ms off: move it to {x['target']}s")
if len(c.get("off", [])) > 20:
    print(f"  … {len(c['off']) - 20} more (audio/analysis.json)")
