#!/usr/bin/env python3
"""Căn mốc từng từ cho giọng đã tạo, đối chiếu với lời đã duyệt (clean.txt).

Dùng:
  {{KUDO_HOME}}/.venv/faster-whisper-py312/bin/python voice_align.py RUN
Đọc docs/clean.txt, work/voice.wav, work/voice-receipt.json.
Ghi work/voice_timeline.json (tpr.voice_timeline.v2) và work/alignment-report.json;
có từ phải nội suy hoặc lệch câu thì ghi thêm ALIGN_REVIEW.md ở gốc run.

Chữ hiển thị luôn lấy từ clean.txt. Mốc thời gian lấy từ ASR; từ ASR nghe sai vẫn
nhận mốc nếu khớp vị trí một-một. Từ ASR bỏ sót thì chia đều trong khoảng trống giữa
hai từ đã có mốc, nằm gọn trong span câu của nó, và được đánh dấu confidence 0.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import sys
import unicodedata
import wave
from datetime import datetime, timezone
from difflib import SequenceMatcher
from pathlib import Path

import numpy as np

ASR_MODEL = Path("~/.cache/huggingface/hub/models--Systran--faster-whisper-medium/snapshots/08e178d48790749d25932bbc082711ddcfdfbc4f")
if not ASR_MODEL.is_dir():  # bản medium có thể đã bị dọn; dùng large-v3 đang có
    ASR_MODEL = Path("~/.cache/huggingface/hub/models--Systran--faster-whisper-large-v3/snapshots/edaa852ec7e145841d8ffdb056a99866b5f0a478")
DIGITS = ("không", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín")


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def number_words(value: int) -> str:
    if value < 10:
        return DIGITS[value]
    if value < 100:
        tens, unit = divmod(value, 10)
        head = "mười" if tens == 1 else DIGITS[tens] + " mươi"
        return head if not unit else f"{head} {'mốt' if unit == 1 and tens > 1 else 'lăm' if unit == 5 else DIGITS[unit]}"
    if value < 1000:
        hundreds, rest = divmod(value, 100)
        head = DIGITS[hundreds] + " trăm"
        if not rest:
            return head
        return f"{head} {'lẻ ' + DIGITS[rest] if rest < 10 else number_words(rest)}"
    return str(value)


def norm_tokens(text: str) -> list[str]:
    text = unicodedata.normalize("NFC", text).casefold()
    text = re.sub(r"\d+", lambda m: f" {number_words(int(m.group()))} ", text)
    return "".join(c if c.isalnum() or c.isspace() else " " for c in text).split()


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("run", type=Path)
    parser.add_argument("--model", type=Path, default=ASR_MODEL)
    parser.add_argument("--prompt", default="", help="tên riêng, thuật ngữ trong lời để nhận dạng đúng chính tả")
    args = parser.parse_args()
    run = args.run.resolve()
    clean = (run / "docs/clean.txt").read_text(encoding="utf-8")
    audio = run / "work/voice.wav"
    receipt = json.loads((run / "work/voice-receipt.json").read_text())
    if receipt["audio_sha256"] != sha256(audio):
        raise SystemExit("VOICE_STALE: receipt không khớp voice.wav")

    # Từ hiển thị theo clean.txt, gắn chỉ số span (câu) để chặn mốc vượt câu.
    display: list[dict] = []
    for span_index, span in enumerate(receipt["spans"]):
        for token in span["text"].split():
            parts = norm_tokens(token)
            if len(parts) != 1:
                raise SystemExit(f"TOKEN_SHAPE: '{token}' cần đúng một âm tiết")
            display.append({"text": token, "norm": parts[0], "span": span_index})
    if " ".join(d["text"] for d in display) != " ".join(clean.split()):
        raise SystemExit("SCRIPT_MISMATCH")

    os.environ["HF_HUB_OFFLINE"] = "1"
    from faster_whisper import WhisperModel
    from importlib.metadata import version
    model = WhisperModel(str(args.model), device="cpu", compute_type="int8", local_files_only=True, cpu_threads=4)
    # Nhận dạng theo từng câu đã biết (clip_timestamps) để Whisper không "ảo" xuyên qua đoạn dài.
    clips = [x for s in receipt["spans"] for x in (s["start_ms"] / 1000, s["end_ms"] / 1000)]
    segments, info = model.transcribe(str(audio), language="vi", beam_size=5, vad_filter=False,
                                      condition_on_previous_text=False, word_timestamps=True,
                                      initial_prompt=args.prompt or None, clip_timestamps=clips)
    observed: list[dict] = []
    for segment in segments:
        for word in segment.words or []:
            for part in norm_tokens(word.word):
                observed.append({"norm": part, "start": word.start, "end": word.end, "p": float(word.probability), "raw": word.word.strip()})
        print(f"ASR {segment.end:.1f}s", file=sys.stderr, flush=True)
    # Một từ ASR tách thành nhiều âm tiết (vd "300" -> ba trăm) thì chia đều thời gian của nó.
    grouped: dict[tuple, list[int]] = {}
    for i, o in enumerate(observed):
        grouped.setdefault((o["start"], o["end"], o["raw"]), []).append(i)
    for idx in grouped.values():
        if len(idx) > 1:
            s, e = observed[idx[0]]["start"], observed[idx[0]]["end"]
            for k, i in enumerate(idx):
                observed[i]["start"] = s + (e - s) * k / len(idx)
                observed[i]["end"] = s + (e - s) * (k + 1) / len(idx)

    expected = [d["norm"] for d in display]
    got = [o["norm"] for o in observed]
    timing: list[dict | None] = [None] * len(display)
    mismatches = []
    for tag, a0, a1, b0, b1 in SequenceMatcher(None, expected, got, autojunk=False).get_opcodes():
        if tag == "equal" or (tag == "replace" and a1 - a0 == b1 - b0):
            for k in range(a1 - a0):
                o = observed[b0 + k]
                timing[a0 + k] = {"start": o["start"], "end": o["end"], "p": o["p"] if tag == "equal" else min(o["p"], 0.5)}
            if tag == "replace":
                mismatches.append({"kind": "heard_differently", "script": " ".join(d["text"] for d in display[a0:a1]), "asr": " ".join(o["raw"] for o in observed[b0:b1])})
        else:
            mismatches.append({"kind": tag, "script": " ".join(d["text"] for d in display[a0:a1]), "asr": " ".join(o["raw"] for o in observed[b0:b1])})

    spans = receipt["spans"]
    # Ép mốc vào trong span câu; từ lọt ra ngoài span coi như chưa có mốc.
    for i, d in enumerate(display):
        t = timing[i]
        lo, hi = spans[d["span"]]["start_ms"] / 1000, spans[d["span"]]["end_ms"] / 1000
        if t and (t["end"] < lo - 0.05 or t["start"] > hi + 0.05):
            mismatches.append({"kind": "outside_sentence", "script": d["text"], "asr_time": [round(t["start"], 2), round(t["end"], 2)]})
            timing[i] = None
        elif t:
            t["start"], t["end"] = max(t["start"], lo), min(t["end"], hi)
    interpolated = []
    i = 0
    while i < len(display):
        if timing[i] is not None:
            i += 1
            continue
        j = i
        while j < len(display) and timing[j] is None and display[j]["span"] == display[i]["span"]:
            j += 1
        span = spans[display[i]["span"]]
        left = timing[i - 1]["end"] if i > 0 and timing[i - 1] and display[i - 1]["span"] == display[i]["span"] else span["start_ms"] / 1000
        right = timing[j]["start"] if j < len(display) and timing[j] and display[j]["span"] == display[i]["span"] else span["end_ms"] / 1000
        weights = [len(display[k]["norm"]) + 1 for k in range(i, j)]
        cursor = left
        for k, w in zip(range(i, j), weights):
            step = (right - left) * w / sum(weights)
            timing[k] = {"start": cursor, "end": cursor + step, "p": 0.0}
            interpolated.append(display[k]["text"])
            cursor += step
        i = j

    duration_ms = round(receipt["duration_sec"] * 1000)
    words, prev_end = [], 0
    for i, (d, t) in enumerate(zip(display, timing)):
        start = max(prev_end, round(t["start"] * 1000))
        end = max(start + 20, round(t["end"] * 1000))
        end = min(end, duration_ms)
        words.append({"word_id": f"W{i + 1:03d}", "text": d["text"], "start_ms": start, "end_ms": end, "confidence": round(t["p"], 4)})
        prev_end = end

    with wave.open(str(audio), "rb") as stream:
        rate = stream.getframerate()
        samples = np.frombuffer(stream.readframes(stream.getnframes()), dtype="<i2").astype(np.float64) / 32768.0
    rms = [float(np.sqrt(np.mean(samples[s["start_frame"]:s["end_frame"]] ** 2))) for s in spans]
    peak = max(rms)
    prosody = []
    for k, s in enumerate(spans):
        span_words = [w for w, d in zip(words, display) if d["span"] == k]
        seconds = (s["end_ms"] - s["start_ms"]) / 1000
        prosody.append({"segment_id": f"S{k + 1:02d}", "time_range": {"start_ms": s["start_ms"], "end_ms": s["end_ms"]},
                        "energy": round(rms[k] / peak, 4), "speaking_rate_wpm": round(len(span_words) / seconds * 60, 1),
                        "delivery": receipt["settings"]["style"], "pause_after_ms": s["pause_after_ms"], "method": "rms_per_span",
                        "confidence": 1.0})

    timeline = {
        "schema": "tpr.voice_timeline.v2", "revision": 1, "run_id": run.name,
        "created_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "audio": {"provider": "provided_audio", "path": "work/voice.wav", "sha256": receipt["audio_sha256"], "duration_ms": duration_ms, "language": "vi"},
        "transcript_status": "approved", "transcript_text": " ".join(clean.split()), "words": words, "prosody_segments": prosody,
        "word_timing_provenance": {"method": "asr_word_timestamps", "engine": f"faster-whisper {version('faster-whisper')}", "model": args.model.name, "audio_sha256": receipt["audio_sha256"]},
    }
    (run / "work/voice_timeline.json").write_text(json.dumps(timeline, ensure_ascii=False, indent=1) + "\n")
    report = {"word_count": len(words), "asr_tokens": len(got), "interpolated_words": interpolated, "mismatches": mismatches,
              "low_confidence": sum(w["confidence"] < 0.5 for w in words), "transcript_asr": " ".join(o["raw"] for o in observed)}
    (run / "work/alignment-report.json").write_text(json.dumps(report, ensure_ascii=False, indent=1) + "\n")
    review = run / "ALIGN_REVIEW.md"
    if interpolated or any(m["kind"] != "heard_differently" for m in mismatches):
        lines = ["# Căn mốc cần xem lại", "", f"- Từ phải chia đều thời gian (không có mốc ASR): {len(interpolated)}/{len(words)}", "", "| Loại | Lời đã duyệt | ASR nghe |", "|---|---|---|"]
        lines += [f"| {m['kind']} | {m.get('script', '')} | {m.get('asr', m.get('asr_time', ''))} |" for m in mismatches]
        review.write_text("\n".join(lines) + "\n")
    elif review.exists():
        review.unlink()
    print(json.dumps({k: v for k, v in report.items() if k != "transcript_asr"}, ensure_ascii=False, indent=1))


if __name__ == "__main__":
    main()
