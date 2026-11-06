window.KUDO_SPEC = {
  "filename": "lesson_03.html",
  "legacy_alias": "lesson_04_vuot_qua_con_ngop_hoi_nguoc_ai.html",
  "code": "BÀI 3",
  "chapter_number": 1,
  "chapter_code": "CHƯƠNG 1",
  "chapter_title": "Khởi động Chuẩn & Làm chủ Giao diện",
  "title": "Làm chủ Giao diện 3 Cột, Phím Cứu hộ & Xử lý Khi AI Dừng chờ",
  "short_title": "Giao diện 3 Cột & Phím Cứu hộ",
  "pill_label": "Bài 3 · 3 Cột & Phím Cứu hộ",
  "description": "Hiểu rõ vai trò 3 cột của Antigravity IDE, 3 trạng thái khi AI dừng chờ (Stop, Tiếp tục, Accept), phím tắt cứu hộ Ctrl+B khôi phục cột trái và thói quen hỏi trực tiếp AI.",
  "prerequisites": "Bài 2 (Đã mở thành công thư mục dự án antigravity_course_vn trong Antigravity IDE).",
  "dependents": "Bài 4 (Thiết lập quyền tự chủ Turbo để không phải bấm Accept thủ công liên tục).",
  "placement_risk": "0% Rủi ro — Học viên nắm vững cách khôi phục giao diện và xử lý nút chờ trước khi bắt đầu giao việc tự động cho AI.",
  "continuity_bridge": "Khi đã biết nút Accept (Chấp nhận từng bước) ở Bài 3, học viên sẽ thấy ngay nhu cầu bật chế độ tự chủ Turbo ở Bài 4 để AI chạy liền mạch.",
  "slides": {
    "s1": "<div>\n      <div class=\"k-slide-header\">\n        <span class=\"k-slide-kicker\">CHƯƠNG 1 · BÀI 3</span>\n        <span class=\"k-slide-step\">Tổng quan &amp; Nguyên lý cốt lõi</span>\n      </div>\n      <div class=\"k-slide-h1\">Giải phẫu bàn làm việc 3 cột và 3 cách xử lý khi Trợ lý AI dừng chờ</div>\n      <div class=\"k-slide-sub\">Xóa bỏ hoàn toàn cảm giác bỡ ngỡ khi mới mở IDE nhờ bản đồ 3 vùng và nguyên tắc 'Bí ở đâu, hỏi AI ở đó'.</div>\n    </div>\n    \n        <div class=\"k-visual-hero-box k-layout-anatomy k-step-item k-hl\" id=\"s1_hero\" data-order=\"1\">\n          <div class=\"k-anat-left\">\n            <div class=\"k-viz-badge\">🧩 SƠ ĐỒ GIẢI PHẪU TRỰC QUAN</div>\n            <div class=\"k-anat-title\">Cấu trúc 3 ngăn chức năng trên bàn làm việc Antigravity IDE</div>\n            <div class=\"k-anat-pillars\">\n              <div class=\"k-anat-pill\"><strong>NGĂN 1 · EXPLORER (TRÁI):</strong> Tủ hồ sơ dự án (Bật/tắt nhanh bằng Ctrl + B)</div>\n              <div class=\"k-anat-pill\"><strong>NGĂN 2 · EDITOR (GIỮA):</strong> Bàn đọc & soạn tài liệu (Chế độ Preview trực quan)</div>\n              <div class=\"k-anat-pill\"><strong>NGĂN 3 · AGENT (PHẢI):</strong> Khung chat Trợ lý AI (Nhận lệnh & báo cáo tiến độ)</div>\n            </div>\n          </div>\n          <div style=\"display:flex; flex-direction:column; gap:6px; justify-content:space-between;\">\n            <svg viewBox=\"0 0 360 74\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" style=\"width:100%; height:auto; max-height:70px; background:#FFFFFF; border:1px solid #FED7AA; border-radius:8px; padding:3px;\">\n              <rect x=\"6\" y=\"6\" width=\"98\" height=\"62\" rx=\"6\" fill=\"#FFF7ED\" stroke=\"#FB923C\" stroke-width=\"1.5\"/>\n              <text x=\"55\" y=\"25\" text-anchor=\"middle\" fill=\"#9A3412\" font-size=\"10.5\" font-weight=\"800\">1. CỘT TRÁI</text>\n              <text x=\"55\" y=\"41\" text-anchor=\"middle\" fill=\"#334155\" font-size=\"9.5\" font-weight=\"700\">📁 Cây thư mục</text>\n              <text x=\"55\" y=\"56\" text-anchor=\"middle\" fill=\"#C2410C\" font-size=\"9\">Phím: Ctrl + B</text>\n              <rect x=\"110\" y=\"6\" width=\"132\" height=\"62\" rx=\"6\" fill=\"#EFF6FF\" stroke=\"#60A5FA\" stroke-width=\"1.5\"/>\n              <text x=\"176\" y=\"25\" text-anchor=\"middle\" fill=\"#1D4ED8\" font-size=\"10.5\" font-weight=\"800\">2. CỘT GIỮA (TAB)</text>\n              <text x=\"176\" y=\"41\" text-anchor=\"middle\" fill=\"#1E293B\" font-size=\"9.5\" font-weight=\"700\">📄 Chuột phải vào Tab</text>\n              <text x=\"176\" y=\"56\" text-anchor=\"middle\" fill=\"#0369A1\" font-size=\"9\">➔ Open Preview</text>\n              <rect x=\"248\" y=\"6\" width=\"106\" height=\"62\" rx=\"6\" fill=\"#F0FDF4\" stroke=\"#4ADE80\" stroke-width=\"1.5\"/>\n              <text x=\"301\" y=\"25\" text-anchor=\"middle\" fill=\"#15803D\" font-size=\"10.5\" font-weight=\"800\">3. CỘT PHẢI</text>\n              <text x=\"301\" y=\"41\" text-anchor=\"middle\" fill=\"#1E293B\" font-size=\"9.5\" font-weight=\"700\">🤖 Khung Chat AI</text>\n              <text x=\"301\" y=\"56\" text-anchor=\"middle\" fill=\"#166534\" font-size=\"9\">■ · Tiếp tục · Accept</text>\n            </svg>\n            <blockquote class=\"k-quote-box\">\n              <span class=\"k-quote-mark\">“</span>\n              <p>Bất cứ khi nào bạn lỡ tay bấm mất một khung cửa sổ hay quên phím tắt, người thầy giỏi nhất đang ngồi sẵn ở cột bên phải: Hãy gõ câu hỏi bằng tiếng Việt cho chính Trợ lý AI.</p>\n            </blockquote>\n          </div>\n        </div>\n        \n    <div class=\"k-grid-3\">\n      \n        <div class=\"k-card k-step-item k-unreached\" id=\"s1_c1\" data-order=\"2\">\n          <div class=\"k-card-top-row\">\n            <span class=\"k-card-tag\" style=\"background:#FFF1E6; color:#C2410C; border:1px solid #FDBA74;\">TÌNH HUỐNG 1 · AI ĐANG CHẠY</span>\n            <span class=\"k-illus-badge\"><svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#EA580C\" stroke-width=\"2\"><rect x=\"3\" y=\"4\" width=\"18\" height=\"16\" rx=\"3\"/><path d=\"M8 10h8M8 14h5\"/></svg></span>\n          </div>\n          <h3>Nút hình vuông ■ (Stop)</h3>\n          <p>Khi thấy biểu tượng hình vuông ở góc dưới khung chat, nghĩa là AI đang suy nghĩ hoặc viết bài. Bấm vào đó nếu muốn dừng khẩn cấp.</p>\n          <div class=\"k-card-mini-note\">⏹️ Chủ động dừng khi thấy AI đi lệch hướng</div>\n        </div>\n        \n        <div class=\"k-card k-step-item k-unreached\" id=\"s1_c2\" data-order=\"3\">\n          <div class=\"k-card-top-row\">\n            <span class=\"k-card-tag\" style=\"background:#E0F2FE; color:#0369A1; border:1px solid #7DD3FC;\">TÌNH HUỐNG 2 · AI NGẮT QUÃNG</span>\n            <span class=\"k-illus-badge\"><svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#0284C7\" stroke-width=\"2\"><path d=\"M12 2L2 7l10 5 10-5-10-5z\"/><path d=\"M2 17l10 5 10-5M2 12l10 5 10-5\"/></svg></span>\n          </div>\n          <h3>Gõ 'Tiếp tục' khi mạng chập chờn</h3>\n          <p>Nếu báo cáo dài khiến AI dừng giữa chừng chưa viết hết câu, bạn chỉ cần gõ chữ 'Tiếp tục' rồi nhấn Enter.</p>\n          <div class=\"k-card-mini-note\">▶️ Nối tiếp ngay từ dòng đang viết dở</div>\n        </div>\n        \n        <div class=\"k-card k-step-item k-unreached\" id=\"s1_c3\" data-order=\"4\">\n          <div class=\"k-card-top-row\">\n            <span class=\"k-card-tag\" style=\"background:#DCFCE7; color:#15803D; border:1px solid #86EFAC;\">TÌNH HUỐNG 3 · CHỜ XÁC NHẬN</span>\n            <span class=\"k-illus-badge\"><svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#16A34A\" stroke-width=\"2\"><path d=\"M22 11.08V12a10 10 0 1 1-5.93-9.14\"/><polyline points=\"22 4 12 14.01 9 11.01\"/></svg></span>\n          </div>\n          <h3>Bấm nút Accept (Chấp nhận)</h3>\n          <p>Ở chế độ mặc định, khi AI muốn tạo tệp mới hoặc chạy lệnh, nó sẽ hiện nút Accept màu xanh chờ bạn duyệt.</p>\n          <div class=\"k-card-mini-note\">✅ Bước đệm trước khi học chế độ Turbo ở Bài 4</div>\n        </div>\n        \n    </div>\n    <div class=\"k-callout k-step-item k-unreached\" id=\"s1_call\" data-order=\"5\">\n      <span>💡</span>\n      <div><strong>Mẹo cứu hộ số 1:</strong> Lỡ tay làm ẩn mất cột cây thư mục bên trái? Chỉ cần nhấn tổ hợp phím <kbd>Ctrl + B</kbd> để bật lại ngay lập tức.</div>\n    </div>"
  },
  "beats": [
    {
      "id": "b1",
      "label": "1. Tổng quan: Giải phẫu 3 cột & 3 trạng thái AI dừng chờ",
      "duration": 14.67,
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
      "caption": "Khi đã mở thư mục dự án trong <strong>Antigravity IDE</strong>, anh chị chỉ cần nhìn nó như một bàn làm việc gồm 3 ngăn: Ngăn trái đựng hồ sơ, ngăn giữa để đọc tài liệu, và ngăn phải là trợ lý AI. Đồng thời, hãy nhớ 3 cách xử lý khi thấy AI dừng lại chờ lệnh.",
      "audio_src": "audio/lesson_03/b1.mp3",
      "audio_duration": 14.02
    },
    {
      "id": "b2",
      "label": "2. Minh họa: Nhận diện nút Stop (■), Tiếp tục và Accept",
      "duration": 11.85,
      "pose": 2,
      "mode": "sim",
      "pedagogy_type": "theory_type_2",
      "pedagogy_badge": "💡 Điểm cần lưu ý · 3 Trạng thái Điều khiển AI",
      "pedagogy_title": "Quan sát trực tiếp nút Accept, ô gõ Tiếp tục và nút ■ trên khung chat",
      "pedagogy_note": "Nút Accept màu xanh dùng để duyệt bước tạo tệp; nút ■ dùng để dừng; ô nhập gõ 'Tiếp tục' khi AI ngắt quãng.",
      "onEnter": "kudoRunThreeStuckStatesDemo();",
      "focus_selectors": [
        "#ide-chat-messages",
        "#kudo-accept-step-btn",
        "#ide-send-btn"
      ],
      "cursor_selector": "#kudo-accept-step-btn",
      "cursor_label": "Bấm Accept để duyệt bước tạo tệp mới",
      "caption": "Nhìn sang cột phải trên màn hình thực tế: Khi trợ lý muốn tạo tệp báo cáo mới, nó sẽ dừng lại và hiện nút <strong>Accept</strong> màu xanh. Nếu muốn hủy giữa chừng, anh chị bấm nút hình vuông <code>■</code>, còn nếu mạng ngắt quãng thì gõ chữ <code>Tiếp tục</code>.",
      "audio_src": "audio/lesson_03/b2.mp3",
      "audio_duration": 11.2
    },
    {
      "id": "b3",
      "label": "3. Kỹ thuật: Khôi phục nhanh cột trái bằng phím Ctrl + B",
      "duration": 10.57,
      "pose": 3,
      "mode": "sim",
      "pedagogy_type": "theory_type_2",
      "pedagogy_badge": "💡 Điểm cần lưu ý · Phím tắt Cứu hộ Giao diện",
      "pedagogy_title": "Bật/tắt nhanh cột cây thư mục Explorer bằng tổ hợp phím Ctrl + B",
      "pedagogy_note": "Khi cần mở rộng không gian đọc tài liệu hoặc lỡ tay bấm ẩn cột trái, nhấn Ctrl + B hoặc bấm biểu tượng 2 tệp giấy.",
      "onEnter": "kudoHidePopovers(); switchToSurface('ide'); switchIdeSidebarMode('explorer'); openFileInEditor('0.1_Introduction.md'); kudoShowKeyHud('Nhấn <kbd>Ctrl + B</kbd> để Bật / Tắt nhanh cột cây thư mục bên trái');",
      "focus_selectors": [
        "#act-btn-explorer",
        "#ide-left-sidebar"
      ],
      "cursor_selector": "#act-btn-explorer",
      "cursor_label": "Biểu tượng Explorer (Phím tắt: Ctrl + B)",
      "caption": "Rất nhiều anh chị khi đang làm việc vô tình bấm vào biểu tượng hai tệp giấy ở ngoài cùng bên trái khiến cột cây thư mục biến mất. Để lấy lại ngay lập tức, anh chị chỉ cần nhấn tổ hợp phím <kbd>Ctrl + B</kbd>.",
      "audio_src": "audio/lesson_03/b3.mp3",
      "audio_duration": 9.92
    },
    {
      "id": "b4",
      "label": "4. Bước 1: Bật chế độ đọc Preview trực quan",
      "duration": 12.17,
      "pose": 4,
      "mode": "sim",
      "pedagogy_type": "practice_step",
      "pedagogy_badge": "👆 Thực hành Bước 1/3 · Chế độ đọc",
      "pedagogy_title": "Tài liệu đang hiển thị mã thô khó đọc, cần chuyển sang chế độ văn bản đẹp",
      "pedagogy_note": "Bước 1: Nhìn lên góc trên bên phải của cột giữa và bấm nút 👁️ Preview / Office Viewer.",
      "onEnter": "kudoHidePopovers(); switchToSurface('ide'); openFileInEditor('0.1_Introduction.md'); setEditorMode('wysiwyg');",
      "focus_selectors": [
        "#ide-tabs-bar",
        "#pill-wysiwyg",
        "#office-toolbar"
      ],
      "cursor_selector": "#pill-wysiwyg",
      "cursor_label": "Bước 1: Bấm nút Preview / Office Viewer",
      "caption": "Chúng ta vào thực hành 3 bước làm chủ giao diện. Giả sử tài liệu ở cột giữa đang hiện nhiều ký hiệu thô, ở <strong>Bước 1</strong>, anh chị bấm vào nút <strong>Preview / Office Viewer</strong> ở góc trên cột giữa để chuyển về giao diện trang giấy quen thuộc.",
      "audio_src": "audio/lesson_03/b4.mp3",
      "audio_duration": 11.52
    },
    {
      "id": "b5",
      "label": "5. Bước 2: Gõ câu hỏi tiếng Việt vào khung chat khi quên thao tác",
      "duration": 8.41,
      "pose": 5,
      "mode": "sim",
      "pedagogy_type": "practice_step",
      "pedagogy_badge": "👆 Thực hành Bước 2/3 · Hỏi trực tiếp Trợ lý AI",
      "pedagogy_title": "Bước 2: Nhập câu hỏi bằng tiếng Việt vào ô chat phải rồi bấm Gửi (→)",
      "pedagogy_note": "Khi quên phím tắt mở lại cột trái hoặc chế độ xem đẹp, hãy gõ câu hỏi vào ô nhập tin nhắn ở cột phải và nhấn Gửi.",
      "onEnter": "kudoSimScene({surface:'ide', file:'0.1_Introduction.md', clearChat:true, chatInput:'Tôi lỡ tay bấm tắt mất cột cây thư mục bên trái, làm sao để mở lại nhanh và xem tệp Markdown cho dễ đọc?'});",
      "focus_selectors": [
        "#ide-chat-input",
        "#ide-send-btn"
      ],
      "cursor_selector": "#ide-send-btn",
      "cursor_label": "Bước 2: Nhập câu hỏi vào ô chat và bấm Gửi (→)",
      "caption": "Sang <strong>Bước 2</strong>, khi quên bất kỳ thao tác nào trên phần mềm, anh chị hãy gõ câu hỏi bằng tiếng Việt vào ô nhập ở đáy cột phải rồi bấm nút Gửi.",
      "audio_src": "audio/lesson_03/b5.mp3",
      "audio_duration": 7.76
    },
    {
      "id": "b6",
      "label": "6. Bước 3: Hoàn tất chỉ dẫn của AI & Chuẩn bị bật Turbo",
      "duration": 14.01,
      "pose": 6,
      "mode": "sim",
      "pedagogy_type": "practice_step",
      "pedagogy_badge": "✅ Thực hành Bước 3/3 · Kết quả hoàn thành",
      "pedagogy_title": "Bước 3: Nhận hướng dẫn chi tiết tại chỗ từ Trợ lý AI",
      "pedagogy_note": "AI chỉ dẫn ngay phím Ctrl+B và nút Preview.",
      "onEnter": "kudoRunAskAiWhenStuckDemo();",
      "focus_selectors": [
        "#ide-chat-messages",
        "#editor-canvas"
      ],
      "cursor_selector": "[data-file='1.1_Welcome.md']",
      "cursor_label": "Bước 3: AI giải đáp ngay lập tức tại cột phải!",
      "caption": "Ở <strong>Bước 3</strong>, trợ lý AI lập tức chỉ dẫn rõ phím tắt <kbd>Ctrl + B</kbd> và nút <strong>Preview</strong> ngay trong khung chat. Vậy làm sao để trợ lý tự động thực thi trơn tru mà không bắt chúng ta bấm nút <strong>Accept</strong> ở từng bước nhỏ? Chúng ta sang ngay <strong>Bài 4</strong>.",
      "audio_src": "audio/lesson_03/b6.mp3",
      "audio_duration": 13.36
    }
  ]
};
