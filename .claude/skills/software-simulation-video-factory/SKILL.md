---
name: software-simulation-video-factory
version: "3.1.0"
description: Xưởng Phim Mô Phỏng Phần Mềm Đa Năng & Giáo Án Tương Tác Video-in-HTML / MP4 16:9 (Kiến trúc Tòa Soạn 6 Ban + Cổng Hợp Đồng Kudo). Dùng để dựng nguyên mẫu HTML (HTML Prototype) của BẤT KỲ phần mềm nào (ERP, CRM, Core Banking, SaaS, Web Portal, Mobile App, Desktop IDE) kết hợp Slide diễn giải SVG động, con trỏ thông minh và thuyết minh âm thanh phục vụ: Khóa học đào tạo, Chuyển giao hệ thống, Demo bán hàng, Xác nhận quy trình BA/UAT trước lập trình, và Xuất bản Video 16:9.
---

# Universal Software Simulation & Video-Course Factory (`v3.1` — Tổng Đạo Diễn)

Nhận đề bài (hoặc khối `<sim-request>`) → Khám môi trường (`doctor`) → Phân tích 6 câu hỏi → Chọn Ban → Thiết kế quy trình `⛔ GATE` → Điều phối thực hiện.

**Nguyên tắc phân quyền 3 tầng (Học từ `/viet-chuyen-nghiep` & `/kudo`):**
- **Tổng Đạo Diễn (`SKILL.md`):** Kiểm tra hợp đồng đầu vào (`check-request`), giao MỤC TIÊU cho Trưởng ban (`lead.md`), thiết kế chuỗi cổng chặn `⛔ GATE`. KHÔNG tự nạp tất cả file nhân viên cùng lúc.
- **Trưởng Ban (`lead.md`):** Tự chọn 1–2 chuyên viên (`staff.md`), lập danh sách việc chi tiết, kiểm tra cam kết hoàn thành nội bộ trước khi bàn giao qua cổng `⛔ GATE`.
- **Kỷ luật Ngữ cảnh (`Progressive Disclosure`):** Mỗi lượt chỉ nạp tối đa `1 lead.md + 1-2 staff.md` (tổng $\le 200$ dòng/lượt) để giữ sự tập trung tuyệt đối.

---

## Bước 1: Kiểm tra Hợp đồng Đầu vào & Sức khỏe Môi trường (Chuẩn `/kudo`)

1. Nếu người dùng dán khối `<sim-request v="1">...</sim-request>` (tạo từ bàn chọn 1-chạm `studio-request-builder.html`):
   ```bash
   python factory_cli.py check-request --file temp/request.txt
   ```
   - Nếu `ok: false`: Báo lỗi rõ bằng tiếng Việt, không tự đoán mò tham số.
   - Nếu `ok: true`: Dùng JSON `resolved` làm hợp đồng bất biến cho toàn bộ tiến trình.
2. Chạy khám môi trường một lần đầu phiên:
   ```bash
   python factory_cli.py doctor
   ```

---

## Bước 2: Phân tích Yêu cầu (6 Câu Hỏi Định Tuyến)

| # | Câu hỏi | Quyết định điều phối |
|---|---|---|
| 1 | Đầu vào có gì? (Ảnh chụp, video quay thô, tài liệu BA/SOP, kho code, hay ý tưởng?) | Cần `intake/`? |
| 2 | Phần mềm mục tiêu thuộc họ nào? (ERP/CRM, Ngân hàng, Web Portal, SaaS, Mobile, IDE?) | Tra cứu `archive/ui-pattern-catalog.md` |
| 3 | Mục đích sử dụng? (`training` đào tạo, `handover` chuyển giao, `demo` bán hàng, `process-confirm` xác nhận quy trình BA/UAT, hay `mp4-video`?) | Chọn độ sâu kịch bản & giao diện |
| 4 | Đã có mặt phẳng HTML Prototype (`src_sim_surfaces/`) chưa? | Cần `surface/` dựng mới hay chỉ sửa `lessons_data/`? |
| 5 | Kịch bản có dùng ví dụ tình huống cụ thể (hồ sơ, mã đơn, khách hàng) không? | Bắt buộc nạp `storyboard/context-before-example.md` |
| 6 | Là tạo mới hay cập nhật từ băng ghi âm lớp học / phản hồi nghiệm thu UAT? | Nếu từ phản hồi thực tế → gọi `development/` (có Chốt chặn Giảng viên duyệt) |

---

## Bước 3: Lựa Chọn Ban Tham Gia

- 🔴 **Chủ trì** — Ban chịu trách nhiệm chính tạo sản phẩm.
- 🟡 **Phối hợp** — Ban khảo sát đầu vào hoặc cung cấp mẫu giao diện.
- 🟢 **Kiểm duyệt (`review/`)** — **BẮT BUỘC** ở mọi quy trình trước khi bàn giao.

| Loại Đề Bài | 🔴 Chủ trì | 🟡 Phối hợp | 🟢 Kiểm duyệt |
|---|---|---|---|
| Dựng khóa học / quy trình mô phỏng mới từ đầu | `surface/` → `storyboard/` | `intake/` + `archive/` | `review/` |
| Đã có HTML Prototype, thêm/sửa bài học lẻ (`--lesson X`) | `storyboard/` | `archive/` | `review/` |
| Chuyển ảnh chụp / video / repo thành Simulator đơn tệp | `surface/` | `intake/` | `review/` |
| Xác nhận quy trình nghiệp vụ BA/UAT (`As-Is` vs `To-Be`) | `intake/` → `surface/` → `storyboard/` | `archive/` | `review/` |
| Bóc băng lớp học / góp ý UAT → nâng cấp bài học | `development/` → `storyboard/` | `archive/` | `review/` |

---

## Bước 4: Thiết Kế Quy Trình `⛔ GATE` & Bốn Luật Cấm Kinh Điển

Trước khi bắt đầu, Tổng Đạo Diễn **bắt buộc in rõ sơ đồ chuỗi cổng `⛔ GATE`** ra màn hình làm bằng chứng điều phối:
```text
intake/ khảo sát → ⛔ GATE xuất blueprint.json
→ surface/ dựng HTML Prototype → ⛔ GATE kiểm tra DOM & ID điểm neo
→ storyboard/ viết kịch bản 2 chế độ (theory SVG + sim 2 pha) → ⛔ GATE biên dịch HTML试 chạy (HTML-First Preview)
→ review/ kiểm định 4 Tật kinh niên + Playwright BBox → ⛔ GATE [ĐẠT → Xuất bản] [TRƯỢT → Phiếu Từ Chối trả về ban gây lỗi]
```

### Bốn Căn Bệnh Kinh Niên Bắt Buộc Chặn Đứng (Cưỡng chế bởi `review/` & `factory_cli.py audit-pedagogy`):
1. **Tật 1 — Lộ Prompt & Ghi Chú Nội Bộ (`Internal Prompt Leak`):** Cấm để lọt câu lệnh hậu trường, nhãn kỹ thuật đạo diễn (`REDLINE FOCUS`, `FOCUS SHOT 1`, `CẢNH 3/11`, `BÔI ĐEN ĐỂ COPY`, `HTML Vector 100%`) lên giao diện người học.
2. **Tật 2 — Cụt Lủn, Nhảy Cóc Ví Dụ Thiếu Bối Cảnh (`Abrupt Context-Free Example`):** Cấm thả người học vào giữa trận đánh (như nhắc đột ngột *"ngăn wip/ của Khách hàng A07"*, *"hồ sơ B12"*) mà chưa giới thiệu nhân vật/doanh nghiệp đó là ai, đang giải quyết bài toán gì và gặp vướng mắc gì.
3. **Tật 3 — Tả Tọa Độ Cơ Học (`Mechanical Spatial Narration`):** Cấm đọc vẹt vị trí vật lý (*"bên trái là..."*, *"ở góc bên phải..."*, *"thẻ ở giữa..."*) vì Spotlight và Progressive Reveal đã tự chiếu sáng vị trí đó. Lời giảng phải gọi thẳng **tên nghiệp vụ của vùng giao diện** (*"Tại bảng đối chiếu hạn mức..."*, *"Tại cây thư mục hồ sơ..."*).
4. **Tật 4 — Dẫn Dắt Liên Bài Kiểu MC Truyền Hình (`TV-MC Cross-Lesson Bridging`):** Cấm mở đầu/kết thúc kiểu *"Chào mừng anh chị đến với Bài X... Ở bài trước chúng ta đã... Hẹn gặp lại ở bài sau..."*. Mỗi bài học phải là một **viên kim cương tri thức tự bao đóng (`Self-Contained Micro-Learning`)** để tra cứu độc lập bất kỳ lúc nào.

---

## Sơ Đồ Tổ Chức 6 Ban Chuyên Trách

```text
intake/       Ban Khảo Sát     → lead.md chọn: screen-and-video-harvest.md, process-and-repo-harvest.md
surface/      Ban Nguyên Mẫu   → lead.md chọn: html-prototype-builder.md, two-stage-choreography.md
storyboard/   Ban Biên Kịch    → lead.md chọn: context-before-example.md, svg-theory-and-voiceover.md
review/       Ban Kiểm Duyệt   → lead.md chọn: no-prompt-leak.md, context-and-self-contained.md, no-spatial-and-anti-slop.md, spotlight-and-ui-gate.md
archive/      Ban Tư Liệu      → lead.md quản lý: ui-pattern-catalog.md
development/  Ban Phát Triển   → lead.md quản lý: live-feedback-funnel.md
```
