"""The named sounds this lesson uses and does not have yet → audio/sfx-needed.json (a batch for `reelcrew sfx make`).

Usage: sfx-needed.py <project-dir>
Reads sfx-cues.json (plus whoosh-soft, which mix-audio adds on every scene change) and asks `reelcrew sfx need` for
the named sounds (`reelcrew sfx catalog`) missing from the project's sfx folder, so only those are generated:
  reelcrew sfx make --batch <project>/audio/sfx-needed.json --out-dir <project>/audio/sfx --reuse
Cues that point at a file (e.g. a free default `kenney:…`) are not named sounds and are skipped. A sound the catalog
does not know can be named too: describe it in the project's own sfx-set.json ([{"id": "modem", "prompt": "…",
"duration": 3}]) and it is made like the others.
"""
import json
import sys

sys.dont_write_bytecode = True  # keep the skill folder clean (no __pycache__ next to the scripts)
from lesson_common import reelcrew, load_lesson, project_dir

proj = project_dir()
lesson = load_lesson(proj)
names = sorted({c[3] for c in json.loads((proj / "sfx-cues.json").read_text())} | {"whoosh-soft"})
own = proj / "sfx-set.json"  # the project's own named sounds ({id, prompt, duration}), e.g. "modem"
r = reelcrew("sfx", "need", *names, "--dir", proj / lesson.get("sfx_dir", "audio/sfx"), *(["--own", own] if own.exists() else []),
             "--out", proj / "audio/sfx-needed.json")
print(f"{len(r['needed'])} named sound(s) to make: {', '.join(x['id'] for x in r['needed']) or 'none'} → {r['out']}")
if r["unknown"]:
    print(f"not in the sound catalog (describe them in the project's sfx-set.json, or use a file/kenney: path): {', '.join(r['unknown'])}")
