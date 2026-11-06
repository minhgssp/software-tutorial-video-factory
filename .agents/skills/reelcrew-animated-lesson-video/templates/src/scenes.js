// Scene drawing functions. Signature: fn(u, b, D)
//   u = seconds since the scene started, b = narration line start times (scene-relative), D = scene duration.
// Sync every visual event to a beat: appear at b[i] (+ small offset), leave with win(u, t0, t1).
// Keep action above y≈840 — the bottom band is reserved for the bilingual subtitles.
// Full worked example (10 scenes): references/example-scenes.js in this skill's folder (reelcrew skill animated-lesson-video)

function s1(u, b) {
  paperBG(); ground(780);
  // title card during the scene-1 lead (lesson.first_lead seconds)
  tlabel(TIMELINE.title, 960, 400, u, .2, b[0] - .4, { size: 120, c: INK });
  // mascot walks in, then reacts on the last beat
  const x = lerp(-220, 420, eo(prog(u, b[0] - .3, b[0] + 1.5))), yay = u > b[b.length - 1] + .4;
  shadow(x, 780, 120);
  mascot(x, 780, 1.1, { walk: u * 1.7, moving: u < b[0] + 1.5, lookX: 7, happy: yay ? 1 : 0, arms: yay ? 1 : 0 });
  // agent bots pop in on beat 1
  [1100, 1300, 1500].forEach((rx, i) => { const p = popS(u, (b[1] ?? b[0]) + .3 + i * .25); if (p > 0) robot(rx, 780, .5 * p, { bob: Math.abs(Math.sin(u * 5 + i)) * 8, happy: yay ? 1 : 0 }); });
  tsign('AI agents', 1300, 520, u, (b[1] ?? b[0]) + 1);
}

// Map lesson.json scene ids → functions. Unmapped ids render a placeholder showing their beats.
const SCENE_FNS = { 's1-hook': s1 };
