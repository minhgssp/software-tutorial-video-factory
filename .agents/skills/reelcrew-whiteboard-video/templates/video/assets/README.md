# The drawing hand

`hand.png` here is the hand the engine draws at the pen point (`whiteboard.json` › `engine.bareTip` false, the
default): an RGBA cartoon hand with a black outline holding a plain pen with no text on it, background transparent,
the forearm faded out. Its pen tip is at `anchorX` 0.0025, `anchorY` 0.3253. The engine crops it to its
opaque pixels, scales it to 493 px high at a long edge of 1080 (scaled with the video), and puts the point
`engine.hand.anchorX`, `engine.hand.anchorY` (0–1 of the cropped image; 0, 0 = its top-left corner) on the pen
point. Without the file, or with `bareTip: true` (`init-project.py --bare-tip`), the engine draws a plain pen tip instead.

It was made once for this skill with `reelcrew image create --isolated` (its line is in `../licenses/README.md`).
