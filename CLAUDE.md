# CLAUDE.md — Claude Code Instructions for `software-tutorial-video-factory`

See [`AGENTS.md`](AGENTS.md) and [`.claude/skills/software-simulation-video-factory/SKILL.md`](.claude/skills/software-simulation-video-factory/SKILL.md) for the complete operational workflow.

## Essential Commands
- **Check Factory Status:** `python factory_cli.py status`
- **Harvest a Code Repo into a VFS Blueprint:** `python factory_cli.py intake-repo --repo <path> --out temp/blueprint.json`
- **Scaffold an Interactive Single-File HTML Simulator:** `python factory_cli.py scaffold-sim --blueprint temp/blueprint.json --out temp/simulator.html`
- **Compile 16:9 HTML Scenes from JSON Spec:** `python factory_cli.py build-pages --spec <spec.json> --out-dir temp/pages`
- **Audit HTML Simulator (DOM + Laser + Zero Native Select + `node --check`):** `python factory_cli.py audit-sim --html <file.html>`
- **Audit 16:9 Video Spec (SyncGate + TTS Rules + ReelCrew Rubric):** `python factory_cli.py audit-spec --spec <spec.json>`
- **Run Full Test Suite:** `pytest tests/ -v`
