# Cẩm Nang Đúc Kết: 25 Quy Tắc Vàng Về Giả Lập Phần Mềm & Sản Xuất Video Bài Giảng (`05_DISTILLED_PLAYBOOK_SOFTWARE_SIMULATION_AND_VIDEO.md`)

> *Đúc kết hợp nhất từ thực chiến **Khóa Antigravity Basic (`SP_261104_01`)** và **Khóa AI Thực Chiến FinBank Đơn vị Doanh nghiệp (`SP_261030_04`)**, kết hợp kỷ luật kỹ thuật của `/kudo`, `/reelcrew` và `/fac-video`.*

---

## Phần I. 10 Quy Tắc Thiết Kế Bộ Giả Lập Phần Mềm HTML Tương Tác (`Interactive HTML Software Simulator`)

1. **Đốm sáng Laser Đỏ thay cho con trỏ mũi tên mặc định (`#laser-cursor`):**
   - Trong video bài giảng phần mềm, mũi tên chuột trắng/đen mặc định rất dễ chìm vào nền giao diện. Hãy dùng một **đốm sáng màu đỏ mềm mại** (`18px × 18px`, tâm sáng ấm `#fff5f5`, viền tỏa sáng `radial-gradient` đỏ `#ff3b30`), tự động nở nhẹ (`26px`) khi chạm vùng bấm được và phóng vòng tròn sáng lan tỏa (`.click-ripple`) khi click.
2. **Tuyệt đối không dùng thẻ `<select>` gốc của hệ điều hành:**
   - Menu xổ xuống của `<select>` gốc được vẽ bởi cửa sổ hệ điều hành nằm ngoài DOM nên khi quay màn hình tự động hoặc di chuyển `#laser-cursor`, menu sẽ không hiện hoặc che mất đốm sáng laser. Bắt buộc thay bằng menu thả xuống DOM tùy chỉnh (`#custom-select-floating`).
3. **Đạo diễn chuyển động con trỏ mượt mà (`glideLaserTo`):**
   - Mọi kịch bản tự chạy (`Auto-Tour` / `Scenario Runner`) phải đưa phần tử đích vào khung nhìn (`scrollIntoView({block: 'nearest'})`), đợi bố cục ổn định rồi mới lướt đốm sáng laser theo đường cong `cubic-bezier(0.22, 1, 0.36, 1)` tới tâm hoặc góc dưới-phải của phần tử, dừng `120ms` rồi mới kích hoạt vòng sáng click.
4. **Cây thư mục ảo (`Virtual File System - VFS`) phản ánh 1:1 bối cảnh khóa học:**
   - Bộ giả lập phải có kho dữ liệu `VFS` lưu nội dung thật của các tệp trong bài học để khi bấm vào bất kỳ tệp nào trên cây thư mục Explorer, khung soạn thảo ở giữa đều mở đúng nội dung tệp đó.
5. **Chống lọt tên dự án ngoại lai từ ảnh chụp tham chiếu (Anti-Context Contamination):**
   - Khi lấy ảnh chụp màn hình của giảng viên làm mẫu dựng giao diện, ảnh chụp thường chứa tên các dự án khác mà giảng viên đang làm (ví dụ `C20_TelecomCorp_Product_Manager`, `FinBank`, `demo_sales_analytics`). Bắt buộc phải lọc sạch và thay thế 100% bằng đúng tên dự án chuẩn của khóa học đang dạy (ví dụ `antigravity_course_vn`).
6. **Mô phỏng trọn vẹn cả Cửa sổ Hệ điều hành & Hộp thoại cảnh báo:**
   - Những thao tác người mới hay lúng túng nhất nằm ở ranh giới giữa Phần mềm và Hệ điều hành (ví dụ: bấm `File -> Open Folder` hiện cửa sổ Windows 11 File Explorer màu tối, hoặc vô tình kéo thả nhầm thư mục hiện hộp thoại cảnh báo `Are you sure you want to move...`). Hãy dựng các hộp thoại này bằng DOM ngay trong trang giả lập.
7. **Mô phỏng trạng thái "Đang suy nghĩ & Đang thực thi" của AI Agent:**
   - Đừng để kết quả hiện ra đột ngột. Hãy mô phỏng chuỗi tiến trình thực tế: gõ câu lệnh (`typewriter`) $\to$ hiện trạng thái `Thinking...` $\to$ xổ từng bước `Analyzed...`, `Edited...`, `Ran command...` $\to$ cập nhật thẻ `Files Edited` và mở tệp kết quả bên phải.
8. **Chuyển đổi đa chế độ nhìn trên cùng một tệp (`WYSIWYG Office Viewer / Raw / Preview`):**
   - Người học không chuyên lập trình rất sợ màn hình đen hoặc mã Markdown thô. Bộ giả lập cần hỗ trợ chuyển đổi trực quan giữa chế độ xem văn bản đẹp (`Office Viewer` có nhãn `H1, H2, H3`, bảng biểu CSV có màu trạng thái) và chế độ xem mã gốc (`Raw`).
9. **Hiệu ứng sóng âm thanh khi mô phỏng nhập liệu bằng giọng nói (`Simulated Voice Waveform`):**
   - Vì bộ giả lập HTML chạy độc lập (không thu âm người thật qua micro), khi mô phỏng tính năng Voice Dictation chỉ cần bật hiệu ứng vạch sóng âm nhấp nhô (`voice-wave`) kèm chữ chạy từng từ vào ô nhập lệnh.
10. **Kiểm định cú pháp JS cơ học (`node --check`) sau mỗi lần sửa HTML:**
    - Tệp giả lập đơn tệp thường dài hàng nghìn dòng. Một lỗi thiếu dấu đóng ngoặc trong `<script>` sẽ làm liệt toàn bộ sự kiện bấm nút. Bắt buộc trích xuất toàn bộ thẻ `<script>` chạy qua `node --check` đạt `0` lỗi trước khi bàn giao.

---

## Phần II. 15 Quy Tắc Sản Xuất Video Bài Giảng & Đào Tạo (`Tutorial & Lecture Video Production`)

11. **Duyệt lời trước, dựng sau — Tệp lời là nguồn duy nhất (`Single Source of Truth`):**
    - Sửa lời trên giấy rẻ hơn gấp chục lần sửa sau khi đã render video. Kịch bản dựng phải sinh từ tệp lời chuẩn, không sửa lời ở nhiều nơi.
12. **Làm một bài mẫu cho đạt rồi mới sản xuất hàng loạt:**
    - Mọi lỗi về bố cục, cỡ chữ, nhịp cắt cảnh sẽ lặp lại ở tất cả các bài nếu chưa khóa chặt bài mẫu đầu tiên. Xem trước bằng trang dựng thật kèm giọng đọc (`--preview`) rồi mới render MP4.
13. **Mở bài trực diện bằng vấn đề người xem đang gặp:**
    - Không chào hỏi rào đón (*"Chào mừng các bạn..."*, *"Trong bài học trước..."*). Mở ngay bằng câu hỏi hoặc tình huống thực tế người học đang vướng, rồi nói rõ video gồm mấy phần. Không nhắc tới số thứ tự bài trước hay bài sau để video có thể đứng độc lập.
14. **Chọn 1 trong 4 khuôn giao diện theo đúng bản chất nội dung:**
    - **Lưới (`grid` / `hero`):** Dùng cho luận điểm chính, danh sách ý lớn (chữ rất lớn chiếm trọn khung, nói tới ô nào ô đó sáng lên).
    - **Cảnh mở ý lớn (`card` + `opener`):** Khi bắt đầu một ý lớn trong danh sách (1–3 câu đầu), dùng cảnh mở riêng (giữ nguyên cột trái và phụ đề, thay khung phải bằng tiêu đề lớn + câu tóm tắt có tô vàng từ khóa theo giọng đọc) để làm mới nhận thức người xem, sau đó mới quay về giao diện phần mềm.
    - **Giải thích cơ chế (`predict` / `flow` / `board`):** Dùng sơ đồ luồng, thanh xác suất hoặc bảng nối dây SVG động cho các khái niệm trừu tượng.
    - **Mô phỏng trực tiếp (`live` — `app` / `webchat` / `workspace`):** Dùng cho thao tác giao việc, đặt câu hỏi, sửa tài liệu với AI.
15. **Lời nhấn gì, hình đổi nấy (`Semantic Audio-Visual Lock`):**
    - Không bao giờ để một đoạn lý thuyết dài nằm trên màn hình tĩnh. Mỗi hành vi hoặc ý được nhấn trong lời phải gắn với một bước thay đổi cụ thể trên màn hình (`hl` tô đúng dòng, `show` hiện thêm thẻ, `doc` mở tài liệu, `tick` đánh dấu xong bước) tại đúng cụm từ khóa `at`.
16. **Con trỏ không bao giờ che chữ (`Bottom-Right Content Corner`):**
    - Khi trỏ vào một khối chữ hoặc thẻ thông tin, con trỏ phải đậu ở góc dưới bên phải của đối tượng (`CONTENT_CORNER_JS`). Nhãn chú thích đứng yên, màu trung tính, không bay lắc lư theo đuôi con trỏ.
17. **Phụ đề hiện trọn đoạn đủ ý, tối thiểu tròn một câu (`Paragraph Captions`):**
    - Không cắt phụ đề vụn vặt theo từng cụm 3–5 từ kiểu TikTok đối với video bài giảng 16:9. Phụ đề phải hiện trọn câu có dấu chấm, xuống dòng sau mỗi câu để người học đọc hiểu trọn ý, đồng thời tô sáng từ đang đọc.
18. **Chỉ dừng khoảng 1 giây giữa hai ý lớn (`Max Hold <= 1.0s`):**
    - Không dừng 2–3 giây chờ hình chạy. Nếu thao tác trên màn hình cần thêm thời gian (như gõ câu lệnh dài), hãy đặt mốc `at` sớm lên đầu câu (`LEAD_BY_DO`) hoặc diễn giải chi tiết hơn một chút trong lời thoại để lấp đầy nhịp.
19. **Tiếng động nằm trong khoảng lặng, trùng lời đọc phải tự giảm âm (`-8dB Ducking`):**
    - Tiếng chuyển cảnh (`whoosh`), tiếng gõ phím (`typing`), tiếng bấm chuột (`click`) nếu rơi trùng vào lúc giảng viên đang đọc thì phải tự động hạ âm lượng xuống `-8dB` (`sfx_cues_around_speech`) để không bao giờ át tiếng giảng.
20. **Viết lời thoại cho máy đọc và bộ căn phụ đề không bao giờ trượt (`TTS Token Hygiene`):**
    - Trong mảng lời đọc `say[]`: tuyệt đối không viết chữ số bằng số (phải viết bằng chữ: *"ba mươi giây"*, *"cấp độ hai"*), không dùng dấu gạch nối (`K-W-S-R`), dấu chấm giữa tên tệp (`research.md` viết thành *"sổ nháp research"*), hoặc ký hiệu `/` đứng rời. Trên mặt trang hình ảnh (`page`) thì vẫn hiển thị số và tên tệp chuẩn bình thường.
21. **Phản biện nội dung gốc & Cấm từ tuyệt đối không có căn cứ:**
    - Không tin mù quáng vào bản nháp đầu tiên. Loại bỏ các từ tuyệt đối (*"luôn luôn"*, *"không bao giờ"*, *"100%"*) và các con số tiết kiệm thời gian không có nguồn kiểm chứng. Nếu dùng số liệu để minh họa cơ chế thì phải ghi rõ trên màn hình là *"Tình huống giả lập / Dữ liệu minh họa"*.
22. **Tránh Overfit — Dạy cách quyết định thay vì danh sách mẹo vụn:**
    - Tách bạch rõ ví dụ và quy tắc chung. Luôn nêu rõ cả **khi nào chưa cần áp dụng** (ví dụ: việc nhỏ làm một lần thì hỏi thẳng AI cho nhanh, chưa cần dựng quy trình phức tạp).
23. **Chuẩn Whitelabel khi đóng gói học liệu dùng chung nhiều đơn vị:**
    - Với các bộ video bài giảng lõi dùng cho nhiều doanh nghiệp, ẩn tên thương hiệu/địa phương/hãng công cụ cụ thể trong lời thoại; dùng danh từ chung (*"ngân hàng"*, *"chi nhánh"*, *"không gian làm việc AI"*, *"khách hàng minh họa KH_CN_01"*).
24. **Đồng bộ hai chiều giữa Video và Học liệu chữ:**
    - Quá trình làm video (buộc phải minh họa từng câu nói bằng hình ảnh cụ thể) sẽ làm lộ ra các chỗ mơ hồ hoặc mâu thuẫn của bài viết gốc. Khi sửa kịch bản video, bắt buộc cập nhật ngược lại vào giáo trình, slide và bài tập thực hành.
25. **Mỗi bài học rút ra phải biến thành Chốt chặn Cơ học (`Code Linter`) ngay lập tức:**
    - Đừng sửa tay từng video rồi để quy tắc nằm trong trí nhớ. Mọi quy tắc (từ kiểm tra chữ số trong `say[]`, kiểm tra `<select>` trần, kiểm tra lọt tên dự án ngoại lai, tới kiểm tra `holds <= 1.0s`) đều phải được mã hóa thành hàm kiểm tra tự động trong `syncgate_and_foley.py`.
