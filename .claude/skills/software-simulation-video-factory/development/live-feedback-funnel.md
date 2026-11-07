# Quy Trình Phễu Tiếp Nhận Phản Hồi Thực Tế Có Chốt Chặn Phê Duyệt (`PROP-261106-05`)

Không phải mọi câu nói ngẫu hứng trong buổi giảng thực tế hay mọi ý kiến bàn luận trong buổi họp UAT đều nên đưa vào kịch bản chuẩn. Để tránh làm loãng bài học hoặc nhiễm các tình huống cá biệt (`overfitting`), bắt buộc thực thi đúng 2 giai đoạn:

## Giai đoạn 1 — Trợ giảng AI Bóc băng & Lọc Đề xuất (`Read-Only Staging`)
1. Bóc tách băng ghi âm / video buổi học vào `live_feedback/transcript_segments/`.
2. **Tự động lọc bỏ nhiễu:** Loại bỏ chuyện bên lề, lỗi máy tính cá biệt của một học viên, hoặc các câu hỏi ngoài phạm vi cốt lõi.
3. Lập bảng **Phiếu Đề Xuất Cập Nhật (`live_feedback/delta_pedagogy_proposals.md`)**, mỗi mục gồm 5 trường:
   - **Mã đề xuất:** `[DELTA-01]`, `[DELTA-02]`...
   - **Vị trí dự kiến tác động:** Ví dụ `Bài 03 - Nhịp b2` hoặc `Màn hình giả lập PAT-01`.
   - **Tóm tắt nội dung bổ sung:** Thêm ví dụ gì, thao tác gì?
   - **Giá trị phổ quát:** Vì sao thay đổi này có ích cho tất cả các khóa/đợt đào tạo sau?
   - **Khuyến nghị phân loại:** `[ĐƯA VÀO BÀI HỌC CHUẨN]` hoặc `[CHỈ LƯU VÀO SỔ TAY FAQ TRỢ GIẢNG]`.

## Giai đoạn 2 — Chốt Chặn Giảng Viên Phê Duyệt (`⛔ [HUMAN GATE: INSTRUCTOR APPROVAL]`)
1. Trình danh sách tóm tắt các mã `[DELTA-XX]` lên khung chat để Giảng viên / Chủ dự án duyệt (ví dụ: *"Duyệt DELTA-01; bỏ DELTA-02"*).
2. Chỉ sau khi nhận lệnh duyệt, mới chuyển các mã được duyệt sang `storyboard/` để cập nhật vào `lessons_data/lesson_XX.json` và biên dịch riêng bài đó (`--lesson X`).
