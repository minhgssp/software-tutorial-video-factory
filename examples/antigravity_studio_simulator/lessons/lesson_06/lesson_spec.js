window.KUDO_SPEC = {
  "code": "BÀI 2.3",
  "title": "Giải nén tệp .zip trước khi mở thư mục và đối chiếu tệp thật bằng Reveal in File Explorer",
  "short_title": "2.3 · Giải nén .zip & Reveal in File Explorer",
  "filename": "lesson_06_giai_nen_zip_open_folder_reveal_explorer.html",
  "description": "Quy tắc Extract All tệp .zip, mở thư mục đã giải nén, bấm Cancel khi kéo thả nhầm thư mục và kiểm chứng đồng bộ 1-1 bằng Reveal in File Explorer.",
  "slides": {
    "s1": "<div>\n                <div class=\"k-slide-header\">\n                  <span class=\"k-slide-kicker\">Phần 6 · Quản lý tệp tin trên máy tính</span>\n                  <span class=\"k-slide-step\">Cảnh 1 / 1 · Lý thuyết</span>\n                </div>\n                <div class=\"k-slide-h1\">Quy tắc giải nén tệp .zip và kiểm tra sự đồng bộ 1-1 với ổ cứng máy tính</div>\n                <div class=\"k-slide-sub\">Hiểu rõ mối liên hệ trực tiếp giữa cây thư mục trong Antigravity IDE và cửa sổ quản lý tệp của hệ điều hành.</div>\n              </div>\n              <div class=\"k-grid-2\">\n                <div class=\"k-card k-step-item\" id=\"sl-c1\" data-order=\"1\">\n                  <span class=\"k-card-tag\" style=\"background:#FEF3C7; color:#92400E;\">Quy tắc 1 · Giải nén tệp .zip</span>\n                  <h3>Phải Extract All trước khi chọn Open Folder</h3>\n                  <ul>\n                    <li><strong>Không mở trực tiếp trong tệp nén:</strong> Khi tải học liệu dạng <code>.zip</code> về máy, nếu chưa giải nén thì Antigravity sẽ không thấy thư mục thật để tạo và lưu tệp mới.</li>\n                    <li><strong>Thao tác chuẩn:</strong> Nhấp chuột phải vào tệp <code>.zip</code>, chọn <strong>Extract All</strong> (Giải nén tất cả) ra một thư mục cố định trên ổ đĩa rồi mới mở trong Antigravity.</li>\n                  </ul>\n                </div>\n                <div class=\"k-card k-step-item\" id=\"sl-c2\" data-order=\"2\">\n                  <span class=\"k-card-tag\" style=\"background:#DCFCE7; color:#166534;\">Quy tắc 2 · Reveal in File Explorer</span>\n                  <h3>Kiểm chứng sự đồng bộ 1-1 với máy tính</h3>\n                  <ul>\n                    <li><strong>Không phải bản sao ảo:</strong> Mọi tệp do AI tạo ra trong cột trái của Antigravity IDE đều là tệp thật nằm ngay trên ổ cứng máy tính của bạn.</li>\n                    <li><strong>Mở nhanh vị trí tệp:</strong> Nhấp chuột phải vào bất kỳ tệp nào ở cột trái và chọn <strong>Reveal in File Explorer</strong> (hoặc <em>Reveal in Finder</em> trên máy Mac) để mở đúng thư mục chứa tệp đó.</li>\n                  </ul>\n                </div>\n              </div>\n              <div class=\"k-callout k-step-item\" id=\"sl-c3\" data-order=\"3\">\n                <span><strong>Lưu ý an toàn:</strong> Tránh kéo thả nhầm thư mục này lồng vào trong thư mục khác trên cột Explorer bên trái; nếu hiện hộp thoại hỏi di chuyển, hãy bấm <strong>Cancel</strong>.</span>\n              </div>"
  },
  "beats": [
    {
      "id": "b1",
      "label": "1. Giải nén tệp .zip trước khi mở",
      "duration": 10.17,
      "mode": "theory",
      "pose": 1,
      "slide": "s1",
      "hl": [
        "sl-c1"
      ],
      "focus_selectors": [
        "#sl-c1"
      ],
      "caption": "Khi tải bộ học liệu hoặc thư mục dự án dạng nén <code>.zip</code> về máy tính, anh chị nhớ nhấp chuột phải chọn Extract All để giải nén thành thư mục thật trên ổ đĩa trước khi bấm Open Folder.",
      "audio_src": "audio/lesson_06/b1.mp3",
      "audio_duration": 9.52
    },
    {
      "id": "b2",
      "label": "2. Đồng bộ 1-1 và tránh kéo nhầm",
      "duration": 12.25,
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
      "caption": "Mọi tệp tin ở cột bên trái của Antigravity IDE đều đồng bộ 1-1 với thư mục thật trên ổ cứng. Bạn có thể kiểm chứng bằng lệnh Reveal in File Explorer và nhớ bấm Cancel nếu lỡ tay kéo nhầm thư mục.",
      "audio_src": "audio/lesson_06/b2.mp3",
      "audio_duration": 11.6
    },
    {
      "id": "b3",
      "label": "3. Mở thư mục đã giải nén",
      "duration": 10.49,
      "mode": "sim",
      "pose": 3,
      "surface": "ide_welcome",
      "focus_selectors": [
        "#win-open-folder-modal .win-dialog"
      ],
      "focus_pad": 8,
      "cursor_selector": "#win-btn-select-folder",
      "cursor_label": "Chọn thư mục đã giải nén antigravity_course_vn",
      "caption": "Sau khi giải nén tệp <code>.zip</code> trên Windows hoặc Mac, bạn vào Antigravity IDE bấm Open Folder, chọn đúng thư mục thường <code>antigravity_course_vn</code> và bấm Select folder.",
      "onEnter": "kudoHidePopovers(); closeMoveWarnModal(); showIdeWelcomeScreen(); openWinFolderDialog(); selectWinFolder('antigravity_course_vn', document.getElementById('win-folder-row-agy'));",
      "audio_src": "audio/lesson_06/b3.mp3",
      "audio_duration": 9.84
    },
    {
      "id": "b4",
      "label": "4. Cảnh báo kéo thả nhầm thư mục",
      "duration": 10.09,
      "mode": "sim",
      "pose": 4,
      "surface": "ide",
      "focus_selectors": [
        "#ide-move-warn-modal .warn-dialog"
      ],
      "focus_pad": 8,
      "cursor_selector": "#ide-move-warn-modal .win-dlg-btn",
      "cursor_label": "Bấm Cancel nếu lỡ tay kéo thả nhầm thư mục",
      "caption": "Trong lúc dùng chuột ở cột cây thư mục bên trái, nếu lỡ tay kéo một thư mục thả vào trong thư mục khác, phần mềm sẽ hiện hộp thoại cảnh báo di chuyển. Bạn hãy bấm ngay nút <code>Cancel</code> để giữ nguyên cấu trúc.",
      "onEnter": "kudoHidePopovers(); closeWinFolderDialog(); switchToSurface('ide'); currentWorkspaceTreeMode='antigravity_course_vn'; renderFileTree(); openMoveWarnModal();",
      "audio_src": "audio/lesson_06/b4.mp3",
      "audio_duration": 9.44
    },
    {
      "id": "b5",
      "label": "5. Chọn Reveal in File Explorer",
      "duration": 10.73,
      "mode": "sim",
      "pose": 6,
      "surface": "ide",
      "focus_selectors": [
        "#ide-left-sidebar",
        "#kudo-context-menu"
      ],
      "focus_pad": 8,
      "cursor_selector": "#kcm-reveal-explorer",
      "cursor_label": "Chuột phải vào INDEX.md -> Reveal in File Explorer",
      "caption": "Để kiểm tra tệp trên ổ cứng, bạn nhấp chuột phải vào tệp <code>INDEX.md</code> ở cột trái và chọn dòng <code>Reveal in File Explorer</code>. Cửa sổ File Explorer của máy tính sẽ mở ra đúng vị trí tệp thật.",
      "onEnter": "closeMoveWarnModal(); switchToSurface('ide'); switchIdeSidebarMode('explorer'); currentWorkspaceTreeMode='antigravity_course_vn'; renderFileTree(); openFileInEditor('INDEX.md'); kudoOpenExplorerContextMenu(\"[data-file='INDEX.md']\");",
      "audio_src": "audio/lesson_06/b5.mp3",
      "audio_duration": 10.08
    },
    {
      "id": "b6",
      "label": "6. Xem tệp INDEX.md của khóa học",
      "duration": 10.41,
      "mode": "sim",
      "pose": 7,
      "surface": "ide",
      "focus_selectors": [
        "#ide-left-sidebar",
        "#editor-canvas"
      ],
      "focus_pad": 6,
      "cursor_selector": "[data-file='INDEX.md']",
      "cursor_label": "Cây thư mục và tệp INDEX.md sẵn sàng",
      "caption": "Khi mở đúng thư mục đã giải nén, toàn bộ học phần từ Module 0 đến Module 6 và bản đồ học tập <code>INDEX.md</code> hiển thị đầy đủ ở cột giữa để bạn và trợ lý AI bắt đầu làm việc.",
      "onEnter": "kudoHidePopovers(); closeMoveWarnModal(); switchToSurface('ide'); switchIdeSidebarMode('explorer'); currentWorkspaceTreeMode='antigravity_course_vn'; renderFileTree(); setEditorMode('wysiwyg'); openFileInEditor('INDEX.md');",
      "audio_src": "audio/lesson_06/b6.mp3",
      "audio_duration": 9.76
    }
  ]
};
