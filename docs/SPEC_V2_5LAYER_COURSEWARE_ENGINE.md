# Đặc Tả Kỹ Thuật Toàn Diện (`SPEC-03` v2.0): Động Cơ Giáo Án Mô Phỏng Phần Mềm & Bài Giảng Tương Tác 5 Lớp (`software-tutorial-video-factory`)

- **Mã đặc tả:** `SPEC-03-V2-5LAYER-MODULAR-COURSEWARE`
- **Sprint:** `SP_261104_06_Software_Simulation_And_Tutorial_Video_Factory`
- **Tác giả:** `@AI_FactoryArchitect` (`/glob-factory-architect`), `@AI_SolutionArchitect` (`/solution`), `@AuditArbiter` (`/audit`)
- **Trạng thái:** 🟢 Đã khóa thiết kế chuẩn bị thực thi (`Ready for Execution & Parity Gate`)

---

## 1. Hợp Đồng Đối Soát Tệp Đích & Số Đo Định Lượng (`TARGET_FILE` Parity Contract — `[WHAT]`)

Đặc tả này quy định nâng cấp kho mã nguồn [`C:\Github\software-tutorial-video-factory`](file:///C:/Github/software-tutorial-video-factory/README.md#L1-L40) từ kiến trúc HTML đơn khối (`6.731 dòng`, `290KB/bài`) sang **Kiến trúc Giáo án Tương tác 5 Lớp Toàn Khóa (`53KB/bài`, giảm `85%` dung lượng mỗi trang bài học, tổng cộng `6 Chương · 24 Bài giảng`, `144 phần nhỏ / micro-beats` (`b1`..`b6`), `~1.750 giây` thời lượng thuyết minh `48kHz`)** dựa trên chuẩn vàng tại [`Module_6_Live_Masterclass_06/html_video_demos/index.html`](file:///c:/commandcenter/06_Academy_Group/02_Course_Hub/Cohorts_HoctapTech/Antigravity_Basic/antigravity_course_vn/Module_6_Live_Masterclass_06/html_video_demos/index.html#L1-L120).

Bản nâng cấp v2.2 tích hợp thêm **5 Cải Cách Sư Phạm Toàn Khóa (`PROP-261105-04`)**:
1. **Đồ thị Tiên quyết Không Chu trình & 0% Trùng lặp (`Prerequisite DAG`):** Toàn bộ 24 bài học (`lesson_01.html`..`lesson_24.html`) khai báo tường minh `prerequisites`, `dependents`, `placement_risk`, `continuity_bridge` trong `lesson_meta.json` và hiển thị trực tiếp tại hộp `#ksb-dep-box` trên Sidebar Trái.
2. **Tách bạch Lý thuyết Kiểu 1 (`theory_type_1` — `b1`):** Slide Hero 100% Trực quan với **4 Bố cục Đồ họa Chuyên biệt** (`.k-layout-flowchart`, `.k-layout-comparison`, `.k-layout-timeline`, `.k-layout-anatomy`), loại bỏ hoàn toàn biểu đồ phần trăm bịa đặt.
3. **Tách bạch Lý thuyết Kiểu 2 (`theory_type_2` — `b2`, `b3`):** Giảng lý thuyết kỹ thuật/quy trình gắn trực tiếp trên màn hình mô phỏng (`mode: "sim"`) kèm Thẻ Kiến thức Nổi (`#kudo-stage-pedagogy-card`).
4. **Thực hành 3 Bước Tiến triển Thực sự (`practice_step` — `b4`, `b5`, `b6`):** Chuỗi 3 bước liên hoàn (`Bước 1/3` chuẩn bị $\to$ `Bước 2/3` thao tác $\to$ `Bước 3/3` nghiệm thu kết quả) có trạng thái màn hình thay đổi thực tế qua từng nhịp.
5. **144 Tệp Âm thanh Thuyết minh `VieNeu-TTS 48kHz`:** Đồng bộ thời lượng thực cho toàn bộ 24 bài học (`audio/lesson_01..24/b1..b6.mp3`).

Các tệp mã nguồn và tài liệu cốt lõi bắt buộc phải hiện diện và khớp chữ ký AST trong kho mã nguồn đích `C:\Github\software-tutorial-video-factory`:

=== TARGET_FILE: C:/Github/software-tutorial-video-factory/core_engine/course_compiler.py ===
- Động cơ biên dịch và kiểm toán Giáo án Tương tác 5 Lớp (`LessonSpecCompiler`, `CourseManifestBuilder`, `CourseIntegrityAuditor`, `compile_modular_courseware`, `audit_modular_courseware`), biên dịch `lessons/lesson_XX/sessions/*.json` và `slides/*.html` ra `lesson_spec.js` và `course_manifest.js` chạy trực tiếp trên `file://` không bị chặn CORS, đồng thời kiểm tra không có tệp audition ngoại lai.

=== TARGET_FILE: C:/Github/software-tutorial-video-factory/core_engine/intake_extractor.py ===
- Động cơ thu hoạch đầu vào từ Video, Ảnh chụp màn hình và Kho mã nguồn (`analyze_screenshots`, `extract_video_keyframes`, `harvest_code_repository`, `generate_simulator_scaffold`).

=== TARGET_FILE: C:/Github/software-tutorial-video-factory/core_engine/scene_builder.py ===
- Động cơ biên dịch đặc tả JSON thành 6 khuôn trang HTML 16:9 (`build_shot_html`, `compile_spec_to_pages`).

=== TARGET_FILE: C:/Github/software-tutorial-video-factory/core_engine/syncgate_and_foley.py ===
- Động cơ kiểm định cơ học 0-Token (`SyncGateReport`, `ReelCrewRubricAuditor`, `evaluate_semantic_syncgate`, `audit_video_spec_rules`, `audit_html_simulator`, `synthesize_procedural_foley_wav`).

=== TARGET_FILE: C:/Github/software-tutorial-video-factory/factory_cli.py ===
- Giao diện dòng lệnh hợp nhất của nhà máy, bổ sung 2 lệnh mới `compile-course` và `verify-course` cho Kiến trúc Giáo án 5 Lớp.

=== TARGET_FILE: C:/Github/software-tutorial-video-factory/docs/SPEC_V2_5LAYER_COURSEWARE_ENGINE.md ===
- Tài liệu Đặc tả Kỹ thuật chính thức của Kiến trúc Giáo án Tương tác 5 Lớp đặt ngay trong kho mã nguồn GitHub.

=== TARGET_FILE: C:/Github/software-tutorial-video-factory/docs/CODEMAP.md ===
- Bản đồ Mã nguồn & Kiến trúc toàn hệ thống đặt ngay trong kho mã nguồn GitHub để dẫn đường cho AI Agent.

=== TARGET_FILE: C:/Github/software-tutorial-video-factory/examples/antigravity_studio_simulator/index.html ===
- Cổng mục lục khóa học 6 bài (47 phần nhỏ) theo bố cục 1 Sidebar Trái Tinh Gọn (`sidebar-collapsed`).

=== TARGET_FILE: C:/Github/software-tutorial-video-factory/examples/antigravity_studio_simulator/assets/js/player_engine.js ===
- Động cơ điều khiển bài giảng tương tác lấy giọng đọc làm đồng hồ chủ (`Audio-Driven Master Clock v2`).

=== TARGET_FILE: C:/Github/software-tutorial-video-factory/examples/antigravity_studio_simulator/assets/js/spotlight_cursor.js ===
- Động cơ định vị hộp tiêu điểm cam (`#kudo-spotlight`) và con trỏ chuột thông minh (`#kudo-cursor`) chống che khuất bảng gợi ý.

=== TARGET_FILE: C:/Github/software-tutorial-video-factory/tests/test_factory_pipeline.py ===
- Bộ kiểm thử tự động `pytest` bao phủ toàn bộ động cơ nhà máy và Kiến trúc Giáo án 5 Lớp.

---

## 2. Lý Do Thiết Kế & Các Ràng Buộc Bất Biến (`[WHY]`)

### 2.1. Sáu Quy Tắc Bất Biến Của Kiến Trúc Giáo Án 5 Lớp (6 Core Invariants)
1. **Bất biến 1 — Ranh giới Thuần Giáo Án (`Courseware-Only Scope Invariant` — `PROP-261105-03`):**
   - Toàn bộ kho mã nguồn chỉ phục vụ mục tiêu xây dựng **Giáo án lý thuyết (`slides/*.html`), Mô phỏng phần mềm tương tác (`simulator_core.js` / `simulator_actions.js`), Trình phát bài giảng đồng bộ giọng đọc (`player_engine.js`) và Xuất video MP4 16:9 (`kcast_engine/`)**.
   - Tuyệt đối cấm đưa các tệp thử nghiệm giọng đọc phụ trợ (`vieneu_english_ab_audition.html`, `audio/audition_en/*`, `config/audition_en_*`) vào trong repo.
2. **Bất biến 2 — Tách Bạch 5 Lớp Mô-đun Không Trùng Lặp (`5-Layer Separation of Concerns`):**
   - **Lớp 1 (`config/` — Cấu hình & Danh mục):** `brand_config.json`/`.js`, `course_manifest.json`/`.js`, `pronunciation_lexicon.json`.
   - **Lớp 2 (`assets/css/` — Giao diện & Bố cục Responsive):** `simulator_core.css`, `brand_tokens.css`, `player_sidebar_layout.css` (1 Sidebar Trái `280px` + Khung chính `1fr` + Responsive `@media (max-width: 900px)`), `simulator_overrides.css`.
   - **Lớp 3 (`assets/js/`, `assets/avatar/`, `assets/templates/` — Động cơ Lõi & Nhân vật):** `simulator_core.js`, `simulator_actions.js`, `spotlight_cursor.js`, `player_engine.js`, `lecturer_poses.js` (`window.KUDO_LECTURER_POSES_SVG`), `simulator_stage_dom.html`.
   - **Lớp 4 (`lessons/lesson_XX/` & `audio/lesson_XX/` — Hạt Tri Thức Giáo Án):** `lesson_meta.json`, `slides/s*.html`, `sessions/b*.json` biên dịch thành `lesson_spec.js` (`window.KUDO_SPEC`), đi kèm các tệp âm thanh `audio/lesson_XX/b*.mp3`.
   - **Lớp 5 (`index.html`, `lesson_01..06_*.html`, `DESIGN.md`, `REVIEW.md`, `llms.txt` — Cổng Trình Chiếu & Chuẩn AX/WCAG):** Các tệp HTML đầu vào siêu gọn (`~60KB`/bài) nạp 5 lớp module qua thẻ `<link>` và `<script>`, tích hợp đầy đủ JSON-LD `LearningResource`, `@media (prefers-reduced-motion: reduce)` và `aria-live="polite"`.
3. **Bất biến 3 — Biên Dịch Chống Lỗi CORS Khi Mở Trực Tiếp Trên Ổ Cứng (`No-CORS file:// Compilation`):**
   - Trình duyệt hiện đại chặn lệnh `fetch()` đối với các tệp `.json` và `.html` nội bộ khi mở qua giao thức `file://`. Do đó, mọi chỉnh sửa trong `lessons/lesson_XX/sessions/*.json` và `slides/*.html` bắt buộc phải được biên dịch qua `LessonSpecCompiler` thành tệp script `lessons/lesson_XX/lesson_spec.js` (`window.KUDO_SPEC = ...;`) và `config/course_manifest.js` (`window.KUDO_COURSE_MANIFEST = ...;`).
4. **Bất biến 4 — Đồng Hồ Chủ Dẫn Dắt Bởi Âm Thanh (`Audio-Driven Master Clock v2`):**
   - Khi đang phát tiếng (`!kudoIsMuted && !kudoAutoplayBlocked`), thẻ `<audio id="kudo-voice-player">` là đồng hồ chủ duy nhất. Chừng nào `vp.ended !== true`, hệ thống tuyệt đối cấm chuyển cảnh. Khi `vp.ended === true`, nhân vật khép môi, con trỏ giả lập tự động ẩn đi (`window.kudoSpeechCompletedForBeat = true`), nghỉ lấy hơi `0.60s` rồi mới chuyển sang phần tiếp theo.
5. **Bất biến 5 — Con Trỏ Chuột & Nhãn Hướng Dẫn Không Bao Giờ Che Chữ (`Anti-Occlusion Smart Cursor`):**
   - Khi mở các bảng gợi ý (`#ide-popup-menu`, `#agy2-popup-menu`, `#kudo-model-popover`, `#kudo-turbo-popover`, `#kudo-context-menu`), mũi tên chuột `#kudo-cursor` tự động neo ở góc trống phía trên bên phải của hộp thoại và nhãn `#kudo-cursor-label` đặt phía trên hộp thoại.
   - Khi trỏ vào ô nhập chat `#ide-chat-input`, nhãn hướng dẫn tự động nâng cao `38px` phía trên ô nhập để không che thanh công cụ `@ / 📊 🌐`.
   - Học viên có thể bấm nút `🖱️ Ẩn chuột & Tip [C]` (hoặc phím `C`) hoặc click trực tiếp vào vùng mô phỏng để ẩn ngay con trỏ giả lập.
6. **Bất biến 6 — Bố Cục 1 Sidebar Trái Tinh Gọn (`Single Left-Sidebar Default`):**
   - Khi mở Cổng khóa học `index.html`, ngăn kéo mục lục ngoài mặc định ở trạng thái đóng (`sidebar-collapsed`) để chỉ hiển thị duy nhất 1 Sidebar Trái (`280px`) của bài học bên trong `iframe`, nhường trọn `1160px` chiều ngang (trên màn hình `1440px`) cho khu vực mô phỏng phần mềm.

---

## 3. Thiết Kế Chi Tiết Các Lớp & Cấu Trúc Dữ Liệu (`[HOW]`)

### 3.1. Đặc Tả Module `core_engine/course_compiler.py`
Module `core_engine/course_compiler.py` cung cấp 3 class Python chuẩn xác:

1. **Class `LessonSpecCompiler`:**
   - Phương thức `compile_lesson(lesson_dir: Path) -> Dict[str, Any]`:
     - Đọc `lesson_dir / "lesson_meta.json"`.
     - Đọc toàn bộ tệp slide trong `lesson_dir / "slides"` theo danh sách `slide_ids` (ví dụ `["s1", "s2"]` $\to$ đọc `s1.html`, `s2.html` vào dictionary `slides`).
     - Đọc toàn bộ tệp nhịp giảng trong `lesson_dir / "sessions"` theo danh sách `session_order` (ví dụ `["b1", "b2", ...]`), tính tổng `beats_count` và `total_duration_sec` (làm tròn 1 chữ số thập phân) cùng chuỗi `duration_formatted` (`MM:SS`).
     - Tạo đối tượng `spec_obj = {"code": ..., "title": ..., "filename": ..., "slides": slides_dict, "beats": beats_list}`.
     - Ghi tệp `lesson_dir / "lesson_spec.js"` với nội dung `window.KUDO_SPEC = <JSON>;` và cập nhật lại `lesson_meta.json` với số liệu `beats_count`, `total_duration_sec`, `duration_formatted` chuẩn xác.

2. **Class `CourseManifestBuilder`:**
   - Phương thức `build_course(course_root: Path) -> Dict[str, Any]`:
     - Tìm tất cả thư mục bài học `lessons/lesson_*` theo thứ tự bảng chữ cái.
     - Gọi `LessonSpecCompiler.compile_lesson()` cho từng bài học.
     - Tổng hợp danh sách metadata của tất cả bài học và ghi ra `config/course_manifest.json` cùng `config/course_manifest.js` (`window.KUDO_COURSE_MANIFEST = <JSON>;`).
     - Nếu có `config/brand_config.json`, tự động đồng bộ sang `config/brand_config.js` (`window.KUDO_BRAND_CONFIG = <JSON>;`).

3. **Class `CourseIntegrityAuditor`:**
   - Phương thức `audit_course(course_root: Path) -> Dict[str, Any]`:
     - Kiểm tra sự hiện diện của đủ 5 lớp tệp bắt buộc:
       - Lớp 1: `config/brand_config.js`, `config/course_manifest.js`, `config/pronunciation_lexicon.json`
       - Lớp 2: `assets/css/simulator_core.css`, `assets/css/brand_tokens.css`, `assets/css/player_sidebar_layout.css`, `assets/css/simulator_overrides.css`
       - Lớp 3: `assets/js/simulator_core.js`, `assets/js/simulator_actions.js`, `assets/js/spotlight_cursor.js`, `assets/js/player_engine.js`, `assets/avatar/lecturer_poses.js`, `assets/templates/simulator_stage_dom.html`
       - Lớp 4: Tất cả bài học trong `course_manifest` đều có `lesson_spec.js`, mọi nhịp `mode == "theory"` đều tham chiếu tới `slide` có thật trong `slides`, và mọi `audio_src` khai báo đều tồn tại trên ổ cứng.
       - Lớp 5: `index.html`, tất cả các tệp `lesson_XX_*.html` trong manifest, `DESIGN.md`, `REVIEW.md`, `llms.txt`.
     - Kiểm tra **Chốt chặn Không Lẫn Tệp Audition (`Zero Audition Pollution Check`)**: Quét toàn bộ `course_root`; nếu phát hiện bất kỳ tệp hay thư mục nào có tên chứa `audition` (như `vieneu_english_ab_audition.html`, `audition_en`), lập tức báo lỗi `FAIL`.
     - Trả về kết quả `{"status": "PASS" | "FAIL", "lessons_count": ..., "total_beats": ..., "errors": [...], "warnings": [...]}`.

### 3.2. Đặc Tả Schema Dữ Liệu Hạt Giáo Án (JSON Schemas)

#### A. Schema `lessons/lesson_XX/lesson_meta.json`
```json
{
  "lesson_slug": "lesson_01",
  "filename": "lesson_01_chatbot_vs_agent.html",
  "code": "BÀI 1.1",
  "title": "Từ hỏi đáp trên trình duyệt đến trợ lý AI làm việc trực tiếp trong thư mục máy tính",
  "short_title": "1.1 · Trình duyệt web vs. Trợ lý làm việc trong thư mục",
  "description": "Phân biệt hai phần mềm độc lập Antigravity 2.0 và Antigravity IDE, cách chọn 5 mô hình AI, bấm Open IDE và đính kèm tệp bằng @.",
  "slide_ids": ["s1", "s2"],
  "session_order": ["b1", "b2", "b3", "b4", "b5", "b6", "b7", "b8", "b9", "b10"],
  "beats_count": 10,
  "total_duration_sec": 126.5,
  "duration_formatted": "02:07"
}
```

#### B. Schema Nhịp Lý Thuyết (`mode: "theory"` trong `sessions/b1.json`)
```json
{
  "id": "b1",
  "label": "1. Hạn chế khi hỏi trên web",
  "duration": 14.14,
  "mode": "theory",
  "pose": 1,
  "slide": "s1",
  "hl": ["sl-c1"],
  "focus_selectors": ["#sl-c1"],
  "caption": "Lời giảng hiển thị trên thanh phụ đề và đọc bằng giọng thuyết minh...",
  "audio_src": "audio/lesson_01/b1.mp3",
  "audio_duration": 13.49
}
```

#### C. Schema Nhịp Thực Hành Mô Phỏng (`mode: "sim"` trong `sessions/b8.json`)
```json
{
  "id": "b8",
  "label": "8. Bấm nút Open IDE",
  "duration": 10.09,
  "mode": "sim",
  "pose": 7,
  "surface": "mgr",
  "focus_selectors": ["#agy2-open-ide-btn"],
  "focus_pad": 8,
  "cursor_selector": "#agy2-open-ide-btn",
  "cursor_label": "Bấm Open IDE để mở cửa sổ 3 cột",
  "caption": "Từ giao diện Antigravity 2.0, bất cứ khi nào muốn kiểm tra cây thư mục...",
  "onEnter": "kudoHidePopovers(); switchToSurface('mgr'); closeSettingsModal(); loadAgy2Thread('main'); openAgy2RightPane('0.1_Introduction.md');",
  "audio_src": "audio/lesson_01/b8.mp3",
  "audio_duration": 9.44
}
```

---

## 4. Phán Quyết Kiểm Toán 4 Phần (`PROP-261014-08`)

1. **Khuyến nghị (Verdict):** **CHẤP THUẬN ĐẶC TẢ `SPEC-03` (CONDITIONAL PASS)** làm chuẩn đối chiếu cơ học cho toàn bộ quá trình nâng cấp v2.0.
2. **Điều kiện Ràng buộc (Conditions):** Mọi tệp trong danh sách `TARGET_FILE` phải tồn tại đầy đủ và vượt qua kiểm tra `run_audit.py parity` ở mức `100.0/100.0`.
3. **Chủ sở hữu Xác minh (Verification Owner):** `@AI_FactoryArchitect` (`/glob-factory-architect`) & `@AuditArbiter` (`/audit`) báo cáo kết quả lên **CEO Hoàng Đức Minh**.
4. **Thước đo Kiểm chứng Cơ học (Verification Metrics):** `run_audit.py pdca` đạt `100.0/100.0`, `run_audit.py parity` đạt `100.0/100.0`, `pytest` đạt `100% PASS`.
