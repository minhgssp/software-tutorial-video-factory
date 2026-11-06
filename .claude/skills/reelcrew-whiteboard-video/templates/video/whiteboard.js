// The whiteboard engine: one scene's line art drawn region by region on one canvas, so earlier regions stay drawn.
// A port of a region renderer written for OpenCV and numpy (references/engine.md maps each part to its original):
//   loading     the image scaled to the long edge (INTER_AREA), grey, Gaussian adaptive threshold (block 15, C 10),
//               the paper match, per region the allowed mask (its box minus every later box and its protectedRegions),
//               the pen path (grid or skeleton) and its samples;
//   reveal      per pixel, the frame its ink shows (black) and the frame its colour shows (contour-wipe), or the
//               brush stamps (brush); a frame is paper + ink ≤ f + colour ≤ f + the hand at the pen point of f;
//   timing      regions in startMs order, ink:colour 2:1, the pause model, then a hold of at least 0.5 s with the
//               full image.
// Frames depend only on their index: Python's round-half-to-even and int() truncation are kept where the original has
// them, so a frame here matches the original's frame with the same index.
(() => {
  'use strict';
  const INF = 0x7fffffff;
  const DEFAULTS = {
    fps: 30, inkPath: 'grid', colorFill: 'contour-wipe', pause: 'heavy', capLongEdge: null,
    gridEdge: 10, brushRadius: 40, inkRevealRadius: 4, sampleStep: 2,
    wipeDecay: 0.86, wipeDelayRatio: 0.04, wipeBlocks: 18, holdMs: 1000, bareTip: true,
    hand: { file: 'assets/hand.png', anchorX: 0, anchorY: 0 },
    paper: '#F6F1E3', matchBg: true, matchBgThreshold: 28, inkThreshold: 10,
    targetHandHeight: 493, skeletonMinPoints: 8, skeletonSpacing: 2.5,
    pauseRatioHeavy: 0.03, pauseRatioLight: 0.008, pauseHeavyFpc: 0.7, pauseLightFpc: 0.4,
  };
  // The sizes the original tuned at a long edge of 1080; scaled with the canvas.
  const SCALED = ['gridEdge', 'brushRadius', 'inkRevealRadius', 'sampleStep'];

  // ── Python arithmetic ──
  const pyRound = (x) => { const f = Math.floor(x); const d = x - f; return d < 0.5 ? f : d > 0.5 ? f + 1 : (f % 2 === 0 ? f : f + 1); };
  const cvRound = pyRound; // saturate_cast<int>(double) rounds half to even as well
  const fdiv = (a, b) => Math.floor(a / b);
  const f32 = Math.fround;
  const ease = (t) => -(Math.cos(Math.PI * t) - 1) / 2;
  const hexRgb = (h) => { const d = h.replace('#', ''); return [parseInt(d.slice(0, 2), 16), parseInt(d.slice(2, 4), 16), parseInt(d.slice(4, 6), 16)]; };

  // ── image operations matched to OpenCV ──
  // INTER_AREA for a shrink by a non-integer factor (resizeArea's weight tables), rounded to 8 bits.
  function areaTab(ssize, dsize) {
    const scale = ssize / dsize; const tab = [];
    for (let dx = 0; dx < dsize; dx++) {
      const fsx1 = dx * scale; const fsx2 = fsx1 + scale; const cell = Math.min(scale, ssize - fsx1);
      let sx1 = Math.ceil(fsx1); let sx2 = Math.floor(fsx2);
      sx2 = Math.min(sx2, ssize - 1); sx1 = Math.min(sx1, sx2);
      const row = [];
      if (sx1 - fsx1 > 1e-3) row.push([sx1 - 1, (sx1 - fsx1) / cell]);
      for (let sx = sx1; sx < sx2; sx++) row.push([sx, 1 / cell]);
      if (fsx2 - sx2 > 1e-3) row.push([sx2, Math.min(Math.min(fsx2 - sx2, 1), cell) / cell]);
      tab.push(row);
    }
    return tab;
  }
  function bilinearTab(ssize, dsize) { // INTER_LINEAR, for an image smaller than the canvas
    const scale = ssize / dsize; const tab = [];
    for (let d = 0; d < dsize; d++) {
      let fx = (d + 0.5) * scale - 0.5; let sx = Math.floor(fx); fx -= sx;
      if (sx < 0) { sx = 0; fx = 0; }
      if (sx >= ssize - 1) { sx = ssize - 1; fx = 0; }
      tab.push(fx ? [[sx, 1 - fx], [sx + 1, fx]] : [[sx, 1]]);
    }
    return tab;
  }
  function resizeRgb(src, sw, sh, dw, dh) { // src RGBA bytes → RGB bytes
    const tx = dw <= sw ? areaTab(sw, dw) : bilinearTab(sw, dw);
    const ty = dh <= sh ? areaTab(sh, dh) : bilinearTab(sh, dh);
    const tmp = new Float64Array(sw * dh * 3);
    for (let dy = 0; dy < dh; dy++) {
      for (const [sy, w] of ty[dy]) {
        const so = sy * sw * 4; const to = dy * sw * 3;
        for (let x = 0; x < sw; x++) { tmp[to + x * 3] += src[so + x * 4] * w; tmp[to + x * 3 + 1] += src[so + x * 4 + 1] * w; tmp[to + x * 3 + 2] += src[so + x * 4 + 2] * w; }
      }
    }
    const out = new Uint8Array(dw * dh * 3);
    for (let dy = 0; dy < dh; dy++) {
      for (let dx = 0; dx < dw; dx++) {
        let r = 0; let g = 0; let b = 0;
        for (const [sx, w] of tx[dx]) { const o = (dy * sw + sx) * 3; r += tmp[o] * w; g += tmp[o + 1] * w; b += tmp[o + 2] * w; }
        const o = (dy * dw + dx) * 3;
        out[o] = Math.min(255, Math.max(0, cvRound(r))); out[o + 1] = Math.min(255, Math.max(0, cvRound(g))); out[o + 2] = Math.min(255, Math.max(0, cvRound(b)));
      }
    }
    return out;
  }
  // getGaussianKernel: the fixed small kernels for sigma ≤ 0 and size ≤ 7, else σ = 0.3·((k−1)·0.5 − 1) + 0.8.
  const SMALL = { 1: [1], 3: [0.25, 0.5, 0.25], 5: [0.0625, 0.25, 0.375, 0.25, 0.0625], 7: [0.03125, 0.109375, 0.21875, 0.28125, 0.21875, 0.109375, 0.03125] };
  function gaussKernel(k) {
    if (SMALL[k]) return SMALL[k];
    const sigma = 0.3 * ((k - 1) * 0.5 - 1) + 0.8; const c = (k - 1) / 2; const w = [];
    let s = 0;
    for (let i = 0; i < k; i++) { w.push(Math.exp(-((i - c) ** 2) / (2 * sigma * sigma))); s += w[i]; }
    return w.map((v) => v / s);
  }
  const replicate = (i, n) => (i < 0 ? 0 : i >= n ? n - 1 : i);
  const reflect101 = (i, n) => { if (n === 1) return 0; while (i < 0 || i >= n) i = i < 0 ? -i : 2 * n - 2 - i; return i; };
  function gaussBlur8(src, w, h, k, border) { // separable, rounded to 8 bits at the end (OpenCV's bit-exact path)
    if (k === 1) return Uint8Array.from(src);
    const ker = gaussKernel(k); const r = (k - 1) / 2;
    const tmp = new Float64Array(w * h); const out = new Uint8Array(w * h);
    const xi = []; for (let x = -r; x < w + r; x++) xi.push(border(x, w));
    for (let y = 0; y < h; y++) {
      const o = y * w;
      for (let x = 0; x < w; x++) { let s = 0; for (let j = 0; j < k; j++) s += src[o + xi[x + j]] * ker[j]; tmp[o + x] = s; }
    }
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        let s = 0; for (let j = 0; j < k; j++) s += tmp[border(y + j - r, h) * w + x] * ker[j];
        out[y * w + x] = Math.min(255, Math.floor(s + 0.5));
      }
    }
    return out;
  }
  function ellipseKernel(k) { // getStructuringElement(MORPH_ELLIPSE, (k, k))
    const r = Math.floor(k / 2); const c = r; const inv = r ? 1 / (r * r) : 0; const rows = [];
    for (let i = 0; i < k; i++) {
      const dy = i - r; let j1 = 0; let j2 = 0;
      if (Math.abs(dy) <= r) { const dx = cvRound(c * Math.sqrt((r * r - dy * dy) * inv)); j1 = Math.max(c - dx, 0); j2 = Math.min(c + dx + 1, k); }
      rows.push([j1, j2]);
    }
    return rows;
  }

  // ── grid paths (cell space) ──
  function components8(active, rows, cols) {
    // 8-connected components; listed in the order OpenCV's block-based labelling numbers them (the first 2×2 block of
    // each in block raster order); cells inside a component in row-major order (np.argwhere)
    const label = new Int32Array(rows * cols).fill(-1); const comps = [];
    for (let by = 0; by < rows; by += 2) {
      for (let bx = 0; bx < cols; bx += 2) {
        for (const [r, c] of [[by, bx], [by, bx + 1], [by + 1, bx], [by + 1, bx + 1]]) {
          if (r >= rows || c >= cols || !active[r * cols + c] || label[r * cols + c] >= 0) continue;
          const id = comps.length; const cells = []; const stack = [r * cols + c]; label[r * cols + c] = id;
          while (stack.length) {
            const i = stack.pop(); cells.push(i); const ir = (i / cols) | 0; const ic = i % cols;
            for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
              const nr = ir + dr; const nc = ic + dc;
              if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
              const n = nr * cols + nc;
              if (active[n] && label[n] < 0) { label[n] = id; stack.push(n); }
            }
          }
          cells.sort((a, b) => a - b);
          comps.push(cells.map((i) => [(i / cols) | 0, i % cols]));
        }
      }
    }
    return comps;
  }
  const bounds = (cells) => {
    let a = Infinity; let b = Infinity; let c = -Infinity; let d = -Infinity;
    for (const [r, k] of cells) { if (r < a) a = r; if (k < b) b = k; if (r > c) c = r; if (k > d) d = k; }
    return [a, b, c, d];
  };
  function splitBridge(cells, minSide = 20) {
    if (cells.length < minSide * 2) return [cells];
    const [minRow, minCol, maxRow, maxCol] = bounds(cells);
    const height = maxRow - minRow + 1; const width = maxCol - minCol + 1;
    if (width < 16 || height < 10) return [cells];
    const counts = new Map(); for (let c = minCol; c <= maxCol; c++) counts.set(c, 0);
    for (const [, c] of cells) counts.set(c, counts.get(c) + 1);
    const limit = Math.max(3, Math.ceil(height * 0.30)); const guard = 4; const valleys = []; let start = null;
    for (let col = minCol; col < maxCol + 2; col++) {
      const low = col <= maxCol && counts.get(col) <= limit;
      if (low && start === null) start = col;
      else if (!low && start !== null) {
        const end = col - 1;
        if (end - start + 1 >= 2 && start > minCol + guard && end < maxCol - guard) valleys.push([start, end]);
        start = null;
      }
    }
    if (!valleys.length) return [cells];
    let best = valleys[0];
    for (const v of valleys) if (v[1] - v[0] > best[1] - best[0] || (v[1] - v[0] === best[1] - best[0] && -v[0] > -best[0])) best = v;
    const cut = fdiv(best[0] + best[1], 2);
    const left = cells.filter((c) => c[1] <= cut); const right = cells.filter((c) => c[1] > cut);
    if (left.length < minSide || right.length < minSide) return [cells];
    return [...splitBridge(left, minSide), ...splitBridge(right, minSide)];
  }
  function mergeSmall(comps, threshold) {
    const big = comps.filter((c) => c.length > threshold); const small = comps.filter((c) => c.length <= threshold);
    if (!small.length || !big.length) return comps;
    const cent = big.map((cells) => { let r = 0; let c = 0; for (const x of cells) { r += x[0]; c += x[1]; } return [r / cells.length, c / cells.length]; });
    const merged = big.map((c) => c.slice());
    for (const cells of small) {
      let r = 0; let c = 0; for (const x of cells) { r += x[0]; c += x[1]; }
      r /= cells.length; c /= cells.length;
      let bi = 0; let bd = Infinity;
      for (let i = 0; i < big.length; i++) { const d = (cent[i][0] - r) ** 2 + (cent[i][1] - c) ** 2; if (d < bd) { bd = d; bi = i; } }
      merged[bi].push(...cells);
    }
    return merged;
  }
  function classify(active, rows, cols) {
    let comps = components8(active, rows, cols).filter((c) => c.length);
    if (!comps.length) return [];
    comps = comps.flatMap((c) => splitBridge(c));
    const total = comps.reduce((s, c) => s + c.length, 0);
    comps = mergeSmall(comps, Math.max(3, Math.trunc(total * 0.005)));
    let subject = 0; for (let i = 1; i < comps.length; i++) if (comps[i].length > comps[subject].length) subject = i;
    const groups = comps.map((cells, i) => {
      const [minRow, minCol, maxRow, maxCol] = bounds(cells);
      const h = maxRow - minRow + 1; const w = maxCol - minCol + 1; const density = cells.length / (h * w);
      const [kind, rank] = i === subject ? ['subject', 0] : (h >= 2 && w / h >= 2.2 && density >= 0.5 ? ['text', 1] : ['contour', 2]);
      return { kind, cells, key: [rank, minRow, minCol], i };
    });
    groups.sort((a, b) => a.key[0] - b.key[0] || a.key[1] - b.key[1] || a.key[2] - b.key[2] || a.i - b.i);
    return groups.map((g) => [g.kind, g.cells]);
  }
  const touch = (a, b, m = 2) => !(a[3] + m < b[1] || b[3] + m < a[1] || a[2] + m < b[0] || b[2] + m < a[0]);
  function groupAdjacent(groups) {
    const regions = []; const boxes = [];
    for (const g of groups) {
      const gb = bounds(g[1]);
      const touching = []; boxes.forEach((b, i) => { if (touch(gb, b)) touching.push(i); });
      if (!touching.length) { regions.push([g]); boxes.push(gb); continue; }
      const t = touching[0]; regions[t].push(g);
      let b = boxes[t]; boxes[t] = [Math.min(b[0], gb[0]), Math.min(b[1], gb[1]), Math.max(b[2], gb[2]), Math.max(b[3], gb[3])];
      for (const i of touching.slice(1).reverse()) {
        regions[t].push(...regions.splice(i, 1)[0]);
        const o = boxes.splice(i, 1)[0]; b = boxes[t];
        boxes[t] = [Math.min(b[0], o[0]), Math.min(b[1], o[1]), Math.max(b[2], o[2]), Math.max(b[3], o[3])];
      }
    }
    return regions;
  }
  const key2 = (r, c) => r * 65536 + c;
  function densitySeed(cells, radius = 2) {
    const set = new Set(cells.map(([r, c]) => key2(r, c))); let best = cells[0]; let bestScore = -1;
    for (const [r, c] of cells) {
      let s = 0;
      for (let dr = -radius; dr <= radius; dr++) for (let dc = -radius; dc <= radius; dc++) if (set.has(key2(r + dr, c + dc))) s++;
      if (s > bestScore) { bestScore = s; best = [r, c]; }
    }
    return best;
  }
  function gradientWalk(cells) {
    if (!cells.length) return [];
    const set = new Set(cells.map(([r, c]) => key2(r, c)));
    const seed = densitySeed(cells); const visited = new Set([key2(...seed)]);
    const path = [seed]; let cur = seed; let prev = [0, 0];
    while (visited.size < cells.length) {
      let next = null; let nk = null;
      for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
        if (!dr && !dc) continue;
        const r = cur[0] + dr; const c = cur[1] + dc; const k = key2(r, c);
        if (!set.has(k) || visited.has(k)) continue;
        let local = 0;
        for (let a = -1; a <= 1; a++) for (let b = -1; b <= 1; b++) { const q = key2(r + a, c + b); if (set.has(q) && !visited.has(q)) local++; }
        const turn = (dr - prev[0]) ** 2 + (dc - prev[1]) ** 2;
        const cand = [-local, turn, r, c];
        if (!nk || cand[0] < nk[0] || (cand[0] === nk[0] && (cand[1] < nk[1] || (cand[1] === nk[1] && (cand[2] < nk[2] || (cand[2] === nk[2] && cand[3] < nk[3])))))) { nk = cand; next = [r, c]; }
      }
      if (!next) {
        for (const cell of cells) {
          if (visited.has(key2(...cell))) continue;
          const cand = [(cell[0] - cur[0]) ** 2 + (cell[1] - cur[1]) ** 2, cell[0], cell[1]];
          if (!nk || cand[0] < nk[0] || (cand[0] === nk[0] && (cand[1] < nk[1] || (cand[1] === nk[1] && cand[2] < nk[2])))) { nk = cand; next = cell; }
        }
      }
      prev = [next[0] - cur[0], next[1] - cur[1]];
      path.push(next); visited.add(key2(...next)); cur = next;
    }
    return path;
  }
  function nearestOrder(cells, seed) {
    const remaining = cells.slice(); const out = [];
    let i0 = remaining.findIndex((c) => c[0] === seed[0] && c[1] === seed[1]);
    let cur = remaining[i0 < 0 ? 0 : i0];
    while (remaining.length) {
      out.push(cur); remaining.splice(remaining.indexOf(cur), 1);
      if (!remaining.length) break;
      const last = out[out.length - 1]; let best = null; let bd = Infinity;
      for (const c of remaining) { const d = (c[0] - last[0]) ** 2 + (c[1] - last[1]) ** 2; if (d < bd) { bd = d; best = c; } }
      cur = best;
    }
    return out;
  }
  function textScan(cells, seg = 4) {
    if (!cells.length) return [];
    const left = Math.min(...cells.map((c) => c[1])); const buckets = new Map();
    for (const c of cells) { const k = fdiv(c[1] - left, seg); if (!buckets.has(k)) buckets.set(k, []); buckets.get(k).push(c); }
    const out = []; let tail = null;
    for (const k of [...buckets.keys()].sort((a, b) => a - b)) {
      const sc = buckets.get(k); let seed = null; let bd = null;
      for (const c of sc) {
        const d = tail ? [(c[0] - tail[0]) ** 2 + (c[1] - tail[1]) ** 2, 0] : [c[0], c[1]];
        if (!bd || d[0] < bd[0] || (d[0] === bd[0] && d[1] < bd[1])) { bd = d; seed = c; }
      }
      const o = nearestOrder(sc, seed); out.push(...o); tail = o[o.length - 1];
    }
    return out;
  }
  const d2 = (a, b) => (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2;
  function chainRegion(groups) {
    const remaining = groups.map(([kind, cells]) => (kind === 'text' ? textScan(cells) : gradientWalk(cells))).filter((p) => p.length);
    const out = []; let tail = null;
    while (remaining.length) {
      let pick = 0;
      if (tail) { let bd = Infinity; remaining.forEach((p, i) => { const d = Math.min(d2(p[0], tail), d2(p[p.length - 1], tail)); if (d < bd) { bd = d; pick = i; } }); }
      const path = remaining.splice(pick, 1)[0];
      if (tail && path.length > 1 && d2(path[path.length - 1], tail) < d2(path[0], tail)) path.reverse();
      out.push(...path); tail = path[path.length - 1];
    }
    return out;
  }
  function gridPath(active, rows, cols) { // cluster_ink_streams + flatten_streams
    if (!active.some((v) => v)) return [];
    const streams = groupAdjacent(classify(active, rows, cols)).map(chainRegion).filter((s) => s.length);
    const out = []; let tail = null;
    while (streams.length) {
      let pick = 0;
      if (tail) { let bd = Infinity; streams.forEach((s, i) => { const d = d2(s[0], tail); if (d < bd) { bd = d; pick = i; } }); }
      let s = streams.splice(pick, 1)[0];
      if (tail && s.length > 1 && d2(s[s.length - 1], tail) < d2(s[0], tail)) s = s.slice().reverse();
      out.push(...s); tail = s[s.length - 1];
    }
    return out;
  }

  // ── skeleton paths (pixel space, inside a crop) ──
  function zhangSuen(mask, w, h, maxIter = 160) {
    const W = w + 2; const img = new Uint8Array(W * (h + 2));
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) img[(y + 1) * W + x + 1] = mask[y * w + x];
    const marks = [];
    for (let it = 0; it < maxIter; it++) {
      let changed = false;
      for (const step of [0, 1]) {
        marks.length = 0;
        for (let y = 1; y <= h; y++) {
          for (let x = 1; x <= w; x++) {
            const i = y * W + x; if (!img[i]) continue;
            const p2 = img[i - W]; const p3 = img[i - W + 1]; const p4 = img[i + 1]; const p5 = img[i + W + 1];
            const p6 = img[i + W]; const p7 = img[i + W - 1]; const p8 = img[i - 1]; const p9 = img[i - W - 1];
            const n = [p2, p3, p4, p5, p6, p7, p8, p9]; const count = p2 + p3 + p4 + p5 + p6 + p7 + p8 + p9;
            if (count < 2 || count > 6) continue;
            let tr = 0; for (let k = 0; k < 8; k++) if (!n[k] && n[(k + 1) % 8]) tr++;
            if (tr !== 1) continue;
            if (step === 0 ? (p2 * p4 * p6 === 0 && p4 * p6 * p8 === 0) : (p2 * p4 * p8 === 0 && p2 * p6 * p8 === 0)) marks.push(i);
          }
        }
        if (marks.length) { for (const i of marks) img[i] = 0; changed = true; }
      }
      if (!changed) break;
    }
    const out = new Uint8Array(w * h);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) out[y * w + x] = img[(y + 1) * W + x + 1];
    return out;
  }
  const NB8 = [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]];
  function traceSkeleton(skel, w, h, minPoints) {
    const at = (x, y) => x >= 0 && y >= 0 && x < w && y < h && skel[y * w + x] === 1;
    const nbs = (x, y) => {
      const r = [];
      for (const [dx, dy] of NB8) {
        const nx = x + dx; const ny = y + dy;
        if (!at(nx, ny)) continue;
        if (dx && dy && (at(nx, y) || at(x, ny))) continue;
        r.push([nx, ny]);
      }
      return r;
    };
    const pts = []; for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (skel[y * w + x]) pts.push([x, y]);
    if (!pts.length) return [];
    const deg = new Map(pts.map(([x, y]) => [y * w + x, nbs(x, y).length]));
    const starts = [...pts.filter(([x, y]) => deg.get(y * w + x) === 1), ...pts.filter(([x, y]) => deg.get(y * w + x) > 2), ...pts];
    const id = ([x, y]) => y * w + x;
    // the edge key only needs to be canonical: (a, b) and (b, a) map to one number
    const ek = (a, b) => { const i = id(a); const j = id(b); return i < j ? i * w * h + j : j * w * h + i; };
    const visited = new Set(); const strokes = [];
    for (const s of starts) {
      for (const nb of nbs(...s)) {
        const e = ek(s, nb); if (visited.has(e)) continue;
        const path = [s]; let prev = s; let cur = nb; visited.add(e);
        for (;;) {
          path.push(cur);
          const fresh = nbs(...cur).filter((p) => !visited.has(ek(cur, p)) && !(p[0] === prev[0] && p[1] === prev[1]));
          if (!fresh.length) break;
          const vx = cur[0] - prev[0]; const vy = cur[1] - prev[1]; const vl = Math.hypot(vx, vy);
          let best = null; let bs = -Infinity;
          for (const p of fresh) {
            const s2 = (vx * (p[0] - cur[0]) + vy * (p[1] - cur[1])) / (vl * Math.hypot(p[0] - cur[0], p[1] - cur[1]) || 1);
            if (s2 > bs) { bs = s2; best = p; }
          }
          visited.add(ek(cur, best)); prev = cur; cur = best;
        }
        if (path.length >= minPoints) strokes.push(path);
      }
    }
    return strokes;
  }
  const cumLen = (p) => { const c = [0]; for (let i = 1; i < p.length; i++) c.push(c[i - 1] + Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1])); return c; };
  function resample(points, spacing) {
    if (points.length < 2) return points.slice();
    const cum = cumLen(points); const total = cum[cum.length - 1];
    if (total < spacing) return [points[0], points[points.length - 1]];
    const n = Math.max(2, pyRound(total / spacing)); const out = [];
    for (let i = 0; i <= n; i++) {
      const target = total * i / n; let lo = 0; let hi = cum.length - 1;
      while (lo < hi) { const mid = (lo + hi) >> 1; if (cum[mid] < target) lo = mid + 1; else hi = mid; }
      if (lo === 0) { out.push(points[0]); continue; }
      const segLen = cum[lo] - cum[lo - 1]; const t = segLen > 0 ? (target - cum[lo - 1]) / segLen : 0;
      const a = points[lo - 1]; const b = points[lo];
      out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
    }
    return out;
  }
  function chaikin(p) {
    if (p.length < 3) return p;
    const out = [p[0]];
    for (let i = 0; i + 1 < p.length; i++) {
      const a = p[i]; const b = p[i + 1];
      out.push([a[0] * 0.75 + b[0] * 0.25, a[1] * 0.75 + b[1] * 0.25], [a[0] * 0.25 + b[0] * 0.75, a[1] * 0.25 + b[1] * 0.75]);
    }
    out.push(p[p.length - 1]);
    return out;
  }
  function orderStrokes(strokes) {
    const keyed = strokes.map((s, i) => {
      const xs = s.map((p) => p[0]); const ys = s.map((p) => p[1]); const len = cumLen(s);
      return { s, k: [fdiv(Math.min(...ys), 12), Math.min(...xs), Math.min(...ys), -len[len.length - 1]], i };
    });
    keyed.sort((a, b) => a.k[0] - b.k[0] || a.k[1] - b.k[1] || a.k[2] - b.k[2] || a.k[3] - b.k[3] || a.i - b.i);
    return keyed.map((x) => x.s);
  }

  // ── the procedural pen tip (used for bareTip, and when the hand image is missing) ──
  function proceduralTip(targetH) {
    const w = Math.max(1, Math.trunc(targetH * 0.34)); const h = targetH;
    const rgb = new Float32Array(w * h * 3); const shadow = new Uint8Array(w * h); const body = new Uint8Array(w * h);
    const rect = (buf, x0, y0, x1, y1, v) => { for (let y = Math.max(0, y0); y <= Math.min(h - 1, y1); y++) for (let x = Math.max(0, x0); x <= Math.min(w - 1, x1); x++) buf[y * w + x] = v; };
    rect(shadow, 3, Math.trunc(h * 0.06), w - 2, Math.trunc(h * 0.62), 90);
    const sh = gaussBlur8(shadow, w, h, 15, reflect101);
    for (let y = 0; y < h; y++) {
      const shade = Math.trunc(220 - 130 * (y / Math.max(1, h - 1)));
      for (let x = 0; x < w; x++) { const o = (y * w + x) * 3; rgb[o] = Math.min(255, shade + 10); rgb[o + 1] = shade; rgb[o + 2] = shade; } // RGB of BGR (s, s, s+10)
    }
    const x0 = 4; const y0 = Math.trunc(h * 0.04); const x1 = w - 4; const y1 = Math.trunc(h * 0.58);
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if (y === y0 || y === y1 || x === x0 || x === x1) { const o = (y * w + x) * 3; rgb[o] = rgb[o + 1] = rgb[o + 2] = 0; }
    const cy = Math.trunc(h * 0.70); const cx = fdiv(w, 2); const rad = Math.max(3, fdiv(w, 4));
    for (let y = cy - rad; y <= cy + rad; y++) for (let x = cx - rad; x <= cx + rad; x++) {
      if (x < 0 || y < 0 || x >= w || y >= h || (x - cx) ** 2 + (y - cy) ** 2 > rad * rad) continue;
      const o = (y * w + x) * 3; rgb[o] = 230; rgb[o + 1] = 90; rgb[o + 2] = 70; body[y * w + x] = 255;
    }
    rect(body, 3, Math.trunc(h * 0.04), w - 3, cy, 255);
    const bm = gaussBlur8(body, w, h, 7, reflect101);
    const mask = new Float32Array(w * h);
    for (let i = 0; i < w * h; i++) { mask[i] = Math.max(sh[i], bm[i]) / 255; if (mask[i] <= 0) rgb[i * 3] = rgb[i * 3 + 1] = rgb[i * 3 + 2] = 0; }
    return { w, h, rgb, mask, ax: 0.5, ay: 0.70 };
  }
  // a hand image (RGBA bytes, any size) → cropped to its alpha, scaled to targetH
  function handSprite(rgba, sw, sh, targetH, anchorX, anchorY, scaleImage) {
    let x0 = Infinity; let y0 = Infinity; let x1 = -1; let y1 = -1;
    const hasAlpha = (() => { for (let i = 3; i < rgba.length; i += 4) if (rgba[i] < 255) return true; return false; })();
    const m = (i) => (hasAlpha ? rgba[i * 4 + 3] : ((rgba[i * 4] * 4899 + rgba[i * 4 + 1] * 9617 + rgba[i * 4 + 2] * 1868 + 8192) >> 14) > 250 ? 0 : 255);
    for (let y = 0; y < sh; y++) for (let x = 0; x < sw; x++) if (m(y * sw + x) > 0) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
    if (x1 <= x0 || y1 <= y0) return null;
    const cw = x1 - x0 + 1; const ch = y1 - y0 + 1;
    const w = Math.max(1, pyRound(cw * (targetH / ch)));
    const scaled = scaleImage(x0, y0, cw, ch, w, targetH); // RGBA bytes w×targetH
    const rgb = new Float32Array(w * targetH * 3); const mask = new Float32Array(w * targetH);
    for (let i = 0; i < w * targetH; i++) {
      mask[i] = hasAlpha ? scaled[i * 4 + 3] / 255 : (((scaled[i * 4] * 4899 + scaled[i * 4 + 1] * 9617 + scaled[i * 4 + 2] * 1868 + 8192) >> 14) > 250 ? 0 : 1);
      if (mask[i] > 0) { rgb[i * 3] = scaled[i * 4]; rgb[i * 3 + 1] = scaled[i * 4 + 1]; rgb[i * 3 + 2] = scaled[i * 4 + 2]; }
    }
    return { w, h: targetH, rgb, mask, ax: anchorX, ay: anchorY };
  }
  function stampTip(px, W, H, tip, x, y) { // px: RGBA bytes of the drawing; the tip anchor lands on (x, y)
    const tx = pyRound((tip.w - 1) * Math.min(1, Math.max(0, tip.ax))); const ty = pyRound((tip.h - 1) * Math.min(1, Math.max(0, tip.ay)));
    const ax = x - tx; const ay = y - ty;
    for (let yy = Math.max(0, ay); yy < Math.min(H, ay + tip.h); yy++) {
      for (let xx = Math.max(0, ax); xx < Math.min(W, ax + tip.w); xx++) {
        const s = (yy - ay) * tip.w + (xx - ax); const m = tip.mask[s]; if (m <= 0) continue;
        const o = (yy * W + xx) * 4; const inv = 1 - m;
        px[o] = px[o] * inv + tip.rgb[s * 3] * m; px[o + 1] = px[o + 1] * inv + tip.rgb[s * 3 + 1] * m; px[o + 2] = px[o + 2] * inv + tip.rgb[s * 3 + 2] * m;
      }
    }
  }

  // ── timing ──
  const progressIdx = (n, frames) => (n === 0 || frames <= 0 ? [] : frames === 1 ? [n - 1] : Array.from({ length: frames }, (_, f) => pyRound(f * (n - 1) / (frames - 1))));
  function pauseFrames(o, frames, nCells) {
    if (o.pause === 'off' || frames < 8 || nCells <= 0) return new Set();
    let ratio;
    if (o.pause === 'light') ratio = o.pauseRatioLight;
    else if (o.pause === 'heavy') ratio = o.pauseRatioHeavy;
    else { const fpc = frames / nCells; if (fpc >= o.pauseHeavyFpc) ratio = o.pauseRatioHeavy; else if (fpc >= o.pauseLightFpc) ratio = o.pauseRatioLight; else return new Set(); }
    const count = Math.min(Math.max(0, Math.trunc(pyRound(frames * ratio))), Math.max(0, frames - 2));
    const s = new Set();
    for (let i = 0; i < count; i++) s.add(Math.max(1, Math.min(frames - 2, pyRound((i + 1) * frames / (count + 1)))));
    return s;
  }

  /** Options for one scene: defaults ← whiteboard.json "engine" ← the annotation's "engine". The sizes (gridEdge,
   * brushRadius, inkRevealRadius, sampleStep, targetHandHeight) are given at a long edge of 1080 and scaled with it. */
  function options(...layers) {
    const o = { ...DEFAULTS };
    for (const l of layers) if (l) Object.assign(o, l);
    return o;
  }

  /**
   * Prepare a scene. img: { w, h, data (RGBA bytes) }; ann: the annotation; opts: options(); longEdge: the video's
   * long edge (capLongEdge's default); hand: a sprite from handSprite() or null. Returns the scene with its timing;
   * the heavy per-pixel part is built by build(scene) (kept apart so a page can hold a few scenes at a time).
   */
  function plan(img, ann, opts, longEdge, totalMs) {
    const cap = opts.capLongEdge || longEdge;
    const k = cap / 1080; const o = { ...opts };
    for (const s of SCALED) o[s] = Math.max(1, pyRound(opts[s] * k));
    o.handHeight = Math.max(8, pyRound(opts.targetHandHeight * k));
    const scale = cap / Math.max(img.w, img.h); const align = o.gridEdge % 2 === 0 ? o.gridEdge : o.gridEdge * 2;
    const W = Math.max(align, fdiv(pyRound(img.w * scale), align) * align); const H = Math.max(align, fdiv(pyRound(img.h * scale), align) * align);
    const sx = W / ann.canvas.width; const sy = H / ann.canvas.height;
    const rect = (r) => {
      const c = (v, n) => Math.max(0, Math.min(n, v));
      return [c(Math.trunc(pyRound(r.x * sx)), W), c(Math.trunc(pyRound(r.y * sy)), H), c(Math.trunc(pyRound((r.x + r.width) * sx)), W), c(Math.trunc(pyRound((r.y + r.height) * sy)), H)];
    };
    const els = (ann.elements || []).map((e, i) => ({ e, i })).sort((a, b) => a.e.reveal.startMs - b.e.reveal.startMs || a.i - b.i).map((x) => x.e);
    const regions = els.map((e, idx) => {
      const cut = [...els.slice(idx + 1).map((l) => rect(l.region)), ...((e.reveal && e.reveal.protectedRegions) || []).map(rect)];
      return { e, box: rect(e.region), cut };
    });
    // the original's frame writer, step by step: static frames until each region starts, its ink frames, its colour
    // frames, then the hold (the full image) until the scene's end and at least 0.5 s
    const fps = o.fps; const mspf = 1000 / fps; let frame = 0; let cur = 0;
    const fill = (until) => { const n = pyRound((until - cur) / mspf); if (n <= 0) return; frame += n; cur += n * mspf; };
    for (const r of regions) {
      const { startMs, durationMs } = r.e.reveal;
      fill(startMs);
      r.inkFrames = Math.max(1, pyRound(durationMs * 2 / 3 * fps / 1000));
      r.colorFrames = Math.max(1, pyRound(durationMs * 1 / 3 * fps / 1000));
      r.inkStart = frame; frame += r.inkFrames; cur += r.inkFrames * mspf;
      r.colorStart = frame;
      // contour-wipe writes no frame for a region that later regions cover completely (the original returns early)
      const empty = o.colorFill === 'contour-wipe' && allowedEmpty(r, W, H);
      r.colorWritten = empty ? 0 : r.colorFrames;
      frame += r.colorWritten; cur += r.colorFrames * mspf;
    }
    const holdStart = frame;
    fill(Math.max(totalMs ?? ann.sceneDurationMs ?? 0, cur + 500));
    return { ann, opts: o, img, W, H, regions, holdStart, frames: frame, built: null };
  }
  function allowedEmpty(r, W, H) {
    const [x0, y0, x1, y1] = r.box; if (x1 <= x0 || y1 <= y0) return true;
    const m = new Uint8Array((x1 - x0) * (y1 - y0)).fill(1);
    for (const [a, b, c, d] of r.cut) for (let y = Math.max(y0, b); y < Math.min(y1, d); y++) for (let x = Math.max(x0, a); x < Math.min(x1, c); x++) m[(y - y0) * (x1 - x0) + x - x0] = 0;
    return !m.some((v) => v);
  }

  function build(sc) {
    if (sc.built) return sc.built;
    const { W, H, opts: o, regions } = sc; const N = W * H;
    const color = resizeRgb(sc.img.data, sc.img.w, sc.img.h, W, H);
    const gray = new Uint8Array(N);
    for (let i = 0; i < N; i++) gray[i] = (color[i * 3] * 4899 + color[i * 3 + 1] * 9617 + color[i * 3 + 2] * 1868 + 8192) >> 14;
    const mean = gaussBlur8(gray, W, H, 15, replicate);
    const ink = new Uint8Array(N); // the adaptive threshold's black pixels (THRESH_BINARY, C = 10)
    for (let i = 0; i < N; i++) ink[i] = gray[i] - mean[i] <= -10 ? 1 : 0;
    const paper = hexRgb(o.paper);
    if (o.matchBg) { // the paper colour replaces the image's own background (corner median, threshold 28)
      const m = Math.max(3, fdiv(Math.min(W, H), 50)); const ch = [[], [], []];
      for (const [ox, oy] of [[0, 0], [W - m, 0], [0, H - m], [W - m, H - m]]) for (let y = oy; y < oy + m; y++) for (let x = ox; x < ox + m; x++) for (let c = 0; c < 3; c++) ch[c].push(color[(y * W + x) * 3 + c]);
      const bg = ch.map((v) => { v.sort((a, b) => a - b); const n = v.length; return Math.trunc(n % 2 ? v[(n - 1) / 2] : (v[n / 2 - 1] + v[n / 2]) / 2); });
      for (let i = 0; i < N; i++) {
        const o3 = i * 3;
        if (Math.abs(color[o3] - bg[0]) + Math.abs(color[o3 + 1] - bg[1]) + Math.abs(color[o3 + 2] - bg[2]) < o.matchBgThreshold) { color[o3] = paper[0]; color[o3 + 1] = paper[1]; color[o3 + 2] = paper[2]; }
      }
    }
    const E = o.gridEdge; const rows = H / E; const cols = W / E;
    const activeAll = new Uint8Array(rows * cols);
    for (let i = 0; i < N; i++) if (ink[i]) activeAll[fdiv(fdiv(i, W), E) * cols + fdiv(i % W, E)] = 1;
    const inkF = new Int32Array(N).fill(INF); const colF = new Int32Array(N).fill(INF); const owner = new Int16Array(N).fill(-1);
    const R = o.inkRevealRadius + 1; // the anti-aliased thick line touches pixels up to about half its width + 1
    const out = { color, paper, inkF, colF, owner, tips: [], brush: [] };
    regions.forEach((r, ri) => {
      // the allowed mask, as a crop: its box minus later boxes and protectedRegions
      const [bx0, by0, bx1, by1] = r.box; const bw = Math.max(0, bx1 - bx0); const bh = Math.max(0, by1 - by0);
      const allow = new Uint8Array(bw * bh).fill(1);
      for (const [a, b, c, d] of r.cut) for (let y = Math.max(by0, b); y < Math.min(by1, d); y++) for (let x = Math.max(bx0, a); x < Math.min(bx1, c); x++) allow[(y - by0) * bw + x - bx0] = 0;
      const allowed = (x, y) => x >= bx0 && y >= by0 && x < bx1 && y < by1 && allow[(y - by0) * bw + x - bx0] === 1;
      for (let y = by0; y < by1; y++) for (let x = bx0; x < bx1; x++) if (allow[(y - by0) * bw + x - bx0]) owner[y * W + x] = ri;
      const center = (cell) => [cell[1] * E + fdiv(E, 2), cell[0] * E + fdiv(E, 2)];
      const regionGrid = () => {
        const act = new Uint8Array(rows * cols);
        for (let y = by0; y < by1; y++) for (let x = bx0; x < bx1; x++) if (allow[(y - by0) * bw + x - bx0]) { const c = fdiv(y, E) * cols + fdiv(x, E); if (activeAll[c]) act[c] = 1; }
        return gridPath(act, rows, cols);
      };
      const gridPlan = (path) => {
        const samples = []; const lifts = new Set(); const cellOf = [];
        path.forEach((cell, idx) => {
          const [cx, cy] = center(cell);
          if (idx === 0) { samples.push([cx, cy]); cellOf.push(idx); return; }
          const pc = path[idx - 1]; const [px, py] = center(pc);
          if (Math.hypot(cell[0] - pc[0], cell[1] - pc[1]) > Math.SQRT2) { lifts.add(samples.length); samples.push([cx, cy]); cellOf.push(idx); return; }
          const steps = Math.max(1, Math.trunc(Math.hypot(cx - px, cy - py) / o.sampleStep));
          for (let s = 1; s <= steps; s++) { samples.push([Math.trunc(px + (cx - px) * s / steps), Math.trunc(py + (cy - py) * s / steps)]); cellOf.push(idx); }
        });
        return { samples, lifts, cellOf };
      };
      const reveal = (a, b, f) => { // the pen's segment a→b uncovers the ink it touches, inside the allowed mask
        const minX = Math.max(0, Math.min(a[0], b[0]) - R); const maxX = Math.min(W - 1, Math.max(a[0], b[0]) + R);
        const minY = Math.max(0, Math.min(a[1], b[1]) - R); const maxY = Math.min(H - 1, Math.max(a[1], b[1]) + R);
        const dx = b[0] - a[0]; const dy = b[1] - a[1]; const l2 = dx * dx + dy * dy;
        for (let y = minY; y <= maxY; y++) for (let x = minX; x <= maxX; x++) {
          const i = y * W + x; if (!ink[i] || inkF[i] !== INF || !allowed(x, y)) continue;
          const t = l2 ? Math.max(0, Math.min(1, ((x - a[0]) * dx + (y - a[1]) * dy) / l2)) : 0;
          if ((x - a[0] - t * dx) ** 2 + (y - a[1] - t * dy) ** 2 <= R * R) inkF[i] = f;
        }
      };
      const stampCell = (cell, f) => {
        for (let y = cell[0] * E; y < cell[0] * E + E; y++) for (let x = cell[1] * E; x < cell[1] * E + E; x++) {
          const i = y * W + x; if (ink[i] && inkF[i] === INF && allowed(x, y)) inkF[i] = f;
        }
      };
      // ink: the pen path, its samples and lifts; grid fills whole cells as the pen reaches them
      let samples = []; let lifts = new Set(); let cellOf = null; let path = []; let centers = []; let nUnits = 0;
      if (o.inkPath === 'skeleton') {
        const sk = []; const cw = bw; const chh = bh; const m = new Uint8Array(cw * chh);
        for (let y = 0; y < chh; y++) for (let x = 0; x < cw; x++) if (allow[y * cw + x] && ink[(y + by0) * W + x + bx0]) m[y * cw + x] = 1;
        const skel = zhangSuen(m, cw, chh);
        for (const stroke of traceSkeleton(skel, cw, chh, o.skeletonMinPoints)) {
          let p = stroke.map(([x, y]) => [x + bx0, y + by0]);
          p = resample(chaikin(resample(p, o.skeletonSpacing)), o.skeletonSpacing);
          const cl = cumLen(p);
          if (p.length >= 2 && cl[cl.length - 1] > 2) sk.push(p.map(([x, y]) => [pyRound(x), pyRound(y)]));
        }
        const strokes = orderStrokes(sk);
        if (strokes.length) {
          strokes.forEach((s, i) => { if (i > 0) lifts.add(samples.length); samples.push(...s); });
          centers = samples; nUnits = strokes.length;
        } else { // no stroke: the grid path, without whole-cell fills
          path = regionGrid(); ({ samples, lifts } = path.length ? gridPlan(path) : { samples: [], lifts: new Set() });
          centers = path.map(center); nUnits = path.length;
        }
      } else {
        path = regionGrid();
        if (path.length) ({ samples, lifts, cellOf } = gridPlan(path));
        centers = path.map(center); nUnits = path.length;
      }
      const idx = progressIdx(samples.length, r.inkFrames); const pauses = pauseFrames(o, r.inkFrames, nUnits);
      const tips = [];
      let last = null; let cellsDone = 0;
      for (let j = 0; j < r.inkFrames; j++) {
        const f = r.inkStart + j;
        if (!samples.length) { tips.push([fdiv(W, 2), fdiv(H, 2)]); continue; }
        if (pauses.has(j) && last !== null) { tips.push(samples[last]); continue; }
        const si = idx[j];
        if (last === null) reveal(samples[si], samples[si], f);
        else for (let s = last + 1; s <= si; s++) if (!lifts.has(s)) reveal(samples[s - 1], samples[s], f);
        if (cellOf) while (cellsDone <= cellOf[si] && cellsDone < path.length) stampCell(path[cellsDone++], f);
        tips.push(samples[si]); last = si;
      }
      if (cellOf) while (cellsDone < path.length) stampCell(path[cellsDone++], r.colorStart);
      // colour
      if (o.colorFill === 'contour-wipe') contour(sc, r, ri, { allow, bx0, by0, bw, bh, ink, colF, tips, W });
      else {
        const disk = feathered(o.brushRadius); const cidx = progressIdx(centers.length, r.colorFrames);
        out.brush[ri] = { centers, cidx, disk, prod: null, box: [bx0, by0, bw, bh], allow };
        for (let j = 0; j < r.colorFrames; j++) tips.push(centers.length ? centers[cidx[j]] : [fdiv(W, 2), fdiv(H, 2)]);
      }
      r.tips = tips;
    });
    for (const [ri, b] of out.brush.entries()) if (b) b.prod = brushProduct(b, b.centers.length - 1, W);
    sc.built = out;
    return out;
  }
  function feathered(radius) {
    const n = 2 * radius + 1; const d = new Float32Array(n * n);
    for (let y = -radius; y <= radius; y++) for (let x = -radius; x <= radius; x++) {
      const dist = f32(Math.sqrt(x * x + y * y));
      d[(y + radius) * n + x + radius] = Math.min(1, Math.max(0, 1 - (dist - radius * 0.75) / (radius * 0.25)));
    }
    return d;
  }
  // Π(1 − m) over the brush stamps 0..upto inside the region's crop: the paper/ink weight left after them
  function brushProduct(b, upto, W) {
    const [bx0, by0, bw, bh] = b.box; const prod = new Float32Array(bw * bh).fill(1); const R = (Math.sqrt(b.disk.length) - 1) / 2; const n = 2 * R + 1;
    for (let k = 0; k <= upto && k < b.centers.length; k++) {
      const [px, py] = b.centers[k];
      for (let y = Math.max(by0, py - R); y < Math.min(by0 + bh, py + R + 1); y++) for (let x = Math.max(bx0, px - R); x < Math.min(bx0 + bw, px + R + 1); x++) {
        const c = (y - by0) * bw + x - bx0; if (!b.allow[c]) continue;
        prod[c] *= 1 - b.disk[(y - py + R) * n + x - px + R];
      }
    }
    return prod;
  }
  function contour(sc, r, ri, { allow, bx0, by0, bw, bh, ink, colF, tips, W }) {
    const o = sc.opts; const frames = r.colorWritten;
    if (!frames) return;
    let top = Infinity; let bottom = -1; let left = Infinity; let right = -1;
    for (let y = 0; y < bh; y++) for (let x = 0; x < bw; x++) if (allow[y * bw + x]) { if (y < top) top = y; if (y > bottom) bottom = y; if (x < left) left = x; if (x > right) right = x; }
    const rh = bottom - top + 1; const rw = right - left + 1;
    const at = (x, y) => (y + top) * bw + x + left; // crop of the allowed box → index in allow
    // the resistance field: the region's ink dilated, blurred, normalised, then carried down row by row
    let spread = Math.min(17, Math.max(3, fdiv(Math.min(rw, rh), 32))); if (spread % 2 === 0) spread = Math.max(3, spread - 1);
    const ker = ellipseKernel(spread); const kr = fdiv(spread, 2);
    const inkU8 = new Uint8Array(rw * rh);
    for (let y = 0; y < rh; y++) for (let x = 0; x < rw; x++) if (allow[at(x, y)] && ink[(y + top + by0) * W + x + left + bx0]) inkU8[y * rw + x] = 255;
    const dil = new Uint8Array(rw * rh);
    for (let y = 0; y < rh; y++) for (let x = 0; x < rw; x++) {
      if (!inkU8[y * rw + x]) continue;
      for (let i = 0; i < spread; i++) {
        const yy = y - (i - kr); if (yy < 0 || yy >= rh) continue; // dilation: the kernel reflected over the anchor
        const [j1, j2] = ker[i];
        for (let j = j1; j < j2; j++) { const xx = x - (j - kr); if (xx >= 0 && xx < rw) dil[yy * rw + xx] = 255; }
      }
    }
    let blur = Math.max(1, pyRound(Math.min(rw, rh) / 220)); if (blur % 2 === 0) blur += 1;
    const res8 = gaussBlur8(dil, rw, rh, blur, reflect101);
    let peak = 0; for (const v of res8) if (v > peak) peak = v;
    const res = new Float32Array(rw * rh);
    if (peak > 1e-6) for (let i = 0; i < res.length; i++) res[i] = f32(res8[i] / peak);
    for (let y = 1; y < rh; y++) for (let x = 0; x < rw; x++) { const v = f32(res[(y - 1) * rw + x] * o.wipeDecay); if (v > res[y * rw + x]) res[y * rw + x] = v; }
    const p1 = Math.max(24, rw / 20); const p2 = Math.max(8, rw / 72);
    const wave = new Float32Array(rw);
    for (let x = 0; x < rw; x++) wave[x] = f32(f32(Math.sin(f32(x / p1))) + f32(0.35 * f32(Math.sin(f32(f32(x / p2) + 1.7)))));
    const delay = Math.trunc(Math.min(52, Math.max(12, rh * o.wipeDelayRatio)));
    const sweep = rh + 2 * delay; const blocks = Math.max(1, o.wipeBlocks);
    const lead = Array.from({ length: frames }, (_, fi) => ease(frames === 1 ? 1 : fi / (frames - 1)) * sweep - delay);
    const end = r.colorStart + frames; // the final fill: every allowed pixel shows from the frame after the wipe
    for (let y = 0; y < rh; y++) for (let x = 0; x < rw; x++) {
      if (!allow[at(x, y)]) continue;
      let lo = 0; let hi = frames;
      while (lo < hi) { const mid = (lo + hi) >> 1; if (lead[mid] + wave[x] - f32(res[y * rw + x] * delay) >= y) hi = mid; else lo = mid + 1; }
      colF[(y + top + by0) * W + x + left + bx0] = lo < frames ? r.colorStart + lo : end;
    }
    // the hand sweeps across in blocks of frames; it rests on the lowest revealed pixel of its column
    for (let fi = 0; fi < frames; fi++) {
      const lane = ease(((fi / blocks) * 2.0) % 1.0); const fwd = Math.trunc(fi / blocks) % 2 === 0;
      const cx = Math.max(0, Math.min(rw - 1, Math.trunc(fwd ? lane * rw : (1 - lane) * rw)));
      let cy = 0;
      for (let y = rh - 1; y >= 0; y--) if (allow[at(cx, y)] && y <= lead[fi] + wave[cx] - f32(res[y * rw + cx] * delay)) { cy = y; break; }
      tips.push([left + bx0 + cx, top + by0 + cy]);
    }
  }

  /** Draw frame f (0-based, inside the scene) into px (RGBA bytes, W×H). Returns the tip position drawn, or null. */
  function draw(sc, f, px, tipSprite) {
    const b = build(sc); const { W, H } = sc; const N = W * H; const { color, paper, inkF, colF, owner } = b;
    if (f >= sc.holdStart) {
      for (let i = 0; i < N; i++) { px[i * 4] = color[i * 3]; px[i * 4 + 1] = color[i * 3 + 1]; px[i * 4 + 2] = color[i * 3 + 2]; px[i * 4 + 3] = 255; }
      return null;
    }
    // the region whose frames hold f (if any) and, for the brush, its stamps so far
    let active = -1; let partial = null;
    sc.regions.forEach((r, ri) => { if (f >= r.inkStart && f < r.colorStart + r.colorWritten) active = ri; });
    const brushOn = sc.opts.colorFill === 'brush';
    if (brushOn && active >= 0 && f >= sc.regions[active].colorStart && b.brush[active]) {
      const br = b.brush[active]; const j = f - sc.regions[active].colorStart;
      partial = { ri: active, prod: br.centers.length ? brushProduct(br, br.cidx[j], W) : null };
    }
    for (let i = 0; i < N; i++) {
      let r = paper[0]; let g = paper[1]; let bl = paper[2];
      if (inkF[i] <= f) { r = 0; g = 0; bl = 0; }
      const ri = owner[i];
      if (ri >= 0) {
        if (brushOn) {
          const reg = sc.regions[ri]; const br = b.brush[ri];
          let prod = null;
          if (partial && partial.ri === ri) prod = partial.prod;
          else if (f >= reg.colorStart + reg.colorFrames) prod = br && br.prod;
          if (prod) {
            const [bx0, by0, bw] = br.box; const x = i % W; const y = (i - x) / W; const p = prod[(y - by0) * bw + x - bx0];
            r = Math.trunc(r * p + color[i * 3] * (1 - p)); g = Math.trunc(g * p + color[i * 3 + 1] * (1 - p)); bl = Math.trunc(bl * p + color[i * 3 + 2] * (1 - p));
          }
        } else if (colF[i] <= f) { r = color[i * 3]; g = color[i * 3 + 1]; bl = color[i * 3 + 2]; }
      }
      px[i * 4] = r; px[i * 4 + 1] = g; px[i * 4 + 2] = bl; px[i * 4 + 3] = 255;
    }
    if (active < 0) return null;
    const reg = sc.regions[active]; const tip = reg.tips[f - reg.inkStart];
    if (tip && tipSprite) stampTip(px, W, H, tipSprite, tip[0], tip[1]);
    return tip || null;
  }

  window.Whiteboard = { DEFAULTS, options, plan, build, draw, proceduralTip, handSprite, pyRound, internals: { resizeRgb, gaussBlur8, gridPath, zhangSuen, traceSkeleton, pauseFrames, progressIdx, ellipseKernel, areaTab } };
})();
