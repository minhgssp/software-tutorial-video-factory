"""Đo MP4/WAV cho QA: thông số luồng, độ to, độ chuyển động, ảnh tổng hợp. Dùng qua tools/qa.py."""
from __future__ import annotations

import json
import re
import subprocess
from pathlib import Path

import numpy as np

FFMPEG = "/opt/homebrew/bin/ffmpeg"
FFPROBE = "/opt/homebrew/bin/ffprobe"


def streams(mp4: Path) -> dict:
    out = subprocess.run([FFPROBE, "-v", "error", "-show_streams", "-show_format", "-of", "json", str(mp4)],
                         capture_output=True, text=True, check=True).stdout
    d = json.loads(out)
    v = next((s for s in d["streams"] if s["codec_type"] == "video"), {})
    a = next((s for s in d["streams"] if s["codec_type"] == "audio"), {})
    num, den = (v.get("r_frame_rate") or "0/1").split("/")
    return {"W": v.get("width"), "H": v.get("height"), "fps": round(int(num) / max(1, int(den)), 3),
            "vcodec": v.get("codec_name"), "pix_fmt": v.get("pix_fmt"), "dur": round(float(d["format"]["duration"]), 3),
            "audio": bool(a), "acodec": a.get("codec_name"), "rate": int(a.get("sample_rate", 0) or 0),
            "channels": a.get("channels"), "mb": round(int(d["format"]["size"]) / 1e6, 1)}


def loudness(path: Path) -> dict:
    """Độ to tích hợp (LUFS) và đỉnh thật (dBFS) theo EBU R128."""
    err = subprocess.run([FFMPEG, "-hide_banner", "-nostats", "-i", str(path), "-af", "ebur128=peak=true", "-f", "null", "-"],
                         capture_output=True, text=True).stderr
    summary = err[err.rfind("Summary:"):]
    i = re.search(r"I:\s+(-?[\d.]+) LUFS", summary)
    p = re.search(r"Peak:\s+(-?[\d.]+|-inf) dBFS", summary)
    return {"I": float(i.group(1)) if i else None, "peak": float(p.group(1)) if p and p.group(1) != "-inf" else None}


def motion(mp4: Path, gw: int, gh: int, subtop: int, fps: int = 10, thr: float = 0.004) -> dict:
    """Độ chuyển động trên lưới logic (bỏ dải phụ đề): đoạn đứng yên ≥ 2 giây, % điểm ảnh đổi mỗi cửa sổ 5 giây."""
    raw = subprocess.run([FFMPEG, "-v", "error", "-i", str(mp4), "-vf", f"fps={fps},scale={gw}:{gh}:flags=neighbor,format=gray",
                          "-f", "rawvideo", "-"], capture_output=True, check=True).stdout
    fr = np.frombuffer(raw, np.uint8).reshape(-1, gh, gw).astype(np.int16)[:, :subtop, :]
    d = (np.abs(fr[1:] - fr[:-1]) > 12).mean(axis=(1, 2))
    big = d > thr
    quiet, start = [], 0
    for i, b in enumerate(list(big) + [True]):
        if b:
            if (i - start) / fps >= 2.0:
                quiet.append([round(start / fps, 1), round(i / fps, 1), round((i - start) / fps, 1)])
            start = i + 1
    n = int(len(d) / fps / 5)
    win = [round(float(d[k * fps * 5:(k + 1) * fps * 5].mean()) * 100, 2) for k in range(n)]
    return {"quiet_ge2": quiet, "longest_quiet": max([q[2] for q in quiet], default=0.0),
            "activity_per5s": win, "activity_min": min(win) if win else 0.0,
            "activity_median": round(float(np.median(win)), 2) if win else 0.0}


def stem_rms(path: Path, filt: str | None = None, win: float = 3.0, rate: int = 8000) -> np.ndarray:
    """RMS (dB) theo cửa sổ của một file âm thanh, sau bộ lọc ffmpeg tuỳ chọn."""
    cmd = [FFMPEG, "-v", "error", "-i", str(path)]
    if filt:
        cmd += ["-af", filt]
    cmd += ["-ac", "1", "-ar", str(rate), "-f", "f32le", "-"]
    x = np.frombuffer(subprocess.run(cmd, capture_output=True, check=True).stdout, np.float32)
    n = int(win * rate)
    k = len(x) // n
    blocks = x[:k * n].reshape(k, n)
    return 20 * np.log10(np.sqrt((blocks ** 2).mean(axis=1)) + 1e-9)


def frames_from_mp4(mp4: Path, times: list[float], outdir: Path) -> list[Path]:
    outdir.mkdir(parents=True, exist_ok=True)
    paths = []
    for t in times:
        p = outdir / f"t{t:06.2f}.png"
        subprocess.run([FFMPEG, "-v", "error", "-y", "-ss", f"{t:.3f}", "-i", str(mp4), "-frames:v", "1", str(p)], check=True)
        paths.append(p)
    return paths


def contact(paths: list[Path], times: list[float], out_stem: Path, cols: int, tw: int, per: int = 24,
            marks: dict[float, str] | None = None) -> list[Path]:
    """Ghép khung thành các ảnh tổng hợp (mỗi ảnh tối đa `per` khung), ghi giây và nhãn mốc ở góc."""
    from PIL import Image, ImageDraw
    marks = marks or {}
    sheets = []
    for s in range(0, len(paths), per):
        chunk = list(zip(times[s:s + per], paths[s:s + per]))
        w, h = Image.open(chunk[0][1]).size
        th = round(h * tw / w)
        rows = -(-len(chunk) // cols)
        sh = Image.new("RGB", (cols * tw, rows * th), "black")
        dr = ImageDraw.Draw(sh)
        for i, (t, p) in enumerate(chunk):
            x, y = (i % cols) * tw, (i // cols) * th
            sh.paste(Image.open(p).convert("RGB").resize((tw, th), Image.LANCZOS), (x, y))
            tag = f"{t:.2f}" + (f" {marks[t]}" if t in marks else "")
            dr.rectangle([x, y, x + 8 + 7 * len(tag), y + 14], fill=(0, 0, 0))
            dr.text((x + 4, y + 2), tag, fill=(255, 80, 80))
        f = out_stem.parent / f"{out_stem.name}-{s // per + 1}.png"
        sh.save(f)
        sheets.append(f)
    return sheets
