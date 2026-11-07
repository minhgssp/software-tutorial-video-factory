# Chuyên Viên Kịch Bản FDE / PM On-Site Client Walkthrough (`storyboard/fde-onsite-walkthrough.md`)

**Vai trò:** Thiết kế nhánh video/walkthrough tương tác chuyên biệt giúp **Forward-Deployed Engineer (FDE)**, **Product Manager (PM)**, **BrSE** và **BA** khi làm việc on-site với khách hàng có thể trình bày lại bài toán, chỉ rõ điểm nghẽn, dẫn dắt qua Wireframe giải pháp, đặt lên bàn các rủi ro/phương án lựa chọn và chốt lại bằng một bảng Checklist xác nhận ngắn gọn ngay trên trình duyệt (đẩy thẳng lên **Vercel**).

---

## 1. Triết Lý Sư Phạm & Tư Vấn Hiện Trường (`Pretotyping + One-Page Scope Lock`)

Khi FDE/PM đi on-site giải quyết bài toán cho khách hàng doanh nghiệp:
- Nếu chỉ gửi một tài liệu đặc tả chữ viết dài hàng chục trang, khách hàng thường ngại đọc sâu, ký duyệt đại khái nhưng hình dung trong đầu khác hẳn đội kỹ thuật, dẫn đến làm lại (`rework`) và phình phạm vi (`scope creep`).
- Ngược lại, nếu chỉ chiếu một đoạn video trôi tuột từ đầu đến cuối, khách hàng hiểu luồng tổng thể nhưng lại không có chỗ để dừng lại chỉ tay sửa từng quy tắc nghiệp vụ hay chọn phương án đánh đổi.
- **Giải pháp chuẩn của nhánh `fde-onsite-walkthrough`:** Một ứng dụng **HTML Walkthrough 5 Màn** kết hợp trình phát tự động (có giọng thuyết minh, con trỏ Spotlight chỉ điểm sau khi đã chốt Simulation) với các vùng giao diện đánh số quy chiếu `[WF-01]..[WF-05]` và **Bảng Checklist Xác Nhận 3 Trụ Cột** ở màn cuối.

---

## 2. Cấu Trúc Bắt Buộc 5 Màn (`5-Act FDE/PM On-Site Walkthrough Formula`)

Mọi sản phẩm thuộc nhánh `fde-onsite-walkthrough` bắt buộc có đủ 5 màn (`data-act`) theo đúng trình tự tâm lý ra quyết định của khách hàng:

### Màn 1 — Hiện Trạng & Hành Trình Trước - Trong - Sau Của Client (`data-act="act-1-as-is"`)
- **Mục tiêu:** Để khách hàng gật đầu xác nhận ngay trong 45 giây đầu: *"Đúng, đội dự án đã hiểu rất sát công việc thực tế và nỗi đau hằng tuần của chúng tôi."*
- **Nội dung bắt buộc:**
  1. Dẫn nhập bối cảnh vận hành thực tế của đơn vị (ai đang làm, tần suất bao lâu một lần, khối lượng hồ sơ/báo cáo).
  2. Trải phẳng hành trình hiện tại theo 3 chặng **Trước khi mở công cụ (gom dữ liệu thủ công) → Trong khi thao tác → Sau khi xuất dữ liệu (gộp tay, gửi báo cáo)** theo cấu trúc `As-Is SIPOC`.
  3. Định lượng rõ số giờ công hao phí và tỷ lệ sai lệch hiện tại.

### Màn 2 — Chỉ Rõ Điểm Nghẽn Cốt Lõi & Quy Tắc Ngầm (`data-act="act-2-bottleneck"`)
- **Mục tiêu:** Tách yêu cầu tính năng bề mặt khỏi nguyên nhân gốc rễ gây chậm tiến độ.
- **Nội dung bắt buộc:**
  1. Khoanh vùng chính xác bước nào trên luồng `As-Is` đang làm tắc nghẽn toàn bộ quy trình (ví dụ: mỗi bộ phận tự sửa cấu trúc file Excel, hoặc quy tắc phân loại Xanh - Vàng - Đỏ đang nằm ngầm trong kinh nghiệm cá nhân).
  2. Chuyển hóa kinh nghiệm ngầm đó thành **Bảng Quy Tắc Quyết Định (`Decision Table`)** tường minh (Điều kiện đầu vào $\rightarrow$ Hành động xử lý).

### Màn 3 — Walkthrough Giải Pháp / Wireframe Gắn Số Quy Chiếu (`data-act="act-3-wireframe"`)
- **Mục tiêu:** Cho khách hàng nhìn thấy và chạm thử vào màn hình giải pháp tương lai (`To-Be HTML Prototype`) chạy với đúng dữ liệu mẫu của họ.
- **Nội dung bắt buộc:**
  1. Mặt phẳng HTML Simulation hiển thị trực quan luồng xử lý mới.
  2. Mọi khu vực quan trọng trên Wireframe (bộ lọc đầu vào, bảng đối chiếu quy tắc, thẻ cảnh báo ngoại lệ, nút xuất kết quả) **bắt buộc gắn mã số quy chiếu nổi bật `[WF-01]`, `[WF-02]`, `[WF-03]`, `[WF-04]`** khớp 1-1 với các dòng trong `Decision Table` để khách hàng dễ dàng chỉ điểm: *"Ở ô `[WF-02]` này, ngưỡng cảnh báo của bên chị là 15% chứ không phải 20%"*.

### Màn 4 — Rủi Ro Ngoại Lệ & Các Phương Án Cần Khách Hàng Xác Nhận (`data-act="act-4-risks-options"`)
- **Mục tiêu:** Chặn đứng rủi ro phát sinh ngoài phạm vi trước khi bắt tay vào lập trình.
- **Nội dung bắt buộc:**
  1. Chỉ rõ 3–5 **tình huống ngoại lệ biên (`Edge-Case Risks / Assumption Mapping`)** có thể xảy ra trong thực tế (ví dụ: dữ liệu khuyết cột, hai nguồn báo cáo mâu thuẫn nhau, vắng người phê duyệt, mất kết nối giữa chừng).
  2. Đặt lên bàn **2 hoặc 3 Phương án đánh đổi rõ ràng (`Trade-Off Options A vs B`)** kèm ước lượng thời gian/chi phí để khách hàng chủ động lựa chọn:
     - **Phương án A (Tinh gọn — Khuyên dùng cho Giai đoạn 1 / `Must-have`):** Giải quyết triệt để 80% điểm nghẽn cốt lõi với chi phí thấp và thời gian bàn giao nhanh nhất; đẩy các trường hợp dị biệt vào hàng đợi kiểm tra tay.
     - **Phương án B (Toàn diện — Mở rộng Giai đoạn 2 / `Could-have`):** Tự động hóa cả các luồng ngoại lệ phức tạp và đồng bộ hai chiều với chi phí và thời gian cao hơn.

### Màn 5 — Danh Mục Checklist Tổng Kết Ngắn Gọn (`data-act="act-5-checklist"`)
- **Mục tiêu:** Khóa phạm vi trên một màn hình duy nhất (`1-Page Sign-Off Summary`) với các ô tích chọn tương tác.
- **Nội dung bắt buộc (Đúng 3 trụ cột):**
  1. **Trụ cột 1 — Nỗi đau (`Confirmed Pain Points`):** Danh sách tích chọn xác nhận các điểm nghẽn và số giờ công hao phí hiện tại.
  2. **Trụ cột 2 — Kỳ vọng (`Expected Outcomes & SLA`):** Danh sách tích chọn các chỉ số đầu ra kỳ vọng sau khi áp dụng giải pháp (thời gian rút ngắn, độ chính xác).
  3. **Trụ cột 3 — Lựa chọn hướng giải pháp (`Selected Solution Option & Scope Lock`):** Cho phép khách hàng bấm chọn trực tiếp **Phương án A** hoặc **Phương án B**, khóa các giả định định lượng và bấm nút **"Sao chép Biên bản Xác nhận"** ngay trên trình duyệt.
