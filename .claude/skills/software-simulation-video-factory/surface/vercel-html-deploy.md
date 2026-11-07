# Chuyên Viên Đóng Gói HTML-First, Khóa Mã Hóa `.env` & Triển Khai Vercel (`surface/vercel-html-deploy.md`)

**Vai trò:** Đảm bảo mọi sản phẩm mô phỏng phần mềm và nhánh `fde-onsite-walkthrough` khi đẩy lên **Vercel** luôn:
1. **Ưu tiên số 1 là Web HTML tương tác (`html-vercel-first`)**, chỉ xuất `.mp4` khi người dùng có yêu cầu rõ ràng.
2. **Bắt buộc khóa bằng mật khẩu từ biến `.env` (`WALKTHROUGH_PASSWORD`) kết hợp mã hóa `AES-256-GCM` không tải sớm (`Zero Pre-Auth DOM Load`)**: Chỉ giải mã và nạp nội dung trang khi người dùng nhập đúng mật khẩu, tuyệt đối không để lộ HTML/số liệu trong `View Source` hay `F12 Network` trước khi đăng nhập.

---

## 1. Tại Sao Phải Khóa Mã Hóa `AES-256-GCM` & Chặn Tải Sớm Trên Vercel?

- Các đường link `.vercel.app` mặc định có thể truy cập công khai. Nếu chỉ che màn hình bằng một lớp phủ CSS (`display: none`) và kiểm tra mật khẩu bằng câu lệnh `if (pass === '...')` thông thường, bất kỳ ai bấm `Ctrl+U` (View Source) đều đọc được toàn bộ nỗi đau hiện trạng, bảng quy tắc và số liệu của khách hàng.
- **Giải pháp chuẩn của Nhà máy (`core_engine/vercel_crypto_vault.py`):**
  1. Đặt mật khẩu cố định trong tệp `.env` (biến `WALKTHROUGH_PASSWORD=...`, được `.gitignore` bảo vệ).
  2. Chạy lệnh `python factory_cli.py encrypt-walkthrough --dir <duong_dan_du_an>` để nén toàn bộ giao diện 5 màn (`walkthrough_source.html`) thành khối mã hóa **`AES-256-GCM`** (dẫn xuất khóa bằng **`PBKDF2-HMAC-SHA256` 100.000 vòng**).
  3. Tệp `index.html` xuất ra **chỉ chứa màn hình nhập mật khẩu (`#security-vault-gate`)** và chuỗi mã hóa (`__ENCRYPTED_STAGE_PAYLOAD__`). Khi chưa nhập đúng mật khẩu, `document.querySelectorAll('[data-act]').length === 0` (không một thẻ DOM hay dữ liệu nào của dự án được nạp sớm).

---

## 2. Quy Trình 3 Bước Khóa Bảo Mật `.env` & Đẩy Lên Vercel

### Bước 1: Khai báo mật khẩu trong tệp `.env` của dự án
Tạo tệp `.env` (từ mẫu `.env.example`) tại thư mục dự án:
```env
WALKTHROUGH_PASSWORD=MatKhauBaoMatOnSite2026
```

### Bước 2: Mã hóa trang HTML chống tải sớm (`Zero Pre-Auth Load`) & Kiểm định
```bash
# Đóng gói walkthrough_source.html -> index.html đã khóa AES-256-GCM + tạo api/unlock.js:
python factory_cli.py encrypt-walkthrough --dir examples/fde_onsite_client_walkthrough_demo

# Kiểm định tự động (xác nhận không lộ dữ liệu sớm + giải mã kiểm tra đủ 5 màn & Checklist):
python factory_cli.py audit-fde-walkthrough --dir examples/fde_onsite_client_walkthrough_demo
```

### Bước 3: Đẩy lên Vercel (Kèm biến môi trường `.env`)
```bash
# Đẩy bản Preview (Pha 1 - gửi link + mật khẩu cho người dùng duyệt Simulation):
npx vercel --yes

# Đẩy bản Production (Pha 2 - sau khi đã chốt Simulation và hoàn tất Audio + Hiệu ứng):
npx vercel env add WALKTHROUGH_PASSWORD production
npx vercel --prod --yes
```

---

## 3. Cấu Trúc Thư Mục Chuẩn Khi Đóng Gói Lên Vercel

```text
<walkthrough_dir>/
├── .env.example               # Mẫu khai báo WALKTHROUGH_PASSWORD=...
├── .gitignore                 # Chặn commit tệp .env thật lên Git
├── vercel.json                # Cấu hình định tuyến & bảo mật Header trên Vercel
├── simulation_signoff.json    # Dấu niêm phong Cổng 1 (ui_references) & Cổng 2 (simulation_approved)
├── walkthrough_source.html    # Bản nguồn HTML 5 màn (dùng để chỉnh sửa tại máy cục bộ)
├── index.html                 # Bản xuất bản đã khóa mã hóa AES-256-GCM (Zero Pre-Auth Load)
└── api/
    └── unlock.js              # Vercel Serverless Function đối chiếu process.env.WALKTHROUGH_PASSWORD
```
