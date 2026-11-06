# DIRECTION: tra cứu cú pháp

`direction.py` là file Python dùng `tools/dkit.py` để sinh `work/direction-doc.json` và `work/direction-ngang.json`.
Engine đọc JSON này và vẽ từng khung. File này liệt kê mọi trường engine hiểu; trường lạ sẽ bị validate báo LỖI.

## 1. Đơn vị và quy ước

- Toạ độ là **ô lưới**, 1 ô = 6 px. Dọc 180×320 ô (1080×1920 px), ngang 320×180 ô (1920×1080 px).
- Thời gian là **giây trên video** (đã cộng `offset` 0,5 giây). Luôn lấy bằng `T("cụm từ")` / `TE("cụm từ")`.
- Video 30 khung/giây; reveal và hoạt cảnh nhảy bậc 12 khung/giây cho đúng chất pixel.
- Item không có `out` sống tới hết cảnh. Cảnh kết thúc khi cảnh sau bắt đầu.

## 2. API dkit

```python
import sys; sys.path.insert(0, "{{KUDO_HOME}}/skills/pixel-explainer/tools")
from dkit import *
init(__file__)            # offset=0.5, dur = hết giọng + 0,5 + 2,5 (làm tròn lên 0,5); có thể truyền dur=, tail=
```

| Hàm | Trả về |
|---|---|
| `T(cụm, after=0)` | giây bắt đầu từ đầu của cụm, lần xuất hiện đầu tiên sau `after` |
| `TE(cụm, after=0)` | giây kết thúc từ cuối của cụm |
| `DUR()` | thời lượng video |
| `v(o, giá_trị_dọc, giá_trị_ngang)` | chọn theo khung |
| `size(sid, scale)` | (rộng, cao) theo ô |
| `C(sid, x, y, scale)` | tâm sprite khi góc trên trái ở (x, y) |
| `centered(o, sid, scale, cy=None)` | góc trên trái để sprite nằm giữa vùng nội dung |
| `lab_rows(size_px, số_dòng)` | chiều cao tấm nhãn theo ô |
| `S(sid, x, y, at, scale=1, reveal="none", **kw)` | sprite |
| `Lb(text, x, y, at, size=64, plate="dark", **kw)` | nhãn |
| `P(pid, src, x, y, w, at, reveal="pop", **kw)` | ảnh thật (chụp màn hình, ảnh tác giả) |
| `H([(chữ, giây, nhấn?), …], x, y, size=80, maxw=None)` | tiêu đề |
| `Ar(x0, y0, x1, y1, at, **kw)` | mũi tên |
| `Fr(x, y, w, h, at, **kw)` | khung chữ nhật |
| `Bu(x, y, at, **kw)` | chùm hạt bắn một lần |
| `Em(x, y, w, h, from, to, **kw)` | nguồn hạt liên tục |
| `Ri(x, y, r0, r1, at, **kw)` | vòng lan |
| `Ba(x, y, segs, at, steps, **kw)` | thanh nhiều đốt |
| `Fl(at, color=YELLOW, frm="top", every=1.2, dur=0.6, length=0.28)` | tia năng lượng cho `layers[...]["flow"]` |
| `out(at, dur=0.4, kind="dither")` | sprite rời cảnh |
| `tin(kind, dur=None, dir=None)` | chuyển cảnh |
| `scene(from, items, tin_=None, **kw)` | cảnh |
| `write(scenes_fn, cast=None)` | ghi JSON cho cả hai khung; `cast` khai tên riêng (dưới) |

`cast` khai mọi tên riêng mà lời nói (người, đội, sản phẩm, công cụ) và vật đại diện cho từng tên:

```python
write(scenes, cast={
    "Lan|chị Lan": ["nguoi-lan"],                 # "A|B": B là bí danh; khớp phân biệt hoa thường
    "Robot": ["robot-ai", "m-luong-xu-ly#node:robot"],   # "sprite#layer": layer node của mô hình cũng tính
})
```

`validate.py` tự phát hiện tên riêng trong lời (chữ viết hoa giữa câu, tên Latin không dấu ở đầu câu). Tên phát hiện
mà chưa khai là LỖI; mỗi lần lời nhắc tên mà không vật nào trong danh sách đang hiện hoặc hiện trong [−0,3; +1,2] giây
là LỖI. Một từ viết hoa không phải tên (từ đầu câu bị nhận nhầm) thì vẫn khai, với vật gần nghĩa nhất.

Màu: `INK NAVY GREY WHITE RED ORANGE YELLOW LIME GREEN TEAL BLUE SKY CYAN PURPLE SKIN BROWN NIGHT SLATE`.

## 3. Sprite (`kind: "sprite"`)

| Trường | Nghĩa |
|---|---|
| `sprite`, `x`, `y`, `at` | tên sprite trong kho; **góc trên trái**; giây xuất hiện |
| `scale` | số nguyên 1, 2, 3… |
| `reveal` | `none`, `trace` (0,8 giây), `bloom` (0,5), `scan` (0,5), `dither` (0,5), `pop` (0,25, nảy 0,35→1,2→1) |
| `rdur` | ghi đè thời lượng reveal |
| `flip` | lật ngang |
| `frame` | đứng ở một khung cố định. Bỏ trống: chạy tag `idle` nếu có, không thì chạy mọi khung |
| `anim` | `[[giây, "tag"], …]` đổi hoạt cảnh. Tag nhân vật: `idle go thoidai guc cam chi di` (xem catalog) |
| `phase` | lệch pha hoạt cảnh (giây) để hai nhân vật không cử động giống hệt |
| `bob` | `True` (nhún 1 ô) hoặc số ô; chu kỳ khoảng 1,2 giây |
| `move` | `[[t0, t1, x_mới, y_mới], …]` |
| `dim` | `[[giây, độ_đậm], …]`, chuyển trong 0,3 giây. Ví dụ `[[t, 0.3]]` làm mờ khi bị phủ định |
| `out` | `out(at, dur, kind)`; kind như reveal |
| `layers` | `{tên_layer: {...}}` điều khiển từng layer (bên dưới) |
| `spot` | `[{"node": "tên", "from": t0, "to": t1, "keep": ["tên khác"]}]` |
| `cam: False` | camera tự động bỏ qua item này khi đóng khung |
| `over: True` | khai chồng có chủ ý: sprite này nằm đè lên vật khác (vật cầm trên tay, hình hiện trên màn hình laptop). `qa.py` bỏ qua phần nó che. Chỉ khai sau khi đã xem ảnh và vật dưới vẫn nhận ra (`QA.md` §2.1) |
| `fx: False` | tắt hiệu ứng tự sinh của item này |

**`layers`** (khoá là tên layer trong catalog):

| Khoá | Nghĩa |
|---|---|
| `at`, `reveal`, `rdur` | layer hiện riêng, theo lời |
| `hide` | không vẽ layer này |
| `out` | **số giây**: layer tan đi (dither 0,4 giây) |
| `flow` | `Fl(...)` hoặc danh sách `Fl`: xung sáng chạy dọc layer. `frm` là `top`, `bottom`, `left`, `right`; thêm `until=` để dừng; `head=` màu đầu xung; `alpha=` |

Mô hình có layer `base`: **phải khai `base`** (ví dụ `"base": {"at": t, "reveal": "trace"}`), nếu không nó hiện sẵn từ
`at` của sprite. Layer không khai `at` hiện cùng sprite.

**`spot`** chỉ tác động layer `node:*` và `edge:*`: node được chọn phóng ×1,167 bằng lò xo, cạnh nối với nó giữ sáng,
phần còn lại mờ còn 25%, co 10% và lùi xa 3 ô; engine tự vẽ vòng vàng quanh node (spot dài hơn 1,4 giây có thêm vòng
cyan lặp). `keep` giữ sáng thêm node khác.

**Hiệu ứng tự sinh**: `pop` → ring (scale ≥ 2 thêm tia lửa); `bloom` → sao; sprite `dau-x` → rung + tia đỏ; `dau-tich`
→ tia xanh.

## 4. Nhãn (`kind: "label"`)

| Trường | Nghĩa |
|---|---|
| `text` | chuỗi (`\n` xuống dòng) hoặc `[[giây, chuỗi], …]` để đổi chữ theo thời gian |
| `x`, `y` | `y` là **mép trên** tấm nhãn; `x` neo theo `align` |
| `align` | `"l"`: x là mép trái; `"r"`: x là mép phải; bỏ trống: x là tâm |
| `size` | px, tối thiểu 64 |
| `plate` | `dark` (nền tối viền trắng), `accent` (vàng), `bubble` (nền trắng chữ mực), `stamp` (dập ×1,6, viền xanh chữ lime), `warn` (đỏ/cam), `outline` (chữ trần) |
| `tail` | đuôi bong bóng: `tl`, `tr`, `bl`, `br` |
| `count` | `{"from": 0, "to": 300, "t0": giây, "t1": giây}`; ký tự `#` trong text được thay bằng số đang chạy |
| `cps` | tốc độ gõ chữ (ký tự/giây, mặc định 30); `type: False` hiện cả câu ngay |
| `lh`, `color`, `style` | giãn dòng (hệ số), màu chữ, ghi đè kiểu tấm |
| `dim` | như sprite |
| `out` | **số giây** nhãn biến mất |
| `strike` | `{"at": giây, "dur": 0.25, "color": RED}` gạch ngang (tự kèm tia lửa và rung) |
| `over` | `True`: chữ cố ý nằm trên vật (chữ trên màn hình laptop, tên ghi lên tầng tháp). Như sprite: chỉ khai sau khi đã xem ảnh |

Tấm nhãn bị kẹp ngang trong vùng an toàn. Padding ngang = size × 0,4, dọc = size × 0,22. Chữ VT323; chữ số vẽ bằng
JetBrains Mono. `stamp` tự sinh pháo giấy, ring, flash, shake 18 trong 0,35 giây và punch 0,06.

**Màu tem theo nghĩa:** tem mặc định viền xanh chữ lime = tích cực (đạt, đúng, kết quả). Câu chốt tiêu cực (thất bại,
tuyệt vọng, sai, mất) dùng `style=STAMP_BAD` (viền đỏ chữ cam, ring cùng màu). Không dùng tem xanh cho chữ mang nghĩa xấu.

## 5. Tiêu đề (`kind: "headline"`)

`H([("Chữ", T("chữ"), False), ("nhấn", T("nhấn"), True)], x, y, size=88, maxw=820)`

- Font Be Vietnam Pro 900. `x` là **tâm**, `y` là mép trên dòng đầu, giãn dòng = size × 1,22.
- Mỗi từ hiện đúng giây của nó; từ có `hl` gạch chân vàng và có sao.
- `maxw` (px) để tự xuống dòng; tiêu đề rộng hơn vùng nội dung mà thiếu `maxw` là LỖI.
- `live: False` tắt tô vàng từ đang đọc.
- `font: "vt"` vẽ bằng VT323 (chữ pixel cùng họ với nhãn) thay vì Be Vietnam Pro; VT323 hẹp và thấp hơn nên
  cần `size` lớn hơn khoảng 1,4 lần. Hợp với câu chốt cuối để chữ cùng chất pixel với hình.

## 6. Item khác

| Kind | Trường (ô lưới) |
|---|---|
| `arrow` | `x0 y0 x1 y1 at`, `color`, `head` (4), `th` (2), `rdur`, `march` (True: chấm chạy dọc sau khi vẽ xong), `out` (số giây) |
| `frame` | `x y w h at`, `color`, `th` (1), `out` (số giây) |
| `burst` | `x y at`, `type` `spark`/`star`/`confetti`/`dust`, `n` 16, `speed` 40, `life` 0,8, `drag` 3, `grav`, `a0` `a1` (góc), `colors`, `seed` |
| `emit` | `x y w h from to`, `type` `rain`/`sparkle`/`dot`, `rate`, `life`, `vx vy jx jy grav`, `colors`, `alpha`, `seed` |
| `ring` | `x y r0 r1 at`, `color`, `dur` 0,5, `every` + `until` (lặp), `faint` |
| `photo` | `photo` (id), `src` (đường dẫn tương đối trong run, vd `assets/daniel.webp`), `x y w at`, `h` (bỏ trống = theo tỉ lệ ảnh), `crop` `[trái, trên, phải, dưới]` theo tỉ lệ 0–1, `reveal` `pop`/`dither`/`none`, `rdur`, `move`, `dim`, `out`, `border` (ô, 2), `color` (viền, `#f4f4f4`), `accent` (vạch dưới; `False` để tắt), `mosaic` (px; >0 để vỡ hạt hợp style pixel). Ảnh nhúng sẵn vào HTML (JPEG), khai trong `cast` bằng `"photo:<id>"`. Chỉ dùng ảnh thật có nguồn; ghi nguồn vào `docs/BRIEF.md`. |
| `bar` | `x y segs at steps`, `steps` = `[[giây, số_đốt_sáng], …]`, `align`, `color`, `gap`, `h`, `sw`, `dim`, `out`, `blinkEmpty` |

## 7. Cảnh

`scene(from, items, tin(...), cam=..., punch=[...], ...)`

| Khoá | Nghĩa |
|---|---|
| `from` | giây bắt đầu; cảnh đầu phải là 0 |
| `tin` | `tin("cut")`, `tin("wipe", dir="up"/"down"/"left"/"right")`, `tin("whip")`, `tin("pixelate")`, `tin("dither")`, `tin("block")` |
| `bg` | `[[giây, màu_trên, màu_dưới], …]`, mặc định `NAVY → NIGHT` |
| `cam` | bỏ trống: tự đóng khung (zoom 1 → `zmax` 1,35, chữ luôn trong khung); `"none"`: đứng yên, z 1, tâm theo hộp nội dung, có trôi nhẹ; `[]`: đứng yên đúng tâm vùng nội dung, toạ độ ô lưới trùng toạ độ màn hình — dùng cho cảnh dàn nhiều vật, nhưng khi đó bố cục phải **tự** vừa vùng nội dung (chữ) và vùng an toàn (sprite) vì không còn camera canh giúp; `[[t0, t1, z, fx, fy], …]`: tự đặt (fx, fy là ô lưới) |
| `zmax`, `drift` | trần zoom tự động; độ trôi nhẹ (mặc định 0,025) |
| `camInherit` | tiếp tục khung camera của cảnh trước |
| `punch` | `[[giây, amt, dur, gx, gy], …]`, amt 0,03–0,10, gx gy là ô lưới chỗ đẩy vào |
| `shake` | `[[giây, amp, dur], …]`, amp ≤ 20 |
| `flash` | `[[giây, dur, màu, alpha], …]` |
| `iris` | `{"at": giây, "dur": 1.0, "word": chỉ_số_từ_trong_headline}` hoặc `{"at", "dur", "cx", "cy"}` |
| `noSubs` | tắt phụ đề trong cảnh |
| `fx: False` | tắt mọi hiệu ứng tự sinh trong cảnh |

Lớp vẽ: vật và hiệu ứng nền → chữ → hiệu ứng "nổi" (pháo giấy, ring của tem). Engine tự xoá hiệu ứng nổi trong hộp
chữ để chữ luôn đọc được.

## 8. Ví dụ cú pháp (chủ đề trung tính)

> **Chỉ để minh hoạ cú pháp.** Không chép bố cục, mật độ hay hiệu ứng. Mỗi video phải được dựng từ lời của chính nó
> theo `CRAFT.md` và `MOTION.md`.

Giả sử lời có câu: "Muốn giỏi một kỹ năng, phải luyện từng tầng. Tầng dưới là nền tảng, tầng trên là phản xạ."

```python
import sys; sys.path.insert(0, "{{KUDO_HOME}}/skills/pixel-explainer/tools")
from dkit import *
init(__file__)

def scenes(o):
    t1, t2, t3 = T("muốn giỏi"), T("tầng dưới"), T("tầng trên")
    px, py = centered(o, "m-pyramid", 1, cy=v(o, 110, 82))
    if o == "ngang":
        px = 40                                             # ngang: mô hình bên trái, chữ bên phải
    pyr = S("m-pyramid", px, py, t1, 1, layers={
        "base": {"at": t1, "reveal": "trace"},
        "node:mot": {"at": t2, "reveal": "pop"},
        "node:dinh": {"at": t3, "reveal": "bloom", "flow": Fl(t3 + 0.6, LIME, "bottom", until=TE("phản xạ"))},
    }, spot=[{"node": "mot", "from": t2, "to": t3 - 0.1}, {"node": "dinh", "from": t3, "to": TE("phản xạ")}])
    w, h = size("m-pyramid", 1)
    lx, ly = v(o, (90, py + h + 2), (px + w + 12, 40))
    return [
        scene(0, [pyr,
                  Lb("NỀN TẢNG", lx, ly, t2, align=v(o, None, "l")),
                  Lb("PHẢN XẠ", lx, ly + lab_rows(64) + 2, t3, plate="accent", align=v(o, None, "l"))],
              tin("cut")),
    ]

write(scenes)
```

Rồi chạy `python3 <run>/direction.py` và `python3 $SK/tools/validate.py <run>`.
