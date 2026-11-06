"""Shared helpers: project paths, whiteboard.json, SRT parsing, image sizes, and running reelcrew (the only way the
scripts reach tools and keys).

$REELCREW overrides the command used for reelcrew (default: `reelcrew` on PATH), e.g.
REELCREW="node /path/to/reelcrew/apps/cli/bin/reelcrew.js" for a checkout that is not installed.
"""
import json
import os
import re
import shlex
import shutil
import struct
import subprocess
import sys
from pathlib import Path

SKILL_DIR = Path(__file__).resolve().parent.parent
VO = "audio/vo.wav"           # the voice (copied in, made by voice.py, or none)
SRT = "audio/vo.srt"          # the subtitles every step reads
SCENES = "scenes.json"        # parse-srt.py's cues and scenes, plus the agent's idea and subject per scene
BED = "audio/music/bed.wav"   # the music bed (music.py)
MIX = "audio/final-mix.wav"   # mix-audio.py
VIDEO = "renders/video-only.mp4"
SIZES = {"16:9": (1920, 1080), "9:16": (1080, 1920)}


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
    f = proj / "whiteboard.json"
    if not f.exists():
        raise SystemExit(f"missing {f}: run init-project.py first")
    return json.loads(f.read_text(encoding="utf8"))


def save_json(path: Path, data) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf8")


def arg(name: str, default=None):
    """Value after --name on the command line, else default; a flag with no value stops with a message."""
    if name not in sys.argv:
        return default
    i = sys.argv.index(name) + 1
    if i >= len(sys.argv) or sys.argv[i].startswith("--"):
        raise SystemExit(f"{name} needs a value")
    return sys.argv[i]


def num(name: str, default: float) -> float:
    v = arg(name)
    if v is None:
        return float(default)
    try:
        return float(v)
    except ValueError:
        raise SystemExit(f"{name} takes a number, got {v!r}")


def _free_path(err: dict, free) -> str:
    """When no transcriber is set up: the way on without paid transcription (`free`: this script's option)."""
    if err.get("code") != "transcribe.adapter_not_configured":
        return ""
    return "\n  No transcriber is set up." + (f" To go on without one (free), run this script again with {free}." if free else "")


def reelcrew(*args, json_out: bool = True, free: str = None):
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
    r = subprocess.run([str(c) for c in cmd], capture_output=True, text=True, encoding="utf-8", errors="replace")
    if r.returncode != 0:
        raise SystemExit(f"{Path(str(cmd[0])).name} failed:\n{(r.stdout + r.stderr).strip()[-1500:]}")
    return r.stdout


def duration(path) -> float:
    return float(run(tool("ffprobe"), "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path))


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
    return {"lang": "vi", "engine": engine, "voice": vieneu_voice if engine == "vieneu" else None}


def check_project_path(proj, *sources):
    """Before init copies anything: the project's deepest file must fit this machine's path limit (`reelcrew project
    check`; Windows stops at 260 characters). A reelcrew without this command, or none at all: the copy goes on."""
    try:
        reelcrew("project", "check", proj, *[a for dest, src in sources for a in ("--from", f"{dest}={src}")])
    except SystemExit as e:
        if "skills.project_" in str(e):
            raise


def copy_missing(src, dest):
    """Copy what `dest` lacks of `src` (a file, or a folder file by file): nothing existing is replaced."""
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
    try:
        Path(d).mkdir(parents=True, exist_ok=True)
    except OSError as e:
        raise SystemExit(f"could not make the folder {d}: {e.strerror or e}")


# ── SRT: the same parsing and grouping as the original skill's parser ──
_TIME = re.compile(r"(\d+):(\d{2}):(\d{2})[,.](\d{1,3})")


def _to_ms(h: str, m: str, s: str, ms: str) -> int:
    return ((int(h) * 60 + int(m)) * 60 + int(s)) * 1000 + int(ms.ljust(3, "0"))


def parse_srt(text: str) -> list:
    """SRT text → cues {index, startMs, endMs, durMs, text}. Tolerates extra blank lines, a BOM, comma or dot ms."""
    text = text.lstrip("﻿").replace("\r\n", "\n").replace("\r", "\n")
    cues = []
    for block in re.split(r"\n\s*\n", text.strip()):
        lines = [ln for ln in block.split("\n") if ln.strip() != ""]
        if not lines:
            continue
        at = next((i for i, ln in enumerate(lines) if "-->" in ln), None)
        if at is None:
            continue
        times = _TIME.findall(lines[at])
        if len(times) < 2:
            continue
        start, end = _to_ms(*times[0]), _to_ms(*times[1])
        cues.append({"index": len(cues) + 1, "startMs": start, "endMs": end, "durMs": max(0, end - start),
                     "text": " ".join(lines[at + 1:]).strip()})
    return cues


def group_scenes(cues: list, target_sec: float = 30, min_sec: float = 25, max_sec: float = 35) -> list:
    """Consecutive cues → scenes: cut once a scene reaches the target (and the minimum); a cue that would take it past
    the maximum starts a new scene."""
    scenes, bucket = [], []
    target_ms, min_ms, max_ms = target_sec * 1000, min_sec * 1000, max_sec * 1000

    def flush():
        if not bucket:
            return
        start, end = bucket[0]["startMs"], bucket[-1]["endMs"]
        scenes.append({"sceneIndex": len(scenes) + 1, "startMs": start, "endMs": end,
                       "sceneDurationMs": max(0, end - start), "cueRange": [bucket[0]["index"], bucket[-1]["index"]],
                       "text": " ".join(c["text"] for c in bucket).strip()})
        bucket.clear()

    for cue in cues:
        if bucket and cue["endMs"] - bucket[0]["startMs"] > max_ms:
            flush()
        bucket.append(cue)
        span = bucket[-1]["endMs"] - bucket[0]["startMs"]
        if span >= target_ms and span >= min_ms:
            flush()
    flush()
    return scenes


def phrase_cues(words: list, max_chars: int = 42, pause_ms: int = 500) -> list:
    """Transcript words [{text, start_ms, end_ms}] → subtitle cues: a cue ends at a sentence end, a pause of
    pause_ms, or before it would pass max_chars."""
    cues, cur = [], []

    def flush():
        if cur:
            text = "".join(w["text"] if not i or w["text"][:1] in ",.!?;:…)" else " " + w["text"]
                           for i, w in enumerate(cur)).strip()
            cues.append({"startMs": int(cur[0]["start_ms"]), "endMs": int(cur[-1]["end_ms"]), "text": text})
            cur.clear()

    for w in words:
        if not str(w.get("text", "")).strip():
            continue
        w = {**w, "text": str(w["text"]).strip()}
        if cur and (w["start_ms"] - cur[-1]["end_ms"] >= pause_ms
                    or len(" ".join(x["text"] for x in cur)) + 1 + len(w["text"]) > max_chars):
            flush()
        cur.append(w)
        if w["text"][-1:] in ".!?…":
            flush()
    flush()
    return cues


def srt_time(ms: int) -> str:
    h, rest = divmod(int(ms), 3600000)
    m, rest = divmod(rest, 60000)
    s, ms = divmod(rest, 1000)
    return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"


def write_srt(path: Path, cues: list) -> None:
    path.write_text("".join(f"{i}\n{srt_time(c['startMs'])} --> {srt_time(c['endMs'])}\n{c['text']}\n\n"
                            for i, c in enumerate(cues, 1)), encoding="utf8")


# ── scenes ──
def scene_name(scene: dict) -> str:
    return scene.get("name") or f"scene-{int(scene['sceneIndex']):02d}"


def load_scenes(proj: Path) -> list:
    f = proj / SCENES
    if not f.exists():
        raise SystemExit(f"missing {SCENES}: run parse-srt.py first")
    return json.loads(f.read_text(encoding="utf8")).get("scenes", [])


def scene_image(proj: Path, name: str):
    """video/scenes/<name>.png|.jpg|.jpeg, or None."""
    for ext in (".png", ".jpg", ".jpeg"):
        f = proj / "video/scenes" / (name + ext)
        if f.exists():
            return f
    return None


def image_size(path: Path):
    """(width, height) of a PNG or JPEG from its header, or None."""
    data = Path(path).read_bytes()
    if data[:8] == b"\x89PNG\r\n\x1a\n" and data[12:16] == b"IHDR":
        return struct.unpack(">II", data[16:24])
    if data[:2] == b"\xff\xd8":
        i = 2
        while i + 9 < len(data):
            if data[i] != 0xFF:
                i += 1
                continue
            marker = data[i + 1]
            if marker in (0xD8, 0x01) or 0xD0 <= marker <= 0xD7 or marker == 0xFF:
                i += 1 if marker == 0xFF else 2
                continue
            length = struct.unpack(">H", data[i + 2:i + 4])[0]
            if marker in (0xC0, 0xC1, 0xC2, 0xC3, 0xC5, 0xC6, 0xC7, 0xC9, 0xCA, 0xCB, 0xCD, 0xCE, 0xCF):
                h, w = struct.unpack(">HH", data[i + 5:i + 9])
                return w, h
            i += 2 + length
    return None


def page_data(proj: Path, name: str):
    """A value the page computes (DURATION, SCENES, SFX_CUES, PROBLEMS), read with `reelcrew render --data`."""
    out = proj / f"review/{name.lower()}.json"
    reelcrew("render", proj / "video/index.html", "--data", name, "--out", out)
    return json.loads(out.read_text(encoding="utf8"))
