---
name: kudo
description: Use when the user pastes a prompt containing a <kudo-request> block (made on {{KUDO_HOME}}/tao-video/index.html), types /kudo, or asks to make a video with Kudo. Parses the request, validates exact style keys with kudo.py, then routes to the right Kudo flow skill (talking head, product intro, faceless explainer, tutorial, shorts, music video, social image). Hands finished videos and images to kudo-post when the request asks to schedule posts through Postiz.
---

# Kudo — định tuyến yêu cầu làm video và ảnh

Kudo cài ở `{{KUDO_HOME}}`, video làm ra để ở `{{KUDO_WORK}}`. Mọi lệnh dưới đây chạy bằng Python của máy
(`python3` trên macOS, `python` hoặc `py` trên Windows).

## 1. Kiểm yêu cầu, không đoán

Chép nguyên khối `<kudo-request …>…</kudo-request>` người dùng dán vào một file tạm trong `{{KUDO_WORK}}`, rồi chạy:

```bash
python3 {{KUDO_HOME}}/bin/kudo.py check-request {{KUDO_WORK}}/<tên-video>/request.txt
```

- `ok: false`: đọc `errors`, báo lại người dùng bằng tiếng Việt, gợi ý quay lại trang chọn sửa. Không tự đổi khoá
  style hay luồng cho "gần đúng": khoá sai là dựng sai video.
- `ok: true`: dùng `resolved` làm hợp đồng cho cả video. Đọc to `warnings` cho người dùng trước khi dựng
  (luồng `lab`, cần tài khoản ngoài, chỉ chạy macOS).
- Người dùng chỉ gõ `/kudo` không kèm khối: hỏi họ vào {{KUDO_HOME}}/tao-video/index.html tạo prompt, hoặc hỏi đủ
  type, style, độ dài, mục tiêu, chủ đề rồi tự viết khối theo mẫu cuối file này và kiểm như trên.

Chạy `python3 {{KUDO_HOME}}/bin/kudo.py doctor` một lần mỗi phiên; thiếu công cụ thì chuyển sang skill `kudo-setup`.

## 2. Chuyển sang skill của luồng

`resolved.skill` là skill phải dùng tiếp. Gọi skill đó, đưa nguyên `resolved` làm đầu vào.

`resolved.source` có thì đó là video gốc: `kind: youtube`/`url` → chạy `pick.py fetch` của `kudo-talk-clean` trước (hỏi quyền dùng nếu video không phải của người dùng); `kind: file` → dùng thẳng. `resolved.profile.topic` vắng thì rút chủ đề từ lời nói.
Riêng type `social-image`: `source` là ảnh chính (sản phẩm, người, ảnh nền), đưa vào `cutouts` hoặc `photos` của đặc tả
tuỳ mẫu; `topic` là ý của ảnh, chữ trên ảnh viết từ đó.

| flow | skill | style key → tham số engine |
|---|---|---|
| `talk.clean-fx`, `talk.product` | `kudo-talk-clean` (có Bước 0 chọn đoạn khi nguồn dài/YouTube), xong dọn viết `plan.json` theo `{{KUDO_HOME}}/engines/talkfx/STANDARD.md` (đa dạng như mẫu `plans/ConanKey2.plan.json`), qua cổng `fx_plan.py gate`, dựng bằng `PlanTalk` qua `scripts/kudo_flow.py engines/talkfx/flow.json` | look r17 (`fx20/look.ts`); `talkfx.product-intro` dùng bố cục `FxReel28v4` |
| `talk.minimal` | `kudo-talk-clean` (dọn lời, `words.json`), xong theo `{{KUDO_HOME}}/engines/talkfx/README.md` mục *Kiểu tối giản*: beauty → probe → viết `m/plan.json` → `minimal_layout.py` → `minimal_gate.py gate` (phải ĐẠT) → `minimal_gate.py cues` → render `MinimalTalk` → `score.py bed --talkhead` → `score.py mux` | đuôi style sau `minimal-` → `plan.skin` (`toi-gian`, `giay-vang`, `dien-anh`, `neon`, `den-trang`, `navy-vang`, `chanh`); tiền tố `src-` → `plan.look: 'source'` (giữ nền gốc, không tách người) |
| `footage.director` | `kudo-footage-director` | — |
| `screencast.demo` | `kudo-screencast` | — |
| `mascot.host` | `kudo-mascot` | linh vật của người dùng; Măng-tô chỉ là mẫu |
| `explain.styles` | `kudo-styles` | `resolved.engine_style` = slug style (`cel-boil`, `bauhaus`…) |
| `explain.pixel` | `pixel-explainer` | — |
| `explain.vector` | `vector-cinema` | studio v2 + chuẩn 27/10: bộ soft tự nạp, mọi mối nối dùng chuyển cảnh đã có (zoom vô hạn `nest`, iris, màn…), cổng QA `trans` phải qua |
| `explain.math` | `kudo-math-explainer` | — |
| `explain.history` | `kudo-history-2.5d` | — (bản đồ 2D dựng riêng từng trận theo `world.json` v2 + `battle.json`) |
| `shorts.cut` | `kudo-shorts` | bố cục `stack` |
| `mv.lyric` | `kudo-mv` | `resolved.engine_style` = `--style` (`cel-boil`, `riso`, `kudo-ink`) |
| `image.template` | `kudo-image` | `resolved.engine_style` = `template` của đặc tả (`sticker-hero`, `quote-serif`…); `resolved.aspect` → `--aspect`; `profile.accent` → `--brand` |

**Chuyển cảnh bắt buộc (27/10/2026, anh Thông quy định):** mọi video Kudo dựng cảnh (mọi engine, mặc định `vector-cinema`)
phải có hiệu ứng chuyển cảnh ở mỗi lần đổi cảnh, không cắt thẳng hay mờ chồng trơn. Agent chọn kiểu theo quan hệ giữa hai
cảnh từ danh sách trong `skills/vector-cinema/SKILL.md` mục "Chuẩn chuyển cảnh và bộ soft" (zoom ra/vào vô hạn, xuyên cổng,
vòng tròn, lia/zoom nhanh, lướt bậc, màn kéo, vật lướt che, quét mềm). Với `vector-cinema`, cổng QA `trans` phải ĐẠT trước
khi bàn giao.

### Talking head tối giản: hỏi giữ nền hay tách nền (ADR-082)

Trước khi viết `m/plan.json` cho `talk.minimal`, hỏi người dùng một câu, kèm phân tích, mặc định **giữ nền**
(`look: 'source'`) nếu họ không chọn:

| Chọn | Khi nào hợp |
|---|---|
| **Giữ nền** (mặc định) | bối cảnh quay đẹp hoặc có ý nghĩa (nhà, văn phòng, cửa hàng); cần cảm giác chân thật, gần gũi; cần làm nhanh |
| **Tách nền** | nền rối, thiếu sáng, lộ đồ đạc; cần nhận diện thương hiệu sạch, đồng nhất giữa các video; nội dung nhiều sơ đồ, số liệu |

Style có tiền tố `src-` đã là giữ nền; style không tiền tố là tách nền — vẫn hỏi nếu người dùng chưa nói rõ.
Luật dựng bắt buộc cho mọi style (cổng `minimal_gate.py` M16–M18 cưỡng chế):

- Lật trang `flip` tối đa 1 lần mỗi video, chỉ cho khái niệm then chốt có tính học thuật (`dòng tiền`, `lãi kép`,
  `tài sản ròng`), khai trong `story.concepts`; cấm từ chung chung (`con số`, `vấn đề`), mở đầu bằng loại từ (`con`,
  `những`), có chữ số. Trang lật là tài liệu thật (bài báo khoa học, sách, báo, wiki, bảng thuật ngữ), chữ cỡ thật;
  điền `field`, `gloss`, `rel` cho đúng lĩnh vực. Không cắt sang trang chỉ có chữ: ý vài dòng chữ đặt
  thẳng trên người nói (`kw`, `caps`); cắt cảnh thì là B-roll, chữ đứng giữa khung.
- Giữ nền: ưu tiên chữ làm nổi và ghép font (≥ 35 % minh hoạ là chữ). Ý cần minh hoạ nhiều → cảnh `explain`, người
  thu thành bán thân ngang vai, minh hoạ ở trên/dưới/cạnh; đổi chỗ `at` giữa các cảnh (`corner`, `top`, `bottom`,
  `left`, `right`), không hai cảnh liền nhau cùng chỗ.
- Ảnh minh hoạ mặc định là ảnh tách nền có viền dán; B-roll xen kẽ, không nhiều hơn ảnh tách nền, có lúc `keep: true`
  để giữ thẻ người nói trên B-roll.
- Người nói thiếu tư liệu thì tự tìm ảnh thật về đúng thứ đang được nói (ADR-095): `{{KUDO_HOME}}/engines/talkfx/cutout/find_image.py`
  cho một thứ, `hunt.py` cho cả danh sách — DuckDuckGo Images, bài Wikipedia đúng chủ đề, Commons; CLIP chấm độ khớp, tách
  nền, ghi nguồn gốc. Cách viết truy vấn, `want`, chọn ảnh: skill `kudo-cutout`. Không dùng icon hay hình 3D thay ảnh thật.
- Đa dạng cách trình bày: ngoài 15 sơ đồ còn `compare` (so sánh hai lựa chọn), `phone` (màn hình khoá iPhone nhảy thông báo),
  `chat` (tin nhắn kiểu iMessage hai người; chữ đo và xếp dòng chính xác, không đè nhau) cho các tình huống.

### Màu thương hiệu (ADR-084)

Người dùng muốn video mang màu nhận diện của họ thì đổi màu nhấn của style, giữ nguyên nền, font, chất liệu. Nhận màu
theo một trong ba cách, rồi ghi `accent` vào `m/plan.json` trước `minimal_layout.py`:

- Mã màu (`#e4572e`) trong lời nhờ hoặc trong ô `profile.accent` của trang chọn video.
- Tên màu trong lời nhờ ("màu thương hiệu xanh navy").
- Ảnh tham chiếu (logo, ảnh thương hiệu): lấy màu nổi bật nhất, bỏ trắng/đen/xám.

```bash
python3 {{KUDO_HOME}}/engines/talkfx/brand_color.py "<mã hex | tên màu | đường dẫn ảnh>" --plan m/plan.json
```

Màu tên lạ ngoài bảng thì tự chọn mã hex gần nhất rồi gọi lại bằng mã đó. Muốn đổi nhãn góc trên (mặc định
`thongphan.com`) thì thêm `"brand": {"t": "tên-thương-hiệu"}` vào plan. Engine tự chỉnh độ sáng màu để đủ tương
phản trên nền sáng/tối; cổng M12 chặn `accent` không phải mã hex.

## 3. Áp tuỳ chọn và hồ sơ

- `resolved.options` là danh sách việc bắt buộc, không phải gợi ý: `sfx: true` thì mỗi hiệu ứng có tiếng động
  khớp; `subtitles: true` thì xuất `.srt` riêng; `both_aspects: true` thì ra cả 9:16 và 16:9 (nếu style hỗ trợ);
  `review_rounds: 2` thì tự xem lại ảnh tĩnh và sửa hai vòng trước khi giao.
- Ảnh (`social-image`): `all_aspects: true` thì `kimg.py make --all-aspects` (4:5, 1:1, 9:16, 16:9). Ảnh bỏ qua
  `length`; `goal` chỉ đổi giọng chữ trên ảnh (`sell` mới có giá, ưu đãi, lời mời mua).
- `post_plan: true` (mọi type): giao xong thì chuyển sang skill `kudo-post` để viết caption và lập plan đăng qua
  Postiz. Chỉ tạo bản nháp và đưa bản xem trước; lên lịch hay đăng thật chỉ khi người dùng đồng ý trong chat (ADR-097).
- Talking head: `engines/talkfx/STANDARD.md` là sàn cho mọi tier. `light`/`rich` chỉ đổi cường độ chuyển động,
  không được hạ số chế độ xử lý người, số họ lớp phủ hay kiểu máy quay dưới ngưỡng cổng.
  Mức đa dạng tham chiếu là bản Conan 2 người dùng duyệt 27/10 (9 họ lớp phủ, 10 chế độ người, 5 kiểu máy / 56 s).
- `length` quyết độ dài lời; `goal` quyết cách mở và lời kết (`sell` mới có lời mời mua).
- `profile.accent` là màu nhấn duy nhất của video. `profile.profile_file` có thì đọc bằng skill `kudo-profile`.
- Nhạc nền luôn tự tổng hợp bằng `{{KUDO_HOME}}/engines/audio` để không dính bản quyền.

## 4. Giao video, ảnh

Để mọi file của một video trong `{{KUDO_WORK}}/<tên-video>/`. Giao: file `.mp4`, `.srt` (nếu có), ảnh bìa, và một
đoạn ngắn ghi style key, tuỳ chọn đã dùng, chỗ nào chưa đạt. Không nói "hoàn chỉnh" nếu chưa tự xem ảnh tĩnh.
Ảnh: file `.png` từng khổ kèm `.qa.json`, style key, màu thương hiệu đã dùng; không giao ảnh còn dòng QA `TRƯỢT`.

## Mẫu khối yêu cầu

```
<kudo-request v="1" kudo=">=0.1.0">
type: faceless-explainer
flow: explain.styles
style: styles.cel-boil
aspect: 9:16
length: s60
goal: teach
tier: high
opt.sfx: true
profile.name: Tiệm sách Mây
profile.audience: người đi làm muốn đọc sách đều
profile.accent: #e04b43
profile.voice: machine
topic: Vì sao đọc 10 trang mỗi ngày hiệu quả hơn đọc dồn cuối tuần.
</kudo-request>
```

Ảnh mạng xã hội, xong lập plan đăng:

```
<kudo-request v="1" kudo=">=0.1.0">
type: social-image
flow: image.template
style: img.sticker-hero
aspect: 4:5
tier: high
opt.post_plan: true
profile.accent: #e63946
source: ~/Pictures/coc-gom.jpg
topic: Cốc gốm giữ nhiệt 6 giờ, men tay, mỗi chiếc một vân riêng.
</kudo-request>
```
