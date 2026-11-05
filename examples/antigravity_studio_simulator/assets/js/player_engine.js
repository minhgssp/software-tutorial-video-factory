/* =========================================================================
   assets/js/player_engine.js
   Động cơ Điều Khiển Bài Giảng Tương Tác (Audio-Driven Master Clock v2):
   1. Bố cục Sidebar Trái (#kudo-left-sidebar) chứa thanh điều khiển & danh sách phần nhỏ.
   2. Nút âm thanh hiển thị trực diện: "🔇 Tắt tiếng" (khi đang mở) / "🔊 Bật tiếng" (khi đang tắt).
   3. Chốt chặn cứng Audio-First Lock: Khi đang bật tiếng, tuyệt đối KHÔNG tự động chuyển cảnh
      hoặc kết thúc bài khi giọng đọc chưa kết thúc (vp.ended !== true).
      Chỉ sau khi vp.ended === true mới đếm 0.60s nghỉ lấy hơi rồi chuyển sang phần tiếp theo.
   4. Khi bấm "🔊 Bật tiếng", lập tức đồng bộ kudoBeatElapsed = vp.currentTime để không bao giờ
      xảy ra tình trạng hình chạy trước tiếng làm cắt cụt đuôi câu nói.
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
      // Đồng bộ lại đồng hồ cảnh đúng bằng vị trí thực của âm thanh để không bị cắt sớm
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
  // Nếu học viên chủ động click tương tác bên trong khu vực mô phỏng (#kudo-stage-viewport),
  // lập tức ẩn con trỏ giả lập và nhãn gợi ý để không che khuất vùng đang thao tác
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

function kudoRenderTimelineBar() {
  const wrap = document.getElementById("kp-timeline-segs");
  if (!wrap || !window.KUDO_SPEC) return;
  wrap.innerHTML = KUDO_SPEC.beats.map((b, idx) => `
    <div class="kp-seg" id="kp-seg-${idx}" role="button" tabindex="0" aria-label="${b.label} (${Math.round(b.duration)} giây)" onclick="kudoOnSegmentClick(${idx}, event)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();kudoOnSegmentClick(${idx},event);}" title="${b.label} (${b.duration}s) — Bấm để chuyển cảnh hoặc tua trong phần đang phát">
      <div class="kp-seg-fill" id="kp-fill-${idx}"></div>
      <div class="kp-seg-top">
        <span class="kp-seg-title">${b.label}</span>
        <span class="kp-seg-dur">${Math.round(b.duration)}s</span>
      </div>
    </div>
  `).join("");
}

function kudoOnSegmentClick(idx, ev) {
  if (idx !== kudoCurrentBeatIdx) {
    kudoJumpToBeat(idx);
    return;
  }
  const seg = document.getElementById(`kp-seg-${idx}`);
  if (!seg || !ev) return;
  const rect = seg.getBoundingClientRect();
  if (!rect || rect.width <= 0) return;
  const clientX = (typeof ev.clientX === "number" && ev.clientX > 0) ? ev.clientX : rect.left;
  const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
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

function kudoApplyBeat(idx) {
  if (!window.KUDO_SPEC || idx < 0 || idx >= KUDO_SPEC.beats.length) return;
  kudoCurrentBeatIdx = idx;
  kudoBeatElapsed = 0;
  kudoPostSpeechElapsed = 0;
  window.kudoSpeechCompletedForBeat = false;
  window.kudoUserInteractedInSim = false;
  const beat = KUDO_SPEC.beats[idx];
  window.kudoActiveAnchorBeat = beat;

  document.getElementById("kudo-lesson-code").textContent = KUDO_SPEC.code;
  document.getElementById("kudo-lesson-title").textContent = KUDO_SPEC.title;
  document.getElementById("kudo-scene-indicator").textContent = `Phần ${idx + 1}/${KUDO_SPEC.beats.length}`;

  document.getElementById("kudo-subtitle-box").innerHTML = `<span class="sub-speaker">▶</span>${beat.caption}`;
  kudoSetAvatarPose(beat.pose || ((idx % 8) + 1));

  const stage = document.getElementById("kudo-theory-stage");
  const slideBox = document.getElementById("kudo-slide-box");
  const rig = document.getElementById("kudo-avatar-rig");
  const spot = document.getElementById("kudo-spotlight");
  const cur = document.getElementById("kudo-cursor");

  rig.classList.toggle("speaking", kudoIsPlaying);
  kudoSyncVoiceForBeat(beat, true);

  if (beat.mode === "theory") {
    kudoHidePopovers();
    stage.classList.remove("hidden-stage");
    spot.classList.remove("visible");
    cur.classList.remove("visible");

    const slideHtml = KUDO_SPEC.slides[beat.slide] || "";
    slideBox.innerHTML = slideHtml;

    const hlList = Array.isArray(beat.hl)
      ? beat.hl
      : (beat.hl ? [beat.hl] : (beat.focus_selectors || []).map(s => s.replace(/^#/, "")));
    let maxActiveOrder = 1;
    hlList.forEach(hid => {
      const tel = document.getElementById(hid);
      if (tel) {
        const ord = parseInt(tel.getAttribute("data-order") || "1", 10);
        if (ord > maxActiveOrder) maxActiveOrder = ord;
      }
    });

    slideBox.querySelectorAll(".k-step-item").forEach(el => {
      const ord = parseInt(el.getAttribute("data-order") || "1", 10);
      el.classList.remove("k-hl", "k-visited", "k-unreached");
      if (hlList.includes(el.id)) {
        el.classList.add("k-hl");
      } else if (ord < maxActiveOrder) {
        el.classList.add("k-visited");
      } else {
        el.classList.add("k-unreached");
      }
    });
  } else {
    stage.classList.add("hidden-stage");

    if (beat.onEnter) {
      try {
        eval(beat.onEnter);
      } catch (e) {
        console.error(e);
      }
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
      // KHI ĐANG BẬT TIẾNG: Thẻ <audio> là Đồng hồ chủ (Audio-Driven Master Clock) duy nhất!
      const realAudioDur = (Number.isFinite(vp.duration) && vp.duration > 0)
        ? vp.duration
        : (curBeat.audio_duration || Math.max(1, curBeat.duration - 0.65));

      if (!vp.ended) {
        // Giọng thuyết minh vẫn đang nói -> Đồng bộ trực tiếp với vp.currentTime và CẤM chuyển cảnh
        kudoBeatElapsed = vp.currentTime || 0;
        kudoPostSpeechElapsed = 0;
        if (rig) rig.classList.toggle("speaking", !vp.paused);
        kudoUpdateClockUi();
        return;
      } else {
        // Giọng thuyết minh đã đọc xong 100% câu -> Ẩn ngay con chuột & tip, khép môi nhân vật và nghỉ 0.60s
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

    // KHI ĐANG TẮT TIẾNG HOẶC CHỜ MỞ KHÓA AUTOPLAY: Đếm theo thời lượng chuẩn
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
  const tag = (ev.target && ev.target.tagName) ? ev.target.tagName.toUpperCase() : "";
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || (ev.target && ev.target.isContentEditable)) return;
  if (ev.code === "Space") {
    ev.preventDefault();
    kudoTogglePlay();
  } else if (ev.code === "ArrowLeft") {
    ev.preventDefault();
    kudoPrevBeat();
  } else if (ev.code === "ArrowRight") {
    ev.preventDefault();
    kudoNextBeat();
  } else if (ev.code === "KeyM" && !ev.ctrlKey && !ev.metaKey && !ev.altKey) {
    ev.preventDefault();
    kudoToggleMute();
  } else if (ev.code === "KeyC" && !ev.ctrlKey && !ev.metaKey && !ev.altKey) {
    ev.preventDefault();
    kudoToggleCursorMode();
  }
});

window.addEventListener("DOMContentLoaded", () => {
  if (typeof liveAnimMode !== "undefined") liveAnimMode = false;
  kudoMountSurfacesIntoStage();
  kudoApplyBrandAndLessonSelector();
  kudoUpdateMuteUi();
  kudoUpdateCursorBtnUi();
  setTimeout(() => {
    kudoRenderTimelineBar();
    kudoApplyBeat(0);
    kudoStartLoop();
  }, 120);
});
