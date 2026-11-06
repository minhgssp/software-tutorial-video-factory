window.KUDO_SPEC = {
  "filename": "lesson_15.html",
  "legacy_alias": "",
  "code": "BÀI 15",
  "chapter_number": 4,
  "chapter_code": "CHƯƠNG 4",
  "chapter_title": "Xử lý Dữ liệu, Bảng tính & Phối hợp Đội nhóm",
  "title": "Phối hợp Nhiều Luồng Công việc Song song Cho Dự án Lớn",
  "short_title": "Phối hợp Đa Luồng Song song",
  "pill_label": "Bài 15 · Đa Luồng Song song",
  "description": "Nhân gấp 3 tốc độ xử lý công việc bằng cách chia một dự án lớn thành nhiều nhánh độc lập và điều phối các luồng Trợ lý AI song song (Multi-Threads) làm việc đồng thời trên Antigravity 2.0 và IDE.",
  "prerequisites": "Bài 13 (Bóc tách tài liệu) & Bài 14 (Phân tích bảng tính CSV).",
  "dependents": "Bài 16 (Đồng bộ toàn bộ kết quả của các luồng công việc song song lên GitHub và Google Drive).",
  "placement_risk": "0% Rủi ro — Học viên đã thành thạo việc giao 1 nhiệm vụ đơn lẻ trước khi học cách tách 3 nhiệm vụ chạy song song.",
  "continuity_bridge": "Sau khi tạo ra nhiều tệp báo cáo từ các luồng chạy song song ở Bài 15, Bài 16 sẽ hướng dẫn cách đồng bộ và sao lưu toàn bộ kho kết quả này lên đám mây cho đồng nghiệp.",
  "slides": {
    "s1": "<div>\n      <div class=\"k-slide-header\">\n        <span class=\"k-slide-kicker\">CHƯƠNG 4 · BÀI 15</span>\n        <span class=\"k-slide-step\">Tổng quan &amp; Nguyên lý cốt lõi</span>\n      </div>\n      <div class=\"k-slide-h1\">Từ 1 trợ lý làm tuần tự sang Đội ngũ 3 Chuyên viên AI chạy song song cùng lúc</div>\n      <div class=\"k-slide-sub\">Rút ngắn thời gian chuẩn bị bộ hồ sơ dự án từ 3 giờ xuống còn 15 phút nhờ cơ chế phân việc độc lập.</div>\n    </div>\n    \n        <div class=\"k-visual-hero-box k-layout-anatomy k-step-item k-hl\" id=\"s1_hero\" data-order=\"1\">\n          <div class=\"k-anat-left\">\n            <div class=\"k-viz-badge\">🧩 SƠ ĐỒ GIẢI PHẪU TRỰC QUAN</div>\n            <div class=\"k-anat-title\">Mô hình Trưởng phòng (Bạn) điều phối 3 Nhánh Trợ lý AI chạy đồng thời</div>\n            <div class=\"k-anat-pillars\">\n              <div class=\"k-anat-pill\"><strong>NHÁNH 1 · TRỢ LÝ DỮ LIỆU:</strong> Phân tích bảng doanh thu (Xuất bao_cao_doanh_thu_q1.md)</div>\n              <div class=\"k-anat-pill\"><strong>NHÁNH 2 · TRỢ LÝ NHÂN SỰ:</strong> Đánh giá định biên 45 người (Xuất de_xuat_nhan_su_q2.md)</div>\n              <div class=\"k-anat-pill\"><strong>NHÁNH 3 · TRỢ LÝ ĐỐI THỦ:</strong> So sánh tính năng thị trường (Xuất bang_doi_sanh_doi_thu.md)</div>\n            </div>\n          </div>\n          <div style=\"display:flex; flex-direction:column; gap:6px; justify-content:space-between;\">\n            <svg viewBox=\"0 0 360 74\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" style=\"width:100%; height:auto; max-height:70px; background:#FFFFFF; border:1px solid #FED7AA; border-radius:8px; padding:3px;\">\n              <rect x=\"6\" y=\"6\" width=\"98\" height=\"62\" rx=\"6\" fill=\"#FFF7ED\" stroke=\"#FB923C\" stroke-width=\"1.5\"/>\n              <text x=\"55\" y=\"25\" text-anchor=\"middle\" fill=\"#9A3412\" font-size=\"10.5\" font-weight=\"800\">1. CỘT TRÁI</text>\n              <text x=\"55\" y=\"41\" text-anchor=\"middle\" fill=\"#334155\" font-size=\"9.5\" font-weight=\"700\">📁 Cây thư mục</text>\n              <text x=\"55\" y=\"56\" text-anchor=\"middle\" fill=\"#C2410C\" font-size=\"9\">Phím: Ctrl + B</text>\n              <rect x=\"110\" y=\"6\" width=\"132\" height=\"62\" rx=\"6\" fill=\"#EFF6FF\" stroke=\"#60A5FA\" stroke-width=\"1.5\"/>\n              <text x=\"176\" y=\"25\" text-anchor=\"middle\" fill=\"#1D4ED8\" font-size=\"10.5\" font-weight=\"800\">2. CỘT GIỮA (TAB)</text>\n              <text x=\"176\" y=\"41\" text-anchor=\"middle\" fill=\"#1E293B\" font-size=\"9.5\" font-weight=\"700\">📄 Chuột phải vào Tab</text>\n              <text x=\"176\" y=\"56\" text-anchor=\"middle\" fill=\"#0369A1\" font-size=\"9\">➔ Open Preview</text>\n              <rect x=\"248\" y=\"6\" width=\"106\" height=\"62\" rx=\"6\" fill=\"#F0FDF4\" stroke=\"#4ADE80\" stroke-width=\"1.5\"/>\n              <text x=\"301\" y=\"25\" text-anchor=\"middle\" fill=\"#15803D\" font-size=\"10.5\" font-weight=\"800\">3. CỘT PHẢI</text>\n              <text x=\"301\" y=\"41\" text-anchor=\"middle\" fill=\"#1E293B\" font-size=\"9.5\" font-weight=\"700\">🤖 Khung Chat AI</text>\n              <text x=\"301\" y=\"56\" text-anchor=\"middle\" fill=\"#166534\" font-size=\"9\">■ · Tiếp tục · Accept</text>\n            </svg>\n            <blockquote class=\"k-quote-box\">\n              <span class=\"k-quote-mark\">“</span>\n              <p>Một giám đốc giỏi không bắt một nhân viên vừa tính kế toán, vừa đi khảo sát thị trường, vừa viết quy chế nhân sự cùng một lúc. Hãy tách mỗi đầu việc cho một luồng Trợ lý AI chuyên biệt.</p>\n            </blockquote>\n          </div>\n        </div>\n        \n    <div class=\"k-grid-3\">\n      \n        <div class=\"k-card k-step-item k-unreached\" id=\"s1_c1\" data-order=\"2\">\n          <div class=\"k-card-top-row\">\n            <span class=\"k-card-tag\" style=\"background:#FFF1E6; color:#C2410C; border:1px solid #FDBA74;\">NGUYÊN TẮC 1 · ĐỘC LẬP TỆP ĐẦU RA</span>\n            <span class=\"k-illus-badge\"><svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#EA580C\" stroke-width=\"2\"><rect x=\"3\" y=\"4\" width=\"18\" height=\"16\" rx=\"3\"/><path d=\"M8 10h8M8 14h5\"/></svg></span>\n          </div>\n          <h3>Mỗi trợ lý ghi vào một tệp riêng biệt</h3>\n          <p>Để các luồng AI chạy cùng lúc không ghi đè lên nhau, hãy quy định rõ Nhánh 1 lưu tệp A, Nhánh 2 lưu tệp B, Nhánh 3 lưu tệp C.</p>\n          <div class=\"k-card-mini-note\">🛡️ Tuyệt đối không xung đột dữ liệu trên ổ cứng</div>\n        </div>\n        \n        <div class=\"k-card k-step-item k-unreached\" id=\"s1_c2\" data-order=\"3\">\n          <div class=\"k-card-top-row\">\n            <span class=\"k-card-tag\" style=\"background:#E0F2FE; color:#0369A1; border:1px solid #7DD3FC;\">NGUYÊN TẮC 2 · CÙNG ĐỌC 1 HỒ SƠ GỐC</span>\n            <span class=\"k-illus-badge\"><svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#0284C7\" stroke-width=\"2\"><path d=\"M12 2L2 7l10 5 10-5-10-5z\"/><path d=\"M2 17l10 5 10-5M2 12l10 5 10-5\"/></svg></span>\n          </div>\n          <h3>Đồng bộ mục tiêu chung từ @COMPANY.md</h3>\n          <p>Cả 3 nhánh đều được đính kèm @COMPANY.md và thừa hưởng chung bộ nội quy .agent/rules/ nên giọng văn hoàn toàn thống nhất.</p>\n          <div class=\"k-card-mini-note\">🎯 3 người làm nhưng chất lượng như 1</div>\n        </div>\n        \n        <div class=\"k-card k-step-item k-unreached\" id=\"s1_c3\" data-order=\"4\">\n          <div class=\"k-card-top-row\">\n            <span class=\"k-card-tag\" style=\"background:#DCFCE7; color:#15803D; border:1px solid #86EFAC;\">NGUYÊN TẮC 3 · HỢP NHẤT CUỐI CÙNG</span>\n            <span class=\"k-illus-badge\"><svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#16A34A\" stroke-width=\"2\"><path d=\"M22 11.08V12a10 10 0 1 1-5.93-9.14\"/><polyline points=\"22 4 12 14.01 9 11.01\"/></svg></span>\n          </div>\n          <h3>Tổng hợp thành Bộ hồ sơ hoàn chỉnh</h3>\n          <p>Sau khi cả 3 nhánh báo hoàn thành (Done), bạn dùng 1 câu lệnh cuối để ghép 3 tệp con thành bản Đề án Tổng thể.</p>\n          <div class=\"k-card-mini-note\">⚡ Tiết kiệm 70% thời gian chờ đợi</div>\n        </div>\n        \n    </div>\n    <div class=\"k-callout k-step-item k-unreached\" id=\"s1_call\" data-order=\"5\">\n      <span>💡</span>\n      <div><strong>Quy tắc an toàn khi chạy song song:</strong> <em>Đọc chung tệp gốc</em> nhưng <em>Ghi ra các tệp đích khác tên nhau</em>.</div>\n    </div>"
  },
  "beats": [
    {
      "id": "b1",
      "label": "1. Tổng quan: Mô hình điều phối 3 nhánh Trợ lý AI song song",
      "duration": 14.23,
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
      "caption": "Khi cần chuẩn bị gấp một bộ đề án lớn gồm cả Tài chính, Nhân sự và Thị trường, nếu chờ một trợ lý làm lần lượt từng phần thì rất mất thời gian. Trong <strong>Bài 15</strong>, sơ đồ trên màn hình chỉ ra cách phân công 3 nhánh trợ lý chạy song song và ghi ra 3 tệp độc lập.",
      "audio_src": "audio/lesson_15/b1.mp3",
      "audio_duration": 13.58
    },
    {
      "id": "b2",
      "label": "2. Minh họa: Quan sát các luồng tác vụ (Threads) trên Antigravity 2.0",
      "duration": 12.25,
      "pose": 2,
      "mode": "sim",
      "pedagogy_type": "theory_type_2",
      "pedagogy_badge": "💡 Điểm cần lưu ý · Quản lý Đa Luồng (Multi-Threads)",
      "pedagogy_title": "Theo dõi nhiều luồng công việc đang chạy ở cột trái Antigravity 2.0",
      "pedagogy_note": "Mỗi dòng trong mục Conversation / Threads ở cột trái là một chuyên viên AI đang xử lý một nhiệm vụ riêng.",
      "onEnter": "kudoHidePopovers(); switchToSurface('mgr'); closeSettingsModal(); loadAgy2Thread('main');",
      "focus_selectors": [
        "#agy2-left-sb",
        "#th-main",
        "#th-5balance"
      ],
      "cursor_selector": "#th-5balance",
      "cursor_label": "Chuyển đổi nhanh giữa các luồng công việc song song",
      "caption": "Nhìn vào cột bên trái của <strong>Antigravity 2.0</strong> trên màn hình: Anh chị có thể mở nhiều luồng hội thoại cùng lúc. Trong khi luồng số 1 đang phân tích doanh thu, chúng ta bấm sang luồng số 2 để giao tiếp việc rà soát nhân sự.",
      "audio_src": "audio/lesson_15/b2.mp3",
      "audio_duration": 11.6
    },
    {
      "id": "b3",
      "label": "3. Kỹ thuật: Cách chia tệp đích riêng biệt trong IDE để tránh ghi đè",
      "duration": 11.29,
      "pose": 3,
      "mode": "sim",
      "pedagogy_type": "theory_type_2",
      "pedagogy_badge": "💡 Điểm cần lưu ý · Phân tách Tệp Đầu ra",
      "pedagogy_title": "Quy định tên tệp đầu ra riêng cho từng nhánh công việc",
      "pedagogy_note": "Nhánh 1 -> bao_cao_doanh_thu_q1.md; Nhánh 2 -> de_xuat_nhan_su_q2.md; Nhánh 3 -> bang_doi_sanh_doi_thu.md.",
      "onEnter": "kudoSimScene({surface:'ide', breadcrumb:'antigravity_course_vn › Bảng điều phối 3 Nhánh Song song', editorTitle:'⚡ Trạng thái 3 Nhánh Trợ lý AI Đang Chạy Song Song', editorHtml:'<div style=\"padding:16px;\"><h3 style=\"color:#9a3412;margin-top:0;\">BẢNG PHÂN CÔNG 3 NHÁNH TRỢ LÝ CHẠY SONG SONG</h3><table style=\"width:100%;border-collapse:collapse;font-size:13px;\"><tr style=\"background:#ffedd5;\"><th style=\"padding:8px;border:1px solid #fed7aa;text-align:left;\">Nhánh Trợ lý</th><th style=\"padding:8px;border:1px solid #fed7aa;text-align:left;\">Tệp Đầu vào (Đọc)</th><th style=\"padding:8px;border:1px solid #fed7aa;text-align:left;\">Tệp Đầu ra (Ghi riêng)</th><th style=\"padding:8px;border:1px solid #fed7aa;text-align:left;\">Trạng thái</th></tr><tr><td style=\"padding:8px;border:1px solid #fed7aa;\">Nhánh #1 (Tài chính)</td><td style=\"padding:8px;border:1px solid #fed7aa;\"><code>@sales_data.csv</code></td><td style=\"padding:8px;border:1px solid #fed7aa;\"><code>bao_cao_doanh_thu_q1.md</code></td><td style=\"padding:8px;border:1px solid #fed7aa;color:#15803d;font-weight:700;\">✅ Hoàn thành</td></tr><tr><td style=\"padding:8px;border:1px solid #fed7aa;\">Nhánh #2 (Nhân sự)</td><td style=\"padding:8px;border:1px solid #fed7aa;\"><code>@COMPANY.md</code></td><td style=\"padding:8px;border:1px solid #fed7aa;\"><code>de_xuat_nhan_su_q2.md</code></td><td style=\"padding:8px;border:1px solid #fed7aa;color:#15803d;font-weight:700;\">✅ Hoàn thành</td></tr><tr><td style=\"padding:8px;border:1px solid #fed7aa;\">Nhánh #3 (Thị trường)</td><td style=\"padding:8px;border:1px solid #fed7aa;\"><code>@COMPANY.md</code></td><td style=\"padding:8px;border:1px solid #fed7aa;\"><code>bang_doi_sanh_doi_thu.md</code></td><td style=\"padding:8px;border:1px solid #fed7aa;color:#15803d;font-weight:700;\">✅ Hoàn thành</td></tr></table></div>'});",
      "focus_selectors": [
        "#editor-canvas"
      ],
      "cursor_selector": "#editor-canvas",
      "cursor_label": "3 nhánh ghi ra 3 tệp riêng biệt, không bao giờ đè nhau",
      "caption": "Bảng điều phối ở cột giữa cho thấy nguyên tắc vàng khi chạy nhiều luồng song song: Cả 3 nhánh có thể cùng đọc tệp <code>@COMPANY.md</code>, nhưng khi xuất kết quả thì mỗi nhánh phải ghi vào một tệp có tên riêng biệt.",
      "audio_src": "audio/lesson_15/b3.mp3",
      "audio_duration": 10.64
    },
    {
      "id": "b4",
      "label": "4. Bước 1: Kích hoạt luồng công việc song song",
      "duration": 11.05,
      "pose": 4,
      "mode": "sim",
      "pedagogy_type": "practice_step",
      "pedagogy_badge": "👆 Thực hành Bước 1/3 · Phân việc cho các Nhánh",
      "pedagogy_title": "Cần hoàn tất cả Báo cáo nhân sự lẫn Đối sánh thị trường trong 10 phút",
      "pedagogy_note": "Bước 1: Mở giao diện quản lý luồng trên Antigravity 2.0 để kiểm tra các nhánh tác vụ đang hoạt động.",
      "onEnter": "kudoHidePopovers(); switchToSurface('mgr'); closeSettingsModal(); loadAgy2Thread('5balance');",
      "focus_selectors": [
        "#agy2-left-sb",
        "#th-5balance",
        "#agy2-chat-stream"
      ],
      "cursor_selector": "#th-5balance",
      "cursor_label": "Bước 1: Kiểm tra luồng tác vụ thứ hai trên Antigravity 2.0",
      "caption": "Chúng ta vào thực hành 3 bước phối hợp nhiều luồng công việc. Ở <strong>Bước 1</strong>, anh chị bấm chọn luồng công việc thứ hai ở cột trái để giao nhiệm vụ rà soát nhân sự và đối thủ song song với luồng phân tích doanh thu.",
      "audio_src": "audio/lesson_15/b4.mp3",
      "audio_duration": 10.4
    },
    {
      "id": "b5",
      "label": "5. Bước 2: Ra lệnh hợp nhất kết quả từ 3 tệp thành phần",
      "duration": 8.97,
      "pose": 5,
      "mode": "sim",
      "pedagogy_type": "practice_step",
      "pedagogy_badge": "👆 Thực hành Bước 2/3 · Hợp nhất 3 Tệp Thành phần",
      "pedagogy_title": "Bước 2: Quay về IDE, đính kèm cả 3 tệp đầu ra để tổng hợp Đề án Quý 2",
      "pedagogy_note": "Khi cả 3 nhánh đã hoàn tất, dùng dấu @ gọi cả 3 tệp để AI ghép thành bản de_an_tong_the_q2.md.",
      "onEnter": "kudoSimScene({surface:'ide', file:'COMPANY.md', clearChat:true, chatInput:'@bao_cao_doanh_thu_q1.md @de_xuat_nhan_su_q2.md @bang_doi_sanh_doi_thu.md Hãy hợp nhất kết quả của 3 nhóm thành bản Đề án Tổng thể Quý 2 tại tệp de_an_tong_the_q2.md'});",
      "focus_selectors": [
        "#ide-chat-input",
        "#ide-send-btn"
      ],
      "cursor_selector": "#ide-send-btn",
      "cursor_label": "Bước 2: Hợp nhất kết quả của cả 3 nhánh công việc",
      "caption": "Sang <strong>Bước 2</strong>, khi cả 3 nhánh đều đã báo hoàn thành, anh chị quay về khung chat, đính kèm cả 3 tệp kết quả vừa sinh ra và yêu cầu hợp nhất thành bản đề án tổng thể.",
      "audio_src": "audio/lesson_15/b5.mp3",
      "audio_duration": 8.32
    },
    {
      "id": "b6",
      "label": "6. Bước 3: Hoàn tất Đề án Tổng thể",
      "duration": 13.53,
      "pose": 6,
      "mode": "sim",
      "pedagogy_type": "practice_step",
      "pedagogy_badge": "✅ Thực hành Bước 3/3 · Kết quả hoàn thành",
      "pedagogy_title": "Bước 3: Kiểm tra kết quả tệp de_an_tong_the_q2.md kết tinh từ 3 nhánh song song",
      "pedagogy_note": "Đề án hoàn chỉnh cả Tài chính, Nhân sự và Thị trường.",
      "onEnter": "kudoSimScene({surface:'ide', breadcrumb:'antigravity_course_vn › de_an_tong_the_q2.md (Hợp nhất từ 3 nhánh)', editorTitle:'🏆 de_an_tong_the_q2.md — Đề Án Tổng Thể Quý 2 TaskFlow', editorHtml:'<div style=\"padding:16px;\"><h2 style=\"color:#15803d;margin-top:0;\">ĐỀ ÁN TỔNG THỂ QUÝ 2/2026 — TASKFLOW INC.</h2><ul><li><strong>Phần I — Tài chính (Từ Nhánh #1):</strong> Giữ vững đà tăng trưởng gói Enterprise (1,26 tỷ VNĐ) và giảm Churn nhóm SMB từ 6,2% xuống 4,3%.</li><li><strong>Phần II — Nhân sự (Từ Nhánh #2):</strong> Bổ sung 2 chuyên viên Customer Success chuyên trách hỗ trợ khách hàng mới trong 7 ngày đầu.</li><li><strong>Phần III — Cạnh tranh (Từ Nhánh #3):</strong> Tung gói dùng thử 14 ngày có sẵn mẫu quy trình tự động.</li></ul></div>', userMsg:'@bao_cao_doanh_thu_q1.md @de_xuat_nhan_su_q2.md @bang_doi_sanh_doi_thu.md Hãy hợp nhất kết quả thành de_an_tong_the_q2.md', aiMsg:'Đã hợp nhất thành công kết quả của 3 nhánh công việc vào tệp <code>de_an_tong_the_q2.md</code>!'});",
      "focus_selectors": [
        "#editor-canvas",
        "#ide-chat-messages"
      ],
      "cursor_selector": "#editor-canvas",
      "cursor_label": "Bước 3: Đề án tổng thể hoàn tất nhanh gấp 3 lần!",
      "caption": "Ở <strong>Bước 3</strong>, bản <code>de_an_tong_the_q2.md</code> đã hiện ra đầy đủ cả 3 mảng Tài chính, Nhân sự và Thị trường chỉ trong vài phút. Vậy làm sao để gửi các tệp báo cáo này lên đám mây cho cả phòng cùng làm việc? Chúng ta sang ngay <strong>Bài 16</strong>.",
      "audio_src": "audio/lesson_15/b6.mp3",
      "audio_duration": 12.88
    }
  ]
};
