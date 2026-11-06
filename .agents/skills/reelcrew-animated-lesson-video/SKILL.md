---
name: reelcrew-animated-lesson-video
description: Turn a talk/lecture video into a 3–4 min hand-drawn animated teaching video, in English or 100% Vietnamese. Transcript → key ideas (main idea, explanation, example) → narration (Vietnamese voice Hải Đăng offline, or ElevenLabs / Soniox voices) → music bed + sound effects → canvas animation with burned-in subtitles, optional watermark, 1 s thumbnail intro, thumbnails and YouTube + Facebook descriptions. Use when the user asks to "dựng video dạy học", "video hoạt hình giải thích", "video dạy học tiếng Việt", "bản tiếng Việt", "giọng Hải Đăng", or to explain a talk as an animated explainer.
---

# Animated lesson video (English or Vietnamese)

Source video in → an animated lesson out. One workflow for both languages: the language is chosen once when the
project is created (`init-project.py --lang en|vi`), stored in `lesson.json`, and every later script reads it
from there. Only the parts marked **EN** / **VI** differ. Every tool (transcription, voice, music, sound effects,
rendering) is a `reelcrew` command; the scripts here are plain Python 3 + ffmpeg.

> Also follow **Rules for every video** in the `reelcrew` skill (`reelcrew skill reelcrew`, section 7): the frame
> size the page declares, Vietnamese fonts bundled next to the page, text measured to fit, safe zones, paid choices
> settled with the user first.

Style: paper texture, wobbly crayon outlines, hatch fills, an orange box host "mascot" and a teal "robot".
Worked example: `references/example-lesson.json` + `references/example-scenes.js` (10 finished scenes).

**Outputs** (`$P/renders/`):
| file | for |
|---|---|
| `<slug>.mp4` | 1080p24, −14 LUFS, burned-in subtitles, watermark (if set), thumbnail intro (if set) |
| `<slug>-thumbnail-youtube.jpg` | YouTube thumbnail 1280×720 (< 2 MB) |
| `<slug>-thumbnail-facebook.jpg` | Facebook thumbnail/cover 1920×1080 |
| `<slug>-thumbnail-small.jpg` | the thumbnail at phone size, to read before publishing |
| `<slug>-description.txt` | YouTube description (with chapter timestamps) + short Facebook post |
| `../subtitles/<slug>.<lang>.srt` | separate subtitles (`en`, `vi`, and `en-vi` when bilingual) |

```
source ─reelcrew fetch/transcribe─► pack.md ─(you)─► lesson.json ─narrate.py (reelcrew tts)─► VO + line timing
                                                            │                                     │
                                                            └─(you)─► scenes.js                   ▼
                                                                                    build-timeline ─► timeline.js, vo-track, SRT
                     music.py (reelcrew music) ◄── video length ──────────────────────────────┤
                     reelcrew render ─► video-only.mp4   ◄── scenes.js + timeline.js ──────────┘
       sfx-cues.json + audio/sfx ─► mix-audio ─► final-mix.wav ─► finalize (mux, −14 LUFS, reelcrew transcribe check) ─► <slug>.mp4
```

## Language: `--lang en|vi`
`init-project.py --lang` only picks the starting `lesson.json`; afterwards `lesson.json` is the single source of truth
(change the language by editing it, not by scaffolding again).

| | `--lang en` (default) | `--lang vi` |
|---|---|---|
| `narration` | `{"lang": "en", "engine": "elevenlabs", "voice": "TX3LPaxmHKxFdv7VOQHJ"}` | `{"lang": "vi", "engine": "vieneu", "voice": "Hải Đăng"}` |
| `subtitles` | `["en", "vi"]` (main line first) | `["vi"]` |
| each line | `en` (narration) + `vi` (subtitle) | `vi` only |
| script length | ~520 words ≈ 3.5 min | ~750 words ≈ 3 min |
| narration engine | ElevenLabs (paid, your key) | VieNeu, offline, free |
| thumbnail intro | off (`0`) | on (`1.0` s) |

Pick **vi** when the user asks for Vietnamese ("bản tiếng Việt", "giọng Hải Đăng", "100% tiếng Việt"); otherwise **en**.

## Variables
```bash
SK={{SKILL_ROOT}}/scripts      # this skill's scripts
P=<project folder>             # the new video project: $HOME/reelcrew-projects/<slug> unless the user names one (short: Windows stops at 260 characters)
```
**Windows:** when the agent runs on Windows: in Claude Code run these commands with the Bash tool (Git Bash)
when it has it; without Git Bash, and in Codex, commands run in PowerShell: set each variable above as `$NAME = "<value>"` (quoted) and the commands then read the same; run one
command per call (Windows PowerShell 5.1 has no `&&`); use `Remove-Item`, `Copy-Item -Recurse` and
`New-Item -ItemType Directory -Force` for `rm`, `cp -R` and `mkdir -p`, copy a file instead of `ln -s`, and write out `{a,b}` lists in full.

**Sample videos made with this skill:** `reelcrew examples animated-lesson-video --out-dir <folder>` downloads their style frames
(and says what each shows); look at them when the user asks for "the same look as the sample" or before writing the
first scenes. None yet: it says which skills have samples.

The scripts call `reelcrew`; if it is not on PATH, set `REELCREW` to its command.

## 0. Before you start
- `reelcrew doctor` must show ✓ for: Transcription, Vietnamese voice (VI), Music, Sound effects (only if the user wants
  generated SFX), Render & export. Fix what it lists (`reelcrew keys set elevenlabs`: one key for voice, music, sound
  effects and transcription, `reelcrew tts setup vieneu <folder>`, `reelcrew music setup elevenlabs`,
  `reelcrew transcribe setup elevenlabs`; a user who already has a Soniox key may use it instead). Never ask for a second
  key for the same job. Never print key values.
- Without a transcriber the video can still be finished for free (no speech checks, approximate word timing): see "No transcriber set up" at the end; offer it, the user chooses.
- **Ask the user for their own values** (never invent them, never reuse another channel's):
  - Watermark: "Show a channel handle in the top-right corner of every frame? e.g. `@userchannel` (empty = none)" → `lesson.watermark`.
  - Hashtags and the follow line for the descriptions (step 12) → `publish.hashtags`; the follow line uses the watermark handle.
  - Source credit: the talk's title, speaker and link, if they want it credited → `publish.credit`.

## 1. Scaffold
```bash
reelcrew python $SK/init-project.py $P --slug my-lesson-slug [--lang vi]
```
Copies templates to `$P/src`, writes `lesson.json` (per `--lang`, table above) and an empty `sfx-cues.json`;
creates `audio/{vo,music,sfx}`, `subtitles`, `renders`, `transcript`. Existing files are never overwritten.

## 2. Transcript
```bash
reelcrew fetch <link or file>                                  # a YouTube/X link: downloads the video (and the page text)
reelcrew transcribe $P/<source>.mp4 --out-dir $P/transcript [--lang vi]
cp $P/transcript/<stem>.packed.md $P/pack.md
```
`--lang vi` when the **source** speaks Vietnamese. Read the **whole** `.txt` (or `packed.md`) before writing the script;
for long talks read `words.json` in pieces (`reelcrew transcribe words … --from/--to`).

**Source is an article or a brief, not a video:** `reelcrew fetch <link> --out-dir $P/transcript/source` gives
`text.md` (the page as text); use it as the source text and skip transcription. For a brief the user wrote, save it as
`$P/transcript/brief.md`. Summarise in your own words either way, and credit the page in `publish.credit`.

## 3. Lesson script → `lesson.json`
Follow `references/scriptwriting.md`. Both languages:
- 8–10 scenes: hook → familiar analogy → problem → one idea per scene (**main idea → explanation → example**) → 3-step recap checklist.
- 3–5 lines per scene, one sentence per line (one idea each, 10–30 words).
- Summarise in your own words, never copy the transcript. `visual` = one-sentence storyboard per scene.
- Per scene `chapter` (YouTube chapter name, ≥ 10 s per chapter). Set `title`, `music` cue prompts (instrumental).
- Show the user the scene list (titles + key idea) before generating anything if the topic is ambiguous.

**EN**: each line has `en` (narration) + `vi` (subtitle); ~520 words total.

**VI**: each line has `vi` only; ~750 words total. Write **spoken** Vietnamese, not a translation:
- Vietnamese terms instead of English jargon: agent → trợ lý AI · pull request → bản cập nhật mã ·
  lint rule → luật kiểm tra tự động · codebase → kho mã nguồn · skill → kỹ năng · framework → bộ khung ·
  CI → hệ thống kiểm thử tự động · UI thread → luồng giao diện.
- Numbers as words ("hai nghìn", "sáu mươi khung hình"); no brackets or symbols.
- Keep the **same number of lines per scene** as the scene code expects (`b[0]…b[n]`) when adapting an existing lesson.
- A name the voice misreads: keep the normal spelling in the line (it is the subtitle) and add `"say"` with the spelling
  that sounds right, e.g. `{"vi": "…tán xạ Rayleigh.", "say": "…tán xạ Rây-lây."}`. Only the voice uses `say`.

## 4. Narration
```bash
reelcrew python $SK/narrate.py $P            # every line via `reelcrew tts say --batch` (one model load), trimmed, joined → audio/vo/<scene>.mp3, audio/vo-timing.json, audio/script.txt
```
- Lines are synthesised one by one, edge silence trimmed and joined with 0.28 s gaps, so line timings are exact for
  subtitles. Unchanged lines are reused from `audio/vo/lines/`; `--force` redoes all.
- **VI**: Hải Đăng = male, northern accent, natural. Other voices: `reelcrew tts voices` (e.g. Thiện Minh for storytelling,
  Mai Anh for news, southern and central voices). Change `narration.voice` to switch.
- **EN**: ElevenLabs voice Liam by default (`reelcrew tts setup elevenlabs` once; other voices: `reelcrew tts voices --adapter elevenlabs`).
- Any language can also use **Soniox** voices (`"engine": "soniox"`, voices like Grace, Adrian, Daniel; `reelcrew tts voices --adapter soniox`),
  or ElevenLabs for Vietnamese (`"engine": "elevenlabs"`, a Vietnamese voice id, model `eleven_v3` set up with
  `reelcrew tts setup elevenlabs --model eleven_v3`). Ask the user before switching to a paid engine.

## 5. Timeline + early pronunciation check
```bash
reelcrew python $SK/build-timeline.py $P     # src/timeline.js (scene start/dur/beats + subs), audio/vo-track.wav, subtitles/<slug>.<lang>.srt
```
It prints each scene's `beats` = when each narration line starts (scene-relative). **Every visual event is keyed to a beat.**
Re-run after any narration, `thumbnail_intro` or watermark change.

Check pronunciation before animating (costs one short transcription):
```bash
reelcrew transcribe check --text $P/audio/script.txt --audio $P/audio/vo-track.wav --out-dir $P/audio/vo-stt --lang <en|vi>
```
Expect ≥ 97% (numbers as digits or words both count). Each issue shows the time and the word heard: rewrite that line
(step 4), or spell foreign names the way the voice should say them.

## 6. Animate `src/scenes.js`
Read `references/drawing-kit.md` (API) and skim `references/example-scenes.js` (10 finished scenes) first.
- One function per scene `fn(u, b, D)`; register it in `SCENE_FNS` under the scene id. Unregistered ids show a placeholder with their beats, so you can build scene by scene.
- Per beat: bring in the keyword `tsign`, the character action and the example prop; retire the previous layer with `fade(1 - prog(...))`.
- Vary backgrounds (paper, warm gradient, sky/garden, space) and keep y > 850 free for subtitles.
- Only original characters/props from the kit (or new original drawings): no copyrighted characters or real logos.
- **VI**: every on-screen string is Vietnamese (signs, labels, windows, books, checklists, command lines). Vietnamese text
  runs ~20–30% longer → shorten or lower `size` when it overflows. Subtitles and labels use Be Vietnam Pro (`src/fonts/`, every Vietnamese letter at every weight); never a system font for
  Vietnamese text.

Preview live: open `$P/src/index.html` in Chrome (`?t=95` jumps to 95 s). Check with stills, 2–3 per scene, just after the late beats:
```bash
reelcrew render $P/src/index.html --stills 1.5,9,28,40.3 --out-dir $P/renders/stills      # + a labelled sheet.jpg
```
Read `sheet.jpg`; fix overlaps (labels vs. falling props, signs vs. icons), clipped text, empty frames.

## 7. Watermark
- `lesson.watermark` = the handle the user gave (step 0), e.g. `"@userchannel"`, drawn top-right on every frame and on the
  thumbnail (white text on a dim pill, hand-drawn font). `""` = none (the default).
- It is drawn in the page, so **changing it needs a re-render** (step 9).
- Keep signs/labels out of x > 1550, y < 90 when a watermark is set.

## 8. Thumbnail (image + first second of the video)
```jsonc
"thumbnail_intro": 1.0,                         // seconds of thumbnail at the start (0 = none)
"thumbnail": {"lines": ["TIN TƯỞNG", "TRỢ LÝ AI"], "tag": "5 tầng niềm tin", "bg": ["#FFD166", "#F4845F"]}
```
```bash
reelcrew python $SK/build-timeline.py $P     # prepends a "thumb" scene; every scene, line and SFX shifts
reelcrew python $SK/thumbnail.py $P          # reelcrew render --thumb → <slug>-thumbnail-facebook.jpg + -youtube.jpg
```
Design rules (`thumbScene` in kit.js): at most 2 lines, ≤ 12 characters each, UPPERCASE; `tag` ≤ 20 characters, a promise or
a number; bright contrasting background; happy character on the right. Check at ~320 px: still readable = good.
Per-video design: define `SCENE_FNS.thumb` in scenes.js.

## 9. Render
```bash
reelcrew render $P/src/index.html --fps 24 --workers 3 --out $P/renders/video-only.mp4 --force     # run in background; ~2–3 min
```
Headless Chrome is started and always closed by reelcrew; several renders can run at once.

## 10. Music
```bash
reelcrew python $SK/music.py $P              # after build-timeline: one instrumental bed per cue, made to the video's length
```
Uses `reelcrew music make` (ElevenLabs; spends credits once, then a rerun with the same prompt and length reuses the
library). Several cues split the video and are crossfaded. To reuse a bed the user already has, put it in
`audio/music/` and write `manifest.json` as `[{"id": "bed", "clips": [{"file": "bed.mp3", "duration": 200}]}]`.

## 11. Sound effects + mix
Write `sfx-cues.json` rows `[scene_id, beat_index|null, offset_s|"END", sfx, peak_db]`
(see `references/example-sfx-cues.json`). `sfx` is a **named sound** (the table below; all of them: `reelcrew sfx catalog`) or a path to any audio file.

| sfx | fits | sfx | fits |
|---|---|---|---|
| `ding` | ✓ check, correct | `stamp` | big word/stamp, slab lands |
| `chime` | reveal, reward, title | `click` | pop-in of small items/icons |
| `whoosh`, `whoosh-soft` | fly-in, toss (soft one auto on cuts) | `paper-slide` | cards/books appear |
| `typewriter` (3s) | terminal/code typing | `glitch` | bug, hack, error on screen |
| `error-beep` | ✗ wrong, blocked | `notif-flood` (3s) | alerts, many items at once |
| `marker-strike` | strike-through, underline | `footsteps` | character walks in |
| `low-boom` | serious question | `riser` (3s) | build-up before a reveal |
| `knockdown` | bump, collision | `impact-braam` | end-card hit (use once) |

Peak dB guide: −9 hero accent, −13 dings, −15/−17 background ticks, −20 long loops.

**Getting the named sounds** (`$P/audio/sfx/<name>.mp3`):
1. After writing `sfx-cues.json`, list the named sounds it uses that the project does not have yet:
   `reelcrew python $SK/sfx-needed.py $P` → `audio/sfx-needed.json` (only those; whoosh-soft is included for scene changes).
   A sound not in the catalog: describe it in the project's own `$P/sfx-set.json` (`[{"id": "modem", "prompt": "…", "duration": 3}]`).
   Earlier projects' sounds are in the library: `reelcrew library ls sfx --search <name>`.
2. If some are missing, **ask the user** which way to go:
   - **Make them** as designed (ElevenLabs, needs the ElevenLabs key, spends credits once per sound; later projects reuse
     the library): `reelcrew sfx make --batch $P/audio/sfx-needed.json --out-dir $P/audio/sfx --reuse`
   - **Use the free defaults** (Kenney CC0, bundled): say plainly that they are generic game/interface sounds and fit
     less well than sounds made for the moment. Each named sound's closest default is its free default in `reelcrew sfx catalog`
     written `kenney:<pack>/Audio/<original file>`; find others with `reelcrew sfx defaults --search <words>`.
     Put that `kenney:…` value straight into the cue instead of the name (no copying or renaming). Sounds whose `default` is `null`
     (typewriter, heartbeat, crowd-murmur…) or whose default does not fit: `reelcrew sfx defaults --type <type> --sheet sheet.png`, then a CC0 recording (`reelcrew sfx find "<material action>"`, `reelcrew sfx add <url> --type <type>`), then `reelcrew sfx make` (paid: ask first); the rules are in the `reelcrew` skill, section 7.
```bash
reelcrew python $SK/mix-audio.py $P [--music-vol 0.2]    # VO + ducked music (sidechain) + SFX → audio/final-mix.wav
```
It lists any missing sound with both options instead of mixing without it.

## 12. Finalize + verify
```bash
reelcrew python $SK/finalize.py $P [--crf 20]   # mux + loudnorm −14 LUFS → renders/<slug>.mp4, then the speech check line by line (text or say)
rm $P/renders/video-only.mp4
```
Pass criteria: 1920×1080 h264 + aac, duration = timeline total, −14 LUFS, STT match ≥ 97%, the frame at 0.5 s is the
thumbnail when `thumbnail_intro` > 0 (`reelcrew inspect $P/renders/<slug>.mp4` shows streams, loudness and a frame sheet).
If STT drops words, the music is too loud → lower `--music-vol`.

## 13. YouTube + Facebook descriptions
Fill the `publish` block in `lesson.json` (`youtube_title`, `hook`, `summary`, `points` 5–7, `takeaway`, `steps` 3,
`credit`, `hashtags`, `fb_hook`, `fb_points` 3) and each scene's `chapter`, in the lesson's language, then:
```bash
reelcrew python $SK/descriptions.py $P       # → renders/<slug>-description.txt
```
- **YouTube**: title (exactly `youtube_title`; add an emoji there if the user wants one) + hook + what you will learn + **chapter timestamps from the timeline** (thumbnail intro included;
  the first chapter is always 0:00) + takeaway + credit + follow line (only when a watermark handle is set) + hashtags.
- **Facebook**: short: 1–2 line hook (Facebook shows ~3 lines before "See more"), 3 points, the takeaway, 4 hashtags.
- The script warns when a chapter is shorter than 10 s (YouTube ignores such chapters).
- Credit honestly: "summarised and retold from the talk …" with the link the user gave.

## Customising
- **One video** (config, content, characters, sounds): edit the project's own copies: `$P/lesson.json`, `$P/src/scenes.js`,
  `$P/src/kit.js` / `engine.js` (characters, drawing), `$P/sfx-cues.json`. Nothing else changes.
- **Every video from now on** (e.g. the channel's own character, a different default config): ask the user first, then
  `reelcrew skill edit animated-lesson-video templates/src/kit.js` (or `scripts/init-project.py`, …) and edit **the path
  it prints**. That copy replaces the original on every run and survives reelcrew updates. Never edit files under
  the skill folder shown at the top in place: updates overwrite them.
- When `reelcrew skill animated-lesson-video` says a changed file's original moved on, run the `reelcrew skill merge …`
  it prints: clean merges finish by themselves; conflict blocks (`<<<<<<< yours` / `=======` / `>>>>>>> reelcrew`) need
  you to keep the right lines, check the result (e.g. stills), then `… --done`. Ask the user when unsure.
- Undo: `reelcrew skill reset animated-lesson-video [<file>]`.

## Report to the user
Paths of the video, thumbnails, description file and subtitles; duration; language and voice; music (new or reused);
sound effects (made, reused or free defaults); verification numbers (LUFS, STT %); how to tweak: narration → steps 4–5, 9–12;
visuals → steps 9, 12; thumbnail → steps 8, 9, 12; descriptions → step 13.

## Gotchas
- Changing `thumbnail_intro`, the narration or the watermark shifts the timeline → re-run from `build-timeline`, then
  render, music (new length), mix and finalize.
- Keep `renderFrame` deterministic (seeded `rnd`, no `Math.random`) or frames will flicker.
- Mean volume before loudnorm is meaningless for balance; judge by the STT check.
- VieNeu may mispronounce foreign names: write them the way they should sound, and check with step 5.

## No transcriber set up

The speech checks and word timing hear the voice through `reelcrew transcribe` (paid, a short call per run). Without a transcriber the video can still be finished for free; each script that would transcribe stops and names its option:

- `finalize.py $P --no-stt` (the finished file is not heard back)

What is lost: the check that the finished video says the script (narrate.py reads one take per line and never needs a transcriber). Tell the user, and listen to the voice before delivering. Setting up a transcriber (`reelcrew transcribe setup elevenlabs`: an ElevenLabs voice key transcribes too; or `soniox`) brings them back; that is the user's choice, not a step to take for them.
