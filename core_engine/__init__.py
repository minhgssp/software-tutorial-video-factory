# -*- coding: utf-8 -*-
"""
Software Tutorial & Simulation Video Factory — Core Engine (`core_engine` v2.0)

Integrates:
1. Multi-Modal Intake & Single-File HTML Simulator Scaffolder (`intake_extractor.py`)
2. 5-Layer Modular Interactive Courseware Compiler & Auditor (`course_compiler.py`)
3. 6-Archetype 16:9 Declarative HTML Page Compiler (`scene_builder.py`)
4. Embedded `/kudo` Screencast & Widescreen 16:9 Renderer (`kcast_engine/`)
5. Embedded `/fac-video` Semantic SyncGate, 48kHz Foley, 5-Hz Visemes & `/reelcrew` Rubric Auditor (`syncgate_and_foley.py`)
"""

from .course_compiler import (
    CourseIntegrityAuditor,
    CourseManifestBuilder,
    LessonSpecCompiler,
    audit_modular_courseware,
    compile_modular_courseware,
)
from .intake_extractor import (
    analyze_screenshots,
    extract_video_keyframes,
    generate_simulator_scaffold,
    harvest_code_repository,
)
from .scene_builder import build_shot_html, compile_spec_to_pages
from .syncgate_and_foley import (
    ReelCrewRubricAuditor,
    SyncGateReport,
    audit_html_simulator,
    audit_video_spec_rules,
    balance_vietnamese_lines,
    evaluate_semantic_syncgate,
    extract_5hz_visemes_from_wav,
    synthesize_procedural_foley_wav,
)

__all__ = [
    "CourseIntegrityAuditor",
    "CourseManifestBuilder",
    "LessonSpecCompiler",
    "audit_modular_courseware",
    "compile_modular_courseware",
    "analyze_screenshots",
    "extract_video_keyframes",
    "generate_simulator_scaffold",
    "harvest_code_repository",
    "build_shot_html",
    "compile_spec_to_pages",
    "ReelCrewRubricAuditor",
    "SyncGateReport",
    "audit_html_simulator",
    "audit_video_spec_rules",
    "balance_vietnamese_lines",
    "evaluate_semantic_syncgate",
    "extract_5hz_visemes_from_wav",
    "synthesize_procedural_foley_wav",
]
