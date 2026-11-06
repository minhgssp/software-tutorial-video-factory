/* =========================================================================
   assets/js/player_engine.js
   Động cơ Điều Khiển Bài Giảng Tương Tác (Audio-Driven Master Clock v3.1):
   1. Bố cục Sidebar Trái (#kudo-left-sidebar) dạng Cây Đa Cấp (Chương ▸ Bài ▸ Phần nhỏ)
      kèm nút « Ẩn [ / ☰ Hiện mục lục [ (phím tắt [).
   2. Kịch bản Thực hành 2 Pha (kudoSyncBeatChoreography: Pha 1 Di chuột & Click nút gốc -> Pha 2 Mở Menu & Chọn lệnh).
   3. Progressive Reveal cho Slide Lý thuyết (kudoUpdateTheoryProgressiveReveal).
   4. Chốt chặn cứng PROP-261106-01 Rule 4: Tuyệt đối không hiển thị hộp thoại nổi (#kudo-stage-pedagogy-card)
      đè lên màn hình minh họa.
   ========================================================================= */
let kudoCurrentBeatIdx = 0;
let kudoIsPlaying = true;
let kudoIsMuted = false;
let kudoAutoplayBlocked = false;
let kudoSpeed = 1.0;
let kudoBeatElapsed = 0;
let kudoPostSpeechElapsed = 0;
let kudoTickTimer = null;
window.kudoActiveAnchorBeat = null;
window.kudoSpeechCompletedForBeat = false;
window.kudoUserInteractedInSim = false;
window.kudoHideCursorAndTip = false;
try {
  window.kudoHideCursorAndTip = localStorage.getItem("kudo_hide_cursor_tip_v1") === "1";
} catch (e) {}

function kudoUpdateCursorBtnUi() {
  const btn = document.getElementById("kp-cursor-btn");
  if (!btn) return;
  if (window.kudoHideCursorAndTip) {
    btn.textContent = "🖱️ Hiện chuột [C]";
    btn.classList.add("cursor-hidden-mode");
  } else {
    btn.textContent = "🖱️ Ẩn chuột [C]";
    btn.classList.remove("cursor-hidden-mode");
  }
}

function kudoToggleCursorMode() {
  window.kudoHideCursorAndTip = !window.kudoHideCursorAndTip;
  if (!window.kudoHideCursorAndTip) {
    window.kudoUserInteractedInSim = false;
  }
  try {
    localStorage.setItem("kudo_hide_cursor_tip_v1", window.kudoHideCursorAndTip ? "1" : "0");
  } catch (e) {}
  kudoUpdateCursorBtnUi();
  kudoSyncDomAnchors();
}

function kudoGetVoicePlayer() {
  return document.getElementById("kudo-voice-player");
}

function kudoUpdateMuteUi() {
  const btn = document.getElementById("kp-mute-btn");
  if (!btn) return;
  if (kudoIsMuted || kudoAutoplayBlocked) {
    btn.textContent = "🔊 Bật tiếng";
    btn.classList.add("muted-state");
  } else {
    btn.textContent = "🔇 Tắt tiếng";
    btn.classList.remove("muted-state");
  }
}

function kudoSyncVoiceForBeat(beat, resetTime) {
  const vp = kudoGetVoicePlayer();
  if (!vp) return;
  kudoPostSpeechElapsed = 0;
  if (!beat || !beat.audio_src) {
    vp.pause();
    return;
  }
  const wantSrc = beat.audio_src;
  if (vp.getAttribute("data-beat-src") !== wantSrc) {
    vp.setAttribute("data-beat-src", wantSrc);
    vp.src = wantSrc;
  }
  if (resetTime) {
    try { vp.currentTime = 0; } catch (e) {}
  }
  vp.muted = kudoIsMuted;
  vp.playbackRate = kudoSpeed;
  if (kudoIsPlaying && !kudoIsMuted) {
    const p = vp.play();
    if (p && typeof p.then === "function") {
      p.then(() => {
        kudoAutoplayBlocked = false;
        kudoUpdateMuteUi();
      }).catch(() => {
        kudoAutoplayBlocked = true;
        kudoUpdateMuteUi();
      });
    }
  } else {
    vp.pause();
  }
}

function kudoToggleMute() {
  const vp = kudoGetVoicePlayer();
  if (kudoAutoplayBlocked || kudoIsMuted) {
    kudoIsMuted = false;
    kudoAutoplayBlocked = false;
    if (vp) {
      vp.muted = false;
      vp.playbackRate = kudoSpeed;
      kudoBeatElapsed = vp.currentTime || 0;
      kudoPostSpeechElapsed = 0;
      if (kudoIsPlaying) {
        vp.play().catch(() => {});
      }
    }
    kudoUpdateMuteUi();
    return;
  }
  kudoIsMuted = true;
  if (vp) {
    vp.muted = true;
    vp.pause();
  }
  kudoUpdateMuteUi();
}

document.addEventListener("click", (ev) => {
  if (ev.target && (ev.target.id === "kp-mute-btn" || ev.target.closest("#kp-mute-btn"))) return;
  if (ev.target && (ev.target.id === "kp-cursor-btn" || ev.target.closest("#kp-cursor-btn"))) return;
  if (ev.target && ev.target.closest("#kudo-stage-viewport") && window.kudoActiveAnchorBeat && window.kudoActiveAnchorBeat.mode === "sim") {
    window.kudoUserInteractedInSim = true;
    const cur = document.getElementById("kudo-cursor");
    if (cur) cur.classList.remove("visible");
  }
  if (kudoAutoplayBlocked && kudoIsPlaying && !kudoIsMuted) {
    const vp = kudoGetVoicePlayer();
    if (vp && vp.paused) {
      vp.muted = false;
      vp.playbackRate = kudoSpeed;
      kudoBeatElapsed = vp.currentTime || 0;
      kudoPostSpeechElapsed = 0;
      vp.play().then(() => {
        kudoAutoplayBlocked = false;
        kudoUpdateMuteUi();
      }).catch(() => {});
    }
  }
});

function kudoApplyBrandAndLessonSelector() {
  if (window.KUDO_BRAND_CONFIG) {
    const bc = window.KUDO_BRAND_CONFIG;
    const logoBox = document.getElementById("ksb-logo-box");
    const brandName = document.getElementById("ksb-brand-name");
    const brandSub = document.getElementById("ksb-brand-sub");
    if (logoBox) {
      if (bc.logo_image_url) {
        logoBox.innerHTML = `<img src="${bc.logo_image_url}" alt="Logo">`;
      } else {
        logoBox.textContent = bc.logo_text || "A";
      }
    }
    if (brandName && bc.course_name) brandName.textContent = bc.course_name;
    if (brandSub && bc.organization) brandSub.textContent = bc.organization;
  }

  const sel = document.getElementById("ksb-lesson-select");
  if (sel && Array.isArray(window.KUDO_COURSE_MANIFEST) && window.KUDO_SPEC) {
    sel.innerHTML = window.KUDO_COURSE_MANIFEST.map(item => {
      const selected = item.filename === window.KUDO_SPEC.filename ? "selected" : "";
      return `<option value="${item.filename}" ${selected}>${item.code} — ${item.short_title || item.title}</option>`;
    }).join("");
  }
}

function kudoSwitchLessonFromSidebar(filename) {
  if (!filename || (window.KUDO_SPEC && filename === window.KUDO_SPEC.filename)) return;
  try {
    if (window.self !== window.top && window.parent) {
      window.parent.postMessage({ type: "KUDO_SWITCH_LESSON", filename: filename }, "*");
    }
  } catch (e) {}
  window.location.href = filename;
}

function kudoMountSurfacesIntoStage() {
  document.body.classList.add("kudo-lesson-body");
  try {
    if (window.self !== window.top) {
      document.body.classList.add("in-iframe");
    }
  } catch (e) {}
  document.body.classList.remove("laser-pointer-active");
  const avatarStage = document.querySelector("#kudo-avatar-rig .k-avatar-svg-stage");
  if (avatarStage && !avatarStage.innerHTML.trim() && window.KUDO_LECTURER_POSES_SVG) {
    avatarStage.innerHTML = window.KUDO_LECTURER_POSES_SVG;
  }
  const stage = document.getElementById("kudo-stage-viewport");
  const mgr = document.getElementById("surface-mgr");
  const ide = document.getElementById("surface-ide");
  if (stage && mgr && mgr.parentElement !== stage) {
    stage.appendChild(mgr);
  }
  if (stage && ide && ide.parentElement !== stage) {
    stage.appendChild(ide);
  }
}

function kudoSetAvatarPose(poseNum) {
  const p = poseNum || 1;
  document.querySelectorAll("#kudo-avatar-rig svg.kudo-char-pose").forEach(svg => {
    svg.classList.toggle("active-pose", String(svg.getAttribute("data-pose")) === String(p));
  });
}

function kudoToggleSidebarCollapse() {
  document.body.classList.toggle("kudo-sidebar-collapsed");
  setTimeout(kudoSyncDomAnchors, 220);
}

function kudoRenderTimelineBar() {
  const wrap = document.getElementById("kp-timeline-segs");
  if (!wrap || !window.KUDO_SPEC) return;

  const segHeader = document.querySelector(".ksb-segments-header");
  if (segHeader && !document.getElementById("kudo-collapse-sb-btn")) {
    const collapseBtn = document.createElement("button");
    collapseBtn.id = "kudo-collapse-sb-btn";
    collapseBtn.className = "kp-btn";
    collapseBtn.style.cssText = "padding:3px 8px;min-height:24px;font-size:11.5px;";
    collapseBtn.innerHTML = "« Ẩn [";
    collapseBtn.title = "Ẩn cây mục lục bên trái (Phím tắt: [)";
    collapseBtn.onclick = kudoToggleSidebarCollapse;
    segHeader.appendChild(collapseBtn);
  }

  const rightMain = document.getElementById("kudo-right-main");
  if (rightMain && !document.getElementById("kudo-expand-sidebar-btn")) {
    const expBtn = document.createElement("button");
    expBtn.id = "kudo-expand-sidebar-btn";
    expBtn.innerHTML = "☰ Hiện mục lục [";
    expBtn.title = "Hiện lại cây mục lục bên trái (Phím tắt: [)";
    expBtn.onclick = kudoToggleSidebarCollapse;
    rightMain.appendChild(expBtn);
  }

  const beatsHtml = KUDO_SPEC.beats.map((b, idx) => `
    <div class="kp-seg" id="kp-seg-${idx}" role="button" tabindex="0" aria-label="${b.label} (${Math.round(b.duration)} giây)" onclick="kudoOnSegmentClick(${idx}, event)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();kudoOnSegmentClick(${idx},event);}" title="${b.label} (${b.duration}s) — Bấm để chuyển cảnh hoặc tua trong phần đang phát">
      <div class="kp-seg-fill" id="kp-fill-${idx}"></div>
      <div class="kp-seg-top">
        <span class="kp-seg-title">${b.label}</span>
        <span class="kp-seg-dur">${Math.round(b.duration)}s</span>
      </div>
    </div>
  `).join("");

  const manifest = Array.isArray(window.KUDO_COURSE_MANIFEST) ? window.KUDO_COURSE_MANIFEST : [];
  if (manifest.length === 0) {
    wrap.innerHTML = beatsHtml;
    return;
  }

  const chapMap = new Map();
  manifest.forEach(item => {
    const chNum = item.chapter_number || 1;
    if (!chapMap.has(chNum)) {
      chapMap.set(chNum, {
        chapter_number: chNum,
        chapter_code: item.chapter_code || ("CHƯƠNG " + chNum),
        chapter_title: item.chapter_title || "",
        lessons: []
      });
    }
    chapMap.get(chNum).lessons.push(item);
  });

  const curFilename = window.KUDO_SPEC.filename || "lesson_01.html";
  const curChapNum = window.KUDO_SPEC.chapter_number || 1;

  let treeHtml = "";
  chapMap.forEach((ch) => {
    const isOpen = (ch.chapter_number === curChapNum);
    const lessonsHtml = ch.lessons.map(ls => {
      const isCur = (ls.filename === curFilename);
      return `
        <div>
          <div class="k-tree-lesson-row ${isCur ? 'active-lesson' : ''}" onclick="${isCur ? '' : `kudoSwitchLessonFromSidebar('${ls.filename}')`}">
            <span>${isCur ? '▾' : '▸'} <strong>${ls.code}:</strong> ${ls.short_title || ls.title}</span>
          </div>
          ${isCur ? `<div class="k-tree-beats-sublist">${beatsHtml}</div>` : ''}
        </div>
      `;
    }).join("");

    treeHtml += `
      <div class="k-tree-chapter ${isOpen ? 'open' : ''}">
        <div class="k-tree-chap-head" onclick="this.parentElement.classList.toggle('open')">
          <span>${ch.chapter_code}${ch.chapter_title ? ': ' + ch.chapter_title : ''}</span>
          <span>▾</span>
        </div>
        <div class="k-tree-chap-lessons">
          ${lessonsHtml}
        </div>
      </div>
    `;
  });

  wrap.innerHTML = treeHtml;
}

function kudoOnSegmentClick(idx, ev) {
  if (idx !== kudoCurrentBeatIdx) {
    kudoJumpToBeat(idx);
    return;
  }
  const seg = document.getElementById(`kp-seg-${idx}`);
  if (!seg || !ev) return;
  const r = seg.getBoundingClientRect();
  if (r.width <= 0) return;
  const ratio = Math.max(0, Math.min(0.98, (ev.clientX - r.left) / r.width));
  const curBeat = KUDO_SPEC.beats[kudoCurrentBeatIdx];
  const curDur = kudoGetEffectiveBeatDuration(curBeat);
  const targetSec = ratio * curDur;
  kudoBeatElapsed = targetSec;
  kudoPostSpeechElapsed = 0;
  window.kudoSpeechCompletedForBeat = false;
  window.kudoUserInteractedInSim = false;
  const vp = kudoGetVoicePlayer();
  if (vp && Number.isFinite(vp.duration) && vp.duration > 0) {
    try { vp.currentTime = Math.min(vp.duration - 0.05, targetSec); } catch (e) {}
  }
  kudoSyncDomAnchors();
  kudoUpdateClockUi();
}

function kudoUpdateTheoryProgressiveReveal() {
  if (!window.KUDO_SPEC) return;
  const beat = KUDO_SPEC.beats[kudoCurrentBeatIdx];
  if (!beat || beat.mode !== "theory") return;
  const slideBox = document.getElementById("kudo-slide-box");
  if (!slideBox) return;
  const stepItems = Array.from(slideBox.querySelectorAll(".k-step-item"));
  if (!stepItems.length) return;

  const curDur = Math.max(4, kudoGetEffectiveBeatDuration(beat) - 0.65);
  const ratio = Math.max(0, Math.min(1, kudoBeatElapsed / curDur));
  const hlList = Array.isArray(beat.hl) ? beat.hl : (beat.hl ? [beat.hl] : []);

  const hasHero = slideBox.querySelector("#s1_hero") !== null;
  const isPart1Split = hlList.includes("s1_c1") && !hlList.includes("s1_c2");
  const isPart2Split = hlList.includes("s1_c2") && !hlList.includes("s1_c1");

  let activeIds = [];
  let visitedIds = [];

  if (isPart1Split && hasHero) {
    if (ratio < 0.38) {
      activeIds = ["s1_hero"];
      visitedIds = [];
    } else {
      activeIds = ["s1_c1"];
      visitedIds = ["s1_hero"];
    }
  } else if (isPart2Split && hasHero) {
    if (ratio < 0.36) {
      activeIds = ["s1_c2"];
      visitedIds = ["s1_hero", "s1_c1"];
    } else if (ratio < 0.68) {
      activeIds = ["s1_c3"];
      visitedIds = ["s1_hero", "s1_c1", "s1_c2"];
    } else {
      activeIds = ["s1_c3", "s1_call"];
      visitedIds = ["s1_hero", "s1_c1", "s1_c2"];
    }
  } else if (hasHero && stepItems.length >= 5) {
    if (ratio < 0.22) {
      activeIds = ["s1_hero"];
      visitedIds = [];
    } else if (ratio < 0.48) {
      activeIds = ["s1_c1"];
      visitedIds = ["s1_hero"];
    } else if (ratio < 0.74) {
      activeIds = ["s1_c2"];
      visitedIds = ["s1_hero", "s1_c1"];
    } else {
      activeIds = ["s1_c3", "s1_call"];
      visitedIds = ["s1_hero", "s1_c1", "s1_c2"];
    }
  } else if (hlList.length > 0) {
    activeIds = hlList;
  }

  let maxActiveOrder = 1;
  activeIds.forEach(hid => {
    const tel = document.getElementById(hid);
    if (tel) {
      const ord = parseInt(tel.getAttribute("data-order") || "1", 10);
      if (ord > maxActiveOrder) maxActiveOrder = ord;
    }
  });

  stepItems.forEach(el => {
    const ord = parseInt(el.getAttribute("data-order") || "1", 10);
    el.classList.remove("k-hl", "k-visited", "k-unreached");
    if (activeIds.includes(el.id)) {
      el.classList.add("k-hl");
    } else if (visitedIds.includes(el.id) || ord < maxActiveOrder) {
      el.classList.add("k-visited");
    } else {
      el.classList.add("k-unreached");
    }
  });
}

function kudoRunPhase1Setup(beat) {
  window.kudoTypingTargetEl = null;
  window.kudoTypingFullText = "";
  window.kudoPhase2TargetRippleFired = false;
  window.kudoLastSimSceneCfg = null;
  if (beat.onEnterPhase1) {
    try { eval(beat.onEnterPhase1); } catch (e) { console.error(e); }
    return;
  }
  if (beat.pre_click_selector) {
    if (beat.onEnter) {
      try { eval(beat.onEnter); } catch (e) { console.error(e); }
    }
    const preSel = String(beat.pre_click_selector || "");
    const curSel = String(beat.cursor_selector || "");
    const cfg = window.kudoLastSimSceneCfg || {};
    const ta1 = document.getElementById("ide-chat-input");
    const ta2 = document.getElementById("agy2-chat-input");
    const fullChat = ta1 ? ta1.value : "";

    const dfMatch = (preSel + " " + curSel).match(/\[data-file=['"]([^'"]+)['"]\]/);
    if (dfMatch && dfMatch[1] && typeof kudoEnsureTreeFileVisible === "function") {
      kudoEnsureTreeFileVisible(dfMatch[1], Boolean(cfg.activeTreeFile || cfg.editorHtml));
    }

    if (preSel.includes("#ide-popup-menu") || cfg.popupMode) {
      if (typeof kudoOpenDynamicPopup === "function") {
        kudoOpenDynamicPopup(cfg.popupMode || (fullChat.trim().startsWith("/") ? "slash" : "mention"), fullChat);
      }
      return;
    }

    try { kudoHidePopovers(); } catch (e) {}

    if (preSel.includes("[data-file=") && curSel === "#editor-canvas") {
      const fname = dfMatch ? dfMatch[1] : "tệp dữ liệu";
      const canvas = document.getElementById("editor-canvas");
      if (canvas) {
        canvas.innerHTML = `<div style="padding:36px 28px;display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;color:#64748B;text-align:center;background:#FAF8F5;"><div style="font-size:28px;margin-bottom:10px;">📂</div><div style="font-size:14px;font-weight:700;color:#1E293B;margin-bottom:6px;">Đang chọn tệp <code style="color:#EA580C;background:#FFF7ED;padding:2px 6px;border-radius:4px;">${fname}</code> ở Cây thư mục bên trái</div><div style="font-size:12.5px;color:#64748B;">Nhấp chuột vào tên tệp để mở toàn bộ nội dung tại khung soạn thảo cột giữa...</div></div>`;
      }
      return;
    }

    if (preSel === "#act-btn-extensions" || preSel === "#act-btn-git") {
      if (typeof switchIdeSidebarMode === "function") switchIdeSidebarMode("explorer");
      return;
    }

    if (preSel === "#ide-send-btn" && (curSel === "#editor-canvas" || curSel === "#ide-chat-messages" || curSel === "#ide-bottom-terminal")) {
      if (ta1 && cfg.userMsg && !cfg.chatInput) {
        ta1.value = String(cfg.userMsg).replace(/<[^>]+>/g, "");
      }
      const msgBox = document.getElementById("ide-chat-messages");
      if (msgBox && cfg.aiMsg) {
        msgBox.innerHTML = `<div style="padding:14px;color:#64748B;font-size:12.5px;font-style:italic;">⏳ Nhấp nút Gửi (→) bên dưới để Trợ lý AI bắt đầu xử lý yêu cầu...</div>`;
      }
      const term = document.getElementById("ide-bottom-terminal");
      if (term && cfg.showTerminal) {
        term.style.display = "none";
      }
      return;
    }

    if (ta1 && preSel === "#ide-chat-input") ta1.value = "";
    if (ta2 && preSel === "#agy2-chat-input") ta2.value = "";
  }
}

function kudoCapturePhase2Setup(beat) {
  window.kudoTypingTargetEl = null;
  window.kudoTypingFullText = "";
  window.kudoPhase2TargetRippleFired = false;
  window.kudoLastSimSceneCfg = null;
  if (beat.onEnter) {
    try { eval(beat.onEnter); } catch (e) { console.error(e); }
  }
  const preSel = String(beat.pre_click_selector || "");
  const curSel = String(beat.cursor_selector || "");
  const dfMatch = (preSel + " " + curSel).match(/\[data-file=['"]([^'"]+)['"]\]/);
  if (dfMatch && dfMatch[1] && typeof kudoEnsureTreeFileVisible === "function") {
    const cfg = window.kudoLastSimSceneCfg || {};
    kudoEnsureTreeFileVisible(dfMatch[1], Boolean(cfg.activeTreeFile || cfg.editorHtml));
  }
  if (preSel.includes("#ide-popup-menu") && !curSel.includes("#ide-popup-menu")) {
    const pop = document.getElementById("ide-popup-menu");
    if (pop) pop.classList.remove("visible");
  }
  if (beat.cursor_selector === "#ktp-turbo") {
    kudoSetTurboPopoverState("default");
  }
  const ideSurf = document.getElementById("surface-ide");
  const isIde = ideSurf && ideSurf.classList.contains("active");
  const ta = isIde ? document.getElementById("ide-chat-input") : document.getElementById("agy2-chat-input");
  if (ta && ta.value && ta.value.trim().length > 0) {
    const onEnterStr = String(beat.onEnter || "");
    if (onEnterStr.includes("chatInput") || onEnterStr.includes("chat-input") || onEnterStr.includes("Popup") || preSel.includes("chat-input") || preSel.includes("#ide-popup-menu")) {
      window.kudoTypingTargetEl = ta;
      window.kudoTypingFullText = ta.value;
    }
  }
}

function kudoSyncBeatChoreography() {
  if (!window.KUDO_SPEC) return;
  const beat = KUDO_SPEC.beats[kudoCurrentBeatIdx];
  if (!beat || beat.mode !== "sim") return;

  const hasPhase1 = Boolean(beat.onEnterPhase1 || beat.pre_click_selector);
  const phase1SplitSec = hasPhase1 ? (typeof beat.choreo_split_sec === "number" ? beat.choreo_split_sec : 1.85) : 0;
  const rippleSec = Math.max(0.75, phase1SplitSec - 0.55);

  if (hasPhase1 && kudoBeatElapsed < phase1SplitSec) {
    if (!window.kudoInChoreoPhase1 || window.kudoChoreoPhase2Applied) {
      window.kudoInChoreoPhase1 = true;
      window.kudoChoreoPhase2Applied = false;
      window.kudoChoreoRippleFired = false;
      kudoRunPhase1Setup(beat);
      requestAnimationFrame(() => {
        kudoSyncDomAnchors();
      });
    } else if (kudoBeatElapsed >= rippleSec && !window.kudoChoreoRippleFired) {
      window.kudoChoreoRippleFired = true;
      if (typeof kudoTriggerClickRipple === "function") {
        kudoTriggerClickRipple();
      }
    }
    return;
  }

  if (window.kudoInChoreoPhase1 || !window.kudoChoreoPhase2Applied) {
    window.kudoInChoreoPhase1 = false;
    window.kudoChoreoPhase2Applied = true;
    if (hasPhase1 && !window.kudoChoreoRippleFired && typeof kudoTriggerClickRipple === "function") {
      window.kudoChoreoRippleFired = true;
      kudoTriggerClickRipple();
    }
    kudoCapturePhase2Setup(beat);
    requestAnimationFrame(() => {
      kudoSyncDomAnchors();
      setTimeout(kudoSyncDomAnchors, 50);
    });
  }

  const p2Elapsed = Math.max(0, kudoBeatElapsed - phase1SplitSec);
  const ta = window.kudoTypingTargetEl;
  const fullText = window.kudoTypingFullText || "";
  if (ta && fullText.length > 0) {
    const typeDur = Math.min(1.8, Math.max(0.7, fullText.length * 0.045));
    if (p2Elapsed < typeDur) {
      const nChars = Math.max(1, Math.ceil((p2Elapsed / typeDur) * fullText.length));
      ta.value = fullText.slice(0, nChars);
      ta.classList.add("kudo-typing-active");
    } else {
      if (ta.value !== fullText) ta.value = fullText;
      ta.classList.remove("kudo-typing-active");
    }
  }

  const targetClickSec = (ta && fullText.length > 0) ? 1.85 : 1.35;
  if (p2Elapsed >= targetClickSec && !window.kudoPhase2TargetRippleFired) {
    window.kudoPhase2TargetRippleFired = true;
    if (beat.cursor_selector === "#ktp-turbo") {
      kudoSetTurboPopoverState("turbo");
    }
    if (typeof kudoTriggerClickRipple === "function") {
      kudoTriggerClickRipple();
    }
    kudoSyncDomAnchors();
  }
}

window.kudoAdvanceToChoreoPhase2 = function() {
  if (!window.KUDO_SPEC) return;
  const beat = KUDO_SPEC.beats[kudoCurrentBeatIdx];
  if (!beat || beat.mode !== "sim") return;
  window.kudoInChoreoPhase1 = false;
  window.kudoChoreoPhase2Applied = true;
  window.kudoPhase2TargetRippleFired = true;
  if (beat.onEnter) {
    try { eval(beat.onEnter); } catch (e) {}
  }
  if (beat.cursor_selector === "#ktp-turbo") {
    kudoSetTurboPopoverState("turbo");
  }
  if (window.kudoTypingTargetEl) {
    window.kudoTypingTargetEl.classList.remove("kudo-typing-active");
  }
  kudoSyncDomAnchors();
};

function kudoApplyBeat(idx) {
  if (!window.KUDO_SPEC || idx < 0 || idx >= KUDO_SPEC.beats.length) return;
  kudoCurrentBeatIdx = idx;
  kudoBeatElapsed = 0;
  kudoPostSpeechElapsed = 0;
  window.kudoSpeechCompletedForBeat = false;
  window.kudoUserInteractedInSim = false;
  const beat = KUDO_SPEC.beats[idx];
  window.kudoActiveAnchorBeat = beat;
  window.kudoInChoreoPhase1 = Boolean(beat.mode === "sim" && (beat.onEnterPhase1 || beat.pre_click_selector));
  window.kudoChoreoPhase2Applied = false;
  window.kudoChoreoRippleFired = false;

  document.getElementById("kudo-lesson-code").textContent = (KUDO_SPEC.chapter_code ? KUDO_SPEC.chapter_code + " · " : "") + KUDO_SPEC.code;
  document.getElementById("kudo-lesson-title").textContent = KUDO_SPEC.title;
  document.getElementById("kudo-scene-indicator").textContent = `Phần ${idx + 1}/${KUDO_SPEC.beats.length}`;

  const depBox = document.getElementById("ksb-dep-box");
  if (depBox) {
    depBox.style.display = "none";
  }

  document.getElementById("kudo-subtitle-box").innerHTML = `<span class="sub-speaker">▶</span>${beat.caption}`;
  kudoSetAvatarPose(beat.pose || ((idx % 8) + 1));

  const stage = document.getElementById("kudo-theory-stage");
  const slideBox = document.getElementById("kudo-slide-box");
  const rig = document.getElementById("kudo-avatar-rig");
  const spot = document.getElementById("kudo-spotlight");
  const cur = document.getElementById("kudo-cursor");
  const pCard = document.getElementById("kudo-stage-pedagogy-card");

  rig.classList.toggle("speaking", kudoIsPlaying);
  kudoSyncVoiceForBeat(beat, true);

  if (beat.mode === "theory") {
    kudoHidePopovers();
    stage.classList.remove("hidden-stage");
    spot.classList.remove("visible");
    cur.classList.remove("visible");
    if (pCard) pCard.classList.remove("visible");

    const slideHtml = KUDO_SPEC.slides[beat.slide] || "";
    slideBox.innerHTML = slideHtml;
    kudoUpdateTheoryProgressiveReveal();
  } else {
    stage.classList.add("hidden-stage");
    // PROP-261106-01 Rule 4: Tuyệt đối không hiển thị hộp thoại nổi (#kudo-stage-pedagogy-card) đè lên màn hình minh họa.
    if (pCard) {
      pCard.classList.remove("visible");
      pCard.style.display = "none";
    }

    if (beat.onEnterPhase1 || beat.pre_click_selector) {
      kudoRunPhase1Setup(beat);
    } else {
      window.kudoChoreoPhase2Applied = true;
      kudoCapturePhase2Setup(beat);
    }

    requestAnimationFrame(() => {
      kudoSyncDomAnchors();
      setTimeout(kudoSyncDomAnchors, 60);
      setTimeout(kudoSyncDomAnchors, 220);
    });
  }

  KUDO_SPEC.beats.forEach((b, i) => {
    const seg = document.getElementById(`kp-seg-${i}`);
    const fill = document.getElementById(`kp-fill-${i}`);
    if (!seg || !fill) return;
    seg.classList.toggle("active", i === idx);
    seg.classList.toggle("done", i < idx);
    if (i < idx) fill.style.width = "100%";
    else fill.style.width = "0%";
    if (i === idx) {
      try { seg.scrollIntoView({ block: "nearest", behavior: "smooth" }); } catch (e) {}
    }
  });

  kudoUpdateClockUi();
}

function kudoFormatSec(sec) {
  const s = Math.max(0, Math.round(sec));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return String(m).padStart(2, "0") + ":" + String(r).padStart(2, "0");
}

function kudoGetEffectiveBeatDuration(beat) {
  const vp = kudoGetVoicePlayer();
  const realMediaDur = (vp && Number.isFinite(vp.duration) && vp.duration > 0) ? vp.duration : (beat.audio_duration || 0);
  return Math.max(beat.duration || 8, realMediaDur + 0.65);
}

function kudoUpdateClockUi() {
  const totalSec = KUDO_SPEC.beats.reduce((acc, b, i) => {
    return acc + (i === kudoCurrentBeatIdx ? kudoGetEffectiveBeatDuration(b) : b.duration);
  }, 0);
  let passedSec = 0;
  for (let i = 0; i < kudoCurrentBeatIdx; i++) {
    passedSec += KUDO_SPEC.beats[i].duration;
  }
  const curBeat = KUDO_SPEC.beats[kudoCurrentBeatIdx];
  const curDur = kudoGetEffectiveBeatDuration(curBeat);
  passedSec += Math.min(kudoBeatElapsed, curDur);
  document.getElementById("kp-time-label").textContent = `${kudoFormatSec(passedSec)} / ${kudoFormatSec(totalSec)}`;

  const pct = Math.min(100, (kudoBeatElapsed / curDur) * 100);
  const fill = document.getElementById(`kp-fill-${kudoCurrentBeatIdx}`);
  if (fill) fill.style.width = pct.toFixed(1) + "%";

  if (curBeat && curBeat.mode === "theory") {
    kudoUpdateTheoryProgressiveReveal();
  } else if (curBeat && curBeat.mode === "sim") {
    kudoSyncBeatChoreography();
  }
}

function kudoAdvanceOrFinish() {
  const vp = kudoGetVoicePlayer();
  const rig = document.getElementById("kudo-avatar-rig");
  const cur = document.getElementById("kudo-cursor");
  if (kudoCurrentBeatIdx < KUDO_SPEC.beats.length - 1) {
    kudoApplyBeat(kudoCurrentBeatIdx + 1);
  } else {
    kudoIsPlaying = false;
    window.kudoSpeechCompletedForBeat = true;
    if (vp) vp.pause();
    if (cur) cur.classList.remove("visible");
    document.getElementById("kp-play-btn").textContent = "↻ Phát lại";
    if (rig) rig.classList.remove("speaking");
    kudoUpdateClockUi();
  }
}

function kudoStartLoop() {
  if (kudoTickTimer) clearInterval(kudoTickTimer);
  kudoTickTimer = setInterval(() => {
    if (!kudoIsPlaying) return;
    const curBeat = KUDO_SPEC.beats[kudoCurrentBeatIdx];
    const vp = kudoGetVoicePlayer();
    const rig = document.getElementById("kudo-avatar-rig");
    const cur = document.getElementById("kudo-cursor");
    const hasActiveVoice = Boolean(vp && curBeat.audio_src && !kudoIsMuted && !kudoAutoplayBlocked && !vp.error);

    if (hasActiveVoice) {
      const realAudioDur = (Number.isFinite(vp.duration) && vp.duration > 0)
        ? vp.duration
        : (curBeat.audio_duration || Math.max(1, curBeat.duration - 0.65));

      if (!vp.ended) {
        kudoBeatElapsed = vp.currentTime || 0;
        kudoPostSpeechElapsed = 0;
        if (rig) rig.classList.toggle("speaking", !vp.paused);
        kudoUpdateClockUi();
        return;
      } else {
        if (rig) rig.classList.remove("speaking");
        if (!window.kudoSpeechCompletedForBeat) {
          window.kudoSpeechCompletedForBeat = true;
          if (cur) cur.classList.remove("visible");
        }
        kudoPostSpeechElapsed += 0.1 * kudoSpeed;
        kudoBeatElapsed = realAudioDur + kudoPostSpeechElapsed;
        if (kudoPostSpeechElapsed >= 0.60) {
          kudoAdvanceOrFinish();
        } else {
          kudoUpdateClockUi();
        }
        return;
      }
    }

    const voiceDur = curBeat.audio_duration || Math.max(1, curBeat.duration - 0.65);
    kudoBeatElapsed += 0.1 * kudoSpeed;
    if (rig) {
      rig.classList.toggle("speaking", kudoIsPlaying && (kudoBeatElapsed < voiceDur));
    }
    if (kudoBeatElapsed >= voiceDur && !window.kudoSpeechCompletedForBeat) {
      window.kudoSpeechCompletedForBeat = true;
      if (cur) cur.classList.remove("visible");
    }
    if (kudoBeatElapsed >= curBeat.duration) {
      kudoAdvanceOrFinish();
    } else {
      kudoUpdateClockUi();
    }
  }, 100);
}

function kudoTogglePlay() {
  const btn = document.getElementById("kp-play-btn");
  const rig = document.getElementById("kudo-avatar-rig");
  const vp = kudoGetVoicePlayer();
  const curBeat = KUDO_SPEC.beats[kudoCurrentBeatIdx];
  if (!kudoIsPlaying && kudoCurrentBeatIdx === KUDO_SPEC.beats.length - 1 && (kudoBeatElapsed >= curBeat.duration || (vp && vp.ended))) {
    kudoIsPlaying = true;
    btn.textContent = "⏸ Tạm dừng";
    rig.classList.add("speaking");
    kudoApplyBeat(0);
    return;
  }
  kudoIsPlaying = !kudoIsPlaying;
  btn.textContent = kudoIsPlaying ? "⏸ Tạm dừng" : "▶ Tiếp tục";
  rig.classList.toggle("speaking", kudoIsPlaying);
  if (vp) {
    if (kudoIsPlaying && !kudoIsMuted) {
      vp.playbackRate = kudoSpeed;
      vp.play().then(() => {
        kudoAutoplayBlocked = false;
        kudoUpdateMuteUi();
      }).catch(() => {});
    } else {
      vp.pause();
    }
  }
}

function kudoPrevBeat() {
  kudoApplyBeat(Math.max(0, kudoCurrentBeatIdx - 1));
}

function kudoNextBeat() {
  if (kudoCurrentBeatIdx < KUDO_SPEC.beats.length - 1) {
    kudoApplyBeat(kudoCurrentBeatIdx + 1);
  }
}

function kudoJumpToBeat(idx) {
  kudoApplyBeat(idx);
}

function kudoCycleSpeed() {
  const speeds = [1.0, 1.25, 1.5, 0.75];
  const nextIdx = (speeds.indexOf(kudoSpeed) + 1) % speeds.length;
  kudoSpeed = speeds[nextIdx];
  document.getElementById("kp-speed-btn").textContent = kudoSpeed + "x";
  const vp = kudoGetVoicePlayer();
  if (vp) vp.playbackRate = kudoSpeed;
}

window.addEventListener("resize", () => {
  kudoSyncDomAnchors();
});

window.addEventListener("keydown", (ev) => {
  if (ev.target && (ev.target.tagName === "INPUT" || ev.target.tagName === "TEXTAREA" || ev.target.tagName === "SELECT")) return;
  if (ev.code === "Space") {
    ev.preventDefault();
    kudoTogglePlay();
  } else if (ev.code === "ArrowRight") {
    ev.preventDefault();
    kudoNextBeat();
  } else if (ev.code === "ArrowLeft") {
    ev.preventDefault();
    kudoPrevBeat();
  } else if (ev.code === "KeyM") {
    ev.preventDefault();
    kudoToggleMute();
  } else if (ev.code === "KeyC") {
    ev.preventDefault();
    kudoToggleCursorMode();
  } else if (ev.key === "[") {
    ev.preventDefault();
    kudoToggleSidebarCollapse();
  }
});

window.addEventListener("DOMContentLoaded", () => {
  kudoMountSurfacesIntoStage();
  kudoApplyBrandAndLessonSelector();
  kudoUpdateMuteUi();
  kudoUpdateCursorBtnUi();
  kudoRenderTimelineBar();
  const params = new URLSearchParams(window.location.search);
  const startBeat = parseInt(params.get("beat") || "0", 10);
  const validStart = (!isNaN(startBeat) && window.KUDO_SPEC && startBeat >= 0 && startBeat < KUDO_SPEC.beats.length) ? startBeat : 0;
  kudoApplyBeat(validStart);
  kudoStartLoop();
});
