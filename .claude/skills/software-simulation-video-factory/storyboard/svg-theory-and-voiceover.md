# Chuyên Viên Lời Giảng Nghiệp Vụ & Đồ Họa Slide SVG Động

## 1. Trị Dứt Điểm "Tật Tả Tọa Độ Cơ Học" (`Mechanical Spatial Narration` — Anti-Pattern 3)

- **Bản chất căn bệnh:** Giống như người dẫn đường liên tục chỉ tay tả tọa độ địa lý (*"nhìn sang bên trái"*, *"ở góc bên phải"*, *"ở thẻ chính giữa"*), trong khi vệt sáng Spotlight và cơ chế Progressive Reveal đã tự động chiếu sáng đúng vị trí đó rồi.
- **Quy tắc Chuyển dịch Ngôn ngữ Chuyên gia:**
  Lời giảng chuẩn phải gọi thẳng **tên nghiệp vụ và ý nghĩa của khu vực đó**, tuyệt đối không tả tọa độ vật lý:
  * ❌ **CẤM VIẾT:** *"Nhìn sang cột bên trái, anh chị bấm vào mục thứ hai. Sau đó ở bảng bên phải sẽ hiện ra..."*
  * ✅ **PHẢI VIẾT:** *"Tại danh mục Quản lý Tờ trình, chúng ta chọn Hàng đợi phê duyệt. Ngay lập tức, bảng Đối chiếu hạn mức tín dụng sẽ hiển thị..."*
  * ❌ **CẤM VIẾT (trên Slide Lý thuyết):** *"Ở thẻ bên trái là cách làm cũ, thẻ ở giữa là nguyên nhân, và thẻ bên phải là giải pháp..."*
  * ✅ **PHẢI VIẾT (trên Slide Lý thuyết):** *"Khi xử lý hồ sơ theo cách thủ công, chuyên viên mất hàng giờ dò từng trang PDF. Nguyên nhân là do dữ liệu bị phân mảnh... Giải pháp là chuẩn hóa ngay từ đầu vào..."* (Trong lúc giọng đọc vang lên, 3 khối `.k-step-item` trên Slide SVG tự động sáng lên tương ứng!).

---

## 2. Quy Chuẩn Thiết Kế Slide Lý Thuyết SVG Động (`s1.html`, `s2.html`)

1. **Mỗi nhịp lý thuyết (`b1`, `b2`) có một mặt phẳng đồ họa SVG riêng biệt:**
   - `s1.html` (cho `b1`): Thường dùng bố cục Đối sánh Trước / Sau (`k-layout-comparison`) hoặc Phẫu thuật Nỗi đau.
   - `s2.html` (cho `b2`): Thường dùng bố cục Lưu đồ Quy trình 3 Bước (`k-layout-flowchart`) hoặc Sơ đồ Kiến trúc.
2. **Trải phẳng 1 cột & Chống quá tải nhận thức (`PROP-261106-07`):**
   - Trải phẳng các khối `.k-step-item` theo luồng đọc tự nhiên, mỗi khối có hình vẽ SVG trực quan sát nghĩa và tiêu đề ngắn gọn (viết hoa chuẩn câu tiếng Việt — `Sentence case`, cấm viết hoa mọi chữ cái đầu `Title Case`).
