---
name: kudo-math-explainer
description: Use when Kudo cần một clip dọc 9:16 giải thích toán, vật lý, hoá hay công thức (kiểu 3Blue1Brown) - đồ thị hàm số, biến đổi công thức từng bước, vectơ lực và vận tốc, chuyển động, quỹ đạo, số thập phân kiểu Việt Nam trong LaTeX, hoặc khi dựng scene manimgx trong kudo-kit, ghép nhạc nền cho clip đó, hay chấm rubric và sửa clip toán theo giám khảo.
---

# Kudo — clip giải thích toán, vật lý, công thức

Engine: `kudo-kit/engines/manimgx/` (manimgx, API giống Manim CE). Scene import `kudo_theme` (màu nhà, khung 1080x1920, vùng an toàn, chữ) và `kudo_math` (công thức, biến đổi, trục, vectơ). Định tuyến thể loại: `docs/DINH-TUYEN-THE-LOAI.md`.

## Tra nhanh

| Cần | Dùng |
|---|---|
| Công thức | `formula(r"v = 9.8 t", color=...)`: viết số thập phân bằng **dấu chấm**, hàm tự đổi sang "9,8" sát, tự co vừa vùng an toàn, chặn cỡ dưới 20 |
| Số in từ biến | `vn(37.78, 1)` → `37,8`; `vn(12000)` → `12.000` |
| Biến đổi từng bước | `derive(self, [formula(...), ...], at=[x, y, 0])`: mặc định khớp hình ký hiệu, hợp phân số |
| Nhấn kết quả | `self.play(m.Create(highlight(mob)))` |
| Trục toạ độ | `ax, labels = axes([0, 10, 2], [0, 4, 1], height=3.8, center_y=1.4, x_label="thời gian (s)")` |
| Vectơ lực, vận tốc | `vector(p0, p1, color=..., label=r"\vec F")`; mũi tên đẩy vào vật thì `label_at="mid"`; chạy theo vật thì bọc `m.always_redraw` |
| Chữ tiếng Việt | `text(...)`, `caption(...)`; nhãn trục là chữ, không phải TeX |
| Căn giữa | `SAFE_CENTER_X`: vùng an toàn lệch trái (x −3,33..3,04), căn ở x = 0 sẽ trượt |
| Kiểm vị trí | `assert_in_safe_zone(*mobs)` ngay sau khi đặt; vật chuyển động thì `render.py` kiểm điểm ảnh từng khung lấy mẫu |

Ví dụ đầy đủ (vật lý, cú nhấn, công thức xếp dòng): `engines/manimgx/scenes/nem_xien.py` bản 4, người dùng duyệt 16/10/2026 (kèm rủi ro ghi ở mục cuối). Đồ thị tăng trưởng: `scenes/mot_phan_tram.py`.

## Quy trình

1. Viết scene vào `engines/manimgx/scenes/<ten>.py`, mở đầu `setup()`, trong `construct` gọi `apply(self)`.
2. Chạy `inspect` trước để sửa bố cục nhanh (vài giây, không render):
   `cd engines/manimgx/scenes && PYTHONPATH=.. <venv>/bin/manimgx inspect <ten>.py -o /tmp/board.png`
   Đọc ảnh storyboard; mọi dòng `layout: N problems` phải về 0.
3. Render qua cổng, từ gốc repo:
   `python3 engines/manimgx/render.py engines/manimgx/scenes/<ten>.py -o <out>.mp4 --poster <giây>`
   Thoát 0 là qua; 1 là trượt cổng; 2 là thiếu công cụ. Đọc `<out>.mp4.report.json`.
4. Trích 3–4 khung thật bằng ffmpeg và **tự xem ảnh** trước khi báo xong.
5. Nhạc và tiếng động (lớp hậu kỳ chung `engines/audio/`, ADR-016): viết file cue theo dòng thời gian của chính scene (mốc lấy từ danh sách `inspect`, cú nhấn chính là `drop`), rồi
   `python3 engines/audio/score.py bed <out>-bed.wav --duration <độ dài mp4> --recipe explainer --cues <cue>.json`
   `python3 engines/audio/score.py mux <out>.mp4 <out>-bed.wav -o <out>-nhac.mp4 --vol <mức> --sfx-vol 0.35`
   Mức nền: có giọng 0,08–0,11; **không lời: 0,18** (người dùng chốt cho ném xiên, trần máy 0,25). Đổi dòng thời gian thì viết lại cue, kiểm khởi âm khớp mốc.
6. Chấm rubric 7 trục (`engines/rubric/RUBRIC-MOTION.md`): `rubric.py prep <out>-nhac.mp4 -o <out>-nhac.rubric --expect-dur <s> --brief <brief>.txt` → giám khảo là **một agent khác** đọc `jury-prompt.md`, ghi `review-N.json` → `rubric.py gate review-N.json --spec spec.json --round N`. Ngưỡng 7 mọi trục; quá 2 vòng sửa mà trượt thì ra `STUCK.md`: bổ sung bằng chứng, giả thuyết đã loại, rồi trình người dùng chọn hướng, không tự sửa tiếp.
7. Test: `python3.14 -m unittest discover tests` (python3 mặc định của Homebrew thiếu PyYAML).

venv mặc định: `{{KUDO_HOME}}/.venv/manim/bin/manimgx`; đổi bằng `--manimgx` hoặc `KUDO_MANIMGX`.

## Lỗi hay gặp

| Lỗi | Đúng |
|---|---|
| `2{,}5`, `2,5`, `\text{,}` trong MathTex: in hở "2, 5" | `formula(r"2.5")` hoặc `vn(2.5)`; bên dưới là `2\mathord{,}5` |
| Tự viết `str(x).replace(".", ",")` | `vn()`: còn tách nghìn bằng dấu chấm |
| `TransformMatchingTex` với mỗi bước một chuỗi nguyên: không khớp gì, chỉ mờ dần | `derive()` mặc định `match="shapes"`; chỉ dùng `match="tex"` khi chia `formula(*parts)` giống nhau giữa các bước |
| Chọn poster lúc đang biến hình hay mờ chữ: ảnh ma | Lấy giây nằm trong một `wait` ở danh sách `inspect` (thường là đoạn giữ cuối) |
| Mũi tên vectơ chạy theo vật tới sát trục: đè nhãn trục | Hiện vectơ ở đỉnh rồi gỡ trước khi rơi tiếp (đoạn quỹ đạo 45° trong `nem_xien.py`) |
| Đặt khối công thức sát dưới trục | Chừa khoảng nhãn trục x; `inspect` báo "texts overlap" |
| Render thẳng bằng `manimgx render`: video VFR, mất khung giữ cuối | Luôn qua `render.py` (mã hoá lại CFR 30) |
| Khoảnh khắc chính chỉ là chấm đổi màu | Cú nhấn đúng mốc `drop`: thứ thua mờ đi, chấm bật to (`there_and_back`), vòng sáng lan + `Flash`, nhãn kết quả đập vào (`FadeIn(scale=1.8)`), tất cả trong một `play` |
| Làm mờ nhãn cùng mức với đường (0,3): nhãn không đọc được | Đường mờ 0,3, nhãn mờ 0,65 (`FADED`, `TAG_FADED` trong `nem_xien.py`) |
| Vòng sáng, tia loé lan đè lên nhãn trục đang mờ | Cho nhãn lui đi trong `play` trước cú nhấn, không cùng `play` với vòng sáng |
| Vectơ ngắn, nhãn đè đường cong | Hệ số đủ lớn (`K = 0.16` đơn vị mỗi m/s), nhãn `label_at="mid"` hướng ra chỗ trống; chạy `inspect` sau mỗi lần đổi độ dài |
| Biến hình công thức có khung trung gian vỡ chữ | Xếp dòng (`FadeIn` từng dòng), rồi phóng dòng kết quả bằng `Transform` sang bản `copy().scale()` |
| `run_time`, `wait` lẻ (0,45 s…): số khung lệch, `render.py` trượt | Mọi thời lượng là bội 1/30 s |
| Tin nguyên văn nhận xét giám khảo | Đối chiếu khung thật; giám khảo có thể nêu sai mốc giờ, cỡ chữ. Ghi chỗ sai vào `STUCK.md` |
| Báo "xong" khi chỉ có PASS máy | Ghi rõ: máy đã kiểm, thẩm mỹ và độ đúng nội dung chờ người dùng duyệt |

## Giới hạn đã biết (bài học ném xiên r1–r4, 16/10/2026)

- Luật vùng an toàn dừng ở 1460 px nên khung dọc dễ trống đáy khoảng 25%; giám khảo trừ điểm thiết kế. Clip mới nên chia bố cục dọc từ đầu (đồ thị nửa trên, công thức nửa dưới) thay vì đồ thị ngang nhỏ.
- Clip không lời ở nền 0,18 vẫn chỉ khoảng −25 LUFS tổng, vì tiếng động gánh phần lớn độ to. Chưa có bước chuẩn hoá âm tổng.
- Bốn vòng sửa ném xiên dừng ở trung bình 5,71/10 (giám khảo AI); người dùng duyệt bản 4 kèm rủi ro. Ngưỡng 7 là giả thuyết, không thay duyệt người thật.
- Chưa có giọng VieNeu, phụ đề trong engine này. Không tự ghép nếu lớp hậu kỳ chung chưa có.

Font: `text()` dùng Be Vietnam Pro và báo lỗi nếu máy chưa cài (tải từ Google Fonts vào `~/Library/Fonts`, hoặc đặt `KUDO_FONT_DIR`). Đừng bỏ qua lỗi này: không có font, manimgx lặng lẽ rơi về chữ có chân.
