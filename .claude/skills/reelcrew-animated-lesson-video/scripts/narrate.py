"""Per-scene narration through `reelcrew tts` → audio/vo/<scene>.mp3 + audio/vo-timing.json.

Usage: narrate.py <project-dir> [--force]
A line may carry `say`: the text the voice reads when it differs from the subtitle (e.g. a name spelled the way it
should sound); the subtitle always shows the line's own text. Also writes audio/script.txt (the subtitle text, one
line per sentence) for the pronunciation check, since speech-to-text writes words the standard way.
Every narration line is synthesised on its own (`reelcrew tts takes`: one run, one model load), edge silence is
trimmed and lines are joined with GAP seconds of silence, so line start/end times are exact without word timestamps.
The engine is lesson.narration.engine (a reelcrew tts adapter: vieneu, elevenlabs or soniox), the voice
lesson.narration.voice, the language lesson.narration.lang.
Trimmed lines are kept in audio/vo/lines/ by engine + voice + text; unchanged lines are reused (--force redoes all).
"""
import json
import subprocess
import sys
import wave

sys.dont_write_bytecode = True  # keep the skill folder clean (no __pycache__ next to the scripts)
from lesson_common import reelcrew, load_lesson, narration, project_dir, script_text, tool

GAP, SR = 0.28, 48000
proj = project_dir()
lesson = load_lesson(proj)
nar = narration(lesson)
lang, engine, voice = nar["lang"], nar["engine"], nar["voice"]
out, cache = proj / "audio/vo", proj / "audio/vo/lines"
cache.mkdir(parents=True, exist_ok=True)
force = "--force" in sys.argv

spoken = lambda ln: ln.get("say") or ln[lang]  # noqa: E731
# every line through `reelcrew tts takes` (one take each): synthesised in one run, edge silence trimmed, kept by
# what was said (unchanged lines are reused; --force redoes all)
items = [{"id": f"{sc['id']}.{i}", "say": spoken(ln), "text": ln[lang]} for sc in lesson["scenes"] for i, ln in enumerate(sc["lines"])]
(out / "lines.json").write_text(json.dumps(items, ensure_ascii=False, indent=1))
r = reelcrew("tts", "takes", out / "lines.json", "--out-dir", cache, "--adapter", engine, "--lang", lang,
             *(["--voice", voice] if voice else []), *(["--force"] if force else []))
take = {x["id"]: cache / x["file"] for x in r["items"]}
if r["made"]:
    print(f"synthesised {r['made']} line(s) with {r['adapter']}" + (f" ({voice})" if voice else ""))


def frames(path):
    with wave.open(str(path)) as w:
        return w.readframes(w.getnframes())


gap = b"\0\0" * int(GAP * SR)
timing = []
for sc in lesson["scenes"]:
    pcm, lines, t = b"", [], 0.0
    for i, ln in enumerate(sc["lines"]):
        a = frames(take[f"{sc['id']}.{i}"])
        if i:
            pcm += gap
            t += GAP
        d = len(a) / 2 / SR
        lines.append({**ln, "start": round(t, 3), "end": round(t + d, 3)})
        pcm += a
        t += d
    wav = out / f"{sc['id']}.wav"
    with wave.open(str(wav), "wb") as w:
        w.setnchannels(1), w.setsampwidth(2), w.setframerate(SR), w.writeframes(pcm)
    subprocess.run([tool("ffmpeg"), "-y", "-v", "error", "-i", str(wav), "-b:a", "192k", str(out / f"{sc['id']}.mp3")], check=True)
    wav.unlink()
    timing.append({"id": sc["id"], "duration": round(t, 3), "lines": lines})
    print(f"{sc['id']:<20} {t:6.2f}s")
(proj / "audio/vo-timing.json").write_text(json.dumps(timing, ensure_ascii=False, indent=1))
(proj / "audio/script.txt").write_text(script_text(lesson))  # for `reelcrew transcribe check --text`
print("total VO", round(sum(x["duration"] for x in timing), 1), "s")
