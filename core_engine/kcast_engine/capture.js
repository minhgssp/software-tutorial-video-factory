// Chạy trong trang thật lúc quay (Playwright evaluate). Tìm vùng đích theo chữ / selector / vai trò,
// và đề xuất vùng quan trọng khi không có kịch bản. Toạ độ trả về là toạ độ trang (đã cộng scroll), đơn vị CSS px.
(() => {
  const norm = (s) => (s || '').normalize('NFC').replace(/\s+/g, ' ').trim().toLowerCase();
  const visible = (el) => {
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return r.width > 2 && r.height > 2 && cs.visibility !== 'hidden' && cs.display !== 'none' && +cs.opacity > 0.05;
  };
  const toPage = (r) => ({ x: r.left + scrollX, y: r.top + scrollY, w: r.width, h: r.height });
  const ACTIONABLE = 'a,button,[role=button],[role=tab],summary,input,select,textarea,label';

  // Nút/link nhỏ chứa chữ thì lấy cả khối nút (con trỏ "hút" vào nút); chữ trong đoạn văn thì lấy đúng dải chữ.
  function rectForText(query, nth) {
    const q = norm(query);
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const hits = [];
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      const raw = n.nodeValue.normalize('NFC');
      const low = raw.toLowerCase();
      // So khớp bỏ qua khoảng trắng thừa: dựng chỉ mục từ chuỗi đã gộp khoảng trắng về chuỗi gốc.
      let flat = '', map = [];
      for (let i = 0; i < low.length; i++) {
        const ch = /\s/.test(low[i]) ? ' ' : low[i];
        if (ch === ' ' && flat.endsWith(' ')) continue;
        flat += ch; map.push(i);
      }
      const at = flat.indexOf(q);
      if (at < 0 || !n.parentElement || !visible(n.parentElement)) continue;
      const range = document.createRange();
      range.setStart(n, map[at]);
      range.setEnd(n, map[at + q.length - 1] + 1);
      const rr = range.getBoundingClientRect();
      if (rr.width < 2) continue;
      const act = n.parentElement.closest(ACTIONABLE);
      const ar = act && act.getBoundingClientRect();
      const useAct = act && ar.width < 520 && ar.height < 140;
      hits.push({ rect: toPage(useAct ? ar : rr), actionable: !!act, tag: (useAct ? act : n.parentElement).tagName.toLowerCase() });
    }
    // Chuỗi trải qua nhiều nút chữ (vd "remotion-dev / skills"): thử khớp theo innerText của phần tử nhỏ nhất.
    if (!hits.length) {
      let best = null;
      for (const el of document.querySelectorAll('body *')) {
        if (!visible(el) || !norm(el.innerText).includes(q)) continue;
        const r = el.getBoundingClientRect();
        if (!best || r.width * r.height < best.area) best = { el, area: r.width * r.height };
      }
      if (best) hits.push({ rect: toPage(best.el.getBoundingClientRect()), actionable: !!best.el.closest(ACTIONABLE), tag: best.el.tagName.toLowerCase() });
    }
    return hits[Math.min(nth || 0, hits.length - 1)] || null;
  }

  function rectForSelector(sel, nth) {
    const els = [...document.querySelectorAll(sel)].filter(visible);
    const el = els[Math.min(nth || 0, els.length - 1)];
    return el ? { rect: toPage(el.getBoundingClientRect()), actionable: !!el.closest(ACTIONABLE), tag: el.tagName.toLowerCase() } : null;
  }

  function rectForRole(role, name, nth) {
    const sel = { link: 'a', button: 'button,[role=button],summary', heading: 'h1,h2,h3,h4', image: 'img,svg[role=img]', code: 'pre', input: 'input,textarea' }[role] || `[role=${role}]`;
    const els = [...document.querySelectorAll(sel)].filter(visible)
      .filter((el) => !name || norm(el.innerText || el.getAttribute('aria-label') || el.getAttribute('alt')).includes(norm(name)));
    const el = els[Math.min(nth || 0, els.length - 1)];
    return el ? { rect: toPage(el.getBoundingClientRect()), actionable: !!el.closest(ACTIONABLE), tag: el.tagName.toLowerCase() } : null;
  }

  window.__kudoFind = (t) => {
    if (t.text) return rectForText(t.text, t.nth);
    if (t.selector) return rectForSelector(t.selector, t.nth);
    if (t.role) return rectForRole(t.role, t.name, t.nth);
    return null;
  };

  // Ứng viên "vùng quan trọng" cho chế độ tự động: tiêu đề, mô tả, nút chính, số liệu, khối mã, ảnh/video minh hoạ.
  window.__kudoCandidates = (maxY) => {
    const out = [];
    const add = (el, kind, weight) => {
      if (!visible(el)) return;
      const r = toPage(el.getBoundingClientRect());
      if (r.y > maxY || r.w < 8 || r.h < 8 || r.w > innerWidth * 0.98) return;
      const text = (el.innerText || el.getAttribute('aria-label') || el.getAttribute('alt') || '').replace(/\s+/g, ' ').trim().slice(0, 160);
      out.push({ kind, weight, text, rect: r, tag: el.tagName.toLowerCase() });
    };
    document.querySelectorAll('h1').forEach((el) => add(el, 'heading', 1.0));
    document.querySelectorAll('h2').forEach((el) => add(el, 'heading', 0.7));
    document.querySelectorAll('main p, article p, [role=main] p').forEach((el, i) => i < 12 && el.innerText.length > 40 && add(el, 'paragraph', 0.5));
    document.querySelectorAll('a.btn-primary,button.btn-primary,[class*=primary],[class*=cta]').forEach((el) => add(el, 'button', 0.8));
    document.querySelectorAll('pre').forEach((el, i) => i < 4 && add(el, 'code', 0.75));
    document.querySelectorAll('article img, article video, main img, main video').forEach((el, i) => i < 4 && add(el, 'media', 0.6));
    document.querySelectorAll('[id*=star],[class*=star],[aria-label*=star i]').forEach((el) => /\d/.test(el.innerText || '') && add(el, 'metric', 0.7));
    return out;
  };
})();
