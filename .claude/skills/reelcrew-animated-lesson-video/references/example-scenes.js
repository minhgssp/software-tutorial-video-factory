// Worked example ('Trust Your AI Agents'): 10 scenes synced to narration beats. Depends on engine.js + kit.js.
// ---------- scenes ----------
function s1(u, b) {
  paperBG(); ground(780);
  tlabel('Trust Your AI Agents', 960, 400, u, .2, 2.2, { size: 130, c: INK });
  tlabel('from babysitting 5 bots to running 100', 960, 520, u, .7, 2.2, { size: 46, c: '#7A6E62' });
  const wx = lerp(-220, 380, eo(prog(u, 2.3, 4.2))), yay = u > b[2] + .4;
  shadow(wx, 780, 120);
  mascot(wx, 780, 1.1, { walk: u * 1.7, moving: u > 2.3 && u < 4.2, lookX: 7, happy: yay ? 1 : 0, arms: yay ? eo(prog(u, b[2] + .4, b[2] + .7)) : 0 });
  for (let i = 0; i < 24; i++) { const c = i % 6, r = Math.floor(i / 6), t0 = b[0] + .2 + i * .07, p = eo(prog(u, t0, t0 + .45));
    if (p > 0) prCard(1080 + c * 118 + (r % 2) * 30, lerp(-120, 700 - r * 118, p), .85, { mark: 'ok', rot: (hash(i) % 20 - 10) / 150, mp: prog(u, t0 + .4, t0 + .7) }); }
  const n = Math.round(2000 * eo(prog(u, b[0] + .2, b[0] + 2.6)));
  if (u > b[0]) sign(`${n.toLocaleString('en-US')} PRs / month`, 1440, 150, { size: 56, bg: GOLD, pop: prog(u, b[0], b[0] + .45) });
  [[640, 0], [790, .25], [940, .5]].forEach(([rx, d], i) => { const p = popS(u, b[1] + .3 + d); if (p > 0) robot(rx, 780, .42 * p, { bob: Math.abs(Math.sin(u * 5 + i)) * 8, happy: yay ? 1 : 0, arm: yay ? .8 : 0 }); });
  tsign('AI agents', 790, 560, u, b[1] + .9, b[2]);
  if (u > b[2]) fade(prog(u, b[2], b[2] + .25), () => local(960, 330, lerp(2.2, 1, eo(prog(u, b[2], b[2] + .35))), -.06, () => {
    fillC(rect(-300, -95, 600, 190), '#FFFDF6', { hatch: RED, ha: .12, line: RED, w: 9 }); label('TRUST', 0, 4, { size: 150, c: RED }); }));
}

function s2(u, b) {
  gradBG('#F3B08E', '#F7DDB0');
  for (let i = 1; i < 12; i++) stroke([[i * 160, 0], [i * 160, 700]], { c: '#E9A27F', w: 2, a: .5 });
  const chop = i => .25 + .35 * Math.abs(Math.sin(u * 7 + i * 1.3));
  [[900, 0], [1220, 1], [1540, 2]].forEach(([x, i]) => { const p = popS(u, .3 + i * .25); if (p > 0) robot(x, 745, .72 * p, { hat: 'chef', armR: chop(i), arm: .15, happy: u > b[2] + .6 ? 1 : 0 }); });
  mascot(290, 760, 1.1, { lookX: u > b[2] ? 8 : 4, happy: u > b[2] + .6 ? 1 : 0, arms: u > b[1] ? .6 : 0 }); chefHat(290, 760 - 192 * 1.1, 1.05);
  fillC(rect(-20, 700, 1960, 400), '#C98B5B', { hatch: '#8E5A34', ang: -.2, sp: 12, line: INK, w: 5 });
  fillC(rect(-20, 690, 1960, 26), '#E3B07F', { w: 4 });
  [900, 1540].forEach(x => { fillC(rect(x - 90, 668, 180, 24), '#EBCB9C', { w: 3.5 }); [-40, 0, 38].forEach((d, k) => fillC(ell(x + d, 655, 17, 14, 12), [RED, GREEN, GOLD][k], { w: 3 })); });
  fillC(rect(1160, 600, 120, 90), DARK, { w: 4 });
  for (let k = 0; k < 4; k++) { const f = frac(u * .45 + k / 4); puff(1220 + Math.sin(f * 7 + k) * 20, 590 - f * 170, 16 + f * 26, (1 - f) * .9); }
  tlabel('Factory', 700, 150, u, b[0], b[3], { size: 60, c: '#8A6A55' });
  if (u > b[0] + .5) fade(win(u, b[0] + .5, b[3]), () => stroke(partial([[590, 158], [810, 142]], prog(u, b[0] + .5, b[0] + .8)), { c: RED, w: 8 }));
  tlabel('→  Michelin kitchen ★', 1140, 150, u, b[0] + .9, b[3], { size: 64, c: INK });
  tsign('Head chef = YOU', 290, 360, u, b[1]);
  tsign('Line cooks = AI agents', 1220, 360, u, b[1] + 1.4);
  const pp = popS(u, b[2] + .3);
  if (pp > 0) { local(600, 690, pp, 0, () => { fillC(ell(0, 0, 110, 24, 24), '#FFFFFF', { hatch: '#CFC8BA', w: 4 }); fillC(blob(0, -24, 60, 30, 3, 20), '#E07A3F', { hatch: '#A34A1A', w: 4 }); fillC(ell(-12, -46, 16, 10, 12), GREEN, { w: 3 }); });
    sparkle(660, 600, 22 * pp, 1); sparkle(530, 590, 14 * pp, 1); }
  tsign('Final dish = your job', 620, 540, u, b[2] + .7, b[3], { size: 32 });
  ['Tools', 'Training', 'Rules'].forEach((t, i) => { const t0 = b[3] + .9 + i * .9, p = prog(u, t0, t0 + .6); if (p <= 0) return;
    const y = lerp(-80, 190, back(p)); stroke([[760 + i * 300 - 50, 0], [760 + i * 300 - 50, y - 30]], { w: 3 }); stroke([[760 + i * 300 + 50, 0], [760 + i * 300 + 50, y - 30]], { w: 3 });
    sign(t, 760 + i * 300, y, { size: 50, bg: ['#FFFDF6', '#FFF1C9', '#DFF2EE'][i], rot: Math.sin(u * 3 + i) * .04 }); });
}

function s3(u, b) {
  paperBG(); ground(780);
  const aL = 1 - .75 * prog(u, b[2], b[2] + .5);
  fade(aL, () => {
    [[200, 0], [720, 1], [880, 2]].forEach(([x, i]) => { robot(x, 780, .46, { look: Math.sin(u * 2 + i) * 6, bob: Math.abs(Math.sin(u * 4 + i)) * 5 });
      bubble(x, 560 - (i === 1 ? 0 : 20), 90, 80, i === 2 ? '!?' : '?', { size: 50, a: win(u, .8 + i * .5, 99), pop: prog(u, .8 + i * .5, 1.2 + i * .5) }); });
    const lx = Math.sin(u * 3) > 0 ? 9 : -9; shadow(460, 780, 110); mascot(460, 780, 1, { lookX: lx });
    sweat(360, 560, u); sweat(565, 575, u + .5);
    tsign('1–5 agents = babysitting', 480, 260, u, .5, 99, { size: 46 });
    for (let r = 0; r < 5; r++) for (let c = 0; c < 10; c++) { const k = r * 10 + c, p = popS(u, b[1] + .2 + k * .025); if (p > 0) robot(1120 + c * 72, 360 + r * 72, .2 * p, { bob: Math.abs(Math.sin(u * 6 + k)) * 4 }); }
    for (let i = 0; i < 12; i++) { const t0 = b[1] + 2.4 + i * .06, p = eo(prog(u, t0, t0 + .35)); if (p <= 0) continue;
      const h = hash(i, 3); prCard(1180 + (h % 560), lerp(-100, 700 + (h >> 8) % 60, p), .62, { rot: ((h >> 4) % 60 - 30) / 60, col: '#F4E6D6', mark: 'x', mp: prog(u, t0 + .35, t0 + .6) }); }
    tsign('× 100 agents', 1450, 230, u, b[1] + .3, b[1] + 2.4, { size: 46, bg: '#DFF2EE' });
    tsign('No trust → 100 messy PRs', 1450, 230, u, b[1] + 2.6, 99, { size: 44, bg: '#FFE0E0' });
  });
  if (u > b[2]) { dim(.55 * prog(u, b[2], b[2] + .5));
    tlabel('How do we build TRUST?', 960, 350, u, b[2] + .2, 99, { size: 86, c: INK });
    fade(prog(u, b[2] + .5, b[2] + .8), () => meter(620, 470, 760, 70, .12 + .05 * Math.sin(u * 4)));
    tlabel('?', 1450, 505, u, b[2] + 1, 99, { size: 110, c: RED }); }
}

function s4(u, b) {
  paperBG();
  tsign('Step 1 · Verification', 960, 105, u, .3, 99, { size: 50, bg: '#DFF2EE' });
  fade(1 - prog(u, b[1] - .2, b[1] + .3), () => {
    windowBox(380, 190, 880, 520, 'Your App');
    const rows = [[0, 780], [40, 360], [420, 300], [60, 180], [440, 90], [520, 180]];
    rows.forEach(([x, w], i) => { const y = 280 + i * 64, p = eo(prog(u, .5 + i * .15, 1.1 + i * .15)); if (p <= 0) return;
      const hot = i === 4 && u > 3; fillC(rect(420 + x, y, w * p, 48), hot ? RED : [BLUE, TEAL, GOLD, PURPLE, '#E8A33D', GREEN][i], { w: 3 }); });
    const ph = 420 + 780 * frac(u / 4); stroke([[ph, 260], [ph, 690]], { c: RED, w: 3, a: .6 });
    if (u > 3) { const p = prog(u, 3, 3.5); stroke(partial(ell(905, 562, 110, 50, 30).concat([ell(905, 562, 110, 50, 30)[0]]), p), { c: RED, w: 6 }); }
    tsign('hotspot!', 1060, 650, u, 3.4, 99, { size: 32, bg: '#FFE0E0' });
    check(1180, 260, 1.4, prog(u, 4.8, 5.3));
    const mx = lerp(1350, 900, eo(prog(u, 1.4, 3))), my = lerp(620, 560, eo(prog(u, 1.4, 3)));
    stroke([[mx + 55, my + 55], [mx + 110, my + 120]], { c: DARK, w: 12 }); fillC(ell(mx, my, 75, 75, 26), 'rgba(159,243,234,0.25)', { w: 7 });
    robot(1560, 790, .8, { armR: .7, look: -8, happy: u > 5 ? 1 : 0 });
  });
  if (u > b[1] - .2) fade(prog(u, b[1] - .2, b[1] + .3), () => {
    const T1 = b[1] + .6, lines = ['$ app run --trace', '✓ app launched', '✓ trace captured', '✓ same steps, every run'];
    windowBox(140, 200, 740, 470, 'CLI', { bar: DARK, fill: '#1F1D26' });
    lines.forEach((l, i) => mono(typed(l, u, T1 + i * 1.1), 180, 300 + i * 70, { c: i ? '#7FE08A' : CYAN }));
    if (u > T1 + 4.4 && frac(u * 2) < .5) mono('▋', 180, 580, {});
    robot(960, 800, .45, { look: u < b[2] ? -8 : 8, happy: u > b[3] + 2.5 ? 1 : 0, arm: u > b[3] + 2.5 ? .9 : 0 });
    if (u > b[2]) {
      windowBox(1040, 200, 740, 470, 'Feature map', { bar: PURPLE });
      const N = { App: [1410, 320], Chat: [1190, 450], Agents: [1410, 450], Settings: [1630, 450], 'Run panel': [1300, 580], 'Diff view': [1530, 580] };
      const E = [['App', 'Chat'], ['App', 'Agents'], ['App', 'Settings'], ['Agents', 'Run panel'], ['Agents', 'Diff view']];
      E.forEach(([a, c], i) => { const p = prog(u, b[2] + .5 + i * .3, b[2] + .8 + i * .3); if (p > 0) stroke(partial([N[a], N[c]], p), { w: 3.5, c: '#8A7F72' }); });
      Object.entries(N).forEach(([k, [x, y]], i) => { const p = popS(u, b[2] + .3 + i * .3); if (p <= 0) return;
        const hl = k === 'Diff view' && u > b[3] + 2; local(x, y, p * (hl ? 1 + .06 * Math.sin(u * 8) : 1), 0, () => {
          fillC(rect(-88, -30, 176, 60), hl ? GOLD : '#FFFDF6', { w: 3.5 }); label(k, 0, 2, { size: 28, c: INK }); }); });
    }
    if (u > b[3]) {
      const p = eo(prog(u, b[3], b[3] + .7)); local(lerp(960, 960, p), lerp(-120, 330, p), 1, lerp(-.4, -.08, p), () => {
        fillC(rect(-75, -55, 150, 110), '#FFFFFF', { w: 4 }); fillC(rect(-60, -40, 120, 34), '#D9E2EC', { line: null }); label('???', 0, 30, { size: 40, c: RED }); });
      tarrow(u, b[3] + 1.2, 1010, 380, 1440, 560, 99, { c: RED, w: 5 });
      if (u > b[3] + 2) fillC([[1530, 540], [1512, 505], [1548, 505]], RED, { w: 3 });
      tsign('Found it!', 1530, 740, u, b[3] + 2.2, 99, { size: 44, bg: GOLD });
    }
  });
}

function s5(u, b) {
  paperBG();
  fade(1 - prog(u, b[1] - .2, b[1] + .3), () => {
    windowBox(200, 220, 620, 420, 'Checkout');
    fillC(rect(380, 460, 260, 80), GREEN, { w: 4 }); label('Pay', 510, 502, { size: 44, c: '#FFFFFF' });
    check(510, 350, 2, prog(u, .9, 1.5)); tsign('It works ✓', 510, 720, u, 1, 99, { size: 44, bg: '#E3F5DF' });
    if (u > 2.4) fade(prog(u, 2.4, 2.8), () => { windowBox(1100, 220, 620, 420, 'the code');
      R = mulberry(5); const pts = []; for (let i = 0; i < 26; i++) pts.push([rnd(1150, 1670), rnd(300, 600)]);
      stroke(partial(pts, prog(u, 2.5, 4)), { c: '#8A7F72', w: 4 }); label('?', 1600, 330, { size: 130, c: RED, pop: prog(u, 3.4, 3.9) }); });
    tsign('But is it GOOD code?', 1410, 720, u, 3.2, 99, { size: 44, bg: '#FFE0E0' });
  });
  if (u > b[1] - .2) fade(prog(u, b[1] - .2, b[1] + .3), () => {
    tsign('Skills = playbooks from your best engineers', 960, 105, u, b[1], 99, { size: 46, bg: '#FFF1C9' });
    fillC(rect(540, 190, 840, 390), '#B98555', { hatch: '#7F5530', w: 5 });
    fillC(rect(570, 215, 780, 340), '#8E6038', { line: null });
    const books = [['Debugging', RED], ['Features', BLUE], ['Prototyping', GREEN], ['Performance', GOLD], ['Testing', PURPLE], ['Refactoring', TEAL], ['Code review', '#E8A33D']];
    books.forEach(([t, c], i) => { const t0 = b[1] + .3 + i * .22, p = eo(prog(u, t0, t0 + .4)); if (p <= 0) return;
      if (i === 0 && u > b[2] + .5) return;
      local(630 + i * 110, lerp(160, 540, p), 1, (i % 3 - 1) * .02, () => { fillC(rect(-44, -300, 88, 300), c, { hatch: mix(c, '#000000', .3), w: 4 });
        ctx.save(); ctx.rotate(-Math.PI / 2); label(t, 150, 0, { size: 30, c: '#FFFDF6' }); ctx.restore(); }); });
    fillC(rect(530, 540, 860, 36), '#C9955F', { w: 4 });
    if (u > b[2]) {
      mascot(360, 800, .85, { lookX: 8, arms: prog(u, b[2], b[2] + .4) * .8, happy: u > b[2] + 2 ? 1 : 0 });
      const p = eo(prog(u, b[2] + .5, b[2] + 1.8));
      if (p > 0 && p < 1) local(lerp(470, 1450, p), lerp(560, 580, p) - Math.sin(p * Math.PI) * 260, .55, p * 6, () => fillC(rect(-44, -150, 88, 300), RED, { hatch: '#962E26', w: 4 }));
      const grad = u > b[2] + 1.8;
      robot(1560, 800, .72, { hat: grad ? 'grad' : null, happy: grad ? 1 : 0, arm: grad ? .9 : 0 });
      if (grad) { sparkle(1450, 470, 24 * popS(u, b[2] + 1.8)); sparkle(1680, 440, 18 * popS(u, b[2] + 2)); }
      [[1300, 3], [1790, 3.4]].forEach(([x, d]) => { const q = popS(u, b[2] + d); if (q > 0) robot(x, 800, .5 * q, { hat: 'grad', happy: 1, bob: Math.abs(Math.sin(u * 5 + x)) * 8 }); });
      tsign('Write once → every agent learns', 960, 680, u, b[2] + 2.4, 99, { size: 42, bg: GOLD });
    }
  });
}

function s6(u, b) {
  paperBG();
  tsign('The 5 layers of trust', 960, 100, u, .3, 99, { size: 54, bg: '#FFF1C9' });
  const L = [['Codebase: make mistakes impossible', GREEN], ['Static analysis: lint · compiler · CI', BLUE], ['Rules & skills', PURPLE], ['Review bot', '#E8A33D'], ['Style guide (humans only)', '#E2765C']];
  const at = [b[1], b[2], b[3], b[3] + 2.2, b[4]];
  const x0 = 380; stroke([[x0 - 150, 280], [x0 - 150, 720]], { w: 6, c: '#8A7F72', a: prog(u, .8, 1.2) });
  if (u > 1) { tarrow(u, 1, x0 - 150, 300, x0 - 150, 740, 99, { c: GREEN, w: 7, head: 26 }); tlabel('weaker', x0 - 150, 250, u, 1.2, 99, { size: 34, c: '#8A7F72' }); tlabel('stronger', x0 - 150, 790, u, 1.4, 99, { size: 40, c: GREEN }); }
  L.forEach(([t, c], i) => { const w = 1100 - i * 120, cx = 1000, yT = 760 - (i + 1) * 100;
    if (u > .8 && u < at[i] + .3) fade(.5 * prog(u, .8 + i * .15, 1.2 + i * .15), () => stroke(rect(cx - w / 2, yT + 4, w, 92), { closed: true, c: '#B9B1A2', w: 3 }));
    const p = prog(u, at[i], at[i] + .5); if (p <= 0) return; const dy = lerp(-500, 0, back(p));
    fillC(rect(cx - w / 2, yT + 4 + dy, w, 92), c, { hatch: mix(c, '#000000', .3), ha: .3, w: 4.5 }); label(t, cx, yT + 52 + dy, { size: 36, c: '#FFFDF6' }); });
  // layer 1: lock = impossible by design
  if (u > at[0] + 2) local(1500, 710, popS(u, at[0] + 2), 0, () => { stroke(ell(0, -30, 24, 26, 20).slice(10, 26), { w: 6 }); fillC(rect(-30, -26, 60, 48), GOLD, { w: 4 }); });
  // layer 2: a bug flies in and is caught
  if (u > at[1] + 2) { const p = eo(prog(u, at[1] + 2, at[1] + 3)); local(lerp(1850, 1470, p), lerp(380, 610, p), .6, 0, bugIcon); xmark(1470, 610, 1.1, prog(u, at[1] + 3, at[1] + 3.4)); tsign('caught!', 1640, 560, u, at[1] + 3.2, at[4] - .5, { size: 30, bg: '#E3F5DF' }); }
  // layers 3-4: guidance an agent can forget
  robot(1700, 790, .5, { look: -6, happy: 0 });
  bubble(1700, 560, 250, 90, 'forgot?', { size: 34, a: win(u, at[3] + 1, at[4]), pop: prog(u, at[3] + 1, at[3] + 1.4) });
  // layer 5: humans can't keep up with the PR flood
  if (u > at[4] + 1.5) { for (let i = 0; i < 8; i++) { const f = frac((u - at[4]) * .6 + i / 8); prCard(lerp(1900, 1250, f), 230 + (i % 3) * 30, .45, { rot: .2 * Math.sin(i), mark: null }); }
    local(700, 310, popS(u, at[4] + 1.5), 0, () => { fillC(ell(0, 0, 42, 24, 24), '#FFFFFF', { w: 4 }); fillC(ell(0, 0, 13, 13, 14), INK, { line: null }); });
    tsign("can't keep up!", 700, 200, u, at[4] + 2.2, 99, { size: 36, bg: '#FFE0E0' }); }
}

function s7(u, b) {
  gradBG('#CFE8F0', '#F1F2E4');
  fillC(rect(-20, 760, 1960, 340), '#9BC47A', { hatch: '#5E8C45', ang: -.3, line: INK, w: 5 });
  const cols = [RED, BLUE, PURPLE, '#E8A33D', '#E36FA0', BLUE, RED];
  const fx = [260, 420, 580, 740, 900, 1060, 1220];
  fx.forEach((x, i) => { const t0 = i < 5 ? .3 + i * .35 : 3.8 + (i - 5) * .6; flower(x, 770, 150 + (i % 2) * 40, prog(u, t0, t0 + .8), cols[i]); });
  if (u > 3.6 && u < b[1]) { tarrow(u, 3.6, 930, 520, 1040, 540, b[1] - .5, { c: TEAL, w: 4 }); tarrow(u, 4.2, 1090, 520, 1200, 540, b[1] - .5, { c: TEAL, w: 4 }); }
  robot(1560, 775, .6, { look: -8, arm: u > 3.6 && u < 5 ? .6 : 0 });
  tsign('Codebase = agent memory', 960, 110, u, b[0], b[1] - .3, { size: 52, bg: '#FFF1C9' });
  tsign('Agents copy what they see', 960, 200, u, 3.4, b[1] - .3, { size: 38 });
  const wx = [660, 340, 500, 820, 980, 1140, 1300, 180];
  const sh = i => b[3] + 1.6 + i * .32;
  wx.forEach((x, i) => { const t0 = i === 0 ? b[1] + .2 : b[1] + 1.2 + i * .5; let g = back(prog(u, t0, t0 + .5)) * .7;
    if (u > b[3]) g *= 1 - eo(prog(u, sh(i), sh(i) + .3)); weed(x, 775, g, i === 0 && u < b[2]); });
  tsign('One hack spreads like a weed', 960, 110, u, b[1] + .6, b[2], { size: 50, bg: '#FFE0E0' });
  if (u > b[2]) { const a = win(u, b[2], b[3], .5); dim(.72 * a);
    fade(a, () => { windowBox(480, 260, 960, 300, 'agent_patch.ts', { bar: DARK, fill: '#1F1D26' });
      mono(typed('// TODO: quick workaround,', u, b[2] + .4), 530, 370, { size: 40, c: '#F2A65A' });
      mono(typed('//       fix the real bug later', u, b[2] + 1.4), 530, 430, { size: 40, c: '#F2A65A' });
      mono(typed('patchOver(bug);', u, b[2] + 2.6), 530, 500, { size: 40, c: CYAN });
      if (u > b[2] + 4) local(960, 410, lerp(1.6, 1, eo(prog(u, b[2] + 4, b[2] + 4.4))), 0, () => { fade(prog(u, b[2] + 4, b[2] + 4.3), () => {
        stroke(ell(0, 0, 230, 230, 40), { closed: true, c: RED, w: 22 }); stroke([[-160, -160], [160, 160]], { c: RED, w: 22 }); }); });
      tsign('COMMENTS BANNED', 960, 720, u, b[2] + 5, 99, { size: 56, bg: RED, fg: '#FFFDF6', line: INK }); }); }
  if (u > b[3]) {
    const mx = lerp(-200, 380, eo(prog(u, b[3], b[3] + 1.4))), yay = u > b[3] + 6.8;
    mascot(mx, 775, .9, { walk: u * 1.7, moving: u < b[3] + 1.4, arms: .5 + .4 * Math.sin(u * 6), happy: yay ? 1 : 0 }); strawHat(mx, 775 - 192 * .9, .95);
    for (let k = 0; k < 14; k++) { const t0 = b[3] + 2.4 + k * .12; if (u < t0) break; const x = 160 + k * 90, p = back(prog(u, t0, t0 + .3));
      fillC(rect(x - 10, 775 - 110 * p, 20, 110 * p), '#E9E0CC', { w: 3 }); if (k) { stroke([[x - 90, 700], [x, 700]], { w: 4 }); stroke([[x - 90, 745], [x, 745]], { w: 4 }); } }
    tsign('lint rules = fence', 800, 630, u, b[3] + 3.2, 99, { size: 34, bg: '#FFFDF6' });
    fade(prog(u, b[3] + 1.8, b[3] + 2.2), () => { fillC(rect(1340, 110, 520, 330), '#FFFDF6', { w: 4.5 }); label('Gardener checklist', 1600, 160, { size: 40, c: INK });
      ['Delete tech debt', 'One paved path', 'Lint every bad pattern'].forEach((t, i) => { const t0 = b[3] + 2.4 + i * 2;
        stroke(rect(1370, 208 + i * 72, 44, 44), { closed: true, w: 3.5 }); check(1392, 226 + i * 72, .8, prog(u, t0, t0 + .4));
        label(t, 1430, 230 + i * 72, { size: 34, c: INK, align: 'left', a: prog(u, t0 - .3, t0) }); }); });
  }
}

function s8(u, b) {
  paperBG();
  fade(1 - prog(u, b[1] - .2, b[1] + .3), () => {
    const bz = t => [lerp(lerp(160, 900, t), lerp(900, 1560, t), t), lerp(lerp(760, 820, t), lerp(820, 330, t), t)];
    const road = []; for (let i = 0; i <= 30; i++) road.push(bz(i / 30));
    stroke(partial(road, prog(u, .3, 1.2)), { c: '#8A8F99', w: 110, a: 1 }); stroke(partial(road, prog(u, .3, 1.2)), { c: '#FFFDF6', w: 5, a: .9 });
    const sc = [[520, 700], [1000, 560], [1500, 380]]; stroke(partial(sc, prog(u, .8, 1.5)), { c: '#C9A26B', w: 26 });
    if (u > 1.5) local(1010, 555, popS(u, 1.5), -.35, () => { fillC(rect(-90, -26, 180, 52), '#FFFFFF', { w: 4 }); for (let k = -3; k <= 3; k++) fillC([[k * 26 - 8, -24], [k * 26 + 8, -24], [k * 26 - 8, 24], [k * 26 - 24, 24]], RED, { line: null }); });
    tsign('shortcut blocked', 1040, 460, u, 1.9, 99, { size: 30, bg: '#FFE0E0' });
    local(1570, 330, popS(u, 1.2), 0, () => { stroke([[0, 0], [0, -150]], { w: 7 }); fillC([[0, -150], [90, -125], [0, -100]], GREEN, { w: 4 }); });
    const rp = eo(prog(u, 2, 5.4)), [rx, ry] = bz(rp);
    robot(rx, ry, .42, { happy: rp > .98 ? 1 : 0, arm: rp > .98 ? .9 : 0, bob: rp < .98 ? Math.abs(Math.sin(u * 9)) * 4 : 0 });
    tsign('Easy path = Right path ✓', 1320, 150, u, 1, 99, { size: 48, bg: '#E3F5DF' });
  });
  if (u > b[1] - .2) fade(prog(u, b[1] - .2, b[1] + .3) * (1 - prog(u, b[2] - .2, b[2] + .3)), () => {
    windowBox(160, 200, 740, 480, 'UI thread', { bar: TEAL }); windowBox(1020, 200, 740, 480, 'Main process', { bar: PURPLE });
    const wave = []; for (let i = 0; i <= 60; i++) wave.push([220 + i * 10.4, 470 + Math.sin(i * .35 + u * 4) * 26]); stroke(wave, { c: GREEN, w: 6 });
    sign('60 fps ✓', 530, 340, { size: 52, bg: '#E3F5DF', pop: prog(u, b[1] + .5, b[1] + 1) });
    for (let k = 0; k < 6; k++) stroke([[960, 250 + k * 80], [960, 300 + k * 80]], { w: 10, c: DARK });
    fillC(rect(935, 420, 50, 70), GOLD, { w: 4 });
    const t0 = b[1] + 1.2, p = eo(prog(u, t0, t0 + 1.6)), bounce = prog(u, t0 + 1.6, t0 + 2.2);
    const sx = lerp(1500, 1060, p) + Math.sin(bounce * Math.PI) * 120;
    local(sx, 560, 1, Math.sin(bounce * 20) * .08 * (1 - bounce), () => { fillC(rect(-90, -60, 180, 120), '#6B5B4B', { hatch: '#3B2F25', w: 4 }); label('slow code', 0, 0, { size: 30, c: '#FFFDF6' }); });
    xmark(1060, 440, 1.1, prog(u, t0 + 1.7, t0 + 2.1)); tsign('import blocked!', 1390, 330, u, t0 + 2, 99, { size: 40, bg: '#FFE0E0' });
  });
  if (u > b[2] - .2) fade(prog(u, b[2] - .2, b[2] + .3), () => {
    ground(790); mascot(420, 790, .9, { lookX: 8 }); sweat(330, 590, u); tsign('strict for humans…', 420, 440, u, b[2] + .4, 99, { size: 36 });
    const yay = u > b[2] + 2.4; robot(1180, 790, .7, { happy: yay ? 1 : 0, armR: yay ? 1.1 : 0, bob: yay ? Math.abs(Math.sin(u * 6)) * 10 : 0 });
    bubble(1180, 450, 280, 90, 'little context', { size: 32, a: win(u, b[2] + 1, b[2] + 3), pop: prog(u, b[2] + 1, b[2] + 1.4) });
    if (u > b[2] + 2.4) prCard(1470, 640, .9, { mark: 'ok', mp: prog(u, b[2] + 2.8, b[2] + 3.2), rot: .08 });
    tsign('good code by default ✓', 1300, 250, u, b[2] + 3.2, 99, { size: 48, bg: '#E3F5DF' });
  });
}

function s9(u, b) {
  spaceBG(1);
  label('The outer loop', 960, 70, { size: 56, c: CREAM, a: prog(u, .2, .5) });
  const hub = [960, 470], icons = [[chatIcon, 380, 300, 'Chat'], [chartIcon, 330, 640, 'Metrics'], [bellIcon, 700, 190, 'Alerts'], [bugIcon, 1220, 190, 'Errors'], [dbIcon, 1560, 300, 'Database']];
  icons.forEach(([fn, x, y], i) => { const t0 = b[0] + .6 + i * .9, p = prog(u, t0, t0 + .5); if (p > 0) stroke(partial([hub, [x, y]], p), { c: '#8F88D8', w: 4, a: .9 }); });
  const ring = u > b[1] + .2 && u < b[1] + 2 ? Math.sin(u * 30) * .3 : 0;
  icons.forEach(([fn, x, y, n], i) => { const p = popS(u, b[0] + .5 + i * .9); if (p <= 0) return;
    badge(x, y, p, fn, i === 2 ? { ring, glow: win(u, b[1] + .2, b[1] + 2) * .6 } : {}); label(n, x, y + 100, { size: 28, c: CREAM, a: p }); });
  if (u > b[1] + .5 && u < b[1] + 1.4) { const p = prog(u, b[1] + .5, b[1] + 1.3); fillC(ell(lerp(700, hub[0], p), lerp(190, hub[1], p), 16, 16, 14), RED, { w: 3 }); }
  robot(960, 720, .8, { alert: u > b[1] + 1.2 && u < b[1] + 2 ? 1 : 0, happy: u > b[1] + 4.5 ? 1 : 0, arm: u > b[1] + 1.4 && u < b[1] + 2.4 ? .9 : 0, armR: u > b[1] + 1.4 && u < b[1] + 2.4 ? .9 : 0 });
  fade(1 - prog(u, b[2] - .2, b[2] + .3), () => {
    [[1440, 640], [1680, 700], [1500, 820]].forEach(([x, y], i) => { const t0 = b[1] + 1.6 + i * .25, p = eo(prog(u, t0, t0 + .8)); if (p <= 0) return;
      const cx = lerp(960, x, p), cy = lerp(620, y, p), bob = Math.sin(u * 3 + i) * 8;
      puff(cx - 40, cy - 2 + bob, 38, 1, '#FFFFFF'); puff(cx + 40, cy + bob, 34, 1, '#FFFFFF'); robot(cx, cy - 10 + bob, .34, { happy: u > b[1] + 4.5 ? 1 : 0 }); });
    tlabel('cloud agents', 1600, 470, u, b[1] + 2.4, 99, { size: 34, c: CREAM });
    if (u > b[1] + 3.8) { const p = eo(prog(u, b[1] + 3.8, b[1] + 4.6)); prCard(lerp(1600, 1260, p), lerp(700, 560, p), .9, { mark: 'ok', mp: prog(u, b[1] + 4.6, b[1] + 5), rot: -.06 }); }
    tsign('bug reproduced → PR opened', 1200, 395, u, b[1] + 4.8, 99, { size: 34, bg: '#E3F5DF' });
  });
  if (u > b[2]) { [1, 1.6, 2.5, 3.8, 5.6].forEach((h, i) => { const p = eo(prog(u, b[2] + .3 + i * .3, b[2] + .8 + i * .3)); if (p > 0) fillC(rect(1340 + i * 80, 820 - h * 70 * p, 60, h * 70 * p), [TEAL, BLUE, PURPLE, GOLD, GREEN][i], { w: 3.5 }); });
    tarrow(u, b[2] + 1.8, 1330, 760, 1760, 360, 99, { c: GOLD, w: 7, head: 28 });
    tsign('everything compounds', 1250, 370, u, b[2] + 2, 99, { size: 40, bg: GOLD }); }
}

function s10(u, b, D) {
  paperBG(); ground(790);
  const yay = u > b[2];
  shadow(330, 790, 110); mascot(330, 790, 1, { lookX: 8, arms: yay ? .6 + .4 * Math.sin(u * 6) : prog(u, b[0], b[0] + .4) * .7, happy: yay ? 1 : 0 });
  fade(win(u, .1, b[2] - .3), () => {
    fillC(rect(620, 160, 960, 500), '#FFFDF6', { w: 5 });
    label('Correcting your agent? Ask:', 1100, 230, { size: 40, c: '#7A6E62', a: prog(u, .3, .6) });
    label('Which layer stops this mistake forever?', 1100, 305, { size: 46, c: RED, a: prog(u, b[0] + 1.5, b[0] + 1.9), pop: prog(u, b[0] + 1.5, b[0] + 2) });
    ['1.  Fix it in the code', '2.  Add a lint rule', '3.  Write a skill'].forEach((t, i) => { const t0 = b[1] + i * 1.1;
      label(t, 720, 410 + i * 80, { size: 44, c: INK, align: 'left', a: prog(u, t0, t0 + .3) }); check(1440, 410 + i * 80, .9, prog(u, t0 + .3, t0 + .7)); });
  });
  if (yay) {
    fade(prog(u, b[2], b[2] + .4), () => meter(820, 180, 760, 70, eo(prog(u, b[2] + .3, b[2] + 1.8)), { col: GREEN }));
    tlabel('Build trust → agents run free', 1100, 380, u, b[2] + .8, D - 3.8, { size: 70, c: INK });
    [760, 1010, 1260, 1510].forEach((x, i) => { const p = popS(u, b[2] + .3 + i * .2); if (p > 0) robot(x, 790, .5 * p, { happy: 1, bob: Math.abs(Math.sin(u * 7 + i)) * 26, rot: Math.sin(u * 7 + i) * .12, arm: .8 + .3 * Math.sin(u * 7 + i), armR: .8 - .3 * Math.sin(u * 7 + i) }); });
    sparkle(1650, 260, 26 * (.7 + .3 * Math.sin(u * 5)), prog(u, b[2] + 1.8, b[2] + 2));
  }
  if (u > D - 3.8) { dim(prog(u, D - 3.8, D - 3.2));
    tlabel('Trust Your AI Agents', 960, 400, u, D - 3.4, 99, { size: 120, c: INK });
    tlabel('Code  ·  Lint  ·  Rules & Skills  ·  Review bot  ·  Style guide', 960, 520, u, D - 3, 99, { size: 40, c: TEAL_D });
    tlabel('An animated summary of a conference talk on AI agent workflows', 960, 600, u, D - 2.6, 99, { size: 30, c: '#7A6E62' }); }
}

const SCENE_FNS = { 's1-hook': s1, 's2-kitchen': s2, 's3-ladder': s3, 's4-verify': s4, 's5-skills': s5, 's6-layers': s6, 's7-garden': s7, 's8-framework': s8, 's9-outer-loop': s9, 's10-recap': s10 };
