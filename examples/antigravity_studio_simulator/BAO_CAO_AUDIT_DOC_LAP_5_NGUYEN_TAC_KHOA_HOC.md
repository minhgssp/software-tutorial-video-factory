# BÁO CÁO KIỂM TOÁN ĐỘC LẬP (`/audit`) — ĐÁNH GIÁ 5 NGUYÊN TẮC SƯ PHẠM & HIỆN TRẠNG TRIỂN KHAI KHÓA HỌC ANTIGRAVITY BASIC

- **Chủ trì kiểm toán:** `@AuditArbiter` (A-10 — Sub-agent độc lập `adcf0edb-fdb5-4f10-8d05-a54b860a1f68`) kết hợp CLI `run_audit.py parity` & `run_audit.py pdca`.
- **Phán quyết có điều kiện (Conditional Verdict — `PROP-261014-08`):**
  1. **Khẳng định cốt lõi:** **TỪ CHỐI NGHIỆM THU TẠM THỜI (`REJECTED AT GATE — P0 BLOCKERS FOUND`)** đối với bản thiết kế và mã nguồn đang viết dở tại [`course_24_lessons_spec.py`](file:///c:/commandcenter/SPRINTS/SP_261104_01_Antigravity_Basic_06_Transcription_And_Curriculum/scripts/course_24_lessons_spec.py).
  2. **Điều kiện ràng buộc tiên quyết:** Phải khắc phục triệt để **4 lỗi cấp P0 (Blocker)** và **3 lỗi cấp P1 (Major)** được bóc trần dưới đây trước khi biên dịch sang HTML và chạy tổng hợp giọng nói `VieNeu-TTS`.
  3. **Người chịu trách nhiệm kiểm tra (Verification Owner):** CEO Hoàng Đức Minh (duyệt phương án cấu trúc) & `@AuditArbiter` (hậu kiểm tự động).
  4. **Cơ chế kiểm chứng:** Kiểm tra bằng `run_audit.py parity`, kiểm thử E2E Playwright trên trình duyệt và đối chiếu 1-1 với 5 nguyên tắc của CEO.

---

## 1. Tuyên Bố Tự Khai Điểm Yếu (`Attack-Me-First` & `Skepticism Disclaimer`)
- **Mức độ tự tin hiện tại:** Thấp (`45%`) đối với tệp [`course_24_lessons_spec.py`](file:///c:/commandcenter/SPRINTS/SP_261104_01_Antigravity_Basic_06_Transcription_And_Curriculum/scripts/course_24_lessons_spec.py) vừa khởi tạo do vừa bị ngắt luồng ở dòng 2.687 (mới viết tới Bài 16/24, gây lỗi `SyntaxError` chưa đóng ngoặc vuông `[` ở dòng 267) và mắc lỗi "đúc khuôn máy móc" khi cố ép cả 24 bài vào một hàm tạo slide duy nhất.
- **Phân loại 3 giỏ kiểm chứng:**
  1. *Đã chạy test tự động:* Đã chạy `run_audit.py pdca` (đạt `90.0/100` cho tài liệu DAG) và `run_audit.py parity` (phát hiện ngay lỗi `P0_PYTHON_SYNTAX_ERROR` tại `course_24_lessons_spec.py` dòng 267).
  2. *Mới kiểm tra bằng mắt:* Nội dung kịch bản Bài 1 $\to$ Bài 16 trong `course_24_lessons_spec.py`.
  3. *Chưa kiểm chứng / Chưa hoàn thành:* Bài 17 $\to$ Bài 24 chưa viết; [`build_modular_course.py`](file:///c:/commandcenter/SPRINTS/SP_261104_01_Antigravity_Basic_06_Transcription_And_Curriculum/scripts/build_modular_course.py) chưa nối với `course_24_lessons_spec.py`; ngoài giao diện `html_video_demos/index.html` vẫn đang chạy bản cũ (6 bài Chương 1).

---

## 2. Chi Tiết 4 Lỗi Cấp P0 (Blocker) & 3 Lỗi Cấp P1 Vi Phạm 5 Nguyên Tắc Của CEO

### ❌ P0-1 (Vi phạm Nguyên tắc 1 & Nguyên tắc "Đơn giản, không rối mắt"): Bẫy "Nồi lẩu thập cẩm" trên Slide Lý thuyết Kiểu 1 & Bịa đặt số liệu phần trăm (`AI Slop`)
- **Bản chất lỗi:** Trong [`course_24_lessons_spec.py`](file:///c:/commandcenter/SPRINTS/SP_261104_01_Antigravity_Basic_06_Transcription_And_Curriculum/scripts/course_24_lessons_spec.py#L26-L150), hàm `make_type1_slide_html()` hiểu sai ý của CEO. Khi CEO yêu cầu *"Kiểu 1: nguyên tắc/khái niệm/lợi ích v.v thì nên dùng ảnh minh họa, diagram, sơ đồ, chart v.v, quote, highlight, timeline, grid card, illustrator image đi kèm với text box"*, ý đúng là **tùy nội dung từng bài mà chọn công cụ thị giác đắt giá nhất** (bài về quy trình dùng Timeline/Flowchart, bài so sánh dùng Bảng/Chart, bài khái niệm dùng Minh họa + Quote + Card). Thế nhưng code lại **nhồi tất cả 6 thành phần** (Header + Sơ đồ SVG 3 nút + Biểu đồ cột `%` + Quote + 3 Grid Cards + Callout) vào **cùng 1 trang slide cho cả 24 bài**!
- **Hậu quả 1 (Rối và chữ nhỏ):** Mỗi slide bị nhồi 11–13 hộp thông tin, chữ trong sơ đồ SVG phải thu nhỏ xuống `10.5px` ([dòng 66–76](file:///c:/commandcenter/SPRINTS/SP_261104_01_Antigravity_Basic_06_Transcription_And_Curriculum/scripts/course_24_lessons_spec.py#L66-L76)), tái phạm đúng lỗi "quá rối, chữ quá nhỏ" mà CEO đã nhắc ở các phiên trước.
- **Hậu quả 2 (Bịa số liệu `%` — AI Slop):** Vì bài nào cũng bắt phải vẽ `chart_bars` có số `%`, kịch bản đã tự chế ra hàng loạt số liệu thống kê giả tạo không hề có trong bài giảng gốc của CEO:
  - Bài 3 ([dòng 602](file:///c:/commandcenter/SPRINTS/SP_261104_01_Antigravity_Basic_06_Transcription_And_Curriculum/scripts/course_24_lessons_spec.py#L602)): *"Nhớ phím Ctrl+B & hỏi trực tiếp AI (96%) vs Tự mò mẫm (22%)"*.
  - Bài 7 ([dòng 1207](file:///c:/commandcenter/SPRINTS/SP_261104_01_Antigravity_Basic_06_Transcription_And_Curriculum/scripts/course_24_lessons_spec.py#L1207)): *"Có đính kèm hồ sơ @troly.md (94% đạt ngay) vs Giao việc trống (35% đạt)"*.
  - Bài 8 ([dòng 1357](file:///c:/commandcenter/SPRINTS/SP_261104_01_Antigravity_Basic_06_Transcription_And_Curriculum/scripts/course_24_lessons_spec.py#L1357)): *"Phiên mới + @ban_giao_cong_viec.md (98% chuẩn) vs Kéo dài >50 lượt (54% dễ quên)"*.
  - Bài 12 ([dòng 1962](file:///c:/commandcenter/SPRINTS/SP_261104_01_Antigravity_Basic_06_Transcription_And_Curriculum/scripts/course_24_lessons_spec.py#L1962)): *"Dùng /grill-me + /plan (Chỉ 4% làm lại) vs Giao 1 câu ngắn (78% sửa lại)"*.

### ❌ P0-2 (Vi phạm Nguyên tắc 2): Thực hành Step-by-Step "Giả cầy" từ Bài 7 đến Bài 16 (Nhảy cóc kết quả & Trỏ chuột đứng im)
- **Bản chất lỗi:** CEO yêu cầu *"Thực hành thì hướng dẫn step by step, có bối cảnh, có giải thích rõ rồi mới đi vào hướng dẫn từng bước"*. Ở Bài 1–4, các bước thực hành có bấm menu, mở hộp thoại, chọn mục thật. Nhưng từ **Bài 7 đến Bài 16**, các nhịp `b4, b5, b6` lại làm tắt bằng cách gọi `kudoSimScene({...})` đổ thẳng kết quả cuối cùng vào màn hình rồi đặt con trỏ chuột đứng im ở `#editor-canvas` hoặc `#ide-chat-messages`!
- **Bằng chứng rõ nhất:**
  - Tại **Bài 12 ([dòng 2011, 2043, 2059](file:///c:/commandcenter/SPRINTS/SP_261104_01_Antigravity_Basic_06_Transcription_And_Curriculum/scripts/course_24_lessons_spec.py#L2011-L2065))**: Cả 3 nhịp `b2` (Lý thuyết), `b4` (Thực hành Bước 1) và `b5` (Thực hành Bước 2) đều gọi **cùng một hàm y hệt nhau** là `kudoRunGrillAndPlanDemo()`. Người học chuyển từ nhịp 2 sang nhịp 4 sang nhịp 5 mà màn hình không hề thay đổi bước nào!
  - Tại **Bài 11 ([dòng 1894–1928](file:///c:/commandcenter/SPRINTS/SP_261104_01_Antigravity_Basic_06_Transcription_And_Curriculum/scripts/course_24_lessons_spec.py#L1894-L1928))**: Học viên không được thấy thao tác gõ dấu `/` vào ô chat $\to$ hiện bảng gợi ý `/bao-cao-tuan` $\to$ bấm chọn $\to$ nhấn Gửi, mà màn hình nhảy thẳng tới khung chat đã chạy xong kết quả.

### ❌ P0-3 (Vi phạm Nguyên tắc 3 — Dependencies & Thứ tự hợp lý): Mâu thuẫn trạng thái màn hình giữa Bài 1 và Bài 2
- **Bản chất lỗi:** Theo đúng thiết kế Dependencies đã sửa: **Bài 1** chỉ giới thiệu 2 phần mềm và bấm `Open IDE` mở cửa sổ IDE lên, còn sang **Bài 2** học viên mới giải nén tệp `.zip` và bấm `File -> Open Folder` để mở thư mục `antigravity_course_vn` lần đầu tiên.
- **Điểm bất hợp lý trong code:** Tại **Bài 1 - Nhịp `b2` ([dòng 349](file:///c:/commandcenter/SPRINTS/SP_261104_01_Antigravity_Basic_06_Transcription_And_Curriculum/scripts/course_24_lessons_spec.py#L349))** và **Nhịp `b6` ([dòng 413](file:///c:/commandcenter/SPRINTS/SP_261104_01_Antigravity_Basic_06_Transcription_And_Curriculum/scripts/course_24_lessons_spec.py#L413))**, lệnh `onEnter` đã mở sẵn thư mục `antigravity_course_vn` và hiển thị sẵn tệp `0.1_Introduction.md` trên màn hình! Như vậy ở Bài 1 thư mục đã mở sẵn trên máy, rồi sang Bài 2 lại bảo học viên *"Bây giờ chúng ta mới đi giải nén tệp .zip và mở thư mục dự án vào phần mềm"* $\implies$ Vẫn mắc lỗi "cầm đèn chạy trước ô tô" về trạng thái màn hình.

### ❌ P0-4 (Vi phạm Cam kết bảo toàn điểm neo Chương 1): Tự ý cắt gọt Chương 1 từ 47 điểm neo xuống 24 điểm neo
- **Bản chất lỗi:** Ở yêu cầu trước, CEO đã chốt rõ: *"Muốn giữ cả 47 điểm neo thời gian"* của Chương 1 (6 bài đã được thu âm chuẩn 48kHz và tinh chỉnh kỹ từng khung tiêu điểm). Việc ép cứng công thức "mỗi chương 4 bài × 6 nhịp = 24 nhịp" đã làm mất đi **23 điểm neo thời gian** rất chi tiết của Chương 1.

### ⚠️ 3 Lỗi Cấp P1 (Major):
1. **P1-1 (Trùng lặp kịch bản "Dự án Giày Bã Mía" giữa Bài 12 và Bài 21 — Vi phạm Nguyên tắc 4):** Trong bản quy hoạch DAG, Bài 12 (`/grill-me`, `/plan`, `/learn`) được thiết kế dùng bối cảnh của công ty `TaskFlow` để dành dự án **"Giày Bã Mía"** cho **Bài 21 (Chương 6 — Tình huống 1)**. Nhưng trong code Bài 12 ([dòng 2011](file:///c:/commandcenter/SPRINTS/SP_261104_01_Antigravity_Basic_06_Transcription_And_Curriculum/scripts/course_24_lessons_spec.py#L2011)) lại tái sử dụng hàm `kudoRunGrillAndPlanDemo()` của dự án Giày Bã Mía, dẫn đến lặp lại cùng một ví dụ ở cả Chương 3 và Chương 6.
2. **P1-2 (Thiếu code hiển thị Thẻ Lý thuyết Kiểu 2 & Bước Thực hành trong `build_modular_course.py`):** Các trường `pedagogy_badge`, `pedagogy_title`, `pedagogy_note` đã được khai báo trong dữ liệu nhịp học nhưng chưa được thêm vào DOM/CSS/JS của [`build_modular_course.py`](file:///c:/commandcenter/SPRINTS/SP_261104_01_Antigravity_Basic_06_Transcription_And_Curriculum/scripts/build_modular_course.py).
3. **P1-3 (Chưa hoàn thiện Bài 17–24 & Lỗi cú pháp Python):** `course_24_lessons_spec.py` mới dừng ở cuối Bài 16 (Chương 4), thiếu Chương 5 & Chương 6 (Bài 17–24) và chưa đóng ngoặc danh sách `FULL_24_LESSONS_SPECS`.

---

## 3. Ba Phương Án Khắc Phục Đối Trọng (`Options`) Trình CEO Quyết Định

Để đảm bảo khóa học hoàn thiện đạt chuẩn cao nhất mà không làm mất tài sản đã duyệt, `@AuditArbiter` đệ trình 3 phương án:

### Phương án 1 (Khuyên dùng — Chuẩn Sư Phạm, Tự Nhiên & Không Máy Móc):
1. **Về Slide Lý thuyết Kiểu 1:** Bỏ ngay kiểu nhồi 5 khối vào 1 slide và **xóa 100% biểu đồ `%` bịa đặt**. Thay bằng **4 mẫu bố cục Slide Kiểu 1 thoáng mắt (chỉ 1 hình ảnh/sơ đồ chủ đạo + Text box cô đọng dưới 8 dòng)**:
   - *Mẫu A (Flow/Process Diagram):* Sơ đồ luồng SVG lớn + 3 hộp giải thích ngắn (dùng cho bài quy trình).
   - *Mẫu B (Visual Comparison):* Bảng/Thẻ đối sánh Trước vs. Sau + Hộp trích dẫn Quote (dùng cho bài chuyển đổi tư duy).
   - *Mẫu C (Timeline / Step Map):* Trục thời gian ngang + Highlight Box (dùng cho bài lộ trình/chu trình).
   - *Mẫu D (Concept Illustration & Grid):* Hình minh họa SVG trung tâm + 3 thẻ Grid Card (dùng cho bài cấu trúc/khái niệm).
2. **Về Thực hành Step-by-Step & Lý thuyết Kiểu 2:**
   - Thêm hộp nổi gọn gàng **Thẻ Chỉ dẫn Sư phạm (`#kudo-stage-pedagogy-card`)** trên góc màn hình mô phỏng để phân biệt rõ đang ở **📘 Lý thuyết Kiểu 2 (Giải thích kỹ thuật trên màn hình)** hay **🛠️ Thực hành (Bối cảnh $\to$ Bước 1 $\to$ Bước 2 $\to$ Bước 3)**.
   - Mỗi bước thực hành (`Bước 1` $\to$ `Bước 2` $\to$ `Bước 3`) phải làm thay đổi trạng thái UI thực tế (Bước 1: Mở menu/chọn tệp $\to$ Bước 2: Gõ lệnh/bấm nút vào đúng ô $\to$ Bước 3: Tệp kết quả mới xuất hiện ở cây thư mục trái và mở ra ở cột giữa), tuyệt đối không dùng lại 1 cảnh tĩnh cho nhiều bước.
3. **Về Thứ tự & Điểm neo (Dependencies & De-duplication):**
   - Khắc phục ngay lỗi trạng thái màn hình giữa Bài 1 và Bài 2 (Bài 1 khi bấm `Open IDE` chỉ hiện màn hình chào mừng `Welcome Screen` chưa mở thư mục; sang Bài 2 thực hành `Open Folder` xong thì cây thư mục `antigravity_course_vn` mới hiện ra).
   - Tách bạch hoàn toàn ví dụ của Bài 12 (`/grill-me -> /plan -> /learn` dùng bài toán **Kế hoạch Mở rộng Kênh B2B Quý 2 của TaskFlow**) khỏi Bài 21 (dùng bài toán **Nhân bản quy trình 7 bước sang Dự án Giày Bã Mía**).

### Phương án 2 (Giữ nguyên 47 điểm neo gốc của Chương 1 + Mở rộng Chương 2–6):
- Giữ nguyên vẹn 47 điểm neo (và 47 file âm thanh đã thu) của Chương 1 nhưng **đảo lại thứ tự các bài trong Chương 1** cho đúng Dependencies (Bài 1: Tư duy & 2 phần mềm $\to$ Bài 2: Giải nén `.zip` & `Open Folder` $\to$ Bài 3: Giao diện 3 cột & Phím cứu hộ $\to$ Bài 4: Chế độ `Turbo` $\to$ Bài 5: Thực hành `/start-1-1`), còn bài `Rules/Skills/Workflows` cũ của Chương 1 thì chuyển hẳn sang đầu Chương 3.

### Phương án 3 (Làm mẫu chuẩn mực trên Chương 1 & Chương 2 trước để CEO duyệt trực quan):
- Thay vì xuất đồng loạt cả 6 chương khi chưa duyệt giao diện Slide Kiểu 1 mới và Thẻ Thực hành Step-by-Step mới, em hoàn thiện thật sắc nét **Chương 1 + Chương 2** theo đúng Phương án 1/2 lên `index.html` để anh bấm xem trực tiếp bố cục Slide Kiểu 1, Lý thuyết Kiểu 2 và Thực hành từng bước, sau khi anh gật đầu mới chạy tiếp Chương 3–6.
