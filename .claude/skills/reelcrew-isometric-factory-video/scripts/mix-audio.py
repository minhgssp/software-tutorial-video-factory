"""Mix the music (and the voice-over when it is on) → audio/final-mix.wav, the length of the video (writes mix.json,
runs `reelcrew mix`).

Usage: mix-audio.py <project-dir> [--music-vol 1.0] [--lead 0.15]
Music only (default): audio/music.wav at full level from 0 s (finalize.py sets the loudness to -14 LUFS).
With "narration": {"enabled": true}: each caption's take (audio/vo/best.json, voice.py) starts --lead s after its
caption appears → audio/vo/vo-track.wav, and the music plays under it at --music-vol (default 0.3 then), ducked
while the voice speaks. A take that runs past its caption's end, or into the next caption, is reported: shorten the
line (or its `say`) or give the caption more time in story.js.
"""
import json
import sys

sys.dont_write_bytecode = True  # keep the skill folder clean (no __pycache__ next to the scripts)
from iso_common import MUSIC, arg, duration, load, narration, page_data, project_dir, reelcrew, run, tool  # noqa: E402

proj = project_dir()
cfg = load(proj)
nar = narration(cfg)
if not (proj / MUSIC).exists():
    raise SystemExit(f"missing {MUSIC}: run music.py first")
total = float(page_data(proj, "DURATION"))
lead = float(arg("--lead", 0.15))

voice = None
if nar["enabled"]:
    caps = page_data(proj, "CAPTIONS")
    best_file = proj / "audio/vo/best.json"
    best = json.loads(best_file.read_text()) if best_file.exists() else {}
    missing = [str(i) for i in range(1, len(caps) + 1) if str(i) not in best]
    if missing:
        raise SystemExit(f"no take for caption(s) {','.join(missing)}: run voice.py (--lines {','.join(missing)})")
    inputs, filt, late = [], [], []
    for i, c in enumerate(caps, 1):
        take = proj / "audio/vo/takes" / best[str(i)]
        start = c["start"] + lead
        end = start + duration(take)
        nxt = caps[i]["start"] if i < len(caps) else total
        if end > min(c["end"], nxt) + 0.05:
            late.append(f"caption {i}: the voice ends at {end:.2f}s, the caption at {c['end']}s"
                        + (f" (next caption {nxt}s)" if end > nxt else ""))
        inputs += ["-i", take]
        filt.append(f"[{i - 1}]adelay={int(start * 1000)}:all=1[a{i}]")
    n = len(caps)
    filt.append("".join(f"[a{i}]" for i in range(1, n + 1)) + f"amix=inputs={n}:normalize=0,apad=whole_dur={total},atrim=0:{total}[o]")
    voice = "audio/vo/vo-track.wav"
    run(tool("ffmpeg"), "-y", "-v", "error", *inputs, "-filter_complex", ";".join(filt), "-map", "[o]", "-ar", "48000", proj / voice)
    for x in late:
        print(f"warning: {x}")

music_vol = float(arg("--music-vol", 0.3 if voice else 1.0))
plan = {"duration": total, **({"voice": voice} if voice else {}),
        "music": {"volume": music_vol, "duck": bool(voice), "beds": [{"file": MUSIC, "from": 0, "to": total, "fade_in": 0.05, "fade_out": 0.8}]}}
(proj / "mix.json").write_text(json.dumps(plan, ensure_ascii=False, indent=1))
r = reelcrew("mix", proj / "mix.json", "--out", proj / "audio/final-mix.wav", "--force")
for w in r["warnings"]:
    print(f"warning: {w} (the music is shorter than the video: set story.js duration to the music's length)")
print(f"mixed {total}s: music" + (f" + voice ({len(caps)} captions)" if voice else " only") + " → audio/final-mix.wav")
