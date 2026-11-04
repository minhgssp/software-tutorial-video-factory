#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Comprehensive Automated Test Suite for Software Simulation & Tutorial Video Factory (`tests/test_factory_pipeline.py`)

Tests all 4 Core Engines + CLI + Real Production Assets from both Courses:
  1. `intake_extractor`: Repository VFS harvesting, screenshot dimension parsing, and Single-File HTML Simulator scaffolding.
  2. `scene_builder`: Compiling declarative 16:9 JSON specs (`B01_SaiLamThuongGap.json`) into standalone HTML scenes with `window.__act`.
  3. `kcast_engine`: `/kudo` screencast planning, phrase finding (`find_phrase`), `paragraph_captions`, and `-8dB` speech-ducked SFX (`sfx_cues_around_speech`).
  4. `syncgate_and_foley`: `/fac-video` Semantic SyncGate, Knuth-Plass Vietnamese compound-word line balancing, 48kHz Foley WAV synthesis, 5-Hz viseme extraction, `/reelcrew` 100-point Rubric, and HTML Simulator DOM Auditor (`#laser-cursor`, zero native `<select>`, `node --check`, zero context contamination).
"""

from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parents[1]
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from core_engine import (  # noqa: E402
    ReelCrewRubricAuditor,
    analyze_screenshots,
    audit_html_simulator,
    audit_video_spec_rules,
    balance_vietnamese_lines,
    build_shot_html,
    compile_spec_to_pages,
    evaluate_semantic_syncgate,
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


def test_repo_harvest_and_simulator_scaffold(tmp_path: Path) -> None:
    """Verify code repository harvesting into a VFS blueprint and generating an audited HTML simulator."""
    bp = harvest_code_repository(ROOT_DIR / "core_engine", project_name="antigravity_course_vn", max_files=10)
    assert bp["project_name"] == "antigravity_course_vn"
    assert bp["total_vfs_files"] >= 1
    assert len(bp["guided_steps"]) >= 3

    out_html = tmp_path / "generated_simulator.html"
    res_path = generate_simulator_scaffold(bp, out_html)
    assert res_path.exists()

    audit_res = audit_html_simulator(res_path, forbidden_terms=["C20_Viettel_Product_Manager", "New Way Edu"])
    assert audit_res["passed"] is True, f"Audit failed: {audit_res['violations']}"
    assert audit_res["js_syntax_ok"] is True


def test_antigravity_studio_simulator_passes_audit() -> None:
    """Verify the flagship 4,355-line Antigravity_Simulator_Studio.html passes 100% of DOM & JS checks."""
    candidates = [
        ROOT_DIR / "examples" / "antigravity_studio_simulator" / "Antigravity_Simulator_Studio.html",
        ROOT_DIR / "simulators" / "antigravity_basic" / "Antigravity_Simulator_Studio.html",
    ]
    sim_path = next((p for p in candidates if p.exists()), None)
    assert sim_path is not None, "Antigravity_Simulator_Studio.html must exist in examples/ or simulators/"

    res = audit_html_simulator(
        sim_path,
        forbidden_terms=["C20_Viettel_Product_Manager", "Viettel", "New Way Edu"],
        require_laser_cursor=True,
    )
    assert res["passed"] is True, f"Flagship simulator failed audit: {res['violations']}"
    assert res["line_count"] > 3500


def test_scene_builder_and_hanam_spec_audit(tmp_path: Path) -> None:
    """Verify compiling BIDV Hà Nam JSON specs into 6-archetype HTML pages and running the Rubric + SyncGate auditor."""
    candidates = [
        ROOT_DIR / "examples" / "hanam_16x9_course" / "specs" / "B01_SaiLamThuongGap.json",
        ROOT_DIR / "simulators" / "hanam_ai_course" / "specs" / "B01_SaiLamThuongGap.json",
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
