/* =========================================================================
   assets/js/spotlight_cursor.js
   Định vị Hộp Tiêu Điểm Cam (#kudo-spotlight) & Con Trỏ Giả Lập (#kudo-cursor)
   tự động giới hạn trong phạm vi Khung Chính Bên Phải (#kudo-stage-viewport),
   không bao giờ đè sang Sidebar bên trái và tự động thu gọn khung bao khi
   con trỏ chỉ vào 1 phần tử tương tác cụ thể.
   ========================================================================= */
function kudoSyncDomAnchors() {
  const beat = window.kudoActiveAnchorBeat;
  const spot = document.getElementById("kudo-spotlight");
  const cur = document.getElementById("kudo-cursor");
  const curLbl = document.getElementById("kudo-cursor-label");
  if (!spot || !cur || !curLbl) return;

  if (!beat || beat.mode !== "sim") {
    spot.classList.remove("visible");
    cur.classList.remove("visible");
    return;
  }

  if (document.getElementById("kudo-model-popover") && document.getElementById("kudo-model-popover").classList.contains("show")) {
    kudoOpenModelPopover();
  }
  if (document.getElementById("kudo-turbo-popover") && document.getElementById("kudo-turbo-popover").classList.contains("show")) {
    kudoOpenTurboPopover();
  }
  if (document.getElementById("agy2-quote-btn") && document.getElementById("agy2-quote-btn").classList.contains("show")) {
    const hl = document.getElementById("kudo-quote-highlight");
    const pill = document.getElementById("agy2-quote-btn");
    if (hl && pill) {
      const sb = kudoGetStageBounds();
      const r = hl.getBoundingClientRect();
      const ph = pill.offsetHeight || 32;
      pill.style.left = Math.max(sb.left + 12, Math.round(r.left + 12)) + "px";
      pill.style.top = Math.min(sb.bottom - ph - 8, Math.round(r.bottom + 6)) + "px";
    }
  }
  if (document.getElementById("kudo-context-menu") && document.getElementById("kudo-context-menu").classList.contains("show")) {
    kudoOpenExplorerContextMenu("[data-file='INDEX.md']");
  }
  if (document.getElementById("kudo-tab-context-menu") && document.getElementById("kudo-tab-context-menu").classList.contains("show")) {
    kudoOpenTabContextMenu(document.getElementById("kudo-tab-context-menu").getAttribute("data-anchor-sel") || "#editor-tabs-list .editor-tab");
  }

  const usePhase1 = Boolean(window.kudoInChoreoPhase1 && beat.mode === "sim" && (beat.onEnterPhase1 || beat.pre_click_selector));
  const sb = kudoGetStageBounds();
  const cursorSel = usePhase1
    ? (beat.pre_cursor_selector || beat.pre_click_selector || beat.cursor_selector || beat.cursor_target)
    : (beat.cursor_selector || beat.cursor_target);

  let selectors = (usePhase1 && Array.isArray(beat.pre_focus_selectors) && beat.pre_focus_selectors.length > 0)
    ? beat.pre_focus_selectors
    : (usePhase1 && beat.pre_click_selector ? [beat.pre_click_selector] : (beat.focus_selectors || []));

  // Chống lệch tiêu điểm do gộp nhiều vùng quá rộng (Multi-Selector Bounding Box Drift):
  // Nếu cursorSel đang trỏ vào một phần tử nhỏ cụ thể (ví dụ [data-file='0.1_Introduction.md'], nút bấm, tab)
  // mà focus_selectors lại liệt kê nhiều khung lớn làm hộp cam trải dài > 500px, tự động ưu tiên thu gọn
  // hộp tiêu điểm ôm sát vào phần tử mục tiêu (và bảng menu đang mở nếu có).
  const celTarget = cursorSel ? document.querySelector(cursorSel) : null;
  const pad = typeof beat.focus_pad === "number" ? beat.focus_pad : 5;
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  let foundAny = false;

  selectors.forEach(sel => {
    const el = document.querySelector(sel);
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (r.width <= 0 || r.height <= 0) return;
    foundAny = true;
    minX = Math.min(minX, r.left);
    minY = Math.min(minY, r.top);
    maxX = Math.max(maxX, r.right);
    maxY = Math.max(maxY, r.bottom);
  });

  if (celTarget && foundAny && selectors.length > 1 && (maxX - minX) > 500) {
    const cr = celTarget.getBoundingClientRect();
    const isSpecificItem = cr.width > 0 && cr.width < 380 && cr.height < 140;
    const popElCheck = celTarget.closest("#ide-popup-menu, #agy2-popup-menu, #kudo-model-popover, #kudo-turbo-popover, #kudo-context-menu, #kudo-tab-context-menu, #ide-file-dropdown");
    if (isSpecificItem && !popElCheck) {
      minX = cr.left;
      minY = cr.top;
      maxX = cr.right;
      maxY = cr.bottom;
    }
  }

  let spotLeft = sb.left + 8;
  let spotRight = sb.right - 8;
  let spotTop = sb.top + 8;
  let spotBottom = sb.bottom - 8;
  if (foundAny) {
    const left = Math.max(Math.round(sb.left + 4), Math.round(minX - pad));
    const top = Math.max(Math.round(sb.top + 3), Math.round(minY - pad));
    const right = Math.min(Math.round(sb.right - 4), Math.round(maxX + pad));
    const bottom = Math.min(Math.round(sb.bottom - 3), Math.round(maxY + pad));
    spotLeft = left;
    spotRight = right;
    spotTop = top;
    spotBottom = bottom;
    spot.style.left = left + "px";
    spot.style.top = top + "px";
    spot.style.width = Math.max(36, right - left) + "px";
    spot.style.height = Math.max(24, bottom - top) + "px";
    spot.classList.add("visible");
  } else {
    spot.classList.remove("visible");
  }

  // PROP-261106-01 Rule 4: Luôn ẩn hộp thoại nổi #kudo-stage-pedagogy-card
  const pCard = document.getElementById("kudo-stage-pedagogy-card");
  if (pCard) {
    pCard.classList.remove("visible");
    pCard.style.display = "none";
  }

  // Ẩn con chuột & nhãn Tip nếu người dùng bật chế độ "Ẩn chuột & Tip",
  // hoặc đã bấm tương tác trực tiếp trong vùng mô phỏng, hoặc nội dung thuyết minh đã kết thúc
  if (window.kudoHideCursorAndTip || window.kudoSpeechCompletedForBeat || window.kudoUserInteractedInSim) {
    cur.classList.remove("visible");
    return;
  }

  const activeCursorLabel = usePhase1
    ? (beat.pre_cursor_label || beat.pre_click_label || beat.cursor_label || "")
    : (beat.cursor_label || "");
  if (cursorSel) {
    const cel = document.querySelector(cursorSel);
    if (cel) {
      const cr = cel.getBoundingClientRect();
      if (cr.width > 0 && cr.height > 0) {
        const popEl = cel.closest("#ide-popup-menu, #agy2-popup-menu, #kudo-model-popover, #kudo-turbo-popover, #kudo-context-menu, #kudo-tab-context-menu, #ide-file-dropdown");
        const isNarrowRow = cr.height <= 44 && cr.width <= 320;
        let cx, cy;
        if (popEl) {
          cx = Math.max(Math.round(sb.left + 14), Math.min(Math.round(sb.right - 26), Math.round(cr.right - Math.min(34, Math.max(16, cr.width * 0.14)))));
          cy = Math.max(Math.round(sb.top + 12), Math.min(Math.round(sb.bottom - 26), Math.round(cr.top + Math.min(cr.height * 0.56, 22))));
        } else if (isNarrowRow) {
          // Neo mũi tên ở mép phải dưới của dòng tệp/nút nhỏ để KHÔNG che chữ bên trong
          cx = Math.max(Math.round(sb.left + 14), Math.min(Math.round(sb.right - 26), Math.round(cr.right - 12)));
          cy = Math.max(Math.round(sb.top + 12), Math.min(Math.round(sb.bottom - 26), Math.round(cr.bottom - 5)));
        } else {
          cx = Math.max(Math.round(sb.left + 14), Math.min(Math.round(sb.right - 26), Math.round(cr.left + Math.min(cr.width * 0.68, cr.width - 14))));
          cy = Math.max(Math.round(sb.top + 12), Math.min(Math.round(sb.bottom - 26), Math.round(cr.top + Math.min(cr.height * 0.65, 28))));
        }

        cur.style.left = cx + "px";
        cur.style.top = cy + "px";
        curLbl.textContent = activeCursorLabel;
        curLbl.classList.remove("flip-left");
        curLbl.style.right = "auto";
        cur.classList.add("visible");

        const lblW = curLbl.offsetWidth || 235;
        const lblH = curLbl.offsetHeight || 26;

        // Bộ giải Định vị Chống Va Chạm (Collision-Free Solver) cho #kudo-cursor-label
        const lblObstacles = [
          { left: cr.left - 6, top: cr.top - 6, right: cr.right + 6, bottom: cr.bottom + 6, weight: 55 },
          { left: cx - 10, top: cy - 10, right: cx + 26, bottom: cy + 26, weight: 45 }
        ];
        if (popEl) {
          const pr = popEl.getBoundingClientRect();
          lblObstacles.push({ left: pr.left - 4, top: pr.top - 4, right: pr.right + 4, bottom: pr.bottom + 4, weight: 60 });
        }
        ["#set-pill-this-computer", "#ide-chat-input", "#agy2-chat-input", "#editor-tabs-list .editor-tab.active", "#ide-menu-file-btn", "#agy2-model-pill", "#ide-model-select", ".context-toolbar", ".agy2-input-footer"].forEach(osel => {
          const oel = document.querySelector(osel);
          if (oel) {
            const or = oel.getBoundingClientRect();
            if (or.width > 0 && or.height > 0) {
              lblObstacles.push({ left: or.left - 6, top: or.top - 6, right: or.right + 6, bottom: or.bottom + 6, weight: 50 });
            }
          }
        });

        const popRect = popEl ? popEl.getBoundingClientRect() : null;
        const rawCandidates = popRect ? [
          { left: popRect.left, top: popRect.bottom + 10 },
          { left: popRect.left - lblW - 12, top: cr.top + (cr.height - lblH) / 2 },
          { left: popRect.left, top: spotTop - lblH - 10 },
          { left: popRect.right + 12, top: cr.top + (cr.height - lblH) / 2 },
          { left: popRect.left - lblW - 12, top: popRect.top }
        ] : [
          { left: Math.max(sb.left + 8, cr.left), top: cr.bottom + 10 },
          { left: cr.right + 14, top: cr.top + (cr.height - lblH) / 2 },
          { left: Math.max(sb.left + 8, cr.left), top: spotTop - lblH - 10 },
          { left: cr.left - lblW - 12, top: cr.top + (cr.height - lblH) / 2 },
          { left: cx - 24, top: cr.top - lblH - 12 }
        ];

        let bestX = Math.max(sb.left + 8, Math.min(sb.right - lblW - 8, cx + 18));
        let bestY = Math.max(sb.top + 6, Math.min(sb.bottom - lblH - 28, cr.bottom + 8));
        let bestScore = Infinity;

        for (let i = 0; i < rawCandidates.length; i++) {
          const rc = rawCandidates[i];
          const candX = Math.max(sb.left + 8, Math.min(sb.right - lblW - 8, Math.round(rc.left)));
          const candY = Math.max(sb.top + 6, Math.min(sb.bottom - lblH - 28, Math.round(rc.top)));
          const candR = candX + lblW;
          const candB = candY + lblH;
          let sc = i * 8;
          lblObstacles.forEach(ob => {
            const ix = Math.max(0, Math.min(candR, ob.right) - Math.max(candX, ob.left));
            const iy = Math.max(0, Math.min(candB, ob.bottom) - Math.max(candY, ob.top));
            if (ix > 0 && iy > 0) {
              sc += (ix * iy) * ob.weight;
            }
          });
          if (sc < bestScore) {
            bestScore = sc;
            bestX = candX;
            bestY = candY;
          }
        }

        curLbl.style.left = Math.round(bestX) + "px";
        curLbl.style.top = Math.round(bestY) + "px";
      } else {
        cur.classList.remove("visible");
      }
    } else {
      cur.classList.remove("visible");
    }
  } else {
    cur.classList.remove("visible");
  }
}
