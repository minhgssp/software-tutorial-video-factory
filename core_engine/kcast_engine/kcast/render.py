"""Dựng plan.json thành MP4 câm: trang stage.html (phông nhúng base64) chụp từng khung bằng Playwright,
chia đoạn cho nhiều tiến trình rồi nối. Mọi chuyển động là hàm thuần của t nên các đoạn ghép khớp nhau."""

from __future__ import annotations

import base64
import json
import re
import shutil
import subprocess
from concurrent.futures import ProcessPoolExecutor
from pathlib import Path

from . import capture as C

HERE = Path(__file__).resolve().parent.parent


def fonts_css() -> str:
    css = (HERE / "fonts" / "fonts.css").read_text(encoding="utf-8")

    def emb(m: re.Match) -> str:
        data = base64.b64encode((HERE / "fonts" / m.group(1)).read_bytes()).decode()
        return f"url(data:font/woff2;base64,{data})"

    return re.sub(r"url\(\./([^)]+\.woff2)\)", emb, css)


def write_stage(run: Path, plan: dict) -> Path:
    html = (HERE / "stage.html").read_text(encoding="utf-8")
    html = html.replace("/*__FONTS__*/", fonts_css())
    html = html.replace("/*__DEMO__*/null", json.dumps(plan, ensure_ascii=False).replace("</", "<\\/"))
    shutil.copy(HERE / "stage.js", run / "stage.js")
    out = run / "stage.html"
    out.write_text(html, encoding="utf-8")
    return out


def _segment(args: tuple) -> str:
    stage, f0, f1, fps, out = args
    from playwright.sync_api import sync_playwright

    ff = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "image2pipe", "-framerate", str(fps), "-c:v", "mjpeg",
                           "-i", "-", "-c:v", "libx264", "-preset", "medium", "-crf", "17", "-pix_fmt", "yuv420p",
                           "-r", str(fps), out], stdin=subprocess.PIPE)
    with sync_playwright() as p:
        b = C.launch(p)
        page = b.new_page(viewport={"width": 1080, "height": 1920}, device_scale_factor=1)
        page.goto(Path(stage).as_uri())
        page.evaluate("window.__ready")
        for f in range(f0, f1):
            page.evaluate("(t) => window.renderAt(t)", f / fps)
            ff.stdin.write(page.screenshot(type="jpeg", quality=93))
        b.close()
    ff.stdin.close()
    if ff.wait() != 0:
        raise RuntimeError(f"FFMPEG_FAIL: {out}")
    return out


def render(run: Path, plan: dict, out: Path, workers: int = 6, frames: tuple[int, int] | None = None) -> Path:
    stage = write_stage(run, plan)
    fps = plan["fps"]
    total = int(round(plan["duration"] * fps))
    a, b = frames or (0, total)
    seg_dir = run / "work" / "segments"
    if seg_dir.exists():
        shutil.rmtree(seg_dir)
    seg_dir.mkdir(parents=True)
    n = max(1, min(workers, (b - a) // 30 or 1))
    step = -(-(b - a) // n)
    jobs = [(str(stage), s, min(b, s + step), fps, str(seg_dir / f"{k:03d}.mp4")) for k, s in enumerate(range(a, b, step))]
    with ProcessPoolExecutor(max_workers=n) as ex:
        segs = list(ex.map(_segment, jobs))
    lst = seg_dir / "list.txt"
    lst.write_text("".join(f"file '{Path(s).name}'\n" for s in segs))
    out.parent.mkdir(parents=True, exist_ok=True)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", str(lst), "-c", "copy", str(out)],
                   check=True)
    return out


def still(run: Path, plan: dict, times: list[float], out_dir: Path) -> list[Path]:
    """Chụp vài khung lẻ để tự xem (QA bằng mắt) mà không phải dựng cả video."""
    from playwright.sync_api import sync_playwright

    stage = write_stage(run, plan)
    out_dir.mkdir(parents=True, exist_ok=True)
    paths = []
    with sync_playwright() as p:
        b = C.launch(p)
        page = b.new_page(viewport={"width": 1080, "height": 1920})
        page.goto(stage.as_uri())
        page.evaluate("window.__ready")
        for t in times:
            page.evaluate("(t) => window.renderAt(t)", t)
            pth = out_dir / f"t{t:07.2f}.jpg"
            page.screenshot(path=str(pth), type="jpeg", quality=90)
            paths.append(pth)
        b.close()
    return paths
