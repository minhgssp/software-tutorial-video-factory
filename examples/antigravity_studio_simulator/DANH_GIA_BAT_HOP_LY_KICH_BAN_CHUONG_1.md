# Đánh Giá Các Điểm Bất Hợp Lý Trong Kịch Bản Chương 1 Hiện Tại (Bài 1 – Bài 6 · 47 Điểm Neo)

> **Mã tài liệu:** `SPEC-261105-CH1-SCRIPT-AUDIT`
> **Phạm vi rà soát:** Toàn bộ 6 bài giảng (`Bài 1` $\to$ `Bài 6`) và 47 điểm neo thời gian (`b1`..`b47`) của **Chương 1 — Tư duy Nền tảng & Làm quen Giao diện** trong khóa học **Antigravity Basic**.
> **Mục tiêu:** Tự soi chiếu khách quan dưới góc nhìn của một học viên văn phòng (Non-IT) lần đầu mở máy học, chỉ rõ các lỗ hổng về **trình tự thời gian**, **độ dốc nhận thức**, **sự đứt gãy giữa lý thuyết và thực hành**, và đề xuất khung sắp xếp lại để thảo luận cùng CEO Hoàng Đức Minh.

---

## 1. Tóm Tắt Bản Chất: Kịch Bản Chương 1 Đang Vướng Ở Đâu?

Nếu ví Chương 1 như **buổi học lái xe đầu tiên** dành cho người chưa từng ngồi vào ghế lái:
- **Điểm làm tốt:** Kịch bản đã có hình ảnh ẩn dụ đời thường rất dễ hiểu (so sánh hỏi trên web như *"gọi điện cho tư vấn viên ở xa"*, so sánh `Rules / Skills / Workflows` như *"nội quy / sổ công thức / dây chuyền trong căn bếp"*), câu thoại gọn và khớp với thao tác mô phỏng trên màn hình.
- **Điểm bất hợp lý lớn nhất:** Thứ tự các bài và các bước đang bị **"đảo ngược thời gian" (dạy chạy xe và độ động cơ trước rồi cuối buổi mới dạy mở cửa xe)** và **"tách rời lời giảng với tay làm" (đọc một lèo 5–6 trang lý thuyết chay rồi mới mở phần mềm)**.

Dưới đây là **6 điểm bất hợp lý cụ thể** khi rà soát từng nhịp trong 47 điểm neo thời gian hiện tại:

---

## 2. Sáu Điểm Bất Hợp Lý Cụ Thể Trong Kịch Bản Chương 1 Hiện Tại

### Điểm bất hợp lý 1: Đảo ngược trình tự thời gian — Bài 6 ("Giải nén tệp `.zip` & Mở thư mục") lại nằm ở cuối chương!
- **Hiện trạng:**
  - Ngay từ **Bài 1 (Phần 8–10)** và **Bài 2 (Phần 6–7)**, học viên đã mở sẵn thư mục `antigravity_course_vn` trên máy, bấm vào `sales_data.csv`, xem `.agent/`, và đến **Bài 5** đã chạy cả bài thực hành `/start-1-1` (`1.1_Welcome.md`).
  - Thế nhưng mãi đến **Bài 6 (bài cuối cùng của Chương 1)**, kịch bản mới quay lại dặn học viên: *"Khi tải bộ học liệu `.zip` về máy tính, anh chị bắt buộc phải giải nén ra thư mục thường trước khi bấm Open Folder, tuyệt đối không mở trực tiếp trong tệp nén"* và mới giới thiệu tệp bản đồ `INDEX.md`!
- **Tại sao bất hợp lý?**
  - Với người mới, thao tác **Tải học liệu `.zip` $\to$ Giải nén `Extract All` $\to$ Mở `Open Folder` $\to$ Đọc `INDEX.md`** là **Bước Số 0 (Khởi động)** trước khi có thể làm bất kỳ bài nào khác. Đặt ở Bài 6 chẳng khác nào học viên đã nấu xong bữa cơm ở Bài 1–5 rồi đến Bài 6 mới được hướng dẫn cách đi chợ và mở khóa cửa bếp.

---

### Điểm bất hợp lý 2: Đưa kiến thức Nâng cao (`.agent`: `Rules`, `Skills`, `Workflows` và `/grill-me`, `/plan`, `/learn`) lên quá sớm ở Bài 3 trước khi dạy thao tác sống còn ở Bài 4 & Bài 5
- **Hiện trạng:**
  - Ở **Bài 3**, học viên mới chỉ vừa làm quen màn hình đã bị đưa ngay vào cấu trúc hệ thống `.agent/` (`rules`, `skills`, `workflows`), hồ sơ `@troly.md`, và chuỗi 3 lệnh nâng cao `/grill-me` $\to$ `/plan` $\to$ `/learn` (vốn là kiến thức cốt lõi của **Chương 3: Thiết lập Bộ não `.agent/`**).
  - Trong khi đó, những kỹ năng "sống còn" dành cho người mới khi mở phần mềm lần đầu — như **cách bấm nút `Stop / Tiếp tục / Accept` khi AI dừng chờ**, **cách bấm `Ctrl + B` khi lỡ tay làm mất cột cây thư mục**, **cách bật `Preview` cho dễ đọc**, và **bài thực hành nhập môn đầu tiên `/start-1-1`** — lại bị đẩy lùi xuống **Bài 4** và **Bài 5**!
- **Tại sao bất hợp lý?**
  - Học viên chưa từng gõ một lệnh `/` cơ bản nào (như `/start-1-1` ở Bài 5) và chưa biết cách xử lý khi giao diện bị rối (Bài 4), nhưng ở Bài 3 đã phải học chuỗi phối hợp 3 lệnh `/grill-me` $\to$ `/plan` $\to$ `/learn`. Độ dốc nhận thức bị dựng đứng ở Bài 3 rồi lại tụt xuống cơ bản ở Bài 4 và Bài 5.

---

### Điểm bất hợp lý 3: "Cầm đèn chạy trước ô tô" — Dùng các tệp và khái niệm chưa từng giải thích (`@troly.md`, `TaskFlow`) ngay trong câu lệnh đầu tiên của Bài 1 & Bài 2
- **Hiện trạng:**
  - Tại **Bài 1 — Phần 10 (`b10`)** và **Bài 2 — Phần 10 (`b10`)**, câu lệnh mẫu đầu tiên trên khung chat bắt học viên gõ:
    > *"Đọc `@sales_data.csv` và `@troly.md` rồi lập báo cáo doanh thu Quý 1..."*
  - Tuy nhiên, tại thời điểm Bài 1 và Bài 2, học viên **chưa hề được giới thiệu `@troly.md` là tệp gì** (đến Bài 3 mới nhắc thoáng qua, và sang Chương 2 mới học cách tạo `@troly.md`).
  - Tương tự, các tệp của công ty giả lập **`TaskFlow Inc.`** xuất hiện trên cây thư mục từ Bài 1–4, nhưng mãi đến **Bài 5 — Phần 1 (`b1`)** giảng viên mới giới thiệu: *"Trong khóa học này, anh chị sẽ đóng vai Giám đốc Vận hành của công ty giả lập TaskFlow..."*.
- **Tại sao bất hợp lý?**
  - Học viên nhìn thấy `@troly.md` ở Bài 1 sẽ hoang mang tự hỏi: *"Tệp `@troly.md` này ở đâu ra? Máy mình có sẵn không hay phải tự tạo?"*. Nguyên tắc sư phạm chuẩn là: **Khái niệm/tệp nào chưa giải thích thì tuyệt đối không đưa vào câu lệnh ví dụ**.

---

### Điểm bất hợp lý 4: Cắt đôi Lý thuyết và Thực hành thành 2 nửa rời rạc trong cùng một bài ("Đọc hết sớ lý thuyết rồi mới mở máy")
- **Hiện trạng:**
  - Cả 6 bài hiện tại đều theo công thức cứng nhắc: **Nửa đầu bài (5–6 phần liên tiếp) chỉ chiếu Slide chữ tĩnh**, **Nửa cuối bài mới mở giao diện phần mềm mô phỏng**.
  - Điển hình ở **Bài 2**:
    - `Phần 1`: Nói lý thuyết về `Open Folder`.
    - `Phần 2`: Nói lý thuyết về `.md` và `.csv`.
    - `Phần 3`: Nói lý thuyết về `Office Viewer`.
    - `Phần 4`: Nói lý thuyết về `Turbo`.
    - `Phần 5`: Nói lý thuyết về `Ctrl + M` và `Ctrl + L`.
    - Sau khi nghe xong 5 chủ đề lý thuyết liên tiếp (mất hơn 1 phút), đến `Phần 6` mới quay lại mở `Open Folder` trên màn hình!
- **Tại sao bất hợp lý?**
  - Người học phần mềm không thể nhớ nổi 5 khái niệm lý thuyết khác nhau rồi mới xem thao tác một lượt. Cách dạy tự nhiên và cuốn hút nhất là **Đan xen (Interleaved): Nói lý thuyết điểm nào (10 giây) $\to$ Mở màn hình làm mẫu ngay điểm đó (15 giây)**.

---

### Điểm bất hợp lý 5: Bài 2 đang bị nhồi nhét 4 chủ đề không liên quan và nhảy qua lại đột ngột giữa 2 phần mềm
- **Hiện trạng:**
  - Trong vòng chưa đầy 2 phút của **Bài 2 (11 phần)**, học viên bị kéo qua 4 mảng rời rạc:
    1. Mở thư mục `Open Folder` trong **Antigravity IDE** (`b6`).
    2. Xem bảng `.csv` bằng `Office Viewer` trong **Antigravity IDE** (`b7`).
    3. Đột ngột giật màn hình nhảy sang phần mềm **Antigravity 2.0 (Agent Manager)** để vào `Settings` bật quyền `Turbo` (`b8`, `b9`).
    4. Thu giọng nói `Ctrl + M` và bôi đen trích dẫn `Ctrl + L` (`b10`, `b11`).
- **Tại sao bất hợp lý?**
  - Học viên đang ở trong **Antigravity IDE** (`b7`) bỗng nhiên bị chuyển sang cửa sổ **Antigravity 2.0** (`b8`) mà không có lời dẫn chuyển cảnh, dễ gây hiểu nhầm rằng 2 giao diện đó là một hoặc không biết tìm nút `Settings` ở cửa sổ nào.

---

### Điểm bất hợp lý 6: Thiếu bước "Cài đặt, Đăng nhập & Kiểm tra lần đầu" cho người mới bắt đầu từ con số 0
- **Hiện trạng:**
  - Bài 1 nói rằng *"Antigravity 2.0 và Antigravity IDE là hai phần mềm độc lập cần tải về và cài đặt riêng"*, nhưng vào thực hành thì mặc định cả hai phần mềm đã cài sẵn, đã đăng nhập tài khoản và đã cài sẵn tiện ích `Office Viewer`.
- **Tại sao bất hợp lý?**
  - Với học viên mới tinh ở Chương 1, câu hỏi đầu tiên luôn là: *"Tải 2 phần mềm này ở đâu? Cài xong mở cái nào trước? Đăng nhập tài khoản thế nào?"*.

---

## 3. Đề Xuất Cấu Trúc Lại Kịch Bản Chương 1 (Mạch Học Tự Nhiên Từ Số 0 Đến Bài Thực Hành Đầu Tiên)

Để Chương 1 thực sự đóng vai trò **"Chương Nhập Môn Hoàn Hảo"** (chuẩn bị nền tảng vững chắc trước khi sang Chương 2 học `.md/.csv/@troly.md` và Chương 3 học `.agent/Rules-Skills-Workflows`), em đề xuất sắp xếp lại 6 bài của Chương 1 theo đúng trình tự thời gian tự nhiên của người học:

| Thứ tự mới đề xuất | Tên Bài học (Mạch tự nhiên từ gốc đến ngọn) | Nội dung cốt lõi & Điểm cải tiến so với bản cũ |
| :--- | :--- | :--- |
| **Bài 1** | **Từ Chat trên Web đến Trợ lý AI làm việc trên Máy tính** | Giữ cốt lõi hay nhất của Bài 1 cũ (ẩn dụ tư vấn viên qua điện thoại vs. trợ lý ngồi cạnh máy tính, phân biệt 2 phần mềm `Antigravity 2.0` & `Antigravity IDE`), nhưng **đan xen Slide và المàn hình thực tế ngay lập tức**, bỏ câu lệnh `@troly.md` chưa học. |
| **Bài 2** *(Đưa Bài 6 cũ lên)* | **Chuẩn bị Học liệu: Giải nén `.zip`, Mở Thư mục & Bản đồ `INDEX.md`** | Đưa toàn bộ nội dung **Giải nén `.zip` $\to$ `Open Folder` $\to$ Đồng bộ 1-1 với ổ cứng (`Reveal in File Explorer`) $\to$ Đọc `INDEX.md` và giới thiệu bối cảnh công ty mẫu `TaskFlow`** lên ngay Bài 2! Học viên có sẵn thư mục học liệu chuẩn trên máy trước khi thao tác. |
| **Bài 3** *(Từ Bài 4 cũ)* | **Làm quen Giao diện 3 Cột & Các Phím Cứu hộ Cơ bản** | Hướng dẫn chi tiết 3 cột của `Antigravity IDE`, cách bật/tắt cây thư mục (`Ctrl + B`), chế độ đọc tài liệu trực quan (`Preview` / `Office Viewer`), và 3 nút điều khiển khi AI đang chạy (`Stop`, `Tiếp tục`, `Accept`). |
| **Bài 4** *(Tách từ Bài 1 & Bài 2 cũ)* | **Chọn Mô hình AI, Bật Quyền Tự chủ `Turbo` & Đính kèm `@`** | Gom gọn phần cấu hình trước khi giao việc: Cách chọn đúng 5 mô hình AI, cách bật chế độ `Turbo` để AI không hỏi lắt nhắt, và cách dùng `@` đính kèm tệp có sẵn (`@COMPANY.md`, `@sales_data.csv`) + giọng nói `Ctrl + M` / trích dẫn `Ctrl + L`. |
| **Bài 5** *(Giữ Bài 5 cũ)* | **Bài Thực hành Đầu tiên: Chạy Lệnh `/start-1-1` trên Dự án `TaskFlow`** | Khi đã nắm vững giao diện và cách đính kèm `@`, học viên chính thức gõ lệnh gạch chéo đầu tiên `/start-1-1` (tránh bẫy phím Cách `Space`) và trải nghiệm cảm giác AI dẫn dắt thực hành từng bước. |
| **Bài 6** *(Rút gọn từ Bài 3 cũ — Cầu nối sang Chương 2 & 3)* | **Bức tranh Tổng thể: Cách AI Lưu Quy trình vào `.agent` (`Rules`, `Skills`, `Workflows`)** | Đóng vai trò bài tổng kết Chương 1 & mở đường sang Chương 2–3: Giải thích ngắn gọn ẩn dụ "Căn bếp" (`Rules`, `Skills`, `Workflows`), thói quen **hỏi ngược trực tiếp AI khi quên lệnh**, và nghiệm thu bằng tệp đầu ra trên ổ cứng (nhường phần chuyên sâu `/grill-me`, `/plan`, `/learn` sang Chương 3). |

---

## 4. Câu Hỏi Xin Ý Kiến Thảo Luận Cùng CEO Hoàng Đức Minh

1. **Về thứ tự 6 bài trong Chương 1:** Anh có đồng ý đẩy **Bài 6 hiện tại (Giải nén `.zip` & Mở thư mục `Open Folder`)** lên làm **Bài 2**, và đẩy **Bài 3 hiện tại (`.agent`: `Rules`, `Skills`, `Workflows`)** xuống cuối Chương 1 (hoặc làm cầu nối sang Chương 3) để học viên đi đúng trình tự từ dễ đến khó không ạ?
2. **Về cách kết hợp Lý thuyết & Thực hành trong từng bài:** Anh muốn giữ kiểu *"nửa đầu bài chiếu hết các slide lý thuyết, nửa sau mới mở phần mềm"* như hiện tại, hay chuyển sang kiểu **đan xen (Nói 1 ý lý thuyết trên slide $\to$ Mở phần mềm thao tác ngay ý đó)**?
3. **Về các lệnh nâng cao (`/grill-me`, `/plan`, `/learn`) và `@troly.md`:** Ở Chương 1 ta chỉ giới thiệu khái niệm tổng quan và dùng các tệp có sẵn (`@COMPANY.md`, `@sales_data.csv`, `/start-1-1`), còn phần thực hành sâu `@troly.md` và `/grill-me`, `/plan`, `/learn` để dành sang **Chương 2 & Chương 3** có hợp lý hơn không ạ?
