window.KUDO_SPEC = {
  "filename": "lesson_01.html",
  "legacy_alias": "lesson_01_chatbot_vs_agent.html",
  "code": "BÀI 1",
  "chapter_number": 1,
  "chapter_code": "CHƯƠNG 1",
  "chapter_title": "Khởi động Chuẩn & Làm chủ Giao diện",
  "title": "Tư duy Trợ lý AI trên Máy tính & 2 Phần mềm Cốt lõi",
  "short_title": "Tư duy AI & 2 Phần mềm",
  "pill_label": "Bài 1 · Tư duy & 2 Phần mềm",
  "description": "Phân biệt hỏi đáp trên trình duyệt web với Trợ lý AI làm việc trực tiếp trong thư mục máy tính; nắm vững vai trò của Antigravity 2.0, Antigravity IDE và 5 mô hình AI.",
  "prerequisites": "Không yêu cầu kiến thức nền tảng (Bài mở đầu toàn khóa).",
  "dependents": "Bài 2 (Giải nén & Mở thư mục dự án), Bài 3 (Làm chủ giao diện 3 cột), Bài 4 (Bật quyền tự chủ Turbo).",
  "placement_risk": "0% Rủi ro — Cuối Bài 1 khi mở IDE sẽ ở màn hình chào mừng (Welcome Screen) chưa mở thư mục, khớp 100% với Bài 2 học giải nén .zip và Open Folder.",
  "continuity_bridge": "Sau khi mở cửa sổ Antigravity IDE ở trạng thái màn hình chào mừng cuối Bài 1, Bài 2 sẽ hướng dẫn giải nén học liệu .zip và bấm Open Folder nạp dự án vào.",
  "slides": {
    "s1": "<div>\n      <div class=\"k-slide-header\">\n        <span class=\"k-slide-kicker\">CHƯƠNG 1 · BÀI 1 · LÝ THUYẾT KIỂU 1 ( NGUYÊN LÝ &amp; TRỰC QUAN )</span>\n        <span class=\"k-slide-step\">Bố cục COMPARISON · Nhịp 1/6</span>\n      </div>\n      <div class=\"k-slide-h1\">Từ hỏi đáp trên trình duyệt web đến Trợ lý AI làm việc trực tiếp trên ổ cứng</div>\n      <div class=\"k-slide-sub\">Sự dịch chuyển cốt lõi giúp dân văn phòng không còn phải tải tệp lên web thủ công và tích lũy quy trình lâu dài.</div>\n    </div>\n    \n        <div class=\"k-visual-hero-box k-layout-comparison\">\n          <div class=\"k-cmp-col k-cmp-before\">\n            <div class=\"k-cmp-badge-old\">❌ CÁCH LÀM CŨ · THỦ CÔNG RỜI RẠC</div>\n            <div class=\"k-cmp-main\">CHAT WEB TRÊN TRÌNH DUYỆT — Tải tệp lẻ tẻ thủ công</div>\n            <div class=\"k-cmp-sub\">Đóng tab là trôi mất quy trình</div>\n          </div>\n          <div class=\"k-cmp-arrow\">➔</div>\n          <div class=\"k-cmp-col k-cmp-after\">\n            <div class=\"k-cmp-badge-new\">✅ CÁCH LÀM MỚI · TRỢ LÝ AI TRONG THƯ MỤC</div>\n            <div class=\"k-cmp-main\">TRỢ LÝ TRONG THƯ MỤC — Đọc & xuất tệp trên ổ cứng</div>\n            <div class=\"k-cmp-sub\">Lưu giữ quy trình tái sử dụng</div>\n          </div>\n          <blockquote class=\"k-quote-box\">\n            <span class=\"k-quote-mark\">“</span>\n            <p>Đừng biến mình thành người vận chuyển văn bản giữa máy tính và trình duyệt. Hãy đặt Trợ lý AI ngồi ngay trong thư mục công việc của bạn.</p>\n          </blockquote>\n        </div>\n        \n    <div class=\"k-grid-3\">\n      \n        <div class=\"k-card k-step-item k-hl\" id=\"s1_c1\" data-order=\"1\">\n          <div class=\"k-card-top-row\">\n            <span class=\"k-card-tag\" style=\"background:#FFF1E6; color:#C2410C; border:1px solid #FDBA74;\">HẠN CHẾ CHAT WEB</span>\n            <span class=\"k-illus-badge\"><svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#EA580C\" stroke-width=\"2\"><rect x=\"3\" y=\"4\" width=\"18\" height=\"16\" rx=\"3\"/><path d=\"M8 10h8M8 14h5\"/></svg></span>\n          </div>\n          <h3>Hỏi đáp rời rạc từng cửa sổ</h3>\n          <p>Mỗi lần mở cuộc trò chuyện mới trên web, bạn lại phải tải tệp lên từ đầu và giải thích lại bối cảnh công ty.</p>\n          <div class=\"k-card-mini-note\">❌ Tốn công copy-paste · Dễ trôi quy trình</div>\n        </div>\n        \n        <div class=\"k-card k-step-item k-hl\" id=\"s1_c2\" data-order=\"2\">\n          <div class=\"k-card-top-row\">\n            <span class=\"k-card-tag\" style=\"background:#E0F2FE; color:#0369A1; border:1px solid #7DD3FC;\">TRỢ LÝ TRONG THƯ MỤC</span>\n            <span class=\"k-illus-badge\"><svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#0284C7\" stroke-width=\"2\"><path d=\"M12 2L2 7l10 5 10-5-10-5z\"/><path d=\"M2 17l10 5 10-5M2 12l10 5 10-5\"/></svg></span>\n          </div>\n          <h3>Đọc và xuất tệp ngay trên máy</h3>\n          <p>Antigravity kết nối trực tiếp vào thư mục dự án, tự đọc tài liệu mẫu và ghi kết quả thành tệp hoàn chỉnh trên ổ cứng.</p>\n          <div class=\"k-card-mini-note\">✅ Đồng bộ 1-1 với máy tính cá nhân</div>\n        </div>\n        \n        <div class=\"k-card k-step-item k-hl\" id=\"s1_c3\" data-order=\"3\">\n          <div class=\"k-card-top-row\">\n            <span class=\"k-card-tag\" style=\"background:#DCFCE7; color:#15803D; border:1px solid #86EFAC;\">BỘ ĐÔI PHẦN MỀM</span>\n            <span class=\"k-illus-badge\"><svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#16A34A\" stroke-width=\"2\"><path d=\"M22 11.08V12a10 10 0 1 1-5.93-9.14\"/><polyline points=\"22 4 12 14.01 9 11.01\"/></svg></span>\n          </div>\n          <h3>Antigravity 2.0 & Antigravity IDE</h3>\n          <p>Antigravity 2.0 giúp điều phối đa luồng hội thoại thoáng đãng; Antigravity IDE cung cấp bàn làm việc 3 cột chuyên sâu.</p>\n          <div class=\"k-card-mini-note\">🔄 Chuyển đổi tức thì bằng nút Open IDE</div>\n        </div>\n        \n    </div>\n    <div class=\"k-callout k-step-item k-hl\" id=\"s1_call\" data-order=\"4\">\n      <span>💡</span>\n      <div><strong>Nguyên tắc cốt lõi Bài 1:</strong> Nghiệm thu công việc bằng <strong>tệp kết quả thực tế trên ổ cứng</strong> thay vì chỉ đọc câu trả lời trôi đi trên khung chat.</div>\n    </div>"
  },
  "beats": [
    {
      "id": "b1",
      "label": "1. [Lý thuyết Kiểu 1] Đối sánh Chat Web vs. Trợ lý AI trên máy",
      "duration": 13.64,
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
      "caption": "Chào mừng anh chị đến với khóa học <strong>Antigravity Basic</strong>. Nhìn vào khung đối sánh trên màn hình, khác biệt lớn nhất là thay vì tải tệp lên trình duyệt <strong>ChatGPT</strong> mỗi ngày, chúng ta đưa trợ lý AI vào làm việc trực tiếp ngay trong thư mục máy tính.",
      "audio_src": "audio/lesson_01/b1.mp3",
      "audio_duration": 12.99
    },
    {
      "id": "b2",
      "label": "2. [Lý thuyết Kiểu 2] Giao diện Antigravity 2.0 trên màn hình",
      "duration": 11.45,
      "pose": 2,
      "mode": "sim",
      "pedagogy_type": "theory_type_2",
      "pedagogy_badge": "📘 Lý thuyết Kiểu 2 · Gắn màn hình",
      "pedagogy_title": "Cấu trúc cửa sổ điều phối Antigravity 2.0 (Agent Manager)",
      "pedagogy_note": "Cột trái quản lý các cuộc hội thoại và dự án, cột giữa là khung trao đổi trung tâm, góc trên phải có nút Open IDE.",
      "onEnter": "kudoHidePopovers(); switchToSurface('mgr'); closeSettingsModal(); resetAgy2NewConv(); document.getElementById('agy2-right-pane').classList.add('collapsed');",
      "focus_selectors": [
        "#agy2-left-sb",
        ".agy2-center-header",
        "#agy2-input-card-box"
      ],
      "cursor_selector": ".agy2-new-conv-btn",
      "cursor_label": "Antigravity 2.0: Không gian điều phối hội thoại",
      "caption": "Trên màn hình là phần mềm thứ nhất mang tên <strong>Antigravity 2.0</strong>, trước đây gọi là <strong>Agent Manager</strong>. Giao diện được thiết kế thoáng đãng giúp anh chị khởi tạo hội thoại mới và điều phối nhiều đầu việc cùng lúc.",
      "audio_src": "audio/lesson_01/b2.mp3",
      "audio_duration": 10.8
    },
    {
      "id": "b3",
      "label": "3. [Lý thuyết Kiểu 2] Quy tắc chọn 5 mô hình AI theo việc",
      "duration": 16.11,
      "pose": 3,
      "mode": "sim",
      "pedagogy_type": "theory_type_2",
      "pedagogy_badge": "📘 Lý thuyết Kiểu 2 · Kỹ thuật chọn Mô hình",
      "pedagogy_title": "Chọn đúng mô hình AI cho từng độ khó công việc",
      "pedagogy_note": "Flash (nhanh, việc nhẹ) · Argon Medium (mặc định hàng ngày) · Claude Sonnet/Opus 5.5 (lập kế hoạch & phân tích sâu).",
      "onEnter": "kudoHidePopovers(); switchToSurface('mgr'); closeSettingsModal(); resetAgy2NewConv(); kudoOpenModelPopover();",
      "focus_selectors": [
        "#agy2-model-pill",
        "#kudo-model-popover"
      ],
      "cursor_selector": "#kmp-argon",
      "cursor_label": "Bảng chọn 5 mô hình AI trong Antigravity",
      "caption": "Khi nhìn xuống góc dưới khung chat, anh chị thấy bảng chọn 5 mô hình AI. Ta dùng <strong>Gemini 3.8 Flash Medium</strong> cho việc nhẹ cần tốc độ, <strong>Gemini 4 Argon Medium</strong> làm mặc định hàng ngày, và chuyển sang <strong>Claude Sonnet 5.5</strong> hoặc <strong>Claude Opus 5.5</strong> khi lập kế hoạch sâu.",
      "audio_src": "audio/lesson_01/b3.mp3",
      "audio_duration": 15.46
    },
    {
      "id": "b4",
      "label": "4. [Thực hành B1/3] Bối cảnh & Chọn mô hình mặc định",
      "duration": 10.73,
      "pose": 4,
      "mode": "sim",
      "pedagogy_type": "practice_step",
      "pedagogy_badge": "🛠️ Thực hành Bước 1/3 · Bối cảnh & Khởi tạo",
      "pedagogy_title": "Bối cảnh: Chuẩn bị bàn làm việc cho dự án đầu tiên",
      "pedagogy_note": "Bước 1: Mở hộp chọn Model ở đáy khung chat Antigravity 2.0 và kiểm tra mô hình Gemini 4 Argon Medium đã được tích chọn.",
      "onEnter": "kudoHidePopovers(); switchToSurface('mgr'); closeSettingsModal(); resetAgy2NewConv(); kudoOpenModelPopover(); document.getElementById('agy2-chat-input').value = 'Xin chào, hãy kiểm tra trạng thái sẵn sàng của hệ thống.';",
      "focus_selectors": [
        "#agy2-model-pill",
        "#kudo-model-popover"
      ],
      "cursor_selector": "#agy2-model-pill",
      "cursor_label": "Bước 1: Bấm chọn Gemini 4 Argon Medium",
      "caption": "Bây giờ chúng ta vào thực hành theo 3 bước. Trong bối cảnh bắt đầu ngày làm việc mới, <strong>Bước 1</strong> là anh chị bấm vào nút chọn mô hình ở đáy khung chat và xác nhận <strong>Gemini 4 Argon Medium</strong> đang được tích chọn.",
      "audio_src": "audio/lesson_01/b4.mp3",
      "audio_duration": 10.08
    },
    {
      "id": "b5",
      "label": "5. [Thực hành B2/3] Bấm nút Open IDE chuyển không gian",
      "duration": 8.49,
      "pose": 5,
      "mode": "sim",
      "pedagogy_type": "practice_step",
      "pedagogy_badge": "🛠️ Thực hành Bước 2/3 · Thao tác trực tiếp",
      "pedagogy_title": "Bước 2: Chuyển từ Antigravity 2.0 sang Antigravity IDE",
      "pedagogy_note": "Nhìn lên góc trên bên phải của thanh tiêu đề giữa và bấm nút Open IDE để mở bàn làm việc chuyên sâu.",
      "onEnter": "kudoHidePopovers(); switchToSurface('mgr'); closeSettingsModal(); resetAgy2NewConv();",
      "focus_selectors": [
        ".agy2-center-header",
        "#agy2-open-ide-btn"
      ],
      "cursor_selector": "#agy2-open-ide-btn",
      "cursor_label": "Bước 2: Bấm nút Open IDE ở góc trên phải",
      "caption": "Sang <strong>Bước 2</strong>, khi cần soạn thảo hồ sơ và làm việc trực tiếp với thư mục máy tính, anh chị di chuột lên góc trên bên phải và bấm vào nút <strong>Open IDE</strong>.",
      "audio_src": "audio/lesson_01/b5.mp3",
      "audio_duration": 7.84
    },
    {
      "id": "b6",
      "label": "6. [Thực hành B3/3] Nghiệm thu màn hình chào mừng Antigravity IDE",
      "duration": 12.81,
      "pose": 6,
      "mode": "sim",
      "pedagogy_type": "practice_step",
      "pedagogy_badge": "🛠️ Thực hành Bước 3/3 · Nghiệm thu & Tiếp nối",
      "pedagogy_title": "Bước 3: Màn hình chào mừng Antigravity IDE sẵn sàng nhận thư mục",
      "pedagogy_note": "Nghiệm thu: Cửa sổ Antigravity IDE mở ra ở màn hình Welcome (chưa mở thư mục). Tiếp theo: Bài 2 học giải nén .zip & bấm Open Folder.",
      "onEnter": "kudoHidePopovers(); switchToSurface('ide'); showIdeWelcomeScreen();",
      "focus_selectors": [
        "#ide-left-sidebar",
        "#editor-canvas",
        "#ide-right-agent"
      ],
      "cursor_selector": "#ide-left-sidebar",
      "cursor_label": "Bước 3: Màn hình Welcome chờ mở thư mục dự án",
      "caption": "Ở <strong>Bước 3</strong>, cửa sổ <strong>Antigravity IDE</strong> hiện ra ở trạng thái màn hình chào mừng và đang chờ chúng ta mở thư mục dự án. Vậy làm sao để giải nén học liệu <code>.zip</code> và nạp thư mục vào đây an toàn? Chúng ta sang ngay <strong>Bài 2</strong>.",
      "audio_src": "audio/lesson_01/b6.mp3",
      "audio_duration": 12.16
    }
  ]
};
