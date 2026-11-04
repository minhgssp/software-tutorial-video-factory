#!/usr/bin/env python3
"""CLI quay màn hình và trỏ chuột cho Kudo (`kudo-screencast`).

    python3 engines/screencast/screencast.py <lệnh> [tham số]

Lệnh:
  suggest "brief"          có nên dùng quay màn hình không (how-to, hướng dẫn, demo, có URL...)
  capture SCRIPT RUN       quay: chụp toàn trang + toạ độ vùng đích, quay trực tiếp, lấy clip kết quả
  voice SCRIPT RUN         giọng VieNeu + căn mốc từng từ (offline, không tốn phí)
  plan SCRIPT RUN          ghép kịch bản + bản quay + mốc giọng thành RUN/plan.json
  still RUN t1 t2 ...      chụp vài khung lẻ để soi bằng mắt
  render RUN               dựng MP4 câm RUN/work/silent.mp4
  audio RUN                giọng -14 LUFS + nhạc nền + tiếng động theo cú bấm/nét bút -> RUN/out/final.mp4
  qa RUN                   kiểm cổng kỹ thuật, ghi RUN/qa/report.json + tờ khung hình (contact sheet)
  make SCRIPT RUN          chạy hết các bước trên

Mã thoát: 0 PASS, 1 FAIL/PARTIAL, 2 BLOCKED (thiếu công cụ, không mở được trang), 3 STUCK.
"""

from __future__ import annotations

import argparse
import json
import os
import shutil
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent.parent
if str(HERE) not in sys.path:
    sys.path.insert(0, str(HERE))

from kcast import compose, plan as P  # noqa: E402

EXIT_OK, EXIT_FAIL, EXIT_BLOCKED, EXIT_STUCK = 0, 1, 2, 3
VOICE_ENGINE = ROOT / "engines/voice"
# Máy chủ dự án còn công cụ giọng chính chủ riêng; máy học viên dùng engines/voice (VieNeu giọng có sẵn hoặc --ref).
OWNER_TOOLS = Path("{{KUDO_HOME}}/skills/pixel-explainer/tools")


def _first(*paths) -> Path:
    found = [Path(p).expanduser() for p in paths if p]
    return next((p for p in found if p.exists()), found[-1])


VOICE_PY = _first(os.environ.get("KUDO_VIENEU_PY"), ROOT / ".venv/vieneu/bin/python",
                  Path.home() / ".cache/thong-phan-remotion/vieneu-v3-py312/bin/python")
ALIGN_PY = _first(os.environ.get("KUDO_WHISPER_PY"), ROOT / ".venv/faster-whisper-py312/bin/python",
                  Path.home() / ".cache/thong-phan-remotion/faster-whisper-py312/bin/python")


def load_script(path: str) -> dict:
    import yaml

    data = yaml.safe_load(Path(path).read_text(encoding="utf-8"))
    ids = [s["id"] for s in data["shots"]]
    if len(ids) != len(set(ids)):
        raise SystemExit("SCRIPT_INVALID: id cảnh bị trùng")
    for s in data["shots"]:
        kind = s.get("kind", "screen")
        if kind not in ("screen", "live", "demo", "card", "terminal"):
            raise SystemExit(f"SCRIPT_INVALID: {s['id']} kind={kind}")
        if kind in ("screen", "live") and not s.get("url"):
            raise SystemExit(f"SCRIPT_INVALID: {s['id']} thiếu url")
        if kind == "terminal" and not all(isinstance(x, dict) and x.get("cmd") for x in s.get("steps") or [None]):
            raise SystemExit(f"SCRIPT_INVALID: {s['id']} cảnh terminal cần steps: [{{cmd: ...}}]")
        if kind == "demo" and not (s.get("video") or s.get("video_from")):
            raise SystemExit(f"SCRIPT_INVALID: {s['id']} thiếu video")
    return data


def _run(a) -> Path:
    run = Path(a.run).resolve()
    run.mkdir(parents=True, exist_ok=True)
    return run


def _words(run: Path) -> list[dict] | None:
    tl = run / "work" / "voice_timeline.json"
    if not tl.is_file():
        return None
    data = json.loads(tl.read_text())
    return [{"text": w["text"], "start": w["start_ms"] / 1000, "end": w["end_ms"] / 1000} for w in data["words"]]


def cmd_suggest(a) -> int:
    print(json.dumps(P.suggest(a.brief), ensure_ascii=False, indent=1))
    return EXIT_OK


def cmd_capture(a) -> int:
    from kcast import capture

    script = load_script(a.script)
    run = _run(a)
    shutil.copy(a.script, run / "script.yaml")
    try:
        cap = capture.capture_all(script, run, a.only.split(",") if a.only else None)
    except Exception as e:  # noqa: BLE001  trang không mở được / trình duyệt lỗi là chặn, không phải trượt
        print(f"BLOCKED: {e}", file=sys.stderr)
        return EXIT_BLOCKED
    miss = [(sid, b.get("target")) for sid, c in cap["shots"].items() for b in c.get("beats", []) if not b.get("found")]
    miss += [(sid, e.get("target")) for sid, c in cap["shots"].items() for e in c.get("events", []) if not e.get("found")]
    for sid, t in miss:
        print(f"  KHÔNG THẤY đích: {sid} -> {t}")
    return EXIT_FAIL if miss else EXIT_OK


def cmd_voice(a) -> int:
    script = load_script(a.script)
    run = _run(a)
    docs = run / "docs"
    docs.mkdir(exist_ok=True)
    says = [s.get("say", "").strip() for s in script["shots"]]
    perf = [s.get("perform", s.get("say", "")).strip() for s in script["shots"]]
    (docs / "clean.txt").write_text(" ".join(" ".join(says).split()) + "\n", encoding="utf-8")
    (docs / "performance.txt").write_text(" //\n".join(p for p in perf if p) + "\n", encoding="utf-8")
    if not VOICE_PY.exists() or not ALIGN_PY.exists():
        print("BLOCKED: thiếu môi trường giọng VieNeu hoặc faster-whisper", file=sys.stderr)
        return EXIT_BLOCKED
    if (OWNER_TOOLS / "voice_synth.py").exists() and not (a.voice or a.ref):
        env = {**os.environ, "HF_HUB_OFFLINE": "1", "TRANSFORMERS_OFFLINE": "1"}
        synth = [str(VOICE_PY), str(OWNER_TOOLS / "voice_synth.py"), str(run), "--pace", str(a.pace)]
        tools = OWNER_TOOLS
    else:
        tools = VOICE_ENGINE
        env = dict(os.environ)
        synth = [str(VOICE_PY), str(VOICE_ENGINE / "vieneu_tts.py"), "run", str(run), "--pace", str(a.pace)]
        synth += ["--voice", a.voice] if a.voice else []
        synth += ["--ref", a.ref] if a.ref else []
    subprocess.run(synth, check=True, env=env)
    subprocess.run([str(ALIGN_PY), str(tools / "voice_align.py"), str(run)], check=True, env=env)
    print(f"giọng: {run / 'work/voice.wav'}; mốc từ: {run / 'work/voice_timeline.json'}")
    return EXIT_OK


def cmd_plan(a) -> int:
    script = load_script(a.script)
    run = _run(a)
    cap = json.loads((run / "capture" / "capture.json").read_text())
    plan = compose.build(script, cap, _words(run))
    (run / "plan.json").write_text(json.dumps(plan, ensure_ascii=False, indent=1) + "\n")
    print(f"plan: {plan['duration']:.2f}s, {len(plan['shots'])} cảnh, mốc theo {plan['timing']}")
    return EXIT_OK


def cmd_still(a) -> int:
    from kcast import render

    run = _run(a)
    plan = json.loads((run / "plan.json").read_text())
    times = [float(x) for x in a.times] or [round(s["t0"] + (s["t1"] - s["t0"]) * f, 2) for s in plan["shots"] for f in (.3, .75)]
    for p in render.still(run, plan, times, run / "qa" / "stills"):
        print(p)
    return EXIT_OK


def cmd_render(a) -> int:
    from kcast import render

    run = _run(a)
    plan = json.loads((run / "plan.json").read_text())
    out = render.render(run, plan, run / "work" / "silent.mp4", workers=a.workers)
    print(out)
    return EXIT_OK


def cmd_audio(a) -> int:
    run = _run(a)
    plan = json.loads((run / "plan.json").read_text())
    silent, voice = run / "work" / "silent.mp4", run / "work" / "voice.wav"
    out = run / "out"
    out.mkdir(exist_ok=True)
    clip = run / "work" / "voiced.mp4"
    # nhạc nền chỉ cần plan: tổng hợp song song với lượt ghép giọng bên dưới
    cues = P.sfx_cues(plan)
    (run / "work" / "cues.json").write_text(json.dumps(cues, ensure_ascii=False, indent=1))
    score = ROOT / "engines" / "audio" / "score.py"
    bed = subprocess.Popen([sys.executable, str(score), "bed", str(run / "work" / "bed.wav"), "--duration", str(plan["duration"]),
                            "--recipe", a.recipe, "--cues", str(run / "work" / "cues.json")])
    if voice.is_file():
        # Đệm tiếng quá hình 0,25 s rồi cắt bằng -t đúng độ dài hình; -shortest làm tiếng hụt ~50 ms và trượt cổng.
        # loudnorm làm lệch mốc thời gian (~60 ms) nên apad đếm thiếu: đặt lại mốc theo số mẫu trước khi đệm.
        dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(silent)],
                                   capture_output=True, text=True, check=True).stdout)
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(silent), "-i", str(voice), "-filter_complex",
                        f"[1:a]loudnorm=I=-14:TP=-1.5:LRA=11,aresample=48000,asetpts=N/SR/TB,apad=whole_dur={dur + 0.25:.3f}[a]",
                        "-map", "0:v", "-map", "[a]", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-t", f"{dur:.3f}", str(clip)], check=True)
    else:
        shutil.copy(silent, clip)
    if bed.wait():
        raise subprocess.CalledProcessError(bed.returncode, bed.args)
    r = subprocess.run([sys.executable, str(score), "mux", str(clip), str(run / "work" / "bed.wav"), "-o",
                        str(out / "final.mp4"), "--vol", str(a.vol), "--sfx-vol", str(a.sfx_vol)])
    return EXIT_OK if r.returncode == 0 else EXIT_FAIL


def cmd_qa(a) -> int:
    run = _run(a)
    plan = json.loads((run / "plan.json").read_text())
    cap = json.loads((run / "capture" / "capture.json").read_text())
    final = run / "out" / "final.mp4"
    video = final if final.is_file() else run / "work" / "silent.mp4"
    qd = run / "qa"
    qd.mkdir(exist_ok=True)
    errs, warns = [], []
    for sid, c in cap["shots"].items():
        for b in c.get("beats", []) + c.get("events", []):
            if not b.get("found"):
                errs.append(f"{sid}: không thấy đích {b.get('target')}")
    for s in plan["shots"]:
        for g in s.get("cam", []):
            if not (0.95 <= g["z"] <= P.Z_MAX + 0.01):
                errs.append(f"{s['id']}: zoom {g['z']} ngoài [1, {P.Z_MAX}]")
        if s["kind"] in ("screen", "live", "terminal") and not s.get("spots") and not s.get("marks"):
            warns.append(f"{s['id']}: không có vùng tô khối hay nét bút nào")
        on = {}
        for m in s.get("marks", []):
            for t in (m["t0"], (m["t0"] + m["t1"]) / 2):
                on[t] = sum(1 for x in s["marks"] if x["t0"] <= t < x["t1"])
        if on and max(on.values()) > 3:
            errs.append(f"{s['id']}: quá 3 nét bút cùng lúc")
    probe = json.loads(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "stream=codec_type,width,height,r_frame_rate:format=duration",
                                       "-of", "json", str(video)], capture_output=True, text=True, check=True).stdout)
    vs = [x for x in probe["streams"] if x["codec_type"] == "video"][0]
    dur = float(probe["format"]["duration"])
    if (vs["width"], vs["height"]) != (1080, 1920):
        errs.append(f"kích thước {vs['width']}x{vs['height']} khác 1080x1920")
    if abs(dur - plan["duration"]) > 0.25:
        errs.append(f"độ dài {dur:.2f}s lệch plan {plan['duration']:.2f}s")
    # khung chết: hình đứng yên quá 1,0 s
    fz = subprocess.run(["ffmpeg", "-v", "info", "-i", str(video), "-vf", "freezedetect=n=0.0008:d=1.0", "-map", "0:v", "-f", "null", "-"],
                        capture_output=True, text=True).stderr
    freezes = [ln.split("freeze_start: ")[1] for ln in fz.splitlines() if "freeze_start" in ln]
    if freezes:
        errs.append(f"khung chết (đứng yên ≥1 s) tại {', '.join(freezes[:6])}")
    audio = None
    aj = Path(str(final) + ".audio.json")
    if aj.is_file():
        audio = json.loads(aj.read_text())
        if audio["verdict"] != "PASS":
            errs += [f"âm thanh: {e}" for e in audio["errors"]]
    else:
        # Video bàn giao phải có tiếng; thiếu final.mp4 hoặc biên bản âm thanh là trượt cổng, không chỉ cảnh báo.
        errs.append("chưa có final.mp4 hoặc final.mp4.audio.json (bước audio chưa chạy hoặc lỗi)")
    sheet = qd / "contact.jpg"
    n = 24
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(video), "-vf",
                    f"fps={n}/{max(dur, 1):.3f},scale=270:-1,tile=6x4:padding=6:color=0x0b0a09", "-frames:v", "1", str(sheet)])
    rep = {"video": str(video), "duration": dur, "timing": plan["timing"], "errors": errs, "warnings": warns,
           "audio": audio and {k: audio[k] for k in ("ffmpeg_ebur128", "verdict")},
           "contact_sheet": str(sheet), "verdict": "FAIL" if errs else "PASS",
           "note": "PASS ở đây chỉ là cổng kỹ thuật; gu hình, giọng và nhịp vẫn cần người thật duyệt."}
    (qd / "report.json").write_text(json.dumps(rep, ensure_ascii=False, indent=1))
    print(json.dumps(rep, ensure_ascii=False, indent=1))
    return EXIT_FAIL if errs else EXIT_OK


def cmd_make(a) -> int:
    for step, fn in (("capture", cmd_capture), ("voice", cmd_voice), ("plan", cmd_plan), ("render", cmd_render),
                     ("audio", cmd_audio), ("qa", cmd_qa)):
        if step == "voice" and a.no_voice:
            continue
        print(f"== {step}", flush=True)
        code = fn(a)
        if code not in (EXIT_OK,) and not (step == "capture" and code == EXIT_FAIL and a.keep_going):
            return code
    return EXIT_OK


def build_parser() -> argparse.ArgumentParser:
    ap = argparse.ArgumentParser(prog="screencast", description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest="cmd", required=True)
    s = sub.add_parser("suggest")
    s.add_argument("brief")
    s.set_defaults(fn=cmd_suggest)
    for name, fn in (("capture", cmd_capture), ("voice", cmd_voice), ("plan", cmd_plan), ("make", cmd_make)):
        p = sub.add_parser(name)
        p.add_argument("script")
        p.add_argument("run")
        p.add_argument("--only", help="chỉ quay các cảnh này (id, ngăn bằng dấu phẩy)")
        p.add_argument("--pace", type=float, default=1.05)
        p.add_argument("--workers", type=int, default=6)
        p.add_argument("--recipe", default="explainer")
        p.add_argument("--vol", type=float, default=0.10)
        p.add_argument("--sfx-vol", type=float, default=0.35)
        p.add_argument("--no-voice", action="store_true")
        p.add_argument("--voice", help="giọng VieNeu có sẵn, ví dụ \"Trúc Ly\" (xem vieneu_tts.py voices)")
        p.add_argument("--ref", help="file thu âm 5–15 s để VieNeu nhân bản giọng của bạn")
        p.add_argument("--keep-going", action="store_true", help="vẫn dựng khi có đích không tìm thấy")
        p.set_defaults(fn=fn)
    p = sub.add_parser("still")
    p.add_argument("run")
    p.add_argument("times", nargs="*")
    p.set_defaults(fn=cmd_still)
    p = sub.add_parser("render")
    p.add_argument("run")
    p.add_argument("--workers", type=int, default=6)
    p.set_defaults(fn=cmd_render)
    p = sub.add_parser("audio")
    p.add_argument("run")
    p.add_argument("--recipe", default="explainer")
    p.add_argument("--vol", type=float, default=0.10)
    p.add_argument("--sfx-vol", type=float, default=0.35)
    p.set_defaults(fn=cmd_audio)
    p = sub.add_parser("qa")
    p.add_argument("run")
    p.set_defaults(fn=cmd_qa)
    return ap


def main(argv: list[str] | None = None) -> int:
    a = build_parser().parse_args(argv)
    return a.fn(a)


if __name__ == "__main__":
    sys.exit(main())
