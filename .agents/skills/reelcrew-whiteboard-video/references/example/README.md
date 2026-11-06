# Worked example: "A seed becomes a tree" (made up)

One 16:9 scene of a narrated video (Vietnamese). Its subtitles (`scenes.json` › scene 1, cues 1–3):

| Cue | Time | Text |
|---|---|---|
| 1 | 0.4–3.6 s | Một người nông dân gieo một hạt giống nhỏ. |
| 2 | 3.8–7.2 s | Mưa rơi xuống, mầm cây nhú lên khỏi đất. |
| 3 | 7.4–11.0 s | Nhiều năm sau, cây lớn che bóng mát cho cả làng. |

The scene's `scenes.json` entry after stop 1 adds `"idea": "a small start grows into something big"` and
`"subject": "a farmer bending to plant a seed on the left, rain over a sprout in the middle, a big shady tree with a
few small houses on the right"`. Its line art is 1672×941 (the size an image engine returned).

`scene-01.annotation.json` places three regions in the story's order (setting and figure → action → result), each
starting near its cue (the scene starts at 0), one after another, the last ending at 10.9 s inside the 11.0 s scene
plus the hold. The sprout's box overlaps the tree's: the tree comes later and owns the overlap, so the sprout region
protects nothing; the farmer's box would cover the sprout's rain, so it is cut by the later box automatically.
