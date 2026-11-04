// Trang dựng hình của engine quay màn hình. Hợp đồng: window.DEMO (plan.json), window.__ready, window.renderAt(t) -> Promise.
// Mọi chuyển động là hàm thuần của t (dựng lại cùng t ra cùng khung).
(() => {
  const D = window.DEMO;
  const CW = 1000, CH = 808, CHROME = 52;
  const $ = (id) => document.getElementById(id);
  const NS = 'http://www.w3.org/2000/svg';
  const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  const ease = (p) => (p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
  const outCubic = (p) => 1 - Math.pow(1 - p, 3);
  const outBack = (p) => { const c = 1.6; return 1 + (c + 1) * Math.pow(p - 1, 3) + c * Math.pow(p - 1, 2); };
  const ramp = (t, a, b) => clamp((t - a) / Math.max(b - a, 1e-6));
  const lerp = (a, b, p) => a + (b - a) * p;
  const hash = (n) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

  const content = $('content'), over = $('over'), card = $('card');
  const N = D.shots.length;
  const screenIdx = D.shots.map((s, i) => i).filter((i) => D.shots[i].kind !== 'card');

  // ---------- hiệu ứng nổi bật "khung sáng" (toạ độ màn hình, không nhoè theo phóng camera)
  const FX = new Set(['frame', 'pulse', 'sweep', 'lift']);
  const mk = (tag, attrs, parent) => {
    const el = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
    if (parent) parent.appendChild(el);
    return el;
  };
  const defs = mk('defs', {}, over);
  defs.innerHTML = `
    <filter id="kglow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="7"/></filter>
    <filter id="klift" x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="0" dy="22" stdDeviation="18" flood-color="#000" flood-opacity=".6"/></filter>`;
  const fxRoot = mk('g', {});
  const ringRect = (parent, attrs) => mk('rect', { fill: 'none', pathLength: 1, 'stroke-linejoin': 'round', ...attrs }, parent);
  function buildFx(s, m, i) {
    const g = mk('g', {}, s.fx);
    const e = { g };
    if (m.kind === 'lift') {
      const clip = mk('clipPath', { id: `kc-${s.id}-${i}`, clipPathUnits: 'userSpaceOnUse' }, defs);
      e.clipRect = mk('rect', { rx: 12 }, clip);
      const shadow = mk('g', { filter: 'url(#klift)' }, g);
      e.lift = mk('g', {}, shadow);
      const clipped = mk('g', { 'clip-path': `url(#kc-${s.id}-${i})` }, e.lift);
      e.img = mk('image', { preserveAspectRatio: 'none' }, clipped);
      const st = (s.states || [])[m.state || 0];
      if (st) { e.img.setAttribute('href', st.src); e.img.setAttribute('width', st.w); e.img.setAttribute('height', st.h); }
      e.parent = e.lift;
    }
    const host = e.parent || g;
    if (m.kind === 'sweep') {
      e.bar = mk('rect', { fill: 'rgba(224,75,67,.34)', rx: 6, style: 'mix-blend-mode:multiply' }, host);
      e.edge = mk('rect', { fill: '#ff5a3c', rx: 3 }, host);
      return e;
    }
    if (m.kind === 'pulse') e.rings = [0, 1].map(() => ringRect(host, { stroke: '#ff5a3c' }));
    e.wash = mk('rect', { fill: 'rgba(255,240,222,.22)' }, host);
    e.glow = ringRect(host, { stroke: '#ff4b2e', 'stroke-width': 11, filter: 'url(#kglow)' });
    e.core = ringRect(host, { stroke: '#fff4e6', 'stroke-width': 3.2 });
    e.comet = ringRect(host, { stroke: '#ffffff', 'stroke-width': 5, 'stroke-linecap': 'round', 'stroke-dasharray': '.07 .93' });
    return e;
  }
  const setR = (el, x, y, w, h, rx) => { el.setAttribute('x', x); el.setAttribute('y', y); el.setAttribute('width', Math.max(0, w)); el.setAttribute('height', Math.max(0, h)); if (rx !== undefined) el.setAttribute('rx', rx); };

  // Vẽ một hiệu ứng tại t. r = vùng trên màn hình (toạ độ #over). cam = {sc,tx,ty} để nhấc đúng ảnh trang.
  function drawFx(e, m, t, r, cam) {
    const on = t >= m.t0 && t < m.t1;
    e.g.style.display = on ? '' : 'none';
    if (!on) return false;
    const fade = 1 - ramp(t, m.t1 - .25, m.t1);
    const age = t - m.t0;
    e.g.style.opacity = fade;
    if (m.kind === 'sweep') {
      const p = outCubic(ramp(t, m.t0, m.t0 + .55));
      setR(e.bar, r.x, r.y + 2, r.w * p, r.h - 4, 6);
      setR(e.edge, r.x + r.w * p - 3, r.y - 4, 6, r.h + 8, 3);
      e.edge.style.opacity = 1 - ramp(t, m.t0 + .5, m.t0 + .8);
      return true;
    }
    // khung sáng "chụp" vào vùng đích: nở rộng rồi siết lại, vẽ viền dần, tia sáng chạy vòng quanh
    const snap = outBack(ramp(t, m.t0, m.t0 + .42));
    const inf = (1 - snap) * 26;
    const x = r.x - inf, y = r.y - inf, w = r.w + 2 * inf, h = r.h + 2 * inf, rx = 14;
    const draw = outCubic(ramp(t, m.t0, m.t0 + .5));
    for (const el of [e.glow, e.core, e.comet]) setR(el, x, y, w, h, rx);
    setR(e.wash, x, y, w, h, rx);
    e.glow.style.strokeDasharray = '1 1'; e.glow.style.strokeDashoffset = 1 - draw;
    e.core.style.strokeDasharray = '1 1'; e.core.style.strokeDashoffset = 1 - draw;
    e.glow.style.opacity = .7 + .25 * Math.sin(age * 4.2);
    e.comet.style.strokeDashoffset = -((age * .42) % 1);
    e.comet.style.opacity = draw;
    e.wash.style.opacity = 1 - ramp(t, m.t0 + .1, m.t0 + .7);
    if (e.rings) e.rings.forEach((ring, j) => {
      const u = age / .95 - j * .5;
      if (u < 0) { ring.style.opacity = 0; return; }
      const q = u % 1, d = 4 + 36 * outCubic(q);
      setR(ring, r.x - d, r.y - d, r.w + 2 * d, r.h + 2 * d, rx + d * .5);
      ring.style.opacity = (1 - q) * .85; ring.setAttribute('stroke-width', 1 + 3 * (1 - q));
    });
    if (e.lift) {
      const k = 1 + .075 * outBack(ramp(t, m.t0, m.t0 + .45)) * (1 - ramp(t, m.t1 - .3, m.t1));
      const cx = r.x + r.w / 2, cy = r.y + r.h / 2;
      e.lift.setAttribute('transform', `translate(${cx},${cy}) scale(${k}) translate(${-cx},${-cy})`);
      setR(e.clipRect, r.x, r.y, r.w, r.h, 12);
      e.img.setAttribute('transform', `matrix(${cam.sc},0,0,${cam.sc},${cam.tx},${cam.ty})`);
    }
    return true;
  }

  // ---------- dựng sẵn phần tử cho từng cảnh
  const pending = [];
  const load = (img, src) => { img.src = src; pending.push(img.decode().catch(() => {})); return img; };
  for (const s of D.shots) {
    s.layers = [];
    if (s.kind === 'screen') {
      for (const st of s.states) {
        const img = load(document.createElement('img'), st.src);
        img.className = 'page'; img.style.width = st.w + 'px'; img.style.height = st.h + 'px'; img.style.opacity = 0;
        content.appendChild(img); s.layers.push(img);
      }
    } else if (s.kind === 'live' || s.kind === 'demo') {
      const img = document.createElement('img');
      img.className = 'frame'; img.style.opacity = 0; img._src = '';
      content.appendChild(img); s.layers.push(img);
    } else if (s.kind === 'terminal') {
      const term = document.createElement('div');
      term.className = 'term'; term.style.opacity = 0;
      term.innerHTML = '<div class="tin"></div>';
      content.appendChild(term); s.layers.push(term); s.tin = term.firstChild; s.tkey = '';
    }
    // nét bút: path theo toạ độ trang, nằm trong nhóm có phép biến đổi camera
    s.g = document.createElementNS(NS, 'g');
    over.appendChild(s.g);
    s.fx = mk('g', {}, fxRoot);
    s.markEls = (s.marks || []).map((m, i) => {
      if (FX.has(m.kind)) return buildFx(s, m, i);
      if (m.kind === 'highlight') {
        const r = document.createElementNS(NS, 'rect');
        r.setAttribute('fill', 'rgba(224,75,67,.30)'); r.setAttribute('rx', 4);
        s.g.appendChild(r); return r;
      }
      const p = document.createElementNS(NS, 'path');
      p.setAttribute('d', (D.marks_svg[s.id] || [])[i] || '');
      p.setAttribute('fill', 'none'); p.setAttribute('stroke', '#d23a30'); p.setAttribute('stroke-width', 5);
      p.setAttribute('stroke-linecap', 'round'); p.setAttribute('stroke-linejoin', 'round');
      p.setAttribute('vector-effect', 'non-scaling-stroke');
      s.g.appendChild(p); return p;
    });
  }
  // lớp tối "tô khối" (spotlight) theo toạ độ màn hình
  const spot = document.createElementNS(NS, 'path');
  spot.setAttribute('fill-rule', 'evenodd'); spot.setAttribute('fill', 'rgba(7,7,6,.58)');
  over.insertBefore(spot, over.firstChild);
  const spotRing = document.createElementNS(NS, 'rect');
  spotRing.setAttribute('fill', 'none'); spotRing.setAttribute('stroke', 'rgba(243,239,230,.9)'); spotRing.setAttribute('stroke-width', 2.5);
  over.insertBefore(spotRing, spot.nextSibling);

  // con trỏ ý định: mũi tên giấy viền mực + vòng gợn khi bấm + nhãn tiếng Việt
  const cur = document.createElement('div'); cur.id = 'cursor';
  cur.innerHTML = '<div id="ripple"></div><svg width="40" height="48" viewBox="0 0 40 48"><path d="M6 4 L6 38 L15 29.5 L21.5 44 L28 41 L21.6 27 L34 27 Z" fill="#f3efe6" stroke="#12100f" stroke-width="2.6" stroke-linejoin="round"/></svg><div id="label"></div>';
  card.appendChild(cur);
  const ripple = cur.querySelector('#ripple'), label = cur.querySelector('#label'), arrow = cur.querySelector('svg');
  over.appendChild(fxRoot);
  // thanh phím: hiện chữ đang gõ thật (cảnh live) hoặc phím Enter (cảnh terminal)
  const keys = document.createElement('div'); keys.id = 'keys';
  keys.innerHTML = '<svg class="kb" viewBox="0 0 24 16" width="34" height="23"><rect x="1" y="1" width="22" height="14" rx="3" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M5 5h1M9 5h1M13 5h1M17 5h2M5 8.5h1M9 8.5h1M13 8.5h1M17 8.5h2M7 12h10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg><span class="kt"></span><span class="kc"></span>';
  card.appendChild(keys);
  const keysText = keys.querySelector('.kt');
  function drawKeys(list, t, enters) {
    const ty = (list || []).find((x) => t >= x.t0 - .3 && t < x.t1 + 1.0);
    const en = (enters || []).find((x) => t >= x - .05 && t < x + .6);
    if (!ty && en === undefined) { keys.style.opacity = 0; return; }
    let txt, pop = 0;
    if (ty) {
      const n = Math.round(ty.text.length * ramp(t, ty.t0, ty.t1));
      txt = ty.text.slice(0, n);
      keys.style.opacity = Math.min(ramp(t, ty.t0 - .3, ty.t0 - .1), 1 - ramp(t, ty.t1 + .8, ty.t1 + 1.0));
      pop = n > 0 && n < ty.text.length ? .5 + .5 * Math.sin(t * 60) : 0;
    } else {
      txt = '↵ Enter';
      keys.style.opacity = 1 - ramp(t, en + .4, en + .6);
      pop = 1 - ramp(t, en, en + .25);
    }
    if (keysText.textContent !== txt) keysText.textContent = txt;
    keys.style.transform = `translateX(-50%) scale(${1 + .04 * pop})`;
    keys.classList.toggle('caret', Math.floor(t * 2.4) % 2 === 0);
  }

  // ---------- nội suy theo đoạn
  function camAt(s, t) {
    let v = { ...s.cam[0] };
    for (let i = 1; i < s.cam.length; i++) {
      const g = s.cam[i];
      if (t < g.t0) break;
      const p = g.t1 > g.t0 ? ease(ramp(t, g.t0, g.t1)) : 1;
      v = { cx: lerp(v.cx, g.cx, p), cy: lerp(v.cy, g.cy, p), z: Math.exp(lerp(Math.log(v.z), Math.log(g.z), p)), state: p >= .5 ? g.state : v.state, ts: p >= .5 ? g.t0 : v.ts };
    }
    return v;
  }
  function curAt(s, t) {
    let v = { x: s.cursor[0].x, y: s.cursor[0].y };
    for (let i = 1; i < s.cursor.length; i++) {
      const g = s.cursor[i];
      if (t < g.t0) break;
      const p = g.t1 > g.t0 ? ease(ramp(t, g.t0, g.t1)) : 1;
      const dx = g.x - v.x, dy = g.y - v.y, arc = Math.sin(Math.PI * p) * .14;
      v = { x: lerp(v.x, g.x, p) - dy * arc, y: lerp(v.y, g.y, p) + dx * arc };
    }
    return v;
  }
  const active = (list, t) => (list || []).filter((x) => t >= x.t0 && t < x.t1);

  // ---------- chữ: tiêu đề, phụ đề
  function titleHTML(title, accent) {
    const words = (title || '').split(' ').filter(Boolean).map((w) => `<span class="w">${w} </span>`);
    const acc = (accent || '').split(' ').filter(Boolean).map((w) => `<span class="w"><em>${w}</em> </span>`);
    return words.join('') + (acc.length ? '<br>' + acc.join('') : '');
  }
  function revealWords(root, t, t0, step = .055, dur = .5) {
    root.querySelectorAll('.w').forEach((el, i) => {
      const p = outCubic(ramp(t, t0 + i * step, t0 + i * step + dur));
      el.style.opacity = p; el.style.transform = `translateY(${(1 - p) * 34}px)`;
    });
  }
  let shownShot = -1;
  function setShotText(i) {
    if (shownShot === i) return;
    shownShot = i;
    const s = D.shots[i];
    if (s.kind === 'card') {
      $('hkicker').textContent = s.kicker; $('htitle').innerHTML = titleHTML(s.title, s.accent); $('hnote').textContent = s.note || '';
      const col = $('collage'); col.innerHTML = '';
      (s.collage || []).forEach((c, k) => { const d = document.createElement('div'); d.className = 'th'; d.innerHTML = `<img src="${c.src}">`; col.appendChild(d); });
      const it = $('items'); it.innerHTML = '';
      (s.items || []).forEach((x, k) => { const d = document.createElement('div'); d.className = 'it'; d.innerHTML = `<span>${String(k + 1).padStart(2, '0')}</span><b>${x.name}</b><i>${x.tag || ''}</i>`; it.appendChild(d); });
    } else {
      const n = screenIdx.indexOf(i);
      const total = D.shots.filter((x) => ['screen', 'live', 'terminal'].includes(x.kind)).length;
      const ticks = s.kicker && s.kind !== 'demo' ? `<span class="tick">${Array.from({ length: total }, (_, k) => `<i class="${k <= countScreens(i) ? 'on' : ''}"></i>`).join('')}</span>` : '';
      $('kicker').innerHTML = `<span>${s.kicker || ''}</span>${ticks}`;
      $('title').innerHTML = titleHTML(s.title, s.accent);
      $('note').textContent = s.note || '';
      const u = s.kind === 'terminal' ? `${(s.term && s.term.prompt) || '~/demo'} — bash` : (s.url || '').replace(/^https?:\/\//, '');
      const cut = u.indexOf('/');
      $('url').innerHTML = s.kind === 'demo' ? '' : (cut > 0 ? `${u.slice(0, cut)}<b>${u.slice(cut)}</b>` : u);
      $('chip').style.display = s.chip ? 'block' : 'none'; $('chip').textContent = s.chip || '';
    }
  }
  function countScreens(i) { let c = -1; for (let k = 0; k <= i; k++) if (['screen', 'live', 'terminal'].includes(D.shots[k].kind)) c++; return c; }

  let capKey = '';
  function renderCaption(t) {
    const c = D.captions.find((x) => t >= x.t0 && t < x.t1);
    const el = $('cap');
    if (!c) { el.innerHTML = ''; capKey = ''; return; }
    const key = c.t0 + '';
    if (key !== capKey) { el.innerHTML = `<div>${c.words.map((w) => `<span>${w.text}</span>`).join(' ')}</div>`; capKey = key; }
    el.querySelectorAll('span').forEach((sp, k) => { const w = c.words[k]; sp.className = t >= w.t0 && t < w.t1 + .04 ? 'n' : t < w.t0 ? 'f' : ''; });
    const p = outCubic(ramp(t, c.t0 - .02, c.t0 + .14));
    el.style.opacity = p; el.style.transform = `translateY(${(1 - p) * 14}px)`;
  }

  // ---------- một khung
  async function renderAt(t) {
    let i = D.shots.findIndex((s) => t >= s.t0 && t < s.t1);
    if (i < 0) i = N - 1;
    const s = D.shots[i];
    setShotText(i);
    const prevKind = i > 0 ? D.shots[i - 1].kind : 'card';
    const nextKind = i + 1 < N ? D.shots[i + 1].kind : 'card';
    // grain đổi mỗi khung để nền không chết
    const f = Math.round(t * D.fps);
    $('grain').style.transform = `translate(${(hash(f) - .5) * 40}px,${(hash(f + 7) - .5) * 40}px)`;
    renderCaption(t);

    const isCard = s.kind === 'card';
    // vào/ra thẻ chữ lớn
    const inP = outCubic(ramp(t, s.t0, s.t0 + .45));
    const outP = ease(ramp(t, s.t1 - .32, s.t1));
    $('cardshot').style.opacity = isCard ? Math.min(inP, nextKind === 'card' ? 1 : 1 - outP) : 0;
    $('top').style.opacity = isCard ? 0 : (prevKind === 'card' ? inP : 1) * (nextKind === 'card' ? 1 - outP : 1);
    card.style.opacity = isCard ? 0 : (prevKind === 'card' ? inP : 1) * (nextKind === 'card' ? 1 - outP : 1);
    if (isCard) { await renderCard(s, t); return; }
    const sc = prevKind === 'card' ? lerp(.9, 1, inP) : 1;
    card.style.transform = `translateY(${(1 - sc) * 300}px) scale(${sc})`;
    revealWords($('title'), t, s.t0 + .05);
    const kp = outCubic(ramp(t, s.t0, s.t0 + .35));
    $('kicker').style.opacity = kp; $('note').style.opacity = outCubic(ramp(t, s.t0 + .35, s.t0 + .8));
    // chuyển cảnh: nội dung trượt vào từ phải, URL gõ dần
    const push = outCubic(ramp(t, s.t0, s.t0 + .38));
    content.style.transform = `translateX(${(1 - push) * 90}px)`; content.style.opacity = .25 + .75 * push;
    const urlEl = $('url');
    urlEl.style.clipPath = `inset(0 ${(1 - outCubic(ramp(t, s.t0 + .05, s.t0 + .55))) * 100}% 0 0)`;
    for (const o of D.shots) for (const l of o.layers) if (o !== s) l.style.opacity = 0;
    for (const o of D.shots) if (o !== s) { o.g.style.display = 'none'; o.fx.style.display = 'none'; }
    s.g.style.display = ''; s.fx.style.display = '';
    content.className = s.kind === 'demo' ? 'demo' : s.kind === 'terminal' ? 'term' : '';

    if (s.kind === 'demo') { await renderDemo(s, t); hideCursor(); keys.style.opacity = 0; spot.setAttribute('d', ''); spotRing.setAttribute('width', 0); return; }
    if (s.kind === 'terminal') { renderTerm(s, t); hideCursor(); spot.setAttribute('d', ''); spotRing.setAttribute('width', 0); return; }
    const cam = camAt(s, t);
    const view = s.view_w || s.w;
    const sc2 = CW / view * cam.z;
    const tx = CW / 2 - cam.cx * sc2, ty = CH / 2 - cam.cy * sc2;
    const M = (x, y) => [x * sc2 + tx, y * sc2 + ty];

    if (s.kind === 'screen') {
      // đổi trạng thái trang (sau cú bấm thật) bằng hoà tan 0,25 s
      s.layers.forEach((img, k) => {
        img.style.transform = `translate(${tx}px,${ty}px) scale(${sc2})`;
        const sw = (s.swaps || []).filter((w) => t >= w.t).pop();
        const cur = sw ? sw.state : 0;
        const prev = (s.swaps || []).filter((w) => t >= w.t).length > 1 ? s.swaps[s.swaps.length - 2].state : 0;
        const p = sw ? ramp(t, sw.t, sw.t + .25) : 1;
        img.style.opacity = k === cur ? 1 : (k === (sw ? (cur - 1) : -1) ? 1 - p : 0);
      });
    } else {
      await showFrame(s, t, `translate(${tx}px,${ty}px) scale(${sc2})`);
    }
    s.g.setAttribute('transform', `matrix(${sc2},0,0,${sc2},${tx},${ty})`);

    // tô khối
    const sp = active(s.spots, t)[0];
    if (sp) {
      const a = Math.min(ramp(t, sp.t0, sp.t0 + .3), 1 - ramp(t, sp.t1 - .25, sp.t1));
      const [x0, y0] = M(sp.rect.x, sp.rect.y), [x1, y1] = M(sp.rect.x + sp.rect.w, sp.rect.y + sp.rect.h);
      const r = 12;
      spot.setAttribute('d', `M0 0 H1000 V808 H0 Z M${x0 + r} ${y0} H${x1 - r} Q${x1} ${y0} ${x1} ${y0 + r} V${y1 - r} Q${x1} ${y1} ${x1 - r} ${y1} H${x0 + r} Q${x0} ${y1} ${x0} ${y1 - r} V${y0 + r} Q${x0} ${y0} ${x0 + r} ${y0} Z`);
      spot.style.opacity = a;
      Object.entries({ x: x0, y: y0, width: x1 - x0, height: y1 - y0, rx: r }).forEach(([k, v]) => spotRing.setAttribute(k, v));
      spotRing.style.opacity = a;
    } else { spot.setAttribute('d', ''); spotRing.setAttribute('width', 0); }

    // khung sáng, quét màu, nhấc vùng, sóng lan (toạ độ màn hình)
    let fxOn = false;
    (s.marks || []).forEach((m, k) => {
      if (!FX.has(m.kind)) return;
      const [x0, y0] = M(m.rect.x, m.rect.y), [x1, y1] = M(m.rect.x + m.rect.w, m.rect.y + m.rect.h);
      fxOn = drawFx(s.markEls[k], m, t, { x: x0, y: y0, w: x1 - x0, h: y1 - y0 }, { sc: sc2, tx, ty }) || fxOn;
    });
    if (fxOn) spotRing.style.opacity = 0;
    drawKeys(s.typing, t, s.kind === 'live' ? [] : null);

    // nét bút vẽ dần (chỉ khi kịch bản ghi rõ circle/underline/highlight)
    (s.marks || []).forEach((m, k) => {
      if (FX.has(m.kind)) return;
      const el = s.markEls[k];
      const on = t >= m.t0 && t < m.t1;
      el.style.display = on ? '' : 'none';
      if (!on) return;
      const p = outCubic(ramp(t, m.t0, m.t0 + .45));
      const fade = 1 - ramp(t, m.t1 - .2, m.t1);
      if (m.kind === 'highlight') {
        el.setAttribute('x', m.rect.x); el.setAttribute('y', m.rect.y); el.setAttribute('height', m.rect.h);
        el.setAttribute('width', m.rect.w * p); el.style.opacity = fade;
      } else {
        if (!el._len) el._len = el.getTotalLength();
        el.style.strokeDasharray = el._len; el.style.strokeDashoffset = el._len * (1 - p); el.style.opacity = fade;
      }
    });

    // con trỏ
    const c = curAt(s, t);
    const [cx, cy] = M(c.x, c.y);
    const appear = ramp(t, s.t0 + .2, s.t0 + .5);
    cur.style.transform = `translate(${cx}px,${cy + CHROME}px)`;
    cur.style.opacity = appear;
    const ck = (s.clicks || []).filter((x) => t >= x - .1 && t < x + .5).pop();
    const press = ck !== undefined ? Math.sin(Math.PI * ramp(t, ck - .1, ck + .14)) : 0;
    arrow.style.transform = `scale(${1 - .16 * press})`;
    if (ck !== undefined && t >= ck) {
      const p = ramp(t, ck, ck + .45);
      const d = 16 + 70 * outCubic(p);
      Object.assign(ripple.style, { width: d + 'px', height: d + 'px', left: -d / 2 + 'px', top: -d / 2 + 'px', opacity: 1 - p });
    } else ripple.style.opacity = 0;
    const lb = active(s.labels, t)[0];
    if (lb) {
      if (label.textContent !== lb.text) label.textContent = lb.text;
      const p = outBack(ramp(t, lb.t0, lb.t0 + .22));
      label.style.opacity = Math.min(ramp(t, lb.t0, lb.t0 + .1), 1 - ramp(t, lb.t1 - .18, lb.t1));
      label.style.transform = `scale(${.6 + .4 * p})`;
    } else label.style.opacity = 0;
  }
  function hideCursor() { cur.style.opacity = 0; }

  async function showFrame(s, t, transform) {
    const img = s.layers[0];
    const u = Math.max(0, (t - (s.play_t0 || s.t0)) * (s.rate || 1));
    let k = 0;
    while (k + 1 < s.frames.length && s.frames[k + 1].t <= u) k++;
    const src = s.frames[k].src;
    if (img._src !== src) { img._src = src; img.src = src; await img.decode().catch(() => {}); }
    img.style.width = s.w + 'px'; img.style.height = s.h + 'px';
    img.style.transform = transform; img.style.opacity = 1;
  }
  // ---------- cảnh terminal: gõ lệnh từng ký tự, đầu ra thật hiện theo mốc đã ghi lúc chạy
  const LH = 38, PAD = 30, MAXV = Math.floor((CH - 2 * PAD) / LH);
  const esc = (x) => x.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  function termLines(s, t) {
    const out = [];
    let typingNow = false;
    for (const st of s.term.steps) {
      if (t < st.t0 - .05) break;
      const n = Math.round(st.cmd.length * ramp(t, st.t0, st.t1));
      typingNow = t < st.enter;
      out.push({ html: `<span class="pr">${esc(s.term.prompt)}</span> <span class="dl">$</span> <span class="cm">${esc(st.cmd.slice(0, n))}</span>`, t: st.t0, prompt: true });
      for (const o of st.out) if (t >= o.t) out.push({ html: `<span class="${o.elided ? 'el' : 'ot'}">${esc(o.text)}</span>`, t: o.t });
    }
    const last = s.term.steps[s.term.steps.length - 1];
    const idle = !typingNow && (!last || t >= (last.out.length ? last.out[last.out.length - 1].t : last.enter) + .35);
    if (idle || !out.length) out.push({ html: `<span class="pr">${esc(s.term.prompt)}</span> <span class="dl">$</span> `, t: 0, prompt: true });
    return out;
  }
  function renderTerm(s, t) {
    const term = s.layers[0];
    term.style.opacity = 1;
    const lines = termLines(s, t);
    const key = lines.map((l) => l.html).join('\n');
    if (key !== s.tkey) { s.tin.innerHTML = lines.map((l) => `<div class="ln">${l.html}</div>`).join(''); s.tkey = key; }
    const rows = s.tin.children;
    for (const r of rows) r.classList.remove('cur');
    rows[rows.length - 1].classList.add('cur');
    rows[rows.length - 1].classList.toggle('blink', Math.floor(t * 2.4) % 2 === 0);
    // cuộn để dòng mới nhất luôn thấy, trượt 0,15 s mỗi dòng mới
    const n = lines.length, lastT = Math.max(...lines.map((l) => l.t));
    const off = lerp(Math.max(0, n - 1 - MAXV), Math.max(0, n - MAXV), outCubic(ramp(t, lastT, lastT + .15))) * LH;
    s.tin.style.transform = `translateY(${-off}px)`;
    // camera: đẩy nhẹ 3%, phóng vào dòng đầu ra đang có khung sáng
    let cx = CW / 2, cy = CH / 2, z = 1 + .03 * ramp(t, s.t0, s.t1);
    const hl = (s.marks || []).map((m, k) => ({ m, k })).filter(({ m }) => t >= m.t0 && t < m.t1)[0];
    let r = null;
    if (hl) {
      const row = rows[hl.m.line];
      if (row) {
        const span = row.firstChild;
        r = { x: PAD - 10, y: PAD + hl.m.line * LH - off - 4, w: Math.min(CW - 2 * PAD + 20, (span ? span.offsetWidth : 300) + 20), h: LH + 8 };
        const p = ease(ramp(t, hl.m.t0, hl.m.t0 + .5)) * (1 - ease(ramp(t, hl.m.t1 - .45, hl.m.t1)));
        const zt = 1.2;
        z = lerp(z, zt, p);
        cx = lerp(cx, r.x + r.w / 2, p); cy = lerp(cy, r.y + r.h / 2, p);
      }
    }
    cx = clamp(cx, CW / (2 * z), CW - CW / (2 * z)); cy = clamp(cy, CH / (2 * z), CH - CH / (2 * z));
    const sc = z, tx = CW / 2 - cx * sc, ty = CH / 2 - cy * sc;
    term.style.transform = `translate(${tx}px,${ty}px) scale(${sc})`;
    (s.marks || []).forEach((m, k) => {
      const on = hl && hl.k === k && r;
      if (!on) { s.markEls[k].g.style.display = 'none'; return; }
      drawFx(s.markEls[k], m, t, { x: r.x * sc + tx, y: r.y * sc + ty, w: r.w * sc, h: r.h * sc }, { sc, tx, ty });
    });
    drawKeys([], t, (s.term.steps || []).map((x) => x.enter));
  }

  async function renderDemo(s, t) {
    // clip kết quả: vừa khung (contain), đẩy chậm 4% cho có nhịp
    const fit = Math.min(CW / s.w, CH / s.h);
    const z = fit * (1 + .04 * ramp(t, s.t0, s.t1));
    const tx = (CW - s.w * z) / 2, ty = (CH - s.h * z) / 2;
    await showFrame(s, t, `translate(${tx}px,${ty}px) scale(${z})`);
  }

  async function renderCard(s, t) {
    revealWords($('htitle'), t, s.t0 + .15, .07, .6);
    $('hkicker').style.opacity = outCubic(ramp(t, s.t0, s.t0 + .4));
    $('hnote').style.opacity = outCubic(ramp(t, s.t0 + .6, s.t0 + 1.1));
    // ảnh thu nhỏ các trang đã quay xoè thành quạt, trôi chậm
    const th = [...$('collage').children];
    const n = th.length;
    th.forEach((el, k) => {
      const p = outBack(ramp(t, s.t0 + .35 + k * .09, s.t0 + .95 + k * .09));
      const a = n > 1 ? k / (n - 1) - .5 : 0;
      const drift = (t - s.t0) * 6;
      const x = 540 + a * 700 - 165, y = 1080 + Math.abs(a) * 120 - drift * (k % 2 ? 1 : -1) * .6;
      el.style.transform = `translate(${x}px,${y + (1 - p) * 260}px) rotate(${a * 22 + (hash(k) - .5) * 4}deg) scale(${.7 + .3 * p})`;
      el.style.opacity = clamp(p * 1.4);
      el.style.zIndex = 10 - Math.round(Math.abs(a) * 10);
    });
    [...$('items').children].forEach((el, k) => {
      const p = outCubic(ramp(t, s.t0 + .5 + k * .16, s.t0 + 1.0 + k * .16));
      el.style.opacity = p; el.style.transform = `translateX(${(1 - p) * 50}px)`;
    });
    // Không vẽ nét bút dưới cụm nhấn: đo lúc chữ còn trồi lên làm nét đè lên dòng ghi chú (trông như gạch bỏ),
    // và người dùng đã chê nét gạch tay là rẻ tiền (22/10/2026). Cụm nhấn đã đủ nổi nhờ chữ nghiêng màu đỏ.
  }

  window.renderAt = renderAt;
  const fontsReady = Promise.all([
    "600 94px 'Cormorant Garamond'", "italic 500 94px 'Cormorant Garamond'", "500 25px 'IBM Plex Mono'",
    "700 46px 'Be Vietnam Pro'", "400 30px 'Be Vietnam Pro'", "600 38px 'Be Vietnam Pro'",
  ].map((f) => document.fonts.load(f, 'Tiếng Việt ữ ặ')));
  window.__ready = Promise.all([fontsReady, ...pending]).then(() => document.fonts.ready).then(() => true);
})();
