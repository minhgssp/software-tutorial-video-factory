# REVIEW.md — Danh Mục Kiểm Định Chất Lượng (Quality Gate Checklist)

- [x] **P1 (Single Sidebar & Full Stage Width):** Mở `index.html` mặc định chỉ hiển thị 1 Sidebar Trái (`280px`), nhường trọn `1160px` cho khu vực mô phỏng; có thanh chuyển nhanh 6 bài trên Top Bar.
- [x] **P2 (Responsive Tablet/Mobile & Anti-Clipping):** Có `@media (max-width: 900px)` xếp chồng 2 tầng, `#kudo-slide-box` cho phép cuộn dọc, `.table-wrap` cuộn ngang mượt (`hasOverflowX = false` trên cả `1440px`, `768px`, `375px`).
- [x] **P3 (Accessibility WCAG 2.2 AA):** 100% nút bấm đạt kích thước tối thiểu `>= 24x24px` (`smallTargetsCount = 0`), hỗ trợ `@media (prefers-reduced-motion: reduce)`, `aria-live="polite"`, và điều khiển bàn phím (`Space`, `ArrowLeft`, `ArrowRight`, `M`, `C`).
- [x] **P5 (AX Discovery & Structured Data):** Đầy đủ `<meta name="description">`, Open Graph, `application/ld+json`, `llms.txt`, `DESIGN.md`, `REVIEW.md`.
- [x] **Con trỏ chuột thông minh (`#kudo-cursor`):** Không che lấp popup gợi ý, không tràn sang cột bên cạnh, tự biến mất khi câu thoại kết thúc hoặc khi bấm nút `🖱️ Ẩn chuột & Tip [C]`.
- [x] **Kiến trúc Module hóa 5 Lớp Triệt để 100%:** Toàn bộ CSS/JS/SVG của Simulator được tách vào `assets/css/simulator_core.css`, `assets/js/simulator_core.js`, `assets/avatar/lecturer_poses.js`, `assets/templates/simulator_stage_dom.html`.
