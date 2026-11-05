# 🎬 Software Simulation & Tutorial Video Factory (`software-tutorial-video-factory` v2.0)

> **AI-Native 5-Layer Modular Interactive Courseware & Widescreen 16:9 Lecture Video Factory**  
> Turn **Screen Recordings, UI Screenshots, Code Repositories, or Markdown Curricula** into **5-Layer Modular Interactive Web Courseware (`index.html` + Theory Slides + Live Software Simulator + 48kHz Audio-First Clock)** and **Voice-Synced 16:9 Tutorial / Product Demo Videos**.  
> Built for immediate execution by **Google Antigravity**, **Claude Code**, **Cursor**, and **Codex**.

- 📖 **Technical Specification (v2.0):** [`docs/SPEC_V2_5LAYER_COURSEWARE_ENGINE.md`](docs/SPEC_V2_5LAYER_COURSEWARE_ENGINE.md)
- 🗺️ **Full Architecture & AST CodeMap:** [`docs/CODEMAP.md`](docs/CODEMAP.md)

---

## 🌟 Three Production Paradigms in One Factory

1. **Paradigm 1 — 5-Layer Modular Interactive Courseware & Dual Theory/Simulator Player (`Antigravity Basic v3 Engine`):**
   - Decomposes an entire software course into **5 clean layers** (`config/`, `assets/css/`, `assets/js/`, `lessons/lesson_XX/sessions/*.json` + `slides/*.html`, and lightweight HTML shells `~60KB`/lesson).
   - **Single Left-Sidebar Course Hub (`index.html`):** Collapses outer navigation by default so only the lesson's `280px` control sidebar is visible, dedicating `1160px` of horizontal stage width to the software simulator, with top-bar quick-switch pills (`BÀI 1.1 .. BÀI 2.3`) and cross-iframe `postMessage` (`KUDO_SWITCH_LESSON`).
   - **Dual Theory Slide (`mode: "theory"`) + Live Software Simulator (`mode: "sim"`) Stage:** Alternates seamlessly between pedagogical HTML slides (with automatic `.k-hl` active card spotlighting and `.k-visited` / `.k-unreached` progression via `data-order`) and live software DOM simulation (`simulator_actions.js`).
   - **Audio-Driven Master Clock v2 (`player_engine.js`):** `<audio id="kudo-voice-player">` acts as the single master clock (`Audio-First Lock`). Scenes never advance while `vp.ended !== true`, preventing cut-off sentences, followed by a natural `0.60s` breathing pause.
   - **Anti-Occlusion Smart Cursor & Viewport-Clamped Spotlight (`spotlight_cursor.js`):** Automatically bounds `#kudo-spotlight` and `#kudo-cursor` inside `#kudo-stage-viewport`, anchors the cursor to the top-right header of open popovers (`#ide-popup-menu`, `#kudo-model-popover`, etc.) so it never covers suggestion text, lifts `#kudo-cursor-label` `38px` above `#ide-chat-input`, auto-hides when speech finishes or when the learner clicks inside the simulator, and supports active toggle via `🖱️ Ẩn chuột & Tip [C]`.
   - **No-CORS `file://` Compilation (`core_engine/course_compiler.py`):** Compiles decomposed `sessions/b*.json` and `slides/s*.html` into `lesson_spec.js` (`window.KUDO_SPEC`) and `course_manifest.js` (`window.KUDO_COURSE_MANIFEST`) so learners can double-click `index.html` directly from disk without a web server.

2. **Paradigm 2 — Full-App Single-File Interactive HTML Simulator (`Antigravity_Simulator_Studio.html`):**
   - Reconstructs a complete multi-surface software environment in a single zero-dependency `.html` file driven by a **Soft Red Glowing Laser Dot (`#laser-cursor`)**, **Custom DOM Floating Dropdowns (`#custom-select-floating`)**, and **`glideLaserTo()`** automated tours.

3. **Paradigm 3 — Declarative 6-Archetype Scene Compiler + Voice-Synced 16:9 Screencast Pipeline (`BIDV Hà Nam Kudo Engine`):**
   - Compiles declarative JSON video specs (`B01..B09.json`) into 6 visual HTML archetypes (`concept`, `app`, `webchat`, `predict`, `board`, `workspace`) driven by `window.__act(name, arg)` and renders `1920x1080` widescreen MP4 lectures via Playwright CDP (`core_engine/kcast_engine/`).

---

## 🗂️ Repository Structure

See [`docs/CODEMAP.md`](docs/CODEMAP.md) for the complete symbol-level CodeMap and call graph.

```text
software-tutorial-video-factory/
├── README.md                                                          # Master documentation & quickstart
├── AGENTS.md                                                          # Agent Operating Charter (Google Antigravity / Codex)
├── CLAUDE.md                                                          # Agent Operating Charter (Claude Code)
├── factory_cli.py                                                     # Unified CLI Entrypoint (9 commands)
├── docs/
│   ├── SPEC_V2_5LAYER_COURSEWARE_ENGINE.md                            # Complete v2.0 5-Layer Courseware Technical Specification
│   └── CODEMAP.md                                                     # Complete Directory, Class, Function & Data-Flow CodeMap
├── core_engine/                                                       # Deterministic Python & JS Core Engines
│   ├── __init__.py
│   ├── course_compiler.py                                             # 5-Layer LessonSpecCompiler, CourseManifestBuilder & CourseIntegrityAuditor
│   ├── intake_extractor.py                                            # Video keyframe extractor, Screenshot analyzer, Repo VFS harvester & HTML Scaffolder
│   ├── scene_builder.py                                               # 6-Archetype 16:9 HTML Scene Compiler (window.__act)
│   ├── syncgate_and_foley.py                                          # /fac-video SemanticSyncGate, Knuth-Plass Vietnamese line balancer, 48kHz Foley, /reelcrew Rubric & HTML DOM Auditor
│   └── kcast_engine/                                                  # Embedded /kudo Screencast Core (plan.py, capture.py, render.py, widescreen_16x9.py, remux_sfx.py)
├── .agents/skills/software-simulation-video-factory/                  # Native Skill for Antigravity / AgentKit
│   ├── SKILL.md
│   ├── references/PLAYBOOK_25_GOLDEN_RULES.md
│   ├── scripts/run_audit_gate.py
│   └── templates/                                                     # sample_spec.json, sample_lesson_meta.json, sample_session_beat.json, sample_theory_slide.html
├── .claude/skills/software-simulation-video-factory/                  # Native Skill for Claude Code
│   └── SKILL.md
├── prompts/                                                           # Ready-to-use Agent System Prompts (01..04)
├── examples/                                                          # Production Showcases from Both Courses
│   ├── antigravity_studio_simulator/                                  # 5-Layer Modular Interactive Courseware (6 lessons, 47 beats, 48kHz audio)
│   │   ├── index.html                                                 # Single Left-Sidebar Course Hub Shell
│   │   ├── lesson_01..06_*.html                                       # 6 Modular Interactive Lessons (~60KB each)
│   │   ├── Antigravity_Simulator_Studio.html                          # Standalone Full-Screen Simulator Studio
│   │   ├── DESIGN.md / REVIEW.md / llms.txt                           # Design system, WCAG 2.2 AA checklist & AI index
│   │   ├── config/                                                    # Layer 1: brand_config.json/.js, course_manifest.json/.js, pronunciation_lexicon.json
│   │   ├── assets/                                                    # Layer 2 & 3: css/, js/, avatar/, templates/
│   │   ├── lessons/                                                   # Layer 4: lesson_01..06/ (lesson_meta.json, slides/*.html, sessions/*.json, lesson_spec.js)
│   │   └── audio/                                                     # Layer 4 Audio: lesson_01..06/b*.mp3
│   └── hanam_16x9_course/                                             # Widescreen 16:9 Video Pipeline Showcase
│       ├── scripts/                                                   # build_pages.py, run_kudo_16x9.py, remux_sfx.py
│       └── specs/                                                     # B01_SaiLamThuongGap.json, B02_BaCapDoLamViecAI.json, BRIEF_AGY_VIET_SPEC.md
└── tests/
    └── test_factory_pipeline.py                                       # End-to-end pytest suite
```

---

## 🚀 Quickstart CLI Commands

```bash
# 1. Inspect factory status, documentation, and embedded engines
python factory_cli.py status

# 2. [5-Layer Courseware] Compile all lessons (sessions/b*.json & slides/s*.html -> lesson_spec.js & course_manifest.js)
python factory_cli.py compile-course --course-dir examples/antigravity_studio_simulator

# 3. [5-Layer Courseware Audit] Verify all 5 layers, slide/audio links, and zero scope pollution
python factory_cli.py verify-course --course-dir examples/antigravity_studio_simulator

# 4. [Intake Mode A] Harvest a Code Repository into a VFS Blueprint & Generate an Interactive HTML Simulator
python factory_cli.py intake-repo --repo . --name "antigravity_course_vn" --out temp/repo_blueprint.json
python factory_cli.py scaffold-sim --blueprint temp/repo_blueprint.json --out temp/repo_simulator.html

# 5. [Intake Mode B] Analyze Reference Screenshots or Extract Keyframes from a Screen Recording (.mp4)
python factory_cli.py intake-media --input examples/antigravity_studio_simulator/ --out temp/media_analysis.json

# 6. [Intake Mode C] Compile a 16:9 Declarative JSON Video Spec into Interactive HTML Pages
python factory_cli.py build-pages --spec examples/hanam_16x9_course/specs/B01_SaiLamThuongGap.json --out-dir temp/pages

# 7. [Audit Gate 1] Mechanically Audit an Interactive HTML Simulator (#laser-cursor, zero OS <select>, node --check, zero context leaks)
python factory_cli.py audit-sim --html examples/antigravity_studio_simulator/Antigravity_Simulator_Studio.html --forbid "Viettel,BIDV,New Way Edu"

# 8. [Audit Gate 2] Mechanically Audit a Video Spec (SemanticSyncGate + TTS Hygiene + ReelCrew 100-Point Rubric)
python factory_cli.py audit-spec --spec examples/hanam_16x9_course/specs/B01_SaiLamThuongGap.json --whitelabel

# 9. Run Automated Test Suite
pytest tests/ -v
```
