window.KUDO_SPEC = {
  "filename": "lesson_06.html",
  "legacy_alias": "",
  "code": "BÀI 6",
  "chapter_number": 2,
  "chapter_code": "CHƯƠNG 2",
  "chapter_title": "Định dạng Dữ liệu, Ký hiệu @ & Hồ sơ Cá nhân hóa",
  "title": "Đính kèm Tệp Bằng @, Giao việc Giọng nói (Ctrl+M) & Trích dẫn (Ctrl+L)",
  "short_title": "Đính kèm @, Ctrl+M & Ctrl+L",
  "pill_label": "Bài 6 · Ký hiệu @, Ctrl+M, Ctrl+L",
  "description": "Làm chủ bộ 3 kỹ năng giao việc tốc độ cao: Gõ @ để đính kèm chính xác tệp dữ liệu trong thư mục, nhấn Ctrl+M để đọc yêu cầu bằng giọng nói tiếng Việt và bôi đen nhấn Ctrl+L để trích dẫn đúng dòng.",
  "prerequisites": "Bài 5 (Đã hiểu cấu trúc tệp .md, .csv và chế độ đánh số dòng trong trình soạn thảo).",
  "dependents": "Bài 7 (Gọi @troly.md), Bài 8 (Gọi @ban_giao_cong_viec.md), Bài 14 (Phân tích @sales_data.csv).",
  "placement_risk": "0% Rủi ro — Học viên đã mở thư mục (Bài 2) và hiểu tệp .md/.csv (Bài 5) nên khi gõ @ sẽ hiểu ngay các tệp trong danh sách gợi ý từ đâu mà có.",
  "continuity_bridge": "Sau khi biết dùng dấu @ để đính kèm tài liệu dự án ở Bài 6, Bài 7 sẽ hướng dẫn tạo tệp hồ sơ cá nhân @troly.md để AI luôn nhớ phong cách làm việc của riêng bạn.",
  "slides": {
    "s1": "<div>\n      <div class=\"k-slide-header\">\n        <span class=\"k-slide-kicker\">CHƯƠNG 2 · BÀI 6</span>\n        <span class=\"k-slide-step\">Tổng quan &amp; Nguyên lý cốt lõi</span>\n      </div>\n      <div class=\"k-slide-h1\">Bộ ba tăng tốc giao việc: Đính kèm tệp (@), Giọng nói (Ctrl+M) và Trích dẫn dòng (Ctrl+L)</div>\n      <div class=\"k-slide-sub\">Giao việc cho Trợ lý AI nhanh gấp nhiều lần gõ phím truyền thống và chính xác tới từng dòng văn bản.</div>\n    </div>\n    \n        <div class=\"k-visual-hero-box k-layout-flowchart k-step-item k-hl\" id=\"s1_hero\" data-order=\"1\">\n          <div class=\"k-viz-header\">\n            <span class=\"k-viz-badge\">📊 SƠ ĐỒ QUY TRÌNH CỐT LÕI</span>\n            <span class=\"k-viz-title\">Ba kênh truyền đạt ngữ cảnh chính xác tuyệt đối cho Trợ lý AI</span>\n          </div>\n          <svg class=\"k-flow-svg\" viewBox=\"0 0 860 96\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"Ba kênh truyền đạt ngữ cảnh chính xác tuyệt đối cho Trợ lý AI\">\n            <path d=\"M262 48 H298\" stroke=\"#EA580C\" stroke-width=\"3\" stroke-linecap=\"round\"/>\n            <polygon points=\"295,42 307,48 295,54\" fill=\"#EA580C\"/>\n            <path d=\"M562 48 H598\" stroke=\"#15803D\" stroke-width=\"3\" stroke-linecap=\"round\"/>\n            <polygon points=\"595,42 607,48 595,54\" fill=\"#15803D\"/>\n            <rect x=\"8\" y=\"8\" width=\"252\" height=\"80\" rx=\"14\" fill=\"#FFF7ED\" stroke=\"#FDBA74\" stroke-width=\"2\"/>\n            <text x=\"134\" y=\"34\" text-anchor=\"middle\" fill=\"#9A3412\" font-size=\"13\" font-weight=\"800\">1. KÝ HIỆU @ (MENTION)</text>\n            <text x=\"134\" y=\"56\" text-anchor=\"middle\" fill=\"#1E293B\" font-size=\"14\" font-weight=\"700\">Chỉ định đích danh tệp</text>\n            <text x=\"134\" y=\"76\" text-anchor=\"middle\" fill=\"#475569\" font-size=\"12\">@COMPANY.md, @sales_data.csv</text>\n            <rect x=\"308\" y=\"8\" width=\"252\" height=\"80\" rx=\"14\" fill=\"#FEF3C7\" stroke=\"#F59E0B\" stroke-width=\"2\"/>\n            <text x=\"434\" y=\"34\" text-anchor=\"middle\" fill=\"#B45309\" font-size=\"13\" font-weight=\"800\">2. PHÍM CTRL + M (VOICE)</text>\n            <text x=\"434\" y=\"56\" text-anchor=\"middle\" fill=\"#1E293B\" font-size=\"14\" font-weight=\"700\">Đọc yêu cầu tiếng Việt</text>\n            <text x=\"434\" y=\"76\" text-anchor=\"middle\" fill=\"#475569\" font-size=\"12\">Tự chuyển giọng nói thành chữ</text>\n            <rect x=\"608\" y=\"8\" width=\"244\" height=\"80\" rx=\"14\" fill=\"#DCFCE7\" stroke=\"#4ADE80\" stroke-width=\"2\"/>\n            <text x=\"730\" y=\"34\" text-anchor=\"middle\" fill=\"#166534\" font-size=\"13\" font-weight=\"800\">3. PHÍM CTRL + L (QUOTE)</text>\n            <text x=\"730\" y=\"56\" text-anchor=\"middle\" fill=\"#1E293B\" font-size=\"14\" font-weight=\"700\">Bôi đen đoạn văn -> Trích dẫn</text>\n            <text x=\"730\" y=\"76\" text-anchor=\"middle\" fill=\"#15803D\" font-size=\"12\">Gắn kèm số dòng #L7-L8</text>\n          </svg>\n        </div>\n        \n    <div class=\"k-grid-3\">\n      \n        <div class=\"k-card k-step-item k-unreached\" id=\"s1_c1\" data-order=\"2\">\n          <div class=\"k-card-top-row\">\n            <span class=\"k-card-tag\" style=\"background:#FFF1E6; color:#C2410C; border:1px solid #FDBA74;\">KÝ HIỆU @ · ĐÍNH KÈM TỆP</span>\n            <span class=\"k-illus-badge\"><svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#EA580C\" stroke-width=\"2\"><rect x=\"3\" y=\"4\" width=\"18\" height=\"16\" rx=\"3\"/><path d=\"M8 10h8M8 14h5\"/></svg></span>\n          </div>\n          <h3>Không bao giờ sợ AI đọc nhầm tài liệu</h3>\n          <p>Gõ dấu @ trong ô chat để mở danh sách toàn bộ tệp trong thư mục dự án, có thể đính kèm 2-3 tệp trong cùng một câu lệnh.</p>\n          <div class=\"k-card-mini-note\">📎 Ví dụ: Đối chiếu @COMPANY.md với @sales_data.csv</div>\n        </div>\n        \n        <div class=\"k-card k-step-item k-unreached\" id=\"s1_c2\" data-order=\"3\">\n          <div class=\"k-card-top-row\">\n            <span class=\"k-card-tag\" style=\"background:#E0F2FE; color:#0369A1; border:1px solid #7DD3FC;\">CTRL + M · GIỌNG NÓI TIẾNG VIỆT</span>\n            <span class=\"k-illus-badge\"><svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#0284C7\" stroke-width=\"2\"><path d=\"M12 2L2 7l10 5 10-5-10-5z\"/><path d=\"M2 17l10 5 10-5M2 12l10 5 10-5\"/></svg></span>\n          </div>\n          <h3>Nói tự nhiên, AI tự chuyển thành văn bản</h3>\n          <p>Bấm biểu tượng Micro (🎙️) hoặc nhấn Ctrl + M (hoặc Windows + H) để đọc yêu cầu dài mà không mỏi tay gõ phím.</p>\n          <div class=\"k-card-mini-note\">🎙️ Nhận diện chuẩn tiếng Việt và thuật ngữ văn phòng</div>\n        </div>\n        \n        <div class=\"k-card k-step-item k-unreached\" id=\"s1_c3\" data-order=\"4\">\n          <div class=\"k-card-top-row\">\n            <span class=\"k-card-tag\" style=\"background:#DCFCE7; color:#15803D; border:1px solid #86EFAC;\">CTRL + L · QUOTE IN CHAT</span>\n            <span class=\"k-illus-badge\"><svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#16A34A\" stroke-width=\"2\"><path d=\"M22 11.08V12a10 10 0 1 1-5.93-9.14\"/><polyline points=\"22 4 12 14.01 9 11.01\"/></svg></span>\n          </div>\n          <h3>Sửa đúng đoạn văn không ảnh hưởng phần khác</h3>\n          <p>Bôi đen đúng câu cần sửa trong tài liệu rồi nhấn Ctrl + L (hoặc bấm nút Quote in Chat) để đưa tọa độ dòng vào ô chat.</p>\n          <div class=\"k-card-mini-note\">💬 Tự động gắn nhãn @0.1_Introduction.md#L7-L8</div>\n        </div>\n        \n    </div>\n    <div class=\"k-callout k-step-item k-unreached\" id=\"s1_call\" data-order=\"5\">\n      <span>💡</span>\n      <div><strong>Công thức giao việc chuẩn:</strong> <code>@Tên_tệp</code> + <code>Đoạn trích dẫn (Ctrl+L)</code> + <code>Yêu cầu cụ thể (gõ phím hoặc đọc bằng Ctrl+M)</code>.</div>\n    </div>"
  },
  "beats": [
    {
      "id": "b1",
      "label": "1. Tổng quan: Bộ ba kỹ năng @, Ctrl+M và Ctrl+L",
      "duration": 13.21,
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
      "caption": "Trong <strong>Bài 6</strong>, chúng ta làm chủ bộ ba kỹ năng giao việc nhanh và chuẩn xác nhất cho dân văn phòng: Dùng ký hiệu <code>@</code> để đính kèm tệp, dùng <kbd>Ctrl + M</kbd> để giao việc bằng giọng nói và dùng <kbd>Ctrl + L</kbd> để trích dẫn đúng dòng cần sửa.",
      "audio_src": "audio/lesson_06/b1.mp3",
      "audio_duration": 12.56
    },
    {
      "id": "b2",
      "label": "2. Minh họa: Cơ chế gợi ý tệp tự động khi gõ ký hiệu @",
      "duration": 14.89,
      "pose": 2,
      "mode": "sim",
      "pedagogy_type": "theory_type_2",
      "pedagogy_badge": "💡 Điểm cần lưu ý · Đính kèm Tệp bằng @",
      "pedagogy_title": "Bảng gợi ý tệp thông minh khi gõ dấu @ trong khung chat",
      "pedagogy_note": "Phần mềm tự động quét toàn bộ thư mục đang mở và liệt kê các tệp (@COMPANY.md, @sales_data.csv, @troly.md) để chọn ngay.",
      "onEnter": "kudoHidePopovers(); switchToSurface('ide'); openFileInEditor('COMPANY.md'); kudoOpenIdeMentionPopup();",
      "focus_selectors": [
        ".context-toolbar",
        "#ide-popup-menu",
        "#ide-chat-input"
      ],
      "cursor_selector": "#ide-popup-menu .popup-item:first-child",
      "cursor_label": "Gõ @ để chọn tệp cần đính kèm vào câu lệnh",
      "caption": "Nhìn vào khung chat bên phải trên màn hình: Ngay khi anh chị gõ ký hiệu <code>@</code>, phần mềm sẽ liệt kê toàn bộ các tệp có trong thư mục như <code>@COMPANY.md</code> hay <code>@sales_data.csv</code> để anh chị bấm chọn mà không cần gõ tay tên tệp.",
      "audio_src": "audio/lesson_06/b2.mp3",
      "audio_duration": 14.24
    },
    {
      "id": "b3",
      "label": "3. Kỹ thuật: Cơ chế thu giọng nói (Ctrl+M) và trích dẫn (Ctrl+L)",
      "duration": 11.53,
      "pose": 3,
      "mode": "sim",
      "pedagogy_type": "theory_type_2",
      "pedagogy_badge": "💡 Điểm cần lưu ý · Giọng nói & Trích dẫn dòng",
      "pedagogy_title": "Thanh thu âm giọng nói tiếng Việt (🎙️) và nút Quote in Chat (Ctrl + L)",
      "pedagogy_note": "Khi bôi đen một đoạn văn bản, nút Quote in Chat bật lên kèm số thứ tự dòng (#L7-L8) giúp AI chỉ sửa đúng đoạn đó.",
      "onEnter": "kudoHidePopovers(); switchToSurface('mgr'); kudoActivateQuoteDemo(); kudoShowKeyHud('Bôi đen văn bản + Nhấn <kbd>Ctrl + L</kbd> (Quote in Chat)');",
      "focus_selectors": [
        "#kudo-quote-highlight",
        "#agy2-quote-btn",
        "#agy2-chat-input"
      ],
      "cursor_selector": "#agy2-quote-btn",
      "cursor_label": "Bấm Quote in Chat hoặc nhấn Ctrl + L",
      "caption": "Đặc biệt, khi đang đọc một tài liệu dài mà chỉ muốn AI viết lại đúng một câu, anh chị chỉ cần bôi đen câu đó. Nút <strong>Quote in Chat</strong> kèm phím tắt <kbd>Ctrl + L</kbd> sẽ hiện ra, tự động chèn đúng số dòng vào khung chat.",
      "audio_src": "audio/lesson_06/b3.mp3",
      "audio_duration": 10.88
    },
    {
      "id": "b4",
      "label": "4. Bước 1: Đính kèm tệp @COMPANY.md",
      "duration": 9.93,
      "pose": 4,
      "mode": "sim",
      "pedagogy_type": "practice_step",
      "pedagogy_badge": "👆 Thực hành Bước 1/3 · Đính kèm hồ sơ bằng @",
      "pedagogy_title": "Cần tóm tắt hồ sơ công ty TaskFlow kèm bổ sung ví dụ thực tế",
      "pedagogy_note": "Bước 1: Tại ô chat của Antigravity IDE, gõ ký hiệu @ và bấm chọn tệp @COMPANY.md từ danh sách.",
      "onEnter": "kudoHidePopovers(); switchToSurface('ide'); openFileInEditor('COMPANY.md'); kudoOpenIdeMentionPopup(); document.getElementById('ide-chat-input').value = '@COMPANY.md Hãy tóm tắt 3 mục tiêu trọng tâm Quý 2';",
      "focus_selectors": [
        "#ide-popup-menu",
        "#ide-chat-input"
      ],
      "cursor_selector": "#ide-popup-menu .popup-item:first-child",
      "cursor_label": "Bước 1: Gõ @ và chọn @COMPANY.md",
      "caption": "Chúng ta vào thực hành phối hợp cả 3 kỹ năng. Ở <strong>Bước 1</strong>, trong bối cảnh cần xử lý hồ sơ công ty, anh chị gõ dấu <code>@</code> vào ô chat và bấm chọn <code>@COMPANY.md</code>.",
      "audio_src": "audio/lesson_06/b4.mp3",
      "audio_duration": 9.28
    },
    {
      "id": "b5",
      "label": "5. Bước 2: Bật thu âm giọng nói tiếng Việt (Ctrl+M)",
      "duration": 10.65,
      "pose": 5,
      "mode": "sim",
      "pedagogy_type": "practice_step",
      "pedagogy_badge": "👆 Thực hành Bước 2/3 · Giao việc bằng Giọng nói",
      "pedagogy_title": "Bước 2: Nhấn Ctrl + M (hoặc bấm biểu tượng 🎙️) để đọc yêu cầu",
      "pedagogy_note": "Thanh sóng âm màu đỏ hiện lên, tự động chuyển lời nói tiếng Việt của bạn thành câu lệnh hoàn chỉnh trong ô chat.",
      "onEnter": "kudoHidePopovers(); switchToSurface('mgr'); closeSettingsModal(); loadAgy2Thread('main'); simulateVoiceInput('mgr'); kudoShowKeyHud('Nhấn <kbd>Ctrl + M</kbd> để bật thu âm giọng nói');",
      "focus_selectors": [
        "#agy2-input-card-box",
        "#mgr-voice-bar",
        "#agy2-mic-btn"
      ],
      "cursor_selector": "#agy2-mic-btn",
      "cursor_label": "Bước 2: Bấm 🎙️ hoặc nhấn Ctrl + M để đọc lệnh",
      "caption": "Sang <strong>Bước 2</strong>, thay vì gõ bàn phím dài dòng, anh chị bấm vào biểu tượng Micro hoặc nhấn <kbd>Ctrl + M</kbd> để đọc yêu cầu bằng tiếng Việt. Thanh sóng âm sẽ chuyển lời nói thành văn bản ngay tức thì.",
      "audio_src": "audio/lesson_06/b5.mp3",
      "audio_duration": 10.0
    },
    {
      "id": "b6",
      "label": "6. Bước 3: Bôi đen trích dẫn Ctrl+L",
      "duration": 12.65,
      "pose": 6,
      "mode": "sim",
      "pedagogy_type": "practice_step",
      "pedagogy_badge": "👆 Thực hành Bước 3/3 · Trích dẫn & Nghiệm thu",
      "pedagogy_title": "Bước 3: Bôi đen đoạn văn cần sửa và nhấn Ctrl + L",
      "pedagogy_note": "Ô chat nhận chính xác tọa độ dòng @0.1_Introduction.md#L7-L8.",
      "onEnter": "kudoHidePopovers(); switchToSurface('mgr'); kudoActivateQuoteDemo();",
      "focus_selectors": [
        "#kudo-quote-highlight",
        "#agy2-quote-btn",
        "#agy2-chat-input"
      ],
      "cursor_selector": "#agy2-submit-btn",
      "cursor_label": "Bước 3: Đã trích dẫn dòng #L7-L8 sẵn sàng gửi",
      "caption": "Ở <strong>Bước 3</strong>, anh chị bôi đen đoạn văn bản bên phải và nhấn <kbd>Ctrl + L</kbd> để gắn tọa độ dòng vào câu lệnh rồi bấm gửi. Khi đã thuần thục dấu <code>@</code>, chúng ta sang <strong>Bài 7</strong> để tạo hồ sơ cá nhân hóa <code>@troly.md</code>.",
      "audio_src": "audio/lesson_06/b6.mp3",
      "audio_duration": 12.0
    }
  ]
};
