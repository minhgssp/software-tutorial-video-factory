window.KUDO_SPEC = {
  "filename": "lesson_10.html",
  "legacy_alias": "",
  "code": "BÀI 10",
  "chapter_number": 3,
  "chapter_code": "CHƯƠNG 3",
  "chapter_title": "Thiết kế Bộ não .agent & Tự động hóa Quy trình",
  "title": "Thiết lập Nội quy Tự động (.agent/rules) & Sổ tay Kỹ năng (.agent/skills)",
  "short_title": "Thiết kế Rules & Skills",
  "pill_label": "Bài 10 · Thiết kế Rules & Skills",
  "description": "Phân biệt rõ khi nào nên đặt quy định vào .agent/rules/ (luôn tự động nạp 100% thời gian) và khi nào nên đóng gói thành .agent/skills/ (chỉ nạp khi đúng nghiệp vụ); thực hành tạo Rule và Skill đầu tiên.",
  "prerequisites": "Bài 7 (Đã biết viết @troly.md) & Bài 9 (Đã hiểu tổng quan 3 ngăn của thư mục .agent).",
  "dependents": "Bài 11 (Kết hợp Rules & Skills vào bên trong Workflows), Bài 12 (Dùng lệnh /learn để AI tự động nâng cấp Rules & Skills).",
  "placement_risk": "0% Rủi ro — Học viên nâng cấp trực tiếp từ tệp @troly.md quen thuộc lên .agent/rules/ và tách phần nghiệp vụ nặng sang .agent/skills/.",
  "continuity_bridge": "Sau khi trang bị Nội quy (Rules) và Kỹ năng chuyên môn (Skills) ở Bài 10, Bài 11 sẽ hướng dẫn cách nối chúng thành một dây chuyền tự động hóa bằng Workflows.",
  "slides": {
    "s1": "<div>\n      <div class=\"k-slide-header\">\n        <span class=\"k-slide-kicker\">CHƯƠNG 3 · BÀI 10</span>\n        <span class=\"k-slide-step\">Tổng quan &amp; Nguyên lý cốt lõi</span>\n      </div>\n      <div class=\"k-slide-h1\">Khi nào dùng Rules (Nội quy luôn bật) và khi nào dùng Skills (Kỹ năng theo việc)?</div>\n      <div class=\"k-slide-sub\">Bí quyết giúp Trợ lý AI vừa tuân thủ kỷ luật chung 100%, vừa nắm vững hàng chục nghiệp vụ chuyên sâu mà không bị quá tải bộ nhớ.</div>\n    </div>\n    \n        <div class=\"k-visual-hero-box k-layout-comparison k-step-item k-hl\" id=\"s1_hero\" data-order=\"1\">\n          <div class=\"k-cmp-col k-cmp-before\">\n            <div class=\"k-cmp-badge-old\">📌 RULES · NỘI QUY LUÔN BẬT CHO MỌI VIỆC</div>\n            <div class=\"k-cmp-main\">QUY TẮC CHUNG MỌI VIỆC — Đưa vào .agent/rules/</div>\n            <div class=\"k-cmp-sub\">Ngắn gọn dưới 50 dòng, luôn bật</div>\n            <svg class=\"k-cmp-illus-svg\" viewBox=\"0 0 360 64\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><rect x=\"4\" y=\"6\" width=\"352\" height=\"52\" rx=\"8\" fill=\"#FFF7ED\" stroke=\"#FB923C\" stroke-width=\"1.5\"/><text x=\"180\" y=\"27\" text-anchor=\"middle\" fill=\"#9A3412\" font-size=\"11.5\" font-weight=\"800\">🛡️ .agent/rules/noi_quy_chung.md (Luôn bật 24/7)</text><text x=\"180\" y=\"45\" text-anchor=\"middle\" fill=\"#475569\" font-size=\"10.5\">Ngôn ngữ tiếng Việt · Xưng hô chuẩn · Bảo mật số liệu</text></svg>\n          </div>\n          <div class=\"k-cmp-arrow\">➔</div>\n          <div class=\"k-cmp-col k-cmp-after\">\n            <div class=\"k-cmp-badge-new\">📘 SKILLS · KỸ NĂNG CHUYÊN SÂU THEO VIỆC</div>\n            <div class=\"k-cmp-main\">NGHIỆP VỤ CHUYÊN SÂU — Đưa vào .agent/skills/</div>\n            <div class=\"k-cmp-sub\">Mẫu biểu, công thức tính chi tiết</div>\n            <svg class=\"k-cmp-illus-svg\" viewBox=\"0 0 360 64\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><rect x=\"4\" y=\"6\" width=\"352\" height=\"52\" rx=\"8\" fill=\"#F0FDF4\" stroke=\"#4ADE80\" stroke-width=\"1.5\"/><text x=\"180\" y=\"27\" text-anchor=\"middle\" fill=\"#166534\" font-size=\"11.5\" font-weight=\"800\">🧰 .agent/skills/*/SKILL.md (Chỉ nạp khi đúng việc)</text><text x=\"180\" y=\"45\" text-anchor=\"middle\" fill=\"#15803D\" font-size=\"10.5\">Kỹ năng viết báo cáo · Kỹ năng phân tích CSV · Kỹ năng HR</text></svg>\n          </div>\n          <blockquote class=\"k-quote-box\">\n            <span class=\"k-quote-mark\">“</span>\n            <p>Nếu bắt một nhân viên lúc nào cũng ôm khư khư 20 cuốn cẩm nang dày cộp trên tay, họ sẽ kiệt sức. Hãy dán Nội quy ngắn gọn lên tường (Rules) và xếp Cẩm nang chuyên môn lên kệ sách (Skills) để cần việc nào mới rút cuốn đó ra.</p>\n          </blockquote>\n        </div>\n        \n    <div class=\"k-grid-3\">\n      \n        <div class=\"k-card k-step-item k-unreached\" id=\"s1_c1\" data-order=\"2\">\n          <div class=\"k-card-top-row\">\n            <span class=\"k-card-tag\" style=\"background:#FFF1E6; color:#C2410C; border:1px solid #FDBA74;\">TIÊU CHUẨN VIẾT RULES</span>\n            <span class=\"k-illus-badge\"><svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#EA580C\" stroke-width=\"2\"><rect x=\"3\" y=\"4\" width=\"18\" height=\"16\" rx=\"3\"/><path d=\"M8 10h8M8 14h5\"/></svg></span>\n          </div>\n          <h3>Ngắn gọn, sắc bén, áp dụng cho 100% tác vụ</h3>\n          <p>Đặt tại .agent/rules/: Quy định xưng hô, định dạng ngày tháng chuẩn Việt Nam (DD/MM/YYYY), đơn vị tiền tệ VNĐ và cấm bịa số liệu.</p>\n          <div class=\"k-card-mini-note\">📌 Không cần gõ @, mở chat là AI tự nhớ</div>\n        </div>\n        \n        <div class=\"k-card k-step-item k-unreached\" id=\"s1_c2\" data-order=\"3\">\n          <div class=\"k-card-top-row\">\n            <span class=\"k-card-tag\" style=\"background:#E0F2FE; color:#0369A1; border:1px solid #7DD3FC;\">TIÊU CHUẨN VIẾT SKILLS</span>\n            <span class=\"k-illus-badge\"><svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#0284C7\" stroke-width=\"2\"><path d=\"M12 2L2 7l10 5 10-5-10-5z\"/><path d=\"M2 17l10 5 10-5M2 12l10 5 10-5\"/></svg></span>\n          </div>\n          <h3>Chuyên sâu, có tệp SKILL.md và biểu mẫu đi kèm</h3>\n          <p>Đặt tại .agent/skills/ten-ky-nang/SKILL.md: Chứa phần mở đầu (description) nói rõ khi nào dùng và hướng dẫn chi tiết từng bước.</p>\n          <div class=\"k-card-mini-note\">📚 Ví dụ: Kỹ năng chấm điểm ứng viên, Kỹ năng viết báo cáo tuần</div>\n        </div>\n        \n        <div class=\"k-card k-step-item k-unreached\" id=\"s1_c3\" data-order=\"4\">\n          <div class=\"k-card-top-row\">\n            <span class=\"k-card-tag\" style=\"background:#DCFCE7; color:#15803D; border:1px solid #86EFAC;\">SAI LẦM CẦN TRÁNH</span>\n            <span class=\"k-illus-badge\"><svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#16A34A\" stroke-width=\"2\"><path d=\"M22 11.08V12a10 10 0 1 1-5.93-9.14\"/><polyline points=\"22 4 12 14.01 9 11.01\"/></svg></span>\n          </div>\n          <h3>Nhồi nhét cả biểu mẫu dài 10 trang vào Rules</h3>\n          <p>Nếu đưa tài liệu quá dài vào Rules, mỗi câu hỏi nhỏ AI cũng phải đọc lại toàn bộ 10 trang đó, gây tốn bộ nhớ và chậm phản hồi.</p>\n          <div class=\"k-card-mini-note\">⚖️ Quy tắc vàng: Rules ngắn gọn — Skills chi tiết</div>\n        </div>\n        \n    </div>\n    <div class=\"k-callout k-step-item k-unreached\" id=\"s1_call\" data-order=\"5\">\n      <span>💡</span>\n      <div><strong>Công thức phân loại 3 giây:</strong> Việc gì <em>câu lệnh nào cũng cần</em> &rarr; đưa vào <code>rules/</code>. Việc gì <em>chỉ nhiệm vụ đó mới cần</em> &rarr; đưa vào <code>skills/</code>.</div>\n    </div>"
  },
  "beats": [
    {
      "id": "b1",
      "label": "1. Tổng quan: Phân biệt Rules (Luôn bật) và Skills (Theo việc)",
      "duration": 13.89,
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
      "caption": "Trong <strong>Bài 10</strong>, chúng ta giải quyết câu hỏi: Cái gì nên đặt vào <strong>Rules</strong> và cái gì nên đặt vào <strong>Skills</strong>? Nguyên tắc rất dễ nhớ: Những quy định ngắn gọn mà câu lệnh nào cũng phải tuân theo thì đặt vào <code>rules/</code>; còn hướng dẫn chuyên môn dài thì đóng gói vào <code>skills/</code>.",
      "audio_src": "audio/lesson_10/b1.mp3",
      "audio_duration": 13.24
    },
    {
      "id": "b2",
      "label": "2. Minh họa: Giải phẫu một tệp Nội quy trong .agent/rules/",
      "duration": 14.57,
      "pose": 2,
      "mode": "sim",
      "pedagogy_type": "theory_type_2",
      "pedagogy_badge": "💡 Điểm cần lưu ý · Cấu trúc Tệp Rule",
      "pedagogy_title": "Quan sát tệp .agent/rules/quy_chuan_van_phong.md trên màn hình",
      "pedagogy_note": "Gồm 3 gạch đầu dòng ngắn gọn: Chuẩn ngày tháng DD/MM/YYYY, đơn vị VNĐ và câu đầu tiên luôn là kết luận.",
      "onEnter": "kudoSimScene({surface:'ide', breadcrumb:'.agent › rules › quy_chuan_van_phong.md', editorTitle:'📏 .agent/rules/quy_chuan_van_phong.md — Nội Quy Tự Động', editorHtml:'<div style=\"padding:16px;\"><h2 style=\"color:#9a3412;margin-top:0;\">NỘI QUY VĂN PHÒNG BẮT BUỘC</h2><ol><li><strong>Định dạng thời gian &amp; tiền tệ:</strong> Luôn dùng chuẩn ngày <code>DD/MM/YYYY</code> và đơn vị <code>VNĐ</code> (phân cách hàng nghìn bằng dấu chấm).</li><li><strong>Cấu trúc báo cáo:</strong> Câu đầu tiên luôn là kết luận trực diện; ưu tiên bảng biểu đối chiếu.</li><li><strong>Bảo toàn sự thật:</strong> Tuyệt đối không tự suy diễn số liệu phần trăm nếu tài liệu gốc không cung cấp.</li></ol></div>'});",
      "focus_selectors": [
        "#editor-canvas"
      ],
      "cursor_selector": "#editor-canvas",
      "cursor_label": "Nội quy ngắn gọn luôn tự động kích hoạt 100%",
      "caption": "Nhìn vào cột giữa trên màn hình là tệp <code>.agent/rules/quy_chuan_van_phong.md</code>. Nhờ đặt tệp này trong ngăn <code>rules</code>, từ nay anh chị không cần gõ <code>@troly.md</code> nữa mà trợ lý vẫn tự động áp dụng chuẩn ngày tháng và tiền tệ Việt Nam.",
      "audio_src": "audio/lesson_10/b2.mp3",
      "audio_duration": 13.92
    },
    {
      "id": "b3",
      "label": "3. Kỹ thuật: Giải phẫu một tệp Kỹ năng trong .agent/skills/",
      "duration": 14.84,
      "pose": 3,
      "mode": "sim",
      "pedagogy_type": "theory_type_2",
      "pedagogy_badge": "💡 Điểm cần lưu ý · Cấu trúc Tệp SKILL.md",
      "pedagogy_title": "Phần khai báo Description ở đầu tệp SKILL.md giúp AI tự nhận biết",
      "pedagogy_note": "Khi người dùng yêu cầu viết báo cáo tuần, AI đọc dòng description thấy khớp mới mở toàn bộ tệp SKILL.md ra thực hiện.",
      "onEnter": "kudoSimScene({surface:'ide', breadcrumb:'.agent › skills › bao-cao-tuan › SKILL.md', editorTitle:'🧠 .agent/skills/bao-cao-tuan/SKILL.md — Kỹ Năng Chuyên Môn', editorHtml:'<div style=\"padding:16px;\"><pre style=\"background:#fff7ed;border:1px solid #fed7aa;padding:10px;border-radius:6px;font-size:12px;\">---\nname: bao-cao-tuan\ndescription: Kích hoạt khi người dùng yêu cầu tổng hợp Báo cáo tuần phòng Kinh doanh hoặc Vận hành.\n---</pre><h3 style=\"color:#9a3412;\">Quy chuẩn Bố cục Báo cáo Tuần TaskFlow</h3><ul><li><strong>Phần 1:</strong> Bảng đối chiếu KPI Kế hoạch vs. Thực đạt.</li><li><strong>Phần 2:</strong> 3 Điểm nghẽn lớn nhất cần Giám đốc tháo gỡ.</li><li><strong>Phần 3:</strong> Kế hoạch hành động tuần tới kèm người phụ trách.</li></ul></div>'});",
      "focus_selectors": [
        "#editor-canvas"
      ],
      "cursor_selector": "#editor-canvas",
      "cursor_label": "Khai báo description ở đầu tệp SKILL.md",
      "caption": "Còn đây là tệp <code>SKILL.md</code> nằm trong ngăn <code>.agent/skills/bao-cao-tuan/</code>. Anh chị chú ý phần khung màu cam ở đầu tệp có dòng <code>description</code>: Đây chính là nhãn tên trên gáy sách giúp trợ lý biết khi nào cần rút cuốn kỹ năng này ra dùng.",
      "audio_src": "audio/lesson_10/b3.mp3",
      "audio_duration": 14.19
    },
    {
      "id": "b4",
      "label": "4. Bước 1: Yêu cầu AI chuyển @troly.md thành Rule",
      "duration": 9.29,
      "pose": 4,
      "mode": "sim",
      "pedagogy_type": "practice_step",
      "pedagogy_badge": "👆 Thực hành Bước 1/3 · Chuyển @troly.md vào Rules",
      "pedagogy_title": "Muốn AI tự nhớ phong cách cá nhân mà không cần gõ @troly.md",
      "pedagogy_note": "Bước 1: Mở tệp troly.md ở cột trái để chuẩn bị nâng cấp thành nội quy tự động.",
      "onEnter": "kudoHidePopovers(); switchToSurface('ide'); switchIdeSidebarMode('explorer'); openFileInEditor('troly.md');",
      "focus_selectors": [
        "#ide-file-tree",
        "#editor-canvas"
      ],
      "cursor_selector": "[data-file='troly.md']",
      "cursor_label": "Bước 1: Chọn tệp troly.md cần nâng cấp thành Rule",
      "caption": "Chúng ta vào thực hành 3 bước tạo Rules và Skills mà không cần tự gõ mã kỹ thuật. Ở <strong>Bước 1</strong>, anh chị chọn tệp <code>troly.md</code> mà chúng ta đã làm ở Chương 2.",
      "audio_src": "audio/lesson_10/b4.mp3",
      "audio_duration": 8.64
    },
    {
      "id": "b5",
      "label": "5. Bước 2: Giao lệnh cho AI tự tạo Rule và Skill chuẩn",
      "duration": 13.45,
      "pose": 5,
      "mode": "sim",
      "pedagogy_type": "practice_step",
      "pedagogy_badge": "👆 Thực hành Bước 2/3 · Nhờ AI đóng gói Rule & Skill",
      "pedagogy_title": "Bước 2: Nhập lệnh vào ô chat yêu cầu AI tạo tệp trong .agent/rules/ và .agent/skills/",
      "pedagogy_note": "Bạn chỉ cần nói bằng tiếng Việt, chính Trợ lý AI sẽ tự tạo đúng thư mục và viết chuẩn cú pháp SKILL.md cho bạn.",
      "onEnter": "kudoSimScene({surface:'ide', file:'troly.md', clearChat:true, chatInput:'@troly.md Hãy chuyển các quy tắc chung vào .agent/rules/quy_chuan_van_phong.md và tạo thêm kỹ năng viết báo cáo tuần tại .agent/skills/bao-cao-tuan/SKILL.md'});",
      "focus_selectors": [
        "#ide-chat-input",
        "#ide-send-btn"
      ],
      "cursor_selector": "#ide-send-btn",
      "cursor_label": "Bước 2: Gửi lệnh để AI tự khởi tạo Rule & Skill",
      "caption": "Sang <strong>Bước 2</strong>, điều tuyệt vời nhất của <strong>Antigravity IDE</strong> là anh chị không phải tự tạo thư mục bằng tay: Hãy gõ lệnh bảo trợ lý chuyển quy tắc chung vào <code>.agent/rules/</code> và tạo kỹ năng báo cáo tuần trong <code>.agent/skills/</code>.",
      "audio_src": "audio/lesson_10/b5.mp3",
      "audio_duration": 12.8
    },
    {
      "id": "b6",
      "label": "6. Bước 3: Hoàn tất AI tự kích hoạt Rule & Skill mới",
      "duration": 14.17,
      "pose": 6,
      "mode": "sim",
      "pedagogy_type": "practice_step",
      "pedagogy_badge": "✅ Thực hành Bước 3/3 · Kết quả hoàn thành",
      "pedagogy_title": "Bước 3: Thử gõ lệnh không cần @troly.md, AI vẫn tự áp dụng cả Rule lẫn Skill",
      "pedagogy_note": "AI tự nạp Rule văn phòng + Skill báo cáo tuần.",
      "onEnter": "kudoSimScene({surface:'ide', breadcrumb:'antigravity_course_vn › bao_cao_tuan_01.md (Tự động áp dụng Rule + Skill)', editorTitle:'📊 bao_cao_tuan_01.md — Đã kích hoạt ngầm Rule & Skill', editorHtml:'<div style=\"padding:16px;\"><div style=\"background:#ecfdf5;border:1px solid #6ee7b7;padding:8px 12px;border-radius:6px;margin-bottom:10px;font-size:12px;color:#065f46;\">⚡ <strong>Hệ thống .agent đã tự động nạp:</strong> <code>rules/quy_chuan_van_phong.md</code> + <code>skills/bao-cao-tuan/SKILL.md</code></div><h3 style=\"color:#9a3412;margin-top:0;\">BÁO CÁO TUẦN 1 THÁNG 04/2026 — PHÒNG KINH DOANH</h3><p><strong>Kết luận trực diện:</strong> Doanh thu tuần đạt 485.000.000 VNĐ (vượt 8% kế hoạch tuần).</p></div>', userMsg:'Hãy lập báo cáo tuần 1 tháng 4 từ bảng @sales_data.csv', aiMsg:'Tôi đã tự động áp dụng <strong>Nội quy văn phòng</strong> (chuẩn VNĐ, DD/MM/YYYY) và <strong>Kỹ năng Báo cáo tuần</strong> để xuất tệp <code>bao_cao_tuan_01.md</code> cho bạn mà không cần bạn đính kèm lại quy tắc!'});",
      "focus_selectors": [
        "#editor-canvas",
        "#ide-chat-messages"
      ],
      "cursor_selector": "#editor-canvas",
      "cursor_label": "Bước 3: AI tự động nạp Rule & Skill mà không cần nhắc!",
      "caption": "Ở <strong>Bước 3</strong>, khi anh chị chỉ gõ một câu ngắn gọn <em>Hãy lập báo cáo tuần</em>, hệ thống tự động nạp ngầm cả Nội quy lẫn Kỹ năng chuyên môn để xuất ra báo cáo chuẩn chỉnh. Tiếp theo, ở <strong>Bài 11</strong>, chúng ta sẽ ghép nhiều bước thành một lệnh gạch chéo <code>/</code>.",
      "audio_src": "audio/lesson_10/b6.mp3",
      "audio_duration": 13.52
    }
  ]
};
