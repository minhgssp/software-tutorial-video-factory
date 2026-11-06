// The render contract for `reelcrew render` around the engine (whiteboard.js):
//   window.SIZE ("1920x1080" or "1080x1920", from timeline.js), window.DURATION (every scene on one timeline),
//   window.READY (false until the annotations, the images, the hand and the first scene's precompute are done),
//   window.renderFrame(t), and for `reelcrew render --data`: SFX_CUES (each region's ink part, for the pencil sound),
//   SCENES (each scene's times and regions, for the stills and the studio) and PROBLEMS ([] when the page is right).
// timeline.js (build-timeline.py) lists the scenes, their start times, the voice's length and the engine options;
// each scene's regions are read live from scenes/<scene>.annotation.json, so a saved edit shows in the next render.
// Scenes: with a voice, scene k starts at its first subtitle (scene 1 at 0) and lasts until the next one; the last
// lasts until the voice ends plus the hold. Without a voice, each scene lasts as long as its own drawing and hold.
// Numbered boxes: boxes.html (or index.html?boxes=1 in a browser) shows each scene's full image with its regions'
// boxes, numbers, labels and pen directions. In a browser, index.html?t=12.5 shows that moment (←/→ step 0.1 s).
(async () => {
  const WB = window.Whiteboard;
  const q = new URLSearchParams(location.search);
  const boxes = Boolean(window.BOXES) || q.has('boxes');
  const T = window.TIMELINE || null;
  window.READY = false;
  window.PROBLEMS = [];
  window.SFX_CUES = [];
  window.SCENES = [];
  const [VW, VH] = String(T?.size || '1920x1080').split('x').map(Number);
  window.SIZE = `${VW}x${VH}`;
  window.DURATION = 1;
  const canvas = document.getElementById('wb');
  canvas.width = VW; canvas.height = VH;
  const ctx = canvas.getContext('2d');
  const engine = WB.options(T?.engine);
  const fps = engine.fps;

  // file:// reads: XMLHttpRequest works under `reelcrew render` (Chrome runs with file access); fetch() does not
  const read = (url, type) => new Promise((ok, fail) => {
    const x = new XMLHttpRequest();
    x.open('GET', url); x.responseType = type;
    x.onload = () => (x.status === 0 || x.status === 200) && x.response ? ok(x.response) : fail(new Error(`cannot read ${url}`));
    x.onerror = () => fail(new Error(`cannot read ${url} (open the page with reelcrew render, which allows reading files)`));
    x.send();
  });
  const pixels = async (url) => { // decoded as stored: no colour management; getImageData gives straight alpha back
    // (a bitmap drawn on a canvas must be premultiplied: a straight-alpha one turns half-transparent pixels grey)
    const bmp = await createImageBitmap(new Blob([await read(url, 'arraybuffer')]), { colorSpaceConversion: 'none', premultiplyAlpha: 'premultiply' });
    const c = new OffscreenCanvas(bmp.width, bmp.height); const g = c.getContext('2d');
    g.drawImage(bmp, 0, 0);
    return { w: bmp.width, h: bmp.height, data: g.getImageData(0, 0, bmp.width, bmp.height).data, bmp };
  };

  const scenes = [];
  let handImg = null;
  const tips = new Map(); // tip sprite per height
  try {
    if (!T) throw new Error('timeline.js has no scenes yet: run build-timeline.py');
    if (!engine.bareTip && engine.hand?.file) {
      try { handImg = await pixels(engine.hand.file); } catch { window.PROBLEMS.push(`no hand image at video/${engine.hand.file}: the bare tip is drawn instead`); }
    }
    for (const s of T.scenes) {
      const ann = await read(`scenes/${s.name}.annotation.json`, 'json').catch(() => { throw new Error(`missing or invalid video/scenes/${s.name}.annotation.json`); });
      const img = await pixels(s.image).catch(() => { throw new Error(`missing image video/${s.image}`); });
      if (!Array.isArray(ann.elements) || !ann.elements.length) throw new Error(`video/scenes/${s.name}.annotation.json has no elements`);
      scenes.push({ ...s, ann, img });
    }
    if (!scenes.length) throw new Error('timeline.js lists no scene');
  } catch (e) {
    window.PROBLEMS.unshift(e.message);
  }

  // one timeline: scene starts in frames, each scene planned with its window
  const voice = T?.voiceMs ?? null;
  const longEdge = Math.max(VW, VH);
  let startF = 0;
  if (scenes.length && !window.PROBLEMS.some((p) => !p.startsWith('no hand image'))) {
    scenes.forEach((s, k) => {
      // one clock for the whole video: a scene may override any option but fps
      const opts = WB.options(T.engine, s.ann.engine, { fps });
      const startMs = voice == null ? null : (k === 0 ? 0 : s.startMs);
      const nextMs = voice == null ? null : (k + 1 < scenes.length ? scenes[k + 1].startMs : voice + opts.holdMs);
      s.plan = WB.plan(s.img, s.ann, opts, longEdge, voice == null ? undefined : nextMs - startMs);
      s.startF = voice == null ? startF : WB.pyRound(startMs * fps / 1000);
      if (k > 0) scenes[k - 1].frames = s.startF - scenes[k - 1].startF;
      s.frames = s.plan.frames;
      startF = s.startF + s.frames;
    });
    const total = scenes.length ? scenes[scenes.length - 1].startF + scenes[scenes.length - 1].frames : fps;
    window.DURATION = total / fps;
    for (const s of scenes) {
      const p = s.plan;
      window.SCENES.push({
        name: s.name, image: s.image, start: s.startF / fps, duration: s.frames / fps, size: `${p.W}x${p.H}`,
        regions: p.regions.map((r) => ({ id: r.e.id, label: r.e.label, sequence: r.e.sequence, start: (s.startF + r.inkStart) / fps, end: (s.startF + r.colorStart + r.colorWritten) / fps })),
      });
      for (const r of p.regions) {
        if (r.inkStart >= s.frames) continue; // cut off by the next scene
        window.SFX_CUES.push({ name: 'pencil', t: (s.startF + r.inkStart) / fps, end: (s.startF + Math.min(s.frames, r.inkStart + r.inkFrames)) / fps, scene: s.name, region: r.e.id });
      }
    }
  }

  const tipFor = (p) => {
    const h = p.opts.handHeight;
    if (!tips.has(h)) {
      let sprite = null;
      if (handImg) {
        sprite = WB.handSprite(handImg.data, handImg.w, handImg.h, h, engine.hand.anchorX ?? 0, engine.hand.anchorY ?? 0, (x, y, w, hh, dw, dh) => {
          const c = new OffscreenCanvas(dw, dh); const g = c.getContext('2d');
          g.imageSmoothingQuality = 'high'; g.drawImage(handImg.bmp, x, y, w, hh, 0, 0, dw, dh);
          return g.getImageData(0, 0, dw, dh).data;
        });
      }
      tips.set(h, sprite || WB.proceduralTip(h));
    }
    return tips.get(h);
  };
  const frameCanvas = new OffscreenCanvas(1, 1);
  const built = []; // the scenes whose per-pixel data is kept (two at most: memory)
  const keep = (s) => {
    if (built.includes(s)) return;
    built.push(s);
    while (built.length > 2) built.shift().plan.built = null;
  };
  const paper = engine.paper;

  function drawBoxes(s, ox, oy, sx, sy) {
    const p = s.plan;
    ctx.save();
    ctx.lineWidth = Math.max(3, Math.round(VW / 480));
    ctx.font = `bold ${Math.round(Math.max(VW, VH) / 64)}px sans-serif`;
    ctx.textBaseline = 'top';
    p.regions.forEach((r, i) => {
      const reg = r.e.region; const hue = (i * 67) % 360;
      const x = ox + reg.x * sx; const y = oy + reg.y * sy; const w = reg.width * sx; const h = reg.height * sy;
      ctx.strokeStyle = `hsl(${hue} 80% 40%)`; ctx.fillStyle = `hsl(${hue} 80% 40% / 0.12)`;
      ctx.fillRect(x, y, w, h); ctx.strokeRect(x, y, w, h);
      for (const pr of r.e.reveal?.protectedRegions || []) { ctx.setLineDash([8, 6]); ctx.strokeRect(ox + pr.x * sx, oy + pr.y * sy, pr.width * sx, pr.height * sy); ctx.setLineDash([]); }
      const hp = r.e.handPath;
      if (hp?.start && hp?.end) { // the pen's direction
        const [ax, ay] = [ox + hp.start[0] * sx, oy + hp.start[1] * sy]; const [bx, by] = [ox + hp.end[0] * sx, oy + hp.end[1] * sy];
        ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke();
        const a = Math.atan2(by - ay, bx - ax); const L = ctx.lineWidth * 6;
        ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx - L * Math.cos(a - 0.4), by - L * Math.sin(a - 0.4)); ctx.lineTo(bx - L * Math.cos(a + 0.4), by - L * Math.sin(a + 0.4)); ctx.closePath();
        ctx.fillStyle = `hsl(${hue} 80% 40%)`; ctx.fill();
      }
      const tag = `${i + 1}  ${r.e.label || r.e.id || ''}  ${(r.e.reveal.startMs / 1000).toFixed(1)}–${((r.e.reveal.startMs + r.e.reveal.durationMs) / 1000).toFixed(1)} s`;
      // the tag sits inside its own box (clipped to it), so a neighbour's tag never covers it
      const pad = 6; const tw = ctx.measureText(tag).width; const th = parseInt(ctx.font.match(/(\d+)px/)[1], 10);
      ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
      ctx.fillStyle = `hsl(${hue} 80% 30%)`; ctx.fillRect(x, y, tw + pad * 2, th + pad * 2);
      ctx.fillStyle = '#fff'; ctx.fillText(tag, x + pad, y + pad);
      ctx.restore();
    });
    ctx.restore();
  }

  function problems() {
    ctx.fillStyle = paper; ctx.fillRect(0, 0, VW, VH);
    ctx.fillStyle = '#b00020'; ctx.font = `bold ${Math.round(VW / 50)}px sans-serif`;
    window.PROBLEMS.forEach((p, i) => ctx.fillText(p, VW / 20, VH / 6 + i * VW / 35));
  }

  window.renderFrame = (t) => {
    if (!scenes.length || !scenes[0].plan) return problems();
    const total = Math.round(window.DURATION * fps);
    const F = Math.min(total - 1, Math.max(0, Math.floor(t * fps + 1e-6)));
    let s = scenes[0];
    for (const c of scenes) if (c.startF <= F) s = c;
    const p = s.plan; keep(s);
    const f = boxes ? p.holdStart : F - s.startF;
    if (frameCanvas.width !== p.W || frameCanvas.height !== p.H) { frameCanvas.width = p.W; frameCanvas.height = p.H; }
    const fc = frameCanvas.getContext('2d'); const img = fc.createImageData(p.W, p.H);
    WB.draw(p, f, img.data, tipFor(p));
    fc.putImageData(img, 0, 0);
    // the drawing fits the frame: same size as a rule (16:9 art in a 16:9 video), else scaled in and centred on paper
    const k = Math.min(VW / p.W, VH / p.H); const dw = Math.round(p.W * k); const dh = Math.round(p.H * k);
    const ox = Math.floor((VW - dw) / 2); const oy = Math.floor((VH - dh) / 2);
    if (dw !== p.W || dh !== p.H || ox || oy) { ctx.fillStyle = paper; ctx.fillRect(0, 0, VW, VH); }
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(frameCanvas, ox, oy, dw, dh);
    if (boxes) drawBoxes(s, ox, oy, dw / s.ann.canvas.width, dh / s.ann.canvas.height);
  };

  try {
    if (scenes[0]?.plan) WB.build(scenes[0].plan); // the first scene's precompute before READY
  } catch (e) {
    window.PROBLEMS.unshift(`the engine failed: ${e.message}`);
  }
  let t = q.has('render') ? 0 : Math.min(window.DURATION, Math.max(0, Number(q.get('t') ?? 0)));
  window.renderFrame(t);
  window.READY = true;
  if (q.has('render')) return;
  addEventListener('keydown', (e) => {
    const d = { ArrowLeft: -1, ArrowRight: 1 }[e.key];
    if (!d) return;
    t = Math.min(window.DURATION, Math.max(0, t + d * (e.shiftKey ? 1 : 0.1)));
    window.renderFrame(t);
    document.title = `${t.toFixed(2)} s`;
  });
})();
