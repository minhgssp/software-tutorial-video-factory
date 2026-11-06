#!/usr/bin/env python3
"""Trộn giọng + nhạc + SFX cho một khung, chuẩn hoá −14 LUFS, đo khoảng cách giọng–SFX.

Dùng: python3 mix.py <run> doc|ngang [--music-db -8 --duck 11] [--sfx-lufs -31]
     (cũ, nhạc phẳng: --music-vol 0.10)

Đầu vào trong <run>/work: voice.wav (giọng thô, bắt đầu ở 0), music.wav (bgm.py hoặc chiptune.py, chạy từ giây 0, đã fade),
direction-<o>.json (offset, dur, sự kiện hình cho SFX).
Đầu ra: work/sfx-<o>.wav + sfx-<o>.json (sfx.py), work/mix-final-<o>.wav (đưa vào build.py --audio),
work/mix-<o>.json (độ to, đỉnh, khoảng cách giọng–SFX — qa.py đọc file này).

Chuỗi: giọng trễ `offset` giây, đệm tới `dur`, loudnorm −16; nhạc loudnorm −16 rồi:
  - mặc định (ducking): nhạc ở `--music-db` (−8 dB) khi giọng nghỉ / phần mở đầu cho sống động, tự hạ `--duck` dB
    (11) khi giọng nói → dưới giọng ≈ −19 dB ≈ ×0,11, khớp trần 0,08–0,11 của chuẩn video toàn cục;
  - `--music-vol` (cũ): nhạc phẳng × hệ số (0,08–0,11).
SFX đã ở mức −31 LUFS (sfx.py); cộng không chuẩn hoá, giới hạn đỉnh, rồi bù gain về −14 LUFS, đỉnh ≤ −1 dBFS.
"""
from __future__ import annotations

import argparse
import json
import subprocess
import sys
from pathlib import Path

import numpy as np

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE / "qa"))
import media  # noqa: E402

FFMPEG = media.FFMPEG
VOICE_CHAIN = "loudnorm=I=-16:TP=-2:LRA=11,aresample=48000"


def ff(*args: str) -> None:
    subprocess.run([FFMPEG, "-hide_banner", "-loglevel", "error", "-y", *args], check=True)


def read_mono(path: Path) -> np.ndarray:
    raw = subprocess.run([FFMPEG, "-hide_banner", "-loglevel", "error", "-i", str(path), "-ac", "1", "-ar", "48000",
                          "-f", "s16le", "-"], capture_output=True, check=True).stdout
    return np.frombuffer(raw, "<i2").astype(np.float64) / 32768


def duck_gain(voice: np.ndarray, n: int, music_db: float, duck: float, attack: float = 0.06, release: float = 0.3,
              look: float = 0.06, hold: float = 0.15, rate: int = 48000) -> np.ndarray:
    """Hệ số nhân cho nhạc theo giọng (sidechain, chỉ numpy). Đo RMS mỗi 10 ms, ngưỡng tương đối so với mức nói
    điển hình (bách phân vị 90), giữ `hold` giây sau mỗi tiếng, nhìn trước `look` giây, mượt attack/release."""
    hop = rate // 100
    m = (min(len(voice), n) // hop) * hop
    v = np.zeros(n // hop + 1)
    fr = voice[:m].reshape(-1, hop)
    v[: len(fr)] = 10 * np.log10(np.mean(fr ** 2, axis=1) + 1e-12)
    ref = np.percentile(v[v > -60], 90) if np.any(v > -60) else -20
    amt = np.clip((v - (ref - 30)) / 12, 0, 1)  # gối mềm: ref−30 → 0, ref−18 → 1
    h = int(hold * 100)
    amt = np.array([amt[max(0, i - h): i + 1].max() for i in range(len(amt))])  # giữ
    amt = np.concatenate([amt[int(look * 100):], np.zeros(int(look * 100))])  # nhìn trước
    a_c, r_c = np.exp(-1 / (attack * 100)), np.exp(-1 / (release * 100))
    out = np.empty_like(amt)
    y = 0.0
    for i, x in enumerate(amt):
        c = a_c if x > y else r_c
        y = c * y + (1 - c) * x
        out[i] = y
    db = music_db - duck * out
    g = 10 ** (np.interp(np.arange(n) / hop, np.arange(len(db)), db) / 20)
    return g


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("run", type=Path)
    ap.add_argument("orient", choices=["doc", "ngang"])
    ap.add_argument("--music-vol", type=float, default=None, help="cũ: nhạc phẳng, 0,08–0,11")
    ap.add_argument("--music-db", type=float, default=-8.0, help="mức nhạc khi giọng nghỉ (so với −16 LUFS)")
    ap.add_argument("--duck", type=float, default=11.0, help="hạ nhạc bao nhiêu dB khi giọng nói")
    ap.add_argument("--sfx-lufs", type=float, default=-31.0)
    ap.add_argument("--target", type=float, default=-14.0)
    a = ap.parse_args()
    if a.music_vol is not None and not 0.08 <= a.music_vol <= 0.11:
        raise SystemExit("--music-vol phải trong 0,08–0,11 (spec cổng 6)")
    under = a.music_db - a.duck
    if a.music_vol is None and not (-22.5 <= under <= -18.5 and -12 <= a.music_db <= -4):
        raise SystemExit(f"nhạc dưới giọng {under} dB ngoài −22,5…−18,5 (≈×0,08–0,11) hoặc --music-db ngoài −12…−4")
    w = a.run.resolve() / "work"
    o = a.orient
    d = json.loads((w / f"direction-{o}.json").read_text())
    offset, dur = d["offset"], d["dur"]
    for f in ("voice.wav", "music.wav"):
        if not (w / f).is_file():
            raise SystemExit(f"thiếu work/{f}")
    mdur = media.streams(w / "music.wav")["dur"]
    if mdur < dur - 0.05:
        raise SystemExit(f"music.wav dài {mdur} giây < dur {dur} — tạo lại bằng bgm.py --duration {dur}")

    r = subprocess.run([sys.executable, str(HERE / "sfx.py"), str(w / f"direction-{o}.json"), str(w / f"sfx-{o}.wav"),
                        "--events", str(w / f"sfx-{o}.json"), "--target-lufs", str(a.sfx_lufs)], capture_output=True, text=True)
    if r.returncode != 0:
        raise SystemExit(f"sfx.py lỗi:\n{r.stderr[-1500:]}")

    voice_f = f"adelay={int(offset * 1000)}:all=1,apad=whole_dur={dur},{VOICE_CHAIN}"
    music_in = w / "music.wav"
    duck_rep = {}
    if a.music_vol is None:
        tv, tm = w / f"_v-{o}.wav", w / f"_m-{o}.wav"
        ff("-i", str(w / "voice.wav"), "-af", voice_f, "-t", str(dur), "-ac", "1", "-c:a", "pcm_s16le", str(tv))
        ff("-i", str(music_in), "-af", "loudnorm=I=-16:TP=-2:LRA=11,aresample=48000", "-t", str(dur), "-ac", "1",
           "-c:a", "pcm_s16le", str(tm))
        vo, mu = read_mono(tv), read_mono(tm)
        g = duck_gain(vo, len(mu), a.music_db, a.duck)
        ducked = np.clip(mu * g, -1, 1)
        music_in = w / f"music-ducked-{o}.wav"
        import wave
        with wave.open(str(music_in), "wb") as f:
            f.setparams((1, 2, 48000, 0, "NONE", "not compressed"))
            f.writeframes((ducked * 32767).astype("<i2").tobytes())
        gdb = 20 * np.log10(g[:: 480] + 1e-12)
        duck_rep = {"music_db": a.music_db, "duck_db": a.duck, "music_under_voice_db": round(float(np.percentile(gdb, 5)), 1),
                    "music_gap_db": round(float(np.percentile(gdb, 95)), 1),
                    "music_gap_share": round(float(np.mean(gdb > a.music_db - 2)), 2), "music_in": str(music_in)}
        tv.unlink(); tm.unlink()
        music_f = "aresample=48000"
    else:
        music_f = f"loudnorm=I=-16:TP=-2:LRA=11,aresample=48000,volume={a.music_vol}"
    raw = w / f"mix-{o}.raw.wav"
    ff("-i", str(w / "voice.wav"), "-i", str(music_in), "-i", str(w / f"sfx-{o}.wav"), "-filter_complex",
       f"[0]{voice_f}[v];[1]{music_f}[m];[2]aresample=48000[s];"
       f"[v][m][s]amix=inputs=3:normalize=0:duration=first,alimiter=limit=0.89:level=false,aresample=48000",
       "-t", str(dur), "-ac", "2", "-c:a", "pcm_s16le", str(raw))
    gain = round(a.target - media.loudness(raw)["I"], 2)
    final = w / f"mix-final-{o}.wav"
    ff("-i", str(raw), "-af", f"volume={gain}dB,alimiter=limit=0.89:level=false,afade=t=out:st={dur - 1.0}:d=1.0",
       "-c:a", "pcm_s16le", str(final))
    raw.unlink()
    loud = media.loudness(final)

    # Khoảng cách giọng–SFX: RMS cửa sổ 3 giây của từng nhánh (trước khi cộng, cùng gain nên hiệu không đổi).
    v = media.stem_rms(w / "voice.wav", voice_f)
    s = media.stem_rms(w / f"sfx-{o}.wav")
    n = min(len(v), len(s))
    v, s = v[:n], s[:n]
    live = (s > -60) & (v > -45)
    gaps = (v - s)[live]
    idx = np.where(live)[0]
    gap_min = round(float(gaps.min()), 1) if len(gaps) else None
    at = [round(float(idx[int(gaps.argmin())]) * 3, 1), round(float(idx[int(gaps.argmin())]) * 3 + 3, 1)] if len(gaps) else None
    events = json.loads((w / f"sfx-{o}.json").read_text()) if (w / f"sfx-{o}.json").is_file() else []
    rep = {"orient": o, "offset": offset, "dur": dur, "music_vol": a.music_vol, **duck_rep, "sfx_lufs": a.sfx_lufs, "gain_db": gain,
           "I": loud["I"], "peak": loud["peak"], "voice_sfx_gap_min": gap_min, "voice_sfx_gap_at": at,
           "voice_sfx_gap_median": round(float(np.median(gaps)), 1) if len(gaps) else None,
           "sfx_events": len(events) if isinstance(events, list) else events.get("count"), "out": str(final)}
    (w / f"mix-{o}.json").write_text(json.dumps(rep, ensure_ascii=False, indent=1) + "\n")
    ok = loud["I"] is not None and abs(loud["I"] - a.target) <= 1 and (loud["peak"] or 0) <= -1.0 and (gap_min is None or gap_min >= 12)
    print(f"mix {o}: {'PASS' if ok else 'FAIL'}  {loud['I']} LUFS, đỉnh {loud['peak']} dBFS, gain {gain} dB, "
          f"giọng–SFX min {gap_min} dB tại {at} (trung vị {rep['voice_sfx_gap_median']}), SFX {rep['sfx_events']} sự kiện")
    if duck_rep:
        print(f"  nhạc: {duck_rep['music_gap_db']} dB khi giọng nghỉ ({int(duck_rep['music_gap_share'] * 100)}% thời lượng), "
              f"{duck_rep['music_under_voice_db']} dB dưới giọng")
    print(f"  → {final}")
    if gap_min is not None and gap_min < 12:
        print("  SFX quá to so với giọng: giảm --sfx-lufs (vd −34) hoặc bớt hiệu ứng dồn ở cửa sổ đó.")
    sys.exit(0 if ok else 1)


if __name__ == "__main__":
    main()
