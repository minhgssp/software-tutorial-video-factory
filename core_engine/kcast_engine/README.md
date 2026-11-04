# Engine quay màn hình và cảnh gõ `engines/screencast` (ADR-039, ADR-040)

Engine tự mở trang web, tìm vùng quan trọng rồi dựng thành video dọc 9:16. Vùng quan trọng gồm tiêu đề, nút bấm, dòng lệnh, link và số liệu. Trên hình, engine tự làm các việc sau:

- phóng gần (zoom) theo kích thước vùng;
- di con trỏ cong tới đích;
- bấm có gợn sóng;
- tô khối (spotlight): làm tối phần còn lại, để vùng đích sáng;
- hiệu ứng nổi bật: khung sáng (`frame`), quét màu (`sweep`), sóng lan (`pulse`), nhấc vùng (`lift`); nét bút (`circle`, `underline`) chỉ khi kịch bản ghi rõ;
- hiện nhãn ngắn ("Xem", "Bấm", "Chép");
- quay cảnh gõ thật: gõ từng phím vào ô nhập trên web, hoặc chạy lệnh thật trong terminal rồi dựng lại cảnh gõ và đầu ra; thanh phím ở đáy khung và tiếng gõ khớp số phím.

Ngoài ra, engine chèn được clip kết quả thật làm cảnh demo. Clip lấy từ video hoặc GIF ngay trên trang.

Mọi chuyển động là hàm thuần của thời gian `t` trong `stage.js`. Nhờ vậy, khung hình dựng song song nhiều tiến trình vẫn ghép khớp nhau.

## Cài đặt

- Dùng `python3.14` có `playwright` và `pyyaml`. Trình duyệt mặc định là Chromium headless shell trong `~/Library/Caches/ms-playwright/`; muốn dùng bản khác thì đặt biến `KUDO_CHROME`.
- Cần `ffmpeg` và `ffprobe`.
- Giọng đọc dùng VieNeu, chạy qua `engines/voice/vieneu_tts.py` (giọng có sẵn, mặc định Hải Đăng; `--voice "Trúc Ly"` để đổi, `--ref mau.wav` để nhân bản giọng của bạn) rồi `engines/voice/voice_align.py` căn mốc từng từ. Cần `.venv/vieneu` và `.venv/faster-whisper-py312` (xem skill `kudo-setup`). Nhạc và tiếng động lấy từ `engines/audio/score.py`, tự tổng hợp nên an toàn bản quyền.
- Phông chữ (OFL) nằm sẵn trong `fonts/` và được nhúng base64 khi dựng, nên không cần mạng.

## Lệnh

```bash
S="python3.14 engines/screencast/screencast.py"
$S suggest "<brief>"                  # chấm brief: có nên quay không, có đoạn gõ không (typing, kinds), kèm lý do và URL
$S make <script.yaml> <thư mục lượt>  # capture → voice → plan → render → audio → qa
$S capture <script.yaml> <lượt> [--only r1,r2]
$S voice   <script.yaml> <lượt> [--pace 1.05]
$S plan    <script.yaml> <lượt>       # không có giọng thì ước lượng mốc từ
$S still   <lượt> [giây ...]          # chụp vài khung để tự xem trước khi dựng cả video
$S render  <lượt> [--workers 6]
$S audio   <lượt> [--recipe explainer --vol 0.10 --sfx-vol 0.35]
$S qa      <lượt>
```

Mã thoát: `0` PASS, `1` trượt cổng (PARTIAL), `2` BLOCKED (thiếu trình duyệt, ffmpeg hoặc giọng), `3` STUCK.

## Kịch bản (`script.yaml`)

Mẫu đầy đủ: `briefs/screencast/6-repo-video-bang-code.yaml`.

| Loại cảnh (`kind`) | Dùng khi | Trường chính |
|---|---|---|
| `screen` (mặc định) | Giới thiệu một trang: chụp toàn trang, camera ảo chạy trên ảnh 2x | `url`, `hide`, `beats` |
| `live` | Cần thao tác thật: bấm, gõ, cuộn, trang đổi theo | `url`, `actions` (`click`/`type`/`scroll`/`point`/`wait`); `type` có `text`, `enter`, `delay` |
| `terminal` | Gõ lệnh và xem đầu ra thật | `steps`: `{cmd, at, highlight, highlight_at, timeout, allow_fail}`, `prompt` |
| `demo` | Chèn clip kết quả thật | `video` (file/URL) hoặc `video_from` (`url`, `selector`, `nth`), `start`, `dur` |
| `card` | Thẻ chữ mở và kết | `title`, `accent`, `note`, `collage` hoặc `items` |

Mỗi cảnh có `say`, là lời đọc. Có thể thêm `perform`: cùng lời đó nhưng chèn `/` cho chỗ nghỉ ngắn và `//` cho chỗ nghỉ dài.

Mỗi nhịp (`beat`) có các trường:

- `at`: cụm từ trong lời, dùng làm mốc thời gian;
- `target`: `{text}` hoặc `{selector}`; có cả hai thì selector được ưu tiên;
- `do`: `focus`, `point`, `click`, `open`, `show`, `scroll` hoặc `mark`;
- tuỳ chọn: `label`, `mark` (`frame`/`sweep`/`pulse`/`lift`/`circle`/`underline`/`highlight`/`none`), `zoom`, `spot`, `navigate`.

Hiệu ứng mặc định theo nhịp: `focus`/`mark`/`type` → `frame`, `point` → `sweep`, `click`/`open` → `pulse`.

Cảnh `terminal` chạy từng lệnh thật bằng `/bin/bash` trong `capture/<id>-term` với `HOME` trỏ vào đó, không màu, không hỏi mật khẩu git. Lệnh có `sudo`, `npm i -g`, `| sh`, `rm -rf /` hoặc `~`, `mkfs`, `> /dev/` bị chặn (`TERM_BLOCKED`). Mã thoát khác 0 làm `capture` dừng, trừ khi bước có `allow_fail: true`. Khi dựng, mỗi lệnh gõ với tốc độ khoảng 17 ký tự/giây (0,5–2,4 s), đầu ra hiện theo mốc thật, lệnh lâu được tua về tối đa 1,4 s, đầu ra quá 12 dòng rút còn đầu và cuối.

Không ghi `beats` thì engine tự chọn vùng (`auto_beats`). Vùng có chữ trùng lời đọc được ưu tiên trước, sau đó xét tiêu đề, nút và khối mã.

## Luật cứng

1. **Không bịa giao diện.** Mọi khung đều chụp từ trang thật. Đích không tìm thấy thì `capture` trả mã 1 và ghi `found: false`. Phải sửa đích hoặc chạy `--keep-going`, và nói rõ chỗ thiếu.
2. **Link ký hạn** của video trên GitHub hết hạn sau khoảng 5 phút. Vì vậy demo dùng `video_from`: engine lấy link mới ngay lúc quay.
3. **Chuẩn hình ảnh:**
   - phóng tối đa 2,4 lần, vì ảnh 2x phóng quá 2,56 lần sẽ nhoè;
   - tối đa 3 hiệu ứng nổi bật cùng lúc;
   - con trỏ tới đích trước lời 0,55 s;
   - không có khung chết, nhịp nào camera cũng đẩy nhẹ 3%.
4. **Tự xem khung thật** trước khi báo: `still`, `qa/contact.jpg`, vài khung trong `out/final.mp4`. `qa` PASS chỉ là kiểm máy, chưa thay được người duyệt gu.

## Sản phẩm trong thư mục lượt

- Đầu vào và tư liệu quay: `script.yaml`, `capture/` (ảnh trang, `capture.json`, khung demo).
- Giọng và kế hoạch: `work/voice_timeline.json`, `plan.json`, `stage.html`.
- Video: `work/silent.mp4`, `out/final.mp4` (kèm `final.mp4.audio.json`).
- Kiểm tra: `qa/stills/`, `qa/contact.jpg`, `qa/report.json`.

Test: `python3.14 -m unittest tests.test_screencast_engine`.
