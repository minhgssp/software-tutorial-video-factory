"""Render the lesson thumbnail (kit.js thumbScene + watermark) → renders/<slug>-thumbnail-{youtube,facebook}.jpg.

Usage: thumbnail.py <project-dir>
Facebook: 1920×1080 JPEG from `reelcrew render --thumb` (the page's renderThumb()); YouTube: 1280×720 (< 2 MB);
<slug>-thumbnail-small.jpg to read it the way people see it on a phone.
Uses lesson.json "thumbnail" + "watermark"; the same image is the first `thumbnail_intro` seconds of the video.
Run build-timeline.py first.
"""
import sys  # noqa: E402
sys.dont_write_bytecode = True  # keep the skill folder clean (no __pycache__ next to the scripts)
from lesson_common import reelcrew, load_lesson, project_dir

proj = project_dir()
slug = load_lesson(proj)["slug"]
fb = proj / f"renders/{slug}-thumbnail-facebook.jpg"
yt = proj / f"renders/{slug}-thumbnail-youtube.jpg"
small = proj / f"renders/{slug}-thumbnail-small.jpg"
r = reelcrew("render", proj / "src/index.html", "--size", "1920x1080", "--thumb", fb, "--youtube", yt, "--small", small, "--force")
print(f"{fb.name}: {r['bytes'] // 1024} KB\n{yt.name}: {r['youtube']['bytes'] // 1024} KB (kept under YouTube's 2 MB)\n"
      f"read it at phone size: {small.name}")
