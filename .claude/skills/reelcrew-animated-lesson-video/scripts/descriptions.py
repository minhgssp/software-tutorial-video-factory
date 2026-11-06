"""Write YouTube + Facebook descriptions → renders/<slug>-description.txt from lesson.json "publish" + timeline chapters.

Usage: descriptions.py <project-dir>
lesson.json:
  scenes[].chapter  short chapter title (scenes without one are merged into the previous chapter)
  publish: {
    "youtube_title": "...", "hook": "2–3 sentences", "summary": "1 sentence: what the video is",
    "points": ["what you'll learn", ...],          # 5–7 for YouTube
    "takeaway": "one-line key question", "steps": ["step 1", ...],
    "credit": "source credit line", "hashtags": ["#Tag", ...],
    "fb_hook": "1–2 short lines", "fb_points": ["...", "...", "..."]   # optional; defaults to hook/points[:3]
  }
Chapter times come from src/timeline.js (so thumbnail_intro shifts are included); the first chapter is forced to 0:00.
YouTube needs ≥3 chapters of ≥10 s each.
"""
import json
import re

import sys  # noqa: E402
sys.dont_write_bytecode = True  # keep the skill folder clean (no __pycache__ next to the scripts)
from lesson_common import load_lesson, narration, project_dir

proj = project_dir()
lesson = load_lesson(proj)
pub = lesson.get("publish") or {}
TL = json.loads(re.search(r"window\.TIMELINE=(.*);", (proj / "src/timeline.js").read_text()).group(1))
start = {s["id"]: s["start"] for s in TL["scenes"]}
handle = lesson.get("watermark", "")
# Section labels in the lesson's language; the follow line uses the watermark handle (empty = no follow line).
LABELS = {
    "vi": {"learn": "📌 BẠN SẼ HỌC ĐƯỢC", "chapters": "⏱️ NỘI DUNG", "remember": "💡 GHI NHỚ", "follow": "👉 Theo dõi {h} để xem thêm video như thế này!",
           "follow_fb": "👉 Theo dõi {h} để xem thêm!", "length": "{n} hoạt hình giải thích:", "sec": "{s} giây", "min": "{m} phút", "minsec": "{m} phút {s} giây"},
    "en": {"learn": "📌 WHAT YOU WILL LEARN", "chapters": "⏱️ CHAPTERS", "remember": "💡 REMEMBER", "follow": "👉 Follow {h} for more videos like this!",
           "follow_fb": "👉 Follow {h} for more!", "length": "{n} animated explainer:", "sec": "{s}-second", "min": "{m}-minute", "minsec": "{m} min {s} s"},
}
L = dict(LABELS.get(narration(lesson)["lang"], LABELS["en"]))
if pub.get("format"):  # what the video is, for the Facebook length line (e.g. "phim tài liệu", "documentary")
    L["length"] = "{n} " + pub["format"] + ":"
def length(total: float) -> str:
    """Video length as people say it: seconds under 1.5 min, whole minutes when close, else minutes and seconds."""
    t = round(total)
    m, s = divmod(t, 60)
    if t < 90:
        return L["sec"].format(s=t)
    return L["min"].format(m=m) if s < 10 else L["minsec"].format(m=m, s=s)


mmss = lambda x: f"{int(x) // 60}:{int(x) % 60:02}"  # noqa: E731

chapters = [(start[sc["id"]], sc["chapter"]) for sc in lesson["scenes"] if sc.get("chapter")]
if chapters:
    chapters[0] = (0, chapters[0][1])
short = [f"{mmss(b[0])} ({b[0] - a[0]:.0f}s)" for a, b in zip(chapters, chapters[1:] + [(TL["total"], "")]) if b[0] - a[0] < 10]
tags = pub.get("hashtags", [])

yt = [pub.get("youtube_title") or lesson["title"], "", pub.get("hook", ""), "", pub.get("summary", "")]
if pub.get("points"):
    yt += ["", L["learn"], *[f"✅ {p}" for p in pub["points"]]]
if chapters:
    yt += ["", L["chapters"], *[f"{mmss(t)} {c}" for t, c in chapters]]
if pub.get("takeaway"):
    yt += ["", L["remember"], pub["takeaway"], *[f"{i}️⃣ {s}" for i, s in enumerate(pub.get("steps", []), 1)]]
if pub.get("credit"):
    yt += ["", f"🎬 {pub['credit']}"]
if handle:
    yt += ["", L["follow"].format(h=handle)]
yt += ["", " ".join(tags)]

fb = [pub.get("fb_hook", pub.get("hook", "")), "", L["length"].format(n=length(TL["total"])),
      *[f"✅ {p}" for p in pub.get("fb_points", pub.get("points", [])[:3])]]
if pub.get("takeaway"):
    fb += ["", f"💡 {pub['takeaway']}"]
if handle:
    fb += ["", L["follow_fb"].format(h=handle)]
fb += [" ".join(tags[:4])]

out = proj / f"renders/{lesson['slug']}-description.txt"
out.write_text("\n".join(["==================== YOUTUBE ====================", *yt, "",
                          "==================== FACEBOOK ====================", *fb]).replace("\n\n\n", "\n\n") + "\n")
print(f"→ {out}  ({len(chapters)} chapters)")
if short:
    print("WARNING: chapters shorter than 10 s (YouTube ignores chapters):", short)
