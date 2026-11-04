# AGENTS.md — Operating Instructions for AI Agents (Google Antigravity / Codex / Cursor)

When working in this repository to build **Interactive HTML Software Simulators** or **16:9 Lecture / Tutorial / Product Demo Videos**, follow this exact protocol:

## 1. Choose Your Intake Pipeline

1. **Pipeline A — From Video Recording or Screenshots to Interactive HTML Simulator:**
   - Read [`prompts/01_screenshot_or_video_to_html_simulator.md`](prompts/01_screenshot_or_video_to_html_simulator.md).
   - Run `python factory_cli.py intake-media --input <video_or_image_dir> --out temp/media.json`.
   - Use `examples/antigravity_studio_simulator/Antigravity_Simulator_Studio.html` as your reference architecture, or scaffold a new simulator via `python factory_cli.py scaffold-sim --blueprint <blueprint.json> --out <output.html>`.
   - **Mandatory Invariants:**
     - Must include `#laser-cursor` (soft red glowing dot, `18px`, `.hovering-target`, `.click-ripple`).
     - Must NOT use visible native `<select>` elements (use `#custom-select-floating` DOM dropdowns).
     - Must strip 100% of unrelated project names from reference screenshots.
     - Must pass `python factory_cli.py audit-sim --html <output.html> --forbid "<unrelated_names>"`.

2. **Pipeline B — From Code Repository to Interactive Product Demo Simulator:**
   - Read [`prompts/02_code_repo_to_interactive_demo.md`](prompts/02_code_repo_to_interactive_demo.md).
   - Run `python factory_cli.py intake-repo --repo <target_repo_path> --name "<ProjectName>" --out temp/repo_blueprint.json`.
   - Run `python factory_cli.py scaffold-sim --blueprint temp/repo_blueprint.json --out <output.html>`.
   - Customize the guided steps (`GUIDED_STEPS`) and verify with `python factory_cli.py audit-sim --html <output.html>`.

3. **Pipeline C — From Lecture / Curriculum to 16:9 Voice-Synced Video:**
   - Read [`prompts/03_curriculum_to_16x9_video_spec.md`](prompts/03_curriculum_to_16x9_video_spec.md) and [`examples/hanam_16x9_course/specs/BRIEF_AGY_VIET_SPEC.md`](examples/hanam_16x9_course/specs/BRIEF_AGY_VIET_SPEC.md).
   - Author the JSON video spec (`specs/videos/<VIDEO_ID>.json`) following `examples/hanam_16x9_course/specs/B01_SaiLamThuongGap.json`.
   - Audit the spec mechanically: `python factory_cli.py audit-spec --spec <spec.json> [--whitelabel]`.
   - Compile the 6-archetype HTML pages: `python factory_cli.py build-pages --spec <spec.json> --out-dir pages/`.
   - Preview or render widescreen 16:9 video via `core_engine/kcast_engine/widescreen_16x9.py`.

## 2. Hard Verification Gate Before Declaring Completion

Never declare a simulator or video spec finished until all mechanical checks pass with `0` errors:
- `python factory_cli.py audit-sim --html <your_simulator.html>` -> `passed: true`
- `python factory_cli.py audit-spec --spec <your_spec.json>` -> `passed: true` (`rubric_score >= 90.0`)
- `pytest tests/ -v` -> `100% PASS`
