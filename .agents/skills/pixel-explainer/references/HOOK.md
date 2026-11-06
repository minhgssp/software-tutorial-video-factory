# HOOK: 2 giây đầu (áp cho mọi style Kudo)

Người lướt quyết định ở lại hay đi trong khoảng 1–2 giây. Khung đầu tiên không được là nền trống chờ chữ hiện.

## Luật cứng (máy kiểm)

| Cổng | Ngưỡng | Ai kiểm |
|---|---|---|
| Có hình ngay khung đầu | cảnh 1 có `sprite`/`photo`/`headline` với `at ≤ 0,15 s` | `validate.py` (LỖI) |
| Có cú "nổ" mở màn | `punch`/`flash`/`shake` của cảnh 1, hoặc item `burst`/`ring`/`stamp`/`pop` với `at ≤ 0,6 s` | `validate.py` (LỖI) |
| Ảnh hook đủ to | `photo` ở hook chiếm ≥ 6% khung | `validate.py` (CẢNH BÁO) |
| Hình không thưa trong 0,4–2 s | độ phủ pixel không dưới ngưỡng quá 0,25 s | `qa.py` (LỖI "hook mở đầu thưa") |
| Âm thanh mở cùng hình | `bgm.py` tự đặt kick + crash + hợp âm ở 0 s; `mix.py` để nhạc to hơn trước khi giọng vào | `bgm.py` / `mix.py` |

## Năm kiểu hook hình (chọn một, theo nghĩa câu đầu)

1. **Vật đối lập**: hai vật trái nghĩa bật cùng lúc (ChatGPT ↔ Agent, nói thầm ↔ nói to). Hợp câu mở "X không phải Y".
2. **Ảnh thật + con số**: ảnh tác giả/nguồn chiếm lớn khung, số then chốt đóng dấu lên (vd "×10"). Hợp tóm tắt bài viral, nghiên cứu.
3. **Kết quả trước**: cho thấy cảnh cuối (video xong, cơ thể bình tĩnh) rồi tua về. Hợp hướng dẫn.
4. **Câu hỏi treo**: tiêu đề chữ to nhấn một từ + nhân vật Kudo ngó vào, dấu "?" nhấp nháy. Hợp khi lời mở bằng câu hỏi.
5. **Sai lầm quen thuộc**: vật người xem đang dùng bị gạch/vỡ ngay 0,3 s. Hợp lời mở bằng "bạn đang làm sai…".

## Cách dựng trong `direction.py`

- Cảnh 1 bắt đầu từ `0`, `punch=0.0` hoặc `flash=0.0`, vật chính `at=0`, `reveal="pop"` hoặc `"none"`.
- Giọng vào ở `offset` (0,5 s): nửa giây đầu là hình + nhạc hit, không chờ giọng.
- Thêm một chuyển động nhỏ trong 0,6–2 s (`Bu`, `Ri`, `move`, layer) để khung không đứng yên khi người xem đang quyết định.
- Ở style khác (vector, lyric, Remotion): cùng ba nguyên tắc — có vật chính ở khung 0, có cú nổ ≤ 0,6 s, có chuyển động trong 2 s đầu.
