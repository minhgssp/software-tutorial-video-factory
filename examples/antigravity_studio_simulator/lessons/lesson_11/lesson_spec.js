window.KUDO_SPEC = {
  "filename": "lesson_11.html",
  "legacy_alias": "",
  "code": "BÀI 11",
  "chapter_number": 3,
  "chapter_code": "CHƯƠNG 3",
  "chapter_title": "Thiết kế Bộ não .agent & Tự động hóa Quy trình",
  "title": "Đóng gói Quy trình Lặp lại Thành Lệnh Gạch chéo (.agent/workflows)",
  "short_title": "Đóng gói Lệnh /workflows",
  "pill_label": "Bài 11 · Đóng gói /workflows",
  "description": "Biến các công việc lặp đi lặp lại hàng ngày/hàng tuần thành một tệp kịch bản trong .agent/workflows/ để bất kỳ ai trong phòng cũng chỉ cần gõ /tên-quy-trình là chạy chuẩn 100%.",
  "prerequisites": "Bài 9 (Hiểu tổng quan .agent) & Bài 10 (Đã biết thiết kế Rules và Skills).",
  "dependents": "Bài 12 (Sử dụng thành thạo bộ 3 lệnh workflow nâng cao /grill-me, /plan, /learn).",
  "placement_risk": "0% Rủi ro — Học viên đã hiểu lệnh /start-1-1 hoạt động ra sao nên việc tự tạo một lệnh /tong-hop-tuan tương tự diễn ra hết sức tự nhiên.",
  "continuity_bridge": "Sau khi biết cách tự tạo lệnh workflow riêng ở Bài 11, Bài 12 sẽ hướng dẫn bộ 3 lệnh workflow mạnh mẽ nhất có sẵn để giải quyết các bài toán khó: /grill-me, /plan và /learn.",
  "slides": {
    "s1": "<div>\n      <div class=\"k-slide-header\">\n        <span class=\"k-slide-kicker\">CHƯƠNG 3 · BÀI 11</span>\n        <span class=\"k-slide-step\">Tổng quan &amp; Nguyên lý cốt lõi</span>\n      </div>\n      <div class=\"k-slide-h1\">Biến quy trình 4 bước mỗi sáng thứ Hai thành một nút bấm /tong-hop-tuan duy nhất</div>\n      <div class=\"k-slide-sub\">Chuẩn hóa quy trình làm việc của bạn thành tài sản chung để nhân sự mới vào cũng làm đúng ngay lần đầu.</div>\n    </div>\n    \n        <div class=\"k-visual-hero-box k-layout-flowchart k-step-item k-hl\" id=\"s1_hero\" data-order=\"1\">\n          <div class=\"k-viz-header\">\n            <span class=\"k-viz-badge\">📊 SƠ ĐỒ QUY TRÌNH CỐT LÕI</span>\n            <span class=\"k-viz-title\">Cấu trúc 4 bước tuần tự bên trong một tệp .agent/workflows/tong-hop-tuan.md</span>\n          </div>\n          <svg class=\"k-flow-svg\" viewBox=\"0 0 860 96\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"Cấu trúc 4 bước tuần tự bên trong một tệp .agent/workflows/tong-hop-tuan.md\">\n            <path d=\"M262 48 H298\" stroke=\"#EA580C\" stroke-width=\"3\" stroke-linecap=\"round\"/>\n            <polygon points=\"295,42 307,48 295,54\" fill=\"#EA580C\"/>\n            <path d=\"M562 48 H598\" stroke=\"#15803D\" stroke-width=\"3\" stroke-linecap=\"round\"/>\n            <polygon points=\"595,42 607,48 595,54\" fill=\"#15803D\"/>\n            <rect x=\"8\" y=\"8\" width=\"252\" height=\"80\" rx=\"14\" fill=\"#FFF7ED\" stroke=\"#FDBA74\" stroke-width=\"2\"/>\n            <text x=\"134\" y=\"34\" text-anchor=\"middle\" fill=\"#9A3412\" font-size=\"13\" font-weight=\"800\">BƯỚC 1 · ĐỌC ĐẦU VÀO</text>\n            <text x=\"134\" y=\"56\" text-anchor=\"middle\" fill=\"#1E293B\" font-size=\"14\" font-weight=\"700\">Quét tệp dữ liệu tuần</text>\n            <text x=\"134\" y=\"76\" text-anchor=\"middle\" fill=\"#475569\" font-size=\"12\">Đọc sales_data.csv & sổ bàn giao</text>\n            <rect x=\"308\" y=\"8\" width=\"252\" height=\"80\" rx=\"14\" fill=\"#FEF3C7\" stroke=\"#F59E0B\" stroke-width=\"2\"/>\n            <text x=\"434\" y=\"34\" text-anchor=\"middle\" fill=\"#B45309\" font-size=\"13\" font-weight=\"800\">BƯỚC 2 · ĐỐI CHIẾU SKILL</text>\n            <text x=\"434\" y=\"56\" text-anchor=\"middle\" fill=\"#1E293B\" font-size=\"14\" font-weight=\"700\">Áp dụng chuẩn phân tích</text>\n            <text x=\"434\" y=\"76\" text-anchor=\"middle\" fill=\"#475569\" font-size=\"12\">Lọc các chỉ số lệch mục tiêu</text>\n            <rect x=\"608\" y=\"8\" width=\"244\" height=\"80\" rx=\"14\" fill=\"#DCFCE7\" stroke=\"#4ADE80\" stroke-width=\"2\"/>\n            <text x=\"730\" y=\"34\" text-anchor=\"middle\" fill=\"#166534\" font-size=\"13\" font-weight=\"800\">BƯỚC 3 · XUẤT SẢN PHẨM</text>\n            <text x=\"730\" y=\"56\" text-anchor=\"middle\" fill=\"#1E293B\" font-size=\"14\" font-weight=\"700\">Ghi tệp báo cáo & email</text>\n            <text x=\"730\" y=\"76\" text-anchor=\"middle\" fill=\"#15803D\" font-size=\"12\">Lưu bao_cao_giam_doc.md</text>\n          </svg>\n        </div>\n        \n    <div class=\"k-grid-3\">\n      \n        <div class=\"k-card k-step-item k-unreached\" id=\"s1_c1\" data-order=\"2\">\n          <div class=\"k-card-top-row\">\n            <span class=\"k-card-tag\" style=\"background:#FFF1E6; color:#C2410C; border:1px solid #FDBA74;\">TÊN TỆP LÀ TÊN LỆNH</span>\n            <span class=\"k-illus-badge\"><svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#EA580C\" stroke-width=\"2\"><rect x=\"3\" y=\"4\" width=\"18\" height=\"16\" rx=\"3\"/><path d=\"M8 10h8M8 14h5\"/></svg></span>\n          </div>\n          <h3>Cơ chế ánh xạ tự động 1-1</h3>\n          <p>Khi bạn lưu tệp tên là .agent/workflows/tong-hop-tuan.md, ngay lập tức trong khung chat xuất hiện lệnh /tong-hop-tuan.</p>\n          <div class=\"k-card-mini-note\">🔗 Đặt tên không dấu, nối bằng gạch ngang</div>\n        </div>\n        \n        <div class=\"k-card k-step-item k-unreached\" id=\"s1_c2\" data-order=\"3\">\n          <div class=\"k-card-top-row\">\n            <span class=\"k-card-tag\" style=\"background:#E0F2FE; color:#0369A1; border:1px solid #7DD3FC;\">BỐ CỤC RÕ RÀNG TỪNG BƯỚC</span>\n            <span class=\"k-illus-badge\"><svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#0284C7\" stroke-width=\"2\"><path d=\"M12 2L2 7l10 5 10-5-10-5z\"/><path d=\"M2 17l10 5 10-5M2 12l10 5 10-5\"/></svg></span>\n          </div>\n          <h3>Viết như sổ tay giao việc cho nhân viên</h3>\n          <p>Mỗi bước ghi rõ: Đọc tệp nào -> Xử lý theo tiêu chí gì -> Xuất ra tệp tên là gì -> Kiểm tra lại điều kiện nào trước khi báo cáo.</p>\n          <div class=\"k-card-mini-note\">📋 Càng rõ đầu vào/đầu ra, AI chạy càng chuẩn</div>\n        </div>\n        \n        <div class=\"k-card k-step-item k-unreached\" id=\"s1_c3\" data-order=\"4\">\n          <div class=\"k-card-top-row\">\n            <span class=\"k-card-tag\" style=\"background:#DCFCE7; color:#15803D; border:1px solid #86EFAC;\">CHIA SẺ CHO CẢ ĐỘI NGŨ</span>\n            <span class=\"k-illus-badge\"><svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#16A34A\" stroke-width=\"2\"><path d=\"M22 11.08V12a10 10 0 1 1-5.93-9.14\"/><polyline points=\"22 4 12 14.01 9 11.01\"/></svg></span>\n          </div>\n          <h3>Nhân bản năng suất cho toàn phòng ban</h3>\n          <p>Khi bạn gửi thư mục dự án cho đồng nghiệp, họ cũng có sẵn toàn bộ các lệnh /workflow của bạn để sử dụng ngay.</p>\n          <div class=\"k-card-mini-note\">🤝 Chuẩn hóa chất lượng đầu ra toàn công ty</div>\n        </div>\n        \n    </div>\n    <div class=\"k-callout k-step-item k-unreached\" id=\"s1_call\" data-order=\"5\">\n      <span>💡</span>\n      <div><strong>Dấu hiệu nhận biết:</strong> Kỹ năng (<code>Skill</code>) dạy AI <em>cách làm một nghiệp vụ</em>; Quy trình (<code>Workflow</code>) chỉ huy AI <em>thực hiện lần lượt Bước 1, Bước 2, Bước 3</em>.</div>\n    </div>"
  },
  "beats": [
    {
      "id": "b1",
      "label": "1. Tổng quan: Sơ đồ 4 bước đóng gói lệnh /workflow",
      "duration": 14.71,
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
      "caption": "Mỗi sáng thứ Hai, anh chị có những việc nào phải làm lặp đi lặp lại không? Trong <strong>Bài 11</strong>, sơ đồ trên màn hình chỉ ra cách đóng gói chuỗi việc đó thành một tệp trong <code>.agent/workflows/</code> để chỉ cần gõ một dấu gạch chéo là trợ lý tự chạy từ đầu đến cuối.",
      "audio_src": "audio/lesson_11/b1.mp3",
      "audio_duration": 14.06
    },
    {
      "id": "b2",
      "label": "2. Minh họa: Quan sát cấu trúc tệp workflow trong IDE",
      "duration": 11.93,
      "pose": 2,
      "mode": "sim",
      "pedagogy_type": "theory_type_2",
      "pedagogy_badge": "💡 Điểm cần lưu ý · Giải phẫu Tệp Workflow",
      "pedagogy_title": "Cấu trúc Đầu vào -> Các bước xử lý -> Đầu ra trong tệp .agent/workflows/",
      "pedagogy_note": "Mở tệp start-1-1.md để thấy cách viết từng bước Bước 1, Bước 2, Bước 3 bằng ngôn ngữ tiếng Việt tự nhiên.",
      "onEnter": "kudoHidePopovers(); switchToSurface('ide'); switchIdeSidebarMode('explorer'); setEditorMode('wysiwyg'); openFileInEditor('start-1-1.md');",
      "focus_selectors": [
        "#ide-file-tree",
        "#editor-canvas"
      ],
      "cursor_selector": "[data-file='start-1-1.md']",
      "cursor_label": "Mỗi tệp trong .agent/workflows/ là một kịch bản từng bước",
      "caption": "Nhìn vào cột giữa trên màn hình: Một tệp <code>workflow</code> thực chất không có mã lập trình phức tạp nào cả. Nó chỉ là một văn bản tiếng Việt chia rõ Bước 1 đọc tệp gì, Bước 2 phân tích sao và Bước 3 lưu kết quả vào đâu.",
      "audio_src": "audio/lesson_11/b2.mp3",
      "audio_duration": 11.28
    },
    {
      "id": "b3",
      "label": "3. Kỹ thuật: Cơ chế hiển thị lệnh mới trong bảng gạch chéo (/)",
      "duration": 11.05,
      "pose": 3,
      "mode": "sim",
      "pedagogy_type": "theory_type_2",
      "pedagogy_badge": "💡 Điểm cần lưu ý · Kích hoạt Lệnh Gạch chéo",
      "pedagogy_title": "Tệp vừa lưu trong .agent/workflows/ lập tức xuất hiện khi gõ dấu /",
      "pedagogy_note": "Không cần khởi động lại phần mềm: Lưu tệp xong là gõ dấu / gọi chạy được ngay.",
      "onEnter": "kudoHidePopovers(); switchToSurface('ide'); kudoOpenIdeSlashPopup();",
      "focus_selectors": [
        ".context-toolbar",
        "#ide-popup-menu",
        "#ide-chat-input"
      ],
      "cursor_selector": "#ide-popup-menu",
      "cursor_label": "Bảng lệnh gạch chéo tự động cập nhật theo thư mục workflows",
      "caption": "Ngay khi tệp quy trình được lưu vào thư mục <code>.agent/workflows/</code>, anh chị không cần khởi động lại phần mềm. Chỉ cần gõ dấu gạch chéo <code>/</code> ở ô chat là tên lệnh mới đã sẵn sàng để bấm chạy.",
      "audio_src": "audio/lesson_11/b3.mp3",
      "audio_duration": 10.4
    },
    {
      "id": "b4",
      "label": "4. Bước 1: Yêu cầu AI tạo workflow /tong-hop-tuan",
      "duration": 12.09,
      "pose": 4,
      "mode": "sim",
      "pedagogy_type": "practice_step",
      "pedagogy_badge": "👆 Thực hành Bước 1/3 · Khởi tạo Workflow mới",
      "pedagogy_title": "Đóng gói quy trình 3 bước tổng hợp doanh thu và soạn email sáng thứ Hai",
      "pedagogy_note": "Bước 1: Nhập yêu cầu vào ô chat để AI tự tạo tệp .agent/workflows/tong-hop-tuan.md.",
      "onEnter": "kudoSimScene({surface:'ide', file:'start-1-1.md', clearChat:true, chatInput:'Hãy tạo giúp tôi một quy trình tại .agent/workflows/tong-hop-tuan.md gồm 3 bước: (1) Đọc @sales_data.csv, (2) Áp dụng kỹ năng bao-cao-tuan, (3) Xuất tệp bao_cao_thu_hai.md'});",
      "focus_selectors": [
        "#ide-chat-input",
        "#ide-send-btn"
      ],
      "cursor_selector": "#ide-send-btn",
      "cursor_label": "Bước 1: Yêu cầu AI tạo tệp workflow tong-hop-tuan.md",
      "caption": "Chúng ta vào thực hành 3 bước đóng gói quy trình tự động. Ở <strong>Bước 1</strong>, anh chị gõ vào ô chat yêu cầu trợ lý tạo tệp <code>.agent/workflows/tong-hop-tuan.md</code> gồm 3 bước xử lý doanh thu sáng thứ Hai.",
      "audio_src": "audio/lesson_11/b4.mp3",
      "audio_duration": 11.44
    },
    {
      "id": "b5",
      "label": "5. Bước 2: Kiểm tra tệp workflow vừa tạo và gõ /tong-hop-tuan",
      "duration": 10.49,
      "pose": 5,
      "mode": "sim",
      "pedagogy_type": "practice_step",
      "pedagogy_badge": "👆 Thực hành Bước 2/3 · Gọi lệnh /tong-hop-tuan",
      "pedagogy_title": "Bước 2: Kiểm tra tệp kịch bản ở cột giữa và gõ /tong-hop-tuan vào ô chat",
      "pedagogy_note": "Tệp tong-hop-tuan.md đã sẵn sàng; giờ bạn chỉ cần gõ /tong-hop-tuan và bấm Gửi.",
      "onEnter": "kudoSimScene({surface:'ide', breadcrumb:'.agent › workflows › tong-hop-tuan.md', editorTitle:'⚡ .agent/workflows/tong-hop-tuan.md — Quy Trình Tự Động', editorHtml:'<div style=\"padding:16px;\"><h3 style=\"color:#9a3412;margin-top:0;\">WORKFLOW: /tong-hop-tuan</h3><ol><li><strong>Bước 1:</strong> Đọc dữ liệu mới nhất từ <code>@sales_data.csv</code>.</li><li><strong>Bước 2:</strong> Kích hoạt kỹ năng <code>bao-cao-tuan</code> và nội quy văn phòng.</li><li><strong>Bước 3:</strong> Xuất báo cáo hoàn chỉnh ra tệp <code>bao_cao_thu_hai.md</code>.</li></ol></div>', clearChat:true, chatInput:'/tong-hop-tuan'});",
      "focus_selectors": [
        "#editor-canvas",
        "#ide-chat-input",
        "#ide-send-btn"
      ],
      "cursor_selector": "#ide-send-btn",
      "cursor_label": "Bước 2: Gõ /tong-hop-tuan và nhấn Gửi (→)",
      "caption": "Sang <strong>Bước 2</strong>, sau khi tệp kịch bản <code>tong-hop-tuan.md</code> hiện lên ở cột giữa, anh chị chỉ cần gõ đúng một lệnh ngắn gọn <code>/tong-hop-tuan</code> vào ô chat và nhấn Gửi.",
      "audio_src": "audio/lesson_11/b5.mp3",
      "audio_duration": 9.84
    },
    {
      "id": "b6",
      "label": "6. Bước 3: Hoàn tất dây chuyền tự chạy 3 bước",
      "duration": 16.08,
      "pose": 6,
      "mode": "sim",
      "pedagogy_type": "practice_step",
      "pedagogy_badge": "✅ Thực hành Bước 3/3 · Kết quả hoàn thành",
      "pedagogy_title": "Bước 3: Kiểm tra kết quả tệp bao_cao_thu_hai.md được sinh ra tự động sau 1 lệnh",
      "pedagogy_note": "Chỉ 1 lệnh /tong-hop-tuan đã hoàn thành trọn gói 3 bước.",
      "onEnter": "kudoSimScene({surface:'ide', breadcrumb:'antigravity_course_vn › bao_cao_thu_hai.md (Sinh bởi /tong-hop-tuan)', editorTitle:'📄 bao_cao_thu_hai.md — Hoàn tất tự động 3/3 bước', editorHtml:'<div style=\"padding:16px;\"><h2 style=\"color:#15803d;margin-top:0;\">BÁO CÁO GIAO BAN SÁNG THỨ HAI — TASKFLOW INC.</h2><p><strong>Trạng thái quy trình:</strong> Đã chạy tự động Bước 1 (Đọc CSV) &rarr; Bước 2 (Áp dụng Skill) &rarr; Bước 3 (Xuất tệp).</p><p><strong>Điểm nhấn tuần qua:</strong> Khu vực miền Nam tăng trưởng 14%, đề xuất nhân rộng kịch bản chăm sóc khách hàng sang miền Bắc.</p></div>', userMsg:'/tong-hop-tuan', aiMsg:'Đã thực thi trọn gói quy trình <code>/tong-hop-tuan</code> qua 3 bước và lưu kết quả tại <code>bao_cao_thu_hai.md</code>!'});",
      "focus_selectors": [
        "#editor-canvas",
        "#ide-chat-messages"
      ],
      "cursor_selector": "#editor-canvas",
      "cursor_label": "Bước 3: Tệp bao_cao_thu_hai.md hoàn thành sau 1 nút bấm!",
      "caption": "Ở <strong>Bước 3</strong>, chỉ sau một cú nhấn <kbd>Enter</kbd>, trợ lý đã tự động chạy hết cả 3 bước và xuất ra tệp <code>bao_cao_thu_hai.md</code> hoàn chỉnh. Vậy với những dự án mới hoàn toàn chưa có quy trình sẵn thì sao? Chúng ta sang ngay <strong>Bài 12</strong> với bộ ba lệnh <code>/grill-me</code>, <code>/plan</code> và <code>/learn</code>.",
      "audio_src": "audio/lesson_11/b6.mp3",
      "audio_duration": 15.43
    }
  ]
};
