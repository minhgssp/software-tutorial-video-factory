window.KUDO_SPEC = {
  "code": "BÀI 1.3",
  "title": "Đánh giá qua tệp đầu ra trên ổ cứng và cách tổ chức thư mục .agent (Rules, Skills, Workflows)",
  "short_title": "1.3 · Tổ chức .agent (Rules, Skills, Workflows)",
  "filename": "lesson_03_bo_ba_rule_skill_workflow.html",
  "description": "Ẩn dụ căn bếp cho Rules, Skills, Workflows cùng hồ sơ @troly.md, nghiệm thu sản phẩm đầu ra và chu trình 3 lệnh /grill-me, /plan, /learn.",
  "slides": {
    "s1": "<div>\n                <div class=\"k-slide-header\">\n                  <span class=\"k-slide-kicker\">Phần 3 · Tổ chức bộ nhớ dài hạn cho trợ lý</span>\n                  <span class=\"k-slide-step\">Cảnh 1 / 2 · Lý thuyết</span>\n                </div>\n                <div class=\"k-slide-h1\">Ẩn dụ căn bếp nấu ăn: phân biệt Rules, Skills, Workflows và hồ sơ cá nhân</div>\n                <div class=\"k-slide-sub\">Làm sao để trợ lý AI nhớ quy chuẩn của công ty bạn lâu dài và tạo ra sản phẩm hoàn chỉnh ngay trong thư mục?</div>\n              </div>\n              <div class=\"k-grid-3\">\n                <div class=\"k-card k-step-item\" id=\"sl-c1\" data-order=\"1\">\n                  <span class=\"k-card-tag\" style=\"background:#FEE2E2; color:#991B1B;\">1 · Rules (.agent/rules/)</span>\n                  <h3>Nội quy nhà bếp</h3>\n                  <p>Giống như tấm biển nội quy treo trên tường bếp: <strong>luôn tự động nạp trong mọi phiên làm việc</strong>. Quy định giọng văn, cách trình bày và nguyên tắc làm việc chung.</p>\n                </div>\n                <div class=\"k-card k-step-item\" id=\"sl-c2\" data-order=\"2\">\n                  <span class=\"k-card-tag\" style=\"background:#FEF3C7; color:#92400E;\">2 · Skills (.agent/skills/)</span>\n                  <h3>Công thức nước chấm</h3>\n                  <p>Giống như công thức pha nước chấm chuẩn vị: là một <strong>kỹ năng chuyên môn tái sử dụng được</strong> trong nhiều đầu việc khác nhau khi AI cần đến.</p>\n                </div>\n                <div class=\"k-card k-step-item\" id=\"sl-c3\" data-order=\"3\">\n                  <span class=\"k-card-tag\" style=\"background:#DCFCE7; color:#166534;\">3 · Workflows (.agent/workflows/)</span>\n                  <h3>Quy trình nấu một món</h3>\n                  <p>Là kịch bản từng bước từ Bước 1 đến Bước 7 để hoàn thành trọn vẹn một sản phẩm đầu ra. Được gọi nhanh bằng dấu gạch chéo <code>/</code> trong khung chat.</p>\n                </div>\n              </div>\n              <div class=\"k-callout k-step-item\" id=\"sl-c4\" data-order=\"4\">\n                <span><strong>Nghiệm thu qua sản phẩm đầu ra &amp; hồ sơ <code>@troly.md</code>:</strong> Đánh giá hiệu quả của AI qua các tệp thực tế (<code>.md</code>, <code>.csv</code>, <code>.html</code>) lưu trong thư mục dự án thay vì chỉ nhìn lời hứa trên khung chat.</span>\n              </div>",
    "s2": "<div>\n                <div class=\"k-slide-header\">\n                  <span class=\"k-slide-kicker\">Phần 3 · Chu trình phối hợp 3 bước</span>\n                  <span class=\"k-slide-step\">Cảnh 2 / 2 · Lý thuyết</span>\n                </div>\n                <div class=\"k-slide-h1\">Chu trình 3 lệnh gạch chéo: /grill-me, /plan và /learn</div>\n                <div class=\"k-slide-sub\">Đừng để AI tự đoán khi đề bài còn thiếu thông tin. Hãy yêu cầu AI hỏi ngược lại bạn trước khi lập kế hoạch thực thi.</div>\n              </div>\n              <div class=\"k-grid-3\">\n                <div class=\"k-card k-step-item\" id=\"s2-c1\" data-order=\"1\">\n                  <span class=\"k-card-tag\" style=\"background:#FCE7F3; color:#9D174D;\">Bước 1 · /grill-me</span>\n                  <h3>AI hỏi ngược làm rõ đề bài</h3>\n                  <p>Thay vì viết ngay một bản nháp chung chung, lệnh <code>/grill-me</code> yêu cầu AI đặt câu hỏi để làm rõ hết các thông tin còn thiếu của bài toán.</p>\n                </div>\n                <div class=\"k-card k-step-item\" id=\"s2-c2\" data-order=\"2\">\n                  <span class=\"k-card-tag\" style=\"background:#E0F2FE; color:#075985;\">Bước 2 · /plan</span>\n                  <h3>Lập kế hoạch trước khi làm</h3>\n                  <p>Sau khi đã chốt thông tin qua màn hỏi đáp, gõ <code>/plan</code> để AI trình bày kế hoạch từng bước và danh sách tệp đầu ra cho bạn duyệt trước khi thực thi.</p>\n                </div>\n                <div class=\"k-card k-step-item\" id=\"s2-c3\" data-order=\"3\">\n                  <span class=\"k-card-tag\" style=\"background:#EDE9FE; color:#5B21B6;\">Bước 3 · /learn</span>\n                  <h3>Đúc kết kinh nghiệm vào nội quy</h3>\n                  <p>Khi bạn vừa sửa lỗi hoặc hướng dẫn một quy chuẩn mới, hãy gõ <code>/learn</code> để AI tự động ghi bài học đó vào thư mục <code>.agent/rules/</code> cho các lần sau.</p>\n                </div>\n              </div>\n              <div class=\"k-callout k-step-item\" id=\"s2-c4\" data-order=\"4\">\n                <span>Chúng ta sẽ thực hành ngay trên Antigravity IDE: kiểm tra cây thư mục <code>.agent</code> (gồm <code>rules</code>, <code>skills</code>, <code>workflows</code>) và chạy chu trình <code>/grill-me</code>, <code>/plan</code>, <code>/learn</code>.</span>\n              </div>"
  },
  "beats": [
    {
      "id": "b1",
      "label": "1. Rules: Nội quy nhà bếp",
      "duration": 11.77,
      "mode": "theory",
      "pose": 1,
      "slide": "s1",
      "hl": [
        "sl-c1"
      ],
      "focus_selectors": [
        "#sl-c1"
      ],
      "caption": "Làm sao để trợ lý AI hiểu rõ quy chuẩn của công ty bạn? Hãy hình dung thư mục <code>.agent</code> giống như một căn bếp. Trong đó, Rules là tấm biển nội quy treo trên tường, luôn được nạp tự động trong mọi cuộc trò chuyện.",
      "audio_src": "audio/lesson_03/b1.mp3",
      "audio_duration": 11.12
    },
    {
      "id": "b2",
      "label": "2. Skills: Công thức nước chấm",
      "duration": 8.89,
      "mode": "theory",
      "pose": 2,
      "slide": "s1",
      "hl": [
        "sl-c2"
      ],
      "focus_selectors": [
        "#sl-c2"
      ],
      "caption": "Thứ hai là Skills, giống như công thức pha bát nước chấm chuẩn vị. Đây là một kỹ năng chuyên môn đóng gói sẵn, có thể lấy ra dùng chung cho nhiều công việc khác nhau.",
      "audio_src": "audio/lesson_03/b2.mp3",
      "audio_duration": 8.24
    },
    {
      "id": "b3",
      "label": "3. Workflows và nghiệm thu tệp đầu ra",
      "duration": 11.69,
      "mode": "theory",
      "pose": 3,
      "slide": "s1",
      "hl": [
        "sl-c3",
        "sl-c4"
      ],
      "focus_selectors": [
        "#sl-c3",
        "#sl-c4"
      ],
      "caption": "Thứ ba là Workflows, tức quy trình từng bước được gọi nhanh bằng dấu <code>/</code>. Kết hợp với hồ sơ <code>@troly.md</code>, bạn luôn nghiệm thu hiệu quả của AI qua các tệp thành phẩm thực tế lưu ngay trong thư mục dự án.",
      "audio_src": "audio/lesson_03/b3.mp3",
      "audio_duration": 11.04
    },
    {
      "id": "b4",
      "label": "4. Lệnh /grill-me hỏi ngược",
      "duration": 8.89,
      "mode": "theory",
      "pose": 4,
      "slide": "s2",
      "hl": [
        "s2-c1"
      ],
      "focus_selectors": [
        "#s2-c1"
      ],
      "caption": "Khi giao các đầu việc lớn, bạn đừng để AI tự đoán mò. Hãy bắt đầu bằng lệnh <code>/grill-me</code> để yêu cầu AI đặt câu hỏi làm rõ hết các thông tin còn thiếu.",
      "audio_src": "audio/lesson_03/b4.mp3",
      "audio_duration": 8.24
    },
    {
      "id": "b5",
      "label": "5. Lệnh /plan và /learn",
      "duration": 10.09,
      "mode": "theory",
      "pose": 5,
      "slide": "s2",
      "hl": [
        "s2-c2",
        "s2-c3",
        "s2-c4"
      ],
      "focus_selectors": [
        "#s2-c2",
        "#s2-c3",
        "#s2-c4"
      ],
      "caption": "Khi đã đủ thông tin, bạn dùng lệnh <code>/plan</code> để duyệt kế hoạch và danh sách tệp đầu ra trước khi thực thi. Cuối buổi, hãy gõ <code>/learn</code> để AI tự lưu kinh nghiệm mới vào sổ tay nội quy.",
      "audio_src": "audio/lesson_03/b5.mp3",
      "audio_duration": 9.44
    },
    {
      "id": "b6",
      "label": "6. Cây thư mục .agent trên IDE",
      "duration": 16.57,
      "mode": "sim",
      "pose": 6,
      "surface": "ide_rules",
      "focus_selectors": [
        "#ide-file-tree"
      ],
      "focus_pad": 8,
      "cursor_selector": "[data-file='noi_quy_chung.md']",
      "cursor_label": "Thư mục .agent: rules, skills, workflows",
      "caption": "Nhìn vào cột Explorer bên trái của Antigravity IDE, bạn thấy rõ thư mục <code>.agent</code> chia thành 3 ngăn: <code>rules</code> chứa <code>noi_quy_chung.md</code>, <code>skills</code> chứa kỹ năng chuyên môn, và <code>workflows</code> chứa <code>grill-me.md</code>, <code>plan.md</code>, <code>learn.md</code>.",
      "onEnter": "kudoHidePopovers(); switchToSurface('ide'); switchIdeSidebarMode('explorer'); currentWorkspaceTreeMode='Antigravity_Basic'; renderFileTree(); setEditorMode('wysiwyg'); openFileInEditor('noi_quy_chung.md');",
      "audio_src": "audio/lesson_03/b6.mp3",
      "audio_duration": 15.92
    },
    {
      "id": "b7",
      "label": "7. Chạy /grill-me và /plan",
      "duration": 11.21,
      "mode": "sim",
      "pose": 7,
      "surface": "ide_grill_plan",
      "focus_selectors": [
        "#ide-right-agent"
      ],
      "focus_pad": 6,
      "cursor_selector": "#ide-chat-input",
      "cursor_label": "Gõ /grill-me -> trả lời 3 câu hỏi -> /plan",
      "caption": "Ở khung chat bên phải, khi gõ lệnh <code>/grill-me</code> để lập kế hoạch sản phẩm mới, AI hỏi lại 3 câu hỏi cốt lõi về phân khúc giá, nguồn nguyên liệu và kênh phân phối trước khi nhận lệnh <code>/plan</code>.",
      "onEnter": "kudoRunGrillAndPlanDemo();",
      "audio_src": "audio/lesson_03/b7.mp3",
      "audio_duration": 10.56
    },
    {
      "id": "b8",
      "label": "8. Đúc kết quy tắc bằng /learn",
      "duration": 10.97,
      "mode": "sim",
      "pose": 8,
      "surface": "ide_learn",
      "focus_selectors": [
        "#editor-canvas",
        "#ide-right-agent"
      ],
      "focus_pad": 6,
      "cursor_selector": "#kudo-learned-rule-block",
      "cursor_label": "Mục số 4 vừa được thêm vào noi_quy_chung.md",
      "caption": "Sau khi tinh chỉnh báo cáo đúng ý, bạn chỉ cần gõ lệnh <code>/learn</code>. Trợ lý AI lập tức cập nhật thêm mục quy tắc xuất bảng tính CSV mới vào thẳng tệp <code>noi_quy_chung.md</code> ở cột giữa.",
      "onEnter": "kudoRunLearnDemo();",
      "audio_src": "audio/lesson_03/b8.mp3",
      "audio_duration": 10.32
    }
  ]
};
