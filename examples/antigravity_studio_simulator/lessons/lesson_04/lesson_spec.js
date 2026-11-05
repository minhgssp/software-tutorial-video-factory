window.KUDO_SPEC = {
  "code": "BÀI 2.1",
  "title": "Cách vượt qua cảm giác bỡ ngỡ ban đầu và thói quen hỏi trực tiếp trợ lý AI",
  "short_title": "2.1 · Xử lý khi AI dừng & hỏi trực tiếp AI",
  "filename": "lesson_04_vuot_qua_con_ngop_hoi_nguoc_ai.html",
  "description": "Xử lý 3 tình huống AI dừng/chờ (Stop, Tiếp tục, Accept), bật/tắt cây thư mục Ctrl+B, bật Preview / Office Viewer và hỏi trực tiếp AI.",
  "slides": {
    "s1": "<div>\n                <div class=\"k-slide-header\">\n                  <span class=\"k-slide-kicker\">Phần 4 · Tâm lý thực hành cho người mới</span>\n                  <span class=\"k-slide-step\">Cảnh 1 / 1 · Lý thuyết</span>\n                </div>\n                <div class=\"k-slide-h1\">Xử lý 3 tình huống AI tạm dừng và biến AI thành người hướng dẫn tại chỗ</div>\n                <div class=\"k-slide-sub\">Người làm văn phòng không cần thuộc lòng các nút bấm kỹ thuật; hãy nắm 3 cách xử lý khi AI dừng và hỏi thẳng vào khung chat.</div>\n              </div>\n              <div class=\"k-grid-2\">\n                <div class=\"k-card k-step-item\" id=\"sl-c1\" data-order=\"1\">\n                  <span class=\"k-card-tag\" style=\"background:#FEF3C7; color:#92400E;\">1 · Ba tình huống AI dừng hoặc chờ</span>\n                  <h3>Cách xử lý ngay trong 5 giây</h3>\n                  <ul>\n                    <li><strong>AI đang chạy nhưng bạn muốn dừng:</strong> Bấm nút vuông <code>■ Stop</code> ở góc phải khung nhập lệnh.</li>\n                    <li><strong>AI đang làm dở rồi dừng giữa chừng:</strong> Chỉ cần gõ chữ <code>Tiếp tục</code> và nhấn <kbd>Enter</kbd>.</li>\n                    <li><strong>AI hiện hộp thoại chờ xác nhận:</strong> Bấm nút <code>Accept</code> (hoặc bật chế độ <code>Turbo</code> để tự động duyệt).</li>\n                  </ul>\n                </div>\n                <div class=\"k-card k-step-item\" id=\"sl-c2\" data-order=\"2\">\n                  <span class=\"k-card-tag\" style=\"background:#DCFCE7; color:#166534;\">2 · Phím tắt khôi phục giao diện &amp; hỏi AI</span>\n                  <h3>Không sợ bấm nhầm làm mất cửa sổ</h3>\n                  <ul>\n                    <li><strong>Bật/tắt cột cây thư mục bên trái:</strong> Nhấn tổ hợp phím <kbd>Ctrl + B</kbd>.</li>\n                    <li><strong>Trích dẫn đoạn văn vào khung chat:</strong> Bôi đen văn bản và nhấn <kbd>Ctrl + L</kbd>.</li>\n                    <li><strong>Chuyển chế độ đọc đẹp:</strong> Bấm nút <code>👁️ Preview / Office Viewer</code> ở góc trên bên phải khung giữa.</li>\n                  </ul>\n                </div>\n              </div>\n              <div class=\"k-callout k-step-item\" id=\"sl-c3\" data-order=\"3\">\n                <span><strong>Nguyên tắc vàng:</strong> Khi gặp thông báo lạ hoặc quên nút bấm, hãy chụp màn hình (<kbd>Ctrl + V</kbd>) hoặc hỏi bằng tiếng Việt tự nhiên ngay trong khung chat bên phải.</span>\n              </div>"
  },
  "beats": [
    {
      "id": "b1",
      "label": "1. Ba tình huống AI dừng/chờ",
      "duration": 11.21,
      "mode": "theory",
      "pose": 1,
      "slide": "s1",
      "hl": [
        "sl-c1"
      ],
      "focus_selectors": [
        "#sl-c1"
      ],
      "caption": "Trong buổi đầu thực hành, nếu thấy AI dừng lại hoặc chạy chưa đúng ý, anh chị chỉ cần nhớ 3 thao tác: bấm nút <code>■ Stop</code> để dừng, gõ <code>Tiếp tục</code> nếu AI ngắt quãng, hoặc bấm <code>Accept</code> khi AI xin phép chạy lệnh.",
      "audio_src": "audio/lesson_04/b1.mp3",
      "audio_duration": 10.56
    },
    {
      "id": "b2",
      "label": "2. Phím tắt khôi phục giao diện",
      "duration": 10.09,
      "mode": "theory",
      "pose": 2,
      "slide": "s1",
      "hl": [
        "sl-c2",
        "sl-c3"
      ],
      "focus_selectors": [
        "#sl-c2",
        "#sl-c3"
      ],
      "caption": "Nếu lỡ tay làm ẩn cột cây thư mục, bạn chỉ cần nhấn <kbd>Ctrl + B</kbd> để mở lại. Và bất cứ khi nào quên thao tác, hãy gõ câu hỏi bằng tiếng Việt tự nhiên ngay tại khung chat bên phải.",
      "audio_src": "audio/lesson_04/b2.mp3",
      "audio_duration": 9.44
    },
    {
      "id": "b3",
      "label": "3. Thực hành Stop, Tiếp tục, Accept",
      "duration": 11.29,
      "mode": "sim",
      "pose": 4,
      "surface": "ide",
      "focus_selectors": [
        "#ide-chat-messages",
        "#ide-chat-box-card"
      ],
      "focus_pad": 6,
      "cursor_selector": "#kudo-accept-step-btn",
      "cursor_label": "Bấm Accept hoặc gõ 'Tiếp tục' / bấm ■ Stop",
      "caption": "Trên giao diện Antigravity IDE, khi AI dừng lại hỏi quyền tạo tệp báo cáo, bạn bấm nút <code>Accept</code> màu xanh; nếu muốn dừng ngay thì bấm nút <code>■</code> ở góc dưới khung chat, hoặc gõ <code>Tiếp tục</code> để AI hoàn tất.",
      "onEnter": "kudoRunThreeStuckStatesDemo();",
      "audio_src": "audio/lesson_04/b3.mp3",
      "audio_duration": 10.64
    },
    {
      "id": "b4",
      "label": "4. Bật/tắt cột trái bằng Ctrl + B",
      "duration": 10.89,
      "mode": "sim",
      "pose": 5,
      "surface": "ide",
      "focus_selectors": [
        "#ide-left-sidebar"
      ],
      "focus_pad": 6,
      "cursor_selector": "#act-btn-explorer",
      "cursor_label": "Nhấn Ctrl + B hoặc bấm biểu tượng Explorer",
      "caption": "Khi bạn lỡ tay bấm ẩn mất cột cây thư mục bên trái, chỉ cần nhấn tổ hợp phím <kbd>Ctrl + B</kbd> hoặc bấm vào biểu tượng hai tệp giấy trên thanh công cụ ngoài cùng bên trái là cây thư mục hiện lại ngay.",
      "onEnter": "kudoShowKeyHud('🗂️ Bật/tắt cây thư mục: <kbd>Ctrl + B</kbd>'); switchToSurface('ide'); switchIdeSidebarMode('explorer'); document.getElementById('ide-left-sidebar').style.display='flex';",
      "audio_src": "audio/lesson_04/b4.mp3",
      "audio_duration": 10.24
    },
    {
      "id": "b5",
      "label": "5. Chuyển sang Preview / Office Viewer",
      "duration": 11.61,
      "mode": "sim",
      "pose": 6,
      "surface": "ide",
      "focus_selectors": [
        "#ide-tabs-bar",
        "#office-toolbar"
      ],
      "focus_pad": 8,
      "cursor_selector": "#pill-wysiwyg",
      "cursor_label": "Bấm 👁️ Preview / Office Viewer",
      "caption": "Nếu thấy tệp <code>0.1_Introduction.md</code> hiển thị nhiều ký hiệu dấu thăng ở chế độ Raw, bạn nhìn lên thanh tiêu đề cột giữa và bấm vào nút <code>👁️ Preview / Office Viewer</code> để đọc trình bày trực quan.",
      "onEnter": "kudoHidePopovers(); switchToSurface('ide'); setEditorMode('wysiwyg'); openFileInEditor('0.1_Introduction.md');",
      "audio_src": "audio/lesson_04/b5.mp3",
      "audio_duration": 10.96
    },
    {
      "id": "b6",
      "label": "6. Hỏi trực tiếp AI tại khung chat",
      "duration": 9.21,
      "mode": "sim",
      "pose": 8,
      "surface": "ide",
      "focus_selectors": [
        "#ide-right-agent"
      ],
      "focus_pad": 6,
      "cursor_selector": "#ide-chat-input",
      "cursor_label": "Hỏi thẳng AI bằng tiếng Việt tự nhiên",
      "caption": "Như anh chị thấy ở cột phải, chỉ cần hỏi bằng lời tự nhiên, trợ lý AI sẽ chỉ rõ phím tắt <kbd>Ctrl + B</kbd> và vị trí nút <code>👁️ Preview / Office Viewer</code> ngay lập tức.",
      "onEnter": "kudoRunAskAiWhenStuckDemo();",
      "audio_src": "audio/lesson_04/b6.mp3",
      "audio_duration": 8.56
    }
  ]
};
