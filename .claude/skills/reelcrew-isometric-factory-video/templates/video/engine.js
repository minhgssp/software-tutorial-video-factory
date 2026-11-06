// Isometric "decision factory" engine.
// Each frame is a pure function of time: window.seek(t). All topic content and per-topic events live in story.js (window.STORY).
// Layers, drawn back to front:
//   zone → sources/pipes → router plate → deliver platform → stations/belt → depth-sorted boxes/gantries
//   → story overlays → caption → left panel.
// Coordinates: world units (x = along the belt, down-right on screen; y = down-left; z = up). P(x,y,z) → screen px.
(() => {
const ST = window.STORY, LY = ST.layout;
const C30 = Math.cos(Math.PI / 6), S = LY.S, OX = LY.OX, OY = LY.OY;
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lerp = (a, b, k) => a + (b - a) * k;
const ease = k => (k = clamp(k), k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);
const eo = k => 1 - Math.pow(1 - clamp(k), 3);
const win = (t, a, b, f = .35) => clamp((t - a) / f) * clamp((b - t) / f); // fade-in/out window
const P = (x, y, z = 0) => [OX + (x - y) * C30 * S, OY + (x + y) * .5 * S - z * S];
const pts = a => a.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const C = Object.assign({ ink: '#2b2b2b', top: '#fdfdfd', s1: '#f0f0f0', s2: '#e2e2e2', green: '#0c7c4c', gd: '#124b31', mint: '#e0ece4',
  mint2: '#cfe2d6', grid: '#e6e6e6', alert: '#b8452e', dark: '#1d2622', alertTop: '#f3d9d2' }, ST.colors || {});

// ---------- primitives ----------
// Extruded box: draws the +Y face, the +X face, then the top face (the only faces visible in this projection).
function box(x, y, z, w, d, h, o = {}) {
  const sw = o.sw || 1.1, st = o.stroke || C.ink, op = o.op == null ? 1 : o.op;
  const top = [P(x, y, z + h), P(x + w, y, z + h), P(x + w, y + d, z + h), P(x, y + d, z + h)];
  const fy = [P(x, y + d, z), P(x + w, y + d, z), P(x + w, y + d, z + h), P(x, y + d, z + h)];
  const fx = [P(x + w, y, z), P(x + w, y + d, z), P(x + w, y + d, z + h), P(x + w, y, z + h)];
  return `<g opacity="${op}"><polygon points="${pts(fy)}" fill="${o.fy || C.s1}" stroke="${st}" stroke-width="${sw}" stroke-linejoin="round"/>` +
    `<polygon points="${pts(fx)}" fill="${o.fx || C.s2}" stroke="${st}" stroke-width="${sw}" stroke-linejoin="round"/>` +
    `<polygon points="${pts(top)}" fill="${o.top || C.top}" stroke="${st}" stroke-width="${sw}" stroke-linejoin="round"/></g>`;
}
// Vertical cylinder. An iso circle of radius r is an ellipse with semi-axes r·S·√1.5 and r·S·√0.5.
function cyl(x, y, z, r, h, o = {}) {
  const rx = r * S * 1.2247, ry = r * S * .7071, [tx, ty] = P(x, y, z + h), [bx, by] = P(x, y, z);
  const st = o.stroke || C.ink;
  return `<path d="M${tx - rx},${ty} L${bx - rx},${by} A${rx},${ry} 0 0 0 ${bx + rx},${by} L${tx + rx},${ty} Z" fill="${o.side || C.s1}" stroke="${st}" stroke-width="1.1"/>` +
    `<ellipse cx="${tx}" cy="${ty}" rx="${rx}" ry="${ry}" fill="${o.top || C.top}" stroke="${st}" stroke-width="1.1"/>`;
}
function ring(x, y, z, r, o = {}) {
  const [cx, cy] = P(x, y, z);
  return `<ellipse cx="${cx}" cy="${cy}" rx="${r * S * 1.2247}" ry="${r * S * .7071}" fill="${o.fill || '#fdfdfd'}" stroke="${o.stroke || C.green}" stroke-width="${o.sw || 1.3}"/>`;
}
function line(a, b, o = {}) {
  return `<line x1="${a[0].toFixed(1)}" y1="${a[1].toFixed(1)}" x2="${b[0].toFixed(1)}" y2="${b[1].toFixed(1)}" stroke="${o.c || C.ink}" stroke-width="${o.w || 1}" ${o.dash ? `stroke-dasharray="${o.dash}"` : ''} ${o.op != null ? `opacity="${o.op}"` : ''} stroke-linecap="round"/>`;
}
function poly(a, o = {}) { return `<polyline points="${pts(a)}" fill="none" stroke="${o.c || C.ink}" stroke-width="${o.w || 1}" ${o.dash ? `stroke-dasharray="${o.dash}"` : ''} ${o.op != null ? `opacity="${o.op}"` : ''} stroke-linejoin="round" stroke-linecap="round"/>`; }
// Text lying on the floor plane, running along +X (like "Sandcastle" in the reference).
function floorText(x, y, z, s, size, o = {}) {
  const [px, py] = P(x, y, z);
  return `<text transform="matrix(${C30},.5,${-C30},.5,${px},${py})" font-family="${o.mono ? 'JetBrains Mono' : 'Inter'}" font-size="${size}" fill="${o.c || '#333'}" font-weight="${o.fw || 500}" letter-spacing="${o.ls || 0}" opacity="${o.op == null ? 1 : o.op}">${esc(s)}</text>`;
}
// A point at fraction k along a screen-space polyline (for travelling packets).
function along(path, k) {
  const L = []; let tot = 0;
  for (let i = 1; i < path.length; i++) { const d = Math.hypot(path[i][0] - path[i - 1][0], path[i][1] - path[i - 1][1]); L.push(d); tot += d; }
  let r = clamp(k) * tot;
  for (let i = 0; i < L.length; i++) { if (r <= L[i]) { const f = L[i] ? r / L[i] : 0; return [lerp(path[i][0], path[i + 1][0], f), lerp(path[i][1], path[i + 1][1], f)]; } r -= L[i]; }
  return path[path.length - 1];
}
// Small cube icons on the plate nodes (glyph library).
function glyph(kind, x, y, on) {
  if (kind === 'coins') return cyl(x - .5, y + .3, 1, .38, .5, { top: C.gd }) + cyl(x + .3, y - .2, 1, .38, .8, { top: C.top });
  if (kind === 'cube') return box(x - .6, y - .6, 1, 1.2, 1.2, .55, { top: C.gd });
  if (kind === 'flag') return box(x - .5, y - .2, 1, .3, .3, 1.5) + box(x - .2, y - .2, 1.9, .9, .3, .5, { top: C.alert, fx: '#c9725e', fy: '#d68a78' });
  if (kind === 'people') return cyl(x - .5, y + .4, 1, .3, .9) + cyl(x + .4, y - .3, 1, .3, .9, { top: C.gd });
  if (kind === 'bubble') return box(x - .7, y - .5, 1, 1.4, 1, .45) + box(x - .5, y - .3, 1.45, 1, .6, .3, { top: on ? C.gd : '#ddd' });
  return box(x - .7, y - .7, 1, 1.4, 1.4, .18) + box(x - .7, y - .7, 1.25, 1.4, 1.4, .18) + box(x - .7, y - .7, 1.5, 1.4, 1.4, .18, { top: C.gd }); // 'sheets'
}
window.ISO = { P, box, cyl, ring, line, poly, floorText, along, glyph, clamp, lerp, ease, eo, win, esc, C, S };

// ---------- timeline ----------
// SHIFTS: every belt move as [start, duration]. All boxes move one station per shift (lockstep, as in the reference).
const SHIFTS = [];
for (const seg of ST.shifts) for (let i = 0; i < seg.count; i++) SHIFTS.push([seg.start + seg.every * i, seg.dur]);
function beltU(t) { let u = 0; for (const [s, d] of SHIFTS) { if (t >= s + d) u++; else if (t > s) { u += ease((t - s) / d); break; } else break; } return u; }
function shiftIdx(t) { let n = 0; for (const [s] of SHIFTS) if (t >= s) n++; return n; }
const dwellStart = n => { const s = SHIFTS[n - 1]; return s ? s[0] + s[1] : 0; };
const dwellEnd = n => { const s = SHIFTS[n]; return s ? s[0] : ST.duration + 1; };

// ---------- data ----------
const TK = {};
ST.items.forEach(it => { TK[it.k] = Object.assign({ id: ST.idPrefix + (ST.idBase + it.k), ch: ST.channels[(it.k + 70) % ST.channels.length],
  p: (0.86 + ((it.k * 37 + 11) % 12) / 100).toFixed(2) }, it); });
const dest = tk => ST.dest ? ST.dest(tk) : tk.a;
const SX = LY.SX, BEND = LY.BEND, BW = LY.BW, BZ = LY.BZ, GH = LY.GH, PLATE = LY.plate, STACKS = LY.stacks, NODES = ST.nodes;
const PC = [PLATE.x + PLATE.w / 2, PLATE.y + PLATE.d / 2];
let stackCount = {};
const stackLevels = a => Math.min(5, 2 + Math.floor((stackCount[a] || 0) / 4));
const stackTop = a => 1.02 + 0.35 * stackLevels(a);

// World position of a ticket box for belt progress p (0 = start plate … 4 = last station, 5 = landed on its stack).
function boxAt(p, k) {
  if (p < 4) { const i = Math.floor(p), f = p - i; return { x: lerp(SX[i], SX[Math.min(i + 1, 4)], f), y: BW / 2, z: BZ }; }
  const f = p - 4;
  if (f <= .55) return { x: lerp(SX[4], BEND - .6, f / .55), y: BW / 2, z: BZ };
  const a = dest(TK[k]), [sx, sy] = STACKS[a], g = (f - .55) / .45;
  return { x: lerp(BEND - .6, sx, g), y: lerp(BW / 2, sy, g), z: lerp(BZ, stackTop(a), g) + Math.sin(g * Math.PI) * 2.2 };
}

// ---------- static setup ----------
function drawBg() {
  let g = `<rect width="1920" height="1080" fill="#f4f4f4"/>`;
  for (let i = -80; i <= 90; i += 2) { g += line(P(i, -60), P(i, 60), { c: C.grid, w: .8 }); g += line(P(-60, i), P(90, i), { c: C.grid, w: .8 }); }
  document.getElementById('bg').innerHTML = g;
}
const ICON = {
  ticket: '<path d="M2 4h13v3a2 2 0 0 0 0 4v3H2v-3a2 2 0 0 0 0-4z" fill="none" stroke="#222" stroke-width="1.4"/>',
  state: '<path d="M8.5 2 15 5.5 8.5 9 2 5.5z M2 9l6.5 3.5L15 9 M2 12.3l6.5 3.5 6.5-3.5" fill="none" stroke="#222" stroke-width="1.4"/>',
  route: '<circle cx="4" cy="8.5" r="2" fill="#222"/><path d="M6 8.5h3l4-5 M9 8.5l4 5 M9 8.5h5" fill="none" stroke="#222" stroke-width="1.4"/>',
  dispatch: '<path d="M2 3h5v5H2z M10 9h5v5h-5z M7 5.5h5.5v3.5 M9.5 12H4.5V8" fill="none" stroke="#222" stroke-width="1.4"/>',
  review: '<path d="M8.5 2 14.5 4.5v4c0 3.5-2.8 5.8-6 6.8-3.2-1-6-3.3-6-6.8v-4z M5.8 8.6l2 2 3.6-3.8" fill="none" stroke="#222" stroke-width="1.4"/>',
  deliver: '<path d="M9.8 2 4 9.8h4.4L7.2 15 13 7.2H8.6z" fill="none" stroke="#222" stroke-width="1.4" stroke-linejoin="round"/>',
};
function setupPanel() {
  const $ = id => document.getElementById(id);
  $('h1').textContent = ST.text.headerBold; $('h2').textContent = ST.text.headerRest;
  $('cardLab').textContent = ST.text.cardLabel; $('ledLab').textContent = ST.text.ledgerLabel;
  $('cols').innerHTML = ST.stations.map(s => `<span>${s.col}</span>`).join('');
  $('brand').innerHTML = `<svg width="22" height="22" viewBox="0 0 22 22" style="position:static"><path d="M2 20 L11 2 L20 20 Z M6.5 20 L11 11 L15.5 20" fill="none" stroke="#2a2a2a" stroke-width="2"/></svg>${esc(ST.text.brandBold)} <b>${esc(ST.text.brandRest)}</b>`;
  $('steps').innerHTML = ST.stations.map((s, i) => `<div class="st" id="st${i}"><span class="n">${String(i + 1).padStart(2, '0')}</span><svg viewBox="0 0 17 17">${ICON[s.icon] || ICON.deliver}</svg><span class="l">${esc(s.name)}</span></div>`).join('');
}

// ---------- frame ----------
function seek(t) {
  const u = beltU(t), n = shiftIdx(t);
  const act2 = ST.acts.length > 1 && t >= ST.acts[1].from;
  const A2 = ST.morph ? clamp((t - ST.morph[0]) / (ST.morph[1] - ST.morph[0])) : (act2 ? 1 : 0); // plate centre morph 0→1
  const ACT = ST.acts[act2 ? 1 : 0];
  const ov = [], add = h => ov.push(h);
  const dS = dwellStart(n), dE = dwellEnd(n), inDwell = t >= dS && t < dE, dw = t - dS;
  const intro = k => eo((t - k) / .9);
  let g = '';

  // tickets at each station during this dwell: ROUTE = station 2, DISPATCH = 3, REVIEW = 4
  const kRoute = n - 2, tr = TK[kRoute], td = TK[n - 3], tv = TK[n - 4];
  const ctx = { t, u, n, act2, A2, inDwell, dw, dS, dE, add, TK, dest, SX, BW, BZ, GH, PC, NODES, STACKS, PLATE, LY, tr, td, tv,
    kAt: s => TK[n - s], svg: s => { g += s; }, stackTop, stackCount: () => stackCount };

  // stack counts = base + every ticket that has fully landed (+ story adjustments, e.g. a handed-back ticket)
  stackCount = Object.assign({}, ST.stacksBase);
  for (let k = -40; k <= 400; k++) { const p = u - k; if (p >= 5 && TK[k]) stackCount[dest(TK[k])]++; }
  if (ST.adjustStacks) ST.adjustStacks(stackCount, ctx);

  // ---- agent-runtime zone: mint floor + dashed wireframe volume ----
  const Z = LY.zone, zi = intro(.5);
  g += `<g opacity="${zi}"><polygon points="${pts([P(Z.x0, Z.y0), P(Z.x1, Z.y0), P(Z.x1, Z.y1), P(Z.x0, Z.y1)])}" fill="${C.mint}" opacity=".75"/>`;
  for (const [a, b] of [[[Z.x0, Z.y0], [Z.x1, Z.y0]], [[Z.x1, Z.y0], [Z.x1, Z.y1]], [[Z.x1, Z.y1], [Z.x0, Z.y1]], [[Z.x0, Z.y1], [Z.x0, Z.y0]]]) {
    g += line(P(a[0], a[1], Z.h), P(b[0], b[1], Z.h), { c: C.green, w: .9, dash: '5 5', op: .6 });
    g += line(P(a[0], a[1], 0), P(b[0], b[1], 0), { c: C.green, w: .9, dash: '5 5', op: .5 });
  }
  for (const [x, y] of [[Z.x0, Z.y1], [Z.x1, Z.y1], [Z.x1, Z.y0], [Z.x0, Z.y0]]) g += line(P(x, y, 0), P(x, y, Z.h), { c: C.green, w: .9, dash: '5 5', op: .5 });
  g += floorText(Z.x0 + .3, Z.y1 + 2.4, 0, ST.text.zone, 17, { c: '#2a2a2a' });
  g += floorText(Z.x0 + .3, Z.y1 + 3.6, 0, ACT.zoneSub || '', 10, { mono: 1, c: '#7d7d7d', ls: 2, fw: 400 }) + '</g>';

  // ---- sources, pipes into the start plate, travelling packets ----
  const si = intro(.2), SJ = LY.sourceJoin; // manifold y and the start-plate inlet
  g += `<g opacity="${si}">`;
  const pipe = a => poly(a, { c: '#bdbdbd', w: 5 }) + poly(a, { c: '#f7f7f7', w: 3 });
  g += pipe([P(SJ.x, SJ.y), P(SJ.x + 3, SJ.y)]) + pipe([P(SJ.x, SJ.y), P(SJ.x, SJ.inY)]);
  ST.sources.forEach(([nm, x, y]) => { g += pipe([P(x, y, 0), P(x, SJ.y, 0), P(SJ.x, SJ.y, 0)]); });
  const rate = ST.packetRate ? ST.packetRate(t) : 1;
  ST.sources.forEach(([nm, x, y], i) => {
    for (let j = 0; j < 3; j++) {
      const q = along([P(x, y, 0), P(x, SJ.y, 0), P(SJ.x, SJ.y, 0), P(SJ.x, SJ.inY, 0)], (t * .35 * rate + i * .29 + j / 3) % 1);
      g += `<rect x="${q[0] - 3.5}" y="${q[1] - 3.5}" width="7" height="7" fill="${C.green}"/>`;
    }
  });
  ST.sources.forEach(([nm, x, y], i) => {
    g += cyl(x, y, 0, .95, 2, { top: ST.sourceHot && ST.sourceHot(i, t) ? C.green : C.top });
    const [lx, ly] = P(x, y, 3.4); add(`<div class="tag" style="left:${lx}px;top:${ly}px;font-size:11px;letter-spacing:.02em;text-transform:none;font-family:Inter;opacity:${si}">${esc(nm)}</div>`);
  });
  g += '</g>';

  // ---- router plate: grid slab, traces to nodes, highlighted route, nodes, centre building ----
  const pi = intro(.35);
  g += `<g opacity="${pi}">` + box(PLATE.x, PLATE.y, 0, PLATE.w, PLATE.d, PLATE.h, { top: '#f6fbf8' });
  for (let i = 1; i < PLATE.w; i++) g += line(P(PLATE.x + i, PLATE.y, 1), P(PLATE.x + i, PLATE.y + PLATE.d, 1), { c: '#e3ebe6', w: .7 });
  for (let i = 1; i < PLATE.d; i++) g += line(P(PLATE.x, PLATE.y + i, 1), P(PLATE.x + PLATE.w, PLATE.y + i, 1), { c: '#e3ebe6', w: .7 });
  const nodeOn = nm => act2 || !NODES[nm].act2Only;
  for (const [nm, nd] of Object.entries(NODES)) {
    const b = [PC[0] + nd.at[0], PC[1] + nd.at[1]];
    g += poly([P(PC[0], PC[1], 1), P(b[0], PC[1], 1), P(b[0], b[1], 1)], { c: C.green, w: 2.2, op: .85 * (nodeOn(nm) ? 1 : A2 * .9 + .1), dash: nodeOn(nm) ? '' : '4 4' });
  }
  const R = inDwell && tr && ST.route ? ST.route(tr, ctx) : null; // {node, k}: the plate node chosen for the ticket at ROUTE
  const chosen = R && R.node, chosenK = R ? R.k : 0; ctx.chosen = chosen;
  if (chosen && chosenK > 0) { const [nx, ny] = NODES[chosen].at, bx = PC[0] + nx, by = PC[1] + ny;
    const hp = [P(PC[0], PC[1], 1), P(bx, PC[1], 1), P(bx, by, 1)], q = along(hp, chosenK);
    const L1 = Math.hypot(hp[1][0] - hp[0][0], hp[1][1] - hp[0][1]), L2 = Math.hypot(hp[2][0] - hp[1][0], hp[2][1] - hp[1][1]);
    g += poly(chosenK * (L1 + L2) <= L1 ? [hp[0], q] : [hp[0], hp[1], q], { c: C.green, w: 4.2 }); }
  for (const [nm, nd] of Object.entries(NODES)) {
    const x = PC[0] + nd.at[0], y = PC[1] + nd.at[1], on = nodeOn(nm) ? 1 : A2, hot = chosen === nm ? chosenK : 0;
    g += ring(x, y, 1, 1.9, { stroke: on > .5 ? C.green : '#b8b8b8', sw: 1.3 + hot * 2.2 }) + glyph(nd.glyph, x, y, on > .5);
    if (hot > 0) { const [lx, ly] = P(x, y, 3.2); add(`<div class="tag g" style="left:${lx}px;top:${ly}px;opacity:${hot}">${esc(nd.label)}</div>`); }
  }
  // centre building: act-1 kind morphs into act-2 kind ('tower' = white block + speech bubble, 'dark' = dark block + bar chart)
  const cx = PC[0] - 1.8, cy = PC[1] - 1.8, K0 = ST.acts[0].centre, K1 = (ST.acts[1] || ST.acts[0]).centre;
  const building = (kind, k) => {
    const hh = (kind === 'dark' ? 2.6 : 4.4) * k; if (hh <= .05) return '';
    const [bx, by] = P(cx + 1.8, cy + 1.8, 1.25 + hh);
    if (kind === 'dark') return box(cx, cy, 1.25, 3.6, 3.6, hh, { top: C.green, fy: '#26332d', fx: '#1b2420', stroke: '#111' }) +
      `<g transform="translate(${bx},${by}) scale(${k})"><rect x="-9" y="-16" width="5" height="12" fill="#fff"/><rect x="-2" y="-11" width="5" height="7" fill="#fff" opacity=".8"/><rect x="5" y="-7" width="5" height="3" fill="#fff" opacity=".6"/></g>`;
    return box(cx, cy, 1.25, 3.6, 3.6, hh) +
      `<g transform="translate(${bx},${by - 16}) scale(${k})" opacity="${k}"><rect x="-17" y="-12" width="34" height="22" rx="3" fill="#fff" stroke="${C.ink}" stroke-width="1.2"/><path d="M-6 10 L-10 17 L0 10" fill="#fff" stroke="${C.ink}" stroke-width="1.2"/><path d="M-10 -4h20 M-10 2h13" stroke="${C.ink}" stroke-width="1.2"/></g>`;
  };
  g += box(cx - .8, cy - .8, 1, 5.2, 5.2, .25, { top: '#f2f2f2' });
  if (A2 < 1) g += building(K0.kind, 1 - A2);
  if (A2 > 0) g += building(K1.kind, A2);
  g += floorText(PLATE.x + .6, PLATE.y + PLATE.d + 1.1, 0, ACT.plateTitle, 17, { c: '#2a2a2a' });
  g += floorText(PLATE.x + (ACT.plateSubX || 8), PLATE.y + PLATE.d + 1.1, 0, ACT.plateSub, 13, { c: '#9a9a9a', fw: 400 });
  g += '</g>';
  { const kc = A2 > .5 ? K1 : K0, [lx, ly] = P(cx + 1.8, cy + 1.8, 1.25 + (kc.kind === 'dark' ? 2.6 : 4.4) + 1.5);
    add(`<div class="tag ${kc.kind === 'dark' ? 'k' : ''}" style="left:${lx}px;top:${ly}px;opacity:${pi}">${esc(kc.label)}</div>`); }

  // ---- deliver platform + stacks (one per destination) ----
  const di = intro(.65), DP = LY.deliver;
  g += `<g opacity="${di}">` + box(DP.x, DP.y, 0, DP.w, DP.d, .9);
  for (const [a, [sx, sy]] of Object.entries(STACKS)) {
    g += box(sx - 1.7, sy - 1.7, .9, 3.4, 3.4, .12, { top: C.mint2, fy: C.mint2, fx: '#bfd6c8' });
    const L = stackLevels(a);
    for (let i = 0; i < L; i++) g += box(sx - 1.35, sy - 1.35, 1.02 + i * .35, 2.7, 2.7, .28, { top: i === L - 1 ? (ST.darkStacks && ST.darkStacks.includes(a) ? C.gd : C.green) : C.top });
    const [lx, ly] = P(sx + 1.7, sy + 1.7, .9);
    add(`<div class="tag" style="left:${lx}px;top:${ly + 30}px;opacity:${di}">${esc(ST.stackLabels[a])} · ${stackCount[a]}</div>`);
  }
  if (LY.log && A2 > 0) { const OL = LY.log;
    g += `<g opacity="${A2}">` + box(OL[0] - 1.2, OL[1] - 1.2, .9, 2.4, 2.4, .3) + box(OL[0] - 1.2, OL[1] - 1.2, 1.2, 2.4, 2.4, .3) + box(OL[0] - 1.2, OL[1] - 1.2, 1.5, 2.4, 2.4, .3, { top: '#dde6e0' }) + '</g>';
    const [lx, ly] = P(OL[0] + 1.2, OL[1] + 1.2, .9); add(`<div class="tag" style="left:${lx}px;top:${ly + 30}px;opacity:${A2 * di}">${esc(ST.text.logLabel)}</div>`); }
  g += '</g>';

  // ---- stations: start plate, slabs, belt legs, story floor items, back gantry posts, belt with moving slats ----
  const sti = intro(.45);
  g += `<g opacity="${sti}">` + box(-2.4, -1, 0, 5, 4.2, BZ, { top: C.mint2 });
  for (let i = 1; i < 5; i++) g += box(SX[i] - 3, -.8, 0, 6, 6.2, .55) + box(SX[i] - .4, BW / 2 - .4, .55, .8, .8, BZ - .55 - .4);
  g += box(SX[4] + 4.6, BW / 2 - .4, 0, .8, .8, BZ - .4);
  if (ST.floorItems) g += ST.floorItems(ctx);
  for (let i = 1; i < 5; i++) g += box(SX[i] - .3, -.8, .55, .6, .45, GH - .55);
  g += box(-1, 0, BZ - .45, BEND + 1, BW, .45, { top: '#f2f2f2' });
  const slat = ((u * 9.2) % .9 + .9) % .9;
  for (let x = -1 + slat; x < BEND; x += .9) g += line(P(x, 0, BZ), P(x, BW, BZ), { c: '#cfcfcf', w: .8 });
  g += box(-1, 0, BZ - .45, BEND + 1, BW, 0, { top: 'none' }); // re-stroke the belt's lower edges over the slats: reads as a rail lip
  g += '</g>';

  // ---- depth-sorted items (painter's order by x+y): gantry fronts, review pins, ticket boxes, story extras ----
  const items = [];
  for (let i = 1; i < 5; i++) {
    const sp = inDwell ? eo((dw - .15) / .2) * (1 - clamp((t - (dE - .15)) / .15)) : 0; // gantry stamp (beam top turns green)
    items.push({ d: SX[i] + BW + .01, s: box(SX[i] - .3, BW + .35, .55, .6, .45, GH - .55) + box(SX[i] - .4, -.8, GH, .8, BW + 1.6, .4, { top: sp > .5 ? C.green : C.top }) });
  }
  const alertReview = tv && ST.reviewAlert && ST.reviewAlert(tv);
  for (let j = 0; j < 5; j++) { const px = SX[4] + 1.4 + j * .7, py = 3.3 + (j % 2) * 1.1, hgt = 1.6 + (j % 3) * .5;
    const lit = alertReview && inDwell && dw > .3 + j * .08, tp = P(px, py, .55 + hgt);
    items.push({ d: px + py, s: line(P(px, py, .55), tp, { c: '#777', w: 1.2 }) + `<circle cx="${tp[0]}" cy="${tp[1]}" r="3.6" fill="${lit ? C.alert : (j % 2 ? C.green : '#8f8f8f')}"/>` }); }
  for (let k = kRoute - 4; k <= kRoute + 3; k++) {
    const tk = TK[k]; if (!tk) continue; const p = u - k;
    if (p < -1 || p > 5.001) continue;
    let pos, op = 1;
    if (p < 0) { pos = { x: SX[0], y: BW / 2, z: BZ + 3.5 * p * p }; op = clamp(1 + p * 1.5); } // drop onto the start plate
    else pos = boxAt(p, k);
    const stampK = Math.abs(p - Math.round(p)) < .001 && inDwell && dw > .2;
    const bs = Object.assign({ top: stampK || p >= 5 ? C.green : C.top, lift: 0 }, ST.boxStyle ? ST.boxStyle(tk, p, ctx) : {});
    items.push({ d: pos.x + pos.y + .02, s: box(pos.x - .8, pos.y - .8, pos.z + bs.lift, 1.6, 1.6, 1.25, { top: bs.top, op }) });
    if (p > -.5 && p < 4.9) { const [lx, ly] = P(pos.x, pos.y, pos.z + bs.lift + 2.25); add(`<div class="tag" style="left:${lx}px;top:${ly}px;opacity:${op}">${tk.id}</div>`); }
  }
  if (ST.extraItems) items.push(...ST.extraItems(ctx));
  items.sort((a, b) => a.d - b.d);
  g += `<g opacity="${sti}">` + items.map(i => i.s).join('') + '</g>';

  // station floor labels (the focused one turns green)
  const fs = ST.focus ? ST.focus(t) : -1;
  [[SX[0] - 2.6, 3.8], [SX[1] - 3, 5.6], [SX[2] - 3, 5.6], [SX[3] - 3, 5.6], [SX[4] - 3, 5.6]].forEach(([x, y], i) => {
    const [lx, ly] = P(x, y, 0);
    add(`<div class="slab" style="left:${lx - 112}px;top:${ly - 6}px;opacity:${sti};${fs === i ? 'background:#0c7c4c;color:#fff;border-color:#0c7c4c' : ''}">${String(i + 1).padStart(2, '0')} ${esc(ST.stations[i].name)}</div>`);
  });
  { const [lx, ly] = P(DP.x, DP.y + DP.d, 0); add(`<div class="slab" style="left:${lx - 118}px;top:${ly}px;opacity:${di}">06 ${esc(ST.stations[5].name)}</div>`); }

  // dotted lookup line: ROUTE station → plate centre
  if (inDwell && tr) { const a = P(SX[2], BW / 2, BZ + 1.3), b = P(PC[0], PC[1], 3.2), k = eo(dw / .35);
    g += line(a, [lerp(a[0], b[0], k), lerp(a[1], b[1], k)], { c: C.green, w: 1.6, dash: '1.5 5' }); }

  // ---- story overlays (chips, packets, loops) ----
  if (ST.overlays) ST.overlays(ctx);
  document.getElementById('scene').innerHTML = g;

  // ---- caption note (fixed top-right card) ----
  const cap = ST.captions.find(c => t >= c[0] - .3 && t < c[1] + .3);
  if (cap) { const o = win(t, cap[0], cap[1], .3), i = ST.captions.indexOf(cap), [px, py] = LY.caption;
    add(`<div class="cap" style="left:${px}px;top:${py + (1 - o) * 10}px;opacity:${o}"><div class="h"><span>[ ${esc(ST.captionTag(i))} ]</span><b>${String(i + 1).padStart(2, '0')} / ${ST.captions.length}</b></div><div class="x">${esc(cap[2])}</div></div>`); }
  document.getElementById('ov').innerHTML = ov.join('');

  // ---- left panel + header ----
  const $ = id => document.getElementById(id);
  const tIntro = t < ST.introEnd;
  $('act').textContent = tIntro ? ST.text.introLabel : ACT.label;
  const titles = [ST.text.introTitle, ST.acts[0].title, (ST.acts[1] || ST.acts[0]).title];
  const ti = tIntro ? 0 : act2 ? 2 : 1, tPrev = tIntro ? 0 : act2 ? 1 : 0, sk = clamp((t - (ti === 2 ? ST.acts[1].from : ST.introEnd)) / .5);
  $('ti1').textContent = titles[tPrev]; $('ti1').style.opacity = ti === tPrev ? 1 : 1 - sk; $('ti1').style.transform = `translateY(${-8 * sk}px)`;
  $('ti2').textContent = titles[ti]; $('ti2').style.opacity = ti === tPrev ? 0 : sk; $('ti2').style.transform = `translateY(${8 * (1 - sk)}px)`;
  for (let i = 0; i < 6; i++) $('st' + i).className = 'st' + (fs === i ? ' on' : '');
  const tick = ST.ticker(t, ctx); $('ticker').innerHTML = tick.html; $('tdot').style.background = tick.alert ? C.alert : C.green;
  $('hbtn').textContent = ACT.button; $('sheet').textContent = ACT.sheet;

  // live card follows the ticket at ROUTE
  const lt = TK[kRoute] || TK[0], lc = ST.liveCard(lt, ctx);
  $('qid').textContent = lt.id; $('q').textContent = '“' + lt.q + '”';
  $('lines').innerHTML = lc.map(([a, c, d]) => `<div class="ln mono ${c}"><i></i><span>${esc(a)}${d ? `<span class="d">${esc(d)}</span>` : ''}</span></div>`).join('');

  // ledger: newest first; rows slide down while a new ticket enters
  const newest = Math.ceil(u - 1e-6), fr = newest - u;
  let rows = '';
  for (let r = 0; r < 6; r++) { const k = newest - r, tk = TK[k]; if (!tk) continue; const p = u - k, yy = (r - fr) * 50;
    const sq = [0, 1, 2, 3, 4, 5].map(s => `<i class="${ST.ledgerBad && ST.ledgerBad(tk, s, p, ctx) ? 'x' : (p > s + .5 ? 'f' : (Math.round(p) === s ? 'c' : ''))}"></i>`).join('');
    const dd = p >= 2.6 ? ST.ledgerDest(tk, p, ctx) : { text: '…' };
    rows += `<div class="row" style="top:${yy}px;opacity:${r === 0 ? clamp((1 - fr) * 2) : r === 5 ? fr : 1}"><span class="a mono">${tk.id} · ${tk.ch}</span><span class="b">${esc(tk.q)}</span><span class="sq">${sq}</span><span class="dst mono${dd.bad ? ' bad' : ''}">${esc(dd.text)}</span></div>`; }
  $('rows').innerHTML = rows;
  $('left').style.opacity = intro(0); $('card').style.opacity = intro(.25); $('ledger').style.opacity = intro(.4);
}

window.boot = async () => { drawBg(); setupPanel(); await document.fonts.ready; seek(0); return ST.duration; };
window.seek = seek;
})();
