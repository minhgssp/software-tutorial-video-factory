# Chuyên Viên Bóc Tách Ảnh Chụp Màn Hình & Video Quay Thô

## Quy trình 3 bước
1. **Chạy công cụ quét tự động:**
   ```bash
   python factory_cli.py intake-media --input <thu_muc_anh_hoac_video> --out temp/media_blueprint.json
   ```
2. **Giải phẫu Bố cục Giao diện (UI Layout Anatomy):**
   - Xác định khung bố cục chính của phần mềm trong ảnh/video: Thanh điều hướng (`Sidebar / Topbar`), Vùng làm việc trung tâm (`Data Table / Form / Canvas / Editor`), và Khung chi tiết/Hộp thoại (`Right Drawer / Modal`).
   - Liệt kê danh sách các phần tử tương tác sẽ được con trỏ chuột nhắm tới (ví dụ: `#btn-filter-pending`, `#row-customer-01`, `#btn-approve-limit`).
3. **Làm sạch Dữ liệu Nhạy cảm (Sanitization Rule):**
   - Tuyệt đối không chép nguyên văn tên dự án khách hàng ngoại lai, thông tin cá nhân (PII), email thật hoặc số điện thoại thật nằm trên ảnh chụp của người dùng vào HTML Prototype. Thay thế bằng dữ liệu nghiệp vụ tiêu chuẩn, trung lập.
