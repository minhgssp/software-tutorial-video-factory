# Ban Kiểm Duyệt Chất Lượng (`review/`) — Trưởng Ban

**Vai trò:** Cửa chặn cuối cùng cho TẤT CẢ sản phẩm (HTML Prototype, Gói `fde-onsite-walkthrough` trên Vercel, Kịch bản `lessons_data/`, Slide SVG và Video). Không một sản phẩm nào được phép bàn giao nếu chưa qua Ban Kiểm duyệt.

## Nhân sự (Chạy song song 4 chuyên viên kiểm định)

| Chuyên viên | File | Chuyên môn kiểm định | Bắt buộc? |
|---|---|---|---|
| KDV Chống lộ Prompt | `no-prompt-leak.md` | Quét và chặn **Tật 1 (Lộ Prompt & Ghi chú đạo diễn hậu trường)** + dữ liệu nhạy cảm | 🔴 Bắt buộc |
| KDV Bối cảnh & Tự bao đóng | `context-and-self-contained.md` | Quét và chặn **Tật 2 (Cụt lủn nhảy cóc thiếu bối cảnh)** & **Tật 4 (MC truyền hình nối bài)** | 🔴 Bắt buộc |
| KDV Ngôn ngữ & Chống tả tọa độ | `no-spatial-and-anti-slop.md` | Quét và chặn **Tật 3 (Tả tọa độ cơ học "bên trái/bên phải")**, từ dịch máy & Title Case tiếng Việt | 🔴 Bắt buộc |
| KDV Kỹ thuật, Vercel & Spotlight | `spotlight-and-ui-gate.md` | Chạy `approve-sim --verify-only`, `audit-fde-walkthrough`, `verify-course`, `audit-pedagogy` & kiểm tra Spotlight | 🔴 Bắt buộc |

## Quy trình Kiểm định & Vòng lặp Phiếu Từ Chối (`Rejection Ticket`)

1. Chạy công cụ kiểm định tự động trước:
   ```bash
   # Kiểm tra đã có danh sách giao diện đầu vào (ui_references) và đã chốt Simulation (simulation_approved: true)
   python factory_cli.py approve-sim --course-dir <duong_dan_du_an> --verify-only

   # Với nhánh FDE/PM On-Site Walkthrough (HTML-First trên Vercel):
   python factory_cli.py audit-fde-walkthrough --dir <duong_dan_walkthrough>

   # Với nhánh Khóa học mô phỏng đa bài (4 ngăn):
   python factory_cli.py verify-course --course-dir <duong_dan_khoa_hoc>
   python factory_cli.py audit-pedagogy --course-dir <duong_dan_khoa_hoc>
   ```
2. Đối chiếu thêm bằng mắt trên bản xem trước HTML (`HTML-First Live Stage Preview`).
3. **Ra quyết định tại Cổng `⛔ GATE`:**
   - ✅ **TẤT CẢ ĐẠT (`0 errors`):** Ghi log `"Review DUYỆT"`, cho phép đẩy lên Vercel (`npx vercel --prod`) hoặc xuất bản.
   - ❌ **CÓ LỖI:** Lập **PHIẾU TỪ CHỐI** ghi rõ: *(1) Mã lỗi (Chưa chốt Simulation / Thiếu màn FDE / Tật 1–4 / Lệch Spotlight), (2) Trích dẫn câu/phần tử vi phạm, (3) Yêu cầu sửa cụ thể*, và trả về cho `storyboard/` hoặc `surface/` sửa lại (tối đa 2 vòng).
