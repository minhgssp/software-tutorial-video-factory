# Thu Hoạch Cải Tiến Đa Dự Án (Cross-Project Harvest — 2026-11-06)

Tài liệu này ghi nhận **4 cải tiến cốt lõi** được đúc kết từ quá trình đối sánh và nâng cấp đồng bộ giữa 3 dự án đang áp dụng quy trình Mô phỏng Phần mềm Tương tác & Học viện Trực tuyến:
1. **Nhà máy Gốc (`C:\Github\software-tutorial-video-factory` & `SP_261104_06`)**
2. **Khóa học `Antigravity Basic` (`SP_261104_01`)**
3. **Khóa học `BIDV 0,5 Ngày — Làm Chủ Trợ Lý AI Trong Không Gian Làm Việc Số` (`SP_261027_04`)**

---

## 1. Kiến trúc Tách Rời Vật Lý 4 Ngăn Chống Đè Chéo Đa Agent (`PROP-261106-04`)

### Bản chất vấn đề
Khi nhiều cửa sổ AI (hoặc nhiều thành viên) cùng làm việc trên một khóa học: một bên sửa nội dung từng bài học và chạy script build tổng, một bên tinh chỉnh khung giao diện (`index.html`, `player_engine.js`, `spotlight_cursor.js`). Nếu cả dữ liệu bài học lẫn mã nguồn giao diện bị nhồi chung vào một script build nguyên khối (`build_modular_course.py`), bất kỳ ai bấm chạy build cũng sẽ vô tình lấy bản cũ trong script đè mất thành quả của người kia.

### Giải pháp kiến trúc (4 Ngăn Độc Lập)
1. **Ngăn 1 — Dữ liệu Kịch bản Bài học (`lessons_data/lesson_01.json .. lesson_XX.json` & `chapters_manifest.json`):**
   - Mỗi bài học được tách thành một tệp JSON độc lập tuyệt đối.
   - Khi sửa bài `X`, chỉ chạy lệnh biên dịch hạt nhân `--lesson X`: chỉ xuất lại `lesson_XX.html` và `lessons/lesson_XX/lesson_spec.js`, **tuyệt đối không chạm vào** `index.html` hay `assets/css/`, `assets/js/`.
2. **Ngăn 2 — Khung Vỏ Giao diện Học tập (`src_ui_shell/`):**
   - Lưu trữ độc lập toàn bộ UI v3.1 (`index.html` cổng mục lục 1 cột trải phẳng, `player_engine.js` cây đa cấp thu gọn + nút `"📝 Phụ đề tự động"`, `spotlight_cursor.js` đo tọa độ thật `getBoundingClientRect()` ôm sát mục tiêu con, `simulator_overrides.css` nền kem ấm `#FAF8F5` + phụ đề lớn `16.8px`).
3. **Ngăn 3 — Mặt phẳng Giả lập Phần mềm (`src_sim_surfaces/`):**
   - Lưu trữ độc lập DOM giả lập (`simulator_stage_dom.html`), CSS (`simulator_core.css`) và kịch bản hành vi (`simulator_core.js`, `simulator_actions.js`).
4. **Ngăn 4 — Phễu Tiếp nhận Phản hồi Thực chiến (`live_feedback_YYYYMMDD/`):**
   - Tách riêng băng ghi âm buổi dạy thực tế (`raw_recording/`), bản bóc băng (`transcript_segments/`) và nhật ký chênh lệch sư phạm (`delta_pedagogy_insights.md`) trước khi bơm ngược vào từng tệp `lesson_XX.json`.

---

## 2. Thiết kế Lý Thuyết "Lời Thoại Dẫn Dắt Trước → Minh Họa SVG Động Theo Sau" & Cắt Bỏ Câu Nối Bài Khiên Cưỡng (`PROP-261106-02`)

### Bản chất sư phạm
- **Chấm dứt đọc vẹt vị trí trên màn hình:** Xóa bỏ hoàn toàn các câu thuyết minh máy móc kiểu *"Ở khung bên trái..., ở thẻ ở giữa..., ở cột bên phải..."*. Thay vào đó, lời thoại đi thẳng vào bản chất nghiệp vụ và nỗi đau thực tế của học viên; hình ảnh đồ họa SVG động (`s1` đối sánh Trước/Sau `k-layout-comparison`, `s2` lưu đồ `k-layout-flowchart`) tự động sáng lên đồng bộ theo từng nhịp giọng đọc nhờ hàm tổng quát hóa `kudoUpdateTheoryProgressiveReveal()` (tự động chia tỷ lệ `Math.floor(ratio * n)` trên mọi số lượng `.k-step-item`).
- **Chấm dứt câu nối bài miễn cưỡng (Zero Forced Cross-Lesson Bridging):** Loại bỏ các câu mở đầu/kết thúc sáo rỗng (*"Ở bài trước chúng ta đã..., sang bài tiếp theo chúng ta sẽ..."*) vì học viên có thể bấm xem bất kỳ bài nào theo nhu cầu tra cứu. Mỗi bài học phải là một đơn vị tri thức tự thân hoàn chỉnh (Self-Contained Learning Atom).

---

## 3. Mở Rộng Thư Viện Cảnh Giả Lập Tương Tác Chuyên Sâu (`simulator_actions.js`)

Bổ sung các kịch bản mô phỏng thao tác phần mềm sát thực tế giảng dạy:
- **Bôi đen & Trích dẫn Ngữ cảnh (`kudoActivateQuoteDemo`):** Mô phỏng thao tác bôi đen dòng văn bản, bấm `Quote` (`Ctrl+L`) để ghim thẻ `@file#L7-L8` vào khung chat.
- **Phỏng vấn Ngược & Lập Kế hoạch (`kudoRunGrillAndPlanDemo`):** Mô phỏng luồng gõ `/grill-me` để AI hỏi vặn lại các thông số còn thiếu trước khi gọi `/plan`.
- **Tự động Ghi nhớ Quy tắc (`kudoRunLearnDemo`):** Mô phỏng lệnh `/learn` tự động rút trích quy tắc mới từ cuộc trò chuyện và ghi thẳng vào `.agent/rules/noi_quy_chung.md` kèm hiệu ứng viền sáng xanh.
- **Xử lý 3 Trạng thái AI Dừng chờ (`kudoRunThreeStuckStatesDemo` & `kudoRunAskAiWhenStuckDemo`):** Mô phỏng trực quan thanh trạng thái khi AI chờ bấm `Accept / Allow` hoặc khi cần chụp màn hình hỏi lại AI.
- **Tự động Mount Hộp thoại Modal vào Khung Sân Khấu:** Tự động đưa 4 modal (`win-open-folder-modal`, `ide-settings-picker-modal`, `ide-sub-perm-modal`, `ide-move-warn-modal`) vào trong `#kudo-stage-viewport` để khung Spotlight luôn đo đúng tọa độ tương đối.

---

## 4. Chuẩn Hóa Nâng Cấp Dự Án BIDV (`SP_261027_04`) Lên Kiến Trúc 3 Ngăn Độc Lập

- Trước đây script [`temp/run_once_build_bidv_05day_html_sim.py`](file:///c:/commandcenter/SPRINTS/SP_261027_04_BIDV_AgileAcademy_2Courses_WorkspaceKWSR_And_ZaloAgentOS_RM/temp/run_once_build_bidv_05day_html_sim.py) của BIDV import trực tiếp biến nội bộ từ `build_modular_course.py` của `Antigravity Basic`, dẫn đến nguy cơ gãy phụ thuộc hoặc ghi đè chéo.
- Hiện tại dự án BIDV đã có bộ 3 ngăn độc lập ngay tại `course_01_bidv_caugiay_workspace_kwsr/`:
  * `lessons_data/` (12 tệp `lesson_01.json .. lesson_12.json` với 84 điểm neo chuẩn nghiệp vụ Ngân hàng BIDV).
  * `src_ui_shell/` (Giao diện UI v3.1 nền kem ấm, cổng mục lục 1 cột trải phẳng, cây đa cấp thu gọn, đo tâm điểm thật `getBoundingClientRect()`).
  * `src_sim_surfaces/` (Mặt phẳng giả lập đã làm sạch dữ liệu cá nhân, chuẩn hóa `BIDV_CauGiay_Workspace`).
- Hỗ trợ chạy cả chế độ toàn khóa (`python temp/run_once_build_bidv_05day_html_sim.py`) lẫn chế độ sửa lẻ từng bài (`python temp/run_once_build_bidv_05day_html_sim.py --lesson 1`) mà không bao giờ làm mất bản chỉnh sửa giao diện.
