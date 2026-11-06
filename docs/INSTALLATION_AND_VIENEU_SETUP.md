# Hướng Dẫn Cài Đặt & Sử Dụng Toàn Trình (`Installation & VieNeu-TTS Setup Guide`)

Kho mã nguồn này được đóng gói theo chuẩn **Agent Skill Pack** (`.agents/skills/` & `.claude/skills/`) kết hợp **Bộ Công Cụ Biên Dịch Nhẹ (`factory_cli.py` & `core_engine/`)**.
Theo nguyên tắc **Giữ Kho Git Gọn Nhẹ (Zero Heavy Binaries in Git)**, kho mã nguồn **không đính kèm** các thư viện cài đặt sẵn (`.venv/`, `node_modules/`, trình duyệt Chromium hay trọng số mô hình AI nặng hàng GB). Bạn chỉ cần cài đặt các thư viện phụ trợ dưới đây theo đúng nhu cầu sử dụng.

---

## 1. Cài Đặt Bộ Kỹ Năng Cho AI Agent (Claude Code, Antigravity, Cursor, Codex)

### Cách 1: Mở trực tiếp thư mục Repo này làm Workspace
Khi bạn clone kho này về máy và mở trong **Antigravity**, **Claude Code**, hoặc **Cursor**:
```bash
git clone https://github.com/minhgssp/software-tutorial-video-factory.git
cd software-tutorial-video-factory
```
Hệ thống Agent sẽ tự động nhận diện toàn bộ bộ kỹ năng nằm sẵn trong `.agents/skills/` và `.claude/skills/`, bao gồm:
- `/software-simulation-video-factory` — Kỹ năng chính: Dựng nguyên mẫu HTML phần mềm bất kỳ + tạo khóa học/bản trình diễn tương tác.
- `/vieneu-tts-voice` — Kỹ năng cài đặt & tổng hợp giọng đọc AI tiếng Việt `VieNeu-TTS` (48kHz, offline) & tiếng Anh `Kokoro`.
- `/kudo`, `/kudo-screencast`, `/kudo-styles`, `/kudo-setup`, `/kudo-math-explainer`, `/pixel-explainer` — Bộ kỹ năng quay màn hình tự động, đồ họa chuyển động 15 phong cách và kiểm định rubric.
- `/reelcrew`, `/reelcrew-animated-lesson-video`, `/reelcrew-isometric-factory-video`, `/reelcrew-whiteboard-video` — Bộ kỹ năng đạo diễn kịch bản video bài giảng vẽ tay, sơ đồ nhà máy isometric và bảng trắng.

### Cách 2: Copy bộ kỹ năng vào dự án bất kỳ của bạn
Copy thư mục `.agents/skills/` (hoặc `.claude/skills/`) vào thư mục gốc dự án của bạn để gọi lệnh `/software-simulation-video-factory` ở bất cứ đâu.

---

## 2. Cài Đặt Môi Trường Cơ Bản (Dựng Giao Diện Mô Phỏng & Giáo Án HTML)

Nếu bạn chỉ cần dựng nguyên mẫu phần mềm HTML (`HTML Prototype`) và xuất bản cổng khóa học tương tác chạy trực tiếp trên trình duyệt (`file://` hoặc Web Server tĩnh):

```bash
# 1. Yêu cầu Python 3.10+ (khuyên dùng Python 3.12)
python --version

# 2. Cài đặt thư viện kiểm thử & kiểm định giao diện cơ bản:
pip install pytest pyyaml pillow playwright
python -m playwright install chromium

# 3. Kiểm tra trạng thái nhà máy:
python factory_cli.py status
pytest -p no:asyncio -q
```

---

## 3. Cài Đặt Động Cơ Giọng Đọc `VieNeu-TTS` (Tiếng Việt Offline 48kHz — Không Tốn Phí API)

Để tạo thuyết minh giọng đọc tiếng Việt tự nhiên khớp với từng bước di chuột và từng slide lý thuyết SVG, hệ thống tích hợp trình điều khiển `core_engine/voice_engine/vieneu_tts.py` (sử dụng mô hình mã nguồn mở `VieNeu-TTS-v3-Turbo` Apache 2.0, chạy mượt ngay trên CPU hoặc GPU).

### Bước 3.1: Cài đặt FFmpeg
- **Windows:** `winget install Gyan.FFmpeg` (hoặc tải từ `ffmpeg.org` và thêm vào `PATH`).
- **macOS:** `brew install ffmpeg`
- **Ubuntu/Debian:** `sudo apt-get update && sudo apt-get install -y ffmpeg`

### Bước 3.2: Tạo môi trường ảo `.venv/vieneu` và cài đặt thư viện `vieneu`
**Trên Windows (PowerShell):**
```powershell
py -3.12 -m venv .venv\vieneu
.\.venv\vieneu\Scripts\pip install --upgrade pip
.\.venv\vieneu\Scripts\pip install vieneu huggingface_hub numpy
```

**Trên macOS / Linux:**
```bash
python3.12 -m venv .venv/vieneu
./.venv/vieneu/bin/pip install --upgrade pip
./.venv/vieneu/bin/pip install vieneu huggingface_hub numpy
```

### Bước 3.3: Tải trọng số mô hình `VieNeu-TTS` về máy (~610 MB — chỉ tải 1 lần)
```bash
# Windows:
.\.venv\vieneu\Scripts\python core_engine/voice_engine/vieneu_tts.py fetch

# macOS / Linux:
./.venv/vieneu/bin/python core_engine/voice_engine/vieneu_tts.py fetch
```
*(Trọng số được lưu tại `models/vieneu/` và đã được cấu hình bỏ qua trong `.gitignore`).*

### Bước 3.4: Sinh âm thanh thuyết minh cho bài học
```bash
# 1. Xem danh sách 25 giọng đọc có sẵn (mặc định: Hải Đăng):
.\.venv\vieneu\Scripts\python core_engine/voice_engine/vieneu_tts.py voices

# 2. Tạo file âm thanh WAV 48kHz cho một nhịp bài giảng:
.\.venv\vieneu\Scripts\python core_engine/voice_engine/vieneu_tts.py say "Bước đầu tiên, chúng ta bấm vào nút Duyệt tờ trình ở góc phải màn hình." --voice "Hải Đăng" --out temp/b3.wav

# 3. Nhân bản giọng đọc của giảng viên từ mẫu thu âm 5-15 giây:
.\.venv\vieneu\Scripts\python core_engine/voice_engine/vieneu_tts.py say "Nội dung thuyết minh bằng giọng giảng viên." --ref temp/mau_giong_10s.wav --out temp/b3_custom.wav
```

---

## 4. Cài Đặt Bộ Căn Mốc Từng Từ (`faster-whisper` — Tuỳ Chọn Khi Xuất Video MP4)

Khi cần căn thời gian chính xác đến từng âm tiết (`word-level timestamps`) để dựng phụ đề karaoke hoặc khớp chuyển động đồ họa Kudo/Reelcrew:
```bash
# Windows:
py -3.12 -m venv .venv\whisper
.\.venv\whisper\Scripts\pip install faster-whisper "av<19" numpy

# Chạy căn mốc tự động:
.\.venv\whisper\Scripts\python core_engine/voice_engine/voice_align.py <thu_muc_run>
```

---

## 5. Quy Trình 4 Bước Mô Phỏng Bất Kỳ Phần Mềm Nào Trong Tương Lai

Khi bạn muốn áp dụng bộ công cụ này cho một **phần mềm hoàn toàn mới** (ví dụ: Hệ thống CRM, Phần mềm Kế toán ERP, Cổng Phê duyệt Ngân hàng, Web App nội bộ, hoặc Xác nhận Quy trình BA/UAT):

1. **Bước 1 — Dựng mặt phẳng nguyên mẫu (`src_sim_surfaces/`):**
   - Cung cấp ảnh chụp màn hình, video quay thao tác hoặc mô tả quy trình cho AI Agent kèm lệnh `/software-simulation-video-factory`.
   - Agent sẽ dựng lại giao diện phần mềm đó bằng HTML/CSS sạch trong `simulator_stage_dom.html` và viết các hàm phản hồi trạng thái (mở popup, lọc bảng, điền form, bấm nút duyệt) trong `simulator_actions.js`.
2. **Bước 2 — Soạn kịch bản tách đôi Lý thuyết & Thao tác (`lessons_data/lesson_XX.json`):**
   - Mỗi nhịp (`beat`) được khai báo rõ là `mode: "theory"` (Slide đồ họa SVG động giải thích quy trình/tư duy) hoặc `mode: "sim"` (Con trỏ chuột tự động di chuyển đến đúng phần tử `#id` trên giao diện phần mềm và kích hoạt thao tác).
3. **Bước 3 — Biên dịch & Tạo giọng thuyết minh:**
   - Chạy `python factory_cli.py compile-course --course-dir <thu_muc_du_an>` (hoặc biên dịch lẻ từng bài `--lesson X` để không đè lên giao diện).
   - Sinh âm thanh thuyết minh 48kHz qua `VieNeu-TTS` (nếu chưa có file âm thanh, trình phát tự động dùng đồng hồ dự phòng hoặc Web Speech API).
4. **Bước 4 — Kiểm định độ chính xác (`verify-course`):**
   - Chạy `python factory_cli.py verify-course --course-dir <thu_muc_du_an>` để kiểm tra 0 lỗi thiếu điểm neo, 0 hộp chữ đè lên màn hình mô phỏng, và khung `#demo-spotlight` ôm khít đúng mục tiêu.
