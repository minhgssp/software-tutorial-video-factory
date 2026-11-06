window.KUDO_SPEC = {
  "filename": "lesson_09.html",
  "legacy_alias": "lesson_03_nghiem_thu_file_va_kien_truc_agent.html",
  "code": "BÀI 9",
  "chapter_number": 3,
  "chapter_code": "CHƯƠNG 3",
  "chapter_title": "Thiết kế Bộ não .agent & Tự động hóa Quy trình",
  "title": "Tư duy Quản trị Đầu ra & Kiến trúc Bộ não .agent (Rules, Skills, Workflows)",
  "short_title": "Kiến trúc .agent: Rules, Skills, Workflows",
  "pill_label": "Bài 9 · Kiến trúc Bộ não .agent",
  "description": "Chuyển dịch từ thói quen chỉ đọc câu trả lời trên khung chat sang nghiệm thu tệp sản phẩm thật trên ổ cứng; hiểu rõ ẩn dụ 'Căn bếp Nhà hàng' cho 3 ngăn Rules, Skills và Workflows trong thư mục .agent.",
  "prerequisites": "Chương 2 (Đã hiểu cách hoạt động của tệp @troly.md và lệnh gạch chéo /start-1-1).",
  "dependents": "Bài 10 (Thiết kế Rules & Skills), Bài 11 (Đóng gói Workflows), Bài 12 (Bộ 3 lệnh /grill-me, /plan, /learn).",
  "placement_risk": "0% Rủi ro — Học viên đã tự tay dùng @troly.md và /start-1-1 ở Chương 1-2 nên khi mở thư mục .agent ở Bài 9 sẽ hiểu ngay mối liên hệ thực tế.",
  "continuity_bridge": "Sau khi nắm được bức tranh tổng thể 3 ngăn của thư mục .agent ở Bài 9, Bài 10 sẽ hướng dẫn chi tiết cách viết Nội quy tự động (Rules) và Sổ tay kỹ năng (Skills).",
  "slides": {
    "s1": "<div>\n      <div class=\"k-slide-header\">\n        <span class=\"k-slide-kicker\">CHƯƠNG 3 · BÀI 9</span>\n        <span class=\"k-slide-step\">Tổng quan &amp; Nguyên lý cốt lõi</span>\n      </div>\n      <div class=\"k-slide-h1\">Ẩn dụ Căn bếp Nhà hàng: Giải mã 3 ngăn Rules, Skills và Workflows trong thư mục .agent</div>\n      <div class=\"k-slide-sub\">Nâng cấp từ việc nhắc nhở AI thủ công sang một hệ thống tự động tuân thủ nội quy, kỹ năng và quy trình chuẩn.</div>\n    </div>\n    \n        <div class=\"k-visual-hero-box k-layout-anatomy k-step-item k-hl\" id=\"s1_hero\" data-order=\"1\">\n          <div class=\"k-anat-left\">\n            <div class=\"k-viz-badge\">🧩 SƠ ĐỒ GIẢI PHẪU TRỰC QUAN</div>\n            <div class=\"k-anat-title\">Sơ đồ 3 ngăn điều khiển bên trong thư mục .agent của dự án</div>\n            <div class=\"k-anat-pillars\">\n              <div class=\"k-anat-pill\"><strong>1. RULES (NỘI QUY BẾP):</strong> Luôn tự động áp dụng 100% (Văn phong, bảo mật, điều cấm)</div>\n              <div class=\"k-anat-pill\"><strong>2. SKILLS (CÔNG THỨC MÓN):</strong> Cần món nào mở công thức đó (Mẫu báo cáo, chuẩn trình bày)</div>\n              <div class=\"k-anat-pill\"><strong>3. WORKFLOWS (THỰC ĐƠN /):</strong> Gõ /tên-lệnh để chạy trọn gói (Chuỗi bước tự động từ A đến Z)</div>\n            </div>\n          </div>\n          <div style=\"display:flex; flex-direction:column; gap:6px; justify-content:space-between;\">\n            <svg viewBox=\"0 0 360 74\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" style=\"width:100%; height:auto; max-height:70px; background:#FFFFFF; border:1px solid #FED7AA; border-radius:8px; padding:3px;\">\n              <rect x=\"6\" y=\"6\" width=\"98\" height=\"62\" rx=\"6\" fill=\"#FFF7ED\" stroke=\"#FB923C\" stroke-width=\"1.5\"/>\n              <text x=\"55\" y=\"25\" text-anchor=\"middle\" fill=\"#9A3412\" font-size=\"10.5\" font-weight=\"800\">1. CỘT TRÁI</text>\n              <text x=\"55\" y=\"41\" text-anchor=\"middle\" fill=\"#334155\" font-size=\"9.5\" font-weight=\"700\">📁 Cây thư mục</text>\n              <text x=\"55\" y=\"56\" text-anchor=\"middle\" fill=\"#C2410C\" font-size=\"9\">Phím: Ctrl + B</text>\n              <rect x=\"110\" y=\"6\" width=\"132\" height=\"62\" rx=\"6\" fill=\"#EFF6FF\" stroke=\"#60A5FA\" stroke-width=\"1.5\"/>\n              <text x=\"176\" y=\"25\" text-anchor=\"middle\" fill=\"#1D4ED8\" font-size=\"10.5\" font-weight=\"800\">2. CỘT GIỮA (TAB)</text>\n              <text x=\"176\" y=\"41\" text-anchor=\"middle\" fill=\"#1E293B\" font-size=\"9.5\" font-weight=\"700\">📄 Chuột phải vào Tab</text>\n              <text x=\"176\" y=\"56\" text-anchor=\"middle\" fill=\"#0369A1\" font-size=\"9\">➔ Open Preview</text>\n              <rect x=\"248\" y=\"6\" width=\"106\" height=\"62\" rx=\"6\" fill=\"#F0FDF4\" stroke=\"#4ADE80\" stroke-width=\"1.5\"/>\n              <text x=\"301\" y=\"25\" text-anchor=\"middle\" fill=\"#15803D\" font-size=\"10.5\" font-weight=\"800\">3. CỘT PHẢI</text>\n              <text x=\"301\" y=\"41\" text-anchor=\"middle\" fill=\"#1E293B\" font-size=\"9.5\" font-weight=\"700\">🤖 Khung Chat AI</text>\n              <text x=\"301\" y=\"56\" text-anchor=\"middle\" fill=\"#166534\" font-size=\"9\">■ · Tiếp tục · Accept</text>\n            </svg>\n            <blockquote class=\"k-quote-box\">\n              <span class=\"k-quote-mark\">“</span>\n              <p>Người mới dùng AI nhìn vào khung chat để đọc câu trả lời. Người quản lý chuyên nghiệp nhìn vào cây thư mục bên trái để nghiệm thu tệp sản phẩm hoàn chỉnh do bộ não .agent tạo ra.</p>\n            </blockquote>\n          </div>\n        </div>\n        \n    <div class=\"k-grid-3\">\n      \n        <div class=\"k-card k-step-item k-unreached\" id=\"s1_c1\" data-order=\"2\">\n          <div class=\"k-card-top-row\">\n            <span class=\"k-card-tag\" style=\"background:#FFF1E6; color:#C2410C; border:1px solid #FDBA74;\">NGĂN 1 · .AGENT/RULES/</span>\n            <span class=\"k-illus-badge\"><svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#EA580C\" stroke-width=\"2\"><rect x=\"3\" y=\"4\" width=\"18\" height=\"16\" rx=\"3\"/><path d=\"M8 10h8M8 14h5\"/></svg></span>\n          </div>\n          <h3>Nội quy tự động không cần gõ @</h3>\n          <p>Nâng cấp từ tệp @troly.md: Mọi quy tắc đặt trong thư mục rules/ sẽ được AI tự động đọc ngầm trong 100% câu lệnh.</p>\n          <div class=\"k-card-mini-note\">📏 Luôn giữ đúng kỷ luật mà không cần nhắc</div>\n        </div>\n        \n        <div class=\"k-card k-step-item k-unreached\" id=\"s1_c2\" data-order=\"3\">\n          <div class=\"k-card-top-row\">\n            <span class=\"k-card-tag\" style=\"background:#E0F2FE; color:#0369A1; border:1px solid #7DD3FC;\">NGĂN 2 · .AGENT/SKILLS/</span>\n            <span class=\"k-illus-badge\"><svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#0284C7\" stroke-width=\"2\"><path d=\"M12 2L2 7l10 5 10-5-10-5z\"/><path d=\"M2 17l10 5 10-5M2 12l10 5 10-5\"/></svg></span>\n          </div>\n          <h3>Thư viện chuyên môn sâu theo đầu việc</h3>\n          <p>Chứa các hướng dẫn nghiệp vụ chuyên biệt (như kỹ năng phân tích tài chính, kỹ năng viết email) chỉ nạp khi đúng việc.</p>\n          <div class=\"k-card-mini-note\">🧠 Giữ cho bộ nhớ AI luôn nhẹ và sắc bén</div>\n        </div>\n        \n        <div class=\"k-card k-step-item k-unreached\" id=\"s1_c3\" data-order=\"4\">\n          <div class=\"k-card-top-row\">\n            <span class=\"k-card-tag\" style=\"background:#DCFCE7; color:#15803D; border:1px solid #86EFAC;\">NGĂN 3 · .AGENT/WORKFLOWS/</span>\n            <span class=\"k-illus-badge\"><svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#16A34A\" stroke-width=\"2\"><path d=\"M22 11.08V12a10 10 0 1 1-5.93-9.14\"/><polyline points=\"22 4 12 14.01 9 11.01\"/></svg></span>\n          </div>\n          <h3>Nút bấm tự động hóa bằng dấu gạch chéo /</h3>\n          <p>Biến quy trình 5-7 bước lặp đi lặp lại hàng tuần thành một lệnh gạch chéo duy nhất (như /start-1-1 hay /plan).</p>\n          <div class=\"k-card-mini-note\">⚡ Gõ 1 lệnh ngắn, chạy cả dây chuyền</div>\n        </div>\n        \n    </div>\n    <div class=\"k-callout k-step-item k-unreached\" id=\"s1_call\" data-order=\"5\">\n      <span>💡</span>\n      <div><strong>Tiêu chuẩn Nghiệm thu Chương 3:</strong> Mọi yêu cầu công việc phải kết thúc bằng một tệp sản phẩm cụ thể trên ổ cứng máy tính.</div>\n    </div>"
  },
  "beats": [
    {
      "id": "b1",
      "label": "1. Tổng quan: Ẩn dụ Căn bếp: Rules, Skills và Workflows",
      "duration": 14.8,
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
      "caption": "Chào mừng anh chị đến với <strong>Chương 3</strong> — trái tim của khóa học. Hãy hình dung thư mục <code>.agent</code> giống như một căn bếp nhà hàng 5 sao gồm 3 ngăn: <strong>Rules</strong> là nội quy vệ sinh luôn phải tuân thủ, <strong>Skills</strong> là sổ công thức nấu từng món, và <strong>Workflows</strong> là thực đơn bấm nút chạy tự động.",
      "audio_src": "audio/lesson_09/b1.mp3",
      "audio_duration": 14.15
    },
    {
      "id": "b2",
      "label": "2. Minh họa: Đối chiếu khung chat và tệp sản phẩm đầu ra",
      "duration": 11.53,
      "pose": 2,
      "mode": "sim",
      "pedagogy_type": "theory_type_2",
      "pedagogy_badge": "💡 Điểm cần lưu ý · Nghiệm thu Tệp Đầu ra",
      "pedagogy_title": "Khung chat phải chỉ là nơi giao việc; Cột giữa mới là bàn nghiệm thu sản phẩm",
      "pedagogy_note": "Khi AI báo đã hoàn thành, hãy bấm vào tệp mới sinh ra ở cây thư mục trái để kiểm tra chất lượng thực tế.",
      "onEnter": "kudoHidePopovers(); switchToSurface('ide'); switchIdeSidebarMode('explorer'); setEditorMode('wysiwyg'); openFileInEditor('1.2_QuickStart.md');",
      "focus_selectors": [
        "#ide-file-tree",
        "#editor-canvas",
        "#ide-chat-messages"
      ],
      "cursor_selector": "#editor-canvas",
      "cursor_label": "Nghiệm thu sản phẩm trực tiếp tại cột giữa",
      "caption": "Trên màn hình làm việc thực tế, anh chị cần thay đổi một thói quen cốt lõi: Khung chat bên phải chỉ là nơi trao đổi ngắn gọn, còn sản phẩm cuối cùng bắt buộc phải xuất thành tệp trong cây thư mục và hiển thị ở cột giữa để nghiệm thu.",
      "audio_src": "audio/lesson_09/b2.mp3",
      "audio_duration": 10.88
    },
    {
      "id": "b3",
      "label": "3. Kỹ thuật: Khám phá thư mục .agent trên cây Explorer",
      "duration": 11.13,
      "pose": 3,
      "mode": "sim",
      "pedagogy_type": "theory_type_2",
      "pedagogy_badge": "💡 Điểm cần lưu ý · Cấu trúc Thư mục .agent",
      "pedagogy_title": "Quan sát 3 thư mục con rules/, skills/, workflows/ bên trong .agent",
      "pedagogy_note": "Mỗi tệp .md bên trong .agent/workflows/ chính là một lệnh gạch chéo / hiển thị khi bạn gõ trong khung chat.",
      "onEnter": "kudoHidePopovers(); switchToSurface('ide'); switchIdeSidebarMode('explorer'); openFileInEditor('start-1-1.md');",
      "focus_selectors": [
        "#ide-file-tree",
        "#editor-canvas"
      ],
      "cursor_selector": "[data-file='start-1-1.md']",
      "cursor_label": "Tệp .agent/workflows/start-1-1.md tạo ra lệnh /start-1-1",
      "caption": "Nhìn sang cột cây thư mục bên trái, ngay dưới dòng <code>.agent</code>, anh chị sẽ thấy tệp <code>start-1-1.md</code>. Chính tệp văn bản này đã tạo ra lệnh <code>/start-1-1</code> mà anh chị bấm chạy ở cuối Chương 1!",
      "audio_src": "audio/lesson_09/b3.mp3",
      "audio_duration": 10.48
    },
    {
      "id": "b4",
      "label": "4. Bước 1: Mở kiểm tra tệp workflow mẫu",
      "duration": 9.69,
      "pose": 4,
      "mode": "sim",
      "pedagogy_type": "practice_step",
      "pedagogy_badge": "👆 Thực hành Bước 1/3 · Khảo sát .agent",
      "pedagogy_title": "Tìm hiểu cách khóa học đóng gói quy trình tự động trong .agent",
      "pedagogy_note": "Bước 1: Tại cột cây thư mục bên trái, bấm mở tệp start-1-1.md bên trong nhánh .agent/workflows.",
      "onEnter": "kudoHidePopovers(); switchToSurface('ide'); switchIdeSidebarMode('explorer'); openFileInEditor('start-1-1.md'); setEditorMode('raw');",
      "focus_selectors": [
        "#ide-file-tree",
        "#editor-canvas"
      ],
      "cursor_selector": "[data-file='start-1-1.md']",
      "cursor_label": "Bước 1: Mở tệp start-1-1.md trong .agent",
      "caption": "Chúng ta vào thực hành 3 bước khám phá bộ não <code>.agent</code>. Ở <strong>Bước 1</strong>, anh chị nhìn sang cột trái và bấm mở tệp <code>start-1-1.md</code> để xem bên trong một quy trình tự động viết gì.",
      "audio_src": "audio/lesson_09/b4.mp3",
      "audio_duration": 9.04
    },
    {
      "id": "b5",
      "label": "5. Bước 2: Gõ dấu / để đối chiếu tệp với danh sách lệnh",
      "duration": 11.69,
      "pose": 5,
      "mode": "sim",
      "pedagogy_type": "practice_step",
      "pedagogy_badge": "👆 Thực hành Bước 2/3 · Đối chiếu Tệp và Lệnh /",
      "pedagogy_title": "Bước 2: Bấm nút / trên thanh công cụ chat để xem danh sách Workflows",
      "pedagogy_note": "Mỗi tệp .md đặt trong thư mục .agent/workflows/ đều tự động xuất hiện trong bảng lệnh gạch chéo này.",
      "onEnter": "kudoHidePopovers(); switchToSurface('ide'); openFileInEditor('start-1-1.md'); kudoOpenIdeSlashPopup();",
      "focus_selectors": [
        ".context-toolbar",
        "#ide-popup-menu"
      ],
      "cursor_selector": "#ide-popup-menu .popup-item:first-child",
      "cursor_label": "Bước 2: Kiểm tra danh sách lệnh / tương ứng",
      "caption": "Sang <strong>Bước 2</strong>, anh chị bấm vào biểu tượng dấu gạch chéo <code>/</code> ở khung chat phải. Anh chị sẽ thấy các lệnh như <code>/plan</code> hay <code>/grill-me</code> hiện ra, tương ứng 1-1 với các tệp trong thư mục <code>.agent</code>.",
      "audio_src": "audio/lesson_09/b5.mp3",
      "audio_duration": 11.04
    },
    {
      "id": "b6",
      "label": "6. Bước 3: Hỏi AI kiểm tra cấu trúc .agent",
      "duration": 11.29,
      "pose": 6,
      "mode": "sim",
      "pedagogy_type": "practice_step",
      "pedagogy_badge": "✅ Thực hành Bước 3/3 · Kết quả hoàn thành",
      "pedagogy_title": "Bước 3: Yêu cầu AI liệt kê các Rules, Skills và Workflows hiện có",
      "pedagogy_note": "Hiểu rõ 3 ngăn của .agent.",
      "onEnter": "kudoSimScene({surface:'ide', file:'start-1-1.md', userMsg:'Hãy kiểm tra thư mục .agent của dự án hiện tại và tóm tắt giúp tôi các ngăn Rules, Skills, Workflows đang có.', aiMsg:'Báo cáo kiểm tra bộ não <code>.agent/</code> của dự án:<br>• <strong>Rules (Nội quy luôn bật):</strong> Quy chuẩn tiếng Việt văn phòng &amp; bảo mật dữ liệu.<br>• <strong>Skills (Kỹ năng chuyên môn):</strong> Phân tích CSV, lập kế hoạch chiến lược, thiết kế slide.<br>• <strong>Workflows (Lệnh /):</strong> <code>/start-1-1</code>, <code>/grill-me</code>, <code>/plan</code>, <code>/learn</code>.'});",
      "focus_selectors": [
        "#ide-chat-messages",
        "#editor-canvas"
      ],
      "cursor_selector": "#ide-chat-messages",
      "cursor_label": "Bước 3: AI tóm tắt 3 ngăn của bộ não .agent",
      "caption": "Ở <strong>Bước 3</strong>, trợ lý AI đã liệt kê rõ ràng cả 3 ngăn <strong>Rules</strong>, <strong>Skills</strong> và <strong>Workflows</strong> trong dự án của chúng ta. Bây giờ, chúng ta bước sang <strong>Bài 10</strong> để tự tay viết Nội quy và Kỹ năng cho phòng ban của mình!",
      "audio_src": "audio/lesson_09/b6.mp3",
      "audio_duration": 10.64
    }
  ]
};
