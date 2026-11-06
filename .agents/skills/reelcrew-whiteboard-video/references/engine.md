# The engine (`templates/video/whiteboard.js`) and its page (`page.js`)

A canvas port of a region renderer written with OpenCV and numpy. Frames depend only on their index, so any frame
can be drawn alone (`?t=`, `render --stills`, parallel workers).

## Options (`whiteboard.json` › `engine`; a scene's annotation can override any under `"engine"`)
| Option | Default | Meaning |
|---|---|---|
| `fps` | 30 | frames per second of the drawing's clock, for the whole video (a scene cannot override it); the video always renders at 30 fps (SKILL.md step 8), this only sets the drawing's clock |
| `inkPath` | `grid` | `grid`: the pen walks cell centres of a 10 px grid and fills whole cells as it reaches them (solid, safe); `skeleton`: the pen follows the thinned line (Zhang-Suen), smoother on clean line art |
| `colorFill` | `contour-wipe` | `contour-wipe`: the colour washes down the region, held back at the lines; `brush`: a soft round brush follows the pen path |
| `pause` | `heavy` | pauses in the ink part (`heavy` 3 % of its frames, `light` 0.8 %, `auto` by density, `off`) |
| `capLongEdge` | the video's long edge | the drawing's long edge in pixels |
| `gridEdge`, `brushRadius`, `inkRevealRadius`, `sampleStep` | 10, 40, 4, 2 | sizes at a long edge of 1080, scaled with it |
| `wipeDecay`, `wipeDelayRatio`, `wipeBlocks` | 0.86, 0.04, 18 | the contour wipe's resistance decay, hold-back and the hand's sweeps |
| `holdMs` | 1000 | after the voice ends, the last scene holds this long |
| `bareTip` | `false` | `false` draws `hand.file` (RGBA; the shipped hand's tip is at 0.0025, 0.3253) with its tip at `hand.anchorX`, `hand.anchorY`; `true` (`--bare-tip`) a plain pen tip |
| `paper` | `#F6F1E3` | the paper colour; the image's own background is matched to it |

## What happens
1. **Loading** (once per scene): the image scaled to the long edge (area average), aligned to the grid; grey; the
   adaptive threshold (Gaussian 15×15, C 10) gives the line pixels; the image's background becomes the paper colour.
2. **Per region**, in `startMs` order: the allowed mask; the pen path (grid: components of inked cells, split at
   thin bridges, small pieces merged, subject → text → contour, each walked from its densest cell; skeleton: thinned
   strokes traced along the straightest branch, resampled to 2.5 px, smoothed once, ordered top to bottom); the pen
   samples (2 px apart) and lifts.
3. **Reveal times:** each line pixel gets the frame the pen reaches it, each coloured pixel the frame the wipe
   reaches it (or the brush stamps); a frame is the paper, the ink so far, the colour so far, and the pen.
4. **Timing:** a region's ink frames = max(1, round(duration·2/3·fps/1000)), colour frames = max(1,
   round(duration/3·fps/1000)); static frames until each region starts; after the last region the full picture to
   the scene's end and at least 0.5 s. Rounding follows Python's (half to even).

## The page
- `timeline.js` (build-timeline.py): `size`, `voiceMs`, `engine`, `scenes: [{name, image, startMs}]`.
- `window.SIZE`, `DURATION`, `READY` (false, then true after the files, the hand and the first scene's precompute),
  `renderFrame(t)`; `?render=1` (no preview keys), `?t=` (that moment in a browser).
- `render --data`: `SCENES` (per scene `start`, `duration`, `size`, `regions` with `start`/`end` in video seconds),
  `SFX_CUES` (`{name: "pencil", t, end, scene, region}`: each region's ink part), `PROBLEMS` (`[]` when all is
  right; else what is missing).
- `boxes.html`: the same page with `window.BOXES = true`: each scene's full picture with numbered boxes, labels,
  times, protected areas and pen directions (`index.html?boxes=1` in a browser).
- Memory: a scene's per-pixel data is built when its first frame is drawn and at most two scenes are kept.

## Against the original
Matched: the image scale and grid alignment, the grey and threshold arithmetic, the paper match, the masks, both pen
paths, both colour fills, the frame counts and Python's rounding. Fixed: the grid fallback of an empty region (the
original called the ink step with one argument too many and crashed) and `pause` (parsed but never used by the
original's region renderer; here it works, default `heavy`; `off` gives the original's frames). Approximated: the
anti-aliased pen line (a disc of radius `inkRevealRadius` + 1) and the hand's scaling (the browser's). The pilot
against the original's own example differs on 0.2 % of pixels or less at six times.
