// pixel-explainer engine: vẽ toàn bộ khung hình lên một canvas, render(t) là hàm thuần (seek được).
// Dữ liệu (palette, cel sprite, cảnh, phụ đề) do build.py nhúng vào chỗ __DATA__.
// Quy ước: toạ độ trong cảnh tính theo lưới logic (1 ô = D.block px). Kiểu hiện pixel và hoạt ảnh nhảy theo
// bước 12 fps; lò xo spotlight và chuyển cảnh tính theo từng frame.
const D = __DATA__;
const W = D.W, H = D.H, B = D.block, GW = W / B, GH = H / B;
const SAFE = D.safe;
const INKHEX = '#1a1c2c', WHITE = '#f4f4f4', YELLOW = '#ffcd75';
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
const DUR = { trace: 0.8, bloom: 0.5, scan: 0.5, dither: 0.5, none: 0 };
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const snap = (v) => Math.round(v / B) * B;
const hash = (n) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
// Tiến độ nhảy bậc 12 fps, tính từ lúc bắt đầu nên bậc đầu tiên hiện ngay tại `at`.
const prog = (t, at, dur) => (t < at ? 0 : dur <= 0 ? 1 : clamp((Math.floor((t - at) * 12) + 1) / (12 * dur), 0, 1));

const PAL = D.palette.map((h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]);
const INK = D.palette.indexOf(INKHEX) + 1;

function decode(s) {
  const bin = atob(s);
  const a = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) a[i] = bin.charCodeAt(i);
  return a;
}

const CELS = D.cels.map((c) => {
  const idx = decode(c.d);
  const cv = document.createElement('canvas');
  cv.width = c.w; cv.height = c.h;
  const g = cv.getContext('2d');
  const im = g.createImageData(c.w, c.h);
  for (let i = 0; i < idx.length; i++) {
    const p = idx[i];
    if (!p) continue;
    const col = PAL[p - 1];
    im.data[i * 4] = col[0]; im.data[i * 4 + 1] = col[1]; im.data[i * 4 + 2] = col[2]; im.data[i * 4 + 3] = 255;
  }
  g.putImageData(im, 0, 0);
  return { x: c.x, y: c.y, w: c.w, h: c.h, idx, cv, ranks: {}, scratch: null, im: null };
});

// Thứ tự hiện từng pixel cho mỗi kiểu reveal, chuẩn hoá về [0, 1).
function ranks(cel, kind) {
  if (cel.ranks[kind]) return cel.ranks[kind];
  const { w, h, idx } = cel;
  const n = w * h;
  const r = new Float32Array(n).fill(2);
  const on = [];
  for (let i = 0; i < n; i++) if (idx[i]) on.push(i);
  const N = on.length || 1;
  if (kind === 'trace') {
    // Nét viền màu mực đi trước theo BFS (như bút vẽ), phần tô theo sau.
    const order = [];
    const seen = new Uint8Array(n);
    for (const inkPass of [true, false]) {
      const want = (i) => idx[i] && (idx[i] === INK) === inkPass;
      for (const s of on) {
        if (seen[s] || !want(s)) continue;
        const q = [s];
        seen[s] = 1;
        for (let k = 0; k < q.length; k++) {
          const i = q[k];
          order.push(i);
          const x = i % w, y = (i / w) | 0;
          for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
            const nx = x + dx, ny = y + dy;
            if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
            const j = ny * w + nx;
            if (!seen[j] && want(j)) { seen[j] = 1; q.push(j); }
          }
        }
      }
    }
    order.forEach((i, k) => { r[i] = k / N; });
  } else if (kind === 'bloom') {
    const cx = w / 2, cy = h / 2, R = Math.hypot(cx, cy) || 1;
    for (const i of on) r[i] = 0.85 * Math.hypot((i % w) + 0.5 - cx, ((i / w) | 0) + 0.5 - cy) / R + 0.149 * hash(i);
  } else if (kind === 'scan') {
    for (const i of on) r[i] = (((i / w) | 0) + ((i % w) / w) * 0.5) / (h + 0.5);
  } else {
    for (const i of on) r[i] = (BAYER[(((i / w) | 0) & 3) * 4 + ((i % w) & 3)] + 0.5) / 16;
  }
  cel.ranks[kind] = r;
  return r;
}

function partial(cel, kind, p) {
  const r = ranks(cel, kind);
  if (!cel.scratch) {
    cel.scratch = document.createElement('canvas');
    cel.scratch.width = cel.w; cel.scratch.height = cel.h;
    cel.im = cel.scratch.getContext('2d').createImageData(cel.w, cel.h);
  }
  const d = cel.im.data;
  d.fill(0);
  const edge = kind === 'dither' ? 0 : 0.07;
  const hi = kind === 'scan' ? [115, 239, 247] : [244, 244, 244];
  for (let i = 0; i < cel.idx.length; i++) {
    const v = cel.idx[i];
    if (!v || r[i] >= p) continue;
    const col = r[i] >= p - edge ? hi : PAL[v - 1];
    d[i * 4] = col[0]; d[i * 4 + 1] = col[1]; d[i * 4 + 2] = col[2]; d[i * 4 + 3] = 255;
  }
  cel.scratch.getContext('2d').putImageData(cel.im, 0, 0);
  return cel.scratch;
}

// Lò xo tắt dần (ζ 0,55): vượt nhẹ rồi về đích trong ~0,4 giây.
function spring(x) {
  if (x <= 0) return 0;
  const z = 0.55, w0 = 16, wd = w0 * Math.sqrt(1 - z * z);
  return 1 - Math.exp(-z * w0 * x) * (Math.cos(wd * x) + ((z * w0) / wd) * Math.sin(wd * x));
}

function spotAt(spots, name, t) {
  let s = 1, a = 1;
  if (!name.startsWith('node:') && !name.startsWith('edge:')) return { s, a };
  for (const sp of spots) {
    if (t < sp.from || t > sp.to + 0.8) continue;
    const on = spring(t - sp.from) * (t >= sp.to ? 1 - spring(t - sp.to) : 1);
    const env = clamp((t - sp.from) / 0.25, 0, 1) * (t >= sp.to ? 1 - clamp((t - sp.to) / 0.25, 0, 1) : 1);
    const id = name.slice(5);
    const linked = name.startsWith('edge:') && (id.startsWith(sp.node + '-') || id.endsWith('-' + sp.node));
    if (name === 'node:' + sp.node) s = 1 + (1 / 6) * on;
    else if (!linked && !(sp.keep || []).includes(id)) a = Math.min(a, 1 - 0.75 * env);
  }
  return { s, a };
}

function dimAt(dim, t) {
  let a = 1;
  for (const [ts, v] of dim || []) if (t >= ts) a += (v - a) * clamp((t - ts) / 0.3, 0, 1);
  return a;
}

function posAt(it, t) {
  let x = it.x, y = it.y;
  for (const [t0, t1, x1, y1] of it.move || []) {
    if (t >= t1) { x = x1; y = y1; } else if (t > t0) {
      const k = clamp((Math.floor((t - t0) * 12) + 1) / ((t1 - t0) * 12), 0, 1);
      const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
      x += (x1 - x) * e; y += (y1 - y) * e;
    }
  }
  return [Math.round(x), Math.round(y)];
}

function frameAt(S, it, t) {
  if (it.frame != null) return it.frame;
  if (S.nframes <= 1) return 0;
  let tag = S.tags.idle ? 'idle' : null, t0 = (it.at || 0) - (it.phase || 0);
  for (const [ts, tg] of it.anim || []) if (t >= ts) { tag = tg; t0 = ts; }
  const [f0, f1] = tag && S.tags[tag] ? S.tags[tag] : [0, S.nframes - 1];
  let total = 0;
  for (let f = f0; f <= f1; f++) total += S.durations[f];
  let ms = (((t - t0) * 1000) % total + total) % total;
  for (let f = f0; f <= f1; f++) { if (ms < S.durations[f]) return f; ms -= S.durations[f]; }
  return f1;
}

function popCurve(p) {
  if (p <= 0) return 0;
  return p < 0.6 ? 0.35 + (1.2 - 0.35) * (p / 0.6) : 1.2 - 0.2 * ((p - 0.6) / 0.4);
}

function blit(g, src, x, y, w, h, flip) {
  if (!flip) { g.drawImage(src, x, y, w, h); return; }
  g.save();
  g.translate(x + w, y);
  g.scale(-1, 1);
  g.drawImage(src, 0, 0, w, h);
  g.restore();
}

function drawSprite(g, it, t) {
  const S = D.sprites[it.sprite];
  const at = it.at || 0;
  if (!S || t < at) return;
  const outp = it.out && t >= it.out.at ? 1 - prog(t, it.out.at, it.out.dur || 0.4) : 1;
  if (outp <= 0) return;
  const alpha = dimAt(it.dim, t);
  if (alpha <= 0.01) return;
  const [x, y] = posAt(it, t);
  const sc = it.scale || 1, PS = B * sc, fi = frameAt(S, it, t);
  const kind0 = it.reveal || 'none';
  const pop = kind0 === 'pop' ? popCurve(prog(t, at, it.rdur || 0.25)) : 1;
  if (pop <= 0) return;
  const X = x * B, Y = y * B, cxS = X + (S.w * PS) / 2, cyS = Y + (S.h * PS) / 2;
  for (let li = 0; li < S.layers.length; li++) {
    const name = S.layers[li];
    const ci = S.cels[li][fi];
    if (ci < 0) continue;
    const L = it.layers && it.layers[name];
    if (L && L.hide) continue;
    const lat = L && L.at != null ? L.at : at;
    if (t < lat) continue;
    let k = L && L.reveal ? L.reveal : kind0 === 'pop' ? 'none' : kind0;
    let p = k === 'none' ? 1 : prog(t, lat, (L && L.rdur) || it.rdur || DUR[k]);
    if (L && L.out != null && t >= L.out) {
      const q = 1 - prog(t, L.out, 0.4);
      if (q < p) { p = q; k = 'dither'; }
    }
    if (outp < 1 && outp < p) { p = outp; k = it.out.kind || 'dither'; }
    if (p <= 0) continue;
    const cel = CELS[ci];
    const sp = it.spot ? spotAt(it.spot, name, t) : { s: 1, a: 1 };
    const src = p >= 1 ? cel.cv : partial(cel, k, p);
    const cxl = it.flip ? S.w - cel.x - cel.w : cel.x;
    const w = cel.w * PS * sp.s, h = cel.h * PS * sp.s;
    const cx = X + (cxl + cel.w / 2) * PS, cy = Y + (cel.y + cel.h / 2) * PS;
    const dx = (cx - cxS) * pop + cxS - (w * pop) / 2, dy = (cy - cyS) * pop + cyS - (h * pop) / 2;
    g.globalAlpha = alpha * sp.a;
    blit(g, src, Math.round(dx), Math.round(dy), Math.round(w * pop), Math.round(h * pop), it.flip);
  }
  g.globalAlpha = 1;
}

// ---------------------------------------------------------------- chữ
const FONT = {
  vt: (s) => `400 ${s}px 'VT323'`,
  mono: (s) => `500 ${s}px 'JetBrains Mono'`,
  bvp: (s, w) => `${w || 700} ${s}px 'Be Vietnam Pro'`,
};
const MCTX = document.createElement('canvas').getContext('2d');
function width(font, s) { MCTX.font = font; return MCTX.measureText(s).width; }

// Nhãn VT323; dãy chữ số vẽ bằng JetBrains Mono 500.
function segs(text, size) {
  const out = [];
  const re = /(\d+)/g;
  let last = 0, m;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push({ s: text.slice(last, m.index), f: FONT.vt(size), dy: 0 });
    out.push({ s: m[1], f: FONT.mono(Math.round(size * 0.74)), dy: size * 0.02 });
    last = m.index + m[1].length;
  }
  if (last < text.length) out.push({ s: text.slice(last), f: FONT.vt(size), dy: 0 });
  for (const o of out) o.w = width(o.f, o.s);
  return out;
}

function shape(g, x, y, w, h, col) {
  g.fillStyle = col;
  g.fillRect(x + B, y, w - 2 * B, h);
  g.fillRect(x, y + B, w, h - 2 * B);
}

function plate(g, x, y, w, h, fill, edge, thick) {
  shape(g, x + B, y + B, w, h, INKHEX);
  shape(g, x, y, w, h, edge);
  const e = (thick || 1) * B;
  g.fillStyle = fill;
  g.fillRect(x + e, y + e, w - 2 * e, h - 2 * e);
}

const STYLE = {
  dark: { fill: INKHEX, edge: WHITE, color: WHITE },
  accent: { fill: INKHEX, edge: YELLOW, color: YELLOW },
  bubble: { fill: WHITE, edge: INKHEX, color: INKHEX },
  stamp: { fill: INKHEX, edge: '#38b764', color: '#a7f070', thick: 2 },
  warn: { fill: INKHEX, edge: '#b13e53', color: '#ef7d57' },
  outline: { color: WHITE },
};

function labelLayout(it) {
  if (it._lay) return it._lay;
  const size = it.size || 64;
  const st = Object.assign({}, STYLE[it.plate || 'dark'], it.style || {});
  const variants = Array.isArray(it.text) ? it.text.map((v) => v[1]) : [it.text];
  const lh = Math.round(size * (it.lh || 1.0));
  const bare = it.plate === 'outline';
  const padX = bare ? 0 : snap(size * 0.4), padY = bare ? 0 : snap(size * 0.22);
  let wmax = 0, nmax = 1;
  for (const v of variants) {
    const lines = v.split('\n');
    nmax = Math.max(nmax, lines.length);
    for (const ln of lines) wmax = Math.max(wmax, segs(ln, size).reduce((a, o) => a + o.w, 0));
  }
  const pw = Math.ceil((wmax + 2 * padX) / B) * B, ph = Math.ceil((nmax * lh + 2 * padY + (bare ? 0 : size * 0.12)) / B) * B;
  const ax = it.x * B;
  let left = it.align === 'l' ? ax : it.align === 'r' ? ax - pw : ax - pw / 2;
  left = snap(clamp(left, SAFE[0], SAFE[2] - pw));
  const top = snap(it.y * B);
  it._lay = { size, st, lh, padX, padY, pw, ph, left, top, bare };
  return it._lay;
}

function drawText(g, text, x, cy, size, color, limit, outline) {
  let left = x, used = 0;
  for (const o of segs(text, size)) {
    let s = o.s;
    if (limit != null) {
      if (used >= limit) break;
      s = s.slice(0, limit - used);
      used += s.length;
    }
    g.font = o.f;
    if (outline) {
      g.lineWidth = Math.max(8, size * 0.17);
      g.lineJoin = 'round';
      g.strokeStyle = INKHEX;
      g.strokeText(s, left, cy + o.dy);
    }
    g.fillStyle = color;
    g.fillText(s, left, cy + o.dy);
    left += o.w;
  }
}

function currentText(it, t) {
  if (!Array.isArray(it.text)) return [it.text, it.at];
  let cur = null, since = it.at;
  for (const [ts, s] of it.text) if (t >= ts) { cur = s; since = ts; }
  return [cur, since];
}

function drawLabel(g, it, t) {
  if (t < it.at) return;
  if (it.out != null && t >= it.out) return;
  const [text, since] = currentText(it, t);
  if (text == null) return;
  const L = labelLayout(it);
  const alpha = dimAt(it.dim, t);
  g.globalAlpha = alpha;
  if (!L.bare) {
    // Nhịp 12 fps đầu tiên tấm nở thêm một block mỗi phía rồi về cỡ thật; chữ gõ ngay từ nhịp đó, không có khung rỗng.
    const pop = t - it.at < 1 / 12 ? B : 0;
    plate(g, L.left - pop, L.top - pop, L.pw + 2 * pop, L.ph + 2 * pop, L.st.fill, L.st.edge, L.st.thick);
    if (it.tail) tail(g, L, it.tail, L.st);
  }
  let limit = null;
  // Tem đóng dấu hiện nguyên chữ một lần, không gõ từng ký tự.
  if (it.type !== false && it.plate !== 'stamp') {
    const steps = Math.floor((t - since) * 12) + 1;
    limit = Math.ceil((steps * (it.cps || 30)) / 12);
  }
  g.textBaseline = 'middle';
  g.textAlign = 'left';
  const lines = text.split('\n');
  let used = 0;
  lines.forEach((ln, i) => {
    const lw = segs(ln, L.size).reduce((a, o) => a + o.w, 0);
    const x = it.align === 'l' && L.bare ? L.left : it.align === 'r' && L.bare ? L.left + L.pw - lw : L.left + (L.pw - lw) / 2;
    const cy = L.top + L.padY + L.lh * (i + 0.5) + L.size * 0.1;
    const lim = limit == null ? null : Math.max(0, limit - used);
    drawText(g, ln, x, cy, L.size, it.color || L.st.color, lim, L.bare);
    used += ln.length;
  });
  if (it.strike && t >= it.strike.at) {
    const p = prog(t, it.strike.at, it.strike.dur || 0.25);
    const y = snap(L.top + L.ph / 2 - B);
    const x0 = L.left + (L.bare ? -B : L.padX - B), full = L.pw - (L.bare ? -2 * B : 2 * L.padX - 2 * B);
    const w = snap(full * p), th = L.size >= 90 ? 2 * B : B;
    // Vạch mảnh cắt ngang thân chữ, bóng mực ngay dưới; không phủ băng tối để chữ bị gạch vẫn đọc được.
    g.fillStyle = INKHEX;
    g.fillRect(x0 + B, y + th, w, B);
    g.fillStyle = it.strike.color || '#b13e53';
    g.fillRect(x0, y, w, th);
  }
  g.globalAlpha = 1;
}

function tail(g, L, where, st) {
  const left = where.endsWith('l');
  const up = where.startsWith('t');
  const bx = left ? L.left + 3 * B : L.left + L.pw - 6 * B;
  for (let i = 0; i < 3; i++) {
    const y = up ? L.top - (i + 1) * B : L.top + L.ph + i * B;
    const w = (3 - i) * B;
    const x = left ? bx : bx + i * B;
    g.fillStyle = st.edge;
    g.fillRect(x - B, y, w + 2 * B, B);
    g.fillStyle = st.fill;
    g.fillRect(x, y, w, B);
  }
}

// Câu chốt chữ to Be Vietnam Pro 900, hiện từng từ theo giọng.
function headLayout(it) {
  if (it._lay) return it._lay;
  const font = FONT.bvp(it.size, 900);
  const space = width(font, ' ');
  const lines = [];
  let cur = [], cw = 0;
  it.words.forEach((w, i) => {
    const ww = width(font, w.text);
    if (cur.length && cw + space + ww > it.maxw) { lines.push({ items: cur, w: cw }); cur = []; cw = 0; }
    cur.push({ i, w: ww });
    cw += (cur.length > 1 ? space : 0) + ww;
  });
  if (cur.length) lines.push({ items: cur, w: cw });
  const lh = Math.round(it.size * 1.22);
  const pos = [];
  lines.forEach((ln, li) => {
    let x = it.x * B - ln.w / 2;
    for (const o of ln.items) { pos[o.i] = { x, y: it.y * B + lh * (li + 0.5), w: o.w }; x += o.w + space; }
  });
  it._lay = { font, pos, lh };
  return it._lay;
}

function drawHeadline(g, it, t) {
  if (t < it.at) return;
  const L = headLayout(it);
  g.textBaseline = 'middle';
  g.textAlign = 'left';
  it.words.forEach((w, i) => {
    if (t < w.t) return;
    const next = it.words[i + 1];
    const live = !next || t < next.t;
    // Từ mới bật lên một block trong nhịp 12 fps đầu, không phóng to để khỏi lấn khoảng trắng sang từ bên cạnh.
    const lift = Math.floor((t - w.t) * 12) === 0 ? B : 0;
    const p = L.pos[i];
    g.font = L.font;
    g.fillStyle = INKHEX;
    g.fillText(w.text, p.x + B, p.y + B - lift);
    g.fillStyle = w.hl || (live && it.live !== false) ? YELLOW : WHITE;
    g.fillText(w.text, p.x, p.y - lift);
  });
}

function drawArrow(g, it, t) {
  if (t < it.at) return;
  const p = prog(t, it.at, it.rdur || 0.35);
  const th = (it.th || 2) * B, hd = it.head || 4;
  const dx = it.x1 - it.x0, dy = it.y1 - it.y0;
  const horiz = Math.abs(dx) >= Math.abs(dy);
  const len = Math.abs(horiz ? dx : dy) * B * p;
  g.save();
  g.translate(it.x0 * B, it.y0 * B);
  if (horiz && dx < 0) g.scale(-1, 1);
  if (!horiz) g.rotate(dy > 0 ? Math.PI / 2 : -Math.PI / 2);
  const rects = [];
  const shaft = Math.max(0, len - hd * B);
  if (shaft > 0) rects.push([0, -th / 2, shaft, th]);
  if (len >= hd * B) for (let i = 0; i < hd; i++) rects.push([len - (i + 1) * B, -((2 * i + 1) * B) / 2, B, (2 * i + 1) * B]);
  g.fillStyle = INKHEX;
  for (const [x, y, w, h] of rects) g.fillRect(x - B, y - B, w + 2 * B, h + 2 * B);
  g.fillStyle = it.color || YELLOW;
  for (const [x, y, w, h] of rects) g.fillRect(x, y, w, h);
  g.restore();
}

function drawFrame(g, it, t) {
  if (t < it.at || (it.out != null && t >= it.out)) return;
  const k = Math.floor((t - it.at) * 12);
  if (k < 5 && k % 2 === 1) return;
  const x = it.x * B, y = it.y * B, w = it.w * B, h = it.h * B, th = (it.th || 1) * B;
  g.fillStyle = it.color || YELLOW;
  g.fillRect(x, y, w, th); g.fillRect(x, y + h - th, w, th);
  g.fillRect(x, y, th, h); g.fillRect(x + w - th, y, th, h);
}

const DRAW = { sprite: drawSprite, label: drawLabel, headline: drawHeadline, arrow: drawArrow, frame: drawFrame };

// ---------------------------------------------------------------- nền
const BGC = (() => {
  const c = document.createElement('canvas');
  c.width = GW; c.height = GH;
  const g = c.getContext('2d');
  const im = g.createImageData(GW, GH);
  const top = [0x29, 0x36, 0x6f], bot = [0x20, 0x28, 0x4a];
  for (let y = 0; y < GH; y++) {
    const v = clamp((y / GH - 0.3) / 0.5, 0, 1);
    for (let x = 0; x < GW; x++) {
      const col = v > (BAYER[(y & 3) * 4 + (x & 3)] + 0.5) / 16 ? bot : top;
      const i = (y * GW + x) * 4;
      im.data[i] = col[0]; im.data[i + 1] = col[1]; im.data[i + 2] = col[2]; im.data[i + 3] = 255;
    }
  }
  g.putImageData(im, 0, 0);
  return c;
})();
const STARS = Array.from({ length: 36 }, (_, i) => ({
  x: Math.floor(hash(i * 3 + 1) * GW), y: Math.floor(hash(i * 3 + 2) * GH * 0.6), big: hash(i * 3 + 3) > 0.78, ph: hash(i * 7 + 5),
}));

function background(g, t) {
  g.drawImage(BGC, 0, 0, W, H);
  STARS.forEach((s, i) => {
    const v = hash(i * 13 + Math.floor(t * 2 + s.ph * 8));
    if (v < 0.35) return;
    g.fillStyle = v > 0.82 ? '#94b0c2' : '#3b5dc9';
    g.fillRect(s.x * B, s.y * B, B, B);
    if (s.big && v > 0.6) {
      g.fillRect((s.x - 1) * B, s.y * B, B, B); g.fillRect((s.x + 1) * B, s.y * B, B, B);
      g.fillRect(s.x * B, (s.y - 1) * B, B, B); g.fillRect(s.x * B, (s.y + 1) * B, B, B);
    }
  });
}

function drawScene(g, sc, t) {
  background(g, t);
  for (const it of sc.items) DRAW[it.kind](g, it, t);
}

// ---------------------------------------------------------------- chuyển cảnh, iris, phụ đề
const MASK = document.createElement('canvas');
MASK.width = GW; MASK.height = GH;
const MG = MASK.getContext('2d');
const MIM = MG.createImageData(GW, GH);

function mask(kind, p, cx, cy, invert, rgb) {
  const d = MIM.data;
  const R = Math.hypot(GW, GH) / 2;
  const nbx = GW / 10 + GH / 10;
  for (let y = 0; y < GH; y++) for (let x = 0; x < GW; x++) {
    let on;
    if (kind === 'dither') on = (BAYER[(y & 3) * 4 + (x & 3)] + 0.5) / 16 < p;
    else if (kind === 'block') {
      const bx = Math.floor(x / 10), by = Math.floor(y / 10);
      on = ((bx + by) / nbx) * 0.75 + hash(bx * 31 + by * 17) * 0.25 < p;
    } else on = Math.hypot(x + 0.5 - cx, y + 0.5 - cy) < p * R * 1.15;
    if (invert) on = !on;
    const i = (y * GW + x) * 4;
    if (rgb) { d[i] = rgb[0]; d[i + 1] = rgb[1]; d[i + 2] = rgb[2]; }
    d[i + 3] = on ? 255 : 0;
  }
  MG.putImageData(MIM, 0, 0);
  return MASK;
}

const BUF = document.createElement('canvas');
BUF.width = W; BUF.height = H;
const BX = BUF.getContext('2d');
BX.imageSmoothingEnabled = false;

const SUB = D.sub;
function subLayout(c) {
  if (c._lay) return c._lay;
  const font = FONT.bvp(SUB.size, 700);
  const space = width(font, ' ');
  const lines = [];
  let cur = [], cw = 0;
  c.words.forEach((w, i) => {
    const ww = width(font, w.text);
    if (cur.length && cw + space + ww > SUB.maxw - 2 * SUB.padX) { lines.push({ items: cur, w: cw }); cur = []; cw = 0; }
    cur.push({ i, w: ww });
    cw += (cur.length > 1 ? space : 0) + ww;
  });
  if (cur.length) lines.push({ items: cur, w: cw });
  const lh = Math.round(SUB.size * 1.32);
  const pw = Math.ceil((Math.max(...lines.map((l) => l.w)) + 2 * SUB.padX) / B) * B;
  const ph = Math.ceil((lines.length * lh + 2 * SUB.padY) / B) * B;
  const left = snap(W / 2 - pw / 2), top = snap(SUB.bottom - ph);
  const pos = [];
  lines.forEach((ln, li) => {
    let x = W / 2 - ln.w / 2;
    for (const o of ln.items) { pos[o.i] = { x, y: top + SUB.padY + lh * (li + 0.5) + SUB.size * 0.04 }; x += o.w + space; }
  });
  c._lay = { font, pos, pw, ph, left, top };
  return c._lay;
}

function drawSubs(g, t) {
  const c = D.subs.find((s) => t >= s.from && t < s.to);
  if (!c) return;
  const L = subLayout(c);
  g.globalAlpha = 0.9;
  shape(g, L.left, L.top, L.pw, L.ph, INKHEX);
  g.globalAlpha = 1;
  g.font = L.font;
  g.textBaseline = 'middle';
  g.textAlign = 'left';
  let live = -1;
  c.words.forEach((w, i) => { if (t >= w.t) live = i; });
  c.words.forEach((w, i) => {
    g.fillStyle = i === live ? YELLOW : WHITE;
    g.fillText(w.text, L.pos[i].x, L.pos[i].y);
  });
}

function irisCenter(sc) {
  const ir = sc.iris;
  const head = ir.word != null ? sc.items.find((it) => it.kind === 'headline') : null;
  if (head) {
    const p = headLayout(head).pos[ir.word];
    return [(p.x + p.w / 2) / B, p.y / B];
  }
  return [ir.cx, ir.cy];
}

function render(t) {
  t = clamp(t, 0, D.dur - 1e-4);
  const ctx = window.__ctx;
  let k = 0;
  for (let i = 0; i < D.scenes.length; i++) if (t >= D.scenes[i].from) k = i;
  const sc = D.scenes[k];
  const tin = sc.tin || { kind: 'cut', dur: 0 };
  if (k > 0 && tin.kind !== 'cut' && t < sc.from + tin.dur) {
    drawScene(ctx, D.scenes[k - 1], t);
    drawScene(BX, sc, t);
    BX.globalCompositeOperation = 'destination-in';
    BX.drawImage(mask(tin.kind, (t - sc.from) / tin.dur, GW / 2, GH / 2), 0, 0, W, H);
    BX.globalCompositeOperation = 'source-over';
    ctx.drawImage(BUF, 0, 0);
  } else drawScene(ctx, sc, t);
  if (!sc.noSubs) drawSubs(ctx, t);
  if (sc.iris && t >= sc.iris.at) {
    const p = clamp((t - sc.iris.at) / sc.iris.dur, 0, 1);
    if (p >= 1) { ctx.fillStyle = INKHEX; ctx.fillRect(0, 0, W, H); } else {
      const [cx, cy] = irisCenter(sc);
      const e = 1 - p * p * p;
      ctx.drawImage(mask('iris', e, cx, cy, true, PAL[INK - 1]), 0, 0, W, H);
    }
  }
}

// ---------------------------------------------------------------- khởi động (khuôn HyperFrames)
window.__timelines = window.__timelines || {};
let done = false;
function go() {
  if (done) return;
  done = true;
  const cv = document.getElementById('stage');
  const ctx = cv.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  window.__ctx = ctx;
  const tl = gsap.timeline({ paused: true });
  const clock = { t: 0 };
  tl.to(clock, { t: D.dur, duration: D.dur, ease: 'none', onUpdate: () => render(clock.t) }, 0);
  window.__timelines['main'] = tl;
  window.__render = render;
  render(0);
  tl.seek(0);
}
const SAMPLE = 'Aa ăâđêôơư ẢẤẦẨẪẬ ỗỡợủừữựỳỷỹ .,0123';
const FACES = [FONT.vt(64), FONT.mono(48), FONT.bvp(44, 700), FONT.bvp(80, 900)];
Promise.all(FACES.map((f) => document.fonts.load(f, SAMPLE).catch(() => null))).then(() => document.fonts.ready).then(go);
