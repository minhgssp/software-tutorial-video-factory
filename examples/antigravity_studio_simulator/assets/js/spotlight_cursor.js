/* =========================================================================
   assets/js/spotlight_cursor.js
   Định vị Hộp Tiêu Điểm Cam (#kudo-spotlight) & Con Trỏ Giả Lập (#kudo-cursor)
   tự động giới hạn trong phạm vi Khung Chính Bên Phải (#kudo-stage-viewport),
   không bao giờ đè sang Sidebar bên trái.
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

  if (document.getElementById("kudo-model-popover").classList.contains("show")) {
    kudoOpenModelPopover();
  }
  if (document.getElementById("kudo-turbo-popover").classList.contains("show")) {
    kudoOpenTurboPopover();
  }
  if (document.getElementById("agy2-quote-btn").classList.contains("show")) {
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
  if (document.getElementById("kudo-context-menu").classList.contains("show")) {
    kudoOpenExplorerContextMenu("[data-file='INDEX.md']");
  }

  const sb = kudoGetStageBounds();
  const selectors = beat.focus_selectors || [];
  const pad = typeof beat.focus_pad === "number" ? beat.focus_pad : 6;
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

  // Định vị thông minh chống va chạm (Collision-Free) cho #kudo-stage-pedagogy-card
  const pCard = document.getElementById("kudo-stage-pedagogy-card");
  if (pCard && pCard.classList.contains("visible")) {
    // Co giãn chiều rộng tự động nếu phần trống duy nhất nằm ở cột trái (cây thư mục ~255px)
    const leftGap = foundAny ? (spotLeft - (sb.left + 10) - 10) : 300;
    const rightGap = foundAny ? ((sb.right - 12) - spotRight - 10) : 300;
    if (foundAny && leftGap >= 220 && leftGap < 300 && rightGap < 220) {
      pCard.style.width = Math.round(leftGap) + "px";
    } else {
      pCard.style.width = "300px";
    }
    const cardW = pCard.offsetWidth || 300;
    const cardH = pCard.offsetHeight || 110;
    const safeBottomTop = Math.max(sb.top + 44, sb.bottom - cardH - 34); // Luôn nằm trên thanh Status Bar 24px
    const edCanvas = document.getElementById("editor-canvas");
    const edRect = (edCanvas && edCanvas.offsetWidth > 0) ? edCanvas.getBoundingClientRect() : null;
    const edLeft = edRect ? Math.max(sb.left + 12, edRect.left + 14) : (sb.left + 232);
    const edRight = edRect ? Math.min(sb.right - 14, edRect.right - 14) : (sb.right - 390);

    const obstacles = [];
    if (foundAny) {
      obstacles.push({ left: spotLeft - 6, top: spotTop - 6, right: spotRight + 6, bottom: spotBottom + 6, weight: 10 });
    }
    ["#ide-chat-input", "#agy2-chat-input", "#ide-popup-menu.show", "#agy2-popup-menu.show", "#kudo-model-popover.show", "#kudo-turbo-popover.show", "#kudo-context-menu.show"].forEach(sel => {
      const oel = document.querySelector(sel);
      if (oel) {
        const r = oel.getBoundingClientRect();
        if (r.width > 0 && r.height > 0) {
          obstacles.push({ left: r.left - 6, top: r.top - 6, right: r.right + 6, bottom: r.bottom + 6, weight: 6 });
        }
      }
    });

    const candidates = [
      { left: edLeft, top: safeBottomTop },
      { left: Math.max(edLeft, edRight - cardW), top: safeBottomTop },
      { left: sb.left + 10, top: safeBottomTop },
      { left: edLeft, top: sb.top + 82 },
      { left: Math.max(edLeft, edRight - cardW), top: sb.top + 82 },
      { left: sb.right - cardW - 16, top: sb.top + 48 },
      { left: sb.left + 10, top: sb.top + 48 },
      { left: sb.right - cardW - 16, top: safeBottomTop }
    ];

    let bestCand = candidates[0];
    let minScore = Infinity;
    for (let i = 0; i < candidates.length; i++) {
      const c = candidates[i];
      const cL = Math.max(sb.left + 10, Math.min(sb.right - cardW - 12, Math.round(c.left)));
      const cT = Math.max(sb.top + 42, Math.min(safeBottomTop, Math.round(c.top)));
      const cR = cL + cardW;
      const cB = cT + cardH;
      let score = i * 5; // Ưu tiên nhẹ theo thứ tự danh sách nếu không va chạm
      obstacles.forEach(ob => {
        const ix = Math.max(0, Math.min(cR, ob.right) - Math.max(cL, ob.left));
        const iy = Math.max(0, Math.min(cB, ob.bottom) - Math.max(cT, ob.top));
        if (ix > 0 && iy > 0) {
          score += (ix * iy) * ob.weight;
        }
      });
      if (score < minScore) {
        minScore = score;
        bestCand = { left: cL, top: cT };
      }
    }

    pCard.style.left = bestCand.left + "px";
    pCard.style.top = bestCand.top + "px";
    pCard.style.right = "auto";
    pCard.style.bottom = "auto";
  }


  // Ẩn con chuột & nhãn Tip nếu người dùng bật chế độ "Ẩn chuột & Tip",
  // hoặc đã bấm tương tác trực tiếp trong vùng mô phỏng, hoặc nội dung trao đổi/thuyết minh của phần này đã kết thúc
  if (window.kudoHideCursorAndTip || window.kudoSpeechCompletedForBeat || window.kudoUserInteractedInSim) {
    cur.classList.remove("visible");
    return;
  }

  const cursorSel = beat.cursor_selector || beat.cursor_target;
  if (cursorSel) {
    const cel = document.querySelector(cursorSel);
    if (cel) {
      const cr = cel.getBoundingClientRect();
      if (cr.width > 0 && cr.height > 0) {
        const popEl = cel.closest("#ide-popup-menu, #agy2-popup-menu, #kudo-model-popover, #kudo-turbo-popover, #kudo-context-menu");
        let cx, cy;
        if (popEl) {
          const popRect = popEl.getBoundingClientRect();
          // Đặt mũi tên chuột ở góc trống phía trên bên phải của bảng gợi ý (vùng tiêu đề trống)
          // để TUYỆT ĐỐI KHÔNG che lấp bất kỳ chữ hay mô tả nào trong các dòng gợi ý (@COMPANY.md, /start-1-1...)
          cx = Math.max(Math.round(sb.left + 14), Math.min(Math.round(sb.right - 26), Math.round(popRect.right - 28)));
          cy = Math.max(Math.round(sb.top + 12), Math.min(Math.round(sb.bottom - 26), Math.round(popRect.top + 6)));
        } else {
          cx = Math.max(Math.round(sb.left + 14), Math.min(Math.round(sb.right - 26), Math.round(cr.left + Math.min(cr.width * 0.68, cr.width - 14))));
          cy = Math.max(Math.round(sb.top + 12), Math.min(Math.round(sb.bottom - 26), Math.round(cr.top + Math.min(cr.height * 0.65, 28))));
        }

        cur.style.left = cx + "px";
        cur.style.top = cy + "px";
        curLbl.textContent = beat.cursor_label || "";
        curLbl.classList.remove("flip-left");
        curLbl.style.right = "auto";
        cur.classList.add("visible");

        const lblW = curLbl.offsetWidth || 235;
        const lblH = curLbl.offsetHeight || 26;

        // Tính tọa độ màn hình tuyệt đối (position: fixed) cho nhãn #kudo-cursor-label để:
        // 1. Không bao giờ đè lên bảng gợi ý (popEl) hay thanh công cụ @ /
        // 2. Luôn nằm gọn trong phạm vi cột đang tiêu điểm (spotLeft .. spotRight), không tràn sang cột bên cạnh
        const minAllowedX = Math.max(sb.left + 8, Math.min(spotLeft + 8, sb.right - lblW - 8));
        const maxAllowedX = Math.max(minAllowedX, Math.min(sb.right - lblW - 8, spotRight - lblW - 8));
        let targetScreenX = Math.max(minAllowedX, Math.min(maxAllowedX, cx + 18));

        let targetScreenY;
        if (popEl) {
          const popRect = popEl.getBoundingClientRect();
          if (popRect.top - lblH - 10 >= sb.top + 6) {
            targetScreenY = Math.round(popRect.top - lblH - 10);
          } else {
            targetScreenY = Math.min(Math.round(sb.bottom - lblH - 6), Math.round(popRect.bottom + 8));
          }
        } else {
          // Nếu con trỏ trỏ vào ô nhập chat (#ide-chat-input), đặt nhãn cao hơn thanh công cụ @ / 📊 🌐 (38px phía trên ô nhập)
          const isIdeChatInput = (cel.id === "ide-chat-input") || Boolean(cel.closest("#ide-chat-input"));
          if (isIdeChatInput) {
            targetScreenY = Math.max(Math.round(sb.top + 6), Math.round(cr.top - lblH - 38));
          } else if (cr.bottom + lblH + 14 <= sb.bottom - 6) {
            targetScreenY = Math.round(cr.bottom + 8);
          } else {
            targetScreenY = Math.max(Math.round(sb.top + 6), Math.round(cr.top - lblH - 10));
          }
        }

        curLbl.style.left = Math.round(targetScreenX) + "px";
        curLbl.style.top = Math.round(targetScreenY) + "px";
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
