window.KUDO_SPEC = {
  "filename": "lesson_08.html",
  "legacy_alias": "",
  "code": "BÀI 8",
  "chapter_number": 2,
  "chapter_code": "CHƯƠNG 2",
  "chapter_title": "Định dạng Dữ liệu, Ký hiệu @ & Hồ sơ Cá nhân hóa",
  "title": "Quản trị Trí nhớ Dự án Dài hạn & Sổ Bàn giao Giữa Các Phiên Chat",
  "short_title": "Trí nhớ Dự án & Sổ Bàn giao",
  "pill_label": "Bài 8 · Trí nhớ & Bàn giao",
  "description": "Khắc phục nhược điểm 'quên ngữ cảnh' khi cuộc trò chuyện quá dài bằng quy trình chốt Sổ bàn giao công việc (ban_giao_cong_viec.md) cuối mỗi ca và nạp lại trong 5 giây ở phiên chat mới.",
  "prerequisites": "Bài 6 (Đính kèm tệp bằng @) & Bài 7 (Cá nhân hóa bằng @troly.md).",
  "dependents": "Chương 3 (Tự động hóa hoàn toàn việc nạp ngữ cảnh và quy trình bằng kiến trúc .agent/).",
  "placement_risk": "0% Rủi ro — Giải quyết triệt để nỗi sợ mất lịch sử làm việc khi mở cửa sổ chat mới của học viên.",
  "continuity_bridge": "Kết thúc Chương 2, học viên đã biết đính kèm @troly.md và @ban_giao_cong_viec.md thủ công. Sang Chương 3 (Bài 9), chúng ta sẽ nâng cấp lên thư mục .agent để AI tự động nhớ mà không cần gõ @ mỗi lần!",
  "slides": {
    "s1": "<div>\n      <div class=\"k-slide-header\">\n        <span class=\"k-slide-kicker\">CHƯƠNG 2 · BÀI 8 · LÝ THUYẾT KIỂU 1 ( NGUYÊN LÝ &amp; TRỰC QUAN )</span>\n        <span class=\"k-slide-step\">Bố cục TIMELINE · Nhịp 1/6</span>\n      </div>\n      <div class=\"k-slide-h1\">Làm sao để mở khung chat mới tinh mà Trợ lý AI vẫn nhớ 100% công việc hôm qua?</div>\n      <div class=\"k-slide-sub\">Chuyển trí nhớ từ khung chat tạm thời sang tệp Sổ bàn giao nằm bền vững trên ổ cứng máy tính.</div>\n    </div>\n    \n        <div class=\"k-visual-hero-box k-layout-timeline\">\n          <div class=\"k-viz-header\">\n            <span class=\"k-viz-badge\">⏱️ LỘ TRÌNH &amp; CHU TRÌNH THỰC THI CHUẨN</span>\n            <span class=\"k-viz-title\">Vòng đời 3 bước bảo toàn trí nhớ dự án qua nhiều ngày làm việc</span>\n          </div>\n          <div class=\"k-tl-track\">\n            <div class=\"k-tl-step\">\n              <span class=\"k-tl-num\">Chặng 1</span>\n              <strong>CUỐI CA LÀM VIỆC</strong>\n              <span>Yêu cầu AI ghi sổ bàn giao · Lưu vào ban_giao_cong_viec.md</span>\n            </div>\n            <div class=\"k-tl-conn\">──▶</div>\n            <div class=\"k-tl-step\">\n              <span class=\"k-tl-num\">Chặng 2</span>\n              <strong>MỞ PHIÊN CHAT MỚI (+)</strong>\n              <span>Giải phóng bộ nhớ đầy · AI nhẹ đầu, phản hồi nhanh</span>\n            </div>\n            <div class=\"k-tl-conn\">──▶</div>\n            <div class=\"k-tl-step k-tl-final\">\n              <span class=\"k-tl-num\">Chặng 3</span>\n              <strong>ĐẦU CA HÔM SAU</strong>\n              <span>Gõ @ban_giao_cong_viec.md · Khôi phục 100% mạch công việc</span>\n            </div>\n          </div>\n        </div>\n        \n    <div class=\"k-grid-3\">\n      \n        <div class=\"k-card k-step-item k-hl\" id=\"s1_c1\" data-order=\"1\">\n          <div class=\"k-card-top-row\">\n            <span class=\"k-card-tag\" style=\"background:#FFF1E6; color:#C2410C; border:1px solid #FDBA74;\">VẤN ĐỀ · TRÀN BỘ NHỚ NGỮ CẢNH</span>\n            <span class=\"k-illus-badge\"><svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#EA580C\" stroke-width=\"2\"><rect x=\"3\" y=\"4\" width=\"18\" height=\"16\" rx=\"3\"/><path d=\"M8 10h8M8 14h5\"/></svg></span>\n          </div>\n          <h3>Vì sao chat càng dài AI càng chậm và dễ quên?</h3>\n          <p>Khi một luồng chat kéo dài qua nhiều chủ đề, các tin nhắn cũ gây nhiễu khiến AI xử lý chậm và dễ nhầm lẫn số liệu.</p>\n          <div class=\"k-card-mini-note\">⚠️ Dấu hiệu: AI bắt đầu trả lời lạc đề hoặc lặp lại</div>\n        </div>\n        \n        <div class=\"k-card k-step-item k-hl\" id=\"s1_c2\" data-order=\"2\">\n          <div class=\"k-card-top-row\">\n            <span class=\"k-card-tag\" style=\"background:#E0F2FE; color:#0369A1; border:1px solid #7DD3FC;\">GIẢI PHÁP · TỆP SỔ BÀN GIAO</span>\n            <span class=\"k-illus-badge\"><svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#0284C7\" stroke-width=\"2\"><path d=\"M12 2L2 7l10 5 10-5-10-5z\"/><path d=\"M2 17l10 5 10-5M2 12l10 5 10-5\"/></svg></span>\n          </div>\n          <h3>Chốt trạng thái trước khi đóng máy</h3>\n          <p>Cuối mỗi buổi làm việc, yêu cầu AI tóm tắt 3 mục vào tệp ban_giao_cong_viec.md: Việc đã xong, Quyết định đã chốt, Việc làm tiếp.</p>\n          <div class=\"k-card-mini-note\">📒 Lưu cứng trên ổ đĩa, không bao giờ mất</div>\n        </div>\n        \n        <div class=\"k-card k-step-item k-hl\" id=\"s1_c3\" data-order=\"3\">\n          <div class=\"k-card-top-row\">\n            <span class=\"k-card-tag\" style=\"background:#DCFCE7; color:#15803D; border:1px solid #86EFAC;\">KỸ THUẬT · NỐI MẠCH 5 GIÂY</span>\n            <span class=\"k-illus-badge\"><svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#16A34A\" stroke-width=\"2\"><path d=\"M22 11.08V12a10 10 0 1 1-5.93-9.14\"/><polyline points=\"22 4 12 14.01 9 11.01\"/></svg></span>\n          </div>\n          <h3>Bắt đầu ngày mới nhẹ nhàng, chuẩn xác</h3>\n          <p>Sáng hôm sau bấm nút (+) mở phiên chat mới, gõ '@ban_giao_cong_viec.md Hãy làm tiếp mục số 3' là AI vào việc ngay.</p>\n          <div class=\"k-card-mini-note\">🚀 Phản hồi cực nhanh với ngữ cảnh sạch 100%</div>\n        </div>\n        \n    </div>\n    <div class=\"k-callout k-step-item k-hl\" id=\"s1_call\" data-order=\"4\">\n      <span>💡</span>\n      <div><strong>Thói quen chuyên nghiệp:</strong> Mỗi nhiệm vụ lớn là một luồng chat riêng; kết nối giữa các luồng chat bằng tệp <code>ban_giao_cong_viec.md</code>.</div>\n    </div>"
  },
  "beats": [
    {
      "id": "b1",
      "label": "1. [Lý thuyết Kiểu 1] Vòng đời 3 bước bảo toàn trí nhớ dự án",
      "duration": 12.53,
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
      "caption": "Một câu hỏi rất thực tế của dân văn phòng là: Hôm nay làm việc với AI xong, ngày mai mở phiên chat mới thì làm sao để AI nhớ hết các quyết định hôm qua? Quy trình 3 bước trên màn hình với tệp <code>ban_giao_cong_viec.md</code> chính là chìa khóa.",
      "audio_src": "audio/lesson_08/b1.mp3",
      "audio_duration": 11.88
    },
    {
      "id": "b2",
      "label": "2. [Lý thuyết Kiểu 2] Nhận biết khi nào cần tạo phiên chat mới (+)",
      "duration": 10.49,
      "pose": 2,
      "mode": "sim",
      "pedagogy_type": "theory_type_2",
      "pedagogy_badge": "📘 Lý thuyết Kiểu 2 · Quản lý Phiên Chat (Threads)",
      "pedagogy_title": "Cách đóng phiên chat cũ đã dài và mở phiên chat mới sạch sẽ",
      "pedagogy_note": "Mỗi khi chuyển sang một đầu việc mới hoặc cuối ngày làm việc, hãy yêu cầu AI ghi sổ bàn giao trước khi mở phiên mới.",
      "onEnter": "kudoSimScene({surface:'ide', file:'COMPANY.md', userMsg:'Tổng hợp toàn bộ các việc chúng ta đã làm từ sáng đến giờ', aiMsg:'Luồng hội thoại hiện tại đã trải qua 18 bước xử lý. Để bộ nhớ luôn sắc bén, bạn nên chốt kết quả vào tệp <code>ban_giao_cong_viec.md</code> trên ổ cứng!'});",
      "focus_selectors": [
        "#ide-chat-messages",
        "#ide-chat-input"
      ],
      "cursor_selector": "#ide-chat-messages",
      "cursor_label": "Chốt sổ bàn giao khi luồng hội thoại đã dài",
      "caption": "Nhìn vào cột phải trên màn hình: Khi một luồng trò chuyện đã kéo dài qua hàng chục bước, việc tiếp tục nhồi thêm yêu cầu mới sẽ làm trợ lý bị phân tán. Đó là lúc chúng ta cần chốt sổ bàn giao.",
      "audio_src": "audio/lesson_08/b2.mp3",
      "audio_duration": 9.84
    },
    {
      "id": "b3",
      "label": "3. [Lý thuyết Kiểu 2] Cấu trúc chuẩn 3 phần của Sổ bàn giao công việc",
      "duration": 10.89,
      "pose": 3,
      "mode": "sim",
      "pedagogy_type": "theory_type_2",
      "pedagogy_badge": "📘 Lý thuyết Kiểu 2 · Cấu trúc Sổ Bàn Giao",
      "pedagogy_title": "3 mục bắt buộc trong tệp ban_giao_cong_viec.md",
      "pedagogy_note": "1. Các tệp đã hoàn thành; 2. Các thông số/quyết định đã chốt; 3. Danh sách việc cần làm tiếp trong ca sau.",
      "onEnter": "kudoSimScene({surface:'ide', breadcrumb:'antigravity_course_vn › ban_giao_cong_viec.md', editorTitle:'📒 ban_giao_cong_viec.md — Sổ Bàn Giao Dự Án', editorHtml:'<div style=\"padding:16px;\"><h2 style=\"color:#9a3412;margin-top:0;\">SỔ BÀN GIAO CÔNG VIỆC — DỰ ÁN TASKFLOW QUÝ 2</h2><h4>1. Hạng mục đã hoàn thành (Done)</h4><ul><li>Đã chuẩn hóa hồ sơ <code>@COMPANY.md</code> và <code>@troly.md</code>.</li><li>Đã ban hành thông báo mục tiêu Quý 2 tại <code>thong_bao_q2.md</code>.</li></ul><h4>2. Quyết định quan trọng đã chốt (Key Decisions)</h4><ul><li>Chỉ tiêu giảm Churn Rate chốt ở mức <strong>30%</strong> (từ 6.2% xuống 4.3%).</li></ul><h4>3. Việc cần làm tiếp ở phiên sau (Next Actions)</h4><ul><li>[ ] Phân tích chi tiết bảng <code>sales_data.csv</code> theo từng khu vực.</li></ul></div>'});",
      "focus_selectors": [
        "#editor-canvas"
      ],
      "cursor_selector": "#editor-canvas",
      "cursor_label": "3 mục chuẩn: Đã xong - Đã chốt - Làm tiếp",
      "caption": "Trên màn hình cột giữa là cấu trúc chuẩn của tệp <code>ban_giao_cong_viec.md</code> do chính AI tự ghi lại: Gồm các hạng mục đã hoàn thành, những con số đã chốt và danh sách việc cần làm tiếp theo.",
      "audio_src": "audio/lesson_08/b3.mp3",
      "audio_duration": 10.24
    },
    {
      "id": "b4",
      "label": "4. [Thực hành B1/3] Bối cảnh & Ra lệnh cho AI tự ghi Sổ bàn giao",
      "duration": 10.17,
      "pose": 4,
      "mode": "sim",
      "pedagogy_type": "practice_step",
      "pedagogy_badge": "🛠️ Thực hành Bước 1/3 · Lệnh chốt Sổ bàn giao",
      "pedagogy_title": "Bối cảnh: Hết giờ làm việc chiều thứ Năm, cần lưu lại toàn bộ tiến độ",
      "pedagogy_note": "Bước 1: Gõ lệnh yêu cầu AI tổng hợp tiến độ hiện tại vào tệp ban_giao_cong_viec.md rồi bấm Gửi.",
      "onEnter": "kudoSimScene({surface:'ide', file:'COMPANY.md', clearChat:true, chatInput:'Hãy tổng hợp toàn bộ kết quả làm việc hôm nay, các con số đã chốt và việc cần làm ngày mai vào tệp ban_giao_cong_viec.md'});",
      "focus_selectors": [
        "#ide-chat-input",
        "#ide-send-btn"
      ],
      "cursor_selector": "#ide-send-btn",
      "cursor_label": "Bước 1: Yêu cầu AI ghi tệp ban_giao_cong_viec.md",
      "caption": "Chúng ta thực hành 3 bước bàn giao giữa các ca làm việc. Ở <strong>Bước 1</strong>, trước khi nghỉ chiều, anh chị gõ lệnh yêu cầu trợ lý tổng hợp tiến độ hôm nay vào tệp <code>ban_giao_cong_viec.md</code>.",
      "audio_src": "audio/lesson_08/b4.mp3",
      "audio_duration": 9.52
    },
    {
      "id": "b5",
      "label": "5. [Thực hành B2/3] Mở phiên chat mới và đính kèm @ban_giao_cong_viec.md",
      "duration": 9.53,
      "pose": 5,
      "mode": "sim",
      "pedagogy_type": "practice_step",
      "pedagogy_badge": "🛠️ Thực hành Bước 2/3 · Khôi phục ngữ cảnh ca mới",
      "pedagogy_title": "Bước 2: Sáng hôm sau mở chat mới và gõ @ban_giao_cong_viec.md",
      "pedagogy_note": "Đính kèm @ban_giao_cong_viec.md kèm yêu cầu thực hiện ngay mục việc cần làm tiếp theo.",
      "onEnter": "kudoSimScene({surface:'ide', clearChat:true, chatInput:'@ban_giao_cong_viec.md @sales_data.csv Hãy đọc sổ bàn giao hôm qua và thực hiện ngay mục việc cần làm tiếp theo.'});",
      "focus_selectors": [
        "#ide-chat-input",
        "#ide-send-btn"
      ],
      "cursor_selector": "#ide-send-btn",
      "cursor_label": "Bước 2: Nạp lại @ban_giao_cong_viec.md trong 5 giây",
      "caption": "Sang <strong>Bước 2</strong>, sáng hôm sau khi mở phiên chat mới tinh, anh chị chỉ mất 5 giây gõ <code>@ban_giao_cong_viec.md</code> và bảo trợ lý làm tiếp mục đang dang dở.",
      "audio_src": "audio/lesson_08/b5.mp3",
      "audio_duration": 8.88
    },
    {
      "id": "b6",
      "label": "6. [Thực hành B3/3] Nghiệm thu AI nối mạch hoàn hảo & Sang Chương 3",
      "duration": 14.41,
      "pose": 6,
      "mode": "sim",
      "pedagogy_type": "practice_step",
      "pedagogy_badge": "🛠️ Thực hành Bước 3/3 · Nghiệm thu Chương 2",
      "pedagogy_title": "Bước 3: Trợ lý AI nhớ chính xác chỉ tiêu 30% hôm qua và chạy tiếp việc mới",
      "pedagogy_note": "Nghiệm thu: Không mất 1% ngữ cảnh nào giữa các ngày. Tiếp theo: Chương 3 (Bài 9) xây dựng Bộ não .agent tự động hóa!",
      "onEnter": "kudoSimScene({surface:'ide', breadcrumb:'antigravity_course_vn › ban_giao_cong_viec.md (Đã cập nhật Ca 2)', editorTitle:'📒 ban_giao_cong_viec.md — Đã nối mạch thành công', editorHtml:'<div style=\"padding:16px;\"><h2 style=\"color:#15803d;margin-top:0;\">✅ ĐÃ KHÔI PHỤC NGỮ CẢNH &amp; HOÀN TẤT HẠNG MỤC TIẾP THEO</h2><p><strong>Ngữ cảnh nhận diện từ Ca 1:</strong> Mục tiêu giảm Churn Rate 30% (về mức 4.3%).</p><p><strong>Kết quả thực thi Ca 2:</strong> Đã đối chiếu <code>sales_data.csv</code> và phát hiện nhóm khách hàng SMB cần ưu tiên chăm sóc đầu tiên.</p></div>', userMsg:'@ban_giao_cong_viec.md @sales_data.csv Hãy đọc sổ bàn giao hôm qua và thực hiện ngay mục việc cần làm tiếp theo.', aiMsg:'Đã đọc <code>@ban_giao_cong_viec.md</code>! Tôi ghi nhớ chỉ tiêu giảm Churn Rate 30% đã chốt hôm qua và vừa hoàn tất bước phân tích <code>@sales_data.csv</code> tiếp theo cho bạn.'});",
      "focus_selectors": [
        "#ide-chat-messages",
        "#editor-canvas"
      ],
      "cursor_selector": "#ide-chat-messages",
      "cursor_label": "Bước 3: AI nhớ trọn vẹn ngữ cảnh hôm qua!",
      "caption": "Ở <strong>Bước 3</strong>, anh chị thấy trợ lý nhắc lại chính xác chỉ tiêu 30% đã chốt hôm qua và bắt tay làm ngay việc tiếp theo. Vậy làm sao để AI tự động tuân thủ nội quy mà không cần ta gõ <code>@troly.md</code> mỗi lần? Chào mừng anh chị sang <strong>Chương 3 — Bài 9</strong>!",
      "audio_src": "audio/lesson_08/b6.mp3",
      "audio_duration": 13.76
    }
  ]
};
