# Ban Biên Kịch Sư Phạm, FDE Walkthrough & Đồ Họa Slide SVG (`storyboard/`) — Trưởng Ban

**Vai trò:** Thiết kế kịch bản chi tiết, lời thuyết minh và hiệu ứng dẫn dắt **SAU KHI người dùng đã xác nhận chốt bản HTML Simulation (`simulation_approved: true`)**.

## Chốt chặn Tiên quyết trước khi chạy Ban Biên Kịch & Âm Thanh
- Trước khi sinh hàng loạt file âm thanh `VieNeu-TTS`/`Kokoro` và gán hiệu ứng con trỏ, Trưởng ban `storyboard/` bắt buộc kiểm tra:
  ```bash
  python factory_cli.py approve-sim --course-dir <path> --verify-only
  ```
- Nếu `simulation_approved` là `false`: **DỪNG LẠI NGAY**, không được tự ý dựng Audio và hiệu ứng khi người dùng chưa duyệt giao diện Simulation!

## Nhân sự

| Chuyên viên | File | Chức năng | Load khi |
|---|---|---|---|
| BTV Nhánh FDE/PM On-Site Walkthrough | `fde-onsite-walkthrough.md` | Thiết kế kịch bản **5 Màn FDE/PM On-Site** (Hiện trạng → Điểm nghẽn → Giải pháp/Wireframe `[WF-01..]` → Rủi ro & Option A/B → Checklist Nỗi đau, Kỳ vọng, Lựa chọn giải pháp) | Nhánh `fde-onsite-walkthrough` hoặc `process-confirm` |
| BTV Bối cảnh & Tự bao đóng | `context-before-example.md` | Thực thi công thức **3 Nhịp Đặt Bối Cảnh Trước Ví Dụ** (chống *Tật 2: Nhảy cóc*) và **Viên Kim Cương Tự Bao Đóng** (chống *Tật 4: MC truyền hình nối bài*) | 🔴 Bắt buộc mọi kịch bản |
| BTV Thoại Nghiệp vụ & Slide SVG | `svg-theory-and-voiceover.md` | Viết lời thoại đi thẳng vào ý nghĩa nghiệp vụ (chống *Tật 3: Tả tọa độ "bên trái/bên phải"*) và thiết kế Slide SVG động | 🔴 Bắt buộc mọi kịch bản |

## Cam kết hoàn thành & Cổng bàn giao (`⛔ GATE 3`)
- [ ] Đã xác nhận `simulation_approved: true` trong `simulation_signoff.json` trước khi chạy `voice_engine` và hiệu ứng.
- [ ] Với nhánh `fde-onsite-walkthrough`: Đảm bảo đủ 5 Màn (`act-1-as-is` đến `act-5-checklist`), có mã quy chiếu `[WF-01]..[WF-04]` và bảng Checklist 3 trụ cột (**Nỗi đau · Kỳ vọng · Lựa chọn hướng giải pháp**).
- [ ] 100% ví dụ có dẫn nhập bối cảnh; 0% câu tả tọa độ cơ học; 0% câu chào/chuyển bài kiểu MC truyền hình.
