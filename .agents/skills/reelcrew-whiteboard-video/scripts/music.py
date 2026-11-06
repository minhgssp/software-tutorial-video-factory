"""The music bed → audio/music/bed.wav: the user's own track, one from the reelcrew library, or a free calm synth bed.

Usage: music.py <project-dir> [--from <audio-or-video>] [--tempo 76] [--key C] [--force]
--from: the sound of that file (the user's track, or a library track: `reelcrew library ls --kind music`, then
`reelcrew library path <id>`). Without it: `reelcrew music plan --adapter synth` writes audio/music/score.json (a calm
bed: slow tempo, soft chords, no drop) at the video's length, and `reelcrew music make --adapter synth` renders it
(free, offline; the same score again is reused from the library). whiteboard.json "music": false skips the bed.
Run after the timeline (the length is the page's DURATION). Then mix-audio.py.
"""
import sys
from pathlib import Path

sys.dont_write_bytecode = True  # keep the skill folder clean (no __pycache__ next to the scripts)
from wb_common import BED, arg, duration, load, num, page_data, project_dir, reelcrew, run, tool  # noqa: E402

proj = project_dir()
cfg = load(proj)
if not cfg.get("music", True):
    raise SystemExit("whiteboard.json \"music\" is false: no bed (set it to true to add one)")
length = float(page_data(proj, "DURATION"))
dest = proj / BED
dest.parent.mkdir(parents=True, exist_ok=True)
src = arg("--from")
if src:
    f = Path(src).expanduser().resolve()
    if not f.is_file():
        raise SystemExit(f"--from file not found: {f}")
    run(tool("ffmpeg"), "-v", "error", "-y", "-i", f, "-vn", "-ac", "2", "-ar", "48000", dest)
    print(f"music from {f.name}: {duration(dest):.2f}s → {BED}" + ("" if duration(dest) >= length - 0.05 else " (shorter than the video: mix-audio.py loops it)"))
else:
    score = proj / "audio/music/score.json"
    reelcrew("music", "plan", "--adapter", "synth", "--duration", round(length + 1, 1), "--tempo", int(num("--tempo", 76)),
             "--key", arg("--key", "C"), "--chords", "Cmaj7,Am7,Fmaj7,G", "--seed", 7, "--out", score, "--force")
    r = reelcrew("music", "make", "--adapter", "synth", "--plan", score, "--out", dest,
                 *([] if "--force" in sys.argv else ["--reuse"]))
    item = (r.get("results") or [r])[0]
    print(f"synth bed: {duration(dest):.2f}s → {BED} ({'reused from library' if item.get('reused') else 'new'})")
print("next: mix-audio.py")
