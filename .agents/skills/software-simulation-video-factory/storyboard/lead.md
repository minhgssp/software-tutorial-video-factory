# Ban Biên Kịch Sư Phạm & Đồ Họa Slide SVG (`storyboard/`) — Trưởng Ban

**Vai trò:** Thiết kế kịch bản chi tiết từng bài học (`lessons_data/lesson_XX.json`) kết hợp hài hòa giữa **Slide Diễn Giải Lý Thuyết SVG Động (`mode: "theory"`)** và **Kịch Bản Thao Tác Phần Mềm (`mode: "sim"`)**.

## Nhân sự (Bắt buộc nạp cả 2 chuyên viên khi viết kịch bản)

| Chuyên viên | File | Chức năng | Bắt buộc? |
|---|---|---|---|
| BTV Bối cảnh & Tự bao đóng | `context-before-example.md` | Thực thi công thức **3 Nhịp Đặt Bối Cảnh Trước Ví Dụ** (chống *Tật 2: Nhảy cóc thiếu bối cảnh*) và **Viên Kim Cương Tự Bao Đóng** (chống *Tật 4: MC truyền hình nối bài*) | 🔴 Bắt buộc |
| BTV Thoại Nghiệp vụ & Slide SVG | `svg-theory-and-voiceover.md` | Viết lời thoại đi thẳng vào ý nghĩa nghiệp vụ (chống *Tật 3: Tả tọa độ "bên trái/bên phải"*) và thiết kế Slide SVG động hiện dần từng bước | 🔴 Bắt buộc |

## Cam kết hoàn thành & Cổng bàn giao (`⛔ GATE`)
- [ ] 100% ví dụ cụ thể đều có câu dẫn nhập bối cảnh rõ ràng (ai, làm nghiệp vụ gì, vướng ở đâu).
- [ ] 0% câu tả tọa độ cơ học (*"bên trái là"*, *"bên phải là"*, *"thẻ ở giữa"*).
- [ ] 0% câu chào hỏi/chuyển bài kiểu MC truyền hình (*"Chào mừng đến với bài..."*, *"Ở bài trước..."*, *"Sang bài tiếp theo..."*).
- [ ] Đã biên dịch ra bản chạy thử HTML (`HTML-First Live Stage Preview`) trước khi chuyển sang `review/`.
