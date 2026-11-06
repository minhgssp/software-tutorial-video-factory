# -*- coding: utf-8 -*-
"""
run_once_execute_kudo_v2_widescreen_16x9.py
-------------------------------------------
Executes the end-to-end Kudo Screencast Engine (`C:\\Github\\kudo\\engines\\screencast\\screencast.py`)
for Version 2 in **Native Widescreen 16:9 (`1920x1080`, `30fps`)** with:
- Voice: `VieNeu-TTS v3 Turbo`, voice preset `"Hải Đăng"`, `pace=1.02` (same natural speed as v1),
  and `LONG_PAUSE_MS = 520` ms for `//` macro-pauses between major sections.
- Stage: Warm Bright Editorial Widescreen `16:9` (`1920x1080`):
  - Left editorial column (`x: 44..520`, `w: 476px`): Step kicker (`#kicker`), Title (`#title`), Note (`#note`), and word-by-word karaoke Subtitle box (`#cap`).
  - Right desktop card (`x: 548..1872`, `y: 54..1026`, `w: 1324px`, `h: 972px`): Authentic 3-column Antigravity UI (`1280x860` scaled cleanly inside `1324x924`), DigiSource Brand Fullscreen Slide Presentation (`s8a_slide_fullscreen_flip`), and Simulated Microsoft PowerPoint Editable view (`s8b_slide_ppt_editable`).
- Music: Kudo `mgaudio` procedural FM `explainer` background score (`--vol 0.10`, `--sfx-vol 0.45`, `-14 LUFS`).
"""

import argparse
from concurrent.futures import ProcessPoolExecutor
import json
import math
import os
import shutil
import subprocess
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

# Ensure all Path.read_text / Path.write_text calls inside Kudo use UTF-8 on Windows
_orig_read_text = Path.read_text
_orig_write_text = Path.write_text


def _utf8_read_text(self, encoding="utf-8", errors=None):
    return _orig_read_text(self, encoding=encoding, errors=errors)


def _utf8_write_text(self, data, encoding="utf-8", errors=None, newline=None):
    return _orig_write_text(self, data, encoding=encoding, errors=errors, newline=newline)


Path.read_text = _utf8_read_text
Path.write_text = _utf8_write_text

if __name__ == "__main__" and len(sys.argv) > 1:
    os.environ["HN_VID"] = sys.argv[1]
SPRINT_DIR = Path(__file__).resolve().parents[1]
VID = os.environ.get("HN_VID", "")
SPEC_JSON = SPRINT_DIR / "specs" / "videos" / f"{VID}.json"
RUN_DIR = SPRINT_DIR / "runs" / VID
SPEC_YAML = SPRINT_DIR / "specs" / "kudo" / f"{VID}.yaml"
OUTPUT_VIDEO_DIR = SPRINT_DIR / "output_video"

KUDO_ROOT = Path(os.environ.get('KUDO_ROOT', str(Path.home() / 'kudo')))
if not KUDO_ROOT.exists() and Path(r'C:\Github\kudo').exists():
    KUDO_ROOT = Path(r'C:\Github\kudo')
SCREENCAST_DIR = Path(__file__).resolve().parent
os.environ['KUDO_VIENEU_PY'] = sys.executable
os.environ['KUDO_WHISPER_PY'] = sys.executable
os.environ['KUDO_ALIGN_MODEL'] = 'small'
os.environ['KUDO_CHROME'] = r'C:\Program Files\Google\Chrome\Application\chrome.exe'
os.environ['PYTHONUTF8'] = '1'
sys.path.insert(0, str(SCREENCAST_DIR))
if (KUDO_ROOT / 'engines' / 'voice').exists():
    sys.path.insert(0, str(KUDO_ROOT / 'engines' / 'voice'))
if (KUDO_ROOT / 'engines' / 'audio').exists():
    sys.path.insert(0, str(KUDO_ROOT / 'engines' / 'audio'))
from kcast import capture as KCapture, render as KRender, plan as KP  # noqa: E402
try:
    import screencast as SC  # noqa: E402
    import vieneu_tts as VTTS  # noqa: E402
    import voice_align as VAlign  # noqa: E402
    import score as KScore  # noqa: E402
    from mgaudio import samples as KSamples  # noqa: E402
except Exception:
    SC = VTTS = VAlign = KScore = KSamples = None

# Override Kudo Plan constants for Native Widescreen 16:9 (1920x1080)
KP.W = 1920
KP.H = 1080
KP.FPS = 30
KP.CARD = {"x": 548, "y": 54, "w": 1324, "h": 972, "chrome": 48}
KP.CONTENT_W = KP.CARD["w"]
KP.CONTENT_H = KP.CARD["h"] - KP.CARD["chrome"]

CAP_MAX_CHARS = 210  # sức chứa ô phụ đề cột trái (27px, khoảng 11 dòng, mỗi câu một dòng mới)
CAP_PARA_GAP = 0.40  # lặng từ chừng này trở lên sau dấu chấm là hết một đoạn ý


def _cap_text(ws):
    return " ".join(w["text"] for w in ws)


def _split_long_sentence(ws):
    """Câu dài hơn ô phụ đề: ngắt ở dấu phẩy, hai chấm, chấm phẩy gần cuối mỗi phần; không ngắt giữa vế câu."""
    parts, cur = [], []
    for i, w in enumerate(ws):
        cur.append(w)
        rest = _cap_text(ws[i + 1:])
        if w["text"][-1:] in ",:;" and rest:
            nxt_clause = []
            for x in ws[i + 1:]:
                nxt_clause.append(x)
                if x["text"][-1:] in ",:;.!?":
                    break
            if len(_cap_text(cur + nxt_clause)) > CAP_MAX_CHARS:
                parts.append(cur)
                cur = []
    if cur:
        parts.append(cur)
    return parts


def paragraph_captions(words, **_):
    """Phụ đề bài giảng 16:9: hiện cả đoạn đủ ý, tối thiểu tròn một câu; vẫn tô từ đang đọc."""
    sentences, cur = [], []
    for w in words:
        cur.append(w)
        if w["text"][-1:] in ".!?":
            sentences.append(cur)
            cur = []
    if cur:
        sentences.append(cur)
    chunks, para = [], []
    for k, s in enumerate(sentences):
        pieces = _split_long_sentence(s) if len(_cap_text(s)) > CAP_MAX_CHARS else [s]
        for piece in pieces:
            if para and len(_cap_text(para + piece)) > CAP_MAX_CHARS:
                chunks.append(para)
                para = []
            para = para + piece
        gap = sentences[k + 1][0]["start"] - s[-1]["end"] if k + 1 < len(sentences) else 0
        if gap >= CAP_PARA_GAP:
            chunks.append(para)
            para = []
    if para:
        chunks.append(para)
    out = []
    for i, c in enumerate(chunks):
        end = chunks[i + 1][0]["start"] if i + 1 < len(chunks) else c[-1]["end"] + 0.6
        out.append({"t0": c[0]["start"], "t1": round(max(end, c[-1]["end"]), 3),
                    "words": [{"text": x["text"], "t0": x["start"], "t1": x["end"]} for x in c]})
    return out


KP.captions = paragraph_captions

SFX_LEN = {"whoosh": 0.5, "impact": 0.6, "click": 0.15, "swish": 0.35, "typing": 1.0}
SFX_DUCK_DB = 8.0
_orig_sfx_cues = KP.sfx_cues


def sfx_cues_around_speech(plan):
    """Tiếng chuyển cảnh nằm trong khoảng lặng trước lời; tiếng nào vẫn trùng lời thì giảm âm."""
    cues = _orig_sfx_cues(plan)
    spoken = [(w["t0"], w["t1"]) for c in plan["captions"] for w in c["words"]]
    for h in cues["hits"]:
        if h["sfx"] == "whoosh":
            h["t"] = round(max(0.0, h["t"] - 0.45), 3)
        end = h["t"] + SFX_LEN.get(h["sfx"], 0.25)
        if any(a < end and b > h["t"] for a, b in spoken):
            h["gain"] -= SFX_DUCK_DB
    cues["hits"].sort(key=lambda h: h["t"])
    return cues


KP.sfx_cues = sfx_cues_around_speech

# Force pure FM procedural synthesis in mgaudio when FLAC sample packs are not present
if KSamples is not None:
    KSamples._index = lambda: {}
    KSamples.instrument = lambda *a, **kw: None
    KSamples.kit = lambda *a, **kw: None

# Set macro-pause `//` to 520ms (clear breath between major thoughts) while keeping pace=1.02
SHOT_GAP_MS = 900
if VTTS is not None:
    VTTS.LONG_PAUSE_MS = 700  # giữa hai ý lớn
    VTTS.load = lambda: __import__("vieneu").Vieneu()
    _orig_plan_spans = VTTS.plan_spans
else:
    _orig_plan_spans = None


def _plan_spans_with_holds(performance, clean):
    """Khoảng lặng do kịch bản đặt (`holds`): sau câu kết thúc bằng `after`, lặng `sec` giây để xem thao tác."""
    spans = _orig_plan_spans(performance, clean)
    for shot in json.loads(SPEC_JSON.read_text(encoding="utf-8"))["shots"]:
        tail = shot["say"][-1].strip()[-40:]  # hết cảnh: lặng để tiếng chuyển cảnh không đè lên lời
        for x in spans[:-1]:
            if x["text"].endswith(tail):
                x["pause_after_ms"] = max(x["pause_after_ms"], SHOT_GAP_MS)
        for h in shot.get("holds", []):
            hit = [x for x in spans if x["text"].endswith(h["after"])]
            if not hit:
                raise SystemExit(f"HOLD_MISSING: {shot['id']} '{h['after']}'")
            hit[0]["pause_after_ms"] = int(min(h["sec"], 1.0) * 1000)  # CEO: không dừng quá 1 giây
    return spans


if VTTS is not None:
    VTTS.plan_spans = _plan_spans_with_holds
import av  # noqa: E402
_orig_av_open = av.open


def _patched_av_open(*a, **kw):
    kw.pop("metadata_errors", None)
    return _orig_av_open(*a, **kw)


av.open = _patched_av_open

# Native Widescreen 16:9 (1920x1080) Warm Bright Editorial Stage CSS Override
WIDESCREEN_16X9_STAGE_CSS = """
/* === NATIVE WIDESCREEN 16:9 (1920x1080) WARM BRIGHT EDITORIAL STAGE === */
:root {
  --ink: #F5F2EA !important;
  --ink2: #EAE5D9 !important;
  --paper: #1B1916 !important;
  --paper2: #E6E1D5 !important;
  --mute: #57524A !important;
  --lacquer: #AE1C3E !important;
  --bright: #E05A33 !important;
  --pen: #006B5E !important;
}
html, body {
  width: 1920px !important;
  height: 1080px !important;
  background: #F5F2EA !important;
  overflow: hidden !important;
}
#stage {
  width: 1920px !important;
  height: 1080px !important;
  background: radial-gradient(120% 85% at 50% 32%, #FFFFFF 0%, #F5F2EA 62%, #EAE4D7 100%) !important;
}
#grain {
  opacity: 0.032 !important;
  mix-blend-mode: multiply !important;
}

/* 1. Left Column (x: 42..522, width: 480px) for Screen / Live Shots */
#top {
  left: 42px !important;
  right: auto !important;
  top: 54px !important;
  width: 480px !important;
  height: 470px !important;
}
#kicker {
  color: #006B5E !important;
  font-weight: 700 !important;
  font-size: 16px !important;
  letter-spacing: 0.12em !important;
  gap: 10px !important;
}
#kicker .tick i {
  width: 16px !important;
  background: #D5CFC2 !important;
}
#kicker .tick i.on {
  width: 28px !important;
  background: #E05A33 !important;
}
#title {
  color: #181613 !important;
  font-weight: 700 !important;
  font-size: 46px !important;
  line-height: 1.08 !important;
  margin-top: 16px !important;
}
#title em, #htitle em {
  color: #AE1C3E !important;
  font-weight: 700 !important;
}
#note {
  color: #4A463F !important;
  font-weight: 500 !important;
  font-size: 20px !important;
  line-height: 1.42 !important;
  margin-top: 14px !important;
  max-width: 470px !important;
}

/* 2. Right Desktop Card (x: 548..1872, y: 54..1026, w: 1324px, h: 972px) */
#card {
  left: 548px !important;
  top: 54px !important;
  width: 1324px !important;
  height: 972px !important;
  border-radius: 20px !important;
  background: #FFFFFF !important;
  box-shadow: 0 32px 72px rgba(27, 25, 22, 0.16), 0 0 0 2px #D8D2C5 !important;
}
#chrome {
  height: 48px !important;
  background: #EFECE4 !important;
  border-bottom: 1px solid #D8D2C5 !important;
  padding: 0 18px !important;
}
#dots i:nth-child(1) { background: #FF5F56 !important; }
#dots i:nth-child(2) { background: #FFBD2E !important; }
#dots i:nth-child(3) { background: #27C93F !important; }
#url {
  height: 30px !important;
  background: #FFFFFF !important;
  color: #3A3630 !important;
  border: 1px solid #DFDBD0 !important;
  font-size: 14px !important;
}
#url b {
  color: #006B5E !important;
  font-weight: 700 !important;
}
#chip {
  color: #FFFFFF !important;
  background: #AE1C3E !important;
  font-size: 13px !important;
  padding: 5px 12px !important;
}
#content, #over {
  position: absolute !important;
  left: 0 !important;
  top: 48px !important;
  width: 1324px !important;
  height: 924px !important;
}
#label {
  position: fixed !important;
  z-index: 60 !important;
  white-space: nowrap !important;
  transform-origin: top right !important;
  color: #FFFFFF !important;
  background: #2B2925 !important;
  font-size: 19px !important;
  padding: 9px 16px !important;
  border-radius: 8px !important;
  box-shadow: 0 6px 16px rgba(27, 25, 22, 0.22) !important;
}

/* 3. Karaoke Subtitle Box (#cap) in Left Column during Screen/Live Shots */
#cap {
  left: 42px !important;
  right: auto !important;
  top: 560px !important;
  width: 480px !important;
  height: 466px !important;
  color: #181613 !important;
  background: rgba(255, 255, 255, 0.92) !important;
  border: 1.5px solid #DFDBD0 !important;
  border-radius: 20px !important;
  padding: 24px 28px !important;
  box-shadow: 0 12px 32px rgba(27, 25, 22, 0.08) !important;
  display: flex !important;
  align-items: center !important;
  justify-content: flex-start !important;
  text-align: left !important;
  font: 700 27px/1.36 'Be Vietnam Pro', sans-serif !important;
}
#cap > div {
  font-size: 27px !important;
  line-height: 1.36 !important;
  text-align: left !important;
  max-width: 424px !important;
}
#cap span.f {
  color: rgba(24, 22, 19, 0.62) !important;
}
#cap span.n {
  color: #AE1C3E !important;
}

/* 4. Opening & Closing Card Shots (mode-card) across 1920x1080 */
#hero {
  left: 64px !important;
  right: auto !important;
  top: 64px !important;
  width: 900px !important;
  height: 460px !important;
}
#hkicker {
  color: #006B5E !important;
  font-size: 19px !important;
  font-weight: 700 !important;
}
#htitle {
  color: #181613 !important;
  font-weight: 700 !important;
  font-size: 68px !important;
  line-height: 1.05 !important;
  margin-top: 20px !important;
}
#hnote {
  color: #4A463F !important;
  font-weight: 500 !important;
  font-size: 24px !important;
  line-height: 1.38 !important;
  margin-top: 18px !important;
  max-width: 860px !important;
}
#items {
  left: 64px !important;
  right: auto !important;
  top: 560px !important;
  width: 900px !important;
}
#items .it {
  display: flex !important;
  align-items: center !important;
  gap: 18px !important;
  padding: 16px 0 !important;
  border-bottom: 1.5px solid #DED9CD !important;
}
#items .it span {
  color: #AE1C3E !important;
  font-weight: 700 !important;
  font-size: 16px !important;
  min-width: 195px !important;
}
#items .it b {
  color: #181613 !important;
  font-size: 20px !important;
  line-height: 1.3 !important;
}
#items .it i {
  color: #006B5E !important;
  font-weight: 600 !important;
  background: #E6F4F1 !important;
  padding: 5px 12px !important;
  border-radius: 999px !important;
  font-size: 15px !important;
  margin-left: auto !important;
}
#collage {
  left: 0 !important;
  right: 0 !important;
  top: 0 !important;
  width: 1920px !important;
  height: 1080px !important;
  transform: none !important;
}
#collage .th {
  width: 390px !important;
  height: 262px !important;
  box-shadow: 0 20px 44px rgba(27, 25, 22, 0.16), 0 0 0 2px #D8D2C5 !important;
}
body.mode-card #cap {
  left: 1030px !important;
  top: 660px !important;
  width: 826px !important;
  height: 356px !important;
}
body.mode-card #cap > div {
  max-width: 760px !important;
  font-size: 31px !important;
}
"""


# Cảnh mở của một ý lớn (`opener` trên cảnh `card`): chỉ thay phần minh họa phần mềm trong khung bên phải,
# cột trái và ô phụ đề giữ như cảnh thường. Mọi quy tắc chỉ có tác dụng ở cảnh có `opener`, các bài khác không đổi.
OPENER_CSS = """
#opener { display: none; position: absolute; left: 0; top: 0; width: 1324px; height: 972px; background: #FBFAF6; }
body.mode-opener #opener { display: block; }
body.mode-opener #chrome, body.mode-opener #label { display: none !important; }
body.mode-opener #content { top: 0 !important; height: 972px !important; }
#opener .opp { position: absolute; left: 0; top: 0; width: 340px; height: 972px; background: var(--opc); display: flex;
  flex-direction: column; align-items: center; justify-content: center; gap: 6px; color: #FFFFFF; }
#opener .opl { font: 700 28px/1 'Be Vietnam Pro', sans-serif; letter-spacing: .16em; }
#opener .opn { font: 700 260px/1 'Be Vietnam Pro', sans-serif; }
#opener .opm { position: absolute; left: 396px; top: 0; width: 880px; height: 972px; display: flex; flex-direction: column;
  justify-content: center; gap: 30px; }
#opener .opk { font: 700 20px/1 'Be Vietnam Pro', sans-serif; letter-spacing: .14em; color: var(--opc); }
#opener .opt { font: 700 76px/1.1 'Be Vietnam Pro', sans-serif; color: #181613; letter-spacing: -.012em; }
#opener .opt .w { display: inline-block; white-space: pre; }
#opener .opt em { font-style: normal; color: var(--opc); }
#opener .ops { color: #3A3630; font: 600 40px/1.42 'Be Vietnam Pro', sans-serif; }
#opener .ops.quote { font: italic 500 54px/1.26 'Cormorant Garamond', serif; color: #181613; }
#opener .ops.quote:before { content: '“'; color: var(--opc); }
#opener .ops.quote:after { content: '”'; color: var(--opc); }
#opener .mk { padding: 0 .12em; margin: 0 -.06em; border-radius: 6px; background: linear-gradient(#FFF0A3, #FFF0A3) no-repeat 0 0 / 0% 100%; }
"""

OPENER_JS = """
  // Cảnh mở của một ý lớn: số thứ tự, tên ý, câu tóm tắt có từ khóa tô theo lời đọc.
  const opEsc = (x) => String(x).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  let opKey = '';
  function buildOpener(s) {
    const o = s.opener, el = $('opener');
    let text = opEsc(o.text);
    (o.marks || []).forEach((m, k) => { text = text.replace(opEsc(m.text), `<span class="mk" data-k="${k}">${opEsc(m.text)}</span>`); });
    el.innerHTML = `<div class="opp"><div class="opl">${opEsc(o.label)}</div><div class="opn">${opEsc(o.num)}</div></div>`
      + `<div class="opm"><div class="opk">${opEsc(o.kicker || '')}</div><div class="opt">${titleHTML(o.title, o.accent)}</div>`
      + `<div class="ops ${o.style === 'quote' ? 'quote' : ''}">${text}</div></div>`;
    el.style.setProperty('--opc', o.color);
  }
  function renderOpener(s, t) {
    if (opKey !== s.id) { buildOpener(s); opKey = s.id; }
    const el = $('opener');
    const pp = outCubic(ramp(t, s.t0, s.t0 + .4));
    el.querySelector('.opp').style.transform = `translateX(${(pp - 1) * 100}%)`;
    el.querySelector('.opn').style.transform = `scale(${1.16 - .16 * outCubic(ramp(t, s.t0 + .1, s.t0 + .6))})`;
    el.querySelector('.opk').style.opacity = outCubic(ramp(t, s.t0 + .1, s.t0 + .4));
    revealWords(el.querySelector('.opt'), t, s.t0 + .12, .05, .42);
    const q = outCubic(ramp(t, s.t0 + .4, s.t0 + .85)), ops = el.querySelector('.ops');
    ops.style.opacity = q; ops.style.transform = `translateY(${(1 - q) * 22}px)`;
    el.querySelectorAll('.mk').forEach((sp) => {
      const m = s.opener.marks[+sp.dataset.k];
      sp.style.backgroundSize = `${outCubic(ramp(t, m.t, m.t + .4)) * 100}% 100%`;
    });
    hideCursor(); keys.style.opacity = 0; spot.setAttribute('d', ''); spotRing.setAttribute('width', 0);
  }
"""


import base64 as _b64
import time as _time
import yaml as _yaml


def _capture_live_synced(page, cdp, shot: dict, out: Path) -> dict:
    """Như kcast.capture.capture_live nhưng mỗi thao tác chờ tới mốc `t_at` (đã tính từ giọng đọc),
    thêm thao tác `reveal` (hiện n dòng AI) và `doc` (hiện tài liệu xem trước)."""
    KCapture._goto(page, shot["url"])
    page.evaluate(KCapture.FIND_JS)
    frames = []

    def on_frame(ev):
        frames.append((ev["metadata"]["timestamp"], _b64.b64decode(ev["data"])))
        try:
            cdp.send("Page.screencastFrameAck", {"sessionId": ev["sessionId"]})
        except Exception:
            pass

    cdp.on("Page.screencastFrame", on_frame)
    vp = page.viewport_size
    cdp.send("Page.startScreencast", {"format": "jpeg", "quality": 86, "maxWidth": vp["width"] * 2,
                                      "maxHeight": vp["height"] * 2, "everyNthFrame": 1})
    t_start = _time.time()
    page.mouse.move(vp["width"] * 0.7, vp["height"] * 0.7)
    page.wait_for_timeout(int(shot.get("lead", 0.4) * 1000))
    events = []
    for a in shot.get("actions", []):
        do = a.get("do", "wait")
        if "t_at" in a:
            left = a["t_at"] - (_time.time() - t_start)
            if left > 0:
                page.wait_for_timeout(int(left * 1000))
        if do == "js":
            page.evaluate("([n, x]) => window.__act(n, x)", [a["name"], a.get("arg")])
            continue
        if do == "wait":
            page.wait_for_timeout(int(a.get("sec", 1.0) * 1000))
            continue
        found = page.evaluate("(t) => window.__kudoFind(t)", a["target"]) if a.get("target") else None
        if not found:
            events.append({"do": do, "t": round(_time.time() - t_start, 3), "found": False, "target": a.get("target")})
            continue
        sy = page.evaluate("scrollY")
        r = found["rect"]
        vr = {"x": r["x"], "y": r["y"] - sy, "w": r["w"], "h": r["h"]}
        tx, ty = vr["x"] + min(vr["w"] / 2, 260), vr["y"] + min(vr["h"] / 2, 120)
        if do == "point":  # con trỏ ở góc dưới bên phải phần có chữ, không đè lên chữ
            corner = page.evaluate(CONTENT_CORNER_JS, a["target"]["selector"])
            if corner:
                tx, ty = min(corner["x"] + 4, vp["width"] - 40), min(corner["y"] + 6, vp["height"] - 40)
        t_move = _time.time() - t_start
        if do in ("type", "click"):
            page.mouse.move(tx, ty)
        else:
            page.mouse.move(tx, ty, steps=14)
        t_hit = _time.time() - t_start
        typed = {}
        if do == "click":
            page.mouse.click(tx, ty)
        elif do == "type":
            page.mouse.click(tx, ty)
            page.wait_for_timeout(200)
            t_type = _time.time() - t_start
            page.keyboard.type(a.get("text", ""), delay=int(a.get("delay", 62)))
            typed = {"t_type": round(t_type, 3), "t_typed": round(_time.time() - t_start, 3), "text": a.get("text", "")}
        if do not in ("type", "click"):  # gõ và bấm gửi đã hiện thật trên giao diện, không thêm hiệu ứng nổi
            events.append({"do": do, "t_move": round(t_move, 3), "t": round(t_hit, 3), "found": True, "rect": vr,
                           "x": tx, "y": ty, "label": a.get("label"), "mark": a.get("mark"), "zoom": a.get("zoom"), **typed})
        page.wait_for_timeout(int(a.get("sec", 0.2) * 1000))
    page.wait_for_timeout(int(shot.get("tail", 0.8) * 1000))
    cdp.send("Page.stopScreencast")
    page.wait_for_timeout(200)
    if not frames:
        raise RuntimeError(f"LIVE_NO_FRAMES: {shot['id']}")
    t_first = frames[0][0]
    d = out / f"{shot['id']}-live"
    d.mkdir(exist_ok=True)
    flist = []
    for i, (ts, data) in enumerate(frames):
        (d / f"{i:05d}.jpg").write_bytes(data)
        flist.append({"src": f"{d.name}/{i:05d}.jpg", "t": round(ts - t_first, 3)})
    offset = t_first - t_start
    for ev in events:
        for k in ("t", "t_move", "t_type", "t_typed"):
            if k in ev:
                ev[k] = round(ev[k] - offset, 3)
    dur = round(max(flist[-1]["t"], (_time.time() - t_start) - offset - 0.2), 3)
    return {"kind": "live", "url": shot["url"], "frames": flist, "dur": dur, "events": events,
            "w": vp["width"], "h": vp["height"], "viewport": dict(vp)}


CONTENT_CORNER_JS = """(sel) => {
  const el = document.querySelector(sel); if (!el) return null;
  let x = 0, y = 0;
  const walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  while (walk.nextNode()) {
    if (!walk.currentNode.textContent.trim()) continue;
    const rg = document.createRange(); rg.selectNodeContents(walk.currentNode);
    for (const r of rg.getClientRects()) { if (r.width && r.height) { x = Math.max(x, r.right); y = Math.max(y, r.bottom); } }
  }
  return x ? {x, y} : null;
}"""

KCapture.capture_live = _capture_live_synced

LEAD_BY_DO = {"type": 0.75, "click": 0.55, "point": 0.6, "js": 0.0}


def write_timed_script(src_yaml: Path, run: Path) -> Path:
    """Gắn mốc t_at cho thao tác của cảnh live theo giọng đã căn; kiểm cảnh đủ dài để không phải tua nhanh."""
    script = _yaml.safe_load(src_yaml.read_text(encoding="utf-8"))
    words = SC._words(run)
    says = [x.get("say", "") for x in script["shots"]]
    per_shot = KP.split_words(says, words)
    spans = KP.shot_spans(per_shot)
    for k, shot in enumerate(script["shots"]):
        if shot.get("kind") != "live":
            continue
        toks = KP.tokens(shot["say"])
        t0, t1 = spans[k]
        cursor = 0
        for a in shot.get("actions", []):
            if not a.get("at"):
                continue
            idx = KP.find_phrase(toks, a["at"], cursor)
            if idx < 0:
                raise SystemExit(f"LIVE_AT_MISSING: {shot['id']} '{a['at']}'")
            cursor = idx
            rel = per_shot[k][idx]["start"] - t0 - 0.2
            a["t_at"] = round(max(0.3, rel - LEAD_BY_DO.get(a["do"], 0.0)) + a.pop("wait", 0.0), 3)
            a.pop("at")
        last = max((a.get("t_at", 0) for a in shot.get("actions", [])), default=0)
        shot["tail"] = round(max(0.6, min(2.0, (t1 - t0) - 0.6 - last - 1.6)), 2)
        print(f"  {shot['id']}: cảnh {t1 - t0:.1f}s, mốc thao tác {[a.get('t_at') for a in shot['actions']]}", flush=True)
    out = run / "script_timed.yaml"
    out.write_text(_yaml.safe_dump(script, allow_unicode=True, sort_keys=False, width=200), encoding="utf-8")
    return out


def write_widescreen_stage(run: Path, plan: dict) -> Path:
    """Writes `stage.html` and `stage.js` into `run/` and patches both for `1920x1080` widescreen rendering."""
    out = KRender.write_stage(run, plan)
    # 1. Patch stage.html
    html = out.read_text(encoding="utf-8")
    html = html.replace('viewBox="0 0 1000 808"', 'viewBox="0 0 1324 924"')
    html = html.replace("</style>", WIDESCREEN_16X9_STAGE_CSS + OPENER_CSS + "\n</style>")
    html = html.replace('<div id="content"></div>', '<div id="content"><div id="opener"></div></div>')
    out.write_text(html, encoding="utf-8")

    # 2. Patch stage.js for CW=1324, CH=924, CHROME=48, collage right-side coordinates, and mode-card class
    sjs_path = run / "stage.js"
    sjs = sjs_path.read_text(encoding="utf-8")
    sjs = sjs.replace("const CW = 1000, CH = 808, CHROME = 52;", "const CW = 1324, CH = 924, CHROME = 48;")
    sjs = sjs.replace("M0 0 H1000 V808 H0 Z", "M0 0 H1324 V924 H0 Z")
    sjs = sjs.replace(
        "d.innerHTML = `<span>${String(k + 1).padStart(2, '0')}</span><b>${x.name}</b><i>${x.tag || ''}</i>`;",
        "d.innerHTML = Array.isArray(x) ? `<span>${x[0]}</span><b>${x[1]}</b><i>${x[2] || ''}</i>` : `<span>${String(k + 1).padStart(2, '0')}</span><b>${x.name}</b><i>${x.tag || ''}</i>`;",
    )
    sjs = sjs.replace(
        "const x = 540 + a * 700 - 165, y = 1080 + Math.abs(a) * 120 - drift * (k % 2 ? 1 : -1) * .6;",
        "const x = 1435 + a * 340 - 185, y = 210 + Math.abs(a) * 55 - drift * (k % 2 ? 1 : -1) * .6;",
    )
    sjs = sjs.replace(
        "const isCard = s.kind === 'card';",
        "const isCard = s.kind === 'card' && !s.opener; document.body.classList.toggle('mode-card', isCard); document.body.classList.toggle('mode-opener', !!s.opener);",
    )
    # Cảnh mở đi như một cảnh thường: cột trái đứng yên, chỉ phần trong khung đổi
    for a, b in (
        ("if (s.kind === 'card') {", "if (s.kind === 'card' && !s.opener) {"),
        ("k <= countScreens(i)", "k <= countScreens(s.opener ? i + 1 : i)"),
        ("const prevKind = i > 0 ? D.shots[i - 1].kind : 'card';", "const prevKind = i > 0 ? (D.shots[i - 1].opener ? 'screen' : D.shots[i - 1].kind) : 'card';"),
        ("const nextKind = i + 1 < N ? D.shots[i + 1].kind : 'card';", "const nextKind = i + 1 < N ? (D.shots[i + 1].opener ? 'screen' : D.shots[i + 1].kind) : 'card';"),
        ("revealWords($('title'), t, s.t0 + .05);", "const afterOpener = i > 0 && D.shots[i - 1].opener; revealWords($('title'), t, afterOpener ? -99 : s.t0 + .05);"),
        ("const kp = outCubic(ramp(t, s.t0, s.t0 + .35));", "const kp = afterOpener ? 1 : outCubic(ramp(t, s.t0, s.t0 + .35));"),
        ("if (s.kind === 'demo') { await renderDemo", "if (s.opener) { renderOpener(s, t); return; }\n    if (s.kind === 'demo') { await renderDemo"),
    ):
        assert a in sjs, a
        sjs = sjs.replace(a, b)
    sjs = sjs.replace("window.renderAt = renderAt;", OPENER_JS + "\n  window.renderAt = renderAt;")
    # 3. Phụ đề: xuống dòng sau mỗi câu
    sjs = sjs.replace(
        "`<div>${c.words.map((w) => `<span>${w.text}</span>`).join(' ')}</div>`",
        "`<div>${c.words.map((w, k) => `<span>${w.text}</span>` + (/[.!?]$/.test(w.text) && k < c.words.length - 1 ? '<br>' : ' ')).join('')}</div>`",
    )
    # 4. Chú thích không đi theo con trỏ: đứng yên ngay dưới đối tượng đang nói tới
    sjs = sjs.replace(
        "label = cur.querySelector('#label'), arrow = cur.querySelector('svg');",
        "label = cur.querySelector('#label'), arrow = cur.querySelector('svg'); document.body.appendChild(label);",
    )
    sjs = sjs.replace(
        "label.style.transform = `scale(${.6 + .4 * p})`;",
        "const cr = cur.getBoundingClientRect(), lw = label.offsetWidth;"
        " label.style.left = Math.max(560, Math.min(1860 - lw, cr.left - lw + 34)) + 'px';"
        " label.style.top = Math.min(1006, cr.top + 42) + 'px';"
        " label.style.transform = `scale(${.9 + .1 * p})`;",
    )
    sjs_path.write_text(sjs, encoding="utf-8")
    return out


def _segment_widescreen(args: tuple[str, int, int, int, str]) -> str:
    stage_uri, f0, f1, fps, seg_path = args
    cmd = [
        "ffmpeg", "-v", "error", "-y", "-f", "image2pipe", "-vcodec", "mjpeg", "-framerate", str(fps), "-i", "-",
        "-c:v", "libx264", "-pix_fmt", "yuv420p", "-preset", "fast", "-crf", "17", seg_path,
    ]
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    assert proc.stdin is not None
    with sync_playwright() as p:
        br = KCapture.launch(p)
        ctx = br.new_context(viewport={"width": 1920, "height": 1080}, device_scale_factor=1)
        page = ctx.new_page()
        page.goto(stage_uri, wait_until="load")
        page.evaluate("window.__ready")
        for f in range(f0, f1):
            page.evaluate("(t) => window.renderAt(t)", f / fps)
            proc.stdin.write(page.screenshot(type="jpeg", quality=92))
        ctx.close()
        br.close()
    proc.stdin.close()
    if proc.wait() != 0:
        raise RuntimeError(f"ffmpeg segment failed: {seg_path}")
    return seg_path


def render_widescreen(run: Path, plan: dict, out: Path, workers: int = 4) -> Path:
    stage = write_widescreen_stage(run, plan)
    fps = plan.get("fps", 30)
    total = max(1, int(math.ceil(plan["duration"] * fps)))
    n = max(1, min(workers, os.cpu_count() or 4, total // 30 or 1))
    step = math.ceil(total / n)
    work = run / "work"
    work.mkdir(parents=True, exist_ok=True)
    jobs = [
        (stage.resolve().as_uri(), i * step, min(total, (i + 1) * step), fps, str(work / f"seg_{i:02d}.mp4"))
        for i in range(n) if i * step < total
    ]
    print(f"  dựng Widescreen 1920x1080: {total} khung ({plan['duration']:.1f}s @ {fps}fps) × {len(jobs)} luồng", flush=True)
    if len(jobs) == 1:
        segs = [_segment_widescreen(jobs[0])]
    else:
        with ProcessPoolExecutor(max_workers=len(jobs)) as ex:
            segs = list(ex.map(_segment_widescreen, jobs))
    out.parent.mkdir(parents=True, exist_ok=True)
    lst = work / "segs.txt"
    lst.write_text("".join(f"file '{Path(s).name}'\n" for s in segs), encoding="utf-8")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", str(lst), "-c", "copy", str(out)], check=True)
    return out


def still_widescreen(run: Path, plan: dict, times: list[float], out_dir: Path) -> list[Path]:
    stage = write_widescreen_stage(run, plan)
    out_dir.mkdir(parents=True, exist_ok=True)
    outs = []
    with sync_playwright() as p:
        br = KCapture.launch(p)
        ctx = br.new_context(viewport={"width": 1920, "height": 1080}, device_scale_factor=1)
        page = ctx.new_page()
        page.goto(stage.resolve().as_uri(), wait_until="load")
        page.evaluate("window.__ready")
        for t in times:
            page.evaluate("(t) => window.renderAt(t)", float(t))
            fp = out_dir / f"t_{float(t):06.2f}s.png"
            page.screenshot(path=str(fp))
            outs.append(fp)
        ctx.close()
        br.close()
    return outs


def _refine_screen_shot(s: dict, cap: dict):
    """Cảnh chữ lớn: con trỏ về góc dưới bên phải ô đang nói; bỏ lớp tối khi đích gần như cả trang."""
    rects = [b["rect"] for b in cap.get("beats", []) if b.get("rect")]
    cursor = s.get("cursor", [])
    for kf, r in zip(cursor[1:], rects):
        kf["x"], kf["y"] = round(r["x"] + r["w"] - 14, 1), round(r["y"] + r["h"] - 14, 1)
    s["spots"] = [sp for sp in s.get("spots", []) if sp["rect"]["w"] < 900]
    s["marks"] = [m for m in s.get("marks", []) if m["rect"]["w"] < 900]


def build_preview(run: Path, plan: dict) -> Path:
    """Bản xem trước khi render: ảnh dựng thật đổi theo giọng đọc, gói trong một tệp HTML."""
    stage = write_widescreen_stage(run, plan)
    times = [round(k * 1.5, 2) for k in range(int(plan["duration"] / 1.5) + 1)]
    frames, over = [], []
    with sync_playwright() as p:
        br = KCapture.launch(p)
        page = br.new_context(viewport={"width": 1920, "height": 1080}).new_page()
        page.goto(stage.resolve().as_uri(), wait_until="load")
        page.evaluate("window.__ready")
        openers = [s for s in plan["shots"] if s.get("opener")]
        for t in times:
            # Ảnh giữ 1,5 giây: cảnh mở không lấy ảnh lúc chữ còn đang hiện dần, kẻo trông như cảnh trống
            t = next((max(t, s["t0"] + 1.0) for s in openers if s["t0"] <= t < s["t1"]), t)
            page.evaluate("(t) => window.renderAt(t)", t)
            jpg = page.screenshot(type="jpeg", quality=62, scale="css", clip={"x": 0, "y": 0, "width": 1920, "height": 1080})
            frames.append(_b64.b64encode(jpg).decode())
        for c in plan["captions"]:
            page.evaluate("(t) => window.renderAt(t)", c["t0"] + 0.2)
            h = page.evaluate("(() => { const d = document.querySelector('#cap > div'); return d ? d.offsetHeight : 0; })()")
            if h > 418:
                over.append((round(c["t0"], 1), h))
        br.close()
    if over:
        print(f"CẢNH BÁO: phụ đề tràn ô tại {over}", flush=True)
    mp3 = run / "work" / "preview.mp3"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(run / "work" / "voice.wav"), "-ac", "1", "-b:a", "64k", str(mp3)], check=True)
    audio = _b64.b64encode(mp3.read_bytes()).decode()
    html = PREVIEW_HTML.replace("__TITLE__", VID).replace("__STEP__", "1.5").replace("__FRAMES__", json.dumps(frames)).replace("__AUDIO__", audio)
    out = SPRINT_DIR / "output_preview" / f"{VID}.html"
    out.parent.mkdir(exist_ok=True)
    out.write_text(html, encoding="utf-8")
    print(f"XEM TRƯỚC: {out} ({out.stat().st_size // 1024} KB, {len(frames)} ảnh)", flush=True)
    return out


PREVIEW_HTML = """<!doctype html><html lang="vi"><head><meta charset="utf-8"><title>Xem trước __TITLE__</title>
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>body{margin:0;background:#1f1d1a;color:#eee;font:15px system-ui;padding:12px}
img{width:100%;max-height:82vh;object-fit:contain;display:block;background:#000}
.b{display:flex;gap:12px;align-items:center;margin-top:10px}button{font:600 15px system-ui;padding:8px 18px;border-radius:8px;border:0;cursor:pointer}
input{flex:1}small{color:#aaa}</style></head><body>
<img id="f" alt="Khung hình xem trước"><div class="b"><button id="p">Phát</button><input id="r" type="range" min="0" step="0.1" value="0" aria-label="Vị trí"><span id="t">0:00</span></div>
<small>Bản xem trước: ảnh đổi mỗi 1,5 giây theo giọng đọc, chưa có chuyển động mượt và nhạc nền.</small>
<audio id="a" src="data:audio/mpeg;base64,__AUDIO__"></audio>
<script>const F=__FRAMES__,S=__STEP__,a=document.getElementById('a'),f=document.getElementById('f'),r=document.getElementById('r'),p=document.getElementById('p'),t=document.getElementById('t');
function d(){const k=Math.min(F.length-1,Math.floor(a.currentTime/S));f.src='data:image/jpeg;base64,'+F[k];if(document.activeElement!==r||!a.paused)r.value=a.currentTime;const s=Math.floor(a.currentTime);t.textContent=Math.floor(s/60)+':'+String(s%60).padStart(2,'0')}
a.addEventListener('loadedmetadata',()=>{r.max=a.duration});a.addEventListener('timeupdate',d);a.addEventListener('ended',()=>p.textContent='Phát');
p.onclick=()=>{if(a.paused){a.play();p.textContent='Dừng'}else{a.pause();p.textContent='Phát'}};r.oninput=()=>{a.currentTime=+r.value;d()};f.src='data:image/jpeg;base64,'+F[0];</script></body></html>
"""


def attach_openers(plan_data: dict):
    """Chuyển `opener` từ kịch bản sang plan và tính mốc tô từ khóa theo giọng đã căn. Bài không có cảnh mở thì bỏ qua."""
    script = _yaml.safe_load(SPEC_YAML.read_text(encoding="utf-8"))
    if not any(x.get("opener") for x in script["shots"]):
        return
    per_shot = KP.split_words([x.get("say", "") for x in script["shots"]], SC._words(RUN_DIR))
    for k, (src, s) in enumerate(zip(script["shots"], plan_data["shots"])):
        if not src.get("opener"):
            continue
        toks, cursor = KP.tokens(src["say"]), 0
        for m in src["opener"].get("marks", []):
            cursor = KP.find_phrase(toks, m["at"], cursor)
            if cursor < 0:
                raise SystemExit(f"OPENER_AT_MISSING: {s['id']} '{m['at']}'")
            m["t"] = per_shot[k][cursor]["start"]
        s["opener"] = src["opener"]


def refine_plan_for_widescreen(plan_path: Path):
    """Đổi chuỗi URL hiển thị trên khung cửa sổ thành địa chỉ trung tính (whitelabel)."""
    plan_data = json.loads(plan_path.read_text(encoding="utf-8"))
    attach_openers(plan_data)
    capture = json.loads((plan_path.parent / "capture" / "capture.json").read_text(encoding="utf-8"))["shots"]
    for i, s in enumerate(plan_data.get("shots", [])):
        if s.get("kind") == "live":
            s["typing"] = []
            s["spots"] = []
            s["marks"] = [m for m in s.get("marks", []) if m.get("kind") == "frame"]
        else:
            _refine_screen_shot(s, capture.get(s["id"], {}))
        labels = s.get("labels", [])
        for k, lb in enumerate(labels):  # chú thích ở lại đủ lâu để đọc
            nxt = labels[k + 1]["t0"] if k + 1 < len(labels) else s["t1"]
            lb["t1"] = round(min(lb["t0"] + 3.0, nxt, s["t1"]), 3)
        if "url" in s:
            s["url"] = f"khong-gian-lam-viec-ai/{VID.split('_')[0].lower()}/{s['id'].split('_', 1)[-1].replace('_', '-')}"
    plan_path.write_text(json.dumps(plan_data, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    return plan_data


def run_qa_widescreen(run: Path, plan: dict) -> int:
    cap = json.loads((run / "capture" / "capture.json").read_text(encoding="utf-8"))
    final = run / "out" / "final.mp4"
    video = final if final.is_file() else run / "work" / "silent.mp4"
    qd = run / "qa"
    qd.mkdir(exist_ok=True)
    errs, warns = [], []
    for sid, c in cap["shots"].items():
        for b in c.get("beats", []) + c.get("events", []):
            if not b.get("found"):
                errs.append(f"{sid}: không thấy đích {b.get('target')}")
    probe = json.loads(subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "stream=codec_type,width,height,r_frame_rate:format=duration", "-of", "json", str(video)],
        capture_output=True, text=True, check=True
    ).stdout)
    vs = [x for x in probe["streams"] if x["codec_type"] == "video"][0]
    dur = float(probe["format"]["duration"])
    if (vs["width"], vs["height"]) != (1920, 1080):
        errs.append(f"kích thước {vs['width']}x{vs['height']} khác 1920x1080")
    if abs(dur - plan["duration"]) > 0.30:
        errs.append(f"độ dài {dur:.2f}s lệch plan {plan['duration']:.2f}s")
    aj = Path(str(final) + ".audio.json")
    audio = json.loads(aj.read_text(encoding="utf-8")) if aj.is_file() else None
    if not audio or audio.get("verdict") != "PASS":
        errs.append("âm thanh chưa PASS")
    sheet = qd / "contact.jpg"
    n = 24
    subprocess.run([
        "ffmpeg", "-v", "error", "-y", "-i", str(video), "-vf",
        f"fps={n}/{max(dur, 1):.3f},scale=440:-1,tile=4x6:padding=8:color=0xEAE4D7", "-frames:v", "1", str(sheet)
    ], check=True)
    rep = {
        "video": str(video),
        "resolution": f"{vs['width']}x{vs['height']}",
        "duration": dur,
        "timing": plan["timing"],
        "errors": errs,
        "warnings": warns,
        "audio": audio and {k: audio[k] for k in ("ffmpeg_ebur128", "verdict")},
        "contact_sheet": str(sheet),
        "verdict": "FAIL" if errs else "PASS",
    }
    (qd / "report.json").write_text(json.dumps(rep, ensure_ascii=False, indent=1), encoding="utf-8")
    print(json.dumps(rep, ensure_ascii=False, indent=1))
    return 0 if not errs else 1


def main():
    if not VID or not SPEC_YAML.is_file():
        raise SystemExit("Dùng: python run_kudo_16x9.py <video_id>  (chạy build_pages.py trước)")
    preview_only = "--preview" in sys.argv
    RUN_DIR.mkdir(parents=True, exist_ok=True)
    OUTPUT_VIDEO_DIR.mkdir(parents=True, exist_ok=True)
    cap_json = RUN_DIR / "capture" / "capture.json"

    args = argparse.Namespace(
        script=str(SPEC_YAML),
        run=str(RUN_DIR),
        only=None,
        voice="Hải Đăng",
        ref=None,
        pace=1.02,
        workers=4,
        recipe="explainer",
        vol=0.10,
        sfx_vol=0.22,
        times=[],
    )

    voice_wav = RUN_DIR / "work" / "voice.wav"
    voice_tl = RUN_DIR / "work" / "voice_timeline.json"
    if not (voice_wav.is_file() and voice_tl.is_file()):
        print("=== STEP 2: Kudo Voice Synthesis (VieNeu-TTS 'Hải Đăng' @ pace 1.02, pause 520ms) & Whisper Alignment ===", flush=True)
        script_data = SC.load_script(str(SPEC_YAML))
        docs = RUN_DIR / "docs"
        docs.mkdir(exist_ok=True)
        says = [s.get("say", "").strip() for s in script_data["shots"]]
        perf = [s.get("perform", s.get("say", "")).strip() for s in script_data["shots"]]
        (docs / "clean.txt").write_text(" ".join(" ".join(says).split()) + "\n", encoding="utf-8")
        (docs / "performance.txt").write_text(" //\n".join(p for p in perf if p) + "\n", encoding="utf-8")
        if not voice_wav.is_file():
            VTTS.run(argparse.Namespace(run=RUN_DIR, voice=args.voice, ref=None, pace=args.pace))
        sys.argv = ["voice_align.py", str(RUN_DIR), "--model", "small"]
        VAlign.main()
    else:
        print("=== STEP 2: Using Completed Kudo Voice & Alignment ===", flush=True)

    print("=== STEP 1b: Gắn mốc thao tác theo giọng & quay màn hình ===", flush=True)
    args.script = str(write_timed_script(SPEC_YAML, RUN_DIR))
    rc = SC.cmd_capture(args)
    if rc != 0:
        raise RuntimeError(f"cmd_capture failed with code {rc}")

    print("=== STEP 3: Kudo Widescreen 16:9 Plan Generation ===", flush=True)
    rc = SC.cmd_plan(args)
    if rc != 0:
        raise RuntimeError(f"cmd_plan failed with code {rc}")

    plan_path = RUN_DIR / "plan.json"
    plan_data = refine_plan_for_widescreen(plan_path)

    if preview_only:
        print("=== Tạo bản xem trước, chưa render ===", flush=True)
        for name in ("silent.mp4", "voiced.mp4", "bed.wav"):  # lần render sau phải dựng theo bản vừa xem
            (RUN_DIR / "work" / name).unlink(missing_ok=True)
        build_preview(RUN_DIR, plan_data)
        return

    print("=== STEP 4: Kudo Widescreen Stills Inspection ===", flush=True)
    times = [round(s["t0"] + (s["t1"] - s["t0"]) * 0.55, 2) for s in plan_data["shots"]]
    still_widescreen(RUN_DIR, plan_data, times, RUN_DIR / "qa" / "stills")

    silent_mp4 = RUN_DIR / "work" / "silent.mp4"
    if not (silent_mp4.is_file() and silent_mp4.stat().st_size > 1000000):
        print("=== STEP 5: Kudo Widescreen 1920x1080 Render ===", flush=True)
        render_widescreen(RUN_DIR, plan_data, silent_mp4, workers=args.workers)
    else:
        print("=== STEP 5: Using Completed Widescreen Render (silent.mp4) ===", flush=True)

    print("=== STEP 6: Kudo Audio Mixing (-14 LUFS Voice + Procedural Explainer Bed + UI SFX) ===", flush=True)
    out_dir = RUN_DIR / "out"
    out_dir.mkdir(exist_ok=True)
    clip = RUN_DIR / "work" / "voiced.mp4"
    cues = KP.sfx_cues(plan_data)
    cues_path = RUN_DIR / "work" / "cues.json"
    cues_path.write_text(json.dumps(cues, ensure_ascii=False, indent=1), encoding="utf-8")
    bed_wav = RUN_DIR / "work" / "bed.wav"
    if not (bed_wav.is_file() and bed_wav.stat().st_size > 100000):
        sys.argv = ["score.py", "bed", str(bed_wav), "--duration", str(plan_data["duration"]), "--recipe", "explainer", "--cues", str(cues_path)]
        KScore.main()
    if not (clip.is_file() and clip.stat().st_size > 100000):
        dur = float(subprocess.run(
            ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(silent_mp4)],
            capture_output=True, text=True, check=True
        ).stdout)
        subprocess.run([
            "ffmpeg", "-v", "error", "-y", "-i", str(silent_mp4), "-i", str(voice_wav), "-filter_complex",
            f"[1:a]loudnorm=I=-14:TP=-1.5:LRA=11,aresample=48000,asetpts=N/SR/TB,apad=whole_dur={dur + 0.25:.3f}[a]",
            "-map", "0:v", "-map", "[a]", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-t", f"{dur:.3f}", str(clip)
        ], check=True)
    sys.argv = ["score.py", "mux", str(clip), str(bed_wav), "-o", str(out_dir / "final.mp4"), "--vol", str(args.vol), "--sfx-vol", str(args.sfx_vol)]
    rc = KScore.main()
    if rc != 0:
        raise RuntimeError(f"KScore mux failed with code {rc}")

    print("=== STEP 7: Kudo Widescreen Technical & Visual QA ===", flush=True)
    run_qa_widescreen(RUN_DIR, plan_data)

    final_mp4 = RUN_DIR / "out" / "final.mp4"
    target_mp4 = OUTPUT_VIDEO_DIR / json.loads(SPEC_JSON.read_text(encoding="utf-8"))["out_name"]
    if final_mp4.is_file():
        shutil.copy2(final_mp4, target_mp4)
        print(f"SUCCESS: Copied final widescreen 16:9 video to {target_mp4}", flush=True)


if __name__ == "__main__":
    main()
