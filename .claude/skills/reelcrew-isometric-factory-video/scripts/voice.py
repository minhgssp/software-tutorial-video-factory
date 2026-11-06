"""Optional voice-over: every caption read aloud, through `reelcrew tts takes` → audio/vo/takes/ + audio/vo/best.json.

Usage: voice.py <project-dir> [--takes N] [--lines 1,3,8-12] [--force] [--use 5=1,12=0]
Runs only when factory.json has "narration": {"enabled": true} (the default video is music only).
The lines are the page's CAPTIONS (numbered from 1, in story.js order); "narration": {"say": {"4": "…"}} gives a line
a spoken form (numbers in words, names spelled as they sound) while the caption stays as written.
Takes are kept by what was said, so a changed line gets new takes and an unchanged one is reused. With N > 1 reelcrew
picks the take heard best (all new takes transcribed once together, each checked against the caption and its `say`).
Default N: 3 for the offline VieNeu voice (it varies from take to take), 1 for paid voices.
--lines limits the work to those captions; --force makes new takes for them.
--use 5=1 makes caption 5 use its take t1 when you heard a wrong word the check did not catch.
A take must fit its caption's time on screen: mix-audio.py warns when one runs past the caption's end.
"""
import json
import sys

sys.dont_write_bytecode = True  # keep the skill folder clean (no __pycache__ next to the scripts)
from iso_common import arg, id_list, load, narration, page_data, project_dir, reelcrew  # noqa: E402

CHECK_MIN = 0.85  # per-line speech-check bar (captions carry numbers and product names)

proj = project_dir()
cfg = load(proj)
nar = narration(cfg)
if not nar["enabled"]:
    raise SystemExit('narration is off (factory.json "narration": {"enabled": false}): the video is music only. '
                     'Set "enabled": true to add a voice-over.')
takes = int(arg("--takes", 3 if nar["engine"] == "vieneu" else 1))
only = id_list(arg("--lines"))
caps = page_data(proj, "CAPTIONS")
vo = proj / "audio/vo"
vo.mkdir(parents=True, exist_ok=True)
lines = [{"id": str(i), "text": c["text"], "say": nar["say"].get(str(i)) or c["text"]}
         for i, c in enumerate(caps, 1) if not only or i in only]
if not lines:
    raise SystemExit("no captions to read (story.js captions is empty, or --lines matches none)")
(vo / "lines.json").write_text(json.dumps(lines, ensure_ascii=False, indent=1))
r = reelcrew("tts", "takes", vo / "lines.json", "--out-dir", vo / "takes", "--takes", takes, "--adapter", nar["engine"],
             "--lang", nar["lang"], "--min", CHECK_MIN, *(["--voice", nar["voice"]] if nar["voice"] else []),
             *(["--force"] if "--force" in sys.argv else []), free="--takes 1 (one take per line, kept without a speech check)")
best_file = vo / "best.json"
best = json.loads(best_file.read_text()) if best_file.exists() else {}
low = []
for x in r["items"]:
    best[x["id"]] = x["file"]
    cap = caps[int(x["id"]) - 1]
    room = cap["end"] - cap["start"]
    note = "" if x.get("match") is None else f"  match {x['match']:.0%}" + (f"  heard '{x['heard']}'" if x["match"] < 1 and x.get("heard") else "")
    if x.get("misread"):
        note += "  misread " + ", ".join(f"'{w['expected']}' → '{w['heard'] or '(nothing)'}'" for w in x["misread"])
    if x["duration"] > room:
        note += f"  LONGER than its caption ({room:.1f}s): shorten the line or widen the caption"
    print(f"line {x['id']}: {x['file']}{' (new)' if x.get('new') else ''}  {x['duration']:.2f}s{note}" + ("  <-- CHECK" if x.get("low") else ""))
    if x.get("low"):
        low.append(x["id"])
for pair in filter(None, (arg("--use") or "").split(",")):
    lid, _, k = pair.partition("=")
    if lid not in best or not k.isdigit():
        raise SystemExit(f"--use {pair}: expected <line>=<take number> for a line that has takes")
    chosen = best[lid].rsplit("-t", 1)[0] + f"-t{k}.wav"  # the same line, another take
    if not (vo / "takes" / chosen).exists():
        raise SystemExit(f"--use {pair}: no take audio/vo/takes/{chosen} (--takes N makes t0…t(N-1))")
    best[lid] = chosen
    print(f"line {lid}: {chosen}  (chosen with --use)")
best_file.write_text(json.dumps(best, indent=1) + "\n")
print(f"{r['made']} new take(s) ({r['adapter']}) → {best_file}"
      + (f"\nlines to look at: {','.join(low)} (fix its say, then --lines … --force)" if low else ""))
