# Ban Dựng Nguyên Mẫu Giao Diện HTML (`surface/`) — Trưởng Ban

**Vai trò:** Xây dựng mặt phẳng nguyên mẫu phần mềm (`src_sim_surfaces/`) và khung trình phát (`src_ui_shell/`), đảm bảo giao diện chạy mượt qua `file://`, không phụ thuộc phần mềm thật và định vị con trỏ chính xác 100%.

## Nhân sự

| Chuyên viên | File | Chức năng | Load khi |
|---|---|---|---|
| KTS Nguyên mẫu HTML | `html-prototype-builder.md` | Dựng `simulator_stage_dom.html` & `simulator_core.css` cho mọi họ phần mềm (ERP, CRM, Banking, Web App, IDE) | Dựng mới hoặc sửa giao diện phần mềm |
| Đạo diễn Vũ đạo 2 Nhịp | `two-stage-choreography.md` | Lập trình `simulator_actions.js` theo Vũ đạo 2 Nhịp (Di chuột bấm → Đổi trạng thái DOM + Spotlight ôm khít) | Viết kịch bản tương tác trên giao diện |

## Cam kết hoàn thành & Cổng bàn giao (`⛔ GATE`)
- [ ] Mọi phần tử mục tiêu đều có `id` duy nhất và kích thước gọn (không trỏ Spotlight vào cả vùng chứa khổng lồ).
- [ ] Không dùng thẻ `<select>` gốc của hệ điều hành; mọi hộp thoại modal đều nằm bên trong `#kudo-stage-viewport`.
- [ ] Đã tách riêng `src_sim_surfaces/` khỏi `src_ui_shell/` theo kiến trúc 4 ngăn.
- **Hành động bàn giao:** Lưu các tệp trong `src_sim_surfaces/`, ghi log `"Surface → Storyboard"` rồi nạp `storyboard/lead.md`.
