window.KUDO_SPEC = {
  "filename": "lesson_13.html",
  "legacy_alias": "",
  "code": "BÀI 13",
  "chapter_number": 4,
  "chapter_code": "CHƯƠNG 4",
  "chapter_title": "Xử lý Dữ liệu, Bảng tính & Phối hợp Đội nhóm",
  "title": "Bóc tách Kho Tài liệu Lớn & Tóm tắt Đa tầng Không Tràn Bộ nhớ",
  "short_title": "Bóc tách Kho Tài liệu Lớn",
  "pill_label": "Bài 13 · Bóc tách Tài liệu Lớn",
  "description": "Chiến lược đọc và bóc tách các báo cáo dài hàng trăm trang hoặc hàng chục tệp biên bản họp bằng kỹ thuật lập Bản đồ Mục lục (Index-First) và Tóm tắt Đa tầng mà không làm tràn bộ nhớ AI.",
  "prerequisites": "Chương 2 (Đính kèm @) & Chương 3 (Đóng gói quy trình xử lý tài liệu chuẩn).",
  "dependents": "Bài 14 (Đối chiếu báo cáo chữ với bảng số liệu CSV), Bài 15 (Chia nhỏ kho tài liệu cho nhiều nhánh xử lý song song).",
  "placement_risk": "0% Rủi ro — Học viên học cách xử lý tài liệu văn bản quy mô lớn trước khi chuyển sang xử lý bảng số liệu CSV ở Bài 14.",
  "continuity_bridge": "Sau khi bóc tách xong kho tài liệu văn bản ở Bài 13, Bài 14 sẽ hướng dẫn cách phân tích và làm sạch bảng số liệu kinh doanh .csv đi kèm.",
  "slides": {
    "s1": "<div>\n      <div class=\"k-slide-header\">\n        <span class=\"k-slide-kicker\">CHƯƠNG 4 · BÀI 13</span>\n        <span class=\"k-slide-step\">Tổng quan &amp; Nguyên lý cốt lõi</span>\n      </div>\n      <div class=\"k-slide-h1\">Kỹ thuật đọc báo cáo 200 trang: Lập bản đồ mục lục trước, khoan sâu từng phần sau</div>\n      <div class=\"k-slide-sub\">Tránh sai lầm ném 20 tệp dài vào một câu lệnh khiến AI đọc lướt và bỏ sót thông tin quan trọng.</div>\n    </div>\n    \n        <div class=\"k-visual-hero-box k-layout-flowchart k-step-item k-hl\" id=\"s1_hero\" data-order=\"1\">\n          <div class=\"k-viz-header\">\n            <span class=\"k-viz-badge\">📊 SƠ ĐỒ QUY TRÌNH CỐT LÕI</span>\n            <span class=\"k-viz-title\">Quy trình 3 tầng bóc tách kho tài liệu lớn (Tóm tắt đa tầng có dẫn nguồn)</span>\n          </div>\n          <svg class=\"k-flow-svg\" viewBox=\"0 0 860 96\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"Quy trình 3 tầng bóc tách kho tài liệu lớn (Tóm tắt đa tầng có dẫn nguồn)\">\n            <path d=\"M262 48 H298\" stroke=\"#EA580C\" stroke-width=\"3\" stroke-linecap=\"round\"/>\n            <polygon points=\"295,42 307,48 295,54\" fill=\"#EA580C\"/>\n            <path d=\"M562 48 H598\" stroke=\"#15803D\" stroke-width=\"3\" stroke-linecap=\"round\"/>\n            <polygon points=\"595,42 607,48 595,54\" fill=\"#15803D\"/>\n            <rect x=\"8\" y=\"8\" width=\"252\" height=\"80\" rx=\"14\" fill=\"#FFF7ED\" stroke=\"#FDBA74\" stroke-width=\"2\"/>\n            <text x=\"134\" y=\"34\" text-anchor=\"middle\" fill=\"#9A3412\" font-size=\"13\" font-weight=\"800\">TẦNG 1 · QUÉT MỤC LỤC</text>\n            <text x=\"134\" y=\"56\" text-anchor=\"middle\" fill=\"#1E293B\" font-size=\"14\" font-weight=\"700\">Lập danh mục tệp & chương</text>\n            <text x=\"134\" y=\"76\" text-anchor=\"middle\" fill=\"#475569\" font-size=\"12\">Lưu vào muc_luc_ho_so.md</text>\n            <rect x=\"308\" y=\"8\" width=\"252\" height=\"80\" rx=\"14\" fill=\"#FEF3C7\" stroke=\"#F59E0B\" stroke-width=\"2\"/>\n            <text x=\"434\" y=\"34\" text-anchor=\"middle\" fill=\"#B45309\" font-size=\"13\" font-weight=\"800\">TẦNG 2 · BÓC TÁCH THEO CHỦ ĐỀ</text>\n            <text x=\"434\" y=\"56\" text-anchor=\"middle\" fill=\"#1E293B\" font-size=\"14\" font-weight=\"700\">Đọc sâu từng cụm 2-3 tệp</text>\n            <text x=\"434\" y=\"76\" text-anchor=\"middle\" fill=\"#475569\" font-size=\"12\">Trích xuất quyết định & số liệu</text>\n            <rect x=\"608\" y=\"8\" width=\"244\" height=\"80\" rx=\"14\" fill=\"#DCFCE7\" stroke=\"#4ADE80\" stroke-width=\"2\"/>\n            <text x=\"730\" y=\"34\" text-anchor=\"middle\" fill=\"#166534\" font-size=\"13\" font-weight=\"800\">TẦNG 3 · HỢP NHẤT BÁO CÁO</text>\n            <text x=\"730\" y=\"56\" text-anchor=\"middle\" fill=\"#1E293B\" font-size=\"14\" font-weight=\"700\">Tổng hợp bản tóm tắt điều hành</text>\n            <text x=\"730\" y=\"76\" text-anchor=\"middle\" fill=\"#15803D\" font-size=\"12\">Lưu vào tom_tat_dieu_hanh.md</text>\n          </svg>\n        </div>\n        \n    <div class=\"k-grid-3\">\n      \n        <div class=\"k-card k-step-item k-unreached\" id=\"s1_c1\" data-order=\"2\">\n          <div class=\"k-card-top-row\">\n            <span class=\"k-card-tag\" style=\"background:#FFF1E6; color:#C2410C; border:1px solid #FDBA74;\">TẦNG 1 · LẬP BẢN ĐỒ HỒ SƠ</span>\n            <span class=\"k-illus-badge\"><svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#EA580C\" stroke-width=\"2\"><rect x=\"3\" y=\"4\" width=\"18\" height=\"16\" rx=\"3\"/><path d=\"M8 10h8M8 14h5\"/></svg></span>\n          </div>\n          <h3>Nắm toàn cảnh trong 30 giây đầu tiên</h3>\n          <p>Yêu cầu AI liệt kê danh sách các tệp trong thư mục tài liệu kèm tóm tắt 1 dòng cho mỗi tệp để xác định tệp trọng tâm.</p>\n          <div class=\"k-card-mini-note\">🗺️ Không bao giờ bỏ sót tài liệu quan trọng</div>\n        </div>\n        \n        <div class=\"k-card k-step-item k-unreached\" id=\"s1_c2\" data-order=\"3\">\n          <div class=\"k-card-top-row\">\n            <span class=\"k-card-tag\" style=\"background:#E0F2FE; color:#0369A1; border:1px solid #7DD3FC;\">TẦNG 2 · TRÍCH XUẤT CÓ TRỌNG ĐIỂM</span>\n            <span class=\"k-illus-badge\"><svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#0284C7\" stroke-width=\"2\"><path d=\"M12 2L2 7l10 5 10-5-10-5z\"/><path d=\"M2 17l10 5 10-5M2 12l10 5 10-5\"/></svg></span>\n          </div>\n          <h3>Đọc theo lô tối đa 3 tệp mỗi lượt</h3>\n          <p>Chỉ định AI đọc từng cụm tệp cùng chủ đề để rút ra: Các con số tài chính, Các rủi ro pháp lý, và Các cam kết tiến độ.</p>\n          <div class=\"k-card-mini-note\">🔍 Độ chính xác tuyệt đối, 0% bịa đặt</div>\n        </div>\n        \n        <div class=\"k-card k-step-item k-unreached\" id=\"s1_c3\" data-order=\"4\">\n          <div class=\"k-card-top-row\">\n            <span class=\"k-card-tag\" style=\"background:#DCFCE7; color:#15803D; border:1px solid #86EFAC;\">TẦNG 3 · BÁO CÁO 1 TRANG CHO SẾP</span>\n            <span class=\"k-illus-badge\"><svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#16A34A\" stroke-width=\"2\"><path d=\"M22 11.08V12a10 10 0 1 1-5.93-9.14\"/><polyline points=\"22 4 12 14.01 9 11.01\"/></svg></span>\n          </div>\n          <h3>Chưng cất tinh hoa kèm trích dẫn nguồn</h3>\n          <p>Tổng hợp thành bản Tóm tắt điều hành dài 1 trang, mỗi nhận định đều ghi rõ trích từ tệp nào, dòng số bao nhiêu.</p>\n          <div class=\"k-card-mini-note\">📌 Sếp hỏi số liệu nào, tra ngược ra tệp gốc ngay</div>\n        </div>\n        \n    </div>\n    <div class=\"k-callout k-step-item k-unreached\" id=\"s1_call\" data-order=\"5\">\n      <span>💡</span>\n      <div><strong>Nguyên tắc vàng xử lý tài liệu lớn:</strong> Chia để trị — <em>Quét mục lục tổng thể</em> &rarr; <em>Bóc tách từng cụm</em> &rarr; <em>Hợp nhất có dẫn nguồn</em>.</div>\n    </div>"
  },
  "beats": [
    {
      "id": "b1",
      "label": "1. Tổng quan: Quy trình 3 tầng bóc tách kho tài liệu lớn",
      "duration": 14.69,
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
      "caption": "Chào mừng anh chị bước vào <strong>Chương 4</strong>. Khi phải xử lý hàng chục biên bản họp hay báo cáo dài hàng trăm trang, nếu anh chị đính kèm tất cả vào một câu lệnh thì AI sẽ đọc lướt rất sơ sài. Sơ đồ 3 tầng trên màn hình giúp chúng ta bóc tách sâu mà không sót một chi tiết nào.",
      "audio_src": "audio/lesson_13/b1.mp3",
      "audio_duration": 14.04
    },
    {
      "id": "b2",
      "label": "2. Minh họa: Quan sát kho hồ sơ nhiều tệp trên cây thư mục",
      "duration": 10.65,
      "pose": 2,
      "mode": "sim",
      "pedagogy_type": "theory_type_2",
      "pedagogy_badge": "💡 Điểm cần lưu ý · Quản lý Kho Hồ sơ Lớn",
      "pedagogy_title": "Đối diện với thư mục chứa nhiều tệp tài liệu chiến lược & vận hành",
      "pedagogy_note": "Quan sát cột trái gồm COMPANY.md, INDEX.md, các Module và bảng dữ liệu: Cần lập bản đồ mục lục trước khi đọc sâu.",
      "onEnter": "kudoHidePopovers(); switchToSurface('ide'); switchIdeSidebarMode('explorer'); openFileInEditor('INDEX.md');",
      "focus_selectors": [
        "#ide-file-tree",
        "#editor-canvas"
      ],
      "cursor_selector": "#ide-file-tree",
      "cursor_label": "Kho hồ sơ dự án gồm nhiều tệp văn bản & bảng biểu",
      "caption": "Nhìn vào cây thư mục bên trái trên màn hình: Khi nhận bàn giao một thư mục dự án có hàng chục tệp như thế này, bước đầu tiên không phải là mở đọc mò từng tệp, mà là bảo trợ lý lập bản đồ tổng quan.",
      "audio_src": "audio/lesson_13/b2.mp3",
      "audio_duration": 10.0
    },
    {
      "id": "b3",
      "label": "3. Kỹ thuật: Kỹ thuật gắn trích dẫn nguồn [Tên_tệp#Dòng] khi tóm tắt",
      "duration": 12.09,
      "pose": 3,
      "mode": "sim",
      "pedagogy_type": "theory_type_2",
      "pedagogy_badge": "💡 Điểm cần lưu ý · Tóm tắt Có Trích dẫn Nguồn",
      "pedagogy_title": "Mỗi con số trong bản tóm tắt đều phải ghi rõ lấy từ tệp nào",
      "pedagogy_note": "Yêu cầu AI luôn ghi kèm [Nguồn: @COMPANY.md] bên cạnh mỗi số liệu để đảm bảo kiểm chứng được 100%.",
      "onEnter": "kudoSimScene({surface:'ide', breadcrumb:'antigravity_course_vn › tom_tat_ho_so_taskflow.md', editorTitle:'📑 tom_tat_ho_so_taskflow.md — Bản Tóm Tắt Đa Tầng Có Dẫn Nguồn', editorHtml:'<div style=\"padding:16px;\"><h3 style=\"color:#9a3412;margin-top:0;\">BẢN ĐỒ &amp; TÓM TẮT ĐIỀU HÀNH HỒ SƠ TASKFLOW</h3><ul><li><strong>Quy mô nhân sự &amp; Sản phẩm:</strong> 45 nhân sự, nền tảng SaaS quản lý công việc B2B <em>[Nguồn: @COMPANY.md#L1-L8]</em>.</li><li><strong>Thách thức trọng tâm Quý 2:</strong> Tỷ lệ khách hàng rời bỏ (Churn Rate) ở nhóm SMB cần giảm 30% <em>[Nguồn: @COMPANY.md#L12-L18]</em>.</li><li><strong>Dữ liệu kinh doanh đính kèm:</strong> Bảng doanh thu chi tiết theo khu vực và gói dịch vụ <em>[Nguồn: @sales_data.csv]</em>.</li></ul></div>'});",
      "focus_selectors": [
        "#editor-canvas"
      ],
      "cursor_selector": "#editor-canvas",
      "cursor_label": "Mỗi ý tóm tắt đều gắn nhãn [Nguồn: @Tên_tệp]",
      "caption": "Trên màn hình cột giữa là chuẩn mực của một bản tóm tắt chuyên nghiệp: Cuối mỗi gạch đầu dòng đều ghi rõ <code>[Nguồn: @COMPANY.md]</code> kèm số dòng để khi sếp hỏi con số này lấy ở đâu, anh chị chỉ ra được ngay lập tức.",
      "audio_src": "audio/lesson_13/b3.mp3",
      "audio_duration": 11.44
    },
    {
      "id": "b4",
      "label": "4. Bước 1: Yêu cầu AI quét danh mục hồ sơ",
      "duration": 10.81,
      "pose": 4,
      "mode": "sim",
      "pedagogy_type": "practice_step",
      "pedagogy_badge": "👆 Thực hành Bước 1/3 · Quét Bản đồ Hồ sơ",
      "pedagogy_title": "Chuẩn bị họp Hội đồng Quản trị, cần nắm trọn bộ hồ sơ TaskFlow",
      "pedagogy_note": "Bước 1: Mở tệp INDEX.md ở cột trái để kiểm tra danh mục các tài liệu hiện có trong dự án.",
      "onEnter": "kudoSimScene({surface:'ide', file:'INDEX.md', clearChat:true, chatInput:'@INDEX.md Hãy lập bản đồ danh mục các tệp tài liệu quan trọng nhất trong dự án'});",
      "focus_selectors": [
        "#ide-file-tree",
        "#editor-canvas"
      ],
      "cursor_selector": "[data-file='INDEX.md']",
      "cursor_label": "Bước 1: Kiểm tra danh mục hồ sơ tại INDEX.md",
      "caption": "Chúng ta vào thực hành 3 bước bóc tách hồ sơ phục vụ họp Hội đồng Quản trị. Ở <strong>Bước 1</strong>, anh chị bấm vào tệp <code>INDEX.md</code> ở cột trái để xác định các cụm tài liệu cần tổng hợp.",
      "audio_src": "audio/lesson_13/b4.mp3",
      "audio_duration": 10.16
    },
    {
      "id": "b5",
      "label": "5. Bước 2: Giao lệnh tóm tắt 2 tầng kèm bắt buộc dẫn nguồn",
      "duration": 8.25,
      "pose": 5,
      "mode": "sim",
      "pedagogy_type": "practice_step",
      "pedagogy_badge": "👆 Thực hành Bước 2/3 · Ra lệnh Bóc tách Có Dẫn nguồn",
      "pedagogy_title": "Bước 2: Nhập lệnh bóc tách @COMPANY.md và @1.1_Welcome.md vào ô chat",
      "pedagogy_note": "Yêu cầu rõ: Tóm tắt thành 3 phần (Bối cảnh, Thách thức, Hành động) và bắt buộc ghi [Nguồn: @tên_tệp] sau mỗi ý.",
      "onEnter": "kudoSimScene({surface:'ide', file:'COMPANY.md', clearChat:true, chatInput:'@COMPANY.md @1.1_Welcome.md Hãy bóc tách hồ sơ công ty thành 3 mục (Quy mô, Thách thức Quý 2, Trọng tâm hành động), gắn trích dẫn [Nguồn] cho từng ý và lưu vào tệp tom_tat_hdqt.md'});",
      "focus_selectors": [
        "#ide-chat-input",
        "#ide-send-btn"
      ],
      "cursor_selector": "#ide-send-btn",
      "cursor_label": "Bước 2: Gửi lệnh bóc tách đa tầng kèm dẫn nguồn",
      "caption": "Sang <strong>Bước 2</strong>, anh chị đính kèm cụm tệp hồ sơ vào ô chat, yêu cầu trợ lý bóc tách thành 3 mục kèm trích dẫn nguồn chính xác rồi nhấn nút Gửi.",
      "audio_src": "audio/lesson_13/b5.mp3",
      "audio_duration": 7.6
    },
    {
      "id": "b6",
      "label": "6. Bước 3: Hoàn tất tệp tom_tat_hdqt.md",
      "duration": 13.37,
      "pose": 6,
      "mode": "sim",
      "pedagogy_type": "practice_step",
      "pedagogy_badge": "✅ Thực hành Bước 3/3 · Kết quả hoàn thành",
      "pedagogy_title": "Bước 3: Kiểm tra kết quả bản tóm tắt Hội đồng Quản trị có trích dẫn dòng 100%",
      "pedagogy_note": "Tệp tom_tat_hdqt.md súc tích, rõ nguồn gốc từng con số.",
      "onEnter": "kudoSimScene({surface:'ide', breadcrumb:'antigravity_course_vn › tom_tat_hdqt.md (Đã kiểm chứng nguồn)', editorTitle:'📑 tom_tat_hdqt.md — Báo Cáo Tóm Tắt Trình HĐQT', editorHtml:'<div style=\"padding:16px;\"><h2 style=\"color:#9a3412;margin-top:0;\">TÓM TẮT ĐIỀU HÀNH TRÌNH HỘI ĐỒNG QUẢN TRỊ</h2><ol><li><strong>Quy mô vận hành:</strong> 45 nhân sự tại 3 khối Kỹ thuật, Kinh doanh, CS <em>[Nguồn: @COMPANY.md#L3-L6]</em>.</li><li><strong>Điểm nghẽn cần xử lý:</strong> Thời gian hướng dẫn khách hàng mới (Onboarding) đang mất 14 ngày <em>[Nguồn: @COMPANY.md#L14-L16]</em>.</li><li><strong>Mục tiêu ưu tiên:</strong> Rút ngắn thời gian Onboarding xuống còn 3 ngày bằng cổng tự động <em>[Nguồn: @1.1_Welcome.md#L9-L12]</em>.</li></ol></div>', userMsg:'@COMPANY.md @1.1_Welcome.md Hãy bóc tách hồ sơ công ty thành 3 mục, gắn trích dẫn [Nguồn] và lưu vào tom_tat_hdqt.md', aiMsg:'Đã hoàn tất bóc tách 2 tầng và lưu tại <code>tom_tat_hdqt.md</code>! Toàn bộ 100% số liệu đều có nhãn <code>[Nguồn]</code> để bạn đối chiếu tức thì.'});",
      "focus_selectors": [
        "#editor-canvas",
        "#ide-chat-messages"
      ],
      "cursor_selector": "#editor-canvas",
      "cursor_label": "Bước 3: Hoàn tất tom_tat_hdqt.md có dẫn nguồn đầy đủ",
      "caption": "Ở <strong>Bước 3</strong>, bản tóm tắt trình Hội đồng Quản trị đã hiện ra ở cột giữa với đầy đủ trích dẫn nguồn cho từng con số. Sau khi xử lý xong phần văn bản, chúng ta bước sang <strong>Bài 14</strong> để phân tích bảng số liệu doanh thu <code>sales_data.csv</code>!",
      "audio_src": "audio/lesson_13/b6.mp3",
      "audio_duration": 12.72
    }
  ]
};
