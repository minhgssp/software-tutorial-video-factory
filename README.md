# 🎬 Software Simulation & Tutorial Video Factory (`software-tutorial-video-factory`)

> **AI-Native Software Simulation & Widescreen 16:9 Lecture Video Factory**  
> Turn **Screen Recordings, UI Screenshots, Code Repositories, or Markdown Curricula** into **Interactive Single-File HTML Software Simulators** and **Voice-Synced 16:9 Tutorial / Product Demo Videos**.  
> Built for immediate execution by **Google Antigravity**, **Claude Code**, **Cursor**, and **Codex**.

---

## 🌟 Why This Factory Exists

Recording real software screens manually for courses and product tutorials breaks down the moment a UI changes, a voiceover line is edited, or a reference screenshot leaks another client's project name.

This repository packages two battle-tested simulation paradigms and three production video engines (`/kudo`, `/reelcrew`, `/fac-video`) into **one self-contained factory**:

1. **Paradigm 1 — Full-App Single-File Interactive HTML Simulator (`Antigravity Studio Engine`):**
   - Reconstructs a complete multi-surface software environment (e.g., **Antigravity 2.0 Agent Manager + 3-Column IDE + Windows 11 OS Dialogs + Extensions Marketplace + Settings + Virtual File System VFS**) in a single zero-dependency `.html` file (`4,355 lines`).
   - Uses a **Soft Red Glowing Laser Dot (`#laser-cursor`)** (`18px`, `.hovering-target`, `.click-ripple`), **Custom DOM Floating Dropdowns (`#custom-select-floating`)** so native OS `<select>` menus never hide the cursor during recording, and an automated **`glideLaserTo()`** scenario tour runner.
2. **Paradigm 2 — Declarative 6-Archetype Scene Compiler + Voice-Synced 16:9 Screencast Pipeline (`BIDV Hà Nam Kudo Engine`):**
   - Compiles declarative JSON video specs (`B01..B09.json`) into 6 visual HTML archetypes (`concept`, `app`, `webchat`, `predict`, `board`, `workspace`) driven by `window.__act(name, arg)`.
   - Renders `1920x1080` widescreen MP4 lectures via Playwright CDP screencast (`core_engine/kcast_engine/`), binding every cursor action (`steps`) and camera move (`beats`) to exact spoken phrases (`at`), with **full-sentence karaoke subtitles (`paragraph_captions`)**, **section openers (`opener`)**, **non-occluding bottom-right cursor placement (`CONTENT_CORNER_JS`)**, and **auto-ducked `-8dB` Foley SFX (`sfx_cues_around_speech`)**.

---

## 🗂️ Repository Structure

```text
software-tutorial-video-factory/
├── README.md                                                          # Master documentation & quickstart
├── AGENTS.md                                                          # Agent Operating Charter (Google Antigravity / Codex)
├── CLAUDE.md                                                          # Agent Operating Charter (Claude Code)
├── factory_cli.py                                                     # Unified CLI Entrypoint (7 commands)
├── core_engine/                                                       # Deterministic Python & JS Core Engines
│   ├── __init__.py
│   ├── intake_extractor.py                                            # Video keyframe extractor, Screenshot analyzer, Repo VFS harvester & HTML Scaffolder
│   ├── scene_builder.py                                               # 6-Archetype 16:9 HTML Scene Compiler (window.__act)
│   ├── syncgate_and_foley.py                                          # /fac-video SemanticSyncGate, Knuth-Plass Vietnamese line balancer, 48kHz Foley, /reelcrew Rubric & HTML DOM Auditor
│   └── kcast_engine/                                                  # Embedded /kudo Screencast Core (plan.py, capture.py, render.py, widescreen_16x9.py, remux_sfx.py)
├── .agents/skills/software-simulation-video-factory/                  # Native Skill for Antigravity / AgentKit
│   ├── SKILL.md
│   └── references/
│       └── PLAYBOOK_25_GOLDEN_RULES.md
├── .claude/skills/software-simulation-video-factory/                  # Native Skill for Claude Code
│   └── SKILL.md
├── prompts/                                                           # Ready-to-use Agent System Prompts
│   ├── 01_screenshot_or_video_to_html_simulator.md
│   ├── 02_code_repo_to_interactive_demo.md
│   ├── 03_curriculum_to_16x9_video_spec.md
│   └── 04_pedagogy_and_ui_audit_prompt.md
├── examples/                                                          # Production Showcases from Both Courses
│   ├── antigravity_studio_simulator/
│   │   ├── Antigravity_Simulator_Studio.html                          # 4,355-line Full Antigravity 2.0 + IDE + Win11 Simulator
│   │   ├── lesson_01_overview.html
│   │   ├── lesson_02_4pillars.html
│   │   └── lesson_03_workflows.html
│   └── hanam_16x9_course/
│       ├── scripts/                                                   # build_pages.py, run_kudo_16x9.py, remux_sfx.py
│       └── specs/                                                     # B01_SaiLamThuongGap.json, B02_BaCapDoLamViecAI.json, BRIEF_AGY_VIET_SPEC.md
└── tests/
    └── test_factory_pipeline.py                                       # End-to-end pytest suite
```

---

## 🚀 Quickstart CLI Commands

```bash
# 1. Inspect factory status and embedded engines
python factory_cli.py status

# 2. [Intake Mode A] Harvest a Code Repository into a VFS Blueprint & Generate an Interactive HTML Simulator
python factory_cli.py intake-repo --repo . --name "antigravity_course_vn" --out temp/repo_blueprint.json
python factory_cli.py scaffold-sim --blueprint temp/repo_blueprint.json --out temp/repo_simulator.html

# 3. [Intake Mode B] Analyze Reference Screenshots or Extract Keyframes from a Screen Recording (.mp4)
python factory_cli.py intake-media --input examples/antigravity_studio_simulator/ --out temp/media_analysis.json

# 4. [Intake Mode C] Compile a 16:9 Declarative JSON Video Spec into Interactive HTML Pages
python factory_cli.py build-pages --spec examples/hanam_16x9_course/specs/B01_SaiLamThuongGap.json --out-dir temp/pages

# 5. [Audit Gate 1] Mechanically Audit an Interactive HTML Simulator (#laser-cursor, zero OS <select>, node --check, zero context leaks)
python factory_cli.py audit-sim --html examples/antigravity_studio_simulator/Antigravity_Simulator_Studio.html --forbid "Viettel,BIDV,New Way Edu"

# 6. [Audit Gate 2] Mechanically Audit a Video Spec (SemanticSyncGate + TTS Hygiene + ReelCrew 100-Point Rubric)
python factory_cli.py audit-spec --spec examples/hanam_16x9_course/specs/B01_SaiLamThuongGap.json --whitelabel

# 7. Run Automated Test Suite
pytest tests/ -v
```

---

## 📏 The 25 Golden Rules (Distilled from Antigravity Basic & BIDV Hà Nam Courses)

See full details in [`.agents/skills/software-simulation-video-factory/references/PLAYBOOK_25_GOLDEN_RULES.md`](.agents/skills/software-simulation-video-factory/references/PLAYBOOK_25_GOLDEN_RULES.md):

- **Rule 1 (Soft Red Glowing Laser Dot `#laser-cursor`):** Use an `18px` soft glowing red dot with hover expansion (`26px`) and click ripple rings (`.click-ripple`) instead of tiny OS arrows.
- **Rule 2 (Zero Native OS `<select>` Menus):** Always use custom DOM dropdowns (`#custom-select-floating`) so menus appear in DOM recordings and never hide the laser dot.
- **Rule 5 (Zero Context Contamination / Anti-Overfit):** Never copy unrelated client/project names from reference screenshots into a course simulator; enforce `--forbid` checks via `audit-sim`.
- **Rule 11 (Approve Script First, Render Later):** Edit narration text before rendering; speech text is the single source of truth.
- **Rule 15 (Semantic Audio-Visual Lock — *"Lời nhấn gì, hình đổi nấy"*):** Every spoken emphasis must trigger a concrete visual state change (`hl`, `show`, `doc`, `tick`, `reveal`) anchored to an exact phrase (`at`).
- **Rule 16 (Cursor Never Occludes Text):** Place the cursor at the bottom-right corner of text blocks (`CONTENT_CORNER_JS`).
- **Rule 17 (Full-Sentence Paragraph Subtitles):** Widescreen 16:9 lectures display complete sentences with line breaks between sentences (`paragraph_captions`).
- **Rule 18 & 19 (1-Second Max Pause & `-8dB` SFX Auto-Ducking):** Cap scene transition holds at `<= 1.0s` and automatically duck any overlapping sound effect by `-8dB` during speech.
- **Rule 20 (TTS Token Hygiene):** Write numbers as words in `say[]`, and avoid mid-word hyphens, dots, or slashes so word-level forced alignment never drifts.
