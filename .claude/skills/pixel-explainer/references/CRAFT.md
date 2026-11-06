# CRAFT: biến lời thành hình

File này trả lời câu hỏi "vẽ gì, lúc nào, đặt ở đâu". Hiệu ứng chuyển động ở `MOTION.md`; cú pháp ở `DIRECTION.md`.

## 1. Đơn vị làm việc là nhịp ý (beat)

- Một nhịp mang **một ý**, thường là một câu hoặc một cụm câu, dài 3–8 giây.
- Ranh giới nhịp theo mạch lập luận trong `meaning-argument.md`: mở vấn đề → vết thương / ví dụ → cơ chế → ranh giới →
  trao công cụ → câu trả nợ (payoff).
- Một cảnh (`scene`) chứa 1 nhịp, đôi khi 2 nhịp liền nghĩa. Video 60–90 giây thường có 12–18 cảnh.
- Với mỗi nhịp, trả lời trước khi chọn hình: *người xem đang thắc mắc gì ở giây này, và hình phải trả lời điều gì?*

## 2. Chọn vai theo nghĩa

| Nội dung của nhịp | Vai | Hình |
|---|---|---|
| Khái niệm có cấu trúc: so sánh, tầng bậc, vòng lặp, quy trình, sàng lọc | `model` | Sprite mô hình có layer `node:*` / `edge:*`; hiện từng phần đúng lúc lời nhắc; spotlight phần đang nói |
| Hành vi, tình huống, có người làm việc gì đó | `act` (dùng sprite vai `actor`) | Nhân vật đổi tag hoạt cảnh đúng động từ: gõ, gục, chỉ, cầm, đi |
| Một vật hoặc ẩn dụ được *dựng lên* trước mắt | `draw` | Sprite có layer hiện dần (`trace`, `bloom`), mỗi layer khớp một cụm từ |
| Nhắc lại, chuyển đoạn, câu chốt, kết | `still` | Vật tĩnh + tiêu đề hoặc nhãn; đứng đủ lâu để đọc |

Luật:

- Video phải có **đủ 4 vai**.
- **Cấm danh sách thẻ** (nhiều hộp chữ xếp hàng như slide). Ba ý song song thì dựng thành mô hình (tầng, vòng, phễu),
  hoặc cho nhân vật lấy ba vật ra, không xếp ba thẻ chữ.
- Câu có người làm việc → ưu tiên `act`. Câu định nghĩa cơ chế → ưu tiên `model`. Đừng dùng `still` cho đoạn có hành
  động chỉ vì dễ làm.

## 3. Archetype cho cảnh `model`

Mỗi cảnh `model` thuộc một trong 10 dạng hình học. Chọn theo cấu trúc của ý, không theo sprite đang có:

| Archetype | Khi lời nói về |
|---|---|
| `DualTrackComparison` | hai vế: cùng đầu vào, hai kết quả; trước/sau |
| `StrategicMatrix2x2` | hai trục quyết định |
| `DynamicFlywheel` | vòng lặp tự đẩy |
| `ZigzagRoadmap` | lộ trình theo chặng |
| `KineticPyramidStack` | tầng bậc, cái sau dựa trên cái trước |
| `KineticFunnelFilter` | sàng lọc từ nhiều hướng xuống một |
| `ConstrictionPipeline` | nút thắt |
| `KineticFulcrumScale` | cân nhắc hai phía |
| `ConcentricOrbitRings` | các lớp bao quanh một tâm |
| `KineticPolygonGraph` | mạng quan hệ |

- Ghi archetype của từng cảnh `model` trong BRIEF.
- Không dùng lại cùng archetype trong một video, trừ khi đó là cảnh *gọi lại* có chủ đích.
- Thư viện có sẵn một số mô hình (`m-*`). Nếu cấu trúc của ý không khớp mô hình sẵn có, vẽ mô hình mới (§7) thay vì
  ép ý vào hình sai.

## 4. Sợi chỉ hình (motif)

Video giải thích hay có **1–2 vật xuyên suốt**: người xem nhận ra chúng khi quay lại, nên hiểu nhanh mà không cần giảng.

Vòng đời của một sợi chỉ:

1. **Dựng**: vật xuất hiện lần đầu khi lời nêu vấn đề.
2. **Gọi lại**: vật quay lại ở cảnh khác để nối hai ý ("y như…").
3. **Biến đổi**: khi lời đưa ra câu trả lời, vật đổi trạng thái (tan đi, được lấp đầy, đổi màu, được đánh dấu).
4. **Đóng vòng**: cảnh cuối gọi lại vật ở trạng thái đầu hoặc trạng thái đã giải.

Cách làm trong direction: dùng lại **cùng sprite, cùng màu, cùng vị trí tương đối**; khi gọi lại, cho hiện bằng `pop`
hoặc `dither` thật nhanh (người xem đã biết nó); khi biến đổi, dùng `out` + hiệu ứng mang nghĩa (`burst dust` khi tan,
`dau-tich` khi được giải).

Ghi rõ trong BRIEF: sợi chỉ là gì, xuất hiện ở những nhịp nào, trạng thái ở từng nhịp.

- **Không rã sớm.** Mô hình trung tâm (kim tự tháp, phễu, vòng lặp…) ở lại trên màn hình chừng nào lời còn nói về
  nó. Lời chuyển sang ý con của mô hình thì giữ mô hình, `spot` vào phần đó; chỉ cho `out` khi lời rời hẳn mô hình.
- **Kết bằng vật, không bằng chữ trần.** Đoạn chốt cuối gọi lại vật chính (nhân vật, sản phẩm, mô hình) ở trạng thái
  đã giải, chữ chốt đặt cạnh vật. Một khung cuối chỉ còn chữ trên nền trống là sợi chỉ bị bỏ.
- **Kết trả lời câu mở.** Nếu cảnh mở là một câu hỏi hay một phép so sánh, cảnh kết gọi lại đúng hình đó (cùng sprite,
  cùng bố cục) ở trạng thái đã giải và đóng bằng tem của câu trả lời. Không kết ở dấu "?" và không để khung cuối tối
  hay trống: `iris` khép vào vật chính khi tem đã đọc xong.

## 5. Hình phải xuất hiện đúng lúc lời nói

- Vật, layer, nhãn xuất hiện ở **đầu từ** gọi tên nó: `at = T("cụm từ")`. Có thể sớm hơn 0,1–0,2 giây để mắt kịp
  nhìn khi tai vừa nghe, không sớm hơn.
- Mô hình: mỗi layer `node:*` hiện đúng lúc lời nhắc phần đó; `spot` từ lúc nhắc tới lúc chuyển sang phần khác.
- Nhân vật: đổi tag (`anim`) đúng động từ ("gõ", "gục", "chỉ").
- Con số trong lời: dùng bộ đếm (`count`) hoặc thanh (`bar`) chạy tới số đó, kết thúc đúng lúc lời đọc xong con số.
- Câu phủ định ("không", "chưa", "ít khi"): có tín hiệu hình (dấu `dau-x`, gạch `strike`, mờ `dim`).
- **Ai được gọi tên thì có mặt.** Người, đội, sản phẩm, công cụ mà lời gọi tên lần đầu phải có sprite **và** nhãn tên
  đúng chữ trong lời, cùng lúc lời gọi tên. Nghe tên mà không thấy ai, hoặc thấy một người không tên, là mất thông tin.
  Không có sprite riêng thì dùng sprite gần nghĩa nhất trong thư viện, nhãn tên làm rõ.
- **Câu then chốt không chỉ có chữ.** Câu nêu luận điểm, câu trả lời của video, câu "vì sao" phải có vật đang làm điều
  câu đó nói (nhân vật đổi `anim`, mô hình đổi trạng thái, vật được đánh dấu). Chỉ hiện một tấm nhãn ở những câu này là
  phí câu quan trọng nhất.
- **Lời sang đối tượng mới thì hình sang theo.** Khi lời bắt đầu nói về vật khác, cảnh cũ không được ở lại quá 1 giây.
- **Tên riêng nhắc lần nào cũng có hình.** Khai mọi tên riêng của lời trong `cast` khi `write(...)` (`DIRECTION.md` §2).
  Mỗi lần lời nhắc tên, một vật của tên đó phải đang hiện hoặc hiện trong khoảng [−0,3; +1,2] giây: sprite của nó,
  hoặc layer `node:*` mang tên đó trong mô hình. `validate.py` báo LỖI khi tên không khai hoặc khi lời nhắc mà không
  thấy vật. Không đủ vật thì đưa vật của tên đó vào cảnh (góc khung, cạnh mô hình), không bỏ qua.
- **Số trong lời là số vật trên hình.** "Hai cấu trúc", "ba bước", "một bình luận": thấy đúng chừng đó vật, hiện lần
  lượt theo lời. Một tờ giấy cho "hai cấu trúc" là hình nói sai lời.
- **Nhãn mới đi cùng hình mới.** Nhãn hiện hoặc đổi chữ thì trong khoảng 0,6 giây trước đến 1 giây sau phải có vật
  hiện, rời, đổi layer, `spot`, `anim` hay `move`. Chữ đổi trên hình đứng yên là trình chiếu. `validate.py` báo LỖI
  khi quá 2 lần (hoặc quá 5% số nhãn).
- **Ý đổi thì hình đổi.** Không đoạn nào quá 4 giây chỉ đổi chữ, camera hay hiệu ứng mà không vật nào hiện, rời, đổi
  layer, `spot`, `anim` hay `move` (`validate.py`: LỖI `hình đứng`).

## 6. Chữ trên hình

Phụ đề đã hiện lời đọc ở dải dưới. Chữ trên hình **không chép lại phụ đề**; nó gắn tên cho cấu trúc và nhấn điều cần
nhớ.

| Loại | Dùng cho | Luật |
|---|---|---|
| `label` `dark` | Tên một phần của mô hình, chú thích vật | ≤ 5 từ, ≤ 2 dòng |
| `label` `accent` | Từ khoá, con số, kết luận nhỏ cần nhớ | Không quá 2 tấm accent cùng lúc trên màn hình |
| `label` `bubble` + `tail` | Lời nói, bình luận, câu hỏi của nhân vật | Đuôi chỉ về người nói |
| `label` `warn` | Điều sai, cảnh báo, ranh giới | |
| `label` `stamp` | Câu chốt của một cụm ý lớn | 2–4 tem cả video; tự kèm pháo giấy, punch, rung |
| `label` `outline` | Chữ nhỏ đặt trên nền trống | Không đặt lên sprite |
| `headline` | Luận điểm chính, câu trả nợ ở cuối | Nguyên văn lời; 1–3 lần cả video |

- Cỡ chữ ≥ 64 px (mặc định 64). Tiêu đề 72–96.
- Dòng dài thì xuống dòng bằng `\n`. Khung dọc: khoảng ≤ 18 ký tự mỗi dòng ở cỡ 64; khung ngang: ≤ 32.
- Khi diễn đạt lại lời người khác (bình luận, tin nhắn) mà lời gốc chỉ là ý chính, ghi rõ "đại ý" trên hình.
- Mọi chữ phải có trong `clean.txt` hoặc `meaning-argument.md`, có thể rút gọn nhưng không đổi nghĩa.
- **Không gắn nhãn siêu dữ liệu.** Chữ trên hình là điều lời nói, không phải ghi chú của người dựng về nguồn hay độ
  tin cậy ("ví dụ tự soạn", "giả thuyết", "đã kiểm chứng"…). Điều lời không nói thì không viết lên hình.
- **Ký hiệu phải mang nghĩa lời nói.** `≠`, `→`, `?`, `!` chỉ dùng khi lời có đúng quan hệ đó ("khác", "dẫn tới",
  câu hỏi). Ký hiệu trang trí làm người xem đoán nghĩa.
- **Không để một chữ mồ côi hay từ gãy.** Xuống dòng bằng `\n` theo cụm nghĩa; không để dòng cuối chỉ một chữ cái hay
  một từ ngắn, không cắt giữa từ.
- **Không xếp nhãn thành danh sách.** Ba hệ quả, ba bước, ba phần: mỗi nhãn gắn vào vật của nó (cạnh sprite, cạnh
  node), không xếp chồng thành cột chữ giữa khung. Cột nhãn không có vật là danh sách thẻ trá hình (§2).
- **Không để nhãn gõ dở.** Nhãn mặc định gõ từng chữ (`cps` 30): số ký tự chia `cps`, cộng 0,3 giây, phải nhỏ hơn
  thời gian nhãn còn trên màn hình trước khi cảnh chuyển hoặc nhãn `out`. Không kịp thì đặt `type=False`.
- **Màu tem theo nghĩa.** Tem mặc định xanh nghĩa là đúng, đạt, chốt tích cực. Câu chốt mang nghĩa xấu (thất bại, tuyệt
  vọng, sai) dùng `plate="stamp", style=STAMP_BAD` (viền đỏ, chữ cam). Tem xanh trên chữ tiêu cực đọc ngược nghĩa.

## 7. Bố cục

Toạ độ tính theo ô lưới (1 ô = 6 px). Gốc (0,0) ở góc trên trái.

| Vùng | Dọc 180×320 ô | Ngang 320×180 ô |
|---|---|---|
| Vùng an toàn (SAFE): sprite phải nằm trong | x 15–158, y 28–243 | x 16–304, y 9–171 |
| Vùng nội dung (CONTENT): chữ phải nằm trong; camera đóng khung trong vùng này | x 15–158, y 28–215 | x 16–304, y 9–155 |
| Dải phụ đề: không đặt gì quan trọng | y > 215 | y > 155 |

- **Tâm vùng nội dung khung dọc là x 86,5 ô, không phải 90** (vùng lệch trái vì dải nút bên phải). Tiêu đề và nhãn
  canh giữa đặt x 86–87; sprite canh giữa dùng `centered(o, sid, scale)`. Đặt x 90 làm tiêu đề rộng lệch ra ngoài.
- Khung dọc xếp **trên–dưới**: hình chính ở giữa/trên, nhãn ở trên hoặc dưới hình. Khung ngang xếp **trái–phải**:
  hình bên trái, nhãn và vật phụ bên phải. Không chỉ dời toạ độ của bố cục dọc sang ngang.
- Vật chính chiếm khoảng 50–80% bề ngang vùng nội dung. Sprite nhỏ (< 50 ô) dùng `scale` 2–3 ở khung dọc.
- **Vật chính to ngay khi được giới thiệu**, nhất là ở câu mở: 0,5 giây đầu đã phải thấy vật chính đủ lớn. Mô hình
  dựng dần thì hiện phần lớn nhất trước (khung, nhân vật chính), các phần nhỏ sau.
- **Khung phải đầy.** `qa.py` đo trên điểm ảnh thật của sprite (bỏ phần trong suốt và layer chưa hiện) ở mỗi 0,1 giây,
  bỏ lúc chuyển cảnh. Là **LỖI**:
  - hộp mực sprite phủ dưới 15% (dọc) / 10% (ngang) vùng nội dung liên tục từ 2 giây;
  - **khung thưa**: điểm ảnh sprite dưới 10% (dọc) / 8% (ngang) vùng nội dung liên tục từ 2 giây — vòng tròn rỗng,
    khung rỗng, một tầng lẻ của mô hình giữa nền trống đều rơi vào đây;
  - khung gần như chỉ có chữ (không sprite hoặc điểm ảnh sprite dưới 3%) liên tục từ 1,5 giây;
  - tổng thời lượng vật nhỏ quá 15% video; trung vị độ phủ dưới 25% (dọc) / 17% (ngang).

  Sửa bằng `scale` lớn hơn, cho hiện thêm phần lời đang nói tới, hoặc giữ vật chính của cảnh trước ở lại — không sửa
  bằng vật trang trí.
- **Nhãn sát vật.** Nhãn gọi tên vật nào thì đứng cạnh vật đó. `qa.py` đo khoảng cách từ mỗi nhãn tới điểm ảnh sprite
  gần nhất: LỖI khi quá 20% (dọc) / 45% (ngang) thời gian nhãn cách vật hơn 24 ô (dọc) / 40 ô (ngang). Khung ngang
  hay mắc lỗi này: hình bên trái, nhãn dồn sát mép phải.
- **Khung ngang không phải khung dọc đặt nằm.** Hình chính chiếm ít nhất nửa bề ngang; vật phụ và nhãn lấp nửa còn
  lại. Một vật cỡ khung dọc giữa nền 16:9 là khung trống.
- Không bỏ trống 1/4 đáy vùng nội dung (ngay trên phụ đề) trong nhiều giây; hạ vật xuống hoặc đặt vật phụ ở đó.
- Mô hình có spotlight: bề ngang ≤ 85% vùng nội dung, vì node được phóng ×1,167.
- Nhãn đặt **ngoài hộp sprite** (trên, dưới hoặc bên cạnh), cách ≥ 2 ô. Chiều cao một nhãn tính bằng
  `lab_rows(size, số dòng)`; nhãn kế tiếp đặt ở `y + lab_rows(...) + 2`.
- Hai nhãn cùng hiện thì không được giao nhau. Trước khi thêm nhãn, liệt kê nhãn nào **còn trên màn hình** ở giây
  đó (chưa `out`, cảnh chưa hết). Không đủ chỗ thì cho nhãn cũ `out` trước.
- Dùng `centered(o, sid, scale, cy)` để đặt sprite giữa vùng nội dung; `size(sid, scale)` để biết bề ngang, bề cao.

## 8. Vẽ sprite mới (khi kho không có hình cần)

Chỉ vẽ khi một ý quan trọng không có hình phù hợp. Sprite riêng của run nằm trong run, không ghi vào thư viện chung.

1. Tạo `<run>/sprites.py`:

```python
from core import Grid, PAL, model, still   # PAL: ký tự màu → mã màu; '.' là trong suốt

def can_cau():
    g = Grid(40, 24)
    g.box(0, 10, 40, 4, "B")          # box(x, y, w, h, màu nền, màu viền='k')
    g.line(4, 10, 20, 0, "G", 2)
    return still("can-cau", g)

def m_vong():                          # mô hình: layer 'base' + 'node:<tên>' + 'edge:<a>-<b>'
    w, h = 120, 120
    base, a, b, ab = (Grid(w, h) for _ in range(4))
    base.disc(60, 60, 58, "N")
    a.disc(30, 60, 14, "b"); b.disc(90, 60, 14, "v")
    ab.line(44, 60, 76, 60, "y", 2)
    return model("m-vong", w, h, [("base", base), ("node:a", a), ("edge:a-b", ab), ("node:b", b)])

def assets():
    return [can_cau(), m_vong()]
```

2. Dựng qua Aseprite thật và kiểm khứ hồi:

```bash
python3 $SK/tools/asset_build.py --sprites <run>/sprites.py --library <run>/work/library
python3 $SK/tools/catalog.py --run <run> --sheet <run>/work/catalog.png
```

3. Mở `catalog.png`, nhìn sprite mới ở kích thước thật. Hình phải đọc được nghĩa khi chưa có chữ.

Luật vẽ: chỉ dùng màu trong `PAL`; viền mực `k` quanh khối chính; mô hình đặt tên layer `node:*`, `edge:*` để spotlight
và tia năng lượng hoạt động; mọi phần tử mô hình nằm trên layer riêng để hiện theo lời.

## 9. Mẫu `docs/BRIEF.md`

```markdown
# BRIEF: <tên video>

Người xem phải hiểu: <một câu>.
Lời hứa ở câu mở: "<trích>" → trả ở nhịp <bN>: "<trích>".

## Bảng nhịp

| nhịp | lời (rút gọn) | giây | vai | hình (sprite / archetype) | hiện | chuyển cảnh | hiệu ứng mang nghĩa | vì sao |
|---|---|---|---|---|---|---|---|---|
| b01 | "…" | 0,5–4,2 | model | m-… / DualTrackComparison | trace | cut | spot nhánh trái ở "…", flow ở "…" | Câu mở là phép so sánh… |

## Sợi chỉ hình

- <vật>: dựng ở bN (trạng thái…), gọi lại ở bN, biến đổi ở bN (…), đóng vòng ở bN.

## Bố cục hai khung

| nhịp | dọc | ngang |
|---|---|---|

## Bảng tên riêng (chép sang `cast` của `write`)

| tên trong lời (và bí danh) | các giây được nhắc | sprite hoặc sprite#layer | nhãn |
|---|---|---|---|

## Đếm

- Vai: model N, act N, draw N, still N. Archetype: …
- Tem (stamp): N, ở các câu chốt: …
- Chuyển cảnh: wipe N, whip N, pixelate N, dither N, block N, cut N.
```

## 10. Luật sự thật

- Không bịa người, số, kết quả, trích dẫn, logo thương hiệu.
- Tên người thật chỉ xuất hiện nếu có trong lời; dùng thẻ tên chữ, không vẽ chân dung giống người thật.
- Con số trên hình phải đúng như lời đọc ("hơn 300" thì không ghi "312").
- Điều lời nói là giới hạn ("chưa đo", "không hứa") phải hiện rõ, không làm nhỏ đi.
