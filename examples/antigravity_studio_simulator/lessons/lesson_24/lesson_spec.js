window.KUDO_SPEC = {
  "filename": "lesson_24.html",
  "legacy_alias": "",
  "code": "BÀI 24",
  "chapter_number": 6,
  "chapter_code": "CHƯƠNG 6",
  "chapter_title": "4 Tình huống Thực chiến Toàn diện (Case Studies)",
  "title": "Tình huống 4 — Tổng duyệt Chất lượng Dự án, Bảo mật (.gitignore) & Lộ trình 30 Ngày",
  "short_title": "Case Study 4: Tổng duyệt & Lộ trình 30 Ngày",
  "pill_label": "Bài 24 · Tổng duyệt & Tốt nghiệp",
  "description": "Mảnh ghép hoàn thiện năng lực Quản trị AI Chuyên nghiệp: Đối chiếu chéo số liệu giữa các tệp báo cáo trước khi bàn giao, thiết lập tệp .gitignore để bảo mật tài liệu nhạy cảm và lập Lộ trình 30 ngày áp dụng thực tế.",
  "prerequisites": "Toàn bộ Bài 1 đến Bài 23 (Đã hoàn thành đầy đủ các tệp sản phẩm Chiến lược, Dữ liệu, Nội dung, Slide, HR và Pháp lý).",
  "dependents": "Áp dụng trực tiếp vào công việc hàng ngày tại doanh nghiệp của học viên sau khi tốt nghiệp khóa Antigravity Basic.",
  "placement_risk": "0% Rủi ro — Bài tổng kết khép kín vòng tròn quản trị: Từ Khởi tạo (Chương 1) -> Dữ liệu (Chương 2) -> Bộ não .agent (Chương 3) -> Đội nhóm (Chương 4) -> Xuất bản (Chương 5) -> Thực chiến & Tổng duyệt bàn giao (Chương 6).",
  "continuity_bridge": "Hoàn thành Bài 24, học viên chính thức tốt nghiệp khóa học Antigravity Basic với trọn bộ công cụ và quy trình sẵn sàng vận hành ngay trong công việc thực tế!",
  "slides": {
    "s1": "<div>\n      <div class=\"k-slide-header\">\n        <span class=\"k-slide-kicker\">CHƯƠNG 6 · BÀI 24</span>\n        <span class=\"k-slide-step\">Tổng quan &amp; Nguyên lý cốt lõi</span>\n      </div>\n      <div class=\"k-slide-h1\">Tình huống Thực chiến 4: Đối chiếu chéo số liệu, Bảo mật (.gitignore) và Lộ trình 30 ngày</div>\n      <div class=\"k-slide-sub\">Bước chốt chặn cuối cùng giúp mọi sản phẩm bạn bàn giao cho Ban Giám đốc và khách hàng đạt độ tin cậy 100%.</div>\n    </div>\n    \n        <div class=\"k-visual-hero-box k-layout-anatomy k-step-item k-hl\" id=\"s1_hero\" data-order=\"1\">\n          <div class=\"k-anat-left\">\n            <div class=\"k-viz-badge\">🧩 SƠ ĐỒ GIẢI PHẪU TRỰC QUAN</div>\n            <div class=\"k-anat-title\">Bản đồ Tổng kết 6 Chương và Quy trình Tổng duyệt Hồ sơ Trước Khi Bàn giao</div>\n            <div class=\"k-anat-pillars\">\n              <div class=\"k-anat-pill\"><strong>CHƯƠNG 1 & 2 · NỀN TẢNG:</strong> Mở dự án, Turbo, .md/.csv, @ (Làm chủ bàn làm việc 3 cột)</div>\n              <div class=\"k-anat-pill\"><strong>CHƯƠNG 3 & 4 · HỆ THỐNG:</strong> Bộ não .agent & Đa luồng (Rules, Skills, Workflows, GitHub)</div>\n              <div class=\"k-anat-pill\"><strong>CHƯƠNG 5 & 6 · THỰC CHIẾN:</strong> Nội dung, Slide & Rà soát chéo (Bảo mật .gitignore & 100% khớp số liệu)</div>\n            </div>\n          </div>\n          <div style=\"display:flex; flex-direction:column; gap:6px; justify-content:space-between;\">\n            <svg viewBox=\"0 0 360 74\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" style=\"width:100%; height:auto; max-height:70px; background:#FFFFFF; border:1px solid #FED7AA; border-radius:8px; padding:3px;\">\n              <rect x=\"6\" y=\"6\" width=\"98\" height=\"62\" rx=\"6\" fill=\"#FFF7ED\" stroke=\"#FB923C\" stroke-width=\"1.5\"/>\n              <text x=\"55\" y=\"25\" text-anchor=\"middle\" fill=\"#9A3412\" font-size=\"10.5\" font-weight=\"800\">1. CỘT TRÁI</text>\n              <text x=\"55\" y=\"41\" text-anchor=\"middle\" fill=\"#334155\" font-size=\"9.5\" font-weight=\"700\">📁 Cây thư mục</text>\n              <text x=\"55\" y=\"56\" text-anchor=\"middle\" fill=\"#C2410C\" font-size=\"9\">Phím: Ctrl + B</text>\n              <rect x=\"110\" y=\"6\" width=\"132\" height=\"62\" rx=\"6\" fill=\"#EFF6FF\" stroke=\"#60A5FA\" stroke-width=\"1.5\"/>\n              <text x=\"176\" y=\"25\" text-anchor=\"middle\" fill=\"#1D4ED8\" font-size=\"10.5\" font-weight=\"800\">2. CỘT GIỮA (TAB)</text>\n              <text x=\"176\" y=\"41\" text-anchor=\"middle\" fill=\"#1E293B\" font-size=\"9.5\" font-weight=\"700\">📄 Chuột phải vào Tab</text>\n              <text x=\"176\" y=\"56\" text-anchor=\"middle\" fill=\"#0369A1\" font-size=\"9\">➔ Open Preview</text>\n              <rect x=\"248\" y=\"6\" width=\"106\" height=\"62\" rx=\"6\" fill=\"#F0FDF4\" stroke=\"#4ADE80\" stroke-width=\"1.5\"/>\n              <text x=\"301\" y=\"25\" text-anchor=\"middle\" fill=\"#15803D\" font-size=\"10.5\" font-weight=\"800\">3. CỘT PHẢI</text>\n              <text x=\"301\" y=\"41\" text-anchor=\"middle\" fill=\"#1E293B\" font-size=\"9.5\" font-weight=\"700\">🤖 Khung Chat AI</text>\n              <text x=\"301\" y=\"56\" text-anchor=\"middle\" fill=\"#166534\" font-size=\"9\">■ · Tiếp tục · Accept</text>\n            </svg>\n            <blockquote class=\"k-quote-box\">\n              <span class=\"k-quote-mark\">“</span>\n              <p>Trước khi trình ký bất kỳ bộ hồ sơ lớn nào, người quản lý giỏi luôn thực hiện hai bước khóa sổ: Một là bảo AI đối chiếu chéo số liệu từ bảng CSV gốc tới trang Slide cuối cùng; hai là đưa các tệp mật vào danh sách .gitignore để chỉ lưu trên máy cá nhân.</p>\n            </blockquote>\n          </div>\n        </div>\n        \n    <div class=\"k-grid-3\">\n      \n        <div class=\"k-card k-step-item k-unreached\" id=\"s1_c1\" data-order=\"2\">\n          <div class=\"k-card-top-row\">\n            <span class=\"k-card-tag\" style=\"background:#FFF1E6; color:#C2410C; border:1px solid #FDBA74;\">CHỐT CHẶN 1 · ĐỐI CHIẾU SỐ LIỆU</span>\n            <span class=\"k-illus-badge\"><svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#EA580C\" stroke-width=\"2\"><rect x=\"3\" y=\"4\" width=\"18\" height=\"16\" rx=\"3\"/><path d=\"M8 10h8M8 14h5\"/></svg></span>\n          </div>\n          <h3>Kiểm tra độ khớp giữa Bảng gốc và Slide</h3>\n          <p>Đính kèm @sales_data.csv cùng @slide_trinh_hdqt_q2.html để AI kiểm tra xem con số doanh thu trên Slide có khớp 100% với bảng gốc không.</p>\n          <div class=\"k-card-mini-note\">🔍 Phát hiện ngay nếu có một con số bị lệch</div>\n        </div>\n        \n        <div class=\"k-card k-step-item k-unreached\" id=\"s1_c2\" data-order=\"3\">\n          <div class=\"k-card-top-row\">\n            <span class=\"k-card-tag\" style=\"background:#E0F2FE; color:#0369A1; border:1px solid #7DD3FC;\">CHỐT CHẶN 2 · BẢO MẬT .GITIGNORE</span>\n            <span class=\"k-illus-badge\"><svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#0284C7\" stroke-width=\"2\"><path d=\"M12 2L2 7l10 5 10-5-10-5z\"/><path d=\"M2 17l10 5 10-5M2 12l10 5 10-5\"/></svg></span>\n          </div>\n          <h3>Giữ riêng tệp nhạy cảm trên máy tính cá nhân</h3>\n          <p>Khai báo tên các tệp bảng lương, hợp đồng mật vào tệp .gitignore để khi đồng bộ dự án lên GitHub, các tệp này không bị đẩy lên đám mây.</p>\n          <div class=\"k-card-mini-note\">🛡️ Bảo vệ an toàn tuyệt đối bí mật doanh nghiệp</div>\n        </div>\n        \n        <div class=\"k-card k-step-item k-unreached\" id=\"s1_c3\" data-order=\"4\">\n          <div class=\"k-card-top-row\">\n            <span class=\"k-card-tag\" style=\"background:#DCFCE7; color:#15803D; border:1px solid #86EFAC;\">LỘ TRÌNH 30 NGÀY SAU KHÓA HỌC</span>\n            <span class=\"k-illus-badge\"><svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#16A34A\" stroke-width=\"2\"><path d=\"M22 11.08V12a10 10 0 1 1-5.93-9.14\"/><polyline points=\"22 4 12 14.01 9 11.01\"/></svg></span>\n          </div>\n          <h3>Ứng dụng ngay vào công việc thật ngày mai</h3>\n          <p>Tuần 1: Tạo thư mục công việc & @troly.md -> Tuần 2: Đóng gói 3 lệnh /workflow -> Tuần 3-4: Nhân rộng cho cả phòng ban.</p>\n          <div class=\"k-card-mini-note\">🎓 Chính thức tốt nghiệp Antigravity Basic!</div>\n        </div>\n        \n    </div>\n    <div class=\"k-callout k-step-item k-unreached\" id=\"s1_call\" data-order=\"5\">\n      <span>💡</span>\n      <div><strong>Quy tắc Vàng Tốt nghiệp:</strong> <em>Giao việc bằng <code>@</code> và <code>/plan</code> — Tự động hóa bằng <code>.agent/</code> — Đối chiếu chéo số liệu &amp; Bảo mật bằng <code>.gitignore</code>.</em></div>\n    </div>"
  },
  "beats": [
    {
      "id": "b1",
      "label": "1. Tổng quan: Bản đồ 6 Chương & Quy trình tổng duyệt dự án",
      "duration": 14.59,
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
      "caption": "Chào mừng anh chị đến với <strong>Bài 24</strong> — bài học cuối cùng khép lại hành trình <strong>Antigravity Basic</strong>! Trước khi bàn giao bất kỳ dự án lớn nào, chúng ta trang bị hai chốt chặn quan trọng nhất: Đối chiếu chéo số liệu giữa các tệp báo cáo và bảo vệ tài liệu mật bằng tệp <code>.gitignore</code>.",
      "audio_src": "audio/lesson_24/b1.mp3",
      "audio_duration": 13.94
    },
    {
      "id": "b2",
      "label": "2. Quan sát: Toàn bộ danh mục tài sản số hóa sau 6 Chương",
      "duration": 15.05,
      "pose": 2,
      "mode": "sim",
      "pedagogy_type": "theory_type_2",
      "pedagogy_badge": "💡 Điểm cần lưu ý · Kho Tài sản Dự án",
      "pedagogy_title": "Rà soát danh mục các tệp báo cáo, chiến lược, slide, HR và pháp lý đã tạo",
      "pedagogy_note": "Toàn bộ công việc từ Chương 1 đến Chương 6 đều kết tinh thành các tệp tài sản thực tế nằm ngay ngắn trên ổ cứng.",
      "onEnter": "kudoSimScene({surface:'ide', breadcrumb:'antigravity_course_vn › Tổng danh mục Tài sản Dự án', editorTitle:'🗂️ Danh mục Tài sản Đã Khởi tạo Trong Suốt Khóa Học', editorHtml:'<div style=\"padding:16px;\"><h3 style=\"color:#9a3412;margin-top:0;\">KHO TÀI SẢN SỐ HÓA CỦA BẠN TRONG THƯ MỤC DỰ ÁN</h3><ul><li><strong>Bộ não điều khiển:</strong> <code>@troly.md</code>, <code>.agent/rules/</code>, <code>.agent/skills/</code>, <code>.agent/workflows/</code></li><li><strong>Dữ liệu &amp; Đề án:</strong> <code>bao_cao_doanh_thu_q1.md</code>, <code>de_an_tong_the_q2.md</code>, <code>ban_giao_cong_viec.md</code></li><li><strong>Truyền thông &amp; Slide:</strong> <code>brand_voice.md</code>, <code>chien_dich_noi_dung_q2.md</code>, <code>slide_trinh_hdqt_q2.html</code></li><li><strong>Thực chiến &amp; Bảo mật:</strong> <code>ke_hoach_giay_ba_mia_2026.md</code>, <code>ho_so_tuyen_dung_cs.md</code>, <code>bao_cao_ra_soat_hop_dong.md</code>, <code>.gitignore</code></li></ul></div>'});",
      "focus_selectors": [
        "#editor-canvas",
        "#ide-file-tree"
      ],
      "cursor_selector": "#editor-canvas",
      "cursor_label": "Trọn bộ tệp tài sản thực tế trên ổ cứng sau 24 bài học",
      "caption": "Nhìn vào cột giữa trên màn hình: Khác hẳn với việc hỏi đáp trên web xong là trôi mất, sau 24 bài học, trong thư mục máy tính của anh chị đã có trọn bộ tài sản từ Bộ não <code>.agent</code>, Báo cáo doanh thu, Chiến dịch nội dung, Bộ Slide cho tới Hồ sơ nhân sự và Pháp lý.",
      "audio_src": "audio/lesson_24/b2.mp3",
      "audio_duration": 14.4
    },
    {
      "id": "b3",
      "label": "3. Kỹ thuật: Đối chiếu chéo số liệu và khóa bảo mật .gitignore",
      "duration": 14.25,
      "pose": 3,
      "mode": "sim",
      "pedagogy_type": "theory_type_2",
      "pedagogy_badge": "💡 Điểm cần lưu ý · Đối chiếu Chéo & Bảo mật",
      "pedagogy_title": "Kiểm tra độ khớp số liệu từ bảng CSV gốc tới trang Slide và cấu hình .gitignore",
      "pedagogy_note": "Đảm bảo 3 tiêu chuẩn trước khi trình ký: (1) Khớp số liệu gốc, (2) Đúng quy chuẩn .agent/rules/, (3) Đã ẩn tệp mật trong .gitignore.",
      "onEnter": "kudoSimScene({surface:'ide', breadcrumb:'antigravity_course_vn › bien_ban_nghiem_thu_du_an.md', editorTitle:'🔍 bien_ban_nghiem_thu_du_an.md — Biên Bản Đối Chiếu & Bảo Mật', editorHtml:'<div style=\"padding:16px;\"><h3 style=\"color:#15803d;margin-top:0;\">BIÊN BẢN TỔNG DUYỆT CHẤT LƯỢNG &amp; BẢO MẬT DỰ ÁN</h3><table style=\"width:100%;border-collapse:collapse;font-size:13px;\"><tr style=\"background:#ecfdf5;\"><th style=\"padding:7px;border:1px solid #6ee7b7;text-align:left;\">Hạng mục kiểm tra</th><th style=\"padding:7px;border:1px solid #6ee7b7;text-align:left;\">Tệp đối chiếu</th><th style=\"padding:7px;border:1px solid #6ee7b7;text-align:center;\">Kết quả</th></tr><tr><td style=\"padding:7px;border:1px solid #6ee7b7;\">1. Độ khớp số liệu Doanh thu Q1</td><td style=\"padding:7px;border:1px solid #6ee7b7;\"><code>sales_data.csv</code> &harr; <code>slide_trinh_hdqt_q2.html</code> (1,85 tỷ VNĐ)</td><td style=\"padding:7px;border:1px solid #6ee7b7;text-align:center;font-weight:700;color:#15803d;\">100% Khớp</td></tr><tr><td style=\"padding:7px;border:1px solid #6ee7b7;\">2. Chỉ tiêu giảm Churn Rate</td><td style=\"padding:7px;border:1px solid #6ee7b7;\"><code>COMPANY.md</code> &harr; <code>ho_so_tuyen_dung_cs.md</code> (6,2% &rarr; 4,3%)</td><td style=\"padding:7px;border:1px solid #6ee7b7;text-align:center;font-weight:700;color:#15803d;\">100% Khớp</td></tr><tr><td style=\"padding:7px;border:1px solid #6ee7b7;\">3. Bảo mật hồ sơ nhạy cảm</td><td style=\"padding:7px;border:1px solid #6ee7b7;\">Đã thêm <code>danh_sach_ung_vien.csv</code> vào <code>.gitignore</code></td><td style=\"padding:7px;border:1px solid #6ee7b7;text-align:center;font-weight:700;color:#15803d;\">An toàn</td></tr></table></div>'});",
      "focus_selectors": [
        "#editor-canvas"
      ],
      "cursor_selector": "#editor-canvas",
      "cursor_label": "Biên bản đối chiếu chéo số liệu 100% khớp & an toàn",
      "caption": "Trên màn hình là biên bản tổng duyệt dự án: Trợ lý tự động đối chiếu con số 1,85 tỷ đồng từ bảng <code>sales_data.csv</code> gốc tới tận trang Slide thuyết trình, đồng thời kiểm tra tệp <code>.gitignore</code> để đảm bảo danh sách ứng viên được bảo mật an toàn.",
      "audio_src": "audio/lesson_24/b3.mp3",
      "audio_duration": 13.6
    },
    {
      "id": "b4",
      "label": "4. Bước 1: Yêu cầu AI đối chiếu chéo số liệu toàn dự án",
      "duration": 10.49,
      "pose": 4,
      "mode": "sim",
      "pedagogy_type": "practice_step",
      "pedagogy_badge": "👆 Thực hành Bước 1/3 · Đối chiếu Chéo Số liệu",
      "pedagogy_title": "Bước 1: Nhập câu lệnh rà soát chéo các tệp báo cáo trước khi trình Hội đồng Quản trị",
      "pedagogy_note": "Đính kèm @COMPANY.md và @sales_data.csv để AI kiểm tra độ khớp số liệu của toàn bộ các tệp đã tạo.",
      "onEnter": "kudoSimScene({surface:'ide', clearChat:true, chatInput:'@COMPANY.md @sales_data.csv Hãy đối chiếu chéo toàn bộ các tệp báo cáo, đề án, slide và hợp đồng trong dự án, đồng thời kiểm tra tệp .gitignore và xuất biên bản vào bien_ban_nghiem_thu_du_an.md'});",
      "focus_selectors": [
        "#ide-chat-input",
        "#ide-send-btn"
      ],
      "cursor_selector": "#ide-send-btn",
      "cursor_label": "Bước 1: Gửi lệnh đối chiếu chéo toàn bộ dự án",
      "caption": "Chúng ta bước vào bài thực hành tổng kết khóa học. Ở <strong>Bước 1</strong>, trước khi đóng gói hồ sơ gửi Ban Giám đốc, anh chị đính kèm tệp gốc và yêu cầu trợ lý đối chiếu chéo số liệu toàn bộ dự án.",
      "audio_src": "audio/lesson_24/b4.mp3",
      "audio_duration": 9.84
    },
    {
      "id": "b5",
      "label": "5. Bước 2: Yêu cầu AI lập Lộ trình 30 ngày áp dụng cho bản thân",
      "duration": 11.93,
      "pose": 5,
      "mode": "sim",
      "pedagogy_type": "practice_step",
      "pedagogy_badge": "👆 Thực hành Bước 2/3 · Lập Lộ trình 30 Ngày",
      "pedagogy_title": "Bước 2: Nhờ AI dựa trên @troly.md để thiết kế kế hoạch 30 ngày áp dụng thực tế",
      "pedagogy_note": "Biến kiến thức trong khóa học thành thói quen hàng ngày tại doanh nghiệp của bạn thông qua tệp lo_trinh_30_ngay_cua_toi.md.",
      "onEnter": "kudoSimScene({surface:'ide', clearChat:true, chatInput:'@troly.md @bien_ban_nghiem_thu_du_an.md Hãy lập giúp tôi Lộ trình 30 ngày ứng dụng Antigravity IDE vào công việc thực tế hàng ngày và lưu tại lo_trinh_30_ngay_cua_toi.md'});",
      "focus_selectors": [
        "#ide-chat-input",
        "#ide-send-btn"
      ],
      "cursor_selector": "#ide-send-btn",
      "cursor_label": "Bước 2: Khởi tạo Lộ trình 30 ngày ứng dụng thực tế",
      "caption": "Sang <strong>Bước 2</strong>, sau khi dự án mẫu đã đạt chuẩn kiểm toán, anh chị đính kèm hồ sơ cá nhân <code>@troly.md</code> và yêu cầu trợ lý thiết kế riêng một <strong>Lộ trình 30 ngày</strong> áp dụng ngay vào công việc thật của anh chị.",
      "audio_src": "audio/lesson_24/b5.mp3",
      "audio_duration": 11.28
    },
    {
      "id": "b6",
      "label": "6. Bước 3: Mở xem Lộ trình 30 ngày & Tốt nghiệp Khóa học!",
      "duration": 17.15,
      "pose": 6,
      "mode": "sim",
      "pedagogy_type": "practice_step",
      "pedagogy_badge": "🎓 Thực hành Bước 3/3 · Tốt nghiệp Antigravity Basic",
      "pedagogy_title": "Bước 3: Hoàn tất tệp lo_trinh_30_ngay_cua_toi.md & Tốt nghiệp khóa học!",
      "pedagogy_note": "Chúc mừng bạn đã hoàn thành trọn vẹn khóa học Antigravity Basic (6 Chương · 24 Bài giảng)!",
      "onEnter": "kudoSimScene({surface:'ide', breadcrumb:'antigravity_course_vn › lo_trinh_30_ngay_cua_toi.md (Tốt nghiệp!)', editorTitle:'🎓 lo_trinh_30_ngay_cua_toi.md — Chúc Mừng Tốt Nghiệp Antigravity Basic!', editorHtml:'<div style=\"padding:18px;background:#fbf8f3;border:2px solid #ea580c;border-radius:12px;\"><h2 style=\"color:#9a3412;margin-top:0;\">🎓 CHÚC MỪNG BẠN ĐÃ HOÀN THÀNH KHÓA HỌC ANTIGRAVITY BASIC!</h2><p><strong>Tổng kết hành trình:</strong> Bạn đã làm chủ hoàn toàn <strong>6 Chương · 24 Bài giảng thực hành</strong>.</p><ul><li><strong>Tuần 1:</strong> Tạo thư mục công việc thật, bật quyền <code>Turbo</code> và thiết lập <code>.agent/rules/</code> cá nhân.</li><li><strong>Tuần 2:</strong> Đóng gói 3 công việc lặp lại hàng tuần thành lệnh gạch chéo <code>/workflow</code>.</li><li><strong>Tuần 3 &amp; 4:</strong> Áp dụng chu trình <code>/grill-me &rarr; /plan &rarr; /learn</code> cho toàn bộ báo cáo và đề án của phòng ban.</li></ul></div>', userMsg:'@troly.md @bien_ban_nghiem_thu_du_an.md Hãy lập Lộ trình 30 ngày ứng dụng tại lo_trinh_30_ngay_cua_toi.md', aiMsg:'Chúc mừng bạn đã hoàn thành trọn vẹn 24 bài giảng của khóa học <strong>Antigravity Basic</strong>! Tệp <code>lo_trinh_30_ngay_cua_toi.md</code> đã sẵn sàng đồng hành cùng bạn trong mọi dự án sắp tới.'});",
      "focus_selectors": [
        "#editor-canvas",
        "#ide-chat-messages"
      ],
      "cursor_selector": "#editor-canvas",
      "cursor_label": "🎓 Chúc mừng tốt nghiệp khóa học Antigravity Basic!",
      "caption": "Và ở <strong>Bước 3</strong>, tấm bản đồ <code>lo_trinh_30_ngay_cua_toi.md</code> đã hiện ra rõ nét trên màn hình. Chúc mừng anh chị đã hoàn thành trọn vẹn <strong>6 Chương, 24 Bài giảng và 144 Điểm neo thực hành</strong> của khóa học <strong>Antigravity Basic</strong>! Chúc anh chị gặt hái thật nhiều thành tựu đột phá cùng Trợ lý AI của mình!",
      "audio_src": "audio/lesson_24/b6.mp3",
      "audio_duration": 16.5
    }
  ]
};
