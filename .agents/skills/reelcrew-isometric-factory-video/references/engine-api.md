# Engine API: `story.js` → `engine.js`

`index.html` loads `story.js` (defines `window.STORY`), then `engine.js`, then `page.js`. The engine never reads the
clock: every frame is a pure `seek(t)`, so `reelcrew render` can split the frames across workers and the result is
always the same. `page.js` is the contract for `reelcrew render` (`renderFrame`, `DURATION`, `READY`) and exports
`EVENTS` (belt shift start times, for `beats.py`) and `CAPTIONS` (for the voice-over). In a browser,
`video/index.html?t=12.5` shows that moment; ←/→ step 0.1 s, shift+arrow 1 s.

**Only edit `story.js`.** If a video truly needs something the engine cannot do, add a general hook to the engine
(never a topic baked into it) and document the new hook in this file.

## Coordinates
- World units: **x** runs along the belt (down-right on screen), **y** down-left, **z** up.
  `ISO.P(x,y,z)` returns `[px, py]` = `[OX + (x−y)·cos30·S, OY + (x+y)·S/2 − z·S]`.
- `layout.S = 20` px per unit, origin `(OX, OY) = (500, 318)` is the head of the belt. One unit of x to the right =
  +17.3 px across and +10 px down.
- Quick estimate: for an object at screen point (sx, sy), `x − y = (sx − OX)/17.32` and `x + y = (sy − OY)/10`.

## Timeline
- `shifts: [{start, every, count, dur}]` expands into the list of belt moves. After move n, **ticket k is at station
  n − k** (0 = the loading plate, 1–4 = the gantries, 5 = dropped on a stack).
- Dwell n runs from `start_n + dur` to `start_{n+1}`. During it ROUTE holds ticket `n−2` (`c.tr`), DISPATCH holds
  `n−3` (`c.td`), REVIEW holds `n−4` (`c.tv`).
- For event X to happen in dwell n at station s, flag item `k = n − s`. In the worked example, dwell n = 15
  (42.93–44.43 s) has DISPATCH holding k = 12, so `stale: 1` is set on k = 12.
- `morph: [a, b]`: the centre block turns from act 0's kind into act 1's. `acts[1].from` is when every text switches to
  act 2. `introEnd` is when the intro title gives way to act 1's title.
- `start` of each segment comes from `beats.py` (a bar line of the music); `duration` is the music's length.

## STORY fields
| Field | Meaning |
|---|---|
| `duration` | seconds, exactly the music's length |
| `text` | `headerBold, headerRest, introLabel, introTitle, cardLabel, ledgerLabel, zone, logLabel, brandBold, brandRest` |
| `stations[6]` | `{name, col (3 letters for the ledger column), icon: ticket/state/route/dispatch/review/deliver}` |
| `acts[1..2]` | `{from, label, title, button, sheet, centre:{kind:'tower'/'dark', label}, plateTitle, plateSub, plateSubX, zoneSub}` |
| `layout` | `S, OX, OY, SX[5], BEND, BW, BZ, GH, zone{x0,x1,y0,y1,h}, plate{x,y,w,d,h}, deliver{x,y,w,d}, stacks{key:[x,y]}, log:[x,y]/null, sourceJoin{x,y,inY}, caption:[px,py]` |
| `sources` | `[[name, x, y], …]`: up to 4 pillars, in one diagonal row up to the right |
| `channels`, `idPrefix`, `idBase` | ticket code = `idPrefix + (idBase + k)`, channels rotate with k |
| `stackLabels`, `stacksBase`, `darkStacks` | stack names, starting counts (the factory is already running), stacks whose top layer is dark green |
| `nodes` | `{key:{at:[dx,dy] from the desk centre, glyph: coins/cube/flag/people/bubble/sheets, label, act2Only?}}`, at least 5 units apart |
| `items` | `{k, q (the question shown on the card and ledger), a (the true destination), …any flags}`; the engine adds `id, ch, p` |
| `captions` | `[[start, end, text], …]`; `captionTag(i)` for the small label above |
| `colors` | optional, overrides `ISO.C` (e.g. `{green:'#…'}`) |

## Hooks (all optional except `ticker`, `liveCard`, `ledgerDest`)
`c` is the current frame's context:
`{t, u, n, act2, A2, inDwell, dw, dS, dE, tr, td, tv, chosen, add(html), svg(str), kAt(s), SX, BW, BZ, GH, PC, NODES, STACKS, PLATE, LY, TK, dest, stackTop, stackCount}`.

| Hook | Returns / does |
|---|---|
| `dest(tk)` | key of the stack the ticket lands on |
| `focus(t)` | the station highlighted in green (−1 = none) |
| `route(tr, c)` | `{node, k}`: the node chosen on the router desk, k from 0 to 1 its brightness (the engine draws the lit trace and the tag) |
| `boxStyle(tk, p, c)` | `{top?, lift?}`: colour of the box's top face and how far it lifts |
| `reviewAlert(tv)` | true: the posts at REVIEW turn red one by one |
| `packetRate(t)`, `sourceHot(i, t)` | packet speed; a source pillar lit green |
| `adjustStacks(counts, c)` | fix the counts (e.g. minus 1 when a ticket is sent back) |
| `floorItems(c)` | SVG string drawn on the floor before the belt (e.g. a queue piling up) |
| `extraItems(c)` | `[{d: x+y, s: svg}]`: objects sorted by depth (e.g. a flying box) |
| `overlays(c)` | chips, packets, loops: `c.add(html)` for HTML (classes `chip`, `chip g`, `chip r`, `tag`, `tag g/r/k`) and `c.svg(str)` for SVG |
| `ticker(t, c)` | `{html, alert?}` for the status line in the header |
| `liveCard(tk, c)` | `[[label, 'done'/'cur'/'', detail], …]` (6 rows) |
| `ledgerDest(tk, p, c)` | `{text, bad?}` (called only when p ≥ 2.6) |
| `ledgerBad(tk, s, p, c)` | true: cell s of that row turns red |

## Tools in `window.ISO`
`P, box(x,y,z,w,d,h,{top,fx,fy,stroke,op}), cyl(x,y,z,r,h,{top,side}), ring, line(a,b,{c,w,dash,op}), poly(points,…), floorText(x,y,z,text,size,{mono,c,fw,ls}),
along(path,k), glyph(kind,x,y,on), clamp, lerp, ease, eo, win, esc, C`.
A chip placed in world coordinates: `const [x,y] = P(SX[3], -1, 6.3)`, i.e. just above the DISPATCH gantry. Chips use
`transform: translate(-50%, -100%)`.

## Adjusting the layout
- Adjust with stills (`reelcrew render $P/video/index.html --stills <t,…> --out-dir $P/renders/stills`) and look at
  them at full size. Do not guess.
- To change the station spacing or belt length: edit `SX` (5 values) and `BEND`, about 10.5 units apart. `zone.x1` must
  be about 4 units past `SX[4]`.
- The router desk sits at negative y (behind, to the right). After moving the desk or the sources, take stills again to
  be sure they do not overlap.
- The engine always has **exactly 6 stations** and at most 6 nodes. More needs an engine change: ask the user first.
