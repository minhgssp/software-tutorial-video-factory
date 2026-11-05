window.KUDO_SPEC = {
  "filename": "lesson_16.html",
  "legacy_alias": "",
  "code": "BÀI 16",
  "chapter_number": 4,
  "chapter_code": "CHƯƠNG 4",
  "chapter_title": "Xử lý Dữ liệu, Bảng tính & Phối hợp Đội nhóm",
  "title": "Đồng bộ Tài liệu Nhóm Qua GitHub & Sao lưu Google Drive Tự động",
  "short_title": "Đồng bộ GitHub & Google Drive",
  "pill_label": "Bài 16 · Đồng bộ GitHub & Drive",
  "description": "Xóa bỏ cảnh gửi file qua lại trên Zalo/Email với tên 'Bao_cao_final_v2_sua_lan_3': Học cách nhờ Trợ lý AI lưu mốc lịch sử phiên bản (Git/GitHub) và đồng bộ trực tiếp lên thư mục Google Drive của công ty.",
  "prerequisites": "Bài 14 & Bài 15 (Đã tạo ra tệp báo cáo bao_cao_doanh_thu_q1.md và de_an_tong_the_q2.md trên ổ cứng).",
  "dependents": "Chương 5 (Sản xuất nội dung truyền thông & thuyết trình từ kho dữ liệu đã đồng bộ).",
  "placement_risk": "0% Rủi ro — Dân văn phòng không cần thuộc câu lệnh Git khó nhớ vì chỉ cần ra lệnh bằng tiếng Việt cho Trợ lý AI thực hiện trọn gói.",
  "continuity_bridge": "Kết thúc Chương 4, toàn bộ dữ liệu và báo cáo đã được phân tích chuẩn xác và đồng bộ an toàn. Sang Chương 5 (Bài 17), chúng ta sẽ biến các báo cáo này thành bài viết truyền thông, slide và bảng điều khiển đẹp mắt!",
  "slides": {
    "s1": "<div>\n      <div class=\"k-slide-header\">\n        <span class=\"k-slide-kicker\">CHƯƠNG 4 · BÀI 16 · LÝ THUYẾT KIỂU 1 ( NGUYÊN LÝ &amp; TRỰC QUAN )</span>\n        <span class=\"k-slide-step\">Bố cục TIMELINE · Nhịp 1/6</span>\n      </div>\n      <div class=\"k-slide-h1\">Tạm biệt nỗi ám ảnh 'Báo_cáo_Final_v3_Sửa_cuối': Quản lý phiên bản và Sao lưu đám mây</div>\n      <div class=\"k-slide-sub\">Kết hợp sức mạnh lưu lịch sử từng dòng sửa của GitHub với sự tiện lợi khi chia sẻ cho sếp trên Google Drive.</div>\n    </div>\n    \n        <div class=\"k-visual-hero-box k-layout-timeline\">\n          <div class=\"k-viz-header\">\n            <span class=\"k-viz-badge\">⏱️ LỘ TRÌNH &amp; CHU TRÌNH THỰC THI CHUẨN</span>\n            <span class=\"k-viz-title\">Quy trình 3 bước đóng dấu phiên bản và đồng bộ đám mây bằng tiếng Việt</span>\n          </div>\n          <div class=\"k-tl-track\">\n            <div class=\"k-tl-step\">\n              <span class=\"k-tl-num\">Chặng 1</span>\n              <strong>1. KIỂM TRA THAY ĐỔI</strong>\n              <span>AI liệt kê các tệp vừa sửa · Đối chiếu trước khi lưu mốc</span>\n            </div>\n            <div class=\"k-tl-conn\">──▶</div>\n            <div class=\"k-tl-step\">\n              <span class=\"k-tl-num\">Chặng 2</span>\n              <strong>2. LƯU MỐC GITHUB</strong>\n              <span>Đóng dấu lịch sử phiên bản · Quay lại bản cũ bất kỳ lúc nào</span>\n            </div>\n            <div class=\"k-tl-conn\">──▶</div>\n            <div class=\"k-tl-step k-tl-final\">\n              <span class=\"k-tl-num\">Chặng 3</span>\n              <strong>3. ĐỒNG BỘ GOOGLE DRIVE</strong>\n              <span>Đẩy tệp lên thư mục chung · Sếp & đồng nghiệp xem được ngay</span>\n            </div>\n          </div>\n        </div>\n        \n    <div class=\"k-grid-3\">\n      \n        <div class=\"k-card k-step-item k-hl\" id=\"s1_c1\" data-order=\"1\">\n          <div class=\"k-card-top-row\">\n            <span class=\"k-card-tag\" style=\"background:#FFF1E6; color:#C2410C; border:1px solid #FDBA74;\">KHÁI NIỆM · GIT & GITHUB CHO VĂN PHÒNG</span>\n            <span class=\"k-illus-badge\"><svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#EA580C\" stroke-width=\"2\"><rect x=\"3\" y=\"4\" width=\"18\" height=\"16\" rx=\"3\"/><path d=\"M8 10h8M8 14h5\"/></svg></span>\n          </div>\n          <h3>Hộp đen lưu lịch sử chỉnh sửa tài liệu</h3>\n          <p>Không chỉ dành cho lập trình viên: Git ghi nhận chính xác ai đã sửa dòng nào, vào ngày giờ nào, giúp khôi phục lại bản hôm qua chỉ trong 1 giây.</p>\n          <div class=\"k-card-mini-note\">🕰️ Không bao giờ sợ lỡ tay xóa mất đoạn văn hay</div>\n        </div>\n        \n        <div class=\"k-card k-step-item k-hl\" id=\"s1_c2\" data-order=\"2\">\n          <div class=\"k-card-top-row\">\n            <span class=\"k-card-tag\" style=\"background:#E0F2FE; color:#0369A1; border:1px solid #7DD3FC;\">KỸ THUẬT · GIAO VIỆC BẰNG TIẾNG VIỆT</span>\n            <span class=\"k-illus-badge\"><svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#0284C7\" stroke-width=\"2\"><path d=\"M12 2L2 7l10 5 10-5-10-5z\"/><path d=\"M2 17l10 5 10-5M2 12l10 5 10-5\"/></svg></span>\n          </div>\n          <h3>Không cần học thuộc câu lệnh kỹ thuật</h3>\n          <p>Bạn chỉ cần nói: 'Hãy lưu mốc phiên bản các báo cáo hôm nay với ghi chú Hoàn tất báo cáo Quý 1 và đẩy lên kho chung'.</p>\n          <div class=\"k-card-mini-note\">💬 AI tự động chạy trọn bộ kiểm tra & đồng bộ</div>\n        </div>\n        \n        <div class=\"k-card k-step-item k-hl\" id=\"s1_c3\" data-order=\"3\">\n          <div class=\"k-card-top-row\">\n            <span class=\"k-card-tag\" style=\"background:#DCFCE7; color:#15803D; border:1px solid #86EFAC;\">KẾT HỢP · ĐỒNG BỘ GOOGLE DRIVE</span>\n            <span class=\"k-illus-badge\"><svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#16A34A\" stroke-width=\"2\"><path d=\"M22 11.08V12a10 10 0 1 1-5.93-9.14\"/><polyline points=\"22 4 12 14.01 9 11.01\"/></svg></span>\n          </div>\n          <h3>Chia sẻ tức thì cho các phòng ban khác</h3>\n          <p>Sử dụng kết nối Google Drive tích hợp sẵn để AI tự động tải tệp bao_cao_doanh_thu_q1.md lên đúng thư mục dự án trên mây.</p>\n          <div class=\"k-card-mini-note\">☁️ An toàn kép: Có cả trên máy, GitHub lẫn Drive</div>\n        </div>\n        \n    </div>\n    <div class=\"k-callout k-step-item k-hl\" id=\"s1_call\" data-order=\"4\">\n      <span>💡</span>\n      <div><strong>Khép lại Chương 4:</strong> Mọi tệp báo cáo quan trọng như <code>bao_cao_doanh_thu_q1.md</code> đều được đóng dấu phiên bản và sao lưu tự động.</div>\n    </div>"
  },
  "beats": [
    {
      "id": "b1",
      "label": "1. [Lý thuyết Kiểu 1] Quy trình 3 bước lưu lịch sử GitHub & đồng bộ Drive",
      "duration": 14.99,
      "pose": 1,
      "mode": "theory",
      "pedagogy_type": "theory_type_1",
      "slide": "s1",
      "hl": [
        "s1_c1",
        "s1_c2",
        "s1_c3",
        "s1_call"
      ],
      "caption": "Trong bài cuối cùng của <strong>Chương 4 — Bài 16</strong>, chúng ta giải quyết triệt để nỗi khổ gửi tệp qua lại với đủ thứ tên <em>Final_v1, Final_v2</em>. Quy trình 3 bước trên màn hình giúp anh chị dùng tiếng Việt bảo trợ lý đóng dấu phiên bản lên <strong>GitHub</strong> và sao lưu thẳng lên <strong>Google Drive</strong>.",
      "audio_src": "audio/lesson_16/b1.mp3",
      "audio_duration": 14.34
    },
    {
      "id": "b2",
      "label": "2. [Lý thuyết Kiểu 2] Quan sát trạng thái các tệp mới tạo trước khi đồng bộ",
      "duration": 12.41,
      "pose": 2,
      "mode": "sim",
      "pedagogy_type": "theory_type_2",
      "pedagogy_badge": "📘 Lý thuyết Kiểu 2 · Kiểm tra Tệp Chờ Đồng bộ",
      "pedagogy_title": "Rà soát tệp bao_cao_doanh_thu_q1.md và de_an_tong_the_q2.md vừa hoàn thành",
      "pedagogy_note": "Trước khi đẩy lên kho chung của phòng, trợ lý AI sẽ liệt kê danh sách các tệp mới hoặc vừa được chỉnh sửa trong ca làm việc.",
      "onEnter": "kudoSimScene({surface:'ide', breadcrumb:'antigravity_course_vn › bao_cao_doanh_thu_q1.md', editorTitle:'📊 bao_cao_doanh_thu_q1.md — Sẵn sàng đồng bộ lên Kho chung', editorHtml:'<div style=\"padding:16px;\"><h3 style=\"color:#9a3412;margin-top:0;\">DANH SÁCH TỆP MỚI CHỜ ĐỒNG BỘ (PENDING SYNC)</h3><ul><li><code>bao_cao_doanh_thu_q1.md</code> — Báo cáo phân tích doanh thu Quý 1 (Tạo ở Bài 14)</li><li><code>de_an_tong_the_q2.md</code> — Đề án tổng thể hợp nhất 3 nhánh (Tạo ở Bài 15)</li><li><code>.agent/rules/quy_chuan_van_phong.md</code> — Bộ quy tắc văn phòng mới cập nhật</li></ul></div>'});",
      "focus_selectors": [
        "#editor-canvas",
        "#ide-file-tree"
      ],
      "cursor_selector": "#editor-canvas",
      "cursor_label": "Danh sách các tệp báo cáo sẵn sàng sao lưu",
      "caption": "Nhìn vào cột giữa trên màn hình: Sau khi hoàn thành báo cáo doanh thu Quý 1 ở Bài 14 và đề án tổng thể ở Bài 15, trợ lý sẽ giúp chúng ta kiểm kê toàn bộ các tệp mới phát sinh để chuẩn bị đẩy lên kho chung.",
      "audio_src": "audio/lesson_16/b2.mp3",
      "audio_duration": 11.76
    },
    {
      "id": "b3",
      "label": "3. [Lý thuyết Kiểu 2] Giao việc đồng bộ bằng tiếng Việt thay vì gõ lệnh Terminal",
      "duration": 12.65,
      "pose": 3,
      "mode": "sim",
      "pedagogy_type": "theory_type_2",
      "pedagogy_badge": "📘 Lý thuyết Kiểu 2 · Đồng bộ Tự động Bằng Tiếng Việt",
      "pedagogy_title": "Trợ lý AI tự động thực thi lệnh lưu phiên bản ở cửa sổ Terminal bên dưới",
      "pedagogy_note": "Bạn chỉ cần ra lệnh ở khung chat phải; AI sẽ tự chạy lệnh đồng bộ ở thanh Terminal phía dưới và báo cáo kết quả.",
      "onEnter": "kudoSimScene({surface:'ide', showTerminal:true, terminalHtml:'<div style=\"padding:10px;font-family:monospace;font-size:12px;color:#15803d;background:#f8fafc;\">$ git add bao_cao_doanh_thu_q1.md de_an_tong_the_q2.md<br>$ git commit -m \" docs(q1): hoan tat bao cao doanh thu Q1 va de an Q2\"<br>[main 8f4a2c1] docs(q1): hoan tat bao cao doanh thu Q1 va de an Q2 (2 files changed)<br>$ gdrive sync bao_cao_doanh_thu_q1.md &rarr; Thư mục Drive: TaskFlow_Bao_Cao_2026 [OK]</div>', userMsg:'Hãy lưu mốc phiên bản cho tệp bao_cao_doanh_thu_q1.md và đồng bộ lên thư mục Google Drive của phòng.', aiMsg:'Tôi đã tự động đóng dấu phiên bản (Commit <code>8f4a2c1</code>) và tải tệp <code>bao_cao_doanh_thu_q1.md</code> lên Google Drive thành công!'});",
      "focus_selectors": [
        "#ide-bottom-terminal",
        "#ide-chat-messages"
      ],
      "cursor_selector": "#ide-bottom-terminal",
      "cursor_label": "AI tự động chạy lệnh đồng bộ ở khung bên dưới",
      "caption": "Anh chị nhìn xuống khung nhỏ phía dưới màn hình: Dân văn phòng không cần tự gõ bất kỳ dòng lệnh kỹ thuật nào. Khi anh chị yêu cầu bằng tiếng Việt ở khung chat, chính trợ lý AI sẽ tự chạy lệnh đóng dấu phiên bản và tải tệp lên <strong>Google Drive</strong>.",
      "audio_src": "audio/lesson_16/b3.mp3",
      "audio_duration": 12.0
    },
    {
      "id": "b4",
      "label": "4. [Thực hành B1/3] Bối cảnh & Kiểm tra tệp bao_cao_doanh_thu_q1.md",
      "duration": 10.01,
      "pose": 4,
      "mode": "sim",
      "pedagogy_type": "practice_step",
      "pedagogy_badge": "🛠️ Thực hành Bước 1/3 · Kiểm tra Tệp Trước Khi Gửi",
      "pedagogy_title": "Bối cảnh: Cần gửi báo cáo doanh thu Quý 1 lên kho chung cho Ban Giám đốc",
      "pedagogy_note": "Bước 1: Mở kiểm tra lại tệp bao_cao_doanh_thu_q1.md để đảm bảo số liệu đã chốt chính xác.",
      "onEnter": "kudoSimScene({surface:'ide', breadcrumb:'antigravity_course_vn › bao_cao_doanh_thu_q1.md', editorTitle:'📊 bao_cao_doanh_thu_q1.md — Kiểm tra lần cuối trước khi đồng bộ', editorHtml:'<div style=\"padding:16px;\"><h3 style=\"color:#9a3412;margin-top:0;\">BÁO CÁO DOANH THU QUÝ 1 (BẢN CHỐT)</h3><p>Tổng doanh thu Quý 1: <strong>1.850.000.000 VNĐ</strong> (Enterprise: 68,1% | SMB: 31,9%).</p><p>Trạng thái: Đã kiểm duyệt 100%, sẵn sàng lưu mốc phiên bản và tải lên Google Drive.</p></div>'});",
      "focus_selectors": [
        "#editor-canvas"
      ],
      "cursor_selector": "#editor-canvas",
      "cursor_label": "Bước 1: Xác nhận nội dung bao_cao_doanh_thu_q1.md",
      "caption": "Chúng ta vào thực hành 3 bước đồng bộ tài liệu nhóm. Ở <strong>Bước 1</strong>, anh chị mở kiểm tra lại tệp <code>bao_cao_doanh_thu_q1.md</code> ở cột giữa trước khi xuất bản cho toàn công ty.",
      "audio_src": "audio/lesson_16/b4.mp3",
      "audio_duration": 9.36
    },
    {
      "id": "b5",
      "label": "5. [Thực hành B2/3] Gõ lệnh yêu cầu AI lưu phiên bản và đẩy lên Drive",
      "duration": 10.33,
      "pose": 5,
      "mode": "sim",
      "pedagogy_type": "practice_step",
      "pedagogy_badge": "🛠️ Thực hành Bước 2/3 · Ra lệnh Lưu Mốc & Sao lưu",
      "pedagogy_title": "Bước 2: Nhập yêu cầu lưu lịch sử GitHub và đồng bộ Google Drive vào ô chat",
      "pedagogy_note": "Ghi rõ nội dung ghi chú phiên bản để sau này nhìn lại biết ngay mốc tài liệu này gồm những gì.",
      "onEnter": "kudoSimScene({surface:'ide', clearChat:true, chatInput:'@bao_cao_doanh_thu_q1.md Hãy lưu mốc lịch sử phiên bản với ghi chú \"Chốt báo cáo doanh thu Quý 1\" và tải tệp này lên thư mục Google Drive Ban Giám đốc.'});",
      "focus_selectors": [
        "#ide-chat-input",
        "#ide-send-btn"
      ],
      "cursor_selector": "#ide-send-btn",
      "cursor_label": "Bước 2: Nhấn Gửi để AI đồng bộ tự động",
      "caption": "Sang <strong>Bước 2</strong>, tại ô chat bên phải, anh chị đính kèm <code>@bao_cao_doanh_thu_q1.md</code>, yêu cầu lưu mốc lịch sử kèm ghi chú rõ ràng và đẩy lên thư mục <strong>Google Drive</strong> rồi nhấn Gửi.",
      "audio_src": "audio/lesson_16/b5.mp3",
      "audio_duration": 9.68
    },
    {
      "id": "b6",
      "label": "6. [Thực hành B3/3] Nghiệm thu liên kết đồng bộ & Chuyển sang Chương 5",
      "duration": 14.85,
      "pose": 6,
      "mode": "sim",
      "pedagogy_type": "practice_step",
      "pedagogy_badge": "🛠️ Thực hành Bước 3/3 · Nghiệm thu Chương 4",
      "pedagogy_title": "Bước 3: Nhận biên bản xác nhận mã phiên bản GitHub và đường dẫn Google Drive",
      "pedagogy_note": "Nghiệm thu: Tài liệu đã an toàn trên cả GitHub lẫn Google Drive. Tiếp theo: Chương 5 (Bài 17) sản xuất Nội dung, Hình ảnh, Slide & Báo cáo Web.",
      "onEnter": "kudoSimScene({surface:'ide', breadcrumb:'antigravity_course_vn › Xác nhận Đồng bộ Đám mây', editorTitle:'☁️ Biên bản Đồng bộ GitHub & Google Drive Thành công', editorHtml:'<div style=\"padding:16px;\"><h2 style=\"color:#15803d;margin-top:0;\">✅ ĐỒNG BỘ HOÀN TẤT 100%</h2><ul><li><strong>Tệp đã đồng bộ:</strong> <code>bao_cao_doanh_thu_q1.md</code></li><li><strong>Mã mốc lịch sử (Git Commit):</strong> <code>#8f4a2c1</code> — <em>\"Chốt báo cáo doanh thu Quý 1\"</em></li><li><strong>Vị trí Google Drive:</strong> <code>Drive / TaskFlow_2026 / Bao_Cao_HDQT / bao_cao_doanh_thu_q1.md</code></li></ul></div>', userMsg:'@bao_cao_doanh_thu_q1.md Hãy lưu mốc lịch sử phiên bản và tải tệp này lên Google Drive Ban Giám đốc.', aiMsg:'Đã hoàn tất! Tệp <code>bao_cao_doanh_thu_q1.md</code> đã được lưu mốc phiên bản trên GitHub và đồng bộ lên Google Drive Ban Giám đốc.'});",
      "focus_selectors": [
        "#editor-canvas",
        "#ide-chat-messages"
      ],
      "cursor_selector": "#editor-canvas",
      "cursor_label": "Bước 3: Đã lưu lịch sử GitHub & đồng bộ Google Drive!",
      "caption": "Ở <strong>Bước 3</strong>, trợ lý báo cáo đã đóng dấu phiên bản và trả về đúng vị trí tệp trên <strong>Google Drive</strong>. Chúc mừng anh chị đã hoàn thành <strong>Chương 4</strong>! Bây giờ chúng ta bước sang <strong>Chương 5 — Bài 17</strong> để biến dữ liệu khô khan thành các ấn phẩm truyền thông, hình ảnh và slide thuyết trình.",
      "audio_src": "audio/lesson_16/b6.mp3",
      "audio_duration": 14.2
    }
  ]
};
