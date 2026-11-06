window.KUDO_SPEC = {
  "filename": "lesson_12.html",
  "legacy_alias": "",
  "code": "BÀI 12",
  "chapter_number": 3,
  "chapter_code": "CHƯƠNG 3",
  "chapter_title": "Thiết kế Bộ não .agent & Tự động hóa Quy trình",
  "title": "Chu trình 3 Lệnh Vàng: /grill-me (Phỏng vấn), /plan (Lập kế hoạch) & /learn (Đúc kết)",
  "short_title": "Chu trình /grill-me, /plan, /learn",
  "pill_label": "Bài 12 · /grill-me, /plan, /learn",
  "description": "Làm chủ chu trình 3 lệnh chiến lược giúp giải quyết mọi đề bài phức tạp: Dùng /grill-me để AI phỏng vấn làm rõ lỗ hổng, dùng /plan để lập bản kế hoạch trước khi làm, và dùng /learn để AI tự ghi nhớ bài học vào bộ não .agent.",
  "prerequisites": "Bài 9, Bài 10 & Bài 11 (Đã hiểu rõ toàn bộ cấu trúc Rules, Skills, Workflows của thư mục .agent).",
  "dependents": "Chương 4, Chương 5 & Chương 6 (Áp dụng chu trình /grill-me -> /plan -> /learn vào mọi dự án dữ liệu, nội dung và thực chiến).",
  "placement_risk": "0% Rủi ro — Sử dụng kịch bản Mở rộng Kênh Đại lý B2B Quý 2 của TaskFlow để minh họa kỹ thuật lệnh, hoàn toàn tách biệt với Case Study Giày Bã Mía ở Bài 21.",
  "continuity_bridge": "Kết thúc Chương 3, học viên đã làm chủ hoàn toàn bộ não .agent. Sang Chương 4 (Bài 13), chúng ta bắt đầu đưa bộ não này vào xử lý hồ sơ lớn, bảng tính CSV và làm việc nhóm.",
  "slides": {
    "s1": "<div>\n      <div class=\"k-slide-header\">\n        <span class=\"k-slide-kicker\">CHƯƠNG 3 · BÀI 12</span>\n        <span class=\"k-slide-step\">Tổng quan &amp; Nguyên lý cốt lõi</span>\n      </div>\n      <div class=\"k-slide-h1\">Ba lệnh gạch chéo biến Trợ lý AI từ người thợ làm theo lệnh thành Chuyên gia Tư vấn</div>\n      <div class=\"k-slide-sub\">Đừng bắt AI viết ngay khi đề bài còn mơ hồ: Hãy để AI hỏi ngược bằng /grill-me, lập bản vẽ bằng /plan và tự khôn lên sau mỗi việc bằng /learn.</div>\n    </div>\n    \n        <div class=\"k-visual-hero-box k-layout-timeline k-step-item k-hl\" id=\"s1_hero\" data-order=\"1\">\n          <div class=\"k-viz-header\">\n            <span class=\"k-viz-badge\">⏱️ LỘ TRÌNH THỰC HIỆN TRỰC QUAN</span>\n            <span class=\"k-viz-title\">Chu trình 3 bước khép kín xử lý mọi nhiệm vụ phức tạp trong văn phòng</span>\n          </div>\n          <div class=\"k-tl-track\">\n            <div class=\"k-tl-step\">\n              <span class=\"k-tl-num\">Chặng 1</span>\n              <strong>1. /GRILL-ME (HỎI NGƯỢC)</strong>\n              <span>AI phỏng vấn tìm lỗ hổng · Làm rõ mục tiêu, ngân sách, hạn chót</span>\n            </div>\n            <div class=\"k-tl-conn\">──▶</div>\n            <div class=\"k-tl-step\">\n              <span class=\"k-tl-num\">Chặng 2</span>\n              <strong>2. /PLAN (LẬP BẢN VẼ)</strong>\n              <span>Trình kế hoạch chờ duyệt · Duyệt sườn bài xong mới viết chi tiết</span>\n            </div>\n            <div class=\"k-tl-conn\">──▶</div>\n            <div class=\"k-tl-step k-tl-final\">\n              <span class=\"k-tl-num\">Chặng 3 · Đích</span>\n              <strong>3. /LEARN (TỰ ĐÚC KẾT)</strong>\n              <span>Ghi bài học vào .agent/ · Lần sau không bao giờ lặp lại lỗi cũ</span>\n            </div>\n          </div>\n        </div>\n        \n    <div class=\"k-grid-3\">\n      \n        <div class=\"k-card k-step-item k-unreached\" id=\"s1_c1\" data-order=\"2\">\n          <div class=\"k-card-top-row\">\n            <span class=\"k-card-tag\" style=\"background:#FFF1E6; color:#C2410C; border:1px solid #FDBA74;\">LỆNH 1 · /GRILL-ME</span>\n            <span class=\"k-illus-badge\"><svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#EA580C\" stroke-width=\"2\"><rect x=\"3\" y=\"4\" width=\"18\" height=\"16\" rx=\"3\"/><path d=\"M8 10h8M8 14h5\"/></svg></span>\n          </div>\n          <h3>Chế độ Phỏng vấn Chuyên sâu</h3>\n          <p>Khi bạn có một ý tưởng mới nhưng chưa rõ chi tiết, gõ /grill-me để AI đóng vai cố vấn đặt 3-5 câu hỏi sắc bén giúp bạn làm rõ đề bài.</p>\n          <div class=\"k-card-mini-note\">🎯 Chặn đứng tình trạng AI đoán mò thiếu thực tế</div>\n        </div>\n        \n        <div class=\"k-card k-step-item k-unreached\" id=\"s1_c2\" data-order=\"3\">\n          <div class=\"k-card-top-row\">\n            <span class=\"k-card-tag\" style=\"background:#E0F2FE; color:#0369A1; border:1px solid #7DD3FC;\">LỆNH 2 · /PLAN</span>\n            <span class=\"k-illus-badge\"><svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#0284C7\" stroke-width=\"2\"><path d=\"M12 2L2 7l10 5 10-5-10-5z\"/><path d=\"M2 17l10 5 10-5M2 12l10 5 10-5\"/></svg></span>\n          </div>\n          <h3>Chế độ Lập Kế hoạch Trước khi Thi công</h3>\n          <p>Sau khi đã trả lời xong các câu hỏi của /grill-me, gõ /plan để AI xuất bản đề cương chi tiết ra tệp riêng trình bạn duyệt.</p>\n          <div class=\"k-card-mini-note\">🗺️ Bạn gật đầu duyệt khung sườn thì AI mới triển khai</div>\n        </div>\n        \n        <div class=\"k-card k-step-item k-unreached\" id=\"s1_c3\" data-order=\"4\">\n          <div class=\"k-card-top-row\">\n            <span class=\"k-card-tag\" style=\"background:#DCFCE7; color:#15803D; border:1px solid #86EFAC;\">LỆNH 3 · /LEARN</span>\n            <span class=\"k-illus-badge\"><svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#16A34A\" stroke-width=\"2\"><path d=\"M22 11.08V12a10 10 0 1 1-5.93-9.14\"/><polyline points=\"22 4 12 14.01 9 11.01\"/></svg></span>\n          </div>\n          <h3>Chế độ Tự Nâng cấp Bộ não .agent</h3>\n          <p>Mỗi khi bạn vừa sửa lỗi hoặc góp ý cho AI xong, hãy gõ /learn để AI tự rút kinh nghiệm và ghi thêm quy tắc vào .agent/rules/.</p>\n          <div class=\"k-card-mini-note\">🧬 Càng làm việc lâu, trợ lý càng hiểu ý bạn</div>\n        </div>\n        \n    </div>\n    <div class=\"k-callout k-step-item k-unreached\" id=\"s1_call\" data-order=\"5\">\n      <span>💡</span>\n      <div><strong>Khép lại Chương 3:</strong> Bộ ba <code>/grill-me</code> &rarr; <code>/plan</code> &rarr; <code>/learn</code> chính là quy trình chuẩn của mọi chuyên gia sử dụng Antigravity IDE.</div>\n    </div>"
  },
  "beats": [
    {
      "id": "b1",
      "label": "1. Tổng quan: Chu trình 3 lệnh vàng: /grill-me, /plan, /learn",
      "duration": 15.66,
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
      "caption": "Trong bài cuối cùng của <strong>Chương 3 — Bài 12</strong>, chúng ta làm chủ chu trình 3 lệnh vàng giúp giải quyết mọi đề bài khó: Dùng <code>/grill-me</code> để trợ lý phỏng vấn làm rõ yêu cầu, dùng <code>/plan</code> để chốt khung kế hoạch, và dùng <code>/learn</code> để trợ lý tự ghi nhớ bài học vào bộ não <code>.agent</code>.",
      "audio_src": "audio/lesson_12/b1.mp3",
      "audio_duration": 15.01
    },
    {
      "id": "b2",
      "label": "2. Minh họa: Cách chọn lệnh /grill-me và /plan trong khung chat",
      "duration": 9.37,
      "pose": 2,
      "mode": "sim",
      "pedagogy_type": "theory_type_2",
      "pedagogy_badge": "💡 Điểm cần lưu ý · Bảng Lệnh Chiến lược (/)",
      "pedagogy_title": "Quan sát nhóm lệnh /grill-me, /plan và /learn trong bảng gợi ý",
      "pedagogy_note": "Gõ dấu / trong khung chat để mở danh sách các quy trình tư vấn và lập kế hoạch có sẵn.",
      "onEnter": "kudoHidePopovers(); switchToSurface('ide'); openFileInEditor('COMPANY.md'); kudoOpenIdeSlashPopup();",
      "focus_selectors": [
        ".context-toolbar",
        "#ide-popup-menu",
        "#ide-chat-input"
      ],
      "cursor_selector": "#ide-popup-menu .popup-item:nth-child(2)",
      "cursor_label": "Chọn /grill-me để AI phỏng vấn làm rõ đề bài trước",
      "caption": "Nhìn vào bảng lệnh gạch chéo trên màn hình: Thay vì ra lệnh viết ngay, khi bắt đầu một đề án mới cho công ty, anh chị hãy chọn lệnh <code>/grill-me</code> để kích hoạt chế độ phỏng vấn ngược.",
      "audio_src": "audio/lesson_12/b2.mp3",
      "audio_duration": 8.72
    },
    {
      "id": "b3",
      "label": "3. Kỹ thuật: Cơ chế lệnh /learn tự động cập nhật .agent/rules/",
      "duration": 12.33,
      "pose": 3,
      "mode": "sim",
      "pedagogy_type": "theory_type_2",
      "pedagogy_badge": "💡 Điểm cần lưu ý · Cơ chế Tự Học (/learn)",
      "pedagogy_title": "Cách lệnh /learn biến lời góp ý của bạn thành quy tắc vĩnh viễn",
      "pedagogy_note": "Khi bạn sửa một lỗi trình bày của AI và gõ /learn, AI sẽ tự động mở tệp trong .agent/rules/ để ghi thêm dòng lưu ý mới.",
      "onEnter": "kudoSimScene({surface:'ide', breadcrumb:'.agent › rules › quy_chuan_van_phong.md (Vừa được /learn cập nhật)', editorTitle:'🧬 .agent/rules/quy_chuan_van_phong.md — Đã thêm bài học mới', editorHtml:'<div style=\"padding:16px;\"><h3 style=\"color:#9a3412;margin-top:0;\">CẬP NHẬT TỰ ĐỘNG BỞI LỆNH /LEARN</h3><div style=\"background:#ecfdf5;border-left:4px solid #10b981;padding:10px 14px;font-size:13px;\"><strong>+ Quy tắc số 4 (Mới đúc kết):</strong> Mọi kế hoạch mở rộng đại lý B2B của TaskFlow bắt buộc phải có cột <em>Chiết khấu theo bậc doanh số</em> và <em>Cam kết hỗ trợ kỹ thuật 24/7</em>.</div></div>', userMsg:'/learn Hãy nhớ rằng mọi bảng chính sách đại lý B2B đều phải có cột chiết khấu theo bậc và cam kết hỗ trợ 24/7 nhé.', aiMsg:'Đã thực thi <code>/learn</code>! Tôi đã ghi bổ sung Quy tắc số 4 vào tệp <code>.agent/rules/quy_chuan_van_phong.md</code> để áp dụng cho mọi lần sau.'});",
      "focus_selectors": [
        "#editor-canvas",
        "#ide-chat-messages"
      ],
      "cursor_selector": "#editor-canvas",
      "cursor_label": "Lệnh /learn tự động ghi thêm Quy tắc số 4 vào Rules",
      "caption": "Và đặc biệt nhất là lệnh <code>/learn</code> trên màn hình: Mỗi khi anh chị nhắc nhở trợ lý điều gì, chỉ cần gõ <code>/learn</code> là trợ lý tự động mở tệp trong <code>.agent/rules/</code> ra ghi thêm quy tắc mới để không bao giờ quên.",
      "audio_src": "audio/lesson_12/b3.mp3",
      "audio_duration": 11.68
    },
    {
      "id": "b4",
      "label": "4. Bước 1: Chạy /grill-me cho đề án Đại lý B2B TaskFlow",
      "duration": 12.81,
      "pose": 4,
      "mode": "sim",
      "pedagogy_type": "practice_step",
      "pedagogy_badge": "👆 Thực hành Bước 1/3 · Phỏng vấn với /grill-me",
      "pedagogy_title": "Cần mở rộng mạng lưới Đại lý B2B Quý 2 cho TaskFlow Inc.",
      "pedagogy_note": "Bước 1: Gõ /grill-me kèm đề bài mở rộng đại lý B2B để AI đặt 3 câu hỏi làm rõ thông số.",
      "onEnter": "kudoSimScene({surface:'ide', file:'COMPANY.md', userMsg:'/grill-me Tôi muốn mở rộng kênh đại lý phân phối phần mềm TaskFlow B2B trong Quý 2.', aiMsg:'<strong>Chế độ /grill-me kích hoạt:</strong> Trước khi lập kế hoạch, xin bạn chốt nhanh 3 thông số cốt lõi:<br>1. <strong>Quy mô đại lý mục tiêu:</strong> Nhắm tới công ty tư vấn IT hay đại lý thiết bị văn phòng?<br>2. <strong>Mức chiết khấu tối đa:</strong> Ngân sách cho phép chia sẻ bao nhiêu % doanh thu năm đầu?<br>3. <strong>Chỉ tiêu số lượng:</strong> Cần ký mới bao nhiêu đại lý trong Quý 2?', chatInput:'1. Công ty tư vấn IT; 2. Chiết khấu 25% năm đầu; 3. Ký mới 10 đại lý'});",
      "focus_selectors": [
        "#ide-chat-messages",
        "#ide-chat-input"
      ],
      "cursor_selector": "#ide-chat-input",
      "cursor_label": "Bước 1: Trả lời 3 câu hỏi sắc bén của /grill-me",
      "caption": "Chúng ta vào thực hành 3 bước với đề án mở rộng đại lý B2B cho công ty <strong>TaskFlow</strong>. Ở <strong>Bước 1</strong>, khi anh chị gõ <code>/grill-me</code>, trợ lý lập tức hỏi ngược 3 câu về đối tượng đại lý, mức chiết khấu và chỉ tiêu số lượng.",
      "audio_src": "audio/lesson_12/b4.mp3",
      "audio_duration": 12.16
    },
    {
      "id": "b5",
      "label": "5. Bước 2: Gõ /plan để xuất bản kế hoạch ke_hoach_mo_rong_b2b_q2.md",
      "duration": 14.4,
      "pose": 5,
      "mode": "sim",
      "pedagogy_type": "practice_step",
      "pedagogy_badge": "👆 Thực hành Bước 2/3 · Lập bản vẽ với /plan",
      "pedagogy_title": "Bước 2: Sau khi chốt thông số, gõ lệnh /plan để AI lập kế hoạch chi tiết",
      "pedagogy_note": "AI kết hợp thông tin từ @COMPANY.md và câu trả lời của bạn để tạo tệp ke_hoach_mo_rong_b2b_q2.md.",
      "onEnter": "kudoSimScene({surface:'ide', breadcrumb:'antigravity_course_vn › ke_hoach_mo_rong_b2b_q2.md (Bản kế hoạch /plan)', editorTitle:'🗺️ ke_hoach_mo_rong_b2b_q2.md — Bản Kế Hoạch Chờ Duyệt', editorHtml:'<div style=\"padding:16px;\"><h2 style=\"color:#9a3412;margin-top:0;\">KẾ HOẠCH MỞ RỘNG 10 ĐẠI LÝ IT B2B QUÝ 2 — TASKFLOW INC.</h2><ul><li><strong>Mục tiêu:</strong> Ký mới 10 đối tác tư vấn IT trước 30/06/2026.</li><li><strong>Chính sách hoa hồng:</strong> Chiết khấu 25% doanh thu gói Enterprise năm đầu.</li><li><strong>Lộ trình 3 giai đoạn:</strong> Tuần 1-2 (Bộ kit bán hàng) &rarr; Tuần 3-6 (Hội thảo đối tác) &rarr; Tuần 7-12 (Đào tạo &amp; Ký kết).</li></ul></div>', userMsg:'/plan Hãy lập bản kế hoạch mở rộng đại lý vào tệp ke_hoach_mo_rong_b2b_q2.md', aiMsg:'Đã hoàn tất bản kế hoạch tại <code>ke_hoach_mo_rong_b2b_q2.md</code> theo đúng 3 thông số bạn vừa chốt!'});",
      "focus_selectors": [
        "#editor-canvas",
        "#ide-chat-messages"
      ],
      "cursor_selector": "#editor-canvas",
      "cursor_label": "Bước 2: Nghiệm thu bản vẽ ke_hoach_mo_rong_b2b_q2.md",
      "caption": "Sang <strong>Bước 2</strong>, sau khi trả lời xong 3 câu hỏi, anh chị gõ lệnh <code>/plan</code>. Ngay lập tức bản kế hoạch 10 đại lý IT với mức chiết khấu 25% được xuất ra tệp <code>ke_hoach_mo_rong_b2b_q2.md</code> sát thực tế 100%.",
      "audio_src": "audio/lesson_12/b5.mp3",
      "audio_duration": 13.75
    },
    {
      "id": "b6",
      "label": "6. Bước 3: Chạy /learn đúc kết bài học",
      "duration": 13.76,
      "pose": 6,
      "mode": "sim",
      "pedagogy_type": "practice_step",
      "pedagogy_badge": "👆 Thực hành Bước 3/3 · Đúc kết bằng /learn",
      "pedagogy_title": "Bước 3: Gõ /learn để lưu tiêu chuẩn chính sách đại lý vào bộ não .agent",
      "pedagogy_note": "Bộ não .agent đã tự nâng cấp!",
      "onEnter": "kudoSimScene({surface:'ide', breadcrumb:'.agent › rules › quy_chuan_van_phong.md (Đã cập nhật bởi /learn)', editorTitle:'🧬 Đã lưu bài học mới vào .agent/rules/quy_chuan_van_phong.md', editorHtml:'<div style=\"padding:16px;\"><h3 style=\"color:#15803d;margin-top:0;\">✅ HOÀN TẤT CHU TRÌNH /GRILL-ME &rarr; /PLAN &rarr; /LEARN</h3><p>Trợ lý AI đã tự động cập nhật tiêu chuẩn <strong>Chính sách Đại lý B2B TaskFlow (Chiết khấu 25% + Cam kết SLA 24/7)</strong> vào bộ nhớ dài hạn của dự án.</p></div>', userMsg:'/learn Hãy lưu quy chuẩn chiết khấu 25% và cam kết hỗ trợ 24/7 cho kênh đại lý B2B vào bộ quy tắc của dự án.', aiMsg:'Đã thực thi <code>/learn</code> và cập nhật vào <code>.agent/rules/quy_chuan_van_phong.md</code>! Chúc mừng bạn đã hoàn thành trọn vẹn Chương 3.'});",
      "focus_selectors": [
        "#editor-canvas",
        "#ide-chat-messages"
      ],
      "cursor_selector": "#ide-chat-messages",
      "cursor_label": "Bước 3: Hoàn tất chu trình /grill-me -> /plan -> /learn!",
      "caption": "Ở <strong>Bước 3</strong>, anh chị gõ lệnh <code>/learn</code> để trợ lý ghi nhớ luôn quy chuẩn chiết khấu đại lý vào bộ não <code>.agent</code>. Chúc mừng anh chị đã hoàn thành <strong>Chương 3</strong>! Bây giờ chúng ta bước sang <strong>Chương 4 — Bài 13</strong> để xử lý kho tài liệu lớn và bảng tính dữ liệu.",
      "audio_src": "audio/lesson_12/b6.mp3",
      "audio_duration": 13.11
    }
  ]
};
