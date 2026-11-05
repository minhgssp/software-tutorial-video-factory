# -*- coding: utf-8 -*-
"""
5-Layer Modular Interactive Courseware Compiler & Integrity Auditor (`course_compiler.py`)

Compiles decomposed lesson authoring files:
  - `lessons/lesson_XX/lesson_meta.json`
  - `lessons/lesson_XX/slides/s*.html`
  - `lessons/lesson_XX/sessions/b*.json`
  - `config/brand_config.json`
into `file://` CORS-safe JavaScript bundles:
  - `lessons/lesson_XX/lesson_spec.js` (`window.KUDO_SPEC = ...;`)
  - `config/course_manifest.json` & `config/course_manifest.js` (`window.KUDO_COURSE_MANIFEST = ...;`)
  - `config/brand_config.js` (`window.KUDO_BRAND_CONFIG = ...;`)

Also provides mechanical verification via `CourseIntegrityAuditor` to guarantee:
  1. Complete presence of all 5 architectural layers (`config/`, `assets/css/`, `assets/js/`, `lessons/`, entry HTML shells).
  2. Valid slide and audio references across every micro-beat.
  3. Zero scope pollution (forbids auxiliary TTS audition files such as `*audition*` inside courseware packages).
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any, Dict, List, Union


def _format_mm_ss(seconds: float) -> str:
    total_sec = max(0, int(round(seconds)))
    minutes = total_sec // 60
    rem = total_sec % 60
    return f"{minutes:02d}:{rem:02d}"


class LessonSpecCompiler:
    """Compiles a single modular lesson directory (`lessons/lesson_XX/`) into `lesson_spec.js`."""

    def compile_lesson(self, lesson_dir: Union[str, Path]) -> Dict[str, Any]:
        ldir = Path(lesson_dir).resolve()
        meta_path = ldir / "lesson_meta.json"
        if not meta_path.exists():
            raise FileNotFoundError(f"Missing lesson_meta.json in {ldir}")

        meta: Dict[str, Any] = json.loads(meta_path.read_text(encoding="utf-8"))
        slide_ids: List[str] = list(meta.get("slide_ids", []))
        session_order: List[str] = list(meta.get("session_order", []))

        slides_dir = ldir / "slides"
        sessions_dir = ldir / "sessions"

        slides_map: Dict[str, str] = {}
        for sid in slide_ids:
            sp = slides_dir / f"{sid}.html"
            if not sp.exists():
                raise FileNotFoundError(f"Missing slide HTML '{sp}' referenced by {meta_path}")
            slides_map[sid] = sp.read_text(encoding="utf-8").strip()

        beats_list: List[Dict[str, Any]] = []
        total_dur = 0.0
        for bid in session_order:
            bp = sessions_dir / f"{bid}.json"
            if not bp.exists():
                raise FileNotFoundError(f"Missing session beat JSON '{bp}' referenced by {meta_path}")
            beat_data: Dict[str, Any] = json.loads(bp.read_text(encoding="utf-8"))
            beats_list.append(beat_data)
            total_dur += float(beat_data.get("duration", 0.0))

        total_dur_rounded = round(total_dur, 1)
        meta["beats_count"] = len(beats_list)
        meta["total_duration_sec"] = total_dur_rounded
        meta["duration_formatted"] = _format_mm_ss(total_dur_rounded)

        meta_path.write_text(json.dumps(meta, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

        kudo_spec: Dict[str, Any] = {
            "code": meta.get("code", ""),
            "title": meta.get("title", ""),
            "short_title": meta.get("short_title", meta.get("title", "")),
            "filename": meta.get("filename", ""),
            "description": meta.get("description", ""),
            "slides": slides_map,
            "beats": beats_list,
        }

        spec_js_path = ldir / "lesson_spec.js"
        spec_js_content = "window.KUDO_SPEC = " + json.dumps(kudo_spec, ensure_ascii=False, indent=2) + ";\n"
        spec_js_path.write_text(spec_js_content, encoding="utf-8")

        return {
            "lesson_slug": meta.get("lesson_slug", ldir.name),
            "lesson_spec_js": str(spec_js_path),
            "slides_count": len(slides_map),
            "beats_count": len(beats_list),
            "total_duration_sec": total_dur_rounded,
            "duration_formatted": meta["duration_formatted"],
            "meta": meta,
        }


class CourseManifestBuilder:
    """Compiles all lessons in a 5-layer courseware directory and generates `course_manifest.js` & `brand_config.js`."""

    def __init__(self) -> None:
        self.lesson_compiler = LessonSpecCompiler()

    def build_course(self, course_root: Union[str, Path]) -> Dict[str, Any]:
        root = Path(course_root).resolve()
        lessons_root = root / "lessons"
        config_dir = root / "config"
        config_dir.mkdir(parents=True, exist_ok=True)

        if not lessons_root.exists():
            raise FileNotFoundError(f"Missing 'lessons/' directory in {root}")

        lesson_dirs = sorted(
            [d for d in lessons_root.iterdir() if d.is_dir() and (d / "lesson_meta.json").exists()],
            key=lambda p: p.name,
        )

        manifest_items: List[Dict[str, Any]] = []
        compiled_lessons: List[Dict[str, Any]] = []
        total_beats = 0
        total_course_sec = 0.0

        for ldir in lesson_dirs:
            res = self.lesson_compiler.compile_lesson(ldir)
            compiled_lessons.append(res)
            meta = res["meta"]
            manifest_items.append(meta)
            total_beats += int(res["beats_count"])
            total_course_sec += float(res["total_duration_sec"])

        manifest_json_path = config_dir / "course_manifest.json"
        manifest_js_path = config_dir / "course_manifest.js"

        manifest_json_path.write_text(
            json.dumps(manifest_items, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )
        manifest_js_path.write_text(
            "window.KUDO_COURSE_MANIFEST = " + json.dumps(manifest_items, ensure_ascii=False, indent=2) + ";\n",
            encoding="utf-8",
        )

        brand_json_path = config_dir / "brand_config.json"
        brand_js_path = config_dir / "brand_config.js"
        if brand_json_path.exists():
            brand_obj = json.loads(brand_json_path.read_text(encoding="utf-8"))
            brand_js_path.write_text(
                "window.KUDO_BRAND_CONFIG = " + json.dumps(brand_obj, ensure_ascii=False, indent=2) + ";\n",
                encoding="utf-8",
            )

        return {
            "status": "ok",
            "course_root": str(root),
            "lessons_compiled": len(compiled_lessons),
            "total_beats": total_beats,
            "total_duration_sec": round(total_course_sec, 1),
            "duration_formatted": _format_mm_ss(total_course_sec),
            "manifest_js": str(manifest_js_path),
        }


class CourseIntegrityAuditor:
    """Mechanically audits a 5-Layer Modular Courseware package for completeness and zero scope pollution."""

    REQUIRED_LAYER_FILES = [
        "index.html",
        "DESIGN.md",
        "REVIEW.md",
        "llms.txt",
        "config/brand_config.json",
        "config/brand_config.js",
        "config/course_manifest.json",
        "config/course_manifest.js",
        "config/pronunciation_lexicon.json",
        "assets/css/simulator_core.css",
        "assets/css/brand_tokens.css",
        "assets/css/player_sidebar_layout.css",
        "assets/css/simulator_overrides.css",
        "assets/js/simulator_core.js",
        "assets/js/simulator_actions.js",
        "assets/js/spotlight_cursor.js",
        "assets/js/player_engine.js",
        "assets/avatar/lecturer_poses.js",
        "assets/templates/simulator_stage_dom.html",
    ]

    def audit_course(self, course_root: Union[str, Path]) -> Dict[str, Any]:
        root = Path(course_root).resolve()
        errors: List[str] = []
        warnings: List[str] = []

        # 1. Verify required 5-layer files
        for rel in self.REQUIRED_LAYER_FILES:
            if not (root / rel).exists():
                errors.append(f"Missing required 5-layer file: {rel}")

        # 2. Enforce Zero Audition Pollution (PROP-261105-03)
        for p in root.rglob("*"):
            if "audition" in p.name.lower():
                errors.append(f"Scope pollution detected (forbidden audition artifact in courseware): {p.relative_to(root)}")

        # 3. Verify lessons, slides, sessions, and audio references
        manifest_path = root / "config" / "course_manifest.json"
        lessons_checked = 0
        beats_checked = 0
        if manifest_path.exists():
            try:
                manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
                for item in manifest:
                    lessons_checked += 1
                    lslug = item.get("lesson_slug", "")
                    fname = item.get("filename", "")
                    if not fname or not (root / fname).exists():
                        errors.append(f"Missing lesson entry HTML file '{fname}' for {lslug}")
                    ldir = root / "lessons" / lslug
                    if not (ldir / "lesson_spec.js").exists():
                        errors.append(f"Missing compiled lesson_spec.js in lessons/{lslug}")
                    for bid in item.get("session_order", []):
                        beats_checked += 1
                        bp = ldir / "sessions" / f"{bid}.json"
                        if not bp.exists():
                            errors.append(f"Missing session beat file: lessons/{lslug}/sessions/{bid}.json")
                            continue
                        bdata = json.loads(bp.read_text(encoding="utf-8"))
                        if bdata.get("mode") == "theory":
                            sid = bdata.get("slide", "")
                            if not sid or not (ldir / "slides" / f"{sid}.html").exists():
                                errors.append(f"Beat {lslug}/{bid} references missing slide '{sid}'")
                        audio_src = bdata.get("audio_src", "")
                        if audio_src and not (root / audio_src).exists():
                            warnings.append(f"Beat {lslug}/{bid} audio file not found at '{audio_src}'")
            except Exception as exc:
                errors.append(f"Failed to parse course_manifest.json: {exc}")

        passed = len(errors) == 0
        return {
            "passed": passed,
            "status": "PASS" if passed else "FAIL",
            "course_root": str(root),
            "lessons_checked": lessons_checked,
            "beats_checked": beats_checked,
            "errors": errors,
            "warnings": warnings,
        }


def compile_modular_courseware(course_root: Union[str, Path]) -> Dict[str, Any]:
    """Convenience function to compile an entire 5-layer courseware package."""
    return CourseManifestBuilder().build_course(course_root)


def audit_modular_courseware(course_root: Union[str, Path]) -> Dict[str, Any]:
    """Convenience function to audit a 5-layer courseware package."""
    return CourseIntegrityAuditor().audit_course(course_root)
