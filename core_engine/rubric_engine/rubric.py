#!/usr/bin/env python3
"""Cổng chấm video Kudo theo rubric chuyển động 7 trục (xem RUBRIC-MOTION.md, ADR-016).

    python3 engines/rubric/rubric.py prep VIDEO.mp4 -o DIR [--voice] [--expect-dur 15.1]
    python3 engines/rubric/rubric.py gate DIR/review-1.json --spec DIR/spec.json --round 1 [--threshold 7]

`prep` dựng tư liệu cho giám khảo (bảng khung hình, khung mốc, spec.json đo bằng ffprobe/ffmpeg) và điền
`jury-prompt.md`. `gate` đọc JSON điểm của giám khảo, cộng lỗi chuẩn trong spec.json, ra PASS / REPAIR / STUCK.
Vòng sửa tối đa 2: `--round 3` mà vẫn trượt thì ghi STUCK.md. Chỉ dùng thư viện chuẩn và ffmpeg.
Mã thoát: 0 PASS, 1 REPAIR hoặc STUCK hoặc spec trượt, 2 đầu vào hỏng hoặc thiếu công cụ.
"""

from __future__ import annotations

import argparse
import json
import re
import shutil
import subprocess
import sys
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

HERE = Path(__file__).resolve().parent
AXES = ("style_fidelity", "concept_wow", "motion_craft", "design_typography", "finish_texture", "sound_sync",
        "technical")
SPEC = {"width": 1080, "height": 1920, "fps": "30/1", "lufs_voice": -14.0, "lufs_tol": 1.0, "tp_max": -1.0,
        "dur_tol": 0.05}
MAX_ROUNDS = 2          # số vòng sửa tối đa
FREEZE_WARN = 2.5       # đứng hình dài hơn (giây) thì cảnh báo, không chặn: video giải thích có chỗ dừng chủ ý


# --- Phần thuần (có test) ----------------------------------------------------------------
def spec_errors(probe: dict, loud: dict, black: list, voice: bool, expect_dur: float | None) -> list[str]:
    """Lỗi chuẩn Kudo từ số đo máy. `loud` = {lufs, true_peak} hoặc rỗng nếu không có tiếng."""
    errs = []
    v = next((s for s in probe["streams"] if s["codec_type"] == "video"), None)
    if v is None:
        return ["không có luồng hình"]
    if (v["width"], v["height"]) != (SPEC["width"], SPEC["height"]):
        errs.append(f"khung {v['width']}x{v['height']}, cần {SPEC['width']}x{SPEC['height']}")
    if v["r_frame_rate"] != SPEC["fps"] or v.get("avg_frame_rate") != SPEC["fps"]:
        errs.append(f"tốc độ khung {v['r_frame_rate']}/{v.get('avg_frame_rate')}, cần {SPEC['fps']} đều")
    dur = float(probe["format"]["duration"])
    if expect_dur is not None and abs(dur - expect_dur) > SPEC["dur_tol"]:
        errs.append(f"dài {dur:.3f} s, brief {expect_dur:.3f} s")
    if not any(s["codec_type"] == "audio" for s in probe["streams"]):
        errs.append("không có tiếng")
    elif loud:
        if loud["true_peak"] > SPEC["tp_max"]:
            errs.append(f"true peak {loud['true_peak']:.2f} dBTP > {SPEC['tp_max']}")
        if voice and abs(loud["lufs"] - SPEC["lufs_voice"]) > SPEC["lufs_tol"]:
            errs.append(f"có giọng mà {loud['lufs']:.2f} LUFS, cần {SPEC['lufs_voice']} ±{SPEC['lufs_tol']}")
    for a, b in black:
        errs.append(f"khung đen {a:.2f}–{b:.2f} s")
    return errs


def parse_detect(stderr: str, kind: str) -> list[tuple[float, float]]:
    """Đọc khoảng thời gian từ blackdetect (black_start/black_end) hoặc freezedetect (freeze_start/freeze_end)."""
    if kind == "black":
        return [(float(a), float(b)) for a, b in re.findall(r"black_start:([\d.]+) black_end:([\d.]+)", stderr)]
    starts = [float(x) for x in re.findall(r"freeze_start: ([\d.]+)", stderr)]
    ends = [float(x) for x in re.findall(r"freeze_end: ([\d.]+)", stderr)]
    return list(zip(starts, ends))


def parse_ebur128(stderr: str) -> dict:
    i = re.search(r"Integrated loudness:\s+I:\s+(-?[\d.]+|-inf) LUFS", stderr)
    p = re.search(r"True peak:\s+Peak:\s+(-?[\d.]+|-inf) dBFS", stderr)
    if not i or not p:
        return {}
    f = lambda s: float("-inf") if s == "-inf" else float(s)  # noqa: E731
    return {"lufs": f(i.group(1)), "true_peak": f(p.group(1))}


def extract_json(text: str) -> dict:
    """Lấy khối JSON đầu tiên trong câu trả lời của giám khảo (có thể nằm trong ```json)."""
    m = re.search(r"```(?:json)?\s*(\{.*?\})\s*```", text, re.S)
    raw = m.group(1) if m else text[text.find("{"): text.rfind("}") + 1]
    return json.loads(raw)


def check_review(r: dict) -> list[str]:
    """Lỗi hình dạng của JSON chấm (rỗng = hợp lệ)."""
    errs = []
    scores = r.get("scores", {})
    for ax in AXES:
        s = scores.get(ax)
        if not isinstance(s, (int, float)) or not 1 <= s <= 10:
            errs.append(f"thiếu hoặc sai điểm {ax}")
    fixes = r.get("fixes", [])
    if not 5 <= len(fixes) <= 10:
        errs.append(f"cần 5–10 việc sửa, có {len(fixes)}")
    for i, f in enumerate(fixes):
        miss = [k for k in ("timecode", "problem", "why", "how") if not str(f.get(k, "")).strip()]
        if miss:
            errs.append(f"fixes[{i}] thiếu {', '.join(miss)}")
    if not isinstance(r.get("critical", []), list):
        errs.append("critical phải là danh sách")
    return errs


def decide(r: dict, spec_errs: list[str], rnd: int, threshold: float = 7.0) -> dict:
    """PASS khi không lỗi nghiêm trọng, không lỗi chuẩn, mọi trục ≥ ngưỡng. Trượt sau vòng sửa cuối = STUCK."""
    low = {ax: r["scores"][ax] for ax in AXES if r["scores"][ax] < threshold}
    critical = list(r.get("critical", [])) + [f"chuẩn: {e}" for e in spec_errs]
    ok = not low and not critical
    if ok:
        v = "PASS"
    elif rnd > MAX_ROUNDS:
        v = "STUCK"
    else:
        v = "REPAIR"
    return {"round": rnd, "verdict": v, "threshold": threshold, "below": low, "critical": critical,
            "mean": round(sum(r["scores"][ax] for ax in AXES) / len(AXES), 2), "min": min(r["scores"].values())}


# --- Phần chạy ffmpeg --------------------------------------------------------------------
def _run(cmd: list[str]) -> subprocess.CompletedProcess:
    return subprocess.run(cmd, capture_output=True, text=True)


def cmd_prep(a) -> int:
    if not shutil.which("ffmpeg"):
        print("thiếu ffmpeg", file=sys.stderr)
        return 2
    out = Path(a.out)
    (out / "frames").mkdir(parents=True, exist_ok=True)
    probe = json.loads(_run(["ffprobe", "-v", "error", "-show_streams", "-show_format", "-of", "json", a.video]).stdout)
    dur = float(probe["format"]["duration"])
    cols = 8
    rows = max(1, -(-int(dur * 2) // cols))
    _run(["ffmpeg", "-y", "-v", "error", "-i", a.video, "-vf",
          f"fps=2,scale=216:-1,drawtext=text='%{{pts\\:hms}}':x=4:y=4:fontsize=18:fontcolor=white:box=1:boxcolor=black@0.6,"
          f"tile={cols}x{rows}:padding=4:color=gray", "-frames:v", "1", str(out / "contact.jpg")])
    if not (out / "contact.jpg").exists():   # ffmpeg không có drawtext: bỏ mốc giờ trên ô
        _run(["ffmpeg", "-y", "-v", "error", "-i", a.video, "-vf",
              f"fps=2,scale=216:-1,tile={cols}x{rows}:padding=4:color=gray", "-frames:v", "1", str(out / "contact.jpg")])
    times = [round(dur * k / 6 + 0.25, 2) for k in range(6)]
    # các lượt ffmpeg dưới đây độc lập nhau: chạy cùng lúc
    with ThreadPoolExecutor(len(times) + 2) as ex:
        loud_f = ex.submit(_run, ["ffmpeg", "-nostats", "-i", a.video, "-vn", "-af", "ebur128=peak=true", "-f", "null", "-"])
        det_f = ex.submit(_run, ["ffmpeg", "-nostats", "-i", a.video, "-an", "-vf",
                                 "blackdetect=d=0.1:pic_th=0.98,freezedetect=n=0.001:d=" + str(FREEZE_WARN), "-f", "null", "-"])
        list(ex.map(lambda t: _run(["ffmpeg", "-y", "-v", "error", "-ss", str(t), "-i", a.video, "-frames:v", "1",
                                    str(out / "frames" / f"t{t:05.2f}.png")]), times))
        loud, det = parse_ebur128(loud_f.result().stderr), det_f.result().stderr
    black, freeze = parse_detect(det, "black"), parse_detect(det, "freeze")
    errs = spec_errors(probe, loud, black, a.voice, a.expect_dur)
    v = next(s for s in probe["streams"] if s["codec_type"] == "video")
    spec = {"video": str(Path(a.video).resolve()), "duration": dur, "width": v["width"], "height": v["height"],
            "r_frame_rate": v["r_frame_rate"], "avg_frame_rate": v.get("avg_frame_rate"),
            "audio": any(s["codec_type"] == "audio" for s in probe["streams"]), "loudness": loud, "voice": a.voice,
            "black": black, "freeze_warn": freeze, "frames": times, "errors": errs}
    (out / "spec.json").write_text(json.dumps(spec, ensure_ascii=False, indent=2))
    tmpl = (HERE / "RUBRIC-MOTION.md").read_text()
    prompt = tmpl.split("```text\n", 1)[1].split("```", 1)[0]
    prompt = prompt.replace("Video: <đường dẫn>.", f"Video: {spec['video']}.").replace("<thư mục rubric>", str(out.resolve()))
    if a.brief:
        prompt = prompt.replace("<dán brief hoặc ít nhất phong cách, khung hình, khoảnh khắc chính>",
                                Path(a.brief).read_text().strip())
    (out / "jury-prompt.md").write_text(prompt)
    print(json.dumps({"spec_errors": errs, "loudness": loud, "freeze_warn": freeze, "dir": str(out)}, ensure_ascii=False))
    return 1 if errs else 0


def cmd_gate(a) -> int:
    try:
        text = Path(a.review).read_text()
        r = extract_json(text)
    except (OSError, ValueError) as e:
        print(f"không đọc được JSON chấm: {e}", file=sys.stderr)
        return 2
    bad = check_review(r)
    if bad:
        print("JSON chấm sai hình dạng: " + "; ".join(bad), file=sys.stderr)
        return 2
    spec_errs = json.loads(Path(a.spec).read_text())["errors"] if a.spec else []
    d = decide(r, spec_errs, a.round, a.threshold)
    rp = Path(a.review)
    (rp.parent / f"gate-{a.round}.json").write_text(json.dumps(d, ensure_ascii=False, indent=2))
    if d["verdict"] == "STUCK":
        (rp.parent / "STUCK.md").write_text(
            f"# STUCK sau {MAX_ROUNDS} vòng sửa\n\nTrục dưới ngưỡng {a.threshold}: {d['below']}\n\n"
            "Lỗi nghiêm trọng còn lại:\n" + "\n".join(f"- {c}" for c in d["critical"]) +
            "\n\nCần người quyết: hạ phạm vi, đổi engine hoặc nhận bản hiện tại kèm rủi ro.\n")
    print(json.dumps(d, ensure_ascii=False))
    return 0 if d["verdict"] == "PASS" else 1


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    sub = ap.add_subparsers(dest="cmd", required=True)
    p = sub.add_parser("prep")
    p.add_argument("video")
    p.add_argument("-o", "--out", required=True)
    p.add_argument("--voice", action="store_true", help="video có giọng: cổng −14 LUFS ±1")
    p.add_argument("--expect-dur", type=float)
    p.add_argument("--brief", help="file brief điền vào prompt giám khảo")
    g = sub.add_parser("gate")
    g.add_argument("review")
    g.add_argument("--spec")
    g.add_argument("--round", type=int, default=1, help="1 = bản đầu, 2 = sau sửa lần 1, 3 = sau sửa lần 2")
    g.add_argument("--threshold", type=float, default=7.0)
    a = ap.parse_args(argv)
    return cmd_prep(a) if a.cmd == "prep" else cmd_gate(a)


if __name__ == "__main__":
    sys.exit(main())
