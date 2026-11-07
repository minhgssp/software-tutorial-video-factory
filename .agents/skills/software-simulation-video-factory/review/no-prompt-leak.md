# Kiểm Duyệt Viên Chống Lộ Prompt Nội Bộ & Ghi Chú Đạo Diễn (Chặn Tật 1)

## Bản chất lỗi cần chặn
Giống như người làm bếp vô tình bưng cả cuốn sổ tay ghi chú công thức hậu trường ra đặt lên bàn ăn của thực khách, làm lộ các câu lệnh thô cứng hoặc nhãn kỹ thuật đạo diễn thay vì giao tiếp bằng ngôn ngữ nghiệp vụ.

## Danh sách Chặn Tuyệt Đối trên Giao diện & Lời thoại (`Zero Stage-Direction Leak`)
1. **Cấm hiển thị các nhãn đạo diễn camera / hậu trường:**
   - `REDLINE FOCUS`, `FOCUS SHOT`, `OPTION BATTLE`, `CẢNH 1 / 11`, `SHOT_NOTE`, `STAGE_DIRECTION`.
   - `🎙️ LỜI GIẢNG ĐỒNG BỘ`, `BÔI ĐEN ĐỂ COPY`, `HTML Vector 100%`.
2. **Cấm lộ cú pháp Prompt / Rule nội bộ của AI ra lời giảng:**
   - Không để lọt các nhãn như `[PROMPT]`, `[SYSTEM INSTRUCTION]`, `Theo PROP-261106...`, `Rule 1:`, `Mode: sim` vào trong văn bản hiển thị cho học viên (`caption`, `title`, `badge`, `slide HTML`).
3. **Mọi nhãn góc và thanh trạng thái trên màn hình:**
   - Bắt buộc dùng thuật ngữ nghiệp vụ có ý nghĩa với người học (ví dụ: `PHẦN 1 · QUY TRÌNH THẨM ĐỊNH`, `BƯỚC 2 · ĐỐI CHIẾU HỒ SƠ`).
