window.KUDO_SPEC = {
  "filename": "lesson_02.html",
  "legacy_alias": "lesson_06_giai_nen_zip_open_folder_reveal_explorer.html",
  "code": "BÀI 2",
  "chapter_number": 1,
  "chapter_code": "CHƯƠNG 1",
  "chapter_title": "Khởi động Chuẩn & Làm chủ Giao diện",
  "title": "Chuẩn bị Học liệu: Giải nén .zip, Mở Thư mục & An toàn Ổ cứng",
  "short_title": "Giải nén .zip & Mở Thư mục",
  "pill_label": "Bài 2 · Giải nén & Open Folder",
  "description": "Quy tắc bắt buộc giải nén tệp học liệu .zip trước khi mở, thao tác File -> Open Folder chuẩn xác, nguyên tắc không mở toàn bộ ổ C: và kiểm tra đồng bộ bằng Reveal in File Explorer.",
  "prerequisites": "Bài 1 (Đã mở cửa sổ Antigravity IDE ở màn hình chào mừng Welcome Screen).",
  "dependents": "Bài 3 (Làm chủ giao diện 3 cột trên thư mục vừa mở), Bài 4 (Gọi lệnh /start-1-1 từ thư mục dự án), Bài 5 (Đọc tệp .md/.csv).",
  "placement_risk": "0% Rủi ro — Đặt ngay ở Bài 2 để học viên giải nén và mở đúng thư mục antigravity_course_vn trước khi thực hiện bất kỳ thao tác tệp hay lệnh gạch chéo nào.",
  "continuity_bridge": "Sau khi mở thành công thư mục antigravity_course_vn ở Bài 2, Bài 3 sẽ hướng dẫn điều khiển 3 cột giao diện và các phím cứu hộ khi lỡ tay bấm nhầm.",
  "slides": {
    "s1": "<div>\n      <div class=\"k-slide-header\">\n        <span class=\"k-slide-kicker\">CHƯƠNG 1 · BÀI 2</span>\n        <span class=\"k-slide-step\">Tổng quan &amp; Nguyên lý cốt lõi</span>\n      </div>\n      <div class=\"k-slide-h1\">Ba nguyên tắc an toàn ổ cứng: Giải nén .zip, Mở đúng thư mục và Đồng bộ 1-1</div>\n      <div class=\"k-slide-sub\">Tránh 100% lỗi mất quyền ghi tệp hoặc làm treo máy tính ngay từ buổi học đầu tiên.</div>\n    </div>\n    \n        <div class=\"k-visual-hero-box k-layout-flowchart k-step-item k-hl\" id=\"s1_hero\" data-order=\"1\">\n          <div class=\"k-viz-header\">\n            <span class=\"k-viz-badge\">📊 SƠ ĐỒ QUY TRÌNH CỐT LÕI</span>\n            <span class=\"k-viz-title\">Quy trình 3 bước nạp thư mục dự án chuẩn xác vào Antigravity IDE</span>\n          </div>\n          <svg class=\"k-flow-svg\" viewBox=\"0 0 860 96\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"Quy trình 3 bước nạp thư mục dự án chuẩn xác vào Antigravity IDE\">\n            <path d=\"M262 48 H298\" stroke=\"#EA580C\" stroke-width=\"3\" stroke-linecap=\"round\"/>\n            <polygon points=\"295,42 307,48 295,54\" fill=\"#EA580C\"/>\n            <path d=\"M562 48 H598\" stroke=\"#15803D\" stroke-width=\"3\" stroke-linecap=\"round\"/>\n            <polygon points=\"595,42 607,48 595,54\" fill=\"#15803D\"/>\n            <rect x=\"8\" y=\"8\" width=\"252\" height=\"80\" rx=\"14\" fill=\"#FFF7ED\" stroke=\"#FDBA74\" stroke-width=\"2\"/>\n            <text x=\"134\" y=\"34\" text-anchor=\"middle\" fill=\"#9A3412\" font-size=\"13\" font-weight=\"800\">1. GIẢI NÉN .ZIP</text>\n            <text x=\"134\" y=\"56\" text-anchor=\"middle\" fill=\"#1E293B\" font-size=\"14\" font-weight=\"700\">Chuột phải -> Extract All</text>\n            <text x=\"134\" y=\"76\" text-anchor=\"middle\" fill=\"#475569\" font-size=\"12\">Tạo thư mục thật trên ổ cứng</text>\n            <rect x=\"308\" y=\"8\" width=\"252\" height=\"80\" rx=\"14\" fill=\"#FEF3C7\" stroke=\"#F59E0B\" stroke-width=\"2\"/>\n            <text x=\"434\" y=\"34\" text-anchor=\"middle\" fill=\"#B45309\" font-size=\"13\" font-weight=\"800\">2. FILE -> OPEN FOLDER</text>\n            <text x=\"434\" y=\"56\" text-anchor=\"middle\" fill=\"#1E293B\" font-size=\"14\" font-weight=\"700\">Chọn antigravity_course_vn</text>\n            <text x=\"434\" y=\"76\" text-anchor=\"middle\" fill=\"#475569\" font-size=\"12\">Cấm mở cả ổ đĩa C:\\ hoặc D:\\</text>\n            <rect x=\"608\" y=\"8\" width=\"244\" height=\"80\" rx=\"14\" fill=\"#DCFCE7\" stroke=\"#4ADE80\" stroke-width=\"2\"/>\n            <text x=\"730\" y=\"34\" text-anchor=\"middle\" fill=\"#166534\" font-size=\"13\" font-weight=\"800\">3. ĐỒNG BỘ 1-1</text>\n            <text x=\"730\" y=\"56\" text-anchor=\"middle\" fill=\"#1E293B\" font-size=\"14\" font-weight=\"700\">Reveal in File Explorer</text>\n            <text x=\"730\" y=\"76\" text-anchor=\"middle\" fill=\"#15803D\" font-size=\"12\">Tệp trong IDE chính là tệp trên máy</text>\n          </svg>\n        </div>\n        \n    <div class=\"k-grid-3\">\n      \n        <div class=\"k-card k-step-item k-unreached\" id=\"s1_c1\" data-order=\"2\">\n          <div class=\"k-card-top-row\">\n            <span class=\"k-card-tag\" style=\"background:#FFF1E6; color:#C2410C; border:1px solid #FDBA74;\">NGUYÊN TẮC 1 · GIẢI NÉN</span>\n            <span class=\"k-illus-badge\"><svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#EA580C\" stroke-width=\"2\"><rect x=\"3\" y=\"4\" width=\"18\" height=\"16\" rx=\"3\"/><path d=\"M8 10h8M8 14h5\"/></svg></span>\n          </div>\n          <h3>Luôn Extract All tệp .zip trước</h3>\n          <p>Nếu mở trực tiếp bên trong tệp nén .zip, Windows chỉ tạo thư mục tạm chỉ đọc khiến trợ lý AI không thể lưu kết quả.</p>\n          <div class=\"k-card-mini-note\">📦 Giải nén ra thư mục thường trước khi học</div>\n        </div>\n        \n        <div class=\"k-card k-step-item k-unreached\" id=\"s1_c2\" data-order=\"3\">\n          <div class=\"k-card-top-row\">\n            <span class=\"k-card-tag\" style=\"background:#E0F2FE; color:#0369A1; border:1px solid #7DD3FC;\">NGUYÊN TẮC 2 · OPEN FOLDER</span>\n            <span class=\"k-illus-badge\"><svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#0284C7\" stroke-width=\"2\"><path d=\"M12 2L2 7l10 5 10-5-10-5z\"/><path d=\"M2 17l10 5 10-5M2 12l10 5 10-5\"/></svg></span>\n          </div>\n          <h3>Mở trọn thư mục, không mở tệp lẻ</h3>\n          <p>Luôn vào File chọn Open Folder và trỏ đúng vào thư mục dự án con (như antigravity_course_vn), không mở cả ổ cứng.</p>\n          <div class=\"k-card-mini-note\">📂 Giúp AI nhìn thấy toàn bộ tài liệu liên quan</div>\n        </div>\n        \n        <div class=\"k-card k-step-item k-unreached\" id=\"s1_c3\" data-order=\"4\">\n          <div class=\"k-card-top-row\">\n            <span class=\"k-card-tag\" style=\"background:#DCFCE7; color:#15803D; border:1px solid #86EFAC;\">NGUYÊN TẮC 3 · ĐỒNG BỘ 1-1</span>\n            <span class=\"k-illus-badge\"><svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#16A34A\" stroke-width=\"2\"><path d=\"M22 11.08V12a10 10 0 1 1-5.93-9.14\"/><polyline points=\"22 4 12 14.01 9 11.01\"/></svg></span>\n          </div>\n          <h3>Tệp trên IDE là tệp thật trên máy</h3>\n          <p>Mọi tệp thêm, sửa, xóa trong cột Explorer của phần mềm đều phản chiếu tức thì ngoài Windows File Explorer.</p>\n          <div class=\"k-card-mini-note\">🔍 Kiểm chứng bằng Reveal in File Explorer</div>\n        </div>\n        \n    </div>\n    <div class=\"k-callout k-step-item k-unreached\" id=\"s1_call\" data-order=\"5\">\n      <span>💡</span>\n      <div><strong>Cảnh báo an toàn:</strong> Tuyệt đối không chọn <strong>Open Folder</strong> vào toàn bộ ổ đĩa <code>C:\\</code> hay <code>Desktop</code> chứa hàng vạn tệp cá nhân.</div>\n    </div>"
  },
  "beats": [
    {
      "id": "b1",
      "label": "1. Tổng quan: 3 nguyên tắc Giải nén, Open Folder & Đồng bộ",
      "duration": 14.65,
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
      "caption": "Trước khi nạp học liệu vào màn hình chào mừng của <strong>Antigravity IDE</strong>, anh chị cần nắm vững 3 nguyên tắc trên sơ đồ luồng: Một là phải giải nén tệp <code>.zip</code> bằng <strong>Extract All</strong>; hai là chỉ mở đúng thư mục dự án con; và ba là cơ chế đồng bộ 1-1 với ổ cứng.",
      "audio_src": "audio/lesson_02/b1.mp3",
      "audio_duration": 14.0
    },
    {
      "id": "b2",
      "label": "2. Minh họa: Vì sao dùng Open Folder thay vì Open File",
      "duration": 11.53,
      "pose": 2,
      "mode": "sim",
      "pedagogy_type": "theory_type_2",
      "pedagogy_badge": "💡 Điểm cần lưu ý · Quy trình Mở Dự án",
      "pedagogy_title": "Khác biệt giữa Open File (mở lẻ) và Open Folder (mở trọn dự án)",
      "pedagogy_note": "Open Folder nạp toàn bộ cấu trúc thư mục và bộ não .agent để trợ lý AI hiểu đầy đủ ngữ cảnh công việc.",
      "onEnter": "kudoHidePopovers(); switchToSurface('ide'); showIdeWelcomeScreen(); closeWinFolderDialog(); document.getElementById('ide-file-dropdown').classList.add('show');",
      "focus_selectors": [
        "#ide-menu-file-btn",
        "#ide-file-dropdown"
      ],
      "cursor_selector": "#ide-file-dropdown .dd-row:nth-child(7)",
      "cursor_label": "Luôn chọn Open Folder thay vì Open File",
      "caption": "Nhìn vào trình đơn <strong>File</strong> trên màn hình <strong>Antigravity IDE</strong>, anh chị sẽ thấy hai dòng cạnh nhau. Chúng ta luôn dùng <strong>Open Folder</strong> để mở trọn vẹn thư mục dự án, tuyệt đối không dùng <strong>Open File</strong> mở lẻ tẻ từng tệp.",
      "audio_src": "audio/lesson_02/b2.mp3",
      "audio_duration": 10.88
    },
    {
      "id": "b3",
      "label": "3. Kỹ thuật: Cảnh báo khi lỡ tay kéo thả nhầm thư mục",
      "duration": 10.97,
      "pose": 3,
      "mode": "sim",
      "pedagogy_type": "theory_type_2",
      "pedagogy_badge": "💡 Điểm cần lưu ý · Phòng tránh lỗi thao tác chuột",
      "pedagogy_title": "Xử lý hộp thoại cảnh báo di chuyển nhầm thư mục (Are you sure you want to move...)",
      "pedagogy_note": "Khi dùng chuột ở cột trái, nếu lỡ kéo thư mục này vào thư mục khác, hãy bấm Cancel ngay để bảo toàn cấu trúc.",
      "onEnter": "kudoHidePopovers(); closeIdeMenus(); switchToSurface('ide'); openMoveWarnModal();",
      "focus_selectors": [
        "#ide-move-warn-modal .warn-dialog"
      ],
      "cursor_selector": "#ide-move-warn-modal .warn-dialog button:first-child",
      "cursor_label": "Bấm Cancel ngay khi thấy cảnh báo Move",
      "caption": "Một lưu ý nữa khi thao tác chuột ở cột cây thư mục bên trái là tránh lỡ tay kéo nhầm thư mục này thả vào thư mục khác. Khi thấy bảng cảnh báo hiện ra như trên màn hình, anh chị nhớ bấm ngay nút <strong>Cancel</strong>.",
      "audio_src": "audio/lesson_02/b3.mp3",
      "audio_duration": 10.32
    },
    {
      "id": "b4",
      "label": "4. Bước 1: Chọn thư mục đã giải nén",
      "duration": 11.69,
      "pose": 4,
      "mode": "sim",
      "pedagogy_type": "practice_step",
      "pedagogy_badge": "👆 Thực hành Bước 1/3 · Chọn thư mục",
      "pedagogy_title": "Nạp bộ học liệu antigravity_course_vn đã giải nén vào IDE",
      "pedagogy_note": "Bước 1: Trong hộp thoại Open Folder, bấm chọn đúng thư mục antigravity_course_vn và nhấn nút Select folder.",
      "onEnter": "kudoHidePopovers(); closeMoveWarnModal(); switchToSurface('ide'); openWinFolderDialog();",
      "focus_selectors": [
        "#win-open-folder-modal .win-dialog"
      ],
      "cursor_selector": "#win-btn-select-folder",
      "cursor_label": "Bước 1: Chọn antigravity_course_vn -> Select folder",
      "caption": "Giờ chúng ta thực hành 3 bước nạp học liệu. Ở <strong>Bước 1</strong>, sau khi đã giải nén tệp <code>.zip</code>, trong hộp thoại <strong>Open Folder</strong>, anh chị bấm chọn đúng thư mục <code>antigravity_course_vn</code> rồi nhấn nút <strong>Select folder</strong>.",
      "audio_src": "audio/lesson_02/b4.mp3",
      "audio_duration": 11.04
    },
    {
      "id": "b5",
      "label": "5. Bước 2: Kiểm tra đồng bộ bằng Reveal in File Explorer",
      "duration": 10.65,
      "pose": 5,
      "mode": "sim",
      "pedagogy_type": "practice_step",
      "pedagogy_badge": "👆 Thực hành Bước 2/3 · Thao tác đối chiếu ổ cứng",
      "pedagogy_title": "Bước 2: Chuột phải vào INDEX.md chọn Reveal in File Explorer",
      "pedagogy_note": "Cây thư mục dự án đã hiện ra ở cột trái! Nhấp chuột phải vào INDEX.md để đối chiếu vị trí tệp thật trên máy tính.",
      "onEnter": "kudoHidePopovers(); closeWinFolderDialog(); switchToSurface('ide'); switchIdeSidebarMode('explorer'); openFileInEditor('INDEX.md'); kudoOpenExplorerContextMenu(\"[data-file='INDEX.md']\");",
      "focus_selectors": [
        "#ide-file-tree",
        "#kudo-context-menu"
      ],
      "cursor_selector": "#kcm-reveal-explorer",
      "cursor_label": "Bước 2: Chọn Reveal in File Explorer",
      "caption": "Sang <strong>Bước 2</strong>, toàn bộ cây thư mục dự án đã hiện ra ở cột trái! Để kiểm chứng vị trí tệp thật trên ổ cứng, anh chị nhấp chuột phải vào tệp <code>INDEX.md</code> và chọn dòng <strong>Reveal in File Explorer</strong>.",
      "audio_src": "audio/lesson_02/b5.mp3",
      "audio_duration": 10.0
    },
    {
      "id": "b6",
      "label": "6. Bước 3: Hoàn tất lộ trình học trong INDEX.md",
      "duration": 12.65,
      "pose": 6,
      "mode": "sim",
      "pedagogy_type": "practice_step",
      "pedagogy_badge": "✅ Thực hành Bước 3/3 · Kết quả hoàn thành",
      "pedagogy_title": "Bước 3: Mở tệp bản đồ khóa học INDEX.md ở cột giữa",
      "pedagogy_note": "Cột trái hiện đủ cây thư mục Module_0..Module_6, cột giữa hiển thị bản đồ INDEX.md.",
      "onEnter": "kudoHidePopovers(); closeWinFolderDialog(); switchToSurface('ide'); switchIdeSidebarMode('explorer'); setEditorMode('wysiwyg'); openFileInEditor('INDEX.md');",
      "focus_selectors": [
        "#ide-file-tree",
        "#editor-canvas"
      ],
      "cursor_selector": "[data-file='INDEX.md']",
      "cursor_label": "Bước 3: Đã mở thành công bản đồ INDEX.md",
      "caption": "Ở <strong>Bước 3</strong>, anh chị bấm mở tệp <code>INDEX.md</code> để nghiệm thu toàn bộ lộ trình học tập đã hiển thị rõ ở cột giữa. Sau khi đã mở đúng thư mục, <strong>Bài 3</strong> sẽ giúp anh chị làm chủ hoàn toàn bố cục 3 cột và các phím tắt cứu hộ.",
      "audio_src": "audio/lesson_02/b6.mp3",
      "audio_duration": 12.0
    }
  ]
};
