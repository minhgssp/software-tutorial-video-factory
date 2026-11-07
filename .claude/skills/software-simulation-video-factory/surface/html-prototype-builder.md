# Kiến Trúc Sư Dựng Nguyên Mẫu Giao Diện HTML (`HTML Software Prototype`)

## 5 Quy Tắc Cốt Lõi Khi Dựng Mặt Phẳng Phần Mềm (`src_sim_surfaces/`)
1. **Không đóng khung vào một kiểu giao diện:**
   - Tùy theo đề bài, hãy chọn đúng khuôn mẫu trong `archive/ui-pattern-catalog.md`:
     * **Phần mềm Quản trị / ERP / Ngân hàng:** Cột điều hướng trái + Thanh chỉ số KPI + Bảng danh sách hồ sơ có bộ lọc + Ngăn chi tiết / Hộp thoại phê duyệt.
     * **Phần mềm CRM / Phễu Bán hàng:** Bảng Kanban kéo thả hoặc Danh sách Lead + Khung lịch sử tương tác + Biểu mẫu cập nhật trạng thái.
     * **Không gian Trợ lý AI / IDE:** Bố cục 3 cột (Cây thư mục hồ sơ + Khung soạn thảo/xem trước tài liệu + Khung hội thoại điều phối).
2. **Mọi phần tử tương tác phải có `id` cụ thể, kích thước vừa vặn:**
   - Gắn `id` trực tiếp lên đúng nút bấm (`#btn-approve`), ô nhập liệu (`#input-search`), hoặc dòng bảng (`#row-item-01`) thay vì gắn lên thẻ `<div>` bao ngoài cả màn hình để khung `#demo-spotlight` ôm sát mục tiêu.
3. **Cấm dùng thẻ `<select>` gốc của trình duyệt:**
   - Thẻ `<select>` gốc vẽ bằng cửa sổ hệ điều hành nên không hiển thị khi quay màn hình DOM và che mất con trỏ. Bắt buộc dựng menu thả xuống bằng `<div class="custom-dropdown-menu">`.
4. **Mọi Popup / Modal phải gắn bên trong `#kudo-stage-viewport`:**
   - Để `spotlight_cursor.js` đo tọa độ tương đối `getBoundingClientRect()` chính xác ở mọi độ phân giải.
5. **Không nhúng bất kỳ hộp thoại thuyết minh nổi nào vào DOM phần mềm:**
   - Mặt phẳng phần mềm phải sạch sẽ 100% như phần mềm thật. Lời giảng nằm ở dải phụ đề đáy `#kudo-subtitle-strip`.
