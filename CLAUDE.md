# CLAUDE.md — Claude Code Instructions for `software-tutorial-video-factory` (v2.0)

Please read [`AGENTS.md`](AGENTS.md), [`docs/CODEMAP.md`](docs/CODEMAP.md), [`docs/SPEC_V2_5LAYER_COURSEWARE_ENGINE.md`](docs/SPEC_V2_5LAYER_COURSEWARE_ENGINE.md), and [`.claude/skills/software-simulation-video-factory/SKILL.md`](.claude/skills/software-simulation-video-factory/SKILL.md) before modifying or generating any courseware, simulator, or video specification.

## Quick Commands
- `python factory_cli.py status`
- `python factory_cli.py compile-course --course-dir examples/antigravity_studio_simulator`
- `python factory_cli.py verify-course --course-dir examples/antigravity_studio_simulator`
- `python factory_cli.py intake-repo --repo <dir> --out temp/blueprint.json`
- `python factory_cli.py intake-media --input <video_or_img_dir> --out temp/media.json`
- `python factory_cli.py scaffold-sim --blueprint temp/blueprint.json --out temp/simulator.html`
- `python factory_cli.py build-pages --spec examples/enterprise_16x9_course/specs/B01_SaiLamThuongGap.json --out-dir temp/pages`
- `python factory_cli.py audit-sim --html examples/antigravity_studio_simulator/Antigravity_Simulator_Studio.html --forbid TelecomCorp,FinBank`
- `python factory_cli.py audit-spec --spec examples/enterprise_16x9_course/specs/B01_SaiLamThuongGap.json --whitelabel`
- `pytest tests/ -v`
