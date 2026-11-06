# Báo Cáo Kiểm Định Thủ Công 24 Bài Giảng (144 Điểm Neo): Chống Lộ Prompt Nội Bộ, AI Slop & Lỗi Giao Diện

> **Mã Sprint:** `SP_261104_01_Antigravity_Basic_06_Transcription_And_Curriculum`
> **Ngày thực hiện:** 05/11/2026
> **Phương pháp kiểm định:** Duyệt thủ công 100% từng dòng trên toàn bộ 24 bài giảng (`lesson_01.html` .. `lesson_24.html` — 144 điểm neo) đối chiếu với 4 ảnh chụp màn hình thực tế của CEO tại Bài 17 (`media_1793863438307_677d6f02.jpg`, `media_1793863448874_6d930573.jpg`, `media_1793863455820_7257c0d7.jpg`, `media_1793863486093_a998f783.jpg`).

---

## I. CHẨN ĐOÁN GỐC RỄ TỪ 4 ẢNH CHỤP MÀN HÌNH BÀI 17 CỦA CEO

### 1. Lỗi Vỡ Bố Cục & Lộ Nhãn Thiết Kế Nội Bộ Trên Slide Lý Thuyết (Ảnh 4 — `media_1793863486093_a998f783.jpg`)
- **Hiện tượng trên màn hình:**
  1. Dòng băng rôn góc trên bên trái hiện chữ: `CHƯƠNG 5 · BÀI 17 · LÝ THUYẾT KIỂU 1 ( NGUYÊN LÝ & TRỰC QUAN )` và góc phải hiện: `Bố cục ANATOMY · Nhịp 1/6`. Đây là thuật ngữ phân loại trong bản đặc tả thiết kế khóa học (meta-prompt của người làm giáo trình), hoàn toàn xa lạ với học viên.
  2. Khung `🧩 SƠ ĐỒ GIẢI PHẪU CẤU TRÚC` bên dưới bị mất toàn bộ định dạng cột/thẻ: 3 dòng `1. TÍNH CÁCH THƯƠNG HIỆU...`, `2. CHÂN DUNG ĐỘC GIẢ...`, `3. TỪ VỰNG KHUYÊN DÙNG...` bị dính sát nhau như văn bản thô, tiếp theo là một dấu ngoặc kép `“` nằm trơ trọi một mình trên một dòng trắng rồi mới đến câu trích dẫn.
- **Nguyên nhân kỹ thuật gốc rễ:**
  - Hàm `make_type1_slide_html()` trong [`course_24_lessons_spec.py`](file:///c:/commandcenter/SPRINTS/SP_261104_01_Antigravity_Basic_06_Transcription_And_Curriculum/scripts/course_24_lessons_spec.py#L45-L115) sinh ra các class `.k-layout-anatomy`, `.k-anat-left`, `.k-anat-pillars`, `.k-anat-pill`, `.k-layout-comparison`, `.k-cmp-col`, `.k-layout-timeline`, `.k-tl-track`, `.k-tl-step`, `.k-quote-box`, `.k-quote-mark`.
  - Tuy nhiên, bảng CSS trong [`build_modular_course.py`](file:///c:/commandcenter/SPRINTS/SP_261104_01_Antigravity_Basic_06_Transcription_And_Curriculum/scripts/build_modular_course.py#L1404-L1498) lại đặt tên class là `.k-vh-anatomy-grid`, `.k-vh-compare-grid`, `.k-vh-timeline`, `.k-vh-quote`! Sự lệch pha tên class khiến trình duyệt không áp dụng bất kỳ thuộc tính CSS nào cho sơ đồ `anatomy`, `comparison`, `timeline` và `blockquote`.

### 2. Lỗi Hộp Nổi (`#kudo-stage-pedagogy-card`) Đè Lên Giao Diện & Chứa Từ Ngữ Nội Bộ (Ảnh 1, 2, 3)
- **Hiện tượng vị trí (Overlap):**
  - Ở Ảnh 1 (`b3`) và Ảnh 3 (`b5`), hộp nổi đặt ở góc dưới bên trái (`left: 14px; bottom: 12px; width: 350px`) bị tràn qua ranh giới cột cây thư mục (`220px`), đè trực tiếp lên viền cam của khung `#kudo-spotlight` và che lấp thanh trạng thái màu xanh (`>< 0 0 Git`) phía dưới.
  - Ở Ảnh 2 (`b4`), khi spotlight chiếu vào cột trái (`#ide-file-tree`), thuật toán tự đẩy hộp nổi sang góc dưới bên phải (`right: 16px; bottom: 12px`), khiến hộp nổi **đè kín toàn bộ ô nhập lệnh Chat (`#ide-chat-input`)** ở cột phải!
- **Hiện tượng nội dung bên trong hộp nổi & thanh bên trái:**
  - Nhãn trên hộp nổi và danh sách điểm neo bên trái lặp đi lặp lại các tiền tố khuôn mẫu:
    - `[Lý thuyết Kiểu 1]`, `[Lý thuyết Kiểu 2]`, `[Thực hành B1/3]`, `[Thực hành B2/3]`, `[Thực hành B3/3]`
    - `📘 LÝ THUYẾT KIỂU 2 · TRÍCH XUẤT GIỌNG VĂN TỰ ĐỘNG`
    - `🛠️ THỰC HÀNH BƯỚC 1/3 · BỐI CẢNH & CHỌN TÀI LIỆU GỐC` -> `Bối cảnh: ...`
    - `6. [Thực hành B3/3] Nghiệm thu brand_voice.md & Tiếp nối Bài 18` -> `Nghiệm thu: ... Tiếp theo: Bài 18...`
  - Ngoài ra, ở cột bên trái của trình phát (`#kudo-RightSidebar`), hộp `#ksb-dep-box` hiện nguyên văn dòng `Tiên quyết: ... | Mở đường: ...` vốn là ghi chú kiểm tra cấu trúc chương trình dành cho người thiết kế khóa học.

---

## II. KẾT QUẢ RÀ SOÁT THỦ CÔNG TOÀN BỘ 24 BÀI GIẢNG (144 ĐIỂM NEO)

Qua rà soát thủ công từng bài từ Bài 1 đến Bài 24 trong [`course_24_lessons_spec.py`](file:///c:/commandcenter/SPRINTS/SP_261104_01_Antigravity_Basic_06_Transcription_And_Curriculum/scripts/course_24_lessons_spec.py), phát hiện **6 nhóm lỗi nội dung & thuật ngữ** cần làm sạch triệt để:

### Nhóm 1: Lộ nhãn phân loại thiết kế giáo trình trên toàn bộ 24 bài (144 điểm neo)
- **Mức độ:** 24/24 bài (100% bài học).
- **Chi tiết:**
  - Băng rôn Slide 1 của cả 24 bài đều in `LÝ THUYẾT KIỂU 1 ( NGUYÊN LÝ & TRỰC QUAN )` và `Bố cục COMPARISON / FLOWCHART / TIMELINE / ANATOMY · Nhịp 1/6`.
  - Tiêu đề phụ trong khung sơ đồ dùng từ máy móc: `🧩 SƠ ĐỒ GIẢI PHẪU CẤU TRÚC`, `📊 SƠ ĐỒ LUỒNG NGUYÊN LÝ`, `⏱️ LỘ TRÌNH & CHU TRÌNH THỰC THI CHUẨN`, `❌ CÁCH LÀM CŨ · THỦ CÔNG RỜI RẠC` vs `✅ CÁCH LÀM MỚI · TRỢ LÝ AI TRONG THƯ MỤC` (ngay cả khi nội dung bên trong không phải là đối sánh cũ/mới, ví dụ Bài 7 so sánh `@Tên_tệp` và `@Tên_thư_mục`, hoặc Bài 14 nêu bước Làm sạch và bước Khuyến nghị nhưng lại bị gắn nhãn `❌ CÁCH LÀM CŨ`!).
  - Danh sách 6 nhịp ở cột trái (`beat["label"]`) của cả 24 bài đều mang tiền tố `[Lý thuyết Kiểu 1]`, `[Lý thuyết Kiểu 2]`, `[Thực hành B1/3]`, `[Thực hành B2/3]`, `[Thực hành B3/3]`.
  - Hộp nổi (`pedagogy_badge`, `pedagogy_title`, `pedagogy_note`) ở các nhịp `b2..b6` của cả 24 bài đều chứa `📘 Lý thuyết Kiểu 2 · ...`, `Bối cảnh: ...`, `Nghiệm thu: ... Tiếp theo: Bài ...`.

### Nhóm 2: Nhãn `❌ CÁCH LÀM CŨ` / `✅ CÁCH LÀM MỚI` bị gắn sai bản chất ở các bài dùng layout `comparison`
- **Các bài bị ảnh hưởng:**
  - **Bài 7 (`lesson_07.html`):** Nội dung 2 cột là *Cách 1: Gọi đích danh 1 tệp (`@COMPANY.md`)* và *Cách 2: Gọi cả thư mục (`@TaskFlow_Context/`)* — cả hai đều là kỹ thuật đúng, nhưng do hàm `make_type1_slide_html` đóng cứng nhãn `❌ CÁCH LÀM CŨ · THỦ CÔNG RỜI RẠC` cho cột trái nên Cách 1 (`@COMPANY.md`) bị gắn nhãn đỏ `❌ CÁCH LÀM CŨ`!
  - **Bài 14 (`lesson_14.html`):** Cột trái là *1. LÀM SẠCH (CLEANING)*, cột phải là *3. KHUYẾN NGHỊ (INSIGHT)* — bước Làm sạch dữ liệu lại bị gắn nhãn `❌ CÁCH LÀM CŨ`!
  - **Bài 23 (`lesson_23.html`):** Cột trái là *Bản dự thảo đối tác gửi (`hop_dong_dai_ly_du_thao.md`)*, cột phải là *Bảng đề xuất sửa đổi (`bao_cao_ra_soat_hop_dong.md`)* — cần nhãn đúng ngữ cảnh (*📄 ĐẦU VÀO · DỰ THẢO ĐỐI TÁC* vs *🛡️ ĐẦU RA · BÁO CÁO RÀ SOÁT RỦI RO*).
- **Giải pháp:** Cho phép cấu hình nhãn cột trái/phải (`left_badge`, `right_badge`) linh hoạt theo đúng ngữ cảnh từng bài thay vì đóng cứng `❌ CÁCH LÀM CŨ`.

### Nhóm 3: Lỗi cú pháp HTML thô (`<tên_kỹ_năng>`) và LaTeX thô (`$\rightarrow$`) hiển thị lỗi trên trình duyệt
- **Bài 10 (`lesson_10.html` — Thẻ 2 `s1_c2`):**
  - Chuỗi văn bản: `"Đặt tại .agent/skills/<tên_kỹ_năng>/SKILL.md: Chỉ khi bạn yêu cầu viết bài hoặc phân tích tài chính thì AI mới mở cẩm nang đó ra đọc."`
  - Do `<tên_kỹ_năng>` không được mã hóa `&lt;tên_kỹ_năng&gt;`, trình duyệt hiểu nhầm là một thẻ HTML lạ và **ẩn mất chữ `<tên_kỹ_năng>`**, khiến đường dẫn hiện trên màn hình bị cụt thành `.agent/skills//SKILL.md`!
- **Bài 12 (`lesson_12.html` — Callout `s1_call`) & Bài 13 (`lesson_13.html` — Callout `s1_call`):**
  - Chứa ký hiệu LaTeX thô `$\rightarrow$` (`<code>/grill-me</code> $\rightarrow$ <code>/plan</code> $\rightarrow$ <code>/learn</code>` và `<em>Quét mục lục tổng thể</em> $\rightarrow$ <em>Bóc tách từng cụm</em> $\rightarrow$ <em>Hợp nhất có dẫn nguồn</em>`). Trên trình duyệt không chạy bộ dịch toán học cho slide, nó hiện nguyên chữ `$\rightarrow$` rất xấu. Phải đổi toàn bộ sang mũi tên chuẩn `→` (`&rarr;`).

### Nhóm 4: Lộ lệnh nội bộ của Command Center (`/audit`, `Sub-Agents`) không có sẵn cho học viên cơ bản
- **Bài 15 (`lesson_15.html`):**
  - Dùng dày đặc thuật ngữ kỹ thuật nội bộ `Sub-Agents`, `Parallel Sub-Agents`, `Sub-Agent #1`, `Sub-Agent #2`, `Sub-Agent #3`. Học viên văn phòng dùng Antigravity 2.0 chỉ mở **nhiều luồng hội thoại song song (Multi-Threads)** hoặc dùng tính năng phối hợp nhóm. Cần đổi toàn bộ `Sub-Agents` sang ngôn ngữ đời thường chuẩn giao diện Antigravity: **Phối hợp nhiều luồng công việc song song (Multi-Threads)**.
- **Bài 24 (`lesson_24.html`):**
  - Đang dạy học viên gõ lệnh `/audit` (*"Nguyên tắc Không vừa đá bóng vừa thổi còi với lệnh Kiểm toán /audit"*). Thực tế `/audit` là skill nội bộ của hệ thống Command Center (`@AuditArbiter`), **không phải** lệnh mặc định có sẵn khi học viên tải Antigravity IDE về máy!
  - Việc dạy học viên gõ `/audit` sẽ khiến học viên gõ thử trên máy mình mà không thấy chạy, đồng thời làm lộ quy tắc vận hành nội bộ của Agent.
  - **Giải pháp cho Bài 24:** Chuyển thành bài **"Kiểm định Chéo Chất lượng Dự án, Bảo mật Tài liệu (`.gitignore`) & Lộ trình 30 Ngày Ứng dụng"** — hướng dẫn học viên dùng câu lệnh kiểm tra chéo số liệu thực tế giữa các tệp (`@sales_data.csv` đối chiếu với `@slide_trinh_hdqt_q2.html`), cách dùng tệp `.gitignore` để giữ riêng các tệp nhạy cảm trên máy khi đồng bộ GitHub, và lập lộ trình 30 ngày áp dụng.

### Nhóm 5: Thuật ngữ tiếng Anh chuyên môn / AI Slop trong thẻ bài và hộp nổi
- **Bài 5 (`lesson_05.html`):** `Rich Visual Extensions` $\to$ đổi thành `Tiện ích xem tài liệu trực quan`.
- **Bài 6 (`lesson_06.html`):** `Zero-Hallucination Rule` $\to$ đổi thành `Nguyên tắc đối chiếu chính xác 100%`.
- **Bài 9 (`lesson_09.html`):** `Project Memory`, `Single Source of Truth` $\to$ đổi thành `Hồ sơ gốc của dự án (@COMPANY.md)`.
- **Bài 10 (`lesson_10.html`):** `Always-On Rule`, `On-Demand Skill` $\to$ đổi thành `Quy tắc luôn bật (Rules)` và `Kỹ năng chuyên môn (Skills)`.
- **Bài 11 (`lesson_11.html`):** `1-Click Automation` $\to$ đổi thành `Tự động hóa bằng 1 lệnh gạch chéo (/)`.
- **Bài 13 (`lesson_13.html`):** `Progressive Summarization`, `Index-First`, `Executive Summary` $\to$ đổi thành `Tóm tắt đa tầng`, `Lập mục lục trước`, `Bản tóm tắt điều hành 1 trang`.
- **Bài 17 (`lesson_17.html`):** `Tòa soạn AI` $\to$ đổi thành `Bộ phận nội dung của bạn`.
- **Bài 18 (`lesson_18.html`):** `Self-Audit`, `Repurposing`, `Drip` $\to$ đổi thành `Tự rà soát chất lượng`, `Chuyển hóa đa kênh`, `Chuỗi email chăm sóc`.
- **Bài 19 (`lesson_19.html`):** `4-Layer Visual Prompt`, `Style Lock`, `Editorial Flat Illustration` $\to$ đổi thành `Công thức 4 thành phần mô tả ảnh`, `Khóa cố định phong cách & màu sắc`, `Phong cách minh họa phẳng hiện đại`.
- **Bài 20 (`lesson_20.html`):** `Action Title`, `Self-contained` $\to$ giải thích tự nhiên bằng tiếng Việt: `Tiêu đề mang tính kết luận`, `Tệp trình chiếu độc lập mở được trên mọi máy`.
- **Bài 22 (`lesson_22.html`):** `Rubric` $\to$ đổi thành `Thang điểm tiêu chí tuyển dụng`.

### Nhóm 6: Lệch tiêu đề giữa Trang chủ (`CHAPTERS_24_MANIFEST`) và Nội dung bài học (`FULL_24_LESSONS_SPECS`) từ Bài 7 đến Bài 24
- Trong [`course_24_lessons_spec.py`](file:///c:/commandcenter/SPRINTS/SP_261104_01_Antigravity_Basic_06_Transcription_And_Curriculum/scripts/course_24_lessons_spec.py), danh sách `CHAPTERS_24_MANIFEST` (dùng để hiển thị thẻ bài học trên `index.html`) đang giữ bộ tiêu đề cũ từ Bài 7 đến Bài 24, không khớp với tiêu đề thật trong `FULL_24_LESSONS_SPECS` khi học viên bấm vào học!
- **Giải pháp:** Đồng bộ hóa 100% `CHAPTERS_24_MANIFEST` tự động lấy đúng `title`, `short_title` và `description` từ `FULL_24_LESSONS_SPECS` để Trang chủ (`index.html`), Menu chọn bài và Nội dung trong từng bài (`lesson_01.html`..`lesson_24.html`) khớp nhau tuyệt đối từng chữ.

---

## III. KẾ HOẠCH XỬ LÝ TRIỆT ĐỂ & TIÊU CHUẨN NGHIỆM THU

1. **Làm sạch 100% văn bản trong [`course_24_lessons_spec.py`](file:///c:/commandcenter/SPRINTS/SP_261104_01_Antigravity_Basic_06_Transcription_And_Curriculum/scripts/course_24_lessons_spec.py):**
   - Sửa hàm `make_type1_slide_html()` để dùng nhãn học viên thân thiện (`CHƯƠNG X · BÀI Y` | `Phần 1/6 · Tổng quan & Nguyên lý`), cho phép truyền nhãn cột so sánh đúng ngữ cảnh.
   - Viết lại toàn bộ 144 `label`, `pedagogy_badge`, `pedagogy_title`, `pedagogy_note`, `cursor_label` và nội dung Slide 1 của 24 bài: Xóa sạch 100% các cụm `Lý thuyết Kiểu 1`, `Lý thuyết Kiểu 2`, `Thực hành B1/3`, `Bối cảnh:`, `Nghiệm thu:`, `Tiếp nối Bài`, `Sub-Agents`, `/audit`, `$\rightarrow$`, `<tên_kỹ_năng>`.
   - Viết lại Bài 24 thành bài thực hành **Đối chiếu Chéo Số liệu Dự án, Bảo mật Tệp nhạy cảm (`.gitignore`) & Lập Lộ trình 30 Ngày Ứng dụng** (và thu âm lại 6 file MP3 của Bài 24 bằng giọng chuẩn).
2. **Sửa triệt để CSS Slide 1 và Thuật toán Đặt Hộp Nổi trong [`build_modular_course.py`](file:///c:/commandcenter/SPRINTS/SP_261104_01_Antigravity_Basic_06_Transcription_And_Curriculum/scripts/build_modular_course.py):**
   - Bổ sung đầy đủ CSS chuẩn đẹp cho `.k-layout-anatomy`, `.k-anat-left`, `.k-anat-title`, `.k-anat-pillars`, `.k-anat-pill`, `.k-layout-comparison`, `.k-cmp-col`, `.k-cmp-arrow`, `.k-layout-timeline`, `.k-tl-track`, `.k-tl-step`, `.k-tl-conn`, `.k-quote-box`, `.k-quote-mark`.
   - Ẩn hộp `#ksb-dep-box` (`Tiên quyết / Mở đường`) khỏi thanh sidebar của học viên.
   - Thiết kế lại thuật toán định vị `#kudo-stage-pedagogy-card` trong `JS_SPOTLIGHT_CURSOR`:
     - Kích thước gọn gàng (`max-width: 300px`, padding thoáng, chữ sắc nét).
     - Tự động kiểm tra va chạm hình học (Bounding-Box Collision Detection) với 4 vùng cấm: (1) Khung `#kudo-spotlight`, (2) Ô nhập lệnh `#ide-chat-input`, (3) Nhãn con trỏ `#kudo-cursor-label`, và (4) Thanh trạng thái đáy (`bottom >= 36px` tính từ đáy stage). Luôn chọn vị trí trống hoàn toàn (ưu tiên góc trên/dưới vùng trung tâm hoặc vùng trống không chồng lấn).
3. **Kiểm chứng tự động & Chụp ảnh nghiệm thu bằng Playwright:**
   - Quét Regex toàn bộ 24 file HTML đảm bảo **0 kết quả** cho mọi từ khóa nội bộ (`Lý thuyết Kiểu`, `Thực hành B`, `Bố cục ANATOMY`, `Bố cục FLOWCHART`, `Bố cục COMPARISON`, `Bố cục TIMELINE`, `Bối cảnh:`, `Nghiệm thu:`, `Tiên quyết:`, `/audit`, `Sub-Agent`, `\rightarrow`, `<tên_kỹ_năng>`).
   - Chụp lại đúng 4 góc màn hình Bài 17 (`b1`, `b3`, `b4`, `b5`) và Bài 10, 12, 15, 24 bằng Playwright để đối chứng trực quan.
