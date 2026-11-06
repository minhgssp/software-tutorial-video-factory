"""A script → the voice and its subtitles: `reelcrew tts takes`, one line at a time → audio/vo.wav + audio/vo.srt.

Usage: voice.py <project-dir> [--script script.txt] [--takes N] [--gap 0.25] [--lead 0.3] [--force]
script.txt (default <project>/script.txt): one subtitle line per line (blank lines are skipped). Each line is said
by whiteboard.json "narration" (engine, voice, lang): the free offline voice (VieNeu for Vietnamese, Kokoro for
English) or a paid one the user picked and approved. The takes are joined with --gap seconds between them after a
--lead of silence, and vo.srt gets one cue per line at its take's times. --takes N > 1 makes N takes per line and
keeps the one a transcriber hears best (needs `reelcrew transcribe setup …`); the default 1 needs none. Takes are
kept by their text: a rerun reuses unchanged lines; --force makes them again.
"""
import json
import sys

sys.dont_write_bytecode = True  # keep the skill folder clean (no __pycache__ next to the scripts)
from wb_common import SRT, VO, arg, duration, load, num, project_dir, reelcrew, run, tool, write_srt  # noqa: E402

proj = project_dir()
cfg = load(proj)
nar = cfg.get("narration") or {}
src = proj / arg("--script", "script.txt")
if not src.exists():
    raise SystemExit(f"missing {src}: write the script, one subtitle line per line")
lines = [ln.strip() for ln in src.read_text(encoding="utf8").splitlines() if ln.strip()]
if not lines:
    raise SystemExit(f"{src.name} is empty")
takes = int(num("--takes", 1))
gap, lead = num("--gap", 0.25), num("--lead", 0.3)
vo = proj / "audio/vo"
vo.mkdir(parents=True, exist_ok=True)
(vo / "lines.json").write_text(json.dumps([{"id": str(i), "say": t, "text": t} for i, t in enumerate(lines, 1)],
                                          ensure_ascii=False, indent=1), encoding="utf8")
r = reelcrew("tts", "takes", vo / "lines.json", "--out-dir", vo / "takes", "--takes", takes,
             *(["--adapter", nar["engine"]] if nar.get("engine") else []), "--lang", nar.get("lang", cfg.get("lang", "vi")),
             *(["--voice", nar["voice"]] if nar.get("voice") else []), *(["--force"] if "--force" in sys.argv else []), free="--takes 1 (one take per line, no speech check)")
files = {x["id"]: vo / "takes" / x["file"] for x in r["items"]}
order = [files[str(i)] for i in range(1, len(lines) + 1)]
lens = [duration(f) for f in order]
cues, t = [], lead
for i, (text, d) in enumerate(zip(lines, lens), 1):
    cues.append({"startMs": round(t * 1000), "endMs": round((t + d) * 1000), "text": text})
    t += d + gap
# one track: the lead's silence, then each take with its gap after it
parts = "".join(f"[{i + 1}]aresample=48000,aformat=sample_fmts=fltp:channel_layouts=mono,apad=pad_dur={gap}[a{i}];"
                for i in range(len(order)))
chain = "[0]" + "".join(f"[a{i}]" for i in range(len(order))) + f"concat=n={len(order) + 1}:v=0:a=1[out]"
run(tool("ffmpeg"), "-v", "error", "-y", "-f", "lavfi", "-t", f"{lead}", "-i", "anullsrc=r=48000:cl=mono",
    *[a for f in order for a in ("-i", f)], "-filter_complex", parts + chain, "-map", "[out]", "-ar", "48000", proj / VO)
write_srt(proj / SRT, cues)
print(f"{len(lines)} lines ({r.get('adapter', nar.get('engine'))}, {r.get('made', 0)} new takes): {duration(proj / VO):.2f}s → {VO}, {SRT}")
print("next: parse-srt.py (the scene plan)")
