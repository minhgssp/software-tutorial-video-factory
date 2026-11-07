# Kho Mẫu Giao Diện Phần Mềm Đa Ngành (`UI Pattern Catalog`)

Khi dựng nguyên mẫu HTML (`src_sim_surfaces/`) cho một phần mềm mới, hãy chọn đúng khuôn mẫu kiến trúc dưới đây:

| Mã Mẫu | Họ Phần Mềm Mục Tiêu | Bố Cục DOM Chuẩn (`simulator_stage_dom.html`) | Các Hành Vi Mô Phỏng Điển Hình (`simulator_actions.js`) |
|---|---|---|---|
| **`PAT-01`** | **ERP / Phê duyệt Đơn hàng & Tín dụng Ngân hàng** | Cột menu trái (`210px`) + Thanh KPI tóm tắt + Bảng danh sách hồ sơ (`<table>` có nút Lọc trạng thái) + Hộp thoại Phê duyệt/Đối chiếu hạn mức | Lọc hồ sơ trọng yếu → Chọn dòng hồ sơ → Mở bảng đối chiếu điều kiện → Bấm nút Phê duyệt (đổi nhãn trạng thái sang xanh) |
| **`PAT-02`** | **CRM / Quản lý Phễu Khách hàng & Bán hàng** | Thanh tìm kiếm & Bộ lọc chiến dịch + Bảng Kanban 4 cột (hoặc Danh sách Lead) + Ngăn trượt bên phải (`Right Drawer`) hiện lịch sử chăm sóc | Bấm chọn khách hàng tiềm năng → Xem lịch sử cuộc gọi → Điền ghi chú tư vấn → Chuyển trạng thái sang `"Đã chốt hẹn"` |
| **`PAT-03`** | **Biểu mẫu Điện tử Đa Bước (`Multi-Step Wizard / E-Form`)** | Thanh tiến trình 4 bước ở trên + Khung nhập liệu chia 2 nhóm thông tin + Khung kiểm tra lỗi hợp lệ bên phải | Tự động gõ dữ liệu vào từng ô (`Live Typing`) → Báo lỗi trường thiếu chứng từ → Đính kèm tệp → Bấm `"Gửi tờ trình"` |
| **`PAT-04`** | **Dashboard Phân tích Dữ liệu & Báo cáo BI** | Thanh bộ lọc thời gian/chi nhánh + Lưới 3 thẻ chỉ số KPI + Biểu đồ SVG + Bảng chi tiết cảnh báo bất thường | Chọn bộ lọc Quý/Chi nhánh → Biểu đồ cập nhật số liệu → Spotlight khoanh vùng dòng chỉ số sụt giảm bất thường |
| **`PAT-05`** | **Không gian Làm việc Tài liệu & Trợ lý AI (`Workspace / IDE`)** | Bố cục 3 cột: Cây thư mục hồ sơ bên trái + Trình xem tài liệu `.md`/`.csv` ở giữa + Khung điều phối Trợ lý AI bên phải | Chuột phải tạo tệp mới → Kéo thả tệp vào khung chat → Gõ lệnh `/` hoặc `@` → Xem trước tài liệu định dạng đẹp |
