// The page contract for `reelcrew render` on top of the unchanged engine (engine.js keeps window.boot / window.seek):
//   window.READY (true once fonts and the static layers are in), window.DURATION (STORY.duration),
//   window.renderFrame(t) (draws time t), and data for `reelcrew render --data <name>`:
//   EVENTS   — belt shift start times (s), for the beat check (`music analyze --events … --grid bar`)
//   CAPTIONS — [{ start, end, text }], the caption timings a voice-over follows
// In a browser, index.html?t=12.5 shows that moment (←/→ step 0.1 s, shift+arrow 1 s).
(() => {
  const ST = window.STORY;
  window.READY = false;
  window.DURATION = ST.duration;
  window.EVENTS = ST.shifts.flatMap((s) => Array.from({ length: s.count }, (_, i) => +(s.start + s.every * i).toFixed(3)));
  window.CAPTIONS = (ST.captions ?? []).map(([start, end, text]) => ({ start, end, text }));
  window.renderFrame = (t) => window.seek(t);
  window.boot().then(() => {
    const q = new URLSearchParams(location.search);
    let t = q.has('render') ? 0 : Math.min(ST.duration, Math.max(0, Number(q.get('t') ?? 0)));
    window.seek(t);
    window.READY = true;
    if (q.has('render')) return;
    addEventListener('keydown', (e) => {
      const d = { ArrowLeft: -1, ArrowRight: 1 }[e.key];
      if (!d) return;
      t = Math.min(ST.duration, Math.max(0, t + d * (e.shiftKey ? 1 : 0.1)));
      window.seek(t);
      document.title = `${t.toFixed(2)} s`;
    });
  });
})();
