---
name: kudo-styles
description: Use when a Kudo request routes to flow explain.styles (faceless explainer in one of the motion-graphics styles - cel-boil, cel-boil-mp, flat-vector, line-art, morph, collage, bauhaus, hanazi, pixel-quest, paperclip). Writes the script JSON, renders with engines/styles kstyle CLI, adds voice, music and SFX, and runs QA.
---

# Kudo styles — video giải thích theo style đồ hoạ động

Engine: `{{KUDO_HOME}}/engines/styles` (đọc `ARCHITECTURE.md` trước lần đầu). Style key `styles.<slug>` trong
yêu cầu ứng với thư mục `styles/<slug>/`. Mỗi style có `replica.json` là kịch bản mẫu: đọc nó để biết đúng
cấu trúc cảnh, số chữ mỗi cảnh, loại cảnh style hỗ trợ.

## Quy trình

1. Viết kịch bản `{{KUDO_WORK}}/<tên>/script.json` theo cấu trúc `replica.json` của style, độ dài theo
   `resolved.length`, mục tiêu theo `resolved.goal`, màu nhấn `profile.accent` nếu style cho đổi.
2. Kiểm: `node cli/kstyle.mjs validate <slug> --script <script.json> --format <9x16|16x9>`. Lỗi thì sửa kịch bản.
3. Giọng: giọng tự thu của người dùng, hoặc giọng máy Kokoro qua `engines/voice/kokoro_tts.py` (tiếng Anh).
   Có mốc từng từ thì chạy `kstyle sync` để cảnh khớp lời.
4. Ảnh tĩnh: `node cli/kstyle.mjs stills <slug> --script <script.json> --format <f> --out <dir>`. Mở xem từng ảnh;
   chữ tràn, đè, cắt thì sửa trước khi dựng. Lặp theo `options.review_rounds`.
5. Dựng: `node cli/kstyle.mjs render <slug> --script <script.json> --format <f> --out <tên>.mp4`
   (nhạc và tiếng động tự tổng hợp; `options.sfx: false` thì thêm `--noaudio` rồi trộn nhạc riêng bằng `audio`).
6. QA: `node cli/kstyle.mjs qa <tên>.mp4 --format <f> --voice`. `options.both_aspects` thì lặp với khung còn lại.

Chạy mọi lệnh trong `{{KUDO_HOME}}/engines/styles`. Style `hanazi` và `paperclip` chưa có video mẫu duyệt:
báo người dùng trước khi dựng.
