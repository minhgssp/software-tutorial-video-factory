"""Mux renders/video-only.mp4 + audio/final-mix.wav → renders/<slug>.mp4 at -14 LUFS, then verify.

Usage: finalize.py <project-dir> [--no-stt] [--crf 20]
Verification (`reelcrew deliver`): size/duration, integrated loudness, a contact sheet (renders/<slug>-sheet.jpg),
and (unless --no-stt) the final file transcribed once and checked
line by line against each line's text (narration.lang) and its `say`, the better counting (numbers as digits or words
both count). Pass = ≥ 97%, or lesson.json "speech_check_min". The transcript is kept in renders/stt-check/.
The rendered video is copied as is (best quality, large: film grain costs bits). --crf N re-encodes it with x264
for a file to upload or send (20 looks the same: a 5-min documentary with grain 307 → 204 MB; 23–26 for smaller).
"""
import json
import re
import sys

sys.dont_write_bytecode = True  # keep the skill folder clean (no __pycache__ next to the scripts)
from lesson_common import arg, check_min, speech_check, reelcrew, load_lesson, narration, project_dir, script_text

proj = project_dir()
lesson = load_lesson(proj)
out = proj / f"renders/{lesson['slug']}.mp4"
r = reelcrew("deliver", proj / "renders/video-only.mp4", "--audio", proj / "audio/final-mix.wav", "--out", out,
             *(["--crf", arg("--crf")] if arg("--crf") else []), "--sheet", proj / f"renders/{lesson['slug']}-sheet.jpg", "--force")
print(f"{r['width']}x{r['height']} · {r['duration']} s · {r['bytes'] / 1048576:.1f} MB · video {r['video']}\n"
      f"loudness {r['lufs']} LUFS\n→ {out}\nsheet → renders/{lesson['slug']}-sheet.jpg (look at it)")

if "--no-stt" not in sys.argv:
    chk = proj / "renders/stt-check"
    chk.mkdir(parents=True, exist_ok=True)
    (chk / "script.txt").write_text(script_text(lesson))
    lang = narration(lesson)["lang"]
    subs = json.loads(re.search(r"window\.TIMELINE=(.*);", (proj / "src/timeline.js").read_text()).group(1))["subs"]
    lines = [{"id": i, "text": s[lang], "say": s.get("say"), "start": s["start"], "end": s["end"]} for i, s in enumerate(subs, 1)]
    r = speech_check(lines, lang, check_min(lesson), chk, audio=out, free="--no-stt (the speech check of the finished video is skipped)")
    bar = check_min(lesson)
    print(f"STT round-trip: {r['match']:.1%} ({'pass' if r['pass'] else f'BELOW {bar:.0%}'})")
    for x in r["lines"]:
        if not x["pass"]:
            print(f"  line {x['id']}: {x['match']:.0%}  expected '{x['expected']}' heard '{x['heard']}'  <-- listen")
    near = [f"{x['id']} ('{x['expected']}' heard '{x['heard']}')" for x in r["lines"] if x["pass"] and x["match"] < 1]
    if near:
        print(f"  above the bar but not exact (names/terms heard another way; say them to the user): {', '.join(near)}")
