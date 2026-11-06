# MUSIC: nhạc nền cho mọi style Kudo

Tự tổng hợp bằng `tools/bgm.py` (numpy, offline, không mẫu ngoài, không tốn tiền). Một video một file `work/music.wav`.

## Chọn style

| Style video | `--style` | Cảm giác |
|---|---|---|
| Pixel (pixel-explainer, kudo-shorts) | `chiptune` | 8-bit, 112 BPM, vui, game |
| Flat/vector, motion graphics, giải thích sản phẩm | `synthpop` | sáng, 108 BPM, kick + clap |
| Tâm sự, chữa lành, thói quen, chậm | `lofi` | ấm, 84 BPM, swing, nhiễu đĩa than |
| Điện ảnh, ambient (vector-cinema) | dùng `vector-cinema/tools/audio/score.py` | không gian, cao trào |

## Chia đoạn theo lời (`--sections giây:đoạn,…`)

- `drive` ở 0 giây khi muốn hook mạnh; nếu không thì `lift`.
- Lời giải thích dày → `calm`. Liệt kê, các bước → `lift`. Cao trào, kết quả, CTA → `drive`. Ngay trước cú chốt → `break` 2–4 s.
- Cuối: `outro` ~4 s trước `dur`. Mốc đặt đúng ranh giới cụm ý (lấy giây từ bảng nhịp BRIEF).
- Trước mỗi `drive` có riser 1 ô nhịp, đầu `drive` có crash — đặt `drive` trùng cảnh có `punch`/chuyển cảnh lớn.

## Mức âm (mix.py)

Mặc định ducking: nhạc ở `−8 dB` khi giọng nghỉ (phần mở đầu, khoảng ngắt), tự hạ 11 dB khi giọng nói → dưới giọng
`−19 dB ≈ ×0,11`, đúng trần 0,08–0,11 của chuẩn video toàn cục. `mix.py` báo hai mức này trong `mix-<o>.json`
(`music_gap_db`, `music_under_voice_db`). Nhạc phẳng kiểu cũ: `--music-vol 0.10`.
