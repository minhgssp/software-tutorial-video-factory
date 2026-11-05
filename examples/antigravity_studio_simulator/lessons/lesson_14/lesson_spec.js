window.KUDO_SPEC = {
  "filename": "lesson_14.html",
  "legacy_alias": "",
  "code": "BÀI 14",
  "chapter_number": 4,
  "chapter_code": "CHƯƠNG 4",
  "chapter_title": "Xử lý Dữ liệu, Bảng tính & Phối hợp Đội nhóm",
  "title": "Phân tích Bảng tính CSV, Làm sạch Dữ liệu & Trích xuất Insight Kinh doanh",
  "short_title": "Phân tích CSV & Insight Kinh doanh",
  "pill_label": "Bài 14 · Phân tích Bảng tính CSV",
  "description": "Biến bảng dữ liệu thô .csv nhiều lỗi định dạng thành bảng số liệu sạch sẽ và báo cáo phân tích doanh thu theo khu vực, sản phẩm, nhân sự mà không cần nhớ các hàm Excel phức tạp.",
  "prerequisites": "Bài 5 (Biết mở xem tệp .csv bằng Office Viewer) & Bài 13 (Kỹ thuật bóc tách hồ sơ có dẫn nguồn).",
  "dependents": "Bài 15 (Phối hợp phân tích dữ liệu & nghiên cứu thị trường), Bài 16 (Đồng bộ báo cáo doanh thu bao_cao_doanh_thu_q1.md lên GitHub/Drive).",
  "placement_risk": "0% Rủi ro — Học viên thao tác trực tiếp trên tệp sales_data.csv có sẵn trong bộ học liệu và xuất ra tệp bao_cao_doanh_thu_q1.md dùng xuyên suốt tới Bài 16.",
  "continuity_bridge": "Sau khi phân tích thành công một bảng dữ liệu ở Bài 14, Bài 15 sẽ hướng dẫn cách gọi nhiều trợ lý con (Sub-Agents) chạy song song khi có hàng loạt bảng dữ liệu và báo cáo cần xử lý cùng lúc.",
  "slides": {
    "s1": "<div>\n      <div class=\"k-slide-header\">\n        <span class=\"k-slide-kicker\">CHƯƠNG 4 · BÀI 14 · LÝ THUYẾT KIỂU 1 ( NGUYÊN LÝ &amp; TRỰC QUAN )</span>\n        <span class=\"k-slide-step\">Bố cục COMPARISON · Nhịp 1/6</span>\n      </div>\n      <div class=\"k-slide-h1\">Từ bảng số liệu thô đến quyết định kinh doanh: Làm sạch, Nhóm gộp và Tìm điểm bất thường</div>\n      <div class=\"k-slide-sub\">Không cần nhớ hàm VLOOKUP hay Pivot Table phức tạp: Chỉ cần mô tả câu hỏi quản trị bằng tiếng Việt rõ ràng.</div>\n    </div>\n    \n        <div class=\"k-visual-hero-box k-layout-comparison\">\n          <div class=\"k-cmp-col k-cmp-before\">\n            <div class=\"k-cmp-badge-old\">❌ CÁCH LÀM CŨ · THỦ CÔNG RỜI RẠC</div>\n            <div class=\"k-cmp-main\">1. LÀM SẠCH (CLEANING) — Phát hiện dòng trùng & ô trống</div>\n            <div class=\"k-cmp-sub\">Chuẩn hóa tên khu vực & ngày tháng</div>\n          </div>\n          <div class=\"k-cmp-arrow\">➔</div>\n          <div class=\"k-cmp-col k-cmp-after\">\n            <div class=\"k-cmp-badge-new\">✅ CÁCH LÀM MỚI · TRỢ LÝ AI TRONG THƯ MỤC</div>\n            <div class=\"k-cmp-main\">3. KHUYẾN NGHỊ (INSIGHT) — Chỉ ra nguyên nhân tăng/giảm</div>\n            <div class=\"k-cmp-sub\">Đề xuất hành động cụ thể cho Quý tới</div>\n          </div>\n          <blockquote class=\"k-quote-box\">\n            <span class=\"k-quote-mark\">“</span>\n            <p>Con số tự nó không biết nói. Giá trị của người quản lý nằm ở chỗ biến bảng dữ liệu ngàn dòng thành 3 phát hiện cốt lõi giúp ban giám đốc ra quyết định ngay trong cuộc họp.</p>\n          </blockquote>\n        </div>\n        \n    <div class=\"k-grid-3\">\n      \n        <div class=\"k-card k-step-item k-hl\" id=\"s1_c1\" data-order=\"1\">\n          <div class=\"k-card-top-row\">\n            <span class=\"k-card-tag\" style=\"background:#FFF1E6; color:#C2410C; border:1px solid #FDBA74;\">BƯỚC 1 · KIỂM TOÁN DỮ LIỆU ĐẦU VÀO</span>\n            <span class=\"k-illus-badge\"><svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#EA580C\" stroke-width=\"2\"><rect x=\"3\" y=\"4\" width=\"18\" height=\"16\" rx=\"3\"/><path d=\"M8 10h8M8 14h5\"/></svg></span>\n          </div>\n          <h3>Loại bỏ rác trước khi tính toán</h3>\n          <p>Luôn yêu cầu AI kiểm tra xem bảng .csv có dòng nào bị lặp hai lần, có cột tiền tệ nào bị lệch đơn vị hay thiếu giá trị không.</p>\n          <div class=\"k-card-mini-note\">🧹 Dữ liệu sạch thì kết quả tổng hợp mới chuẩn</div>\n        </div>\n        \n        <div class=\"k-card k-step-item k-hl\" id=\"s1_c2\" data-order=\"2\">\n          <div class=\"k-card-top-row\">\n            <span class=\"k-card-tag\" style=\"background:#E0F2FE; color:#0369A1; border:1px solid #7DD3FC;\">BƯỚC 2 · ĐẶT CÂU HỎI ĐA CHIỀU</span>\n            <span class=\"k-illus-badge\"><svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#0284C7\" stroke-width=\"2\"><path d=\"M12 2L2 7l10 5 10-5-10-5z\"/><path d=\"M2 17l10 5 10-5M2 12l10 5 10-5\"/></svg></span>\n          </div>\n          <h3>So sánh theo Khu vực, Gói sản phẩm và Thời gian</h3>\n          <p>Yêu cầu AI lập bảng so sánh doanh thu và tỷ lệ rời bỏ (Churn) giữa các nhóm khách hàng để tìm ra nhóm hiệu quả nhất.</p>\n          <div class=\"k-card-mini-note\">📊 Tự động xuất bảng Markdown rõ nét</div>\n        </div>\n        \n        <div class=\"k-card k-step-item k-hl\" id=\"s1_c3\" data-order=\"3\">\n          <div class=\"k-card-top-row\">\n            <span class=\"k-card-tag\" style=\"background:#DCFCE7; color:#15803D; border:1px solid #86EFAC;\">BƯỚC 3 · GẮN CON SỐ VỚI HÀNH ĐỘNG</span>\n            <span class=\"k-illus-badge\"><svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#16A34A\" stroke-width=\"2\"><path d=\"M22 11.08V12a10 10 0 1 1-5.93-9.14\"/><polyline points=\"22 4 12 14.01 9 11.01\"/></svg></span>\n          </div>\n          <h3>Mỗi bảng số liệu đi kèm 3 khuyến nghị</h3>\n          <p>Không chỉ dừng ở bảng tổng hợp: Yêu cầu AI đối chiếu với mục tiêu tại @COMPANY.md để đề xuất giải pháp thực tế.</p>\n          <div class=\"k-card-mini-note\">💡 Lưu thành tệp bao_cao_doanh_thu_q1.md</div>\n        </div>\n        \n    </div>\n    <div class=\"k-callout k-step-item k-hl\" id=\"s1_call\" data-order=\"4\">\n      <span>💡</span>\n      <div><strong>Lưu ý kiểm chứng:</strong> Luôn yêu cầu AI liệt kê rõ công thức cộng tổng các dòng để bạn kiểm tra chéo trong 5 giây.</div>\n    </div>"
  },
  "beats": [
    {
      "id": "b1",
      "label": "1. [Lý thuyết Kiểu 1] Quy trình 3 bước Làm sạch, Nhóm gộp & Tìm Insight",
      "duration": 14.75,
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
      "caption": "Trong <strong>Bài 14</strong>, chúng ta biến trợ lý AI thành chuyên viên phân tích dữ liệu kinh doanh. Thay vì phải vật lộn với các hàm bảng tính phức tạp, quy trình 3 bước trên màn hình giúp anh chị làm sạch bảng <code>.csv</code>, nhóm gộp theo từng khu vực và rút ra khuyến nghị hành động ngay lập tức.",
      "audio_src": "audio/lesson_14/b1.mp3",
      "audio_duration": 14.1
    },
    {
      "id": "b2",
      "label": "2. [Lý thuyết Kiểu 2] Quan sát bảng dữ liệu gốc sales_data.csv trong IDE",
      "duration": 13.69,
      "pose": 2,
      "mode": "sim",
      "pedagogy_type": "theory_type_2",
      "pedagogy_badge": "📘 Lý thuyết Kiểu 2 · Khảo sát Bảng Dữ liệu Gốc",
      "pedagogy_title": "Đọc cấu trúc các cột của tệp sales_data.csv bằng Office Viewer",
      "pedagogy_note": "Quan sát các cột: Tháng, Khu vực, Gói sản phẩm (Enterprise/SMB), Doanh thu và Tỷ lệ rời bỏ (Churn Rate).",
      "onEnter": "kudoHidePopovers(); switchToSurface('ide'); switchIdeSidebarMode('explorer'); setEditorMode('wysiwyg'); openFileInEditor('sales_data.csv');",
      "focus_selectors": [
        "#ide-file-tree",
        "#editor-canvas"
      ],
      "cursor_selector": "[data-file='sales_data.csv']",
      "cursor_label": "Bảng dữ liệu gốc sales_data.csv tại cột giữa",
      "caption": "Nhìn vào bảng <code>sales_data.csv</code> đang mở ở cột giữa: Chúng ta có đầy đủ các cột từ Tháng, Khu vực, Gói dịch vụ cho tới Doanh thu và Tỷ lệ rời bỏ. Việc của chúng ta là giao cho trợ lý kiểm tra độ sạch và tính toán bảng tổng hợp.",
      "audio_src": "audio/lesson_14/b2.mp3",
      "audio_duration": 13.04
    },
    {
      "id": "b3",
      "label": "3. [Lý thuyết Kiểu 2] Cách viết câu lệnh phân tích số liệu không sai sót",
      "duration": 11.37,
      "pose": 3,
      "mode": "sim",
      "pedagogy_type": "theory_type_2",
      "pedagogy_badge": "📘 Lý thuyết Kiểu 2 · Kỹ thuật Giao việc Phân tích Số liệu",
      "pedagogy_title": "Yêu cầu AI hiển thị cả Bảng tổng hợp lẫn Dòng kiểm tra tổng cộng (Total Check)",
      "pedagogy_note": "Bí quyết để AI tính toán chính xác là yêu cầu trình bày từng dòng thành phần trước khi ghi dòng Tổng cộng ở cuối bảng.",
      "onEnter": "kudoSimScene({surface:'ide', file:'sales_data.csv', clearChat:true, chatInput:'@sales_data.csv @COMPANY.md Hãy: (1) Kiểm tra dữ liệu trùng/thiếu, (2) Lập bảng tổng hợp doanh thu Quý 1 theo Gói sản phẩm kèm dòng Tổng cộng đối chiếu, (3) Đề xuất 3 hành động cho Quý 2 vào tệp bao_cao_doanh_thu_q1.md'});",
      "focus_selectors": [
        "#ide-chat-input",
        "#editor-canvas"
      ],
      "cursor_selector": "#ide-chat-input",
      "cursor_label": "Câu lệnh chuẩn gồm 3 yêu cầu: Làm sạch -> Lập bảng -> Đề xuất",
      "caption": "Khi viết câu lệnh phân tích ở cột phải, anh chị hãy chia rõ làm 3 ý nhỏ: Một là kiểm tra dữ liệu lỗi, hai là lập bảng có dòng tổng cộng để đối chiếu, và ba là đề xuất hành động cụ thể dựa trên mục tiêu công ty.",
      "audio_src": "audio/lesson_14/b3.mp3",
      "audio_duration": 10.72
    },
    {
      "id": "b4",
      "label": "4. [Thực hành B1/3] Bối cảnh & Mở kiểm tra bảng sales_data.csv",
      "duration": 8.25,
      "pose": 4,
      "mode": "sim",
      "pedagogy_type": "practice_step",
      "pedagogy_badge": "🛠️ Thực hành Bước 1/3 · Bối cảnh & Mở bảng CSV",
      "pedagogy_title": "Bối cảnh: Tổng kết doanh thu Quý 1 và tìm nguyên nhân khách hàng rời bỏ",
      "pedagogy_note": "Bước 1: Bấm chọn tệp sales_data.csv trên cây thư mục để hiển thị bảng số liệu ở cột giữa.",
      "onEnter": "kudoHidePopovers(); switchToSurface('ide'); switchIdeSidebarMode('explorer'); openFileInEditor('sales_data.csv');",
      "focus_selectors": [
        "#ide-file-tree",
        "#editor-canvas"
      ],
      "cursor_selector": "[data-file='sales_data.csv']",
      "cursor_label": "Bước 1: Mở bảng dữ liệu sales_data.csv",
      "caption": "Chúng ta bắt đầu thực hành 3 bước phân tích dữ liệu Quý 1. Ở <strong>Bước 1</strong>, anh chị bấm mở tệp <code>sales_data.csv</code> trên cây thư mục bên trái.",
      "audio_src": "audio/lesson_14/b4.mp3",
      "audio_duration": 7.6
    },
    {
      "id": "b5",
      "label": "5. [Thực hành B2/3] Gửi lệnh phân tích kết hợp @sales_data.csv và @COMPANY.md",
      "duration": 11.69,
      "pose": 5,
      "mode": "sim",
      "pedagogy_type": "practice_step",
      "pedagogy_badge": "🛠️ Thực hành Bước 2/3 · Chạy Phân tích Đa chiều",
      "pedagogy_title": "Bước 2: Nhập lệnh phân tích @sales_data.csv đối chiếu với @COMPANY.md",
      "pedagogy_note": "Yêu cầu xuất kết quả ra tệp bao_cao_doanh_thu_q1.md để chuẩn bị đồng bộ cho đội nhóm ở các bài sau.",
      "onEnter": "kudoSimScene({surface:'ide', file:'sales_data.csv', clearChat:true, chatInput:'@sales_data.csv @COMPANY.md Hãy làm sạch dữ liệu, lập bảng tổng hợp doanh thu Quý 1 theo phân khúc và lưu báo cáo phân tích vào tệp bao_cao_doanh_thu_q1.md'});",
      "focus_selectors": [
        "#ide-chat-input",
        "#ide-send-btn"
      ],
      "cursor_selector": "#ide-send-btn",
      "cursor_label": "Bước 2: Nhấn Gửi để AI phân tích và xuất báo cáo",
      "caption": "Sang <strong>Bước 2</strong>, anh chị đính kèm <code>@sales_data.csv</code> và <code>@COMPANY.md</code> vào ô chat, yêu cầu xuất báo cáo ra tệp <code>bao_cao_doanh_thu_q1.md</code> rồi bấm nút Gửi.",
      "audio_src": "audio/lesson_14/b5.mp3",
      "audio_duration": 11.04
    },
    {
      "id": "b6",
      "label": "6. [Thực hành B3/3] Nghiệm thu bao_cao_doanh_thu_q1.md & Sang Bài 15",
      "duration": 14.39,
      "pose": 6,
      "mode": "sim",
      "pedagogy_type": "practice_step",
      "pedagogy_badge": "🛠️ Thực hành Bước 3/3 · Nghiệm thu & Tiếp nối",
      "pedagogy_title": "Bước 3: Nghiệm thu bảng tổng hợp và 3 phát hiện kinh doanh tại bao_cao_doanh_thu_q1.md",
      "pedagogy_note": "Nghiệm thu: Tệp bao_cao_doanh_thu_q1.md đã hoàn thành chuẩn xác. Tiếp theo: Bài 15 điều phối nhiều Sub-Agents chạy song song.",
      "onEnter": "kudoSimScene({surface:'ide', breadcrumb:'antigravity_course_vn › bao_cao_doanh_thu_q1.md (Báo cáo Phân tích CSV)', editorTitle:'📊 bao_cao_doanh_thu_q1.md — Báo Cáo Phân Tích Doanh Thu Quý 1', editorHtml:'<div style=\"padding:16px;\"><h2 style=\"color:#9a3412;margin-top:0;\">BÁO CÁO PHÂN TÍCH DOANH THU QUÝ 1 — TASKFLOW INC.</h2><p><strong>1. Kiểm toán dữ liệu:</strong> 100% dòng dữ liệu hợp lệ, không có bản ghi trùng lặp.</p><table style=\"width:100%;border-collapse:collapse;font-size:13px;margin-bottom:12px;\"><tr style=\"background:#ffedd5;\"><th style=\"padding:7px;border:1px solid #fed7aa;text-align:left;\">Phân khúc</th><th style=\"padding:7px;border:1px solid #fed7aa;text-align:right;\">Doanh thu Q1 (VNĐ)</th><th style=\"padding:7px;border:1px solid #fed7aa;text-align:right;\">Tỷ trọng</th><th style=\"padding:7px;border:1px solid #fed7aa;text-align:right;\">Tỷ lệ rời bỏ (Churn)</th></tr><tr><td style=\"padding:7px;border:1px solid #fed7aa;\">Doanh nghiệp lớn (Enterprise)</td><td style=\"padding:7px;border:1px solid #fed7aa;text-align:right;\">1.260.000.000</td><td style=\"padding:7px;border:1px solid #fed7aa;text-align:right;\">68,1%</td><td style=\"padding:7px;border:1px solid #fed7aa;text-align:right;\">1,8%</td></tr><tr><td style=\"padding:7px;border:1px solid #fed7aa;\">Doanh nghiệp vừa &amp; nhỏ (SMB)</td><td style=\"padding:7px;border:1px solid #fed7aa;text-align:right;\">590.000.000</td><td style=\"padding:7px;border:1px solid #fed7aa;text-align:right;\">31,9%</td><td style=\"padding:7px;border:1px solid #fed7aa;text-align:right;\">6,2%</td></tr><tr style=\"font-weight:700;background:#fff7ed;\"><td style=\"padding:7px;border:1px solid #fed7aa;\">TỔNG CỘNG QUÝ 1</td><td style=\"padding:7px;border:1px solid #fed7aa;text-align:right;\">1.850.000.000</td><td style=\"padding:7px;border:1px solid #fed7aa;text-align:right;\">100,0%</td><td style=\"padding:7px;border:1px solid #fed7aa;text-align:right;\">TB: 4,0%</td></tr></table><p><strong>2. Phát hiện cốt lõi:</strong> Nhóm Enterprise mang lại 68,1% doanh thu với tỷ lệ rời bỏ rất thấp (1,8%), trong khi nhóm SMB rời bỏ cao ở tuần đầu do chưa quen giao diện.</p></div>', userMsg:'@sales_data.csv @COMPANY.md Hãy làm sạch dữ liệu, lập bảng tổng hợp doanh thu Quý 1 và lưu vào bao_cao_doanh_thu_q1.md', aiMsg:'Đã hoàn tất phân tích <code>@sales_data.csv</code> và xuất báo cáo tại <code>bao_cao_doanh_thu_q1.md</code>!'});",
      "focus_selectors": [
        "#editor-canvas",
        "#ide-chat-messages"
      ],
      "cursor_selector": "#editor-canvas",
      "cursor_label": "Bước 3: Nghiệm thu tệp bao_cao_doanh_thu_q1.md",
      "caption": "Ở <strong>Bước 3</strong>, tệp <code>bao_cao_doanh_thu_q1.md</code> đã hiện ra với bảng số liệu tổng hợp rõ ràng và chỉ ra ngay nguyên nhân khách hàng nhỏ rời bỏ ở tuần đầu tiên. Tiếp theo, ở <strong>Bài 15</strong>, chúng ta sẽ học cách điều phối nhiều trợ lý AI chạy song song cùng lúc!",
      "audio_src": "audio/lesson_14/b6.mp3",
      "audio_duration": 13.74
    }
  ]
};
