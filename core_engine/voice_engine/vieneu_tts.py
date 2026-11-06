#!/usr/bin/env python3
"""Giọng đọc tiếng Việt bằng VieNeu-TTS v3 Turbo (Apache 2.0, chạy CPU, không cần torch, không tốn phí).

Ba lệnh:
  fetch                tải mô hình một lần (~610 MB) vào models/vieneu (đổi chỗ bằng KUDO_VIENEU_DIR)
  voices               liệt kê giọng có sẵn
  run RUN              tạo giọng cho một run: đọc docs/clean.txt (+ docs/performance.txt nếu có),
                       ra work/voice.wav + work/voice-receipt.json đúng hợp đồng voice_align.py
  say "lời" --out f.wav   tạo nhanh một câu (thử giọng, mascot)

Chọn giọng: --voice "<tên giọng có sẵn>" (mặc định Hải Đăng) hoặc --ref mau.wav để nhân bản giọng
của chính bạn từ 5–15 giây thu âm sạch. Chỉ nhân bản giọng của bạn hoặc người đã đồng ý.

Chạy bằng venv Python 3.12 có `vieneu`:
  .venv/vieneu/bin/python engines/voice/vieneu_tts.py fetch
  .venv/vieneu/bin/python engines/voice/vieneu_tts.py run RUN [--voice "Trúc Ly"] [--ref mau.wav] [--pace 1.05]

performance.txt (không bắt buộc) là clean.txt có thêm dấu `/` (nghỉ ngắn) hoặc `//` (nghỉ dài) sau câu.
VieNeu đóng dấu ẩn (watermark) vào âm thanh theo mặc định của thư viện; biên nhận ghi rõ điều này.
"""
from __future__ import annotations

import argparse
import functools
import hashlib
import json
import os
import re
import subprocess
import sys
import wave
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
MODEL_DIR = Path(os.environ.get("KUDO_VIENEU_DIR", ROOT / "models/vieneu"))
BACKBONE = "pnnbao-ump/VieNeu-TTS-v3-Turbo"
CODEC = "OpenMOSS-Team/MOSS-Audio-Tokenizer-Nano-ONNX"
BACKBONE_FILES = ["config.json", "denoiser.onnx", "speaker_encoder.onnx", "onnx_update/*"]
CODEC_FILES = ["moss_audio_tokenizer_decode_full.onnx", "moss_audio_tokenizer_decode_shared.data",
               "moss_audio_tokenizer_decode_step.onnx", "codec_browser_onnx_meta.json",
               "moss_audio_tokenizer_encode.onnx", "moss_audio_tokenizer_encode.data"]
DEFAULT_VOICE = "Hải Đăng"
SR = 48000
SHORT_PAUSE_MS = 120
LONG_PAUSE_MS = 280
KEEP_LEAD_MS = 60   # lặng giữ lại ở đầu mỗi câu sau khi cắt
KEEP_TAIL_MS = 90   # giữ đuôi ngân tự nhiên
SILENCE_DBFS = -40.0


def fetch() -> None:
    from huggingface_hub import snapshot_download
    # Tải vào thư mục thật (local_dir), không dùng cache HF: onnxruntime từ chối file .data
    # nằm ở thư mục blob khác với file .onnx trong cache kiểu mới.
    snapshot_download(BACKBONE, local_dir=MODEL_DIR / "backbone", allow_patterns=BACKBONE_FILES)
    snapshot_download(CODEC, local_dir=MODEL_DIR / "codec", allow_patterns=CODEC_FILES)
    print(f"OK: mô hình VieNeu ở {MODEL_DIR}")


def load():
    backbone, codec = MODEL_DIR / "backbone", MODEL_DIR / "codec"
    if not (backbone / "onnx_update/config.json").is_file() or not (codec / "codec_browser_onnx_meta.json").is_file():
        raise SystemExit(f"BLOCKED: chưa có mô hình VieNeu ở {MODEL_DIR}. Chạy: vieneu_tts.py fetch")
    os.environ.setdefault("HF_HUB_OFFLINE", "1")
    from vieneu._v3_turbo_engine import onnx_runtime_lite as lite
    # Vieneu() không chuyển codec_dir xuống engine ONNX, nên chèn vào đây.
    init = lite.OnnxV3LiteEngine.__init__

    @functools.wraps(init)
    def with_codec(self, *a, **k):
        k.setdefault("codec_dir", str(codec))
        return init(self, *a, **k)
    lite.OnnxV3LiteEngine.__init__ = with_codec
    from vieneu import Vieneu
    return Vieneu(backbone_repo=str(backbone), onnx_dir=str(backbone / "onnx_update"), backend="onnx")


def plan_spans(performance: str, clean: str) -> list[dict]:
    """Chia lời thành câu; `/` và `//` sau câu thành khoảng nghỉ. Lời ghép lại phải trùng clean.txt."""
    text = performance.replace("…", " ")   # VieNeu coi … là hết câu
    spans: list[dict] = []
    pending = ""
    for token in re.split(r"(//|/)", text):
        if token in ("/", "//"):
            if spans and not pending.strip():
                spans[-1]["pause_after_ms"] = max(spans[-1]["pause_after_ms"], LONG_PAUSE_MS if token == "//" else SHORT_PAUSE_MS)
            pending += " "
            continue
        pending += token
        *done, pending = re.split(r"(?<=[.!?])\s+", " ".join(pending.split())) or [""]
        if pending and re.search(r"[.!?]$", pending):
            done.append(pending)
            pending = ""
        spans += [{"text": s, "pause_after_ms": SHORT_PAUSE_MS} for s in done if s]
    if pending.strip():
        spans.append({"text": " ".join(pending.split()), "pause_after_ms": 0})
    if not spans:
        raise SystemExit("SCRIPT_EMPTY: clean.txt rỗng")
    spans[-1]["pause_after_ms"] = 0
    if " ".join(s["text"] for s in spans) != " ".join(clean.split()):
        raise SystemExit("SCRIPT_MISMATCH: performance.txt bỏ dấu / // phải trùng clean.txt đã duyệt")
    return spans


def trim(audio, rate: int):
    """Cắt lặng thừa hai đầu (cửa sổ RMS 10 ms dưới -40 dBFS), giữ lại một chút cho tự nhiên."""
    import numpy as np
    hop = rate // 100
    frames = audio[: len(audio) // hop * hop].reshape(-1, hop)
    loud = np.flatnonzero(20 * np.log10(np.sqrt((frames ** 2).mean(axis=1)) + 1e-9) > SILENCE_DBFS)
    if not len(loud):
        raise SystemExit("SPAN_SILENT: VieNeu trả về câu im lặng")
    start = max(0, loud[0] * hop - rate * KEEP_LEAD_MS // 1000)
    end = min(len(audio), (loud[-1] + 1) * hop + rate * KEEP_TAIL_MS // 1000)
    return audio[start:end]


def write_wav(path: Path, audio, rate: int) -> None:
    import numpy as np
    pcm = (np.clip(audio, -1, 1) * 32767).astype("<i2")
    with wave.open(str(path), "wb") as out:
        out.setparams((1, 2, rate, 0, "NONE", "not compressed"))
        out.writeframes(pcm.tobytes())


def speak(tts, text: str, voice: str | None, ref: Path | None):
    import numpy as np
    if ref:
        return np.asarray(tts.infer(text, ref_audio=str(ref)), dtype=np.float32)
    return np.asarray(tts.infer(text, voice=tts.get_preset_voice(voice or DEFAULT_VOICE)), dtype=np.float32)


def stretch(audio, pace: float):
    """Đổi tốc độ đọc giữ cao độ (ffmpeg atempo). pace > 1 là nhanh hơn."""
    import numpy as np
    if abs(pace - 1) < 1e-3:
        return audio
    r = subprocess.run(["ffmpeg", "-v", "error", "-f", "f32le", "-ar", str(SR), "-ac", "1", "-i", "pipe:0",
                        "-filter:a", f"atempo={pace}", "-f", "f32le", "pipe:1"], input=audio.tobytes(), capture_output=True)
    if r.returncode:
        raise SystemExit("ffmpeg atempo lỗi: " + r.stderr.decode()[-300:])
    return np.frombuffer(r.stdout, dtype=np.float32)


def run(args) -> None:
    import numpy as np
    run_dir = args.run.resolve()
    clean = (run_dir / "docs/clean.txt").read_text(encoding="utf-8")
    perf_path = run_dir / "docs/performance.txt"
    spans = plan_spans(perf_path.read_text(encoding="utf-8") if perf_path.is_file() else clean, clean)
    tts = load()
    pieces, cursor = [], 0
    for i, span in enumerate(spans):
        audio = stretch(trim(speak(tts, span["text"], args.voice, args.ref), SR), args.pace)
        span.update(start_frame=cursor, end_frame=cursor + len(audio),
                    start_ms=round(cursor * 1000 / SR), end_ms=round((cursor + len(audio)) * 1000 / SR),
                    duration_sec=round(len(audio) / SR, 3))
        pieces.append(audio)
        cursor += len(audio)
        if span["pause_after_ms"]:
            gap = np.zeros(SR * span["pause_after_ms"] // 1000, dtype=np.float32)
            pieces.append(gap)
            cursor += len(gap)
        print(f"Giọng {i + 1}/{len(spans)}: {span['duration_sec']:.2f}s", file=sys.stderr, flush=True)
    work = run_dir / "work"
    work.mkdir(exist_ok=True)
    wav = work / "voice.wav"
    write_wav(wav, np.concatenate(pieces), SR)
    from importlib.metadata import version
    receipt = {
        "engine": f"vieneu {version('vieneu')}", "model": BACKBONE, "codec": CODEC, "license": "Apache-2.0",
        "watermark": "có (mặc định của VieNeu, không nghe thấy)",
        "voice": None if args.ref else (args.voice or DEFAULT_VOICE),
        "reference": {"path": str(args.ref), "sha256": hashlib.sha256(args.ref.read_bytes()).hexdigest()} if args.ref else None,
        "settings": {"style": "tu_nhien", "pace_factor": args.pace, "sample_rate": SR},
        "audio_sha256": hashlib.sha256(wav.read_bytes()).hexdigest(),
        "duration_sec": round(cursor / SR, 3), "spans": spans,
    }
    (work / "voice-receipt.json").write_text(json.dumps(receipt, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(json.dumps({k: receipt[k] for k in ("voice", "duration_sec", "audio_sha256")} | {"spans": len(spans)}, ensure_ascii=False))


def main(argv=None) -> None:
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    sub = ap.add_subparsers(dest="cmd", required=True)
    sub.add_parser("fetch")
    sub.add_parser("voices")
    r = sub.add_parser("run")
    r.add_argument("run", type=Path)
    s = sub.add_parser("say")
    s.add_argument("text")
    s.add_argument("--out", type=Path, required=True)
    for p in (r, s):
        p.add_argument("--voice", help=f"tên giọng có sẵn (mặc định {DEFAULT_VOICE})")
        p.add_argument("--ref", type=Path, help="file thu âm 5–15 s để nhân bản giọng của bạn")
        p.add_argument("--pace", type=float, default=1.0, help="tốc độ đọc, 1.05 = nhanh hơn 5%%")
    a = ap.parse_args(argv)
    if a.cmd == "fetch":
        return fetch()
    if a.cmd == "voices":
        for label, _ in load().list_preset_voices():
            print(label)
        return
    if a.ref and not a.ref.is_file():
        raise SystemExit(f"không thấy file giọng mẫu: {a.ref}")
    if a.cmd == "run":
        return run(a)
    a.out.parent.mkdir(parents=True, exist_ok=True)
    write_wav(a.out, stretch(speak(load(), a.text, a.voice, a.ref), a.pace), SR)
    print(f"OK: {a.out}")


if __name__ == "__main__":
    main()
