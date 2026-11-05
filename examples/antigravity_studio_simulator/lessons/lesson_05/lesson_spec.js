window.KUDO_SPEC = {
  "code": "BÀI 5",
  "title": "Thực hành Dự án với Lệnh Gạch chéo",
  "short_title": "Thực hành Lệnh Gạch chéo /",
  "pill_label": "Bài 5 · Thực hành Lệnh /",
  "filename": "lesson_05_taskflow_start_1_1_bay_phim_space.html",
  "description": "Làm quen bối cảnh dự án mẫu TaskFlow, gọi quy trình bằng dấu gạch chéo /start-1-1 đúng cách và trải nghiệm AI dẫn dắt từng bước.",
  "slides": {
    "s1": "<div>\n                <div class=\"k-slide-header\">\n                  <span class=\"k-slide-kicker\">Phần 5 · Thực hành dự án mẫu TaskFlow</span>\n                  <span class=\"k-slide-step\">Cảnh 1 / 1 · Lý thuyết</span>\n                </div>\n                <div class=\"k-slide-h1\">Cách khởi chạy bài thực hành /start-1-1 và tránh lỗi gõ thừa hậu tố</div>\n                <div class=\"k-slide-sub\">Hiểu bối cảnh công ty giả lập TaskFlow Inc. (45 nhân sự) và cách chọn lệnh trong bảng gợi ý của thư mục .agent/workflows.</div>\n              </div>\n              <div class=\"k-grid-2\">\n                <div class=\"k-card k-step-item\" id=\"sl-c1\" data-order=\"1\">\n                  <span class=\"k-card-tag\" style=\"background:#E0F2FE; color:#075985;\">1 · Bối cảnh công ty giả lập TaskFlow</span>\n                  <h3>Đóng vai quản lý vận hành tại TaskFlow Inc.</h3>\n                  <ul>\n                    <li><strong>Quy mô 45 nhân sự:</strong> Bạn làm việc cùng <strong>Alex</strong> (CEO), <strong>Sarah</strong> (Giám đốc Nhân sự) và <strong>Mike</strong> (Giám đốc Kinh doanh) trên bộ dữ liệu thật.</li>\n                    <li><strong>Bài thực hành có hướng dẫn từng bước:</strong> Gõ lệnh <code>/start-1-1</code> vào khung chat để AI dẫn dắt bạn đi qua từng nhiệm vụ nhỏ.</li>\n                  </ul>\n                </div>\n                <div class=\"k-card k-step-item\" id=\"sl-c2\" data-order=\"2\">\n                  <span class=\"k-card-tag\" style=\"background:#FEE2E2; color:#991B1B;\">2 · Lưu ý khi chọn bảng gợi ý lệnh /</span>\n                  <h3>Tránh biến lệnh /start-1-1 thành /start-1-1-1</h3>\n                  <ul>\n                    <li><strong>Nguyên nhân lỗi:</strong> Khi gõ <code>/start</code>, bảng gợi ý hiện ra <code>/start-1-1</code>. Nếu bạn bấm chọn hoặc nhấn phím Cách rồi lại gõ thêm <code>1-1</code>, ô chat sẽ bị lặp thành <code>/start-1-1-1</code>.</li>\n                    <li><strong>Cách thao tác chuẩn:</strong> Nhấp chuột chọn <code>/start-1-1</code> từ danh sách gợi ý rồi nhấn thẳng phím <kbd>Enter</kbd> để gửi đi.</li>\n                  </ul>\n                </div>\n              </div>\n              <div class=\"k-callout k-step-item\" id=\"sl-c3\" data-order=\"3\">\n                <span><strong>Mẹo kiểm tra nhanh:</strong> Quan sát nội dung trong ô nhập lệnh đã hiển thị đúng <code>/start-1-1</code> trước khi nhấn <kbd>Enter</kbd>.</span>\n              </div>"
  },
  "beats": [
    {
      "id": "b1",
      "label": "1. Bối cảnh dự án mẫu TaskFlow",
      "duration": 13.13,
      "mode": "theory",
      "pose": 1,
      "slide": "s1",
      "hl": [
        "sl-c1"
      ],
      "focus_selectors": [
        "#sl-c1"
      ],
      "caption": "Để giúp anh chị thực hành sát thực tế ngay từ buổi đầu, giáo trình đi kèm bộ hồ sơ công ty giả lập TaskFlow Inc. gồm 45 nhân sự. Bạn chỉ cần chạy lệnh <code>/start-1-1</code> để bắt đầu bài thực hành có hướng dẫn từng bước.",
      "audio_src": "audio/lesson_05/b1.mp3",
      "audio_duration": 12.48
    },
    {
      "id": "b2",
      "label": "2. Tránh lỗi lặp khi chọn lệnh /",
      "duration": 12.57,
      "mode": "theory",
      "pose": 4,
      "slide": "s1",
      "hl": [
        "sl-c2",
        "sl-c3"
      ],
      "focus_selectors": [
        "#sl-c2",
        "#sl-c3"
      ],
      "caption": "Một lỗi rất hay gặp là khi bảng gợi ý hiện ra lệnh <code>/start-1-1</code>, học viên bấm chọn xong lại gõ tiếp <code>1-1</code> khiến lệnh bị biến thành <code>/start-1-1-1</code>. Bạn chỉ cần chọn từ bảng gợi ý rồi nhấn <kbd>Enter</kbd> ngay.",
      "audio_src": "audio/lesson_05/b2.mp3",
      "audio_duration": 11.92
    },
    {
      "id": "b3",
      "label": "3. Mở tài liệu 1.1_Welcome.md",
      "duration": 11.13,
      "mode": "sim",
      "pose": 5,
      "surface": "ide",
      "focus_selectors": [
        "#ide-left-sidebar",
        "#editor-canvas"
      ],
      "focus_pad": 6,
      "cursor_selector": "[data-file='1.1_Welcome.md']",
      "cursor_label": "Mở 1.1_Welcome.md trong Module_1_Fundamentals",
      "caption": "Trên Antigravity IDE, khi mở thư mục học liệu <code>antigravity_course_vn</code>, bạn bấm vào tệp <code>1.1_Welcome.md</code> ở cột trái để đọc hướng dẫn mở đầu của bài thực hành TaskFlow.",
      "onEnter": "kudoHidePopovers(); switchToSurface('ide'); switchIdeSidebarMode('explorer'); currentWorkspaceTreeMode='antigravity_course_vn'; renderFileTree(); setEditorMode('wysiwyg'); openFileInEditor('1.1_Welcome.md');",
      "audio_src": "audio/lesson_05/b3.mp3",
      "audio_duration": 10.48
    },
    {
      "id": "b4",
      "label": "4. Gọi quy trình bằng dấu /",
      "duration": 8.57,
      "mode": "sim",
      "pose": 6,
      "surface": "ide",
      "focus_selectors": [
        "#ide-chat-box-card",
        "#ide-popup-menu"
      ],
      "focus_pad": 8,
      "cursor_selector": "#ide-popup-menu .popup-item[data-cmd='/start-1-1']",
      "cursor_label": "Bảng gợi ý hiện /start-1-1",
      "caption": "Tiếp theo, tại ô nhập lệnh bên phải, khi bạn vừa gõ <code>/start</code>, phần mềm sẽ tự động bật bảng gợi ý phía trên hiển thị quy trình <code>/start-1-1</code>.",
      "onEnter": "kudoHidePopovers(); switchToSurface('ide'); currentWorkspaceTreeMode='antigravity_course_vn'; renderFileTree(); openFileInEditor('1.1_Welcome.md'); kudoOpenStartWorkflowPopup();",
      "audio_src": "audio/lesson_05/b4.mp3",
      "audio_duration": 7.92
    },
    {
      "id": "b5",
      "label": "5. Chọn lệnh /start-1-1 chuẩn",
      "duration": 9.37,
      "mode": "sim",
      "pose": 7,
      "surface": "ide",
      "focus_selectors": [
        "#ide-chat-box-card"
      ],
      "focus_pad": 8,
      "cursor_selector": "#ide-send-btn",
      "cursor_label": "Kiểm tra đúng /start-1-1 rồi nhấn Enter",
      "caption": "Sau khi nhấp chuột chọn dòng <code>/start-1-1</code>, toàn bộ tên lệnh đã được điền đủ vào ô nhập liệu. Bạn không gõ thêm số <code>1-1</code> nữa mà nhấn thẳng phím <kbd>Enter</kbd> hoặc bấm nút gửi.",
      "onEnter": "kudoSelectStartWorkflowReadyToSend();",
      "audio_src": "audio/lesson_05/b5.mp3",
      "audio_duration": 8.72
    },
    {
      "id": "b6",
      "label": "6. AI dẫn dắt thực hành từng bước",
      "duration": 8.97,
      "mode": "sim",
      "pose": 8,
      "surface": "ide",
      "focus_selectors": [
        "#ide-right-agent"
      ],
      "focus_pad": 6,
      "cursor_selector": "#ide-chat-messages",
      "cursor_label": "AI đọc kịch bản và dừng chờ bạn phản hồi",
      "caption": "Ngay lập tức, trợ lý AI đọc tệp kịch bản trong thư mục dự án, giới thiệu bối cảnh công ty TaskFlow Inc. và dừng lại ở bước đầu tiên để chờ bạn xác nhận sẵn sàng.",
      "onEnter": "kudoRunStart11ExecutedDemo();",
      "audio_src": "audio/lesson_05/b6.mp3",
      "audio_duration": 8.32
    }
  ]
};
