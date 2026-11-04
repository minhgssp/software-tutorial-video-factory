"""Quay màn hình thật bằng Playwright: chụp toàn trang + toạ độ vùng đích (cảnh tĩnh, camera dựng sau),
quay trực tiếp bằng CDP screencast khi cần thao tác thật (cuộn, bấm, gõ), và lấy clip kết quả để demo."""

from __future__ import annotations

import base64
import glob
import json
import os
import re
import shutil
import subprocess
import time
import urllib.request
from pathlib import Path

from . import plan as P

HERE = Path(__file__).resolve().parent.parent
FIND_JS = (HERE / "capture.js").read_text(encoding="utf-8")
MAX_PAGE_H = 4800  # CSS px; ảnh 2x cao tối đa 9600 px


def chrome_path() -> str | None:
    """Playwright Python có thể lệch phiên bản trình duyệt đã tải; dùng bản headless shell có sẵn nếu cần."""
    env = os.environ.get("KUDO_CHROME")
    if env:
        return env
    found = sorted(glob.glob(os.path.expanduser(
        "~/Library/Caches/ms-playwright/chromium_headless_shell-*/chrome-headless-shell-mac-*/chrome-headless-shell")))
    return found[-1] if found else None


def launch(p):
    exe = chrome_path()
    try:
        return p.chromium.launch()
    except Exception:
        if not exe:
            raise
        return p.chromium.launch(executable_path=exe)


def _goto(page, url: str) -> None:
    try:
        page.goto(url, wait_until="networkidle", timeout=45000)
    except Exception:
        page.goto(url, wait_until="load", timeout=60000)
    page.wait_for_timeout(600)


def _prepare(page, shot: dict) -> None:
    page.evaluate(FIND_JS)
    for sel in shot.get("hide", []):
        page.evaluate("(s) => document.querySelectorAll(s).forEach(e => e.style.setProperty('display','none','important'))", sel)
    # Cuộn hết trang để ảnh lười (lazy) tải đủ rồi về đầu trang.
    h = min(page.evaluate("document.documentElement.scrollHeight"), MAX_PAGE_H)
    for y in range(0, int(h), 700):
        page.evaluate(f"window.scrollTo(0,{y})")
        page.wait_for_timeout(120)
    page.evaluate("window.scrollTo(0,0)")
    page.wait_for_timeout(500)


def _snap(page, path: Path) -> dict:
    w = page.evaluate("document.documentElement.clientWidth")
    h = min(page.evaluate("document.documentElement.scrollHeight"), MAX_PAGE_H)
    page.screenshot(path=str(path), full_page=True, clip={"x": 0, "y": 0, "width": w, "height": h})
    return {"png": path.name, "w": w, "h": h, "url": page.url}


def capture_screen(page, shot: dict, out: Path) -> dict:
    _goto(page, shot["url"])
    _prepare(page, shot)
    states = [_snap(page, out / f"{shot['id']}-s0.png")]
    beats, state = [], 0
    for b in shot.get("beats", []):
        found = page.evaluate("(t) => window.__kudoFind(t)", b["target"]) if b.get("target") else None
        rec = {**b, "state": state, "found": bool(found)}
        if found:
            rec.update(rect=found["rect"], actionable=found["actionable"], tag=found["tag"])
        beats.append(rec)
        if found and b.get("navigate"):
            r = found["rect"]
            page.evaluate(f"window.scrollTo(0, {max(0, r['y'] - 300)})")
            page.wait_for_timeout(300)
            sy = page.evaluate("scrollY")
            page.mouse.click(r["x"] + r["w"] / 2, r["y"] + r["h"] / 2 - sy)
            try:
                page.wait_for_load_state("networkidle", timeout=20000)
            except Exception:
                pass
            page.wait_for_timeout(800)
            _prepare(page, shot)
            state += 1
            states.append(_snap(page, out / f"{shot['id']}-s{state}.png"))
    cands = page.evaluate("(m) => window.__kudoCandidates(m)", MAX_PAGE_H) if state == 0 else []
    want = int(shot.get("auto", 0))
    if want and sum(1 for b in beats if b.get("found")) < want:
        extra = P.auto_beats(shot.get("say", ""), cands, want - sum(1 for b in beats if b.get("found")))
        beats += [{**e, "state": 0, "found": True} for e in extra]
    return {"kind": "screen", "url": shot["url"], "states": states, "beats": beats, "candidates": cands[:40],
            "viewport": dict(page.viewport_size)}


def capture_live(page, cdp, shot: dict, out: Path) -> dict:
    """Quay thật: CDP gửi khung mỗi lần trang đổi; con trỏ thật di chuyển, bấm, gõ, cuộn. Ghi mốc từng thao tác."""
    _goto(page, shot["url"])
    page.evaluate(FIND_JS)
    frames: list[tuple[float, bytes]] = []

    def on_frame(ev):
        frames.append((ev["metadata"]["timestamp"], base64.b64decode(ev["data"])))
        try:
            cdp.send("Page.screencastFrameAck", {"sessionId": ev["sessionId"]})
        except Exception:
            pass

    cdp.on("Page.screencastFrame", on_frame)
    vp = page.viewport_size
    cdp.send("Page.startScreencast", {"format": "jpeg", "quality": 86, "maxWidth": vp["width"] * 2,
                                      "maxHeight": vp["height"] * 2, "everyNthFrame": 1})
    t_start = time.time()
    mouse = [vp["width"] * 0.7, vp["height"] * 0.7]
    page.mouse.move(*mouse)
    page.wait_for_timeout(int(shot.get("lead", 0.8) * 1000))
    events = []
    for a in shot.get("actions", []):
        do = a.get("do", "wait")
        if do == "wait":
            page.wait_for_timeout(int(a.get("sec", 1.0) * 1000))
            continue
        found = page.evaluate("(t) => window.__kudoFind(t)", a["target"]) if a.get("target") else None
        if do == "scroll":
            y = (found["rect"]["y"] - a.get("offset", 160)) if found else page.evaluate("scrollY") + a.get("by", 600)
            page.evaluate(f"window.scrollTo({{top:{max(0, y)}, behavior:'smooth'}})")
            t = time.time() - t_start
            page.wait_for_timeout(int(a.get("sec", 1.4) * 1000))
            events.append({"do": "scroll", "t": round(t, 3), "found": bool(found) or "by" in a})
            continue
        if not found:
            events.append({"do": do, "t": round(time.time() - t_start, 3), "found": False, "target": a.get("target")})
            continue
        sy = page.evaluate("scrollY")
        r = found["rect"]
        vr = {"x": r["x"], "y": r["y"] - sy, "w": r["w"], "h": r["h"]}
        if vr["y"] < 40 or vr["y"] + vr["h"] > vp["height"] - 40:
            page.evaluate(f"window.scrollTo({{top:{max(0, r['y'] - 220)}, behavior:'smooth'}})")
            page.wait_for_timeout(900)
            sy = page.evaluate("scrollY")
            vr = {"x": r["x"], "y": r["y"] - sy, "w": r["w"], "h": r["h"]}
        tx, ty = vr["x"] + vr["w"] / 2, vr["y"] + vr["h"] / 2
        t_move = time.time() - t_start
        page.mouse.move(tx, ty, steps=18)
        t_hit = time.time() - t_start
        typed = {}
        if do == "click":
            page.mouse.click(tx, ty)
        elif do == "type":
            # Gõ thật từng phím vào ô nhập; ghi mốc đầu/cuối để dựng thanh phím và tiếng gõ khớp khung quay.
            page.mouse.click(tx, ty)
            page.wait_for_timeout(250)
            t_type = time.time() - t_start
            page.keyboard.type(a.get("text", ""), delay=int(a.get("delay", 85)))
            typed = {"t_type": round(t_type, 3), "t_typed": round(time.time() - t_start, 3), "text": a.get("text", "")}
            if a.get("enter"):
                page.keyboard.press("Enter")
                typed["t_enter"] = round(time.time() - t_start, 3)
        events.append({"do": do, "t_move": round(t_move, 3), "t": round(t_hit, 3), "found": True, "rect": vr,
                       "x": tx, "y": ty, "label": a.get("label"), "mark": a.get("mark"), "zoom": a.get("zoom"), **typed})
        page.wait_for_timeout(int(a.get("sec", 1.2) * 1000))
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
    for e in events:
        for k in ("t", "t_move", "t_type", "t_typed", "t_enter"):
            if k in e:
                e[k] = round(e[k] - offset, 3)
    dur = round(max(flist[-1]["t"], (time.time() - t_start) - offset - 0.2), 3)
    return {"kind": "live", "url": shot["url"], "frames": flist, "dur": dur, "events": events,
            "w": vp["width"], "h": vp["height"], "viewport": dict(vp)}


_ANSI = re.compile(r"\x1b\[[0-9;?]*[ -/]*[@-~]|\x1b\][^\x07]*\x07")
_BLOCK = re.compile(r"\bsudo\b|\brm\s+-[a-z]*r[a-z]*f?\s+[~/]|\|\s*(ba|z)?sh\b|\bmkfs\b|>\s*/dev/|\b(npm|pnpm|yarn)\s+(i|install)\s+-g\b")


def capture_terminal(shot: dict, out: Path) -> dict:
    """Chạy lệnh THẬT trong thư mục tạm riêng của cảnh và ghi từng dòng đầu ra kèm mốc thời gian.
    Chặn lệnh nguy hiểm (sudo, rm -rf ngoài thư mục tạm, pipe vào shell, cài toàn cục) để quay không chạm máy thật."""
    work = out / f"{shot['id']}-term"
    if work.exists():
        shutil.rmtree(work)
    work.mkdir()
    env = {"PATH": os.environ.get("PATH", "/usr/bin:/bin"), "HOME": str(work), "LANG": "en_US.UTF-8",
           "TERM": "dumb", "NO_COLOR": "1", "GIT_TERMINAL_PROMPT": "0", "COLUMNS": str(shot.get("columns", 56))}
    steps = []
    for st in shot.get("steps", []):
        cmd = st["cmd"]
        if _BLOCK.search(cmd):
            raise RuntimeError(f"TERM_BLOCKED: lệnh bị chặn vì có thể chạm máy thật: {cmd}")
        t_start = time.time()
        proc = subprocess.Popen(["/bin/bash", "-c", cmd], cwd=work, env=env, stdout=subprocess.PIPE,
                                stderr=subprocess.STDOUT, bufsize=0)
        lines, buf = [], b""
        deadline = t_start + float(st.get("timeout", 90))
        while True:
            ch = proc.stdout.read(1)
            if not ch:
                break
            if ch in (b"\n", b"\r"):
                text = _ANSI.sub("", buf.decode("utf-8", "replace")).rstrip()
                # Dòng tiến độ ghi đè bằng \r (vd git clone): chỉ giữ trạng thái cuối.
                if text and lines and lines[-1].get("cr"):
                    lines[-1] = {"t": round(time.time() - t_start, 3), "text": text, "cr": ch == b"\r"}
                elif text:
                    lines.append({"t": round(time.time() - t_start, 3), "text": text, "cr": ch == b"\r"})
                buf = b""
            else:
                buf += ch
            if time.time() > deadline:
                proc.kill()
                raise RuntimeError(f"TERM_TIMEOUT: {cmd}")
        if buf.strip():
            lines.append({"t": round(time.time() - t_start, 3), "text": _ANSI.sub("", buf.decode("utf-8", "replace")).rstrip()})
        code = proc.wait()
        if code != 0 and not st.get("allow_fail"):
            raise RuntimeError(f"TERM_EXIT_{code}: {cmd}\n" + "\n".join(x["text"] for x in lines[-8:]))
        steps.append({"cmd": cmd, "out": [{"t": x["t"], "text": x["text"]} for x in lines], "code": code,
                      "dur": round(time.time() - t_start, 3)})
    return {"kind": "terminal", "steps": steps, "shell": "bash", "workdir": work.name}


def video_from_page(page, spec: dict) -> str:
    """Lấy nguồn video/gif kết quả ngay trên trang (README GitHub ký URL hết hạn sau vài phút nên phải lấy lúc quay)."""
    _goto(page, spec["url"])
    src = page.evaluate("""([sel, n]) => { const e = [...document.querySelectorAll(sel)][n];
        return e ? (e.currentSrc || e.src || e.getAttribute('src')) : null; }""", [spec.get("selector", "video"), spec.get("nth", 0)])
    if not src:
        raise RuntimeError(f"DEMO_NOT_FOUND: {spec}")
    return src


def capture_demo(shot: dict, out: Path, page=None) -> dict:
    """Clip kết quả để demo: file cục bộ, URL, hoặc tự lấy từ trang (video_from); tách khung 30 fps, rộng tối đa 1600 px."""
    src = shot["video"] if shot.get("video") else video_from_page(page, shot["video_from"])
    d = out / f"{shot['id']}-demo"
    if d.exists():
        shutil.rmtree(d)
    d.mkdir()
    if src.startswith("http"):
        local = out / f"{shot['id']}-src{Path(src.split('?')[0]).suffix or '.mp4'}"
        req = urllib.request.Request(src, headers={"User-Agent": "Mozilla/5.0 kudo-screencast"})  # noqa: S310
        with urllib.request.urlopen(req, timeout=60) as r, open(local, "wb") as f:
            shutil.copyfileobj(r, f)
        src = str(local)
    start, dur = float(shot.get("start", 0)), float(shot.get("dur", 5))
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(start), "-t", str(dur), "-i", src,
                    "-vf", "fps=30,scale='min(1600,iw)':-2", "-q:v", "3", str(d / "%05d.jpg")], check=True)
    files = sorted(d.glob("*.jpg"))
    if not files:
        raise RuntimeError(f"DEMO_NO_FRAMES: {shot['id']}")
    probe = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height",
                            "-of", "json", str(files[0])], capture_output=True, text=True, check=True)
    st = json.loads(probe.stdout)["streams"][0]
    return {"kind": "demo", "frames": [{"src": f"{d.name}/{p.name}", "t": round(i / 30, 3)} for i, p in enumerate(files)],
            "dur": round(len(files) / 30, 3), "w": st["width"], "h": st["height"],
            "source": shot.get("video") or shot["video_from"]["url"]}


def capture_all(script: dict, run: Path, only: list[str] | None = None) -> dict:
    from playwright.sync_api import sync_playwright

    out = run / "capture"
    out.mkdir(parents=True, exist_ok=True)
    path = out / "capture.json"
    result = json.loads(path.read_text()) if path.is_file() else {"shots": {}}
    vp = script.get("viewport", {"w": 1280, "h": 860})
    with sync_playwright() as p:
        browser = launch(p)
        ctx = browser.new_context(viewport={"width": vp["w"], "height": vp["h"]}, device_scale_factor=2,
                                  locale=script.get("locale", "en-US"), color_scheme=script.get("color_scheme", "light"))
        for shot in script["shots"]:
            kind = shot.get("kind", "screen")
            if kind == "card" or (only and shot["id"] not in only):
                continue
            if kind == "terminal":
                result["shots"][shot["id"]] = capture_terminal(shot, out)
                print(f"  quay {shot['id']}: terminal", flush=True)
                continue
            page = ctx.new_page()
            try:
                if kind == "screen":
                    result["shots"][shot["id"]] = capture_screen(page, shot, out)
                elif kind == "live":
                    cdp = ctx.new_cdp_session(page)
                    result["shots"][shot["id"]] = capture_live(page, cdp, shot, out)
                elif kind == "demo":
                    result["shots"][shot["id"]] = capture_demo(shot, out, page)
            finally:
                page.close()
            print(f"  quay {shot['id']}: {kind}", flush=True)
        browser.close()
    result["viewport"] = vp
    path.write_text(json.dumps(result, ensure_ascii=False, indent=1) + "\n")
    return result
