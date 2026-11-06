"""Mux renders/video-only.mp4 + audio/final-mix.wav → renders/<slug>.mp4 at -14 LUFS, then check it.

Usage: finalize.py <project-dir> [--crf 20] [--no-stt]
`reelcrew deliver`: loudness in two passes, a contact sheet (renders/<slug>-sheet.jpg: look at it), the picture copied
as rendered or re-encoded with --crf (smaller to upload; 20 looks the same).
`reelcrew check`: size 1920×1080, black or frozen stretches, silence, loudness, peaks. With the voice-over on (and
unless --no-stt) the finished file is also transcribed and checked against the captions (a short paid call): a word
right in voice.py but wrong here is covered by the music, so lower --music-vol in mix-audio.py.
"""
import sys

sys.dont_write_bytecode = True  # keep the skill folder clean (no __pycache__ next to the scripts)
from iso_common import arg, load, narration, page_data, project_dir, reelcrew  # noqa: E402

proj = project_dir()
cfg = load(proj)
video = proj / "renders/video-only.mp4"
mix = proj / "audio/final-mix.wav"
if not video.exists():
    raise SystemExit("missing renders/video-only.mp4: reelcrew render video/index.html --out renders/video-only.mp4 --fps 60 --workers 3")
if not mix.exists():
    raise SystemExit("missing audio/final-mix.wav: run mix-audio.py first")
out = proj / f"renders/{cfg['slug']}.mp4"
sheet = proj / f"renders/{cfg['slug']}-sheet.jpg"
r = reelcrew("deliver", video, "--audio", mix, "--out", out, "--lufs", -14, *(["--crf", arg("--crf")] if arg("--crf") else []),
             "--sheet", sheet, "--force")
print(f"{r['width']}x{r['height']} · {r['duration']} s · {r['bytes'] / 1048576:.1f} MB · video {r['video']} · {r['lufs']} LUFS\n"
      f"→ {out}\nsheet → {sheet.relative_to(proj)} (look at it)")
for w in r.get("warnings") or []:
    print(f"! {w}")

nar = narration(cfg)
script = []
if nar["enabled"] and "--no-stt" not in sys.argv:
    txt = proj / "audio/vo/script.txt"
    txt.write_text("\n".join(c["text"] for c in page_data(proj, "CAPTIONS")) + "\n")
    script = ["--script", txt, "--lang", nar["lang"]]
c = reelcrew("check", out, "--lufs", -14, "--size", "1920x1080", *script, free="--no-stt (the speech check of the finished video is skipped)")
print(f"check: {c['verdict']}")
for f in c.get("findings") or []:
    at = f" at {f['at']}s" if f.get("at") is not None else ""
    print(f"  {f['level']} {f['id']}{at}: {f['message']}" + (f" → {f['fix']}" if f.get("fix") else ""))
