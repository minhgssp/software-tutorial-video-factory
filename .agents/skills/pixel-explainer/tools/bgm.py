#!/usr/bin/env python3
"""Nhạc nền tự tổng hợp cho mọi style video Kudo (giấy phép: tự làm, không mẫu ngoài, chạy offline, miễn phí).

Dùng:
  python3 bgm.py OUT.wav --duration 95 --style chiptune --sections 0:lift,20:drive,60:calm,70:drive,88:outro

Style (chọn theo hình, xem references/MUSIC.md):
  chiptune  sóng vuông/tam giác 8-bit + trống noise          → pixel-explainer (Kudo pixel)
  synthpop  bass sine, hợp âm saw mềm, kick + clap, sáng sủa  → flat / vector / motion graphics
  lofi      hợp âm 7 ấm, kick mềm, hi-hat swing, nhiễu đĩa than → tâm sự, chữa lành, chậm
  (style điện ảnh/ambient: dùng vector-cinema/tools/audio/score.py — đã có máy soạn riêng)

Đoạn (sections, mỗi đoạn một mức năng lượng):
  calm   bass + hợp âm thưa + kick nhẹ phách 1        (giải thích kỹ, lời dày)
  lift   thêm snare/clap 2–4, hi-hat, arpeggio       (vào việc, liệt kê)
  drive  đủ trống, arpeggio 1/16, giai điệu hook     (cao trào, danh sách nhanh, kết quả)
  break  chỉ pad + hi-hat (khoảng lặng trước cú chốt)
  outro  hợp âm ngân rồi tắt dần

Hook âm thanh ở 0 giây (luôn có, tắt bằng --no-hit): kick + crash + hợp âm stab đúng khung đầu, để video "mở ra"
ngay khi người lướt dừng lại; trước mỗi đoạn drive có riser 1 ô nhịp. Fade-out --fade giây cuối.
Âm lượng cuối do mix.py quyết định (ducking theo giọng).
"""
from __future__ import annotations

import argparse
import wave
from pathlib import Path

import numpy as np

RATE = 48000
STYLES = {
    #            bpm  hợp âm (gốc midi, quãng)                                                     swing
    "chiptune": (112, [(57, (0, 3, 7)), (53, (0, 4, 7)), (48, (0, 4, 7)), (55, (0, 4, 7))], 0.0),
    "synthpop": (108, [(48, (0, 4, 7)), (55, (0, 4, 7)), (57, (0, 3, 7)), (53, (0, 4, 7))], 0.0),
    "lofi": (84, [(50, (0, 3, 7, 10)), (55, (0, 4, 7, 10)), (48, (0, 4, 7, 11)), (57, (0, 3, 7, 10))], 0.12),
}
ENERGY = {"calm": 1, "lift": 2, "drive": 3, "break": 0, "outro": -1}


def hz(m: float) -> float:
    return 440.0 * 2 ** ((m - 69) / 12)


def ph(f: float, n: int) -> np.ndarray:
    return (np.arange(n) * f / RATE) % 1.0


def osc(kind: str, f: float, n: int) -> np.ndarray:
    p = ph(f, n)
    if kind == "sq":
        return np.where(p < 0.5, 1.0, -1.0)
    if kind == "pulse":
        return np.where(p < 0.25, 1.0, -1.0)
    if kind == "tri":
        return 4 * np.abs(p - 0.5) - 1
    if kind == "saw":  # hai saw lệch nhẹ cho dày
        return (2 * p - 1) * 0.5 + (2 * ph(f * 1.006, n) - 1) * 0.5
    return np.sin(2 * np.pi * p)


def env(n: int, a: float = 0.004, r: float = 0.08, decay: float | None = None) -> np.ndarray:
    e = np.ones(n)
    ai = max(1, min(n, int(a * RATE)))
    e[:ai] = np.linspace(0, 1, ai)
    if decay:
        e *= np.exp(-np.arange(n) / RATE / decay)
    ri = max(1, min(n - ai, int(r * RATE))) if n > ai else 0
    if ri:
        e[-ri:] *= np.linspace(1, 0, ri)
    return e


def band(x: np.ndarray, lo: float = 0.0, hi: float = 20000.0) -> np.ndarray:
    """Lọc dải bằng FFT, sườn mềm 1 quãng tám (không cần scipy)."""
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / RATE)
    g = np.ones_like(f)
    if lo > 0:
        g *= np.clip(np.log2(np.maximum(f, 1) / lo) + 1, 0, 1)
    if hi < RATE / 2:
        g *= np.clip(1 - np.log2(np.maximum(f, 1) / hi), 0, 1)
    return np.fft.irfft(X * g, len(x))


def add(buf: np.ndarray, at: float, sig: np.ndarray, gain: float = 1.0) -> None:
    s = int(at * RATE)
    if s >= len(buf):
        return
    m = min(len(sig), len(buf) - s)
    buf[s:s + m] += sig[:m] * gain


rng = np.random.default_rng(11)


def kick(soft: bool = False) -> np.ndarray:
    n = int(0.32 * RATE)
    t = np.arange(n) / RATE
    f = 45 + 110 * np.exp(-t / 0.035)
    x = np.sin(2 * np.pi * np.cumsum(f) / RATE) * np.exp(-t / (0.14 if soft else 0.2))
    x[: int(0.003 * RATE)] += rng.uniform(-0.6, 0.6, int(0.003 * RATE)) * (0 if soft else 1)
    return x


def snare(clap: bool = False) -> np.ndarray:
    n = int(0.22 * RATE)
    t = np.arange(n) / RATE
    noise = band(rng.uniform(-1, 1, n), 900, 9000)
    if clap:  # ba nhát noise sát nhau
        e = sum(np.exp(-np.maximum(t - d, 0) / 0.012) * (t >= d) for d in (0, 0.011, 0.022)) * 0.6 + np.exp(-t / 0.09) * 0.5
        return noise * e
    return noise * np.exp(-t / 0.07) * 0.8 + np.sin(2 * np.pi * 190 * t) * np.exp(-t / 0.05) * 0.5


def hat(open_: bool = False) -> np.ndarray:
    n = int((0.18 if open_ else 0.045) * RATE)
    return band(rng.uniform(-1, 1, n), 6000) * np.exp(-np.arange(n) / RATE / (0.06 if open_ else 0.012))


def crash() -> np.ndarray:
    n = int(1.6 * RATE)
    return band(rng.uniform(-1, 1, n), 3500) * np.exp(-np.arange(n) / RATE / 0.45)


def riser(dur: float) -> np.ndarray:
    n = int(dur * RATE)
    t = np.linspace(0, 1, n)
    x = band(rng.uniform(-1, 1, n), 1500, 9000) * t ** 2
    return x + np.sin(2 * np.pi * np.cumsum(200 + 900 * t ** 2) / RATE) * t ** 3 * 0.25


def section_at(t: float, secs: list[tuple[float, str]]) -> str:
    name = secs[0][1]
    for s0, k in secs:
        if t >= s0:
            name = k
    return name


def motif(shape_len: int, seed: int) -> list[int]:
    """Giai điệu hook 8 nốt (chỉ số âm trong hợp âm, -1 = nghỉ), lặp mỗi ô nhịp — dễ nhớ vì lặp lại."""
    r = np.random.default_rng(seed)
    m = [int(r.integers(0, shape_len)) for _ in range(8)]
    m[3], m[7] = -1, int(r.integers(0, shape_len))
    return m


def render(style: str, dur: float, secs: list[tuple[float, str]], hit: bool, seed: int) -> np.ndarray:
    bpm, chords, swing = STYLES[style]
    beat = 60 / bpm
    s16 = beat / 4
    total = int(dur * RATE)
    L = {k: np.zeros(total) for k in ("kick", "snare", "hat", "bass", "chord", "arp", "lead", "fx")}
    mel = motif(3, seed)
    lead_w = {"chiptune": "pulse", "synthpop": "saw", "lofi": "sin"}[style]
    arp_w = {"chiptune": "sq", "synthpop": "tri", "lofi": "tri"}[style]
    bass_w = {"chiptune": "tri", "synthpop": "sin", "lofi": "sin"}[style]
    k = 0
    while k * s16 < dur:
        t = k * s16 + (swing * s16 if k % 2 else 0)
        bar, pos = divmod(k, 16)
        root, shape = chords[bar % len(chords)]
        sec = section_at(k * s16, secs)
        e = ENERGY.get(sec, 1)
        if e < 0:  # outro: hợp âm ngân mỗi ô nhịp
            if pos == 0:
                n = int(4 * beat * RATE)
                add(L["chord"], t, sum(osc("tri", hz(root + 12 + iv), n) for iv in shape) / len(shape) * env(n, 0.3, 1.5))
            k += 1
            continue
        # hợp âm: đầu mỗi ô nhịp (pad), synthpop/lofi thêm nhát stab phách 2,5
        if pos == 0:
            n = int(4 * beat * RATE)
            w = "saw" if style == "synthpop" else "tri"
            pad = sum(osc(w, hz(root + 12 + iv), n) for iv in shape) / len(shape)
            add(L["chord"], t, band(pad, 0, 1800 if style != "chiptune" else 3000) * env(n, 0.05, 0.6))
        # bass: móc đơn, gốc – quãng tám xen kẽ khi năng lượng ≥ 2
        if pos % 2 == 0 and e >= 1:
            n = int(s16 * 1.8 * RATE)
            note = root - 12 + (12 if e >= 2 and pos % 4 == 2 else 0)
            add(L["bass"], t, osc(bass_w, hz(note), n) * env(n, 0.004, 0.06))
        # trống
        if e >= 1 and (pos == 0 or (e >= 2 and pos == 8) or (e >= 3 and pos in (6, 10))):
            add(L["kick"], t, kick(style == "lofi"))
        if e >= 2 and pos in (4, 12):
            add(L["snare"], t, snare(clap=style == "synthpop"))
        if e >= 3 and bar % 4 == 3 and pos in (13, 14, 15):  # fill cuối mỗi 4 ô nhịp
            add(L["snare"], t, snare(), 0.55)
        if (e >= 2 and pos % 2 == 0) or (e >= 3) or (e == 0 and pos % 4 == 2):
            add(L["hat"], t, hat(open_=pos % 8 == 6 and e >= 2), 1.0 if pos % 4 == 2 else 0.6)
        # arpeggio: 1/8 khi lift, 1/16 khi drive
        if (e == 2 and pos % 2 == 0) or e >= 3:
            n = int(s16 * RATE * 0.9)
            note = root + 12 + shape[[0, 1, 2, 1][(pos // (1 if e >= 3 else 2)) % 4] % len(shape)] + (12 if e >= 3 and pos % 8 >= 4 else 0)
            add(L["arp"], t, osc(arp_w, hz(note), n) * env(n, 0.002, 0.05))
        # giai điệu hook: drive, mỗi móc đơn
        if e >= 3 and pos % 2 == 0:
            i = mel[(pos // 2) % 8]
            if i >= 0:
                n = int(s16 * 2 * RATE * 0.85)
                add(L["lead"], t, osc(lead_w, hz(root + 24 + shape[i % len(shape)]), n) * env(n, 0.004, 0.08))
        k += 1
    # riser 1 ô nhịp trước mỗi drive, crash ở đầu drive
    for s0, name in secs:
        if name == "drive" and s0 > 0.5:
            add(L["fx"], max(0, s0 - 4 * beat), riser(min(4 * beat, s0)), 0.5)
            add(L["fx"], s0, crash(), 0.5)
    if hit:  # hook âm thanh ở khung đầu
        root, shape = chords[0]
        n = int(0.6 * RATE)
        stab = sum(osc(lead_w if style != "lofi" else "tri", hz(root + 12 + iv), n) for iv in shape) / len(shape)
        add(L["fx"], 0, crash(), 0.7)
        add(L["kick"], 0, kick(), 1.2)
        add(L["lead"], 0, stab * env(n, 0.002, 0.3, decay=0.25), 1.4)
    lp = {"chiptune": 5000, "synthpop": 7000, "lofi": 2600}[style]
    mix = (0.85 * L["kick"] + 0.42 * L["snare"] + 0.16 * L["hat"] + 0.55 * L["bass"] + 0.22 * L["chord"]
           + 0.16 * band(L["arp"], 0, lp) + 0.16 * band(L["lead"], 0, lp) + 0.35 * L["fx"])
    if style == "lofi":  # nhiễu đĩa than + bo cao tần
        mix = band(mix, 0, 5500) + band(rng.uniform(-1, 1, total), 1000, 8000) * 0.004
    return mix


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("out", type=Path)
    ap.add_argument("--duration", type=float, required=True)
    ap.add_argument("--style", choices=sorted(STYLES), default="chiptune")
    ap.add_argument("--sections", default="0:lift")
    ap.add_argument("--fade", type=float, default=2.5)
    ap.add_argument("--seed", type=int, default=7)
    ap.add_argument("--no-hit", action="store_true")
    a = ap.parse_args()
    secs = sorted((float(x), y) for x, y in (s.split(":") for s in a.sections.split(",")))
    bad = [y for _, y in secs if y not in ENERGY]
    if bad:
        raise SystemExit(f"đoạn lạ {bad}; dùng {sorted(ENERGY)}")
    mix = render(a.style, a.duration, secs, not a.no_hit, a.seed)
    f = int(a.fade * RATE)
    mix[-f:] *= np.linspace(1, 0, f) ** 1.5
    mix = mix / max(1e-9, np.max(np.abs(mix))) * 0.85
    a.out.parent.mkdir(parents=True, exist_ok=True)
    with wave.open(str(a.out), "wb") as w:
        w.setparams((1, 2, RATE, 0, "NONE", "not compressed"))
        w.writeframes((mix * 32767).astype("<i2").tobytes())
    print(a.out, a.style, round(len(mix) / RATE, 2), "s")


if __name__ == "__main__":
    main()
