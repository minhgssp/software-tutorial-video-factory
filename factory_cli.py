#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Software Simulation & Tutorial Video Factory CLI (`factory_cli.py`)

Unified command-line interface for AI Agents (`Claude Code`, `Google Antigravity`, `Cursor`, `Codex`)
to transform Screenshots, Screen Recordings, Code Repositories, or Markdown Curricula into:
  1. Single-File Interactive HTML Software Simulators (`#laser-cursor`, `#custom-select-floating`, `VFS`, `glideLaserTo()`)
  2. 6-Archetype Declarative 16:9 HTML Lecture Scenes (`window.__act()`)
  3. Voice-Synced Widescreen 16:9 Tutorial & Product Demo Videos (`/kudo` + `/reelcrew` + `/fac-video`)

Usage Examples:
  python factory_cli.py status
  python factory_cli.py intake-repo --repo . --out temp/blueprint.json
  python factory_cli.py intake-media --input examples/ --out temp/media_blueprint.json
  python factory_cli.py scaffold-sim --blueprint temp/blueprint.json --out temp/simulator.html
  python factory_cli.py build-pages --spec examples/hanam_16x9_course/specs/B01_SaiLamThuongGap.json --out-dir temp/pages
  python factory_cli.py audit-sim --html examples/antigravity_studio_simulator/Antigravity_Simulator_Studio.html --forbid Viettel,BIDV
  python factory_cli.py audit-spec --spec examples/hanam_16x9_course/specs/B01_SaiLamThuongGap.json --whitelabel
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
    audit_video_spec_rules,
    compile_spec_to_pages,
    extract_video_keyframes,
    generate_simulator_scaffold,
    harvest_code_repository,
)


def cmd_status() -> int:
    status = {
        "factory": "Software Simulation & Tutorial Video Factory v1.0.0",
        "root_dir": str(ROOT_DIR),
        "embedded_engines": {
            "kudo_screencast_16x9": (ROOT_DIR / "core_engine" / "kcast_engine" / "widescreen_16x9.py").exists(),
            "kudo_kcast_core": (ROOT_DIR / "core_engine" / "kcast_engine" / "kcast" / "plan.py").exists(),
            "scene_builder_6_archetypes": (ROOT_DIR / "core_engine" / "scene_builder.py").exists(),
            "intake_extractor_repo_and_media": (ROOT_DIR / "core_engine" / "intake_extractor.py").exists(),
            "fac_video_syncgate_and_foley": (ROOT_DIR / "core_engine" / "syncgate_and_foley.py").exists(),
        },
        "examples": {
            "antigravity_studio_simulator": (
                ROOT_DIR / "examples" / "antigravity_studio_simulator" / "Antigravity_Simulator_Studio.html"
            ).exists(),
            "hanam_16x9_course_specs": sorted(
                p.name for p in (ROOT_DIR / "examples" / "hanam_16x9_course" / "specs").glob("*.json")
            )
            if (ROOT_DIR / "examples" / "hanam_16x9_course" / "specs").exists()
            else [],
        },
    }
    print(json.dumps(status, ensure_ascii=False, indent=2))
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Software Simulation & Tutorial Video Factory CLI",
        formatter_class=argparse.RawTextHelpFormatter,
    )
    sub = parser.add_subparsers(dest="subcommand")

    sub.add_parser("status", help="Show factory readiness and embedded engine status")

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
    p_pages.add_argument("--spec", required=True, help="Path to video spec JSON (e.g., B01_SaiLamThuongGap.json)")
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
