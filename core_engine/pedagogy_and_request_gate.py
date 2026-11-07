# -*- coding: utf-8 -*-
"""
Deterministic Request Contract Validator, Environment Doctor (inspired by /kudo),
and 4-Chronic-Anti-Pattern Pedagogy Auditor (inspired by /viet-chuyen-nghiep review/ gates).
"""
from __future__ import annotations

import json
import platform
import re
import shutil
import subprocess
import sys
from pathlib import Path
from typing import Any, Dict, List

VALID_SOFTWARE_TYPES = {
    "erp-crm": "PAT-01 / PAT-02: Hệ thống ERP, CRM & Quản trị Phê duyệt",
    "banking-portal": "PAT-01: Cổng Thẩm định Tín dụng & Nghiệp vụ Ngân hàng",
    "saas-dashboard": "PAT-04: Bảng điều khiển Phân tích Dữ liệu & SaaS BI",
    "multi-step-form": "PAT-03: Biểu mẫu Điện tử Đa bước (E-Form / Wizard)",
    "workspace-ide": "PAT-05: Không gian Làm việc Tài liệu & Trợ lý AI (Workspace / IDE)",
    "custom-web": "Giao diện Web / Mobile App Tùy chỉnh",
}

VALID_USE_CASES = {
    "training-course": "Khóa học & Đào tạo nhân sự (Interactive E-Learning)",
    "system-handover": "Chuyển giao hệ thống & Hướng dẫn vận hành (SOP Walkthrough)",
    "product-demo": "Demo sản phẩm & Bán hàng (Interactive Presales Demo)",
    "process-confirm": "Xác nhận quy trình nghiệp vụ trước lập trình (BA / UAT Sign-off)",
    "mp4-video": "Xuất bản Video MP4 16:9 / 9:16 thuyết minh tự động",
}

VALID_ASPECTS = {"16:9", "9:16", "1:1"}
VALID_VOICES = {"vieneu", "kokoro", "web-speech", "custom-wav"}

# 4 Chronic Anti-Pattern Rules
PATTERNS_TAT_1_PROMPT_LEAK = [
    r"REDLINE\s+FOCUS",
    r"FOCUS\s+SHOT\s*\d*",
    r"OPTION\s+BATTLE",
    r"BÔI\s+ĐEN\s+ĐỂ\s+COPY",
    r"LỜI\s+GIẢNG\s+ĐỒNG\s+BỘ",
    r"HTML\s+Vector\s+100%",
    r"\[PROMPT\]",
    r"\[SYSTEM\s+INSTRUCTION\]",
    r"shot\.note",
]

PATTERNS_TAT_3_SPATIAL_POINTER = [
    r"ở\s+thẻ\s+bên\s+trái",
    r"ở\s+thẻ\s+chính\s+giữa",
    r"ở\s+thẻ\s+giữa",
    r"ở\s+thẻ\s+bên\s+phải",
    r"sang\s+thẻ\s+bên\s+phải",
    r"nhìn\s+sang\s+bên\s+trái",
    r"nhìn\s+sang\s+bên\s+phải",
    r"cột\s+bên\s+trái\s+là",
    r"cột\s+bên\s+phải\s+là",
    r"hộp\s+thứ\s+nhất",
    r"hộp\s+thứ\s+hai",
    r"hộp\s+thứ\s+ba",
]

PATTERNS_TAT_4_MC_BRIDGING_AND_SLOP = [
    r"chào\s+mừng\s+anh\s+chị\s+đến\s+với\s+bài",
    r"chào\s+mừng\s+các\s+bạn\s+đến\s+với\s+bài",
    r"ở\s+bài\s+trước\s+chúng\s+ta\s+đã",
    r"trong\s+bài\s+học\s+trước\s+chúng\s+ta",
    r"như\s+đã\s+tìm\s+hiểu\s+ở\s+bài\s+trước",
    r"sang\s+bài\s+tiếp\s+theo\s+chúng\s+ta\s+sẽ",
    r"hẹn\s+gặp\s+lại\s+anh\s+chị\s+ở\s+bài\s+sau",
    r"hẹn\s+gặp\s+lại\s+ở\s+bài\s+tiếp\s+theo",
    r"\bbút\s+phê\b",
    r"xác\s+nhận\s+kép\s+bất\s+đồng\s+bộ",
    r"\bmàn\s+đấu\s+trí\b",
]


def _cmd_version(cmd: List[str]) -> str | None:
    exe = shutil.which(cmd[0])
    if not exe:
        return None
    try:
        out = subprocess.run([exe, *cmd[1:]], capture_output=True, text=True, timeout=10)
        text = (out.stdout or out.stderr or "").strip()
        return text.splitlines()[0] if text else "installed"
    except Exception:
        return None


def _venv_has(repo_root: Path, venv_name: str, module_name: str) -> str | None:
    bin_rel = "Scripts/python.exe" if platform.system() == "Windows" else "bin/python"
    py = repo_root / ".venv" / venv_name / bin_rel
    if not py.exists():
        return None
    try:
        ok = subprocess.run([str(py), "-c", f"import {module_name}"], capture_output=True, timeout=20).returncode == 0
        return f".venv/{venv_name}" if ok else None
    except Exception:
        return None


def run_environment_doctor(repo_root: Path) -> Dict[str, Any]:
    """Check runtime tools and optional voice/video engines without requiring heavy bundles in git."""
    py_ver = sys.version.split()[0]
    py_ok = sys.version_info >= (3, 10)
    node_ver = _cmd_version(["node", "--version"])
    ffmpeg_ver = _cmd_version(["ffmpeg", "-version"])
    ffprobe_ver = _cmd_version(["ffprobe", "-version"])

    has_playwright = subprocess.run([sys.executable, "-c", "import playwright"], capture_output=True).returncode == 0
    vieneu_env = _venv_has(repo_root, "vieneu", "vieneu")
    vieneu_model = (repo_root / "models" / "vieneu" / "backbone" / "onnx_update" / "config.json").exists()
    whisper_env = _venv_has(repo_root, "whisper", "faster_whisper") or _venv_has(repo_root, "faster-whisper-py312", "faster_whisper")
    kokoro_env = _venv_has(repo_root, "kokoro", "kokoro") or _venv_has(repo_root, "kokoro-py312", "kokoro")

    checks = [
        {"name": "Python >= 3.10 (Core Compiler & Audit Gates)", "required": True, "ok": py_ok, "detail": py_ver},
        {"name": "Playwright Python (HTML Simulator Bounding-Box Verification)", "required": True, "ok": has_playwright, "detail": "installed" if has_playwright else "missing (pip install playwright)"},
        {"name": "Node.js >= 20 (Kudo / Screencast / Styles JS Runtime)", "required": False, "ok": node_ver is not None, "detail": node_ver or "optional"},
        {"name": "FFmpeg & FFprobe (Audio Processing & MP4 Video Export)", "required": False, "ok": bool(ffmpeg_ver and ffprobe_ver), "detail": ffmpeg_ver or "optional (winget install Gyan.FFmpeg)"},
        {"name": "VieNeu-TTS (.venv/vieneu — Offline 48kHz Vietnamese Voice)", "required": False, "ok": vieneu_env is not None, "detail": vieneu_env or "optional (see docs/INSTALLATION_AND_VIENEU_SETUP.md)"},
        {"name": "VieNeu-TTS Model Weights (models/vieneu ~610 MB)", "required": False, "ok": vieneu_model, "detail": "ready" if vieneu_model else "optional (run vieneu_tts.py fetch)"},
        {"name": "Faster-Whisper (.venv/whisper — Word-Level Alignment)", "required": False, "ok": whisper_env is not None, "detail": whisper_env or "optional"},
        {"name": "Kokoro-ONNX (.venv/kokoro — Offline English Voice)", "required": False, "ok": kokoro_env is not None, "detail": kokoro_env or "optional"},
    ]
    missing_required = [c["name"] for c in checks if c["required"] and not c["ok"]]
    return {
        "passed": len(missing_required) == 0,
        "platform": f"{platform.system()} {platform.machine()}",
        "checks": checks,
        "missing_required": missing_required,
    }


def check_sim_request(raw_text: str) -> Dict[str, Any]:
    """Parse and validate a <sim-request v="1">...</sim-request> contract block."""
    m = re.search(r"<sim-request[^>]*>(.*?)</sim-request>", raw_text, flags=re.DOTALL | re.IGNORECASE)
    body = m.group(1) if m else raw_text
    kv: Dict[str, str] = {}
    for line in body.splitlines():
        line = line.strip()
        if not line or line.startswith("#") or ":" not in line:
            continue
        k, v = line.split(":", 1)
        kv[k.strip().lower()] = v.strip()

    errors: List[str] = []
    warnings: List[str] = []

    sw_type = kv.get("software_type", "")
    if sw_type not in VALID_SOFTWARE_TYPES:
        errors.append(f"software_type '{sw_type}' không hợp lệ. Giá trị chuẩn: { sorted(VALID_SOFTWARE_TYPES.keys()) }")

    use_case = kv.get("use_case", "")
    if use_case not in VALID_USE_CASES:
        errors.append(f"use_case '{use_case}' không hợp lệ. Giá trị chuẩn: { sorted(VALID_USE_CASES.keys()) }")

    aspect = kv.get("aspect", "16:9")
    if aspect not in VALID_ASPECTS:
        errors.append(f"aspect '{aspect}' không hợp lệ. Giá trị chuẩn: { sorted(VALID_ASPECTS) }")

    voice = kv.get("voice", "vieneu")
    if voice not in VALID_VOICES:
        errors.append(f"voice '{voice}' không hợp lệ. Giá trị chuẩn: { sorted(VALID_VOICES) }")

    topic = kv.get("topic", "").strip()
    if len(topic) < 5:
        errors.append("Thiếu trường 'topic' (mô tả quy trình/bài toán cần mô phỏng tối thiểu 5 ký tự).")

    accent = kv.get("accent", "#D95D39")
    if not re.match(r"^#[0-9a-fA-F]{6}$", accent):
        errors.append(f"accent '{accent}' phải là mã màu Hex 6 ký tự (ví dụ: #D95D39).")

    context_example = kv.get("context_example", "").strip()
    if not context_example:
        warnings.append("Chưa khai báo 'context_example' (bối cảnh doanh nghiệp/nhân vật giả định). Ban Storyboard sẽ tự tạo bối cảnh dẫn nhập để tránh Tật 2 (nhảy cóc ví dụ).")

    if errors:
        return {"ok": False, "errors": errors, "warnings": warnings, "resolved": None}

    resolved = {
        "software_type": sw_type,
        "ui_archetype": VALID_SOFTWARE_TYPES[sw_type],
        "use_case": use_case,
        "use_case_label": VALID_USE_CASES[use_case],
        "aspect": aspect,
        "voice": voice,
        "accent": accent,
        "topic": topic,
        "context_example": context_example or "Tự động dẫn nhập bối cảnh nghiệp vụ trước khi nêu ví dụ",
        "departments": {
            "lead_department": "surface -> storyboard",
            "support_department": "intake + archive",
            "review_department": "review (4 Anti-Pattern Gates + Playwright BBox)",
        },
        "gate_pipeline": [
            "1. intake/ khảo sát màn hình & quy trình -> ⛔ GATE xuất blueprint.json",
            "2. surface/ dựng nguyên mẫu HTML (src_sim_surfaces/) -> ⛔ GATE kiểm tra ID điểm neo",
            "3. storyboard/ biên kịch 2 chế độ (theory SVG + sim 2 pha) -> ⛔ GATE chạy thử HTML-First Preview",
            "4. review/ kiểm định 4 Tật kinh niên (audit-pedagogy & verify-course) -> ⛔ GATE Xuất bản",
        ],
    }
    return {"ok": True, "errors": [], "warnings": warnings, "resolved": resolved}


def audit_text_for_four_anti_patterns(text: str, location_label: str = "text", is_opening_beat: bool = False) -> List[Dict[str, str]]:
    """Scan a piece of text/HTML/JSON for the 4 chronic anti-patterns."""
    violations: List[Dict[str, str]] = []

    # 1. Tật 1: Lộ prompt nội bộ & ghi chú đạo diễn
    for pat in PATTERNS_TAT_1_PROMPT_LEAK:
        m = re.search(pat, text, flags=re.IGNORECASE)
        if m:
            violations.append({
                "rule": "TẬT_1_LỘ_PROMPT_NỘI_BỘ",
                "location": location_label,
                "matched": m.group(0),
                "fix_hint": "Xóa bỏ nhãn đạo diễn/prompt kỹ thuật hậu trường khỏi giao diện và lời giảng học viên.",
            })

    # 2. Tật 2: Cụt lủn, nhảy cóc ví dụ thiếu bối cảnh ở nhịp mở đầu
    if is_opening_beat:
        abrupt_codes = re.search(r"\b(ngăn\s+wip/|khách\s+hàng\s+[A-Z]\d+|hồ\s+sơ\s+[A-Z]\d+|#ORD-\d+)\b", text, flags=re.IGNORECASE)
        has_context_intro = re.search(r"\b(ví\s+dụ|giả\s+sử|trong\s+tình\s+huống|trong\s+nghiệp\s+vụ|bối\s+cảnh|khi\s+thẩm\s+định|khi\s+xử\s+lý)\b", text, flags=re.IGNORECASE)
        if abrupt_codes and not has_context_intro:
            violations.append({
                "rule": "TẬT_2_NHẢY_CÓC_THIẾU_BỐI_CẢNH",
                "location": location_label,
                "matched": abrupt_codes.group(0),
                "fix_hint": "Áp dụng công thức 3 Nhịp Đặt Bối Cảnh: Giới thiệu bài toán chung và nhân vật/doanh nghiệp giả định ('Ví dụ, trong hồ sơ của...') trước khi đưa mã hồ sơ/thư mục cụ thể.",
            })

    # 3. Tật 3: Tả tọa độ cơ học ("bên trái là...", "bên phải là...", "ở thẻ giữa...")
    for pat in PATTERNS_TAT_3_SPATIAL_POINTER:
        m = re.search(pat, text, flags=re.IGNORECASE)
        if m:
            violations.append({
                "rule": "TẬT_3_TẢ_TỌA_ĐỘ_CƠ_HỌC",
                "location": location_label,
                "matched": m.group(0),
                "fix_hint": "Thay cụm tả tọa độ vật lý bằng tên chức năng/nghiệp vụ của khu vực đó (Spotlight đã tự chiếu sáng vị trí).",
            })

    # 4. Tật 4: Dẫn dắt liên bài thừa thãi kiểu MC truyền hình & từ dịch máy
    for pat in PATTERNS_TAT_4_MC_BRIDGING_AND_SLOP:
        m = re.search(pat, text, flags=re.IGNORECASE)
        if m:
            violations.append({
                "rule": "TẬT_4_DẪN_DẮT_LIÊN_BÀI_VÀ_TỪ_DỊCH_MÁY",
                "location": location_label,
                "matched": m.group(0),
                "fix_hint": "Mỗi bài học phải là một viên kim cương tự bao đóng (xóa câu chào/nối bài trước-sau và thay từ dịch máy bằng từ công sở tự nhiên).",
            })

    return violations


def audit_course_pedagogy(course_dir: Path) -> Dict[str, Any]:
    """Audit an entire modular course directory against the 4 Chronic Anti-Patterns."""
    cdir = Path(course_dir).resolve()
    violations: List[Dict[str, str]] = []
    files_scanned = 0

    # Scan lessons_data/*.json if present
    ld_dir = cdir / "lessons_data"
    if ld_dir.exists():
        for jf in sorted(ld_dir.glob("lesson_*.json")):
            files_scanned += 1
            data = json.loads(jf.read_text(encoding="utf-8"))
            beats = data.get("beats", [])
            for idx, b in enumerate(beats):
                txt = " ".join(str(b.get(k, "")) for k in ("text", "say", "caption", "title", "badge"))
                violations.extend(
                    audit_text_for_four_anti_patterns(txt, f"{jf.name}#beat_{idx+1}", is_opening_beat=(idx == 0))
                )

    # Scan lessons/lesson_*/sessions/*.json and slides/*.html if present
    lessons_dir = cdir / "lessons"
    if lessons_dir.exists():
        for ldir in sorted(p for p in lessons_dir.iterdir() if p.is_dir()):
            sess_dir = ldir / "sessions"
            if sess_dir.exists():
                for idx, sf in enumerate(sorted(sess_dir.glob("b*.json"))):
                    files_scanned += 1
                    b = json.loads(sf.read_text(encoding="utf-8"))
                    txt = " ".join(str(b.get(k, "")) for k in ("text", "say", "caption", "title", "badge"))
                    violations.extend(
                        audit_text_for_four_anti_patterns(txt, f"{ldir.name}/{sf.name}", is_opening_beat=(idx == 0))
                    )
            slides_dir = ldir / "slides"
            if slides_dir.exists():
                for slf in sorted(slides_dir.glob("*.html")):
                    files_scanned += 1
                    html_txt = slf.read_text(encoding="utf-8")
                    violations.extend(
                        audit_text_for_four_anti_patterns(html_txt, f"{ldir.name}/slides/{slf.name}", is_opening_beat=False)
                    )

    return {
        "passed": len(violations) == 0,
        "status": "PASS" if len(violations) == 0 else "FAIL",
        "course_root": str(cdir),
        "files_scanned": files_scanned,
        "violations_count": len(violations),
        "violations": violations,
    }
