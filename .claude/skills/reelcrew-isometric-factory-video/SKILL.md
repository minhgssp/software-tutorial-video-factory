---
name: reelcrew-isometric-factory-video
description: Make a ~70-second 16:9 explainer in the isometric line-art "decision factory" look (like TextQL's "AI powered Decision Factory" video on X) for a system architecture, pipeline or process (AI agents, ticket routing, order handling, application review…). A 30° isometric technical drawing on light grey, thin black strokes, one green accent; a diagonal belt through 6 stamping stations with boxes moving in step with the music; a router desk whose nodes light up; DELIVER stacks that count up; a pipeline list, LIVE card and ledger on the left; Vietnamese captions in a note card. Two acts compare before/after. Music only by default (the topic video's track or a new one from reelcrew music), optional voice-over. Own SVG engine rendered frame by frame, no AI images. Use when the user asks for "video kiểu TextQL / decision factory / nhà máy isometric", "video kiến trúc hệ thống dạng băng chuyền", or wants the worked example's look for another topic.
---

# Isometric "decision factory" explainer

A topic (a video with burned-in captions, a post, an article, notes) in → a ~70 s 16:9 video: the whole factory
fades in with the topic's title; act 1 shows the old way on a slow belt (the problem, the slow mechanism, how it
adds up, overload, wrong without knowing); the centre block morphs; act 2 shows the new way on a belt twice as fast
(the new mechanism, rules in code, the exceptions, the correction loop, the closing line). Every tool (fetching,
music, beat measuring, voice, rendering, mixing, checks) is a `reelcrew` command; the scripts here are plain Python 3.

> Also follow **Rules for every video** in the `reelcrew` skill (`reelcrew skill reelcrew`, section 7): the frame
> size the page declares, Vietnamese fonts bundled next to the page, text measured to fit, safe zones, paid choices
> settled with the user first.

**Read all three before writing `story.js`:**
- `references/reference-video-analysis.md`: what the reference video shows and how it maps onto a topic.
- `references/style-guide.md`: identity, layout, rhythm, caption → picture patterns, the stills checklist, bugs met.
- `references/engine-api.md`: the `story.js` schema, hooks, coordinates, layout tuning.

The engine (`video/engine.js`) is shared by every topic and **not edited**; everything about one video is in
**`video/story.js`**. The template's story.js is the complete worked example ("AI agents: without Jev vs with Jev",
69.7 s, music only), so a fresh project renders at once.
Writing the story takes ~30–60 min; the render ~1–2 min per worker.

**Outputs** (`$P/renders/`): `<slug>.mp4` (1920×1080, 60 fps, −14 LUFS), `<slug>-sheet.jpg`.

```
topic ─reelcrew fetch/inspect─► captions + diagram blocks ─(you)─┐
music.py ─► audio/music.wav ─beats.py─► tempo, bar lines, lift ──┴─► video/story.js ─stills─► (look) ─► reelcrew render ─► video-only.mp4
                          (optional) voice.py ─► takes per caption ─┐
                                        mix-audio.py ─► final-mix ◄─┘ ─► finalize.py ─► <slug>.mp4 + sheet + check
```

## Variables
```bash
SK={{SKILL_ROOT}}/scripts      # this skill's scripts
P=<project folder>             # the new video: $HOME/reelcrew-projects/<slug> unless the user names one (short: Windows stops at 260 characters)
```
**Windows:** when the agent runs on Windows: in Claude Code run these commands with the Bash tool (Git Bash)
when it has it; without Git Bash, and in Codex, commands run in PowerShell: set each variable above as `$NAME = "<value>"` (quoted) and the commands then read the same; run one
command per call (Windows PowerShell 5.1 has no `&&`); use `Remove-Item`, `Copy-Item -Recurse` and
`New-Item -ItemType Directory -Force` for `rm`, `cp -R` and `mkdir -p`.

**Sample videos made with this skill:** `reelcrew examples isometric-factory-video --out-dir <folder>` downloads their
style frames (and says what each shows); look at them before the first story.

The scripts call `reelcrew`; if it is not on PATH, set `REELCREW` to its command.

## 0. Before you start
- `reelcrew doctor` must show ✓ for Render & export (Chrome, ffmpeg); for a new track, Music; for a voice-over, the
  voice and Transcription. Fix what it lists. Never print key values.
- Without a transcriber the video can still be finished for free (no speech checks, approximate word timing): see "No transcriber set up" at the end; offer it, the user chooses.
- Ask the user, once (AskUserQuestion), what is not clear yet:
  - **Frame:** this look is 16:9 (1920×1080). A 9:16 version is a new layout, never a squeeze.
  - **Sound:** the topic video's own music, a new instrumental (`reelcrew music make`), or none; a voice-over reading
    the captions (off by default).
  - Never decide for the user. Illustrative data you make up (tickets, ms, probabilities) is **said to be
    illustrative** when you report.

## 1. Scaffold
```bash
reelcrew python $SK/init-project.py $P --slug my-topic
```
Copies the page to `$P/video/` (engine, style, Inter + JetBrains Mono with Vietnamese, the worked example's story.js,
`page.js`), writes `$P/factory.json` (slug, music prompt, narration off) and makes `src/`, `ref/`, `audio/`, `renders/`.
Existing files are never overwritten.

## 2. Read the topic
- **A video whose script is burned-in captions and whose sound is only music** (as in the worked example): put it in
  `$P/src/`, then `reelcrew inspect $P/src/topic.mp4 --only sheet,audio --frames 28 --out-dir $P/src/inspect` and read
  the captions and the diagram from the sheet (`frames/` has each frame full size). Transcription of music-only sound
  invents sentences: **read the captions from the frames**, keep the owner's wording exactly.
- **An X post or article:** `reelcrew fetch <link> --out-dir $P/src` (`--want text,video` for its video).
- Write down: the caption list, the diagram's blocks (they become stations and nodes), and the "before / after" point
  that splits the two acts.

## 3. (When the user gives a new reference video) Measure the look
```bash
reelcrew fetch "<link>" --want text,video --out-dir $P/ref
reelcrew inspect $P/ref/<video file> --out-dir $P/ref/inspect      # cuts, frame, sheet, sound
```
Look at the sheet and frames full size. If the reference **differs** from this look (colours, layout, kind of motion),
say where and **ask the user** before using this skill. If only the accent differs, set `STORY.colors`.

## 4. Music and the beat grid
```bash
reelcrew python $SK/music.py $P --from $P/src/topic.mp4     # the topic video's own track → audio/music.wav
reelcrew python $SK/music.py $P --duration 70               # or a new instrumental from factory.json "music.prompt"
reelcrew python $SK/beats.py $P                             # tempo, bar lines, biggest lift, a shifts plan, belt check
```
- Set `STORY.duration` to the music's length and paste the `shifts` plan beats.py prints (act 1: a move every 2 bars,
  act 2: every bar), then move the act break to the story's turn, always onto a bar line.
- Put act 1's peak event (overload) on the bar nearest to the biggest lift.
- If beats.py says the tempo is not certain, listen and pass `--bpm <what you hear>`.
- A new track: the prompt in factory.json asks for a steady 120 BPM pulse with a lift in the middle; change the mood
  for the topic, keep it instrumental. The same prompt and length again reuse it (no credits).

## 5. Write `$P/video/story.js`
Follow `references/engine-api.md`. In this order:
1. `text`, `stations` (exactly 6), `acts` (1 or 2, centre kind `tower` or `dark`), `nodes` (≤ 6 on the desk),
   `sources`, `stackLabels`.
2. `shifts` from beats.py. `captions` are `[start, end, text]`: each caption lives within **one or two dwells** in which
   its event happens.
3. `items`: ticket k is at station s **after move k+s**. Work out which ticket is at ROUTE, DISPATCH, REVIEW in each
   dwell to flag the right one for each event (`lab`, `stale`, `unsure`, `refund`…).
4. The hooks `overlays`, `route`, `boxStyle`…: each caption gets **one concrete picture** showing exactly that sentence
   (the caption → picture table in `style-guide.md` §5).

Preview: open `$P/video/index.html?t=27.6` in Chrome (←/→ step 0.1 s, shift = 1 s).

## 6. Check with stills (required before the render)
```bash
reelcrew render $P/video/index.html --stills 7,19,26,27.6,34,43.3,47.8,55,62 --out-dir $P/renders/stills
reelcrew python $SK/beats.py $P            # again after editing shifts: every move on a bar line
```
Take **at least one still per caption** and read them full size against `style-guide.md` §7: text on text, labels on
blocks, chips under the caption card, cut-off cards, ledger rows off, a ticket flagged at the wrong station.

## 7. Voice-over (only when the user wants one)
Set `"narration": {"enabled": true}` in factory.json (engine and voice are filled at init from `reelcrew tts ls`).
```bash
reelcrew python $SK/voice.py $P            # every caption read aloud, best of 3 takes (VieNeu) → audio/vo/best.json
```
- A caption's spoken form goes in `"narration": {"say": {"4": "năm mươi nghìn ticket mỗi ngày"}}` (numbers in words,
  names as they sound); the caption on screen stays as written.
- A take longer than its caption's time is reported: shorten the line or widen the caption in story.js (keep it on
  its dwells). Then `voice.py $P --lines 4 --force`.

## 8. Render, mix, finalize
```bash
reelcrew render $P/video/index.html --fps 60 --workers 3 --out $P/renders/video-only.mp4 --force   # run in background
reelcrew python $SK/mix-audio.py $P         # music only (or music ducked under the voice) → audio/final-mix.wav
reelcrew python $SK/finalize.py $P [--crf 20]   # −14 LUFS, contact sheet, reelcrew check → renders/<slug>.mp4
rm $P/renders/video-only.mp4
```
Keep `--workers` at 3 or less (each worker is a Chrome). Look at `renders/<slug>-sheet.jpg` and the check before
reporting.

## Customising
- **One video**: edit the project's copies (`video/story.js`, `video/style.css`, `factory.json`).
- **Every video from now on**: ask the user first, then `reelcrew skill edit isometric-factory-video <file>` and edit
  **the path it prints**. Never edit the skill folder in place. Undo: `reelcrew skill reset isometric-factory-video [<file>]`.

## Report to the user
MP4 path and length; the stations and acts chosen; which data is illustrative; music (topic track or new) and the belt
check (moves on bar lines); voice or not; LUFS; anything from the check; the open choices (accent colour, brand text).

## No transcriber set up

The speech checks and word timing hear the voice through `reelcrew transcribe` (paid, a short call per run). Without a transcriber the video can still be finished for free; each script that would transcribe stops and names its option:

- `voice.py $P --takes 1` (one take per caption, kept without a speech check)
- `finalize.py $P --no-stt`

What is lost: the best-of-N pick, the check that the voice says the script, and exact word timing. Tell the user, and listen to the voice before delivering. Setting up a transcriber (`reelcrew transcribe setup elevenlabs`: an ElevenLabs voice key transcribes too; or `soniox`) brings them back; that is the user's choice, not a step to take for them.
