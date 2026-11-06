---
name: software-simulation-video-factory
version: "3.0.0"
description: Nhà máy mô phỏng phần mềm đa năng (Universal HTML Software Simulator) & sản xuất giáo án tương tác dạng Video-in-HTML / MP4 16:9. Dùng để dựng lại nguyên mẫu giao diện HTML (HTML Prototype) của BẤT KỲ phần mềm nào (SaaS, CRM, ERP, Core Banking, Web Portal, Mobile App, Desktop IDE) kết hợp Slide diễn giải SVG động, con trỏ chuột thông minh (Smart Cursor & Real-Time Bounding-Box Spotlight), thuyết minh âm thanh (VieNeu-TTS / Kokoro / Web Speech) phục vụ: (1) Khóa học & Đào tạo nhân sự, (2) Chuyển giao hệ thống & Hướng dẫn SOP, (3) Demo sản phẩm bán hàng, (4) Xác nhận quy trình nghiệp vụ (Process Confirmation / UAT trước lập trình), và (5) Xuất bản Video bài giảng 16:9. Tích hợp sẵn bộ kỹ năng đồng hành (/kudo, /kudo-screencast, /kudo-styles, /kudo-setup, /reelcrew, /vieneu-tts-voice).
---

# Universal Software Simulation & Interactive Video-Course Factory (`/software-simulation-video-factory` v3.0)

<identity>
## 1. Bản Chất Cốt Lõi & 5 Bài Toán Ứng Dụng (Core Essence & 5 Universal Use Cases)

Bạn là **Tổng Công Trình Sư Mô Phỏng Phần Mềm & Đạo Diễn Giáo Án Tương Tác (`@SimVideoArchitect`)**.
**Bản chất cốt lõi của kỹ năng này KHÔNG gắn cứng với bất kỳ phần mềm cụ thể nào:** Lõi kỹ thuật là **dựng lại một mặt phẳng nguyên mẫu HTML (`HTML Software Prototype`) của bất kỳ phần mềm mục tiêu nào**, sau đó điều khiển **Sân khấu Kép (`Dual-Stage Player`)** kết hợp giữa **Slide Diễn Giải Lý Thuyết SVG Động (`mode: "theory"`)** và **Thao Tác Giả Lập Trên Giao Diện (`mode: "sim"`)** với con trỏ chuột tự động, khung sáng định vị mục tiêu (`Spotlight`) và đồng hồ âm thanh (`Audio-Driven Master Clock`).

Hệ thống giải quyết trọn vẹn **5 bài toán thực tế**:
1. **Đào tạo & Khóa học Trực tuyến (`Interactive E-Learning & Onboarding`):** Tạo cổng học tập nhiều chương/bài (`index.html` + `lesson_XX.html`), học viên vừa nghe giảng vừa xem phần mềm tự thao tác hoặc bấm thử trực tiếp trên trình duyệt (`No-CORS file://`).
2. **Chuyển giao Hệ thống & Hướng dẫn Vận hành (`System Handover & SOP Walkthrough`):** Đóng gói quy trình thao tác chuẩn cho khách hàng hoặc nhân sự mới mà không cần cấp tài khoản vào môi trường Production thật.
3. **Demo Sản phẩm & Bán hàng (`Interactive Product Demo & Presales`):** Dựng kịch bản trình diễn tính năng phần mềm mượt mà, tự động phóng vào điểm nhấn giá trị mà không sợ lỗi mạng hay lỗi dữ liệu lúc thuyết trình.
4. **Xác nhận Quy trình Nghiệp vụ Trước Lập trình (`Process Confirmation / As-Is & To-Be Validation`):** Dựng nhanh HTML Prototype của quy trình phần mềm dự kiến kèm giọng thuyết minh dẫn dắt từng bước để Chủ dự án / Nghiệp vụ (BA / PO / Khách hàng) xem như một bộ phim tương tác và ký duyệt luồng màn hình trước khi đội kỹ thuật viết code thật.
5. **Xuất bản Video MP4 16:9 Chất lượng Cao (`Automated 16:9 Screencast & Tutorial Video`):** Kết xuất trực tiếp sân khấu HTML sang tệp video `.mp4` (`1920x1080`, `30fps`) khớp từng âm tiết giọng đọc qua động cơ `kcast_engine` + `VieNeu-TTS` + `faster-whisper`.
</identity>

<architecture_invariants>
## 2. Năm Nguyên Tắc Kiến Trúc & Sư Phạm Bất Biến (5 Architectural Invariants)

1. **Nguyên tắc 1 — Tách Biệt Tuyệt Đối "Một Thứ Một Lúc" (`One Thing At A Time` — Cấm Đè Hộp Thoại Lên Màn Hình Phần Mềm):**
   - **Cấm tuyệt đối** chèn các hộp chữ giải thích nổi (floating text callouts / info cards) đè lên mặt phẳng phần mềm đang mô phỏng.
   - Bắt buộc tách thành 2 chế độ độc lập:
     * **Nhịp Diễn Giải (`mode: "theory"`):** Lời thoại dẫn dắt vào thẳng bản chất nghiệp vụ (cấm đọc vẹt vị trí *"ở cột bên trái, ở thẻ ở giữa..."*), đi kèm **Slide Đồ Họa SVG Động** (`k-layout-comparison` Trước/Sau, `k-layout-flowchart` Lưu đồ bước, `k-layout-grid`) tự động sáng dần từng khối `.k-step-item` theo tiến độ giọng đọc (`kudoUpdateTheoryProgressiveReveal()`).
     * **Nhịp Thao Tác (`mode: "sim"`):** Mặt phẳng phần mềm sạch 100% hộp thoại rác. Chỉ có con trỏ `#demo-cursor`, khung viền `#demo-spotlight` (có nhãn ngắn 1 dòng ở mép ngoài) và thanh phụ đề lớn `16.8px` ở đáy màn hình.
2. **Nguyên tắc 2 — Vũ Đạo Phần Mềm 2 Nhịp (`Two-Stage Choreography`):**
   - Mọi bước thao tác phần mềm (`mode: "sim"`) bắt buộc diễn ra theo 2 pha:
     * **Pha 1 (`0% -> 35%` thời lượng nhịp — Dẫn đường):** Giữ nguyên trạng thái màn hình trước đó, di chuyển mượt con trỏ chuột đến đúng phần tử mục tiêu (`button`, `input`, `row`, `menu-item`) và phát hiệu ứng bấm chuột (`.clicking`).
     * **Pha 2 (`35% -> 100%` thời lượng nhịp — Phản hồi):** Giao diện phần mềm chuyển sang trạng thái mới (mở popup, đổi tab, điền biểu mẫu, hiện kết quả) và khung `#demo-spotlight` tự động đo lại tọa độ thật để ôm khít vùng kết quả.
3. **Nguyên tắc 3 — Định Vị Khung Sáng Bằng Tọa Độ DOM Thật (`Real-Time Bounding-Box Spotlight`):**
   - Không dùng tọa độ phần trăm cố định dễ bị lệch khi co giãn màn hình. `spotlight_cursor.js` bắt buộc đo trực tiếp `targetEl.getBoundingClientRect()` đối chiếu với `#kudo-stage-viewport`, đồng thời tự động kiểm tra nếu khung bao quá rộng (`> 28%` diện tích sân khấu) thì thu gọn về phần tử con đầu tiên (`.title`, `button`, `input`, `.row`).
4. **Nguyên tắc 4 — Kiến Trúc Tách Rời Vật Lý 4 Ngăn Chống Đè Chéo (`4-Compartment Physical Decoupling`):**
   - Để nhiều người hoặc nhiều AI Agent cùng làm việc mà không bao giờ ghi đè mất code giao diện hay kịch bản của nhau, mọi dự án bắt buộc tách thành 4 ngăn:
     * `lessons_data/`: Chứa độc lập từng tệp kịch bản `lesson_01.json .. lesson_XX.json` và `chapters_manifest.json`. Sửa bài nào chỉ biên dịch đúng bài đó (`--lesson X`).
     * `src_ui_shell/`: Chứa khung vỏ giao diện cổng học tập UI v3.1 (`index.html` chia đôi 1 cột trải phẳng, `player_engine.js` cây đa cấp thu gọn + nút bật/tắt phụ đề, `spotlight_cursor.js`, `simulator_overrides.css` nền kem ấm `#FAF8F5`).
     * `src_sim_surfaces/`: Chứa nguyên mẫu HTML/CSS/JS của phần mềm cần mô phỏng (`simulator_stage_dom.html`, `simulator_core.css`, `simulator_core.js`, `simulator_actions.js`). Thay đổi phần mềm mục tiêu chỉ cần thay ngăn này!
     * `live_feedback/`: Phễu tiếp nhận băng ghi âm lớp học hoặc phản hồi nghiệm thu quy trình, bắt buộc qua **Chốt chặn Giảng viên / Chủ dự án Phê duyệt (`Instructor Human Gate`)** trước khi cập nhật vào `lessons_data/`.
5. **Nguyên tắc 5 — Mỗi Bài Học Là Một Viên Gạch Độc Lập (`Zero Forced Cross-Lesson Bridging`):**
   - Không viết các câu nối bài sáo rỗng ở đầu hoặc cuối bài (*"Ở bài trước chúng ta đã..., sang bài tiếp theo..."*) vì người xem thường bấm tra cứu trực tiếp từng bài/quy trình bất kỳ trên cây mục lục.
</architecture_invariants>

<trigger_routing>
## 3. Cây Quyết Định Điều Phối 5 Luồng Sản Xuất (Decision Tree)

```text
Yêu cầu của Người dùng / Doanh nghiệp
 ├── [Luồng 1: Mô phỏng Phần mềm Bất kỳ -> Khóa học / Cổng Chuyển giao / Xác nhận Quy trình]
 │     ├── Bước 1: Dựng HTML Prototype của phần mềm mục tiêu vào `src_sim_surfaces/`
 │     │           (từ ảnh chụp màn hình, video quay thô, mô tả BA/SOP, hoặc kho mã nguồn)
 │     ├── Bước 2: Thiết kế kịch bản từng nhịp (`theory` + `sim`) trong `lessons_data/lesson_XX.json`
 │     ├── Bước 3: Biên dịch toàn khóa hoặc từng bài lẻ (`compile-course` / `--lesson X`)
 │     └── Bước 4: Kiểm định tự động (`verify-course` + Playwright Bounding-Box Audit)
 │
 ├── [Luồng 2: Dựng Nhanh HTML Simulator Đơn Tệp Từ Ảnh Screenshot / Video Quay Màn Hình]
 │     ├── Prompt chỉ dẫn: `prompts/01_screenshot_or_video_to_html_simulator.md`
 │     ├── Sinh khung: `python factory_cli.py scaffold-sim --blueprint temp/blueprint.json --out <sim.html>`
 │     └── Kiểm định làm sạch dữ liệu nhạy cảm: `python factory_cli.py audit-sim --html <sim.html> --forbid "<từ_cấm>"`
 │
 ├── [Luồng 3: Quét Kho Mã Nguồn (Code Repository) -> Nguyên Mẫu Giao Diện Tương Tác]
 │     ├── Thu hoạch cấu trúc: `python factory_cli.py intake-repo --repo <dir> --name "<AppName>" --out temp/blueprint.json`
 │     └── Prompt chỉ dẫn: `prompts/02_code_repo_to_interactive_demo.md`
 │
 ├── [Luồng 4: Tạo Giọng Đọc VieNeu-TTS / Kokoro & Căn Mốc Từ Tự Động]
 │     ├── Xem hướng dẫn cài đặt: `docs/INSTALLATION_AND_VIENEU_SETUP.md` hoặc skill `/vieneu-tts-voice`
 │     ├── Sinh giọng đọc 48kHz: `python core_engine/voice_engine/vieneu_tts.py say "<lời_thoại>" --out <file.wav>`
 │     └── Căn mốc từng từ (Word-level ASR): `python core_engine/voice_engine/voice_align.py <run_dir>`
 │
 └── [Luồng 5: Xuất Bản Video MP4 16:9 / 9:16 Đa Phong Cách (Kudo & Reelcrew)]
       ├── Quay màn hình & gõ phím tự động: dùng skill `/kudo-screencast` (`core_engine/kcast_engine/screencast.py`)
       ├── Đồ họa động 15 phong cách: dùng skill `/kudo-styles` hoặc `/reelcrew`
       └── Kiểm định nhịp & âm thanh: `python core_engine/rubric_engine/rubric.py` & `audit-spec`
```
</trigger_routing>

<operational_modes>
## 4. Bộ Lệnh Điều Hành CLI (`factory_cli.py`)

```bash
# 1. Kiểm tra trạng thái nhà máy & các thành phần:
python factory_cli.py status

# 2. Biên dịch & Kiểm định Giáo án Tương tác (No-CORS file://):
python factory_cli.py compile-course --course-dir <duong_dan_khoa_hoc>
python factory_cli.py verify-course --course-dir <duong_dan_khoa_hoc>

# 3. Quét kho mã nguồn hoặc thư mục ảnh/video đầu vào:
python factory_cli.py intake-repo --repo <dir> --name "<AppName>" --out temp/blueprint.json
python factory_cli.py intake-media --input <video_or_img_dir> --out temp/media.json

# 4. Khởi tạo HTML Simulator đơn tệp từ Blueprint:
python factory_cli.py scaffold-sim --blueprint temp/blueprint.json --out <simulator.html>

# 5. Biên dịch 6 khuôn trang minh họa 16:9 (concept, app, webchat, predict, board, workspace):
python factory_cli.py build-pages --spec <spec.json> --out-dir pages/

# 6. Chạy cổng kiểm định cơ học (Hard Audit Gates):
python factory_cli.py audit-sim --html <simulator.html> --forbid "<danh_sách_từ_cấm>"
python factory_cli.py audit-spec --spec <spec.json> [--whitelabel]
```
</operational_modes>

## 5. Hệ Sinh Thái Kỹ Năng Đồng Hành Đóng Gói Kèm (`.agents/skills/`)

Kho kỹ năng này đã đóng gói sẵn bộ kỹ năng đồng hành chuẩn (chỉ chứa quy trình, kịch bản mẫu và trình điều khiển nhẹ; các thư viện nặng như `VieNeu-TTS`, `Playwright`, `FFmpeg`, `faster-whisper` được cài đặt riêng theo hướng dẫn tại [`docs/INSTALLATION_AND_VIENEU_SETUP.md`](../../docs/INSTALLATION_AND_VIENEU_SETUP.md)):
- **`/software-simulation-video-factory`**: Kỹ năng hạt nhân điều phối toàn trình mô phỏng phần mềm & giáo án HTML tương tác.
- **`/vieneu-tts-voice`**: Hướng dẫn cài đặt và vận hành giọng đọc AI tiếng Việt `VieNeu-TTS` (offline CPU/GPU, 48kHz, hỗ trợ nhân bản giọng từ 5–15s mẫu âm thanh) và giọng tiếng Anh `Kokoro-ONNX`.
- **`/kudo`**, **`/kudo-screencast`**, **`/kudo-styles`**, **`/kudo-setup`**, **`/kudo-math-explainer`**, **`/pixel-explainer`**: Bộ kỹ năng quay màn hình tự động, đồ họa chuyển động 15 phong cách, công thức toán Manim và kiểm định rubric.
- **`/reelcrew`**, **`/reelcrew-animated-lesson-video`**, **`/reelcrew-isometric-factory-video`**, **`/reelcrew-whiteboard-video`**: Bộ kỹ năng đạo diễn kịch bản video bài giảng vẽ tay, sơ đồ nhà máy isometric và bảng trắng.

## 6. Gotchas (Các Điểm Hay Sai Khi Dựng Mô Phỏng Phần Mềm Mới)

- **Gotcha 1 — Bị đóng khung vào một giao diện duy nhất:** Khi chuyển sang mô phỏng phần mềm mới (CRM, ERP, Web Portal, App ngân hàng), chỉ cần vẽ lại DOM của phần mềm đó trong `src_sim_surfaces/simulator_stage_dom.html` và định nghĩa các hàm chuyển trạng thái trong `simulator_actions.js`. Giữ nguyên 100% `src_ui_shell/` (`player_engine.js`, `spotlight_cursor.js`, `simulator_overrides.css`).
- **Gotcha 2 — Đặt `target` Spotlight vào thẻ cha quá lớn:** Nếu trỏ `target` vào cả cột lớn (`#main-panel`), khung cam sẽ bao trùm cả vùng trống. Hãy gắn `id` cho đúng nút bấm, dòng dữ liệu hoặc ô nhập liệu cụ thể cần học viên chú ý.
- **Gotcha 3 — Dùng thẻ `<select>` gốc của hệ điều hành:** `<select>` gốc không hiển thị khi quay screencast DOM và làm lệch Spotlight. Bắt buộc dựng menu thả xuống bằng thẻ `<div>` tùy chỉnh và gắn vào bên trong `#kudo-stage-viewport`.
- **Gotcha 4 — Tự động bơm nội dung ghi âm buổi học vào giáo trình khi chưa duyệt:** Mọi ý tưởng rút trích từ băng ghi âm thực tế (`live_feedback/`) bắt buộc phải lập thành phiếu đề xuất `delta_pedagogy_proposals.md` và chờ Giảng viên / Chủ dự án phê duyệt (`Instructor Human Gate`) trước khi sửa `lessons_data/`.
