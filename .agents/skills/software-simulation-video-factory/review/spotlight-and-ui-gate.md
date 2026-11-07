# Kiểm Duyệt Viên Kỹ Thuật Giao Diện & Độ Chính Xác Spotlight

## Danh sách Kiểm tra Cơ học Bắt buộc
1. **Không có hộp chữ nổi đè lên màn hình phần mềm (`One Thing At A Time`):**
   - Trong chế độ `mode: "sim"`, tuyệt đối không có thẻ giải thích dài dòng đè lên bảng biểu hay biểu mẫu của phần mềm.
2. **Dải phụ đề tách biệt hoàn toàn (`Subtitle Separation`):**
   - Phụ đề nằm gọn trong dải `#kudo-subtitle-strip` (cỡ chữ lớn `16.8px`), có nút bật/tắt `"📝 Phụ đề tự động"` trên thanh tiêu đề.
3. **Khung `#demo-spotlight` ôm sát đúng phần tử mục tiêu:**
   - Mọi selector `target` trong các nhịp `sim` đều tồn tại thật trong DOM.
   - Không có khung Spotlight nào bị lệch hoặc bao trùm quá `28%` diện tích toàn sân khấu khi chỉ nhắm vào một nút bấm hay một dòng dữ liệu.
