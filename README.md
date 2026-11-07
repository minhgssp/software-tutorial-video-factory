# Universal Software Simulation & FDE Client Walkthrough Factory (`v3.2`)

> **Bộ Kỹ Năng Tiêu Chuẩn (`.agents/skills/` & `.claude/skills/`) & Động Cơ Dựng Nguyên Mẫu Phần Mềm HTML (`HTML Prototype`) Kết Hợp Nhánh `FDE / PM On-Site Client Walkthrough` (HTML-First Đẩy Lên Vercel), Slide Diễn Giải SVG Động, Con Trỏ Thông Minh (`Smart Cursor & Bounding-Box Spotlight`) và Thuyết Minh Âm Thanh (`VieNeu-TTS` / `Kokoro` / `Web Speech`).**

---

## ⛔ QUY TẮC BẮT BUỘC HAI PHA (SIMULATION-FIRST HUMAN GATE)

Giống như người kiến trúc sư xây nhà: phải yêu cầu chủ nhà đưa bản chụp mảnh đất và nhu cầu sinh hoạt trước (**Cổng 1**), sau đó dựng sa bàn để chủ nhà ngắm và gật đầu chốt vị trí từng phòng (**Cổng 2**), rồi mới lắp hệ thống điện nước và sơn hoàn thiện (**Pha Audio & Hiệu ứng**).

Kho mã nguồn và bộ kỹ năng này **luôn cưỡng chế quy trình 2 Pha** qua `factory_cli.py check-request` và `approve-sim`:
1. **⛔ CỔNG 1 — Yêu Cầu Giao Diện Mẫu, Mô Tả & Ảnh Demo Đầu Vào (`ui_references`):**
   - Người dùng **bắt buộc cung cấp các giao diện, mô tả màn hình, ảnh demo hoặc bản phác thảo wireframe** trước. Nếu thiếu `ui_references`, hệ thống dừng lại ngay để yêu cầu tư liệu chứ tuyệt đối không tự bịa màn hình phần mềm trong chân không.
2. **⛔ CỔNG 2 — Chốt Bản HTML Simulation Với Người Dùng Trước Khi Dựng Audio & Hiệu Ứng (`simulation_approved`):**
   - **Pha 1 (`simulation_approved: false`):** Hệ thống chỉ dựng mặt phẳng **HTML Simulation Prototype** (kèm dữ liệu mẫu và mã đánh số `[WF-01]..[WF-05]`) và **DỪNG LẠI** để người dùng xem, chỉnh sửa và chốt giao diện.
   - **Pha 2 (`simulation_approved: true`):** Chỉ sau khi người dùng xác nhận chốt Simulation (`python factory_cli.py approve-sim --course-dir <path>`), hệ thống mới đi tiếp tổng hợp giọng đọc (`VieNeu-TTS` / `Kokoro`), căn chỉnh từ (`Faster-Whisper`) và lập trình hiệu ứng con trỏ 2 nhịp + Spotlight.

---

## 1. Bản Chất Cốt Lõi & 6 Nhánh Ứng Dụng Thực Tế

Kho mã nguồn cung cấp dây chuyền tổng quát (Domain-Agnostic) để mô phỏng **bất kỳ phần mềm nào** (Web App, SaaS, CRM, ERP, Core Banking, Cổng nội bộ, Mobile App hay Desktop IDE):

### 🌟 Nhánh Chủ Lực Mới (`v3.2`): `fde-onsite-walkthrough` — FDE / PM On-Site Client Pain & Solution Walkthrough
- **Ưu tiên số 1: Xuất bản HTML tương tác và đẩy thẳng lên Vercel (`delivery_mode: html-vercel-first`)**, chỉ xuất file `.mp4` khi được yêu cầu rõ ràng.
- **Mục tiêu:** Giúp các **Forward-Deployed Engineer (FDE)**, **Product Manager (PM)**, **BrSE** và **BA** khi làm việc on-site giải quyết bài toán cùng khách hàng có thể gửi ngay đường link Vercel (hoặc trình chiếu trực tiếp) đi qua **5 Màn chuẩn mực**:
  1. **Màn 1 — Hiện trạng của Client (`act-1-as-is`):** Trình bày lại quy trình hiện tại của khách hàng theo 3 chặng *Trước - Trong - Sau phần mềm* (`As-Is SIPOC`) kèm số giờ công hao phí để khách hàng xác nhận đội dự án đã hiểu đúng nỗi đau.
  2. **Màn 2 — Chỉ rõ Điểm nghẽn (`act-2-bottleneck`):** Khoanh vùng điểm nghẽn cốt lõi và chuyển hóa các quy tắc phán đoán nằm ngầm trong kinh nghiệm cá nhân thành **Bảng quy tắc quyết định (`Decision Table`)**.
  3. **Màn 3 — Walkthrough Giải pháp / Wireframe (`act-3-wireframe`):** Trình diễn nguyên mẫu HTML tương tác có gắn các mã số quy chiếu **`[WF-01]`**, **`[WF-02]`**, **`[WF-03]`**, **`[WF-04]`** khớp 1-1 với bảng quy tắc để khách hàng dễ dàng chỉ điểm xác nhận.
  4. **Màn 4 — Rủi ro & Phương án A/B cần Khách hàng Xác nhận (`act-4-risks-options`):** Chỉ rõ các trường hợp ngoại lệ biên (`Assumption Mapping`) và đặt lên bàn **Phương án A (Tinh gọn / Giai đoạn 1)** vs **Phương án B (Toàn diện / Giai đoạn 2)** để khách hàng lựa chọn.
  5. **Màn 5 — Danh mục Checklist Tổng kết Ngắn gọn (`act-5-checklist`):** Tổng kết toàn bộ buổi làm việc bằng một danh mục Checklist tương tác gồm đúng **3 trụ cột**:
     - **(1) Nỗi đau (`Confirmed Pain Points`)**
     - **(2) Kỳ vọng (`Expected Outcomes & SLA`)**
     - **(3) Lựa chọn hướng giải pháp (`Selected Solution Option & Scope Lock`)**

### 5 Nhánh Ứng Dụng Khác:
- **`process-confirm`:** Xác nhận quy trình nghiệp vụ BA / UAT trước lập trình (`As-Is` vs `To-Be`).
- **`training-course`:** Khóa học & Đào tạo nhân sự trực tuyến đa chương/bài (`Interactive E-Learning`).
- **`system-handover`:** Chuyển giao hệ thống & Cẩm nang vận hành (`SOP Walkthrough`).
- **`product-demo`:** Demo sản phẩm & Bán hàng (`Interactive Presales Demo`).
- **`mp4-video`:** Xuất bản Video `.mp4` 16:9 / 9:16 thuyết minh tự động (chỉ khi người dùng yêu cầu xuất MP4).

---

## 2. Cấu Trúc Kho Mã Nguồn & Bộ Kỹ Năng Tòa Soạn 6 Ban

Kho mã nguồn được đóng gói chuẩn **Agent Skill Pack** (nhận diện tự động bởi **Claude Code**, **Antigravity**, **Cursor**, **Codex**) và **không chứa các thư viện/trọng số nặng**:

```text
software-tutorial-video-factory/
├── .agents/skills/ & .claude/skills/          # Bộ 13 Kỹ năng AI Agent đóng gói chuẩn
│   ├── software-simulation-video-factory/     # [Kỹ năng chính v3.2] Tòa soạn 6 Ban + Cổng Chốt Simulation 2 Pha
│   │   ├── SKILL.md                           # Tổng Đạo Diễn (<= 200 dòng)
│   │   ├── intake/                            # Ban Khảo Sát (⛔ Cổng 1: Bắt buộc thu thập ui_references)
│   │   ├── surface/                           # Ban Nguyên Mẫu (⛔ Cổng 2: Chốt HTML Sim + vercel-html-deploy.md)
│   │   ├── storyboard/                        # Ban Biên Kịch (fde-onsite-walkthrough.md + Bối cảnh + Slide SVG)
│   │   ├── review/                            # Ban Kiểm Duyệt (Chặn 4 Tật kinh niên + Kiểm định FDE 5 Màn)
│   │   ├── archive/                           # Ban Tư Liệu (Kho mẫu giao diện PAT-01..PAT-05)
│   │   └── development/                       # Ban Phát Triển (Phễu phản hồi có Cổng Giảng viên duyệt)
│   ├── vieneu-tts-voice/                      # Kỹ năng cài đặt & tổng hợp giọng đọc VieNeu-TTS 48kHz
│   ├── kudo/ & kudo-*/                        # Bộ kỹ năng xưởng video đồ họa & screencast Kudo
│   └── reelcrew/ & reelcrew-*/                # Bộ kỹ năng đạo diễn & hậu kỳ video bằng lệnh CLI
├── core_engine/                               # Động cơ biên dịch & kiểm định lõi (Python + JS)
│   ├── pedagogy_and_request_gate.py           # [v3.2] Cổng <sim-request>, Chốt Sim 2 Pha, Kiểm định 5 Màn FDE & 4 Tật
│   ├── course_compiler.py                     # Bộ biên dịch 4 ngăn & cổng kiểm định khóa học
│   ├── intake_extractor.py                    # Bộ quét kho mã nguồn / ảnh chụp -> blueprint.json
│   ├── scene_builder.py                       # Bộ dựng khung HTML Simulator tự động
│   ├── syncgate_and_foley.py                  # Cổng đồng bộ âm thanh & tiếng động Foley 48kHz
│   ├── voice_engine/                          # Trình điều khiển VieNeu-TTS, Kokoro & căn mốc từ ASR
│   ├── rubric_engine/                         # Bộ chấm điểm định lượng chất lượng chuyển động
│   └── kcast_engine/                          # Động cơ quay màn hình Playwright -> MP4 16:9
├── examples/                                  # Các dự án mẫu đa lĩnh vực (Sẵn sàng đẩy lên Vercel)
│   ├── fde_onsite_client_walkthrough_demo/    # [Mẫu 1 - Mới] FDE/PM On-Site Walkthrough 5 Màn + Checklist + vercel.json
│   ├── saas_workflow_process_demo/            # [Mẫu 2] Mô phỏng Phần mềm ERP/CRM (Xác nhận quy trình & Đào tạo)
│   ├── ui_learning_portal_demo/               # [Mẫu 3] Cổng Học tập Tương tác UI v3.1 (Master-Detail + Tree Sidebar)
│   ├── antigravity_studio_simulator/          # [Mẫu 4] Khóa học 24 Bài giả lập phần mềm Desktop IDE
│   └── enterprise_16x9_course/                # [Mẫu 5] Đặc tả xuất bản Video bài giảng 16:9
├── studio-request-builder.html                # Bàn chọn 1-chạm sinh hợp đồng <sim-request v="1" factory=">=3.2.0">
├── vercel.json                                # Cấu hình triển khai HTML-First lên Vercel bằng 1 câu lệnh
└── factory_cli.py                             # Giao diện dòng lệnh trung tâm v3.2
```

---

## 3. Hướng Dẫn Cài Đặt & Sử Dụng Nhanh (Chi Tiết Tại [`docs/INSTALLATION_AND_VIENEU_SETUP.md`](docs/INSTALLATION_AND_VIENEU_SETUP.md))

```bash
git clone https://github.com/minhgssp/software-tutorial-video-factory.git
cd software-tutorial-video-factory

# 1. Cài đặt thư viện kiểm thử nhẹ:
pip install pytest pyyaml pillow playwright
python -m playwright install chromium

# 2. Khám sức khỏe môi trường & chạy bộ kiểm thử tự động:
python factory_cli.py doctor
pytest -p no:asyncio -q

# 3. Mã hóa bảo mật bằng mật khẩu .env (AES-256-GCM, không load sớm) & Kiểm tra gói FDE On-Site Walkthrough:
python factory_cli.py encrypt-walkthrough --dir examples/fde_onsite_client_walkthrough_demo
python factory_cli.py audit-fde-walkthrough --dir examples/fde_onsite_client_walkthrough_demo
npx vercel examples/fde_onsite_client_walkthrough_demo --prod

# 4. Xác nhận chốt HTML Simulation (Mở khóa Pha 2: Dựng Audio & Hiệu ứng):
python factory_cli.py approve-sim --course-dir examples/fde_onsite_client_walkthrough_demo --ui-refs "input/as_is.png,input/wireframe.png"
```
