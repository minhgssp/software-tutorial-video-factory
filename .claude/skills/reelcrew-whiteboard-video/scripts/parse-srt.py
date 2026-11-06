"""SRT → scenes.json: every cue and the suggested scenes (25–35 s of subtitles each).

Usage: parse-srt.py <project-dir> [--srt audio/vo.srt] [--target-sec 30] [--min-sec 25] [--max-sec 35] [--force]
       parse-srt.py <project-dir> --words <transcript>/vo.words.json [--max-chars 42] [--force]
       parse-srt.py --print <file.srt> [--target-sec …]   (the JSON on stdout, nothing written)
--words (a voice alone, after `reelcrew transcribe`, whose .srt has one cue per word): joins the words into subtitle
cues (a cue ends at a sentence end, a pause of 0.5 s, or before 42 characters) and writes them to audio/vo.srt first.
Writes <project>/scenes.json {cues: [{index, startMs, endMs, durMs, text}], scenes: [{sceneIndex, startMs, endMs,
sceneDurationMs, cueRange, text}]}. A cue joins the scene until the scene reaches the target and the minimum; a cue
that would take it past the maximum starts the next scene. An existing scenes.json (with the agent's idea and
subject per scene) is kept unless --force.
"""
import json
import sys
from pathlib import Path

sys.dont_write_bytecode = True  # keep the skill folder clean (no __pycache__ next to the scripts)
from wb_common import SCENES, SRT, arg, group_scenes, num, parse_srt, phrase_cues, save_json, write_srt  # noqa: E402

if len(sys.argv) < 2 or {"--help", "-h"} & set(sys.argv[1:]):
    print(__doc__.strip())
    raise SystemExit(0 if len(sys.argv) > 1 else 2)
printing = sys.argv[1] == "--print"
proj = None if printing else Path(sys.argv[1]).expanduser().resolve()
if printing:
    if len(sys.argv) < 3:
        raise SystemExit("--print needs the SRT file")
    src = Path(sys.argv[2])
else:
    src = proj / (arg("--srt") or SRT)  # an absolute --srt stays as given
    if arg("--words"):
        wf = Path(arg("--words")).expanduser()
        try:
            j = json.loads(wf.read_text(encoding="utf8"))
        except (OSError, ValueError) as e:
            raise SystemExit(f"could not read the transcript words {wf}: {e}")
        words = j if isinstance(j, list) else j.get("words", [])
        made = phrase_cues(words, int(num("--max-chars", 42)))
        if not made:
            raise SystemExit(f"no word in {wf}")
        if src.exists() and "--force" not in sys.argv:
            raise SystemExit(f"{src.relative_to(proj)} exists: --force to replace it with the transcript's cues")
        write_srt(src, made)
        print(f"{len(words)} words → {len(made)} cues → {src.relative_to(proj)}")
try:
    cues = parse_srt(Path(src).read_text(encoding="utf-8-sig"))
except OSError as e:
    raise SystemExit(f"could not read the subtitles {src}: {e.strerror or e}")
if not cues:
    raise SystemExit(f"no cue found in {src}: check the SRT format (index, 00:00:01,000 --> 00:00:03,000, text)")
scenes = group_scenes(cues, num("--target-sec", 30), num("--min-sec", 25), num("--max-sec", 35))
out = {"cues": cues, "scenes": scenes}
if printing:
    print(json.dumps(out, ensure_ascii=False, indent=2))
    raise SystemExit(0)
dest = proj / SCENES
if dest.exists() and "--force" not in sys.argv:
    raise SystemExit(f"{SCENES} exists (it may hold the scene plan): --force to parse again")
save_json(dest, out)
total = cues[-1]["endMs"] - cues[0]["startMs"]
print(f"{len(cues)} cues, {total / 1000:.1f}s, {len(scenes)} scenes → {SCENES}")
for s in scenes:
    print(f"  scene-{s['sceneIndex']:02d}  {s['startMs'] / 1000:6.1f}-{s['endMs'] / 1000:6.1f}s "
          f"({s['sceneDurationMs'] / 1000:4.1f}s, cues {s['cueRange'][0]}-{s['cueRange'][1]}): {s['text'][:60]}")
print("next: propose each scene's idea and subject (add \"idea\" and \"subject\" to its entry in scenes.json): stop 1")
