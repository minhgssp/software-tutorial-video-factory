# Brief cho AGY: viết spec JSON cho video bài giảng (16:9, whitelabel)

Bạn viết **kịch bản + nội dung trang minh họa** cho một video bài giảng ngắn về ứng dụng AI cho cán bộ ngân hàng.
Kết quả là MỘT file JSON đúng khuôn của file mẫu. Không dùng lệnh shell. Chỉ đọc các file được chỉ định và ghi đúng file đầu ra.

## Đọc trước (bắt buộc, đọc hết)
1. File mẫu đã duyệt: `specs/videos/B02_BaCapDoLamViecAI.json` — bám đúng cấu trúc, giọng văn, độ dài.
2. Khuôn các khối trang: `scripts/build_pages.py` (các hàm `blk_cards`, `blk_table`, `blk_flow`, `blk_tree`, `blk_callout`, `blk_big`, `blk_row`, `doc_blocks`, `page_app`).
3. Bài giảng gốc được giao (đường dẫn ở lệnh giao việc).

## Cấu trúc video — NÓI TỚI ĐÂU, MINH HỌA TỚI ĐÓ (góp ý của CEO, bắt buộc)
- **Không giới hạn thời lượng** (CEO, 2026-10-30): độ dài video do nội dung bài quyết định, đủ ý thì thôi, không cắt ý để cho vừa số phút hay số từ. File mẫu B02 là chuẩn tham chiếu về cấu trúc, không phải về độ dài.
- **Mở bài và tổng kết** dùng `screen` + `page: {"type":"concept","bare":true,"blocks":[{"type":"hero",...}]}`: chữ RẤT LỚN chiếm trọn khung (tiêu đề bài + 3 cột lớn có số thứ tự, tên ý chính). Không dùng `card` (lãng phí không gian). Beats chỉ vào từng cột khi lời nhắc tới.
- **Chọn cách tổ chức theo độ dài lý thuyết:**
  - Lý thuyết NGẮN (1–2 câu mỗi ý): một cảnh `concept` gọn, rồi tách sớm sang cảnh thực hành `live`.
  - Lý thuyết DÀI (mỗi ý có nhiều chi tiết, ví dụ nhiều cấp độ / nhiều bước / nhiều vùng): **mỗi cụm lý thuyết là một cảnh `live`**, lời đọc vừa giải thích nguyên lý vừa để màn hình diễn ra đúng hành vi đang nói (gõ lệnh, AI trả kết quả, sao chép sang Word, ra lệnh tiếp, quy trình đánh dấu từng bước…). Không để một đoạn lý thuyết dài nằm trên màn hình tĩnh.
- Mỗi hành vi được nhắc trong lời phải có một `step` tương ứng trên màn hình, đặt `at` đúng cụm từ nhắc tới hành vi đó.
- Cảnh ví dụ ghi rõ là tình huống giả lập (kicker/note có "Tình huống giả lập", tên và số liệu chỉ để minh họa). Khách hàng dùng mã giả định (KH_CN_01, HKD_MinhHoa_02, DN_MinhHoa_03…).
- Giọng văn: thân thiện, bình dị, cho cán bộ ngân hàng không chuyên kỹ thuật. Gọi người xem là "anh chị". Câu ngắn, rõ, có lý do.
- **Câu mở đầu vào thẳng:** "Video này chia sẻ về …". KHÔNG nói "trong bài này", "chào mừng".
- **KHÔNG nhắc tới bài trước / bài sau / bài tiếp theo** ở bất kỳ đâu trong thoại hay trên màn hình. Kicker không ghi "BÀI 0X". Câu kết chỉ tóm tắt + "Cảm ơn anh chị."
- **Mỗi ý lớn = một trang lý thuyết chữ lớn rồi ví dụ ngay:** trang `focus` (thang các ý ở trên, số lớn + tên ý, 3 đặc trưng chữ lớn; beats trỏ từng đặc trưng, zoom 1.0) → ngay sau là cảnh `live` minh họa đúng các đặc trưng vừa nói.
- **Không dùng hiệu ứng phóng ô gõ**: bước `type` chỉ cần `at` + `text` (chữ tự hiện trong ô nhập của giao diện). Không đặt `label`/`zoom` cho `type`, `send`.
- **Hôm sau / phiên mới**: dùng step `{"at","do":"newchat","arg":"Cuộc trò chuyện mới · hôm sau"}` để làm mới giao diện trước khi hiện hội thoại mới.
- `point` vào khối lớn (cả khung kết quả, cửa sổ Word, `stream`) dùng `zoom` 1.0–1.12 và `"mark":"none"`; khung sáng chỉ dùng cho mục nhỏ (một dòng, một ô).

## Quy tắc thoại cập nhật (CEO, thay thế các điểm trái ngược ở trên)
- KHÔNG dùng "anh chị". Xưng hô với người xem là "bạn" (CEO duyệt ở B01, 2026-10-30).
- KHÔNG dùng ký hiệu `//` trong kicker, tiêu đề hay bất kỳ chữ hiển thị nào.
- KHÔNG dùng từ "bẫy". Gọi là lỗi, sai lầm, thói quen thường gặp.
- KHÔNG mở bằng câu "Video này chia sẻ về …": mở bằng câu hỏi hoặc vấn đề thực tế của chính chủ đề.
- Tiêu đề và thoại phải khớp nhau; thoại phải đúng nội dung tiêu đề nêu ra.

## Quy tắc nội dung và hình (CEO, 2026-10-30)
- **Phụ đề bài giảng 16:9:** hiện một đoạn đủ ý, tối thiểu tròn một câu có dấu chấm. Không ngắt theo số từ. Câu quá dài so với ô phụ đề thì ngắt ở ranh giới vế câu. Đã cài trong `scripts/run_kudo_16x9.py` (`paragraph_captions`).
- **Hạn chế overfit:** ví dụ phải minh họa được nguyên tắc chung, không bám vào một trường hợp, một công cụ, một con số. Quy tắc rút ra từ một ca phải viết ở dạng tổng quát. Số thời gian, số phần trăm chưa có bằng chứng thì bỏ hoặc ghi rõ là minh họa.
- **Không tin mù quáng vào bài gốc:** phản biện mọi khẳng định của giảng viên. Kiểm tra từ ngữ, cơ chế, văn bản còn hiệu lực, mâu thuẫn giữa các bài. Tránh từ tuyệt đối ("luôn", "không bao giờ", "100%") khi thực tế không đúng như vậy. Bản kiểm tra gần nhất: `specs/AUDIT_THOAI.md`.
- **Duyệt trước khi render:** chạy `run_kudo_16x9.py <video_id> --preview` để có trang xem trước trong `output_preview/`. CEO duyệt rồi mới render.
- **Bốn giao diện của loạt video (CEO, 2026-10-30), chọn theo nội dung:**
  1. **Lưới (grid):** lý thuyết thuần túy, các luận điểm chính, danh sách ý. Dùng `screen` + khối `hero`, ô đang nói sáng lên.
  2. **Cảnh mở (section):** mở đầu một ý lớn có cả lý thuyết và minh họa sau đó, mà phần lý thuyết ngắn. Dùng `card` + `opener`, cột trái và phụ đề giữ nguyên.
  3. **Giải thích:** khái niệm phức tạp, cần sơ đồ, hoạt họa, ảnh chụp, ảnh màn hình. Ví dụ trang `predict` (thanh xác suất), khối `flow`, `tree`, `row`.
  4. **Mô phỏng:** ví dụ giao việc, đặt câu hỏi, tương tác với AI. Dùng `live` + trang `app` hoặc `webchat`.
- **Thuật ngữ (CEO, 2026-10-31):** dùng "ca" và "sổ theo dõi", không dùng "Sprint" và "Sprint Log" trong lời đọc hay trên màn hình. Ý nghĩa chính của ca là gọn gàng và an toàn: cô lập công việc trong thư mục, không xả tệp rác, tránh xóa nhầm, cô lập ngữ cảnh, dễ theo dõi, dễ đúc kết. Mỗi ca gồm ba ngăn (đầu vào, kết quả, trung gian) và tối thiểu hai hoặc ba tệp chuẩn (tổng quan, danh sách đầu việc, sổ nháp).
- **Dừng nghỉ (CEO, 2026-10-30, thay quy định 1–3 giây trước đây):** chỉ dừng khoảng 1 giây giữa hai ý lớn, khi chuyển cảnh. Không dừng 2–3 giây để chờ hình chạy; thao tác cần thêm thời gian thì diễn giải chi tiết hơn một chút trong lời để lấp, hoặc gõ nhanh hơn. Công cụ giới hạn `holds` tối đa 1 giây. Cách ngắt của bài 1 là chuẩn. Tiếng động trùng lời đang đọc tự giảm âm.
- **Nhấn đúng ý:** ý nào được nhấn trong lời thì hình phải có thay đổi tương ứng (`hl` tô đúng dòng, `show` hiện thêm), không chỉ trỏ vào cả khối.
- **Phụ đề và con trỏ:** phụ đề xuống dòng sau mỗi câu. Con trỏ ở góc dưới bên phải đối tượng. Chú thích đứng yên, màu trung tính, không đi theo con trỏ.
- **Cảnh mở cho mỗi ý lớn (CEO, 2026-10-30):** khi chuyển sang một ý lớn (ví dụ từng sai lầm trong danh sách), 1–3 câu đầu nêu tên và tóm tắt ý phải nằm trên một cảnh riêng, không dùng giao diện phần mềm: tiêu đề lớn, câu trích, tóm tắt, chữ chạy, highlight kiểu video tin tức, hoặc slide mở phần. Sau đó quay về giao diện minh họa. Mục đích là làm mới nhận thức người xem và tách cảnh rõ ràng. Không kéo dài cảnh này quá 3 câu.
  - **Chỉ thay phần minh họa (CEO, 2026-10-30):** cảnh mở giữ nguyên bố cục tổng thể của cảnh thường: cột trái (nhãn, tên ý) và ô phụ đề đứng yên, khung bên phải giữ vị trí và kích thước. Chỉ phần giao diện phần mềm trong khung được thay bằng nội dung cảnh mở, thanh địa chỉ cửa sổ được ẩn đi. Màu theo phong cách chung của video: nền sáng, cùng bảng màu với trang chữ lớn đầu bài, từ khóa tô vàng giống dòng tô trong giao diện. Không dùng nền tối toàn khung, không dùng dải chữ chạy.
  - **Cách dùng:** đặt ngay trước cảnh giao diện một cảnh `kind: "card"` có khối `opener`, chuyển 1–3 câu đầu của ý vào `say` của cảnh này. Lời đọc giữ nguyên từng chữ, chỉ dời ranh giới. Mốc `at`, `holds` thuộc câu đã chuyển phải dời theo hoặc bỏ. `kicker` và `title` của cảnh mở chép đúng từ cảnh giao diện ngay sau, để cột trái không đổi khi quay về giao diện. `note` để trống.
  - **Mẫu:** `{"id":"s2a_m1_mo","kind":"card","kicker":"SAI LẦM 1","title":"Hỏi đáp <em>rời rạc</em>","note":"","say":["..."],"opener":{"label":"SAI LẦM","num":"1","tone":"amber","kicker":"NĂM SAI LẦM THƯỜNG GẶP","title":"Hỏi đáp","accent":"rời rạc","text":"Không đầu, không cuối, không có bối cảnh.","marks":[{"text":"Không đầu","at":"không đầu"}]}}`. Xem đủ năm cảnh trong `specs/videos/B01_SaiLamThuongGap.json`.
  - **Các trường:** `label` + `num` hiện trên dải màu bên trái. `tone` là màu nhấn (`amber`, `red`, `blue`, `coral`, `plum`, `green`). `title` là dòng chữ đậm, `accent` là dòng màu. `text` là câu tóm tắt hoặc trích, `style: "quote"` để hiện dạng trích dẫn. `marks` là từ khóa được tô: `text` phải có trong câu trên màn hình, `at` là cụm nguyên văn trong lời đọc của cảnh, nói tới đâu tô tới đó.
  - **Giới hạn chữ để không tràn:** `title` và `accent` mỗi dòng tối đa khoảng 24 ký tự; `text` tối đa khoảng 90 ký tự, xuống tối đa hai dòng. Lời đọc của cảnh tối đa 210 ký tự, nếu không phụ đề có thể tràn ô.
  - **Lý do dùng `kind: "card"` có `opener`:** cảnh `card` không phải quay màn hình và từ khóa tô được theo mốc giọng đọc; khối `opener` khiến cảnh này đi như cảnh thường, chỉ khác phần trong khung. Bài không khai báo `opener` hiển thị như cũ.
  - **Khoảng lặng:** công cụ tự để lặng 0,9 giây khi hết cảnh mở. Câu mở quá ngắn thì giữ chữ trên màn hình thật gọn để kịp đọc; `holds` tối đa 1 giây.
- **Tả hình chi tiết bằng thẻ XML:** trong `specs/thoai/`, mỗi cảnh có thẻ `<hinh_anh>` ghi bố cục, chữ xuất hiện nguyên văn, và từng thay đổi trên màn hình gắn với cụm lời đọc. Không viết chung chung kiểu "minh họa khái niệm".

## Bộ thao tác màn hình cho cảnh `live` (`steps`, chạy theo thứ tự xuất hiện trong lời)
- `{"at","do":"type","text":"câu gõ ≤ 95 ký tự","label"}` — gõ vào ô giao việc. Đặt `at` sớm (đầu câu nói về việc giao lệnh) vì gõ mất 2–4 giây.
- `{"at","do":"send"}` — bấm gửi (câu vừa gõ hiện thành tin nhắn).
- `{"at","do":"reveal","n":k}` — hiện k dòng tiếp theo trong `stream` (tiến trình AI, câu trả lời, tin nhắn).
- `{"at","do":"doc","target":"id"}` — hiện một tài liệu bên phải (`previews[]`, mỗi lúc một tài liệu) hoặc cửa sổ nổi Word/Excel (`overlays[]` ở trang `webchat`).
- `{"at","do":"hide","target":"id"}` — đóng cửa sổ nổi.
- `{"at","do":"copy","target":"id_tin_nhắn"}` — bôi xanh tin nhắn + thông báo "Đã sao chép".
- `{"at","do":"tick","target":"id_bước"}` — đánh dấu xong một bước trong khối `workflow` (bước kế tiếp tự sáng lên).
- `{"at","do":"point","target":"id","label","zoom","mark":"frame|none"}` — camera trỏ và phóng vào vùng đó.
- Trang `webchat` = trang chat trên trình duyệt (cấp độ hỏi đáp); trang `app` = không gian làm việc AI 3 cột (giữa: tiến trình; phải: kết quả).
- Khối tài liệu có thêm: `raw` (chữ thô), `workflow` (các bước có id, `gate: true` cho trạm gác), `slide` (slide mô phỏng: title, bullets, kpis).

## Whitelabel (bắt buộc)
- KHÔNG có tên ngân hàng (FinBank, Agribank…), tên địa phương/chi nhánh cụ thể (Đơn vị Doanh nghiệp, Lâm Đồng…), tên công cụ/hãng AI (Antigravity, Claude, ChatGPT, Gemini, Codex, Google, Microsoft…), tên công ty thật.
- Dùng: "ngân hàng", "chi nhánh", "phòng giao dịch", "phòng khách hàng cá nhân", "không gian làm việc AI", "công cụ AI".
- Được dùng Word, Excel, PDF, tên văn bản quy phạm chung (thông tư, nghị định) khi bài gốc có.

## Luật cho lời đọc `say` (máy đọc + căn phụ đề sẽ lỗi nếu sai)
- `say` là mảng; mỗi phần tử là một ý lớn (máy sẽ ngắt hơi dài giữa các phần tử).
- **Không chữ số** trong `say`: viết "ba mươi giây", "cấp độ hai", "không phẩy chín".
- **Mỗi từ (tách theo dấu cách) phải là một âm tiết liền**: không gạch nối (`K-W-S-R`, `copy-paste`), không dấu chấm/gạch dưới giữa từ (`research.md`, `SP_01`), không ký hiệu đứng riêng (`+ = → & / %`). Đọc tên tệp bằng lời: "sổ nháp research", "tệp hướng dẫn kỹ năng", "sổ cái Sprint Log", "thư mục kho tri thức". Chữ cái viết rời: "K, W, S, R" viết là "ca, vê kép, ét, e rờ" hoặc dùng từ đầy đủ "Knowledge, Workflow, Skill, Rule".
- Không có dấu `/` trong `say`.
- Trên trang (page) thì được dùng số, ký hiệu, tên tệp bình thường.

## Luật cho `beats` (camera + khung sáng)
- `at`: cụm 3–7 từ **nguyên văn** có trong `say` của cùng cảnh, theo đúng thứ tự xuất hiện.
- `target`: một `id` có thật trên trang của cảnh đó (id của card/hàng bảng/bước/callout/khối).
- `label`: CHỮ IN HOA ngắn ≤ 40 ký tự. `zoom` 1.25–1.6.

## Cảnh live (giao diện AI mô phỏng)
- `page.type = "app"`: `project`, `sessions` (nhóm bằng `{"group": "..."}`), `chat` (0–2 tin), `stream` (dòng `status`, `status wait`, `agent`, `gate`, `user`; có thể gắn `id`), `previews` (mỗi mục `id`, `file`, `blocks`, tuỳ chọn `visible: true` để hiện từ đầu).
- `page.type = "webchat"`: `stream` (thêm role `paste`, `raw`, `divider`, `problem`), `overlays` (cửa sổ Word/Excel: `id`, `app`, `file`, `blocks`).
- Mọi thao tác nằm trong `steps` (xem mục bộ thao tác). Không dùng `prompt`/`live_points`/`type_label` kiểu cũ.
- Số liệu trên trang phải hợp lý, cộng trừ khớp nhau.

## Đầu ra
Ghi đúng một file `specs/videos/<VIDEO_ID>.json` (UTF-8, JSON hợp lệ, có `video_id`, `lesson_no`, `lesson_title`, `out_name` = `<VIDEO_ID>.mp4`, `shots`).
Trả lời ngắn: đã ghi file nào, bao nhiêu cảnh, tổng số từ lời đọc.
