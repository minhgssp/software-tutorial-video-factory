#!/usr/bin/env python3
"""Hiệu ứng âm thanh (SFX) chiptune tự tổng hợp, gắn đúng sự kiện hình trong direction JSON.

Dùng: python3 sfx.py work/direction-doc.json work/sfx-doc.wav [--events work/sfx-doc.json]
                     [--target-lufs -30]

Sự kiện lấy thẳng từ direction (không đặt tay): chuyển cảnh wipe/whip → vút, pixelate/dither/block →
nhiễu số; sprite reveal "pop" → bíp nảy (cùng cụm thì cao dần); nhãn đếm (text là danh sách bước) →
tích theo từng bước; nhãn plate "stamp" → dấu đóng; burst → lấp lánh; ring → ping; arrow → vèo ngắn;
punch → nhịp trầm; shake → rền. Âm được đặt trái/phải theo toạ độ x của vật.

--target-lufs: chỉnh cả bus về mức tích hợp này (đo bằng ffmpeg ebur128). Giọng sau loudnorm ở −16 LUFS,
nên mặc định −31 giữ SFX thấp hơn giọng 15 dB; đo ngắn hạn (3 giây) chỗ sát nhất vẫn ≥12 dB (spec: ít nhất 12 dB).
Giấy phép: tự làm, không dùng mẫu ngoài.
"""
from __future__ import annotations

import argparse
import json
import re
import subprocess
import wave
from pathlib import Path

import numpy as np

RATE = 48000
FFMPEG = "/opt/homebrew/bin/ffmpeg"
RNG = np.random.default_rng(7)


def hz(midi: float) -> float:
    return 440.0 * 2 ** ((midi - 69) / 12)


def tone(f0: float, f1: float, dur: float, wave_: str = "pulse", duty: float = 0.25) -> np.ndarray:
    n = int(dur * RATE)
    f = np.geomspace(f0, f1, n) if f0 != f1 else np.full(n, f0)
    ph = np.cumsum(f / RATE) % 1.0
    if wave_ == "pulse":
        return np.where(ph < duty, 1.0, -1.0)
    if wave_ == "tri":
        return 4 * np.abs(ph - 0.5) - 1
    return np.sin(2 * np.pi * ph)


def decay(n: int, tau: float, attack: float = 0.002) -> np.ndarray:
    t = np.arange(n) / RATE
    e = np.exp(-t / tau)
    a = max(1, int(attack * RATE))
    e[:a] *= np.linspace(0, 1, a)
    return e


def onepole(x: np.ndarray, cutoff) -> np.ndarray:
    """Lọc thấp một cực; cutoff có thể là mảng để quét."""
    c = np.broadcast_to(np.asarray(cutoff, float), x.shape)
    alpha = 1 - np.exp(-2 * np.pi * c / RATE)
    y = np.empty_like(x)
    acc = 0.0
    for i in range(len(x)):
        acc += alpha[i] * (x[i] - acc)
        y[i] = acc
    return y


def crush(x: np.ndarray, hold: int) -> np.ndarray:
    return np.repeat(x[::hold], hold)[: len(x)]


# Mỗi hàm trả mono float, đỉnh ≈ 1 trước khi nhân gain.
def s_pop(i: int = 0) -> np.ndarray:
    base = 72 + 2 * min(i, 7)  # cụm pop xếp tầng thì cao dần từng cung
    x = tone(hz(base), hz(base + 12), 0.055)
    return x * decay(len(x), 0.022)


def s_tick(i: int = 0) -> np.ndarray:
    x = tone(hz(84 + min(i, 12)), hz(84 + min(i, 12)), 0.02, duty=0.5)
    return x * decay(len(x), 0.008)


def s_blip() -> np.ndarray:
    x = tone(hz(79), hz(79), 0.03, "tri")
    return x * decay(len(x), 0.012)


def s_whoosh(dur: float = 0.38) -> np.ndarray:
    n = int(dur * RATE)
    sweep = np.geomspace(500, 6000, n)
    x = onepole(RNG.uniform(-1, 1, n), sweep)
    x -= onepole(x, 300)  # bỏ phần trầm cho gọn
    e = np.sin(np.linspace(0, np.pi, n)) ** 1.5
    return x * e / (np.abs(x * e).max() + 1e-9)


def s_glitch() -> np.ndarray:
    parts = []
    for k, hold in enumerate((6, 12, 4)):
        n = int(0.045 * RATE)
        seg = crush(RNG.uniform(-1, 1, n), hold) * 0.7 + tone(hz(60 + 7 * k), hz(60 + 7 * k), 0.045) * 0.3
        parts += [seg * decay(n, 0.03), np.zeros(int(0.018 * RATE))]
    return np.concatenate(parts)


def s_stamp() -> np.ndarray:
    body = tone(110, 45, 0.22, "tri")
    body *= decay(len(body), 0.07)
    click = onepole(RNG.uniform(-1, 1, len(body)), 3000) * decay(len(body), 0.006)
    return body + 0.6 * click


def s_sparkle() -> np.ndarray:
    notes = (84, 88, 91, 96)
    out = np.zeros(int(0.32 * RATE))
    for k, m in enumerate(notes):
        x = tone(hz(m), hz(m), 0.12, "tri")
        x *= decay(len(x), 0.04)
        s = int(k * 0.05 * RATE)
        out[s:s + len(x)] += x[: len(out) - s]
    return out


def s_ping() -> np.ndarray:
    x = tone(hz(88), hz(88), 0.3, "tri") + 0.3 * tone(hz(100), hz(100), 0.3, "tri")
    return x * decay(len(x), 0.08)


def s_zip() -> np.ndarray:
    x = tone(hz(67), hz(86), 0.12, duty=0.125)
    return x * decay(len(x), 0.05)


def s_thump() -> np.ndarray:
    x = tone(80, 50, 0.14, "sin")
    return x * decay(len(x), 0.05)


def s_rumble(dur: float) -> np.ndarray:
    n = int(max(dur, 0.15) * RATE)
    x = onepole(RNG.uniform(-1, 1, n), 140)
    x /= np.abs(x).max() + 1e-9
    return x * np.sin(np.linspace(0, np.pi, n))


# gain tương đối giữa các loại (dB), bus được chuẩn hoá lại sau.
GAIN = {"pop": -6, "tick": -12, "blip": -16, "whoosh": -4, "glitch": -9, "stamp": 0,
        "sparkle": -8, "ping": -10, "zip": -12, "thump": -6, "rumble": -8}


def events(direction: dict) -> list[dict]:
    W = 180 if direction["orient"] == "doc" else 320
    ev: list[dict] = []

    def add(t, kind, x=None, **kw):
        ev.append({"t": round(float(t), 3), "kind": kind, "pan": 0.0 if x is None else max(-0.6, min(0.6, (x / W - 0.5) * 1.2)), **kw})

    for k, sc in enumerate(direction["scenes"]):
        t0 = sc["from"]
        tin = (sc.get("tin") or {}).get("kind")
        if k and tin in ("wipe", "whip"):
            add(t0, "whoosh")
        elif k and tin in ("pixelate", "dither", "block"):
            add(t0, "glitch")
        for t, *_ in sc.get("punch", []):
            add(t, "thump")
        for t, _amp, dur in sc.get("shake", []):
            add(t, "rumble", dur=dur)
        pops: list[tuple[float, float]] = []
        for it in sc["items"]:
            at = max(float(it.get("at", t0)), t0)
            kind = it["kind"]
            if kind == "sprite" and it.get("reveal") == "pop":
                pops.append((at, it.get("x", W / 2)))
            elif kind == "label":
                if isinstance(it.get("text"), list) and len(it["text"]) > 2:
                    for i, (ts, _) in enumerate(it["text"]):
                        add(ts, "tick", it.get("x"), i=i)
                elif it.get("plate") == "stamp":
                    add(at, "stamp", it.get("x"))
                else:
                    add(at, "blip", it.get("x"))
            elif kind == "burst":
                add(at, "sparkle", it.get("x"))
            elif kind == "ring":
                add(at, "ping", it.get("x"))
            elif kind == "arrow":
                add(at, "zip", it.get("x"))
        # Cụm pop: các pop cách nhau ≤0,2 giây là một cụm, cao dần.
        pops.sort()
        i, prev = 0, -9.0
        for at, x in pops:
            i = i + 1 if at - prev <= 0.2 else 0
            prev = at
            add(at, "pop", x, i=i)

    # Bỏ trùng: cùng loại trong 60 ms giữ một; blip nằm sát (≤0,1 giây) sự kiện mạnh hơn thì bỏ.
    ev.sort(key=lambda e: e["t"])
    out: list[dict] = []
    for e in ev:
        if any(o["kind"] == e["kind"] and abs(o["t"] - e["t"]) < 0.06 for o in out[-6:]):
            continue
        if e["kind"] == "blip" and any(abs(o["t"] - e["t"]) <= 0.1 for o in ev if o is not e and o["kind"] != "blip"):
            continue
        out.append(e)
    return out


def synth(ev: list[dict], dur: float) -> np.ndarray:
    bus = np.zeros((int(dur * RATE) + RATE, 2))
    for e in ev:
        k = e["kind"]
        x = {"pop": lambda: s_pop(e.get("i", 0)), "tick": lambda: s_tick(e.get("i", 0)), "blip": s_blip,
             "whoosh": s_whoosh, "glitch": s_glitch, "stamp": s_stamp, "sparkle": s_sparkle, "ping": s_ping,
             "zip": s_zip, "thump": s_thump, "rumble": lambda: s_rumble(e.get("dur", 0.3))}[k]()
        x = x * 10 ** (GAIN[k] / 20)
        p = e["pan"]
        s = int(e["t"] * RATE)
        n = min(len(x), len(bus) - s)
        if n <= 0:
            continue
        bus[s:s + n, 0] += x[:n] * np.sqrt((1 - p) / 2) * np.sqrt(2)
        bus[s:s + n, 1] += x[:n] * np.sqrt((1 + p) / 2) * np.sqrt(2)
    return bus[: int(dur * RATE)]


def write(path: Path, x: np.ndarray) -> None:
    pcm = (np.clip(x, -1, 1) * 32767).astype("<i2")
    with wave.open(str(path), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(RATE)
        w.writeframes(pcm.tobytes())


def lufs(path: Path) -> float:
    r = subprocess.run([FFMPEG, "-hide_banner", "-nostats", "-i", str(path), "-af", "ebur128", "-f", "null", "-"],
                       capture_output=True, text=True)
    return float(re.findall(r"I:\s+(-?[\d.]+) LUFS", r.stderr)[-1])


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("direction", type=Path)
    ap.add_argument("out", type=Path)
    ap.add_argument("--events", type=Path)
    ap.add_argument("--target-lufs", type=float, default=-31.0)
    a = ap.parse_args()
    d = json.loads(a.direction.read_text())
    ev = events(d)
    bus = synth(ev, d["dur"])
    bus /= np.abs(bus).max() + 1e-9
    bus *= 0.5
    write(a.out, bus)
    g = a.target_lufs - lufs(a.out)
    bus *= 10 ** (g / 20)
    if np.abs(bus).max() > 0.98:
        bus *= 0.98 / np.abs(bus).max()
    write(a.out, bus)
    final = lufs(a.out)
    if a.events:
        a.events.write_text(json.dumps({"lufs": final, "count": len(ev), "events": ev}, ensure_ascii=False, indent=1))
    kinds: dict[str, int] = {}
    for e in ev:
        kinds[e["kind"]] = kinds.get(e["kind"], 0) + 1
    print(json.dumps({"out": str(a.out), "events": len(ev), "kinds": kinds, "lufs": final}, ensure_ascii=False))


if __name__ == "__main__":
    main()
