"""renders/video-only.mp4 (+ burned-in subtitles) + audio/final-mix.wav → renders/<slug>.mp4 at −14 LUFS, then
`reelcrew check`.

Usage: finalize.py <project-dir> [--crf 20] [--silent]
With whiteboard.json "subtitles": true, `reelcrew compose` first burns audio/vo.srt in at the bottom of the picture, each cue
wrapped to two lines at most,
(renders/video-subs.mp4). `reelcrew deliver` then muxes the mix, sets the loudness to −14 LUFS in two passes and
makes the contact sheet (renders/<slug>-sheet.jpg: look at it). `reelcrew check` checks the size, 30 fps, black or
frozen stretches, silence, loudness and peaks. --silent (no voice, music or pencil): the picture is copied as the
final file with an `inspect` sheet, and check warns `no_sound` (expected).
"""
import shutil
import sys
import textwrap

sys.dont_write_bytecode = True  # keep the skill folder clean (no __pycache__ next to the scripts)
from wb_common import MIX, SRT, VIDEO, arg, load, parse_srt, project_dir, reelcrew, save_json  # noqa: E402

proj = project_dir()
cfg = load(proj)
video = proj / VIDEO
if not video.exists():
    raise SystemExit(f"missing {VIDEO}: reelcrew render video/index.html --fps 30 --out {VIDEO}")
silent = "--silent" in sys.argv
if not silent and not (proj / MIX).exists():
    raise SystemExit(f"missing {MIX}: run mix-audio.py first (or --silent for a video with no sound)")
w, h = cfg["size"].split("x")
fps = 30  # the skill renders at 30 fps (SKILL.md step 8), whatever the drawing's own clock
if cfg.get("subtitles"):
    if not (proj / SRT).exists():
        raise SystemExit(f"subtitles are on but {SRT} is missing")
    # compose burns an SRT cue as one line: wrap each cue at the compose default width (42 characters, 32 upright)
    width = 42 if int(w) > int(h) else 32
    cues = [{"start": c["startMs"] / 1000, "end": c["endMs"] / 1000, "text": "\n".join(textwrap.wrap(c["text"], width))}
            for c in parse_srt((proj / SRT).read_text(encoding="utf-8-sig"))]
    tl = proj / "renders/subtitles-timeline.json"
    save_json(tl, {"size": [int(w), int(h)], "fps": fps, "loudness": None,
                   "clips": [{"src": f"../{VIDEO}", "audio": False}],
                   "subtitles": {"cues": cues, "style": {"position": "bottom", "size": 56 if int(w) > int(h) else 60}}})
    subs = proj / "renders/video-subs.mp4"
    reelcrew("compose", tl, "--out", subs, "--force")
    video = subs
    print(f"subtitles burned in → {subs.relative_to(proj)}")
out = proj / f"renders/{cfg['slug']}.mp4"
sheet = proj / f"renders/{cfg['slug']}-sheet.jpg"
if silent:
    shutil.copyfile(video, out)
    i = reelcrew("inspect", out, "--only", "sheet", "--out-dir", proj / "renders/inspect")
    shutil.copyfile(i["sheet"], sheet)
    print(f"silent video → {out}\nsheet → {sheet.relative_to(proj)} (look at it)")
else:
    r = reelcrew("deliver", video, "--audio", proj / MIX, "--lufs", -14, "--out", out,
                 *(["--crf", arg("--crf")] if arg("--crf") else []), "--sheet", sheet, "--force")
    print(f"{r['width']}x{r['height']} · {r['duration']} s · {r['bytes'] / 1048576:.1f} MB · {r['lufs']} LUFS\n→ {out}\n"
          f"sheet → {sheet.relative_to(proj)} (look at it)")
    for x in r.get("warnings") or []:
        print(f"! {x}")
c = reelcrew("check", out, *([] if silent else ["--lufs", -14]), "--size", cfg["size"], "--fps", fps)
save_json(proj / "renders/check.json", c)
print(f"check: {c['verdict']} (renders/check.json)")
for f in c.get("findings") or []:
    at = f" at {f['at']}s" if f.get("at") is not None else ""
    print(f"  {f['level']} {f['id']}{at}: {f['message']}" + (f" → {f['fix']}" if f.get("fix") else ""))
