# Ban Dựng Nguyên Mẫu Giao Diện HTML (`surface/`) — Trưởng Ban

**Vai trò:** Xây dựng mặt phẳng nguyên mẫu phần mềm (`src_sim_surfaces/` hoặc 5 Màn FDE Walkthrough) kèm cấu hình đẩy lên **Vercel (`vercel.json`)**, sau đó **DỪNG LẠI TẠI ⛔ CỔNG 2 (`User Simulation Sign-Off Gate`)** để chốt giao diện với người dùng trước khi làm Audio và Hiệu ứng.

## Nhân sự

| Chuyên viên | File | Chức năng | Load khi |
|---|---|---|---|
| KTS Nguyên mẫu HTML | `html-prototype-builder.md` | Dựng `simulator_stage_dom.html` & `simulator_core.css` từ ảnh/mô tả của người dùng, gắn mã quy chiếu `[WF-01]..[WF-06]` | Dựng mới hoặc sửa giao diện phần mềm |
| KTS Đóng gói HTML-First & Vercel | `vercel-html-deploy.md` | Đóng gói ứng dụng HTML tĩnh ưu tiên đẩy thẳng lên **Vercel** (`vercel.json`), chỉ xuất `.mp4` khi có yêu cầu rõ ràng | Mọi dự án `html-vercel-first` & `fde-onsite-walkthrough` |
| Đạo diễn Vũ đạo 2 Nhịp | `two-stage-choreography.md` | Lập trình `simulator_actions.js` theo Vũ đạo 2 Nhịp (Chỉ kích hoạt ở Pha 2 sau khi người dùng đã chốt Simulation) | Pha 2: Sau khi `simulation_approved: true` |

## Cam kết hoàn thành & Cổng Chốt Simulation Với Người Dùng (`⛔ GATE 2`)
- [ ] Giao diện HTML Simulation phản ánh trung thực ảnh demo / mô tả của người dùng (`ui_references`), mọi vùng tương tác có `id` duy nhất và mã quy chiếu `[WF-01]..[WF-05]`.
- [ ] Đã tạo sẵn `vercel.json` để có thể đẩy bản nháp lên Vercel hoặc mở trực tiếp trên trình duyệt cho người dùng xem thử.
- [ ] **⛔ CHỐT CHẶN BẮT BUỘC (`STOP FOR USER APPROVAL`):** Khi `simulation_approved` đang là `false`, Trưởng ban `surface/` **bắt buộc dừng lại**, gửi đường dẫn bản HTML Simulation cho người dùng kiểm tra và hỏi: *"Anh/chị vui lòng xem bản giao diện mô phỏng HTML này đã đúng bố cục và luồng nghiệp vụ chưa? Sau khi anh/chị xác nhận chốt Simulation, hệ thống mới đi tiếp dựng Audio thuyết minh và hiệu ứng con trỏ."*
- **Hành động bàn giao sang Pha 2:** Chỉ khi người dùng xác nhận chốt (chạy `python factory_cli.py approve-sim --course-dir <path>`), mới ghi log `"Surface (Approved) → Storyboard"` và nạp `storyboard/lead.md`.
