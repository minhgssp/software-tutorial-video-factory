# Ban Khảo Sát Nghiệp Vụ & Màn Hình (`intake/`) — Trưởng Ban

**Vai trò:** Thu thập và chuẩn hóa đầu vào (ảnh chụp màn hình, video quay thao tác, tài liệu quy trình BA/SOP/UAT, hoặc kho mã nguồn) thành bản thiết kế cấu trúc (`blueprint.json`) trước khi dựng giao diện HTML.

## Nhân sự

| Chuyên viên | File | Chức năng | Load khi |
|---|---|---|---|
| KSV Màn hình & Video | `screen-and-video-harvest.md` | Bóc tách ảnh chụp / video quay thô thành danh sách khu vực UI, nút bấm và dữ liệu mẫu (đã lọc sạch thông tin nhạy cảm) | Có ảnh screenshot hoặc video |
| KSV Quy trình & Mã nguồn | `process-and-repo-harvest.md` | Phân tích tài liệu quy trình nghiệp vụ (`As-Is` / `To-Be`) hoặc quét cây mã nguồn (`intake-repo`) | Có tài liệu BA/SOP hoặc Code Repo |

## Cam kết hoàn thành & Cổng bàn giao (`⛔ GATE`)
- [ ] Đã xác định rõ họ phần mềm (ERP, CRM, Ngân hàng, Web Portal, IDE) và danh sách các phần tử DOM cần gắn `id` điểm neo.
- [ ] Đã lọc bỏ 100% tên khách hàng thật, số tài khoản, mã QR hoặc dữ liệu nội bộ nhạy cảm khỏi dữ liệu mẫu.
- **Hành động bàn giao:** Xuất tệp `temp/blueprint.json` (hoặc bản mô tả cấu trúc màn hình), ghi log `"Intake → Surface"` rồi mới nạp `surface/lead.md`.
