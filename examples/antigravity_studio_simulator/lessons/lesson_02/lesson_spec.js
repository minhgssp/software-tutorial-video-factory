window.KUDO_SPEC = {
  "code": "BÀI 1.2",
  "title": "Mở thư mục dự án, định dạng Markdown/CSV và bật chế độ tự chủ Turbo",
  "short_title": "1.2 · Open Folder, Markdown/CSV & chế độ Turbo",
  "filename": "lesson_02_turbo_mode_and_workspace.html",
  "description": "Thực hành Open Folder antigravity_course_vn, xem bảng CSV bằng Office Viewer, vào Settings bật quyền Turbo, thu giọng nói Ctrl+M và trích dẫn Ctrl+L.",
  "slides": {
    "s1": "<div>\n                <div class=\"k-slide-header\">\n                  <span class=\"k-slide-kicker\">Phần 2 · Thiết lập không gian làm việc</span>\n                  <span class=\"k-slide-step\">Cảnh 1 / 2 · Lý thuyết</span>\n                </div>\n                <div class=\"k-slide-h1\">Quy tắc mở cả thư mục dự án và ưu thế của định dạng Markdown, CSV</div>\n                <div class=\"k-slide-sub\">Tránh sai lầm mở từng tệp rời rạc khiến trợ lý AI không nhìn thấy các tài liệu liên quan trong dự án.</div>\n              </div>\n              <div class=\"k-grid-2\">\n                <div class=\"k-card k-step-item\" id=\"sl-c1\" data-order=\"1\">\n                  <span class=\"k-card-tag\" style=\"background:#DBEAFE; color:#1E40AF;\">Quy tắc số 1 · Open Folder</span>\n                  <h3>Luôn mở cả thư mục dự án</h3>\n                  <ul>\n                    <li><strong>Không dùng Open File lẻ tẻ:</strong> Mở một tệp đơn lẻ giống như đưa cho trợ lý đúng một tờ giấy rời, họ không biết dữ liệu hay quy tắc nằm ở đâu.</li>\n                    <li><strong>Luôn chọn File -> Open Folder:</strong> Đưa toàn bộ thư mục <code>antigravity_course_vn</code> vào phần mềm để AI tự động đối chiếu các tệp với nhau.</li>\n                  </ul>\n                </div>\n                <div class=\"k-card k-step-item\" id=\"sl-c2\" data-order=\"2\">\n                  <span class=\"k-card-tag\" style=\"background:#FCE7F3; color:#9D174D;\">Quy tắc số 2 · Markdown và CSV</span>\n                  <h3>Tại sao ưu tiên .md và .csv cho dữ liệu nguồn?</h3>\n                  <ul>\n                    <li><strong>Markdown (<code>.md</code>) cho văn bản:</strong> Nhẹ, phân cấp tiêu đề rõ ràng bằng dấu <code>#</code>, giúp AI đọc hiểu cấu trúc nhanh và chính xác.</li>\n                    <li><strong>CSV (<code>.csv</code>) cho bảng số liệu:</strong> Bảng dữ liệu thuần túy ngăn cách bằng dấu phẩy. Nhờ tiện ích <strong>Office Viewer</strong>, bạn vẫn xem và sửa bảng kẻ ô trực quan ngay trong IDE.</li>\n                  </ul>\n                </div>\n              </div>\n              <div class=\"k-callout k-step-item\" id=\"sl-c3\" data-order=\"3\">\n                <span><strong>Mẹo thực hành:</strong> Cài đặt tiện ích <strong>Office Viewer</strong> trong mục Extensions của Antigravity IDE để xem tệp <code>.md</code> và <code>.csv</code> trực quan như Google Docs và Excel.</span>\n              </div>",
    "s2": "<div>\n                <div class=\"k-slide-header\">\n                  <span class=\"k-slide-kicker\">Phần 2 · Tăng tốc thao tác hàng ngày</span>\n                  <span class=\"k-slide-step\">Cảnh 2 / 2 · Lý thuyết</span>\n                </div>\n                <div class=\"k-slide-h1\">Bật quyền tự chủ Turbo và hai phím tắt giao việc nhanh</div>\n                <div class=\"k-slide-sub\">Giảm thao tác bấm xác nhận thủ công và kết hợp nhập liệu bằng giọng nói tiếng Việt.</div>\n              </div>\n              <div class=\"k-grid-3\">\n                <div class=\"k-card k-step-item\" id=\"s2-c1\" data-order=\"1\">\n                  <span class=\"k-card-tag\" style=\"background:#DCFCE7; color:#166534;\">1 · Permissions = Turbo</span>\n                  <h3>Ủy quyền tự động thực thi</h3>\n                  <p>Vào <strong>Settings -> General -> This Computer</strong> và chuyển sang <strong>Turbo</strong> để AI tự tạo tệp, sửa báo cáo và chạy công cụ mà không dừng lại chờ bấm duyệt từng bước nhỏ.</p>\n                </div>\n                <div class=\"k-card k-step-item\" id=\"s2-c2\" data-order=\"2\">\n                  <span class=\"k-card-tag\" style=\"background:#FEF3C7; color:#92400E;\">2 · Voice Input (Ctrl + M)</span>\n                  <h3>Giao việc bằng giọng nói</h3>\n                  <p>Nhấn tổ hợp phím <kbd>Ctrl + M</kbd> hoặc <kbd>Windows + H</kbd> để đọc trực tiếp yêu cầu bằng tiếng Việt nhanh gấp ba lần tốc độ gõ bàn phím.</p>\n                </div>\n                <div class=\"k-card k-step-item\" id=\"s2-c3\" data-order=\"3\">\n                  <span class=\"k-card-tag\" style=\"background:#E0E7FF; color:#3730A3;\">3 · Quote in Chat (Ctrl + L)</span>\n                  <h3>Trích dẫn đoạn văn bôi đen</h3>\n                  <p>Khi đang đọc tài liệu, chỉ cần bôi đen đoạn văn cần sửa rồi nhấn <kbd>Ctrl + L</kbd>, đoạn đó sẽ được đưa thẳng vào khung chat kèm vị trí dòng chính xác.</p>\n                </div>\n              </div>\n              <div class=\"k-callout k-step-item\" id=\"s2-c4\" data-order=\"4\">\n                <span>Hãy quan sát đầy đủ thao tác thực tế ngay trên màn hình: mở thư mục <code>antigravity_course_vn</code>, xem bảng <code>sales_data.csv</code>, vào Settings bật <strong>Turbo</strong>, thu giọng nói <kbd>Ctrl + M</kbd> và trích dẫn <kbd>Ctrl + L</kbd>.</span>\n              </div>"
  },
  "beats": [
    {
      "id": "b1",
      "label": "1. Quy tắc Open Folder",
      "duration": 9.85,
      "mode": "theory",
      "pose": 1,
      "slide": "s1",
      "hl": [
        "sl-c1"
      ],
      "focus_selectors": [
        "#sl-c1"
      ],
      "caption": "Ở bài học thứ hai, chúng ta nắm nguyên tắc nền tảng đầu tiên: luôn chọn Open Folder để mở cả thư mục dự án, không mở từng tệp lẻ tẻ khiến trợ lý AI bị thiếu thông tin liên quan.",
      "audio_src": "audio/lesson_02/b1.mp3",
      "audio_duration": 9.2
    },
    {
      "id": "b2",
      "label": "2. Ưu thế của Markdown và CSV",
      "duration": 10.89,
      "mode": "theory",
      "pose": 2,
      "slide": "s1",
      "hl": [
        "sl-c2"
      ],
      "focus_selectors": [
        "#sl-c2"
      ],
      "caption": "Quy tắc thứ hai là ưu tiên lưu tài liệu hướng dẫn dưới dạng Markdown <code>.md</code> và bảng dữ liệu nguồn dưới dạng <code>.csv</code>. Đây là hai định dạng văn bản gọn nhẹ giúp AI đọc và xử lý nhanh.",
      "audio_src": "audio/lesson_02/b2.mp3",
      "audio_duration": 10.24
    },
    {
      "id": "b3",
      "label": "3. Tiện ích Office Viewer",
      "duration": 11.05,
      "mode": "theory",
      "pose": 3,
      "slide": "s1",
      "hl": [
        "sl-c3"
      ],
      "focus_selectors": [
        "#sl-c3"
      ],
      "caption": "Để người làm văn phòng dễ quan sát, bạn cài đặt tiện ích Office Viewer trong Antigravity IDE để xem tệp <code>.md</code> và <code>.csv</code> dưới dạng văn bản và bảng kẻ ô trực quan.",
      "audio_src": "audio/lesson_02/b3.mp3",
      "audio_duration": 10.4
    },
    {
      "id": "b4",
      "label": "4. Cấp quyền tự chủ Turbo",
      "duration": 8.17,
      "mode": "theory",
      "pose": 4,
      "slide": "s2",
      "hl": [
        "s2-c1"
      ],
      "focus_selectors": [
        "#s2-c1"
      ],
      "caption": "Tiếp theo, để AI không dừng lại hỏi xin phép ở mọi bước nhỏ, chúng ta vào phần cài đặt This Computer và chuyển quyền thực thi sang chế độ Turbo.",
      "audio_src": "audio/lesson_02/b4.mp3",
      "audio_duration": 7.52
    },
    {
      "id": "b5",
      "label": "5. Phím tắt Ctrl + M và Ctrl + L",
      "duration": 9.53,
      "mode": "theory",
      "pose": 5,
      "slide": "s2",
      "hl": [
        "s2-c2",
        "s2-c3",
        "s2-c4"
      ],
      "focus_selectors": [
        "#s2-c2",
        "#s2-c3",
        "#s2-c4"
      ],
      "caption": "Đồng thời, bạn hãy kết hợp phím tắt thu giọng nói <kbd>Ctrl + M</kbd> và thao tác bôi đen văn bản nhấn <kbd>Ctrl + L</kbd> (Quote in Chat) để trích dẫn ngay đoạn cần sửa vào khung trò chuyện.",
      "audio_src": "audio/lesson_02/b5.mp3",
      "audio_duration": 8.88
    },
    {
      "id": "b6",
      "label": "6. Thao tác Open Folder",
      "duration": 12.01,
      "mode": "sim",
      "pose": 2,
      "surface": "ide_welcome",
      "focus_selectors": [
        "#win-open-folder-modal .win-dialog"
      ],
      "focus_pad": 8,
      "cursor_selector": "#win-btn-select-folder",
      "cursor_label": "Chọn thư mục antigravity_course_vn -> Select folder",
      "caption": "Thực hành bước 1: Từ màn hình bắt đầu của Antigravity IDE, bạn bấm nút Open Folder, chọn thư mục <code>antigravity_course_vn</code> trên máy tính rồi nhấn nút Select folder để mở toàn bộ dự án.",
      "onEnter": "kudoHidePopovers(); showIdeWelcomeScreen(); openWinFolderDialog(); selectWinFolder('antigravity_course_vn', document.getElementById('win-folder-row-agy'));",
      "audio_src": "audio/lesson_02/b6.mp3",
      "audio_duration": 11.36
    },
    {
      "id": "b7",
      "label": "7. Xem bảng CSV bằng Office Viewer",
      "duration": 10.33,
      "mode": "sim",
      "pose": 6,
      "surface": "ide_md_csv",
      "focus_selectors": [
        "#office-toolbar",
        "#editor-canvas .wysiwyg-doc"
      ],
      "focus_pad": 8,
      "cursor_selector": "#pill-wysiwyg",
      "cursor_label": "Xem và sửa trực tiếp bảng sales_data.csv",
      "caption": "Thực hành bước 2: Khi bấm vào tệp <code>sales_data.csv</code>, nhờ tiện ích Office Viewer ở cột giữa, dữ liệu hiển thị thành bảng kẻ ô rõ ràng để bạn bấm chuột kiểm tra và sửa số liệu.",
      "onEnter": "kudoHidePopovers(); closeWinFolderDialog(); switchToSurface('ide'); switchIdeSidebarMode('explorer'); currentWorkspaceTreeMode='Antigravity_Basic'; renderFileTree(); setEditorMode('wysiwyg'); openFileInEditor('sales_data.csv');",
      "audio_src": "audio/lesson_02/b7.mp3",
      "audio_duration": 9.68
    },
    {
      "id": "b8",
      "label": "8. Mở nút Settings ở góc trái",
      "duration": 9.29,
      "mode": "sim",
      "pose": 3,
      "surface": "mgr",
      "focus_selectors": [
        "#agy2-settings-btn"
      ],
      "focus_pad": 8,
      "cursor_selector": "#agy2-settings-btn",
      "cursor_label": "Bấm ⚙️ Settings ở góc dưới bên trái",
      "caption": "Thực hành bước 3: Trên cửa sổ Antigravity 2.0, bạn nhìn xuống góc dưới cùng của thanh bên trái và bấm vào nút <code>⚙️ Settings</code> để mở bảng thiết lập quyền tự chủ.",
      "onEnter": "kudoHidePopovers(); closeSettingsModal(); switchToSurface('mgr'); loadAgy2Thread('main');",
      "audio_src": "audio/lesson_02/b8.mp3",
      "audio_duration": 8.64
    },
    {
      "id": "b9",
      "label": "9. Chuyển This Computer sang Turbo",
      "duration": 11.21,
      "mode": "sim",
      "pose": 4,
      "surface": "mgr_settings",
      "focus_selectors": [
        "#set-row-this-computer",
        "#kudo-turbo-popover"
      ],
      "focus_pad": 10,
      "cursor_selector": "#ktp-turbo",
      "cursor_label": "Chọn Turbo trong 4 mức quyền",
      "caption": "Tại thẻ General, dòng This Computer hiển thị 4 mức quyền: Request Review, Default, Auto (Preview) và Turbo. Bạn chọn <code>Turbo</code> có dấu tích xanh để AI tự động thực thi trọn vẹn quy trình.",
      "onEnter": "kudoHidePopovers(); switchToSurface('mgr'); openSettingsModal('general'); kudoOpenTurboPopover();",
      "audio_src": "audio/lesson_02/b9.mp3",
      "audio_duration": 10.56
    },
    {
      "id": "b10",
      "label": "10. Giao việc giọng nói Ctrl + M",
      "duration": 10.97,
      "mode": "sim",
      "pose": 7,
      "surface": "mgr_voice",
      "focus_selectors": [
        "#agy2-input-card-box"
      ],
      "focus_pad": 8,
      "cursor_selector": "#agy2-mic-btn",
      "cursor_label": "Bấm biểu tượng Micro (Ctrl + M)",
      "caption": "Thực hành bước 4: Mở một cuộc hội thoại mới, bạn bấm vào biểu tượng chiếc Micro hoặc nhấn <kbd>Ctrl + M</kbd> để đọc yêu cầu phân tích tệp <code>@sales_data.csv</code> bằng tiếng Việt.",
      "onEnter": "kudoHidePopovers(); closeSettingsModal(); switchToSurface('mgr'); resetAgy2NewConv(); kudoShowKeyHud('🎙️ Nhập liệu bằng giọng nói: <kbd>Ctrl + M</kbd>'); document.getElementById('mgr-voice-bar').classList.add('active'); document.getElementById('agy2-chat-input').value = 'Đọc @sales_data.csv và @troly.md rồi lập báo cáo doanh thu Quý 1 kèm đề xuất cắt giảm 2 sản phẩm lỗ.';",
      "audio_src": "audio/lesson_02/b10.mp3",
      "audio_duration": 10.32
    },
    {
      "id": "b11",
      "label": "11. Bôi đen và nhấn Ctrl + L",
      "duration": 10.97,
      "mode": "sim",
      "pose": 8,
      "surface": "mgr_quote",
      "focus_selectors": [
        "#kudo-quote-highlight",
        "#agy2-quote-btn"
      ],
      "focus_pad": 10,
      "cursor_selector": "#agy2-quote-btn",
      "cursor_label": "Bấm Quote in Chat (Ctrl + L)",
      "caption": "Thực hành bước 5: Khi đọc tài liệu ở khung bên phải, chỗ nào cần sửa bạn chỉ cần bôi đen đoạn văn đó rồi bấm nút Quote in Chat hoặc nhấn <kbd>Ctrl + L</kbd> để trích dẫn thẳng nội dung kèm số dòng vào ô nhập lệnh.",
      "onEnter": "document.getElementById('mgr-voice-bar').classList.remove('active'); kudoShowKeyHud('💬 Trích dẫn đoạn bôi đen: <kbd>Ctrl + L</kbd>'); kudoActivateQuoteDemo();",
      "audio_src": "audio/lesson_02/b11.mp3",
      "audio_duration": 10.32
    }
  ]
};
