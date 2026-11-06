---
name: kudo-setup
description: Use right after installing Kudo, when kudo.py doctor reports something missing, or when a Kudo render fails for a missing tool (node, ffmpeg, Remotion, Manim, VieNeu voice, music bed, Chrome). Installs the per-engine dependencies of Kudo on macOS or Windows into the Kudo folder, without global installs.
---

# Cài phần dựng video cho Kudo

Kudo ở `{{KUDO_HOME}}`. Mọi thứ cài vào trong thư mục này (`.venv/`, `models/`, `node_modules/` của từng engine),
không cài toàn máy, không dùng `sudo`. Mọi thư viện dưới đây miễn phí; không bật dịch vụ trả phí nào.

Thứ tự khuyên dùng: bước 1 → 2 → 3 (bắt buộc, khoảng 1,5 GB tải về) → bước 4 theo luồng người dùng cần → bước 5.
Báo người dùng dung lượng trước mỗi lần tải lớn.

## 1. Công cụ nền (người dùng tự cài, agent hướng dẫn)

| Công cụ | macOS | Windows |
|---|---|---|
| Python 3.12 (giọng VieNeu, nhạc nền chưa chạy được trên 3.13+) | `brew install python@3.12` | python.org bản 3.12, tick "Add to PATH" |
| Node 20+ | `brew install node` | nodejs.org bản LTS |
| ffmpeg, ffprobe | `brew install ffmpeg` | `winget install Gyan.FFmpeg` |
| Xcode Command Line Tools (git, swift) | `xcode-select --install` | `winget install Git.Git` |
| cwebp (talking head) | `brew install webp` | tải libwebp ở developers.google.com/speed/webp, thêm thư mục `bin` vào PATH |
| Google Chrome (engine styles) | google.com/chrome | google.com/chrome |

Dưới đây `PY312` là `python3.12` (macOS) hoặc `py -3.12` (Windows). Windows: thay `bin/pip` bằng `Scripts\pip.exe`,
`bin/python` bằng `Scripts\python.exe`.

## 2. Thư viện Python chung

```bash
PY312 -m venv {{KUDO_HOME}}/.venv/core
{{KUDO_HOME}}/.venv/core/bin/pip install pyyaml pillow numpy playwright
{{KUDO_HOME}}/.venv/core/bin/python -m playwright install chromium chromium-headless-shell
```

README các engine còn ghi `python3.14 …`: chạy bằng `{{KUDO_HOME}}/.venv/core/bin/python` thay vào.

## 3. Giọng, nhạc, phụ đề (luồng nào cũng cần)

**Giọng Việt VieNeu-TTS** (Apache 2.0, chạy CPU, không cần Torch; mô hình ~610 MB):

```bash
PY312 -m venv {{KUDO_HOME}}/.venv/vieneu
{{KUDO_HOME}}/.venv/vieneu/bin/pip install vieneu
{{KUDO_HOME}}/.venv/vieneu/bin/python {{KUDO_HOME}}/engines/voice/vieneu_tts.py fetch
{{KUDO_HOME}}/.venv/vieneu/bin/python {{KUDO_HOME}}/engines/voice/vieneu_tts.py say "Xin chào, đây là Kudo." --out /tmp/thu-giong.wav
```

`vieneu_tts.py voices` liệt kê 25 giọng có sẵn (mặc định Hải Đăng). Muốn giọng của chính mình: thu 5–15 giây sạch,
rồi thêm `--ref mau.wav` khi tạo giọng. Chỉ nhân bản giọng của bạn hoặc người đã đồng ý.

**Căn mốc từng từ cho phụ đề** (faster-whisper, MIT; lần đầu tự tải mô hình `medium` ~1,5 GB):

```bash
PY312 -m venv {{KUDO_HOME}}/.venv/faster-whisper-py312
{{KUDO_HOME}}/.venv/faster-whisper-py312/bin/pip install faster-whisper "av<19"   # av 19 làm faster-whisper 1.2 lỗi đọc âm thanh
```

**Nhạc nền, tiếng động** (`engines/audio`, mgaudio đi kèm; mẫu nhạc cụ CC0 ~55 MB):

```bash
PY312 -m venv {{KUDO_HOME}}/.venv/mg
{{KUDO_HOME}}/.venv/mg/bin/pip install -r {{KUDO_HOME}}/engines/audio/requirements.txt
{{KUDO_HOME}}/.venv/core/bin/python {{KUDO_HOME}}/engines/audio/fetch_samples.py
```

## 4. Engine theo luồng (chỉ cài luồng người dùng cần)

| Luồng | Lệnh |
|---|---|
| Talking head, footage, giới thiệu sản phẩm (`engines/talkfx`) | `cd {{KUDO_HOME}}/engines/talkfx && npm install` |
| Giải thích nhiều style (`engines/styles`) | `cd {{KUDO_HOME}}/engines/styles && npm install`; cần Google Chrome (đặt `KSTYLE_CHROME` nếu Chrome ở chỗ khác) |
| Pixel, vector-cinema, linh vật (kiểm khung hình) | `npx -y puppeteer-core@latest --version` (Chrome lấy từ bước 2 hoặc Google Chrome), rồi kiểm: `node {{KUDO_HOME}}/skills/vector-cinema/tools/vc.mjs doctor` |
| Đồ thị, công thức (`engines/manimgx`) | `PY312 -m venv {{KUDO_HOME}}/.venv/manim` rồi `pip install manimgx` trong venv đó |
| Quay màn hình, trưng bày 3D (`engines/screencast`, `engines/showcase`) | đã có ở bước 2 (playwright trong `.venv/core`) |
| MV lời (`engines/mv`) | không cài gói; dùng `npx hyperframes@0.8.135` khi dựng |
| Giọng máy tiếng Anh (Kokoro, Apache 2.0) | `PY312 -m venv {{KUDO_HOME}}/.venv/kokoro-py312` rồi `pip install kokoro soundfile` (kéo theo Torch ~1–2 GB: hỏi trước) |
| Dọn talking head (`kudo-talk-clean`) | dùng `.venv/faster-whisper-py312`; lần đầu tải mô hình `large-v3` ~3 GB: hỏi trước |

Remotion (talkfx, styles): miễn phí cho cá nhân và công ty tối đa 3 người; đông hơn phải mua giấy phép công ty
của Remotion. Nói rõ điều này với người dùng khi cài.

Font: Be Vietnam Pro, Cormorant (Google Fonts, giấy phép OFL) đã nằm trong `engines/*/fonts` hoặc `public/fonts`.
Manim cần font cài vào máy: macOS chép vào `~/Library/Fonts`, Windows bấm chuột phải → Install.

## 5. Kiểm cuối

```bash
python3 {{KUDO_HOME}}/bin/kudo.py doctor
```

Hết `THIẾU` là dựng được video tiếng Việt có giọng, nhạc, phụ đề. Dòng `tuỳ` là luồng riêng: báo người dùng luồng
nào đã sẵn, luồng nào chưa cài.

## Giới hạn đã biết

- Luồng footage (`kudo-footage-director`) không cần công cụ AI riêng: agent đang chạy skill xem khung hình engine trích ra
  và ghi `answer.json` (mặc định `KUDO_EYES=agent`).
- Tách người khỏi nền, phụ đề footage dùng `swift` nên chỉ chạy trên macOS.
- Windows mới kiểm ở mức cài đặt; dựng đầy đủ đã kiểm trên macOS Apple Silicon.
