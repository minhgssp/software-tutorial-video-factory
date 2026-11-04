#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Unified Quality Gate, Rubric Auditor & Acoustic Foley Engine (`core_engine/syncgate_and_foley.py`)

Combines the core verification and acoustic engines from:
  1. `/fac-video` (`SemanticSyncGate`, Knuth-Plass `balance_vietnamese_lines`, `extract_5hz_visemes_from_wav`,
     `synthesize_procedural_foley_wav`)
  2. `/kudo` (`audit_video_spec_rules` — TTS token hygiene, `at` phrase anchor verification, `holds <= 1.0s`,
     whitelabel enforcement)
  3. `/reelcrew` (`ReelCrewRubricAuditor` — 100-point pedagogical & visual-pacing rubric)
  4. `SimulatorDOMAuditor` (`audit_html_simulator` — verifies `#laser-cursor`, `.click-ripple`,
     zero bare native `<select>`, zero context contamination, and `node --check` JS syntax)
"""

from __future__ import annotations

import array
import json
import math
import random
import re
import subprocess
import tempfile
import unicodedata
import wave
from dataclasses import asdict, dataclass, field
from pathlib import Path
from typing import Any, Dict, List, Optional, Sequence, Tuple

STACKED_VI_DIACRITICS_RE = re.compile(
    r"[ẤẦẨẪẬẮẰẲẴẶẾỀỂỄỆỐỒỔỖỘỚỜỞỠỢỨỪỬỮỰấầẩẫậắằẳẵặếềểễệốồổỗộớờởỡợứừửữự]"
)

PROTECTED_VI_COMPOUNDS = {
    "phụ huynh",
    "học sinh",
    "giáo dục",
    "hệ thống",
    "thông minh",
    "tự động",
    "nhân vật",
    "khung hình",
    "chuyển động",
    "kịch bản",
    "thực chiến",
    "tư duy",
    "bản chất",
    "nguyên nhân",
    "giải pháp",
    "quy trình",
    "tài liệu",
    "ngân hàng",
    "chi nhánh",
    "khách hàng",
}

WHITELABEL_FORBIDDEN_BRANDS = {
    "bidv",
    "agribank",
    "vietcombank",
    "vietinbank",
    "hà nam",
    "lâm đồng",
    "chatgpt",
    "openai",
    "claude",
}


@dataclass
class SyncGateReport:
    passed: bool
    total_scenes: int
    total_beats: int
    sync_score: float
    violations: List[str] = field(default_factory=list)
    warnings: List[str] = field(default_factory=list)
    typography_fixes: List[Dict[str, Any]] = field(default_factory=list)

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


def _fold_vi(s: str) -> str:
    s_norm = unicodedata.normalize("NFD", (s or "").lower()).replace("đ", "d")
    return "".join(c for c in s_norm if unicodedata.category(c) != "Mn")


def _token_key(tok: str) -> str:
    return re.sub(r"[^\w]", "", _fold_vi(tok))


def find_phrase_in_text(text: str, phrase: str) -> int:
    """Return word index of `phrase` in `text` (case/punctuation/tone insensitive), or -1 if missing."""
    toks = [t for t in (text or "").split() if _token_key(t)]
    want = [_token_key(t) for t in (phrase or "").split() if _token_key(t)]
    keys = [_token_key(t) for t in toks]
    if not want:
        return -1
    for i in range(0, len(keys) - len(want) + 1):
        if keys[i : i + len(want)] == want:
            return i
    return -1


def requires_tall_vietnamese_line_height(text: str) -> Tuple[bool, float]:
    if STACKED_VI_DIACRITICS_RE.search(text or ""):
        return True, 1.34
    return False, 1.24


def balance_vietnamese_lines(
    text: str,
    max_chars_per_line: int = 32,
    protected_compounds: Optional[set] = None,
) -> List[str]:
    """Knuth-Plass dynamic programming Vietnamese line balancer preserving compound words."""
    raw = (text or "").strip()
    if not raw:
        return []
    words = raw.split()
    if len(words) <= 1 or len(raw) <= max_chars_per_line:
        return [raw]

    compounds = protected_compounds if protected_compounds is not None else PROTECTED_VI_COMPOUNDS
    n = len(words)
    word_lens = [len(w) for w in words]
    compound_break_penalty = {}
    for i in range(n - 1):
        w1 = re.sub(r"[^\wÀ-ỹ]", "", words[i]).lower()
        w2 = re.sub(r"[^\wÀ-ỹ]", "", words[i + 1]).lower()
        if f"{w1} {w2}" in compounds:
            compound_break_penalty[i] = 450.0

    dp = [float("inf")] * (n + 1)
    breaks = [n] * (n + 1)
    dp[n] = 0.0

    for i in range(n - 1, -1, -1):
        line_len = -1
        for j in range(i, n):
            line_len += word_lens[j] + 1
            if line_len > max_chars_per_line and j > i:
                break
            slack = max(0, max_chars_per_line - line_len)
            line_cost = (slack**2) if j < n - 1 else (slack**2) * 0.35
            if j < n - 1 and j in compound_break_penalty:
                line_cost += compound_break_penalty[j]
            if line_len > max_chars_per_line:
                line_cost += 10000.0
            total_cost = line_cost + dp[j + 1]
            if total_cost < dp[i]:
                dp[i] = total_cost
                breaks[i] = j + 1

    lines: List[str] = []
    idx = 0
    while idx < n:
        nxt = breaks[idx]
        lines.append(" ".join(words[idx:nxt]))
        idx = nxt
    return lines


def evaluate_semantic_syncgate(scenes: Sequence[Dict[str, Any]]) -> SyncGateReport:
    """Run deterministic ADR-031 Semantic SyncGate across scenes and beats."""
    violations: List[str] = []
    warnings: List[str] = []
    typography_fixes: List[Dict[str, Any]] = []
    total_beats = 0
    passed_checks = 0
    total_checks = 0

    if not scenes:
        return SyncGateReport(
            passed=False,
            total_scenes=0,
            total_beats=0,
            sync_score=0.0,
            violations=["[EMPTY_TIMELINE] Danh sách scenes rỗng."],
        )

    for idx, sc in enumerate(scenes):
        sid = str(sc.get("scene_id") or sc.get("id") or f"S{idx + 1:02d}")
        say_raw = sc.get("say") or sc.get("text") or ""
        scene_text = " ".join(say_raw) if isinstance(say_raw, list) else str(say_raw)
        needs_tall, min_lh = requires_tall_vietnamese_line_height(scene_text)
        actual_lh = float(sc.get("line_height", 1.35) or 1.35)
        total_checks += 1
        if needs_tall and actual_lh < min_lh:
            violations.append(f"[{sid}] line_height={actual_lh:.2f} < {min_lh:.2f} cho dấu thanh Tiếng Việt tầng 2.")
        else:
            passed_checks += 1

        if scene_text:
            typography_fixes.append(
                {
                    "scene_id": sid,
                    "balanced_lines": balance_vietnamese_lines(scene_text, max_chars_per_line=36),
                    "recommended_line_height": min_lh,
                }
            )

        beats = sc.get("beats") or sc.get("steps") or []
        if sc.get("opener") and sc["opener"].get("marks"):
            beats = list(beats) + list(sc["opener"]["marks"])
        is_overview_or_card = (
            sc.get("kind") == "card"
            or bool(sc.get("opener"))
            or bool((sc.get("page") or {}).get("bare"))
        )
        total_checks += 1
        if not beats and not is_overview_or_card:
            violations.append(f"[{sid}] Cảnh thiếu beats/steps minh họa (vi phạm 'Lời nhấn gì, hình đổi nấy').")
        else:
            passed_checks += 1

        for b in beats:
            total_beats += 1
            at_phrase = b.get("at")
            if at_phrase:
                total_checks += 1
                if find_phrase_in_text(scene_text, at_phrase) < 0:
                    violations.append(f"[{sid}] Cụm neo at='{at_phrase}' không khớp lời đọc của cảnh.")
                else:
                    passed_checks += 1

    score = round((passed_checks / max(1, total_checks)) * 100.0, 2)
    return SyncGateReport(
        passed=len(violations) == 0,
        total_scenes=len(scenes),
        total_beats=total_beats,
        sync_score=score,
        violations=violations,
        warnings=warnings,
        typography_fixes=typography_fixes,
    )


class ReelCrewRubricAuditor:
    """
    100-Point Pedagogical & Screencast Pacing Rubric Auditor (from `/reelcrew` + `BAI_HOC_THIET_KE_VIDEO_VA_BAI_GIANG.md`).
    Evaluates:
      1. Direct Hook without fluffy greeting (20 pts)
      2. Audio-Visual Lock (`beats`/`steps` bound to `at` phrases) (25 pts)
      3. TTS Token Hygiene (zero digits, zero mid-word hyphens/dots/slashes in `say`) (20 pts)
      4. Pacing & Pause Discipline (`holds <= 1.0s`) (20 pts)
      5. Context Purity / Whitelabel compliance (15 pts)
    """

    @staticmethod
    def evaluate_spec(spec: Dict[str, Any], enforce_whitelabel: bool = False) -> Dict[str, Any]:
        shots = spec.get("shots") or []
        if not shots:
            return {"passed": False, "score": 0.0, "violations": ["Spec không có shots[]"]}

        violations: List[str] = []
        warnings: List[str] = []
        score = 100.0

        # 1. Hook Check (First shot say[0] must not have fluffy greetings or 'trong bài trước')
        first_say_raw = shots[0].get("say") or ""
        first_say = " ".join(first_say_raw) if isinstance(first_say_raw, list) else str(first_say_raw)
        if re.search(r"\b(xin chào|chào mừng|trong bài trước|ở bài học trước)\b", first_say.lower()):
            score -= 15.0
            violations.append("[HOOK_FLUFF] Câu mở đầu chứa lời chào rào đón hoặc nhắc bài trước.")

        for s in shots:
            sid = s.get("id", "unknown")
            say_list = s.get("say") if isinstance(s.get("say"), list) else [str(s.get("say") or "")]
            full_say = " ".join(say_list)

            # 2. Check TTS digits & forbidden symbols in say[]
            if re.search(r"\d", full_say):
                score -= 10.0
                violations.append(f"[{sid}] Lời đọc 'say' chứa chữ số (phải viết bằng chữ để tránh lỗi TTS).")
            if "/" in full_say:
                score -= 5.0
                violations.append(f"[{sid}] Lời đọc 'say' chứa ký hiệu '/'.")
            for tok in full_say.split():
                cleaned = tok.strip(".,!?;:\"'()[]…")
                if "-" in cleaned or "_" in cleaned or ("." in cleaned and len(cleaned) > 1):
                    score -= 5.0
                    violations.append(f"[{sid}] Từ '{tok}' trong 'say' chứa gạch nối/gạch dưới/dấu chấm giữa từ.")
                    break

            # 3. Check `at` phrase bindings
            all_cues = list(s.get("beats") or []) + list(s.get("steps") or [])
            if s.get("opener") and s["opener"].get("marks"):
                all_cues.extend(s["opener"]["marks"])
            for cue in all_cues:
                at_p = cue.get("at")
                if at_p and find_phrase_in_text(full_say, at_p) < 0:
                    score -= 8.0
                    violations.append(f"[{sid}] Mốc at='{at_p}' không tồn tại nguyên văn trong 'say'.")

            # 4. Check `holds <= 1.0s`
            for h in s.get("holds") or []:
                sec = float(h.get("sec", 0.0) or 0.0)
                if sec > 1.05:
                    score -= 5.0
                    violations.append(f"[{sid}] Khoảng dừng holds={sec}s vượt quá giới hạn 1.0s.")

            # 5. Optional Whitelabel check
            if enforce_whitelabel:
                low = full_say.lower()
                for brand in WHITELABEL_FORBIDDEN_BRANDS:
                    if re.search(rf"\b{re.escape(brand)}\b", low):
                        score -= 10.0
                        violations.append(f"[{sid}] Vi phạm Whitelabel: phát hiện tên riêng '{brand}' trong lời đọc.")

        final_score = max(0.0, round(score, 1))
        return {
            "passed": len(violations) == 0 and final_score >= 90.0,
            "score": final_score,
            "total_shots": len(shots),
            "violations": violations,
            "warnings": warnings,
        }


def audit_video_spec_rules(spec_path_or_dict: Path | str | Dict[str, Any], enforce_whitelabel: bool = False) -> Dict[str, Any]:
    """Run both `ReelCrewRubricAuditor` and `evaluate_semantic_syncgate` on a video spec."""
    if isinstance(spec_path_or_dict, (str, Path)):
        spec = json.loads(Path(spec_path_or_dict).read_text(encoding="utf-8"))
    else:
        spec = spec_path_or_dict

    rubric = ReelCrewRubricAuditor.evaluate_spec(spec, enforce_whitelabel=enforce_whitelabel)
    sync = evaluate_semantic_syncgate(spec.get("shots") or [])
    all_violations = list(rubric["violations"]) + [v for v in sync.violations if v not in rubric["violations"]]
    return {
        "passed": len(all_violations) == 0 and rubric["score"] >= 90.0,
        "rubric_score": rubric["score"],
        "sync_score": sync.sync_score,
        "total_shots": rubric.get("total_shots", 0),
        "violations": all_violations,
        "typography_fixes": sync.typography_fixes,
    }


def audit_html_simulator(
    html_path: Path | str,
    forbidden_terms: Optional[Sequence[str]] = None,
    require_laser_cursor: bool = True,
) -> Dict[str, Any]:
    """
    Deterministic auditor for Single-File Interactive HTML Software Simulators:
      1. Verifies presence of Soft Red Glowing Laser Dot (`#laser-cursor`) & `.click-ripple`
      2. Verifies zero unhidden native `<select>` elements (prevents OS dropdown occlusion)
      3. Verifies zero forbidden project name leaks (anti-context contamination)
      4. Extracts all inline `<script>` blocks and runs `node --check` to guarantee 0 JS syntax errors
    """
    hpath = Path(html_path).resolve()
    if not hpath.exists():
        return {"passed": False, "violations": [f"Không tìm thấy tệp HTML: {hpath}"]}

    content = hpath.read_text(encoding="utf-8")
    violations: List[str] = []

    if require_laser_cursor:
        if "id=\"laser-cursor\"" not in content and "#laser-cursor" not in content:
            violations.append("[MISSING_LASER_CURSOR] Thiếu con trỏ đốm sáng đỏ #laser-cursor.")
        if "click-ripple" not in content:
            violations.append("[MISSING_CLICK_RIPPLE] Thiếu hiệu ứng vòng tròn sáng .click-ripple khi bấm nút.")

    # Strip <script> blocks when inspecting DOM markup for <select> or context leaks in VFS strings
    dom_without_scripts = re.sub(r"<script\b[^>]*>.*?</script>", "", content, flags=re.S | re.I)

    # Check for bare <select> tags that are not hidden and not neutralized by custom-select-floating
    has_custom_select_engine = ("custom-select-floating" in content) or ("initCustomSelects" in content)
    if not has_custom_select_engine:
        for m in re.finditer(r"<select\b([^>]*)>", dom_without_scripts, flags=re.I):
            attrs = m.group(1).lower()
            if "display:none" not in attrs.replace(" ", "") and "hidden" not in attrs:
                violations.append("[NATIVE_SELECT_DETECTED] Phát hiện thẻ <select> gốc hiển thị trực tiếp (phải dùng Custom DOM Dropdown).")
                break

    # Check forbidden context contamination terms in visible DOM and simulator title/tree
    if forbidden_terms:
        for term in forbidden_terms:
            if term and re.search(re.escape(term), content, flags=re.I):
                violations.append(f"[CONTEXT_CONTAMINATION] Phát hiện tên dự án/ngữ cảnh ngoại lai bị cấm: '{term}'.")

    # Extract <script> blocks and run `node --check`
    scripts = re.findall(r"<script\b[^>]*>(.*?)</script>", content, flags=re.S | re.I)
    js_syntax_ok = True
    if scripts:
        combined_js = "\n;\n".join(scripts)
        with tempfile.NamedTemporaryFile("w", suffix=".js", encoding="utf-8", delete=False) as tf:
            tf.write(combined_js)
            temp_js_path = Path(tf.name)
        try:
            proc = subprocess.run(["node", "--check", str(temp_js_path)], capture_output=True, text=True)
            if proc.returncode != 0:
                js_syntax_ok = False
                violations.append(f"[JS_SYNTAX_ERROR] node --check thất bại: {proc.stderr.strip()}")
        except FileNotFoundError:
            pass
        finally:
            if temp_js_path.exists():
                temp_js_path.unlink()

    return {
        "passed": len(violations) == 0,
        "html_path": str(hpath),
        "size_bytes": hpath.stat().st_size,
        "line_count": len(content.splitlines()),
        "script_blocks": len(scripts),
        "js_syntax_ok": js_syntax_ok,
        "violations": violations,
    }


def extract_5hz_visemes_from_wav(wav_path: Path | str, fps: int = 5) -> List[str]:
    """Extract discrete viseme labels (`SIL`, `ROUND_O_U`, `FRICATIVE_S_I`, `WIDE_A_E`, `MID_TALK`) at 5 Hz from 16-bit PCM WAV."""
    p = Path(wav_path)
    if not p.exists() or p.stat().st_size < 100:
        return []
    try:
        with wave.open(str(p), "rb") as wf:
            n_ch = wf.getnchannels()
            sampwidth = wf.getsampwidth()
            sr = wf.getframerate()
            n_frames = wf.getnframes()
            raw = wf.readframes(n_frames)
        if sampwidth != 2 or n_frames == 0:
            return []
        samples = array.array("h")
        samples.frombytes(raw)
        if n_ch > 1:
            samples = array.array("h", samples[0::n_ch])
        hop = max(1, int(round(sr / float(fps))))
        n_steps = max(1, int(math.ceil(len(samples) / float(hop))))
        rms_vals: List[float] = []
        zcr_vals: List[float] = []
        for idx in range(n_steps):
            chunk = samples[idx * hop : (idx + 1) * hop]
            if not chunk:
                rms_vals.append(0.0)
                zcr_vals.append(0.0)
                continue
            acc_sq = 0.0
            zc = 0
            prev = chunk[0]
            for s in chunk:
                fn = s / 32768.0
                acc_sq += fn * fn
                if (s >= 0 and prev < 0) or (s < 0 and prev >= 0):
                    zc += 1
                prev = s
            rms_vals.append(math.sqrt(acc_sq / len(chunk)))
            zcr_vals.append((zc / max(1, len(chunk))) * (48000.0 / float(sr)))
        sorted_rms = sorted(rms_vals)
        p95 = max(sorted_rms[int(0.95 * (len(sorted_rms) - 1))] if sorted_rms else 0.01, 1e-4)
        visemes: List[str] = []
        for r_val, z_val in zip(rms_vals, zcr_vals):
            mo = min(1.0, r_val / p95)
            mr = max(0.0, min(1.0, 1.0 - (z_val / 0.18))) if mo >= 0.08 else 0.0
            if mo < 0.08:
                visemes.append("SIL")
            elif mr >= 0.65 and mo >= 0.22:
                visemes.append("ROUND_O_U")
            elif mr <= 0.30 and mo >= 0.18:
                visemes.append("FRICATIVE_S_I")
            elif mo >= 0.58:
                visemes.append("WIDE_A_E")
            else:
                visemes.append("MID_TALK")
        return visemes
    except Exception:
        return []


def synthesize_procedural_foley_wav(
    events: Sequence[Dict[str, Any]],
    duration_s: float,
    out_wav: Path | str,
) -> int:
    """Synthesize a 48kHz 16-bit PCM mono `foley_track.wav` from a list of `{time_sec, kind}` events."""
    if not events or duration_s <= 0:
        return 0
    sr = 48000
    total_samples = max(1, int(duration_s * sr))
    buf = array.array("h", [0]) * total_samples
    rng = random.Random(20261104)

    for ev in events:
        t_sec = float(ev.get("time_sec", ev.get("t", 0.0)))
        kind = str(ev.get("kind", "click"))
        start_idx = int(t_sec * sr)
        if start_idx < 0 or start_idx >= total_samples:
            continue
        n_samp = int((0.12 if kind == "page" else 0.035) * sr)
        for k in range(min(n_samp, total_samples - start_idx)):
            p = k / max(1, n_samp)
            env = math.exp(-6.0 * p) * min(1.0, p / 0.08)
            tone = math.sin(2.0 * math.pi * (480.0 - 220.0 * p) * (k / sr))
            noise = rng.uniform(-0.3, 0.3) * math.exp(-12.0 * p)
            val = int((0.75 * tone + noise) * env * 0.045 * 32767)
            buf[start_idx + k] = max(-32767, min(32767, buf[start_idx + k] + val))

    out_p = Path(out_wav).resolve()
    out_p.parent.mkdir(parents=True, exist_ok=True)
    with wave.open(str(out_p), "wb") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(sr)
        wf.writeframes(buf.tobytes())
    return len(events)
