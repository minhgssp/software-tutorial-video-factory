#!/usr/bin/env python3
"""Nhạc nền chiptune tự tổng hợp (giấy phép: tự làm), không dùng mẫu ngoài.

Dùng: python3 chiptune.py OUT.wav --duration 85 --sections 0:calm,24.6:lift,45.8:drive,67.5:calm,78.1:outro
Mỗi đoạn đổi mật độ: calm = bass + arpeggio thưa; lift = thêm hi-hat; drive = thêm arpeggio 1/16
quãng tám trên; outro = hợp âm ngân rồi tắt dần. Nhạc chạy từ giây 0, fade 2,5 giây cuối.
Mức âm lượng cuối do bước mix quyết định (spec: 0,08–0,11 so với giọng).
"""
from __future__ import annotations

import argparse
import wave
from pathlib import Path

import numpy as np

RATE = 48000
BPM = 96
BEAT = 60 / BPM
# Am – F – C – G, mỗi hợp âm một ô nhịp (4 phách).
CHORDS = [(57, (0, 3, 7)), (53, (0, 4, 7)), (48, (0, 4, 7)), (55, (0, 4, 7))]


def hz(midi: float) -> float:
    return 440.0 * 2 ** ((midi - 69) / 12)


def pulse(freq: float, n: int, duty: float = 0.25) -> np.ndarray:
    phase = (np.arange(n) * freq / RATE) % 1.0
    return np.where(phase < duty, 1.0, -1.0)


def triangle(freq: float, n: int) -> np.ndarray:
    phase = (np.arange(n) * freq / RATE) % 1.0
    return 4 * np.abs(phase - 0.5) - 1


def env(n: int, attack: float = 0.004, release: float = 0.08) -> np.ndarray:
    a, r = max(1, int(attack * RATE)), max(1, int(release * RATE))
    e = np.ones(n)
    e[:a] = np.linspace(0, 1, a)
    if n > a:
        tail = min(r, n - a)
        e[-tail:] *= np.linspace(1, 0, tail)
    return e


def lowpass(x: np.ndarray, cutoff: float) -> np.ndarray:
    alpha = 1 - np.exp(-2 * np.pi * cutoff / RATE)
    y = np.empty_like(x)
    acc = 0.0
    for i, v in enumerate(x):  # một cực, đủ làm dịu răng cưa của sóng vuông
        acc += alpha * (v - acc)
        y[i] = acc
    return y


def section_at(t: float, sections: list[tuple[float, str]]) -> str:
    name = sections[0][1]
    for start, kind in sections:
        if t >= start:
            name = kind
    return name


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("out", type=Path)
    parser.add_argument("--duration", type=float, required=True)
    parser.add_argument("--sections", default="0:calm")
    parser.add_argument("--fade", type=float, default=2.5)
    args = parser.parse_args()
    sections = sorted((float(a), b) for a, b in (s.split(":") for s in args.sections.split(",")))
    total = int(args.duration * RATE)
    bass = np.zeros(total)
    arp = np.zeros(total)
    lead = np.zeros(total)
    hat = np.zeros(total)
    pad = np.zeros(total)
    rng = np.random.default_rng(7)
    step = BEAT / 2  # nốt móc đơn
    k = 0
    while k * step < args.duration:
        t = k * step
        bar = int(t // (4 * BEAT))
        root, shape = CHORDS[bar % len(CHORDS)]
        kind = section_at(t, sections)
        start = int(t * RATE)
        n = min(int(step * RATE), total - start)
        if n <= 0:
            break
        if kind == "outro":
            if k % 8 == 0:  # hợp âm ngân mỗi ô nhịp
                m = min(int(4 * BEAT * RATE), total - start)
                tone = sum(triangle(hz(root + 12 + iv), m) for iv in shape) / 3
                pad[start:start + m] += tone * env(m, 0.3, 1.5)
            k += 1
            continue
        if k % 2 == 0:  # bass mỗi phách
            m = min(int(BEAT * RATE * 0.9), total - start)
            bass[start:start + m] += triangle(hz(root - 12), m) * env(m, 0.005, 0.12)
        idx = [0, 1, 2, 1][k % 4]
        if kind != "calm" or k % 2 == 0:
            note = root + 12 + shape[idx]
            arp[start:start + n] += pulse(hz(note), n, 0.25) * env(n, 0.003, 0.09)
        if kind in ("lift", "drive") and k % 2 == 1:
            m = int(0.04 * RATE)
            hat[start:start + m] += rng.uniform(-1, 1, m) * np.linspace(1, 0, m) ** 2
        if kind == "drive":
            for half in range(2):
                s2 = start + half * n // 2
                m = n // 2
                note = root + 24 + shape[(k * 2 + half) % 3]
                lead[s2:s2 + m] += pulse(hz(note), m, 0.125) * env(m, 0.002, 0.05)
        k += 1
    mix = 0.55 * bass + 0.22 * lowpass(arp, 2400) + 0.10 * lowpass(lead, 3200) + 0.06 * hat + 0.30 * pad
    fade = int(args.fade * RATE)
    mix[-fade:] *= np.linspace(1, 0, fade) ** 1.5
    mix[: int(0.02 * RATE)] *= np.linspace(0, 1, int(0.02 * RATE))
    mix = mix / np.max(np.abs(mix)) * 0.8
    args.out.parent.mkdir(parents=True, exist_ok=True)
    with wave.open(str(args.out), "wb") as out:
        out.setparams((1, 2, RATE, 0, "NONE", "not compressed"))
        out.writeframes((mix * 32767).astype("<i2").tobytes())
    print(args.out, round(total / RATE, 2), "s")


if __name__ == "__main__":
    main()
