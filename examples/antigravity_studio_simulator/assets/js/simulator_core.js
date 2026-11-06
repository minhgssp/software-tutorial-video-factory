/* =========================================================================
     VIRTUAL FILESYSTEM (Matches exact files from the 4 Masterclass videos + AGY 2.0)
     ========================================================================= */
  const VFS = {
    "bao_cao_doanh_thu_q1.md": {
      path: "company-context > M↓ bao_cao_doanh_thu_q1.md",
      type: "md",
      content: `# Báo cáo tổng hợp kết quả kinh doanh Quý 1/2026 (TaskFlow Inc.)

## 1. Tóm tắt chỉ số tài chính cốt lõi
* **Tổng doanh thu Q1/2026:** \`391,000 USD\`
* **Tổng chi phí vận hành:** \`144,500 USD\`
* **Lợi nhuận ròng toàn công ty:** \`246,500 USD\` (Biên lợi nhuận trung bình \`63.0%\`)

## 2. Top 3 sản phẩm chủ lực mang lại lợi nhuận cao nhất
1. **TaskFlow Enterprise AI (\`TF-01\`):** Doanh thu \`185,000 USD\`, lợi nhuận ròng \`+140,000 USD\` (Biên lợi nhuận \`75.7%\`).
2. **TaskFlow Team Pro (\`TF-02\`):** Doanh thu \`112,000 USD\`, lợi nhuận ròng \`+74,000 USD\` (Biên lợi nhuận \`66.1%\`).
3. **Gói tư vấn Onboarding (\`TF-03\`):** Doanh thu \`64,000 USD\`, lợi nhuận ròng \`+42,000 USD\` (Biên lợi nhuận \`65.6%\`).

## 3. Đề xuất cắt giảm 2 danh mục thua lỗ (Theo quy tắc @troly.md)
* **Module báo cáo cũ Legacy (\`TF-04\`):** Đang lỗ \`-6,000 USD\` (Biên lợi nhuận \`-33.3%\`). Đề xuất ngừng bảo trì và chuyển khách hàng sang bản Enterprise.
* **Tiện ích lịch cá nhân (\`TF-05\`):** Đang lỗ \`-3,500 USD\` (Biên lợi nhuận \`-29.2%\`). Đề xuất đóng băng tính năng từ Quý 2.`
    },

    "0.1_Introduction.md": {
      path: "antigravity_course_vn > Module_0_Getting_Started > M↓ 0.1_Introduction.md",
      type: "md",
      content: `# Bài 0.1: Giới thiệu Antigravity và môi trường làm việc trực tiếp trên thư mục

## Tổng quan: Tại sao dân văn phòng dùng Antigravity?

Bạn có thể đang thắc mắc: *"IDE là cái gì? Tôi tưởng nó chỉ dành cho lập trình viên (coder)?"*

Đúng, **IDE (Integrated Development Environment)** trước đây thường là nơi các kỹ sư phần mềm viết mã. Nhưng với **Antigravity IDE** và **Antigravity 2.0**, dân văn phòng có thể đưa trợ lý AI về làm việc trực tiếp ngay trong thư mục hồ sơ trên máy tính cá nhân.

### Nguyên lý làm việc trực tiếp với thư mục máy tính

| Công cụ | Cách làm việc |
| :--- | :--- |
| **ChatGPT (Trình duyệt web)** | **Rời rạc và thủ công.** Bạn giống như đang gọi điện cho một chuyên gia tư vấn từ xa — hỏi xong bạn vẫn phải tự sao chép sang Word, Excel. |
| **Antigravity (AI Agent tại chỗ)** | **Tích hợp và trực tiếp.** Trợ lý AI kết nối thẳng vào thư mục dự án trên máy tính — nhìn thấy toàn bộ ngăn tủ hồ sơ và tự tay tạo hoặc sửa file cho bạn. |

### Hai phần mềm độc lập: Antigravity 2.0 và Antigravity IDE

Hệ sinh thái Antigravity gồm **2 phần mềm độc lập cài đặt riêng biệt trên máy tính** (nhưng cùng mở chung một thư mục dự án):
* **Antigravity 2.0 (trước đây gọi là Agent Manager):** Phần mềm điều phối đa luồng hội thoại, quản lý danh sách dự án và hẹn giờ tự động hóa.
* **Antigravity IDE:** Phần mềm biên tập 3 cột (Cây thư mục bên trái, trình xem và chỉnh sửa tài liệu ở giữa, khung chat Agent bên phải).`
    },

    "start-1-1.md": {
      path: ".agent > workflows > M↓ start-1-1.md",
      type: "md",
      content: `---
description: "Module 1.1: Chào mừng đến với TaskFlow - Bài thực hành có hướng dẫn từng bước"
---

# Quy trình bài thực hành có hướng dẫn từng bước: /start-1-1

## Thực hiện các bước sau:

1. Đọc \`lesson-modules/1.1-welcome/SCRIPT.md\` - đây là kịch bản hướng dẫn của bạn.
2. Đọc \`.agent/rules/SCRIPT_INSTRUCTIONS.md\` để nắm các quy tắc hướng dẫn quan trọng.
3. Tuân thủ kịch bản hướng dẫn theo đúng trình tự:
   * Truyền đạt nội dung tự nhiên, rõ ràng cho học viên.
   * Dừng tại các điểm **"STOP:"** và chờ học viên trả lời (ví dụ: *"Tôi sẵn sàng"*).
   * Thực thi các khối **"ACTION:"** theo quy định.
   * Bắt đầu hướng dẫn ngay lập tức.`
    },

    "grill-me.md": {
      path: ".agent > workflows > M↓ grill-me.md",
      type: "md",
      content: `---
description: "Phỏng vấn ngược làm rõ thông tin còn thiếu trước khi lập kế hoạch"
---

# Quy trình hỏi ngược làm rõ đề bài: /grill-me

## Các bước thực hiện:
1. Đọc kỹ yêu cầu ban đầu của người dùng và đối chiếu với tài liệu trong thư mục dự án.
2. Phát hiện các thông số còn thiếu (mục tiêu, đối tượng, ngân sách, định dạng đầu ra).
3. Đặt tối đa 3 đến 5 câu hỏi ngắn gọn, sát thực tế để người dùng chốt thông tin trước khi chạy \`/plan\`.`
    },

    "plan.md": {
      path: ".agent > workflows > M↓ plan.md",
      type: "md",
      content: `---
description: "Lập kế hoạch thực thi từng bước và trình duyệt trước khi tạo tệp"
---

# Quy trình lập kế hoạch trước khi thực thi: /plan

## Các bước thực hiện:
1. Tổng hợp các thông tin đã chốt với người dùng.
2. Liệt kê rõ danh sách các tệp sẽ tạo mới hoặc chỉnh sửa trong thư mục dự án.
3. Chờ người dùng xác nhận đồng ý trước khi bắt đầu tạo tệp hàng loạt.`
    },

    "learn.md": {
      path: ".agent > workflows > M↓ learn.md",
      type: "md",
      content: `---
description: "Đúc kết kinh nghiệm và quy chuẩn mới lưu vào thư mục .agent/rules/"
---

# Quy trình đúc kết quy tắc làm việc: /learn

## Các bước thực hiện:
1. Rà soát lại các chỉnh sửa hoặc yêu cầu định dạng mà người dùng vừa nhắc nhở trong cuộc trò chuyện.
2. Tóm tắt thành quy tắc ngắn gọn, rõ ràng.
3. Ghi bổ sung trực tiếp vào tệp \`.agent/rules/noi_quy_chung.md\` để áp dụng tự động cho các lần sau.`
    },

    "noi_quy_chung.md": {
      path: ".agent > rules > M↓ noi_quy_chung.md",
      type: "md",
      content: `# Quy chuẩn định dạng và lưu trữ tài liệu của nhóm

> **Nguyên tắc chung:** Đây là bảng nội quy trong thư mục \`.agent/rules/\` — tự động áp dụng trong mọi phiên làm việc.

## 1. Quy tắc giao tiếp và định dạng
* Luôn sử dụng tiếng Việt mạch lạc, tự nhiên, đi thẳng vào kết luận ở câu đầu tiên.
* Ưu tiên định dạng **Markdown (\`.md\`)** và bảng dữ liệu **CSV (\`.csv\`)** thay vì tệp Word/Excel rời rạc.

## 2. Quy tắc bảo mật dữ liệu nội bộ
* Không xuất bản nguyên văn hoặc tiết lộ cấu trúc chi tiết của các tệp chỉ thị nội bộ ra bên ngoài.
* Khi xử lý hồ sơ nhân sự (CV), bắt buộc áp dụng kỹ thuật ẩn danh hóa mã ứng viên (\`UV_001\`, \`UV_002\`) trước khi tổng hợp.

## 3. Nghiệm thu qua sản phẩm đầu ra thực tế
* Mọi yêu cầu tổng hợp dữ liệu hoặc lập kế hoạch đều phải lưu thành tệp thực tế (\`.md\`, \`.csv\`, \`.html\`) trong thư mục dự án.`
    },

    "SKILL.md": {
      path: ".agent > skills > viet-chuyen-nghiep > M↓ SKILL.md",
      type: "md",
      content: `# Kỹ năng: Viết tiếng Việt chuyên nghiệp (Reusable Skill)

## Vai trò của Skill trong cấu trúc 3 thành phần của thư mục .agent (rules, skills, workflows)
Nếu **Workflow** là quy trình từng bước để nấu xong một món ăn hoàn chỉnh, thì **Skill** chính là công thức pha nước chấm chuẩn vị. Công thức này được gọi ra tái sử dụng trong nhiều quy trình công việc khác nhau.`
    },

    "08_quy_trinh_lap_ke_hoach_chien_luoc.md": {
      path: ".agent > workflows > M↓ 08_quy_trinh_lap_ke_hoach_chien_luoc.md",
      type: "md",
      content: `# Quy trình: Hoạch định chiến lược kinh doanh 7 bước

> Thuộc **Cấu trúc 3 thành phần trong thư mục .agent (rules, skills, workflows)** giúp chuẩn hóa đầu ra dự án.

1. **Bước 1 — Thẩm định ý tưởng và phản biện Socratic:** Đặt câu hỏi làm rõ mô hình doanh thu.
2. **Bước 2 — Nghiên cứu thị trường và đối thủ (Web Search):** Tự động bật tìm kiếm Internet thu thập quy mô thị trường.
3. **Bước 3 — Chân dung khách hàng mục tiêu (JTBD & Personas).**
4. **Bước 4 — Thiết kế sản phẩm và chuỗi cung ứng.**
5. **Bước 5 — Chiến lược phễu marketing và kênh phân phối.**
6. **Bước 6 — Dự phóng tài chính và điểm hòa vốn (Xuất bảng CSV).**
7. **Bước 7 — Quản trị rủi ro và lộ trình triển khai 90 ngày.**`
    },

    "COMPANY.md": {
      path: "company-context > M↓ COMPANY.md",
      type: "md",
      content: `# Hồ sơ doanh nghiệp mẫu: TaskFlow Inc.

**TaskFlow Inc.** là công ty phần mềm quản lý công việc B2B quy mô **45 nhân sự**. Bạn đảm nhận vai trò **Quản lý tự động hóa quy trình (AI Automation PM)**, phối hợp trực tiếp cùng 3 đồng nghiệp:
* **Alex (CEO):** Chỉ đọc báo cáo tóm tắt gọn trên 1 trang kèm số liệu rõ ràng.
* **Sarah (Trưởng phòng nhân sự - HR):** Đang cần sàng lọc nhanh hàng trăm hồ sơ ứng viên.
* **Mike (Trưởng phòng kinh doanh - Sales):** Cần tổng hợp bảng doanh thu \`sales_data.csv\` để tìm ra dòng sản phẩm hiệu quả nhất.`
    },

    "troly.md": {
      path: "Antigravity_Basic > M↓ troly.md",
      type: "md",
      content: `# Hồ sơ trợ lý cá nhân (@troly.md)

Em là **Trợ lý tổng hợp báo cáo và chuẩn hóa quy trình** của anh Chuyên gia Đào tạo.
* Báo cáo tài chính phải chỉ rõ 3 sản phẩm lợi nhuận cao nhất và 2 sản phẩm cần cắt giảm.
* Khi làm bài thuyết trình: Xuất cấu trúc HTML sạch để chuyển sang Google Slides chỉnh sửa linh hoạt.`
    },

    "sales_data.csv": {
      path: "company-context > 📊 sales_data.csv",
      type: "csv",
      content: `Ma_SP,Ten_San_Pham,Quy,Doanh_Thu_USD,Chi_Phi_USD,Loi_Nhuan_USD,Bien_LN
TF-01,TaskFlow Enterprise AI,Q1/2026,185000,45000,140000,75.7%
TF-02,TaskFlow Team Pro,Q1/2026,112000,38000,74000,66.1%
TF-03,Goi Tu Van Onboarding,Q1/2026,64000,22000,42000,65.6%
TF-04,Module Bao Cao Cu (Legacy),Q1/2026,18000,24000,-6000,-33.3%
TF-05,Tien Ich Lich Ca Nhan,Q1/2026,12000,15500,-3500,-29.2%`
    },

    "index.html": {
      path: "Antigravity_Basic > 🌐 index.html",
      type: "html",
      content: `<div style="font-family:system-ui,sans-serif; background:#ffffff; color:#111827; padding:28px; border:2px solid #ea580c; border-radius:12px;">
  <span style="background:#ea580c; color:#fff; padding:4px 10px; border-radius:20px; font-size:12px; font-weight:700;">KHÓA HỌC ỨNG DỤNG 120 PHÚT</span>
  <h1 style="font-size:26px; margin:14px 0 8px 0; color:#111827;">Khóa học Antigravity Basic — Ứng dụng AI Agent cho công việc văn phòng</h1>
  <p style="font-size:14.5px; color:#4b5563; margin-bottom:18px;">Hướng dẫn làm việc trực tiếp với tài liệu Markdown, bảng số liệu CSV và thiết lập quy trình tự động ngay trong thư mục máy tính bằng tiếng Việt.</p>
  <button style="background:#ea580c; color:#fff; border:none; padding:10px 20px; border-radius:6px; font-weight:700; cursor:pointer;">Bắt đầu bài thực hành (/start-1-1)</button>
</div>`
    },

    "Readme.md": {
      path: "Antigravity_Basic > M↓ Readme.md",
      type: "md",
      content: `# Chào mừng đến với khóa học Antigravity Basic — Ứng dụng AI Agent cho công việc văn phòng

1. Mở khóa học bằng cách đọc tệp \`0.1_Introduction.md\`
2. Hoặc gõ lệnh \`/start-1-1\` trong khung chat bên phải để bắt đầu bài thực hành có hướng dẫn từng bước!`
    }
  };

  const TREE_STRUCTURE = [
    {
      folder: ".agent", open: true, children: [
        { folder: "rules", open: true, files: ["noi_quy_chung.md"] },
        { folder: "skills/viet-chuyen-nghiep", open: true, files: ["SKILL.md"] },
        { folder: "workflows", open: true, files: ["start-1-1.md", "grill-me.md", "plan.md", "learn.md", "08_quy_trinh_lap_ke_hoach_chien_luoc.md"] }
      ]
    },
    {
      folder: "antigravity_course_vn", open: true, children: [
        { folder: "Module_0_Getting_Started", open: true, files: ["0.1_Introduction.md"] }
      ]
    },
    {
      folder: "company-context", open: true, children: [
        { folder: "data", open: true, files: ["COMPANY.md", "sales_data.csv"] }
      ]
    },
    {
      folder: "Root Files", isRoot: true, files: ["Readme.md", "troly.md", "index.html", "bao_cao_doanh_thu_q1.md"]
    }
  ];

  let currentFileKey = "0.1_Introduction.md";
  let openTabs = ["0.1_Introduction.md", "start-1-1.md", "Readme.md"];
  let editorMode = "wysiwyg";
  let agy2RpKey = "0.1_Introduction.md";
  let agy2RpMode = "preview";

  /* =========================================================================
     AGY 2.0 CONVERSATION & ARTIFACT RENDERING
     ========================================================================= */
  function loadAgy2Thread(threadId) {
    closeSettingsModal();
    document.querySelectorAll(".agy2-thread-item").forEach(el => el.classList.remove("active"));
    const stream = document.getElementById("agy2-chat-stream");
    const heading = document.getElementById("agy2-thread-heading");

    if (threadId === "main") {
      const item = document.getElementById("th-main");
      if (item) item.classList.add("active");
      heading.textContent = "Báo cáo doanh thu Quý 1 TaskFlow";
      openAgy2RightPane("0.1_Introduction.md");

      stream.innerHTML = `
        <div class="agy2-user-turn">
          <div class="agy2-user-meta"><span>10m ago</span><span>📋</span><span>👍</span><span>👎</span></div>
          <div class="agy2-user-bubble">Em đọc hồ sơ công ty @COMPANY.md, bảng số liệu @sales_data.csv và ghi nhớ cá nhân @troly.md, sau đó lập báo cáo tổng hợp kết quả kinh doanh Quý 1 cho anh nhé.</div>
        </div>

        <div class="agy2-trace-list">
          <div class="agy2-trace-row"><span>Thinking ⌄</span></div>
          <div class="agy2-trace-row" onclick="openAgy2RightPane('0.1_Introduction.md')"><span>Analyzed</span> <span class="md-badge">M↓</span> <span class="trace-file-chip">0.1_Introduction.md #L1-22</span></div>
          <div class="agy2-trace-row" onclick="openAgy2RightPane('COMPANY.md')"><span>Analyzed</span> <span class="md-badge">M↓</span> <span class="trace-file-chip">COMPANY.md #L1-15</span></div>
          <div class="agy2-trace-row" onclick="openAgy2RightPane('sales_data.csv')"><span>Analyzed</span> <span class="csv-badge">📊</span> <span class="trace-file-chip">sales_data.csv #L1-6</span></div>
          <div class="agy2-trace-row" onclick="openAgy2RightPane('troly.md')"><span>Analyzed</span> <span class="md-badge">M↓</span> <span class="trace-file-chip">troly.md #L1-12</span></div>
          <div class="agy2-trace-row" onclick="openAgy2RightPane('bao_cao_doanh_thu_q1.md')">
            <span>Created</span> <span class="md-badge">M↓</span> <span class="trace-file-chip">bao_cao_doanh_thu_q1.md</span>
            <span class="diff-add">+38</span> <span class="diff-del">-0</span>
          </div>
          <div class="agy2-trace-row"><span>Thought for 14s</span></div>
        </div>

        <div class="agy2-ai-prose">
          <p><strong>Kết luận:</strong> Em đã đối chiếu số liệu từ <code>sales_data.csv</code> theo đúng quy tắc của <code>@troly.md</code> và lưu báo cáo hoàn chỉnh vào tệp <code>bao_cao_doanh_thu_q1.md</code> ngay trong thư mục dự án.</p>
          <ul>
            <li><strong>Tổng doanh thu Quý 1/2026:</strong> Đạt <code>391,000 USD</code>, lợi nhuận ròng đạt <code>246,500 USD</code>.</li>
            <li><strong>3 sản phẩm chủ lực lãi cao nhất:</strong> <code>TaskFlow Enterprise AI</code> (+140,000 USD), <code>TaskFlow Team Pro</code> (+74,000 USD) và <code>Gói tư vấn Onboarding</code> (+42,000 USD).</li>
            <li><strong>2 danh mục cần cắt giảm:</strong> <code>Module báo cáo cũ</code> (-6,000 USD) và <code>Tiện ích lịch cá nhân</code> (-3,500 USD).</li>
          </ul>
        </div>`;
    } else if (threadId === "demo_sales_analytics") {
      const item = document.getElementById("th-demo_sales_analytics");
      if (item) item.classList.add("active");
      heading.textContent = "Khởi nghiệp giày bã mía (Sbalance)";
      openAgy2RightPane("08_quy_trinh_lap_ke_hoach_chien_luoc.md");

      stream.innerHTML = `
        <div class="agy2-user-turn">
          <div class="agy2-user-meta"><span>54m ago</span><span>📋</span><span>👍</span><span>👎</span></div>
          <div class="agy2-user-bubble">Áp dụng đúng quy trình @08_quy_trinh_lap_ke_hoach_chien_luoc.md để lập kế hoạch kinh doanh cho dự án sản xuất giày từ bã mía.</div>
        </div>
        <div class="agy2-trace-list">
          <div class="agy2-trace-row"><span>Thinking ⌄</span></div>
          <div class="agy2-trace-row" onclick="openAgy2RightPane('08_quy_trinh_lap_ke_hoach_chien_luoc.md')"><span>Analyzed</span> <span class="md-badge">M↓</span> <span class="trace-file-chip">08_quy_trinh_lap_ke_hoach_chien_luoc.md #L1-25</span></div>
          <div class="agy2-trace-row"><span>Ran Web Search: "quy mô thị trường giày bền vững & phụ phẩm bã mía Việt Nam" ›</span></div>
          <div class="agy2-trace-row"><span>Created</span> <span class="md-badge">M↓</span> <span class="trace-file-chip">01_nghien_cuu_thi_truong_ba_mia.md</span> <span class="diff-add">+112</span> <span class="diff-del">-0</span></div>
          <div class="agy2-trace-row"><span>Created</span> <span class="csv-badge">📊</span> <span class="trace-file-chip">06_du_phong_tai_chinh_ba_mia.csv</span> <span class="diff-add">+45</span> <span class="diff-del">-0</span></div>
        </div>
        <div class="agy2-ai-prose">
          <p><strong>Kết luận:</strong> Dù trong máy tính chưa có tài liệu nào về ngành bã mía, trợ lý AI đã tự động chạy theo đúng 7 bước của quy trình, bật công cụ tìm kiếm Internet thu thập số liệu và xuất trọn bộ 7 tệp hồ sơ chiến lược.</p>
        </div>`;
    } else if (threadId === "automations") {
      heading.textContent = "Automations (Lịch trình chạy tự động)";
      stream.innerHTML = `<div class="agy2-ai-prose">
        <h2>🕒 Hẹn giờ chạy tự động (Scheduled Automations)</h2>
        <p>Thiết lập cho trợ lý AI tự động chạy mỗi sáng lúc 07:30, mở trình duyệt đọc chuyên mục Kinh doanh trên báo <strong>VNExpress</strong> và tổng hợp bản tin tóm tắt lưu vào thư mục dự án.</p>
      </div>`;
    } else if (threadId === "customizations") {
      heading.textContent = "Cấu trúc 3 thành phần trong thư mục .agent (rules, skills, workflows)";
      openAgy2RightPane("noi_quy_chung.md");
      stream.innerHTML = `<div class="agy2-ai-prose">
        <h2>🧰 Cấu trúc 3 thành phần trong thư mục .agent (rules, skills, workflows)</h2>
        <p>Tương tự hình ảnh căn bếp nấu ăn: <strong>workflows</strong> là các bước nấu xong một món ăn, <strong>skills</strong> là công thức pha nước chấm dùng chung cho nhiều món, và <strong>rules</strong> là bảng quy chuẩn luôn tự động nạp trong mọi phiên làm việc.</p>
      </div>`;
    }
  }

  function resetAgy2NewConv() {
    closeSettingsModal();
    document.getElementById("agy2-thread-heading").textContent = "New Conversation";
    document.getElementById("agy2-chat-stream").innerHTML = `
      <div style="margin:auto; text-align:center; max-width:460px; color:var(--agy2-fg);">
        <div style="font-size:28px; font-weight:800; color:var(--agy2-fg-strong); margin-bottom:8px;">Antigravity 2.0</div>
        <p style="font-size:13.5px;">Gõ câu lệnh vào khung bên dưới, dùng <code>@</code> để đính kèm tài liệu hoặc <code>/</code> để kích hoạt quy trình tự động.</p>
      </div>`;
  }

  function openAgy2RightPane(fileKey) {
    if (!VFS[fileKey]) return;
    agy2RpKey = fileKey;
    document.getElementById("agy2-right-pane").classList.remove("collapsed");
    document.getElementById("agy2-rp-tab-name").textContent = fileKey.length > 26 ? fileKey.slice(0, 24) + "..." : fileKey;
    document.getElementById("agy2-rp-breadcrumb").textContent = fileKey;
    renderAgy2RightPaneContent();
  }

  function setAgy2RpMode(mode) {
    agy2RpMode = mode;
    document.getElementById("agy2-pill-preview").classList.toggle("active", mode === "preview");
    document.getElementById("agy2-pill-raw").classList.toggle("active", mode === "raw");
    renderAgy2RightPaneContent();
  }

  function renderAgy2RightPaneContent() {
    const container = document.getElementById("agy2-rp-content");
    const fileObj = VFS[agy2RpKey];
    if (!fileObj) return;
    if (agy2RpMode === "raw") {
      container.innerHTML = `<pre style="font-family:var(--font-mono); font-size:12.5px; white-space:pre-wrap;">${fileObj.content.replace(/</g, "&lt;")}</pre>`;
    } else {
      container.innerHTML = parseSimpleMarkdown(fileObj.content);
    }
  }

  /* =========================================================================
     AGY 2.0 FULL SETTINGS MODAL (MATCHES SCREENSHOTS 2, 3, 4, 5)
     ========================================================================= */
  function openSettingsModal(tab) {
    document.getElementById("agy2-settings-modal").classList.add("open");
    switchSettingsTab(tab || "general");
  }

  function closeSettingsModal() {
    document.getElementById("agy2-settings-modal").classList.remove("open");
  }

  function switchSettingsTab(tab, navEl) {
    document.querySelectorAll("#agy2-settings-modal .set-nav-item, #agy2-settings-modal .set-profile-card").forEach(el => el.classList.remove("active"));
    if (navEl) {
      navEl.classList.add("active");
    } else {
      const fallback = document.getElementById("snav-" + (tab === "application" ? "app" : tab));
      if (fallback) fallback.classList.add("active");
    }

    const box = document.getElementById("set-tab-container");
    if (tab === "general") {
      // Exact match to Screenshots 2 & 3!
      box.innerHTML = `
        <div class="set-page-title">General</div>
        <div class="set-page-sub">Configure agent execution, queued message delivery, and permissions.</div>

        <div class="set-sec-heading">Permissions</div>
        <div class="set-sec-desc">Configure what the agent can do in local and remote conversations. <span style="color:#0284c7; cursor:pointer;">Learn more.</span></div>
        <div class="set-card-group" id="set-permissions-card">
          <div class="set-row" id="set-row-this-computer">
            <div>
              <div class="set-row-title">This Computer</div>
              <div class="set-row-sub">Controls the actions the agent can take.</div>
            </div>
            <div class="set-pill-select" id="set-pill-this-computer" onclick="openCustomSelectMenu(this, ['Request Review', 'Default', 'Auto (Preview)', 'Turbo'], event)">Turbo ⌄</div>
          </div>
          <div class="set-row">
            <div>
              <div class="set-row-title">Remote</div>
              <div class="set-row-sub">Controls permissions for remote conversations.</div>
            </div>
            <div class="set-pill-select" onclick="openCustomSelectMenu(this, ['Request Review', 'Default', 'Auto (Preview)', 'Turbo'], event)">Turbo ⌄</div>
          </div>
          <div class="set-row" style="padding:10px 16px;">
            <div class="set-row-sub" style="cursor:pointer;" onclick="openSubPermModal('tools')">Advanced &gt;</div>
          </div>
        </div>

        <div class="set-sec-heading">Agent Behavior</div>
        <div class="set-card-group">
          <div class="set-row">
            <div>
              <div class="set-row-title">Plan Review Policy</div>
              <div class="set-row-sub">Whether the agent asks you to review its documents.<br><br>Type <code>/</code> and select <code>plan</code> to have the agent generate a plan.</div>
            </div>
            <div class="set-pill-select" onclick="openCustomSelectMenu(this, ['Always Ask ⌄', 'Auto Proceed ⌄'], event)">Always Ask ⌄</div>
          </div>
        </div>

        <div class="set-sec-heading">Execution</div>
        <div class="set-card-group">
          <div class="set-row">
            <div>
              <div class="set-row-title">Queued Messages</div>
              <div class="set-row-sub">Configure when follow-up messages are sent.<br>Keyboard shortcuts ⓘ</div>
            </div>
            <div class="set-seg-control">
              <span class="set-seg-btn active" onclick="toggleSeg(this)">Queue</span>
              <span class="set-seg-btn" onclick="toggleSeg(this)">Send Immediately</span>
            </div>
          </div>
        </div>

        <div class="set-sec-heading">Built-in Browser</div>
        <div class="set-sec-desc">Configure link opening and built-in browser preferences.</div>
        <div class="set-card-group">
          <div class="set-row">
            <div>
              <div class="set-row-title">Open Links In</div>
              <div class="set-row-sub">Choose where links open by default when clicked.</div>
            </div>
            <div class="set-seg-control">
              <span class="set-seg-btn" onclick="toggleSeg(this)">External Browser</span>
              <span class="set-seg-btn active" onclick="toggleSeg(this)">Built-in Browser</span>
            </div>
          </div>
          <div class="set-row">
            <div>
              <div class="set-row-title">Download Location</div>
              <div class="set-row-sub">Folder where files downloaded in the built-in browser are saved.<br>~/Downloads</div>
            </div>
            <div class="set-pill-select" onclick="openWinFolderDialog()">Change...</div>
          </div>
          <div class="set-row">
            <div>
              <div class="set-row-title">Browsing History</div>
              <div class="set-row-sub">Clear visited URLs and autocomplete suggestions from the built-in browser.</div>
            </div>
            <div class="set-pill-select" onclick="this.textContent='Cleared ✓'">Clear</div>
          </div>
        </div>

        <div class="set-sec-heading">Browser Subagent</div>
        <div class="set-sec-desc">Configure the browser subagent. It requires <span style="color:#0284c7;">Google Chrome</span> to be installed. The browser subagent can be invoked by typing <code>/browser</code> in the conversation input box.</div>
        <div class="set-card-group">
          <div class="set-row">
            <div>
              <div class="set-row-title">Browser Javascript Execution Policy</div>
              <div class="set-row-sub">Controls whether the agent can run custom JavaScript to automate complex browser actions.</div>
            </div>
            <div class="set-pill-select" onclick="openCustomSelectMenu(this, ['Always Proceed ⌄', 'Ask Every Time ⌄', 'Disabled ⌄'], event)">Always Proceed ⌄</div>
          </div>
          <div class="set-row">
            <div>
              <div class="set-row-title">Browser Actuation Rules</div>
              <div class="set-row-sub">Configure allowed and denied URLs for browser actuation.</div>
            </div>
            <div class="set-pill-select" onclick="openSubPermModal('network')">Edit</div>
          </div>
        </div>

        <div class="set-sec-heading">Voice mode</div>
        <div class="set-card-group">
          <div class="set-row">
            <div>
              <div class="set-row-title">Microphone</div>
              <div class="set-row-sub">Input device for voice mode and dictation.</div>
            </div>
            <div class="set-pill-select" onclick="openCustomSelectMenu(this, ['System default ⌄', 'Headset Microphone (Realtek) ⌄'], event)">System default ⌄</div>
          </div>
        </div>`;
    } else if (tab === "appearance") {
      // Exact match to Screenshot 4!
      box.innerHTML = `
        <div class="set-page-title">Appearance</div>
        <div class="set-page-sub">Configure the agent's visual theme and display preferences.</div>

        <div class="set-sec-heading">Chat</div>
        <div class="set-card-group">
          <div class="set-row">
            <div>
              <div class="set-row-title">Conversation Steps</div>
              <div class="set-row-sub">Choose how much detail is shown during a conversation.</div>
            </div>
            <div class="set-seg-control">
              <span class="set-seg-btn active" onclick="toggleSeg(this)">Default</span>
              <span class="set-seg-btn" onclick="toggleSeg(this)">Verbose</span>
            </div>
          </div>
        </div>

        <div class="set-sec-heading">Appearance</div>
        <div class="set-card-group">
          <div class="set-row">
            <div class="set-row-title">Theme</div>
            <div class="set-seg-control">
              <span class="set-seg-btn" onclick="document.body.classList.remove('dark-theme'); toggleSeg(this)">🖥️</span>
              <span class="set-seg-btn active" onclick="document.body.classList.remove('dark-theme'); toggleSeg(this)">☀️</span>
              <span class="set-seg-btn" onclick="document.body.classList.add('dark-theme'); toggleSeg(this)">🌙</span>
            </div>
          </div>
          <div class="set-row">
            <div class="set-row-title">Contrast</div>
            <div class="set-seg-control">
              <span class="set-seg-btn" onclick="toggleSeg(this)">Default</span>
              <span class="set-seg-btn active" onclick="toggleSeg(this)">Strong</span>
            </div>
          </div>
          <div class="set-row">
            <div class="set-row-title">Font</div>
            <div class="set-pill-select" onclick="openCustomSelectMenu(this, ['Google Sans ⌄', 'Inter ⌄', 'Segoe UI ⌄'], event)">Google Sans ⌄</div>
          </div>
        </div>

        <div class="set-sec-heading">Light Theme</div>
        <div class="set-card-group">
          <div class="set-row">
            <div class="set-row-title">Preset</div>
            <div class="set-pill-select" onclick="openCustomSelectMenu(this, ['↺ Default Light ⌄', 'Solarized Warm ⌄', 'Pure Paper White ⌄'], event)">↺ Default Light ⌄</div>
          </div>
          <div class="set-row">
            <div class="set-row-title">Background</div>
            <div class="color-swatch-pill"><span class="color-dot" style="background:#E3DFD1;"></span> # E3DFD1</div>
          </div>
          <div class="set-row">
            <div class="set-row-title">Foreground</div>
            <div class="color-swatch-pill"><span class="color-dot" style="background:#586E75;"></span> # 586E75</div>
          </div>
          <div class="set-row">
            <div class="set-row-title">Accent</div>
            <div class="color-swatch-pill"><span class="color-dot" style="background:#CB4B16;"></span> # CB4B16</div>
          </div>
        </div>

        <div class="set-card-group" style="padding:16px; font-family:var(--font-mono); font-size:12.5px; line-height:1.6;">
          <div style="color:#7A8B90;">// Greet a user by name</div>
          <div><span style="color:#268BD2;">const</span> <span style="color:#2B363B;">greet</span> = (<span style="color:#CB4B16;">name</span>: <span style="color:#2AA198;">string</span>) =&gt; {</div>
          <div style="padding-left:18px;"><span style="color:#859900;">return</span> <span style="color:#2AA198;">\`Hello, \${name}!\`</span>;</div>
          <div>};</div>
        </div>`;
    } else if (tab === "account") {
      // Exact match to Screenshot 5!
      box.innerHTML = `
        <div class="set-page-title">Account</div>
        <div class="set-page-sub">Manage your plan, credentials, and general preferences.</div>

        <div class="set-sec-heading">General</div>
        <div class="set-card-group">
          <div class="set-row">
            <div>
              <div class="set-row-title">Enable Telemetry</div>
              <div class="set-row-sub">When toggled on, Antigravity collects usage data to help Google enhance performance and features.</div>
            </div>
            <div class="toggle-switch" onclick="this.classList.toggle('off')"></div>
          </div>
          <div class="set-row">
            <div>
              <div class="set-row-title">Marketing Emails</div>
              <div class="set-row-sub">Receive product updates, tips, and promotions from Google Antigravity via email.</div>
            </div>
            <div class="toggle-switch off" onclick="this.classList.toggle('off')"></div>
          </div>
        </div>

        <div class="set-sec-heading">Account</div>
        <div class="set-card-group">
          <div class="set-row">
            <div>
              <div class="set-row-title">Gói tài khoản: Google One AI Premium / Claude Pro (Đã kết nối)</div>
              <div class="set-row-sub">Tài khoản đã kết nối sẵn sàng cho không gian làm việc Antigravity.</div>
            </div>
          </div>
          <div class="set-row">
            <div>
              <div class="set-row-title">Email</div>
              <div class="set-row-sub">minh.mindful@gmail.com</div>
            </div>
            <div class="set-pill-select" onclick="this.textContent='Đã kết nối ✓'">Sign Out</div>
          </div>
        </div>

        <div class="set-sec-heading">Remote Agents Data</div>
        <div class="set-card-group">
          <div class="set-row">
            <div>
              <div class="set-row-title">Delete All Remote Agents Data</div>
              <div class="set-row-sub">Permanently delete your remote conversations, projects, scheduled tasks, connected plugins and settings. Data in the desktop app and your Google account are not affected.</div>
            </div>
            <button style="background:#D3362D; color:#fff; border:none; padding:7px 14px; border-radius:18px; font-size:12px; font-weight:600; cursor:pointer; flex-shrink:0;" onclick="this.textContent='Protected (Demo)'">Delete All Data</button>
          </div>
        </div>`;
    } else if (tab === "application") {
      box.innerHTML = `
        <div class="set-page-title">Application</div>
        <div class="set-page-sub">Configure desktop updates, startup behavior, and CLI integration.</div>
        <div class="set-card-group">
          <div class="set-row">
            <div><div class="set-row-title">Antigravity CLI (<code>agy</code>)</div><div class="set-row-sub">Install <code>agy</code> command in system PATH for terminal launching.</div></div>
            <div class="set-pill-select" onclick="this.textContent='Installed in PATH ✓'">Installed ✓</div>
          </div>
          <div class="set-row">
            <div><div class="set-row-title">Automatic Updates</div><div class="set-row-sub">Keep Antigravity 2.0 &amp; IDE updated automatically in background.</div></div>
            <div class="toggle-switch" onclick="this.classList.toggle('off')"></div>
          </div>
        </div>`;
    } else if (tab === "shortcuts") {
      box.innerHTML = `
        <div class="set-page-title">Shortcuts</div>
        <div class="set-page-sub">Customize keybindings for Agent Manager and IDE Editor.</div>
        <div class="set-card-group">
          <div class="set-row"><div class="set-row-title">Code with Agent / Focus Chat</div><div class="set-pill-select">Ctrl + L</div></div>
          <div class="set-row"><div class="set-row-title">Open Folder (Workspace)</div><div class="set-pill-select">Ctrl + K &nbsp; Ctrl + O</div></div>
          <div class="set-row"><div class="set-row-title">Toggle Primary Side Bar</div><div class="set-pill-select">Ctrl + B</div></div>
          <div class="set-row"><div class="set-row-title">Toggle Terminal Panel</div><div class="set-pill-select">Ctrl + J</div></div>
        </div>`;
    } else if (tab === "notifications") {
      box.innerHTML = `
        <div class="set-page-title">Notifications</div>
        <div class="set-page-sub">Choose when Antigravity alerts you about background tasks and human gates.</div>
        <div class="set-card-group">
          <div class="set-row">
            <div><div class="set-row-title">Task Completion Sound</div><div class="set-row-sub">Play subtle chime when a multi-step workflow finishes.</div></div>
            <div class="toggle-switch" onclick="this.classList.toggle('off')"></div>
          </div>
          <div class="set-row">
            <div><div class="set-row-title">Human Gate Approval Alert</div><div class="set-row-sub">Notify immediately when agent pauses for Plan or Permission review.</div></div>
            <div class="toggle-switch" onclick="this.classList.toggle('off')"></div>
          </div>
        </div>`;
    } else if (tab === "models") {
      box.innerHTML = `
        <div class="set-page-title">Models</div>
        <div class="set-page-sub">Manage enabled foundation models in your Google AI workspace.</div>
        <div class="set-card-group">
          <div class="set-row"><div><div class="set-row-title">Gemini 4 Argon Medium <span style="background:#e0e7ff;color:#3730a3;font-size:10px;padding:2px 6px;border-radius:10px;margin-left:6px;">New</span></div><div class="set-row-sub">Default balanced model for daily coding and office automation.</div></div><div class="toggle-switch" onclick="this.classList.toggle('off')"></div></div>
          <div class="set-row"><div><div class="set-row-title">Gemini 3.8 Flash Medium <span style="background:#dcfce7;color:#166534;font-size:10px;padding:2px 6px;border-radius:10px;margin-left:6px;">Fast ⓘ</span></div><div class="set-row-sub">Ultra-fast low-latency responses for quick edits and Q&amp;A.</div></div><div class="toggle-switch" onclick="this.classList.toggle('off')"></div></div>
          <div class="set-row"><div><div class="set-row-title">Claude Opus 5.5 Medium <span style="background:#e0e7ff;color:#3730a3;font-size:10px;padding:2px 6px;border-radius:10px;margin-left:6px;">New</span></div><div class="set-row-sub">Deep reasoning for complex 7-step strategic workflows &amp; architecture.</div></div><div class="toggle-switch" onclick="this.classList.toggle('off')"></div></div>
          <div class="set-row"><div><div class="set-row-title">Claude Sonnet 5.5 Medium <span style="background:#e0e7ff;color:#3730a3;font-size:10px;padding:2px 6px;border-radius:10px;margin-left:6px;">New</span></div><div class="set-row-sub">Frontier model for specialized writing, coding &amp; structured reports.</div></div><div class="toggle-switch" onclick="this.classList.toggle('off')"></div></div>
          <div class="set-row"><div><div class="set-row-title">GPT-OSS 120B (Medium) <span style="background:#fef3c7;color:#92400e;font-size:10px;padding:2px 6px;border-radius:10px;margin-left:6px;">Notice ⓘ</span></div><div class="set-row-sub">Open-weights reasoning model available for general workspace tasks.</div></div><div class="toggle-switch" onclick="this.classList.toggle('off')"></div></div>
        </div>`;
    } else if (tab.startsWith("project_")) {
      const pName = tab === "project_course_vn" ? "antigravity_course_vn" : (tab === "project_basic" ? "Antigravity_Basic" : "TaskFlow_Context");
      box.innerHTML = `
        <div class="set-page-title">Project: ${pName}</div>
        <div class="set-page-sub">Workspace-specific customizations (<code>.agent/rules</code>, <code>.agent/skills</code>, <code>.agent/workflows</code>).</div>
        <div class="set-card-group">
          <div class="set-row"><div><div class="set-row-title">Workspace Path</div><div class="set-row-sub"><code>C:\\Antigravity_Basic\\${pName}</code></div></div><div class="set-pill-select" onclick="closeSettingsModal(); switchToSurface('ide');">Open in IDE</div></div>
          <div class="set-row"><div><div class="set-row-title">Active Rules (<code>.agent/rules</code>)</div><div class="set-row-sub">3 workspace rules loaded (Always On).</div></div><div class="toggle-switch" onclick="this.classList.toggle('off')"></div></div>
          <div class="set-row"><div><div class="set-row-title">Active Workflows (<code>.agent/workflows</code>)</div><div class="set-row-sub">8 slash commands available via <code>/</code>.</div></div><div class="toggle-switch" onclick="this.classList.toggle('off')"></div></div>
        </div>`;
    } else if (tab === "conversations") {
      box.innerHTML = `
        <div class="set-page-title">Conversations</div>
        <div class="set-page-sub">Manage standalone conversations not linked to a specific local folder.</div>
        <div class="set-card-group">
          <div class="set-row"><div><div class="set-row-title">Auto-Archive Inactive Threads</div><div class="set-row-sub">Archive conversations older than 30 days.</div></div><div class="toggle-switch" onclick="this.classList.toggle('off')"></div></div>
        </div>`;
    }
  }

  function toggleSeg(btn) {
    btn.parentElement.querySelectorAll(".set-seg-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
  }

  /* =========================================================================
     IDE 3-COLUMN RENDERING FUNCTIONS
     ========================================================================= */
  function badgeForType(name) {
    if (name === "Extension: Office Viewer") return `<span>🧩</span>`;
    if (name === "Settings") return `<span>⚙️</span>`;
    if (name === "Antigravity Settings") return `<span>📄</span>`;
    if (name.endsWith(".md")) return `<span class="md-badge">M↓</span>`;
    if (name.endsWith(".csv")) return `<span class="csv-badge">📊</span>`;
    if (name.endsWith(".html")) return `<span class="html-badge">&lt;/&gt;</span>`;
    if (name.endsWith(".zip")) return `<span>📦</span>`;
    return `<span>📄</span>`;
  }

  // Register Special IDE Tabs & antigravity_course_vn files in VFS
  VFS["Extension: Office Viewer"] = {
    path: "Extensions > 🧩 Extension: Office Viewer (cweijan.vscode-office v4.2.3)",
    type: "special_ext_office",
    content: ""
  };
  VFS["Settings"] = {
    path: "Preferences > ⚙️ Editor Settings (Workbench & Editor)",
    type: "special_editor_settings",
    content: ""
  };
  VFS["Antigravity Settings"] = {
    path: "Preferences > 📄 Antigravity Settings (Global Permissions & Agent Behavior)",
    type: "special_agy_settings",
    content: ""
  };
  VFS["INDEX.md"] = {
    path: "antigravity_course_vn > M↓ INDEX.md",
    type: "md",
    content: `# Cẩm nang học tập toàn trình — Khóa học Antigravity Basic\n\n## Lộ trình 6 học phần thực hành dành cho dân văn phòng và quản lý\n\n* **Module_0_Getting_Started:** Cài đặt Antigravity 2.0 và Antigravity IDE, mở thư mục dự án (Open Folder) và cài tiện ích Office Viewer.\n* **Module_1_Fundamentals:** Làm quen giao diện 3 cột, phân biệt 3 chế độ (Fast / Planning / Turbo) và nạp bối cảnh doanh nghiệp TaskFlow.\n* **Module_2_Advanced_PM_Work:** Phân tích dữ liệu kinh doanh (@sales_data.csv), lập báo cáo điều hành và tổng hợp tin tức tự động (/browser).\n* **Module_3_Advanced_Enterprise_Automation:** Phối hợp nhiều trợ lý chuyên môn (Multi-Agent), bộ não thứ hai (Second Brain) và tự động hóa Word/Excel/Slide.\n* **Module_4 & Module_6 (Live Masterclass):** Thực hành cấu trúc 3 thành phần trong thư mục .agent (rules, skills, workflows), thiết kế trang giới thiệu và sàng lọc hồ sơ nhân sự.`
  };
  VFS["demo_ui_hoctap_tech.html"] = {
    path: "antigravity_course_vn > </> demo_ui_hoctap_tech.html",
    type: "html",
    content: VFS["index.html"] ? VFS["index.html"].content : `<h1>Hoctap.tech — Cổng học liệu tương tác Antigravity</h1>`
  };
  VFS["1.1_Welcome.md"] = {
    path: "antigravity_course_vn > Module_1_Fundamentals > M↓ 1.1_Welcome.md",
    type: "md",
    content: `# Bài 1.1: Chào mừng tới công ty mẫu TaskFlow Inc.\n\n## Vai trò của bạn: Quản lý tự động hóa quy trình (AI Automation PM)\n* Thay vì hỏi đáp rời rạc trên trình duyệt, bạn phối hợp với **trợ lý AI làm việc trực tiếp trong thư mục máy tính** để đọc tài liệu, tổng hợp số liệu và xuất sản phẩm hoàn chỉnh.\n* Hãy gõ lệnh \`/start-1-1\` vào khung chat bên phải để bắt đầu bài thực hành có hướng dẫn từng bước!`
  };
  VFS["2.2_Business_Data.md"] = {
    path: "antigravity_course_vn > Module_2_Advanced_PM_Work > M↓ 2.2_Business_Data.md",
    type: "md",
    content: `# Bài 2.2: Phân tích dữ liệu kinh doanh với ký hiệu @\n\n* Sử dụng ký hiệu \`@\` để đính kèm trực tiếp bảng dữ liệu \`@sales_data.csv\` và hồ sơ cá nhân \`@troly.md\`.\n* Trợ lý AI tự động tổng hợp doanh thu, lợi nhuận ròng và đề xuất cắt giảm các dòng sản phẩm thua lỗ.`
  };
  VFS["3.1_Multi_Agent_Architecture.md"] = {
    path: "antigravity_course_vn > Module_3_Advanced_Enterprise_Automation > M↓ 3.1_Multi_Agent_Architecture.md",
    type: "md",
    content: `# Bài 3.1: Phối hợp nhiều trợ lý chuyên môn và cấu trúc thư mục .agent\n\n| Thành phần | Thư mục lưu trữ | Vai trò cốt lõi |\n| :--- | :--- | :--- |\n| **Rule (Nội quy)** | \`.agent/rules/\` | Luôn tự động nạp ngầm để giữ quy chuẩn trình bày và giọng văn |\n| **Skill (Chuyên môn)** | \`.agent/skills/\` | Sổ tay kỹ năng chuyên sâu, chỉ mở khi gặp đúng đầu việc |\n| **Workflow (Quy trình)** | \`.agent/workflows/\` | Kịch bản nhiều bước kích hoạt bằng dấu gạch chéo \`/\` |`
  };
  VFS["4.1_Giao_Trinh_Cot_Loi_120_Phut.md"] = {
    path: "antigravity_course_vn > Module_4_Masterclass_Thuc_Chien > M↓ 4.1_Giao_Trinh_Cot_Loi_120_Phut.md",
    type: "md",
    content: `# Giáo trình cốt lõi 120 phút — Thực hành ứng dụng tại bàn làm việc\n\n## 4 trọng tâm ứng dụng trợ lý AI cho công việc văn phòng\n1. **Làm việc trực tiếp trên thư mục máy tính:** Đưa trợ lý AI về đọc và tạo tệp ngay trên ổ cứng.\n2. **Kỹ thuật tự rà soát chất lượng:** Yêu cầu AI đối chiếu tiêu chí và hoàn thiện bản nháp trước khi bàn giao.\n3. **Tự động xuất đa định dạng:** Để AI tự chạy công cụ chuyển đổi tài liệu sang PDF, PNG, Excel.\n4. **Cấu trúc 3 thành phần trong thư mục .agent (rules, skills, workflows):** Đóng gói quy trình làm việc thành tài sản dùng lại bằng lệnh \`/\`.`
  };
  VFS["Bai_Doc_08_So_Sanh_Antigravity_IDE_Va_Antigravity_20.md"] = {
    path: "antigravity_course_vn > Tai_Lieu_Doc_Them > M↓ Bai_Doc_08_So_Sanh_Antigravity_IDE_Va_Antigravity_20.md",
    type: "md",
    content: `# Bài đọc 08: Phân biệt 2 phần mềm độc lập Antigravity 2.0 và Antigravity IDE\n\n* **Antigravity 2.0 (trước đây gọi là Agent Manager):** Phần mềm độc lập cài đặt riêng trên máy tính, thiết kế gọn gàng để giao việc cho nhiều luồng hội thoại chạy song song và theo dõi tiến độ tổng thể.\n* **Antigravity IDE (giao diện 3 cột):** Phần mềm độc lập cài đặt riêng trên máy tính, cung cấp không gian biên tập chi tiết gồm cây thư mục bên trái, trình soạn thảo tài liệu ở giữa và khung chat bên phải.`
  };

  let currentExtKey = "office";
  let currentExtSubTab = "details";
  const EXTENSIONS_CATALOG = {
    office: {
      icon: "A📄", bg: "linear-gradient(135deg,#0078d4,#005a9e)", name: "Office Viewer", author: "cweijan", downloads: "2,369,671", id: "cweijan.vscode-office", ver: "4.2.3", size: "40.86MB",
      desc: "View word, excel, powerpoint files and using WYSIWYG markdown editor in VS Code / Antigravity IDE.",
      intro: "This extension lets you preview and edit common office and design files directly in Antigravity IDE.",
      bullets: [
        "Excel: <code>.xls</code>, <code>.xlsx</code>, <code>.xlsm</code>, <code>.csv</code>, <code>.ods</code>",
        "Word: <code>.docx</code>, <code>.dotx</code>",
        "PowerPoint: <code>.pptx</code>, <code>.pptm</code>",
        "PDF &amp; eBook: <code>.pdf</code>, <code>.epub</code>",
        "Markdown WYSIWYG: <code>.md</code> (Chỉnh sửa trực tiếp như Google Docs)"
      ]
    },
    muty: {
      icon: "M📊", bg: "#ea580c", name: "Muty PPT Viewer", author: "mutyai", downloads: "418,920", id: "mutyai.ppt-viewer", ver: "2.1.0", size: "18.40MB",
      desc: "Preview PowerPoint files (.pptx, .ppt) directly inside Antigravity IDE with slide thumbnail navigation.",
      intro: "Instant native preview for presentation decks generated by Agent workflows without opening Microsoft PowerPoint.",
      bullets: ["Hỗ trợ xem trực tiếp slide <code>.pptx</code>, <code>.ppt</code>", "Chuyển trang slide mượt mà ngay trong cột giữa của IDE"]
    },
    edge: {
      icon: "e🌐", bg: "linear-gradient(135deg,#0ea5e9,#10b981)", name: "Microsoft Edge Tools", author: "ms-edgedevtools", downloads: "5,120,400", id: "ms-edgedevtools.vscode-edge-devtools", ver: "2.1.9", size: "12.30MB",
      desc: "Use the Microsoft Edge Tools from within Antigravity IDE to inspect DOM, network, and live HTML previews.",
      intro: "Integrates Chromium DevTools inspection right beside your workspace files.",
      bullets: ["Kiểm tra giao diện Landing Page HTML trực tiếp", "Đồng bộ trực tiếp với mã nguồn trong thư mục dự án"]
    },
    powershell: {
      icon: "&gt;_", bg: "#1e293b", name: "PowerShell", author: "ms-vscode", downloads: "14,890,110", id: "ms-vscode.powershell", ver: "2026.4.0", size: "8.95MB",
      desc: "Develop PowerShell modules, commands and scripts in Antigravity IDE.",
      intro: "Provides syntax highlighting, integrated terminal execution, and automation support on Windows.",
      bullets: ["Tích hợp sâu với cửa sổ Terminal (<code>Ctrl + J</code>)", "Hỗ trợ Agent tự chạy lệnh kiểm thử và xuất file"]
    },
    pyrefly: {
      icon: "🦋", bg: "#f97316", name: "Pyrefly - Python Language Tooling", author: "meta", downloads: "980,450", id: "meta.pyrefly", ver: "1.4.2", size: "31.20MB",
      desc: "Python autocomplete, typechecking, and fast code navigation for AI Agent scripts.",
      intro: "High-speed Python language server powering Code-as-a-Tool scripts (such as export_pdf_png.py).",
      bullets: ["Kiểm tra cú pháp các script Python do Agent tự sinh", "Tăng tốc thực thi các công cụ xử lý dữ liệu CSV/Excel"]
    },
    markdownlint: {
      icon: "M↓", bg: "#334155", name: "markdownlint", author: "DavidAnson", downloads: "1,840,000", id: "DavidAnson.vscode-markdownlint", ver: "0.55.0", size: "3.40MB",
      desc: "Markdown linting and style checking for clean documentation and .agent rules.",
      intro: "Keeps your Markdown files (.agent/rules, .agent/skills, .agent/workflows) clean and well-structured.",
      bullets: ["Kiểm tra chuẩn định dạng tiêu đề H1, H2, H3", "Đảm bảo tài liệu học viện và quy trình .agent không bị lỗi cú pháp"]
    }
  };

  function selectMarketplaceExtension(extKey, itemEl) {
    currentExtKey = extKey || "office";
    currentExtSubTab = "details";
    if (itemEl) {
      document.querySelectorAll("#ide-sb-extensions-view .ext-list-item").forEach(el => el.classList.remove("selected"));
      itemEl.classList.add("selected");
    }
    openFileInEditor("Extension: Office Viewer");
  }

  function switchExtSubTab(subTab) {
    currentExtSubTab = subTab;
    const canvas = document.getElementById("editor-canvas");
    if (canvas && currentFileKey === "Extension: Office Viewer") {
      canvas.innerHTML = renderExtensionOfficeViewerHtml();
    }
  }

  function renderExtensionOfficeViewerHtml() {
    const ext = EXTENSIONS_CATALOG[currentExtKey] || EXTENSIONS_CATALOG.office;
    let subContentHtml = "";
    if (currentExtSubTab === "features") {
      subContentHtml = `
        <h2 style="font-size:19px; font-weight:600; border-bottom:1px solid var(--border-color); padding-bottom:6px; margin-bottom:10px;">Features &amp; Capabilities (${ext.name})</h2>
        <ul style="font-size:13px; margin-left:20px; line-height:1.85;">
          <li><strong>WYSIWYG Visual Editing:</strong> Chỉnh sửa trực tiếp văn bản Markdown (<code>.md</code>) và bảng tính (<code>.csv</code>, <code>.xlsx</code>) ngay trong cột giữa của Antigravity IDE.</li>
          <li><strong>Zero-Context Switching:</strong> Dân văn phòng không cần chuyển qua lại giữa cửa sổ chat AI và phần mềm Word/Excel bên ngoài.</li>
          <li><strong>Custom Theme &amp; File Icons:</strong> Bổ sung bộ biểu tượng tệp tin trực quan trên cây thư mục Explorer.</li>
        </ul>`;
    } else if (currentExtSubTab === "changelog") {
      subContentHtml = `
        <h2 style="font-size:19px; font-weight:600; border-bottom:1px solid var(--border-color); padding-bottom:6px; margin-bottom:10px;">Changelog — Version ${ext.ver}</h2>
        <ul style="font-size:13px; margin-left:20px; line-height:1.85;">
          <li><strong>v${ext.ver} (5 days ago):</strong> Tối ưu hóa tốc độ hiển thị bảng dữ liệu lớn và thanh công cụ định dạng nhanh (<code>H1, H2, H3, B, I, Table</code>).</li>
          <li><strong>v4.1.0:</strong> Hỗ trợ hoàn toàn chế độ Sáng (Light Mode) và Tối (Dark Mode) của Antigravity IDE.</li>
        </ul>`;
    } else {
      subContentHtml = `
        <h2 style="font-size:20px; font-weight:600; border-bottom:1px solid var(--border-color); padding-bottom:6px; margin-bottom:10px;">${ext.name}</h2>
        <p style="font-size:13px; color:#0066b8; margin-bottom:14px;">English | 简体中文 | 繁體中文</p>
        <h3 style="font-size:16px; font-weight:600; margin-bottom:8px;">Introduction</h3>
        <p style="font-size:13px; margin-bottom:12px;">${ext.intro}</p>
        <ul style="font-size:13px; margin-left:20px; line-height:1.8;">
          ${ext.bullets.map(b => `<li>${b}</li>`).join("")}
        </ul>`;
    }

    return `
      <div style="max-width:780px; margin:0 auto; font-family:var(--font-ui); color:var(--text-main);">
        <div style="display:flex; gap:24px; align-items:flex-start; padding-bottom:18px; border-bottom:1px solid var(--border-color);">
          <div style="width:94px; height:94px; border-radius:14px; background:${ext.bg}; color:#fff; display:flex; align-items:center; justify-content:center; font-size:38px; font-weight:800; box-shadow:0 6px 16px rgba(0,102,184,0.25); flex-shrink:0;">
            ${ext.icon}
          </div>
          <div style="flex:1;">
            <div style="font-size:24px; font-weight:600; margin-bottom:4px;">${ext.name}</div>
            <div style="font-size:12.5px; color:var(--text-muted); display:flex; align-items:center; gap:12px; margin-bottom:8px;">
              <span style="color:#0066b8; font-weight:500;">${ext.author}</span>
              <span>|</span>
              <span>☁️ ${ext.downloads}</span>
              <span>|</span>
              <span style="color:#d97706;">★★★★★ (5)</span>
            </div>
            <div style="font-size:13px; color:var(--text-main); margin-bottom:12px;">
              ${ext.desc}
            </div>
            <div style="display:flex; gap:8px;">
              <button style="background:#0066b8; color:#fff; border:none; border-radius:3px; padding:4px 11px; font-size:12px; font-weight:500; cursor:pointer;" onclick="this.textContent = this.textContent.includes('✓') ? 'Set Color Theme' : '✓ Theme Applied'">Set Color Theme</button>
              <button style="background:#0066b8; color:#fff; border:none; border-radius:3px; padding:4px 11px; font-size:12px; font-weight:500; cursor:pointer;" onclick="this.textContent = this.textContent.includes('✓') ? 'Set File Icon Theme' : '✓ Icons Applied'">Set File Icon Theme</button>
              <button style="background:#0066b8; color:#fff; border:none; border-radius:3px; padding:4px 11px; font-size:12px; font-weight:500; cursor:pointer;" onclick="this.textContent = this.textContent === 'Disable' ? 'Enable' : 'Disable'">Disable</button>
            </div>
          </div>
        </div>

        <div style="display:flex; gap:24px; border-bottom:1px solid var(--border-color); margin-top:12px; font-size:12px; font-weight:600;">
          <span onclick="switchExtSubTab('details')" style="padding:8px 4px; ${currentExtSubTab==='details'?'border-bottom:2px solid var(--text-main); color:var(--text-main);':'color:var(--text-muted);'} cursor:pointer;">DETAILS</span>
          <span onclick="switchExtSubTab('features')" style="padding:8px 4px; ${currentExtSubTab==='features'?'border-bottom:2px solid var(--text-main); color:var(--text-main);':'color:var(--text-muted);'} cursor:pointer;">FEATURES</span>
          <span onclick="switchExtSubTab('changelog')" style="padding:8px 4px; ${currentExtSubTab==='changelog'?'border-bottom:2px solid var(--text-main); color:var(--text-main);':'color:var(--text-muted);'} cursor:pointer;">CHANGELOG</span>
        </div>

        <div style="display:grid; grid-template-columns:1.8fr 1fr; gap:28px; padding-top:18px;">
          <div>${subContentHtml}</div>
          <div style="border-left:1px solid var(--border-color); padding-left:20px; font-size:12px;">
            <div style="font-size:14px; font-weight:600; margin-bottom:10px;">Installation</div>
            <div style="display:grid; grid-template-columns:85px 1fr; row-gap:6px; margin-bottom:18px; color:var(--text-muted);">
              <span>Identifier</span><span style="color:var(--text-main);">${ext.id}</span>
              <span>Version</span><span style="color:var(--text-main);">${ext.ver}</span>
              <span>Last Updated</span><span style="color:var(--text-main);">5 days ago</span>
              <span>Size</span><span style="color:#0066b8;">${ext.size}</span>
            </div>
            <div style="font-size:14px; font-weight:600; margin-bottom:10px;">Marketplace</div>
            <div style="display:grid; grid-template-columns:85px 1fr; row-gap:6px; margin-bottom:18px; color:var(--text-muted);">
              <span>Published</span><span style="color:var(--text-main);">5 years ago</span>
              <span>Last Released</span><span style="color:var(--text-main);">1 week ago</span>
            </div>
            <div style="font-size:14px; font-weight:600; margin-bottom:8px;">Categories</div>
            <div style="display:flex; gap:6px;">
              <span style="border:1px solid var(--border-color); border-radius:4px; padding:2px 8px;">Visualization</span>
              <span style="border:1px solid var(--border-color); border-radius:4px; padding:2px 8px;">Other</span>
            </div>
          </div>
        </div>
      </div>`;
  }

  let currentIdeAgySubTab = "general";
  function switchIdeAgySetSubTab(subTab) {
    currentIdeAgySubTab = subTab;
    const canvas = document.getElementById("editor-canvas");
    if (canvas && currentFileKey === "Antigravity Settings") {
      canvas.innerHTML = renderInIdeAntigravitySettingsHtml();
    }
  }

  function renderInIdeAntigravitySettingsHtml() {
    // Exact replica of Batch 3 Screenshot 4: In-IDE "Antigravity Settings" Editor Tab with full in-place sub-navigation
    const st = currentIdeAgySubTab;
    let rightPaneHtml = "";
    if (st === "appearance") {
      rightPaneHtml = `
        <div style="font-size:21px; font-weight:600; margin-bottom:4px;">Appearance</div>
        <div style="font-size:12.5px; color:#666; margin-bottom:22px;">Configure the agent's visual theme and display preferences inside IDE.</div>
        <div style="border:1px solid #e5e5e5; border-radius:10px; overflow:hidden; margin-bottom:22px; background:var(--bg-app);">
          <div class="set-row" style="border-bottom:1px solid #eaeaea;">
            <div class="set-row-title">IDE &amp; Agent Theme</div>
            <div class="set-seg-control" style="background:#f0f0f0;">
              <span class="set-seg-btn ${!document.body.classList.contains('dark-theme')?'active':''}" onclick="document.body.classList.remove('dark-theme'); toggleSeg(this)">☀️ Light</span>
              <span class="set-seg-btn ${document.body.classList.contains('dark-theme')?'active':''}" onclick="document.body.classList.add('dark-theme'); toggleSeg(this)">🌙 Dark</span>
            </div>
          </div>
          <div class="set-row">
            <div class="set-row-title">Conversation Steps Detail</div>
            <div class="set-seg-control" style="background:#f0f0f0;">
              <span class="set-seg-btn active" onclick="toggleSeg(this)">Default</span>
              <span class="set-seg-btn" onclick="toggleSeg(this)">Verbose</span>
            </div>
          </div>
        </div>`;
    } else if (st === "models") {
      rightPaneHtml = `
        <div style="font-size:21px; font-weight:600; margin-bottom:4px;">Models</div>
        <div style="font-size:12.5px; color:#666; margin-bottom:22px;">Select active models available in the right-hand IDE Agent chat pane.</div>
        <div style="border:1px solid #e5e5e5; border-radius:10px; overflow:hidden; background:var(--bg-app);">
          <div class="set-row" style="border-bottom:1px solid #eaeaea;"><div><div class="set-row-title">Gemini 4 Argon Medium (New)</div><div class="set-row-sub">Default balanced model for daily coding and office automation.</div></div><div class="toggle-switch" onclick="this.classList.toggle('off')"></div></div>
          <div class="set-row" style="border-bottom:1px solid #eaeaea;"><div><div class="set-row-title">Gemini 3.8 Flash Medium (Fast ⓘ)</div><div class="set-row-sub">Fastest responses for quick edits and Q&amp;A.</div></div><div class="toggle-switch" onclick="this.classList.toggle('off')"></div></div>
          <div class="set-row" style="border-bottom:1px solid #eaeaea;"><div><div class="set-row-title">Claude Opus 5.5 Medium (New)</div><div class="set-row-sub">Deep reasoning for complex multi-file workflows.</div></div><div class="toggle-switch" onclick="this.classList.toggle('off')"></div></div>
          <div class="set-row" style="border-bottom:1px solid #eaeaea;"><div><div class="set-row-title">Claude Sonnet 5.5 Medium (New)</div><div class="set-row-sub">Frontier model for structured documents and code review.</div></div><div class="toggle-switch" onclick="this.classList.toggle('off')"></div></div>
          <div class="set-row"><div><div class="set-row-title">GPT-OSS 120B (Medium) (Notice ⓘ)</div><div class="set-row-sub">Open-weights reasoning model for general tasks.</div></div><div class="toggle-switch" onclick="this.classList.toggle('off')"></div></div>
        </div>`;
    } else if (st === "notifications") {
      rightPaneHtml = `
        <div style="font-size:21px; font-weight:600; margin-bottom:4px;">Notifications</div>
        <div style="font-size:12.5px; color:#666; margin-bottom:22px;">Configure sound and badge alerts when Agent finishes a task.</div>
        <div style="border:1px solid #e5e5e5; border-radius:10px; overflow:hidden; background:var(--bg-app);">
          <div class="set-row" style="border-bottom:1px solid #eaeaea;"><div><div class="set-row-title">Agent Task Completion Sound</div><div class="set-row-sub">Play notification chime when background command completes.</div></div><div class="toggle-switch" onclick="this.classList.toggle('off')"></div></div>
          <div class="set-row"><div><div class="set-row-title">Human Gate Prompt Alert</div><div class="set-row-sub">Alert when Agent requests permission or plan review.</div></div><div class="toggle-switch" onclick="this.classList.toggle('off')"></div></div>
        </div>`;
    } else if (st === "account") {
      rightPaneHtml = `
        <div style="font-size:21px; font-weight:600; margin-bottom:4px;">Account — Đức Minh Hoàng</div>
        <div style="font-size:12.5px; color:#666; margin-bottom:22px;">Manage your workspace credentials and account connection.</div>
        <div style="border:1px solid #e5e5e5; border-radius:10px; overflow:hidden; background:var(--bg-app);">
          <div class="set-row" style="border-bottom:1px solid #eaeaea;"><div><div class="set-row-title">Gói tài khoản: Google One AI Premium / Claude Pro (Đã kết nối)</div><div class="set-row-sub">Active Workspace Account.</div></div><span class="ide-count-badge" style="background:#dcfce7; color:#166534;">Active</span></div>
          <div class="set-row"><div><div class="set-row-title">Account Email</div><div class="set-row-sub">minh.mindful@gmail.com</div></div><button class="ide-gray-pill-btn" onclick="switchToSurface('mgr'); openSettingsModal('account');">Open in AGY 2.0</button></div>
        </div>`;
    } else if (st.startsWith("proj_")) {
      const pTitle = st === "proj_course_vn" ? "antigravity_course_vn" : (st === "proj_basic" ? "Antigravity_Basic" : "TaskFlow_Context");
      rightPaneHtml = `
        <div style="font-size:21px; font-weight:600; margin-bottom:4px;">Project: ${pTitle}</div>
        <div style="font-size:12.5px; color:#666; margin-bottom:22px;">Configure project-level rules, skills, workflows, and MCP servers.</div>
        <div style="border:1px solid #e5e5e5; border-radius:10px; overflow:hidden; background:var(--bg-app);">
          <div class="set-row" style="border-bottom:1px solid #eaeaea;"><div><div class="set-row-title">Workspace Rules (<code>.agent/rules</code>)</div><div class="set-row-sub">Always-on instructions for this repository.</div></div><div class="toggle-switch" onclick="this.classList.toggle('off')"></div></div>
          <div class="set-row"><div><div class="set-row-title">Project Workflows (<code>.agent/workflows</code>)</div><div class="set-row-sub">Slash commands triggered via <code>/</code> in chat.</div></div><div class="toggle-switch" onclick="this.classList.toggle('off')"></div></div>
        </div>`;
    } else {
      rightPaneHtml = `
        <div style="font-size:21px; font-weight:600; margin-bottom:4px;">General</div>
        <div style="font-size:12.5px; color:#666; margin-bottom:22px;">Configure agent execution, queued message delivery, and permissions.</div>

        <div style="font-size:13px; font-weight:600; margin-bottom:4px;">Global Permissions</div>
        <div style="font-size:12px; color:#666; margin-bottom:10px;">Configure global allowed and denied resource permissions. <span style="color:#0066b8; cursor:pointer;">Learn more.</span></div>

        <div style="border:1px solid #e5e5e5; border-radius:10px; overflow:hidden; margin-bottom:22px; background:var(--bg-app);">
          <div class="set-row" style="border-bottom:1px solid #eaeaea;">
            <div>
              <div class="set-row-title">Permission Preset</div>
              <div class="set-row-sub">Controls the actions the agent can take.</div>
            </div>
            <div class="ide-gray-pill-btn" onclick="openCustomSelectMenu(this, ['Request Review', 'Default', 'Auto (Preview)', 'Turbo'], event)">Turbo &nbsp; ⌄</div>
          </div>
          <div class="set-row" style="border-bottom:1px solid #eaeaea;">
            <div>
              <div class="set-row-title">Tool Permissions <span class="ide-count-badge">97</span></div>
              <div class="set-row-sub">Modify permissions for file, terminal, and MCP tools.</div>
            </div>
            <button class="ide-gray-pill-btn" onclick="openSubPermModal('tools')">Open</button>
          </div>
          <div class="set-row">
            <div>
              <div class="set-row-title">Network Access Rules <span class="ide-count-badge">52</span></div>
              <div class="set-row-sub">Configure allowed and denied URLs for reading.</div>
            </div>
            <button class="ide-gray-pill-btn" onclick="openSubPermModal('network')">Open</button>
          </div>
        </div>

        <div style="font-size:13px; font-weight:600; margin-bottom:8px;">Agent Behavior</div>
        <div style="border:1px solid #e5e5e5; border-radius:10px; overflow:hidden; margin-bottom:22px; background:var(--bg-app);">
          <div class="set-row">
            <div>
              <div class="set-row-title">Plan Review Policy</div>
              <div class="set-row-sub">Whether the agent asks you to review its documents.<br><br>Type <code style="background:#f0f0f0; padding:1px 5px; border-radius:4px;">/</code> and select <code style="background:#f0f0f0; padding:1px 5px; border-radius:4px;">plan</code> to have the agent generate a plan.</div>
            </div>
            <div class="ide-gray-pill-btn" onclick="openCustomSelectMenu(this, ['Always Ask   ⌄', 'Auto Proceed   ⌄'], event)">Always Ask &nbsp; ⌄</div>
          </div>
        </div>

        <div style="font-size:13px; font-weight:600; margin-bottom:8px;">Execution</div>
        <div style="border:1px solid #e5e5e5; border-radius:10px; overflow:hidden; background:var(--bg-app);">
          <div class="set-row">
            <div>
              <div class="set-row-title">Queued Messages</div>
              <div class="set-row-sub">Configure when follow-up messages are sent.<br>Keyboard shortcuts ⓘ</div>
            </div>
            <div class="set-seg-control" style="background:#f0f0f0;">
              <span class="set-seg-btn active" onclick="toggleSeg(this)">Queue</span>
              <span class="set-seg-btn" onclick="toggleSeg(this)">Send Immediately</span>
            </div>
          </div>
        </div>`;
    }

    const navStyle = (key) => st === key ? 'background:#ededed; font-weight:600;' : '';
    return `
      <div class="ide-agy-settings-wrap">
        <div class="ide-agy-set-nav">
          <div>
            <div class="set-group-title" style="padding-top:0;">Settings</div>
            <div class="set-nav-item ${st==='general'?'active':''}" style="${navStyle('general')}" onclick="switchIdeAgySetSubTab('general')">General</div>
            <div class="set-nav-item ${st==='appearance'?'active':''}" style="${navStyle('appearance')}" onclick="switchIdeAgySetSubTab('appearance')">Appearance</div>
            <div class="set-nav-item ${st==='notifications'?'active':''}" style="${navStyle('notifications')}" onclick="switchIdeAgySetSubTab('notifications')">Notifications</div>
            <div class="set-nav-item ${st==='models'?'active':''}" style="${navStyle('models')}" onclick="switchIdeAgySetSubTab('models')">Models</div>

            <div class="set-group-title">Projects</div>
            <div class="set-nav-item ${st==='proj_course_vn'?'active':''}" style="${navStyle('proj_course_vn')}" onclick="switchIdeAgySetSubTab('proj_course_vn')">antigravity_course_vn</div>
            <div class="set-nav-item ${st==='proj_basic'?'active':''}" style="${navStyle('proj_basic')}" onclick="switchIdeAgySetSubTab('proj_basic')">Antigravity_Basic</div>
            <div class="set-nav-item ${st==='proj_taskflow'?'active':''}" style="${navStyle('proj_taskflow')}" onclick="switchIdeAgySetSubTab('proj_taskflow')">TaskFlow_Context</div>
            <div class="set-nav-item" style="color:#888; font-size:11.5px;">Show All</div>

            <div class="set-group-title">Not in Project</div>
            <div class="set-nav-item" onclick="switchIdeAgySetSubTab('general')">Conversations</div>
          </div>

          <div>
            <div class="set-nav-item" style="color:#666;">Give Feedback</div>
            <div class="set-profile-card ${st==='account'?'active':''}" onclick="switchIdeAgySetSubTab('account')">
              <div class="set-avatar">Đ</div>
              <div style="overflow:hidden;">
                <div style="font-weight:600; font-size:12px;">Đức Minh Hoàng</div>
                <div style="font-size:10.5px; color:#777; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">minh.mindful@gmail.c...</div>
              </div>
            </div>
          </div>
        </div>

        <div class="ide-agy-set-main">
          <div style="max-width:620px;">${rightPaneHtml}</div>
        </div>
      </div>`;
  }

  function renderInIdeEditorSettingsHtml() {
    return `
      <div class="wysiwyg-doc">
        <h2>⚙️ Editor Settings (General editor, workbench, and feature preferences)</h2>
        <p>Cấu hình phông chữ, cỡ chữ, chế độ tự động lưu (<code>Files: Auto Save</code>) và định dạng trình soạn thảo Antigravity IDE.</p>
        <table>
          <thead><tr><th>Thiết lập</th><th>Giá trị mặc định</th><th>Mô tả</th></tr></thead>
          <tbody>
            <tr><td><strong>Files: Auto Save</strong></td><td><code>afterDelay</code></td><td>Tự động lưu tệp sau mỗi 1000ms khi chỉnh sửa.</td></tr>
            <tr><td><strong>Editor: Font Size</strong></td><td><code>14px</code></td><td>Cỡ chữ hiển thị trong khung soạn thảo.</td></tr>
            <tr><td><strong>Office Viewer: Markdown</strong></td><td><code>WYSIWYG Mode</code></td><td>Mở tệp <code>.md</code> dưới dạng trình bày trực quan như Google Docs.</td></tr>
          </tbody>
        </table>
      </div>`;
  }

  // Dual Workspace Tree Mode: "antigravity_course_vn" (Matches User's Explorer Screenshot 1:1) OR "Antigravity_Basic" (.agent Rules/Skills/Workflows View)
  let currentWorkspaceTreeMode = "antigravity_course_vn";

  function toggleExplorerWorkspaceMode() {
    currentWorkspaceTreeMode = (currentWorkspaceTreeMode === "antigravity_course_vn") ? "Antigravity_Basic" : "antigravity_course_vn";
    renderFileTree();
  }

  function renderFileTree() {
    const container = document.getElementById("ide-file-tree");
    if (!container) return;

    if (currentWorkspaceTreeMode === "antigravity_course_vn") {
      // Exact 1:1 replica of Explorer Tree in User's Screenshot (antigravity_course_vn) with data-file attributes
      container.innerHTML = `
        <div class="tree-folder" data-folder="antigravity_course_vn" style="font-weight:600; display:flex; justify-content:space-between; align-items:center; padding-right:8px;" onclick="this.nextElementSibling.classList.toggle('collapsed')">
          <div style="display:flex; align-items:center; gap:5px;"><span>⌄</span> <span>antigravity_course_vn</span></div>
          <div style="display:flex; align-items:center; gap:6px; font-size:12px; color:var(--text-muted);" onclick="event.stopPropagation()">
            <span title="New File..." onclick="promptNewFile()">📄⁺</span>
            <span title="New Folder...">📁⁺</span>
            <span title="Refresh Explorer" onclick="renderFileTree()">↻</span>
            <span title="Toggle .agent View" onclick="toggleExplorerWorkspaceMode()">❐</span>
          </div>
        </div>
        <div class="tree-children" style="padding-left:8px;">
          <div class="tree-folder" data-folder="assets" draggable="true" ondragend="openMoveWarnModal()" onclick="this.nextElementSibling.classList.toggle('collapsed')"><span>› 📁</span> <span>assets</span></div>
          <div class="tree-children collapsed">
            <div class="tree-file" data-file="photo_hoang_duc_minh.jpg" onclick="openFileInEditor('index.html')"><span>🖼️</span> <span>photo_hoang_duc_minh.jpg</span></div>
          </div>

          <div class="tree-folder" data-folder="html_video_demos" draggable="true" ondragend="openMoveWarnModal()" onclick="this.nextElementSibling.classList.toggle('collapsed')"><span>› 📁</span> <span>html_video_demos</span></div>
          <div class="tree-children collapsed">
            <div class="tree-file ${currentFileKey==='index.html'?'active':''}" data-file="index.html" onclick="openFileInEditor('index.html')"><span class="html-badge">&lt;/&gt;</span> <span>index.html</span></div>
          </div>

          <div class="tree-folder" data-folder="Module_0_Getting_Started" draggable="true" ondragend="openMoveWarnModal()" onclick="this.nextElementSibling.classList.toggle('collapsed')"><span>⌄ 📂</span> <span>Module_0_Getting_Started</span></div>
          <div class="tree-children">
            <div class="tree-file ${currentFileKey==='0.1_Introduction.md'?'active':''}" data-file="0.1_Introduction.md" onclick="openFileInEditor('0.1_Introduction.md')"><span class="md-badge">M↓</span> <span>0.1_Introduction.md</span></div>
          </div>

          <div class="tree-folder" data-folder="Module_1_Fundamentals" draggable="true" ondragend="openMoveWarnModal()" onclick="this.nextElementSibling.classList.toggle('collapsed')"><span>⌄ 📂</span> <span>Module_1_Fundamentals</span></div>
          <div class="tree-children">
            <div class="tree-file ${currentFileKey==='1.1_Welcome.md'?'active':''}" data-file="1.1_Welcome.md" onclick="openFileInEditor('1.1_Welcome.md')"><span class="md-badge">M↓</span> <span>1.1_Welcome.md</span></div>
            <div class="tree-file ${currentFileKey==='start-1-1.md'?'active':''}" data-file="1.4_Templates_Workflows.md" onclick="openFileInEditor('start-1-1.md')"><span class="md-badge">M↓</span> <span>1.4_Templates_Workflows.md</span></div>
          </div>

          <div class="tree-folder" data-folder="Module_2_Advanced_PM_Work" draggable="true" ondragend="openMoveWarnModal()" onclick="this.nextElementSibling.classList.toggle('collapsed')"><span>› 📁</span> <span>Module_2_Advanced_PM_Work</span></div>
          <div class="tree-children collapsed">
            <div class="tree-file ${currentFileKey==='2.2_Business_Data.md'?'active':''}" data-file="2.2_Business_Data.md" onclick="openFileInEditor('2.2_Business_Data.md')"><span class="md-badge">M↓</span> <span>2.2_Business_Data.md</span></div>
          </div>

          <div class="tree-folder" data-folder="Module_3_Advanced_Enterprise_Automation" draggable="true" ondragend="openMoveWarnModal()" onclick="this.nextElementSibling.classList.toggle('collapsed')"><span>› 📁</span> <span>Module_3_Advanced_Enterprise_Autom...</span></div>
          <div class="tree-children collapsed">
            <div class="tree-file ${currentFileKey==='3.1_Multi_Agent_Architecture.md'?'active':''}" data-file="3.1_Multi_Agent_Architecture.md" onclick="openFileInEditor('3.1_Multi_Agent_Architecture.md')"><span class="md-badge">M↓</span> <span>3.1_Multi_Agent_Architecture.md</span></div>
          </div>

          <div class="tree-folder" data-folder="Module_4_Masterclass_Thuc_Chien" draggable="true" ondragend="openMoveWarnModal()" onclick="this.nextElementSibling.classList.toggle('collapsed')"><span>› 📁</span> <span>Module_4_Masterclass_Thuc_Chien</span></div>
          <div class="tree-children collapsed">
            <div class="tree-file ${currentFileKey==='4.1_Giao_Trinh_Cot_Loi_120_Phut.md'?'active':''}" data-file="4.1_Giao_Trinh_Cot_Loi_120_Phut.md" onclick="openFileInEditor('4.1_Giao_Trinh_Cot_Loi_120_Phut.md')"><span class="md-badge">M↓</span> <span>4.1_Giao_Trinh_Cot_Loi_120_Phut.md</span></div>
          </div>

          <div class="tree-folder" data-folder="Module_6_Live_Masterclass_06" draggable="true" ondragend="openMoveWarnModal()" onclick="this.nextElementSibling.classList.toggle('collapsed')"><span>› 📁</span> <span>Module_6_Live_Masterclass_06</span></div>
          <div class="tree-children collapsed">
            <div class="tree-file ${currentFileKey==='4.1_Giao_Trinh_Cot_Loi_120_Phut.md'?'active':''}" data-file="Bai_Giang_Master_120_Phut.md" onclick="openFileInEditor('4.1_Giao_Trinh_Cot_Loi_120_Phut.md')"><span class="md-badge">M↓</span> <span>Bai_Giang_Master_120_Phut.md</span></div>
          </div>

          <div class="tree-folder" data-folder="slides" draggable="true" ondragend="openMoveWarnModal()" onclick="this.nextElementSibling.classList.toggle('collapsed')"><span>› 📁</span> <span>slides</span></div>
          <div class="tree-children collapsed">
            <div class="tree-file ${currentFileKey==='index.html'?'active':''}" data-file="slides_index.html" onclick="openFileInEditor('index.html')"><span class="html-badge">&lt;/&gt;</span> <span>index.html</span></div>
          </div>

          <div class="tree-folder" data-folder="Tai_Lieu_Doc_Them" draggable="true" ondragend="openMoveWarnModal()" onclick="this.nextElementSibling.classList.toggle('collapsed')"><span>› 📁</span> <span>Tai_Lieu_Doc_Them</span></div>
          <div class="tree-children collapsed">
            <div class="tree-file ${currentFileKey==='Bai_Doc_08_So_Sanh_Antigravity_IDE_Va_Antigravity_20.md'?'active':''}" data-file="Bai_Doc_08_So_Sanh_Antigravity_IDE_Va_Antigravity_20.md" onclick="openFileInEditor('Bai_Doc_08_So_Sanh_Antigravity_IDE_Va_Antigravity_20.md')"><span class="md-badge">M↓</span> <span>Bai_Doc_08_So_Sanh_Antigravity...</span></div>
          </div>

          <div class="tree-folder" data-folder="TaskFlow_Context" draggable="true" ondragend="openMoveWarnModal()" onclick="this.nextElementSibling.classList.toggle('collapsed')"><span>› 📁</span> <span>TaskFlow_Context</span></div>
          <div class="tree-children collapsed">
            <div class="tree-file ${currentFileKey==='sales_data.csv'?'active':''}" data-file="sales_data.csv" onclick="openFileInEditor('sales_data.csv')"><span class="csv-badge">📊</span> <span>sales_data.csv</span></div>
            <div class="tree-file ${currentFileKey==='COMPANY.md'?'active':''}" data-file="COMPANY.md" onclick="openFileInEditor('COMPANY.md')"><span class="md-badge">M↓</span> <span>COMPANY.md</span></div>
            <div class="tree-file ${currentFileKey==='troly.md'?'active':''}" data-file="troly.md" onclick="openFileInEditor('troly.md')"><span class="md-badge">M↓</span> <span>troly.md</span></div>
          </div>

          <div class="tree-file ${currentFileKey==='demo_ui_hoctap_tech.html'?'active':''}" data-file="demo_ui_hoctap_tech.html" draggable="true" ondragend="openMoveWarnModal()" onclick="openFileInEditor('demo_ui_hoctap_tech.html')"><span class="html-badge">&lt;/&gt;</span> <span>demo_ui_hoctap_tech.html</span></div>
          <div class="tree-file ${currentFileKey==='INDEX.md'?'active':''}" data-file="INDEX.md" draggable="true" ondragend="openMoveWarnModal()" onclick="openFileInEditor('INDEX.md')"><span class="md-badge">M↓</span> <span>INDEX.md</span></div>
        </div>`;
      return;
    }

    let html = `<div class="tree-folder" data-folder="Antigravity_Basic" style="font-weight:700;" onclick="this.nextElementSibling.classList.toggle('collapsed')"><span>⌄</span> <span>Antigravity_Basic</span></div><div class="tree-children" style="padding-left:6px;">`;
    TREE_STRUCTURE.forEach(group => {
      if (group.isRoot) {
        group.files.forEach(f => {
          const activeClass = (f === currentFileKey) ? "active" : "";
          html += `<div class="tree-file ${activeClass}" data-file="${f}" draggable="true" ondragend="openMoveWarnModal()" onclick="openFileInEditor('${f}')">${badgeForType(f)} <span>${f}</span></div>`;
        });
      } else {
        html += `<div class="tree-folder" data-folder="${group.folder}" draggable="true" ondragend="openMoveWarnModal()" onclick="this.nextElementSibling.classList.toggle('collapsed')"><span>⌄ 📁</span> <span>${group.folder}</span></div>`;
        html += `<div class="tree-children">`;
        group.children.forEach(sub => {
          html += `<div class="tree-folder" data-folder="${sub.folder}" draggable="true" ondragend="openMoveWarnModal()" onclick="this.nextElementSibling.classList.toggle('collapsed')"><span>⌄ 📂</span> <span>${sub.folder}</span></div>`;
          html += `<div class="tree-children">`;
          sub.files.forEach(f => {
            const activeClass = (f === currentFileKey) ? "active" : "";
            html += `<div class="tree-file ${activeClass}" data-file="${f}" draggable="true" ondragend="openMoveWarnModal()" onclick="openFileInEditor('${f}')">${badgeForType(f)} <span>${f}</span></div>`;
          });
          html += `</div>`;
        });
        html += `</div>`;
      }
    });
    html += `</div>`;
    container.innerHTML = html;
  }

  function renderTabs() {
    const list = document.getElementById("editor-tabs-list");
    list.innerHTML = openTabs.map(f => {
      const active = (f === currentFileKey) ? "active" : "";
      return `<div class="editor-tab ${active}" onclick="openFileInEditor('${f}')">
        ${badgeForType(f)}
        <span>${f}</span>
        <span class="tab-close" onclick="closeTab(event, '${f}')">×</span>
      </div>`;
    }).join("");
  }

  function closeTab(e, fileKey) {
    e.stopPropagation();
    openTabs = openTabs.filter(t => t !== fileKey);
    if (openTabs.length === 0) openTabs = ["INDEX.md"];
    if (currentFileKey === fileKey) currentFileKey = openTabs[openTabs.length - 1];
    openFileInEditor(currentFileKey);
  }

  function parseSimpleMarkdown(md) {
    let lines = md.split("\n");
    let out = "";
    let inTable = false;
    let inList = false;

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      if (line.trim().startsWith("|")) {
        if (line.includes("---")) continue;
        const cells = line.split("|").slice(1, -1).map(c => c.trim());
        if (!inTable) {
          out += "<table><thead><tr>" + cells.map(c => `<th>${formatInline(c)}</th>`).join("") + "</tr></thead><tbody>";
          inTable = true;
        } else {
          out += "<tr>" + cells.map(c => `<td>${formatInline(c)}</td>`).join("") + "</tr>";
        }
        continue;
      } else if (inTable) {
        out += "</tbody></table>";
        inTable = false;
      }

      if (line.startsWith("# ")) {
        if (inList) { out += "</ul>"; inList = false; }
        out += `<h1>${formatInline(line.slice(2))}</h1>`;
      } else if (line.startsWith("## ")) {
        if (inList) { out += "</ul>"; inList = false; }
        out += `<h2>${formatInline(line.slice(3))}</h2>`;
      } else if (line.startsWith("### ")) {
        if (inList) { out += "</ul>"; inList = false; }
        out += `<h3>${formatInline(line.slice(4))}</h3>`;
      } else if (line.startsWith("> ")) {
        if (inList) { out += "</ul>"; inList = false; }
        out += `<blockquote>${formatInline(line.slice(2))}</blockquote>`;
      } else if (line.trim().startsWith("* ") || line.trim().startsWith("- ")) {
        if (!inList) { out += "<ul>"; inList = true; }
        out += `<li>${formatInline(line.trim().slice(2))}</li>`;
      } else if (line.trim() === "" || line.trim() === "---") {
        if (inList) { out += "</ul>"; inList = false; }
      } else {
        if (inList) { out += "</ul>"; inList = false; }
        out += `<p>${formatInline(line)}</p>`;
      }
    }
    if (inTable) out += "</tbody></table>";
    if (inList) out += "</ul>";
    return `<div class="wysiwyg-doc" contenteditable="true" spellcheck="false">${out}</div>`;
  }

  function formatInline(str) {
    return str
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/`(.+?)`/g, "<code>$1</code>");
  }

  function renderCsvTable(csv) {
    const rows = csv.trim().split("\n").map(r => r.split(","));
    let html = `<div class="wysiwyg-doc"><h3>📊 Bảng tính Office Viewer: ${currentFileKey}</h3><table><thead><tr>`;
    rows[0].forEach(h => html += `<th>${h}</th>`);
    html += `</tr></thead><tbody>`;
    rows.slice(1).forEach(r => {
      html += `<tr>` + r.map(c => `<td contenteditable="true">${c}</td>`).join("") + `</tr>`;
    });
    html += `</tbody></table></div>`;
    return html;
  }

  function openFileInEditor(fileKey) {
    if (!VFS[fileKey]) return;
    currentFileKey = fileKey;
    if (!openTabs.includes(fileKey)) openTabs.push(fileKey);
    document.getElementById("ide-tabs-bar").style.display = "flex";
    renderFileTree();
    renderTabs();

    const fileObj = VFS[fileKey];
    document.getElementById("ide-window-title").textContent = `antigravity_course_vn - Antigravity IDE - ${fileKey}`;
    document.getElementById("editor-breadcrumbs").textContent = fileObj.path;

    const canvas = document.getElementById("editor-canvas");
    const toolbar = document.getElementById("office-toolbar");
    const bc = document.getElementById("editor-breadcrumbs");

    if (fileObj.type === "special_ext_office") {
      toolbar.classList.add("hidden");
      bc.style.display = "none";
      canvas.innerHTML = renderExtensionOfficeViewerHtml();
      document.getElementById("sb-line-count").textContent = "Tab Settings";
      return;
    } else if (fileObj.type === "special_agy_settings") {
      toolbar.classList.add("hidden");
      bc.style.display = "none";
      canvas.innerHTML = renderInIdeAntigravitySettingsHtml();
      document.getElementById("sb-line-count").textContent = "Tab Settings";
      return;
    } else if (fileObj.type === "special_editor_settings") {
      toolbar.classList.add("hidden");
      bc.style.display = "flex";
      canvas.innerHTML = renderInIdeEditorSettingsHtml();
      document.getElementById("sb-line-count").textContent = "Tab Settings";
      return;
    }

    bc.style.display = "flex";
    if (editorMode === "raw") {
      toolbar.classList.add("hidden");
      const lines = fileObj.content.split("\n");
      const nums = lines.map((_, i) => i + 1).join("<br>");
      canvas.innerHTML = `<div class="raw-code-view">
        <div class="line-numbers">${nums}</div>
        <div class="raw-code-text" contenteditable="true" oninput="VFS['${fileKey}'].content = this.innerText">${fileObj.content.replace(/</g, "&lt;")}</div>
      </div>`;
    } else {
      toolbar.classList.remove("hidden");
      if (fileObj.type === "csv") {
        canvas.innerHTML = renderCsvTable(fileObj.content);
      } else if (fileObj.type === "html") {
        canvas.innerHTML = fileObj.content;
      } else {
        canvas.innerHTML = parseSimpleMarkdown(fileObj.content);
      }
    }
    const lineCount = fileObj.content.split("\n").length;
    document.getElementById("sb-line-count").textContent = `Line ${lineCount}  Count ${fileObj.content.length}`;
  }

  function setEditorMode(mode) {
    editorMode = mode;
    document.getElementById("pill-wysiwyg").classList.toggle("active", mode === "wysiwyg");
    document.getElementById("pill-raw").classList.toggle("active", mode === "raw");
    openFileInEditor(currentFileKey);
  }

  function promptNewFile() {
    const name = prompt("Nhập tên tệp mới (ví dụ: bao_cao_quy_1.md):", "bao_cao_moi.md");
    if (!name) return;
    VFS[name] = {
      path: `Antigravity_Basic > M↓ ${name}`,
      type: name.endsWith(".csv") ? "csv" : (name.endsWith(".html") ? "html" : "md"),
      content: `# ${name}\n\nNội dung tệp mới được khởi tạo trực tiếp trong Workspace.`
    };
    TREE_STRUCTURE[3].files.push(name);
    openFileInEditor(name);
  }

  /* =========================================================================
     AUTOCOMPLETE POPUP FOR / AND @
     ========================================================================= */
  const WORKFLOW_ITEMS = [
    { cmd: "/start-1-1 ", desc: "Module 1.1: Chào mừng đến với TaskFlow — Bài thực hành có hướng dẫn từng bước" },
    { cmd: "/grill-me ", desc: "Phỏng vấn ngược làm rõ thông tin còn thiếu trước khi lập kế hoạch" },
    { cmd: "/plan ", desc: "Lập kế hoạch thực thi từng bước trước khi tạo tệp" },
    { cmd: "/learn ", desc: "Đúc kết kinh nghiệm và lưu quy chuẩn mới vào .agent/rules/" },
    { cmd: "/browser ", desc: "Kích hoạt trình duyệt tự động đọc và tổng hợp thông tin web" }
  ];

  const MENTION_ITEMS = [
    { cmd: "@COMPANY.md ", desc: "Hồ sơ doanh nghiệp mẫu TaskFlow Inc. (45 nhân sự)" },
    { cmd: "@sales_data.csv ", desc: "Bảng dữ liệu doanh thu TaskFlow Q1/2026" },
    { cmd: "@troly.md ", desc: "Hồ sơ trợ lý cá nhân và quy chuẩn báo cáo" }
  ];

  function handleInputKey(textarea, popupId) {
    const val = textarea.value;
    const popup = document.getElementById(popupId);
    if (val.endsWith("/") || (val.startsWith("/") && !val.includes(" "))) {
      popup.innerHTML = `<div class="popup-header">Actions & Workflows (Chọn từ danh sách rồi nhấn Enter)</div>` +
        WORKFLOW_ITEMS.map(w => `<div class="popup-item" data-cmd="${w.cmd.trim()}" onclick="selectPopupItem('${textarea.id}', '${popupId}', '${w.cmd}')">
          <strong>${w.cmd}</strong><span style="opacity:0.75; font-size:11px;">${w.desc}</span>
        </div>`).join("");
      popup.classList.add("visible");
    } else if (val.endsWith("@") || (val.startsWith("@") && !val.includes(" "))) {
      popup.innerHTML = `<div class="popup-header">Mentions (Files & Context)</div>` +
        MENTION_ITEMS.map(m => `<div class="popup-item" data-cmd="${m.cmd.trim()}" onclick="selectPopupItem('${textarea.id}', '${popupId}', '${m.cmd}')">
          <strong>${m.cmd}</strong><span style="opacity:0.75; font-size:11px;">${m.desc}</span>
        </div>`).join("");
      popup.classList.add("visible");
    } else {
      popup.classList.remove("visible");
    }
  }

  function selectPopupItem(textareaId, popupId, text) {
    const ta = document.getElementById(textareaId);
    ta.value = ta.value.slice(0, -1) + text;
    document.getElementById(popupId).classList.remove("visible");
    ta.focus();
  }

  function insertAtCursor(symbol) {
    const ta = document.getElementById("ide-chat-input");
    ta.value += symbol;
    handleInputKey(ta, "ide-popup-menu");
    ta.focus();
  }

  function insertAgy2Symbol(symbol) {
    const ta = document.getElementById("agy2-chat-input");
    ta.value += symbol;
    handleInputKey(ta, "agy2-popup-menu");
    ta.focus();
  }

  function handleEnterKey(e, surface) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submitChat(surface);
    }
  }

  function simulateVoiceInput(target, customSpeech, onDoneCallback) {
    const isIde = (target === "ide");
    const ta = isIde ? document.getElementById("ide-chat-input") : document.getElementById("agy2-chat-input");
    const voiceBar = isIde ? document.getElementById("ide-voice-bar") : document.getElementById("mgr-voice-bar");
    const timerSpan = isIde ? document.getElementById("ide-voice-timer") : document.getElementById("mgr-voice-timer");
    const sampleVoiceText = customSpeech || "Em đọc file @sales_data.csv và @troly.md rồi lập báo cáo tổng hợp doanh thu quý 1, chỉ rõ 3 sản phẩm lãi cao nhất và 2 sản phẩm lỗ cần cắt giảm ngay cho anh nhé!";

    voiceBar.classList.add("active");
    ta.value = "";
    let sec = 1;
    timerSpan.textContent = "00:01";
    const secInterval = setInterval(() => {
      sec++;
      timerSpan.textContent = "00:0" + Math.min(9, sec);
    }, 800);

    const words = sampleVoiceText.split(" ");
    let wIdx = 0;
    const wordTimer = setInterval(() => {
      if (wIdx < words.length) {
        ta.value += (wIdx === 0 ? "" : " ") + words[wIdx];
        wIdx++;
      } else {
        clearInterval(wordTimer);
        clearInterval(secInterval);
        setTimeout(() => {
          voiceBar.classList.remove("active");
          if (onDoneCallback) onDoneCallback();
        }, 380);
      }
    }, 95);
  }

  function submitChat(surface) {
    const ta = surface === "ide" ? document.getElementById("ide-chat-input") : document.getElementById("agy2-chat-input");
    const text = ta.value.trim();
    if (!text) return;
    ta.value = "";
    document.getElementById("ide-popup-menu").classList.remove("visible");
    document.getElementById("agy2-popup-menu").classList.remove("visible");

    if (surface === "ide") {
      const container = document.getElementById("ide-chat-messages");
      container.innerHTML += `<div class="msg-user">${text}</div>`;
      container.innerHTML += `<div class="msg-ai">
        <div class="progress-card">
          <div class="progress-card-title"><span>Progress Updates</span><span>Collapse ⌄</span></div>
          <div class="progress-step">▸ Thought for 4s</div>
          <div class="progress-step">📄 Analyzed <code>${currentFileKey}</code></div>
        </div>
        <p><strong>Kết luận:</strong> Em đã xử lý yêu cầu <em>"${text}"</em> và cập nhật trực tiếp vào tệp trong thư mục dự án.</p>
      </div>`;
      container.scrollTop = container.scrollHeight;
    } else {
      const stream = document.getElementById("agy2-chat-stream");
      stream.innerHTML += `
        <div class="agy2-user-turn">
          <div class="agy2-user-meta"><span>Just now</span><span>📋</span><span>👍</span><span>👎</span></div>
          <div class="agy2-user-bubble">${text}</div>
        </div>
        <div class="agy2-trace-list">
          <div class="agy2-trace-row"><span>Thinking ⌄</span></div>
          <div class="agy2-trace-row" onclick="openAgy2RightPane('bao_cao_doanh_thu_q1.md')">
            <span>Edited</span> <span class="md-badge">M↓</span> <span class="trace-file-chip">${agy2RpKey}</span>
            <span class="diff-add">+18</span> <span class="diff-del">-2</span>
          </div>
        </div>
        <div class="agy2-ai-prose">
          <p><strong>Kết luận:</strong> Đã thực thi yêu cầu <em>"${text}"</em> và đồng bộ kết quả sang khung tài liệu bên phải.</p>
        </div>`;
      stream.scrollTop = stream.scrollHeight;
    }
  }

  function clearIdeChat() {
    document.getElementById("ide-chat-messages").innerHTML = `<div class="msg-ai"><p style="color:var(--text-muted);">Phiên hội thoại mới. Gõ <code>/</code> để gọi quy trình hoặc <code>@</code> để đính kèm tài liệu.</p></div>`;
  }

  /* =========================================================================
     6 PRE-BUILT LESSON SCENARIOS FOR VIDEO RECORDING
     ========================================================================= */
  function highlightScenarioBtn(num) {
    for (let i = 0; i <= 8; i++) {
      const b = document.getElementById("btn-sc-" + i);
      if (b) b.classList.toggle("active", i === num);
    }
  }

  /* =========================================================================
     IDE MENUS, WELCOME SCREEN, EMPTY LOGO STATE & WINDOWS 11 OPEN FOLDER DIALOG
     (Exact replica of Screenshots 1, 2, 3, 4)
     ========================================================================= */
  function toggleIdeMenu(which, e) {
    if (e) e.stopPropagation();
    const fileDd = document.getElementById("ide-file-dropdown");
    const gearDd = document.getElementById("ide-gear-dropdown");
    if (which === "file") {
      gearDd.classList.remove("open");
      fileDd.classList.toggle("open");
    } else if (which === "gear") {
      fileDd.classList.remove("open");
      gearDd.classList.toggle("open");
    }
  }

  function closeIdeMenus() {
    const fileDd = document.getElementById("ide-file-dropdown");
    const gearDd = document.getElementById("ide-gear-dropdown");
    if (fileDd) fileDd.classList.remove("open");
    if (gearDd) gearDd.classList.remove("open");
  }

  window.addEventListener("click", () => {
    closeIdeMenus();
  });

  function getAntigravityArchSvg(size) {
    return `<svg width="${size}" height="${size}" viewBox="0 0 48 48" fill="none">
      <path d="M10 38C16 38 19 10 24 10C29 10 32 38 38 38" stroke="currentColor" stroke-width="5.5" stroke-linecap="round"/>
    </svg>`;
  }

  // Exact Screenshot 1: Empty Editor State with "Antigravity IDE" & "Code with Agent [Ctrl] + [L]"
  function showEmptyIdeLogoState() {
    switchToSurface("ide");
    document.getElementById("ide-tabs-bar").style.display = "none";
    document.getElementById("editor-breadcrumbs").style.display = "none";
    document.getElementById("office-toolbar").classList.add("hidden");
    const canvas = document.getElementById("editor-canvas");
    canvas.innerHTML = `
      <div style="height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; color:var(--text-main);">
        <div style="margin-bottom:10px;">${getAntigravityArchSvg(54)}</div>
        <div style="font-size:17px; margin-bottom:28px; color:var(--text-muted);">Antigravity IDE</div>
        <div style="display:flex; align-items:center; gap:80px; font-size:12.5px; color:var(--text-muted);">
          <span>Code with Agent</span>
          <span><span class="ide-kbd">Ctrl</span> + <span class="ide-kbd">L</span></span>
        </div>
      </div>`;
  }

  // Exact Screenshot 2: Welcome / No Folder Open Screen with "Open Folder", "Clone Repository", "Workspaces" & "Google Extensions"
  function showIdeWelcomeScreen() {
    highlightScenarioBtn(0);
    switchToSurface("ide");
    document.getElementById("ide-left-sidebar").classList.add("collapsed");
    document.getElementById("ide-tabs-bar").style.display = "none";
    document.getElementById("editor-breadcrumbs").style.display = "none";
    document.getElementById("office-toolbar").classList.add("hidden");
    document.getElementById("ide-window-title").textContent = "Antigravity IDE";
    document.getElementById("ide-chat-messages").innerHTML = `<div style="text-align:center; color:#0060c0; font-weight:700; margin-top:8px;">—</div>`;

    const canvas = document.getElementById("editor-canvas");
    canvas.innerHTML = `
      <div class="ide-welcome-wrap">
        <div>${getAntigravityArchSvg(52)}</div>
        <div class="ide-welcome-title">Antigravity IDE</div>

        <button class="ide-btn-open-folder" onclick="openWinFolderDialog()">
          <span>📁</span> <span>Open Folder</span>
        </button>
        <button class="ide-btn-clone" onclick="openWinFolderDialog()">
          <span>❐</span> <span>Clone Repository</span>
        </button>

        <div style="width:100%; text-align:left; font-size:12px; font-weight:600; margin-bottom:8px;">Workspaces</div>
        <div class="ide-ws-card" onclick="openWorkspaceByName('antigravity_course_vn')">
          <div class="ide-ws-name" style="font-weight:600; color:#0060c0;">antigravity_course_vn</div>
          <div class="ide-ws-path">C:\\Antigravity_Basic\\antigravity_course_vn</div>
        </div>
        <div class="ide-ws-card" onclick="openWorkspaceByName('Antigravity_Basic')">
          <div class="ide-ws-name">Antigravity_Basic</div>
          <div class="ide-ws-path">C:\\Antigravity_Basic</div>
        </div>
        <div class="ide-ws-card" onclick="openWorkspaceByName('TaskFlow_Context')">
          <div class="ide-ws-name">TaskFlow_Context</div>
          <div class="ide-ws-path">C:\\Antigravity_Basic\\antigravity_course_vn\\TaskFlow_Context</div>
        </div>
        <div class="ide-ws-card" onclick="openWorkspaceByName('Module_6_Live_Masterclass_06')">
          <div class="ide-ws-name">Module_6_Live_Masterclass_06</div>
          <div class="ide-ws-path">C:\\Antigravity_Basic\\antigravity_course_vn\\Module_6_Live_Masterclass_06</div>
        </div>
        <div style="font-size:12px; color:#8e8e8e; margin:8px 0 26px 0; cursor:pointer;">Show More...</div>

        <div style="width:100%; text-align:left; font-size:12px; font-weight:600; margin-bottom:8px;">Google Extensions</div>
        <div class="ide-ws-card" style="display:flex; align-items:center; justify-content:space-between; cursor:default;">
          <div style="display:flex; align-items:center; gap:10px;">
            <span style="font-size:18px;">☁️</span>
            <div>
              <div class="ide-ws-name">Google Data Cloud</div>
              <div class="ide-ws-path">Google Data Cloud for your intelligent IDE.</div>
            </div>
          </div>
          <button style="background:#fff; border:1px solid #ccc; padding:4px 10px; border-radius:4px; font-size:11.5px; cursor:pointer;">Download</button>
        </div>
      </div>`;
  }

  // Exact Screenshot 3: Windows 11 Dark Open Folder Dialog
  function openWinFolderDialog() {
    document.getElementById("win-open-folder-modal").classList.add("open");
  }

  function closeWinFolderDialog() {
    document.getElementById("win-open-folder-modal").classList.remove("open");
  }

  function selectWinFolder(folderName, rowEl) {
    document.getElementById("win-selected-folder-input").value = folderName;
    if (rowEl) {
      document.querySelectorAll(".win-file-row").forEach(r => r.classList.remove("selected"));
      rowEl.classList.add("selected");
    }
  }

  function confirmWinFolderSelection() {
    const folderName = document.getElementById("win-selected-folder-input").value || "antigravity_course_vn";
    closeWinFolderDialog();
    openWorkspaceByName(folderName);
  }

  function openWorkspaceByName(wsName) {
    document.getElementById("ide-left-sidebar").classList.remove("collapsed");
    document.getElementById("ide-tabs-bar").style.display = "flex";
    document.getElementById("editor-breadcrumbs").style.display = "flex";
    if (wsName === "Antigravity_Basic") {
      currentWorkspaceTreeMode = "Antigravity_Basic";
      renderFileTree();
      runScenario(1);
    } else {
      currentWorkspaceTreeMode = "antigravity_course_vn";
      renderFileTree();
      openFileInEditor("INDEX.md");
    }
    document.getElementById("ide-window-title").textContent = `${wsName} - Antigravity IDE`;
  }

  let liveAnimMode = true;
  let activeStreamTimers = [];
  let isAutoGliding = false;

  function clearStreamTimers() {
    activeStreamTimers.forEach(t => clearTimeout(t));
    activeStreamTimers = [];
    isAutoGliding = false;
    const ld = document.getElementById("laser-cursor");
    if (ld) {
      ld.classList.remove("auto-gliding", "pressing");
    }
    const ideVb = document.getElementById("ide-voice-bar");
    const mgrVb = document.getElementById("mgr-voice-bar");
    if (ideVb) ideVb.classList.remove("active");
    if (mgrVb) mgrVb.classList.remove("active");
  }

  // Custom DOM Select Dropdown Engine (Replaces native OS <select> so #laser-cursor stays visible)
  function openCustomSelectMenu(pillEl, options, e) {
    if (e && e.stopPropagation) e.stopPropagation();
    const menu = document.getElementById("custom-select-floating");
    if (!menu || !pillEl) return;
    const labelEl = pillEl.querySelector(".val-label") || pillEl;
    const currentVal = labelEl.textContent.trim();
    menu.innerHTML = options.map(opt => {
      const isAct = currentVal === opt || currentVal.includes(opt);
      return `<div class="custom-select-opt ${isAct ? "active-opt" : ""}" data-val="${opt.replace(/"/g, '&quot;')}">
        <span>${opt}</span>
        <span style="font-size:11px; color:#2563eb; opacity:${isAct ? 1 : 0};">✓</span>
      </div>`;
    }).join("");

    menu.querySelectorAll(".custom-select-opt").forEach(optEl => {
      optEl.addEventListener("click", (ev) => {
        ev.stopPropagation();
        const chosen = optEl.getAttribute("data-val");
        if (pillEl.querySelector(".val-label")) {
          pillEl.querySelector(".val-label").textContent = chosen;
        } else {
          pillEl.innerHTML = `${chosen} <span style="opacity:0.55;">⌄</span>`;
        }
        closeCustomSelectMenu();
      });
    });

    const rect = pillEl.getBoundingClientRect();
    menu.classList.add("open");
    const menuHeight = menu.offsetHeight || 160;
    let topPos = rect.bottom + 4;
    if (topPos + menuHeight > window.innerHeight - 12) {
      topPos = Math.max(12, rect.top - menuHeight - 4);
    }
    let leftPos = Math.min(rect.left, window.innerWidth - 220);
    menu.style.top = topPos + "px";
    menu.style.left = Math.max(8, leftPos) + "px";
  }

  function closeCustomSelectMenu() {
    const menu = document.getElementById("custom-select-floating");
    if (menu) menu.classList.remove("open");
  }

  window.addEventListener("click", () => {
    closeCustomSelectMenu();
  });

  function toggleLiveAnimMode() {
    liveAnimMode = !liveAnimMode;
    const btn = document.getElementById("btn-live-mode");
    btn.classList.toggle("active", liveAnimMode);
    btn.textContent = liveAnimMode ? "🔴 Tự Lướt & Gõ: ON" : "⚡ Hiện Tức Thời: ON";
  }

  function toggleIdeBottomTerminal() {
    document.getElementById("ide-bottom-terminal").classList.toggle("open");
  }

  function openMoveWarnModal() {
    switchToSurface("ide");
    document.getElementById("ide-move-warn-modal").classList.add("open");
  }

  function closeMoveWarnModal() {
    document.getElementById("ide-move-warn-modal").classList.remove("open");
  }

  function openSubPermModal(mode) {
    const modal = document.getElementById("ide-sub-perm-modal");
    const title = document.getElementById("sub-perm-title");
    const body = document.getElementById("sub-perm-body");
    if (mode === "tools") {
      title.textContent = "Tool Permissions (97 Configured Tools)";
      body.innerHTML = [
        ["read_file", "Đọc tệp văn bản, Markdown, CSV, PDF trong Workspace", "Always Allow"],
        ["write_file / edit_file", "Tạo mới và chỉnh sửa tệp trực tiếp trong thư mục dự án", "Turbo (Auto)"],
        ["run_command (Terminal)", "Thực thi script Python (export_pdf_png.py, kiểm định dữ liệu)", "Turbo (Auto)"],
        ["browser_subagent (/browser)", "Tự động mở Chrome đọc báo VNExpress & nghiên cứu thị trường", "Always Allow"],
        ["gdrive / gsheets plugin", "Đồng bộ tài liệu Google Drive & Google Sheets", "Ask First"]
      ].map(r => `<div style="display:flex; justify-content:space-between; align-items:center; padding:8px 10px; border:1px solid var(--border-color); border-radius:6px;">
        <div><strong><code>${r[0]}</code></strong><div style="font-size:11.5px; color:var(--text-muted);">${r[1]}</div></div>
        <span class="ide-gray-pill-btn" onclick="this.textContent = this.textContent.includes('Allow') ? 'Ask First' : 'Always Allow'">${r[2]}</span>
      </div>`).join("");
    } else {
      title.textContent = "Network Access Rules (52 Allowed Domains)";
      body.innerHTML = [
        ["vnexpress.net", "Cào tin tức Kinh doanh mỗi sáng (Scheduled Automation)", "Allowed"],
        ["open-vsx.org", "Tải tiện ích mở rộng (Office Viewer, Muty PPT) cho Workspace", "Allowed"],
        ["context7.com / docs.google.com", "Tra cứu tài liệu kỹ thuật & học liệu đám mây", "Allowed"],
        ["*.internal.corp", "Hệ thống mạng nội bộ doanh nghiệp (Chặn truy cập trái phép)", "Denied"]
      ].map(r => `<div style="display:flex; justify-content:space-between; align-items:center; padding:8px 10px; border:1px solid var(--border-color); border-radius:6px;">
        <div><strong>${r[0]}</strong><div style="font-size:11.5px; color:var(--text-muted);">${r[1]}</div></div>
        <span class="ide-gray-pill-btn" style="color:${r[2]==='Allowed'?'#16a34a':'#dc2626'}; font-weight:600;">${r[2]}</span>
      </div>`).join("");
    }
    modal.classList.add("open");
  }

  function closeSubPermModal() {
    document.getElementById("ide-sub-perm-modal").classList.remove("open");
  }

  // Soft Red Glowing Laser Dot + Click Ripple Engine + Hover Magnetism
  const laserDot = document.getElementById("laser-cursor");

  function spawnClickRipple(x, y) {
    if (laserDot) {
      laserDot.classList.add("pressing");
      setTimeout(() => laserDot.classList.remove("pressing"), 180);
    }
    const r = document.createElement("div");
    r.className = "click-ripple";
    r.style.left = x + "px";
    r.style.top = y + "px";
    document.body.appendChild(r);
    setTimeout(() => r.remove(), 540);
  }

  // Independent simulated laser dot: never intercepts or follows user's real OS mouse cursor

  // Smoothly glides the red glowing laser dot to any target element, clicks with bright ring, then runs callback
  function glideLaserTo(targetElOrSelector, callback, delayMs = 680) {
    const el = typeof targetElOrSelector === "string" ? document.querySelector(targetElOrSelector) : targetElOrSelector;
    if (!el || !laserDot || !liveAnimMode) {
      if (callback) callback();
      return;
    }
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) {
      if (callback) callback();
      return;
    }
    const targetX = Math.round(rect.left + rect.width / 2);
    const targetY = Math.round(rect.top + rect.height / 2);
    isAutoGliding = true;
    laserDot.classList.add("auto-gliding");
    laserDot.style.left = targetX + "px";
    laserDot.style.top = targetY + "px";

    activeStreamTimers.push(setTimeout(() => {
      spawnClickRipple(targetX, targetY);
      activeStreamTimers.push(setTimeout(() => {
        isAutoGliding = false;
        if (callback) callback();
      }, 220));
    }, delayMs));
  }

  function streamIdeConversation(promptText, stepsHtmlArray, finalHtml, targetFileAfter, isVoiceMode = false) {
    clearStreamTimers();
    const ta = document.getElementById("ide-chat-input");
    const msgBox = document.getElementById("ide-chat-messages");

    if (!liveAnimMode) {
      ta.value = "";
      msgBox.innerHTML = `<div class="msg-user">${promptText}</div><div class="msg-ai">${stepsHtmlArray.join("")}${finalHtml}</div>`;
      if (targetFileAfter) openFileInEditor(targetFileAfter);
      return;
    }

    msgBox.innerHTML = "";
    ta.value = "";

    function afterInputReady() {
      glideLaserTo("#ide-send-btn", () => {
        ta.value = "";
        msgBox.innerHTML = `<div class="msg-user">${promptText}</div><div class="msg-ai" id="live-ai-turn"><div class="progress-step" id="live-thinking-row">⏳ Thinking for 1s...</div></div>`;
        const aiTurn = document.getElementById("live-ai-turn");
        let stepIdx = 0;

        function nextStep() {
          const th = document.getElementById("live-thinking-row");
          if (th) th.remove();
          if (stepIdx < stepsHtmlArray.length) {
            aiTurn.insertAdjacentHTML("beforeend", stepsHtmlArray[stepIdx]);
            stepIdx++;
            activeStreamTimers.push(setTimeout(nextStep, 520));
          } else {
            aiTurn.insertAdjacentHTML("beforeend", finalHtml);
            if (targetFileAfter) {
              glideLaserTo("#editor-tabs-list", () => {
                openFileInEditor(targetFileAfter);
              }, 500);
            }
          }
        }
        activeStreamTimers.push(setTimeout(nextStep, 580));
      }, 450);
    }

    if (isVoiceMode) {
      glideLaserTo("#ide-mic-btn", () => {
        simulateVoiceInput("ide", promptText, afterInputReady);
      }, 520);
    } else {
      glideLaserTo("#ide-chat-input", () => {
        let charIdx = 0;
        const typeSpeed = Math.max(12, Math.floor(600 / Math.max(10, promptText.length)));
        function typeNextChar() {
          if (charIdx < promptText.length) {
            ta.value += promptText[charIdx];
            if (promptText[charIdx] === "/" || promptText[charIdx] === "@") {
              handleInputKey(ta, "ide-popup-menu");
            } else if (promptText[charIdx] === " ") {
              document.getElementById("ide-popup-menu").classList.remove("visible");
            }
            charIdx++;
            activeStreamTimers.push(setTimeout(typeNextChar, typeSpeed));
          } else {
            document.getElementById("ide-popup-menu").classList.remove("visible");
            activeStreamTimers.push(setTimeout(afterInputReady, 220));
          }
        }
        typeNextChar();
      }, 520);
    }
  }

  function runScenario(num) {
    highlightScenarioBtn(num);
    clearStreamTimers();
    if (num <= 4) {
      switchToSurface("ide");
      switchIdeSidebarMode("explorer");
      if (currentWorkspaceTreeMode !== "Antigravity_Basic") {
        currentWorkspaceTreeMode = "Antigravity_Basic";
        renderFileTree();
      }

      if (num === 1) {
        openFileInEditor("Readme.md");
        document.getElementById("ide-chat-title").textContent = "Starting TaskFlow Module 1.1";
        streamIdeConversation(
          "/start-1-1",
          [
            `<div class="progress-card"><div class="progress-card-title"><span>Progress Updates</span><span>Collapse all ⌄</span></div><div class="progress-step">📄 Đã đọc <code>.agent/workflows/start-1-1.md</code></div><div class="progress-step">📄 Đã nạp bối cảnh <code>company-context/COMPANY.md</code></div></div>`
          ],
          `<p>Chào mừng bạn gia nhập <strong>TaskFlow Inc. (45 nhân sự)</strong> với vị trí <strong>Quản lý tự động hóa quy trình (AI Automation PM)</strong>!</p>
           <p>Bạn sẽ phối hợp cùng <strong>Alex (CEO)</strong>, <strong>Sarah (HR)</strong> và <strong>Mike (Sales)</strong> để chuẩn hóa công việc bằng trợ lý AI.</p>
           <p>Nếu bạn đã sẵn sàng bắt đầu vai trò Quản lý tự động hóa quy trình, hãy gõ: <strong style="background:#0284c7; color:#fff; padding:1px 6px; border-radius:3px;">'Tôi sẵn sàng'</strong></p>`,
          "start-1-1.md",
          false
        );
      } else if (num === 2) {
        openFileInEditor("0.1_Introduction.md");
        document.getElementById("ide-chat-title").textContent = "Creating Antigravity Course Landing Page";
        document.getElementById("changes-indicator").textContent = "2 Files With Changes";
        document.getElementById("ide-bottom-terminal").classList.add("open");
        streamIdeConversation(
          "Làm cho tôi 1 landing page html giới thiệu khóa học này. Nền trắng, chữ đen và da cam. Tự chấm điểm đến khi đạt 10/10 và xuất kèm file PDF/PNG.",
          [
            `<div class="progress-card"><div class="progress-card-title"><span>Files Edited (Code-as-a-Tool)</span></div><div class="progress-step">☑️ Task List (4/4 hoàn thành)</div><div class="progress-step">🐍 <code>export_pdf_png.py</code></div><div class="progress-step">&lt;/&gt; <code>index.html</code></div></div>`,
            `<div class="progress-card"><div class="progress-card-title"><span>Progress Updates (Self-Prompting 10/10)</span></div><div class="progress-step">▸ Thought for 8s — Tự đọc <code>Readme.md</code></div><div class="progress-step">✏️ Created <code>index.html</code> (Đạt chuẩn <strong>10/10</strong>)</div><div class="cmd-box">\\Antigravity_Basic &gt; python export_pdf_png.py<br>✓ Exported landing_page.pdf &amp; landing_page.png</div></div>`
          ],
          `<p><strong>Kết luận:</strong> Em đã thiết kế xong <code>index.html</code> ở cột giữa và tự chạy script Python dưới cửa sổ Terminal để xuất PDF/PNG.</p>`,
          "index.html",
          true
        );
      } else if (num === 3) {
        openFileInEditor("troly.md");
        document.getElementById("ide-chat-title").textContent = "Analyzing TaskFlow Q1 Sales Data";
        streamIdeConversation(
          "Đọc @sales_data.csv và @troly.md, tính tổng doanh thu Q1, chỉ ra 3 sản phẩm lãi cao nhất và 2 sản phẩm cần cắt giảm.",
          [
            `<div class="progress-card"><div class="progress-card-title"><span>Progress Updates</span></div><div class="progress-step">📊 Analyzed <code>company-context/sales_data.csv</code></div><div class="progress-step">📄 Analyzed <code>troly.md</code> (Áp dụng khẩu vị báo cáo CEO)</div></div>`
          ],
          `<p><strong>Kết luận:</strong> Tổng doanh thu Q1/2026 của TaskFlow đạt <strong>391,000 USD</strong>, lợi nhuận ròng đạt <strong>246,500 USD</strong>.</p>
           <ul style="margin-left:18px;">
             <li><strong>Top 3 sản phẩm lãi cao nhất:</strong> <code>TF-01 Enterprise AI</code> (+140,000 USD), <code>TF-02 Team Pro</code> (+74,000 USD), <code>TF-03 Onboarding</code> (+42,000 USD).</li>
             <li><strong>2 sản phẩm cần cắt giảm ngay:</strong> <code>TF-04 Module báo cáo cũ</code> (-6,000 USD) và <code>TF-05 Tiện ích lịch cá nhân</code> (-3,500 USD).</li>
           </ul>`,
          "sales_data.csv",
          false
        );
      } else if (num === 4) {
        openFileInEditor("noi_quy_chung.md");
        document.getElementById("ide-chat-title").textContent = "HR Pipeline & Candidate ID Masking";
        streamIdeConversation(
          "/tuyen_dung_hr_5_buoc Tuyển vị trí AI Automation PM",
          [
            `<div class="progress-card"><div class="progress-card-title"><span>Quy trình tuyển dụng 5 giai đoạn</span></div><div class="progress-step">✅ GĐ 1-3: Soạn JD -> HR duyệt (Human Gate) -> Xuất Poster PNG</div><div class="progress-step">🔒 GĐ 4: Ẩn danh hóa 120 CV bằng <code>Candidate ID Masking</code> (<code>UV_001</code>..<code>UV_120</code>)</div><div class="progress-step">🏆 GĐ 5: Xếp hạng khách quan — Top 1: <code>UV_018</code> (9.6/10)</div></div>`
          ],
          `<p><strong>Kết luận:</strong> Đã hoàn tất sàng lọc 120 hồ sơ không thiên vị nhờ kỹ thuật che tên tuổi quê quán trước khi AI chấm điểm.</p>`,
          "noi_quy_chung.md",
          false
        );
      }
    } else if (num === 5) {
      switchToSurface("mgr");
      loadAgy2Thread("main");
    } else if (num === 6) {
      switchToSurface("mgr");
      openSettingsModal("general");
    }
  }

  // Hands-free Automated Video Tour: Red laser dot glides through Welcome -> Open Folder -> Extensions -> Settings -> Live Chat
  function runAutoFullTour() {
    clearStreamTimers();
    liveAnimMode = true;
    showIdeWelcomeScreen();
    glideLaserTo(".ide-btn-open-folder", () => {
      openWinFolderDialog();
      activeStreamTimers.push(setTimeout(() => {
        glideLaserTo(".win-dlg-btn", () => {
          confirmWinFolderSelection();
          activeStreamTimers.push(setTimeout(() => {
            glideLaserTo("#act-btn-extensions", () => {
              openIdeExtensionsView();
              activeStreamTimers.push(setTimeout(() => {
                glideLaserTo("#ide-gear-btn", () => {
                  openIdeSettingsPicker();
                  activeStreamTimers.push(setTimeout(() => {
                    openIdeAntigravitySettingsTab();
                    closeIdeSettingsPicker();
                    activeStreamTimers.push(setTimeout(() => {
                      runScenario(2);
                    }, 1800));
                  }, 1400));
                }, 650);
              }, 1600));
            }, 650);
          }, 3200));
        }, 700);
      }, 900));
    }, 650);
  }

  function runBrowserDemo() {
    switchToSurface("ide");
    const canvas = document.getElementById("editor-canvas");
    document.getElementById("editor-breadcrumbs").textContent = "Browser Subagent > 🌐 https://vnexpress.net/kinh-doanh";
    canvas.innerHTML = `<div class="wysiwyg-doc">
      <h2>📰 Bản tin kinh doanh tự động (Browser Subagent /browser)</h2>
      <table>
        <thead><tr><th>Thời gian</th><th>Tiêu đề bài báo</th><th>Tóm tắt 3 ý cốt lõi</th></tr></thead>
        <tbody>
          <tr><td>08:15</td><td><strong>Xuất khẩu nông sản xanh tăng trưởng 24% trong Quý 1</strong></td><td>Các sản phẩm phụ phẩm nông nghiệp (bã mía, xơ dừa) được thị trường EU ưu đãi thuế quan.</td></tr>
          <tr><td>08:40</td><td><strong>Doanh nghiệp SME đẩy mạnh ứng dụng AI Agent nội bộ</strong></td><td>Ứng dụng trợ lý AI ngay trên máy tính giúp tự động hóa quy trình lập báo cáo và tổng hợp dữ liệu văn phòng.</td></tr>
        </tbody>
      </table>
    </div>`;
  }

  function switchIdeSidebarMode(mode) {
    document.getElementById("ide-left-sidebar").classList.remove("collapsed");
    const expView = document.getElementById("ide-sb-explorer-view");
    const extView = document.getElementById("ide-sb-extensions-view");
    const btnExp = document.getElementById("act-btn-explorer");
    const btnExt = document.getElementById("act-btn-extensions");

    if (mode === "extensions") {
      expView.style.display = "none";
      extView.classList.add("active");
      if (btnExp) btnExp.classList.remove("active");
      if (btnExt) btnExt.classList.add("active");
    } else {
      expView.style.display = "flex";
      extView.classList.remove("active");
      if (btnExp) btnExp.classList.add("active");
      if (btnExt) btnExt.classList.remove("active");
    }
  }

  // Exact Batch 3 Screenshot 1: Extensions Sidebar + Extension: Office Viewer Tab
  function openIdeExtensionsView() {
    highlightScenarioBtn(7);
    switchToSurface("ide");
    switchIdeSidebarMode("extensions");
    openFileInEditor("Extension: Office Viewer");
  }

  function showExtensionsInfo() {
    openIdeExtensionsView();
  }

  // Exact Batch 3 Screenshot 2: Command Palette Picker "Select Settings to Open"
  function openIdeSettingsPicker() {
    highlightScenarioBtn(8);
    switchToSurface("ide");
    document.getElementById("ide-settings-picker-modal").classList.add("open");
  }

  function closeIdeSettingsPicker() {
    document.getElementById("ide-settings-picker-modal").classList.remove("open");
  }

  function openIdeEditorSettingsTab() {
    switchToSurface("ide");
    switchIdeSidebarMode("explorer");
    if (!openTabs.includes("Extension: Office Viewer")) openTabs.push("Extension: Office Viewer");
    openFileInEditor("Settings");
  }

  // Exact Batch 3 Screenshot 4: In-IDE "Antigravity Settings" Tab alongside Extension: Office Viewer & Settings
  function openIdeAntigravitySettingsTab() {
    highlightScenarioBtn(8);
    switchToSurface("ide");
    switchIdeSidebarMode("explorer");
    currentWorkspaceTreeMode = "antigravity_course_vn";
    renderFileTree();
    if (!openTabs.includes("Extension: Office Viewer")) openTabs.push("Extension: Office Viewer");
    if (!openTabs.includes("Settings")) openTabs.push("Settings");
    openFileInEditor("Antigravity Settings");
  }

  function switchToSurface(target) {
    const ide = document.getElementById("surface-ide");
    const mgr = document.getElementById("surface-mgr");
    const btn = document.getElementById("btn-switch-surface");
    if (target === "mgr") {
      ide.classList.add("hidden");
      mgr.classList.add("active");
      btn.textContent = "🔄 Chuyển sang Bản IDE (3 Cột)";
    } else {
      mgr.classList.remove("active");
      ide.classList.remove("hidden");
      btn.textContent = "🔄 Chuyển sang AGY 2.0";
    }
  }

  function toggleSurface() {
    const mgrActive = document.getElementById("surface-mgr").classList.contains("active");
    switchToSurface(mgrActive ? "ide" : "mgr");
  }

  function toggleLeftSidebar() {
    document.getElementById("ide-left-sidebar").classList.toggle("collapsed");
  }

  function toggleRightAgent() {
    document.getElementById("ide-right-agent").classList.toggle("collapsed");
  }

  function toggleTheme() {
    document.body.classList.toggle("dark-theme");
  }

  function toggleDirectorBar() {
    const bar = document.getElementById("director-bar");
    const floatBtn = document.getElementById("floating-dir-toggle");
    bar.classList.toggle("hidden");
    floatBtn.style.display = bar.classList.contains("hidden") ? "block" : "none";
  }

  window.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key.toLowerCase() === "b") {
      e.preventDefault();
      toggleLeftSidebar();
    } else if (e.altKey && e.key.toLowerCase() === "d") {
      e.preventDefault();
      toggleDirectorBar();
    } else if (e.key === "Escape") {
      closeSettingsModal();
      closeIdeSettingsPicker();
      closeCustomSelectMenu();
    }
  });

  window.addEventListener("DOMContentLoaded", () => {
    openFileInEditor("0.1_Introduction.md");
    loadAgy2Thread("main");
    switchToSurface("mgr");
  });
