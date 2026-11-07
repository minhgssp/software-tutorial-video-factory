# -*- coding: utf-8 -*-
"""
Vercel Password Gate & AES-256-GCM Zero-Preload Encryption Vault (`core_engine/vercel_crypto_vault.py` v3.3)

Guarantees that HTML-First walkthroughs deployed to public Vercel URLs (`*.vercel.app`):
  1. Read a fixed password from `.env` (`WALKTHROUGH_PASSWORD`).
  2. Encrypt the entire application DOM, styles, and scripts at build time using
     `PBKDF2-HMAC-SHA256` (100,000 iterations) + `AES-256-GCM` (256-bit key + 128-bit auth tag).
  3. Ship an `index.html` that contains ONLY the password gate (`#security-vault-gate`) and
     ciphertext (`ENCRYPTED_STAGE_PAYLOAD`). Zero business data, wireframes, or scripts exist
     in the DOM or HTML source before the user enters the correct password ("Không load sớm").
  4. Provide both Browser `Web Crypto API` decryption and an optional Vercel Serverless Function
     (`api/unlock.js` reading `process.env.WALKTHROUGH_PASSWORD`).
"""
from __future__ import annotations

import base64
import hashlib
import json
import os
import re
from pathlib import Path
from typing import Any, Dict

from cryptography.hazmat.primitives.ciphers.aead import AESGCM

DEFAULT_ENV_VAR = "WALKTHROUGH_PASSWORD"
DEFAULT_PBKDF2_ITERATIONS = 100_000


def parse_dotenv_file(env_path: Path) -> Dict[str, str]:
    """Parse a simple `.env` or `.env.example` file into a dictionary."""
    out: Dict[str, str] = {}
    if not env_path.exists():
        return out
    for raw_line in env_path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, v = line.split("=", 1)
        val = v.strip().strip('"').strip("'")
        out[k.strip()] = val
    return out


def load_walkthrough_password(project_dir: Path, password_override: str | None = None) -> str:
    """
    Resolve `WALKTHROUGH_PASSWORD` in priority order:
      1. Explicit `password_override`
      2. Process environment variable `WALKTHROUGH_PASSWORD`
      3. `<project_dir>/.env`
      4. `<project_dir>/.env.example`
    """
    if password_override and len(password_override.strip()) >= 4:
        return password_override.strip()

    env_val = os.environ.get(DEFAULT_ENV_VAR, "").strip()
    if len(env_val) >= 4:
        return env_val

    pdir = Path(project_dir).resolve()
    for fname in (".env", ".env.example"):
        kv = parse_dotenv_file(pdir / fname)
        if DEFAULT_ENV_VAR in kv and len(kv[DEFAULT_ENV_VAR]) >= 4:
            return kv[DEFAULT_ENV_VAR]

    raise ValueError(
        f"Không tìm thấy biến mật khẩu `{DEFAULT_ENV_VAR}` (tối thiểu 4 ký tự) trong `.env` hoặc biến môi trường tại {pdir}."
    )


def encrypt_payload_aes256_gcm(
    plaintext: str,
    password: str,
    iterations: int = DEFAULT_PBKDF2_ITERATIONS,
) -> Dict[str, Any]:
    """Encrypt UTF-8 plaintext using PBKDF2-HMAC-SHA256 + AES-256-GCM (WebCrypto compatible)."""
    if len(password) < 4:
        raise ValueError("Mật khẩu khóa trang phải có tối thiểu 4 ký tự.")
    salt = os.urandom(16)
    iv = os.urandom(12)
    key = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, iterations, dklen=32)
    aesgcm = AESGCM(key)
    ciphertext_with_tag = aesgcm.encrypt(iv, plaintext.encode("utf-8"), None)
    return {
        "version": "3.3.0",
        "cipher": "AES-256-GCM",
        "kdf": "PBKDF2-HMAC-SHA256",
        "env_key": DEFAULT_ENV_VAR,
        "iterations": iterations,
        "salt_b64": base64.b64encode(salt).decode("ascii"),
        "iv_b64": base64.b64encode(iv).decode("ascii"),
        "ciphertext_b64": base64.b64encode(ciphertext_with_tag).decode("ascii"),
    }


def decrypt_payload_aes256_gcm(bundle: Dict[str, Any], password: str) -> str:
    """Decrypt an AES-256-GCM bundle produced by `encrypt_payload_aes256_gcm`."""
    salt = base64.b64decode(bundle["salt_b64"])
    iv = base64.b64decode(bundle["iv_b64"])
    ciphertext_with_tag = base64.b64decode(bundle["ciphertext_b64"])
    iterations = int(bundle.get("iterations", DEFAULT_PBKDF2_ITERATIONS))
    key = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, iterations, dklen=32)
    aesgcm = AESGCM(key)
    try:
        plain_bytes = aesgcm.decrypt(iv, ciphertext_with_tag, None)
        return plain_bytes.decode("utf-8")
    except Exception as exc:
        raise ValueError("Mật khẩu không đúng hoặc khối mã hóa AES-256-GCM không hợp lệ.") from exc


def _extract_html_parts(raw_html: str) -> Dict[str, str]:
    """Split a full HTML document into title, head styles, body innerHTML, and scripts for zero-preload encryption."""
    title_m = re.search(r"<title[^>]*>(.*?)</title>", raw_html, flags=re.DOTALL | re.IGNORECASE)
    title = title_m.group(1).strip() if title_m else "Protected FDE / PM Client Walkthrough"

    head_m = re.search(r"<head[^>]*>(.*?)</head>", raw_html, flags=re.DOTALL | re.IGNORECASE)
    head_content = head_m.group(1) if head_m else ""
    styles = "\n".join(re.findall(r"<style[^>]*>(.*?)</style>", head_content, flags=re.DOTALL | re.IGNORECASE))

    body_m = re.search(r"<body[^>]*>(.*?)</body>", raw_html, flags=re.DOTALL | re.IGNORECASE)
    body_full = body_m.group(1) if body_m else raw_html

    scripts_list = re.findall(r"<script[^>]*>(.*?)</script>", body_full, flags=re.DOTALL | re.IGNORECASE)
    body_without_scripts = re.sub(r"<script[^>]*>.*?</script>", "", body_full, flags=re.DOTALL | re.IGNORECASE).strip()

    return {
        "title": title,
        "styles": styles,
        "body_html": body_without_scripts,
        "scripts": "\n".join(scripts_list),
    }


def _render_locked_vault_html(title: str, encrypted_bundle: Dict[str, Any]) -> str:
    """Generate the zero-preload HTML shell containing ONLY the password gate and AES-256-GCM ciphertext."""
    bundle_json = json.dumps(encrypted_bundle, ensure_ascii=False)
    return f"""<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="robots" content="noindex, nofollow" />
  <title>{title} — Cổng Bảo Mật AES-256-GCM</title>
  <style id="vault-gate-style">
    :root {{
      --vault-bg: #14181D;
      --vault-card: #1E242C;
      --vault-border: #333D4B;
      --vault-accent: #D95D39;
      --vault-text: #F8FAFC;
      --vault-muted: #94A3B8;
    }}
    * {{ box-sizing: border-box; margin: 0; padding: 0; }}
    body.vault-locked {{
      font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;
      background: var(--vault-bg);
      color: var(--vault-text);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }}
    #security-vault-gate {{
      max-width: 460px;
      width: 100%;
      background: var(--vault-card);
      border: 1px solid var(--vault-border);
      border-top: 4px solid var(--vault-accent);
      border-radius: 14px;
      padding: 28px 26px;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.45);
    }}
    .vault-badge {{
      display: inline-block;
      background: rgba(217, 93, 57, 0.18);
      border: 1px solid var(--vault-accent);
      color: #FDBA74;
      font-size: 11.5px;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 999px;
      margin-bottom: 12px;
    }}
    #security-vault-gate h1 {{
      font-size: 19px;
      line-height: 1.4;
      margin-bottom: 8px;
      color: #FFFFFF;
    }}
    #security-vault-gate p.desc {{
      font-size: 13.2px;
      line-height: 1.55;
      color: var(--vault-muted);
      margin-bottom: 18px;
    }}
    .vault-field label {{
      display: block;
      font-size: 12.5px;
      font-weight: 700;
      margin-bottom: 6px;
      color: #E2E8F0;
    }}
    .vault-field input {{
      width: 100%;
      padding: 11px 14px;
      border-radius: 8px;
      border: 1px solid #475569;
      background: #0F1419;
      color: #FFF;
      font-size: 14px;
      outline: none;
    }}
    .vault-field input:focus {{
      border-color: var(--vault-accent);
    }}
    button#btn-unlock-vault {{
      margin-top: 14px;
      width: 100%;
      padding: 12px 16px;
      border: none;
      border-radius: 8px;
      background: var(--vault-accent);
      color: #FFF;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
    }}
    button#btn-unlock-vault:hover {{ opacity: 0.92; }}
    #vault-error-msg {{
      margin-top: 12px;
      font-size: 12.8px;
      color: #F87171;
      display: none;
      line-height: 1.45;
    }}
    .vault-meta {{
      margin-top: 16px;
      padding-top: 12px;
      border-top: 1px solid #2A323D;
      font-size: 11.8px;
      color: var(--vault-muted);
      line-height: 1.5;
    }}
  </style>
</head>
<body class="vault-locked">
  <!-- ZERO PRE-AUTH LOAD: Không một phần tử DOM hay dữ liệu nào của dự án được nạp trước khi giải mã -->
  <div id="security-vault-gate" data-vault-protection="AES-256-GCM-PBKDF2">
    <span class="vault-badge">🔒 BẢO MẬT VERCEL · AES-256-GCM + .ENV PASSWORD</span>
    <h1>Xác thực Mật khẩu Trước Khi Tải Trang</h1>
    <p class="desc">Toàn bộ giao diện mô phỏng, dữ liệu hiện trạng và quy tắc nghiệp vụ đang được khóa mã hóa <strong>AES-256-GCM</strong> (từ biến <code>.env</code> <code>WALKTHROUGH_PASSWORD</code>) và <strong>không tải sớm</strong>. Vui lòng nhập mật khẩu để giải mã và khởi chạy ứng dụng.</p>
    <form id="vault-unlock-form" onsubmit="handleUnlockVault(event)">
      <div class="vault-field">
        <label for="vault-password-input">Mật khẩu truy cập (<code>WALKTHROUGH_PASSWORD</code>):</label>
        <input type="password" id="vault-password-input" placeholder="Nhập mật khẩu được cấp..." autocomplete="current-password" required />
      </div>
      <button type="submit" id="btn-unlock-vault">🔓 Giải Mã &amp; Tải Nội Dung Walkthrough</button>
      <div id="vault-error-msg" role="alert">❌ Mật khẩu không chính xác. Không thể giải mã khối dữ liệu AES-256-GCM (Nội dung vẫn được khóa kín 100%).</div>
    </form>
    <div class="vault-meta">
      • Chuẩn mã hóa: <code>PBKDF2-HMAC-SHA256 (100.000 vòng) + AES-256-GCM</code><br/>
      • Chế độ bảo vệ: <strong>Zero Pre-Auth DOM Load</strong> (Chỉ nạp DOM &amp; Script sau khi giải mã thành công).
    </div>
  </div>

  <div id="decrypted-app-mount"></div>

  <script>
    window.__ENCRYPTED_STAGE_PAYLOAD__ = {bundle_json};

    function b64ToBytes(b64) {{
      const bin = atob(b64);
      const arr = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
      return arr;
    }}

    async function decryptStageBundle(password) {{
      const payload = window.__ENCRYPTED_STAGE_PAYLOAD__;
      const enc = new TextEncoder();
      const salt = b64ToBytes(payload.salt_b64);
      const iv = b64ToBytes(payload.iv_b64);
      const ciphertext = b64ToBytes(payload.ciphertext_b64);

      const baseKey = await window.crypto.subtle.importKey(
        'raw',
        enc.encode(password),
        {{ name: 'PBKDF2' }},
        false,
        ['deriveKey']
      );
      const aesKey = await window.crypto.subtle.deriveKey(
        {{
          name: 'PBKDF2',
          salt: salt,
          iterations: payload.iterations || 100000,
          hash: 'SHA-256'
        }},
        baseKey,
        {{ name: 'AES-GCM', length: 256 }},
        false,
        ['decrypt']
      );
      const plainBuf = await window.crypto.subtle.decrypt(
        {{ name: 'AES-GCM', iv: iv }},
        aesKey,
        ciphertext
      );
      return JSON.parse(new TextDecoder().decode(plainBuf));
    }}

    function mountDecryptedStage(stageData) {{
      const gate = document.getElementById('security-vault-gate');
      if (gate) gate.remove();
      document.body.classList.remove('vault-locked');

      const appStyle = document.createElement('style');
      appStyle.id = 'decrypted-stage-style';
      appStyle.textContent = stageData.styles || '';
      document.head.appendChild(appStyle);

      const mount = document.getElementById('decrypted-app-mount');
      mount.innerHTML = stageData.body_html || '';

      if (stageData.scripts) {{
        const s = document.createElement('script');
        s.textContent = stageData.scripts;
        document.body.appendChild(s);
      }}
      if (typeof window.switchAct === 'function') {{
        setTimeout(() => window.switchAct(0), 60);
      }}
    }}

    async function handleUnlockVault(ev) {{
      ev.preventDefault();
      const errEl = document.getElementById('vault-error-msg');
      const btn = document.getElementById('btn-unlock-vault');
      const pwd = document.getElementById('vault-password-input').value.trim();
      errEl.style.display = 'none';
      btn.textContent = '⏳ Đang xác thực & giải mã AES-256-GCM...';
      try {{
        const stageData = await decryptStageBundle(pwd);
        mountDecryptedStage(stageData);
      }} catch (err) {{
        errEl.style.display = 'block';
        btn.textContent = '🔓 Giải Mã & Tải Nội Dung Walkthrough';
      }}
    }}
  </script>
</body>
</html>
"""


def build_encrypted_vercel_walkthrough(
    project_dir: Path,
    source_html_name: str = "walkthrough_source.html",
    out_html_name: str = "index.html",
    password: str | None = None,
) -> Dict[str, Any]:
    """
    Encrypt an HTML walkthrough into a Zero-Preload AES-256-GCM Vault `index.html` using `WALKTHROUGH_PASSWORD` from `.env`.
    Also generates `.env.example`, `.gitignore` (protecting `.env`), and `api/unlock.js` for Vercel Serverless env verification.
    """
    pdir = Path(project_dir).resolve()
    src_path = pdir / source_html_name
    out_path = pdir / out_html_name

    # If walkthrough_source.html doesn't exist yet and index.html is still plaintext, copy index.html -> walkthrough_source.html
    if not src_path.exists() and out_path.exists():
        curr_txt = out_path.read_text(encoding="utf-8")
        if "__ENCRYPTED_STAGE_PAYLOAD__" not in curr_txt:
            src_path.write_text(curr_txt, encoding="utf-8")

    if not src_path.exists():
        raise FileNotFoundError(f"Không tìm thấy tệp nguồn giao diện HTML để mã hóa: {src_path}")

    # Ensure .env.example and .gitignore exist
    env_example = pdir / ".env.example"
    if not env_example.exists():
        env_example.write_text(
            "# Mật khẩu cố định bảo vệ trang Walkthrough trên Vercel (Chỉ tải nội dung sau khi nhập đúng mật khẩu)\n"
            f"{DEFAULT_ENV_VAR}=FDE-Onsite-2026\n",
            encoding="utf-8",
        )

    gitignore = pdir / ".gitignore"
    if not gitignore.exists() or ".env" not in gitignore.read_text(encoding="utf-8"):
        existing_gi = gitignore.read_text(encoding="utf-8") if gitignore.exists() else ""
        gitignore.write_text(
            (existing_gi.rstrip() + "\n.env\n.env.local\n").lstrip(),
            encoding="utf-8",
        )

    resolved_pwd = load_walkthrough_password(pdir, password_override=password)
    raw_html = src_path.read_text(encoding="utf-8")
    parts = _extract_html_parts(raw_html)
    json_payload = json.dumps(parts, ensure_ascii=False)
    encrypted_bundle = encrypt_payload_aes256_gcm(json_payload, resolved_pwd)

    locked_html = _render_locked_vault_html(parts["title"], encrypted_bundle)
    out_path.write_text(locked_html, encoding="utf-8")

    # Also generate optional Vercel Serverless Function `api/unlock.js` reading process.env.WALKTHROUGH_PASSWORD
    api_dir = pdir / "api"
    api_dir.mkdir(parents=True, exist_ok=True)
    unlock_api = api_dir / "unlock.js"
    unlock_api.write_text(
        """// Vercel Serverless Gate reading process.env.WALKTHROUGH_PASSWORD (.env)
export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }
  const expected = process.env.WALKTHROUGH_PASSWORD || '';
  const provided = (req.body && req.body.password) ? String(req.body.password).trim() : '';
  if (!expected || provided !== expected) {
    return res.status(401).json({ ok: false, error: 'Mật khẩu không chính xác. Từ chối tải trang.' });
  }
  return res.status(200).json({ ok: true, unlocked: true });
}
""",
        encoding="utf-8",
    )

    return {
        "status": "ok",
        "project_dir": str(pdir),
        "source_html": str(src_path),
        "encrypted_index_html": str(out_path),
        "cipher": encrypted_bundle["cipher"],
        "kdf": encrypted_bundle["kdf"],
        "iterations": encrypted_bundle["iterations"],
        "env_var": DEFAULT_ENV_VAR,
        "zero_preload_verified": "act-1-as-is" not in locked_html and "[WF-01]" not in locked_html,
    }


def extract_and_decrypt_walkthrough_html(project_dir: Path, password: str | None = None) -> Dict[str, Any]:
    """
    Verify that `index.html` in `project_dir` is locked with `#security-vault-gate` + `AES-256-GCM`
    (zero plaintext leak before login) AND decrypt its payload using `.env` `WALKTHROUGH_PASSWORD` for auditing.
    """
    pdir = Path(project_dir).resolve()
    index_path = pdir / "index.html"
    if not index_path.exists():
        return {"ok": False, "errors": [f"Thiếu tệp {index_path}"], "decrypted_html": ""}

    raw_index = index_path.read_text(encoding="utf-8")
    errors = []

    if 'id="security-vault-gate"' not in raw_index or "__ENCRYPTED_STAGE_PAYLOAD__" not in raw_index:
        errors.append(
            "⛔ LỖI BẢO MẬT VERCEL: Tệp `index.html` chưa được khóa bằng Cổng Mật Khẩu & Mã hóa AES-256-GCM (`#security-vault-gate`). "
            "Hãy chạy `python factory_cli.py encrypt-walkthrough --dir <path>` để khóa mã hóa và chặn load sớm."
        )
        return {"ok": False, "errors": errors, "decrypted_html": raw_index, "is_encrypted": False}

    # Verify ZERO PRE-LOAD: plaintext markers must NOT appear in raw index.html!
    for leaked_marker in ("act-1-as-is", "act-3-wireframe", "[WF-01]", "[WF-02]", "checklist-3-pillars"):
        if leaked_marker in raw_index:
            errors.append(
                f"⛔ LỖI LOAD SỚM (PRE-AUTH LEAK): Phát hiện dữ liệu nghiệp vụ `{leaked_marker}` nằm lộ thiên trong `index.html` trước khi nhập mật khẩu!"
            )

    m = re.search(r"window\.__ENCRYPTED_STAGE_PAYLOAD__\s*=\s*(\{.*?\});", raw_index, flags=re.DOTALL)
    if not m:
        errors.append("Không tìm thấy khối `window.__ENCRYPTED_STAGE_PAYLOAD__` hợp lệ trong `index.html`.")
        return {"ok": False, "errors": errors, "decrypted_html": "", "is_encrypted": True}

    try:
        bundle = json.loads(m.group(1))
        pwd = load_walkthrough_password(pdir, password_override=password)
        decrypted_json = decrypt_payload_aes256_gcm(bundle, pwd)
        parts = json.loads(decrypted_json)
        reconstructed_html = (
            f"<style>{parts.get('styles', '')}</style>\n"
            f"{parts.get('body_html', '')}\n"
            f"<script>{parts.get('scripts', '')}</script>"
        )
    except Exception as exc:
        errors.append(f"Không thể giải mã `index.html` bằng mật khẩu từ `.env`: {exc}")
        reconstructed_html = ""

    return {
        "ok": len(errors) == 0,
        "is_encrypted": True,
        "zero_preload_verified": len(errors) == 0,
        "errors": errors,
        "decrypted_html": reconstructed_html,
    }
