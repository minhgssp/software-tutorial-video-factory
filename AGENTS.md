# AGENTS.md — Operating Instructions for AI Agents (Google Antigravity / Codex / Cursor)

When working in this repository to build **5-Layer Modular Interactive Courseware**, **Single-File HTML Software Simulators**, or **16:9 Lecture / Tutorial / Product Demo Videos**, read [`docs/CODEMAP.md`](docs/CODEMAP.md) and [`docs/SPEC_V2_5LAYER_COURSEWARE_ENGINE.md`](docs/SPEC_V2_5LAYER_COURSEWARE_ENGINE.md) first, then follow this exact protocol:

## 1. Choose Your Production Pipeline

1. **Pipeline A — 5-Layer Modular Interactive Courseware (`index.html` + Theory Slides + Live Simulator + Audio-First Clock):**
   - Inspect [`examples/antigravity_studio_simulator/`](examples/antigravity_studio_simulator/index.html) and [`docs/SPEC_V2_5LAYER_COURSEWARE_ENGINE.md`](docs/SPEC_V2_5LAYER_COURSEWARE_ENGINE.md).
   - Author or edit atomic lesson files under `lessons/lesson_XX/`:
     - `lesson_meta.json` (metadata, `slide_ids`, `session_order`)
     - `slides/s1.html`, `s2.html` (HTML theory slides using `.k-step-item` and `data-order="1..N"`)
     - `sessions/b1.json .. bN.json` (micro-beats switching between `mode: "theory"` and `mode: "sim"`)
   - Compile into `file://` CORS-safe bundles (`lesson_spec.js`, `course_manifest.js`, `brand_config.js`):
     - `python factory_cli.py compile-course --course-dir <course_dir>`
   - Verify 5-layer integrity and zero scope pollution (never include auxiliary TTS audition files like `*audition*`):
     - `python factory_cli.py verify-course --course-dir <course_dir>`

2. **Pipeline B — From Video Recording, Screenshots, or Code Repository to Single-File HTML Simulator:**
   - Read [`prompts/01_screenshot_or_video_to_html_simulator.md`](prompts/01_screenshot_or_video_to_html_simulator.md) or [`prompts/02_code_repo_to_interactive_demo.md`](prompts/02_code_repo_to_interactive_demo.md).
   - Run `python factory_cli.py intake-media` or `python factory_cli.py intake-repo`, then `python factory_cli.py scaffold-sim`.
   - **Mandatory Invariants:**
     - Must include `#laser-cursor` (soft red glowing dot, `18px`, `.hovering-target`, `.click-ripple`).
     - Must NOT use visible native `<select>` elements (use `#custom-select-floating` DOM dropdowns).
     - Must strip 100% of unrelated project names from reference screenshots (`--forbid`).

3. **Pipeline C — From Lecture / Curriculum to 16:9 Voice-Synced Video:**
   - Read [`prompts/03_curriculum_to_16x9_video_spec.md`](prompts/03_curriculum_to_16x9_video_spec.md) and [`examples/enterprise_16x9_course/specs/BRIEF_AGY_VIET_SPEC.md`](examples/enterprise_16x9_course/specs/BRIEF_AGY_VIET_SPEC.md).
   - Audit the spec mechanically: `python factory_cli.py audit-spec --spec <spec.json> [--whitelabel]`.
   - Compile the 6-archetype HTML pages: `python factory_cli.py build-pages --spec <spec.json> --out-dir pages/`.

## 2. Hard Verification Gate Before Declaring Completion

Never declare any courseware, simulator, or video spec finished until all mechanical checks pass with `0` errors:
- `python factory_cli.py verify-course --course-dir examples/antigravity_studio_simulator` -> `status: PASS`
- `python factory_cli.py audit-sim --html examples/antigravity_studio_simulator/Antigravity_Simulator_Studio.html` -> `passed: true`
- `python factory_cli.py audit-spec --spec examples/enterprise_16x9_course/specs/B01_SaiLamThuongGap.json` -> `passed: true`
- `pytest tests/ -v` -> `100% PASS`
