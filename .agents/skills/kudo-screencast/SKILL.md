---
name: kudo-screencast
description: Dựng video dọc 9:16 bằng cách tự quay màn hình trang web thật và quay cảnh gõ phím thật (gõ lệnh trong terminal, gõ vào ô tìm kiếm). Engine tự phóng gần, di và bấm con trỏ, tô khối (spotlight), bật khung sáng, quét màu, sóng lan vào vùng quan trọng (tiêu đề, nút, dòng lệnh, link, số liệu), hiện thanh phím đang gõ kèm tiếng gõ, và chèn clip kết quả thật làm demo. Dùng khi người dùng yêu cầu quay màn hình hoặc quay cảnh gõ, hoặc khi nội dung là hướng dẫn, how-to, cài đặt bằng lệnh (npx, npm, pip, git clone, brew), demo công cụ/repo/website, cần cho người xem thấy tận nơi.
---

# Kudo — Quay màn hình, quay cảnh gõ và trỏ chuột

Engine: `engines/screencast/screencast.py` (ADR-039, ADR-040). Chi tiết lệnh và schema nằm ở `engines/screencast/README.md`.

## Khi nào dùng

- Người dùng nói "quay màn hình", "quay cảnh gõ", "demo", "hướng dẫn", "chỉ từng bước", hoặc đưa link repo, trang web hay công cụ.
- Không chắc thì chạy `screencast.py suggest "<brief>"`: điểm ≥ 3 là nên quay, kèm lý do. Nói lý do đó với người dùng khi tự chọn engine này.
- **Tự kích hoạt cảnh gõ:** khi `suggest` trả `typing: true` (brief có gõ lệnh, terminal, CLI, npx/npm/pip/git clone/brew, ô tìm kiếm, prompt), kịch bản phải có ít nhất một cảnh gõ thật: `kind: terminal` cho lệnh, hoặc nhịp `type` trong cảnh `live` cho ô nhập trên web. `kinds` trong kết quả gợi ý loại cảnh nên dùng.
- Không dùng cho bài luận hay chiêm nghiệm không có màn hình để chỉ. Những bài đó thuộc các engine khác (xem `docs/DINH-TUYEN-THE-LOAI.md`).

## Luật cứng

1. **Mọi hình là trang thật.** Không vẽ lại giao diện, không bịa số liệu trên màn hình. Số sao, giấy phép và số skill trong lời đọc phải kiểm lại bằng nguồn hiện tại (`gh api` hoặc trang chính thức) ngay trong ngày dựng.
2. **Lời khớp hình.** Mỗi `beat.at` phải là cụm từ có trong `say`, để con trỏ và camera tới đúng lúc lời nhắc tới. Số trong `say` và `at` viết bằng chữ ("bảy mươi nghìn sao", không viết "70 nghìn sao"), vì bộ căn giọng (`voice_align.py`) cần mỗi từ là một âm tiết và dừng với lỗi `TOKEN_SHAPE` nếu gặp chữ số.
3. **Repo không có file giấy phép** thì nói "công khai trên GitHub", không nói "mã nguồn mở".
4. **Demo lấy link mới lúc quay** bằng `video_from`. Không dán link video ký hạn vào kịch bản.
5. **Tự xem khung thật** trước khi báo: `still` trước khi dựng, rồi `qa/contact.jpg` và vài khung trong `out/final.mp4` sau khi dựng. `qa` PASS chỉ là kiểm máy; gu thẩm mỹ vẫn chờ người dùng duyệt.
6. **Lệnh terminal chỉ chạy trong thư mục tạm** (`capture/<id>-term`, `HOME` trỏ vào đó). Không dùng lệnh cài vào máy thật: `sudo`, `npm i -g`, `curl … | sh`, `rm -rf /` hay `~` bị chặn (`TERM_BLOCKED`). Muốn quay lệnh cài như `npx skills add …` thì quay lệnh tải về/xem tương đương (`git clone --depth 1`, `ls`, `cat`) hoặc gõ lệnh đó vào ô nhập trên web; không bịa đầu ra.
7. **Hiệu ứng nổi bật mặc định là khung sáng**, không dùng nét bút vẽ tay. Nét khoanh/gạch chân chỉ dùng khi kịch bản ghi rõ `mark: circle` hoặc `mark: underline`.
8. **Quay như người dùng thật** (ADR-061). Hành trình đi từ trang chủ (ví dụ `github.com` → hồ sơ), không vào thẳng trang tài liệu. Thanh địa chỉ phải hiện đúng trang đang mở; địa chỉ máy dev đổi bằng `url_alias`.
9. **Khán giả không biết code thì không dạy gõ lệnh.** Cho họ một lời nhờ chép được (thẻ `card` có `note`), rồi quay cảnh `kind: agent`: Claude Code thật nhận đúng lời nhờ đó và tự đọc hướng dẫn, tự cài, tự làm. Cảnh `agent` là bản ghi thật; cần `claude auth status` báo đã đăng nhập, và AI chạy sạch (không hook, MCP hay chỉ dẫn riêng của máy quay). Dòng rối mắt (gợi ý đăng nhập lại của `gh`, công cụ tuỳ chọn) thì ẩn bằng `hide` của cảnh; tự xem `still` cảnh agent trước khi dựng.
10. **Âm thanh** dùng giọng VieNeu, nhạc và tiếng động tự tổng hợp từ `engines/audio`. Không dùng nhạc có bản quyền và không gọi dịch vụ trả phí.

## Quy trình

```bash
S="python3.14 engines/screencast/screencast.py"
$S capture <script.yaml> <lượt>          # mã 1 = có đích không tìm thấy: sửa target rồi quay lại
$S plan <script.yaml> <lượt> && $S still <lượt> 5 15 30   # tự xem khung trước
$S make <script.yaml> <lượt>             # voice → plan → render → audio → qa
```

Viết kịch bản:

1. Mở trang thật, chọn 2–3 vùng mỗi cảnh. Mỗi vùng ứng với một ý trong lời.
2. Lời mỗi cảnh ngắn, 1–2 câu. Câu đầu gọi tên thứ đang xem.
3. Hiệu ứng tự chọn theo nhịp (đổi bằng `mark`):

   | Nhịp `do` | Hiệu ứng mặc định | Trông thế nào |
   |---|---|---|
   | `focus`, `mark`, `type` | `frame` | Khung sáng nở ra rồi siết vào vùng đích, viền đỏ phát sáng, một vệt sáng chạy vòng quanh |
   | `point` | `sweep` | Dải màu quét từ trái sang phải dưới dòng chữ, mép sáng chạy theo |
   | `click`, `open` | `pulse` | Khung sáng cộng sóng lan ra liên tục, kèm tiếng bấm |
   | ghi rõ `mark: lift` (chỉ cảnh `screen`) | `lift` | Vùng đích nhấc nổi lên 7,5% có bóng đổ, phần còn lại tối đi |

   Thêm `navigate` khi trang đổi sau cú bấm.
4. **Cảnh gõ lệnh** (`kind: terminal`): mỗi bước `{cmd, at?, highlight?, highlight_at?, timeout?, allow_fail?}`. Engine chạy lệnh thật lúc `capture`, ghi đầu ra và mốc thời gian, rồi dựng lại cảnh gõ từng ký tự theo lời đọc: `at` là cụm từ để bắt đầu gõ, `highlight` là biểu thức tìm dòng đầu ra cần bật khung sáng và phóng gần, `highlight_at` là cụm từ trong lời để khung sáng bật đúng lúc lời nhắc tới dòng đó. Đầu ra dài được rút gọn còn đầu và cuối; lệnh chạy lâu được tua cho vừa nhịp.
5. **Cảnh gõ trên web** (`kind: live`): nhịp `{do: type, target, text, enter?, delay?}` gõ thật từng phím vào ô nhập. Thanh phím ở đáy khung hiện chữ đang gõ, tiếng gõ khớp số phím.
6. Ẩn thanh điều hướng che nội dung bằng `hide`. Với GitHub, ẩn `header.HeaderMktg` và `.js-header-wrapper`.
7. Cảnh mở là `card` có `collage` ghép ảnh các trang sẽ xem. Cảnh kết là `card` có `items` liệt kê lại để người xem lưu.

Mẫu: `briefs/screencast/6-repo-video-bang-code.yaml`.

## Đọc kết quả

| Mã | Nghĩa | Làm gì |
|---|---|---|
| 0 | PASS | Tự xem khung thật, rồi trình người dùng kèm câu "chưa có duyệt gu" |
| 1 | PARTIAL | Đọc `qa/report.json` hoặc `capture.json` (`found: false`), sửa rồi chạy lại |
| 2 | BLOCKED | Thiếu Chromium, ffmpeg hoặc giọng; báo rõ |
| 3 | STUCK | Đã sửa 2 vòng cùng lỗi; viết `STUCK_REPORT` |
