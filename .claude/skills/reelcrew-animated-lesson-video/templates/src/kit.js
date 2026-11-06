// Reusable drawing kit for lesson videos: helpers, agent-bot character, props, icons, backgrounds. Depends on engine.js.
const TEAL = '#4FB3A9', TEAL_D = '#2E7F78', RED = '#E2574C', GREEN = '#5DB866', BLUE = '#5AA9E6', PURPLE = '#8C6BC8', CYAN = '#9FF3EA';
const MONO = 'Menlo, Monaco, monospace';

// ---------- small helpers ----------
function fade(a, fn) { if (a <= 0) return; const g = GA; GA *= a; fn(); GA = g; }
const win = (u, t0, t1 = 99, d = .35) => prog(u, t0, t0 + d) * (1 - prog(u, t1, t1 + d));
function local(x, y, s, rot, fn) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot || 0); ctx.scale(s, s); const pS = SC; SC = pS * s; fn(); SC = pS; ctx.restore(); }
function ground(y = 780) { stroke([[80, y], [1840, y]], { c: '#B9B1A2', w: 2.5 }); }
function shadow(x, y, rx) { ctx.save(); ctx.globalAlpha = .12 * GA; ctx.fillStyle = INK; ctx.beginPath(); ctx.ellipse(x, y + 5, rx, rx * .07, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore(); }
function partial(pts, p) {
  if (p >= 1) return pts; const segs = []; let tot = 0;
  for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); segs.push(l); tot += l; }
  let rem = tot * p; const out = [pts[0]];
  for (let i = 1; i < pts.length; i++) { const l = segs[i - 1]; if (rem >= l) { out.push(pts[i]); rem -= l; continue; }
    const k = rem / l; out.push([lerp(pts[i - 1][0], pts[i][0], k), lerp(pts[i - 1][1], pts[i][1], k)]); break; }
  return out;
}
function check(x, y, s, p, c = GREEN) { if (p <= 0) return; stroke(partial([[x - 30 * s, y], [x - 8 * s, y + 22 * s], [x + 34 * s, y - 28 * s]], p), { c, w: 11 * s + 2 }); }
function xmark(x, y, s, p, c = RED) { if (p <= 0) return; const r = 28 * s;
  stroke(partial([[x - r, y - r], [x + r, y + r]], clamp(p * 2)), { c, w: 10 * s + 2 });
  if (p > .5) stroke(partial([[x + r, y - r], [x - r, y + r]], clamp(p * 2 - 1)), { c, w: 10 * s + 2 }); }
function sign(txt, x, y, { size = 40, bg = '#FFFDF6', fg = INK, a = 1, pop = 1, pad = 20, line = INK, rot = 0 } = {}) {
  if (a <= 0) return; ctx.save(); ctx.font = `${size}px ${FONT}`; const w = ctx.measureText(txt).width; ctx.restore();
  fade(a, () => local(x, y, lerp(.6, 1, back(pop)), rot, () => {
    fillC(rect(-w / 2 - pad, -size * .78, w + 2 * pad, size * 1.56), bg, { line, w: 3.5 }); label(txt, 0, 2, { size, c: fg }); }));
}
const tsign = (txt, x, y, u, t0, t1 = 99, o = {}) => sign(txt, x, y, { ...o, a: win(u, t0, t1), pop: prog(u, t0, t0 + .45) });
function mono(txt, x, y, { size = 30, c = CYAN, a = 1, align = 'left' } = {}) { if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = GA * a; ctx.font = `${size}px ${MONO}`; ctx.fillStyle = c; ctx.textAlign = align; ctx.textBaseline = 'middle'; ctx.fillText(txt, x, y); ctx.restore(); }
function typed(txt, u, t0, cps = 28) { return txt.slice(0, Math.max(0, Math.floor((u - t0) * cps))); }
function popS(u, t0) { const p = prog(u, t0, t0 + .45); return p > 0 ? back(p) : 0; }
function dim(a) { if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = PAPER; ctx.fillRect(0, 0, W, H); ctx.restore(); }
function sparkle(x, y, r, a = 1, c = GOLD) { if (a <= 0 || r <= 0) return; fade(a, () => {
  const p = []; for (let i = 0; i < 8; i++) { const ang = Math.PI / 4 * i, rr = i % 2 ? r * .35 : r; p.push([x + Math.cos(ang) * rr, y + Math.sin(ang) * rr]); }
  fillC(p, c, { w: 3 }); }); }
function sweat(x, y, u, a = 1) { const f = frac(u * .9); fade(a * (1 - f), () => fillC(blob(x, y + f * 50, 9, 13, 1, 12), BLUE, { w: 2.5 })); }

// ---------- characters + props ----------
// Agent bot: origin at the bottom centre between the wheels; ~330px tall at s=1.
function robot(x, y, s, { bob = 0, look = 0, happy = 0, hat = null, col = TEAL, colD = TEAL_D, arm = 0, armR = null, eye = CYAN, rot = 0, alert = 0 } = {}) {
  local(x, y - bob, s, rot, () => {
    for (const wx of [-40, 40]) fillC(ell(wx, -20, 22, 20, 16), DARK, { w: 4 });
    for (const sd of [-1, 1]) { const a = sd < 0 ? arm : (armR ?? arm);
      ctx.save(); ctx.translate(sd * 68, -120); ctx.rotate(-sd * a); const pS = SC;
      fillC(rect(sd > 0 ? 0 : -58, -11, 58, 22), col, { hatch: colD, w: 4 }); fillC(ell(sd * 62, 0, 15, 15, 14), colD, { w: 3.5 }); SC = pS; ctx.restore(); }
    fillC(rect(-70, -165, 140, 130), col, { hatch: colD, ang: -.8, sp: 8, ha: .4, w: 5 });
    fillC(ell(0, -110, 16, 16, 16), alert ? RED : GOLD, { w: 3 });
    fillC(rect(-16, -182, 32, 20), DARK, { w: 3 });
    if (!hat) { stroke([[0, -290], [0, -322]], { w: 4 }); fillC(ell(0, -330, 11, 11, 14), alert ? RED : GOLD, { w: 3 }); }
    fillC(rect(-85, -290, 170, 112), col, { hatch: colD, ang: -.8, sp: 8, ha: .4, w: 5 });
    fillC(rect(-64, -275, 128, 82), '#1D2630', { w: 3.5 });
    for (const ex of [-28, 28]) {
      if (happy > .5) stroke([[ex - 14, -226], [ex, -242], [ex + 14, -226]], { c: eye, w: 6 });
      else fillC(ell(ex + look, -234, 11, 15, 14), alert ? RED : eye, { line: null }); }
    if (hat === 'chef') chefHat(0, -288, .9);
    if (hat === 'grad') { fillC([[-100, -300], [0, -335], [100, -300], [0, -268]], DARK, { w: 4 }); stroke([[60, -290], [70, -245]], { c: GOLD, w: 5 }); }
  });
}
function chefHat(x, y, s) { local(x, y, s, 0, () => {
  fillC(rect(-48, -44, 96, 44), '#FFFFFF', { hatch: '#CFC8BA', w: 4 });
  fillC(blob(0, -82, 78, 48, 1, 22), '#FFFFFF', { hatch: '#CFC8BA', w: 4 }); }); }
function strawHat(x, y, s) { local(x, y, s, 0, () => {
  fillC(ell(0, 0, 150, 26, 28), '#E9C46A', { hatch: '#B98B2E', w: 4 }); fillC(ell(0, -30, 80, 45, 24), '#E9C46A', { hatch: '#B98B2E', w: 4 });
  fillC(rect(-78, -22, 156, 16), RED, { line: null }); }); }
function prCard(x, y, s, { mark = null, rot = 0, col = '#FFFDF6', mp = 1 } = {}) { local(x, y, s, rot, () => {
  fillC(rect(-55, -70, 110, 140), col, { w: 3.5 }); fillC(rect(-40, -54, 44, 16), PURPLE, { line: null });
  for (let i = 0; i < 4; i++) stroke([[-40, -18 + i * 20], [i % 2 ? 18 : 38, -18 + i * 20]], { c: '#B9B1A2', w: 3 });
  if (mark === 'ok') check(22, 44, .6, mp); if (mark === 'x') xmark(22, 44, .6, mp); }); }
function windowBox(x0, y0, w, h, title, { bar = BLUE, fill = '#FFFDF6', tc = '#FFFDF6' } = {}) {
  fillC(rect(x0, y0, w, h), fill, { w: 4.5 }); fillC(rect(x0, y0, w, 48), bar, { w: 4.5 });
  [0, 1, 2].forEach(i => fillC(ell(x0 + 26 + i * 26, y0 + 24, 8, 8, 12), ['#FF6B5E', '#FFC23D', '#5DD06B'][i], { w: 2 }));
  label(title, x0 + w / 2, y0 + 26, { size: 28, c: tc }); }
function bubble(x, y, w, h, txt, { size = 34, a = 1, pop = 1, fg = INK } = {}) { fade(a, () => local(x, y, lerp(.5, 1, back(pop)), 0, () => {
  fillC(blob(0, 0, w / 2, h / 2, 2, 24), '#FFFFFF', { w: 3.5 }); fillC([[-14, h / 2 - 8], [8, h / 2 - 6], [-24, h / 2 + 26]], '#FFFFFF', { line: null });
  stroke([[-16, h / 2 - 4], [-24, h / 2 + 26], [8, h / 2 - 2]], { w: 3 }); label(txt, 0, 2, { size, c: fg }); })); }
function meter(x, y, w, h, v, { col = GREEN, name = 'TRUST' } = {}) {
  fillC(rect(x, y, w, h), '#FFFDF6', { w: 4 });
  if (v > .01) fillC(rect(x + 8, y + 8, (w - 16) * clamp(v), h - 16), col, { hatch: mix(col, '#000000', .3), line: null });
  stroke(rect(x, y, w, h), { closed: true, w: 4 }); label(name, x - 20, y + h / 2, { size: 40, c: INK, align: 'right' }); }
function badge(x, y, s, fn, { ring = 0, glow = 0 } = {}) { local(x, y, s, ring, () => {
  if (glow > 0) fade(glow, () => fillC(ell(0, 0, 95, 95, 28), RED, { line: null }));
  fillC(ell(0, 0, 72, 72, 28), '#F3EBDD', { hatch: '#CFC4B0', w: 4 }); fn(); }); }
const chatIcon = () => { fillC(rect(-42, -32, 84, 56), BLUE, { w: 3.5 }); fillC([[-18, 22], [0, 22], [-26, 42]], BLUE, { w: 3 }); [-18, 0, 18].forEach(d => fillC(ell(d, -4, 6, 6, 10), '#FFFFFF', { line: null })); };
const bellIcon = () => { fillC([[-38, 26], [-30, -6], [-22, -30], [0, -40], [22, -30], [30, -6], [38, 26]], GOLD, { hatch: '#C8942A', w: 3.5 }); fillC(ell(0, 34, 10, 10, 12), GOLD, { w: 3 }); };
const bugIcon = () => { for (const sd of [-1, 1]) for (const k of [-14, 4, 22]) stroke([[sd * 18, k], [sd * 42, k - 10]], { w: 4 });
  fillC(ell(0, 6, 26, 34, 18), RED, { hatch: '#962E26', w: 3.5 }); fillC(ell(0, -32, 16, 13, 14), DARK, { w: 3 }); };
const dbIcon = () => { fillC(rect(-34, -30, 68, 60), PURPLE, { w: 3.5 }); fillC(ell(0, -30, 34, 12, 20), '#B49BE0', { w: 3.5 }); stroke([[-34, 0], [0, 10], [34, 0]], { w: 3 }); };
const chartIcon = () => { [[-30, 20], [-6, 34], [18, 52]].forEach(([bx, bh]) => fillC(rect(bx, 30 - bh, 18, bh), GREEN, { w: 3 })); stroke([[-40, 32], [44, 32]], { w: 3.5 }); };
function flower(x, y, h, g, col) { if (g <= 0) return; const top = y - h * eo(g);
  stroke([[x, y], [x + 6, (y + top) / 2], [x, top]], { c: '#4E8A3E', w: 6 });
  fillC(blob(x + 22, (y + top) / 2 + 10, 20, 9, 2, 12), '#6BAF4F', { w: 3 });
  const r = 34 * back(prog(g, .5, 1)); if (r <= 1) return;
  for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2; fillC(ell(x + Math.cos(a) * r * .9, top + Math.sin(a) * r * .9, r * .5, r * .5, 12), col, { w: 3 }); }
  fillC(ell(x, top, r * .55, r * .55, 14), GOLD, { w: 3 }); label('{ }', x, top + 1, { size: 22 * r / 34, c: INK }); }
function weed(x, y, g, tag = false) { if (g <= 0) return; local(x, y, g, 0, () => {
  const p = []; for (let i = 0; i <= 14; i++) { const t = i / 14, ang = Math.PI * (1 + t); const rr = i % 2 ? 40 : 105; p.push([Math.cos(ang) * rr * .9, Math.sin(ang) * rr]); }
  fillC(p, '#5B3F7A', { hatch: '#2E1E40', w: 4 }); fillC(ell(-14, -46, 7, 9, 10), '#FFE66D', { line: null }); fillC(ell(14, -46, 7, 9, 10), '#FFE66D', { line: null });
  if (tag) sign(tag === true ? '// hack' : tag, 0, -150, { size: 26, bg: '#FFE0E0' }); }); }

// ---------- backgrounds ----------
function gradBG(c1, c2) { const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, c1); g.addColorStop(1, c2); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.globalAlpha = .7; ctx.drawImage(TEX_D, 0, 0); ctx.globalAlpha = 1; }


// ---------- generic props (desk, laptop, coin, bulb, card, chart, chalkboard) ----------
function desk(x, y, w) { fillC(rect(x - w / 2, y, w, 26), '#C98B5B', { hatch: '#8E5A34', w: 4 }); [x - w / 2 + 20, x + w / 2 - 40].forEach(lx => fillC(rect(lx, y + 26, 20, 90), '#8E5A34', { w: 3 })); }
function laptop(x, y, s = 1, glow = 0) { local(x, y, s, 0, () => {
  fillC([[-150, 0], [150, 0], [170, 18], [-170, 18]], '#9AA3AD', { w: 4 });
  fillC(rect(-130, -170, 260, 170), DARK, { w: 4 }); fillC(rect(-114, -156, 228, 142), '#1D2630', { line: null });
  for (let i = 0; i < 5; i++) stroke([[-96, -134 + i * 24], [-96 + 60 + ((i * 53) % 110), -134 + i * 24]], { c: i % 2 ? CYAN : '#7FE08A', w: 5, a: .5 + .5 * glow }); }); }
function coin(x, y, r = 26, a = 1) { fade(a, () => { fillC(ell(x, y, r, r, 18), GOLD, { hatch: '#C8942A', w: 3.5 }); label('AI', x, y + 2, { size: r * .9, c: INK }); }); }
function bulb(x, y, s, on = 0) { local(x, y, s, 0, () => {
  if (on > 0) for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2; stroke([[Math.cos(a) * 120, -40 + Math.sin(a) * 120], [Math.cos(a) * (150 + 20 * on), -40 + Math.sin(a) * (150 + 20 * on)]], { c: GOLD, w: 7, a: on }); }
  fillC(ell(0, -40, 92, 96, 28), on > 0 ? '#FFE680' : '#FFFDF6', { hatch: '#E0B84A', ha: .25, w: 5 });
  fillC(rect(-40, 50, 80, 50), '#9AA3AD', { hatch: '#6B737C', w: 4 }); stroke([[-40, 66], [40, 66]], { w: 3 }); stroke([[-40, 82], [40, 82]], { w: 3 }); }); }
function card(x, y, w, h, title, { bg = '#FFFDF6', size = 38, icon = null, pop = 1 } = {}) { local(x, y, lerp(.5, 1, back(pop)), 0, () => {
  fillC(rect(-w / 2, -h / 2, w, h), bg, { w: 4.5 }); if (icon) icon(); label(title, 0, h / 2 - 40, { size, c: INK }); }); }
function chart(x0, y0, w, h, p, { f = t => t * t * t, c = GREEN, dash = false, xl = '', yl = '', axes = true } = {}) {
  if (axes) { stroke([[x0, y0 - h], [x0, y0], [x0 + w, y0]], { w: 5 }); if (xl) label(xl, x0 + w, y0 + 34, { size: 30, c: '#7A6E62', align: 'right' }); if (yl) label(yl, x0 + 10, y0 - h - 26, { size: 30, c: '#7A6E62', align: 'left' }); }
  if (p <= 0) return; const pts = []; for (let i = 0; i <= 40 * p; i++) { const t = i / 40; pts.push([x0 + t * w, y0 - f(t) * h]); }
  if (dash) for (let i = 0; i + 1 < pts.length; i += 2) stroke([pts[i], pts[i + 1]], { c, w: 6 }); else stroke(pts, { c, w: 8 }); }
function chalkboard(x0, y0, w, h) { fillC(rect(x0 - 16, y0 - 16, w + 32, h + 32), '#8E6038', { w: 5 }); fillC(rect(x0, y0, w, h), '#2F4A3A', { hatch: '#26382E', ha: .5, line: null }); }
function chalk(txt, x, y, { size = 40, a = 1, align = 'left' } = {}) { label(txt, x, y, { size, c: '#EDEFE6', a, align }); }

// ---------- thumbnail (also shown as the first `thumbnail_intro` seconds of the video) ----------
// Config: lesson.json "thumbnail": {"lines": ["LINE 1", "LINE 2"], "tag": "short hook", "bg": ["#FFD166", "#F4845F"]}
function outlineText(txt, x, y, size, fill, { stroke = '#FFFFFF', sw = 20, align = 'left' } = {}) {
  ctx.save(); ctx.globalAlpha = GA; ctx.font = `${size}px ${FONT}`; ctx.textAlign = align; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
  ctx.lineWidth = sw + 10; ctx.strokeStyle = INK; ctx.strokeText(txt, x, y);
  ctx.lineWidth = sw; ctx.strokeStyle = stroke; ctx.strokeText(txt, x, y); ctx.fillStyle = fill; ctx.fillText(txt, x, y); ctx.restore(); }
function thumbScene(u) {
  const th = (window.TIMELINE && TIMELINE.thumbnail) || {}, lines = th.lines || [TIMELINE.title || ''], [c1, c2] = th.bg || ['#FFD166', '#F4845F'];
  gradBG(c1, c2);
  ctx.save(); ctx.translate(1450, 620); ctx.globalAlpha = .18; ctx.fillStyle = '#FFFFFF';
  for (let i = 0; i < 18; i++) { ctx.rotate(Math.PI / 9); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(1600, -140); ctx.lineTo(1600, 140); ctx.fill(); } ctx.restore();
  const size = Math.min(190, 1500 / Math.max(...lines.map(l => l.length)));
  lines.forEach((l, i) => outlineText(l, 90, 250 + i * size * 1.08, size, i % 2 ? RED : INK));
  if (th.tag) sign(th.tag, 90 + Math.min(520, th.tag.length * 17), 250 + lines.length * size * 1.08 + 40, { size: 62, bg: RED, fg: '#FFFFFF', rot: -.04 });
  shadow(1430, 960, 200); mascot(1430, 960, 1.9, { happy: 1, arms: 1, lookX: -6 });
  robot(1130, 970, .75, { happy: 1, arm: 1, armR: .4, rot: -.08 }); robot(1760, 970, .75, { happy: 1, armR: 1, arm: .4, rot: .08 });
  sparkle(1180, 520, 40); sparkle(1780, 480, 32); sparkle(1540, 300, 26);
}
