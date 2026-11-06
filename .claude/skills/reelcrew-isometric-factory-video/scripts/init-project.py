"""Scaffold an isometric-factory project: video/ page (engine, fonts, style, the worked example's story.js, page
contract), factory.json, src/ (topic sources), ref/ (a style reference), audio/, renders/.

Usage: init-project.py <project-dir> [--slug my-topic]
video/story.js starts as the worked example (AI agents: without Jev vs with Jev), so the page renders at once; rewrite
it for the new topic. engine.js and page.js stay unchanged. Never overwrites existing files.
"""
import json
import shutil
import sys
from pathlib import Path

sys.dont_write_bytecode = True  # keep the skill folder clean (no __pycache__ next to the scripts)
from iso_common import SKILL_DIR, arg, vi_narration, check_project_path, copy_missing, make_dir  # noqa: E402

if len(sys.argv) < 2 or {"--help", "-h"} & set(sys.argv[1:]):
    print(__doc__.strip())
    raise SystemExit(0 if len(sys.argv) > 1 else 2)
proj = Path(sys.argv[1]).expanduser().resolve()
# the deepest file must fit this machine's path limit, before anything is written (a long path stops a copy half-way)
check_project_path(proj, ("video", SKILL_DIR / "templates/video"))
for d in ("video", "src", "ref", "audio", "renders"):
    make_dir(proj / d)
src = SKILL_DIR / "templates/video"
for f in src.rglob("*"):
    dest = proj / "video" / f.relative_to(src)
    if f.is_dir():
        make_dir(dest)
    elif not dest.exists():
        copy_missing(f, dest)

MUSIC = ("Steady minimal electronic instrumental for a technical explainer, 120 BPM, clean four-on-the-floor pulse, "
         "soft plucked synth arpeggio, quiet start, a clear lift at the midpoint, no vocals")
cfg = {
    "slug": arg("--slug", proj.name),
    "music": {"prompt": MUSIC},
    "narration": vi_narration("Hải Đăng"),
}
if not (proj / "factory.json").exists():
    (proj / "factory.json").write_text(json.dumps(cfg, ensure_ascii=False, indent=2) + "\n")
# Generated media stays out of version control (the project may be a git repo of its own).
if not (proj / ".gitignore").exists():
    (proj / ".gitignore").write_text("\n".join(["renders/", "audio/", "src/", "ref/", ".DS_Store"]) + "\n")
print(f"scaffolded {proj}: put the topic source in src/, then music.py (the track sets the length and the beat grid)")
