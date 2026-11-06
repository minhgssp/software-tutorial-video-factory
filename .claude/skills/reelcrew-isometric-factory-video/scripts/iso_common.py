"""Shared helpers: project paths, factory.json, values the page computes, and running reelcrew (the only way scripts
reach tools and keys).

$REELCREW overrides the command used for reelcrew (default: `reelcrew` on PATH), e.g.
REELCREW="node /path/to/reelcrew/apps/cli/bin/reelcrew.js" for a checkout that is not installed.
"""
import json
import os
import shlex
import shutil
import subprocess
import sys
from pathlib import Path


def reelcrew_cmd() -> list:
    """The reelcrew command: $REELCREW (`reelcrew python` sets it to the exact running CLI), else `reelcrew` on PATH
    (found with shutil.which, so the reelcrew.cmd launcher works on Windows)."""
    own = os.environ.get("REELCREW")
    if own:
        return shlex.split(own.replace("\\", "/") if os.name == "nt" else own)
    found = shutil.which("reelcrew")
    if found or os.name == "nt":
        return [found or "reelcrew"]
    # an agent's shell that has not read the PATH line yet: the launcher install.sh wrote, by its full path
    launcher = os.path.join(os.environ.get("REELCREW_HOME") or os.path.join(os.path.expanduser("~"), ".reelcrew"), "bin", "reelcrew")
    return [launcher if os.path.isfile(launcher) else "reelcrew"]


SKILL_DIR = Path(__file__).resolve().parent.parent
MUSIC = "audio/music.wav"  # the one music track of a project (music.py writes it; STORY.duration follows its length)


def project_dir() -> Path:
    if {"--help", "-h"} & set(sys.argv[1:]):  # the calling script's own docstring is its help
        print((sys.modules["__main__"].__doc__ or "").strip())
        raise SystemExit(0)
    if len(sys.argv) < 2:
        raise SystemExit(f"usage: {Path(sys.argv[0]).name} <project-dir> [options]")
    p = Path(sys.argv[1]).expanduser().resolve()
    if not p.is_dir():
        raise SystemExit(f"project dir not found: {p}")
    return p


def load(proj: Path) -> dict:
    f = proj / "factory.json"
    if not f.exists():
        raise SystemExit(f"missing {f}: run init-project.py first")
    return json.loads(f.read_text())


def arg(name: str, default=None):
    """Value after --name on the command line, else default."""
    return sys.argv[sys.argv.index(name) + 1] if name in sys.argv else default


def id_list(spec) -> set:
    """"5,12,19-22" → {5, 12, 19, 20, 21, 22}; empty → empty set (= every line). Stops with a clear message otherwise."""
    out = set()
    for part in filter(None, (spec or "").replace(" ", "").split(",")):
        a, _, b = part.partition("-")
        if not a.isdigit() or (b and not b.isdigit()) or (b and int(b) < int(a)):
            raise SystemExit(f"--lines takes caption numbers and ranges like 5,12,19-22; got {spec!r}")
        out.update(range(int(a), int(b or a) + 1))
    return out


def _free_path(err: dict, free) -> str:
    """When no transcriber is set up: the way on without paid transcription (`free`: this script's option); the CLI's
    hint above names the transcribers. Empty for any other error."""
    if err.get("code") != "transcribe.adapter_not_configured":
        return ""
    return ("\n  No transcriber is set up." + (f" To go on without one (free), run this script again with {free}." if free else ""))


def reelcrew(*args: str, json_out: bool = True, free: str = None):
    """Run `reelcrew <args> [--json]`. Returns the parsed JSON (or the text). A reelcrew error stops the script
    with its code and hint, so the agent sees exactly what to fix; `free` names this script's option to go on when no
    transcriber is set up."""
    cmd = reelcrew_cmd() + [str(a) for a in args] + (["--json"] if json_out else [])
    try:
        r = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", errors="replace")
    except FileNotFoundError:
        raise SystemExit("reelcrew is not installed or not on PATH (set $REELCREW to its command)")
    if r.returncode != 0:
        try:
            err = json.loads(r.stdout).get("error", {})
            raise SystemExit(f"reelcrew {args[0]} failed: {err.get('code')}: {err.get('message')}"
                             + (f"\n  hint: {err['hint']}" if err.get("hint") else "") + _free_path(err, free))
        except (ValueError, AttributeError):
            raise SystemExit(f"reelcrew {args[0]} failed:\n{(r.stdout + r.stderr).strip()[-1500:]}")
    return json.loads(r.stdout) if json_out else r.stdout


def page_data(proj: Path, name: str):
    """A value the page computes from story.js (DURATION, EVENTS, CAPTIONS), read through `reelcrew render --data`
    → audio/<name>.json. The scripts never parse story.js themselves, so they always see what the video shows."""
    out = proj / f"audio/{name.lower()}.json"
    out.parent.mkdir(parents=True, exist_ok=True)
    reelcrew("render", proj / "video/index.html", "--data", name, "--out", out)
    return json.loads(out.read_text())


_TOOLS = {}


def tool(name: str) -> str:
    """The ffmpeg / ffprobe reelcrew uses (its managed full copy, REELCREW_FFMPEG, or the system one), asked once."""
    if name not in _TOOLS:
        env = os.environ.get("REELCREW_FFMPEG" if name == "ffmpeg" else "REELCREW_FFPROBE")
        if env:
            _TOOLS[name] = env
        else:
            bin_ = reelcrew("ffmpeg").get("bin")
            if not bin_:
                raise SystemExit("no ffmpeg found: run `reelcrew ffmpeg install` (a full copy for reelcrew, nothing else changes)")
            _TOOLS["ffmpeg"] = bin_
            _TOOLS["ffprobe"] = str(Path(bin_).with_name("ffprobe")) if os.path.isabs(bin_) else "ffprobe"
    return _TOOLS[name]


def run(*cmd):
    """Run a tool quietly; stop with its error text when it fails."""
    r = subprocess.run([str(c) for c in cmd], capture_output=True, text=True)
    if r.returncode != 0:
        raise SystemExit(f"{Path(str(cmd[0])).name} failed:\n{(r.stdout + r.stderr).strip()[-1500:]}")
    return r.stdout


def duration(path) -> float:
    return float(run(tool("ffprobe"), "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path))


def narration(cfg: dict) -> dict:
    """Voice-over settings. Off unless "narration": {"enabled": true}; the default video is music only."""
    n = cfg.get("narration") or {}
    return {"enabled": bool(n.get("enabled")), "lang": n.get("lang", "vi"), "engine": n.get("engine", "vieneu"),
            "voice": n.get("voice"), "say": n.get("say") or {}}


def vi_narration(vieneu_voice) -> dict:
    """Starting Vietnamese narration: the voice engine the user set up as default (`reelcrew tts ls`); VieNeu with this
    skill's VieNeu voice when that is the default or no engine is ready yet. Other engines speak with the voice chosen
    at their setup ("voice": null)."""
    engine = "vieneu"
    try:
        ready = [a for a in reelcrew("tts", "ls").get("adapters", []) if a.get("ready")]
        engine = next((a["name"] for a in ready if a.get("default")), ready[0]["name"] if ready else "vieneu")
    except SystemExit:  # tts plugin off or reelcrew unreachable: keep the skill's own default
        pass
    return {"enabled": False, "lang": "vi", "engine": engine, "voice": vieneu_voice if engine == "vieneu" else None, "say": {}}


def check_project_path(proj, *sources):
    """Before init copies anything: the project's deepest file (each (dest, source folder) pair placed in the project)
    must fit this machine's path limit (`reelcrew project check`; Windows stops at 260 characters), else the copy would
    stop half-way. Stops with the CLI's message naming a short folder. A reelcrew without this command (older than the
    pack) or none at all: the copy goes on as before."""
    try:
        reelcrew("project", "check", proj, *[a for dest, src in sources for a in ("--from", f"{dest}={src}")])
    except SystemExit as e:
        if "skills.project_" in str(e):
            raise


def copy_missing(src, dest):
    """Copy what `dest` lacks of `src` (a file, or a folder file by file): nothing existing is replaced, so running
    init again completes a half-made project. A copy error stops with one line naming the file."""
    src, dest = Path(src), Path(dest)
    keep = lambda s, d: d if Path(d).exists() else shutil.copy(s, d)  # noqa: E731
    try:
        if src.is_dir():
            shutil.copytree(src, dest, dirs_exist_ok=True, copy_function=keep)
        elif not dest.exists():
            dest.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy(src, dest)
    except shutil.Error as e:
        s, d, why = (e.args[0][0] if e.args and isinstance(e.args[0], list) and e.args[0] else (src, dest, e))
        raise SystemExit(f"could not copy {s} to {d}: {why}")
    except OSError as e:
        raise SystemExit(f"could not copy {src} to {dest}: {e.strerror or e}")


def make_dir(d):
    """mkdir -p that stops with one line (a path this system cannot hold, no permission) instead of a traceback."""
    try:
        Path(d).mkdir(parents=True, exist_ok=True)
    except OSError as e:
        raise SystemExit(f"could not make the folder {d}: {e.strerror or e}")
