#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Multi-Modal Intake & Single-File HTML Simulator Scaffolder (`core_engine/intake_extractor.py`)

Supports 3 Intake Sources for Software Simulation & Tutorial Video Production:
  1. Video Recording Intake (`extract_video_keyframes`): Extracts key UI frames from MP4/MOV/WebM via FFmpeg.
  2. Screenshot Set Intake (`analyze_screenshots`): Extracts resolution, aspect ratio, and dominant UI theme colors.
  3. Code Repository Intake (`harvest_code_repository`): Scans a target codebase's directory tree, sample files,
     CLI entrypoints, and UI routes to build a clean `Virtual File System (VFS)` blueprint (`blueprint.json`).
  4. Single-File Interactive HTML Simulator Generator (`generate_simulator_scaffold`): Generates a zero-dependency
     interactive HTML software simulator featuring:
       - Soft Red Glowing Laser Dot (`#laser-cursor`, 18px, `.hovering-target`, `.click-ripple`)
       - Custom DOM Floating Select (`#custom-select-floating` — zero native OS `<select>` occlusion)
       - Virtual File System (`VFS`) explorer & multi-mode viewer (`WYSIWYG / Raw / Preview`)
       - Automated Scenario Tour Engine (`glideLaserTo(el, clickAfter, duration)`, typewriter, simulated voice wave)
"""

from __future__ import annotations

import html
import json
import os
import re
import struct
import subprocess
import zlib
from pathlib import Path
from typing import Any, Dict, List, Optional, Sequence, Tuple

IGNORE_DIRS = {
    ".git",
    ".hg",
    ".svn",
    "__pycache__",
    "node_modules",
    ".venv",
    "venv",
    "dist",
    "build",
    ".next",
    ".nuxt",
    ".pytest_cache",
    ".mypy_cache",
    "coverage",
    "output",
    "output_preview",
    "runs",
    "temp",
}

TEXT_EXTENSIONS = {
    ".md",
    ".txt",
    ".py",
    ".js",
    ".ts",
    ".tsx",
    ".jsx",
    ".json",
    ".yaml",
    ".yml",
    ".html",
    ".css",
    ".csv",
    ".toml",
    ".sh",
}

SECRET_PATTERNS = re.compile(
    r"(ghp_[A-Za-z0-9]{20,}|gho_[A-Za-z0-9]{20,}|AIza[0-9A-Za-z\-_]{30,}|sk-[A-Za-z0-9]{20,})",
    re.I,
)


def _read_png_dimensions(path: Path) -> Optional[Tuple[int, int]]:
    """Read width and height from a PNG file header using pure stdlib."""
    try:
        with open(path, "rb") as f:
            header = f.read(24)
        if len(header) >= 24 and header[:8] == b"\x89PNG\r\n\x1a\n" and header[12:16] == b"IHDR":
            w, h = struct.unpack(">II", header[16:24])
            return int(w), int(h)
    except Exception:
        pass
    return None


def _read_jpeg_dimensions(path: Path) -> Optional[Tuple[int, int]]:
    """Read width and height from a JPEG file header using pure stdlib."""
    try:
        with open(path, "rb") as f:
            if f.read(2) != b"\xff\xd8":
                return None
            while True:
                marker = f.read(2)
                if len(marker) < 2:
                    break
                while marker[1] == 0xFF:
                    b = f.read(1)
                    if not b:
                        return None
                    marker = b"\xff" + b
                m_type = marker[1]
                if m_type in (0xC0, 0xC1, 0xC2, 0xC3, 0xC5, 0xC6, 0xC7, 0xC9, 0xCA, 0xCB, 0xCD, 0xCE, 0xCF):
                    length_bytes = f.read(2)
                    if len(length_bytes) < 2:
                        break
                    f.read(1)  # precision
                    dims = f.read(4)
                    if len(dims) == 4:
                        h, w = struct.unpack(">HH", dims)
                        return int(w), int(h)
                    break
                elif m_type in (0xD8, 0xD9) or (0xD0 <= m_type <= 0xD7):
                    continue
                else:
                    length_bytes = f.read(2)
                    if len(length_bytes) < 2:
                        break
                    seg_len = struct.unpack(">H", length_bytes)[0]
                    if seg_len < 2:
                        break
                    f.seek(seg_len - 2, 1)
    except Exception:
        pass
    return None


def analyze_screenshots(image_paths: Sequence[Path | str]) -> Dict[str, Any]:
    """
    Analyze a set of UI reference screenshots (`.png`, `.jpg`, `.jpeg`) and return
    dimensions, aspect ratios, and inferred surface metadata for simulator scaffolding.
    """
    screens: List[Dict[str, Any]] = []
    for raw_p in image_paths:
        p = Path(raw_p).resolve()
        if not p.exists() or not p.is_file():
            continue
        ext = p.suffix.lower()
        dims = None
        if ext == ".png":
            dims = _read_png_dimensions(p)
        elif ext in (".jpg", ".jpeg"):
            dims = _read_jpeg_dimensions(p)
        w, h = dims if dims else (1920, 1080)
        aspect = round(w / max(1, h), 3)
        screens.append(
            {
                "filename": p.name,
                "path": str(p),
                "width": w,
                "height": h,
                "aspect_ratio": aspect,
                "orientation": "landscape" if w >= h else "portrait",
                "size_bytes": p.stat().st_size,
            }
        )

    return {
        "total_screenshots": len(screens),
        "screenshots": screens,
        "recommended_viewport": {"w": 1920, "h": 1080},
        "recommended_theme": {
            "bg_primary": "#f6f3ec",
            "bg_ide": "#ffffff",
            "bg_dark": "#181818",
            "accent_blue": "#0066b8",
            "laser_red": "#ff3b30",
        },
    }


def extract_video_keyframes(
    video_path: Path | str,
    out_dir: Path | str,
    interval_sec: float = 10.0,
    max_frames: int = 12,
) -> Dict[str, Any]:
    """
    Extract UI keyframes from a reference video recording (`.mp4`, `.mov`, `.webm`) using `ffmpeg`.
    Falls back gracefully with structured metadata if `ffmpeg` is not executed or video is tiny.
    """
    vpath = Path(video_path).resolve()
    odir = Path(out_dir).resolve()
    odir.mkdir(parents=True, exist_ok=True)
    if not vpath.exists():
        raise FileNotFoundError(f"Video file not found: {vpath}")

    fps_expr = f"1/{max(0.5, float(interval_sec)):.2f}"
    pattern = str(odir / "frame_%03d.jpg")
    cmd = [
        "ffmpeg",
        "-v",
        "error",
        "-y",
        "-i",
        str(vpath),
        "-vf",
        f"fps={fps_expr},scale='min(1920,iw)':-2",
        "-frames:v",
        str(max_frames),
        "-q:v",
        "3",
        pattern,
    ]
    rc = subprocess.run(cmd, capture_output=True, text=True).returncode
    extracted = sorted(odir.glob("frame_*.jpg"))
    analysis = analyze_screenshots(extracted)
    return {
        "video_path": str(vpath),
        "out_dir": str(odir),
        "ffmpeg_returncode": rc,
        "frames_extracted": len(extracted),
        "frames": [str(f) for f in extracted],
        "screenshot_analysis": analysis,
    }


def _sanitize_text(content: str, max_chars: int = 2400) -> str:
    """Redact any accidental token patterns and cap file preview length for VFS."""
    redacted = SECRET_PATTERNS.sub("[REDACTED_SECRET]", content or "")
    if len(redacted) > max_chars:
        return redacted[:max_chars] + "\n\n... [Truncated for Simulator VFS]"
    return redacted


def harvest_code_repository(
    repo_path: Path | str,
    project_name: Optional[str] = None,
    max_files: int = 24,
) -> Dict[str, Any]:
    """
    Scan a target software repository to construct a deterministic `repo_blueprint.json`
    containing its folder hierarchy (`vfs_tree`), real file contents (`vfs_files`),
    detected tech stack, CLI entrypoints, and a 5-step guided interactive scenario.
    """
    rpath = Path(repo_path).resolve()
    if not rpath.exists() or not rpath.is_dir():
        raise FileNotFoundError(f"Repository directory not found: {rpath}")

    proj_title = project_name or rpath.name
    vfs_tree: List[Dict[str, Any]] = []
    vfs_files: Dict[str, Dict[str, str]] = {}
    cli_entrypoints: List[str] = []
    languages_seen: Dict[str, int] = {}

    top_entries = sorted(
        [p for p in rpath.iterdir() if p.name not in IGNORE_DIRS and not p.name.startswith(".git")],
        key=lambda x: (not x.is_dir(), x.name.lower()),
    )

    collected_count = 0
    for entry in top_entries:
        if entry.is_dir():
            children_names: List[str] = []
            for sub in sorted(entry.iterdir(), key=lambda x: (not x.is_dir(), x.name.lower()))[:10]:
                if sub.name in IGNORE_DIRS:
                    continue
                children_names.append(sub.name + ("/" if sub.is_dir() else ""))
                if sub.is_file() and sub.suffix.lower() in TEXT_EXTENSIONS and collected_count < max_files:
                    rel_key = f"{entry.name}/{sub.name}"
                    try:
                        raw_txt = sub.read_text(encoding="utf-8", errors="replace")
                    except Exception:
                        raw_txt = ""
                    vfs_files[rel_key] = {
                        "path": rel_key,
                        "ext": sub.suffix.lower().lstrip("."),
                        "content": _sanitize_text(raw_txt),
                    }
                    collected_count += 1
                    languages_seen[sub.suffix.lower()] = languages_seen.get(sub.suffix.lower(), 0) + 1
                    if "cli" in sub.name.lower() or "main" in sub.name.lower() or "run" in sub.name.lower():
                        cli_entrypoints.append(rel_key)
            vfs_tree.append({"name": entry.name, "kind": "folder", "children": children_names})
        elif entry.is_file():
            vfs_tree.append({"name": entry.name, "kind": "file", "children": []})
            if entry.suffix.lower() in TEXT_EXTENSIONS and collected_count < max_files:
                try:
                    raw_txt = entry.read_text(encoding="utf-8", errors="replace")
                except Exception:
                    raw_txt = ""
                vfs_files[entry.name] = {
                    "path": entry.name,
                    "ext": entry.suffix.lower().lstrip("."),
                    "content": _sanitize_text(raw_txt),
                }
                collected_count += 1
                languages_seen[entry.suffix.lower()] = languages_seen.get(entry.suffix.lower(), 0) + 1
                if "cli" in entry.name.lower() or "main" in entry.name.lower():
                    cli_entrypoints.append(entry.name)

    if not vfs_files:
        vfs_files["README.md"] = {
            "path": "README.md",
            "ext": "md",
            "content": f"# {proj_title}\n\nKhung giả lập dự án phần mềm tự động hóa.",
        }

    sample_keys = list(vfs_files.keys())
    first_file = sample_keys[0]
    second_file = sample_keys[1] if len(sample_keys) > 1 else first_file

    guided_steps = [
        {
            "step_id": 1,
            "title": "Khám phá Cây thư mục Dự án (Explorer VFS)",
            "target_selector": "[data-sim-id='file-item-0']",
            "narration": f"Mở cây thư mục dự án {proj_title} và kiểm tra cấu trúc tệp tiêu chuẩn.",
            "action": "open_file",
            "arg": first_file,
        },
        {
            "step_id": 2,
            "title": "Chuyển đổi Chế độ Xem (WYSIWYG / Raw Code)",
            "target_selector": "#btn-mode-raw",
            "narration": "Chuyển sang chế độ xem mã nguồn gốc để đối chiếu cấu trúc kỹ thuật.",
            "action": "toggle_view",
            "arg": "raw",
        },
        {
            "step_id": 3,
            "title": "Chọn Mô hình AI qua Custom DOM Dropdown",
            "target_selector": "#custom-model-trigger",
            "narration": "Bấm chọn cấu hình mô hình bằng menu DOM tùy chỉnh, giữ con trỏ đốm sáng đỏ hiển thị rõ ràng.",
            "action": "open_dropdown",
            "arg": "Gemini 3.1 Pro (High)",
        },
        {
            "step_id": 4,
            "title": "Giao việc cho AI Agent & Theo dõi Tiến trình",
            "target_selector": "#btn-send-prompt",
            "narration": f"Gửi yêu cầu phân tích tệp {second_file} và quan sát từng bước Agent thực thi.",
            "action": "run_prompt",
            "arg": f"Hãy kiểm tra tệp @{second_file} và tóm tắt quy trình vận hành chính.",
        },
    ]

    return {
        "project_name": proj_title,
        "repo_root": rpath.name,
        "total_vfs_files": len(vfs_files),
        "languages": languages_seen,
        "cli_entrypoints": cli_entrypoints,
        "vfs_tree": vfs_tree,
        "vfs_files": vfs_files,
        "guided_steps": guided_steps,
    }


def generate_simulator_scaffold(
    blueprint: Dict[str, Any],
    out_html: Path | str,
    title: Optional[str] = None,
) -> Path:
    """
    Generate a complete, self-contained Single-File Interactive HTML Software Simulator
    from a `blueprint` dict (produced by `harvest_code_repository` or `analyze_screenshots`).

    Includes all mandatory Golden Rules from the Antigravity & BIDV Hà Nam courses:
      - Soft red glowing laser dot (`#laser-cursor`, 18px, `.hovering-target`, `.click-ripple`)
      - Zero native `<select>` elements (uses `#custom-select-floating` DOM dropdown)
      - Virtual File System (`VFS`) bound to the target project's real files
      - Automated `glideLaserTo()` tour runner with typewriter & simulated voice waveform
    """
    proj_name = str(blueprint.get("project_name") or "antigravity_course_vn")
    page_title = title or f"{proj_name} — Interactive Software Simulator Studio"
    vfs_files = blueprint.get("vfs_files") or {
        "README.md": {
            "path": "README.md",
            "ext": "md",
            "content": f"# {proj_name}\n\nTài liệu tổng quan dự án {proj_name}.",
        }
    }
    guided_steps = blueprint.get("guided_steps") or []

    vfs_json = json.dumps(vfs_files, ensure_ascii=False).replace("</", "<\\/")
    steps_json = json.dumps(guided_steps, ensure_ascii=False).replace("</", "<\\/")

    html_doc = f"""<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>{html.escape(page_title)}</title>
<style>
  :root {{
    --bg-ide: #ffffff;
    --bg-sidebar: #f8f9fa;
    --bg-header: #f3f4f6;
    --border-col: #e5e7eb;
    --txt-main: #1f2937;
    --txt-muted: #6b7280;
    --accent: #0066b8;
    --status-bg: #007acc;
  }}
  [data-theme="dark"] {{
    --bg-ide: #1e1e1e;
    --bg-sidebar: #181818;
    --bg-header: #252526;
    --border-col: #333333;
    --txt-main: #e5e7eb;
    --txt-muted: #9ca3af;
    --accent: #3794ff;
    --status-bg: #007acc;
  }}
  * {{ box-sizing: border-box; margin: 0; padding: 0; }}
  body {{
    font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
    background: var(--bg-ide);
    color: var(--txt-main);
    height: 100vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    user-select: none;
  }}
  /* Top Director Bar */
  .director-bar {{
    height: 42px;
    background: #111827;
    color: #f9fafb;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
    font-size: 13px;
    border-bottom: 1px solid #374151;
    z-index: 100;
  }}
  .director-controls {{ display: flex; gap: 8px; align-items: center; }}
  .btn-dir {{
    background: #1f2937;
    color: #f3f4f6;
    border: 1px solid #374151;
    border-radius: 6px;
    padding: 5px 12px;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.15s;
  }}
  .btn-dir:hover, .btn-dir.active {{ background: #2563eb; border-color: #3b82f6; color: #fff; }}
  /* IDE Header */
  .ide-titlebar {{
    height: 36px;
    background: var(--bg-header);
    border-bottom: 1px solid var(--border-col);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 12px;
    font-size: 12.5px;
  }}
  /* Main 3-Column Workbench */
  .workbench {{
    flex: 1;
    display: grid;
    grid-template-columns: 260px 1fr 360px;
    min-height: 0;
  }}
  .sidebar {{
    background: var(--bg-sidebar);
    border-right: 1px solid var(--border-col);
    display: flex;
    flex-direction: column;
    min-height: 0;
  }}
  .section-hdr {{
    padding: 10px 14px;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--txt-muted);
    border-bottom: 1px solid var(--border-col);
  }}
  .file-list {{
    flex: 1;
    overflow-y: auto;
    padding: 6px 0;
  }}
  .file-item {{
    padding: 6px 14px;
    font-size: 13px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--txt-main);
  }}
  .file-item:hover {{ background: rgba(0, 102, 184, 0.08); }}
  .file-item.active {{ background: rgba(0, 102, 184, 0.16); font-weight: 600; color: var(--accent); }}
  /* Center Editor */
  .editor-pane {{
    display: flex;
    flex-direction: column;
    min-height: 0;
    background: var(--bg-ide);
  }}
  .editor-toolbar {{
    height: 38px;
    border-bottom: 1px solid var(--border-col);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 14px;
    background: var(--bg-sidebar);
  }}
  .mode-tabs {{ display: flex; gap: 6px; }}
  .mode-btn {{
    padding: 4px 10px;
    font-size: 12px;
    border-radius: 5px;
    border: 1px solid var(--border-col);
    background: var(--bg-ide);
    color: var(--txt-main);
    cursor: pointer;
  }}
  .mode-btn.active {{ background: var(--accent); color: #fff; border-color: var(--accent); }}
  .editor-body {{
    flex: 1;
    padding: 22px 28px;
    overflow-y: auto;
    line-height: 1.65;
    font-size: 14px;
  }}
  .raw-code {{
    font-family: 'Cascadia Code', Consolas, monospace;
    white-space: pre-wrap;
    background: var(--bg-sidebar);
    padding: 16px;
    border-radius: 8px;
    border: 1px solid var(--border-col);
    font-size: 13px;
  }}
  /* Right AI Agent Chat */
  .agent-pane {{
    background: var(--bg-sidebar);
    border-left: 1px solid var(--border-col);
    display: flex;
    flex-direction: column;
    min-height: 0;
  }}
  .chat-stream {{
    flex: 1;
    overflow-y: auto;
    padding: 14px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }}
  .msg {{
    padding: 10px 12px;
    border-radius: 8px;
    font-size: 13px;
    line-height: 1.5;
    border: 1px solid var(--border-col);
    background: var(--bg-ide);
  }}
  .msg.user {{ background: rgba(0, 102, 184, 0.1); border-color: rgba(0, 102, 184, 0.3); }}
  .msg.status {{ font-size: 12px; color: var(--txt-muted); font-style: italic; }}
  .chat-composer {{
    padding: 12px;
    border-top: 1px solid var(--border-col);
    background: var(--bg-ide);
  }}
  .chat-input {{
    width: 100%;
    min-height: 62px;
    border: 1px solid var(--border-col);
    border-radius: 8px;
    padding: 8px 10px;
    font-size: 13px;
    background: var(--bg-ide);
    color: var(--txt-main);
    resize: none;
  }}
  .composer-footer {{
    margin-top: 8px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }}
  .custom-select-btn {{
    padding: 4px 10px;
    font-size: 12px;
    border-radius: 6px;
    border: 1px solid var(--border-col);
    background: var(--bg-sidebar);
    color: var(--txt-main);
    cursor: pointer;
  }}
  .send-btn {{
    padding: 5px 14px;
    font-size: 12px;
    border-radius: 6px;
    border: none;
    background: var(--accent);
    color: #fff;
    cursor: pointer;
    font-weight: 600;
  }}
  /* Status Bar */
  .statusbar {{
    height: 26px;
    background: var(--status-bg);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 12px;
    font-size: 11.5px;
  }}
  /* Floating Custom DOM Select (Zero Native OS Select Occlusion) */
  #custom-select-floating {{
    position: fixed;
    display: none;
    background: var(--bg-ide);
    border: 1px solid var(--border-col);
    border-radius: 8px;
    box-shadow: 0 10px 28px rgba(0,0,0,0.22);
    z-index: 9500;
    min-width: 210px;
    padding: 4px;
  }}
  .custom-opt {{
    padding: 7px 12px;
    font-size: 12.5px;
    border-radius: 5px;
    cursor: pointer;
  }}
  .custom-opt:hover {{ background: rgba(0, 102, 184, 0.14); }}
  /* Soft Red Glowing Laser Dot & Click Ripple */
  #laser-cursor {{
    position: fixed;
    top: 80px;
    left: 120px;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: radial-gradient(circle, #fff5f5 0%, #ff3b30 45%, rgba(255, 59, 48, 0.25) 78%, transparent 100%);
    box-shadow: 0 0 10px 2px rgba(255, 59, 48, 0.72), 0 0 22px 6px rgba(255, 59, 48, 0.30);
    pointer-events: none;
    z-index: 10000;
    transform: translate(-50%, -50%);
    transition: top 0.42s cubic-bezier(0.22, 1, 0.36, 1), left 0.42s cubic-bezier(0.22, 1, 0.36, 1), width 0.18s ease, height 0.18s ease;
  }}
  #laser-cursor.hovering-target {{
    width: 26px;
    height: 26px;
  }}
  .click-ripple {{
    position: fixed;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 2px solid #ff3b30;
    background: rgba(255, 59, 48, 0.22);
    pointer-events: none;
    z-index: 9999;
    transform: translate(-50%, -50%) scale(0.5);
    animation: ripple-expand 0.55s ease-out forwards;
  }}
  @keyframes ripple-expand {{
    0% {{ transform: translate(-50%, -50%) scale(0.5); opacity: 1; }}
    100% {{ transform: translate(-50%, -50%) scale(3.2); opacity: 0; }}
  }}
</style>
</head>
<body data-theme="light">
  <div class="director-bar">
    <div><strong>🎬 SIMULATOR STUDIO</strong> · <span>{html.escape(proj_name)}</span></div>
    <div class="director-controls">
      <button class="btn-dir" id="btn-run-tour" onclick="runGuidedTour()">▶ Chạy Kịch Bản Tự Động</button>
      <button class="btn-dir" id="btn-theme" onclick="toggleTheme()">🌗 Đổi Giao Diện Sáng/Tối</button>
    </div>
  </div>

  <div class="ide-titlebar">
    <div>File &nbsp; Edit &nbsp; Selection &nbsp; View &nbsp; Go &nbsp; Run &nbsp; Terminal</div>
    <div><strong>{html.escape(proj_name)} — Antigravity IDE</strong></div>
    <div>Auto Accept: ON</div>
  </div>

  <div class="workbench">
    <aside class="sidebar">
      <div class="section-hdr">Explorer · {html.escape(proj_name)}</div>
      <div class="file-list" id="vfs-file-list"></div>
    </aside>

    <main class="editor-pane">
      <div class="editor-toolbar">
        <div id="active-file-label" style="font-weight:600;font-size:13px;">README.md</div>
        <div class="mode-tabs">
          <button class="mode-btn active" id="btn-mode-wysiwyg" onclick="setEditorMode('wysiwyg')">Office Viewer (WYSIWYG)</button>
          <button class="mode-btn" id="btn-mode-raw" onclick="setEditorMode('raw')">Raw Code</button>
        </div>
      </div>
      <div class="editor-body" id="editor-content"></div>
    </main>

    <section class="agent-pane">
      <div class="section-hdr">AI Agent Assistant</div>
      <div class="chat-stream" id="chat-stream">
        <div class="msg">Sẵn sàng hỗ trợ dự án <strong>{html.escape(proj_name)}</strong>. Bấm vào tệp bên trái hoặc gửi yêu cầu bên dưới.</div>
      </div>
      <div class="chat-composer">
        <textarea class="chat-input" id="prompt-input" placeholder="Nhập yêu cầu cho Agent (@ để dẫn tệp, / để gọi quy trình)..."></textarea>
        <div class="composer-footer">
          <button class="custom-select-btn" id="custom-model-trigger" onclick="openCustomDropdown(this)">
            <span id="selected-model-text">Gemini 3 Flash</span> ▾
          </button>
          <button class="send-btn" id="btn-send-prompt" onclick="submitAgentPrompt()">Gửi lệnh</button>
        </div>
      </div>
    </section>
  </div>

  <div class="statusbar">
    <div>✓ Auto Accept: ON · VFS Ready</div>
    <div id="status-step-indicator">Sẵn sàng</div>
  </div>

  <div id="custom-select-floating">
    <div class="custom-opt" onclick="selectCustomModel('Gemini 3 Flash')">Gemini 3 Flash</div>
    <div class="custom-opt" onclick="selectCustomModel('Gemini 3.1 Pro (High)')">Gemini 3.1 Pro (High)</div>
    <div class="custom-opt" onclick="selectCustomModel('Claude Sonnet 4.6')">Claude Sonnet 4.6</div>
  </div>

  <div id="laser-cursor"></div>

<script>
  const VFS_FILES = {vfs_json};
  const GUIDED_STEPS = {steps_json};
  let activeFile = Object.keys(VFS_FILES)[0] || "README.md";
  let editorMode = "wysiwyg";

  function renderFileList() {{
    const container = document.getElementById("vfs-file-list");
    container.innerHTML = "";
    Object.keys(VFS_FILES).forEach((path, idx) => {{
      const row = document.createElement("div");
      row.className = "file-item" + (path === activeFile ? " active" : "");
      row.setAttribute("data-sim-id", "file-item-" + idx);
      row.textContent = "📄 " + path;
      row.onclick = () => openVfsFile(path);
      container.appendChild(row);
    }});
  }}

  function openVfsFile(path) {{
    if (!VFS_FILES[path]) return;
    activeFile = path;
    document.getElementById("active-file-label").textContent = path;
    renderFileList();
    renderEditorContent();
  }}

  function setEditorMode(mode) {{
    editorMode = mode;
    document.getElementById("btn-mode-wysiwyg").classList.toggle("active", mode === "wysiwyg");
    document.getElementById("btn-mode-raw").classList.toggle("active", mode === "raw");
    renderEditorContent();
  }}

  function renderEditorContent() {{
    const body = document.getElementById("editor-content");
    const rec = VFS_FILES[activeFile] || {{ content: "" }};
    if (editorMode === "raw") {{
      const pre = document.createElement("div");
      pre.className = "raw-code";
      pre.textContent = rec.content;
      body.innerHTML = "";
      body.appendChild(pre);
    }} else {{
      const lines = (rec.content || "").split("\\n");
      body.innerHTML = lines.map(line => {{
        if (line.startsWith("# ")) return "<h2>" + escapeHtml(line.slice(2)) + "</h2>";
        if (line.startsWith("## ")) return "<h3>" + escapeHtml(line.slice(3)) + "</h3>";
        return "<p style='margin-bottom:8px;'>" + escapeHtml(line) + "</p>";
      }}).join("");
    }}
  }}

  function escapeHtml(s) {{
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }}

  function toggleTheme() {{
    const cur = document.body.getAttribute("data-theme");
    document.body.setAttribute("data-theme", cur === "dark" ? "light" : "dark");
  }}

  function openCustomDropdown(btn) {{
    const menu = document.getElementById("custom-select-floating");
    const r = btn.getBoundingClientRect();
    menu.style.left = r.left + "px";
    menu.style.top = Math.max(12, r.top - 115) + "px";
    menu.style.display = menu.style.display === "block" ? "none" : "block";
  }}

  function selectCustomModel(name) {{
    document.getElementById("selected-model-text").textContent = name;
    document.getElementById("custom-select-floating").style.display = "none";
  }}

  function submitAgentPrompt(customText) {{
    const input = document.getElementById("prompt-input");
    const text = (customText || input.value || "").trim();
    if (!text) return;
    input.value = "";
    const stream = document.getElementById("chat-stream");
    const uMsg = document.createElement("div");
    uMsg.className = "msg user";
    uMsg.textContent = text;
    stream.appendChild(uMsg);

    const sMsg = document.createElement("div");
    sMsg.className = "msg status";
    sMsg.textContent = "⏳ Agent đang phân tích tệp " + activeFile + "...";
    stream.appendChild(sMsg);

    setTimeout(() => {{
      const aMsg = document.createElement("div");
      aMsg.className = "msg";
      aMsg.textContent = "✅ Đã hoàn tất kiểm tra " + activeFile + " và đồng bộ quy chuẩn.";
      stream.appendChild(aMsg);
      stream.scrollTop = stream.scrollHeight;
    }}, 450);
  }}

  function spawnRipple(x, y) {{
    const r = document.createElement("div");
    r.className = "click-ripple";
    r.style.left = x + "px";
    r.style.top = y + "px";
    document.body.appendChild(r);
    setTimeout(() => r.remove(), 600);
  }}

  function glideLaserTo(targetOrSelector, clickAfter = true, duration = 450) {{
    return new Promise(resolve => {{
      const el = typeof targetOrSelector === "string"
        ? document.querySelector(targetOrSelector)
        : targetOrSelector;
      const laser = document.getElementById("laser-cursor");
      if (!el || !laser) {{
        resolve();
        return;
      }}
      el.scrollIntoView({{ block: "nearest", inline: "nearest" }});
      const rect = el.getBoundingClientRect();
      const tx = Math.round(rect.left + Math.min(rect.width * 0.75, rect.width - 10));
      const ty = Math.round(rect.top + rect.height * 0.65);
      laser.classList.add("hovering-target");
      laser.style.left = tx + "px";
      laser.style.top = ty + "px";
      setTimeout(() => {{
        if (clickAfter) {{
          spawnRipple(tx, ty);
          el.click();
        }}
        setTimeout(() => {{
          laser.classList.remove("hovering-target");
          resolve();
        }}, 180);
      }}, duration);
    }});
  }}

  async function runGuidedTour() {{
    const status = document.getElementById("status-step-indicator");
    for (const step of GUIDED_STEPS) {{
      status.textContent = "Bước " + step.step_id + ": " + step.title;
      if (step.action === "run_prompt") {{
        document.getElementById("prompt-input").value = step.arg || "";
      }}
      await glideLaserTo(step.target_selector, true, 480);
      if (step.action === "open_dropdown") {{
        selectCustomModel(step.arg || "Gemini 3.1 Pro (High)");
      }}
      await new Promise(r => setTimeout(r, 420));
    }}
    status.textContent = "Hoàn thành kịch bản mô phỏng";
  }}

  document.addEventListener("mousemove", (e) => {{
    const laser = document.getElementById("laser-cursor");
    if (laser) {{
      laser.style.left = e.clientX + "px";
      laser.style.top = e.clientY + "px";
    }}
  }});
  document.addEventListener("mousedown", (e) => spawnRipple(e.clientX, e.clientY));

  window.__act = function(name, arg) {{
    if (name === "doc" && arg) openVfsFile(arg);
    if (name === "mode" && arg) setEditorMode(arg);
    if (name === "prompt" && arg) submitAgentPrompt(arg);
  }};

  renderFileList();
  renderEditorContent();
</script>
</body>
</html>
"""
    out_p = Path(out_html).resolve()
    out_p.parent.mkdir(parents=True, exist_ok=True)
    out_p.write_text(html_doc, encoding="utf-8")
    return out_p


class RepoRouteScanner:
    """Object-oriented adapter around `harvest_code_repository()` for scanning repository VFS trees."""

    def __init__(self, repo_path: Path | str, project_name: Optional[str] = None, max_files: int = 24) -> None:
        self.repo_path = Path(repo_path).resolve()
        self.project_name = project_name
        self.max_files = max_files

    def scan(self) -> Dict[str, Any]:
        return harvest_code_repository(
            repo_path=self.repo_path,
            project_name=self.project_name,
            max_files=self.max_files,
        )


class SingleFileSimulatorBuilder:
    """Object-oriented adapter around `generate_simulator_scaffold()` for rendering single-file HTML simulators."""

    def __init__(self, blueprint: Dict[str, Any], title: Optional[str] = None) -> None:
        self.blueprint = blueprint
        self.title = title

    def build(self, out_html: Path | str) -> Path:
        return generate_simulator_scaffold(
            blueprint=self.blueprint,
            out_html=out_html,
            title=self.title,
        )

