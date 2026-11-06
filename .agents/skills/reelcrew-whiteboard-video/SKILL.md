---
name: reelcrew-whiteboard-video
description: Make a whiteboard drawing video (16:9 or 9:16) from subtitles, a voice or a script, Vietnamese or English. Each 25–35 s scene is one line-art picture on warm paper; a hand draws it region by region in the story's order (the pen lays the line art in one continuous stroke, then washes in the colour), with the voice, a ducked music bed, a pencil sound and optional burned-in subtitles, at −14 LUFS. Every step stops for the user's OK. Use when the user asks to "làm video vẽ tay bảng trắng", "video whiteboard từ phụ đề / file SRT", "biến kịch bản thành video vẽ tay", "video bàn tay vẽ minh hoạ theo lời thoại", "whiteboard animation from my SRT", "hand-drawn explainer from this voice-over", or "turn this script into a whiteboard drawing video".
author: 江哥是老登啊
---

# Whiteboard drawing video (16:9 or 9:16, Vietnamese or English)

Subtitles, a voice or a script in → a whiteboard video out: one line-art picture per 25–35 s scene, drawn region by
region in the order the story tells it, then coloured; the voice, a music bed and a pencil sound under it. Every
tool (voice, speech-to-text, images, music, sounds, rendering, mixing, delivery) is a `reelcrew` command; the scripts
here are plain Python 3, and the drawing is a canvas page (`video/whiteboard.js`) that `reelcrew render` films.

> Also follow **Rules for every video** in the `reelcrew` skill (`reelcrew skill reelcrew`, section 7): the frame
> size the page declares, safe zones, paid choices settled with the user first.

Read first: `references/style-and-regions.md` (the picture rules, how to cut a scene into regions, timing, masks,
quality checks) and `references/engine.md` (the engine's options). Worked example: `references/example/`.

**Outputs** (`$P/renders/`): `<slug>.mp4` (1920×1080 or 1080×1920, 30 fps, −14 LUFS), `<slug>-sheet.jpg`,
`check.json`.

```
SRT ± voice | voice ─transcribe─► vo.srt | script ─voice.py─► vo.wav + vo.srt
   vo.srt ─parse-srt.py─► scenes.json ─(you: idea, subject)─► line-art.py ─► video/scenes/<scene>.png
   (you) ─► video/scenes/<scene>.annotation.json ─check-regions.py─► Studio Regions view | review-regions.py
   build-timeline.py ─► video/timeline.js ─reelcrew render─► renders/video-only.mp4
   music.py ─► bed   mix-audio.py ─► final-mix (voice, ducked bed, pencil)   finalize.py ─► <slug>.mp4 + check
```

## Variables
```bash
SK={{SKILL_ROOT}}/scripts      # this skill's scripts
P=<project folder>             # the new video: $HOME/reelcrew-projects/<slug> unless the user names one (short: Windows stops at 260 characters)
```
**Windows:** when the agent runs on Windows: in Claude Code run these commands with the Bash tool (Git Bash)
when it has it; without Git Bash, and in Codex, commands run in PowerShell: set each variable above as `$NAME = "<value>"` (quoted) and the commands then read the same; run one
command per call (Windows PowerShell 5.1 has no `&&`); use `Remove-Item`, `Copy-Item -Recurse` and
`New-Item -ItemType Directory -Force` for `rm`, `cp -R` and `mkdir -p`, copy a file instead of `ln -s`, and write out `{a,b}` lists in full.

**Sample videos made with this skill:** `reelcrew examples whiteboard-video --out-dir <folder>` downloads their style
frames (and says what each shows). None yet: it says which skills have samples.

The scripts call `reelcrew`; if it is not on PATH, set `REELCREW` to its command.

## The stops
Each **Stop** below waits for the user's clear OK before the next step starts. Silence, an earlier general OK or no
objection is not an OK. A change asked at a stop redoes only that step, then stops again. The one thing that follows
a step without a stop: when step 5 writes the annotations, the region editor opens at once (it is part of step 5).
Speak the user's language (Vietnamese or English) in every message.

## 0. Before you start
- `reelcrew doctor`: Render & export must be ✓; Images when new line art is made; a voice (VI or EN) for a script;
  Transcription for a voice without subtitles. Fix what it lists. Never print key values.
- **Ask once**, then keep the answers:
  - the input: an SRT (with or without its voice file), a voice file alone, or a script;
  - the aspect: 16:9 or 9:16;
  - the language: vi or en;
  - for a script, the voice: free offline (VieNeu for Vietnamese, Kokoro for English) or a paid one, with its price;
  - burned-in subtitles (default off), music (default on), pencil sound (default on).
- Before any paid call (images, a paid voice or transcriber), search what exists first (`reelcrew library ls --kind
  image|music`, the user's own files) and get the user's OK with the cost.

## 1. Scaffold
```bash
reelcrew python $SK/init-project.py $P --aspect 16:9 --lang vi [--subtitles] [--no-music] [--no-pencil] [--bare-tip] [--slug <name>]
```
Makes `video/` (the page, the engine, `assets/`, `licenses/`), `video/scenes/`, `audio/`, `renders/`, `review/`,
`prompts/line-art.txt` and `whiteboard.json` (the answers of step 0 and the engine options). Existing files are never
overwritten.

## 2. Voice and subtitles
Every later step reads `$P/audio/vo.srt` and, when there is one, `$P/audio/vo.wav`.
- **SRT and voice:** copy them in as `audio/vo.srt` and `audio/vo.wav` (convert another format:
  `reelcrew inspect <file>` shows it; any audio ffmpeg reads works with `reelcrew deliver` later, but keep `.wav`).
- **Voice alone:** copy it in as `audio/vo.wav`, then
  ```bash
  reelcrew transcribe $P/audio/vo.wav --out-dir $P/audio/transcript --adapter whisper --lang vi   # free, local (`reelcrew transcribe setup whisper` once)
  reelcrew python $SK/parse-srt.py $P --words $P/audio/transcript/vo.words.json                  # words → subtitle cues in audio/vo.srt, and the scene plan
  ```
  (the transcript's own `.srt` has one cue per word). Soniox or ElevenLabs only when the user picks one and approves
  its cost.
- **Script:** write it to `$P/script.txt`, one subtitle line per line (8–16 words), then
  ```bash
  reelcrew python $SK/voice.py $P            # tts takes, one per line → audio/vo.wav + audio/vo.srt
  ```
- **SRT alone:** copy it to `audio/vo.srt`; the video has no voice and each scene lasts as long as its drawing.

## 3. Scene plan
```bash
reelcrew python $SK/parse-srt.py $P         # → scenes.json: cues and scenes of 25–35 s (--target-sec 30 --min-sec 25 --max-sec 35)
```
For each scene, propose and write into its entry of `scenes.json`: `"idea"` (the one thing it says) and `"subject"`
(what its picture shows, for the image prompt), and show the user: the scene number, the idea, the subject, its
subtitle range (`cueRange`) and its length. One idea per scene.
**Stop 1:** the scene plan.

## 4. Line art
```bash
reelcrew python $SK/line-art.py $P --dry-run    # the prompts (prompts/<scene>.txt) and what would be made
reelcrew python $SK/line-art.py $P              # one image per scene → video/scenes/<scene>.png (--reuse: the library first)
```
- The prompt is `prompts/line-art.txt` (paper `#F5EBD7`, dark grey lines, a few red/orange/blue accents, no text,
  wide gaps between subjects) plus the scene's `subject`. Each image is a paid call unless the library has it: tell
  the user the count and the price first. `--only scene-02 --force` redoes one.
- Images made by the agent (a cloud sandbox has no image key): save each as `$P/video/scenes/<scene>.png` in the
  video's aspect, following `prompts/line-art.txt`; line-art.py keeps them.
- Look at every image: no text, clear gaps between subjects, the style of the others.
**Stop 2:** the images.

## 5. Regions
For each scene, in this order: read its subtitles (`scenes.json` › `cues` in its `cueRange`), then look at its image
and get its pixel size, then write `$P/video/scenes/<scene>.annotation.json` (format and rules:
`references/style-and-regions.md`; a whole file: `references/example/scene-01.annotation.json`):
- the regions in the story's order: setting → key figure → action → reaction;
- `region` boxes in whole pixels of the image (`canvas` = the image's size);
- `subtitle` (the cue it shows) and `narrativeRole` per region; `sequence` 1..n;
- `reveal.startMs`/`durationMs` in ms **from the scene's start**, following the subtitles: a region starts near its
  cue's time minus the scene's `startMs`, regions one after another (one pen), the last ending at least 0.5 s
  before the scene ends;
- `reveal.protectedRegions` where a box covers part of a later subject.
```bash
reelcrew python $SK/check-regions.py $P        # errors stop (fix them); warnings are shown to the user
```
Then open the editor at once:
- **Claude Code or Claude Desktop on macOS or Windows** (where Claude Desktop runs):
  `open_studio` with `view: "regions"` and `scene: "<first scene>"` (the Studio's Regions view: drag the boxes,
  reorder, retime, link subtitles, preview, save).
- **Elsewhere (Codex, Claude Code on Linux or WSL2, a Cloud Agent's machine):** `reelcrew python $SK/review-regions.py $P`
  and tell the user where `review/regions.html` is (on Linux, how they open it: the reelcrew skill, section 9); they
  ask for changes in chat and you edit the annotation files.
**Stop 3:** the regions and their times.

## 6. Check stills
```bash
reelcrew python $SK/build-timeline.py $P       # video/timeline.js; prints the stills commands below with their times
reelcrew render $P/video/boxes.html --stills <one time per scene> --out-dir $P/review/boxes
```
One numbered still per scene (the full image, every box with its number, label, times and pen direction) and
`sheet.jpg`. Check: numbers follow the story, boxes cover their subjects, nothing outside the canvas.
**Stop 4:** the numbered stills.

## 7. Adjust and save
Changes in the Regions view (`open_studio` `view: "regions"`, saved to the annotation files) or by chat on the
review page; then `check-regions.py` again (and `review-regions.py` again on the review page).
**Stop 5:** the final regions and times.

## 8. Render
```bash
reelcrew python $SK/build-timeline.py $P       # again after any change of scenes, voice or options
reelcrew render $P/video/index.html --stills <start,mid,end> --out-dir $P/review/<scene>                # one scene's check
reelcrew render $P/video/index.html --from <start> --to <end> --fps 30 --out $P/renders/<scene>.mp4     # that scene alone
```
build-timeline.py prints both commands per scene: stills at its start, the middle of a region that overlaps another,
and its end. Check: the first frame is clean paper, no later region shows early, protected areas stay hidden, the
pen follows the stroke, the last frame is the full picture.
**Stop 6:** the scene.
```bash
reelcrew render $P/video/index.html --fps 30 --workers 2 --out $P/renders/video-only.mp4 --force
```

## 9. Sound and delivery
```bash
reelcrew python $SK/music.py $P [--from <track>]   # the user's or a library track, else a free calm synth bed
reelcrew python $SK/mix-audio.py $P               # voice + bed ducked under it + pencil through each ink part
reelcrew python $SK/finalize.py $P                # subtitles (if on) → deliver −14 LUFS + sheet → check
```
- Music off (`"music": false`) or pencil off (`"pencil": false`) in `whiteboard.json` leaves them out. With no voice,
  no music and no pencil: `finalize.py $P --silent`.
- Look at `renders/<slug>-sheet.jpg`; read every `check` finding.
**Stop 7:** the final video.

## 10. Report
What was made (the MP4 path, its length, size, LUFS, the check verdict), the paid calls and their cost (images,
voice, transcription; none for the free path), what was reused from the library, and where the files are.

## Customising
- **One video:** edit the project's copies (`whiteboard.json` › `engine`, `video/*.js`, `prompts/line-art.txt`). A
  scene's annotation can override any engine option under `"engine"` (e.g. `{"inkPath": "skeleton"}` for clean
  line art). `whiteboard.json` options: `inkPath` grid|skeleton, `colorFill` contour-wipe|brush, `pause`
  heavy|auto|light|off, `fps`, `holdMs`, `bareTip`, `hand` (references/engine.md).
- **The hand:** the drawing hand `video/assets/hand.png` (RGBA, the pen tip at `hand.anchorX`/`anchorY`, 0–1 of the
  cropped image) is drawn at the pen point by default. `bareTip: true` (`init-project.py --bare-tip`) draws a plain pen
  tip instead. Another hand: replace the file and measure its tip into `hand.anchorX`/`anchorY`.
- **Every video from now on:** ask the user first, then `reelcrew skill edit whiteboard-video templates/prompts/line-art.txt`
  (or `templates/video/whiteboard.js`, `scripts/init-project.py`, …) and edit **the path it prints**. Never edit the
  skill folder in place: updates overwrite it. Undo: `reelcrew skill reset whiteboard-video [<file>]`.

## Gotchas
- The drawing follows `startMs`, not `sequence`: check-regions.py warns when they disagree.
- A region the next scene starts over is cut: keep each scene's regions inside its length (check-regions.py warns).
- Boxes overlap: the later region owns the overlap. A subject of an earlier region that a later box covers needs a
  `protectedRegions` box on the earlier region, or a smaller later box.
- The page reads the annotation files at every render: a save in the Studio needs no other step; a new scene, a new
  voice or a changed option needs `build-timeline.py` again.
- A browser opened on `video/index.html` directly cannot read the images (file access): look with
  `reelcrew render --stills`.
