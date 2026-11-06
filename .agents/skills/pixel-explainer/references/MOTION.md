# MOTION: hiệu ứng chuyển động có nghĩa

Video pixel đẹp không nhờ nhiều hiệu ứng mà nhờ **mỗi hiệu ứng đến đúng lúc lời nói cần nó**. File này nói nên dùng
hiệu ứng nào cho nghĩa nào, và giới hạn bao nhiêu. Cú pháp từng trường ở `DIRECTION.md`.

## 1. Năm nguyên tắc

1. **Hiệu ứng mang nghĩa.** Mỗi hiệu ứng trả lời câu "vì sao nó ở đây": vì lời vừa gọi tên vật, vì lời vừa chốt, vì
   lời vừa phủ định. Không trả lời được thì bỏ. Thời điểm lấy từ `T("cụm từ")`, không gõ số giây tay.
2. **Chuyển cảnh theo vai của chỗ nối** (§3), không theo vòng xoay.
3. **Nhấn mạnh hiếm và đúng chỗ.** Punch, shake, tem chỉ ở câu chốt. Chữ luôn thắng camera: camera không được làm
   chữ ra ngoài khung hoặc rung khi người xem đang đọc câu dài.
4. **Vật phải sống.** Không có vật đứng im như ảnh dán: nhân vật chạy hoạt cảnh `idle`, vật tĩnh có `bob` nhẹ, mô
   hình có dòng năng lượng (`flow`) chạy trên cạnh khi lời nói về quan hệ giữa các phần. `validate.py` cảnh báo
   cảnh ≥ 3,5 giây không có vật sống nào (`idle`, `bob`, `move`, `anim`, `flow`, `emit`, ring có `every`); dòng
   tóm tắt `life` đếm từng loại. Video chỉ có `idle` và `anim` mà không `bob`, `move`, `emit` là video gần tĩnh.
5. **Âm thanh đi theo hình.** SFX do `sfx.py` tự sinh từ direction (chuyển cảnh, pop, tem, burst, ring, arrow, punch,
   shake), luôn thấp hơn giọng ≥ 12 dB. Muốn có tiếng ở một chỗ thì đặt sự kiện hình ở đó; muốn bớt tiếng thì bớt
   sự kiện.

## 2. Nghĩa → hiệu ứng

| Lời đang làm gì | Hiệu ứng | Ghi chú |
|---|---|---|
| Gọi tên một vật nhỏ, một dấu hiệu | `reveal: "pop"` | Pop có ring; scale ≥ 2 thì thêm tia lửa. Nhiều vật liền nhau thì cách 0,15–0,3 giây, tiếng bíp cao dần |
| Dựng một thứ từ đầu, "xây", "tạo ra" | `reveal: "trace"` (0,8 giây) hoặc layer hiện lần lượt | Hợp với `draw` và mô hình |
| Một ý, một người, một khoảnh khắc "à ra thế" | `reveal: "bloom"` | Tự kèm sao |
| Tài liệu, trang, dữ liệu, quét | `reveal: "scan"` | |
| Ký ức, quá khứ, thứ mờ dần, thứ đang hình thành | `reveal: "dither"` hoặc `out kind dither` | |
| Một phần của cơ chế đang được nói tới | `spot` trên `node:*` | Kéo dài đúng đoạn lời nói về phần đó; phần khác tự mờ |
| Quan hệ, dòng chảy, "đi qua", "đổ về" | `flow` trên layer `edge:*`, hoặc `arrow` có `march` | Màu flow theo nghĩa: vàng = năng lượng, lime = đúng, đỏ = rò rỉ |
| Con số tăng, đếm, tích luỹ | `count` trong label hoặc `bar` có `steps` | Kết thúc đúng lúc lời đọc xong số |
| Câu chốt một cụm ý | `plate: "stamp"` | Tự kèm pháo giấy, ring, flash, shake, punch. Đừng thêm punch tay ngay đó |
| Phủ định, sai, bỏ đi | sprite `dau-x` (tự rung và bắn tia đỏ), `strike` trên nhãn, `dim` vật bị phủ định | |
| Đúng, xong, đạt | sprite `dau-tich` (tự bắn tia xanh) | |
| Sốc, vỡ, thất bại | `shake` 8–16, `burst` `dust` | |
| Bừng sáng, kết quả tốt | `burst` `star` hoặc `confetti` nhỏ (n 10–16) | Không quá 2 lần cả video ngoài tem |
| Không khí: nặng nề / ấm lên / bận rộn | đổi `bg` theo giây + `emit` `rain` / `sparkle` / `dot` | Đổi `bg` ở câu đổi tâm trạng, không đổi chỉ để lạ mắt |
| Chờ, nghĩ, lặng | `bob` + `ring` `faint` có `every` (nhớ `until`) | |
| Nhân vật làm việc | `anim [[t, "go"]]`, `[[t, "guc"]]`, `[[t, "chi"]]`… | Tag đúng động từ |
| Di chuyển, tiến tới, rời đi | `move` | 0,4–1,0 giây; ngắn hơn thì giật |
| Khoanh vùng, "chỗ này" | `frame` quanh vùng, hoặc `ring` một lần | |
| Kết video | `iris` khép vào vật hoặc từ cuối | Chỉ cảnh cuối |
| Lời đếm "một… hai… ba" hoặc đọc một con số | Vật hiện lần lượt đúng số lượng, kèm `count` | Số vật = số trong lời |
| Lời sửa một từ ("không phải A, mà là B") | `strike` lên nhãn A rồi nhãn B hiện đúng chỗ đó | Gạch rồi thay đọc nhanh hơn hai nhãn rời |
| Lời so sánh "y như…", "giống hệt…" | `arrow` có `march` nối hai vật được so | Mũi tên là chữ "y như" bằng hình |
| Lời quay lại ý đầu ("nhớ cái… lúc nãy") | Gọi lại đúng sprite, đúng bố cục của cảnh cũ bằng `pop` nhanh | Người xem nhận ra ngay, không cần giảng |

## 3. Chuyển cảnh và camera

**Chuyển cảnh (`tin`)** chọn theo quan hệ giữa cảnh trước và cảnh sau:

| Chỗ nối | Kiểu | Thời lượng |
|---|---|---|
| Ý tiếp nối, cùng mạch | `wipe` (đổi `dir` để không lặp hướng) | 0,45 |
| Rẽ ý: "nhưng", "ngược lại", "vấn đề là" | `whip` | 0,35 |
| Đi vào bên trong một cơ chế, phóng vào chi tiết | `pixelate` | 0,5 |
| Lặng xuống, chốt, chuyển sang "dựng" hoặc kết | `dither` | 0,5 |
| Đổi hẳn chương | `block` | 0,5 |
| Cảnh đầu tiên, hoặc nối liền không ngắt | `cut` | |

- Không một kiểu nào chiếm quá nửa số chỗ nối (validate cảnh báo).
- Cảnh `model` nối với cảnh `model` gọi lại cùng sprite: dùng `cut` + `camInherit` để mô hình đứng yên, chỉ đổi spot.

**Camera:**

- Mặc định để trống `cam`: engine tự đóng khung các vật đang hiện, zoom 1–1,35, chữ luôn nằm trong khung.
- `cam: "none"` cho cảnh `still` có tiêu đề lớn: khung đứng yên, chỉ trôi nhẹ (`drift`).
- `camInherit: true` khi cảnh sau tiếp tục đúng khung hình cảnh trước.
- `punch` (amt 0,03–0,10): đẩy nhẹ vào **một** chữ hoặc vật ở câu chốt. Đặt `gx, gy` vào chỗ người xem cần nhìn.
- `shake` (amp ≤ 20, dur 0,2–0,4): chỉ khi lời có va chạm, sốc, vỡ.
- `flash`: 1–2 lần cả video, cho khoảnh khắc "bừng". Tem đã có flash sẵn.

## 4. Ngân sách nhấn

Những thứ sau mạnh nên dễ thành "súp hiệu ứng". Giới hạn cho video 60–90 giây:

| Loại | Giới hạn |
|---|---|
| Tem (`stamp`) | 2–4 cả video, mỗi tem cho một câu chốt khác nhau |
| `punch` tay | ≤ 1 mỗi cảnh, ≤ 6–8 cả video, lệch đầu từ ≤ 0,35 giây |
| `shake` tay | ≤ 3 cả video |
| `flash` tay | ≤ 2 cả video |
| `headline` | 1–3 cả video |
| Hiệu ứng mạnh trong 2 giây bất kỳ (tem, punch, shake, flash, burst lớn) | < 5 (validate cảnh báo) |

- Giữa hai điểm nhấn mạnh phải có khoảng thở: đoạn chỉ có `bob`, `flow`, `spot`, chữ hiện. Nhịp mạnh–nhẹ–mạnh mới
  tạo cảm giác có ý.
- **Không để khoảng chết**: sau ≤ 3,5 giây phải có một sự kiện hình mới (vật hiện, layer hiện, spot đổi, nhãn mới,
  anim đổi, move). Hơn 5 giây là LỖI của validate. Khoảng chết thường nằm giữa cảnh dài: chèn sự kiện theo các cụm từ
  bên trong câu, không chèn hiệu ứng vô nghĩa.
- **Chữ đổi không thay được hình đổi.** Nhãn, tiêu đề, camera, burst không tính là hình mới. Hơn 4 giây chỉ đổi những
  thứ đó là LỖI `hình đứng`; nhãn hiện mà không vật nào đổi quanh nó là LỖI `nhãn không hình` (`CRAFT.md` §5).

## 5. Phản mẫu

| Thấy gì | Vì sao hỏng | Làm thay |
|---|---|---|
| Mọi vật đều `pop`, mọi cảnh đều `wipe` | Đều đều như trình chiếu | Reveal theo nghĩa (§2), chuyển cảnh theo chỗ nối (§3) |
| Hiệu ứng rơi đều mỗi 2 giây không theo lời | Người xem thấy máy đặt, không thấy ý | Neo vào `T("cụm từ")` |
| Tem ở mọi cảnh | Tem mất trọng lượng | 2–4 tem cho 2–4 câu chốt lớn |
| Pháo giấy, sao, ring cùng lúc ở một chỗ | Che chữ, rối mắt | Một hiệu ứng mang nghĩa mỗi lần |
| Camera zoom sát làm chữ bị cắt | Chữ là thông tin chính | Để camera tự động hoặc `"none"` |
| Mô hình hiện cả khối từ giây đầu | Mất cơ hội dạy từng phần | Khai `base` và hiện từng `node:*` theo lời |
| Nhân vật đứng im cả cảnh | Vật chết | Tag theo động từ, `bob` khi chờ |
| Cảnh 8 giây chỉ có một vật | Khoảng chết | Tách nhịp hoặc cho layer, spot, nhãn hiện theo cụm từ |
| Vật nhỏ giữa khung trống | Người xem không biết nhìn đâu; trông như bản nháp | `scale` lớn hơn, thêm vật lời đang nói tới (cổng độ đầy của `qa.py`) |
| Tem xanh cho chữ "thất bại", "tuyệt vọng" | Màu nói ngược nghĩa chữ | `style=STAMP_BAD` |
| Đoạn kết chỉ còn chữ trên nền | Sợi chỉ đứt, kết hụt | Gọi lại vật chính, chữ chốt đặt cạnh vật |
| Cả video không có `bob`, `move`, `emit` | Vật đứng như ảnh dán dù nhân vật có `idle` | Vật tĩnh `bob`, nhân vật `move` khi lời nói "đi", "đến"; `emit` theo không khí |
| Cột 3–4 nhãn xếp giữa khung | Danh sách thẻ trá hình | Gắn từng nhãn vào vật của nó |
| Cảnh đứng, chỉ nhãn đổi chữ vài giây | Trình chiếu, người xem thôi nhìn | Mỗi nhãn mới đi cùng một vật, layer hoặc `spot` mới |
| Lời nhắc tên mà hình không có vật của tên đó | Người xem nghe một đằng thấy một nẻo | Khai `cast`, đưa vật vào cảnh đúng lúc nhắc |
| "Hai…", "ba…" nhưng chỉ thấy một vật | Hình nói sai lời | Số vật bằng số trong lời |
| Một tầng lẻ của mô hình, một vòng tròn rỗng giữa khung | Khung thưa dù hộp sprite to | Hiện thêm phần lời đang nói, phóng to vật đặc |
| Ký hiệu `≠`, `?` không có trong lời | Người xem phải đoán | Chỉ dùng ký hiệu khi lời có đúng quan hệ đó |
| Kết ở dấu hỏi hoặc khung tối | Câu hỏi mở đầu không được trả | Gọi lại hình mở đầu ở trạng thái đã giải + tem trả lời |

## 6. Số đo tham khảo (video mẫu 85 giây)

Một video mẫu đạt chất lượng có các số sau. **Đây không phải chỉ tiêu và không được chép.** Mật độ đúng đến từ lời
của video bạn đang làm. Dùng bảng này để tự kiểm: nếu video của bạn lệch rất xa (ví dụ ít hơn một nửa), hãy xem lại
có bỏ sót cụm từ nào cần hình không.

| Số đo | Mẫu |
|---|---|
| Số cảnh | 16 |
| Item hình mỗi giây | khoảng 1,7 (dọc), 145 item |
| Chuyển cảnh | wipe 4, whip 3, dither 4, pixelate 3, block 1, cut 1 |
| Punch / shake tay | 6 / 3 |
| Burst / emit / ring | 9 / 6 / 5 |
| Bộ đếm và thanh | 3 |
| Vật có bob | 13 |
| Sự kiện SFX | khoảng 116 |
| Khoảng không có sự kiện hình dài nhất | 3,3 giây |
| Độ hoạt động mỗi 5 giây (`qa.py`, % điểm ảnh đổi) | dọc: thấp nhất 2,3, trung vị 4,9; ngang: 2,0 / 4,1 |
