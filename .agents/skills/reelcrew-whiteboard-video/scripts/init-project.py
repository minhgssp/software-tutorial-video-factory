"""Scaffold a whiteboard-video project: video/ (the page, the engine, assets/, licenses/), video/scenes/, audio/,
renders/, review/, prompts/, whiteboard.json and a .gitignore.

Usage: init-project.py <project-dir> [--aspect 16:9|9:16] [--lang vi|en] [--subtitles] [--no-music] [--no-pencil]
                       [--bare-tip] [--slug <name>]
--aspect sets the frame (1920x1080 or 1080x1920), the line art's shape and the page's SIZE. --subtitles burns the
SRT in at the bottom (off by default). --no-music and --no-pencil turn the music bed and the pencil sound off (both
on by default). --bare-tip draws a plain pen tip instead of the drawing hand (video/assets/hand.png). Existing files are never overwritten: running it again completes a half-made project (the options
of an existing whiteboard.json stay as they are).
"""
import sys
from pathlib import Path

sys.dont_write_bytecode = True  # keep the skill folder clean (no __pycache__ next to the scripts)
from wb_common import SIZES, SKILL_DIR, arg, check_project_path, copy_missing, make_dir, save_json, vi_narration  # noqa: E402

if len(sys.argv) < 2 or {"--help", "-h"} & set(sys.argv[1:]):
    print(__doc__.strip())
    raise SystemExit(0 if len(sys.argv) > 1 else 2)
proj = Path(sys.argv[1]).expanduser().resolve()
aspect = arg("--aspect", "16:9")
if aspect not in SIZES:
    raise SystemExit(f"--aspect takes 16:9 or 9:16, got {aspect!r}")
lang = arg("--lang", "vi")
if lang not in ("vi", "en"):
    raise SystemExit(f"--lang takes vi or en, got {lang!r}")
check_project_path(proj, ("video", SKILL_DIR / "templates/video"), ("prompts", SKILL_DIR / "templates/prompts"))
for d in ("video/scenes", "audio/music", "audio/sfx", "renders", "review", "prompts"):
    make_dir(proj / d)
copy_missing(SKILL_DIR / "templates/video", proj / "video")
copy_missing(SKILL_DIR / "templates/prompts", proj / "prompts")

w, h = SIZES[aspect]
cfg = {
    "slug": arg("--slug", proj.name),
    "aspect": aspect,
    "size": f"{w}x{h}",
    "lang": lang,
    "narration": vi_narration("Hải Đăng") if lang == "vi" else {"lang": "en", "engine": "kokoro", "voice": None},
    "subtitles": "--subtitles" in sys.argv,
    "music": "--no-music" not in sys.argv,
    "pencil": "--no-pencil" not in sys.argv,
    # the engine's options (references/engine.md); a scene's annotation.json can override any of them under "engine"
    "engine": {
        "fps": 30, "inkPath": "grid", "colorFill": "contour-wipe", "pause": "heavy", "capLongEdge": None,
        "gridEdge": 10, "brushRadius": 40, "inkRevealRadius": 4, "sampleStep": 2,
        "wipeDecay": 0.86, "wipeDelayRatio": 0.04, "wipeBlocks": 18, "holdMs": 1000,
        "bareTip": "--bare-tip" in sys.argv, "hand": {"file": "assets/hand.png", "anchorX": 0.0025, "anchorY": 0.3253},
    },
}
if not (proj / "whiteboard.json").exists():
    save_json(proj / "whiteboard.json", cfg)
# Generated media stays out of version control (the project may be a git repo of its own).
if not (proj / ".gitignore").exists():
    (proj / ".gitignore").write_text("\n".join(["renders/", "audio/", "review/", ".DS_Store"]) + "\n")
print(f"scaffolded {proj} ({aspect}): next, the voice and subtitles (SKILL.md step 2), then parse-srt.py")
