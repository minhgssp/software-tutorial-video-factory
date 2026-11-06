window.KUDO_SPEC = {
  "filename": "lesson_22.html",
  "legacy_alias": "",
  "code": "BÀI 22",
  "chapter_number": 6,
  "chapter_code": "CHƯƠNG 6",
  "chapter_title": "4 Tình huống Thực chiến Toàn diện (Case Studies)",
  "title": "Tình huống 2 — Tự động hóa Tuyển dụng, Chấm CV & Lộ trình Hội nhập (HR)",
  "short_title": "Case Study 2: Tuyển dụng & HR",
  "pill_label": "Bài 22 · Case 2: Tuyển dụng & HR",
  "description": "Giải quyết bài toán quá tải của phòng Nhân sự (HR) và Trưởng bộ phận: Xây dựng Thang điểm chấm hồ sơ ứng viên khách quan (Rubric), lọc 20 CV trong 2 phút, tạo Bộ câu hỏi phỏng vấn riêng cho từng người và Lộ trình thử việc 30-60-90 ngày.",
  "prerequisites": "Chương 2 (Đọc bảng .csv), Chương 3 (Thiết kế Skill chấm điểm) & Bài 21 (Tư duy quy trình thực chiến).",
  "dependents": "Bài 23 (Tình huống 3 — Rà soát hợp đồng lao động & quy chế pháp lý), Bài 24 (Tổng kết khóa học).",
  "placement_risk": "0% Rủi ro — Quy trình HR được chia thành 3 bước rõ ràng (Tiêu chí JD -> Bảng chấm điểm CV -> Bộ câu hỏi phỏng vấn) rất gần gũi với mọi cấp quản lý.",
  "continuity_bridge": "Sau khi tuyển chọn được ứng viên xuất sắc ở Bài 22, Bài 23 sẽ hướng dẫn cách dùng AI để rà soát Hợp đồng lao động, Hợp đồng kinh tế và Quy chế pháp lý an toàn tuyệt đối.",
  "slides": {
    "s1": "<div>\n      <div class=\"k-slide-header\">\n        <span class=\"k-slide-kicker\">CHƯƠNG 6 · BÀI 22</span>\n        <span class=\"k-slide-step\">Tổng quan &amp; Nguyên lý cốt lõi</span>\n      </div>\n      <div class=\"k-slide-h1\">Tình huống Thực chiến 2: Sàng lọc hồ sơ ứng viên và thiết kế câu hỏi phỏng vấn cá nhân hóa</div>\n      <div class=\"k-slide-sub\">Chấm dứt cảnh đọc mỏi mắt hàng chục bản CV PDF: Để Trợ lý AI chấm điểm theo thang tiêu chí rõ ràng và gợi ý câu hỏi xoáy sâu.</div>\n    </div>\n    \n        <div class=\"k-visual-hero-box k-layout-flowchart k-step-item k-hl\" id=\"s1_hero\" data-order=\"1\">\n          <div class=\"k-viz-header\">\n            <span class=\"k-viz-badge\">📊 SƠ ĐỒ QUY TRÌNH CỐT LÕI</span>\n            <span class=\"k-viz-title\">Dây chuyền 3 bước Tự động hóa Tuyển dụng & Hội nhập Nhân sự mới</span>\n          </div>\n          <svg class=\"k-flow-svg\" viewBox=\"0 0 860 96\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"Dây chuyền 3 bước Tự động hóa Tuyển dụng & Hội nhập Nhân sự mới\">\n            <path d=\"M262 48 H298\" stroke=\"#EA580C\" stroke-width=\"3\" stroke-linecap=\"round\"/>\n            <polygon points=\"295,42 307,48 295,54\" fill=\"#EA580C\"/>\n            <path d=\"M562 48 H598\" stroke=\"#15803D\" stroke-width=\"3\" stroke-linecap=\"round\"/>\n            <polygon points=\"595,42 607,48 595,54\" fill=\"#15803D\"/>\n            <rect x=\"8\" y=\"8\" width=\"252\" height=\"80\" rx=\"14\" fill=\"#FFF7ED\" stroke=\"#FDBA74\" stroke-width=\"2\"/>\n            <text x=\"134\" y=\"34\" text-anchor=\"middle\" fill=\"#9A3412\" font-size=\"13\" font-weight=\"800\">BƯỚC 1 · KHÓA TIÊU CHÍ (JD)</text>\n            <text x=\"134\" y=\"56\" text-anchor=\"middle\" fill=\"#1E293B\" font-size=\"14\" font-weight=\"700\">Lập bảng 4 tiêu chí chấm điểm</text>\n            <text x=\"134\" y=\"76\" text-anchor=\"middle\" fill=\"#475569\" font-size=\"12\">Kinh nghiệm, Kỹ năng, Văn hóa</text>\n            <rect x=\"308\" y=\"8\" width=\"252\" height=\"80\" rx=\"14\" fill=\"#FEF3C7\" stroke=\"#F59E0B\" stroke-width=\"2\"/>\n            <text x=\"434\" y=\"34\" text-anchor=\"middle\" fill=\"#B45309\" font-size=\"13\" font-weight=\"800\">BƯỚC 2 · SÀNG LỌC & XẾP HẠNG</text>\n            <text x=\"434\" y=\"56\" text-anchor=\"middle\" fill=\"#1E293B\" font-size=\"14\" font-weight=\"700\">Đối chiếu danh sách ứng viên</text>\n            <text x=\"434\" y=\"76\" text-anchor=\"middle\" fill=\"#475569\" font-size=\"12\">Xuất bảng xếp hạng Top 3</text>\n            <rect x=\"608\" y=\"8\" width=\"244\" height=\"80\" rx=\"14\" fill=\"#DCFCE7\" stroke=\"#4ADE80\" stroke-width=\"2\"/>\n            <text x=\"730\" y=\"34\" text-anchor=\"middle\" fill=\"#166534\" font-size=\"13\" font-weight=\"800\">BƯỚC 3 · BỘ CÂU HỎI & LỘ TRÌNH</text>\n            <text x=\"730\" y=\"56\" text-anchor=\"middle\" fill=\"#1E293B\" font-size=\"14\" font-weight=\"700\">Tạo câu hỏi phỏng vấn riêng</text>\n            <text x=\"730\" y=\"76\" text-anchor=\"middle\" fill=\"#15803D\" font-size=\"12\">Kèm lộ trình 30-60-90 ngày</text>\n          </svg>\n        </div>\n        \n    <div class=\"k-grid-3\">\n      \n        <div class=\"k-card k-step-item k-unreached\" id=\"s1_c1\" data-order=\"2\">\n          <div class=\"k-card-top-row\">\n            <span class=\"k-card-tag\" style=\"background:#FFF1E6; color:#C2410C; border:1px solid #FDBA74;\">GIAI ĐOẠN 1 · THANG ĐIỂM TIÊU CHÍ</span>\n            <span class=\"k-illus-badge\"><svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#EA580C\" stroke-width=\"2\"><rect x=\"3\" y=\"4\" width=\"18\" height=\"16\" rx=\"3\"/><path d=\"M8 10h8M8 14h5\"/></svg></span>\n          </div>\n          <h3>Chấm điểm khách quan không cảm tính</h3>\n          <p>Quy định rõ trọng số trong tệp jd_truong_nhom_cs.md: 40 điểm kinh nghiệm B2B, 30 điểm kỹ năng quản lý nhóm, 30 điểm xử lý khủng hoảng.</p>\n          <div class=\"k-card-mini-note\">⚖️ Mọi ứng viên đều được đo trên cùng một cây thước</div>\n        </div>\n        \n        <div class=\"k-card k-step-item k-unreached\" id=\"s1_c2\" data-order=\"3\">\n          <div class=\"k-card-top-row\">\n            <span class=\"k-card-tag\" style=\"background:#E0F2FE; color:#0369A1; border:1px solid #7DD3FC;\">GIAI ĐOẠN 2 · PHÁT HIỆN ĐIỂM CẦN LÀM RÕ</span>\n            <span class=\"k-illus-badge\"><svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#0284C7\" stroke-width=\"2\"><path d=\"M12 2L2 7l10 5 10-5-10-5z\"/><path d=\"M2 17l10 5 10-5M2 12l10 5 10-5\"/></svg></span>\n          </div>\n          <h3>Chỉ ra điểm mạnh và điểm nghi vấn trong CV</h3>\n          <p>AI không chỉ cộng điểm mà còn cảnh báo: 'Ứng viên Nguyễn Văn A có 4 năm kinh nghiệm nhưng nhảy việc 3 lần trong 18 tháng qua'.</p>\n          <div class=\"k-card-mini-note\">🔍 Giúp người phỏng vấn hỏi đúng trọng tâm</div>\n        </div>\n        \n        <div class=\"k-card k-step-item k-unreached\" id=\"s1_c3\" data-order=\"4\">\n          <div class=\"k-card-top-row\">\n            <span class=\"k-card-tag\" style=\"background:#DCFCE7; color:#15803D; border:1px solid #86EFAC;\">GIAI ĐOẠN 3 · LỘ TRÌNH 30-60-90 NGÀY</span>\n            <span class=\"k-illus-badge\"><svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#16A34A\" stroke-width=\"2\"><path d=\"M22 11.08V12a10 10 0 1 1-5.93-9.14\"/><polyline points=\"22 4 12 14.01 9 11.01\"/></svg></span>\n          </div>\n          <h3>Đón nhân sự mới vào guồng ngay ngày đầu</h3>\n          <p>Sau khi chọn được người, AI tự động xuất bản kế hoạch thử việc 3 tháng gắn liền với mục tiêu giảm Churn Rate tại @COMPANY.md.</p>\n          <div class=\"k-card-mini-note\">🤝 Nhân sự mới biết rõ tuần đầu phải làm gì</div>\n        </div>\n        \n    </div>\n    <div class=\"k-callout k-step-item k-unreached\" id=\"s1_call\" data-order=\"5\">\n      <span>💡</span>\n      <div><strong>Giá trị Thực chiến 2:</strong> Rút ngắn 80% thời gian đọc CV sơ loại và nâng cao chất lượng buổi phỏng vấn trực tiếp.</div>\n    </div>"
  },
  "beats": [
    {
      "id": "b1",
      "label": "1. Tổng quan: Dây chuyền 3 bước tự động hóa tuyển dụng HR",
      "duration": 14.61,
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
      "caption": "Bước sang <strong>Bài 22 — Tình huống Thực chiến 2</strong>, chúng ta giải quyết bài toán mà mọi giám đốc và trưởng phòng đều gặp phải: Tuyển dụng và đào tạo nhân sự mới. Sơ đồ 3 bước trên màn hình giúp anh chị chấm điểm hồ sơ ứng viên khách quan và tạo bộ câu hỏi phỏng vấn sắc bén cho từng người.",
      "audio_src": "audio/lesson_22/b1.mp3",
      "audio_duration": 13.96
    },
    {
      "id": "b2",
      "label": "2. Minh họa: Quan sát tệp Thang điểm tiêu chí tuyển dụng trong IDE",
      "duration": 11.61,
      "pose": 2,
      "mode": "sim",
      "pedagogy_type": "theory_type_2",
      "pedagogy_badge": "💡 Điểm cần lưu ý · Thang điểm Chấm Hồ sơ Ứng viên",
      "pedagogy_title": "Cấu trúc tệp tiêu chí tuyển dụng jd_truong_nhom_cs.md",
      "pedagogy_note": "Để AI không chấm điểm cảm tính, hãy ghi rõ thang 100 điểm chia làm 3 tiêu chí cụ thể.",
      "onEnter": "kudoSimScene({surface:'ide', breadcrumb:'antigravity_course_vn › jd_truong_nhom_cs.md', editorTitle:'📋 jd_truong_nhom_cs.md — Tiêu Chí Chấm Điểm Ứng Viên (100 Điểm)', editorHtml:'<div style=\"padding:16px;\"><h3 style=\"color:#9a3412;margin-top:0;\">THANG ĐIỂM TUYỂN DỤNG TRƯỞNG NHÓM CS (TASKFLOW INC.)</h3><ul><li><strong>Tiêu chí 1 — Kinh nghiệm CS B2B (40 điểm):</strong> Tối thiểu 2 năm chăm sóc khách hàng phần mềm doanh nghiệp.</li><li><strong>Tiêu chí 2 — Thành tích giảm Churn Rate (35 điểm):</strong> Có số liệu chứng minh đã giữ chân khách hàng thành công.</li><li><strong>Tiêu chí 3 — Độ gắn bó &amp; Kỹ năng dẫn dắt (25 điểm):</strong> Thời gian làm việc trung bình trên 18 tháng/công ty.</li></ul></div>'});",
      "focus_selectors": [
        "#editor-canvas"
      ],
      "cursor_selector": "#editor-canvas",
      "cursor_label": "Thang điểm 100 chia rõ 3 tiêu chí định lượng",
      "caption": "Nhìn vào cột giữa trên màn hình là tệp <code>jd_truong_nhom_cs.md</code>: Thay vì chỉ bảo AI tìm người giỏi chung chung, chúng ta chia rõ 100 điểm thành 3 tiêu chí định lượng để AI đối chiếu với từng hồ sơ ứng viên.",
      "audio_src": "audio/lesson_22/b2.mp3",
      "audio_duration": 10.96
    },
    {
      "id": "b3",
      "label": "3. Kỹ thuật: Bảng xếp hạng ứng viên kèm câu hỏi phỏng vấn xoáy sâu",
      "duration": 11.37,
      "pose": 3,
      "mode": "sim",
      "pedagogy_type": "theory_type_2",
      "pedagogy_badge": "💡 Điểm cần lưu ý · Bảng Đánh giá & Câu hỏi Xoáy sâu",
      "pedagogy_title": "AI chỉ ra Điểm mạnh, Điểm nghi vấn và Câu hỏi kiểm chứng cho từng ứng viên",
      "pedagogy_note": "Với mỗi ứng viên lọt vào vòng trong, AI soạn riêng 2 câu hỏi phỏng vấn xoáy vào đúng điểm còn thiếu trong CV của người đó.",
      "onEnter": "kudoSimScene({surface:'ide', breadcrumb:'antigravity_course_vn › ket_qua_cham_cv.md', editorTitle:'🏆 ket_qua_cham_cv.md — Bảng Xếp Hạng & Câu Hỏi Phỏng Vấn', editorHtml:'<div style=\"padding:16px;\"><h3 style=\"color:#9a3412;margin-top:0;\">KẾT QUẢ SÀNG LỌC HỒ SƠ ỨNG VIÊN TRƯỞNG NHÓM CS</h3><table style=\"width:100%;border-collapse:collapse;font-size:13px;\"><tr style=\"background:#ffedd5;\"><th style=\"padding:7px;border:1px solid #fed7aa;text-align:left;\">Ứng viên</th><th style=\"padding:7px;border:1px solid #fed7aa;text-align:center;\">Tổng điểm</th><th style=\"padding:7px;border:1px solid #fed7aa;text-align:left;\">Điểm mạnh &amp; Điểm cần hỏi kỹ khi phỏng vấn</th></tr><tr><td style=\"padding:7px;border:1px solid #fed7aa;font-weight:700;\">1. Trần Minh Anh</td><td style=\"padding:7px;border:1px solid #fed7aa;text-align:center;color:#15803d;font-weight:800;\">91 / 100</td><td style=\"padding:7px;border:1px solid #fed7aa;\">3 năm CS SaaS, từng giảm Churn 25%. <em>Câu hỏi:</em> Quy trình bạn áp dụng trong 7 ngày đầu cho khách hàng mới là gì?</td></tr><tr><td style=\"padding:7px;border:1px solid #fed7aa;font-weight:700;\">2. Lê Hoàng Nam</td><td style=\"padding:7px;border:1px solid #fed7aa;text-align:center;color:#d97706;font-weight:800;\">78 / 100</td><td style=\"padding:7px;border:1px solid #fed7aa;\">Mạnh giao tiếp nhưng mới làm B2C. <em>Câu hỏi:</em> Bạn sẽ xử lý thế nào khi khách hàng doanh nghiệp yêu cầu tích hợp kỹ thuật?</td></tr></table></div>'});",
      "focus_selectors": [
        "#editor-canvas"
      ],
      "cursor_selector": "#editor-canvas",
      "cursor_label": "Bảng điểm kèm câu hỏi phỏng vấn cá nhân hóa từng người",
      "caption": "Và kết quả ở cột giữa thật sự ấn tượng: Trợ lý không chỉ chấm điểm xếp hạng 91 trên 100 cho ứng viên số 1, mà còn chuẩn bị sẵn câu hỏi phỏng vấn riêng biệt để anh chị kiểm tra năng lực thực chất của từng người.",
      "audio_src": "audio/lesson_22/b3.mp3",
      "audio_duration": 10.72
    },
    {
      "id": "b4",
      "label": "4. Bước 1: Kiểm tra tệp tiêu chí jd_truong_nhom_cs.md",
      "duration": 8.17,
      "pose": 4,
      "mode": "sim",
      "pedagogy_type": "practice_step",
      "pedagogy_badge": "👆 Thực hành Bước 1/3 · Khóa Thang Điểm Tuyển dụng",
      "pedagogy_title": "Cần tuyển gấp Trưởng nhóm CS để thực hiện mục tiêu Quý 2",
      "pedagogy_note": "Bước 1: Mở kiểm tra tệp jd_truong_nhom_cs.md để đảm bảo đủ 3 tiêu chí chấm điểm.",
      "onEnter": "kudoSimScene({surface:'ide', breadcrumb:'antigravity_course_vn › jd_truong_nhom_cs.md', editorTitle:'📋 jd_truong_nhom_cs.md — Kiểm tra Thang điểm 100', editorHtml:'<div style=\"padding:16px;\"><h3 style=\"color:#9a3412;margin-top:0;\">ĐANG CHỌN THANG ĐIỂM: jd_truong_nhom_cs.md</h3><p>Sẵn sàng đối chiếu với danh sách hồ sơ ứng viên tại <code>@danh_sach_ung_vien.csv</code>.</p></div>'});",
      "focus_selectors": [
        "#editor-canvas"
      ],
      "cursor_selector": "#editor-canvas",
      "cursor_label": "Bước 1: Xác nhận thang điểm jd_truong_nhom_cs.md",
      "caption": "Chúng ta vào thực hành 3 bước tự động hóa tuyển dụng. Ở <strong>Bước 1</strong>, anh chị mở kiểm tra tệp tiêu chí <code>jd_truong_nhom_cs.md</code> ở cột giữa.",
      "audio_src": "audio/lesson_22/b4.mp3",
      "audio_duration": 7.52
    },
    {
      "id": "b5",
      "label": "5. Bước 2: Gửi lệnh chấm điểm ứng viên và lập lộ trình 30-60-90 ngày",
      "duration": 9.45,
      "pose": 5,
      "mode": "sim",
      "pedagogy_type": "practice_step",
      "pedagogy_badge": "👆 Thực hành Bước 2/3 · Chấm CV & Lập Lộ trình Thử việc",
      "pedagogy_title": "Bước 2: Đính kèm @jd_truong_nhom_cs.md và @danh_sach_ung_vien.csv",
      "pedagogy_note": "Yêu cầu AI xếp hạng ứng viên, soạn câu hỏi phỏng vấn và lập lộ trình thử việc 30-60-90 ngày vào tệp ho_so_tuyen_dung_cs.md.",
      "onEnter": "kudoSimScene({surface:'ide', clearChat:true, chatInput:'@jd_truong_nhom_cs.md @danh_sach_ung_vien.csv @COMPANY.md Hãy chấm điểm xếp hạng ứng viên, tạo bộ câu hỏi phỏng vấn riêng và lập lộ trình thử việc 30-60-90 ngày vào tệp ho_so_tuyen_dung_cs.md'});",
      "focus_selectors": [
        "#ide-chat-input",
        "#ide-send-btn"
      ],
      "cursor_selector": "#ide-send-btn",
      "cursor_label": "Bước 2: Nhấn Gửi để AI chấm CV & lập lộ trình thử việc",
      "caption": "Sang <strong>Bước 2</strong>, anh chị đính kèm thang điểm cùng danh sách ứng viên vào ô chat, yêu cầu chấm điểm và lập lộ trình thử việc 30-60-90 ngày rồi nhấn nút Gửi.",
      "audio_src": "audio/lesson_22/b5.mp3",
      "audio_duration": 8.8
    },
    {
      "id": "b6",
      "label": "6. Bước 3: Hoàn tất bộ hồ sơ tuyển dụng",
      "duration": 16.78,
      "pose": 6,
      "mode": "sim",
      "pedagogy_type": "practice_step",
      "pedagogy_badge": "✅ Thực hành Bước 3/3 · Hoàn thành Case Study 2",
      "pedagogy_title": "Bước 3: Kiểm tra kết quả tệp ho_so_tuyen_dung_cs.md trọn gói từ Chấm điểm tới Hội nhập",
      "pedagogy_note": "Hoàn tất bảng xếp hạng + câu hỏi phỏng vấn + KPI 90 ngày.",
      "onEnter": "kudoSimScene({surface:'ide', breadcrumb:'antigravity_course_vn › ho_so_tuyen_dung_cs.md (Hoàn tất HR)', editorTitle:'🤝 ho_so_tuyen_dung_cs.md — Hồ Sơ Tuyển Dụng & Hội Nhập 30-60-90 Ngày', editorHtml:'<div style=\"padding:16px;\"><h2 style=\"color:#15803d;margin-top:0;\">✅ HOÀN TẤT BỘ HỒ SƠ TUYỂN DỤNG &amp; HỘI NHẬP TRƯỞNG NHÓM CS</h2><ul><li><strong>Ứng viên đề xuất số 1:</strong> Trần Minh Anh (91/100 điểm).</li><li><strong>Mục tiêu 30 ngày đầu:</strong> Nắm vững sản phẩm TaskFlow và chuẩn hóa kịch bản gọi chào mừng khách hàng mới.</li><li><strong>Mục tiêu 60 ngày:</strong> Vận hành cổng Onboarding tự động rút ngắn thời gian xuống 3 ngày.</li><li><strong>Mục tiêu 90 ngày:</strong> Giảm tỷ lệ Churn nhóm SMB từ 6,2% xuống 4,3%.</li></ul></div>', userMsg:'@jd_truong_nhom_cs.md @danh_sach_ung_vien.csv @COMPANY.md Hãy xuất bộ hồ sơ vào ho_so_tuyen_dung_cs.md', aiMsg:'Đã hoàn tất chấm điểm ứng viên và lập lộ trình hội nhập 30-60-90 ngày tại <code>ho_so_tuyen_dung_cs.md</code>!'});",
      "focus_selectors": [
        "#editor-canvas",
        "#ide-chat-messages"
      ],
      "cursor_selector": "#editor-canvas",
      "cursor_label": "Bước 3: Hoàn tất trọn gói Tuyển dụng & Hội nhập 90 ngày!",
      "caption": "Ở <strong>Bước 3</strong>, bộ hồ sơ <code>ho_so_tuyen_dung_cs.md</code> đã hoàn tất từ bảng chấm điểm ứng viên đến lộ trình thử việc 30-60-90 ngày. Khi đã chọn được người và mở rộng đại lý, làm sao để rà soát hợp đồng không bị rủi ro pháp lý? Chúng ta sang ngay <strong>Bài 23 — Tình huống 3</strong>!",
      "audio_src": "audio/lesson_22/b6.mp3",
      "audio_duration": 16.13
    }
  ]
};
