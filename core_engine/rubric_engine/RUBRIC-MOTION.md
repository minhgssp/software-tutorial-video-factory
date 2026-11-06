# Rubric chuyển động 7 trục (rubric motion) — cổng chấm video Kudo

Nguồn: `rubric.md` của mg-styles-15 (MIT, Vincentwei1021, commit `49052d8`), Kudo Việt hoá và chỉnh theo
chuẩn nhà ngày 16/10/2026 (ADR-016). Mục thư viện tương ứng: `rubric-motion-7-truc` trong `library/rubrics.yaml`.

Vòng làm việc: **làm → chấm → sửa**, tối đa **2 vòng sửa**. Sau vòng sửa thứ hai mà vẫn trượt thì dừng, ghi
`STUCK.md` cạnh video (bằng chứng, giả thuyết đã loại, chỗ vướng) theo luật §8 của người dùng.

Điểm là **điểm máy hoặc điểm của giám khảo AI độc lập**, không thay duyệt thẩm mỹ của người thật.

## Bước 0: chuẩn bị bằng máy

```bash
python3 engines/rubric/rubric.py prep VIDEO.mp4 -o VIDEO.rubric/ [--voice] [--expect-dur 15.1]
```

Ra `contact.jpg` (một khung mỗi 0,5 giây), `frames/` (khung độ phân giải đầy đủ ở 6 mốc), `spec.json` (ffprobe,
độ ồn, khung đen, đoạn đứng hình, lỗi chuẩn) và `jury-prompt.md` đã điền đường dẫn. Lỗi chuẩn trong `spec.json`
tự thành lỗi nghiêm trọng ở bước chấm.

## Bước 1: chấm (một phiên AI khác, không phải phiên đã làm video)

Đưa nguyên `jury-prompt.md` cho giám khảo. Nội dung prompt:

```text
Bạn là giám khảo thiết kế chuyển động khó tính (chuẩn biên tập Motionographer, giám đốc sáng tạo Buck/ManvsMachine,
trưởng kênh thiết kế top TikTok/Reels Việt Nam). Bạn KHÔNG làm video này. Chấm khắt khe và cụ thể để nó lên được
chất lượng thương mại cao cấp. Khen chung chung là vô ích; cụ thể là tất cả.

Video: <đường dẫn>. Brief / ý đồ: <dán brief hoặc ít nhất phong cách, khung hình, khoảnh khắc chính>.
Tư liệu đã dựng sẵn: <thư mục rubric>/contact.jpg, <thư mục rubric>/frames/, <thư mục rubric>/spec.json.

1. Xem kỹ: bảng khung hình, dải khung quanh chuyển động nhanh nhất và khoảnh khắc chính, khung đầy đủ ở các mốc.
   Soi chi tiết nhỏ ở độ phân giải thật: mép, xếp chữ, răng cưa, dải màu, chất liệu, chữ bị cắt.
2. Kiểm chuẩn Kudo (đã đo trong spec.json): 1080x1920, 30 khung/giây đều, độ dài đúng brief, có tiếng; có giọng thì
   −14 LUFS ±1, chỉ nhạc nền thì nhạc ở mức nền 0,08–0,11; true peak ≤ −1 dBTP; không khung đen ngoài ý đồ, không đứng
   hình ngoài ý đồ; nội dung trong vùng an toàn x 90–950, y 170–1460; cú hình khớp cú tiếng.
3. Chấm 1–10 từng trục (5 = bài sinh viên làm được; 6 = mức mẫu có sẵn; 7 = chuyên nghiệp chắc tay; 8 = agency
   cao cấp; 9 = vào danh sách giải; 10 = hay nhất thế giới). Bản dựng đầu đa số đáng 5–7. Không nâng điểm.
   - style_fidelity (đúng phong cách): nhận ra ngay dáng chuẩn của phong cách; đủ mọi dấu hiệu và kỹ thuật đặc trưng
   - concept_wow (ý tưởng và cú bất ngờ): ý rõ, móc trong 0,5 giây đầu, một khoảnh khắc chính không lẫn, khung kết đã
   - motion_craft (tay nghề chuyển động): easing, khoảng cách, chồng lớp, lấy đà và đi theo, đường cong, chuyển cảnh,
     nhoè chuyển động; không chết, không giật
   - design_typography (bố cục và chữ): bố cục, thứ bậc, lưới, xếp chữ tiếng Việt (dấu đủ, không dính, không xuống
     dòng giữa từ), bảng màu, khoảng thở
   - finish_texture (độ hoàn thiện): ánh sáng, chất liệu, hạt, phát sáng, chi tiết hợp phong cách; không dải màu,
     răng cưa, vết lỗi
   - sound_sync (âm thanh và độ khớp): nhạc đúng thể loại, tiếng động, khớp hình, trộn và master
   - technical (kỹ thuật): đúng chuẩn, font đã nạp, không lỗi hình, clip hay tiếng bụp
4. Đưa 5–10 việc sửa xếp theo tác động lên ấn tượng cuối. Mỗi việc: mốc thời gian, sai gì (quan sát được), vì sao
   quan trọng, cách sửa cụ thể (kỹ thuật và con số: đường easing, số khung, px, màu, font, bố cục). Ưu tiên vài nâng
   cấp lớn hơn nhiều chỗ vặt. Ít nhất một việc phải tăng cú bất ngờ, không chỉ đánh bóng.
5. Đánh dấu nghiêm trọng: chỗ nào trông chung chung kiểu mẫu AI, câu tiếng Việt gượng hoặc dịch, font dự phòng hoặc
   mất dấu, và mọi lỗi chuẩn.
Trả về ĐÚNG một khối JSON:
{"scores": {"style_fidelity": n, "concept_wow": n, "motion_craft": n, "design_typography": n,
            "finish_texture": n, "sound_sync": n, "technical": n},
 "critical": ["..."],
 "strengths": ["..."],
 "fixes": [{"timecode": "0:07.1", "problem": "...", "why": "...", "how": "..."}]}
```

## Bước 2: cổng điểm

```bash
python3 engines/rubric/rubric.py gate VIDEO.rubric/review-1.json --spec VIDEO.rubric/spec.json --round 1
```

- **Đạt (PASS)**: không có lỗi nghiêm trọng, không lỗi chuẩn, mọi trục ≥ 7. Đạt nghĩa là "sẵn sàng cho người duyệt
  xem", không phải được đăng.
- **Sửa (REPAIR)**: trượt và mới ở vòng 1 hoặc 2.
- **Dừng (STUCK)**: vòng sửa thứ hai vẫn trượt (`--round 3`). Lệnh ghi `STUCK.md` và thoát 1.

Ngưỡng 7 là ngưỡng Kudo đặt (giả thuyết, chưa đối chiếu với ý người dùng). Bản gốc nhắm ≥ 9 mọi trục cho phim giải
thưởng; muốn khắt khe hơn thì `--threshold 9`.

## Bước 3: sửa (quay lại phiên đã làm video, dán nhận xét)

```text
Một giám khảo độc lập đã chấm video của bạn. Toàn văn nhận xét:
<dán review-N.json>

Nâng video lên mức cao nhất có thể (mục tiêu ≥ 9 mọi trục):
- Trước hết giữ bản hiện tại (video và mã nguồn) làm phiên bản N.
- Làm mọi lỗi nghiêm trọng và mọi việc sửa tác động cao. Được thay bằng cách tốt hơn nếu chắc; nói vì sao. Làm vượt
  danh sách nếu thấy nâng cấp lớn hơn, nhất là cú bất ngờ. Không làm hỏng điểm mạnh giám khảo đã nêu.
- Dựng lại độ phân giải đầy đủ, chạy lại `rubric.py prep` và tự xem khung đến khi các sửa thật sự vào.
- Báo việc nào đã làm, việc nào bỏ, vì sao.
```
