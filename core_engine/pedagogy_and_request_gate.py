# -*- coding: utf-8 -*-
"""
Deterministic Request Contract Validator, Two-Stage Human Simulation Sign-Off Gate,
Environment Doctor (inspired by /kudo), FDE/PM On-Site Walkthrough Auditor,
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
    "fde-onsite-walkthrough": "FDE / PM On-Site Client Walkthrough (HTML-First trên Vercel: Hiện trạng -> Điểm nghẽn -> Wireframe -> Rủi ro/Option A-B -> Checklist Chốt)",
    "process-confirm": "Xác nhận quy trình nghiệp vụ trước lập trình (BA / UAT Sign-off)",
    "training-course": "Khóa học & Đào tạo nhân sự (Interactive E-Learning)",
    "system-handover": "Chuyển giao hệ thống & Hướng dẫn vận hành (SOP Walkthrough)",
    "product-demo": "Demo sản phẩm & Bán hàng (Interactive Presales Demo)",
    "mp4-video": "Xuất bản Video MP4 16:9 / 9:16 thuyết minh tự động (Chỉ khi được yêu cầu rõ)",
}

VALID_DELIVERY_MODES = {
    "html-vercel-first": "Ưu tiên số 1: Xuất bản Web HTML tương tác đẩy thẳng lên Vercel (Chỉ xuất MP4 khi được yêu cầu)",
    "html-local": "Xuất bản Cổng HTML tương tác chạy trực tiếp trên trình duyệt (Offline / LAN)",
    "mp4-export": "Xuất bản kèm tệp Video MP4 thuyết minh (Khi có yêu cầu xuất MP4)",
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
    vercel_ver = _cmd_version(["vercel", "--version"]) or _cmd_version(["npx", "--version"])
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
        {"name": "Node.js / Vercel CLI (HTML-First Vercel Deployment & JS Check)", "required": False, "ok": bool(node_ver or vercel_ver), "detail": node_ver or "optional (npm i -g vercel)"},
        {"name": "FFmpeg & FFprobe (Audio Processing & Optional MP4 Video Export)", "required": False, "ok": bool(ffmpeg_ver and ffprobe_ver), "detail": ffmpeg_ver or "optional (winget install Gyan.FFmpeg)"},
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
    """
    Parse and validate a <sim-request v="1">...</sim-request> contract block.
    Enforces:
      - Mandatory GATE 1 (`ui_references`): User MUST provide screenshots, demo images, wireframe descriptions, or repo paths first.
      - Mandatory GATE 2 (`simulation_approved`): Defaults to False so the pipeline builds and locks the HTML Simulation with the user BEFORE generating audio and effects.
    """
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
        errors.append(f"software_type '{sw_type}' không hợp lệ. Giá trị chuẩn: {sorted(VALID_SOFTWARE_TYPES.keys())}")

    use_case = kv.get("use_case", "")
    if use_case not in VALID_USE_CASES:
        errors.append(f"use_case '{use_case}' không hợp lệ. Giá trị chuẩn: {sorted(VALID_USE_CASES.keys())}")

    default_delivery = "mp4-export" if use_case == "mp4-video" else "html-vercel-first"
    delivery_mode = kv.get("delivery_mode", default_delivery).strip().lower()
    if delivery_mode not in VALID_DELIVERY_MODES:
        errors.append(f"delivery_mode '{delivery_mode}' không hợp lệ. Giá trị chuẩn: {sorted(VALID_DELIVERY_MODES.keys())}")

    aspect = kv.get("aspect", "16:9")
    if aspect not in VALID_ASPECTS:
        errors.append(f"aspect '{aspect}' không hợp lệ. Giá trị chuẩn: {sorted(VALID_ASPECTS)}")

    voice = kv.get("voice", "vieneu")
    if voice not in VALID_VOICES:
        errors.append(f"voice '{voice}' không hợp lệ. Giá trị chuẩn: {sorted(VALID_VOICES)}")

    topic = kv.get("topic", "").strip()
    if len(topic) < 5:
        errors.append("Thiếu trường 'topic' (mô tả quy trình/bài toán cần mô phỏng tối thiểu 5 ký tự).")

    # MANDATORY GATE 1: User MUST provide UI screenshots, demo images, wireframe description, or repo path
    ui_refs = (kv.get("ui_references") or kv.get("demo_assets") or "").strip()
    if len(ui_refs) < 5 or ui_refs.lower() in {"none", "null", "todo", "n/a", "chưa có", "khong co"}:
        errors.append(
            "⛔ CHỐT CHẶN ĐẦU VÀO (GATE 1 - ui_references): Bắt buộc cung cấp các giao diện, mô tả màn hình, ảnh demo hoặc đường dẫn wireframe trước. "
            "Hệ thống không tự ý dựng giao diện khi chưa có chất liệu đầu vào từ người dùng."
        )

    accent = kv.get("accent", "#D95D39")
    if not re.match(r"^#[0-9a-fA-F]{6}$", accent):
        errors.append(f"accent '{accent}' phải là mã màu Hex 6 ký tự (ví dụ: #D95D39).")

    context_example = kv.get("context_example", "").strip()
    if not context_example:
        warnings.append("Chưa khai báo 'context_example' (bối cảnh doanh nghiệp/nhân vật giả định). Ban Storyboard sẽ tự tạo bối cảnh dẫn nhập để tránh Tật 2 (nhảy cóc ví dụ).")

    sim_approved_raw = kv.get("simulation_approved", "false").strip().lower()
    simulation_approved = sim_approved_raw in {"true", "yes", "1", "approved", "da_chot"}

    if not simulation_approved:
        warnings.append(
            "⛔ CHỐT CHẶN PHA 1 (simulation_approved=false): Hệ thống sẽ chỉ dựng bản nháp Giao diện Mô phỏng HTML từ ảnh/mô tả của bạn và DỪNG LẠI chờ bạn xác nhận. "
            "Chỉ sau khi bạn chốt Simulation (simulation_approved: true), hệ thống mới đi tiếp dựng Audio thuyết minh và hiệu ứng con trỏ."
        )

    if errors:
        return {"ok": False, "errors": errors, "warnings": warnings, "resolved": None}

    is_fde_branch = use_case == "fde-onsite-walkthrough"
    gate_pipeline = [
        "1. ⛔ GATE 1 (Thu thập Đầu vào): Kiểm tra ảnh giao diện mẫu, mô tả màn hình, ảnh demo (`ui_references`) -> intake/ xuất `blueprint.json`",
        "2. ⛔ GATE 2 (Chốt HTML Simulation với Người dùng): surface/ dựng nguyên mẫu HTML (`src_sim_surfaces/` hoặc 5 Màn FDE Walkthrough) -> DỪNG LẠI trình người dùng duyệt giao diện (`simulation_approved: true`)",
        "3. ⛔ GATE 3 (Dựng Audio & Hiệu ứng sau khi đã chốt Simulation): storyboard/ + voice_engine sinh thuyết minh `VieNeu-TTS`/`Kokoro`, căn chỉnh từ và gắn hiệu ứng con trỏ 2 nhịp + Spotlight",
        "4. ⛔ GATE 4 (Kiểm định & Đẩy lên Vercel): review/ kiểm định 4 Tật kinh niên (`audit-pedagogy`) + xuất bản HTML-First kèm `vercel.json` (chỉ xuất `.mp4` khi được yêu cầu)",
    ]

    resolved = {
        "software_type": sw_type,
        "ui_archetype": VALID_SOFTWARE_TYPES[sw_type],
        "use_case": use_case,
        "use_case_label": VALID_USE_CASES[use_case],
        "delivery_mode": delivery_mode,
        "delivery_mode_label": VALID_DELIVERY_MODES[delivery_mode],
        "export_mp4": delivery_mode == "mp4-export",
        "aspect": aspect,
        "voice": voice,
        "accent": accent,
        "ui_references": ui_refs,
        "simulation_approved": simulation_approved,
        "execution_stage": "STAGE_2_AUDIO_EFFECTS_AND_DELIVERY" if simulation_approved else "STAGE_1_SIMULATION_PROTOTYPE_ONLY",
        "allow_audio_and_effects": simulation_approved,
        "topic": topic,
        "context_example": context_example or "Tự động dẫn nhập bối cảnh nghiệp vụ trước khi nêu ví dụ",
        "fde_5_act_structure": (
            [
                "Màn 1 (Act 1 — Hiện trạng Client): Trình bày bối cảnh và quy trình As-Is Trước - Trong - Sau phần mềm kèm giờ công hao phí",
                "Màn 2 (Act 2 — Chỉ rõ Điểm nghẽn): Khoanh vùng điểm nghẽn làm chậm tiến độ và các quy tắc ngầm trong kinh nghiệm cá nhân",
                "Màn 3 (Act 3 — Walkthrough Giải pháp / Wireframe): Dẫn dắt trên nguyên mẫu HTML gắn mã số quy chiếu [WF-01]..[WF-05]",
                "Màn 4 (Act 4 — Rủi ro & Phương án A/B): Chỉ ra các trường hợp ngoại lệ biên và đặt lên bàn Option A (Tinh gọn) vs Option B (Toàn diện) để Client chọn",
                "Màn 5 (Act 5 — Danh mục Checklist Tổng kết): Bảng xác nhận ngắn gọn 3 cột: (1) Nỗi đau · (2) Kỳ vọng · (3) Lựa chọn hướng giải pháp",
            ]
            if is_fde_branch
            else []
        ),
        "departments": {
            "lead_department": "surface -> (⛔ USER SIMULATION SIGN-OFF) -> storyboard",
            "support_department": "intake + archive",
            "review_department": "review (4 Anti-Pattern Gates + Playwright BBox + Vercel HTML Check)",
        },
        "gate_pipeline": gate_pipeline,
    }
    return {"ok": True, "errors": [], "warnings": warnings, "resolved": resolved}


def record_or_verify_simulation_signoff(
    project_dir: Path,
    approve: bool | None = None,
    ui_references: List[str] | None = None,
    screens_confirmed: List[str] | None = None,
    notes: str = "",
) -> Dict[str, Any]:
    """
    Create, update, or verify `simulation_signoff.json` in `project_dir`.
    Mechanically enforces that Audio & Effects (`Stage 2`) cannot run until the user has provided UI references
    and explicitly confirmed the HTML Simulation (`simulation_approved == True`).
    """
    pdir = Path(project_dir).resolve()
    signoff_file = pdir / "simulation_signoff.json"
    existing: Dict[str, Any] = {}
    if signoff_file.exists():
        try:
            existing = json.loads(signoff_file.read_text(encoding="utf-8"))
        except Exception:
            existing = {}

    if approve is not None or ui_references is not None or screens_confirmed is not None or notes:
        updated = {
            "schema_version": "3.2.0",
            "ui_references": ui_references if ui_references is not None else existing.get("ui_references", []),
            "screens_confirmed": screens_confirmed if screens_confirmed is not None else existing.get("screens_confirmed", []),
            "simulation_approved": bool(approve) if approve is not None else bool(existing.get("simulation_approved", False)),
            "notes": notes or existing.get("notes", ""),
        }
        pdir.mkdir(parents=True, exist_ok=True)
        signoff_file.write_text(json.dumps(updated, ensure_ascii=False, indent=2), encoding="utf-8")
        existing = updated

    ui_list = existing.get("ui_references", [])
    approved = bool(existing.get("simulation_approved", False))
    errors: List[str] = []
    if not ui_list:
        errors.append("⛔ GATE 1 CHƯA ĐẠT: Chưa ghi nhận danh sách giao diện/ảnh demo/mô tả đầu vào (`ui_references`) trong simulation_signoff.json.")
    if not approved:
        errors.append(
            "⛔ GATE 2 CHƯA ĐẠT: Người dùng chưa xác nhận chốt bản HTML Simulation (`simulation_approved: false`). "
            "Hãy mở bản nháp HTML cho người dùng duyệt rồi chạy `python factory_cli.py approve-sim --course-dir <path>` trước khi dựng Audio & Hiệu ứng."
        )

    return {
        "passed": len(errors) == 0,
        "signoff_file": str(signoff_file),
        "simulation_approved": approved,
        "ui_references": ui_list,
        "screens_confirmed": existing.get("screens_confirmed", []),
        "allow_audio_and_effects": len(errors) == 0,
        "errors": errors,
    }


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
        "course_dir": str(cdir),
        "files_scanned": files_scanned,
        "violation_count": len(violations),
        "violations": violations,
    }


def audit_fde_onsite_walkthrough(walkthrough_dir: Path) -> Dict[str, Any]:
    """
    Mechanically audit an `fde-onsite-walkthrough` package:
      1. HTML-First + `vercel.json` present for 1-command Vercel deployment.
      2. `simulation_signoff.json` present and approved (`simulation_approved: true`).
      3. All 5 FDE/PM On-Site Acts present in `index.html`:
         - `act-1-as-is` (Hiện trạng của Client)
         - `act-2-bottleneck` (Điểm nghẽn cốt lõi)
         - `act-3-wireframe` (Walkthrough Giải pháp / Wireframe đánh số `[WF-01]..`)
         - `act-4-risks-options` (Rủi ro & Phương án A/B cần Client xác nhận)
         - `act-5-checklist` (Danh mục Checklist ngắn gọn: Nỗi đau · Kỳ vọng · Lựa chọn hướng giải pháp)
      4. Zero violations of the 4 Chronic Anti-Patterns.
    """
    wdir = Path(walkthrough_dir).resolve()
    html_file = wdir / "index.html"
    vercel_file = wdir / "vercel.json"
    errors: List[str] = []

    if not html_file.exists():
        errors.append(f"Thiếu tệp HTML chính: {html_file}")
        return {"passed": False, "walkthrough_dir": str(wdir), "errors": errors}

    if not vercel_file.exists():
        errors.append("Thiếu tệp cấu hình `vercel.json` cho nhánh HTML-First đẩy lên Vercel.")
    else:
        try:
            json.loads(vercel_file.read_text(encoding="utf-8"))
        except Exception as exc:
            errors.append(f"`vercel.json` không phải JSON hợp lệ: {exc}")

    signoff_res = record_or_verify_simulation_signoff(wdir)
    if not signoff_res["passed"]:
        errors.extend(signoff_res["errors"])

    html_txt = html_file.read_text(encoding="utf-8")
    required_acts = [
        ("act-1-as-is", "Màn 1: Hiện trạng của Client (As-Is State)"),
        ("act-2-bottleneck", "Màn 2: Điểm nghẽn cốt lõi (Bottleneck Diagnosis)"),
        ("act-3-wireframe", "Màn 3: Walkthrough Giải pháp / Wireframe gắn số quy chiếu"),
        ("act-4-risks-options", "Màn 4: Rủi ro & Phương án lựa chọn (Options A/B)"),
        ("act-5-checklist", "Màn 5: Danh mục Checklist tổng kết (Nỗi đau · Kỳ vọng · Lựa chọn giải pháp)"),
    ]
    for act_id, label in required_acts:
        if act_id not in html_txt:
            errors.append(f"Thiếu `{act_id}` ({label}) trong index.html.")

    wf_markers = re.findall(r"\[WF-0[1-9]\]", html_txt)
    if len(set(wf_markers)) < 3:
        errors.append("Wireframe trong Màn 3 phải gắn tối thiểu 3 mã số quy chiếu (`[WF-01]`, `[WF-02]`, `[WF-03]`) khớp với bảng quy tắc.")

    for pillar in ("Nỗi đau", "Kỳ vọng", "Lựa chọn hướng giải pháp"):
        if pillar.lower() not in html_txt.lower():
            errors.append(f"Checklist tổng kết ở Màn 5 thiếu trụ cột bắt buộc: '{pillar}'.")

    anti_violations = audit_text_for_four_anti_patterns(html_txt, "index.html", is_opening_beat=False)
    for v in anti_violations:
        errors.append(f"[{v['rule']}] {v['matched']} ({v['fix_hint']})")

    return {
        "passed": len(errors) == 0,
        "walkthrough_dir": str(wdir),
        "vercel_ready": vercel_file.exists(),
        "simulation_approved": signoff_res["simulation_approved"],
        "wf_markers_found": sorted(set(wf_markers)),
        "errors": errors,
    }
