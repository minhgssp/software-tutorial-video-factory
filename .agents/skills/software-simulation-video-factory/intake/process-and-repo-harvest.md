# Chuyên Viên Khảo Sát Quy Trình Nghiệp Vụ (BA/UAT) & Kho Mã Nguồn

## 1. Khi đầu vào là Kho Mã Nguồn (Code Repository)
```bash
python factory_cli.py intake-repo --repo <duong_dan_repo> --name "<Ten_Phan_Mem>" --out temp/blueprint.json
```
- Trích xuất cây thư mục ảo (`VFS`), danh sách màn hình/route chính và các mẫu biểu mẫu để dựng nguyên mẫu tương tác.

## 2. Khi đầu vào là Tài liệu Quy trình / Yêu cầu Xác nhận Nghiệp vụ (Process Confirmation)
- Tách quy trình thành chuỗi các **Bước Nghiệp Vụ Độc Lập (`Micro-Steps`)**:
  * **Trạng thái Trước (`As-Is` / Điểm nghẽn):** Nhân sự đang phải thao tác thủ công hoặc dễ nhầm lẫn ở đâu? (Dùng làm chất liệu cho Slide Lý thuyết `s1.html`).
  * **Trạng thái Chuẩn (`To-Be` / Luồng phần mềm):** Gồm mấy bước bấm trên màn hình? Mỗi bước tác động vào nút nào, trường dữ liệu nào và kết quả trả về trên giao diện là gì?
