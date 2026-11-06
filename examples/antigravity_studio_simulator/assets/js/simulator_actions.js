/* =========================================================================
   assets/js/simulator_actions.js
   Các hàm kịch bản tương tác trên phần mềm mô phỏng Antigravity 2.0 & Antigravity IDE.
   ========================================================================= */
function kudoHidePopovers() {
  const ids = ["kudo-model-popover", "kudo-turbo-popover", "agy2-quote-btn", "kudo-context-menu", "kudo-tab-context-menu", "kudo-key-hud"];
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove("show");
  });
  const idePop = document.getElementById("ide-popup-menu");
  if (idePop) idePop.classList.remove("visible");
  const fileDrop = document.getElementById("ide-file-dropdown");
  if (fileDrop) fileDrop.classList.remove("open", "show");
}

function kudoTriggerClickRipple(x, y) {
  const cur = document.getElementById("kudo-cursor");
  let rx = x, ry = y;
  if (typeof rx !== "number" || typeof ry !== "number") {
    if (cur && cur.classList.contains("visible")) {
      const r = cur.getBoundingClientRect();
      rx = Math.round(r.left + 4);
      ry = Math.round(r.top + 4);
    } else {
      return;
    }
  }
  const ring = document.createElement("div");
  ring.className = "kudo-click-ripple-ring";
  ring.style.left = rx + "px";
  ring.style.top = ry + "px";
  document.body.appendChild(ring);
  setTimeout(() => {
    if (ring && ring.parentNode) ring.parentNode.removeChild(ring);
  }, 620);
}

function kudoShowKeyHud(html) {
  const hud = document.getElementById("kudo-key-hud");
  if (!hud) return;
  hud.innerHTML = html;
  hud.classList.add("show");
}

function kudoGetStageBounds() {
  const stage = document.getElementById("kudo-stage-viewport");
  if (!stage) return { top: 0, bottom: window.innerHeight - 68, left: 280, right: window.innerWidth };
  return stage.getBoundingClientRect();
}

function kudoOpenModelPopover(targetSelector) {
  const pop = document.getElementById("kudo-model-popover");
  if (!pop) return;
  let sel = targetSelector || pop.getAttribute("data-anchor-sel") || "";
  let pill = sel ? document.querySelector(sel) : null;
  if (!pill || pill.offsetWidth <= 0) {
    const ideSurf = document.getElementById("surface-ide");
    if (ideSurf && ideSurf.classList.contains("active")) {
      pill = document.getElementById("ide-model-select");
      sel = "#ide-model-select";
    } else {
      pill = document.getElementById("agy2-model-pill");
      sel = "#agy2-model-pill";
    }
  }
  if (!pill) pill = document.getElementById("agy2-model-pill") || document.getElementById("ide-model-select");
  if (!pill) return;
  pop.setAttribute("data-anchor-sel", sel);
  pop.classList.add("show");
  const sb = kudoGetStageBounds();
  const r = pill.getBoundingClientRect();
  const pw = pop.offsetWidth || 315;
  const ph = pop.offsetHeight || 225;
  const left = Math.max(sb.left + 12, Math.min(sb.right - pw - 12, Math.round(r.left)));
  const top = Math.max(sb.top + 8, Math.min(sb.bottom - ph - 8, Math.round(r.top - ph - 8)));
  pop.style.left = left + "px";
  pop.style.top = top + "px";
}

function kudoSetTurboPopoverState(mode) {
  const pill = document.getElementById("set-pill-this-computer");
  const rDef = document.getElementById("ktp-default");
  const rTur = document.getElementById("ktp-turbo");
  const isTurbo = (mode === "turbo");
  if (pill) {
    pill.innerHTML = isTurbo ? "Turbo &#9662;" : "Default &#9662;";
    pill.style.borderColor = isTurbo ? "#EA580C" : "";
    pill.style.background = isTurbo ? "#FFF1E6" : "";
    pill.style.color = isTurbo ? "#9A3412" : "";
    pill.style.fontWeight = isTurbo ? "700" : "";
  }
  if (rDef) {
    rDef.classList.toggle("active", !isTurbo);
    const oldCk = rDef.querySelector(".ktp-check");
    if (!isTurbo && !oldCk) {
      const sp = document.createElement("span");
      sp.className = "ktp-check";
      sp.style.cssText = "color:#64748B; font-weight:800;";
      sp.textContent = "✓";
      rDef.appendChild(sp);
    } else if (isTurbo && oldCk) {
      oldCk.remove();
    }
  }
  if (rTur) {
    rTur.classList.toggle("active", isTurbo);
    const ck = rTur.querySelector("span[style*='16a34a'], .ktp-turbo-ck");
    if (ck) {
      ck.classList.add("ktp-turbo-ck");
      ck.style.display = isTurbo ? "inline" : "none";
    }
  }
}

function kudoOpenTurboPopover(mode) {
  const pill = document.getElementById("set-pill-this-computer");
  const pop = document.getElementById("kudo-turbo-popover");
  if (!pill || !pop) return;
  if (mode) kudoSetTurboPopoverState(mode);
  pop.classList.add("show");
  const sb = kudoGetStageBounds();
  const r = pill.getBoundingClientRect();
  const pw = pop.offsetWidth || 315;
  const ph = pop.offsetHeight || 210;
  const left = Math.max(sb.left + 12, Math.round(r.right - pw));
  const top = Math.max(sb.top + 8, Math.min(sb.bottom - ph - 8, Math.round(r.bottom + 6)));
  pop.style.left = left + "px";
  pop.style.top = top + "px";
}

function kudoOpenIdeMentionPopup() {
  const ta = document.getElementById("ide-chat-input");
  if (!ta) return;
  ta.value = "@";
  handleInputKey(ta, "ide-popup-menu");
}

function kudoOpenIdeSlashPopup() {
  const ta = document.getElementById("ide-chat-input");
  if (!ta) return;
  ta.value = "/";
  handleInputKey(ta, "ide-popup-menu");
}

function kudoSimScene(cfg) {
  if (!cfg) return;
  kudoHidePopovers();
  if (typeof closeIdeMenus === "function") closeIdeMenus();
  if (typeof closeMoveWarnModal === "function") closeMoveWarnModal();
  if (typeof closeWinFolderDialog === "function") closeWinFolderDialog();
  if (typeof closeSettingsModal === "function") closeSettingsModal();
  switchToSurface(cfg.surface || "ide");
  if (cfg.surface !== "mgr") {
    switchIdeSidebarMode("explorer");
  }
  if (cfg.file && typeof openFileInEditor === "function") {
    setEditorMode(cfg.editorMode || "wysiwyg");
    openFileInEditor(cfg.file);
  }
  if (cfg.breadcrumb) {
    const bc = document.getElementById("editor-breadcrumbs");
    if (bc) bc.innerHTML = cfg.breadcrumb;
  }
  if (cfg.editorTitle) {
    const tabs = document.getElementById("editor-tabs-list");
    if (tabs) {
      tabs.innerHTML = `<div class="editor-tab active"><span>${cfg.editorTitle}</span></div>`;
    }
  }
  if (cfg.editorHtml) {
    const canvas = document.getElementById("editor-canvas");
    if (canvas) {
      canvas.innerHTML = cfg.editorHtml;
    }
  }
  const msgBox = document.getElementById("ide-chat-messages");
  if (msgBox) {
    if (cfg.clearChat) {
      msgBox.innerHTML = "";
    }
    if (cfg.userMsg || cfg.aiMsg) {
      let html = "";
      if (cfg.userMsg) {
        html += `<div class="msg-user">${cfg.userMsg}</div>`;
      }
      if (cfg.aiMsg) {
        html += `<div class="msg-ai"><div class="progress-card"><div class="progress-card-title"><span>Trợ lý AI Antigravity</span><span>Done ✓</span></div></div><p>${cfg.aiMsg}</p></div>`;
      }
      msgBox.innerHTML = html;
    }
  }
  if (typeof cfg.chatInput === "string") {
    const ta = document.getElementById("ide-chat-input");
    if (ta) ta.value = cfg.chatInput;
  }
  const term = document.getElementById("ide-bottom-terminal");
  const termBody = document.getElementById("ide-terminal-body");
  if (term) {
    if (cfg.showTerminal) {
      term.style.display = "flex";
      if (termBody && cfg.terminalHtml) {
        termBody.innerHTML = cfg.terminalHtml;
      }
    } else {
      term.style.display = "none";
    }
  }
}


function kudoOpenStartWorkflowPopup() {
  const msgBox = document.getElementById("ide-chat-messages");
  if (msgBox) {
    msgBox.innerHTML = `<div class="msg-ai"><p>Chào mừng bạn đến với không gian làm việc của <strong>TaskFlow Inc. (45 nhân sự)</strong>. Hãy gõ lệnh <code>/start-1-1</code> vào ô bên dưới để bắt đầu bài thực hành có hướng dẫn từng bước.</p></div>`;
  }
  const ta = document.getElementById("ide-chat-input");
  if (!ta) return;
  ta.value = "/start";
  handleInputKey(ta, "ide-popup-menu");
}

function kudoSelectStartWorkflowReadyToSend() {
  const pop = document.getElementById("ide-popup-menu");
  if (pop) pop.classList.remove("visible");
  const ta = document.getElementById("ide-chat-input");
  if (ta) {
    ta.value = "/start-1-1";
  }
}

function kudoRunStart11ExecutedDemo() {
  const pop = document.getElementById("ide-popup-menu");
  if (pop) pop.classList.remove("visible");
  const ta = document.getElementById("ide-chat-input");
  if (ta) ta.value = "";
  runScenario(1);
}

function kudoOpenExplorerContextMenu(targetSelector) {
  const el = document.querySelector(targetSelector || "[data-file='INDEX.md']");
  const menu = document.getElementById("kudo-context-menu");
  if (!el || !menu) return;
  menu.classList.add("show");
  const sb = kudoGetStageBounds();
  const r = el.getBoundingClientRect();
  const mw = menu.offsetWidth || 235;
  const mh = menu.offsetHeight || 150;
  const left = Math.max(sb.left + 8, Math.min(sb.right - mw - 12, Math.round(r.right - 20)));
  const top = Math.max(sb.top + 8, Math.min(sb.bottom - mh - 8, Math.round(r.top + 6)));
  menu.style.left = left + "px";
  menu.style.top = top + "px";
}

function kudoOpenTabContextMenu(targetSelector) {
  const sel = targetSelector || "#editor-tabs-list .editor-tab";
  const el = document.querySelector(sel);
  const menu = document.getElementById("kudo-tab-context-menu");
  if (!el || !menu) return;
  menu.setAttribute("data-anchor-sel", sel);
  menu.classList.add("show");
  const sb = kudoGetStageBounds();
  const r = el.getBoundingClientRect();
  const mw = menu.offsetWidth || 256;
  const mh = menu.offsetHeight || 310;
  const left = Math.max(sb.left + 12, Math.min(sb.right - mw - 12, Math.round(r.left + 10)));
  const top = Math.max(sb.top + 8, Math.min(sb.bottom - mh - 8, Math.round(r.bottom + 4)));
  menu.style.left = left + "px";
  menu.style.top = top + "px";
}

function kudoActivateQuoteDemo() {
  kudoHidePopovers();
  closeSettingsModal();
  loadAgy2Thread("main");
  openAgy2RightPane("0.1_Introduction.md");
  const rp = document.getElementById("agy2-rp-content");
  if (rp) {
    rp.innerHTML = rp.innerHTML.replace(
      "Nhưng với <strong>Antigravity IDE</strong> và <strong>Antigravity 2.0</strong>, dân văn phòng có thể đưa trợ lý AI về làm việc trực tiếp ngay trong thư mục hồ sơ trên máy tính cá nhân.",
      "<span id='kudo-quote-highlight' class='kudo-text-selection'>Nhưng với <strong>Antigravity IDE</strong> và <strong>Antigravity 2.0</strong>, dân văn phòng có thể đưa trợ lý AI về làm việc trực tiếp ngay trong thư mục hồ sơ trên máy tính cá nhân.</span>"
    );
  }
  const hl = document.getElementById("kudo-quote-highlight");
  const pill = document.getElementById("agy2-quote-btn");
  if (hl && pill) {
    pill.classList.add("show");
    const sb = kudoGetStageBounds();
    const r = hl.getBoundingClientRect();
    const ph = pill.offsetHeight || 32;
    pill.style.left = Math.max(sb.left + 12, Math.round(r.left + 12)) + "px";
    pill.style.top = Math.min(sb.bottom - ph - 8, Math.round(r.bottom + 6)) + "px";
  }
  const ta = document.getElementById("agy2-chat-input");
  if (ta) {
    ta.value = "> @0.1_Introduction.md#L7-L8 (Đã trích dẫn đoạn bôi đen): Hãy viết thêm 1 ví dụ so sánh thực tế cho đoạn này.";
  }
}

function kudoRunGrillAndPlanDemo() {
  kudoHidePopovers();
  switchToSurface("ide");
  openFileInEditor("08_quy_trinh_lap_ke_hoach_chien_luoc.md");
  const msgBox = document.getElementById("ide-chat-messages");
  msgBox.innerHTML = `
    <div class="msg-user"><code>/grill-me</code> Tôi muốn lập kế hoạch kinh doanh cho dự án Giày Bã Mía bền vững, hãy hỏi ngược lại tôi những thông tin còn thiếu trước khi lập kế hoạch.</div>
    <div class="msg-ai">
      <div class="progress-card">
        <div class="progress-card-title"><span>Phỏng vấn làm rõ đề bài (/grill-me)</span><span>Active</span></div>
        <div class="progress-step">🔍 Đã đối chiếu khung 7 bước trong <code>08_quy_trinh_lap_ke_hoach_chien_luoc.md</code></div>
      </div>
      <p><strong>3 câu hỏi làm rõ trước khi lập kế hoạch:</strong></p>
      <ol style="margin-left:18px; line-height:1.6;">
        <li><strong>Phân khúc giá mục tiêu:</strong> Bạn nhắm tới tầm giá phổ thông (400k-600k) hay quà tặng doanh nghiệp (750k VNĐ/đôi)?</li>
        <li><strong>Nguồn cung nguyên liệu:</strong> Xưởng gia công đặt tại tỉnh nào để tối ưu chi phí thu gom bã mía?</li>
        <li><strong>Kênh bán hàng chủ lực Quý 1:</strong> Bán lẻ trực tuyến hay bán sỉ B2B quà tặng doanh nghiệp xanh?</li>
      </ol>
      <p style="color:#0284c7; font-weight:600; margin-top:6px;">👉 Sau khi bạn trả lời, gõ <code>/plan</code> để tôi xuất bản kế hoạch 7 bước.</p>
    </div>`;
  document.getElementById("ide-chat-input").value = "/plan Giá 750k/đôi, đặt xưởng tại Tây Ninh, Quý 1 tập trung B2B quà tặng doanh nghiệp.";
}

function kudoRunLearnDemo() {
  kudoHidePopovers();
  switchToSurface("ide");
  if (VFS["noi_quy_chung.md"] && !VFS["noi_quy_chung.md"].content.includes("4. Quy tắc xuất bảng tính CSV")) {
    VFS["noi_quy_chung.md"].content += "\n\n## 4. Quy tắc xuất bảng tính CSV (Mới cập nhật qua /learn)\n* **Biên lợi nhuận bắt buộc:** Mọi báo cáo doanh thu xuất ra tệp `.csv` đều phải có cột **Biên lợi nhuận (%)** và đánh dấu rõ 2 sản phẩm lỗ để đề xuất cắt giảm.";
  }
  setEditorMode("wysiwyg");
  openFileInEditor("noi_quy_chung.md");
  const canvas = document.getElementById("editor-canvas");
  if (canvas) {
    canvas.innerHTML = canvas.innerHTML.replace(
      "<h2>4. Quy tắc xuất bảng tính CSV (Mới cập nhật qua /learn)</h2>",
      "<div id='kudo-learned-rule-block' style='background:#DCFCE7; border:2px solid #16A34A; border-radius:8px; padding:8px 12px; margin-top:10px;'><h2 style='margin-top:0; color:#166534;'>4. Quy tắc xuất bảng tính CSV (Mới cập nhật qua /learn)</h2><p style='margin:4px 0 0 0; color:#14532D; font-weight:600;'>✓ Đã tự động ghi vào .agent/rules/noi_quy_chung.md: Bổ sung cột Biên lợi nhuận (%) và đánh dấu 2 sản phẩm lỗ.</p></div>"
    );
  }
  const msgBox = document.getElementById("ide-chat-messages");
  msgBox.innerHTML = `
    <div class="msg-user"><code>/learn</code> Hãy ghi nhớ quy tắc: Mọi báo cáo tài chính xuất ra bảng CSV đều phải kèm thêm cột Biên lợi nhuận (%) và đánh dấu 2 sản phẩm lỗ để đề xuất cắt giảm.</div>
    <div class="msg-ai">
      <div class="progress-card">
        <div class="progress-card-title"><span>Lưu quy tắc mới (/learn)</span><span>Saved ✓</span></div>
        <div class="progress-step">✏️ Đã cập nhật trực tiếp vào <code>.agent/rules/noi_quy_chung.md</code> (+4 dòng mục số 4)</div>
        <div class="progress-step">🧠 Đã đồng bộ sang hồ sơ <code>@troly.md</code></div>
      </div>
      <p><strong>Kết luận:</strong> Đã lưu quy tắc vào <code>.agent/rules/noi_quy_chung.md</code> (xem mục số 4 được tô xanh ở cột giữa). Từ các phiên làm việc sau, trợ lý AI sẽ tự động áp dụng chuẩn này.</p>
    </div>`;
  document.getElementById("ide-chat-input").value = "";
}

function kudoRunThreeStuckStatesDemo() {
  kudoHidePopovers();
  switchToSurface("ide");
  openFileInEditor("0.1_Introduction.md");
  const sendBtn = document.getElementById("ide-send-btn");
  if (sendBtn) {
    sendBtn.textContent = "■";
    sendBtn.title = "Stop generating (Dừng phản hồi)";
  }
  const msgBox = document.getElementById("ide-chat-messages");
  msgBox.innerHTML = `
    <div class="msg-user">Hãy tổng hợp bảng doanh thu Quý 1 và tạo tệp báo cáo mới trong thư mục dự án.</div>
    <div class="msg-ai">
      <div class="progress-card">
        <div class="progress-card-title"><span>Đang chờ xác nhận bước thực thi</span><span>Waiting...</span></div>
        <div class="progress-step">📄 Chuẩn bị ghi tệp <code>bao_cao_doanh_thu_q1.md</code> vào thư mục dự án</div>
        <div style="display:flex; gap:8px; margin-top:8px;">
          <button id="kudo-accept-step-btn" style="background:#16a34a; color:#fff; border:none; border-radius:5px; padding:4px 12px; font-size:11.5px; font-weight:700; cursor:pointer;">Accept (Chấp nhận)</button>
          <button style="background:#334155; color:#e2e8f0; border:none; border-radius:5px; padding:4px 10px; font-size:11.5px; cursor:pointer;">Reject</button>
        </div>
      </div>
      <p style="font-size:12px; color:#475569; margin-top:6px;">💡 Nếu AI dừng giữa chừng, bạn chỉ cần gõ <code>Tiếp tục</code> vào ô bên dưới; hoặc bấm nút <code>■</code> để dừng hẳn.</p>
    </div>`;
  document.getElementById("ide-chat-input").value = "Tiếp tục";
}

function kudoRunAskAiWhenStuckDemo() {
  kudoHidePopovers();
  switchToSurface("ide");
  const sendBtn = document.getElementById("ide-send-btn");
  if (sendBtn) sendBtn.textContent = "→";
  setEditorMode("wysiwyg");
  openFileInEditor("0.1_Introduction.md");
  const msgBox = document.getElementById("ide-chat-messages");
  msgBox.innerHTML = `
    <div class="msg-user">Tôi mới dùng phần mềm nên lúc nãy lỡ tay bấm tắt mất cột cây thư mục bên trái, làm sao để mở lại nhanh và bật chế độ xem đẹp (Preview) cho tệp Markdown?</div>
    <div class="msg-ai">
      <div class="progress-card">
        <div class="progress-card-title"><span>Hướng dẫn thao tác tại chỗ</span><span>Done ✓</span></div>
        <div class="progress-step">💡 Kiểm tra bố cục cửa sổ Antigravity IDE hiện tại</div>
        <div class="progress-step">✓ Trạng thái hiện tại: Cột cây thư mục bên trái và chế độ <strong>Open Preview (Ctrl+Shift+V)</strong> đã được bật sẵn sàng</div>
      </div>
      <p><strong>Cách mở lại ngay trong 2 giây:</strong></p>
      <ul style="margin-left:18px; line-height:1.6;">
        <li>Nhấn tổ hợp phím <kbd>Ctrl + B</kbd> (hoặc bấm biểu tượng 2 tệp giấy ở thanh ngoài cùng bên trái) để bật lại cột cây thư mục.</li>
        <li>Để xem tệp <code>.md</code> trực quan như Google Docs, bạn <strong>nhấp chuột phải vào thanh tiêu đề Tab của tệp ở cột giữa</strong> và chọn dòng <strong>Open Preview</strong> (hoặc nhấn phím tắt <kbd>Ctrl + Shift + V</kbd>).</li>
      </ul>
    </div>`;
  document.getElementById("ide-chat-input").value = "";
}
