# Bài Học Kinh Nghiệm: Quy Chuẩn Đặt Tên Bài Giảng & Thiết Kế Mục Lục Khóa Học Tương Tác

> **Mã tham chiếu:** `PROP-261105-03`  
> **Ngày đúc kết:** 05/11/2026  
> **Người chỉ đạo & Phản biện:** CEO Hoàng Đức Minh  
> **Phạm vi áp dụng:** Toàn bộ các khóa học tương tác HTML, Video mô phỏng (`/fac-video`, `/kudo`, `/fac-courseware`) và Cổng học liệu Học viện.

---

## 1. Bối Cảnh & Hai Lỗi Cốt Lõi Khi Thiết Kế Mục Lục Khóa Học

Khi xây dựng trình phát khóa học tương tác `Antigravity Basic` (gồm 6 bài học lớn và 47 điểm neo thời gian), phiên bản trước đã mắc **2 lỗi điển hình của kỹ thuật viên làm sản phẩm giáo dục**:

### Lỗi 1: Bố cục Mục lục Rối mắt, Chồng chéo & Chữ quá nhỏ (`UI Clutter & Micro-Typography`)
1. **Hai cột mục lục và hai thanh cuộn đứng sát cạnh nhau:** Trang ngoài (`index.html`) mở một cột danh sách 6 bài giảng, trong khi khung bài học bên trong (`iframe`) lại mở thêm một cột Sidebar thứ hai. Hai cột tối màu kèm hai thanh cuộn đặt sát nhau làm người xem bị ngợp và mất diện tích màn hình.
2. **Nhồi nhét thông tin vụn vặt trên mỗi thẻ bài học:** Mỗi thẻ bài học gánh tới 4 tầng chữ: Mã kỹ thuật thừa (`BÀI 1.1 · M01`), tiêu đề dài 3 dòng, đoạn mô tả chữ xám li ti 3–4 dòng (`11px–11.5px`) và nút phụ lặp lại.
3. **Lặp lại tiêu đề bài học nhiều lần trong cùng một cột:** Ngay dưới hộp chọn bài học (`<select>`), tên bài học lại được in lặp lại thêm một lần nữa, cộng với 3 hàng nút điều khiển chiếm gần nửa chiều cao cột trái trước khi học viên nhìn thấy danh sách các phần trong bài.

### Lỗi 2: Đặt tên Tiêu đề theo kiểu "Câu văn tóm tắt" & "Ghi chú Kịch bản Quay phim" (`Non-Pedagogical Naming`)
1. **Tiêu đề Bài lớn dài như một câu văn tóm tắt (15–20 chữ):**
   - *Ví dụ lỗi:* `BÀI 1.1 · M01: Từ hỏi đáp trên trình duyệt đến trợ lý AI làm việc trực tiếp trong thư mục máy tính` (18 chữ) hoặc `BÀI 1.2 · M02: Mở thư mục dự án, định dạng Markdown/CSV và bật chế độ tự chủ Turbo` (15 chữ).
   - *Hệ quả:* Tiêu đề bị rớt xuống 3 dòng chật chội, người học không nắm được trọng tâm bài học trong 1 giây đầu tiên.
2. **Tiêu đề Điểm neo thời gian (Phần nhỏ) đặt theo thao tác bấm nút cơ học:**
   - *Ví dụ lỗi:* `7. Bảng chọn 5 mô hình`, `8. Bấm nút Open IDE`, `8. Mở nút Settings ở góc trái`.
   - *Hệ quả:* Nghe như ghi chú hậu trường cho người dựng video, không mang lại giá trị sư phạm hay gợi mở kiến thức cho học viên.

---

## 2. Quy Chuẩn Bắt Buộc Khi Thiết Kế Mục Lục & Đặt Tên Bài Giảng

### Quy tắc 1: Một Cột Mục Lục Duy Nhất & Cỡ Chữ Lớn Dễ Đọc (`Single Sidebar & Readable Typography`)
- **Tuyệt đối chỉ dùng 1 cột Sidebar duy nhất (`315px`):** Không bao giờ đặt 2 cột danh sách hoặc 2 thanh cuộn song song. Khi bài giảng được nhúng trong trang cổng (`index.html`), tự động ẩn thanh tiêu đề lặp bên trong bài giảng (`body.in-iframe .ksb-brand-bar { display: none; }`).
- **Xóa bỏ 100% mô tả phụ râu ria trong danh sách điều hướng:** Không nhồi đoạn văn mô tả 3–4 dòng, không hiển thị mã kỹ thuật nội bộ (`M01..M06`, `Architecture v3`), không in lặp lại tên bài học ngay dưới hộp chọn bài.
- **Chuẩn cỡ chữ dễ đọc ngay trong một ánh nhìn:**
  - Hộp chọn Bài giảng lớn: **`13.5px–14px`**, chữ đậm (`font-weight: 700`).
  - Danh sách các điểm neo thời gian (phần nhỏ): **`13.5px–14px`** (`font-weight: 600`, `line-height: 1.4`, vùng đệm `10px 12px`), nổi bật rõ phần đang phát.
- **Gom gọn nút điều khiển tối đa 2 hàng:** Hàng 1 (`⏸ Tạm dừng`, `⏮ Trước`, `⏭ Tiếp`), Hàng 2 (`🔇 Tắt tiếng`, `1.0x`, `🖱️ Ẩn chuột [C]`).

### Quy tắc 2: Công Thức Đặt Tên Chuẩn Sư Phạm (`4–7 Chữ, Lấy Người Học Làm Trung Tâm`)
- **Đánh số trực diện, liền mạch:** Đánh số **`BÀI 1`, `BÀI 2`, ..., `BÀI 6`** (không dùng kiểu đánh số lửng lơ `Bài 1.1 · M01` khi không có cấp Chương bao ngoài).
- **Tiêu đề Bài giảng lớn (4–8 chữ, gói gọn trên 1 dòng):** Trả lời câu hỏi *"Học viên làm chủ năng lực gì sau bài này?"* thay vì liệt kê các bước thao tác.
- **Tiêu đề Điểm neo thời gian (4–8 chữ, ngôn ngữ bài học):** Bảo toàn đầy đủ 100% các điểm neo thời gian (47 phần) để học viên bấm tua chính xác tới từng ý, nhưng đặt tên theo **khái niệm/kỹ năng thực hành** thay vì tên nút bấm.

---

## 3. Bảng Đối Chiếu Toàn Bộ 6 Bài Giảng & 47 Điểm Neo Thời Gian (Trước & Sau Chuẩn Hóa)

### Bảng 3.1: 6 Bài Giảng Lớn
| Mã Cũ | Tên Cũ (Lỗi câu văn dài 15–20 chữ) | Mã Mới | Tên Mới Chuẩn Khóa Học (Cô đọng 1 dòng) |
| :--- | :--- | :--- | :--- |
| `BÀI 1.1 · M01` | Từ hỏi đáp trên trình duyệt đến trợ lý AI làm việc trực tiếp trong thư mục máy tính | **`BÀI 1`** | **Tư duy & Giao diện Trợ lý AI** |
| `BÀI 1.2 · M02` | Mở thư mục dự án, định dạng Markdown/CSV và bật chế độ tự chủ Turbo | **`BÀI 2`** | **Thiết lập Dự án & Chế độ Turbo** |
| `BÀI 1.3 · M03` | Đánh giá qua tệp đầu ra trên ổ cứng và cách tổ chức thư mục .agent (Rules, Skills, Workflows) | **`BÀI 3`** | **Bộ não AI: Rules, Skills, Workflows** |
| `BÀI 2.1 · M04` | Cách vượt qua cảm giác bỡ ngỡ ban đầu và thói quen hỏi trực tiếp trợ lý AI | **`BÀI 4`** | **Làm chủ Giao diện & Hỏi Trợ lý AI** |
| `BÀI 2.2 · M05` | Thực hành dự án mẫu TaskFlow với lệnh /start-1-1 và lưu ý khi chọn lệnh gạch chéo | **`BÀI 5`** | **Thực hành Dự án với Lệnh Gạch chéo** |
| `BÀI 2.3 · M06` | Giải nén tệp .zip trước khi mở thư mục và đối chiếu tệp thật bằng Reveal in File Explorer | **`BÀI 6`** | **Quản lý Học liệu & Đồng bộ Tệp tin** |

### Bảng 3.2: 47 Điểm Neo Thời Gian Đã Chuẩn Hóa Sư Phạm (Gói Gọn Trên 1 Dòng)
- **BÀI 1 — Tư duy & Giao diện Trợ lý AI (10 điểm neo):**
  1. `1. Chat Web khác gì Trợ lý AI?`
  2. `2. AI làm việc trong thư mục`
  3. `3. Lưu quy trình ngay trên máy`
  4. `4. Giao diện Antigravity 2.0`
  5. `5. Vai trò của Antigravity IDE`
  6. `6. Cách chọn mô hình theo việc`
  7. `7. Thực hành chọn 5 mô hình` *(thay cho: "Bảng chọn 5 mô hình")*
  8. `8. Mở không gian Antigravity IDE` *(thay cho: "Bấm nút Open IDE")*
  9. `9. Cây thư mục và vùng soạn thảo` *(thay cho: "Cột trái và cột giữa IDE")*
  10. `10. Khung chat và đính kèm @` *(thay cho: "Cột phải và đính kèm @")*

- **BÀI 2 — Thiết lập Dự án & Chế độ Turbo (11 điểm neo):**
  1. `1. Nguyên tắc mở thư mục dự án`
  2. `2. Ưu tiên định dạng .md và .csv`
  3. `3. Xem bảng bằng Office Viewer`
  4. `4. Cơ chế quyền tự chủ Turbo`
  5. `5. Giọng nói và trích dẫn nhanh`
  6. `6. Thực hành mở thư mục dự án`
  7. `7. Thực hành đọc bảng .csv`
  8. `8. Mở bảng cài đặt quyền AI` *(thay cho: "Mở nút Settings ở góc trái")*
  9. `9. Bật chế độ tự chủ Turbo` *(thay cho: "Chuyển This Computer sang Turbo")*
  10. `10. Giao việc giọng nói (Ctrl+M)`
  11. `11. Bôi đen trích dẫn (Ctrl+L)`

- **BÀI 3 — Bộ não AI: Rules, Skills, Workflows (8 điểm neo):**
  1. `1. Rules — Quy tắc chung dự án`
  2. `2. Skills — Kỹ năng đóng gói sẵn`
  3. `3. Workflows & Nghiệm thu tệp`
  4. `4. Dùng /grill-me để AI hỏi ngược`
  5. `5. Lệnh /plan và đúc kết /learn`
  6. `6. Cấu trúc thư mục .agent`
  7. `7. Thực hành /grill-me và /plan`
  8. `8. Tự động lưu bài học (/learn)`

- **BÀI 4 — Làm chủ Giao diện & Hỏi Trợ lý AI (6 điểm neo):**
  1. `1. Ba cách xử lý khi AI chờ lệnh`
  2. `2. Phím tắt khôi phục giao diện`
  3. `3. Nút Dừng, Tiếp tục, Chấp nhận`
  4. `4. Ẩn/hiện cây thư mục (Ctrl+B)`
  5. `5. Chế độ đọc tài liệu trực quan`
  6. `6. Hỏi trực tiếp AI khi quên lệnh`

- **BÀI 5 — Thực hành Dự án với Lệnh Gạch chéo (6 điểm neo):**
  1. `1. Bối cảnh dự án mẫu TaskFlow`
  2. `2. Tránh lỗi lặp khi chọn lệnh /`
  3. `3. Mở tài liệu 1.1_Welcome.md`
  4. `4. Gọi quy trình bằng dấu /`
  5. `5. Chọn lệnh /start-1-1 chuẩn`
  6. `6. AI dẫn dắt thực hành từng bước`

- **BÀI 6 — Quản lý Học liệu & Đồng bộ Tệp tin (6 điểm neo):**
  1. `1. Giải nén .zip trước khi học`
  2. `2. Đồng bộ 1-1 với ổ cứng máy`
  3. `3. Mở thư mục đã giải nén`
  4. `4. Tránh kéo thả nhầm thư mục`
  5. `5. Mở vị trí tệp thật trên máy`
  6. `6. Lộ trình học trong INDEX.md`
