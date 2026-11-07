# Chuyên Viên Thiết Kế Bối Cảnh & Đơn Vị Học Tập Tự Bao Đóng

## 1. Trị Dứt Điểm "Tật Cụt Lủn, Nhảy Cóc Ví Dụ Thiếu Bối Cảnh" (Anti-Pattern 2)

- **Bản chất căn bệnh:** Giống như người kể chuyện chưa kịp giới thiệu nhân vật là ai đã thả người nghe vào giữa trận đánh. Người học bỗng nhiên bị bắt nhìn vào *"ngăn `wip/` của Khách hàng A07"* hay *"hồ sơ B12"* mà hoàn toàn không biết đây là doanh nghiệp gì, đang thẩm định hạn mức nào, gặp khó khăn gì và tại sao lại dùng ví dụ này.
- **Công thức Bắt buộc — 3 Nhịp Đặt Bối Cảnh (`Context-Before-Example Formula`):**
  Trước khi nhắc tới bất kỳ tên tệp, mã hồ sơ hay thao tác cụ thể nào, lời thoại bắt buộc đi qua 3 nhịp:
  1. **Nhịp 1 (Nêu bài toán/nỗi đau chung của nghiệp vụ):** *"Trong nghiệp vụ thẩm định tín dụng doanh nghiệp, rủi ro lớn nhất là lấy nhầm số liệu từ bản nháp chưa kiểm toán..."*
  2. **Nhịp 2 (Giới thiệu rõ nhân vật & tình huống giả định bằng từ khóa `Ví dụ` / `Giả sử`):** *"Ví dụ, chúng ta đang thẩm định hồ sơ cấp hạn mức 50 tỷ đồng cho Công ty Sản xuất Nhựa Bình Minh (mã hồ sơ A07), hiện đang có cả báo cáo nháp lẫn báo cáo thuế chính thức..."*
  3. **Nhịp 3 (Đi vào thao tác trên màn hình):** *"Để tách bạch hai luồng tài liệu này trên phần mềm, tại cây thư mục hồ sơ của Công ty Nhựa Bình Minh, chúng ta mở ngăn tài liệu nháp..."*

---

## 2. Trị Dứt Điểm "Tật Dẫn Dắt Liên Bài Kiểu MC Truyền Hình" (Anti-Pattern 4)

- **Bản chất căn bệnh:** Bắt chước văn phong của MC truyền hình nhiều tập (*"Chào mừng anh chị đến với Bài 5... Ở bài trước chúng ta đã... Tiếp theo sang bài sau chúng ta sẽ..."*). Trên nền tảng học tập và tra cứu số, mỗi bài học phải là một **viên kim cương tri thức độc lập tự bao đóng (`Self-Contained Micro-Learning`)** để cán bộ có thể bấm mở riêng bất kỳ bài nào ra xem ngay lúc cần mà không bị vướng câu chào hỏi hay hứa hẹn chuyển bài rườm rà.
- **Quy tắc Bắt buộc:**
  * **Câu đầu tiên của Nhịp 1 (`b1`):** Đi thẳng vào câu hỏi trọng tâm hoặc giá trị cốt lõi của chính bài học đó. **CẤM** các cụm: *"Chào mừng anh chị..."*, *"Ở bài trước..."*, *"Tiếp nối bài học trước..."*.
  * **Câu cuối cùng của Nhịp kết (`b7`):** Đúc kết nguyên tắc hành động cốt lõi của chính bài học đó. **CẤM** các cụm: *"Sang bài tiếp theo..."*, *"Hẹn gặp lại ở bài sau..."*, *"Trong bài kế tiếp chúng ta sẽ..."*.
