window.KUDO_SPEC = {
  "filename": "lesson_23.html",
  "legacy_alias": "",
  "code": "BÀI 23",
  "chapter_number": 6,
  "chapter_code": "CHƯƠNG 6",
  "chapter_title": "4 Tình huống Thực chiến Toàn diện (Case Studies)",
  "title": "Tình huống 3 — Xây dựng Trợ lý Nghiên cứu Pháp lý, Hợp đồng & Quy chế",
  "short_title": "Case Study 3: Hợp đồng & Pháp lý",
  "pill_label": "Bài 23 · Case 3: Hợp đồng & Pháp lý",
  "description": "Biến Trợ lý AI thành Chuyên viên Rà soát Rủi ro Hợp đồng: Đối chiếu dự thảo hợp đồng đối tác gửi với Danh mục Điều khoản Bảo vệ (Legal Checklist) của công ty, phát hiện các điều khoản bất lợi và đề xuất câu chữ sửa đổi.",
  "prerequisites": "Bài 6 (Trích dẫn dòng #L), Bài 10 (Thiết lập Rules/Skills kiểm duyệt) & Bài 13 (Bóc tách tài liệu có dẫn nguồn).",
  "dependents": "Bài 24 (Tình huống 4 — Tổng kết, Kiểm toán Chất lượng Độc lập /audit & Lộ trình Mở rộng).",
  "placement_risk": "0% Rủi ro — Nhấn mạnh nguyên tắc AI chỉ đối chiếu dựa trên văn bản quy chế chính thức được nạp vào thư mục, tuyệt đối không tự suy diễn luật bên ngoài.",
  "continuity_bridge": "Sau khi hoàn thành Tình huống Rà soát Hợp đồng ở Bài 23, Bài 24 sẽ khép lại toàn bộ khóa học bằng Tình huống Kiểm toán Chất lượng Độc lập (/audit) và xây dựng Hệ điều hành Cá nhân hóa.",
  "slides": {
    "s1": "<div>\n      <div class=\"k-slide-header\">\n        <span class=\"k-slide-kicker\">CHƯƠNG 6 · BÀI 23 · LÝ THUYẾT KIỂU 1 ( NGUYÊN LÝ &amp; TRỰC QUAN )</span>\n        <span class=\"k-slide-step\">Bố cục COMPARISON · Nhịp 1/6</span>\n      </div>\n      <div class=\"k-slide-h1\">Tình huống Thực chiến 3: Rà soát rủi ro Hợp đồng Kinh tế và Quy chế Nội bộ trong 3 phút</div>\n      <div class=\"k-slide-sub\">Phát hiện ngay các điều khoản phạt ẩn, điều khoản thanh toán bất lợi và tự động soạn lại câu chữ bảo vệ doanh nghiệp.</div>\n    </div>\n    \n        <div class=\"k-visual-hero-box k-layout-comparison\">\n          <div class=\"k-cmp-col k-cmp-before\">\n            <div class=\"k-cmp-badge-old\">❌ CÁCH LÀM CŨ · THỦ CÔNG RỜI RẠC</div>\n            <div class=\"k-cmp-main\">DỰ THẢO ĐỐI TÁC GỬI — hop_dong_dai_ly_du_thao.md</div>\n            <div class=\"k-cmp-sub\">Chứa các điều khoản có lợi cho họ</div>\n          </div>\n          <div class=\"k-cmp-arrow\">➔</div>\n          <div class=\"k-cmp-col k-cmp-after\">\n            <div class=\"k-cmp-badge-new\">✅ CÁCH LÀM MỚI · TRỢ LÝ AI TRONG THƯ MỤC</div>\n            <div class=\"k-cmp-main\">BẢNG ĐỀ XUẤT SỬA ĐỔI — bao_cao_ra_soat_hop_dong.md</div>\n            <div class=\"k-cmp-sub\">Đưa ra câu chữ thay thế an toàn</div>\n          </div>\n          <blockquote class=\"k-quote-box\">\n            <span class=\"k-quote-mark\">“</span>\n            <p>Rủi ro lớn nhất khi ký hợp đồng không nằm ở những điều khoản viết sai, mà nằm ở những điều khoản bị đối tác khéo léo lược bỏ. Một danh mục kiểm tra chuẩn trong .agent/skills/ sẽ không bao giờ bỏ sót dù chỉ một dòng.</p>\n          </blockquote>\n        </div>\n        \n    <div class=\"k-grid-3\">\n      \n        <div class=\"k-card k-step-item k-hl\" id=\"s1_c1\" data-order=\"1\">\n          <div class=\"k-card-top-row\">\n            <span class=\"k-card-tag\" style=\"background:#FFF1E6; color:#C2410C; border:1px solid #FDBA74;\">NGUYÊN TẮC 1 · ĐỐI CHIẾU CÓ CĂN CỨ</span>\n            <span class=\"k-illus-badge\"><svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#EA580C\" stroke-width=\"2\"><rect x=\"3\" y=\"4\" width=\"18\" height=\"16\" rx=\"3\"/><path d=\"M8 10h8M8 14h5\"/></svg></span>\n          </div>\n          <h3>Luôn nạp kèm Quy chế Chuẩn của công ty</h3>\n          <p>Đính kèm @quy_che_hop_dong_chuan.md để AI biết rõ giới hạn công nợ tối đa (15 ngày), mức phạt vi phạm và điều khoản bảo mật.</p>\n          <div class=\"k-card-mini-note\">⚖️ Không bao giờ để AI phán đoán cảm tính</div>\n        </div>\n        \n        <div class=\"k-card k-step-item k-hl\" id=\"s1_c2\" data-order=\"2\">\n          <div class=\"k-card-top-row\">\n            <span class=\"k-card-tag\" style=\"background:#E0F2FE; color:#0369A1; border:1px solid #7DD3FC;\">NGUYÊN TẮC 2 · PHÂN LOẠI 3 MỨC RỦI RO</span>\n            <span class=\"k-illus-badge\"><svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#0284C7\" stroke-width=\"2\"><path d=\"M12 2L2 7l10 5 10-5-10-5z\"/><path d=\"M2 17l10 5 10-5M2 12l10 5 10-5\"/></svg></span>\n          </div>\n          <h3>Đỏ (Bắt buộc sửa) · Vàng (Đàm phán) · Xanh (Đạt)</h3>\n          <p>Yêu cầu AI lập bảng 3 cột: Trích dẫn nguyên văn điều khoản gốc kèm số dòng -> Chỉ rõ rủi ro -> Viết lại câu chữ đề xuất sửa đổi.</p>\n          <div class=\"k-card-mini-note\">🚩 Nhìn vào cờ Đỏ biết ngay điểm cần đàm phán</div>\n        </div>\n        \n        <div class=\"k-card k-step-item k-hl\" id=\"s1_c3\" data-order=\"3\">\n          <div class=\"k-card-top-row\">\n            <span class=\"k-card-tag\" style=\"background:#DCFCE7; color:#15803D; border:1px solid #86EFAC;\">NGUYÊN TẮC 3 · KIỂM TRA ĐIỀU KHOẢN THIẾU</span>\n            <span class=\"k-illus-badge\"><svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#16A34A\" stroke-width=\"2\"><path d=\"M22 11.08V12a10 10 0 1 1-5.93-9.14\"/><polyline points=\"22 4 12 14.01 9 11.01\"/></svg></span>\n          </div>\n          <h3>Phát hiện các mục đối tác cố tình quên ghi</h3>\n          <p>AI tự động quét xem hợp đồng đã có điều khoản Bảo mật dữ liệu khách hàng (NDA) và Giới hạn trách nhiệm bồi thường hay chưa.</p>\n          <div class=\"k-card-mini-note\">🛡️ Khóa chặt các lỗ hổng pháp lý tiềm ẩn</div>\n        </div>\n        \n    </div>\n    <div class=\"k-callout k-step-item k-hl\" id=\"s1_call\" data-order=\"4\">\n      <span>💡</span>\n      <div><strong>Lưu ý An toàn Pháp lý:</strong> Báo cáo của AI là <em>Bản rà soát sơ bộ thông minh</em> giúp Giám đốc và Luật sư tiết kiệm 90% thời gian đọc dò thủ công.</div>\n    </div>"
  },
  "beats": [
    {
      "id": "b1",
      "label": "1. [Lý thuyết Kiểu 1] Cơ chế đối chiếu chéo rà soát rủi ro hợp đồng",
      "duration": 15.83,
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
      "caption": "Trong <strong>Bài 23 — Tình huống Thực chiến 3</strong>, chúng ta ứng dụng trợ lý AI vào một nghiệp vụ đòi hỏi sự tỉ mỉ tuyệt đối: Rà soát hợp đồng kinh tế và quy chế nội bộ. Khung đối sánh trên màn hình chỉ ra cách dùng quy chế chuẩn của công ty để bắt lỗi bản dự thảo do đối tác gửi sang.",
      "audio_src": "audio/lesson_23/b1.mp3",
      "audio_duration": 15.18
    },
    {
      "id": "b2",
      "label": "2. [Lý thuyết Kiểu 2] Quan sát tệp Quy chế Hợp đồng Chuẩn của công ty",
      "duration": 11.77,
      "pose": 2,
      "mode": "sim",
      "pedagogy_type": "theory_type_2",
      "pedagogy_badge": "📘 Lý thuyết Kiểu 2 · Danh mục Bảo vệ Pháp lý (Checklist)",
      "pedagogy_title": "4 chốt chặn bắt buộc trong tệp quy_che_hop_dong_chuan.md",
      "pedagogy_note": "Mọi hợp đồng đại lý của TaskFlow phải đảm bảo: Hạn thanh toán tối đa 15 ngày, Chiết khấu không quá 25% và bắt buộc có điều khoản Bảo mật NDA.",
      "onEnter": "kudoSimScene({surface:'ide', breadcrumb:'antigravity_course_vn › quy_che_hop_dong_chuan.md', editorTitle:'⚖️ quy_che_hop_dong_chuan.md — Chốt Chặn Pháp Lý TaskFlow', editorHtml:'<div style=\"padding:16px;\"><h3 style=\"color:#9a3412;margin-top:0;\">CHỐT CHẶN BẮT BUỘC KHI KÝ HỢP ĐỒNG ĐẠI LÝ B2B</h3><ol><li><strong>Thời hạn thanh toán công nợ:</strong> Tối đa <strong>15 ngày làm việc</strong> kể từ ngày xuất hóa đơn (Cấm chấp nhận 45-60 ngày).</li><li><strong>Mức chiết khấu đại lý:</strong> Tối đa <strong>25%</strong> doanh thu năm đầu tiên.</li><li><strong>Bảo mật dữ liệu (NDA):</strong> Bắt buộc có điều khoản phạt vi phạm nếu làm lộ danh sách khách hàng.</li></ol></div>'});",
      "focus_selectors": [
        "#editor-canvas"
      ],
      "cursor_selector": "#editor-canvas",
      "cursor_label": "3 chốt chặn pháp lý chuẩn của doanh nghiệp",
      "caption": "Nhìn vào tệp <code>quy_che_hop_dong_chuan.md</code> ở cột giữa: Đây chính là cây thước đo pháp lý của công ty chúng ta, quy định rõ thời hạn công nợ tối đa chỉ là 15 ngày và bắt buộc phải có điều khoản bảo mật dữ liệu khách hàng.",
      "audio_src": "audio/lesson_23/b2.mp3",
      "audio_duration": 11.12
    },
    {
      "id": "b3",
      "label": "3. [Lý thuyết Kiểu 2] Bảng phát hiện điều khoản bất lợi kèm câu chữ sửa lại",
      "duration": 13.21,
      "pose": 3,
      "mode": "sim",
      "pedagogy_type": "theory_type_2",
      "pedagogy_badge": "📘 Lý thuyết Kiểu 2 · Báo cáo Rà soát Đỏ / Vàng / Xanh",
      "pedagogy_title": "AI chỉ rõ số dòng bất lợi và viết sẵn đoạn văn bản thay thế để đàm phán",
      "pedagogy_note": "Phát hiện đối tác tự ý ghi hạn thanh toán 45 ngày tại Điều 4.2 và bỏ quên điều khoản Bảo mật dữ liệu.",
      "onEnter": "kudoSimScene({surface:'ide', breadcrumb:'antigravity_course_vn › bao_cao_ra_soat_hop_dong.md', editorTitle:'🚩 bao_cao_ra_soat_hop_dong.md — Phát Hiện 2 Rủi Ro Đỏ Cần Sửa Ngay', editorHtml:'<div style=\"padding:16px;\"><h3 style=\"color:#9a3412;margin-top:0;\">BẢNG RÀ SOÁT RỦI RO DỰ THẢO HỢP ĐỒNG ĐẠI LÝ SAO VIỆT</h3><div style=\"background:#fef2f2;border-left:4px solid #ef4444;padding:10px 12px;margin-bottom:10px;font-size:13px;\">🔴 <strong>Rủi ro Đỏ #1 [Điều 4.2 - Dòng 28]:</strong> Đối tác đang ghi thời hạn thanh toán là <strong>45 ngày</strong> (Vi phạm chốt chặn tối đa 15 ngày).<br>&rarr; <strong>Đề xuất sửa lại:</strong> <em>\"Bên B thanh toán cho Bên A trong vòng 15 ngày làm việc kể từ ngày nhận hóa đơn GTGT.\"</em></div><div style=\"background:#fef2f2;border-left:4px solid #ef4444;padding:10px 12px;font-size:13px;\">🔴 <strong>Rủi ro Đỏ #2 [Thiếu điều khoản]:</strong> Dự thảo hoàn toàn <strong>không có điều khoản Bảo mật thông tin khách hàng (NDA)</strong>.<br>&rarr; <strong>Đề xuất bổ sung Điều 7:</strong> <em>\"Cam kết bảo mật tuyệt đối dữ liệu khách hàng trên hệ thống TaskFlow.\"</em></div></div>'});",
      "focus_selectors": [
        "#editor-canvas"
      ],
      "cursor_selector": "#editor-canvas",
      "cursor_label": "Gắn cờ Đỏ đúng dòng vi phạm kèm câu chữ sửa lại",
      "caption": "Khi đối chiếu với bản hợp đồng do đối tác gửi sang, báo cáo ở cột giữa lập tức gắn cờ Đỏ vào Điều 4.2 vì đối tác lén kéo dài hạn thanh toán lên 45 ngày, đồng thời viết sẵn luôn câu chữ chuẩn để chúng ta gửi lại đàm phán!",
      "audio_src": "audio/lesson_23/b3.mp3",
      "audio_duration": 12.56
    },
    {
      "id": "b4",
      "label": "4. [Thực hành B1/3] Bối cảnh & Mở bản dự thảo hợp đồng đối tác gửi",
      "duration": 8.09,
      "pose": 4,
      "mode": "sim",
      "pedagogy_type": "practice_step",
      "pedagogy_badge": "🛠️ Thực hành Bước 1/3 · Kiểm tra Dự thảo Hợp đồng",
      "pedagogy_title": "Bối cảnh: Đại lý Sao Việt gửi bản dự thảo hợp đồng cần ký gấp chiều nay",
      "pedagogy_note": "Bước 1: Mở tệp hop_dong_dai_ly_du_thao.md ở cột giữa để chuẩn bị rà soát chéo.",
      "onEnter": "kudoSimScene({surface:'ide', breadcrumb:'antigravity_course_vn › hop_dong_dai_ly_du_thao.md', editorTitle:'📄 hop_dong_dai_ly_du_thao.md — Dự Thảo Do Đối Tác Gửi', editorHtml:'<div style=\"padding:16px;\"><h3 style=\"color:#9a3412;margin-top:0;\">DỰ THẢO HỢP ĐỒNG ĐẠI LÝ PHÂN PHỐI (ĐỐI TÁC SOẠN)</h3><p><strong>Điều 3.1:</strong> Mức chiết khấu đại lý năm đầu là 25%.</p><p><strong>Điều 4.2 (Dòng 28):</strong> Bên B thanh toán công nợ cho Bên A trong vòng 45 ngày kể từ ngày kết thúc quý.</p></div>'});",
      "focus_selectors": [
        "#editor-canvas"
      ],
      "cursor_selector": "#editor-canvas",
      "cursor_label": "Bước 1: Mở bản dự thảo hop_dong_dai_ly_du_thao.md",
      "caption": "Chúng ta vào thực hành 3 bước rà soát hợp đồng. Ở <strong>Bước 1</strong>, anh chị mở tệp dự thảo <code>hop_dong_dai_ly_du_thao.md</code> vừa nhận được từ đối tác.",
      "audio_src": "audio/lesson_23/b4.mp3",
      "audio_duration": 7.44
    },
    {
      "id": "b5",
      "label": "5. [Thực hành B2/3] Gửi lệnh đối chiếu 1-1 giữa Dự thảo và Quy chế chuẩn",
      "duration": 9.45,
      "pose": 5,
      "mode": "sim",
      "pedagogy_type": "practice_step",
      "pedagogy_badge": "🛠️ Thực hành Bước 2/3 · Ra lệnh Đối chiếu Pháp lý",
      "pedagogy_title": "Bước 2: Đính kèm @hop_dong_dai_ly_du_thao.md và @quy_che_hop_dong_chuan.md",
      "pedagogy_note": "Yêu cầu AI tìm các điều khoản trái quy chế, các điều khoản bị thiếu và xuất ra bao_cao_ra_soat_hop_dong.md.",
      "onEnter": "kudoSimScene({surface:'ide', clearChat:true, chatInput:'@hop_dong_dai_ly_du_thao.md @quy_che_hop_dong_chuan.md Hãy đối chiếu 1-1 bản dự thảo với quy chế chuẩn, gắn cờ Đỏ/Vàng kèm số dòng và viết câu chữ đề xuất sửa đổi vào tệp bao_cao_ra_soat_hop_dong.md'});",
      "focus_selectors": [
        "#ide-chat-input",
        "#ide-send-btn"
      ],
      "cursor_selector": "#ide-send-btn",
      "cursor_label": "Bước 2: Nhấn Gửi để AI kiểm toán hợp đồng",
      "caption": "Sang <strong>Bước 2</strong>, anh chị đính kèm cả tệp dự thảo của đối tác lẫn tệp quy chế chuẩn của công ty vào ô chat, yêu cầu gắn cờ rủi ro kèm câu chữ sửa đổi rồi nhấn nút Gửi.",
      "audio_src": "audio/lesson_23/b5.mp3",
      "audio_duration": 8.8
    },
    {
      "id": "b6",
      "label": "6. [Thực hành B3/3] Nghiệm thu Báo cáo rà soát & Bước vào Bài Cuối 24",
      "duration": 11.53,
      "pose": 6,
      "mode": "sim",
      "pedagogy_type": "practice_step",
      "pedagogy_badge": "🛠️ Thực hành Bước 3/3 · Nghiệm thu Case Study 3",
      "pedagogy_title": "Bước 3: Nghiệm thu bao_cao_ra_soat_hop_dong.md bắt trúng 2 lỗ hổng lớn",
      "pedagogy_note": "Nghiệm thu: Đã chặn đứng rủi ro công nợ 45 ngày và bổ sung NDA. Tiếp theo: Bài 24 Tổng kết khóa học & Kiểm toán /audit!",
      "onEnter": "kudoSimScene({surface:'ide', breadcrumb:'antigravity_course_vn › bao_cao_ra_soat_hop_dong.md (Hoàn tất)', editorTitle:'🛡️ bao_cao_ra_soat_hop_dong.md — Đã Bảo Vệ An Toàn Pháp Lý Doanh Nghiệp', editorHtml:'<div style=\"padding:16px;\"><h2 style=\"color:#15803d;margin-top:0;\">✅ BÁO CÁO RÀ SOÁT HỢP ĐỒNG ĐẠI LÝ HOÀN TẤT</h2><ul><li><strong>Điều khoản Đạt chuẩn (Xanh):</strong> Điều 3.1 — Chiết khấu 25% (Khớp quy chế).</li><li><strong>Điều khoản Bắt buộc sửa (Đỏ):</strong> Điều 4.2 — Rút thời hạn công nợ từ 45 ngày về <strong>15 ngày làm việc</strong>.</li><li><strong>Điều khoản Bắt buộc thêm (Đỏ):</strong> Bổ sung nguyên văn Điều 7 về <strong>Bảo mật dữ liệu khách hàng (NDA)</strong>.</li></ul></div>', userMsg:'@hop_dong_dai_ly_du_thao.md @quy_che_hop_dong_chuan.md Hãy xuất báo cáo rà soát vào bao_cao_ra_soat_hop_dong.md', aiMsg:'Đã hoàn tất kiểm toán hợp đồng tại <code>bao_cao_ra_soat_hop_dong.md</code>! Phát hiện 2 rủi ro mức Đỏ cần yêu cầu đối tác chỉnh sửa trước khi ký.'});",
      "focus_selectors": [
        "#editor-canvas",
        "#ide-chat-messages"
      ],
      "cursor_selector": "#editor-canvas",
      "cursor_label": "Bước 3: Phát hiện và chặn đứng 2 rủi ro hợp đồng!",
      "caption": "Ở <strong>Bước 3</strong>, bản báo cáo rà soát đã chỉ rõ cả điều khoản đạt chuẩn lẫn 2 rủi ro mức Đỏ cần sửa ngay trước khi đặt bút ký. Bây giờ, chúng ta cùng bước vào bài học cuối cùng của khóa học — <strong>Bài 24</strong>!",
      "audio_src": "audio/lesson_23/b6.mp3",
      "audio_duration": 10.88
    }
  ]
};
