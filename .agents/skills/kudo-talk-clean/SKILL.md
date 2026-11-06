---
name: kudo-talk-clean
description: Tự dọn video talking head trước khi dựng — cắt lặng đầu/cuối, khoảng nghỉ dài, từ đệm (ờ, ừm…), tiếng vấp không thành lời, lặp từ/cụm, câu nói lại (giữ lần cuối) và cụm người dùng chỉ định bỏ; điểm cắt bám chỗ năng lượng thấp, khớp khung hình, fade âm 12 ms. Dùng khi người dùng đưa video tự quay (selfie, nói trước camera) để làm video giới thiệu/bán hàng/Shorts, trước bước dựng hiệu ứng.
---

# Kudo — Dọn talking head

> **Trạng thái: BẢN NHÁP — chờ người dùng duyệt (HARD-GATE) trước khi thành skill chính thức.**

Script: `skills/kudo-talk-clean/scripts/talkclean.py` (chỉ cần `ffmpeg`, Python chuẩn; ASR dùng faster-whisper có sẵn).

## Khi nào dùng

Người dùng đưa video tự nói vào máy và muốn ra video dựng hoàn chỉnh. Luôn chạy bước này **trước** khi tách nền (matte), làm phụ đề hay đặt hiệu ứng — mọi mốc thời gian phía sau lấy từ `words.clean.json`, không lấy từ file gốc.

## Luật cứng

1. **Không cắt chữ có nghĩa khi chưa chắc.** Chỉ tự cắt: lặng, đệm, tiếng không thành lời, lặp chắc chắn, câu nói lại. Mọi thứ còn lại vào mục "Cần nghe lại" trong `report.md`.
2. **Câu bỏ dở không được để treo.** Nếu giữ (vì cắt sẽ mất nghĩa), phải bù bằng hình/chữ trên màn hình và ghi rõ quyết định trong báo cáo cuối.
3. **Kiểm đồng bộ sau khi cắt**: chạy lại ASR trên `clean.mov`, so chữ với `words.clean.json`; lệch tiếng-hình phải bằng 0 (thời lượng hình = tiếng).
4. Người dùng đưa thiếu (không nói cụm cần bỏ) vẫn phải ra bản sạch dùng được; `--drop` chỉ là tuỳ chọn.

## Bước 0 — nguồn dài hoặc link YouTube

Khi `resolved.source.kind` là `youtube`/`url`, hoặc video dài hơn ~1,5 lần thời lượng yêu cầu, phải chọn đoạn trước khi dọn. Không tự cắt theo cảm tính.

```bash
PK="python3 skills/kudo-talk-clean/scripts/pick.py"
$PK fetch "URL" run/source/                                    # yt-dlp: video.mp4 + phụ đề vi json3 + info
$PK json3 run/source/video.vi.json3 run/source/words.json      # không có phụ đề → asr.py trên audio
$PK candidates run/source/words.json --length 60 --topic "…"   # bảng ứng viên + words.candidates.json
$PK cut run/source/video.mp4 "a-b,c-d" run/cut/raw.mp4         # nối đoạn đã chọn → vào Quy trình bên dưới
```

- Điểm ứng viên chỉ là gợi ý: trừ từ đệm, câu mở bằng từ nối, lời chỉ trỏ màn hình; cộng câu liệt kê, câu móc, kết trọn câu. Agent **đọc lời** từng ứng viên, chọn 1–3 đoạn thành một mạch (móc → ý chính → kết), ghi lý do vào báo cáo.
- Không có chủ đề (người dùng chỉ dán link) thì rút chủ đề từ tiêu đề trong `video.info.json` và các ứng viên điểm cao.
- Video không phải của người dùng: hỏi quyền dùng trước khi tải.

## Quy trình

```bash
PY={{KUDO_HOME}}/.venv/faster-whisper-py312/bin/python3
TC="python3 skills/kudo-talk-clean/scripts/talkclean.py"
ffmpeg -nostdin -i IN.mp4 -ac 1 -ar 16000 in.wav
$PY skills/kudo-talk-clean/scripts/asr.py in.wav words.json                 # faster-whisper, word_timestamps
$TC plan IN.mp4 words.json OUT/ [--drop "cụm chữ"]...
#   → OUT/edl.json, words.clean.json, report.md, filter.txt
#   đọc report.md; xử lý mục "Cần nghe lại" (thêm --drop hoặc chấp nhận)
$TC render OUT/                              # → OUT/clean.mov
$PY skills/kudo-talk-clean/scripts/asr.py OUT/clean.wav OUT/words.reasr.json  # kiểm chữ & đồng bộ
```

Tham số chính (mặc định đã chỉnh cho tiếng Việt nói nhanh):

| Cờ | Mặc định | Ý nghĩa |
|---|---|---|
| `--keep-pause` | 0.24 s | nghỉ giữ lại giữa hai câu |
| `--comma-pause` | 0.14 s | nghỉ giữ lại giữa hai vế |
| `--max-gap` | 0.30 s | nghỉ ngắn hơn thì để nguyên |
| `--lead` | 0.25 s | lặng tối đa trước từ đầu tiên |

## Cách hệ thống tự xử lý

- **Tinh chỉnh ranh giới từ** theo đường năng lượng (ASR hay lệch ~0,1–0,2 s).
- **Từ đệm**: `ờ, ừm, ơ…`; `à/á` chỉ bị coi là đệm khi đứng tách bởi khoảng nghỉ.
- **Lặp**: cụm 1–6 từ lặp liền nhau → giữ lần cuối; có danh sách miễn trừ cho lặp tu từ.
- **Nói lại**: câu bị bỏ giữa chừng rồi nói lại từ đầu → bỏ lần hỏng.
- **Nghỉ dài có tiếng không thành lời** (hít thở, "ờ" ASR không ghi) → rút về độ nghỉ chuẩn.
- **Điểm cắt** đặt ở chỗ năng lượng thấp nhất trong khoảng nghỉ, khớp bội 1/fps để không trôi tiếng; mỗi mối nối fade âm 12 ms.

## Sau khi dọn — bước đạo diễn (bắt buộc, có cổng)

Không dựng thẳng. Viết `plan.json` theo `engines/talkfx/STANDARD.md` (chế độ xử lý người, kiểu máy quay, lớp phủ
theo họ và bố cục, nhịp lộ trong lớp phủ, tiếng động từng sự kiện, phụ đề), rồi:

```bash
python3 engines/talkfx/fx_plan.py gate plan.json          # mã 1 = trượt: sửa plan, không hạ ngưỡng
python3 engines/talkfx/fx_plan.py cues plan.json cues.json  # → engines/audio/score.py bed --cues cues.json
```

Cổng chặn đúng lỗi của bản thử 26/10: một kiểu chữ lặp suốt video, người để thô, máy quay hai cỡ, không phụ đề.
Lấy mẫu từ `src/th/KudoTH.tsx` (chế độ người, chữ sau đầu, box kính, số chạy, danh sách, bằng chứng toàn màn hình).
Cổng đạt rồi vẫn phải chụp mỗi lớp phủ một khung để tự xem trước khi giao.

## Sau khi dọn — gợi ý dựng

- Các mối nối là jump cut: xen kẽ cỡ khung (1.0 / 1.12) theo đoạn trong `edl.json` để che vết cắt; đoạn < 0,6 s giữ cỡ đoạn trước.
- **Chữ & box thông tin phải tinh tế** (người dùng cấm từ 22–23/10/2026, đã tái phạm một lần):
  - cấm gạch ngang chữ, dấu ✕, khung có viền quanh chữ/box/ảnh, nền lửa/pháo hoa/tia lửa phủ khung, chớp trắng khi cắt (điện xẹt/đập/vỡ bám nét chữ thì được, xem dưới);
  - box = kính mờ tối không viền + bóng mềm; chữ hiện bằng mặt nạ, nhòe → nét (~0,7 s, expo-out); một màu nhấn;
  - "không cần X" thì cho chữ tan đi (mờ, nhòe, giãn chữ); giá cũ để nhỏ, mờ, đặt bên dưới;
  - SFX mềm (whoosh khí, tick, chuông nhẹ, sub swell) cho chữ thường; tiếng đập/vỡ/điện chỉ đi với nhóm hiệu ứng mạnh (xem dưới);
  - trước mọi lần render chạy `python3 scripts/lint_fx.py src/` — còn lỗi thì không render.
- **Nhịp không vội** (góp ý 23/10: "vội vàng quá, không theo kịp"):
  - ít cảnh, mỗi cảnh dài: chữ/box vào ≥ 1,0 s, đứng yên đọc được ≥ 2,5 s;
  - một chủ đề là một cảnh, không ra rồi vào lại;
  - **đoạn nói về bằng chứng thì cắt hẳn người nói** (góp ý 23/10 về v5): ảnh bằng chứng chiếm trọn màn hình, máy đẩy chậm vào đúng dòng số liệu, phần còn lại tối đi, chú thích + con số nằm dưới ảnh; hết đoạn bằng chứng mới quay lại người nói. Không đặt ảnh bằng chứng nhỏ ở góc cạnh mặt người;
  - mỗi box một kiểu số khác nhau (đếm lên, hiện từng ký tự, bánh xe số, đường tăng trưởng, lưới chấm) và xen box tối / box giấy sáng / không box.
- **Xử lý người phong phú**: mỗi cảnh một chế độ (nền đen trắng giữ người màu, rọi sáng ấm, khung lùi xuống nhường chỗ, nền trôi thị sai, mất nét dần, đẩy máy chậm, vệt sáng lướt qua người, viền sáng ấm, ám đêm), chuyển êm 0,8 s; khung lùi xuống thì hạ phụ đề để không che miệng.
- **SFX khớp từng hiệu ứng**: mỗi lần chữ/ảnh/box vào, thu nhỏ, số đếm, số chạy, giá hiện, đóng băng hình đều có tiếng mềm riêng (whoosh khí, giấy, tick đếm, chuông glock/celesta, shimmer, sub swell, màn trập); v5 dùng ~150 tiếng cho 62 s.
- **Hiệu ứng chữ chỉ nằm trong hoặc sát nét chữ** (người dùng, 23/10, sau khi không ưng bản v1 nào): không tấm nền, thẻ, khung, quầng sáng lớn, nón đèn, khói phủ nửa khung; bóng đổ chỉ ôm chữ (mờ ≤ ~14 px). Cảnh quay người nói để nguyên độ sáng, không làm tối/mờ để "nổi chữ"; đặt chữ lên vùng tối sẵn có (áo) và không che mặt. Chữ đứng vẫn có chuyển động nhẹ trong nét (vệt sáng, lấp lánh, sóng), không đứng chết sau 1 s. Mỗi hiệu ứng một chữ ký âm riêng khớp nhịp hình; không rải tiếng gió chung đầu mỗi đoạn, không để whoosh/tick chiếm quá nửa số tiếng.
- **Chữ tự có viền, không khung ẩn** (người dùng, 23/10, sau v2): không tô chữ bằng `background-clip:text` (trình dựng headless vẽ thành hình chữ nhật mờ quanh chữ) và không cho vệt sáng kéo ngang hết khung. Vẽ chữ bằng SVG `<text>`, màu/ánh sáng chỉ trong nét, viền tối mảnh bám theo nét (feMorphology dilate) để đọc rõ trên mọi nền.
- **Nhóm hiệu ứng mạnh được dùng** (người dùng yêu cầu từ 22/10: "xẹt điện, đập mạnh, đổ vỡ… nhưng phải luxury"): điện xẹt chạy dọc nét chữ, đập mạnh kèm rung máy ngắn, vỡ vụn thành mảnh, kintsugi, nhiễu cắt lát, sóng dội, hào quang vòng theo dáng chữ, nạp điện quá tải. Điều kiện: bám trong/sát nét chữ, không nền, không pháo hoa/lửa phủ khung, không chớp trắng; tiếng động mạnh (đập trầm, kính vỡ, điện) được dùng cho nhóm này.
- **Mỗi hiệu ứng chữ = chất liệu + sự kiện** (23/10, sau khi anh thích nhóm 17–28): không chỉ đổi chất liệu trong nét (trên điện thoại trông như chữ màu); phải có cung chuẩn bị → cú chạm (SFX mạnh khớp đúng khung hình, chữ nảy 1,0 → 1,06 → 1,0, rung máy nhẹ nếu va đập) → dư âm → chữ đứng vẫn sống trong nét. Chuyển động "sống" lúc đứng không được làm sai nội dung (vd ô bảng ga lật lại phải giữ đúng số). Chữ dài/rộng (`%`, `–`) phải soát lề, chừa ≥ 40 px mỗi bên.
- **Kho 28 hiệu ứng chữ v4** (23/10, chờ anh chọn, thay v3): 01–16 làm lại theo luật trên (kim cương kết tinh, vàng dập khuôn, chrome nhập khối, kính va nhau, cẩm thạch nứt mạch vàng, ép nhũ bóc màng, hologram khoá sóng, loé ống kính, bật đèn từng chữ, khói phụt, giọt mực toé, bảng ga khoá cứng, in lụa ba lần dập, rót đầy tràn, đèn xoay khoá bóng, rèm đập đóng); 17–28 giữ v3 (hạt vàng, lăng kính, dư ảnh, soi bóng + nhóm mạnh). Chỉ đưa vào bản dựng chính những hiệu ứng anh đã chọn.
- **Kho 16 mẫu chữ hai tầng kiểu CapCut** (24/10, chờ anh chọn): dòng chính to (Anton/Be Vietnam Pro/Baloo/Playfair) + dòng nhấn nhỏ viết tay hoặc nghiêng đặt lệch, không đè dòng chính (vẽ dòng to trước, dòng nhỏ sau); cú chạm đặt ở cuối dòng chạm SFX; không dùng tấm nền, nhãn hộp, gạch ngang hay giao diện giả lập dù mẫu gốc có.
- **Look của video + cổng kiểm look** (24/10, đề xuất, chờ anh duyệt hướng trước khi thành mặc định): mẫu chữ chỉ mang hành vi (chuyển động, nhịp, SFX); màu, font, viền, phát sáng, khối nổi lấy từ một look chung của video (`look.ts`: `applyLook` mặc da, `assertLook` chặn dựng nếu màu ngoài bảng, quá 2 font, phát sáng > ngưỡng hoặc khối 3D khi look cấm). Look mẫu `LOOK_TP` theo chuẩn r17: dòng chính Be Vietnam Pro giấy kem viền mực, dòng nhấn Cormorant nghiêng màu lacquer. Lý do: bản 16 mẫu đủ màu, 6 font bị anh chê "rẻ tiền", lệch gu video.
- Sửa lỗi ASR khi làm phụ đề (ví dụ "yêu đãi" → "ưu đãi", "23h59 phút" → "23:59"); không sửa lời nói.

## Kiểm chứng đã có (2026-10-23)

Video gốc 69,57 s → 62,63 s (bớt 6,93 s, 11 đoạn bỏ). Re-ASR khớp toàn văn; thời lượng hình = tiếng. Còn hai mục cần nghe lại, được báo trong `report.md`.
