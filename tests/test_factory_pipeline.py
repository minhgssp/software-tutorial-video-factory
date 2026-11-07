#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Comprehensive Automated Test Suite for Software Simulation & Tutorial Video Factory (`tests/test_factory_pipeline.py` v2.0)

Tests all 5 Core Engines + CLI + Documentation (Spec & CodeMap) + Real Production Assets from both Courses:
  1. `course_compiler`: 5-Layer Modular Interactive Courseware compilation (`LessonSpecCompiler`, `CourseManifestBuilder`), `CourseIntegrityAuditor`, and Zero Audition Scope Pollution check (`PROP-261105-03`).
  2. `intake_extractor`: Repository VFS harvesting, screenshot dimension parsing, and Single-File HTML Simulator scaffolding.
  3. `scene_builder`: Compiling declarative 16:9 JSON specs (`B01_SaiLamThuongGap.json`) into standalone HTML scenes with `window.__act`.
  4. `kcast_engine`: `/kudo` screencast planning, phrase finding (`find_phrase`), `paragraph_captions`, and `-8dB` speech-ducked SFX (`sfx_cues_around_speech`).
  5. `syncgate_and_foley`: `/fac-video` Semantic SyncGate, Knuth-Plass Vietnamese compound-word line balancing, 48kHz Foley WAV synthesis, 5-Hz viseme extraction, `/reelcrew` 100-point Rubric, and HTML Simulator DOM Auditor (`#laser-cursor`, zero native `<select>`, `node --check`, zero context contamination).
"""

from __future__ import annotations

import sys
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parents[1]
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from core_engine import (  # noqa: E402
    CourseIntegrityAuditor,
    CourseManifestBuilder,
    LessonSpecCompiler,
    audit_html_simulator,
    audit_modular_courseware,
    audit_video_spec_rules,
    balance_vietnamese_lines,
    compile_modular_courseware,
    compile_spec_to_pages,
    extract_5hz_visemes_from_wav,
    generate_simulator_scaffold,
    harvest_code_repository,
    synthesize_procedural_foley_wav,
)
from core_engine.kcast_engine import (  # noqa: E402
    kcast_plan,
    paragraph_captions,
    sfx_cues_around_speech,
)


def _get_courseware_dir() -> Path:
    candidates = [
        ROOT_DIR / "examples" / "antigravity_studio_simulator",
        ROOT_DIR / "simulators" / "antigravity_basic",
    ]
    found = next((p for p in candidates if p.exists()), None)
    assert found is not None, "5-layer courseware directory must exist in examples/ or simulators/"
    return found


def test_5layer_course_compiler_and_manifest() -> None:
    """Verify 5-Layer LessonSpecCompiler and CourseManifestBuilder compile all 24 lessons (144 micro-beats)."""
    cdir = _get_courseware_dir()
    lesson_01_res = LessonSpecCompiler().compile_lesson(cdir / "lessons" / "lesson_01")
    assert lesson_01_res["lesson_slug"] == "lesson_01"
    assert lesson_01_res["slides_count"] == 1
    assert lesson_01_res["beats_count"] == 6
    assert Path(lesson_01_res["lesson_spec_js"]).exists()
    assert lesson_01_res["meta"].get("prerequisites")
    assert lesson_01_res["meta"].get("dependents")

    course_res = compile_modular_courseware(cdir)
    assert course_res["status"] == "ok"
    assert course_res["lessons_compiled"] == 24
    assert course_res["total_beats"] == 144
    assert course_res["total_duration_sec"] > 1500.0
    assert Path(course_res["manifest_js"]).exists()
    assert (cdir / "config" / "chapters_manifest.js").exists()
    assert (cdir.parent / "saas_workflow_process_demo" / "index.html").exists()
    assert (cdir.parent.parent / "docs" / "INSTALLATION_AND_VIENEU_SETUP.md").exists()
    assert (cdir.parent.parent / ".agents" / "skills" / "vieneu-tts-voice" / "SKILL.md").exists()
    index_txt = (cdir / "index.html").read_text(encoding="utf-8")
    assert 'id="home-view"' in index_txt and 'id="player-view"' in index_txt
    tokens_txt = (cdir / "assets" / "css" / "brand_tokens.css").read_text(encoding="utf-8")
    assert "--kudo-bg-cream: #FAF8F5" in tokens_txt and "--kudo-sidebar-width: 315px" in tokens_txt
    overrides_txt = (cdir / "assets" / "css" / "simulator_overrides.css").read_text(encoding="utf-8")
    assert ".k-layout-comparison" in overrides_txt
    assert ".k-layout-timeline" in overrides_txt
    assert ".k-layout-anatomy" in overrides_txt
    player_txt = (cdir / "assets" / "js" / "player_engine.js").read_text(encoding="utf-8")
    assert 'pCard.classList.add("visible")' not in player_txt


def test_5layer_course_integrity_and_zero_audition_pollution() -> None:
    """Verify CourseIntegrityAuditor passes with 0 errors and confirms zero audition file leakage."""
    cdir = _get_courseware_dir()
    audit_res = audit_modular_courseware(cdir)
    assert audit_res["passed"] is True, f"5-layer course integrity failed: {audit_res['errors']}"
    assert audit_res["status"] == "PASS"
    assert audit_res["lessons_checked"] == 24
    assert audit_res["beats_checked"] == 144
    assert len(audit_res["errors"]) == 0
    assert len(audit_res["warnings"]) == 0

    # Ensure zero audition files exist anywhere in the repository/lab root
    audition_hits = [p for p in ROOT_DIR.rglob("*") if "audition" in p.name.lower()]
    assert len(audition_hits) == 0, f"Forbidden audition artifacts found: {audition_hits}"


def test_spec_and_codemap_documentation_present() -> None:
    """Verify comprehensive Specification and CodeMap documentation exist."""
    if (ROOT_DIR / "docs").exists():
        spec_doc = ROOT_DIR / "docs" / "SPEC_V2_5LAYER_COURSEWARE_ENGINE.md"
        codemap_doc = ROOT_DIR / "docs" / "CODEMAP.md"
        assert spec_doc.exists() and spec_doc.stat().st_size > 4000
        assert codemap_doc.exists() and codemap_doc.stat().st_size > 4000
    elif (ROOT_DIR / "specs").exists():
        codemap_spec = ROOT_DIR / "specs" / "06_5Layer_Modular_Courseware_And_Codemap.md"
        assert codemap_spec.exists() and codemap_spec.stat().st_size > 4000


def test_repo_harvest_and_simulator_scaffold(tmp_path: Path) -> None:
    """Verify code repository harvesting into a VFS blueprint and generating an audited HTML simulator."""
    bp = harvest_code_repository(ROOT_DIR / "core_engine", project_name="antigravity_course_vn", max_files=10)
    assert bp["project_name"] == "antigravity_course_vn"
    assert bp["total_vfs_files"] >= 1
    assert len(bp["guided_steps"]) >= 3

    out_html = tmp_path / "generated_simulator.html"
    res_path = generate_simulator_scaffold(bp, out_html)
    assert res_path.exists()

    audit_res = audit_html_simulator(res_path, forbidden_terms=["C20_TelecomCorp_Product_Manager", "New Way Edu"])
    assert audit_res["passed"] is True, f"Audit failed: {audit_res['violations']}"
    assert audit_res["js_syntax_ok"] is True


def test_antigravity_studio_simulator_passes_audit() -> None:
    """Verify the flagship 4,355-line Antigravity_Simulator_Studio.html passes 100% of DOM & JS checks."""
    cdir = _get_courseware_dir()
    sim_path = cdir / "Antigravity_Simulator_Studio.html"
    assert sim_path.exists(), "Antigravity_Simulator_Studio.html must exist"

    res = audit_html_simulator(
        sim_path,
        forbidden_terms=["C20_TelecomCorp_Product_Manager", "TelecomCorp", "New Way Edu"],
        require_laser_cursor=True,
    )
    assert res["passed"] is True, f"Flagship simulator failed audit: {res['violations']}"
    assert res["line_count"] > 3500


def test_scene_builder_and_enterprise_spec_audit(tmp_path: Path) -> None:
    """Verify compiling FinBank Đơn vị Doanh nghiệp JSON specs into 6-archetype HTML pages and running the Rubric + SyncGate auditor."""
    candidates = [
        ROOT_DIR / "examples" / "enterprise_16x9_course" / "specs" / "B01_SaiLamThuongGap.json",
        ROOT_DIR / "simulators" / "enterprise_ai_course" / "specs" / "B01_SaiLamThuongGap.json",
    ]
    spec_path = next((p for p in candidates if p.exists()), None)
    assert spec_path is not None, "B01_SaiLamThuongGap.json must exist"

    audit = audit_video_spec_rules(spec_path, enforce_whitelabel=True)
    assert audit["passed"] is True, f"Spec B01 failed audit: {audit['violations']}"
    assert audit["rubric_score"] >= 95.0

    compiled = compile_spec_to_pages(spec_path, tmp_path / "pages")
    assert compiled["pages_compiled"] >= 5
    first_page = Path(compiled["files"][0]).read_text(encoding="utf-8")
    assert "<!doctype html>" in first_page.lower()


def test_kudo_kcast_and_widescreen_helpers() -> None:
    """Verify embedded /kudo screencast planner, paragraph captions, and -8dB speech-ducked SFX."""
    sug = kcast_plan.suggest("Hướng dẫn cách cài đặt và bấm thử công cụ trên trình duyệt")
    assert sug["screencast"] is True
    assert sug["score"] >= 3

    words = kcast_plan.estimate_words(["Nhiều bạn mở công cụ lên rồi hỏi từng câu rời rạc. Kết quả trả về rất chung chung."])
    caps = paragraph_captions(words)
    assert len(caps) >= 1
    assert len(caps[0]["words"]) >= 5

    dummy_plan = {
        "shots": [
            {"t0": 0.0, "clicks": [0.8], "marks": [{"t0": 1.2}], "typing": []},
            {"t0": 4.0, "clicks": [], "marks": [], "typing": []},
        ],
        "captions": caps,
    }
    cues = sfx_cues_around_speech(dummy_plan)
    assert "hits" in cues
    assert len(cues["hits"]) >= 2


def test_fac_video_foley_visemes_and_line_balancer(tmp_path: Path) -> None:
    """Verify /fac-video Knuth-Plass Vietnamese line balancer, 48kHz Foley WAV synthesis, and 5-Hz visemes."""
    lines = balance_vietnamese_lines(
        "Nhiều phụ huynh và học sinh tìm kiếm giải pháp thực chiến cho hệ thống thông minh.",
        max_chars_per_line=32,
    )
    assert len(lines) >= 2
    for ln in lines:
        assert len(ln) <= 34

    wav_out = tmp_path / "foley_test.wav"
    ev_count = synthesize_procedural_foley_wav(
        [{"time_sec": 0.2, "kind": "page"}, {"time_sec": 0.8, "kind": "click"}],
        duration_s=1.5,
        out_wav=wav_out,
    )
    assert ev_count == 2
    assert wav_out.exists() and wav_out.stat().st_size > 48000

    visemes = extract_5hz_visemes_from_wav(wav_out, fps=5)
    assert len(visemes) >= 5
    assert set(visemes).issubset({"SIL", "ROUND_O_U", "FRICATIVE_S_I", "WIDE_A_E", "MID_TALK"})



def test_v31_kudo_doctor_and_sim_request_contract() -> None:
    """Verify Kudo-inspired doctor check, studio-request-builder.html, and <sim-request> contract validation."""
    from core_engine.pedagogy_and_request_gate import check_sim_request, run_environment_doctor

    doc = run_environment_doctor(ROOT_DIR)
    assert doc["passed"] is True
    assert any(c["name"].startswith("Python >= 3.10") and c["ok"] for c in doc["checks"])
    assert (ROOT_DIR / "studio-request-builder.html").exists()

    valid_req = """
    <sim-request v="1" factory=">=3.2.0">
    software_type: banking-portal
    use_case: process-confirm
    delivery_mode: html-vercel-first
    ui_references: input/screens/credit_portal_step1.png, input/screens/approval_modal.png
    simulation_approved: false
    aspect: 16:9
    voice: vieneu
    accent: #D95D39
    context_example: Ví dụ thẩm định hồ sơ cấp hạn mức 30 tỷ cho Công ty Sản xuất Minh Phát
    topic: Quy trình 3 bước lọc hồ sơ vượt hạn mức và bấm phê duyệt tờ trình.
    </sim-request>
    """
    res = check_sim_request(valid_req)
    assert res["ok"] is True
    assert res["resolved"]["software_type"] == "banking-portal"
    assert res["resolved"]["execution_stage"] == "STAGE_1_SIMULATION_PROTOTYPE_ONLY"
    assert res["resolved"]["allow_audio_and_effects"] is False
    assert len(res["resolved"]["gate_pipeline"]) == 4

    # Missing ui_references MUST be rejected by GATE 1
    no_ui_req = """
    <sim-request v="1">
    software_type: banking-portal
    use_case: process-confirm
    topic: Quy trình 3 bước lọc hồ sơ vượt hạn mức.
    </sim-request>
    """
    no_ui_res = check_sim_request(no_ui_req)
    assert no_ui_res["ok"] is False
    assert any("GATE 1" in e for e in no_ui_res["errors"])

    bad_req = "<sim-request>software_type: unknown_app\nuse_case: bad_case</sim-request>"
    bad_res = check_sim_request(bad_req)
    assert bad_res["ok"] is False
    assert len(bad_res["errors"]) >= 2


def test_v32_fde_onsite_walkthrough_and_simulation_signoff_gate(tmp_path: Path) -> None:
    """Verify the new `fde-onsite-walkthrough` branch (HTML-first + Vercel) and Two-Stage Simulation Sign-off Gate."""
    from core_engine.pedagogy_and_request_gate import (
        audit_fde_onsite_walkthrough,
        check_sim_request,
        record_or_verify_simulation_signoff,
    )

    fde_req = """
    <sim-request v="1" factory=">=3.2.0">
    software_type: erp-crm
    use_case: fde-onsite-walkthrough
    delivery_mode: html-vercel-first
    ui_references: input/screens/as_is_tracker.png, input/screens/wireframe_sketch.png
    simulation_approved: true
    aspect: 16:9
    voice: vieneu
    accent: #D95D39
    context_example: Ví dụ kỳ họp giao ban tuần với 18 dự án đang chạy song song
    topic: Walkthrough 5 màn giải quyết điểm nghẽn tổng hợp báo cáo tuần và chốt Phương án A.
    </sim-request>
    """
    res = check_sim_request(fde_req)
    assert res["ok"] is True
    assert res["resolved"]["use_case"] == "fde-onsite-walkthrough"
    assert res["resolved"]["delivery_mode"] == "html-vercel-first"
    assert res["resolved"]["export_mp4"] is False
    assert res["resolved"]["allow_audio_and_effects"] is True
    assert len(res["resolved"]["fde_5_act_structure"]) == 5

    # Test simulation_signoff.json gate lifecycle in tmp_path
    unapproved = record_or_verify_simulation_signoff(
        tmp_path,
        approve=False,
        ui_references=["input/demo1.png"],
        screens_confirmed=["act-1-as-is"],
    )
    assert unapproved["passed"] is False
    assert unapproved["allow_audio_and_effects"] is False

    approved = record_or_verify_simulation_signoff(tmp_path, approve=True, notes="User confirmed HTML simulation")
    assert approved["passed"] is True
    assert approved["allow_audio_and_effects"] is True

    # Audit the flagship FDE On-Site Walkthrough Demo (5 Acts + [WF-01..04] + 3-pillar Checklist + vercel.json)
    fde_demo_dir = ROOT_DIR / "examples" / "fde_onsite_client_walkthrough_demo"
    fde_audit = audit_fde_onsite_walkthrough(fde_demo_dir)
    assert fde_audit["passed"] is True, f"FDE walkthrough demo failed audit: {fde_audit['errors']}"
    assert fde_audit["vercel_ready"] is True
    assert fde_audit["simulation_approved"] is True
    assert len(fde_audit["wf_markers_found"]) >= 4


def test_v31_newsroom_departments_and_four_anti_pattern_gates() -> None:
    """Verify 6-department Newsroom skill files (<=200 lines) and mechanical detection of the 4 Chronic Anti-Patterns."""
    from core_engine.pedagogy_and_request_gate import audit_course_pedagogy, audit_text_for_four_anti_patterns

    skill_root = ROOT_DIR / ".agents" / "skills" / "software-simulation-video-factory"
    for dept in ("intake", "surface", "storyboard", "review", "archive", "development"):
        lead_file = skill_root / dept / "lead.md"
        assert lead_file.exists(), f"Missing department lead: {lead_file}"
        assert len(lead_file.read_text(encoding="utf-8").splitlines()) <= 200

    # Check mechanical catching of all 4 Anti-Patterns on intentionally bad text
    bad_sample = (
        "Chào mừng anh chị đến với bài 5. Ở bài trước chúng ta đã tìm hiểu quy trình. "
        "Mở ngay ngăn wip/ của Khách hàng A07. "
        "Ở thẻ bên trái là dữ liệu thô, nhìn sang bên phải là nút bấm phê. "
        "REDLINE FOCUS: BÔI ĐEN ĐỂ COPY."
    )
    v = audit_text_for_four_anti_patterns(bad_sample, "bad_sample", is_opening_beat=True)
    rules_triggered = {item["rule"] for item in v}
    assert "TẬT_1_LỘ_PROMPT_NỘI_BỘ" in rules_triggered
    assert "TẬT_2_NHẢY_CÓC_THIẾU_BỐI_CẢNH" in rules_triggered
    assert "TẬT_3_TẢ_TỌA_ĐỘ_CƠ_HỌC" in rules_triggered
    assert "TẬT_4_DẪN_DẮT_LIÊN_BÀI_VÀ_TỪ_DỊCH_MÁY" in rules_triggered

    # Check that our actual 24-lesson courseware passes with 0 violations!
    ped_res = audit_course_pedagogy(_get_courseware_dir())
    assert ped_res["passed"] is True, f"Courseware pedagogy failed: {ped_res['violations']}"
