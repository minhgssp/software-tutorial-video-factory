window.KUDO_SPEC = {
  "filename": "lesson_05.html",
  "legacy_alias": "lesson_02_turbo_mode_and_workspace.html",
  "code": "BÀI 5",
  "chapter_number": 2,
  "chapter_code": "CHƯƠNG 2",
  "chapter_title": "Định dạng Dữ liệu, Ký hiệu @ & Hồ sơ Cá nhân hóa",
  "title": "Định dạng Văn bản .md, Bảng Dữ liệu .csv & Tiện ích Office Viewer",
  "short_title": "Định dạng .md, .csv & Office Viewer",
  "pill_label": "Bài 5 · .md, .csv & Office Viewer",
  "description": "Hiểu vì sao Trợ lý AI đọc tệp .md (Markdown) và .csv nhanh và chính xác hơn Word/Excel truyền thống; thực hành cài đặt tiện ích Office Viewer trong Extensions để xem bảng biểu trực quan.",
  "prerequisites": "Chương 1 (Đã biết mở thư mục dự án và chuyển đổi chế độ xem ở cột giữa Antigravity IDE).",
  "dependents": "Bài 6 (Đính kèm tệp @COMPANY.md và @sales_data.csv), Bài 7 (Viết hồ sơ @troly.md), Bài 14 (Phân tích bảng tính CSV).",
  "placement_risk": "0% Rủi ro — Giải thích bản chất tệp .md và .csv trước khi yêu cầu học viên đính kèm hoặc chỉnh sửa các tệp này ở Bài 6 và Bài 7.",
  "continuity_bridge": "Sau khi biết cách đọc và chỉnh sửa tệp .md, .csv đẹp mắt bằng Office Viewer ở Bài 5, Bài 6 sẽ hướng dẫn cách đính kèm các tệp này vào câu lệnh cho AI bằng ký hiệu @.",
  "slides": {
    "s1": "<div>\n      <div class=\"k-slide-header\">\n        <span class=\"k-slide-kicker\">CHƯƠNG 2 · BÀI 5 · LÝ THUYẾT KIỂU 1 ( NGUYÊN LÝ &amp; TRỰC QUAN )</span>\n        <span class=\"k-slide-step\">Bố cục COMPARISON · Nhịp 1/6</span>\n      </div>\n      <div class=\"k-slide-h1\">Vì sao dân văn phòng hiện đại ưu tiên định dạng .md và .csv khi làm việc với AI?</div>\n      <div class=\"k-slide-sub\">Loại bỏ lớp vỏ định dạng nặng nề để AI đọc chính xác 100% nội dung, đồng thời vẫn hiển thị đẹp mắt nhờ Office Viewer.</div>\n    </div>\n    \n        <div class=\"k-visual-hero-box k-layout-comparison\">\n          <div class=\"k-cmp-col k-cmp-before\">\n            <div class=\"k-cmp-badge-old\">❌ CÁCH LÀM CŨ · THỦ CÔNG RỜI RẠC</div>\n            <div class=\"k-cmp-main\">FILE WORD / EXCEL NẶNG — Chứa hàng ngàn thẻ ẩn</div>\n            <div class=\"k-cmp-sub\">AI dễ đọc sót ô gộp phức tạp</div>\n          </div>\n          <div class=\"k-cmp-arrow\">➔</div>\n          <div class=\"k-cmp-col k-cmp-after\">\n            <div class=\"k-cmp-badge-new\">✅ CÁCH LÀM MỚI · TRỢ LÝ AI TRONG THƯ MỤC</div>\n            <div class=\"k-cmp-main\">TỆP CHUẨN .MD & .CSV — 100% văn bản & số liệu tinh khiết</div>\n            <div class=\"k-cmp-sub\">AI đọc tức thì, 0% lỗi định dạng</div>\n          </div>\n          <blockquote class=\"k-quote-box\">\n            <span class=\"k-quote-mark\">“</span>\n            <p>Tệp .md và .csv giống như nguyên liệu đã sơ chế sạch sẽ: Trợ lý AI hấp thụ được ngay trong tích tắc mà không bị vướng vào hàng ngàn thẻ định dạng ẩn của Word hay Excel.</p>\n          </blockquote>\n        </div>\n        \n    <div class=\"k-grid-3\">\n      \n        <div class=\"k-card k-step-item k-hl\" id=\"s1_c1\" data-order=\"1\">\n          <div class=\"k-card-top-row\">\n            <span class=\"k-card-tag\" style=\"background:#FFF1E6; color:#C2410C; border:1px solid #FDBA74;\">ĐỊNH DẠNG .MD (MARKDOWN)</span>\n            <span class=\"k-illus-badge\"><svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#EA580C\" stroke-width=\"2\"><rect x=\"3\" y=\"4\" width=\"18\" height=\"16\" rx=\"3\"/><path d=\"M8 10h8M8 14h5\"/></svg></span>\n          </div>\n          <h3>Văn bản có cấu trúc tiêu đề rõ ràng</h3>\n          <p>Chỉ dùng dấu # cho tiêu đề và dấu * cho gạch đầu dòng, giúp AI phân biệt rành mạch đâu là mục lớn, đâu là ý chi tiết.</p>\n          <div class=\"k-card-mini-note\">📄 Chuẩn mực cho báo cáo, quy trình, hồ sơ</div>\n        </div>\n        \n        <div class=\"k-card k-step-item k-hl\" id=\"s1_c2\" data-order=\"2\">\n          <div class=\"k-card-top-row\">\n            <span class=\"k-card-tag\" style=\"background:#E0F2FE; color:#0369A1; border:1px solid #7DD3FC;\">ĐỊNH DẠNG .CSV (BẢNG TÍNH)</span>\n            <span class=\"k-illus-badge\"><svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#0284C7\" stroke-width=\"2\"><path d=\"M12 2L2 7l10 5 10-5-10-5z\"/><path d=\"M2 17l10 5 10-5M2 12l10 5 10-5\"/></svg></span>\n          </div>\n          <h3>Bảng số liệu thuần túy không lỗi công thức</h3>\n          <p>Mỗi dòng là một bản ghi ngăn cách bằng dấu phẩy, giúp AI tính tổng, lọc trùng và phân tích hàng vạn dòng cực nhanh.</p>\n          <div class=\"k-card-mini-note\">📊 Chuẩn mực cho danh sách, doanh thu, nhân sự</div>\n        </div>\n        \n        <div class=\"k-card k-step-item k-hl\" id=\"s1_c3\" data-order=\"3\">\n          <div class=\"k-card-top-row\">\n            <span class=\"k-card-tag\" style=\"background:#DCFCE7; color:#15803D; border:1px solid #86EFAC;\">TIỆN ÍCH OFFICE VIEWER</span>\n            <span class=\"k-illus-badge\"><svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#16A34A\" stroke-width=\"2\"><path d=\"M22 11.08V12a10 10 0 1 1-5.93-9.14\"/><polyline points=\"22 4 12 14.01 9 11.01\"/></svg></span>\n          </div>\n          <h3>Xem bảng .csv và văn bản .md như Office</h3>\n          <p>Cài tiện ích Office Viewer (của tác giả cweijan) trong mục Extensions để xem bảng kẻ ô rõ nét ngay trong IDE.</p>\n          <div class=\"k-card-mini-note\">🧩 Không cần mở phần mềm Excel bên ngoài</div>\n        </div>\n        \n    </div>\n    <div class=\"k-callout k-step-item k-hl\" id=\"s1_call\" data-order=\"4\">\n      <span>💡</span>\n      <div><strong>Quy tắc vàng Chương 2:</strong> Lưu trữ tri thức nội bộ bằng <code>.md</code> và <code>.csv</code> để AI xử lý tốt nhất; khi gửi đối tác mới xuất ra <code>.docx</code> hoặc <code>.xlsx</code>.</div>\n    </div>"
  },
  "beats": [
    {
      "id": "b1",
      "label": "1. [Lý thuyết Kiểu 1] Đối sánh .md, .csv & tiện ích Office Viewer",
      "duration": 15.38,
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
      "caption": "Chào mừng anh chị bước vào <strong>Chương 2</strong>. Khung đối sánh trên màn hình giải thích vì sao khi làm việc với trợ lý AI, chúng ta ưu tiên dùng tệp văn bản <code>.md</code> và bảng số liệu <code>.csv</code>: Chúng cực nhẹ, chuẩn xác và hiển thị đẹp như Word, Excel nhờ tiện ích <strong>Office Viewer</strong>.",
      "audio_src": "audio/lesson_05/b1.mp3",
      "audio_duration": 14.73
    },
    {
      "id": "b2",
      "label": "2. [Lý thuyết Kiểu 2] So sánh chế độ Raw và Preview của tệp .md",
      "duration": 12.89,
      "pose": 2,
      "mode": "sim",
      "pedagogy_type": "theory_type_2",
      "pedagogy_badge": "📘 Lý thuyết Kiểu 2 · Hai góc nhìn của tệp .md",
      "pedagogy_title": "Chuyển đổi giữa Raw (Mã nguồn có số dòng) và Preview / Office Viewer",
      "pedagogy_note": "Nút Preview hiển thị văn bản đẹp như Google Docs; nút Raw hiển thị số thứ tự từng dòng để trích dẫn chính xác.",
      "onEnter": "kudoHidePopovers(); switchToSurface('ide'); switchIdeSidebarMode('explorer'); openFileInEditor('COMPANY.md'); setEditorMode('wysiwyg');",
      "focus_selectors": [
        "#pill-wysiwyg",
        "#pill-raw",
        "#office-toolbar",
        "#editor-canvas"
      ],
      "cursor_selector": "#pill-wysiwyg",
      "cursor_label": "Chuyển đổi linh hoạt giữa Preview và Raw",
      "caption": "Nhìn vào tệp <code>COMPANY.md</code> đang mở ở cột giữa: Khi bật <strong>Preview / Office Viewer</strong>, anh chị có thanh công cụ in đậm, in nghiêng, kẻ bảng y hệt như Google Docs. Còn khi bấm sang <strong>Raw</strong>, phần mềm sẽ hiện số thứ tự từng dòng.",
      "audio_src": "audio/lesson_05/b2.mp3",
      "audio_duration": 12.24
    },
    {
      "id": "b3",
      "label": "3. [Lý thuyết Kiểu 2] Kho tiện ích Extensions và Office Viewer",
      "duration": 11.29,
      "pose": 3,
      "mode": "sim",
      "pedagogy_type": "theory_type_2",
      "pedagogy_badge": "📘 Lý thuyết Kiểu 2 · Kho Tiện ích Extensions",
      "pedagogy_title": "Cài đặt tiện ích mở rộng trong Extensions (Ctrl + Shift + X)",
      "pedagogy_note": "Tìm từ khóa 'Office Viewer' (tác giả cweijan) và 'Muty PPT Viewer' để xem trực tiếp bảng CSV, Excel, Word và PowerPoint.",
      "onEnter": "kudoHidePopovers(); switchToSurface('ide'); openIdeExtensionsView();",
      "focus_selectors": [
        "#act-btn-extensions",
        "#ide-sb-extensions-view",
        "#editor-canvas"
      ],
      "cursor_selector": "#ide-sb-extensions-view .ext-list-item.selected",
      "cursor_label": "Tiện ích Office Viewer (cweijan) trong Extensions",
      "caption": "Nếu máy tính mới cài đặt chưa có sẵn chế độ xem bảng đẹp, anh chị chỉ cần nhìn sang thanh biểu tượng ngoài cùng bên trái, bấm vào mục <strong>Extensions</strong> có hình bốn ô vuông và cài đặt tiện ích <strong>Office Viewer</strong>.",
      "audio_src": "audio/lesson_05/b3.mp3",
      "audio_duration": 10.64
    },
    {
      "id": "b4",
      "label": "4. [Thực hành B1/3] Bối cảnh & Kiểm tra tiện ích Office Viewer",
      "duration": 11.21,
      "pose": 4,
      "mode": "sim",
      "pedagogy_type": "practice_step",
      "pedagogy_badge": "🛠️ Thực hành Bước 1/3 · Bối cảnh & Cài đặt",
      "pedagogy_title": "Bối cảnh: Phòng kinh doanh gửi bảng doanh thu sales_data.csv cần đọc ngay",
      "pedagogy_note": "Bước 1: Bấm biểu tượng Extensions ở thanh trái, chọn Office Viewer và xác nhận trạng thái đã cài đặt (Installed).",
      "onEnter": "kudoHidePopovers(); switchToSurface('ide'); openIdeExtensionsView(); kudoShowKeyHud('Phím tắt mở nhanh Extensions: <kbd>Ctrl + Shift + X</kbd>');",
      "focus_selectors": [
        "#act-btn-extensions",
        "#ide-sb-extensions-view"
      ],
      "cursor_selector": "#act-btn-extensions",
      "cursor_label": "Bước 1: Mở Extensions kiểm tra Office Viewer",
      "caption": "Chúng ta vào thực hành 3 bước đọc hồ sơ và bảng số liệu. Trong bối cảnh phòng kinh doanh vừa gửi bảng doanh thu, ở <strong>Bước 1</strong>, anh chị bấm vào biểu tượng <strong>Extensions</strong> để xác nhận tiện ích <strong>Office Viewer</strong> đã sẵn sàng.",
      "audio_src": "audio/lesson_05/b4.mp3",
      "audio_duration": 10.56
    },
    {
      "id": "b5",
      "label": "5. [Thực hành B2/3] Mở và đọc bảng tính sales_data.csv trực quan",
      "duration": 11.53,
      "pose": 5,
      "mode": "sim",
      "pedagogy_type": "practice_step",
      "pedagogy_badge": "🛠️ Thực hành Bước 2/3 · Đọc bảng dữ liệu .csv",
      "pedagogy_title": "Bước 2: Quay lại Explorer và bấm mở tệp sales_data.csv",
      "pedagogy_note": "Nhờ Office Viewer, tệp .csv hiển thị thành bảng kẻ ô sắc nét gồm cột Sản phẩm, Doanh thu, Chi phí và Trạng thái.",
      "onEnter": "kudoHidePopovers(); switchToSurface('ide'); switchIdeSidebarMode('explorer'); setEditorMode('wysiwyg'); openFileInEditor('sales_data.csv');",
      "focus_selectors": [
        "#ide-file-tree",
        "#editor-canvas"
      ],
      "cursor_selector": "[data-file='sales_data.csv']",
      "cursor_label": "Bước 2: Bấm mở bảng dữ liệu sales_data.csv",
      "caption": "Sang <strong>Bước 2</strong>, anh chị quay lại cột cây thư mục <strong>Explorer</strong> và bấm vào tệp <code>sales_data.csv</code>. Ngay lập tức, toàn bộ dữ liệu doanh thu hiển thị thành bảng kẻ ô rõ nét mà không cần mở Excel.",
      "audio_src": "audio/lesson_05/b5.mp3",
      "audio_duration": 10.88
    },
    {
      "id": "b6",
      "label": "6. [Thực hành B3/3] Chuyển sang Raw xem số dòng & Tiếp nối Bài 6",
      "duration": 14.49,
      "pose": 6,
      "mode": "sim",
      "pedagogy_type": "practice_step",
      "pedagogy_badge": "🛠️ Thực hành Bước 3/3 · Nghiệm thu & Tiếp nối",
      "pedagogy_title": "Bước 3: Bấm nút </> Raw / Số dòng để kiểm tra cấu trúc gốc",
      "pedagogy_note": "Nghiệm thu: Nắm vững 2 chế độ Preview và Raw của .md/.csv. Tiếp theo: Bài 6 học đính kèm @, giọng nói Ctrl+M và trích dẫn Ctrl+L.",
      "onEnter": "kudoHidePopovers(); switchToSurface('ide'); switchIdeSidebarMode('explorer'); openFileInEditor('COMPANY.md'); setEditorMode('raw');",
      "focus_selectors": [
        "#pill-raw",
        "#editor-canvas"
      ],
      "cursor_selector": "#pill-raw",
      "cursor_label": "Bước 3: Xem chế độ Raw có đánh số dòng",
      "caption": "Ở <strong>Bước 3</strong>, anh chị mở tệp <code>COMPANY.md</code> và bấm thử nút <strong>Raw / Số dòng</strong> để thấy từng dòng văn bản được đánh số thứ tự. Vậy làm sao để chỉ định chính xác các tệp và dòng văn bản này cho AI xử lý? Chúng ta sang ngay <strong>Bài 6</strong>.",
      "audio_src": "audio/lesson_05/b6.mp3",
      "audio_duration": 13.84
    }
  ]
};
