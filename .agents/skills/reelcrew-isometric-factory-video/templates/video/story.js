// story.js — ALL topic content for one video: text, layout, timeline, tickets, captions and event hooks.
// This worked example is "AI agents: without Jev vs with Jev" (69.69 s, music 120 BPM, a shift every 4 s then every 2 s).
// A new video takes its duration and shift times from scripts/beats.py, which measures the bar lines of its own music.
// To make a new topic, rewrite this file only; engine.js stays unchanged. The schema is in references/engine-api.md.
// Hooks run at render time, so they may use window.ISO (P, box, line, poly, along, clamp, eo, ease, lerp, esc, C) from engine.js.
window.STORY = {
  duration: 69.69,
  introEnd: 4.2,                       // title "Kiến trúc hệ thống AI Agents" shows until here
  morph: [26.9, 28.2],                 // plate centre building morphs act-1 kind → act-2 kind in this window
  // belt schedule: each segment = `count` shifts, starting at `start`, one every `every` s, each lasting `dur` s (start on downbeats)
  shifts: [
    { start: 0.43, every: 4, count: 7, dur: .9 },     // act 1: the LLM writes the label as text → slow belt
    { start: 28.43, every: 2, count: 21, dur: .5 },   // act 2: Jev picks → the belt runs twice as fast
  ],
  acts: [
    { from: 0, label: '[ Act 1 · without Jev ]', title: 'LLM chọn agent', button: 'Act 1', sheet: 'Sheet 01 / AI agents / without Jev',
      centre: { kind: 'tower', label: 'LLM router' }, plateTitle: '→ LLM router', plateSub: 'prompt → JSON · router.prompt', plateSubX: 7.6,
      zoneSub: '5 active runs · waiting' },
    { from: 27.9, label: '[ Act 2 · with Jev ]', title: 'Jev chọn agent', button: 'Act 2', sheet: 'Sheet 02 / AI agents / with Jev',
      centre: { kind: 'dark', label: 'Jev gateway' }, plateTitle: '→ Jev gateway', plateSub: 'chọn agent · kèm xác suất · jev.yaml', plateSubX: 8.1,
      zoneSub: '5 active runs' },
  ],
  text: {
    headerBold: 'Agent System', headerRest: 'Chăm sóc khách hàng · Ticket · State · Route · Agent · Review',
    introLabel: '[ Without Jev vs with Jev ]', introTitle: 'Kiến trúc hệ thống AI Agents',
    cardLabel: '[ Live ticket ]', ledgerLabel: '[ Ticket ledger ]', zone: 'Agent runtime', logLabel: 'Outcome log',
    brandBold: 'AI Agents', brandRest: 'without Jev vs with Jev',
  },
  // 6 stations: 0 = start plate, 1..4 = gantries on the belt, 5 = deliver platform. icon ∈ ticket|state|route|dispatch|review|deliver
  stations: [
    { name: 'Ticket', col: 'TIC', icon: 'ticket' }, { name: 'State', col: 'STA', icon: 'state' }, { name: 'Route', col: 'ROU', icon: 'route' },
    { name: 'Dispatch', col: 'DIS', icon: 'dispatch' }, { name: 'Review', col: 'REV', icon: 'review' }, { name: 'Deliver', col: 'DEL', icon: 'deliver' },
  ],
  // world layout (tuned on 1920×1080; see references/engine-api.md §Layout before moving anything)
  layout: {
    S: 20, OX: 500, OY: 318,
    SX: [0.3, 11, 21.5, 32, 42.5], BEND: 50, BW: 2.2, BZ: 2.0, GH: 3.7,
    zone: { x0: 6, x1: 46.5, y0: -1.6, y1: 6.6, h: 6.2 },
    plate: { x: 22.3, y: -29.1, w: 16, d: 16, h: 1 },
    deliver: { x: 49, y: -13, w: 15, d: 17.4 },
    stacks: { support: [53.4, 1.3], sales: [53.8, -4.3], complaint: [54.2, -9.9], human: [59.6, 1.6] },
    log: [60.2, -6.4],                 // outcome-log block on the deliver platform (appears with act 2); null = none
    sourceJoin: { x: -1, y: -3.4, inY: -1 },
    caption: [1346, 98],               // fixed caption card (top-right, above the plate)
  },
  sources: [['Chat', -4, -6], ['Email', -2, -10], ['Zalo', 0, -14], ['Hotline', 2, -18]],
  channels: ['Chat', 'Email', 'Zalo', 'Hotline', 'App'],
  idPrefix: 'T-', idBase: 50231,
  stackLabels: { support: 'Support', sales: 'Sales', complaint: 'Complaint', human: 'Human desk' },
  stacksBase: { support: 14, sales: 11, complaint: 5, human: 2 },
  darkStacks: ['human'],
  // plate nodes: offset from plate centre; glyph ∈ coins|cube|flag|people|bubble|sheets; act2Only = dashed ghost in act 1
  nodes: {
    sales: { at: [-5.2, -3.2], glyph: 'coins', label: 'Sales agent' },
    support: { at: [-5.4, 3.4], glyph: 'cube', label: 'Support agent' },
    complaint: { at: [0.2, -6], glyph: 'flag', label: 'Complaint agent' },
    human: { at: [5.6, -3.6], glyph: 'people', label: 'Human desk' },
    triage: { at: [5.4, 3.2], glyph: 'bubble', label: 'Triage LLM', act2Only: true },
    registry: { at: [0.4, 6.2], glyph: 'sheets', label: 'Registry · thresholds', act2Only: true },
  },
  // items: k = order they enter the belt (ticket k is at station s after shift k+s); a = true agent; flags drive the story events
  items: [
    [-7, 'Không đăng nhập được app', 'support'], [-6, 'Gói Pro giá bao nhiêu?', 'sales'], [-5, 'Xuất hoá đơn VAT ở đâu?', 'support'],
    [-4, 'Báo giá 200 license cho công ty', 'sales'], [-3, 'Bị trừ phí 2 lần tháng này', 'complaint'], [-2, 'Đổi email tài khoản thế nào?', 'support'],
    [-1, 'Có gói dùng thử không?', 'sales'], [0, 'Tôi muốn nâng cấp lên gói Team', 'sales'], [1, 'Gói Business có SSO không?', 'sales'],
    [2, 'Giao trễ 5 ngày, không ai trả lời!', 'complaint', { lab: 'sales' }], [3, 'Hướng dẫn kết nối Zalo OA', 'support'], [4, 'Gia hạn hợp đồng năm sau', 'sales'],
    [5, 'App báo lỗi khi thanh toán', 'support'], [6, 'Muốn huỷ gói vì dịch vụ kém', 'complaint'], [7, 'Có giảm giá cho trường học?', 'sales'],
    [8, 'Đổi số điện thoại nhận OTP', 'support'], [9, 'Báo giá tích hợp API', 'sales'], [10, 'Nhân viên hẹn gọi lại rồi im luôn', 'complaint'],
    [11, 'Cài SSO cho cả team', 'support'], [12, 'Mua thêm 5 seat cho phòng kế toán', 'sales', { stale: 1 }], [13, 'Xuất báo cáo theo tháng', 'support'],
    [14, 'Bị trừ tiền 2 lần, hoàn tiền giúp tôi', 'complaint', { unsure: 1, refund: 1 }], [15, 'Mất dữ liệu 3 ngày, tôi sẽ kiện', 'complaint', { timeout: 1, severe: 1 }],
    [16, 'Mua thêm dung lượng lưu trữ', 'sales'], [17, 'Không thấy nút xuất Excel', 'support'], [18, 'Báo giá gói Enterprise', 'sales'],
    [19, 'Đổi địa chỉ xuất hoá đơn', 'support'], [20, 'Phí gia hạn tăng mà không báo', 'complaint'], [21, 'Thêm người dùng vào workspace', 'support'],
    [22, 'Có hỗ trợ trả góp không?', 'sales'], [23, 'Lỗi đồng bộ lịch', 'support'], [24, 'Cần demo cho ban giám đốc', 'sales'], [25, 'Chatbot trả lời sai giá', 'complaint'],
    [26, 'Quên mật khẩu admin', 'support'], [27, 'Mở rộng thêm chi nhánh', 'sales'], [28, 'Xin hoá đơn đỏ tháng 8', 'support'], [29, 'Đổi gói giữa kỳ', 'sales'],
  ].map(([k, q, a, x = {}]) => Object.assign({ k, q, a }, x)),
  // captions: [start, end, text] — verbatim from the owner's source; place each on the beat where its event happens
  captions: [
    [4.6, 9.3, 'Một ticket vào: giao cho agent nào? Chưa có Jev, câu này phải hỏi LLM.'],
    [9.5, 13.3, 'Code chỉ cần một chữ “sales”, nhưng LLM vẫn phải sinh từng token.'],
    [13.5, 17.3, 'Agent chạy nhiều bước: những lần chờ nhỏ ở mỗi lựa chọn cứ thế cộng dồn.'],
    [17.5, 22.3, 'Giả sử 50K ticket mỗi ngày: giờ cao điểm LLM phải gánh khoảng 34 call cùng lúc.'],
    [22.5, 27.3, 'Chỉ có nhãn, xác suất thì không đáng tin. Giao nhầm agent, code cũng không biết.'],
    [28.6, 32.3, 'Thêm Jev: model chỉ chọn, không sinh text.'],
    [32.5, 37.3, 'Một call, chấm 3 câu hỏi song song: khoảng 70–500 ms, có kèm xác suất.'],
    [37.5, 41.3, 'Code so xác suất với threshold: đủ cao thì giao thẳng cho agent đó.'],
    [41.5, 45.3, 'Khách nhắn thêm lúc code đang quyết? State cũ thì dựng lại rồi mới giao.'],
    [45.5, 49.3, 'Lưng chừng, hoặc Jev không trả lời kịp thì để triage LLM chọn agent.'],
    [49.5, 53.3, 'Khiếu nại nặng, hoặc action rủi ro như refund thì luôn phải qua người duyệt.'],
    [53.5, 58.3, 'Agent trả ticket về là một lần giao nhầm. Lấy log ra so, lệch thì siết threshold.'],
    [58.5, 64.6, 'Việc của agent thì để agent làm. Chọn agent là Jev, luật giao việc ở code.'],
  ],
  captionTag: i => i < 5 ? 'Act 1 · without Jev' : 'Act 2 · with Jev',

  // ---------------- hooks ----------------
  dest: tk => (tk.refund || tk.severe) ? 'human' : (tk.lab || tk.a),       // which stack a ticket lands on
  focus: t => {                                                          // station highlighted in the step list + floor label
    const F = [[4.4, 17.4, 2], [17.4, 22.4, 0], [22.4, 27.4, 3], [28.4, 37.4, 2], [37.4, 41.4, 3], [41.4, 45.4, 1], [45.4, 49.4, 2], [49.4, 53.4, 4], [53.4, 58.4, 5]];
    const f = F.find(([a, b]) => t > a && t < b); return f ? f[2] : -1;
  },
  packetRate: t => t < 16.4 ? 1 : t < 26 ? 2.4 : 1.2,                     // packets speed up at the act-1 peak
  sourceHot: (i, t) => i === 0 && t > 41 && t < 43.2,                    // extra customer message before the stale rebuild
  reviewAlert: tv => tv.refund || tv.severe,                              // review pins turn red
  route(tr, c) {                                                         // plate node picked for the ticket at ROUTE
    const need = c.act2 ? .25 : 2.6;                                      // the LLM needs ~2.6 s to write the label; Jev answers at once
    let node = null, k = 0;
    if (c.dw > need) { node = tr.unsure || tr.timeout ? (c.dw > 1.0 ? 'triage' : null) : (tr.lab || tr.a); k = ISO.eo((c.dw - need) / .3); }
    if ((tr.unsure || tr.timeout) && c.dw > 1.25) node = 'triage';
    return node ? { node, k } : null;
  },
  boxStyle(tk, p, c) {
    const s = {};
    if (tk.k === 2 && p > 4.95 && c.t < 28.5) s.top = ISO.C.alert;       // the misrouted complaint shows red on the sales stack
    if (tk.stale && Math.abs(p - 3) < .01 && c.inDwell) s.lift = Math.sin(ISO.clamp(c.dw / 1.35) * Math.PI) * .9; // box lifts while state rebuilds
    return s;
  },
  adjustStacks(cnt, c) { if (c.t > 53.6) cnt.sales--; },                  // the handed-back ticket leaves the sales stack
  floorItems(c) {                                                        // queue pile at the ticket station during the act-1 peak
    const { box, clamp } = ISO, t = c.t;
    const qn = Math.round(clamp((t - 17) / 4.5) * 14 * (1 - clamp((t - 26.8) / 1.2))); c.qn = qn;
    let s = ''; for (let i = 0; i < qn; i++) s += box(-2.6 + (i % 3) * 1.2, -3.6 - Math.floor(i / 3) % 3 * 1.2, Math.floor(i / 9) * .9, 1, 1, .85, { top: ISO.C.alertTop });
    return s;
  },
  extraItems(c) {                                                        // handed-back box flies from the sales stack to the outcome log
    const { P, box, clamp, lerp, ease } = ISO, t = c.t, HB = 53.3, OL = c.LY.log;
    if (!(t > HB && t < HB + 1.6)) return [];
    const k2 = clamp((t - HB) / 1.2), [sx, sy] = c.STACKS.sales;
    const x = lerp(sx, OL[0], ease(k2)), y = lerp(sy, OL[1], ease(k2)), z = lerp(c.stackTop('sales') + .3, 1.9, k2) + Math.sin(k2 * Math.PI) * 3;
    const [lx, ly] = P(x, y, z + 2.3); c.add(`<div class="tag r" style="left:${lx}px;top:${ly}px">Handed back · T-50240</div>`);
    return [{ d: x + y + 5, s: box(x - .8, y - .8, z, 1.6, 1.6, 1.25, { top: ISO.C.alert }) }];
  },
  ticker(t, c) {
    if (c.act2) return { html: '50K ticket/ngày · Jev · p95 0.4s' };
    if (t > 17) return { html: `<span style="color:${ISO.C.alert}">50K ticket/ngày · LLM router · ${Math.round(ISO.clamp((t - 17.1) / 2.2) * 34)} in flight</span>`, alert: true };
    return { html: '50K ticket/ngày · LLM router · p95 5.2s' };
  },
  liveCard(lt, c) {                                                      // [label, 'done'|'cur'|'', detail]
    const rDone = c.inDwell && c.dw > (c.act2 ? .3 : 2.64);
    const route = c.act2 ? (lt.timeout ? `Jev timeout → triage LLM → ${lt.a}` : lt.unsure ? `Jev p = 0.55 (lưng chừng) → triage LLM` : `Jev → ${lt.a} · p = ${lt.p} · ${70 + (lt.k * 53) % 260} ms`) :
      (rDone ? `LLM sinh JSON → "${lt.lab || lt.a}" · ${c.t > 17 ? 5.5 : 2.6}s` : 'LLM đang sinh JSON…');
    return [['01 Ticket', 'done', `qua ${lt.ch} · ${lt.id}`], ['02 State', 'done', 'account facts · state_v7'], ['03 Route', rDone ? 'done' : 'cur', route],
      ['04 Dispatch', '', ''], ['05 Review', '', ''], ['06 Deliver', '', '']];
  },
  ledgerDest(tk, p, c) {
    if (tk.k === 2 && !c.act2 && c.t > 25.2) return { text: '→ sales ✗', bad: 1 };
    const d = p >= 4.5 && this.dest(tk) === 'human' ? 'human desk' : (tk.lab || tk.a);
    return { text: `→ ${d}${tk.k >= 7 ? ' · p ' + (tk.unsure ? '0.55' : tk.p) : ''}` };
  },
  ledgerBad: (tk, s, p, c) => tk.k === 2 && s === 5 && p >= 5 && c.t > 25.2,

  // story overlays: chips (HTML via c.add) and extra SVG (c.svg). One block per caption beat.
  overlays(c) {
    const { P, esc, clamp, eo, along, poly, C } = ISO, t = c.t, { SX, BW, BZ, PC, NODES, inDwell, dw, tr, td, tv, act2 } = c, add = c.add;
    const rx = 1090, ry = 300;                                           // router chip anchor: free area between sources and plate
    const cx = PC[0] - 1.8, cy = PC[1] - 1.8;
    // act 1: the LLM writes the label token by token
    if (!act2 && inDwell && tr && t > 4.4) {
      const toks = ['{', '"agent"', ':', ' "', 'sa', 'les', '"', '}'], lab = tr.lab || tr.a;
      if (lab !== 'sales') { toks[4] = lab.slice(0, 3); toks[5] = lab.slice(3); }
      const nt = Math.min(toks.length, Math.floor(dw / .33)), ms = Math.round(Math.min(dw, 2.64) * 1000 * (t > 17 ? 2.1 : 1));
      add(`<div class="chip" style="left:${rx}px;top:${ry}px"><span class="k">LLM ▸</span>${esc(toks.slice(0, nt).join(''))}<span style="opacity:${Math.floor(t * 4) % 2}">▌</span> <span class="k" style="margin-left:10px">${nt * 4 + 18} tok · ${(ms / 1000).toFixed(1)}s</span></div>`);
    }
    // caption 3: waits add up at each station
    if (t > 13.3 && t < 17.6) { const waits = ['+0.4s', '+2.6s', '+0.9s', '+1.3s']; let tot = 0;
      waits.forEach((w, i) => { const a = 13.6 + i * .55; if (t > a) { tot += parseFloat(w); const [lx, ly] = P(SX[i + 1], -1, 6.6);
        add(`<div class="chip r" style="left:${lx}px;top:${ly}px;opacity:${eo((t - a) / .25) * clamp((17.6 - t) / .3)}"><span class="v">${w}</span></div>`); } });
      const [lx, ly] = P(SX[4] + 5, -1, 8.2); if (t > 15.9) add(`<div class="chip r" style="left:${lx}px;top:${ly}px;opacity:${eo((t - 15.9) / .3) * clamp((17.6 - t) / .3)}"><span class="k">Σ chờ</span><span class="v">${tot.toFixed(1)}s / ticket</span></div>`); }
    // caption 4: in-flight badge on the router + queue badge
    if (t > 16.9 && t < 27.4) { const f = Math.round(clamp((t - 17.1) / 2.2) * 34), o = clamp((t - 16.9) / .3) * clamp((27.4 - t) / .4);
      const [lx, ly] = P(cx + 1.8, cy - 3.2, 8.3); add(`<div class="tag r" style="left:${lx}px;top:${ly}px;opacity:${o};font-size:12px;padding:4px 9px">${f} in flight</div>`);
      const [qx, qy] = P(1.2, -5.2, 2.6); add(`<div class="tag r" style="left:${qx}px;top:${qy}px;opacity:${o * clamp((t - 18.2) / .3)}">Queue ${(c.qn || 0) * 9}</div>`); }
    // caption 5: a label only, no probability → misroute
    if (t > 21.4 && t < 27.4 && tv && tv.k === 2) { const [lx, ly] = P(SX[4], -1, 6.3);
      add(`<div class="chip r" style="left:${lx}px;top:${ly}px;opacity:${eo((t - 21.5) / .3)}"><span class="k">label</span>"sales" <span class="k" style="margin-left:8px">p =</span><span class="v">?</span></div>`); }
    if (t > 25.2 && t < 27.6) { const [sx, sy] = c.STACKS.sales, [lx, ly] = P(sx - 3.6, sy, 6.2);
      add(`<div class="chip r" style="left:${lx}px;top:${ly}px;opacity:${eo((t - 25.2) / .3) * clamp((27.6 - t) / .3)}"><span class="k">complaint →</span><span class="v">sales ✗</span></div>`); }
    // act 2: Jev scores three questions in parallel (bars with the 0.80 threshold marker)
    if (act2 && inDwell && tr && t > 28.5) {
      const k = eo((dw - .05) / .25), unsure = tr.unsure, tout = tr.timeout;
      const pa = unsure ? .55 : +tr.p, pu = tr.severe ? .91 : .12 + (tr.k % 3) * .05, pc = tr.a === 'complaint' ? (unsure ? .58 : .9) : .04 + (tr.k % 4) * .02;
      const ms = 70 + (tr.k * 53) % 260;
      const bar = (q, v, hi) => `<div style="display:flex;align-items:center;gap:8px;margin-top:5px"><span style="width:124px;color:#8a8a8a">${q}</span><span style="width:110px;height:7px;background:#e8e8e8;display:inline-block;position:relative"><span style="position:absolute;left:0;top:0;bottom:0;width:${(tout ? 0 : v * k) * 110}px;background:${hi ? C.green : '#9fb9aa'}"></span><span style="position:absolute;left:${.8 * 110}px;top:-3px;bottom:-3px;border-left:1.4px dashed #333"></span></span><span style="width:36px;color:${hi ? C.green : '#555'};font-weight:${hi ? 600 : 400}">${tout ? '—' : (v * k).toFixed(2)}</span></div>`;
      add(`<div class="chip ${unsure || tout ? 'r' : 'g'}" style="left:${rx + 30}px;top:${ry - 10}px;text-transform:none;padding:8px 12px">
        <div style="display:flex;justify-content:space-between"><span class="k">JEV ▸ 1 call</span><span class="v">${tout ? 'timeout > 500 ms' : Math.round(ms * k) + ' ms'}</span></div>
        ${bar('agent? ' + (unsure ? 'support?' : tr.a), pa, pa >= .8)}${bar('urgent?', pu, pu >= .8)}${bar('complaint?', pc, pc >= .8)}</div>`);
      if ((unsure || tout) && dw > 1.0) { const [nx, ny] = NODES.triage.at, [lx, ly] = P(PC[0] + nx + 3.5, PC[1] + ny, 6);
        add(`<div class="chip r" style="left:${lx}px;top:${ly}px;opacity:${eo((dw - 1) / .25)}"><span class="k">${tout ? 'no answer' : 'unsure'} →</span><span class="v">triage LLM</span></div>`); }
    }
    // dispatcher rule chip (act 1: a rule on a text label; act 2: probability vs threshold)
    if (inDwell && td && t > 4.5) { const [lx, ly] = P(SX[3], -1, 6.3), k = eo((dw - .2) / .25); let h;
      if (!act2) h = `<span class="k">rule</span>label == "${td.lab || td.a}" → ${td.lab || td.a}`;
      else if (td.stale) h = dw < 1.2 ? `<span class="k">state</span><span class="v">v7 stale → rebuild</span>` : `<span class="k">state v8 ✓</span>${td.p} ≥ 0.80 → <span class="v">${td.a}</span>`;
      else if (td.unsure || td.timeout) h = `<span class="k">triage</span>→ <span class="v">${td.a}</span>`;
      else h = `<span class="k">rule</span>${td.p} ≥ ${t > 55.8 && td.a === 'sales' ? '0.85' : '0.80'} → <span class="v">${td.a}</span>`;
      if (!(tv && tv.k === 2 && t > 21.4 && t < 24.5)) add(`<div class="chip ${act2 ? (td.stale && dw < 1.2 ? 'r' : 'g') : ''}" style="left:${lx}px;top:${ly}px;opacity:${k};text-transform:none">${h}</div>`); }
    // caption 9: stale state → packet goes dispatch → state → dispatch along a dashed arc
    if (act2 && inDwell && td && td.stale) { const a = P(SX[3], BW / 2, BZ + 1.2), b = P(SX[1], BW / 2, BZ + 1.2), mid = [(a[0] + b[0]) / 2, Math.min(a[1], b[1]) - 90];
      const arc = k => { const s = 1 - k; return [s * s * a[0] + 2 * s * k * mid[0] + k * k * b[0], s * s * a[1] + 2 * s * k * mid[1] + k * k * b[1]]; };
      let d = ''; for (let i = 0; i <= 24; i++) { const q = arc(i / 24); d += (i ? 'L' : 'M') + q[0].toFixed(1) + ',' + q[1].toFixed(1); }
      c.svg(`<path d="${d}" fill="none" stroke="${C.alert}" stroke-width="1.5" stroke-dasharray="6 5" opacity="${clamp(dw / .2)}"/>`);
      const k1 = clamp((dw - .15) / .5), k2 = clamp((dw - .75) / .5), q = k2 > 0 ? arc(1 - k2) : arc(k1);
      c.svg(`<rect x="${q[0] - 5}" y="${q[1] - 5}" width="10" height="10" fill="${k2 > 0 ? C.green : C.alert}"/>`);
      const [lx, ly] = P(SX[1], -1, 6.3); add(`<div class="chip ${dw > .7 ? 'g' : 'r'}" style="left:${lx}px;top:${ly}px;opacity:${clamp((dw - .3) / .2)};text-transform:none"><span class="k">+1 tin nhắn</span><span class="v">${dw > .7 ? 'state v8' : 'rebuild…'}</span></div>`); }
    // caption 11: refund / severe complaint goes to a human
    if (act2 && inDwell && tv && (tv.refund || tv.severe)) { const [lx, ly] = P(SX[4] + 2, -1, 6.3);
      add(`<div class="chip r" style="left:${lx}px;top:${ly}px;opacity:${eo((dw - .2) / .25)};text-transform:none"><span class="k">${tv.refund ? 'action: refund' : 'severe complaint'}</span>→ <span class="v">human desk</span></div>`); }
    // caption 12: calibration loop, outcome log → registry thresholds
    if (t > 54.2 && t < 58.6) { const o = clamp((t - 54.2) / .3) * clamp((58.6 - t) / .3), OL = c.LY.log;
      const a = P(OL[0], OL[1], 1.8), [rx2, ry2] = NODES.registry.at, b = P(PC[0] + rx2, PC[1] + ry2, 1.2);
      const path = [a, P(OL[0], c.PLATE.y + c.PLATE.d + 3.5, 1.8), P(PC[0] + rx2, c.PLATE.y + c.PLATE.d + 3.5, 1.8), b];
      c.svg(poly(path, { c: C.green, w: 1.8, dash: '7 5', op: o }));
      const q = along(path, clamp((t - 54.5) / 1.1)); c.svg(`<rect x="${q[0] - 5}" y="${q[1] - 5}" width="10" height="10" fill="${C.green}" opacity="${o}"/>`);
      const [lx, ly] = P(PC[0] + rx2, PC[1] + ry2, 3.4);
      add(`<div class="chip g" style="left:${lx + 70}px;top:${ly + 8}px;opacity:${o};text-transform:none"><span class="k">sales threshold</span><span class="v">${t > 55.8 ? '0.80 → 0.85' : '0.80'}</span></div>`);
      const [ox, oy] = P(OL[0], OL[1], 5.4); add(`<div class="chip r" style="left:${ox + 120}px;top:${oy + 40}px;opacity:${o};text-transform:none"><span class="k">giao nhầm</span><span class="v">1 / 318 · 0.3%</span></div>`); }
    // caption 13: summary — who does what
    if (t > 58.6) { const o = eo((t - 58.7) / .4);
      add(`<div class="chip g" style="left:1540px;top:262px;opacity:${o}"><span class="k">Jev</span><span class="v">chọn agent</span></div>`);
      const [b1, b2] = P(SX[3], -1, 6.3); add(`<div class="chip g" style="left:${b1 - 90}px;top:${b2 - 34}px;opacity:${eo((t - 59.2) / .4)}"><span class="k">Code</span><span class="v">luật giao việc</span></div>`);
      const [c1, c2] = P(53, 4, 9); add(`<div class="chip g" style="left:${c1}px;top:${c2}px;opacity:${eo((t - 59.7) / .4)}"><span class="k">Agents</span><span class="v">làm việc</span></div>`); }
  },
};
