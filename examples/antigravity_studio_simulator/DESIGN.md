# DESIGN.md — Quy Chuẩn Giao Diện & Trải Nghiệm (Antigravity Basic Player v3)

## 1. Bố Cục Tổng Thể (Single Left-Sidebar Architecture)
- **Sidebar Trái (`#kudo-left-sidebar`, rộng `280px` trên Desktop):** Chứa thông tin thương hiệu, hộp chọn chuyển nhanh 6 bài giảng, cụm nút điều khiển trình phát (`⏸ Tạm dừng`, `⏮ Trước`, `⏭ Tiếp`, `🔇 Tắt tiếng` / `🔊 Bật tiếng`, `1.0x`, `🖱️ Ẩn chuột & Tip [C]`) và danh sách dọc các phần nhỏ trong bài học.
- **Khung Chính Bên Phải (`#kudo-right-main`, `1fr`):** Chiếm toàn bộ diện tích còn lại (`1160px` trên màn hình `1440px`), chia làm 2 phần: Sân khấu mô phỏng/slide (`#kudo-stage-viewport`) ở trên và Dải phụ đề giảng viên (`#kudo-subtitle-strip`, cao `96px`) ở dưới.
- **Tương thích Đa Thiết Bị (`@media (max-width: 900px)`):** Tự động xếp chồng Sân khấu trình chiếu lên trên (`62vh`) và Sidebar điều khiển xuống dưới (`38vh`), bật cuộn mượt và co lưới `.k-grid-2`, `.k-grid-3` về 1 cột.

## 2. Quy Tắc Con Trỏ Chuột Giả Lập & Nhãn Gợi Ý (`#kudo-cursor`)
- **Chống che khuất Menu Gợi ý:** Khi hộp thoại gợi ý (`#ide-popup-menu`, `#agy2-popup-menu`, `#kudo-model-popover`, `#kudo-turbo-popover`, `#kudo-context-menu`) mở ra, mũi tên con trỏ luôn neo ở mép phải dòng đang chọn và nhãn hướng dẫn đặt phía trên hộp thoại, tuyệt đối không đè lên chữ trong danh sách gợi ý và không tràn qua viền khung tiêu điểm.
- **Tự động biến mất sau khi thuyết minh kết thúc:** Ngay khi giọng đọc của phần học kết thúc (`vp.ended === true`) hoặc khi học viên bấm trực tiếp vào vùng mô phỏng, con trỏ giả lập và nhãn gợi ý lập tức ẩn đi.
- **Chế độ Ẩn/Hiện Chủ động:** Học viên có thể bấm nút `🖱️ Ẩn chuột & Tip [C]` trên Sidebar trái hoặc nhấn phím `C` để tắt/bật hoàn toàn con trỏ giả lập (lưu trạng thái vào `localStorage`).
