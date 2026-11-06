# Drawing kit API (engine.js + kit.js)

Canvas 1920×1080, deterministic: `renderFrame(t)` must draw the same image for the same `t` —
no `Math.random()`, no `Date.now()`. Use `rnd()` (seeded) or `hash(i)` for variety.

## Timing / easing (engine.js)
| fn | meaning |
|---|---|
| `prog(u, a, b)` | 0→1 while u goes a→b (clamped) |
| `win(u, t0, t1, d=.35)` | fade-in at t0, fade-out at t1 (0..1) |
| `eo(x)` ease-out, `eio(x)` ease-in-out, `back(x)` overshoot | easing |
| `popS(u, t0)` | overshoot scale 0→1 over .45s (pop-in) |
| `lerp`, `clamp`, `frac`, `mix(hexA, hexB, t)` | math / colour |
| `typed(txt, u, t0, cps=28)` | typewriter substring |

## Primitives (engine.js)
| fn | use |
|---|---|
| `stroke(points, {c, w, closed})` | wobbly crayon line |
| `fillC(points, fill, {hatch, ang, sp, ha, line, w})` | filled shape + hatch + outline (`line:null` = no outline) |
| `rect(x,y,w,h)`, `ell(cx,cy,rx,ry)`, `blob(cx,cy,rx,ry,k)` | point lists |
| `label(txt,x,y,{size,c,a,align,pop})` / `tlabel(txt,x,y,u,t0,t1,o)` | hand-lettered text (Marker Felt; Vietnamese diacritics render fine) |
| `arrow(...)` / `tarrow(u,t0,x0,y0,x1,y1,t1,o)` | animated curved arrow |
| `puff(x,y,r,a,col)` | cloud / steam / smoke |
| `paperBG()`, `spaceBG()` | backgrounds (paper texture, starry night) |
| `mascot(x,y,s,{walk,moving,lookX,lookY,happy,arms})` | orange box host character, origin = feet, ~211px tall at s=1 |
| globals `GA` (alpha multiplier), `SC` (stroke scale) | managed by `fade()` / `local()` |

## Kit (kit.js)
| fn | use |
|---|---|
| `fade(a, fn)` | draw fn at alpha a (nests) |
| `local(x,y,s,rot,fn)` | draw fn in a translated/scaled/rotated frame (keeps stroke width right) |
| `ground(y)`, `shadow(x,y,rx)`, `dim(a)`, `gradBG(c1,c2)` | scene basics; `dim` = paper overlay to focus a new idea |
| `robot(x,y,s,{bob,look,happy,hat:'chef'|'grad',arm,armR,alert,rot,col})` | teal agent bot, origin = wheels, ~330px tall at s=1 |
| `sign(txt,x,y,{size,bg,fg,pop,rot})` / `tsign(txt,x,y,u,t0,t1,o)` | text on a paper card — main way to show keywords |
| `bubble(x,y,w,h,txt,{a,pop})` | speech/thought bubble |
| `check(x,y,s,p)`, `xmark(x,y,s,p)` | animated ✓ / ✗ (p = draw progress) |
| `prCard(x,y,s,{mark:'ok'|'x',rot,mp})` | document / pull-request card |
| `windowBox(x0,y0,w,h,title,{bar,fill})` | app window / terminal (`fill:'#1F1D26'` + `mono()` for code) |
| `mono(txt,x,y,{size,c})` | monospace text for code/terminal |
| `meter(x,y,w,h,v,{col,name})` | progress/trust meter |
| `badge(x,y,s,iconFn,{ring,glow})` + `chatIcon bellIcon bugIcon dbIcon chartIcon` | round service icons |
| `chefHat`, `strawHat`, `flower`, `weed`, `sparkle`, `sweat` | props / reactions |
| `desk(x,y,w)`, `laptop(x,y,s,glow)`, `coin(x,y,r,a)`, `bulb(x,y,s,on)` | office / idea props |
| `card(x,y,w,h,title,{bg,size,icon,pop})` | titled paper card with an icon fn drawn at its centre |
| `chart(x0,y0,w,h,p,{f,c,dash,xl,yl,axes})` | animated line chart; `f(t)` 0..1 curve, `p` draw progress |
| `chalkboard(x0,y0,w,h)` + `chalk(txt,x,y,{size,a})` | blackboard with chalk text |
| `thumbScene(u)` | thumbnail frame from `lesson.thumbnail` (also the `thumb` intro scene) |
| colours `TEAL RED GREEN BLUE PURPLE CYAN GOLD INK PAPER CREAM` | palette |

## Layout rules
- Safe area for action: x 80–1840, y 60–840. y > 850 = subtitles.
- One keyword sign per beat; title sign at y≈100–150.
- A new idea inside the same scene: `fade(1 - prog(u, b[k]-.2, b[k]+.3), oldLayer)` then fade the new layer in.
- Scene transitions (0.4s crossfade) are automatic.
- Bilingual subtitles are drawn by index.html from timeline.js — never draw subtitles in scenes.
- Characters: only the kit's original mascot/robot or new original designs. Never draw recognisable
  copyrighted characters or real brand logos.
