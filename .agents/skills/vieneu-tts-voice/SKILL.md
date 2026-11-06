---
name: vieneu-tts-voice
version: "1.0.0"
description: Hướng dẫn cài đặt và sử dụng động cơ giọng đọc AI tiếng Việt VieNeu-TTS v3 Turbo (chạy offline trên CPU/GPU, miễn phí Apache 2.0, tần số mẫu 48kHz, hỗ trợ nhân bản giọng nói từ 5-15 giây thu âm), kết hợp giọng tiếng Anh Kokoro-ONNX và bộ căn mốc từng từ faster-whisper cho giáo án mô phỏng phần mềm và video bài giảng.
---

# Giọng Đọc AI Bản Địa `VieNeu-TTS` & Căn Mốc Từ Tự Động (`/vieneu-tts-voice`)

> **Lưu ý quan trọng:** Kho kỹ năng này chỉ đóng gói **trình điều khiển gọn nhẹ** (`core_engine/voice_engine/vieneu_tts.py`, `voice_align.py`, `kokoro_tts.py`), **KHÔNG đóng gói kèm thư viện nặng hay tệp trọng số mô hình (~610 MB)** vào Git. Người dùng cài đặt thư viện theo đúng các bước dưới đây khi cần tạo âm thanh thuyết minh.

## 1. Yêu Cầu Môi Trường Nền
- **Python 3.12** (khuyên dùng Python 3.10–3.12 để tương thích hoàn toàn với `onnxruntime` và `vieneu`).
- **FFmpeg & FFprobe** (đã thêm vào biến môi trường `PATH`).

## 2. Cài Đặt `VieNeu-TTS` (Giọng Đọc Tiếng Việt 48kHz Offline)

### Bước 1: Tạo môi trường ảo (`.venv/vieneu`) và cài gói thư viện
**Trên Windows (PowerShell):**
```powershell
py -3.12 -m venv .venv\vieneu
.\.venv\vieneu\Scripts\pip install --upgrade pip
.\.venv\vieneu\Scripts\pip install vieneu huggingface_hub numpy
```

**Trên macOS / Linux (Bash):**
```bash
python3.12 -m venv .venv/vieneu
./.venv/vieneu/bin/pip install --upgrade pip
./.venv/vieneu/bin/pip install vieneu huggingface_hub numpy
```

### Bước 2: Tải trọng số mô hình một lần (~610 MB)
Mô hình `VieNeu-TTS-v3-Turbo` và bộ giải mã `MOSS-Audio-Tokenizer-Nano-ONNX` sẽ được tải tự động về thư mục `models/vieneu/` (nằm trong `.gitignore`, không đẩy lên Git):
```bash
# Windows:
.\.venv\vieneu\Scripts\python core_engine/voice_engine/vieneu_tts.py fetch

# macOS / Linux:
./.venv/vieneu/bin/python core_engine/voice_engine/vieneu_tts.py fetch
```

### Bước 3: Liệt kê danh sách 25 giọng đọc có sẵn & Sinh âm thanh thử nghiệm
```bash
# Xem danh sách giọng có sẵn (Hải Đăng, Ngọc Linh, Minh Quân, Trúc Ly...):
.\.venv\vieneu\Scripts\python core_engine/voice_engine/vieneu_tts.py voices

# Tạo nhanh 1 câu thuyết minh (48kHz WAV):
.\.venv\vieneu\Scripts\python core_engine/voice_engine/vieneu_tts.py say "Xin chào, đây là hệ thống mô phỏng phần mềm tương tác." --voice "Hải Đăng" --out temp/demo_voice.wav

# Nhân bản giọng nói cá nhân (Zero-shot Voice Cloning từ file mẫu 5-15 giây sạch):
.\.venv\vieneu\Scripts\python core_engine/voice_engine/vieneu_tts.py say "Câu thuyết minh bằng giọng của chính bạn." --ref temp/giong_mau_10s.wav --out temp/cloned_voice.wav
```

## 3. Cài Đặt Bộ Căn Mốc Từng Từ (`faster-whisper` Word-Level Alignment)
Khi cần đồng bộ chính xác từng từ giữa giọng đọc và hiệu ứng tô sáng trên màn hình (`voice_timeline.json`):
```bash
# Windows:
py -3.12 -m venv .venv\whisper
.\.venv\whisper\Scripts\pip install faster-whisper "av<19" numpy

# Chạy căn mốc từ cho một thư mục bài học/run:
.\.venv\whisper\Scripts\python core_engine/voice_engine/voice_align.py <duong_dan_run>
```

## 4. Cài Đặt Giọng Đọc Tiếng Anh (`Kokoro-ONNX` — Tuỳ Chọn)
```bash
py -3.12 -m venv .venv\kokoro
.\.venv\kokoro\Scripts\pip install kokoro soundfile numpy
.\.venv\kokoro\Scripts\python core_engine/voice_engine/kokoro_tts.py say "Welcome to the interactive software simulation." --out temp/en_voice.wav
```
