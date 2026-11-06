"""Scaffold a lesson-video project: src/ templates, lesson.json + sfx-cues.json skeletons, output dirs.

Usage: init-project.py <project-dir> [--slug my-video] [--lang en|vi]
--lang only picks the starting lesson.json (narration engine/voice, subtitle languages, placeholders); afterwards
lesson.json is the source of truth. Per-user values (watermark handle, hashtags, credit) start empty: ask the user.
Never overwrites existing files.
"""
import json
import shutil
import sys
from pathlib import Path

sys.dont_write_bytecode = True  # keep the skill folder clean (no __pycache__ next to the scripts)
from lesson_common import SKILL_DIR, arg, vi_narration, check_project_path, copy_missing, make_dir

if len(sys.argv) < 2 or {"--help", "-h"} & set(sys.argv[1:]):
    print(__doc__.strip())
    raise SystemExit(0 if len(sys.argv) > 1 else 2)
proj = Path(sys.argv[1]).expanduser().resolve()
lang = arg("--lang", "en")
if lang not in ("en", "vi"):
    raise SystemExit(f"--lang must be en or vi, got {lang}")
# the deepest file must fit this machine's path limit, before anything is written (a long path stops a copy half-way)
check_project_path(proj, ("src", SKILL_DIR / "templates/src"))
for d in ("src", "audio/vo", "audio/music", "audio/sfx", "subtitles", "renders", "transcript"):
    make_dir(proj / d)
for f in (SKILL_DIR / "templates/src").iterdir():
    dest = proj / "src" / f.name
    copy_missing(f, dest)  # folders file by file (fonts/): running init again completes a half-made project

MUSIC = "Upbeat energetic electronic pop instrumental, bouncy synth plucks, punchy drums, claps, 120 bpm, playful and motivating, for a fun animated explainer video, no vocals"
lesson = {
    "slug": arg("--slug", proj.name),
    "title": "Video Title",
    "watermark": "",
    "narration": {"lang": "en", "engine": "elevenlabs", "voice": "TX3LPaxmHKxFdv7VOQHJ"},
    "subtitles": ["en", "vi"],
    "first_lead": 2.6,
    "sfx_dir": "audio/sfx",
    "music": [{"id": "bed-upbeat", "prompt": MUSIC}],
    "thumbnail_intro": 0,
    "thumbnail": {"lines": ["LINE ONE", "LINE TWO"], "tag": "short hook"},
    "scenes": [{"id": "s1-hook", "chapter": "Intro", "visual": "What the viewer sees", "lines": [{"en": "English narration line.", "vi": "Câu phụ đề tiếng Việt."}]}],
    "publish": {"youtube_title": "", "hook": "", "summary": "", "points": [], "takeaway": "", "steps": [],
                "credit": "", "hashtags": [], "fb_hook": "", "fb_points": []},
}
if lang == "vi":  # 100% Vietnamese: VieNeu voice Hải Đăng, VI-only subtitles, 1 s thumbnail intro
    lesson.update({
        "title": "Tiêu Đề Video",
        "narration": vi_narration("Hải Đăng"),
        "subtitles": ["vi"],
        "thumbnail_intro": 1.0,
        "thumbnail": {"lines": ["DÒNG MỘT", "DÒNG HAI"], "tag": "câu móc ngắn", "bg": ["#FFD166", "#F4845F"]},
        "scenes": [{"id": "s1-hook", "chapter": "Mở đầu", "visual": "Người xem thấy gì", "lines": [{"vi": "Câu lời đọc tiếng Việt."}]}],
    })
for name, data in (("lesson.json", lesson), ("sfx-cues.json", [])):
    if not (proj / name).exists():
        (proj / name).write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n")
# Generated media stays out of version control (the project may be a git repo of its own).
if not (proj / ".gitignore").exists():
    (proj / ".gitignore").write_text("\n".join(['renders/', 'audio/', '.DS_Store']) + "\n")
print(f"scaffolded {proj} ({lang})")
