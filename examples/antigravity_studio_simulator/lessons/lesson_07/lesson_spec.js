window.KUDO_SPEC = {
  "filename": "lesson_07.html",
  "legacy_alias": "",
  "code": "BÀI 7",
  "chapter_number": 2,
  "chapter_code": "CHƯƠNG 2",
  "chapter_title": "Định dạng Dữ liệu, Ký hiệu @ & Hồ sơ Cá nhân hóa",
  "title": "Xây dựng Hồ sơ Cá nhân hóa @troly.md Để AI Nhớ Phong cách Của Bạn",
  "short_title": "Hồ sơ Cá nhân hóa @troly.md",
  "pill_label": "Bài 7 · Hồ sơ @troly.md",
  "description": "Thiết lập tệp hồ sơ cá nhân @troly.md chứa thông tin vai trò, phong cách hành văn, đối tượng độc giả và các từ cấm kỵ để Trợ lý AI luôn viết đúng ý bạn mà không cần nhắc lại.",
  "prerequisites": "Bài 5 (Biết soạn thảo tệp .md) & Bài 6 (Biết dùng ký hiệu @ để đính kèm tệp vào câu lệnh).",
  "dependents": "Bài 8 (Kết hợp @troly.md khi lập sổ bàn giao), Bài 9 (Nâng cấp từ @troly.md lên .agent/rules/ tự động).",
  "placement_risk": "0% Rủi ro — Học viên bắt đầu cá nhân hóa AI bằng một tệp @troly.md đơn giản ngoài thư mục gốc trước khi bước vào kiến trúc .agent/ ở Chương 3.",
  "continuity_bridge": "Sau khi có hồ sơ cá nhân @troly.md ở Bài 7, Bài 8 sẽ hướng dẫn cách tạo Sổ bàn giao công việc (Hồ sơ gốc của dự án) để AI không bao giờ quên tiến độ dự án qua các ngày làm việc.",
  "slides": {
    "s1": "<div>\n      <div class=\"k-slide-header\">\n        <span class=\"k-slide-kicker\">CHƯƠNG 2 · BÀI 7</span>\n        <span class=\"k-slide-step\">Tổng quan &amp; Nguyên lý cốt lõi</span>\n      </div>\n      <div class=\"k-slide-h1\">Hồ sơ cá nhân hóa @troly.md: Tấm danh thiếp giúp AI hiểu bạn ngay từ giây đầu tiên</div>\n      <div class=\"k-slide-sub\">Chấm dứt cảnh mỗi lần mở khung chat mới lại phải giới thiệu lại mình là ai, làm chức vụ gì, thích văn phong thế nào.</div>\n    </div>\n    \n        <div class=\"k-visual-hero-box k-layout-anatomy k-step-item k-hl\" id=\"s1_hero\" data-order=\"1\">\n          <div class=\"k-anat-left\">\n            <div class=\"k-viz-badge\">🧩 SƠ ĐỒ GIẢI PHẪU TRỰC QUAN</div>\n            <div class=\"k-anat-title\">Cấu trúc 4 phần cốt lõi bên trong tệp hồ sơ cá nhân @troly.md</div>\n            <div class=\"k-anat-pillars\">\n              <div class=\"k-anat-pill\"><strong>1. VAI TRÒ & ĐƠN VỊ:</strong> Bạn là ai & phục vụ ai? (VD: Trưởng phòng vận hành TaskFlow)</div>\n              <div class=\"k-anat-pill\"><strong>2. VĂN PHONG & BỐ CỤC:</strong> Ngắn gọn hay chi tiết? (Câu đầu luôn là kết luận, ưu tiên bảng)</div>\n              <div class=\"k-anat-pill\"><strong>3. ĐIỀU CẤM KỴ (TABOO):</strong> Những thứ cấm AI viết (Cấm sáo rỗng, cấm bịa số liệu %)</div>\n            </div>\n          </div>\n          <div style=\"display:flex; flex-direction:column; gap:6px; justify-content:space-between;\">\n            <svg viewBox=\"0 0 360 74\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" style=\"width:100%; height:auto; max-height:70px; background:#FFFFFF; border:1px solid #FED7AA; border-radius:8px; padding:3px;\">\n              <rect x=\"6\" y=\"6\" width=\"98\" height=\"62\" rx=\"6\" fill=\"#FFF7ED\" stroke=\"#FB923C\" stroke-width=\"1.5\"/>\n              <text x=\"55\" y=\"25\" text-anchor=\"middle\" fill=\"#9A3412\" font-size=\"10.5\" font-weight=\"800\">1. CỘT TRÁI</text>\n              <text x=\"55\" y=\"41\" text-anchor=\"middle\" fill=\"#334155\" font-size=\"9.5\" font-weight=\"700\">📁 Cây thư mục</text>\n              <text x=\"55\" y=\"56\" text-anchor=\"middle\" fill=\"#C2410C\" font-size=\"9\">Phím: Ctrl + B</text>\n              <rect x=\"110\" y=\"6\" width=\"132\" height=\"62\" rx=\"6\" fill=\"#EFF6FF\" stroke=\"#60A5FA\" stroke-width=\"1.5\"/>\n              <text x=\"176\" y=\"25\" text-anchor=\"middle\" fill=\"#1D4ED8\" font-size=\"10.5\" font-weight=\"800\">2. CỘT GIỮA (TAB)</text>\n              <text x=\"176\" y=\"41\" text-anchor=\"middle\" fill=\"#1E293B\" font-size=\"9.5\" font-weight=\"700\">📄 Chuột phải vào Tab</text>\n              <text x=\"176\" y=\"56\" text-anchor=\"middle\" fill=\"#0369A1\" font-size=\"9\">➔ Open Preview</text>\n              <rect x=\"248\" y=\"6\" width=\"106\" height=\"62\" rx=\"6\" fill=\"#F0FDF4\" stroke=\"#4ADE80\" stroke-width=\"1.5\"/>\n              <text x=\"301\" y=\"25\" text-anchor=\"middle\" fill=\"#15803D\" font-size=\"10.5\" font-weight=\"800\">3. CỘT PHẢI</text>\n              <text x=\"301\" y=\"41\" text-anchor=\"middle\" fill=\"#1E293B\" font-size=\"9.5\" font-weight=\"700\">🤖 Khung Chat AI</text>\n              <text x=\"301\" y=\"56\" text-anchor=\"middle\" fill=\"#166534\" font-size=\"9\">■ · Tiếp tục · Accept</text>\n            </svg>\n            <blockquote class=\"k-quote-box\">\n              <span class=\"k-quote-mark\">“</span>\n              <p>Một trợ lý con người mới nhận việc luôn cần 1 bản mô tả thói quen của sếp. Tệp @troly.md chính là tờ hướng dẫn đó dành cho Trợ lý AI của bạn.</p>\n            </blockquote>\n          </div>\n        </div>\n        \n    <div class=\"k-grid-3\">\n      \n        <div class=\"k-card k-step-item k-unreached\" id=\"s1_c1\" data-order=\"2\">\n          <div class=\"k-card-top-row\">\n            <span class=\"k-card-tag\" style=\"background:#FFF1E6; color:#C2410C; border:1px solid #FDBA74;\">KHỐI 1 · HỒ SƠ CHỦ NHÂN</span>\n            <span class=\"k-illus-badge\"><svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#EA580C\" stroke-width=\"2\"><rect x=\"3\" y=\"4\" width=\"18\" height=\"16\" rx=\"3\"/><path d=\"M8 10h8M8 14h5\"/></svg></span>\n          </div>\n          <h3>Xác lập vị trí và bối cảnh công việc</h3>\n          <p>Ghi rõ chức danh, phòng ban, lĩnh vực hoạt động và đối tượng thường xuyên nhận báo cáo của bạn (Ban Giám đốc, Khách hàng).</p>\n          <div class=\"k-card-mini-note\">👤 AI tự động điều chỉnh xưng hô và tầm nhìn</div>\n        </div>\n        \n        <div class=\"k-card k-step-item k-unreached\" id=\"s1_c2\" data-order=\"3\">\n          <div class=\"k-card-top-row\">\n            <span class=\"k-card-tag\" style=\"background:#E0F2FE; color:#0369A1; border:1px solid #7DD3FC;\">KHỐI 2 · GU THẨM MỸ VĂN BẢN</span>\n            <span class=\"k-illus-badge\"><svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#0284C7\" stroke-width=\"2\"><path d=\"M12 2L2 7l10 5 10-5-10-5z\"/><path d=\"M2 17l10 5 10-5M2 12l10 5 10-5\"/></svg></span>\n          </div>\n          <h3>Định hình cấu trúc trình bày mặc định</h3>\n          <p>Quy định rõ: Luôn mở đầu bằng tóm tắt 3 dòng, dùng bảng đối chiếu thay vì viết tràn lan, dùng thuật ngữ tiếng Việt tự nhiên.</p>\n          <div class=\"k-card-mini-note\">✍️ Văn bản đầu ra mang đậm dấu ấn cá nhân</div>\n        </div>\n        \n        <div class=\"k-card k-step-item k-unreached\" id=\"s1_c3\" data-order=\"4\">\n          <div class=\"k-card-top-row\">\n            <span class=\"k-card-tag\" style=\"background:#DCFCE7; color:#15803D; border:1px solid #86EFAC;\">KHỐI 3 · DANH SÁCH TỪ CẤM</span>\n            <span class=\"k-illus-badge\"><svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#16A34A\" stroke-width=\"2\"><path d=\"M22 11.08V12a10 10 0 1 1-5.93-9.14\"/><polyline points=\"22 4 12 14.01 9 11.01\"/></svg></span>\n          </div>\n          <h3>Loại bỏ hoàn toàn văn phong máy móc</h3>\n          <p>Liệt kê các từ sáo rỗng bạn ghét (như 'Trong kỷ nguyên số hiện nay...') để AI tuyệt đối tránh xa khi soạn thảo.</p>\n          <div class=\"k-card-mini-note\">🚫 Tiết kiệm thời gian biên tập lại câu chữ</div>\n        </div>\n        \n    </div>\n    <div class=\"k-callout k-step-item k-unreached\" id=\"s1_call\" data-order=\"5\">\n      <span>💡</span>\n      <div><strong>Mẹo ứng dụng ngay:</strong> Chỉ cần gõ <code>@troly.md Hãy viết email...</code>, Trợ lý AI sẽ lập tức nạp toàn bộ sở thích của bạn vào bài viết.</div>\n    </div>"
  },
  "beats": [
    {
      "id": "b1",
      "label": "1. Tổng quan: Cấu trúc 4 phần của hồ sơ @troly.md",
      "duration": 13.69,
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
      "caption": "Tại sao nhiều người dùng AI thấy câu chữ cứ chung chung, máy móc? Vì trợ lý chưa biết bạn là ai! Trong <strong>Bài 7</strong>, chúng ta thiết lập tệp hồ sơ cá nhân <code>@troly.md</code> gồm 3 khối: Vai trò chủ nhân, Gu văn phong và Danh sách từ cấm kỵ.",
      "audio_src": "audio/lesson_07/b1.mp3",
      "audio_duration": 13.04
    },
    {
      "id": "b2",
      "label": "2. Minh họa: Quan sát nội dung tệp @troly.md trong IDE",
      "duration": 10.17,
      "pose": 2,
      "mode": "sim",
      "pedagogy_type": "theory_type_2",
      "pedagogy_badge": "💡 Điểm cần lưu ý · Giải phẫu tệp @troly.md",
      "pedagogy_title": "Cách trình bày tệp @troly.md rõ ràng bằng các tiêu đề Markdown",
      "pedagogy_note": "Mở tệp troly.md ở cột giữa để xem cách khai báo Thông tin chủ nhân, Nguyên tắc trình bày và Điều cấm kỵ.",
      "onEnter": "kudoHidePopovers(); switchToSurface('ide'); switchIdeSidebarMode('explorer'); setEditorMode('wysiwyg'); openFileInEditor('troly.md');",
      "focus_selectors": [
        "#ide-file-tree",
        "#editor-canvas"
      ],
      "cursor_selector": "[data-file='troly.md']",
      "cursor_label": "Tệp hồ sơ cá nhân hóa troly.md",
      "caption": "Nhìn vào tệp <code>troly.md</code> đang mở ở cột giữa trên màn hình: Anh chị không cần viết dài, chỉ cần gạch đầu dòng rõ chức vụ, đối tượng đọc báo cáo và quy tắc <em>luôn đưa kết luận lên câu đầu tiên</em>.",
      "audio_src": "audio/lesson_07/b2.mp3",
      "audio_duration": 9.52
    },
    {
      "id": "b3",
      "label": "3. Kỹ thuật: Sự khác biệt khi giao việc có đính kèm @troly.md",
      "duration": 12.01,
      "pose": 3,
      "mode": "sim",
      "pedagogy_type": "theory_type_2",
      "pedagogy_badge": "💡 Điểm cần lưu ý · Kích hoạt Hồ sơ Cá nhân",
      "pedagogy_title": "Đính kèm @troly.md cùng tài liệu công việc trong một câu lệnh",
      "pedagogy_note": "Khi gõ '@troly.md @COMPANY.md', AI sẽ lấy dữ liệu từ COMPANY.md nhưng trình bày theo đúng phong cách của troly.md.",
      "onEnter": "kudoSimScene({surface:'ide', file:'troly.md', clearChat:true, chatInput:'@troly.md @COMPANY.md Hãy soạn thông báo nội bộ gửi 45 nhân sự về mục tiêu Quý 2 theo đúng văn phong của tôi.'});",
      "focus_selectors": [
        "#ide-chat-input",
        "#editor-canvas"
      ],
      "cursor_selector": "#ide-chat-input",
      "cursor_label": "Kết hợp @troly.md + @COMPANY.md trong ô lệnh",
      "caption": "Khi giao việc ở cột phải, anh chị chỉ cần gõ <code>@troly.md</code> đi kèm với tệp dữ liệu như <code>@COMPANY.md</code>. Trợ lý sẽ lấy số liệu từ công ty nhưng viết ra bằng đúng giọng văn của riêng anh chị.",
      "audio_src": "audio/lesson_07/b3.mp3",
      "audio_duration": 11.36
    },
    {
      "id": "b4",
      "label": "4. Bước 1: Cập nhật thông tin vào troly.md",
      "duration": 9.93,
      "pose": 4,
      "mode": "sim",
      "pedagogy_type": "practice_step",
      "pedagogy_badge": "👆 Thực hành Bước 1/3 · Mở tệp",
      "pedagogy_title": "Chuẩn hóa hồ sơ cá nhân để viết thông báo điều hành Quý 2",
      "pedagogy_note": "Bước 1: Bấm chọn tệp troly.md ở cột cây thư mục bên trái để kiểm tra các nguyên tắc văn phong cá nhân.",
      "onEnter": "kudoHidePopovers(); switchToSurface('ide'); switchIdeSidebarMode('explorer'); openFileInEditor('troly.md');",
      "focus_selectors": [
        "#ide-file-tree",
        "#editor-canvas"
      ],
      "cursor_selector": "[data-file='troly.md']",
      "cursor_label": "Bước 1: Mở và kiểm tra tệp troly.md",
      "caption": "Chúng ta vào thực hành 3 bước cá nhân hóa trợ lý. Ở <strong>Bước 1</strong>, anh chị bấm mở tệp <code>troly.md</code> ở cột trái và điền chức danh cùng nguyên tắc trình bày ngắn gọn của mình vào.",
      "audio_src": "audio/lesson_07/b4.mp3",
      "audio_duration": 9.28
    },
    {
      "id": "b5",
      "label": "5. Bước 2: Gõ lệnh kết hợp @troly.md và @COMPANY.md",
      "duration": 9.93,
      "pose": 5,
      "mode": "sim",
      "pedagogy_type": "practice_step",
      "pedagogy_badge": "👆 Thực hành Bước 2/3 · Đính kèm @troly.md",
      "pedagogy_title": "Bước 2: Nhập lệnh kèm @troly.md và @COMPANY.md rồi nhấn Gửi",
      "pedagogy_note": "Yêu cầu AI xuất bản thông báo ra tệp mới thong_bao_q2.md tuân thủ nghiêm ngặt quy tắc trong @troly.md.",
      "onEnter": "kudoSimScene({surface:'ide', file:'troly.md', clearChat:true, chatInput:'@troly.md @COMPANY.md Hãy viết thông báo mục tiêu Quý 2 gửi toàn công ty và lưu thành tệp thong_bao_q2.md'});",
      "focus_selectors": [
        "#ide-chat-input",
        "#ide-send-btn"
      ],
      "cursor_selector": "#ide-send-btn",
      "cursor_label": "Bước 2: Gửi lệnh kèm @troly.md",
      "caption": "Sang <strong>Bước 2</strong>, tại ô chat bên phải, anh chị đính kèm <code>@troly.md</code> cùng <code>@COMPANY.md</code>, yêu cầu soạn thông báo Quý 2 rồi nhấn nút Gửi.",
      "audio_src": "audio/lesson_07/b5.mp3",
      "audio_duration": 9.28
    },
    {
      "id": "b6",
      "label": "6. Bước 3: Hoàn tất văn bản chuẩn gu",
      "duration": 13.69,
      "pose": 6,
      "mode": "sim",
      "pedagogy_type": "practice_step",
      "pedagogy_badge": "✅ Thực hành Bước 3/3 · Kết quả hoàn thành",
      "pedagogy_title": "Bước 3: Kiểm tra kết quả tệp thong_bao_q2.md đúng chuẩn văn phong cá nhân",
      "pedagogy_note": "Tệp thong_bao_q2.md mở đầu bằng Kết luận 3 dòng, có bảng phân công rõ ràng, 0% từ sáo rỗng.",
      "onEnter": "kudoSimScene({surface:'ide', activeTreeFile:'troly.md', breadcrumb:'antigravity_course_vn › thong_bao_q2.md (Mới tạo)', editorTitle:'📄 thong_bao_q2.md — Đã áp dụng chuẩn văn phong @troly.md', editorHtml:'<div style=\"padding:16px;\"><h2 style=\"color:#9a3412;margin-top:0;\">THÔNG BÁO ĐIỀU HÀNH QUÝ 2 — TASKFLOW INC.</h2><div style=\"background:#fff7ed;border-left:4px solid #ea580c;padding:10px 14px;margin-bottom:12px;\"><strong>KẾT LUẬN TRỰC DIỆN:</strong> Quý 2 tập trung giảm 30% tỷ lệ rời bỏ khách hàng (Churn Rate) và hoàn tất cổng tự phục vụ trước ngày 15/05.</div><table style=\"width:100%;border-collapse:collapse;font-size:13px;\"><tr style=\"background:#ffedd5;\"><th style=\"padding:8px;border:1px solid #fed7aa;text-align:left;\">Bộ phận</th><th style=\"padding:8px;border:1px solid #fed7aa;text-align:left;\">Mục tiêu trọng tâm</th><th style=\"padding:8px;border:1px solid #fed7aa;text-align:left;\">Hạn chót</th></tr><tr><td style=\"padding:8px;border:1px solid #fed7aa;\">Sản phẩm (Product)</td><td style=\"padding:8px;border:1px solid #fed7aa;\">Ra mắt Onboarding Checklist tự động</td><td style=\"padding:8px;border:1px solid #fed7aa;\">30/04</td></tr><tr><td style=\"padding:8px;border:1px solid #fed7aa;\">Chăm sóc KH (CS)</td><td style=\"padding:8px;border:1px solid #fed7aa;\">Gọi thăm khám 100% tài khoản doanh nghiệp</td><td style=\"padding:8px;border:1px solid #fed7aa;\">15/05</td></tr></table></div>', userMsg:'@troly.md @COMPANY.md Hãy viết thông báo mục tiêu Quý 2 gửi toàn công ty và lưu thành tệp thong_bao_q2.md', aiMsg:'Đã đối chiếu <code>@troly.md</code> và <code>@COMPANY.md</code>. Tôi đã tạo tệp <code>thong_bao_q2.md</code> mở đầu bằng Kết luận trực diện và trình bày dạng bảng đúng gu của bạn!'});",
      "focus_selectors": [
        "#editor-canvas",
        "#ide-chat-messages"
      ],
      "cursor_selector": "#editor-canvas",
      "cursor_label": "Bước 3: Tệp thong_bao_q2.md chuẩn văn phong @troly.md",
      "caption": "Ở <strong>Bước 3</strong>, anh chị nhìn vào cột giữa: Tệp <code>thong_bao_q2.md</code> vừa được tạo ra có ngay phần Kết luận trực diện ở đầu và bảng phân công gọn gàng, không hề có một chữ sáo rỗng nào! Sang <strong>Bài 8</strong>, chúng ta sẽ học cách giữ trí nhớ dài hạn cho dự án.",
      "audio_src": "audio/lesson_07/b6.mp3",
      "audio_duration": 13.04
    }
  ]
};
