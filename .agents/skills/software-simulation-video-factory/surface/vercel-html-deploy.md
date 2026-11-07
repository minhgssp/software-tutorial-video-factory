# Chuyên Viên Đóng Gói HTML-First & Triển Khai Vercel (`surface/vercel-html-deploy.md`)

**Vai trò:** Đảm bảo mọi sản phẩm mô phỏng phần mềm và nhánh `fde-onsite-walkthrough` luôn **ưu tiên số 1 là bản Web HTML tương tác đẩy thẳng lên Vercel**, giúp FDE/PM/Giảng viên gửi link cho khách hàng hoặc học viên mở xem ngay trên trình duyệt mà không cần cài đặt. Chỉ xuất file `.mp4` khi người dùng có yêu cầu rõ ràng.

---

## 1. Nguyên Tắc Ưu Tiên Phân Phối (`HTML-First on Vercel, MP4 On-Demand Only`)

1. **Tại sao ưu tiên HTML trên Vercel thay vì xuất MP4 ngay?**
   - Giống như việc gửi cho khách hàng một căn nhà mẫu mở cửa sẵn qua đường link web thay vì một cuộn băng ghi hình cố định: trên bản HTML Vercel, khách hàng và FDE có thể bấm dừng ở bất kỳ màn hình nào, click trực tiếp vào từng ô quy tắc `[WF-01]`, thử chuyển đổi giữa **Phương án A** và **Phương án B**, tích vào bảng **Checklist xác nhận** và chỉnh sửa văn bản trong tích tắc mà không tốn hàng chục phút render lại video `.mp4`.
2. **Khi nào mới xuất `.mp4`?**
   - Chỉ khi người dùng chỉ định rõ `delivery_mode: mp4-export` hoặc yêu cầu xuất file `.mp4` để đăng lên các nền tảng mạng xã hội / LMS chỉ nhận file video.

---

## 2. Cấu Hình Chuẩn `vercel.json` (Đẩy Lên Vercel Bằng 1 Câu Lệnh)

Mọi thư mục đầu ra của dự án (`examples/<project>/` hoặc thư mục khóa học/walkthrough) bắt buộc đính kèm tệp `vercel.json` ở gốc thư mục:

```json
{
  "version": 2,
  "name": "software-simulation-walkthrough",
  "cleanUrls": true,
  "trailingSlash": false,
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Cache-Control", "value": "public, max-age=0, must-revalidate" }
      ]
    },
    {
      "source": "/assets/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ]
}
```

### Quy trình 2 bước triển khai lên Vercel:
- **Bước 1 (Pha 1 — Gửi link Preview để chốt Simulation với Người dùng):**
  ```bash
  npx vercel --yes
  ```
- **Bước 2 (Pha 2 — Sau khi đã chốt Simulation và hoàn tất Audio + Hiệu ứng):**
  ```bash
  npx vercel --prod --yes
  ```

---

## 3. Tiêu Chuẩn Tự Bao Đóng (`Zero-Backend Static Bundle`)
- Mọi đường dẫn CSS, JS, SVG, âm thanh (`.mp3` / `.wav`) đều phải dùng **đường dẫn tương đối (`./assets/...`)** để chạy hoàn hảo cả khi mở trực tiếp trên máy (`file://`) lẫn khi host trên miền `*.vercel.app`.
- Không phụ thuộc vào cơ sở dữ liệu hay máy chủ API ngầm; toàn bộ dữ liệu mẫu ẩn danh và trạng thái tương tác được đóng gói gọn trong JSON/JS tĩnh.
