---
name: software-simulation-video-factory
version: "3.3.0"
description: Xưởng Phim Mô Phỏng Phần Mềm Đa Năng, Nhánh FDE/PM On-Site Client Walkthrough (HTML-First trên Vercel khóa mã hóa AES-256-GCM bằng mật khẩu .env không load sớm) & Giáo Án Tương Tác Video-in-HTML / MP4 16:9. Luôn yêu cầu người dùng cung cấp giao diện/mô tả/ảnh demo và chốt bản HTML Simulation với người dùng trước khi dựng Audio thuyết minh và hiệu ứng con trỏ.
---

# Universal Software Simulation & FDE Walkthrough Factory (`v3.3` — Tổng Đạo Diễn)

Nhận đề bài (`<sim-request>`) → **⛔ Cổng 1: Thu thập Ảnh/Mô tả Giao diện (`ui_references`)** → Dựng bản nháp HTML Simulation → **⛔ Cổng 2: Chốt Simulation với Người dùng (`simulation_approved: true`)** → Dựng Audio thuyết minh (`VieNeu-TTS` / `Kokoro`) & hiệu ứng con trỏ 2 nhịp → **⛔ Cổng 3: Khóa mã hóa `AES-256-GCM` bằng mật khẩu `.env` (`WALKTHROUGH_PASSWORD`, chỉ tải trang khi nhập đúng mật khẩu, không load sớm)** → Đẩy lên **Vercel** (chỉ xuất `.mp4` khi được yêu cầu).

---

## ⛔ BA QUY TẮC BẤT BIẾN (SIMULATION-FIRST GATE & VERCEL ZERO-PRELOAD CRYPTO VAULT)

1. **⛔ CỔNG 1 — Luôn Yêu Cầu Giao Diện Mẫu, Ảnh Demo & Mô Tả Đầu Vào (`ui_references`):**
   - Trước khi viết bất kỳ dòng code nào, kiểm tra xem người dùng đã cung cấp **giao diện mẫu, ảnh chụp màn hình, ảnh demo, bản phác thảo wireframe hoặc mô tả chi tiết các vùng màn hình** chưa.
   - Nếu chưa có: **BẮT BUỘC DỪNG LẠI** và yêu cầu người dùng cung cấp chất liệu giao diện/mô tả trước. Tuyệt đối không tự ý bịa ra màn hình phần mềm trong chân không.
2. **⛔ CỔNG 2 — Chốt Bản HTML Simulation Với Người Dùng Trước Khi Dựng Audio & Hiệu Ứng (`simulation_approved`):**
   - **Pha 1 (`simulation_approved: false`):** Chỉ dựng mặt phẳng nguyên mẫu **HTML Simulation** (`src_sim_surfaces/` hoặc 5 Màn FDE Walkthrough) với dữ liệu mẫu và mã đánh số `[WF-01]..[WF-05]`, sau đó **DỪNG LẠI BẮT BUỘC** để người dùng mở xem trên trình duyệt và xác nhận.
   - **Pha 2 (`simulation_approved: true`):** Chỉ sau khi người dùng xác nhận chốt Simulation (`python factory_cli.py approve-sim --course-dir <path>`), hệ thống mới được phép gọi `voice_engine` sinh Audio thuyết minh và lập trình hiệu ứng con trỏ + Spotlight.
3. **⛔ CỔNG 3 — Bảo Mật Vercel Bằng Mật Khẩu `.env` & Mã Hóa `AES-256-GCM` Không Tải Sớm (`Zero Pre-Auth Load`):**
   - Vì đường link trên Vercel có thể bị truy cập công khai, mọi gói HTML đẩy lên Vercel **bắt buộc** chạy lệnh `python factory_cli.py encrypt-walkthrough --dir <path>` để mã hóa toàn bộ giao diện & kịch bản bằng mật khẩu cố định trong biến `.env` (`WALKTHROUGH_PASSWORD`).
   - Tệp `index.html` khi mở lên **chỉ hiển thị cổng nhập mật khẩu (`#security-vault-gate`)**, không tải trước bất kỳ thẻ DOM, wireframe hay số liệu nào của khách hàng. Chỉ khi người xem nhập đúng mật khẩu, trình duyệt mới giải mã `AES-256-GCM` và nạp ứng dụng.

---

## Bước 1: Kiểm Tra Hợp Đồng `<sim-request>` & Khám Môi Trường (`doctor`)

1. Kiểm tra khối `<sim-request v="1">` (tạo từ `studio-request-builder.html`):
   ```bash
   python factory_cli.py check-request --file temp/request.txt
   ```
2. Khám môi trường đầu phiên:
   ```bash
   python factory_cli.py doctor
   ```

---

## Bước 2: Phân Tích Yêu Cầu & Chọn Nhánh Sản Phẩm (`use_case`)

| Nhánh sản phẩm (`use_case`) | Ưu tiên xuất bản & Bảo mật (`delivery_mode`) | Cấu trúc cốt lõi |
|---|---|---|
| **`fde-onsite-walkthrough`** *(Chủ lực cho FDE/PM On-Site)* | **HTML-First đẩy lên Vercel + Khóa mã hóa `AES-256-GCM` bằng mật khẩu `.env`** (chỉ xuất `.mp4` khi được yêu cầu) | **5 Màn (5-Act Client Walkthrough):**<br>1. Hiện trạng của Client (`As-Is`)<br>2. Chỉ rõ Điểm nghẽn (`Bottleneck`)<br>3. Walkthrough Giải pháp / Wireframe đánh số `[WF-01..]`<br>4. Rủi ro & Phương án A/B cần Client xác nhận<br>5. Checklist tổng kết: **Nỗi đau · Kỳ vọng · Lựa chọn hướng giải pháp** |
| **`process-confirm`** | HTML-First trên Vercel (Khóa `.env`) / Local | Đối chiếu quy trình `As-Is` vs `To-Be` & xác nhận UAT trước lập trình |
| **`training-course`** | Cổng HTML tương tác 4 ngăn / Vercel | Khóa học đa chương bài kết hợp Slide SVG động (`theory`) & Thao tác (`sim`) |
| **`system-handover` / `product-demo`** | HTML-First trên Vercel / Local | Cẩm nang vận hành SOP hoặc Demo bán hàng tự chạy |
| **`mp4-video`** | Xuất bản kèm tệp `.mp4` 16:9 / 9:16 | Khi người dùng yêu cầu rõ việc xuất file video `.mp4` |

---

## Bước 3: Thiết Kế Chuỗi Cổng `⛔ GATE` & Bốn Luật Cấm Kinh Điển

Tổng Đạo Diễn **bắt buộc in rõ sơ đồ chuỗi cổng `⛔ GATE`** ra màn hình:
```text
⛔ GATE 1: Yêu cầu người dùng cung cấp Giao diện / Mô tả / Ảnh Demo (ui_references) → intake/ xuất blueprint.json
→ surface/ dựng HTML Simulation Prototype (walkthrough_source.html + vercel.json)
→ ⛔ GATE 2 (HUMAN GATE): Trình người dùng duyệt và CHỐT HTML Simulation (simulation_approved: true)
→ storyboard/ + voice_engine dựng Audio thuyết minh & Hiệu ứng con trỏ 2 nhịp + Spotlight
→ ⛔ GATE 3 (CRYPTO VAULT): Chạy encrypt-walkthrough khóa mã hóa AES-256-GCM từ biến .env WALKTHROUGH_PASSWORD (Không load sớm)
→ ⛔ GATE 4: review/ chạy audit-fde-walkthrough & audit-pedagogy (chặn 4 Tật kinh niên) → Đẩy lên Vercel
```

### Bốn Căn Bệnh Kinh Niên Bắt Buộc Chặn Đứng (`factory_cli.py audit-pedagogy`):
1. **Tật 1 — Lộ Prompt Nội Bộ:** Cấm để lọt nhãn đạo diễn hậu trường (`REDLINE FOCUS`, `FOCUS SHOT 1`, `BÔI ĐEN ĐỂ COPY`) lên màn hình.
2. **Tật 2 — Nhảy Cóc Ví Dụ Thiếu Bối Cảnh:** Cấm nhắc đột ngột mã hồ sơ/khách hàng (*"ngăn wip/ của Khách hàng A07"*) khi chưa dẫn nhập bối cảnh doanh nghiệp đó là ai, đang làm gì.
3. **Tật 3 — Tả Tọa Độ Cơ Học:** Cấm đọc vẹt *"bên trái là..."*, *"nhìn sang bên phải..."*; phải gọi thẳng **tên nghiệp vụ của vùng giao diện** vì Spotlight đã tự chiếu sáng vị trí.
4. **Tật 4 — Dẫn Dắt Liên Bài Kiểu MC Truyền Hình:** Cấm mở đầu/kết thúc kiểu *"Chào mừng đến với Bài X... Ở bài trước... Hẹn gặp lại ở bài sau..."*. Mỗi bài là một viên kim cương tự bao đóng.

---

## Sơ Đồ Tổ Chức 6 Ban Chuyên Trách

```text
intake/       Ban Khảo Sát     → lead.md chọn: screen-and-video-harvest.md, process-and-repo-harvest.md
surface/      Ban Nguyên Mẫu   → lead.md chọn: html-prototype-builder.md, two-stage-choreography.md, vercel-html-deploy.md
storyboard/   Ban Biên Kịch    → lead.md chọn: context-before-example.md, svg-theory-and-voiceover.md, fde-onsite-walkthrough.md
review/       Ban Kiểm Duyệt   → lead.md chọn: no-prompt-leak.md, context-and-self-contained.md, no-spatial-and-anti-slop.md, spotlight-and-ui-gate.md
archive/      Ban Tư Liệu      → lead.md quản lý: ui-pattern-catalog.md
development/  Ban Phát Triển   → lead.md quản lý: live-feedback-funnel.md
```
