# Universal Software Simulation & Interactive Video-Course Factory (`v3.0`)

> **Bộ Kỹ Năng Tiêu Chuẩn (`.agents/skills/` & `.claude/skills/`) & Động Cơ Dựng Nguyên Mẫu Phần Mềm HTML (`HTML Prototype`) Kết Hợp Slide Diễn Giải SVG Động, Con Trỏ Thông Minh (`Smart Cursor & Bounding-Box Spotlight`) và Thuyết Minh Âm Thanh (`VieNeu-TTS` / `Kokoro` / `Web Speech`).**

---

## 1. Bản Chất Cốt Lõi & 5 Bài Toán Ứng Dụng Thực Tế

Kho mã nguồn này cung cấp một **dây chuyền tổng quát (Domain-Agnostic)** để mô phỏng **bất kỳ phần mềm nào trong tương lai** (Web App, SaaS, CRM, ERP, Core Banking, Cổng nội bộ, Mobile App hay Desktop IDE).

Thay vì quay màn hình thủ công dễ lỗi, khó sửa và nặng dung lượng, hệ thống tiếp cận theo nguyên lý **Dựng Nguyên Mẫu Giao Diện HTML (`HTML Software Prototype`) + Điều Khiển Kịch Bản Kép (`Dual-Stage Choreography`)**:
- **Nhịp Diễn Giải (`mode: "theory"`):** Tách biệt hoàn toàn ra một mặt phẳng Slide đồ họa SVG động (đối sánh Trước/Sau, Lưu đồ quy trình, Kiến trúc hệ thống) tự động sáng dần từng bước theo giọng đọc.
- **Nhịp Thao Tác Phần Mềm (`mode: "sim"`):** Mặt phẳng phần mềm sạch 100% hộp chữ rác (tuân thủ nguyên tắc *One Thing At A Time*), có con trỏ chuột tự động lướt đến đúng nút bấm/ô nhập liệu, kích hoạt trạng thái DOM mới và đóng khung sáng (`#demo-spotlight`) đo theo tọa độ thực tế `getBoundingClientRect()`.

### 5 Bài Toán Áp Dụng Trực Tiếp:
1. **Đào tạo & Khóa học Trực tuyến (`Interactive E-Learning & Onboarding`):** Xuất bản cổng học tập nhiều chương/bài (`index.html` + cây mục lục đa cấp thu gọn), học viên vừa nghe giảng vừa xem phần mềm tự thao tác hoặc bấm thử trực tiếp trên trình duyệt (`No-CORS file://`).
2. **Chuyển giao Hệ thống & Hướng dẫn Vận hành (`System Handover & SOP Walkthrough`):** Đóng gói cẩm nang thao tác phần mềm trực quan cho khách hàng hoặc nhân sự mới mà không cần mở quyền truy cập vào hệ thống thật.
3. **Demo Sản phẩm & Bán hàng (`Interactive Product Demo & Presales`):** Dựng kịch bản trình diễn tính năng phần mềm mượt mà, chuẩn xác 100% ở mọi buổi thuyết trình.
4. **Xác nhận Quy trình Nghiệp vụ Trước Lập trình (`Process Confirmation / BA & UAT Sign-off`):** Dựng nhanh nguyên mẫu HTML của quy trình phần mềm dự kiến kèm giọng thuyết minh giải thích từng bước để Chủ dự án / Khách hàng xem và chốt luồng màn hình (`As-Is` vs `To-Be`) trước khi đội kỹ thuật bắt tay vào code.
5. **Xuất bản Video MP4 16:9 / 9:16 Tự động (`Automated Screencast & Motion Video`):** Kết xuất sân khấu HTML thành tệp video `.mp4` (`1920x1080`, `30fps`) khớp từng âm tiết giọng đọc qua động cơ `kcast_engine` + `VieNeu-TTS` + `faster-whisper`.

---

## 2. Cấu Trúc Kho Mã Nguồn & Bộ Kỹ Năng Đóng Gói Kèm

Kho mã nguồn được đóng gói chuẩn **Agent Skill Pack** (nhận diện tự động bởi **Claude Code**, **Antigravity**, **Cursor**, **Codex**) và **không chứa các thư viện/trọng số nặng**:

```text
software-tutorial-video-factory/
├── .agents/skills/ & .claude/skills/          # Bộ 12 Kỹ năng AI Agent đóng gói chuẩn
│   ├── software-simulation-video-factory/     # [Kỹ năng chính] Điều phối mô phỏng phần mềm & khóa học HTML
│   ├── vieneu-tts-voice/                      # Kỹ năng cài đặt & tổng hợp giọng đọc VieNeu-TTS 48kHz
│   ├── kudo/                                  # Kỹ năng điều phối xưởng video đồ họa Kudo
│   ├── kudo-screencast/                       # Kỹ năng quay màn hình & gõ phím tự động
│   ├── kudo-styles/                           # Kỹ năng dựng video giải thích 15 phong cách đồ họa
│   ├── kudo-setup/                            # Kỹ năng cài đặt môi trường Kudo theo từng luồng
│   ├── kudo-math-explainer/                   # Kỹ năng dựng đồ thị & công thức toán Manim
│   ├── kudo-talk-clean/                       # Kỹ năng làm sạch video talking-head
│   ├── pixel-explainer/                       # Kỹ năng hoạt hình Pixel Art 8-bit/16-bit
│   ├── reelcrew/                              # Kỹ năng đạo diễn & hậu kỳ video bằng lệnh CLI
│   ├── reelcrew-animated-lesson-video/        # Kỹ năng dựng bài giảng hoạt hình vẽ tay
│   ├── reelcrew-isometric-factory-video/      # Kỹ năng dựng video sơ đồ nhà máy Isometric
│   └── reelcrew-whiteboard-video/             # Kỹ năng dựng video bảng trắng vẽ tay
├── core_engine/                               # Động cơ biên dịch & kiểm định lõi (Python + JS)
│   ├── course_compiler.py                     # Bộ biên dịch 4 ngăn & cổng kiểm định khóa học
│   ├── intake_extractor.py                    # Bộ quét kho mã nguồn / ảnh chụp -> blueprint.json
│   ├── scene_builder.py                       # Bộ dựng khung HTML Simulator tự động
│   ├── syncgate_and_foley.py                  # Cổng đồng bộ âm thanh & tiếng động Foley 48kHz
│   ├── voice_engine/                          # Trình điều khiển VieNeu-TTS, Kokoro & căn mốc từ ASR
│   │   ├── vieneu_tts.py
│   │   ├── voice_align.py
│   │   └── kokoro_tts.py
│   ├── rubric_engine/                         # Bộ chấm điểm định lượng chất lượng chuyển động
│   │   ├── rubric.py
│   │   └── RUBRIC-MOTION.md
│   └── kcast_engine/                          # Động cơ quay màn hình Playwright -> MP4 16:9
├── examples/                                  # Các dự án mẫu đa lĩnh vực
│   ├── saas_workflow_process_demo/            # [Mẫu 1] Mô phỏng Phần mềm ERP/CRM (Xác nhận quy trình & Đào tạo)
│   ├── ui_learning_portal_demo/               # [Mẫu 2] Cổng Học tập Tương tác UI v3.1 (Master-Detail + Tree Sidebar)
│   ├── antigravity_studio_simulator/          # [Mẫu 3] Khóa học 24 Bài giả lập phần mềm Desktop IDE
│   └── enterprise_16x9_course/                # [Mẫu 4] Đặc tả xuất bản Video bài giảng 16:9
├── docs/
│   ├── INSTALLATION_AND_VIENEU_SETUP.md       # Hướng dẫn cài đặt chi tiết (Python, VieNeu-TTS, Whisper, FFmpeg)
│   ├── SPEC_V2_5LAYER_COURSEWARE_ENGINE.md    # Đặc tả kiến trúc Giáo án Tương tác & Tách lớp 4 Ngăn
│   └── CODEMAP.md                             # Bản đồ mã nguồn toàn hệ thống
└── factory_cli.py                             # Giao diện dòng lệnh trung tâm
```

---

## 3. Hướng Dẫn Cài Đặt Nhanh (Chi Tiết Xem Tại [`docs/INSTALLATION_AND_VIENEU_SETUP.md`](docs/INSTALLATION_AND_VIENEU_SETUP.md))

### 3.1. Cài đặt môi trường cơ bản (Biên dịch & Kiểm định HTML Simulator)
```bash
git clone https://github.com/minhgssp/software-tutorial-video-factory.git
cd software-tutorial-video-factory

# Cài đặt thư viện kiểm thử nhẹ:
pip install pytest pyyaml pillow playwright
python -m playwright install chromium

# Kiểm tra trạng thái nhà máy & chạy bộ test:
python factory_cli.py status
pytest -p no:asyncio -q
```

### 3.2. Cài đặt giọng đọc AI tiếng Việt `VieNeu-TTS` (Offline 48kHz — Tùy chọn)
Kho mã nguồn không đính kèm trọng số mô hình (~610 MB) để giữ Git gọn nhẹ. Khi cần sinh giọng thuyết minh tiếng Việt tự nhiên (hoặc nhân bản giọng nói từ mẫu 5–15 giây):

**Trên Windows (PowerShell):**
```powershell
py -3.12 -m venv .venv\vieneu
.\.venv\vieneu\Scripts\pip install --upgrade pip
.\.venv\vieneu\Scripts\pip install vieneu huggingface_hub numpy

# Tải mô hình VieNeu-TTS một lần (~610 MB) về models/vieneu/:
.\.venv\vieneu\Scripts\python core_engine/voice_engine/vieneu_tts.py fetch

# Sinh thử 1 câu thuyết minh (48kHz WAV):
.\.venv\vieneu\Scripts\python core_engine/voice_engine/vieneu_tts.py say "Xin chào, đây là nguyên mẫu mô phỏng phần mềm." --voice "Hải Đăng" --out temp/demo.wav
```

**Trên macOS / Linux:**
```bash
python3.12 -m venv .venv/vieneu
./.venv/vieneu/bin/pip install --upgrade pip
./.venv/vieneu/bin/pip install vieneu huggingface_hub numpy
./.venv/vieneu/bin/python core_engine/voice_engine/vieneu_tts.py fetch
./.venv/vieneu/bin/python core_engine/voice_engine/vieneu_tts.py say "Xin chào, đây là nguyên mẫu mô phỏng phần mềm." --voice "Hải Đăng" --out temp/demo.wav
```

---

## 4. Kiến Trúc Tách Rời Vật Lý 4 Ngăn Chống Đè Chéo (`4-Compartment Architecture`)

Khi áp dụng cho dự án mới, hệ thống tách bạch hoàn toàn 4 ngăn vật lý để nhiều thành viên/Agent cùng làm việc mà không bao giờ ghi đè mất thành quả của nhau:
1. **`lessons_data/`**: Lưu từng bài học/quy trình dưới dạng tệp JSON độc lập (`lesson_01.json`, `chapters_manifest.json`). Sửa bài nào chỉ biên dịch đúng bài đó (`--lesson X`).
2. **`src_ui_shell/`**: Lưu khung vỏ giao diện trình phát UI v3.1 (`index.html` cổng mục lục 1 cột trải phẳng, `player_engine.js` cây đa cấp thu gọn + nút bật/tắt phụ đề, `spotlight_cursor.js` đo tọa độ thật `getBoundingClientRect()`, `simulator_overrides.css` nền kem ấm `#FAF8F5` + phụ đề lớn `16.8px`).
3. **`src_sim_surfaces/`**: Lưu nguyên mẫu HTML/CSS/JS của phần mềm mục tiêu (`simulator_stage_dom.html`, `simulator_core.css`, `simulator_actions.js`). Khi đổi sang mô phỏng phần mềm khác (CRM, ERP, Web Portal), chỉ cần thay ngăn này!
4. **`live_feedback/`**: Phễu tiếp nhận băng ghi âm lớp học hoặc góp ý nghiệm thu quy trình (UAT), bắt buộc lập thành phiếu đề xuất (`delta_pedagogy_proposals.md`) và **phải có Giảng viên / Chủ dự án phê duyệt (`Instructor Human Gate`)** trước khi cập nhật vào `lessons_data/`.

---

## 5. Các Lệnh CLI Thường Dùng (`factory_cli.py`)

```bash
# 1. Xem trạng thái tổng thể:
python factory_cli.py status

# 2. Biên dịch & Kiểm định khóa học HTML tương tác:
python factory_cli.py compile-course --course-dir examples/antigravity_studio_simulator
python factory_cli.py verify-course --course-dir examples/antigravity_studio_simulator

# 3. Quét kho mã nguồn phần mềm bất kỳ -> Blueprint JSON -> Khung HTML Simulator:
python factory_cli.py intake-repo --repo /path/to/app --name "FlowERP" --out temp/blueprint.json
python factory_cli.py scaffold-sim --blueprint temp/blueprint.json --out temp/FlowERP_Simulator.html

# 4. Kiểm định làm sạch dữ liệu nhạy cảm trên HTML Simulator:
python factory_cli.py audit-sim --html temp/FlowERP_Simulator.html --forbid "TenKhachHangNoiBo"
```
