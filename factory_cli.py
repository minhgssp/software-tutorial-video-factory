#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Universal Software Simulation & Interactive Video-Course Factory CLI (`factory_cli.py` v3.2)

Unified command-line interface for AI Agents (`Claude Code`, `Google Antigravity`, `Cursor`, `Codex`)
combining `/kudo` deterministic request/doctor contracts, Two-Stage Human Simulation Sign-Off Gate,
FDE/PM On-Site Walkthrough (HTML-First Vercel), and `/viet-chuyen-nghiep` 6-Department Newsroom Gates:
  1. `doctor` — Check Python, Playwright, Vercel/Node, FFmpeg, VieNeu-TTS (.venv/vieneu), Faster-Whisper, and Kokoro readiness
  2. `check-request` — Validate `<sim-request v="1">` contract (enforcing mandatory `ui_references` + `simulation_approved` stage gate)
  3. `approve-sim` — Record or verify user sign-off on the HTML Simulation (`simulation_signoff.json`) BEFORE audio & effects are built
  4. `audit-fde-walkthrough` — Verify 5-Act FDE/PM On-Site Client Walkthrough package (`index.html` + `vercel.json` + 3-pillar Checklist)
  5. `compile-course` & `verify-course` — Compile and verify 4-compartment modular interactive HTML courseware
  6. `audit-pedagogy` — Mechanically enforce the 4 Chronic Anti-Pattern Gates
  7. `intake-repo`, `intake-media`, `scaffold-sim`, `build-pages`, `audit-sim`, `audit-spec`
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import List

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

ROOT_DIR = Path(__file__).resolve().parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from core_engine import (  # noqa: E402
    analyze_screenshots,
    audit_html_simulator,
    audit_modular_courseware,
    audit_video_spec_rules,
    compile_modular_courseware,
    compile_spec_to_pages,
    extract_video_keyframes,
    generate_simulator_scaffold,
    harvest_code_repository,
)
from core_engine.pedagogy_and_request_gate import (  # noqa: E402
    audit_course_pedagogy,
    audit_fde_onsite_walkthrough,
    check_sim_request,
    record_or_verify_simulation_signoff,
    run_environment_doctor,
)


def cmd_status() -> int:
    sim_dir = ROOT_DIR / "examples" / "antigravity_studio_simulator"
    status = {
        "factory": "Universal Software Simulation & Interactive Video-Course Factory v3.2.0",
        "root_dir": str(ROOT_DIR),
        "request_builder_ui": str(ROOT_DIR / "studio-request-builder.html"),
        "embedded_engines": {
            "course_compiler_5layer": (ROOT_DIR / "core_engine" / "course_compiler.py").exists(),
            "pedagogy_and_request_gate_v32": (ROOT_DIR / "core_engine" / "pedagogy_and_request_gate.py").exists(),
            "voice_engine_vieneu_whisper_kokoro": (ROOT_DIR / "core_engine" / "voice_engine" / "vieneu_tts.py").exists(),
            "rubric_engine": (ROOT_DIR / "core_engine" / "rubric_engine" / "rubric.py").exists(),
            "kudo_screencast_16x9": (ROOT_DIR / "core_engine" / "kcast_engine" / "widescreen_16x9.py").exists(),
            "scene_builder_6_archetypes": (ROOT_DIR / "core_engine" / "scene_builder.py").exists(),
            "intake_extractor_repo_and_media": (ROOT_DIR / "core_engine" / "intake_extractor.py").exists(),
            "fac_video_syncgate_and_foley": (ROOT_DIR / "core_engine" / "syncgate_and_foley.py").exists(),
        },
        "documentation": {
            "installation_and_vieneu_setup": (ROOT_DIR / "docs" / "INSTALLATION_AND_VIENEU_SETUP.md").exists(),
            "spec_v2_5layer": (ROOT_DIR / "docs" / "SPEC_V2_5LAYER_COURSEWARE_ENGINE.md").exists(),
            "codemap_v2": (ROOT_DIR / "docs" / "CODEMAP.md").exists(),
        },
        "examples": {
            "fde_onsite_client_walkthrough_demo": (ROOT_DIR / "examples" / "fde_onsite_client_walkthrough_demo" / "index.html").exists(),
            "saas_workflow_process_demo": (ROOT_DIR / "examples" / "saas_workflow_process_demo" / "index.html").exists(),
            "ui_learning_portal_demo": (ROOT_DIR / "examples" / "ui_learning_portal_demo" / "index.html").exists(),
            "antigravity_5layer_courseware_hub": (sim_dir / "index.html").exists(),
            "antigravity_studio_simulator": (sim_dir / "Antigravity_Simulator_Studio.html").exists(),
        },
    }
    print(json.dumps(status, ensure_ascii=False, indent=2))
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Universal Software Simulation & Interactive Video-Course Factory CLI v3.2",
        formatter_class=argparse.RawTextHelpFormatter,
    )
    sub = parser.add_subparsers(dest="subcommand")

    sub.add_parser("status", help="Show factory readiness, docs, and embedded engine status")
    sub.add_parser("doctor", help="Check system dependencies & optional voice/video engines (Kudo-style doctor)")

    p_req = sub.add_parser("check-request", help="Validate a <sim-request> contract block and output resolved pipeline")
    p_req.add_argument("--file", default=None, help="Path to file containing <sim-request> block")
    p_req.add_argument("--text", default=None, help="Raw <sim-request> text string")

    p_app = sub.add_parser(
        "approve-sim",
        help="Record or verify user confirmation on HTML Simulation BEFORE running Audio & Effects",
    )
    p_app.add_argument("--course-dir", required=True, help="Path to courseware or walkthrough directory")
    p_app.add_argument("--ui-refs", default=None, help="Comma-separated UI reference screenshots/descriptions")
    p_app.add_argument("--screens", default=None, help="Comma-separated confirmed screen IDs")
    p_app.add_argument("--notes", default="", help="User sign-off notes")
    p_app.add_argument("--verify-only", action="store_true", help="Only verify existing sign-off without modifying")

    p_fde = sub.add_parser(
        "audit-fde-walkthrough",
        help="Audit a 5-Act FDE/PM On-Site Client Walkthrough package (HTML-first + vercel.json + 3-pillar Checklist)",
    )
    p_fde.add_argument("--dir", required=True, help="Path to FDE walkthrough directory")

    p_ped = sub.add_parser(
        "audit-pedagogy",
        help="Audit courseware against the 4 Chronic Anti-Patterns (No Prompt Leak, Context Before Example, No Spatial Pointer, Self-Contained Atom)",
    )
    p_ped.add_argument("--course-dir", required=True, help="Path to courseware root directory")

    p_comp = sub.add_parser(
        "compile-course",
        help="Compile modular courseware (lessons/lesson_XX/sessions/*.json & slides/*.html -> lesson_spec.js & course_manifest.js)",
    )
    p_comp.add_argument("--course-dir", required=True, help="Path to courseware root directory")

    p_ver = sub.add_parser(
        "verify-course",
        help="Mechanically audit a courseware package (5 layers, slide/audio links, zero audition pollution)",
    )
    p_ver.add_argument("--course-dir", required=True, help="Path to courseware root directory")

    p_repo = sub.add_parser("intake-repo", help="Scan a code repository and output a VFS simulator blueprint.json")
    p_repo.add_argument("--repo", required=True, help="Path to target code repository")
    p_repo.add_argument("--name", default=None, help="Optional project name override")
    p_repo.add_argument("--out", required=True, help="Output JSON blueprint path")

    p_media = sub.add_parser("intake-media", help="Extract UI frames / analyze screenshots into a blueprint.json")
    p_media.add_argument("--input", required=True, help="Path to a video file (.mp4) or directory of screenshots")
    p_media.add_argument("--out", required=True, help="Output JSON analysis path")
    p_media.add_argument("--frames-dir", default=None, help="Directory to store extracted keyframes if input is video")

    p_sim = sub.add_parser("scaffold-sim", help="Generate a Single-File Interactive HTML Simulator from blueprint.json")
    p_sim.add_argument("--blueprint", required=True, help="Path to blueprint.json")
    p_sim.add_argument("--out", required=True, help="Output HTML path")
    p_sim.add_argument("--title", default=None, help="Optional HTML title")

    p_pages = sub.add_parser("build-pages", help="Compile a declarative 16:9 JSON video spec into HTML scenes")
    p_pages.add_argument("--spec", required=True, help="Path to video spec JSON")
    p_pages.add_argument("--out-dir", required=True, help="Directory to write compiled HTML pages")

    p_asim = sub.add_parser("audit-sim", help="Audit an HTML simulator (#laser-cursor, zero OS <select>, node --check)")
    p_asim.add_argument("--html", required=True, help="Path to HTML simulator file")
    p_asim.add_argument("--forbid", default="", help="Comma-separated list of forbidden project/context terms")

    p_aspec = sub.add_parser("audit-spec", help="Audit a JSON video spec (SyncGate + TTS Rules + ReelCrew Rubric)")
    p_aspec.add_argument("--spec", required=True, help="Path to video spec JSON")
    p_aspec.add_argument("--whitelabel", action="store_true", help="Enforce strict whitelabel brand check")

    args = parser.parse_args()
    if not args.subcommand or args.subcommand == "status":
        return cmd_status()

    if args.subcommand == "doctor":
        res = run_environment_doctor(ROOT_DIR)
        print(json.dumps(res, ensure_ascii=False, indent=2))
        return 0 if res["passed"] else 1

    if args.subcommand == "check-request":
        raw = ""
        if args.file:
            raw = Path(args.file).read_text(encoding="utf-8")
        elif args.text:
            raw = args.text
        else:
            raw = sys.stdin.read()
        res = check_sim_request(raw)
        print(json.dumps(res, ensure_ascii=False, indent=2))
        return 0 if res["ok"] else 1

    if args.subcommand == "approve-sim":
        ui_refs = [x.strip() for x in args.ui_refs.split(",") if x.strip()] if args.ui_refs else None
        screens = [x.strip() for x in args.screens.split(",") if x.strip()] if args.screens else None
        res = record_or_verify_simulation_signoff(
            Path(args.course_dir),
            approve=None if args.verify_only else True,
            ui_references=ui_refs,
            screens_confirmed=screens,
            notes=args.notes,
        )
        print(json.dumps(res, ensure_ascii=False, indent=2))
        return 0 if res["passed"] else 1

    if args.subcommand == "audit-fde-walkthrough":
        res = audit_fde_onsite_walkthrough(Path(args.dir))
        print(json.dumps(res, ensure_ascii=False, indent=2))
        return 0 if res["passed"] else 1

    if args.subcommand == "audit-pedagogy":
        res = audit_course_pedagogy(Path(args.course_dir))
        print(json.dumps(res, ensure_ascii=False, indent=2))
        return 0 if res["passed"] else 1

    if args.subcommand == "compile-course":
        res = compile_modular_courseware(args.course_dir)
        print(json.dumps(res, ensure_ascii=False, indent=2))
        return 0

    if args.subcommand == "verify-course":
        res = audit_modular_courseware(args.course_dir)
        print(json.dumps(res, ensure_ascii=False, indent=2))
        return 0 if res["passed"] else 1

    if args.subcommand == "intake-repo":
        bp = harvest_code_repository(args.repo, project_name=args.name)
        out_p = Path(args.out).resolve()
        out_p.parent.mkdir(parents=True, exist_ok=True)
        out_p.write_text(json.dumps(bp, ensure_ascii=False, indent=2), encoding="utf-8")
        print(json.dumps({"status": "ok", "blueprint": str(out_p), "vfs_files": bp["total_vfs_files"]}, ensure_ascii=False))
        return 0

    if args.subcommand == "intake-media":
        inp = Path(args.input).resolve()
        out_p = Path(args.out).resolve()
        out_p.parent.mkdir(parents=True, exist_ok=True)
        if inp.is_file() and inp.suffix.lower() in (".mp4", ".mov", ".webm", ".mkv"):
            fdir = Path(args.frames_dir) if args.frames_dir else out_p.parent / "extracted_frames"
            res = extract_video_keyframes(inp, fdir)
        elif inp.is_dir():
            imgs: List[Path] = []
            for ext in ("*.png", "*.jpg", "*.jpeg"):
                imgs.extend(sorted(inp.glob(ext)))
            res = analyze_screenshots(imgs)
        else:
            res = analyze_screenshots([inp])
        out_p.write_text(json.dumps(res, ensure_ascii=False, indent=2), encoding="utf-8")
        print(json.dumps({"status": "ok", "analysis": str(out_p)}, ensure_ascii=False))
        return 0

    if args.subcommand == "scaffold-sim":
        bp = json.loads(Path(args.blueprint).read_text(encoding="utf-8"))
        out_html = generate_simulator_scaffold(bp, args.out, title=args.title)
        print(json.dumps({"status": "ok", "html": str(out_html)}, ensure_ascii=False))
        return 0

    if args.subcommand == "build-pages":
        res = compile_spec_to_pages(args.spec, args.out_dir)
        print(json.dumps(res, ensure_ascii=False, indent=2))
        return 0

    if args.subcommand == "audit-sim":
        forbid = [x.strip() for x in args.forbid.split(",") if x.strip()]
        res = audit_html_simulator(args.html, forbidden_terms=forbid)
        print(json.dumps(res, ensure_ascii=False, indent=2))
        return 0 if res["passed"] else 1

    if args.subcommand == "audit-spec":
        res = audit_video_spec_rules(args.spec, enforce_whitelabel=bool(args.whitelabel))
        print(json.dumps(res, ensure_ascii=False, indent=2))
        return 0 if res["passed"] else 1

    return 0


if __name__ == "__main__":
    sys.exit(main())
