window.KUDO_SPEC = {
  "filename": "lesson_04.html",
  "legacy_alias": "lesson_05_taskflow_start_1_1_bay_phim_space.html",
  "code": "BÀI 4",
  "chapter_number": 1,
  "chapter_code": "CHƯƠNG 1",
  "chapter_title": "Khởi động Chuẩn & Làm chủ Giao diện",
  "title": "Bật Quyền Tự chủ Turbo & Bài Thực hành Đầu tiên Với /start-1-1",
  "short_title": "Chế độ Turbo & Lệnh /start-1-1",
  "pill_label": "Bài 4 · Turbo & /start-1-1",
  "description": "Hiểu 4 cấp độ phân quyền tự chủ (Request Review, Default, Auto, Turbo), bật chế độ Turbo trong Settings và hoàn thành bài thực hành đầu tiên với lệnh gạch chéo /start-1-1 trong dự án mẫu TaskFlow.",
  "prerequisites": "Bài 2 (Đã mở thư mục dự án) & Bài 3 (Đã hiểu vì sao nút Accept xuất hiện khi chưa bật Turbo).",
  "dependents": "Bài 5..Bài 24 (Toàn bộ các bài thực hành sau đều chạy mượt nhờ đã bật quyền tự chủ Turbo ở Bài 4).",
  "placement_risk": "0% Rủi ro — Học viên chỉ làm quen với thao tác gõ dấu / để gọi bài học có sẵn /start-1-1, chưa bị nhồi nhét lý thuyết thiết kế hệ thống .agent phức tạp.",
  "continuity_bridge": "Kết thúc Chương 1, học viên đã tự chạy thành công bài học đầu tiên. Sang Chương 2 (Bài 5), chúng ta sẽ tìm hiểu sâu về 2 định dạng tệp cốt lõi xuất hiện trong dự án là .md và .csv.",
  "slides": {
    "s1": "<div>\n      <div class=\"k-slide-header\">\n        <span class=\"k-slide-kicker\">CHƯƠNG 1 · BÀI 4 · LÝ THUYẾT KIỂU 1 ( NGUYÊN LÝ &amp; TRỰC QUAN )</span>\n        <span class=\"k-slide-step\">Bố cục TIMELINE · Nhịp 1/6</span>\n      </div>\n      <div class=\"k-slide-h1\">Bốn cấp độ quyền tự chủ của AI và cách gọi bài học tương tác bằng dấu gạch chéo (/)</div>\n      <div class=\"k-slide-sub\">Chuyển sang chế độ Turbo cho thư mục văn phòng an toàn và tránh lỗi kẹt phím cách (Space) khi chọn lệnh.</div>\n    </div>\n    \n        <div class=\"k-visual-hero-box k-layout-timeline\">\n          <div class=\"k-viz-header\">\n            <span class=\"k-viz-badge\">⏱️ LỘ TRÌNH &amp; CHU TRÌNH THỰC THI CHUẨN</span>\n            <span class=\"k-viz-title\">Lộ trình nâng cấp 4 cấp độ phân quyền thực thi (This Computer Permissions)</span>\n          </div>\n          <div class=\"k-tl-track\">\n            <div class=\"k-tl-step\">\n              <span class=\"k-tl-num\">Chặng 1</span>\n              <strong>REQUEST REVIEW / DEFAULT</strong>\n              <span>Hỏi xin phép từng bước · Phải bấm Accept liên tục</span>\n            </div>\n            <div class=\"k-tl-conn\">──▶</div>\n            <div class=\"k-tl-step\">\n              <span class=\"k-tl-num\">Chặng 2</span>\n              <strong>AUTO (PREVIEW)</strong>\n              <span>AI tự cân nhắc rủi ro · Đôi lúc vẫn dừng chờ duyệt</span>\n            </div>\n            <div class=\"k-tl-conn\">──▶</div>\n            <div class=\"k-tl-step k-tl-final\">\n              <span class=\"k-tl-num\">Chặng 3</span>\n              <strong>TURBO (KHUYÊN DÙNG)</strong>\n              <span>Tự chủ 100% trong thư mục · Chạy liền mạch từ đầu đến cuối</span>\n            </div>\n          </div>\n        </div>\n        \n    <div class=\"k-grid-3\">\n      \n        <div class=\"k-card k-step-item k-hl\" id=\"s1_c1\" data-order=\"1\">\n          <div class=\"k-card-top-row\">\n            <span class=\"k-card-tag\" style=\"background:#FFF1E6; color:#C2410C; border:1px solid #FDBA74;\">CẤP QUYỀN TURBO</span>\n            <span class=\"k-illus-badge\"><svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#EA580C\" stroke-width=\"2\"><rect x=\"3\" y=\"4\" width=\"18\" height=\"16\" rx=\"3\"/><path d=\"M8 10h8M8 14h5\"/></svg></span>\n          </div>\n          <h3>Làm việc liền mạch không ngắt quãng</h3>\n          <p>Vào Settings -> General -> This Computer và chuyển từ Default sang Turbo để AI tự tạo tệp và tổng hợp báo cáo.</p>\n          <div class=\"k-card-mini-note\">🛡️ An toàn khi mở đúng thư mục dự án con</div>\n        </div>\n        \n        <div class=\"k-card k-step-item k-hl\" id=\"s1_c2\" data-order=\"2\">\n          <div class=\"k-card-top-row\">\n            <span class=\"k-card-tag\" style=\"background:#E0F2FE; color:#0369A1; border:1px solid #7DD3FC;\">BỐI CẢNH TASKFLOW INC.</span>\n            <span class=\"k-illus-badge\"><svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#0284C7\" stroke-width=\"2\"><path d=\"M12 2L2 7l10 5 10-5-10-5z\"/><path d=\"M2 17l10 5 10-5M2 12l10 5 10-5\"/></svg></span>\n          </div>\n          <h3>Công ty giả lập 45 nhân sự</h3>\n          <p>Khóa học trang bị sẵn bộ hồ sơ công ty TaskFlow Inc. để bạn đóng vai quản lý và thực hành giao việc thực tế.</p>\n          <div class=\"k-card-mini-note\">🏢 Đầy đủ dữ liệu Nhân sự, Doanh thu, Chiến lược</div>\n        </div>\n        \n        <div class=\"k-card k-step-item k-hl\" id=\"s1_c3\" data-order=\"3\">\n          <div class=\"k-card-top-row\">\n            <span class=\"k-card-tag\" style=\"background:#DCFCE7; color:#15803D; border:1px solid #86EFAC;\">QUY TẮC GÕ DẤU GẠCH CHÉO /</span>\n            <span class=\"k-illus-badge\"><svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#16A34A\" stroke-width=\"2\"><path d=\"M22 11.08V12a10 10 0 1 1-5.93-9.14\"/><polyline points=\"22 4 12 14.01 9 11.01\"/></svg></span>\n          </div>\n          <h3>Click chuột hoặc nhấn Enter, cấm bấm Space</h3>\n          <p>Khi gõ /start để mở bảng gợi ý, hãy bấm chuột hoặc phím Enter/Tab để chọn lệnh; bấm phím cách (Space) sẽ gây lỗi lặp chữ.</p>\n          <div class=\"k-card-mini-note\">⚡ Trải nghiệm học tương tác ngay trong IDE</div>\n        </div>\n        \n    </div>\n    <div class=\"k-callout k-step-item k-hl\" id=\"s1_call\" data-order=\"4\">\n      <span>💡</span>\n      <div><strong>Chốt kỹ năng Chương 1:</strong> Bật <strong>Turbo</strong> một lần duy nhất trong <code>Settings</code> và gõ <code>/start-1-1</code> để chính Trợ lý AI dẫn dắt bạn qua bài thực hành đầu tiên.</div>\n    </div>"
  },
  "beats": [
    {
      "id": "b1",
      "label": "1. [Lý thuyết Kiểu 1] 4 mức phân quyền & Bối cảnh TaskFlow",
      "duration": 13.98,
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
      "caption": "Ở Bài 3, anh chị đã thấy nếu để mặc định thì AI sẽ dừng lại hỏi xin phép ở từng bước. Lộ trình trên màn hình cho thấy khi làm việc với tài liệu văn phòng trong thư mục riêng, chúng ta nên bật quyền tự chủ <strong>Turbo</strong> để trợ lý chạy một mạch tới khi ra kết quả.",
      "audio_src": "audio/lesson_04/b1.mp3",
      "audio_duration": 13.33
    },
    {
      "id": "b2",
      "label": "2. [Lý thuyết Kiểu 2] Vị trí cài đặt quyền Turbo trong Settings",
      "duration": 11.29,
      "pose": 2,
      "mode": "sim",
      "pedagogy_type": "theory_type_2",
      "pedagogy_badge": "📘 Lý thuyết Kiểu 2 · Phân quyền This Computer",
      "pedagogy_title": "Bảng thiết lập quyền tự chủ (Settings -> General -> This Computer)",
      "pedagogy_note": "4 tùy chọn: Request Review, Default, Auto (Preview) và Turbo (Run all commands without restrictions).",
      "onEnter": "kudoHidePopovers(); switchToSurface('mgr'); openSettingsModal('general'); kudoOpenTurboPopover();",
      "focus_selectors": [
        "#snav-general",
        "#set-pill-this-computer",
        "#kudo-turbo-popover"
      ],
      "cursor_selector": "#ktp-turbo",
      "cursor_label": "Chế độ Turbo: Chạy liền mạch không gián đoạn",
      "caption": "Trên màn hình cài đặt <strong>Settings</strong> mục <strong>General</strong>, anh chị nhìn vào dòng <strong>This Computer</strong>. Khi chọn <strong>Turbo</strong>, trợ lý sẽ tự động đọc và tạo tệp báo cáo trong thư mục dự án mà không làm gián đoạn mạch làm việc.",
      "audio_src": "audio/lesson_04/b2.mp3",
      "audio_duration": 10.64
    },
    {
      "id": "b3",
      "label": "3. [Lý thuyết Kiểu 2] Cách chọn lệnh gạch chéo (/) không bị lỗi lặp chữ",
      "duration": 14.25,
      "pose": 3,
      "mode": "sim",
      "pedagogy_type": "theory_type_2",
      "pedagogy_badge": "📘 Lý thuyết Kiểu 2 · Kỹ thuật gọi Lệnh Gạch chéo (/)",
      "pedagogy_title": "Tránh bẫy phím cách (Spacebar) khi bảng gợi ý lệnh / đang mở",
      "pedagogy_note": "Gõ /start -> Dùng chuột click hoặc nhấn phím Enter/Tab để chọn /start-1-1. Không bấm phím Space để tránh bị nhân đôi thành /start-1-1-1.",
      "onEnter": "kudoHidePopovers(); closeSettingsModal(); switchToSurface('ide'); openFileInEditor('1.1_Welcome.md'); kudoOpenStartWorkflowPopup();",
      "focus_selectors": [
        "#ide-popup-menu",
        "#ide-chat-input"
      ],
      "cursor_selector": "#ide-popup-menu .popup-item:first-child",
      "cursor_label": "Click chuột hoặc nhấn Enter để chọn /start-1-1",
      "caption": "Khi quay lại <strong>Antigravity IDE</strong> và gõ dấu gạch chéo <code>/start</code>, một bảng gợi ý sẽ bật lên. Anh chị lưu ý kỹ thuật rất quan trọng: Hãy dùng chuột bấm chọn hoặc nhấn phím <kbd>Enter</kbd>, tuyệt đối không bấm phím cách để tránh lỗi nhân đôi tên lệnh.",
      "audio_src": "audio/lesson_04/b3.mp3",
      "audio_duration": 13.6
    },
    {
      "id": "b4",
      "label": "4. [Thực hành B1/3] Bối cảnh & Bật quyền Turbo trong Settings",
      "duration": 8.73,
      "pose": 4,
      "mode": "sim",
      "pedagogy_type": "practice_step",
      "pedagogy_badge": "🛠️ Thực hành Bước 1/3 · Bối cảnh & Cấp quyền Turbo",
      "pedagogy_title": "Bối cảnh: Cấp quyền tự chủ cho trợ lý trước khi chạy bài thực hành TaskFlow",
      "pedagogy_note": "Bước 1: Mở Settings (⚙️) -> thẻ General -> mục This Computer -> tích chọn chế độ Turbo.",
      "onEnter": "kudoHidePopovers(); switchToSurface('mgr'); openSettingsModal('general'); kudoOpenTurboPopover(); document.getElementById('set-pill-this-computer').innerHTML = 'Turbo &#9662;';",
      "focus_selectors": [
        "#agy2-settings-btn",
        "#set-pill-this-computer",
        "#kudo-turbo-popover"
      ],
      "cursor_selector": "#ktp-turbo",
      "cursor_label": "Bước 1: Tích chọn Turbo trong Settings",
      "caption": "Chúng ta bắt đầu bài thực hành tổng kết Chương 1. Ở <strong>Bước 1</strong>, anh chị mở <strong>Settings</strong>, vào thẻ <strong>General</strong> và bấm chuyển quyền <strong>This Computer</strong> sang <strong>Turbo</strong>.",
      "audio_src": "audio/lesson_04/b4.mp3",
      "audio_duration": 8.08
    },
    {
      "id": "b5",
      "label": "5. [Thực hành B2/3] Gõ /start và chọn chuẩn lệnh /start-1-1",
      "duration": 9.13,
      "pose": 5,
      "mode": "sim",
      "pedagogy_type": "practice_step",
      "pedagogy_badge": "🛠️ Thực hành Bước 2/3 · Gọi quy trình học tập",
      "pedagogy_title": "Bước 2: Mở tệp 1.1_Welcome.md và chọn lệnh /start-1-1",
      "pedagogy_note": "Sau khi chọn /start-1-1 từ bảng gợi ý, kiểm tra ô nhập hiển thị đúng '/start-1-1' rồi bấm nút Gửi (→).",
      "onEnter": "kudoHidePopovers(); closeSettingsModal(); switchToSurface('ide'); openFileInEditor('1.1_Welcome.md'); kudoSelectStartWorkflowReadyToSend();",
      "focus_selectors": [
        "#ide-chat-input",
        "#ide-send-btn"
      ],
      "cursor_selector": "#ide-send-btn",
      "cursor_label": "Bước 2: Kiểm tra /start-1-1 rồi nhấn Enter / Gửi",
      "caption": "Sang <strong>Bước 2</strong>, anh chị mở tệp <code>1.1_Welcome.md</code> của công ty giả lập <strong>TaskFlow</strong>, chọn lệnh <code>/start-1-1</code> vào ô chat và nhấn nút Gửi.",
      "audio_src": "audio/lesson_04/b5.mp3",
      "audio_duration": 8.48
    },
    {
      "id": "b6",
      "label": "6. [Thực hành B3/3] Nghiệm thu AI giảng bài & Chuyển sang Chương 2",
      "duration": 14.15,
      "pose": 6,
      "mode": "sim",
      "pedagogy_type": "practice_step",
      "pedagogy_badge": "🛠️ Thực hành Bước 3/3 · Nghiệm thu Chương 1",
      "pedagogy_title": "Bước 3: Trợ lý AI tự động đọc giáo trình và dẫn dắt thực hành từng bước",
      "pedagogy_note": "Nghiệm thu: AI phản hồi kịch bản tương tác Module 1.1 tại khung chat phải. Tiếp theo: Chương 2 (Bài 5) làm chủ định dạng .md, .csv & Office Viewer.",
      "onEnter": "kudoHidePopovers(); switchToSurface('ide'); kudoRunStart11ExecutedDemo();",
      "focus_selectors": [
        "#ide-chat-messages",
        "#editor-canvas"
      ],
      "cursor_selector": "#ide-chat-messages",
      "cursor_label": "Bước 3: AI bắt đầu dẫn dắt bài học tương tác!",
      "caption": "Ở <strong>Bước 3</strong>, ngay lập tức trợ lý AI tự đọc tài liệu bài học và đóng vai giảng viên hướng dẫn anh chị thực hành từng bước. Chúc mừng anh chị đã hoàn thành <strong>Chương 1</strong>! Bây giờ chúng ta bước sang <strong>Chương 2 — Bài 5</strong> để làm chủ định dạng <code>.md</code> và <code>.csv</code>.",
      "audio_src": "audio/lesson_04/b6.mp3",
      "audio_duration": 13.5
    }
  ]
};
