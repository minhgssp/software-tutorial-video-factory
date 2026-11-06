"""The project's music → audio/music.wav: the topic video's own track, any audio file, or a new instrumental from
`reelcrew music make`. The track comes first: its length is STORY.duration and its bars are the belt's beat.

Usage: music.py <project-dir> [--from <video-or-audio>] [--duration 70] [--force]
--from: the sound of that file (48 kHz stereo wav; a video's picture is ignored).
Without --from: factory.json "music": {"prompt": …} made at --duration s (default: STORY.duration, i.e. the example's
69.7 s until story.js is rewritten). Instrumental, kept in the reelcrew library: the same prompt and length again reuse
it (no credits); --force makes a new one. Then run beats.py.
"""
import sys
from pathlib import Path

sys.dont_write_bytecode = True  # keep the skill folder clean (no __pycache__ next to the scripts)
from iso_common import MUSIC, arg, duration, load, page_data, project_dir, reelcrew, run, tool  # noqa: E402

proj = project_dir()
cfg = load(proj)
dest = proj / MUSIC
dest.parent.mkdir(parents=True, exist_ok=True)
src = arg("--from")
if src:
    f = Path(src).resolve()
    if not f.is_file():
        raise SystemExit(f"--from file not found: {f}")
    run(tool("ffmpeg"), "-v", "error", "-y", "-i", f, "-vn", "-ac", "2", "-ar", "48000", dest)
    print(f"music from {f.name}: {duration(dest):.2f}s → {MUSIC}")
else:
    prompt = (cfg.get("music") or {}).get("prompt")
    if not prompt:
        raise SystemExit('factory.json has no "music": {"prompt": …}; or pass --from <file>')
    length = float(arg("--duration") or page_data(proj, "DURATION"))
    if not 3 <= length <= 600:
        raise SystemExit(f"--duration must be 3–600 s, got {length}")
    r = reelcrew("music", "make", prompt, "--duration", round(length, 1), "--out", dest,
                 *([] if "--force" in sys.argv else ["--reuse"]))
    print(f"music made: {duration(dest):.2f}s → {MUSIC} ({'reused from library' if r['results'][0].get('reused') else 'new'})")
print("next: beats.py (tempo, bar lines, where the music lifts) → story.js duration and shifts")
