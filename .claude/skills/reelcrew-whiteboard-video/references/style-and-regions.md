# Style and regions

## The pictures (every scene the same look)
Every line-art prompt starts with `prompts/line-art.txt`; check each image against it before stop 2.
- **Look:** minimal hand-drawn sketch, a calm doodle; one idea per picture, simple outlines, lots of empty paper.
- **Colour:** warm paper `#F5EBD7`, dark grey lines; only small red, orange or blue accents.
- **Layout:** wide gaps between subjects, so each can be one region; no overlaps.
- **Never:** text, letters, numbers, labels; realism, 3D, texture; busy backgrounds; saturated colour.
- The engine replaces the paper of the image with its own paper colour (the corner colour, within a small
  difference), so a slightly different paper still matches the drawing's background.

## Regions: what to draw, in what order
1. **Read first, then look.** The scene's subtitles (its `cueRange` in `scenes.json`) and the image itself, with its
   pixel size. Never place regions from the subtitles alone, and never order them only left to right.
2. **Story order:** list the events the subtitles tell, map each visible subject to an event, and draw in the order
   setting → key figure or object → action or change → reaction or result.
3. **Pixel boxes:** `region` is `{x, y, width, height}` in whole pixels of the image, top-left origin;
   `canvas.width`/`height` are the image's size. No percentages, no estimates in another frame.
4. **Fields per element:** `id` (unique), `label`, `sequence` (1..n), `narrativeRole` (its role in the story, in the
   user's language), `subtitle` (the cue text it shows), `region`, `reveal` (`direction`, `startMs`, `durationMs`,
   `protectedRegions`), `handPath` (`start`, `end` in image pixels: the direction shown on the numbered stills and
   in the Studio). The scene also has `sceneId`, `storyBasis` (the events in one sentence) and `sceneDurationMs`.
5. **Check:** every box inside the canvas and over its subject; the order matches the subtitles;
   `check-regions.py` passes.

## Timing (a scene's own clock)
- `startMs` and `durationMs` count from the scene's start. With a voice, scene k starts at its first cue (scene 1 at
  0); a region that shows cue c starts near `cue.startMs − scene.startMs`.
- **One pen:** regions follow each other (the next `startMs` ≥ the previous start + duration, with 100–300 ms of
  breath when there is room). Overlapping times are still drawn one after another in `startMs` order.
- **Ink then colour:** each region's duration is split 2:1: the pen lays the line art in two thirds, the colour
  washes in over the last third. A first guess: about 150 px of drawn line per second.
- **The end:** after the last region the full picture holds at least 0.5 s, then the scene runs to its end (the next
  scene's start, or the voice's end plus `holdMs`). Without a voice a scene lasts `sceneDurationMs` (at least its
  drawing plus 0.5 s).
- `reveal.direction` and `handPath` do not steer the pen (the engine finds the strokes); they show on the numbered
  stills and in the Studio.

## Masks (what may show when)
- At time t a region shows only pixels the pen has reached; a region that has not started shows nothing.
- A region's **allowed mask** is its box minus every later region's box minus its own `protectedRegions`. The pen and
  the colour stay inside it, so a later region never shows early.
- Use `protectedRegions` (same pixel boxes) when a box is larger than its subject and covers part of another
  subject that must wait for its own region.
- Pixels in no allowed mask (a protected area no later region covers) appear with the full picture at the end.

## Quality checks (stills at the start, a region's middle, the end of each scene)
- The first frame is clean paper; no line shows before its region.
- At the middle of a region next to another: the later region and the protected areas are still hidden.
- The pen (or hand) sits on the line being drawn.
- The last frame is the full picture, held at least 0.5 s.
- The numbered stills (`boxes.html`) carry the same numbers, labels and boxes as the annotation.
