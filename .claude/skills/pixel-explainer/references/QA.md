# QA: soát trước khi bàn giao

Máy bắt được lỗi đo được (tràn khung, chồng chữ, độ to, khoảng chết). Máy **không** thấy hình vô nghĩa, chữ xấu, nhịp
lệch lời, hay hiệu ứng rối. Vì thế mọi vòng soát kết thúc bằng **mở và nhìn ảnh thật**.

## 1. Vòng soát

| Sau khi | Chạy | Qua khi |
|---|---|---|
| Viết hoặc sửa `direction.py` | `python3 <run>/direction.py` rồi `python3 $SK/tools/validate.py <run>` | 0 LỖI ở cả hai khung; mỗi cảnh báo còn lại có lý do ghi trong QA.md |
| validate qua | `python3 $SK/tools/mix.py <run> doc` và `… ngang` | in PASS; khoảng cách giọng–SFX ≥ 12 dB |
| mix qua | `build.py` ×2 rồi `python3 $SK/tools/qa.py <run> doc --no-video` và `… ngang --no-video` | PASS; **đã mở xem mọi `pre-sheet-*.png`** |
| pre-sheet ổn | render MP4 ×2 rồi `python3 $SK/tools/qa.py <run> doc <run>/out/<tên>-doc-9x16.mp4` (và ngang) | PASS; **đã mở xem mọi `sheet-*.png`** |

Sửa một lỗi xong thì chạy lại từ dòng tương ứng trở xuống. Đĩa còn ít: chỉ render MP4 khi pre-sheet đã sạch.

## 2. Đọc kết quả máy

**validate.py**

- `LỖI`: phải sửa. Tên trường sai, sprite/layer/tag không có, chữ < 64, nhãn ngoài vùng nội dung, khoảng không có sự
  kiện hình > 5 giây, `dur` ngắn hơn giọng…, và ba cổng hình:
  - `hình đứng`: > 4 giây chỉ đổi chữ, camera, hiệu ứng → cho vật lời đang nói tới hiện, rời, đổi layer, `spot`, `anim`.
  - `nhãn không hình`: nhãn hiện/đổi chữ mà không vật nào đổi trong [−0,6; +1] giây → đưa nhãn về cùng lúc với vật của
    nó, hoặc thêm `spot`/layer đúng phần nhãn gọi tên.
  - `cast`: tên riêng chưa khai, hoặc lời nhắc tên mà không thấy vật → khai `cast`, đưa vật vào cảnh đúng lúc nhắc.
- `CẢNH BÁO`: đọc từng dòng. Sửa nếu đúng là lỗi; giữ thì ghi lý do. Các cảnh báo hay gặp:
  - `nhịp hình: X giây chỉ có chuyển động nền` → tìm cụm từ trong khoảng đó cần hình, thêm sự kiện mang nghĩa.
  - `punch/shake/tem lệch đầu từ` → neo lại vào `T("cụm")`.
  - `súp hiệu ứng` → bỏ bớt, giữ cái mang nghĩa nhất.
  - `nhãn outline đặt trên sprite` → đổi `plate` hoặc dời nhãn ra ngoài sprite.
  - `một kiểu chuyển cảnh chiếm > 50%` → chọn lại theo bảng ở `MOTION.md` §3.
  - `cảnh X giây không có vật sống` → thêm `bob` cho vật tĩnh, `anim` theo động từ, `flow` trên cạnh, `emit` theo
    không khí (`MOTION.md` §1.4). Chỉ giữ khi cảnh cố ý đứng lặng, và ghi lý do.
- Dòng tóm tắt cuối (`events`, `max_gap`, `tin`, `plates`, `roles`) dùng để tự kiểm mật độ và độ đa dạng.

**mix.py**: in độ to tích hợp, đỉnh, khoảng cách giọng–SFX. FAIL thường do quá nhiều SFX dồn một chỗ: bớt sự kiện
hình ở đó, không hạ giọng.

**qa.py** (in ra màn hình và ghi `work/qa-<o>-pre.json` / `work/qa-<o>.json`):

| Dòng | Nghĩa | Sửa |
|---|---|---|
| `label/headline '…' lệch N px khỏi vùng nội dung` | chữ tràn khung | dời x/y, giảm chữ, xuống dòng, hoặc đặt `align` |
| `sprite '…' lệch N px khỏi vùng an toàn` | vật tràn khung | giảm scale, dời; mô hình có spot giữ bề ngang ≤ 85% |
| `… chỉ trong lúc punch/shake` | lệch tạm khi camera giật | giảm `amt`/`amp` hoặc dời `gx, gy` |
| `chữ chồng chữ: 'A' × 'B' (giây…, phủ N%)` | hai nhãn cùng lúc chạm nhau | cho nhãn cũ `out` trước, hoặc dời một nhãn |
| `chữ sát chữ: 'A' × 'B' khe N block` | hai nhãn cùng lúc, khe giữa hai tấm < 2 block | giãn ≥ 2 block, cho nhãn cũ `out`, hoặc gộp thành một nhãn |
| `chữ che vật`, `vật che vật` | chữ hoặc vật vẽ sau che điểm ảnh của vật dưới | xem §2.1 |
| `tua ra hình khác nhau` | hiệu ứng ngẫu nhiên không có `seed` | thêm `seed` cho burst/emit |
| `console: …`, `lỗi JS` | engine không vẽ được | đọc thông báo; thường do trường sai kiểu |
| `đứng yên ≥ 2 giây`, `cửa sổ 5 giây ít chuyển động` | khoảng chết trong MP4 | thêm sự kiện mang nghĩa ở giây đó |
| `vật nhỏ, khung trống X–Y giây` | hình phủ quá ít vùng nội dung | `scale` lớn hơn, thêm vật lời đang nói, giữ vật chính của cảnh trước (`CRAFT.md` §7) |
| `khung chỉ có chữ X–Y giây` | nhịp chỉ có nhãn, không có hình | đặt vật đang làm điều câu đó nói (`CRAFT.md` §5) |
| `vật nhỏ chiếm N% thời lượng` | khung trống rải khắp video | xem lại bố cục và `scale` của mọi cảnh, nhất là khung ngang |
| `khung thưa X–Y giây` | điểm ảnh sprite quá ít dù hộp sprite to: vòng rỗng, tầng lẻ, vật mới hiện một mảnh | phóng to vật đặc, hiện thêm phần lời đang nói; câu mở phải có vật chính lớn ngay |
| `khung gần như chỉ có chữ` | không sprite, hoặc sprite tí hon | như `khung chỉ có chữ` |
| `nhãn xa vật: N% thời gian…` | nhãn đứng xa vật nó gọi tên | dời nhãn sát vật (trên, dưới, cạnh, cách 2–6 ô) |
| `độ phủ trung vị N%` | cả video thưa hình | như trên; khung ngang phải lấp cả hai nửa |
| `… LUFS`, `đỉnh` | độ to sai | chạy lại mix.py, build lại với `--audio` đúng file |

Lỗi chồng chữ dưới ngưỡng máy (phủ < 10%) vẫn có thể nhìn thấy: §3 sẽ bắt.

### 2.1. Tự soát vật đè vật

Máy đo chồng lấn theo **điểm ảnh đục** (không theo hộp chữ nhật) mỗi 0,1 giây; một mẫu là 0,1 giây. "Phần đầu" là
40% hàng trên của vật bị che. Vai (`role`) lấy từ manifest thư viện: `actor` (nhân vật: anh-em, kudo, phan-viet, tui),
`still`, `draw`, `model`; chữ có vai `text`.

| Trường hợp | LỖI khi | cảnh báo khi |
|---|---|---|
| chữ chồng chữ | phủ ≥ 10%, kéo dài ≥ 3 mẫu | còn lại |
| chữ sát chữ | khe 0 block, ≥ 3 mẫu | khe 1 block |
| nhân vật bị che đầu (chữ hoặc vật) | đầu bị che ≥ 20% trong ≥ 5 mẫu | đầu bị che ≥ 25% thoáng qua |
| nhân vật đè nhân vật | che ≥ 10% trong ≥ 5 mẫu | 3–4 mẫu |
| dấu đánh (`dau-*`, `o-khoa`) đặt lên vật không phải nhân vật; hai bản của cùng sprite (xấp giấy) | không | che ≥ 10% trong ≥ 3 mẫu |
| nhân vật đứng trên mô hình (Kudo ở tâm quỹ đạo) | không | che ≥ 10% trong ≥ 3 mẫu |
| nhãn đặt trên mô hình, che < 50% (tên tầng tháp, miệng phễu) | không | che ≥ 10% trong ≥ 3 mẫu |
| mọi chữ che vật, vật che vật khác | che ≥ 25% trong ≥ 5 mẫu | che ≥ 10% trong ≥ 3 mẫu |

`qa.py --no-video` chụp một khung tại lúc nặng nhất của mỗi mục LỖI/cảnh báo chồng lấn và ghép thành
`work/qa-<o>/overlap-sheet-*.png` (góc mỗi khung ghi giây và `LOI`/`canh bao`; tra giây đó trong danh sách in ra để biết
vật nào che vật nào). **Mở từng ảnh**, với mỗi mục:

1. Nhìn thấy đè thật không? Người xem có còn nhận ra vật dưới (mặt người, laptop, bóng đèn) không?
2. Đè thật thì sửa trong `direction.py`, theo thứ tự ưu tiên:
   - Dời vật hoặc nhãn ra chỗ trống (nhãn cạnh vật, cách 2–6 ô; mô hình lớn thì dời người sang bên, không đặt người
     sau mô hình).
   - Không đặt chữ hoặc vật lên đầu, lên người nhân vật. Bong bóng thoại đặt **trên đầu**, đuôi chỉ xuống.
   - Hai nhãn cùng lúc: cách nhau ≥ 2 block, hoặc cho nhãn cũ `out` trước khi nhãn mới hiện.
   - Vật mới đè vật cũ: cho vật cũ `out` hoặc `move` đi trước.
3. Cố ý chồng (vật cầm trên tay, hình trên màn hình laptop, dấu tích đóng lên giấy) và vật dưới vẫn nhận ra: giữ, khai
   `over: True` ở vật/nhãn nằm trên nếu máy báo LỖI, và ghi một dòng lý do vào bảng "Cảnh báo còn giữ" của `QA.md`.
   Không khai `over` để tắt lỗi khi chưa xem ảnh.
4. Chạy lại `qa.py --no-video` sau khi sửa; mở lại ảnh chồng lấn mới.

## 3. Giao thức xem ảnh

Ảnh tổng hợp có một khung mỗi 2 giây cộng mọi mốc nhấn (P = punch, S = shake, T = tem, C = giữa chuyển cảnh), giây ghi
ở góc. Mở **từng** ảnh bằng công cụ đọc ảnh, xem từng khung, và với mỗi khung trả lời:

1. **Đọc được không?** Chữ đủ to, tương phản đủ, không bị hiệu ứng che, không cắt mép, không tràn tấm.
2. **Có chồng không?** Nhãn chạm nhãn, nhãn đè vật, vật đè đầu người, mô hình che người, tem đè bong bóng, pháo giấy
   che chữ. Máy chỉ bắt chồng lấn vượt ngưỡng (§2.1); chồng nhẹ hơn mà nhìn thấy vẫn là lỗi.
3. **Có trống không?** Khung chỉ có một vật nhỏ giữa nền, hoặc nửa khung trống không có lý do.
4. **Có khớp lời không?** Tra `voice_timeline.json` xem giây đó đang đọc gì. Hình có đang nói đúng điều đó không, hay
   đang trễ/sớm một ý?
5. **Có nhịp không?** So với khung trước: có gì mới không? Nhấn (P/S/T) có rơi đúng câu chốt không?
6. **Hai khung có cùng chất lượng không?** Bố cục ngang có thật sự xếp trái–phải, hay chỉ là bản dọc bị kéo?

7. **Vật chính có to không?** Vật lời đang nói chiếm ít nhất nửa bề ngang vùng nội dung, không phải một chấm giữa nền.

**Bảng soát nhịp (bắt buộc trước khi render).** Sau khi xem ảnh, lập bảng một dòng cho mỗi nhịp trong `docs/QA.md`:

| Nhịp | Giây | Lời nói gì (cụm chính) | Hình có gì lúc đó | Số trong lời = số vật? | Tên riêng có vật? | Hiệu ứng mạnh mang nghĩa gì |
|---|---|---|---|---|---|---|

Điền bằng điều **nhìn thấy trong ảnh**, không chép từ direction. Dòng nào có ô "không", hoặc ô "hình có gì" chỉ là
nhãn đổi chữ, hoặc hiệu ứng mạnh không trả lời được "vì lời nói gì" → sửa nhịp đó rồi chạy lại. Sau đó chọn ba nhịp
yếu nhất (người xem dễ chán, dễ hiểu sai, hình nghèo nhất) và nâng từng nhịp một lần nữa trước khi render.

Thấy nghi ngờ ở giây nào thì trích khung đúng giây đó ở kích thước thật để soi:

```bash
/opt/homebrew/bin/ffmpeg -v error -y -ss 21.0 -i <run>/out/<tên>-doc-9x16.mp4 -frames:v 1 <run>/work/qa-doc/soi-21.0.png
```

Ghi mọi lỗi nhìn thấy kèm giây vào QA.md, sửa, chạy lại. Không ghi "đã xem" nếu chưa mở ảnh.

## 4. Lỗi máy không bắt mà hay gặp

- Nhãn và phụ đề nói y hệt nhau (chép lời thay vì gắn tên cấu trúc).
- Một cảnh dài chỉ đổi nhãn, vật đứng yên.
- Mô hình hiện cả khối rồi mới nói từng phần.
- Hiệu ứng nhấn ở câu không quan trọng, câu chốt lại không có gì.
- Nhân vật làm động tác không khớp động từ.
- Sợi chỉ hình bị bỏ giữa chừng, cảnh cuối không gọi lại.
- Chữ trên hình có tên, số, câu không có trong lời.
- Lời gọi tên người, đội, sản phẩm mà hình không có sprite kèm nhãn tên đó.
- Mô hình trung tâm rã trong khi lời còn nói về nó.
- Tem xanh trên chữ mang nghĩa xấu.
- Nhãn đang gõ dở thì cảnh chuyển; mảnh chữ vỡ còn sót sau chuyển cảnh.

## 5. Mẫu `docs/QA.md`

```markdown
# QA: <tên video>

## Kết quả máy
| khung | validate | mix (LUFS / đỉnh / giọng–SFX) | qa pre | qa mp4 (LUFS / đỉnh / đứng yên dài nhất / hoạt động min–trung vị) |
|---|---|---|---|---|
| dọc | 0 lỗi, N cảnh báo | … | PASS | … |
| ngang | … | … | … | … |

## Cảnh báo còn giữ
| cảnh báo | vì sao giữ |
|---|---|

## Lỗi nhìn thấy khi xem ảnh
| khung | giây | lỗi | đã sửa? |
|---|---|---|---|

## Bảng soát nhịp
| Nhịp | Giây | Lời nói gì | Hình có gì | Số = số vật? | Tên có vật? | Hiệu ứng mạnh mang nghĩa gì |
|---|---|---|---|---|---|---|

Ba nhịp yếu nhất đã nâng: <nhịp, trước → sau>

## Ba điểm yếu thật còn lại
1. <giây, khung, điểm yếu cụ thể>
2. …
3. …

## Tám cổng
| cổng | bằng chứng | đạt? |
|---|---|---|
```

Luật viết QA.md:

- Chỉ ghi điều đã đo hoặc đã nhìn. Số lấy từ JSON, không ước lượng.
- **Đúng ba điểm yếu thật**, cụ thể tới giây. "Không có điểm yếu" không được chấp nhận.
- Không tự khen ("đẹp", "chuyên nghiệp", "ấn tượng", "hoàn hảo"). Gu do người duyệt quyết định.

## 6. Tám cổng nghiệm thu

| # | Cổng | Bằng chứng cần ghi |
|---|---|---|
| 1 | Hình là mô hình pixel và cảnh có vai; không có danh sách thẻ | đếm vai từ validate (`roles`); nhìn ảnh |
| 2 | Mỗi cảnh `model` thuộc một archetype, không lặp archetype ngoài cảnh gọi lại | bảng nhịp trong BRIEF |
| 3 | Chữ trên hình ≥ 64 px; phụ đề 36–40 px (engine tự đặt) | validate `sizes` |
| 4 | Spotlight phóng ×1,167 bằng lò xo trên node đang nói | số cảnh có `spot`; khung ảnh có spot |
| 5 | Có sự kiện hình mới ít nhất mỗi 5 giây | validate `max_gap`; qa mp4 đứng yên dài nhất |
| 6 | Giọng kèm nhạc từ giây 0, có fade; nhạc 0,08–0,11; SFX thấp hơn giọng ≥ 12 dB | mix json |
| 7 | Chữ trong vùng nội dung, vật trong vùng an toàn, không vật đè vật, hai khung | qa PASS cả hai khung; đã mở `overlap-sheet`, mỗi cảnh báo chồng lấn còn giữ có lý do |
| 8 | Đã xem mọi ảnh thật; gu do người duyệt quyết | danh sách ảnh đã mở; ghi "chờ người duyệt" |

Cổng 8 không bao giờ tự đánh "đạt" bằng máy. Báo cáo cuối ghi rõ: đã xem ảnh, chờ người duyệt gu.
