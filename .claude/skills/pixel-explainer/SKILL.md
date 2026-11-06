---
name: pixel-explainer
description: >-
  Dựng video giải thích bằng pixel art, ra hai MP4 khung dọc 9:16 và ngang 16:9, từ lời đã được người dùng duyệt
  nguyên văn. Dùng khi được yêu cầu dựng video pixel, video giải thích pixel art hay pixel explainer cho một thư mục
  run trong {{KUDO_WORK}}/pixel-explainer có docs/clean.txt, docs/performance.txt, docs/meaning-argument.md.
  Nếu run chưa có giọng thì skill tự tạo giọng người dùng (VieNeu, offline) và mốc từng từ, rồi đạo diễn hình, trộn
  nhạc và SFX, render và tự soát bằng ảnh trích từ MP4. Không dùng để viết lời mới.
---

# pixel-explainer: runbook cho đạo diễn

Agent đóng vai **đạo diễn**: đọc lời, chia nhịp, chọn hình, viết `direction.py`, rồi dựng, soát và sửa tới khi đạt.
Engine, tool và thư viện sprite đã có sẵn và đã kiểm chứng. Việc của đạo diễn là **quyết định hình theo nghĩa**,
không phải viết lại công cụ.

Đường dẫn gốc của skill (gọi là `SK` trong file này):

```
SK={{KUDO_HOME}}/skills/pixel-explainer
```

## 0. Khi được gọi

Lời giao việc thường ngắn, ví dụ "dựng video pixel cho run X, tên video kudo". Làm theo thứ tự:

1. **Xác định run và tên video.** Run là thư mục tuyệt đối được nêu trong lời giao việc. Chỉ có tên mà không có
   đường dẫn thì tìm `{{KUDO_WORK}}/pixel-explainer/<tên>*`; không thấy đúng một thư mục thì dừng `BLOCKED`.
   Tên video (`<tên>` ở bước 8) lấy từ lời giao việc; không có thì lấy phần tên thư mục run trước ngày tháng.
2. **Cổng lời đã duyệt.** Run phải có sẵn `docs/clean.txt`, `docs/performance.txt`, `docs/meaning-argument.md`.
   Thiếu file nào thì dừng `BLOCKED` và ghi rõ file thiếu. **Không tự soạn lời, không sửa lời.** Lời được soạn và
   duyệt ở skill viết kịch bản (`short-script`), không phải ở đây.
3. **Giọng.** Có `work/voice.wav` và `work/voice_timeline.json` thì dùng luôn, sang bước 4. Thiếu thì chỉ được tạo
   giọng khi run có `docs/owner-decision.json` với `"status": "APPROVED"` và `script_fingerprint` bằng sha256 của
   `docs/clean.txt`:

   ```bash
   python3 -c "import hashlib,json,sys;r=sys.argv[1];d=json.load(open(r+'/docs/owner-decision.json'));h=hashlib.sha256(open(r+'/docs/clean.txt','rb').read()).hexdigest();print('OK' if d.get('status')=='APPROVED' and d.get('script_fingerprint')==h else 'CHUA_DUYET',h)" <run>
   ```

   In `CHUA_DUYET` hoặc không có file thì dừng `BLOCKED`: "cần người dùng duyệt nguyên văn lời trước khi tạo giọng".
   Agent **không tự tạo, không sửa** `owner-decision.json`. In `OK` thì tạo giọng rồi căn mốc từng từ:

   ```bash
   mkdir -p <run>/work
   {{KUDO_HOME}}/.venv/vieneu/bin/python {{KUDO_HOME}}/engines/voice/vieneu_tts.py run <run>
   {{KUDO_HOME}}/.venv/faster-whisper-py312/bin/python {{KUDO_HOME}}/engines/voice/voice_align.py <run> --prompt "<tên riêng trong lời, cách nhau dấu phẩy>"
   ```

   `vieneu_tts.py run` mất vài phút (thêm `--voice "Trúc Ly"` hoặc `--ref mau.wav` để đổi giọng), ra `work/voice.wav` và `work/voice-receipt.json`; nó tự dừng nếu lời ghép lại
   không trùng `clean.txt` hoặc giọng lệch chất giọng gốc. Dừng lỗi thì ghi nguyên văn lỗi vào báo cáo, trạng thái
   `BLOCKED`; không chạy lại quá 2 lần. `voice_align.py` ra `work/voice_timeline.json` và
   `work/alignment-report.json`. Nếu nó ghi `<run>/ALIGN_REVIEW.md` (ở **gốc run**, không phải `work/`) thì đọc file
   đó. Dòng `heard_differently` thường là ASR tiếng Việt nghe nhầm (`tui`→`tôi`, `nhạt`→`nhạc`), không phải lỗi giọng.
   Dòng `replace` và các từ "phải chia đều thời gian" có mốc kém tin cậy: ghi các từ đó cùng giây vào mục "Căn mốc"
   của `docs/QA.md`, và đừng đặt hiệu ứng mạnh đúng vào mốc của chúng. Không sửa tay `voice_timeline.json`.
4. **Làm liền bước 1 tới bước 9 ở §3**, tuân §1. Không dừng giữa chừng để hỏi: chỗ nào lời và tài liệu không nói
   thì chọn phương án an toàn nhất và ghi lý do vào `docs/BRIEF.md`.
5. **Mở xem ảnh thật bằng công cụ đọc ảnh**: `work/catalog.png`, mọi `pre-sheet-*.png` và `sheet-*.png`. Đọc tên file
   hay kết quả JSON không thay được việc nhìn ảnh.
6. **Báo cáo cuối** bằng tiếng Việt, ngắn: một trạng thái `PASS`/`PARTIAL`/`BLOCKED` (nghĩa ở bước 9), đường dẫn hai
   MP4, dòng tóm tắt `qa.py` của mỗi khung (lỗi, cảnh báo, LUFS, chuyển động mỗi 5 giây), giọng do ai tạo (có sẵn
   hay `vieneu_tts.py`), nhạc có sẵn hay `chiptune.py`, và **đúng 3 điểm yếu thật** có giây cụ thể.

Đọc đủ 4 file tham chiếu **trước khi** viết dòng direction đầu tiên. Không đọc lướt, không bỏ file nào:

1. `references/CRAFT.md`: chia nhịp, chọn vai, sợi chỉ hình, bố cục, luật chữ, luật sự thật.
2. `references/MOTION.md`: hiệu ứng theo nghĩa, chuyển cảnh theo vai, camera, ngân sách nhấn, số đo tham khảo.
3. `references/DIRECTION.md`: tham chiếu đầy đủ từng trường của direction và API `dkit.py`.
4. `references/QA.md`: vòng soát, cách đọc kết quả máy, cách xem ảnh, mẫu `QA.md`.

## 1. Luật cứng

| # | Luật | Vì sao |
|---|---|---|
| 1 | Không sửa bất cứ file nào trong `SK/engine`, `SK/tools`, `SK/assets` và thư viện `{{KUDO_WORK}}/pixel-explainer/_library`. Có ý tưởng cải tiến thì ghi vào `<run>/IDEAS.md`. | Công cụ dùng chung đã kiểm chứng; sửa tại chỗ làm hỏng mọi run khác. |
| 2 | Chỉ đọc và ghi trong thư mục run được giao. Không mở, không chép từ run khác trong `{{KUDO_WORK}}/pixel-explainer/`. | Mỗi video phải do chính đạo diễn đó quyết định. |
| 3 | Không đăng, không deploy, không upload, không gọi API hay dịch vụ trả phí. | Đăng là quyền của chủ sản phẩm. |
| 4 | Không bịa: tên người, con số, trích dẫn, kết quả, logo. Chữ trên hình chỉ được lấy từ `docs/clean.txt` và `docs/meaning-argument.md`. | Video nói thay chủ sản phẩm. |
| 5 | Không sửa lời, không đổi giọng, không cắt ghép `voice.wav`. | Lời và giọng đã được duyệt. |
| 6 | Không tự chấm đạt về gu thẩm mỹ. `QA.md` ghi lỗi nhìn thấy và **đúng 3 điểm yếu thật**, kể cả khi máy báo PASS. | Máy không thấy hình vô nghĩa hay nhịp lệch; người duyệt cuối là chủ sản phẩm. |
| 7 | Cùng một lỗi sửa 2 vòng chưa hết thì dừng, viết `<run>/STUCK.md`: bằng chứng, giả thuyết đã loại, chỗ bị chặn. | Không lặp vô hạn để che việc chưa hiểu nguyên nhân. |
| 8 | Chạy lệnh bằng đường dẫn tuyệt đối. Không xoá file ngoài `<run>/work/qa-*`, `<run>/project-*`, `<run>/out`. | Thư mục làm việc có thể bị đặt lại giữa các lệnh. |

## 2. Đầu vào và đầu ra

Đầu vào trong run. Chỉ `voice.wav`, `voice_timeline.json` (theo §0 bước 3) và `music.wav` (theo bước 6) được tạo
khi thiếu; các file còn lại phải có sẵn và không được tạo lại:

| File | Nội dung |
|---|---|
| `docs/clean.txt` | Lời đọc đã duyệt, nguyên văn. |
| `docs/meaning-argument.md` | Luận điểm, cơ chế, bằng chứng, ranh giới: những gì được phép nói và vẽ. |
| `docs/performance.txt` | Lời có dấu ngắt `/` và `//`, dùng làm cụm phụ đề và chia câu khi tạo giọng. Không sửa. |
| `docs/owner-decision.json` | Chỉ cần khi phải tạo giọng: ghi người dùng duyệt nguyên văn `clean.txt` (§0 bước 3). |
| `work/voice.wav` | Giọng đã thu, bắt đầu ở giây 0 của file. |
| `work/voice_timeline.json` | Mốc từng từ: `words[i] = {text, start_ms, end_ms}`. |
| `work/music.wav` | Nhạc nền (nếu thiếu, xem bước 6). |

Đầu ra phải có:

| File | Ghi chú |
|---|---|
| `docs/BRIEF.md` | Bảng nhịp + sợi chỉ hình + bố cục hai khung (bước 3). |
| `direction.py` | Kịch bản cảnh, viết bằng `dkit.py`. |
| `work/direction-doc.json`, `work/direction-ngang.json` | Do `direction.py` sinh ra. |
| `out/<tên>-doc-9x16.mp4`, `out/<tên>-ngang-16x9.mp4` | Video hoàn chỉnh. |
| `work/qa-<o>-pre.json` (trước render), `work/qa-<o>.json` (sau render), ảnh tổng hợp trong `work/qa-<o>/` | Do `qa.py` sinh ra; `<o>` là `doc` hoặc `ngang`. |
| `docs/QA.md` | Báo cáo soát theo mẫu trong `references/QA.md`. |

## 3. Trình tự

Mỗi bước có điều kiện qua. Chưa qua thì không sang bước sau.

### Bước 1: đọc lời và nghĩa

Đọc trọn `clean.txt`, `meaning-argument.md`, `performance.txt`. Viết ra (trong đầu BRIEF) một câu: *người xem phải
hiểu gì sau video*, và lời hứa ở câu mở đầu được trả ở câu nào.

In mốc thời gian để chia nhịp theo giọng thật, không theo ước lượng:

```bash
python3 -c "import json;W=json.load(open('<run>/work/voice_timeline.json'))['words'];[print(f\"{i:4d} {w['start_ms']/1000+0.5:7.2f} {w['text']}\") for i,w in enumerate(W)]"
```

Cột giây đã cộng `offset` 0,5 giây (giọng vào sau nhạc nửa giây), khớp với `T()` trong `dkit.py`.

### Bước 2: xem kho hình bằng mắt

```bash
python3 $SK/tools/catalog.py --run <run> --sheet <run>/work/catalog.png
```

Mở `catalog.png` và **nhìn từng sprite**. Tên sprite không cho biết hình trông thế nào. Ghi lại: sprite nào là
mô hình (`model`, có layer `node:*`/`edge:*` để spotlight), nhân vật (`actor`, có tag hoạt cảnh), vật dựng
(`draw`, có layer hiện dần), vật tĩnh (`still`).

Thiếu hình cần cho một ý quan trọng thì vẽ thêm theo `references/CRAFT.md` §8. Không thiếu thì dùng kho.

### Bước 3: viết `docs/BRIEF.md`

Bắt buộc có sáu phần (mẫu bốn phần đầu trong `references/CRAFT.md` §9):

1. **Bảng nhịp**: `| nhịp | lời (rút gọn) | giây | vai | hình | hiện | chuyển cảnh | hiệu ứng mang nghĩa | vì sao |`.
   Cột "vì sao" nói *nghĩa* của lựa chọn, không nói "cho sinh động".
2. **Sợi chỉ hình**: 1–2 vật xuất hiện lại và biến đổi theo mạch lời (dựng → gọi lại → biến đổi → đóng vòng).
3. **Bố cục hai khung**: mỗi nhịp đặt hình thế nào ở dọc và ở ngang, kèm vật chính chiếm bao nhiêu khung.
4. **Bảng tên riêng**: `| tên trong lời | giây gọi tên lần đầu | sprite | nhãn |` cho mọi người, đội, sản phẩm,
   công cụ lời gọi tên. Ô sprite không được trống (`CRAFT.md` §5).

5. **Hook 2 giây đầu**: kiểu hook (một trong năm kiểu ở `references/HOOK.md`), vật chính ở khung 0, cú nổ ≤ 0,6 s.
6. **Nhạc**: style (`references/MUSIC.md`) và mốc `--sections` theo bảng nhịp.

Qua bước khi: đủ 4 vai, có ≥ 3 cảnh `model` dùng archetype khác nhau (nếu lời có đủ khái niệm có cấu trúc),
không nhịp nào là danh sách thẻ, mọi chữ trên hình truy được về `clean.txt` hoặc `meaning-argument.md`, mọi câu then
chốt có vật đang làm điều câu đó nói, mọi tên riêng có sprite.

### Bước 4: viết `direction.py`

```python
import sys; sys.path.insert(0, "{{KUDO_HOME}}/skills/pixel-explainer/tools")
from dkit import *
init(__file__)

def scenes(o):        # o = "doc" hoặc "ngang"
    ...
    return [scene(...), ...]

write(scenes)
```

Mọi mốc thời gian lấy bằng `T("cụm từ")` / `TE("cụm từ")`, không gõ số giây tay. Mọi toạ độ là ô lưới
(1 ô = 6 px). Chi tiết từng trường: `references/DIRECTION.md`. Cách chọn hiệu ứng: `references/MOTION.md`.

```bash
python3 <run>/direction.py
python3 $SK/tools/validate.py <run>
```

Qua bước khi: `validate.py` báo **0 LỖI** ở cả hai khung. Mỗi CẢNH BÁO còn giữ phải có lý do ghi vào `QA.md`.
Ba cổng hình là LỖI: `hình đứng` (> 4 giây chỉ đổi chữ), `nhãn không hình`, `cast` (tên riêng nhắc mà không thấy vật;
khai bằng `write(scenes, cast={...})`).
Khoảng trống không có sự kiện hình mới **> 5 giây là LỖI** (chuẩn skill, chặt hơn spec 8 giây).
Cổng hook là LỖI: khung đầu trống (không có hình ≤ 0,15 s) hoặc thiếu cú nổ ≤ 0,6 s (`references/HOOK.md`).
Ảnh thật (chụp video tác giả, ảnh nguồn) dùng item `photo` / `P(...)`; file đặt trong `<run>/assets/`.

### Bước 5: trộn âm

```bash
python3 $SK/tools/mix.py <run> doc
python3 $SK/tools/mix.py <run> ngang
```

`mix.py` tự sinh SFX từ direction (pop, đóng dấu, vút khi chuyển cảnh, tích theo bộ đếm…). Không thêm SFX tay.
Mặc định nhạc tự hạ khi giọng nói (ducking: −8 dB lúc nghỉ, −19 dB dưới giọng). Nhạc phẳng kiểu cũ: `--music-vol 0.10`.
Qua bước khi: in `PASS` (−14 ±1 LUFS, đỉnh ≤ −1 dBFS, SFX thấp hơn giọng ≥ 12 dB).

### Bước 6: (chỉ khi thiếu `work/music.wav`) tạo nhạc

```bash
python3 $SK/tools/bgm.py <run>/work/music.wav --duration <dur> --style chiptune --sections 0:drive,<giây>:calm,<giây>:lift,<giây>:drive,<giây>:break,<giây>:drive,<giây>:outro
```

`--style` theo hình: `chiptune` (pixel), `synthpop` (flat/vector), `lofi` (tâm sự, chậm) — bảng ở `references/MUSIC.md`.
Nhạc luôn có hit ở 0 giây (hook âm thanh) và riser trước mỗi `drive`. `chiptune.py` cũ vẫn chạy được.

`<dur>` lấy từ dòng `dur` mà `direction.py` in ra. Mốc đổi đoạn đặt ở ranh giới cụm ý của lời. Chạy lại bước 5.

### Bước 7: build và soát trước render

```bash
python3 $SK/engine/build.py --run <run> --orient doc --out <run>/project-doc --audio <run>/work/mix-final-doc.wav
python3 $SK/engine/build.py --run <run> --orient ngang --out <run>/project-ngang --audio <run>/work/mix-final-ngang.wav
python3 $SK/tools/qa.py <run> doc --no-video
python3 $SK/tools/qa.py <run> ngang --no-video
```

`qa.py --no-video` mở project bằng Chrome không giao diện, quét cả video mỗi 0,1 giây: chữ tràn khung, chữ chồng
chữ, chữ sát chữ, **vật đè vật** (chữ hoặc vật che điểm ảnh của vật khác; nhân vật bị che đầu, người đè người, mô hình
che người), lỗi console, tua xuôi/ngược lệch hình, **độ đầy khung** (hình phủ bao nhiêu vùng nội dung). Nó ghi ảnh
tổng hợp `work/qa-<o>/pre-sheet-*.png` và, khi có chồng lấn, `work/qa-<o>/overlap-sheet-*.png` (khung tại lúc nặng
nhất của mỗi mục chồng lấn).

**Mở xem từng ảnh tổng hợp** theo giao thức `references/QA.md` §3.

**Tự soát vật đè vật** (`references/QA.md` §2.1): mở từng ảnh `overlap-sheet`, với mỗi mục LỖI/cảnh báo chồng lấn
thì sửa (dời vật hoặc nhãn ra chỗ trống, nhãn cách nhau ≥ 2 block, không đặt chữ/vật lên đầu hay người nhân vật,
không đặt người sau mô hình), hoặc ghi lý do giữ vào `QA.md`. `over: True` chỉ dành cho chồng có chủ ý mà vật dưới
vẫn nhận ra, và chỉ khai sau khi đã xem ảnh.

Thấy lỗi thì sửa `direction.py`, chạy lại từ bước 4. Qua bước khi: `qa.py` PASS ở cả hai khung, đã xem hết ảnh tổng
hợp và ảnh chồng lấn mà không còn lỗi nhìn thấy, mỗi cảnh báo chồng lấn còn giữ có lý do, **và** bảng soát nhịp
(`references/QA.md` §3) đã điền đủ, không còn ô "không", ba nhịp yếu nhất đã được nâng.

### Bước 8: render và soát MP4 thật

```bash
mkdir -p <run>/out
cd <run>/project-doc && npx --yes hyperframes@0.8.135 render -f 30 -q delivery -o ../out/<tên>-doc-9x16.mp4
cd <run>/project-ngang && npx --yes hyperframes@0.8.135 render -f 30 -q delivery -o ../out/<tên>-ngang-16x9.mp4
python3 $SK/tools/qa.py <run> doc <run>/out/<tên>-doc-9x16.mp4
python3 $SK/tools/qa.py <run> ngang <run>/out/<tên>-ngang-16x9.mp4
```

Mỗi lần render mất vài phút và ra file khoảng 40–50 MB. Đĩa máy còn ít: không render thử nhiều bản; xoá MP4 hỏng
của chính run trước khi render lại.

`qa.py` có MP4 sẽ đo thêm thông số, độ to, độ chuyển động và trích khung thật ra `work/qa-<o>/sheet-*.png`.
**Mở xem từng ảnh** lần nữa: khung trích từ MP4 mới là thứ người xem thấy.

### Bước 9: viết `docs/QA.md` và báo cáo

Theo mẫu `references/QA.md` §5. Báo cáo cuối ghi đúng một trạng thái: `PASS` (mọi cổng máy đạt, đã xem hết ảnh,
còn chờ chủ sản phẩm duyệt gu), `PARTIAL` (có video dùng được nhưng còn cổng chưa đạt) hoặc `BLOCKED`.

## 4. Sai lầm thường gặp (đã xảy ra thật)

| Sai lầm | Hậu quả | Cách tránh |
|---|---|---|
| Hai nhãn hiện cùng lúc, đặt sát nhau | Tem đè lên bong bóng; chữ chồng chữ; hai tấm dính nhau | Trước khi thêm nhãn, liệt kê nhãn nào còn trên màn hình ở giây đó; cho nhãn cũ `out` hoặc đặt cách ≥ 2 block. `qa.py` LỖI `chữ sát chữ` khi khe 0. |
| Mô hình lớn đặt chồng lên chỗ nhân vật đứng; nhãn đặt ngang đầu người | Tháp đè người suốt 11 giây; chữ che mặt người (bản Antigravity 13/10) | Trước khi đặt vật, liệt kê vật nào còn trên màn hình; mô hình và người chia hai vùng. `qa.py` LỖI `che N% phần đầu nhân vật`, `người đè người`; xem `overlap-sheet` (`QA.md` §2.1). |
| Tem (`plate: "stamp"`) đặt sát mép, `align` lệch | Cú dập ×1,6 tràn khung | Đặt tem gần giữa vùng nội dung; tem không dùng `align`. |
| Chữ trần (`plate: "outline"`) đặt lên sprite | Chữ chìm vào hình | Dùng `dark` hoặc dời ra nền trống. |
| Mô hình có layer `base` mà không khai trong `layers` | Khung nền hiện sẵn từ giây 0 | Luôn khai `"base": {"at": …, "reveal": …}`. `validate.py` bắt lỗi này. |
| Mô hình chiếm hết bề ngang vùng nội dung | Spotlight phóng ×1,167 đẩy tầng đáy ra ngoài | Bề ngang mô hình ≤ 85% bề ngang vùng nội dung. |
| Sprite nhỏ giữa khung lớn | Khung trống, người xem không biết nhìn đâu | Vật chính của cảnh dùng `scale` 2–3 ở khung dọc khi sprite nhỏ hơn 50 ô. |
| Rải hiệu ứng đều theo đồng hồ | Nhìn như trình chiếu tự động, không có điểm nhấn | Mỗi hiệu ứng gắn đúng một cụm từ; tem và punch chỉ ở câu chốt (`references/MOTION.md` §4). |
| Chép mật độ của ví dụ trong tài liệu | Video thưa, có khoảng chết | Mật độ đến từ lời: mỗi cụm từ mang hình đều có một sự kiện; xem số đo tham khảo ở `MOTION.md` §6. |
| Ghi tên, số, trích dẫn "cho thật" | Sai sự thật trên video của người khác | Chỉ dùng chữ có trong `clean.txt` / `meaning-argument.md`. |
| Tự viết "đạt", "đẹp", "mượt" trong `QA.md` | Che lỗi, người duyệt mất lòng tin | Ghi lỗi có giây cụ thể và 3 điểm yếu thật. |
| Vật cỡ khung dọc đặt giữa khung ngang; người nhỏ giữa nền | Giám khảo chấm "khung trống, như bản nháp" | Cổng độ đầy của `qa.py` là LỖI, không phải gợi ý (`CRAFT.md` §7). |
| Câu then chốt chỉ hiện một tấm nhãn | Câu quan trọng nhất lại yếu hình nhất | Vật làm đúng điều câu đó nói (`CRAFT.md` §5). |
| Lời gọi tên người/đội mà hình không có người, hoặc có người không tên | Người xem không biết ai đang được nói tới | Sprite + nhãn tên đúng chữ trong lời, cùng lúc lời gọi tên. |
| Tem xanh cho "thất bại", "tuyệt vọng" | Màu nói ngược nghĩa | `style=STAMP_BAD`. |
| Mô hình trung tâm rã khi lời còn dùng; kết bằng chữ trên nền trống | Sợi chỉ đứt | Giữ mô hình, `spot` vào phần đang nói; kết gọi lại vật chính (`CRAFT.md` §4). |
| Vật nhỏ, cảnh chỉ có nhãn đổi chữ; tên riêng nhắc mà không thấy vật | Giám khảo chấm "trình chiếu", "nghe một đằng thấy một nẻo" | `validate.py` LỖI `nhãn không hình`, `hình đứng`, `cast`; `qa.py` LỖI `khung thưa` (`CRAFT.md` §5, §7). |
| "Hai cấu trúc" mà chỉ một vật; ký hiệu `≠` không có trong lời | Hình nói sai lời | Số vật bằng số trong lời; ký hiệu chỉ khi lời có quan hệ đó (`CRAFT.md` §5, §6). |
| Nhãn khung ngang dồn sát mép phải, xa hình | Mắt phải nhảy qua lại, không biết nhãn gọi vật nào | `qa.py` LỖI `nhãn xa vật`; đặt nhãn cạnh vật (`CRAFT.md` §7). |
| Ghi "ví dụ tự soạn", "giả thuyết" lên hình | Người xem đọc chữ lời không nói | Không gắn nhãn siêu dữ liệu (`CRAFT.md` §6). |
