// pixel-explainer engine v2: vẽ toàn bộ khung hình lên một canvas, render(t) là hàm thuần (seek được).
// Dữ liệu (palette, cel sprite, cảnh, phụ đề) do build.py nhúng vào chỗ __DATA__.
// Quy ước: toạ độ trong cảnh tính theo lưới logic (1 ô = D.block px). Kiểu hiện pixel và hoạt ảnh nhảy theo
// bước 12 fps; camera, lò xo spotlight và chuyển cảnh tính theo từng frame.
// v2 thêm: camera tự đóng khung (zoom/pan trong vùng nội dung), drift, punch, rung, chớp, nền đổi màu có
// parallax + bụi + vignette, hạt (burst/emit), vòng xung, thanh tiến trình, bộ đếm, nhún, mũi tên chạy,
// tia năng lượng chạy dọc layer (flow), spotlight tách tầng, nhãn nở/đóng dấu, chuyển cảnh wipe/pixelate/whip.
// FX tự sinh theo sự kiện (stamp, strike, pop, bloom, dấu ✓/✗, spotlight, từ nhấn) — tắt bằng fx:false.
const D = __DATA__;
const W = D.W, H = D.H, B = D.block, GW = W / B, GH = H / B;
const SAFE = D.safe, CONTENT = D.content || D.safe;
const INKHEX = '#1a1c2c', WHITE = '#f4f4f4', YELLOW = '#ffcd75';
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
const DUR = { trace: 0.8, bloom: 0.5, scan: 0.5, dither: 0.5, none: 0 };
const ZMAX = 1.35;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const snap = (v) => Math.round(v / B) * B;
const hash = (n) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const easeIO = (k) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);
const easeOut = (k) => 1 - Math.pow(1 - k, 3);
// Tiến độ nhảy bậc 12 fps, tính từ lúc bắt đầu nên bậc đầu tiên hiện ngay tại `at`.
const prog = (t, at, dur) => (t < at ? 0 : dur <= 0 ? 1 : clamp((Math.floor((t - at) * 12) + 1) / (12 * dur), 0, 1));
const rgbOf = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];

const PAL = D.palette.map(rgbOf);
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
  // Hộp điểm ảnh đục (ob) và số điểm ảnh đục (n) — cho QA đo "mực" thật, không tính phần trong suốt.
  let ob = null, n = 0;
  for (let i = 0; i < idx.length; i++) {
    if (!idx[i]) continue;
    const px = i % c.w, py = (i / c.w) | 0;
    n++;
    ob = ob ? [Math.min(ob[0], px), Math.min(ob[1], py), Math.max(ob[2], px + 1), Math.max(ob[3], py + 1)] : [px, py, px + 1, py + 1];
  }
  return { x: c.x, y: c.y, w: c.w, h: c.h, idx, cv, ob, n, ranks: {}, scratch: null, im: null, fscratch: null, fim: null };
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
  } else if (kind.startsWith('flow-')) {
    // Tia năng lượng: BFS 8 hướng gieo từ hàng/cột biên của cel, khoảng cách chuẩn hoá về [0, 1].
    const side = kind.slice(5);
    const xs = on.map((i) => i % w), ys = on.map((i) => (i / w) | 0);
    const edgeV = side === 'top' ? Math.min(...ys) : side === 'bottom' ? Math.max(...ys) : side === 'left' ? Math.min(...xs) : Math.max(...xs);
    const dist = new Int32Array(n).fill(-1);
    const q = [];
    on.forEach((i, k) => {
      const v = side === 'top' || side === 'bottom' ? ys[k] : xs[k];
      if (Math.abs(v - edgeV) <= 1) { dist[i] = 0; q.push(i); }
    });
    let dmax = 1;
    for (let k = 0; k < q.length; k++) {
      const i = q[k];
      const x = i % w, y = (i / w) | 0;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        const nx = x + dx, ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
        const j = ny * w + nx;
        if (idx[j] && dist[j] < 0) { dist[j] = dist[i] + 1; dmax = Math.max(dmax, dist[j]); q.push(j); }
      }
    }
    for (const i of on) if (dist[i] >= 0) r[i] = dist[i] / dmax;
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

// Các xung năng lượng đang chạy trên một cel: mỗi xung là dải rank (q - len, q], đầu xung màu `head`.
function flowLayer(cel, F, t) {
  const every = F.every || 1.5, dur = F.dur || 0.7, len = F.len || 0.22;
  const at = F.at, until = F.until != null ? F.until : 1e9;
  const live = [];
  const k1 = Math.floor((Math.min(t, until) - at) / every);
  for (let k = Math.max(0, k1 - Math.ceil((dur * (1 + len)) / every) - 1); k <= k1; k++) {
    const t0 = at + k * every;
    if (t < t0) continue;
    const q = (Math.floor((t - t0) * 30) / 30 / dur) * (1 + len);
    if (q - len <= 1) live.push(q);
  }
  if (!live.length) return null;
  const r = ranks(cel, 'flow-' + (F.from || 'top'));
  if (!cel.fscratch) {
    cel.fscratch = document.createElement('canvas');
    cel.fscratch.width = cel.w; cel.fscratch.height = cel.h;
    cel.fim = cel.fscratch.getContext('2d').createImageData(cel.w, cel.h);
  }
  const d = cel.fim.data;
  d.fill(0);
  const body = rgbOf(F.color || YELLOW), head = rgbOf(F.head || WHITE);
  let any = false;
  for (let i = 0; i < cel.idx.length; i++) {
    if (!cel.idx[i] || r[i] > 1) continue;
    for (const q of live) {
      if (r[i] > q || r[i] <= q - len) continue;
      const col = r[i] > q - len * 0.3 ? head : body;
      d[i * 4] = col[0]; d[i * 4 + 1] = col[1]; d[i * 4 + 2] = col[2]; d[i * 4 + 3] = 255;
      any = true;
      break;
    }
  }
  if (!any) return null;
  cel.fscratch.getContext('2d').putImageData(cel.fim, 0, 0);
  return cel.fscratch;
}

// Lò xo tắt dần (ζ 0,55): vượt nhẹ rồi về đích trong ~0,4 giây.
function spring(x) {
  if (x <= 0) return 0;
  const z = 0.55, w0 = 16, wd = w0 * Math.sqrt(1 - z * z);
  return 1 - Math.exp(-z * w0 * x) * (Math.cos(wd * x) + ((z * w0) / wd) * Math.sin(wd * x));
}

function celCenter(S, name, fi) {
  const li = S.layers.indexOf(name);
  if (li < 0) return null;
  const ci = S.cels[li][fi] >= 0 ? S.cels[li][fi] : S.cels[li].find((c) => c >= 0);
  if (ci == null || ci < 0) return null;
  const c = CELS[ci];
  return [c.x + c.w / 2, c.y + c.h / 2, Math.max(c.w, c.h)];
}

// Spotlight v2: node được nhắc phóng ×1,167 bằng lò xo; phần còn lại lùi về alpha 0,25, thu 0,9× và tách
// 3 block theo hướng ra xa node; edge nối với node và id trong `keep` giữ nguyên.
function spotAt(spots, name, t, S, fi, cxl, cyl) {
  let s = 1, a = 1, dx = 0, dy = 0;
  if (!name.startsWith('node:') && !name.startsWith('edge:')) return { s, a, dx, dy };
  for (const sp of spots) {
    if (t < sp.from || t > sp.to + 0.8) continue;
    const on = spring(t - sp.from) * (t >= sp.to ? 1 - spring(t - sp.to) : 1);
    const env = clamp((t - sp.from) / 0.25, 0, 1) * (t >= sp.to ? 1 - clamp((t - sp.to) / 0.25, 0, 1) : 1);
    const id = name.slice(5);
    const linked = name.startsWith('edge:') && (id.startsWith(sp.node + '-') || id.endsWith('-' + sp.node));
    if (name === 'node:' + sp.node) s = 1 + (1 / 6) * on;
    else if (!linked && !(sp.keep || []).includes(id)) {
      a = Math.min(a, 1 - 0.75 * env);
      s = Math.min(s, 1 - 0.1 * env);
      const c = celCenter(S, 'node:' + sp.node, fi);
      if (c) {
        const vx = cxl - c[0], vy = cyl - c[1], m = Math.hypot(vx, vy) || 1;
        dx += (vx / m) * 3 * env; dy += (vy / m) * 3 * env;
      }
    }
  }
  return { s, a, dx, dy };
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

// Nhún: lên 1 block rồi xuống, chu kỳ ~1,2 giây, lệch pha theo hash để các vật không nhún cùng lúc.
function bobAt(it, t) {
  if (!it.bob) return 0;
  const ph = hash((it.x || 0) * 13 + (it.y || 0) * 7 + 3);
  const k = Math.floor((t / 1.2 + ph) * 4) % 4;
  return [0, -1, -1, 0][k] * (it.bob === true ? 1 : it.bob);
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
  const [x, y0] = posAt(it, t);
  const y = y0 + bobAt(it, t);
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
    const cxl = it.flip ? S.w - cel.x - cel.w : cel.x;
    const sp = it.spot ? spotAt(it.spot, name, t, S, fi, cel.x + cel.w / 2, cel.y + cel.h / 2) : { s: 1, a: 1, dx: 0, dy: 0 };
    const src = p >= 1 ? cel.cv : partial(cel, k, p);
    const w = cel.w * PS * sp.s, h = cel.h * PS * sp.s;
    const cx = X + (cxl + cel.w / 2) * PS + sp.dx * B * (it.flip ? -1 : 1), cy = Y + (cel.y + cel.h / 2) * PS + sp.dy * B;
    const dx = (cx - cxS) * pop + cxS - (w * pop) / 2, dy = (cy - cyS) * pop + cyS - (h * pop) / 2;
    const rx = Math.round(dx), ry = Math.round(dy), rw = Math.round(w * pop), rh = Math.round(h * pop);
    g.globalAlpha = alpha * sp.a;
    blit(g, src, rx, ry, rw, rh, it.flip);
    if (L && L.flow && p >= 1) {
      for (const F of Array.isArray(L.flow) ? L.flow : [L.flow]) {
        const fsrc = flowLayer(cel, Object.assign({ at: lat }, F), t);
        if (!fsrc) continue;
        g.globalAlpha = alpha * sp.a * (F.alpha != null ? F.alpha : 1);
        blit(g, fsrc, rx, ry, rw, rh, it.flip);
      }
    }
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

function countText(it, s, t) {
  if (!it.count || s == null) return s;
  const c = it.count;
  const k = t == null ? 1 : t <= c.t0 ? 0 : t >= c.t1 ? 1 : Math.floor((t - c.t0) * 12) / ((c.t1 - c.t0) * 12);
  const v = Math.round(c.from + (c.to - c.from) * easeOut(clamp(k, 0, 1)));
  return s.replace('#', String(v));
}

function labelLayout(it) {
  if (it._lay) return it._lay;
  const size = it.size || 64;
  const st = Object.assign({}, STYLE[it.plate || 'dark'], it.style || {});
  const variants = (Array.isArray(it.text) ? it.text.map((v) => v[1]) : [it.text]).map((v) => countText(it, v, null));
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

// Tem đóng dấu: phóng to rồi đập xuống trong 4 nhịp 12 fps, chạm đích ở nhịp thứ 4 (+0,25 giây).
const SLAM = [1.6, 1.35, 1.12, 0.96];
let CUR_CAM = null; // camera của cảnh đang vẽ (drawScene gán), để tem dập kẹp trong vùng nội dung

function drawLabel(g, it, t) {
  if (t < it.at) return;
  if (it.out != null && t >= it.out) return;
  let [text, since] = currentText(it, t);
  if (text == null) return;
  text = countText(it, text, t);
  const L = labelLayout(it);
  const alpha = dimAt(it.dim, t);
  const tick = Math.floor((t - it.at) * 12);
  const stamp = it.plate === 'stamp';
  g.save();
  if (stamp && tick < SLAM.length) {
    const cx = L.left + L.pw / 2, cy = L.top + L.ph / 2;
    let s = SLAM[tick];
    if (CUR_CAM && s > 1) {
      // Cú dập phóng to không được đẩy tem ra khỏi vùng nội dung trên màn hình.
      const c = CUR_CAM, C = CONTENT, sx = cx * c.z + c.tx, sy = cy * c.z + c.ty, hw = (L.pw / 2) * c.z, hh = (L.ph / 2) * c.z;
      s = Math.max(1, Math.min(s, (sx - C[0]) / hw, (C[2] - sx) / hw, (sy - C[1]) / hh, (C[3] - sy) / hh));
    }
    g.translate(cx, cy); g.scale(s, s); g.translate(-cx, -cy);
  }
  g.globalAlpha = alpha * (stamp && tick === 0 ? 0.6 : 1);
  if (!L.bare) {
    // Tấm nở: nhịp đầu co một block, nhịp hai vượt một block, sau đó về cỡ thật; chữ gõ ngay từ nhịp đầu.
    const pop = stamp ? 0 : tick === 0 ? -B : tick === 1 ? B : 0;
    plate(g, L.left - pop, L.top - pop, L.pw + 2 * pop, L.ph + 2 * pop, L.st.fill, L.st.edge, L.st.thick);
    if (it.tail) tail(g, L, it.tail, L.st);
  }
  let limit = null;
  // Tem đóng dấu và bộ đếm hiện nguyên chữ một lần, không gõ từng ký tự.
  if (it.type !== false && !stamp && !it.count) {
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
  g.restore();
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

// Câu chốt chữ to Be Vietnam Pro 900 (hoặc VT323 khi `font: "vt"`), hiện từng từ theo giọng.
function headLayout(it) {
  if (it._lay) return it._lay;
  const font = it.font === 'vt' ? FONT.vt(it.size) : FONT.bvp(it.size, 900);
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
  it._lay = { font, pos, lh, nlines: lines.length, w: Math.max(...lines.map((l) => l.w)) };
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
    if (w.hl) {
      // Gạch chân quét từ trái sang phải dưới từ được nhấn.
      const q = prog(t, w.t, 0.3);
      const uy = snap(p.y + it.size * 0.62), uw = snap(p.w * q);
      g.fillStyle = INKHEX;
      g.fillRect(snap(p.x) + B, uy + B, uw, B);
      g.fillStyle = YELLOW;
      g.fillRect(snap(p.x), uy, uw, B);
    }
    g.font = L.font;
    g.fillStyle = INKHEX;
    g.fillText(w.text, p.x + B, p.y + B - lift);
    g.fillStyle = w.hl || (live && it.live !== false) ? YELLOW : WHITE;
    g.fillText(w.text, p.x, p.y - lift);
  });
}

function drawArrow(g, it, t) {
  if (t < it.at) return;
  if (it.out != null && t >= it.out) return;
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
  if (it.march && p >= 1 && shaft > 0) {
    // Mũi tên chạy: các đoạn sáng trôi dọc thân theo nhịp 12 fps.
    const M = it.march === true ? {} : it.march;
    const every = M.every || 4, ml = M.len || 1, n = Math.floor(shaft / B);
    const ph = Math.floor((t - it.at) * 12);
    g.fillStyle = M.color || WHITE;
    for (let i = 0; i < n; i++) if ((((i - ph) % every) + every) % every < ml) g.fillRect(i * B, -th / 2, B, th);
  }
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

// ---------------------------------------------------------------- hạt, vòng xung, thanh tiến trình
const CONFETTI = ['#ffcd75', '#a7f070', '#73eff7', '#ef7d57', '#f4f4f4', '#41a6f6'];

// Chùm hạt bắn ra từ một điểm: vị trí là hàm giải tích của thời gian (lực cản + trọng lực), không mô phỏng từng bước.
function drawBurst(g, it, t) {
  const tau = t - it.at;
  if (tau < 0) return;
  const life = it.life || 0.8;
  if (tau > life * 1.05) return;
  const n = it.n || 16, speed = it.speed || 40, drag = it.drag != null ? it.drag : 3, grav = it.grav || 0;
  const a0 = it.a0 != null ? it.a0 : 0, a1 = it.a1 != null ? it.a1 : Math.PI * 2;
  const cols = it.colors || (it.type === 'confetti' ? CONFETTI : it.type === 'dust' ? ['#94b0c2', '#566c86', '#333c57'] : [YELLOW, WHITE]);
  const seed = it.seed || 0;
  const tq = Math.floor(tau * 30) / 30;
  for (let i = 0; i < n; i++) {
    const h1 = hash(seed + i * 3.1), h2 = hash(seed + i * 5.7 + 1), h3 = hash(seed + i * 7.3 + 2);
    const ang = a0 + (a1 - a0) * (n > 1 && a1 - a0 >= Math.PI * 2 - 1e-3 ? (i + h1 * 0.8) / n : h1);
    const v = speed * (0.35 + 0.65 * h2), li = life * (0.55 + 0.45 * h3);
    if (tq > li) continue;
    const dist = drag > 0 ? (v * (1 - Math.exp(-drag * tq))) / drag : v * tq;
    const px = it.x + Math.cos(ang) * dist, py = it.y + Math.sin(ang) * dist + 0.5 * grav * tq * tq;
    const fade = tq / li;
    if (fade > 0.55 && hash(seed + i * 11 + Math.floor(tq * 12)) < (fade - 0.55) / 0.45) continue;
    const gx = Math.round(px) * B, gy = Math.round(py) * B;
    g.fillStyle = cols[i % cols.length];
    if (it.type === 'star' && fade < 0.5) {
      g.fillRect(gx - B, gy, 3 * B, B); g.fillRect(gx, gy - B, B, 3 * B);
    } else if (it.type === 'confetti') {
      const flip = (Math.floor(tq * 15) + i) % 2;
      g.fillRect(gx, gy, flip ? 2 * B : B, flip ? B : 2 * B);
    } else g.fillRect(gx, gy, B, B);
  }
}

// Nguồn hạt liên tục trong một vùng: hạt thứ j sinh ở from + j/rate, sống `life` giây.
function drawEmit(g, it, t) {
  if (t < it.from) return;
  const rate = it.rate || 10, life = it.life || 1, seed = it.seed || 0;
  const to = it.to != null ? it.to : 1e9;
  const j1 = Math.floor((Math.min(t, to) - it.from) * rate);
  const j0 = Math.max(0, Math.floor((t - life - it.from) * rate));
  const cols = it.colors || (it.type === 'rain' ? ['#41a6f6', '#3b5dc9', '#73eff7'] : [YELLOW, WHITE, '#73eff7']);
  const tq = Math.floor(t * 30) / 30;
  for (let j = j0; j <= j1; j++) {
    const ts = it.from + j / rate;
    const tau = tq - ts;
    if (tau < 0 || tau > life || ts > to) continue;
    const h1 = hash(seed + j * 7.1), h2 = hash(seed + j * 3.3 + 1), h3 = hash(seed + j * 5.9 + 2), h4 = hash(seed + j * 9.7 + 3);
    const vx = (it.vx || 0) + (it.jx || 0) * (h3 - 0.5) * 2, vy = (it.vy || 0) + (it.jy || 0) * (h4 - 0.5) * 2;
    const px = it.x + (it.w || 0) * h1 + vx * tau, py = it.y + (it.h || 0) * h2 + vy * tau + 0.5 * (it.grav || 0) * tau * tau;
    const gx = Math.round(px) * B, gy = Math.round(py) * B;
    g.globalAlpha = it.alpha != null ? it.alpha : 1;
    g.fillStyle = cols[j % cols.length];
    if (it.type === 'rain') g.fillRect(gx, gy, B, 3 * B);
    else if (it.type === 'sparkle') {
      const k = Math.floor((tau / life) * 4);
      if (k === 1 || k === 2) { g.fillRect(gx - B, gy, 3 * B, B); g.fillRect(gx, gy - B, B, 3 * B); } else g.fillRect(gx, gy, B, B);
    } else g.fillRect(gx, gy, B, B);
  }
  g.globalAlpha = 1;
}

// Vòng xung pixel: bán kính nở theo easeOut, mờ dần bằng dither (bỏ bớt ô) thay vì alpha.
function drawRing(g, it, t) {
  const every = it.every || 0, until = it.until != null ? it.until : it.at;
  const dur = it.dur || 0.5;
  const kmax = every > 0 ? Math.floor((Math.min(t, until) - it.at) / every) : 0;
  for (let k = Math.max(0, kmax - Math.ceil(dur / (every || 1)) - 1); k <= kmax; k++) {
    const t0 = it.at + k * every;
    if (t < t0 || t > t0 + dur) continue;
    const p = Math.floor((t - t0) * 12 + 1) / (dur * 12);
    if (p > 1) continue;
    const r = it.r0 + (it.r1 - it.r0) * easeOut(p);
    const keep = (1 - p) * (it.faint ? 0.55 : 1);
    const n = Math.max(12, Math.ceil(2 * Math.PI * r));
    g.fillStyle = it.color || WHITE;
    let lx = null, ly = null;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      const cx = Math.round(it.x + Math.cos(a) * r), cy = Math.round(it.y + Math.sin(a) * r);
      if (cx === lx && cy === ly) continue;
      lx = cx; ly = cy;
      if (hash(cx * 31 + cy * 17 + k) > keep) continue;
      g.fillRect(cx * B, cy * B, B, B);
    }
  }
}

// Thanh tiến trình theo đoạn: đoạn vừa đầy nháy trắng 0,2 giây; đoạn rỗng có thể nhấp nháy.
function drawBar(g, it, t) {
  if (t < it.at || (it.out != null && t >= it.out)) return;
  const segsN = it.segs, sw = it.sw || 3, h = it.h || 2, gap = it.gap != null ? it.gap : 1;
  let v = 0, vt = it.at;
  for (const [ts, val] of it.steps || []) if (t >= ts) { v = val; vt = ts; }
  const total = segsN * sw + (segsN - 1) * gap;
  const x0 = it.align === 'l' ? it.x : it.align === 'r' ? it.x - total : it.x - total / 2;
  const X = Math.round(x0) * B, Y = it.y * B;
  const k = Math.floor((t - it.at) * 12);
  const grow = k === 0 ? 0.5 : 1;
  g.globalAlpha = dimAt(it.dim, t);
  g.fillStyle = INKHEX;
  g.fillRect(X - B, Y - B, (total + 2) * B * grow, (h + 2) * B);
  for (let i = 0; i < segsN; i++) {
    const sx = X + i * (sw + gap) * B;
    if (sx - X > total * B * grow) break;
    let col = '#333c57';
    if (i < v) col = i === v - 1 && t - vt < 0.2 ? WHITE : it.color || YELLOW;
    else if (it.blinkEmpty && Math.floor(t * 2) % 2 === 0) col = '#566c86';
    g.fillStyle = col;
    g.fillRect(sx, Y, sw * B, h * B);
  }
  g.globalAlpha = 1;
}

// ---------------------------------------------------------------- ảnh thật (photo)
// Ảnh chụp thật (vd ảnh tác giả từ video gốc) để tạo niềm tin. build.py đã thu ảnh về đúng w×h block và nhúng
// dạng data URI vào D.photos; ở đây vẽ khung viền (mực + nền sáng + vạch màu nhấn), ảnh, và tuỳ chọn mosaic
// (it.mosaic = cỡ ô px, làm ảnh hợp với style pixel). Hiện: pop (nảy), dither (hoà dần), none.
const PHOTOS = {};
function photoMosaic(P, n) {
  const key = '_m' + n;
  if (P[key]) return P[key];
  const w = Math.max(1, Math.round(P.img.width / n)), h = Math.max(1, Math.round(P.img.height / n));
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const g = c.getContext('2d');
  g.imageSmoothingEnabled = true;
  g.drawImage(P.img, 0, 0, w, h);
  P[key] = c;
  return c;
}
function drawPhoto(g, it, t) {
  const P = PHOTOS[it.photo];
  const at = it.at || 0;
  if (!P || t < at) return;
  const outp = it.out != null && t >= it.out ? 1 - prog(t, it.out, 0.4) : 1;
  if (outp <= 0) return;
  const alpha = dimAt(it.dim, t) * outp;
  if (alpha <= 0.01) return;
  const [x, y] = posAt(it, t);
  const kind = it.reveal || 'pop';
  const p = kind === 'none' ? 1 : prog(t, at, it.rdur || 0.3);
  const pop = kind === 'pop' ? popCurve(p) : 1;
  const a = kind === 'dither' ? alpha * p : alpha;
  const w = it.w * B, h = it.h * B, bw = (it.border != null ? it.border : 2) * B;
  const cx = x * B + w / 2, cy = y * B + h / 2;
  const W2 = (w + 2 * bw) * pop, H2 = (h + 2 * bw) * pop;
  const X0 = snap(cx - W2 / 2), Y0 = snap(cy - H2 / 2);
  g.globalAlpha = a;
  g.fillStyle = INKHEX;
  g.fillRect(X0 - B, Y0 - B, Math.round(W2) + 2 * B, Math.round(H2) + 2 * B);
  g.fillStyle = it.color || '#f4f4f4';
  g.fillRect(X0, Y0, Math.round(W2), Math.round(H2));
  const ix = Math.round(X0 + bw * pop), iy = Math.round(Y0 + bw * pop), iw = Math.round(w * pop), ih = Math.round(h * pop);
  if (it.mosaic) { g.imageSmoothingEnabled = false; g.drawImage(photoMosaic(P, it.mosaic), ix, iy, iw, ih); }
  else { g.imageSmoothingEnabled = true; g.drawImage(P.img, ix, iy, iw, ih); g.imageSmoothingEnabled = false; }
  if (it.accent !== false) { g.fillStyle = it.accent || YELLOW; g.fillRect(X0, Math.round(Y0 + H2) - B, Math.round(W2), B); }
  g.globalAlpha = 1;
}

const DRAW = {
  photo: drawPhoto,
  sprite: drawSprite, label: drawLabel, headline: drawHeadline, arrow: drawArrow, frame: drawFrame,
  burst: drawBurst, emit: drawEmit, ring: drawRing, bar: drawBar,
};

// ---------------------------------------------------------------- nền: gradient dither theo cặp màu, vignette nướng sẵn
const BG_DEFAULT = ['#29366f', '#20284a'];
const BGCACHE = {};
function bgCanvas(top, bot) {
  const key = top + bot;
  if (BGCACHE[key]) return BGCACHE[key];
  const c = document.createElement('canvas');
  c.width = GW; c.height = GH;
  const g = c.getContext('2d');
  const im = g.createImageData(GW, GH);
  const T0 = rgbOf(top), T1 = rgbOf(bot), K = rgbOf(INKHEX);
  for (let y = 0; y < GH; y++) {
    const v = clamp((y / GH - 0.3) / 0.5, 0, 1);
    for (let x = 0; x < GW; x++) {
      const th = (BAYER[(y & 3) * 4 + (x & 3)] + 0.5) / 16;
      let col = v > th ? T1 : T0;
      const ex = (x + 0.5) / GW - 0.5, ey = (y + 0.5) / GH - 0.5;
      const d = Math.hypot(ex * 1.1, ey * 1.1) / 0.5;
      if ((d - 0.78) / 0.42 > th) col = K;
      const i = (y * GW + x) * 4;
      im.data[i] = col[0]; im.data[i + 1] = col[1]; im.data[i + 2] = col[2]; im.data[i + 3] = 255;
    }
  }
  g.putImageData(im, 0, 0);
  BGCACHE[key] = c;
  return c;
}
const STARS = Array.from({ length: 40 }, (_, i) => ({
  x: hash(i * 3 + 1) * GW, y: Math.floor(hash(i * 3 + 2) * GH * 0.7), big: hash(i * 3 + 3) > 0.78, ph: hash(i * 7 + 5),
  near: i % 3 === 0,
}));
const MOTES = Array.from({ length: 22 }, (_, i) => ({ x: hash(i * 5 + 9) * GW, y: hash(i * 5 + 10) * GH, v: 1.2 + hash(i * 5 + 11) * 2.2, ph: hash(i * 5 + 12) * 6 }));

function background(g, sc, t, cam) {
  const keys = [[sc.from - 99, BG_DEFAULT[0], BG_DEFAULT[1]], ...(sc.bg || [])];
  let cur = 0;
  for (let i = 0; i < keys.length; i++) if (t >= keys[i][0]) cur = i;
  const a = cur > 0 ? clamp((t - keys[cur][0]) / 0.5, 0, 1) : 1;
  if (a < 1) g.drawImage(bgCanvas(keys[cur - 1][1], keys[cur - 1][2]), 0, 0, W, H);
  g.globalAlpha = a;
  g.drawImage(bgCanvas(keys[cur][1], keys[cur][2]), 0, 0, W, H);
  g.globalAlpha = 1;
  // Sao hai lớp parallax: lớp xa đi theo camera 15%, lớp gần 35%, cùng trôi ngang chậm.
  STARS.forEach((s, i) => {
    const v = hash(i * 13 + Math.floor(t * 2 + s.ph * 8));
    if (v < 0.35) return;
    const k = s.near ? 0.35 : 0.15;
    const sx0 = ((s.x + t * (s.near ? 0.9 : 0.35)) % GW) * B, sy0 = s.y * B;
    const sx = snap(sx0 + k * ((sx0 - cam.fx) * cam.z + cam.ax - sx0)), sy = snap(sy0 + k * ((sy0 - cam.fy) * cam.z + cam.ay - sy0));
    g.fillStyle = v > 0.82 ? '#94b0c2' : '#3b5dc9';
    g.fillRect(sx, sy, B, B);
    if (s.big && v > 0.6) {
      g.fillRect(sx - B, sy, B, B); g.fillRect(sx + B, sy, B, B);
      g.fillRect(sx, sy - B, B, B); g.fillRect(sx, sy + B, B, B);
    }
  });
  // Bụi bay lên chậm, lắc ngang theo sin.
  g.fillStyle = '#566c86';
  g.globalAlpha = 0.7;
  MOTES.forEach((m) => {
    const y = (((m.y - t * m.v) % GH) + GH) % GH;
    const x = m.x + Math.round(Math.sin(t * 0.9 + m.ph) * 1.5);
    g.fillRect(Math.round(x) * B, Math.round(y) * B, B, B);
  });
  g.globalAlpha = 1;
}

// ---------------------------------------------------------------- camera
// Biến đổi: màn hình = (điểm - F) × z + A, A là tâm vùng nội dung. Camera tự đóng khung các item đang hiện
// theo từng nhóm xuất hiện (cửa sổ 0,8 giây), z trong [1, 1,35], chuyển bằng easeInOutCubic trong [tg-0,3; tg+0,5].
function itemBox(it, t) {
  if (it.kind === 'sprite') {
    const S = D.sprites[it.sprite];
    if (!S) return null;
    const [x, y] = posAt(it, t);
    const sc = it.scale || 1;
    return [x * B, y * B, (x + S.w * sc) * B, (y + S.h * sc) * B];
  }
  if (it.kind === 'photo') {
    const [x, y] = posAt(it, t), bw = it.border != null ? it.border : 2;
    return [(x - bw - 1) * B, (y - bw - 1) * B, (x + it.w + bw + 1) * B, (y + it.h + bw + 1) * B];
  }
  if (it.kind === 'label') { const L = labelLayout(it); return [L.left, L.top, L.left + L.pw + B, L.top + L.ph + B]; }
  if (it.kind === 'headline') {
    const L = headLayout(it);
    const xs = L.pos.map((p) => p.x), ys = L.pos.map((p) => p.y);
    return [Math.min(...xs), Math.min(...ys) - it.size * 0.6, Math.max(...L.pos.map((p) => p.x + p.w)), Math.max(...ys) + it.size * 0.8];
  }
  if (it.kind === 'arrow') {
    const hd = (it.head || 4) * B;
    return [Math.min(it.x0, it.x1) * B - hd, Math.min(it.y0, it.y1) * B - hd, Math.max(it.x0, it.x1) * B + hd, Math.max(it.y0, it.y1) * B + hd];
  }
  if (it.kind === 'frame') return [it.x * B, it.y * B, (it.x + it.w) * B, (it.y + it.h) * B];
  if (it.kind === 'bar') {
    const total = it.segs * (it.sw || 3) + (it.segs - 1) * (it.gap != null ? it.gap : 1);
    const x0 = it.align === 'l' ? it.x : it.align === 'r' ? it.x - total : it.x - total / 2;
    return [(x0 - 1) * B, (it.y - 1) * B, (x0 + total + 1) * B, (it.y + (it.h || 2) + 1) * B];
  }
  return null;
}

// Mực thật của sprite tại t (QA): hộp hợp các lớp ĐÃ hiện (bỏ lớp chưa tới giờ, lớp ẩn, lớp đã out), cắt phần trong
// suốt; area = số điểm ảnh đục × kích thước điểm. Mô hình mới hiện 1/3 lớp thì chỉ tính 1/3 đó.
function inkBox(it, t) {
  const S = D.sprites[it.sprite];
  if (!S) return null;
  const [x, y] = posAt(it, t);
  const sc = it.scale || 1, fi = frameAt(S, it, t);
  let bx = null, area = 0;
  for (let li = 0; li < S.layers.length; li++) {
    const ci = S.cels[li][fi];
    if (ci < 0) continue;
    const L = it.layers && it.layers[S.layers[li]];
    if (L && L.hide) continue;
    const lat = L && L.at != null ? L.at : it.at || 0;
    if (t < lat + 0.2 || (L && L.out != null && t >= L.out)) continue;
    const cel = CELS[ci];
    if (!cel.ob) continue;
    const cx0 = it.flip ? S.w - cel.x - cel.w : cel.x;
    const o0 = it.flip ? cel.w - cel.ob[2] : cel.ob[0], o1 = it.flip ? cel.w - cel.ob[0] : cel.ob[2];
    const b = [x + (cx0 + o0) * sc, y + (cel.y + cel.ob[1]) * sc, x + (cx0 + o1) * sc, y + (cel.y + cel.ob[3]) * sc].map((v) => v * B);
    bx = bx ? [Math.min(bx[0], b[0]), Math.min(bx[1], b[1]), Math.max(bx[2], b[2]), Math.max(bx[3], b[3])] : b;
    area += cel.n * sc * sc * B * B;
  }
  return bx ? { box: bx, area } : null;
}

// Điểm ảnh đục của sprite tại t (QA, toạ độ thế giới px, trước camera): cùng lớp như inkBox, có tính nhún và lật.
// pts = tâm các điểm ảnh đục (lấy mẫu thưa dần khi quá ~2500 điểm); hit(wx, wy) = điểm đó có nằm trên điểm ảnh đục không.
function inkMask(it, t) {
  const S = D.sprites[it.sprite];
  if (!S) return null;
  const [x, y0] = posAt(it, t), y = y0 + bobAt(it, t);
  const sc = it.scale || 1, fi = frameAt(S, it, t), P = B * sc, X = x * B, Y = y * B, cels = [];
  let n = 0;
  for (let li = 0; li < S.layers.length; li++) {
    const ci = S.cels[li][fi];
    if (ci < 0) continue;
    const L = it.layers && it.layers[S.layers[li]];
    if (L && L.hide) continue;
    const lat = L && L.at != null ? L.at : it.at || 0;
    if (t < lat + 0.2 || (L && L.out != null && t >= L.out)) continue;
    if (CELS[ci].n) { cels.push(CELS[ci]); n += CELS[ci].n; }
  }
  if (!n) return null;
  const hit = (wx, wy) => {
    const u = Math.floor((wx - X) / P), v = Math.floor((wy - Y) / P);
    if (u < 0 || v < 0 || u >= S.w || v >= S.h) return false;
    const su = it.flip ? S.w - 1 - u : u;
    for (const c of cels) {
      const i = su - c.x, j = v - c.y;
      if (i >= 0 && j >= 0 && i < c.w && j < c.h && c.idx[j * c.w + i]) return true;
    }
    return false;
  };
  const s = Math.max(1, Math.ceil(Math.sqrt(n / 2500))), seen = new Set(), pts = [];
  let box = null;
  for (const c of cels) for (let j = 0; j < c.h; j++) for (let i = 0; i < c.w; i++) {
    if (!c.idx[j * c.w + i]) continue;
    const u0 = c.x + i, v = c.y + j, u = it.flip ? S.w - 1 - u0 : u0;
    if (u % s || v % s || seen.has(v * S.w + u)) continue;
    seen.add(v * S.w + u);
    const wx = X + (u + 0.5) * P, wy = Y + (v + 0.5) * P;
    pts.push(wx, wy);
    box = union(box, [wx - P / 2, wy - P / 2, wx + P / 2, wy + P / 2]);
  }
  return { pts, box, hit };
}

function itemAt(it) { return it.kind === 'emit' ? it.from : it.at || 0; }
function itemOutEnd(it) {
  if (it.out == null) return Infinity;
  if (typeof it.out === 'number') return it.out;
  return it.out.at + (it.out.dur || 0.4);
}

const TEXTKINDS = { label: 1, headline: 1 };
const SPRITEKIND = { sprite: 1 };
const union = (a, b) => (a ? [Math.min(a[0], b[0]), Math.min(a[1], b[1]), Math.max(a[2], b[2]), Math.max(a[3], b[3])] : b);
// z lớn nhất (zoom quanh F) mà hộp vẫn nằm trong vùng nội dung.
function zKeep(F, box, ax, ay) {
  const C = CONTENT;
  let z = Infinity;
  if (box[2] > F.fx) z = Math.min(z, (C[2] - ax) / (box[2] - F.fx));
  if (box[0] < F.fx) z = Math.min(z, (ax - C[0]) / (F.fx - box[0]));
  if (box[3] > F.fy) z = Math.min(z, (C[3] - ay) / (box[3] - F.fy));
  if (box[1] < F.fy) z = Math.min(z, (ay - C[1]) / (F.fy - box[1]));
  return z;
}
// Kẹp tâm khung để hộp [b0,b1] (đã nhân z) nằm trong [c0,c1]; không vừa thì lấy giữa hộp.
function keepAxis(f, b0, b1, a, c0, c1, z) {
  const lo = b1 - (c1 - a) / z, hi = b0 + (a - c0) / z;
  return lo <= hi ? clamp(f, lo, hi) : (b0 + b1) / 2;
}
function textBoxAt(sc, t, kinds = TEXTKINDS) {
  let tb = null;
  for (const it of sc.items) {
    if (!kinds[it.kind] || it._fx) continue;
    if (Math.max(itemAt(it), sc.from) > t || itemOutEnd(it) <= t) continue;
    const b = itemBox(it, t);
    if (b) tb = union(tb, b);
  }
  return tb;
}
function textInside(cam, tb, ax, ay) {
  if (!tb) return true;
  const C = CONTENT, e = 2;
  return (tb[0] - cam.fx) * cam.z + ax >= C[0] - e && (tb[2] - cam.fx) * cam.z + ax <= C[2] + e &&
    (tb[1] - cam.fy) * cam.z + ay >= C[1] - e && (tb[3] - cam.fy) * cam.z + ay <= C[3] + e;
}

function camTarget(sc, t0, t1) {
  let bb = null, tb = null;
  for (const it of sc.items) {
    if (it.cam === false || it._fx || !CAMKINDS[it.kind]) continue;
    const at = Math.max(itemAt(it), sc.from);
    if (at > t1 || itemOutEnd(it) <= t0 + 1e-3) continue;
    const b = itemBox(it, Math.max(at, t1));
    if (!b) continue;
    bb = union(bb, b);
    if (TEXTKINDS[it.kind]) tb = union(tb, b);
  }
  const C = CONTENT, ax = (C[0] + C[2]) / 2, ay = (C[1] + C[3]) / 2;
  if (!bb) return { z: 1, fx: ax, fy: ay, zcap: 1 };
  const m = 3 * B;
  const box = [Math.max(0, bb[0] - m), Math.max(0, bb[1] - m), Math.min(W, bb[2] + m), Math.min(H, bb[3] + m)];
  const cw = C[2] - C[0], ch = C[3] - C[1];
  const fit = Math.min(cw / (box[2] - box[0]), ch / (box[3] - box[1]));
  let z = clamp(fit * 0.92, 1, sc.zmax || ZMAX);
  // Chữ là ràng buộc cứng: không bao giờ zoom quá mức để hộp chữ còn vừa vùng nội dung.
  if (tb) z = Math.min(z, Math.max(1, Math.min(cw / (tb[2] - tb[0]), ch / (tb[3] - tb[1]))));
  // Tâm khung: giữa bbox, kẹp để bbox nằm trong vùng nội dung khi còn vừa; rồi kẹp tiếp theo hộp chữ.
  let fx = keepAxis((box[0] + box[2]) / 2, box[0], box[2], ax, C[0], C[2], z);
  let fy = keepAxis((box[1] + box[3]) / 2, box[1], box[3], ay, C[1], C[3], z);
  if (tb) { fx = keepAxis(fx, tb[0], tb[2], ax, C[0], C[2], z); fy = keepAxis(fy, tb[1], tb[3], ay, C[1], C[3], z); }
  const F = { fx, fy };
  const zb = fit >= 1 ? zKeep(F, box, ax, ay) : z;
  const zt = tb ? zKeep(F, tb, ax, ay) : Infinity;
  return { z, fx, fy, zcap: Math.max(z, Math.min(zb, zt, (sc.zmax || ZMAX) * 1.1)), box, tb };
}

const CAMKINDS = { photo: 1, sprite: 1, label: 1, headline: 1, arrow: 1, frame: 1, bar: 1 };

function camPrep(sc, k) {
  const C = CONTENT;
  sc._ax = (C[0] + C[2]) / 2; sc._ay = (C[1] + C[3]) / 2;
  sc._keys = [];
  if (sc.cam === 'none') {
    // Đứng yên ở z = 1, chỉ drift; tâm và trần drift lấy từ khung toàn cảnh để chữ không tràn.
    const g = camTarget(sc, sc.from, sc._to - 0.01);
    sc._cam0 = { z: 1, fx: g.tb ? g.fx : sc._ax, fy: g.tb ? g.fy : sc._ay, zcap: g.tb ? Math.max(1, Math.min(1.1, zKeep(g, g.tb, sc._ax, sc._ay))) : 1.1 };
    return;
  }
  if (Array.isArray(sc.cam)) {
    sc._cam0 = { z: 1, fx: sc._ax, fy: sc._ay, zcap: 1 };
    for (const [t0, t1, z, fx, fy] of sc.cam) sc._keys.push({ t0, t1, z, fx: fx * B, fy: fy * B, zcap: z });
  } else {
    const ev = new Set();
    for (const it of sc.items) {
      if (it.cam === false || it._fx || !CAMKINDS[it.kind]) continue;
      const at = Math.max(itemAt(it), sc.from);
      if (at < sc._to) ev.add(Math.round(at * 100) / 100);
      const oe = itemOutEnd(it);
      if (oe > sc.from && oe < sc._to) ev.add(Math.round(oe * 100) / 100);
    }
    const times = [...ev].sort((a, b) => a - b);
    const groups = [];
    for (const e of times) if (!groups.length || e > groups[groups.length - 1] + 0.8) groups.push(e);
    let ref = null;
    groups.forEach((tg, gi) => {
      const te = Math.min(tg + 0.8, gi + 1 < groups.length ? groups[gi + 1] - 0.01 : sc._to - 0.01);
      const tgt = camTarget(sc, tg, te);
      if (!ref) { sc._cam0 = tgt; ref = tgt; return; }
      const small = Math.abs(tgt.z - ref.z) < 0.03 && Math.hypot(tgt.fx - ref.fx, tgt.fy - ref.fy) < 4 * B;
      if (small && textInside(ref, tgt.tb, sc._ax, sc._ay)) return;
      // Chữ mới chưa vừa khung cũ: camera phải tới đích đúng lúc chữ hiện, không được đuổi theo sau.
      const lead = tgt.tb && !textInside(ref, tgt.tb, sc._ax, sc._ay);
      const prevT1 = sc._keys.length ? sc._keys[sc._keys.length - 1].t1 : sc.from;
      const t1 = lead ? tg + 0.02 : tg + 0.5;
      const t0 = Math.min(Math.max(sc.from, prevT1, tg - (lead ? 0.6 : 0.3)), t1 - 0.1);
      sc._keys.push({ t0, t1, z: tgt.z, fx: tgt.fx, fy: tgt.fy, zcap: tgt.zcap });
      ref = tgt;
    });
    if (!sc._cam0) sc._cam0 = { z: 1, fx: sc._ax, fy: sc._ay, zcap: 1 };
  }
  if (sc.camInherit && k > 0) {
    const prev = D.scenes[k - 1];
    const c = camRaw(prev, sc.from);
    const first = sc._cam0;
    sc._cam0 = { z: c.z, fx: c.fx, fy: c.fy, zcap: c.zcap };
    sc._keys.unshift({ t0: sc.from, t1: sc.from + 0.8, z: first.z, fx: first.fx, fy: first.fy, zcap: first.zcap });
  }
  let s = sc._cam0;
  for (const key of sc._keys) { key.s0 = s; s = key; }
}

function camRaw(sc, t) {
  let st = sc._cam0;
  for (const key of sc._keys) {
    if (t >= key.t1) { st = key; continue; }
    if (t > key.t0) {
      const e = easeIO((t - key.t0) / (key.t1 - key.t0)), a = key.s0;
      st = { z: a.z + (key.z - a.z) * e, fx: a.fx + (key.fx - a.fx) * e, fy: a.fy + (key.fy - a.fy) * e, zcap: Math.min(a.zcap, key.zcap) };
    }
    break;
  }
  return { z: st.z, fx: st.fx, fy: st.fy, zcap: st.zcap != null ? st.zcap : 1 };
}

function envPunch(tau, dur) {
  if (tau < 0 || tau > dur) return 0;
  return tau < 0.1 ? easeOut(tau / 0.1) : Math.pow(1 - (tau - 0.1) / Math.max(0.01, dur - 0.1), 2);
}

function camBase(sc, t) {
  const c = camRaw(sc, t);
  const drift = sc.drift != null ? sc.drift : 0.025;
  c.z = Math.min(c.z * (1 + drift * clamp((t - sc.from) / (sc._to - sc.from), 0, 1)), Math.max(c.z, c.zcap));
  return c;
}

function punchPrep(sc) {
  const C = CONTENT, ax = sc._ax, ay = sc._ay;
  sc._punch = (sc.punch || []).map(([tp, amt, dur, gx, gy]) => {
    const tk = tp + 0.1, c = camBase(sc, tk);
    const tb = textBoxAt(sc, tk);
    let a = amt;
    const gX = gx != null ? gx * B : c.fx, gY = gy != null ? gy * B : c.fy;
    if (tb) {
      const gs = [(gX - c.fx) * c.z + ax, (gY - c.fy) * c.z + ay];
      const es = [(tb[0] - c.fx) * c.z + ax, (tb[1] - c.fy) * c.z + ay, (tb[2] - c.fx) * c.z + ax, (tb[3] - c.fy) * c.z + ay];
      const lim = (e, g, c0, c1) => (e > g + 1 ? (c1 - g) / (e - g) - 1 : e < g - 1 ? (c0 - g) / (e - g) - 1 : Infinity);
      a = Math.min(a, lim(es[0], gs[0], C[0], C[2]), lim(es[2], gs[0], C[0], C[2]), lim(es[1], gs[1], C[1], C[3]), lim(es[3], gs[1], C[1], C[3]));
    }
    // Sprite cũng không được văng quá SAFE 2 ô khi punch (tem ở đáy khung từng đẩy vật ở mép trên ra ngoài 6–10 ô).
    const sb = textBoxAt(sc, tk, SPRITEKIND);
    if (sb) {
      const tol = 2 * B, S = [SAFE[0] - tol, SAFE[1] - tol, SAFE[2] + tol, SAFE[3] + tol], gs = [(gX - c.fx) * c.z + ax, (gY - c.fy) * c.z + ay];
      const es = [(sb[0] - c.fx) * c.z + ax, (sb[1] - c.fy) * c.z + ay, (sb[2] - c.fx) * c.z + ax, (sb[3] - c.fy) * c.z + ay];
      const lim = (e, g, c0, c1) => (e > g + 1 ? (c1 - g) / (e - g) - 1 : e < g - 1 ? (c0 - g) / (e - g) - 1 : Infinity);
      a = Math.min(a, lim(es[0], gs[0], S[0], S[2]), lim(es[2], gs[0], S[0], S[2]), lim(es[1], gs[1], S[1], S[3]), lim(es[3], gs[1], S[1], S[3]));
    }
    return [tp, Math.max(0, a), dur, gx, gy];
  });
}

function camAt(sc, t) {
  const c = camBase(sc, t);
  // Punch: zoom quanh điểm đích (đích đứng yên trên màn hình); biên độ đã kẹp sẵn ở punchPrep để chữ không tràn.
  for (const [tp, amt, dur, gx, gy] of sc._punch || []) {
    const e = envPunch(t - tp, dur || 0.5);
    if (e <= 0 || amt <= 0) continue;
    const a = amt * e, gX = gx != null ? gx * B : c.fx, gY = gy != null ? gy * B : c.fy;
    c.fx += (gX - c.fx) * (a / (1 + a)); c.fy += (gY - c.fy) * (a / (1 + a));
    c.z *= 1 + a;
  }
  let sx = 0, sy = 0;
  for (const [ts, amp, dur] of sc.shake || []) {
    const tau = t - ts;
    if (tau < 0 || tau > dur) continue;
    const d = Math.pow(1 - tau / dur, 2), f = Math.floor(t * 30);
    sx += Math.round(((hash(f * 1.7 + ts) - 0.5) * 2 * amp * d) / 3) * 3;
    sy += Math.round(((hash(f * 2.3 + ts + 5) - 0.5) * 2 * amp * d) / 3) * 3;
  }
  c.ax = sc._ax; c.ay = sc._ay;
  c.tx = Math.round(c.ax - c.fx * c.z + sx); c.ty = Math.round(c.ay - c.fy * c.z + sy);
  return c;
}

function drawFlash(g, sc, t) {
  for (const [tf, dur, color, alpha] of sc.flash || []) {
    if (t < tf || t >= tf + dur) continue;
    const k = Math.floor((t - tf) * 12);
    g.globalAlpha = (alpha != null ? alpha : 0.35) * (1 - k / Math.max(1, dur * 12));
    g.fillStyle = color || WHITE;
    g.fillRect(0, 0, W, H);
  }
  g.globalAlpha = 1;
}

function drawScene(g, sc, t) {
  const cam = camAt(sc, t);
  background(g, sc, t, cam);
  g.setTransform(cam.z, 0, 0, cam.z, cam.tx, cam.ty);
  CUR_CAM = cam;
  // Lớp: vật và FX nền → chữ → pháo giấy/sao (FX "over"). Chữ không bao giờ bị vòng xung hay vật đè.
  for (const it of sc.items) if (!TEXTKINDS[it.kind] && !it._top) DRAW[it.kind](g, it, t);
  for (const it of sc.items) if (TEXTKINDS[it.kind]) DRAW[it.kind](g, it, t);
  drawTop(g, sc, t, cam);
  g.setTransform(1, 0, 0, 1, 0, 0);
  drawFlash(g, sc, t);
}

// Pháo giấy/sao vẽ trên cùng nhưng không được che chữ: vẽ ra canvas phụ, xoá hộp chữ đang hiện (lề 1 block), rồi ghép.
let TOPC = null;
function drawTop(g, sc, t, cam) {
  const tops = sc.items.filter((it) => it._top);
  if (!tops.length) return;
  if (!TOPC) { TOPC = document.createElement('canvas'); TOPC.width = g.canvas.width; TOPC.height = g.canvas.height; }
  const o = TOPC.getContext('2d');
  o.setTransform(1, 0, 0, 1, 0, 0);
  o.clearRect(0, 0, TOPC.width, TOPC.height);
  o.imageSmoothingEnabled = false;
  o.setTransform(cam.z, 0, 0, cam.z, cam.tx, cam.ty);
  for (const it of tops) DRAW[it.kind](o, it, t);
  for (const it of sc.items) {
    if (!TEXTKINDS[it.kind] || it._fx || t < Math.max(itemAt(it), sc.from) || itemOutEnd(it) <= t) continue;
    const b = itemBox(it, t);
    if (b) o.clearRect(b[0] - B, b[1] - B, b[2] - b[0] + 2 * B, b[3] - b[1] + 2 * B);
  }
  g.save();
  g.setTransform(1, 0, 0, 1, 0, 0);
  g.drawImage(TOPC, 0, 0);
  g.restore();
}

// ---------------------------------------------------------------- chuyển cảnh, iris, phụ đề
const MASK = document.createElement('canvas');
MASK.width = GW; MASK.height = GH;
const MG = MASK.getContext('2d');
const MIM = MG.createImageData(GW, GH);

function mask(kind, p, cx, cy, invert, rgb, dir) {
  const d = MIM.data;
  const R = Math.hypot(GW, GH) / 2;
  const nbx = GW / 10 + GH / 10;
  const e = 0.05;
  for (let y = 0; y < GH; y++) for (let x = 0; x < GW; x++) {
    let on;
    const th = (BAYER[(y & 3) * 4 + (x & 3)] + 0.5) / 16;
    if (kind === 'dither') on = th < p;
    else if (kind === 'block') {
      const bx = Math.floor(x / 10), by = Math.floor(y / 10);
      on = ((bx + by) / nbx) * 0.75 + hash(bx * 31 + by * 17) * 0.25 < p;
    } else if (kind === 'wipe') {
      const u = dir === 'down' ? y / GH : dir === 'left' ? 1 - x / GW : dir === 'right' ? x / GW : 1 - y / GH;
      on = u < p * (1 + e) - e * th;
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
const PXC = document.createElement('canvas');
PXC.width = GW; PXC.height = GH;
const PX = PXC.getContext('2d');
PX.imageSmoothingEnabled = false;

function transition(ctx, prev, sc, tin, t) {
  const raw = clamp((t - sc.from) / tin.dur, 0, 1);
  const p = clamp(Math.floor((t - sc.from) * 12 + 1) / (tin.dur * 12), 0, 1);
  if (tin.kind === 'whip') {
    // Lia ngang: cảnh cũ trượt ra, cảnh mới trượt vào, vệt tốc độ ở giữa.
    const e = easeIO(raw), s = tin.dir === 'right' ? -1 : 1;
    drawScene(BX, prev, t);
    ctx.drawImage(BUF, snap(-e * W * s), 0);
    drawScene(BX, sc, t);
    ctx.drawImage(BUF, snap((1 - e) * W * s), 0);
    const amt = Math.sin(Math.PI * raw);
    for (let i = 0; i < 16; i++) {
      const y = Math.floor(hash(i * 3.7 + 1) * GH) * B, len = (0.15 + 0.35 * hash(i * 5.1 + 2)) * W * amt;
      const x = (hash(i * 2.9 + 3) * W - e * W * 0.6 * s + W * 2) % W;
      ctx.globalAlpha = 0.55 * amt;
      ctx.fillStyle = i % 3 === 0 ? '#73eff7' : WHITE;
      ctx.fillRect(snap(x), y, snap(len), B);
    }
    ctx.globalAlpha = 1;
    return;
  }
  if (tin.kind === 'pixelate') {
    // Khảm: cảnh cũ vỡ khối 1→8 block, đổi cảnh ở giữa, cảnh mới ghép lại 8→1.
    const tri = 1 - Math.abs(2 * p - 1), n = 1 + Math.round(7 * tri);
    drawScene(BX, p < 0.5 ? prev : sc, t);
    if (n <= 1) { ctx.drawImage(BUF, 0, 0); return; }
    const w = Math.ceil(W / (n * B)), h = Math.ceil(H / (n * B));
    PX.clearRect(0, 0, GW, GH);
    PX.drawImage(BUF, 0, 0, W, H, 0, 0, w, h);
    ctx.drawImage(PXC, 0, 0, w, h, 0, 0, w * n * B, h * n * B);
    return;
  }
  drawScene(ctx, prev, t);
  drawScene(BX, sc, t);
  BX.globalCompositeOperation = 'destination-in';
  BX.drawImage(mask(tin.kind, p, GW / 2, GH / 2, false, null, tin.dir), 0, 0, W, H);
  BX.globalCompositeOperation = 'source-over';
  ctx.drawImage(BUF, 0, 0);
  if (tin.kind === 'wipe' && p < 1) {
    // Vạch sáng ở mép quét.
    const dir = tin.dir || 'up', u = p * 1.05 - 0.025;
    ctx.fillStyle = YELLOW;
    if (dir === 'up' || dir === 'down') {
      const y = snap(dir === 'down' ? u * H : (1 - u) * H);
      ctx.fillRect(0, y, W, B);
      ctx.fillStyle = WHITE; ctx.fillRect(0, y + (dir === 'down' ? -B : B), W, B);
    } else {
      const x = snap(dir === 'right' ? u * W : (1 - u) * W);
      ctx.fillRect(x, 0, B, H);
      ctx.fillStyle = WHITE; ctx.fillRect(x + (dir === 'right' ? -B : B), 0, B, H);
    }
  }
}

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

// Tâm iris (ô lưới màn hình): từ headline được chọn, đi qua camera của cảnh.
function irisCenter(sc, t) {
  const ir = sc.iris;
  const head = ir.word != null ? sc.items.find((it) => it.kind === 'headline') : null;
  let px, py;
  if (head) {
    const p = headLayout(head).pos[ir.word];
    px = p.x + p.w / 2; py = p.y;
  } else { px = ir.cx * B; py = ir.cy * B; }
  const c = camAt(sc, t);
  return [(px * c.z + c.tx) / B, (py * c.z + c.ty) / B];
}

function render(t) {
  t = clamp(t, 0, D.dur - 1e-4);
  const ctx = window.__ctx;
  let k = 0;
  for (let i = 0; i < D.scenes.length; i++) if (t >= D.scenes[i].from) k = i;
  const sc = D.scenes[k];
  const tin = sc.tin || { kind: 'cut', dur: 0 };
  if (k > 0 && tin.kind !== 'cut' && t < sc.from + tin.dur) transition(ctx, D.scenes[k - 1], sc, tin, t);
  else drawScene(ctx, sc, t);
  if (!sc.noSubs) drawSubs(ctx, t);
  if (sc.iris && t >= sc.iris.at) {
    const p = clamp((t - sc.iris.at) / sc.iris.dur, 0, 1);
    if (p >= 1) { ctx.fillStyle = INKHEX; ctx.fillRect(0, 0, W, H); } else {
      const [cx, cy] = irisCenter(sc, t);
      const e = 1 - p * p * p;
      ctx.drawImage(mask('iris', e, cx, cy, true, PAL[INK - 1]), 0, 0, W, H);
    }
  }
}

// ---------------------------------------------------------------- FX tự sinh theo sự kiện
function fxItems(sc, k) {
  const under = [], over = [];
  sc.shake = (sc.shake || []).slice(); sc.flash = (sc.flash || []).slice(); sc.punch = (sc.punch || []).slice();
  let seed = k * 997 + 13;
  const add = (list, o) => { seed += 37; list.push(Object.assign({ _fx: true, seed }, o)); };
  if (sc.fx === false) return { under, over };
  for (const it of sc.items) {
    if (it.fx === false || it._fx) continue;
    if (it.kind === 'label') {
      const L = labelLayout(it);
      const cx = (L.left + L.pw / 2) / B, cy = (L.top + L.ph / 2) / B;
      if (it.plate === 'stamp') {
        const ti = it.at + 0.25;
        // Pháo giấy bắn từ mép tem ra ngoài (lên trên và sang hai bên), không bắn từ tâm: hộp chữ bị xoá khỏi lớp trên cùng.
        // Tem xấu (STAMP_BAD, viền đỏ): tia lửa + bụi đỏ cam thay pháo giấy — pháo giấy cho câu tiêu cực là sai sắc thái.
        const bad = !!(it.style && it.style.edge === '#b13e53');
        const cf = bad ? { kind: 'burst', type: 'spark', at: ti, speed: 70, life: 0.8, grav: 40, drag: 2.4, colors: ['#b13e53', '#ef7d57', '#333c57'] }
                       : { kind: 'burst', type: 'confetti', at: ti, speed: 95, life: 1.4, grav: 60, drag: 2.2 };
        add(over, Object.assign({ x: cx, y: L.top / B, n: 18, a0: -Math.PI + 0.35, a1: -0.35 }, cf));
        add(over, Object.assign({ x: L.left / B, y: cy, n: 10, a0: Math.PI - 0.5, a1: Math.PI + 0.9 }, cf));
        add(over, Object.assign({ x: (L.left + L.pw) / B, y: cy, n: 10, a0: -0.9, a1: 0.5 }, cf));
        add(under, { kind: 'ring', x: cx, y: cy, r0: L.pw / B / 2, r1: L.pw / B / 2 + 14, at: ti, dur: 0.5, color: (it.style && it.style.color) || '#a7f070' });
        sc.shake.push([ti, 18, 0.35]);
        sc.flash.push([ti, 0.17, bad ? '#b13e53' : WHITE, 0.35]);
        sc.punch.push([ti, 0.06, 0.5, cx, cy]);
      }
      if (it.strike) {
        const te = it.strike.at + (it.strike.dur || 0.25);
        const x1 = (L.left + L.pw - (L.bare ? -B : L.padX)) / B, y = (L.top + L.ph / 2) / B;
        add(over, { kind: 'burst', type: 'spark', x: x1, y, at: te, n: 12, speed: 35, life: 0.5, colors: ['#b13e53', '#ef7d57', WHITE] });
        sc.shake.push([te, 8, 0.25]);
      }
      continue;
    }
    if (it.kind === 'headline') {
      const L = headLayout(it);
      it.words.forEach((w, i) => {
        if (!w.hl) return;
        const p = L.pos[i];
        add(over, { kind: 'burst', type: 'star', x: (p.x + p.w / 2) / B, y: p.y / B, at: w.t, n: 16, speed: 40, life: 0.8 });
      });
      continue;
    }
    if (it.kind === 'photo') {
      const cx = it.x + it.w / 2, cy = it.y + it.h / 2, at = it.at || 0;
      add(under, { kind: 'ring', x: cx, y: cy, r0: Math.max(it.w, it.h) / 2, r1: Math.max(it.w, it.h) / 2 + 10, at: at + 0.08, dur: 0.45 });
      add(over, { kind: 'burst', type: 'star', x: cx, y: it.y, at: at + 0.12, n: 12, speed: 40, life: 0.7, colors: [YELLOW, WHITE, '#73eff7'] });
      continue;
    }
    if (it.kind !== 'sprite') continue;
    const S = D.sprites[it.sprite];
    if (!S) continue;
    const sc1 = it.scale || 1, at = it.at || 0;
    const [x, y] = posAt(it, at + 0.01);
    const cx = x + (S.w * sc1) / 2, cy = y + (S.h * sc1) / 2, rad = (Math.max(S.w, S.h) * sc1) / 2;
    if (it.reveal === 'pop') {
      add(under, { kind: 'ring', x: cx, y: cy, r0: rad * 0.9, r1: rad * 0.9 + 6, at: at + 0.08, dur: 0.35 });
      if (sc1 >= 2) add(over, { kind: 'burst', type: 'spark', x: cx, y: cy, at: at + 0.08, n: 10, speed: 30, life: 0.45 });
    }
    if (it.reveal === 'bloom') add(over, { kind: 'burst', type: 'star', x: cx, y: cy, at: at + 0.1, n: 8, speed: 18, life: 0.7, colors: [YELLOW, WHITE, '#73eff7'] });
    for (const [name, L] of Object.entries(it.layers || {})) {
      if (L.reveal !== 'bloom') continue;
      const c = celCenter(S, name, 0);
      if (!c) continue;
      add(over, { kind: 'burst', type: 'star', x: x + (it.flip ? S.w - c[0] : c[0]) * sc1, y: y + c[1] * sc1, at: (L.at != null ? L.at : at) + 0.1, n: 8, speed: 18, life: 0.7, colors: [YELLOW, WHITE, '#73eff7'] });
    }
    if (it.sprite === 'dau-x') {
      sc.shake.push([at + 0.1, 10, 0.3]);
      add(over, { kind: 'burst', type: 'spark', x: cx, y: cy, at: at + 0.1, n: 14, speed: 40, life: 0.5, colors: ['#b13e53', '#ef7d57'] });
    }
    if (it.sprite === 'dau-tich') add(over, { kind: 'burst', type: 'spark', x: cx, y: cy, at: at + 0.1, n: 14, speed: 30, life: 0.6, colors: ['#38b764', '#a7f070', WHITE] });
    for (const sp of it.spot || []) {
      const c = celCenter(S, 'node:' + sp.node, 0);
      if (!c) continue;
      const gx = x + (it.flip ? S.w - c[0] : c[0]) * sc1, gy = y + c[1] * sc1, r0 = (c[2] / 2) * sc1 * 1.17 + 1;
      add(under, { kind: 'ring', x: gx, y: gy, r0, r1: r0 + 10, at: sp.from, dur: 0.55, color: YELLOW });
      add(under, { kind: 'ring', x: gx, y: gy, r0, r1: r0 + 10, at: sp.from + 0.15, dur: 0.55, color: YELLOW });
      if (sp.to - sp.from > 1.4) add(under, { kind: 'ring', x: gx, y: gy, r0, r1: r0 + 8, at: sp.from + 1.1, every: 1.1, until: sp.to - 0.4, dur: 0.9, color: '#73eff7', faint: true });
    }
  }
  for (const o of over) o._top = true;
  return { under, over };
}

function prepare() {
  D.scenes.forEach((sc, k) => {
    sc._to = k + 1 < D.scenes.length ? D.scenes[k + 1].from : D.dur;
    let seed = k * 131 + 7;
    for (const it of sc.items) if ((it.kind === 'burst' || it.kind === 'emit') && it.seed == null) it.seed = seed += 53;
    const { under, over } = fxItems(sc, k);
    sc.items = [...under, ...sc.items, ...over];
  });
  D.scenes.forEach((sc, k) => camPrep(sc, k));
  D.scenes.forEach((sc) => punchPrep(sc));
  window.__cams = D.scenes.map((sc) => ({ from: sc.from, cam0: sc._cam0, punch: sc._punch, keys: sc._keys.map((k) => ({ t0: k.t0, t1: k.t1, z: k.z, fx: k.fx, fy: k.fy, zcap: k.zcap })) }));
}

// ---------------------------------------------------------------- khởi động (khuôn HyperFrames)
window.__timelines = window.__timelines || {};
let done = false;
function go() {
  if (done) return;
  done = true;
  prepare();
  const cv = document.getElementById('stage');
  const ctx = cv.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  window.__ctx = ctx;
  const tl = gsap.timeline({ paused: true });
  const clock = { t: 0 };
  tl.to(clock, { t: D.dur, duration: D.dur, ease: 'none', onUpdate: () => render(clock.t) }, 0);
  window.__timelines['main'] = tl;
  window.__render = render;
  // Soát bố cục (QA): item nào lệch khỏi vùng tại giây t. Chữ so với CONTENT, sprite so với SAFE; bỏ FX và
  // item đang di chuyển/vào ra. Trả [{k, kind, name, box}] theo toạ độ màn hình.
  // Hộp màn hình của mọi chữ/sprite đang đứng yên tại giây t (bỏ FX, item cam:false, item đang vào/ra/di chuyển).
  const itemName = (it) => String(it.sprite || it.photo || (it.words ? it.words.map((w) => w.text).join(' ')
    : typeof it.text === 'string' ? it.text : Array.isArray(it.text) ? it.text.map((x) => x[1]).join(' → ')
    : JSON.stringify(it.text))).slice(0, 24);
  const settledBoxes = (t, all) => {
    let k = 0;
    for (let i = 0; i < D.scenes.length; i++) if (t >= D.scenes[i].from) k = i;
    const sc = D.scenes[k], c = camAt(sc, t), out = [];
    const tin = sc.tin || { kind: 'cut', dur: 0 };
    if (t < sc.from + (tin.dur || 0) + 0.1) return out;
    for (const it of sc.items) {
      if (it._fx || (!all && it.cam === false) || !(it.kind === 'sprite' || it.kind === 'photo' || TEXTKINDS[it.kind])) continue;
      const at = Math.max(itemAt(it), sc.from);
      // Chữ soát ngay từ lúc hiện (camera đã tới trước); sprite chừa 0,35 giây cho nhịp nảy.
      if (t < at + (TEXTKINDS[it.kind] ? 0.05 : 0.35) || t > itemOutEnd(it) - 0.05 || (it.out && t > (it.out.at != null ? it.out.at : it.out))) continue;
      if ((it.move || []).some(([t0, t1]) => t > t0 - 0.05 && t < t1 + 0.1)) continue;
      const b = itemBox(it, t);
      if (!b) continue;
      const e = [(b[0] - c.fx) * c.z + c.ax, (b[1] - c.fy) * c.z + c.ay, (b[2] - c.fx) * c.z + c.ax, (b[3] - c.fy) * c.z + c.ay];
      const o = { k, kind: it.kind, text: !!TEXTKINDS[it.kind], name: itemName(it), box: e.map(Math.round), it };
      if (all && it.kind === 'photo') o.ink = [...e.map(Math.round), Math.round((b[2] - b[0]) * (b[3] - b[1]) * c.z * c.z)];
      if (all && it.kind === 'sprite') {
        const ib = inkBox(it, t);
        o.ink = ib ? [...[(ib.box[0] - c.fx) * c.z + c.ax, (ib.box[1] - c.fy) * c.z + c.ay, (ib.box[2] - c.fx) * c.z + c.ax,
          (ib.box[3] - c.fy) * c.z + c.ay].map(Math.round), Math.round(ib.area * c.z * c.z)] : [0, 0, 0, 0, 0];
      }
      out.push(o);
    }
    return out;
  };
  window.__layoutCheck = (t) => settledBoxes(t, false).filter((o) => {
    const e = o.box, R = o.text ? CONTENT : SAFE, tol = 4;
    return e[0] < R[0] - tol || e[1] < R[1] - tol || e[2] > R[2] + tol || e[3] > R[3] + tol;
  }).map(({ k, kind, name, box }) => ({ k, kind, name, box }));
  // Soát chồng lấn (QA), đo theo điểm ảnh đục của sprite, không theo hộp:
  //  text-text   hai hộp chữ giao nhau; frac = phần giao / hộp nhỏ hơn.
  //  text-near   hai hộp chữ không giao nhưng khe < 2 block và chồng nhau theo chiều chiếu; gap tính bằng block.
  //  text-sprite tỉ lệ điểm ảnh đục của sprite nằm dưới HỢP mọi hộp chữ (bỏ tem plate:"stamp" và nhãn over:true).
  //  sprite-sprite tỉ lệ điểm ảnh đục của sprite dưới bị điểm ảnh đục của sprite vẽ sau che (bỏ sprite trên có over:true,
  //              bỏ cặp có vật đang mờ dim < 0,5).
  //  Với text-sprite/sprite-sprite: head = tỉ lệ bị che trong 40% hàng trên của vật dưới (đầu nhân vật);
  //  ra = role vật trên ('text' với chữ), rb = role vật dưới (role trong manifest thư viện: actor/still/draw/model).
  // Hộp tính trong toạ độ thế giới (trước camera); camera phóng đều nên tỉ lệ không đổi.
  window.__overlapCheck = (t) => {
    const bx = settledBoxes(t, true), res = [];
    const txt = bx.filter((o) => o.text).map((o) => ({ ...o, w: itemBox(o.it, t) })).filter((o) => o.w);
    const spr = bx.filter((o) => !o.text && o.it.kind === 'sprite' && dimAt(o.it.dim, t) >= 0.5).map((o) => ({ ...o, m: inkMask(o.it, t) })).filter((o) => o.m);
    const inter = (a, b) => Math.max(0, Math.min(a[2], b[2]) - Math.max(a[0], b[0])) * Math.max(0, Math.min(a[3], b[3]) - Math.max(a[1], b[1]));
    const area = (a) => Math.max(1, (a[2] - a[0]) * (a[3] - a[1]));
    const inside = (b, x, y) => x >= b[0] && x < b[2] && y >= b[1] && y < b[3];
    const role = (o) => (D.sprites[o.it.sprite] || {}).role || null;
    // c: số điểm bị che; hc/hn: số điểm bị che / tổng số điểm trong 40% hàng trên của hộp mực.
    const push = (type, lo, a, ra, P, covered) => {
      const hy = lo.m.box[1] + 0.4 * (lo.m.box[3] - lo.m.box[1]);
      let c = 0, hc = 0, hn = 0;
      for (let q = 0; q < P.length; q += 2) {
        const top = P[q + 1] < hy, k = covered(P[q], P[q + 1]);
        if (k) c++;
        if (top) { hn++; if (k) hc++; }
      }
      const frac = c / (P.length / 2), head = hn ? hc / hn : 0;
      if (frac >= 0.05 || head >= 0.15) res.push({ type, k: lo.k, a, b: lo.name, ra, rb: role(lo), frac: +frac.toFixed(2), head: +head.toFixed(2) });
    };
    for (let i = 0; i < txt.length; i++) for (let j = i + 1; j < txt.length; j++) {
      const a = txt[i].w, b = txt[j].w, s = inter(a, b);
      if (s > 36) { res.push({ type: 'text-text', k: txt[i].k, a: txt[i].name, b: txt[j].name, frac: +(s / Math.min(area(a), area(b))).toFixed(2) }); continue; }
      const gx = Math.max(0, b[0] - a[2], a[0] - b[2]), gy = Math.max(0, b[1] - a[3], a[1] - b[3]);
      const ox = Math.min(a[2], b[2]) - Math.max(a[0], b[0]), oy = Math.min(a[3], b[3]) - Math.max(a[1], b[1]);
      const gap = gx === 0 && ox > B ? gy : gy === 0 && oy > B ? gx : Infinity;
      if (gap < 2 * B) res.push({ type: 'text-near', k: txt[i].k, a: txt[i].name, b: txt[j].name, frac: 0, gap: +(gap / B).toFixed(1) });
    }
    const cover = txt.filter((o) => !o.it.over && o.it.plate !== 'stamp');
    for (const s of spr) {
      const hits = cover.filter((o) => inter(o.w, s.m.box) > 0);
      if (!hits.length) continue;
      push('text-sprite', s, hits.map((o) => o.name).join(' + '), 'text', s.m.pts, (x, y) => hits.some((o) => inside(o.w, x, y)));
    }
    for (let i = 0; i < spr.length; i++) for (let j = i + 1; j < spr.length; j++) {
      const lo = spr[i], hi = spr[j];
      if (hi.it.over || inter(lo.m.box, hi.m.box) <= 0) continue;
      const ib = hi.m.box;
      push('sprite-sprite', lo, hi.name, role(hi), lo.m.pts, (x, y) => inside(ib, x, y) && hi.m.hit(x, y));
    }
    return res;
  };
  // Soát độ đầy khung (QA): hộp mọi chữ/sprite đang đứng yên; trans = đang chuyển cảnh (mẫu bị bỏ qua).
  window.__fillCheck = (t) => {
    let k = 0;
    for (let i = 0; i < D.scenes.length; i++) if (t >= D.scenes[i].from) k = i;
    const sc = D.scenes[k], tin = sc.tin || { dur: 0 };
    return { k, trans: t < sc.from + (tin.dur || 0) + 0.1, boxes: settledBoxes(t, true).map((o) => [o.text ? 1 : 0, o.kind, o.name, ...o.box, ...(o.ink || [])]) };
  };
  render(0);
  tl.seek(0);
}
const SAMPLE = 'Aa ăâđêôơư ẢẤẦẨẪẬ ỗỡợủừữựỳỷỹ .,0123';
const FACES = [FONT.vt(64), FONT.mono(48), FONT.bvp(44, 700), FONT.bvp(80, 900)];
const photoLoads = Object.entries(D.photos || {}).map(([id, P]) => new Promise((res) => {
  const img = new Image();
  img.onload = () => { PHOTOS[id] = { img }; res(); };
  img.onerror = () => res();
  img.src = P.src;
}));
Promise.all([...FACES.map((f) => document.fonts.load(f, SAMPLE).catch(() => null)), ...photoLoads]).then(() => document.fonts.ready).then(go);
