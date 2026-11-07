# Đạo Diễn Vũ Đạo Phần Mềm 2 Nhịp (`Two-Stage Choreography`)

Mọi nhịp mô phỏng thao tác phần mềm (`mode: "sim"`) bắt buộc tuân thủ quy luật **Nhìn trước → Bấm chuột → Thấy kết quả**:

## Cấu trúc 2 Pha trên mỗi nhịp `sim`
1. **Pha 1 (`0% → 35%` thời lượng nhịp — Dẫn đường & Bấm chuột):**
   - Giao diện phần mềm giữ nguyên trạng thái trước khi bấm.
   - Khung `#demo-spotlight` đóng khung vào nút bấm / vị trí sắp thao tác.
   - Con trỏ `#demo-cursor` lướt mượt theo đường cong Bezier tới tâm nút bấm và phát hiệu ứng `.clicking` (vòng sóng lan tỏa).
2. **Pha 2 (`35% → 100%` thời lượng nhịp — Phản hồi Giao diện & Đổi Tiêu điểm):**
   - Hàm hành động trong `simulator_actions.js` kích hoạt: mở hộp thoại kết quả, chuyển trạng thái đơn hàng sang `"Đã phê duyệt"`, hoặc gõ từng ký tự (`Live Typing`) vào ô nhập liệu.
   - Khung `#demo-spotlight` tự động đo lại `getBoundingClientRect()` để trượt sang ôm khít vùng kết quả vừa xuất hiện.
