# INSTRUCTOR FULL FUNCTION TEST CHECKLIST
> **Dự án**: MindNova AI — Hệ thống Quản lý & Học tập Trực tuyến
> **Ngày phân tích code**: 31/08/2026
> **Vai trò trọng tâm**: Giáo viên (Instructor / Teacher)
> **Phạm vi phân tích**: Frontend (`mindnova-ai`), Backend (`website-MindNova-AI`), Database & Cloud Storage
> **Mục đích**: Cung cấp danh sách kiểm thử thủ công (Manual Testing Checklist) đầy đủ nhất cho Tester/QA/Dev.

---
Account test:
Giáo viên: gvtest@gmail.com : 123456
Học sinh:
Admin:
---

# PHẦN 1 — TỔNG QUAN HỆ THỐNG

### Thống kê Chức năng Phát hiện qua Code Analysis:
- **Tổng số chức năng phát hiện**: **72 chức năng** (Bao gồm chức năng lớn, luồng liên hoàn, AI và micro-features).
- **Chức năng Instructor trực tiếp**: 34 chức năng.
- **Chức năng Admin liên quan đến Instructor**: 9 chức năng.
- **Chức năng Student liên quan đến Instructor**: 8 chức năng.
- **Tính năng AI Features**: 7 module AI toàn hệ thống.
- **Chức năng phụ & Micro UI States**: 14 nhóm kiểm thử giao diện & tiện ích.

### Trạng thái Kiểm thử (Quy định):
Dựa trên phân tích source code thực tế, tất cả chức năng đều ở các trạng thái ban đầu:
- `Đã phát hiện` | `Có vẻ đã implement` | `Có API liên quan` | `Có UI liên quan` | `Cần test thủ công` | `Có dấu hiệu chưa hoàn thành / Mock data`.
- **KHÔNG** tự ý ghi `PASS`, `Hoạt động tốt` hay `Đã xác nhận`. Mọi ô tick đều chờ người dùng tự test thủ công.

---

# PHẦN 2 — SƠ ĐỒ CẤU TRÚC CHỨC NĂNG (ASCII TREE)

```text
HỆ THỐNG MINDNOVA AI (INSTRUCTOR ECOSYSTEM)
│
├── 1. AUTHENTICATION & PROFILE MANAGEMENT
│   ├── 1.1 Đăng nhập / Đăng xuất (Role: Teacher)
│   ├── 1.2 Xem & Cập nhật Hồ sơ cá nhân (Teacher Profile)
│   ├── 1.3 Upload Avatar Giảng viên
│   ├── 1.4 Quản lý Bằng cấp & Chứng chỉ (Certificates CRUD)
│   ├── 1.5 Gửi Yêu cầu Xác minh Giảng viên (Teacher Verification Request)
│   └── 1.6 Đổi Mật khẩu & OTP Verification
│
├── 2. INSTRUCTOR DASHBOARD OVERVIEW
│   ├── 2.1 Các Thẻ Chỉ số Thống kê (Total Courses, Students, Revenue, Rating)
│   ├── 2.2 Danh sách Khóa học Mới nhất (Recent Courses Widget)
│   ├── 2.3 Hoạt động & Đơn hàng mới (Recent Sales / Activity Feed)
│   └── 2.4 Thanh Phím tắt Thao tác Nhanh (Quick Action Bar)
│
├── 3. QUẢN LÝ KHÓA HỌC (COURSE MANAGEMENT)
│   ├── 3.1 Xem Danh sách Khóa học (Grid & Table View)
│   ├── 3.2 Tìm kiếm, Lọc (Status/Level/Category) & Sắp xếp Khóa học
│   ├── 3.3 Phân trang Danh sách Khóa học (Pagination)
│   ├── 3.4 Thay đổi Trạng thái Khóa học (Draft -> Request Review -> Published)
│   ├── 3.5 Xóa Khóa học (Delete Course Modal)
│   ├── 3.6 Cấu hình Mô hình Giá (Free / Paid / Discount Schedule)
│   ├── 3.7 Quản lý Mã giảm giá (Coupons CRUD & Toggle Active)
│   └── 3.8 Đánh giá Sức khỏe Khóa học (Course Health Score Card)
│
├── 4. LUỒNG TẠO KHÓA HỌC (COURSE CREATION FLOW)
│   ├── 4.1 Bước 1: Nhập Thông tin Cơ bản & Upload Thumbnail
│   ├── 4.2 Bước 2: Dàn ý Cấu trúc Chương & Bài học (Manual & AI Outline)
│   ├── 4.3 Bước 3: Cài đặt Giá, Mã Khuyến mãi & Gửi Duyệt
│   └── 4.4 Quản lý Lịch sử Bản nháp (Draft Revisions & Diff Restore)
│
├── 5. QUẢN LÝ CHƯƠNG HỌC (MODULE MANAGEMENT)
│   ├── 5.1 Thêm Module mới
│   ├── 5.2 Chỉnh sửa Tên & Mô tả Module
│   ├── 5.3 Xóa Module (Xóa kèm Bài học bên trong)
│   ├── 5.4 Sắp xếp Thứ tự Module (Drag/Drop or Order Index)
│   └── 5.5 Thu gọn / Mở rộng Module (Accordion Expand/Collapse)
│
├── 6. QUẢN LÝ BÀI HỌC (LESSON MANAGEMENT)
│   ├── 6.1 Tạo & Sửa Bài học Document (Rich Text Editor CKEditor)
│   ├── 6.2 Tạo & Sửa Bài học Video (Upload Video File / URL)
│   ├── 6.3 Tạo & Sửa Bài học Quiz (Tạo đề thi trắc nghiệm/tự luận)
│   ├── 6.4 Xem trước Bài học (Preview Lesson Modal)
│   ├── 6.5 Sắp xếp Thứ tự Bài học trong Module
│   └── 6.6 Yêu cầu Xóa Bài học (Dành cho Khóa học đã Published)
│
├── 7. TÍNH NĂNG TRÍ TUỆ NHÂN TẠO (AI FEATURES)
│   ├── 7.1 AI Course Outline Generator (Tạo dàn ý khóa học tự động)
│   ├── 7.2 AI Standalone Quiz Generator (Tạo đề thi từ Prompt, Document, URL)
│   ├── 7.3 AI Lesson Quiz Generator (Tạo Quiz nhanh cho bài học)
│   ├── 7.4 AI Student Notification Generator (Tạo nội dung thông báo AI)
│   ├── 7.5 AI Student Analytics & Insights (Phân tích mức độ tương tác)
│   ├── 7.6 AI Tutor / Learning Assistant (Trợ lý AI trả lời bài học cho Student)
│   └── 7.7 AI Lesson Summarizer & Self-Assessment (Tóm tắt & Đề tự luyện)
│
├── 8. QUẢN LÝ HỌC VIÊN & THẢO LUẬN (STUDENTS & DISCUSSIONS)
│   ├── 8.1 Danh sách Học viên Đăng ký (Enrolled Students List)
│   ├── 8.2 Xem Chi tiết Tiến độ & Phân nhóm Học viên (Active/At-Risk)
│   ├── 8.3 Gửi Thông báo Hàng loạt / AI Bulk Notification
│   ├── 8.4 Xuất Danh sách Học viên ra CSV (Export Student Data)
│   ├── 8.5 Xem & Trả lời Thảo luận / Q&A Bài học (Discussion Replies)
│   └── 8.6 Biểu đồ Tương tác & Phân tích Bỏ học (Engagement Analytics)
│
├── 9. QUẢN LÝ DOANH THU & RÚT TIỀN (REVENUE & PAYOUTS)
│   ├── 9.1 Tổng quan Doanh thu & Phí Nền tảng (Revenue Metrics)
│   ├── 9.2 Báo cáo Bán hàng Chi tiết (Sales Report by Course)
│   ├── 9.3 Lịch sử Giao dịch & Đơn hàng (Transaction Log)
│   ├── 9.4 Yêu cầu Rút tiền về Ngân hàng (Withdrawal Request Modal)
│   └── 9.5 Theo dõi Trạng thái Rút tiền (Withdrawal Status History)
│
├── 10. PHÂN VÀI ADMIN LIÊN QUAN INSTRUCTOR
│   ├── 10.1 Duyệt Yêu cầu Xác minh Giảng viên (Teacher Verification Review)
│   ├── 10.2 Duyệt Bằng cấp & Minh chứng Giảng viên (Certificates Approval)
│   ├── 10.3 Khóa / Mở khóa Tài khoản Giảng viên (Lock/Unlock Account)
│   ├── 10.4 Duyệt Khóa học (Content Moderation Workflow: Approve/Reject/Fixes)
│   ├── 10.5 Duyệt Yêu cầu Xóa Bài học của Khóa Published (Deletion Requests)
│   └── 10.6 Cấu hình Tham số AI System (AI Key, Model, Provider Settings)
│
└── 11. PHÂN VÀI STUDENT LIÊN QUAN INSTRUCTOR
    ├── 11.1 Xem Chi tiết Khóa học & Giảng viên (Course & Instructor Info)
    ├── 11.2 Đăng ký / Mua Khóa học (Enrollment & Order Checkout)
    ├── 11.3 Giao diện Học tập (Video, Document Workspace)
    ├── 11.4 Làm Bài thi Quiz & Nhận Kết quả Tự động (Quiz Attempt)
    ├── 11.5 Cập nhật Tiến độ Học tập (Progress Completion Tracker)
    └── 11.6 Đánh giá & Review Khóa học (Course Review & Rating)
```

---

# PHẦN 3 — CHECKLIST CHỨC NĂNG GIẢO VIÊN

## 3.1. Authentication & Profile Management

---

### [V] 1. Đăng nhập hệ thống với vai trò Instructor
- **Vai trò**: Instructor
- **Mức độ**: Chức năng chính
- **Mô tả**: Cho phép người dùng có vai trò `teacher` đăng nhập vào hệ thống để truy cập giao diện quản trị giảng viên.
- **Vị trí hệ thống**:
  - Page: `/login`
  - Route Backend: `POST /api/login`
- **Các bước tự test**:
  1. Truy cập trang `/login`.
  2. Nhập Email và Mật khẩu của tài khoản Giảng viên.
  3. Bấm nút "Đăng nhập".
- **Kết quả mong đợi**: Hệ thống trả về Bearer Token, lưu token vào Cookie/LocalStorage, chuyển hướng người dùng đến trang `/instructor`.
- **Luồng kỹ thuật**: UI Form -> `useAuthStore` -> `POST /api/login` -> `AuthController@login` -> Validate Credentials -> Return Token -> Redirect.
- **File liên quan**:
  - Frontend: [mindnova-ai/app/(auth)/login/page.tsx](file:///h:/du_an/website/mindnova-ai/app/(auth)/login/page.tsx)
  - Backend: [website-MindNova-AI/app/Http/Controllers/Api/Auth/AuthController.php](file:///h:/du_an/website/website-MindNova-AI/app/Http/Controllers/Api/Auth/AuthController.php#L35)
- **Phụ thuộc**: Bảng `users` (Cột `role` = `teacher`).
- **Ghi chú phân tích**: Đã có sẵn API Sanctum và Middleware `role:teacher`.
- **Kết quả test thủ công**:
  - [V] PASS
  - [ ] FAIL
  - [ ] PARTIAL
  - [ ] NOT TESTED
- **Ghi chú khi test**: ................................................................
+Đã chạy được
---

### [V] 2. Xem & Cập nhật Hồ sơ cá nhân (Teacher Profile)
- **Vai trò**: Instructor
- **Mức độ**: Chức năng chính
- **Mô tả**: Xem thông tin giảng viên, cập nhật tên, tiểu sử (bio), kinh nghiệm chuyên môn, website cá nhân, liên kết mạng xã hội.
- **Vị trí hệ thống**:
  - Page: `/instructor/profile`
  - Route Backend: `GET /api/instructor/profile`, `PUT /api/instructor/profile`
- **Các bước tự test**:
  1. Truy cập vào `/instructor/profile`.
  2. Kiểm tra thông tin hiện tại hiển thị đúng.
  3. Thay đổi Tên hiển thị, Chuyên môn (Headline), Bio và bấm "Lưu thay đổi".
  4. F5 Refresh lại trang để kiểm tra dữ liệu đã cập nhật.
- **Kết quả mong đợi**: Form báo lưu thành công, thông tin mới hiển thị đúng sau khi reload.
- **Luồng kỹ thuật**: UI Form -> `TeacherProfileContainer.tsx` -> `PUT /api/instructor/profile` -> `TeacherProfileController@updateProfile` -> DB `users` & `user_profiles`.
- **File liên quan**:
  - Frontend: [mindnova-ai/src/features/instructor/profile/components/TeacherProfileContainer.tsx](file:///h:/du_an/website/mindnova-ai/src/features/instructor/profile/components/TeacherProfileContainer.tsx)
  - Backend: [website-MindNova-AI/app/Http/Controllers/Api/Instructor/TeacherProfileController.php](file:///h:/du_an/website/website-MindNova-AI/app/Http/Controllers/Api/Instructor/TeacherProfileController.php#L20)
- **Phụ thuộc**: `users`, `user_profiles`.
- **Ghi chú phân tích**: Đã có đầy đủ Frontend & Backend controller.
- **Kết quả test thủ công**:
  - [v] PASS
  - [ ] FAIL
  - [ ] PARTIAL
  - [ ] NOT TESTED
- **Ghi chú khi test**: ................................................................
+Không đổi được chuyên môn chính:
SQLSTATE[01000]: Warning: 1265 Data truncated for column 'skill_level' at row 1 (Connection: mysql, Host: 127.0.0.1, Port: 3306, Database: du_an, SQL: update `user_profiles` set `skill_level` = tester, `user_profiles`.`updated_at` = 2026-08-31 22:23:31 where `id` = 13)
+Các phần khác đều đổi được: Họ và Tên, Số điện thoại, Kinh nghiệm làm việc, Địa chỉ, Giới thiệu ngắn (Bio)V

**Đã thay đổi**
- Chuyển kiểu dữ liệu cột `skill_level` trong bảng `user_profiles` từ `ENUM` sang `VARCHAR(255)` trong migration `2026_07_23_000002_create_user_profiles_table.php` và đã cập nhật trực tiếp Database.
- Giảng viên có thể lưu mọi thông tin chuyên môn chính (VD: "Tester", "Lập trình viên React") mà không bị dính lỗi SQL truncation (1265).
---

### [v] 3. Upload Ảnh đại diện (Avatar)
- **Vai trò**: Instructor
- **Mức độ**: Chức năng phụ
- **Mô tả**: Chọn file ảnh (PNG/JPG/WEBP), upload làm avatar giảng viên.
- **Vị trí hệ thống**:
  - Button: Biểu tượng Camera / Edit Avatar trên trang Profile
  - Route Backend: `POST /api/instructor/avatar`
- **Các bước tự test**:
  1. Nhấp nút Upload Avatar.
  2. Chọn file ảnh > 2MB (kiểm tra validation) và file ảnh hợp lệ < 2MB.
  3. Xác nhận upload.
- **Kết quả mong đợi**: Báo lỗi nếu quá kích thước. Ngược lại, ảnh avatar mới được cập nhật ngay lập tức trên Topbar & Profile.
- **Luồng kỹ thuật**: FileInput -> `POST /api/instructor/avatar` -> `TeacherProfileController@uploadAvatar` -> Save Cloud/Local Storage -> Update DB `avatar_url` -> Render.
- **File liên quan**:
  - Frontend: [TeacherProfileContainer.tsx](file:///h:/du_an/website/mindnova-ai/src/features/instructor/profile/components/TeacherProfileContainer.tsx)
  - Backend: [TeacherProfileController.php](file:///h:/du_an/website/website-MindNova-AI/app/Http/Controllers/Api/Instructor/TeacherProfileController.php#L45)
- **Kết quả test thủ công**:
  - [v] PASS
  - [ ] FAIL
  - [ ] PARTIAL
  - [ ] NOT TESTED
- **Ghi chú khi test**: ................................................................+
+Upload avatar thành công
---

### [v] 4. Quản lý Bằng cấp & Chứng chỉ (Teacher Certificates CRUD)
- **Vai trò**: Instructor
- **Mức độ**: Chức năng chính
- **Mô tả**: Thêm, sửa, xóa các bằng cấp/chứng chỉ chuyên môn làm bằng chứng xác minh năng lực giảng dạy.
- **Vị trí hệ thống**:
  - Tab "Bằng cấp & Chứng chỉ" trong Profile
  - Route Backend: `GET /api/instructor/certificates`, `POST /api/instructor/certificates`, `PUT /api/instructor/certificates/{id}`, `DELETE /api/instructor/certificates/{id}`
- **Các bước tự test**:
  1. Thêm bằng cấp mới: Nhập Tên bằng, Tổ chức cấp, Năm cấp, Upload file chứng minh (PDF/Image).
  2. Chỉnh sửa thông tin bằng cấp đã tạo.
  3. Xóa một bằng cấp.
- **Kết quả mong đợi**: Danh sách bằng cấp cập nhật đúng. Trạng thái bằng cấp hiển thị: `pending` (chờ Admin duyệt), `approved`, hoặc `rejected`.
- **Luồng kỹ thuật**: Component Form -> `POST /api/instructor/certificates` -> `TeacherProfileController@storeCertificate` -> Save `teacher_certificates` & `teacher_certificate_evidence`.
- **File liên quan**:
  - Frontend: [TeacherProfileContainer.tsx](file:///h:/du_an/website/mindnova-ai/src/features/instructor/profile/components/TeacherProfileContainer.tsx)
  - Backend: [TeacherProfileController.php](file:///h:/du_an/website/website-MindNova-AI/app/Http/Controllers/Api/Instructor/TeacherProfileController.php#L60)
- **Phụ thuộc**: Table `teacher_certificates`.
- **Kết quả test thủ công**:
  - [v] PASS
  - [ ] FAIL
  - [ ] PARTIAL
  - [ ] NOT TESTED
- **Ghi chú khi test**: ................................................................
+Tạo được bằng cấp lần 1, nhưng sau khi xóa bằng cấp, không tạo được lại nữa. Báo lỗi như sau: Yêu cầu xác minh của bạn đang chờ xét duyệt. Vui lòng không gửi lặp lại. Nhưng trên thực tế thì đã tạo thành công lần 2.v
+Chưa có nút để sửa bằng cấp, chỉ có nút xóa bằng cấp.v

**Đã thay đổi**
- Sửa `submitVerificationRequest` trong `TeacherVerificationService.php`: Nếu có yêu cầu xác minh đang ở trạng thái `pending`, hệ thống sẽ cập nhật thông tin/note của yêu cầu hiện tại thay vì ném ra Exception chặn quá trình thêm chứng chỉ.
- Tạo Modal chỉnh sửa bằng cấp [EditCertificateModal.tsx](file:///h:/du_an/website/mindnova-ai/src/features/instructor/profile/components/EditCertificateModal.tsx) có giao diện giống form tạo, điền sẵn (pre-filled) toàn bộ dữ liệu hiện tại của bằng cấp (Tên chứng chỉ, Đơn vị cấp, Số bằng, Chuyên môn, Ngày cấp, Ngày hết hạn, Link xác minh, Ảnh bìa & File minh chứng, Mô tả, Hiển thị public).
- Thêm nút **"Sửa"** bằng cấp bên cạnh nút **"Xóa"** trên giao diện [TeacherProfileContainer.tsx](file:///h:/du_an/website/mindnova-ai/src/features/instructor/profile/components/TeacherProfileContainer.tsx), gọi API `PUT /api/instructor/certificates/{id}` để cập nhật bằng cấp.
- Đã khóa quyền chỉnh sửa đối với bằng cấp đã được xác minh: Khi trạng thái là `approved`, nút **Sửa** chuyển thành `🔒 Đã xác minh` (disabled), đồng thời Backend `TeacherVerificationService.php` sẽ từ chối cập nhật nếu bằng cấp đã ở trạng thái `approved`.
---

### [v] 5. Gửi Yêu cầu Xác minh Giảng viên (Verification Request)
- **Vai trò**: Instructor
- **Mức độ**: Chức năng chính
- **Mô tả**: Giảng viên gửi hồ sơ bằng cấp, CCCD/CMND và bio để Admin xem xét cấp tích xanh "Đã xác minh".
- **Vị trí hệ thống**:
  - Page: Modal `/instructor/profile` -> Nút "Gửi yêu cầu xác minh"
  - Route Backend: `POST /api/instructor/verification/request`, `GET /api/instructor/verification/status`
- **Các bước tự test**:
  1. Bấm nút "Yêu cầu xác minh".
  2. Chọn các bằng cấp đính kèm và nhập ghi chú cho Admin.
  3. Bấm "Gửi yêu cầu".
- **Kết quả mong đợi**: Trạng thái chuyển thành "Đang chờ Admin duyệt" (`pending_review`). Nút gửi yêu cầu bị vô hiệu hóa để tránh gửi trùng.
- **Luồng kỹ thuật**: `VerificationRequestModal.tsx` -> `POST /api/instructor/verification/request` -> `TeacherProfileController@submitVerificationRequest` -> DB `teacher_verifications`.
- **File liên quan**:
  - Frontend: [VerificationRequestModal.tsx](file:///h:/du_an/website/mindnova-ai/src/features/instructor/profile/components/VerificationRequestModal.tsx)
  - Backend: [TeacherProfileController.php](file:///h:/du_an/website/website-MindNova-AI/app/Http/Controllers/Api/Instructor/TeacherProfileController.php#L120)
- **Kết quả test thủ công**:
  - [v] PASS
  - [ ] FAIL
  - [ ] PARTIAL
  - [ ] NOT TESTED
- **Ghi chú khi test**: ................................................................
+Gửi yêu cầu xác minh thành công.
+Nhưng khi xóa bằng cấp đã tải lên thì ở phần "Xác minh chuyên môn" vẫn hiển thị là "Đang chờ xét duyệt...", nhưng thực tế thì đã xóa bằng cấp rồi.v

**Đã thay đổi**
- Sửa `deleteCertificate` trong `TeacherVerificationService.php`: Khi giảng viên xóa hết tất cả các bằng cấp (số lượng bằng cấp = 0), hệ thống tự động cập nhật trạng thái yêu cầu xác minh `pending` thành `cancelled` và đưa `teacher_verification_status` của giảng viên về `'none'`, giúp giao diện đồng bộ chính xác.
---

## 3.2. Instructor Dashboard

---

### [ ] 6. Thống kê Chỉ số Tổng quan (Dashboard Overview Metrics)
- **Vai trò**: Instructor
- **Mức độ**: Chức năng chính
- **Mô tả**: Hiển thị các thẻ chỉ số chính: Tổng khóa học, Tổng học sinh đăng ký, Tổng doanh thu net, Đánh giá trung bình.
- **Vị trí hệ thống**:
  - Page: `/instructor`
  - Route Backend: `GET /api/instructor/revenue/overview`, `GET /api/instructor/students/analytics`
- **Các bước tự test**:
  1. Truy cập `/instructor`.
  2. Đối chiếu số liệu hiển thị trên các card với dữ liệu thực tế trong DB.
- **Kết quả mong đợi**: Số liệu tính toán chính xác, hiển thị định dạng tiền tệ (VND) và số lượng học viên chuẩn.
- **Luồng kỹ thuật**: Page `/instructor/page.tsx` -> API requests -> Controller (`RevenueController`, `StudentController`) -> DB aggregations -> Render cards.
- **File liên quan**:
  - Frontend: [mindnova-ai/app/(instructor)/instructor/page.tsx](file:///h:/du_an/website/mindnova-ai/app/(instructor)/instructor/page.tsx), [RevenueCard.tsx](file:///h:/du_an/website/mindnova-ai/src/features/instructor/management/components/RevenueCard.tsx)
  - Backend: [RevenueController.php](file:///h:/du_an/website/website-MindNova-AI/app/Http/Controllers/Api/Instructor/RevenueController.php#L15)
- **Kết quả test thủ công**:
  - [ ] PASS
  - [ ] FAIL
  - [ ] PARTIAL
  - [ ] NOT TESTED
- **Ghi chú khi test**: ................................................................

---

## 3.3. Quản lý Khóa học (Course Management)

---

### [ ] 7. Xem Danh sách Khóa học & Bộ lọc / Search / Sắp xếp / Phân trang
- **Vai trò**: Instructor
- **Mức độ**: Chức năng chính
- **Mô tả**: Xem danh sách khóa học do mình sở hữu, tìm kiếm theo tên, lọc theo trạng thái (`draft`, `pending`, `published`, `rejected`), lọc theo lĩnh vực, sắp xếp và phân trang.
- **Vị trí hệ thống**:
  - Page: `/instructor/courses`
  - Route Backend: `GET /api/instructor/courses`
- **Các bước tự test**:
  1. Truy cập `/instructor/courses`.
  2. Gõ từ khóa vào ô Search -> Kiểm tra danh sách lọc thời gian thực / debounce.
  3. Chuyển các Tab Lọc ("Tất cả", "Đã xuất bản", "Bản nháp", "Chờ duyệt").
  4. Thay đổi tiêu chí Sắp xếp (Mới nhất, Học viên nhiều nhất, Giá cao/thấp).
  5. Bấm chuyển trang trong Pagination.
- **Kết quả mong đợi**: Kết quả lọc chính xác, số lượng mục trên mỗi trang đúng cấu hình, không đơ lag UI.
- **Luồng kỹ thuật**: `CourseManagementContainer.tsx` -> `useGetCourses` -> `GET /api/instructor/courses?search=&status=&page=` -> `CourseController@index` -> DB Query.
- **File liên quan**:
  - Frontend: [CourseManagementContainer.tsx](file:///h:/du_an/website/mindnova-ai/src/features/instructor/management/components/CourseManagementContainer.tsx), [CourseFilterTabs.tsx](file:///h:/du_an/website/mindnova-ai/src/features/instructor/management/components/CourseFilterTabs.tsx), [CoursePagination.tsx](file:///h:/du_an/website/mindnova-ai/src/features/instructor/management/components/CoursePagination.tsx)
  - Backend: [CourseController.php](file:///h:/du_an/website/website-MindNova-AI/app/Http/Controllers/Api/Instructor/CourseController.php#L20)
- **Kết quả test thủ công**:
  - [v] PASS
  - [ ] FAIL
  - [ ] PARTIAL
  - [ ] NOT TESTED
- **Ghi chú khi test**: ................................................................
+Bộ lọc Đang dạy/Bản nháp hoạt động tốt.
+Đã bổ sung thanh tìm kiếm tên/mô tả khóa học thời gian thực.
+Đã bổ sung menu thay đổi tiêu chí Sắp xếp (Mới nhất, Cũ nhất, Giá cao/thấp, Tên A-Z).

**Đã thay đổi**
- Bổ sung ô tìm kiếm khóa học thời gian thực theo tên hoặc mô tả vào [CourseManagementContainer.tsx](file:///h:/du_an/website/mindnova-ai/src/features/instructor/management/components/CourseManagementContainer.tsx).
- Bổ sung menu chọn tiêu chí sắp xếp (Sort Selector) hỗ trợ: Mới nhất, Cũ nhất, Giá cao → thấp, Giá thấp → cao, Tên A → Z.
---

### [ ] 8. Luồng Tạo Khóa Học 3 Bước (Course Creation Workflow)
- **Vai trò**: Instructor
- **Mức độ**: Chức năng chính (Quan trọng nhất)
- **Mô tả**: Luồng từng bước tạo mới khóa học:
  - **Bước 1**: Tên, Mô tả, Lĩnh vực, Trình độ, Ảnh bìa (Thumbnail Upload).
  - **Bước 2**: Dàn ý Chương (Module) & Bài học (Lesson). Hỗ trợ tự tạo hoặc dùng **AI Outline Generator**.
  - **Bước 3**: Cấu hình Giá (Miễn phí / Trả phí), Mã giảm giá, Kiểm tra Sức khỏe Khóa học (Health Score) & Gửi Admin Duyệt.
- **Vị trí hệ thống**:
  - Page: `/instructor/create-course`
  - Route Backend: `POST /api/instructor/courses`, `POST /api/instructor/courses/{id}/thumbnail`, `POST /api/instructor/courses/{id}/modules`, `POST /api/instructor/modules/{id}/lessons`
- **Các bước tự test**:
  1. Bấm nút "Tạo khóa học mới".
  2. Bước 1: Nhập Tên, chọn Lĩnh vực, upload ảnh Thumbnail -> Bấm "Tiếp tục".
  3. Bước 2: Tạo 2 Module, trong mỗi Module tạo 2 Bài học (1 Document, 1 Video) -> Bấm "Tiếp tục".
  4. Bước 3: Đặt giá 500.000 VNĐ -> Bấm "Gửi duyệt" (`submit-review`).
- **Kết quả mong đợi**: Khóa học được tạo trong DB, hình ảnh được upload Cloud Storage, trạng thái khóa học chuyển từ `draft` -> `pending_review`.
- **Phân tích Lifecyle Dữ liệu & Rủi ro Reload**:
  > ⚠️ **LƯU Ý KHI TEST**: Dữ liệu Bước 1 và Bước 2 đang được lưu tạm trong Zustand Store (`useCreateCourseStore`). Nếu người dùng bấm F5 Reload trang tại Bước 2 trước khi bấm "Lưu", toàn bộ cấu trúc vừa nhập sẽ bị mất do chưa gọi API tạo Module/Lesson vào DB!
- **Luồng kỹ thuật**: `CreateCourseContainer.tsx` -> Zustand State -> API Batch Calls (`createCourse` -> `uploadThumbnail` -> `createModule` -> `createLesson`) -> DB Tables (`courses`, `course_modules`, `lessons`).
- **File liên quan**:
  - Frontend: [CreateCourseContainer.tsx](file:///h:/du_an/website/mindnova-ai/src/features/instructor/create-course/components/CreateCourseContainer.tsx), [Step1BasicInfo.tsx](file:///h:/du_an/website/mindnova-ai/src/features/instructor/create-course/components/Step1BasicInfo.tsx), [Step2CourseStructure.tsx](file:///h:/du_an/website/mindnova-ai/src/features/instructor/create-course/components/Step2CourseStructure.tsx), [Step3SettingsPrice.tsx](file:///h:/du_an/website/mindnova-ai/src/features/instructor/create-course/components/Step3SettingsPrice.tsx)
  - Backend: [CourseController.php](file:///h:/du_an/website/website-MindNova-AI/app/Http/Controllers/Api/Instructor/CourseController.php), [CourseService.php](file:///h:/du_an/website/website-MindNova-AI/app/Services/Instructor/CourseService.php)
- **Kết quả test thủ công**:
  - [v] PASS
  - [ ] FAIL
  - [ ] PARTIAL
  - [ ] NOT TESTED
- **Ghi chú khi test**: ................................................................
+Tạo khóa học thành công.
+Tạo quiz trắc nghiệm & tự luận lưu thành công vào các bảng DB `quizzes`, `questions`, `answers`.
+Đặt khoảng giá khóa học và flash sale hoạt động chính xác.

**Đã thay đổi**
- Sửa `useCreateQuiz` trong [index.ts](file:///h:/du_an/website/mindnova-ai/src/features/instructor/lesson-management/api/index.ts): Thêm hàm `formatQuizPayloadForBackend` tự động chuyển đổi và chuẩn hóa cấu trúc bài thi (trắc nghiệm và tự luận `essay`) đúng schema Backend yêu cầu trước khi gửi API.
- Sửa [StoreQuizRequest.php](file:///h:/du_an/website/website-MindNova-AI/app/Http/Requests/Instructor/StoreQuizRequest.php) & [QuizService.php](file:///h:/du_an/website/website-MindNova-AI/app/Services/Instructor/QuizService.php): Hỗ trợ lưu câu hỏi tự luận `essay` (cho phép mảng `answers` rỗng) cùng các trường thông tin `explanation`, `sample_answer`, `rubric`, `points`, `difficulty` vào DB.
- Sửa [CreateCourseContainer.tsx](file:///h:/du_an/website/mindnova-ai/src/features/instructor/create-course/components/CreateCourseContainer.tsx): Tự động tạo quiz tương ứng cho các bài học dạng quiz khi hoàn thành tạo khóa học.
- Sửa [UpdateCoursePriceRequest.php](file:///h:/du_an/website/website-MindNova-AI/app/Http/Requests/Instructor/UpdateCoursePriceRequest.php): Chỉ kiểm tra điều kiện `lt:price` cho `sale_price` khi `is_flash_sale` bằng `true`.
---

### [x] 9. Quản lý Phiên bản Nháp & Phôi phục (Draft Revisions & Diff History)
- **Vai trò**: Instructor
- **Mức độ**: Chức năng nâng cao
- **Mô tả**: Hệ thống tự động lưu bản nháp khóa học theo mốc thời gian, cho phép Giảng viên xem sự thay đổi (Diff) và Khôi phục (Restore) về bản nháp cũ.
- **Vị trí hệ thống**:
  - Route Backend: `PUT /api/instructor/courses/{course}/draft`, `GET /api/instructor/courses/{course}/draft-revisions`, `GET /api/instructor/courses/{course}/draft-revisions/{revision}/diff`, `POST /api/instructor/courses/{course}/draft-revisions/{revision}/restore`
- **Các bước tự test**:
  1. Mở một khóa học ở trạng thái Chỉnh sửa.
  2. Đổi mô tả và bấm "Lưu nháp".
  3. Mở danh sách Lịch sử bản nháp -> Chọn một phiên bản cũ -> Bấm "Xem khác biệt (Diff)".
  4. Bấm "Khôi phục phiên bản này".
- **Kết quả mong đợi**: Dữ liệu khóa học được khôi phục chính xác theo bản ghi trong bảng `draft_revisions`.
- **Luồng kỹ thuật**: `DraftRevisionController.php` -> `DraftRevisionService.php` -> DB `draft_revisions`.
- **File liên quan**:
  - Backend: [DraftRevisionController.php](file:///h:/du_an/website/website-MindNova-AI/app/Http/Controllers/Api/Instructor/DraftRevisionController.php), [DraftRevisionService.php](file:///h:/du_an/website/website-MindNova-AI/app/Services/Instructor/DraftRevisionService.php)
- **Kết quả test thủ công**:
  - [ ] PASS
  - [ ] FAIL
  - [ ] PARTIAL
  - [x] NOT TESTED
- **Ghi chú khi test**: ................................................................
+Website không có chức năng này!
---

### [v] 10. Quản lý Mã giảm giá (Coupons Management)
- **Vai trò**: Instructor
- **Mức độ**: Chức năng chính
- **Mô tả**: Giảng viên tạo mã giảm giá riêng cho khóa học của mình (VD: `SUMMER50` giảm 50%), thiết lập thời hạn và số lượng tối đa.
- **Vị trí hệ thống**:
  - Page: `/instructor/courses/[courseId]/pricing` -> Section Coupons
  - Route Backend: `GET /api/instructor/coupons`, `POST /api/instructor/coupons`, `DELETE /api/instructor/coupons/{id}`
- **Các bước tự test**:
  1. Nhập Mã coupon, phần trăm giảm giá (VD: 20%), Ngày hết hạn, Số lượt dùng tối đa.
  2. Bấm "Tạo mã".
  3. Bật/Tắt trạng thái Kích hoạt của Mã coupon.
  4. Xóa mã coupon.
- **Kết quả mong đợi**: Mã coupon tạo thành công, xuất hiện trong bảng. Học sinh nhập mã này tại trang Checkout sẽ được trừ đúng phần trăm.
- **Luồng kỹ thuật**: `CouponSection.tsx` -> API call -> `Instructor\CouponController` -> DB `coupons`.
- **File liên quan**:
  - Frontend: [CouponSection.tsx](file:///h:/du_an/website/mindnova-ai/src/features/instructor/pricing/components/CouponSection.tsx)
  - Backend: [CouponController.php](file:///h:/du_an/website/website-MindNova-AI/app/Http/Controllers/Api/Instructor/CouponController.php)
- **Kết quả test thủ công**:
  - [v] PASS
  - [ ] FAIL
  - [ ] PARTIAL
  - [ ] NOT TESTED
- **Ghi chú khi test**: ................................................................
+Quản lý mã giảm giá hoạt động mượt mà trực tiếp trong tab "Giá bán & Khuyến mãi" của trang Chỉnh sửa khóa học.
+Đã sửa lỗi 404 route `api/instructor/coupons`.

**Đã thay đổi**
- Đăng ký đầy đủ các route API mã giảm giá của Giáo viên (`coupons`, `coupons/{id}`, `coupons/{id}/toggle`) trong nhóm `prefix('instructor')` tại [routes/api.php](file:///h:/du_an/website/website-MindNova-AI/routes/api.php), khắc phục hoàn toàn lỗi `The route api/instructor/coupons could not be found` (404).
- Tích hợp `<CouponSection courseId={courseId} />` trực tiếp vào tab "Giá bán & Khuyến mãi" trong [Step3SettingsPrice.tsx](file:///h:/du_an/website/mindnova-ai/src/features/instructor/create-course/components/Step3SettingsPrice.tsx) thuộc trang Chỉnh sửa khóa học (`/instructor/courses/[courseId]/edit`).
- Xóa bỏ hoàn toàn thư mục trang cũ `app/(instructor)/instructor/courses/[courseId]/pricing`.
---

### [v] 11. Đánh giá Sức khỏe Khóa học (Course Health Check)
- **Vai trò**: Instructor
- **Mức độ**: Chức năng phụ / Hỗ trợ Quality
- **Mô tả**: Phân tích tự động điểm chất lượng của khóa học dựa trên các tiêu chí: Có ảnh thumbnail chưa, số lượng bài học > 5, có quiz đánh giá chưa, độ dài mô tả > 200 từ.
- **Vị trí hệ thống**:
  - UI Component: `CourseHealthCard.tsx` tại trang chỉnh sửa khóa học.
  - Route Backend: `GET /api/instructor/courses/{course}/health`
- **Các bước tự test**:
  1. Mở một khóa học chưa có bài học -> Kiểm tra Điểm Health Score (thấp, VD: 30%).
  2. Thêm đầy đủ Thumbnail, 5 bài học, 1 Quiz -> Bấm "Kiểm tra lại".
- **Kết quả mong đợi**: Điểm Health Score tăng (VD: 95%) và các gợi ý cảnh báo đỏ biến mất.
- **Luồng kỹ thuật**: `CourseHealthCard.tsx` -> `GET /api/instructor/courses/{id}/health` -> `CourseHealthService.php` -> Trả về tổng điểm % & các tiêu chí đạt/chưa đạt.
- **File liên quan**:
  - Frontend: [CourseHealthCard.tsx](file:///h:/du_an/website/mindnova-ai/src/features/instructor/create-course/components/CourseHealthCard.tsx)
  - Backend: [CourseHealthService.php](file:///h:/du_an/website/website-MindNova-AI/app/Services/Instructor/CourseHealthService.php)
- **Kết quả test thủ công**:
  - [v] PASS
  - [ ] FAIL
  - [ ] PARTIAL
  - [ ] NOT TESTED
- **Ghi chú khi test**: ................................................................
+Đã test.
---

### [v] 12. Soạn thảo Bài học Văn bản (Rich Text Editor & Media Embed)
- **Vai trò**: Instructor
- **Mức độ**: Chức năng chính
- **Mô tả**: Giảng viên tạo/chỉnh sửa nội dung bài học bằng định dạng Rich Text (Bold, Italic, H2, H3, Bullet list, Upload & nhúng ảnh trực tiếp vào bài học).
- **Vị trí hệ thống**:
  - Modal: `CreateLessonEditModal.tsx` / `LessonEditModal.tsx` (Lesson Type = `document` hoặc `article`)
  - Route Backend: `POST /api/instructor/lessons/{lesson}/content-media`
- **Các bước tự test**:
  1. Tạo hoặc sửa bài học kiểu `document`.
  2. Gõ văn bản, định dạng Tiêu đề (H2, H3), danh sách bullet.
  3. Bấm biểu tượng Upload Ảnh trong Editor -> Chọn file ảnh.
  4. Bấm nút "Lưu bài học".
- **Kết quả mong đợi**: Ảnh trong nội dung được upload thành công lên server, chèn đúng tag `<img>` với URL hợp lệ. Văn bản lưu chính xác HTML trong DB `lessons.content`.
- **Luồng kỹ thuật**: `RichTextEditor.tsx` -> Upload Handler -> `POST /api/instructor/lessons/{id}/content-media` -> `LessonController@uploadContentMedia` -> Trả về Image URL -> Chèn vào DOM Editor -> DB `lessons`.
- **File liên quan**:
  - Frontend: [RichTextEditor.tsx](file:///h:/du_an/website/mindnova-ai/src/features/instructor/shared/components/RichTextEditor.tsx)
  - Backend: [LessonController.php](file:///h:/du_an/website/website-MindNova-AI/app/Http/Controllers/Api/Instructor/LessonController.php#L65)
- **Kết quả test thủ công**:
  - [v] PASS
  - [ ] FAIL
  - [ ] PARTIAL
  - [ ] NOT TESTED
- **Ghi chú khi test**: ................................................................
+Đã test. Định dạng tiêu đề H1, H2, H3 hiển thị kích thước chuẩn và phân biệt rõ ràng.

**Đã thay đổi**
- Khai báo bổ sung `heading: { options: [...] }` chi tiết cho H1, H2, H3 và Đoạn văn trong cấu hình CKEditor tại [RichTextEditor.tsx](file:///h:/du_an/website/mindnova-ai/src/features/instructor/shared/components/RichTextEditor.tsx).
- Bổ sung định kiểu CSS chi tiết cho H1 (2em), H2 (1.5em), H3 (1.25em) trong [globals.css](file:///h:/du_an/website/mindnova-ai/src/shared/styles/globals.css) đảm bảo hiển thị đúng kích thước tiêu đề trên trình soạn thảo và bài học.
---

### [v] 13. Quản lý Upload Video Bài học & Cloud Storage
- **Vai trò**: Instructor
- **Mức độ**: Chức năng chính
- **Mô tả**: Upload video giảng dạy (MP4/WebM) lên hệ thống. Tự động xử lý lưu trữ và tạo URL streaming bảo mật.
- **Vị trí hệ thống**:
  - Modal: `CreateLessonEditModal.tsx` (Lesson Type = `video`)
  - Route Backend: `POST /api/instructor/lessons/{lesson}/video`, `GET /api/instructor/lessons/{lesson}/video-url`
- **Các bước tự test**:
  1. Chọn Bài học kiểu `video`.
  2. Bấm "Upload Video" -> Chọn file video MP4 (VD: 50MB).
  3. Quan sát Thanh tiến trình Upload (Progress Bar).
  4. Sau khi upload xong, bấm nút "Xem trước Video".
- **Kết quả mong đợi**: Tiến trình nhảy từ 0% -> 100%. Trình phát video (Video Player) chạy mượt mà. Đã lưu `video_url` và `duration_seconds` vào DB.
- **Luồng kỹ thuật**: Frontend File Chunking/Form -> `POST /api/instructor/lessons/{id}/video` -> `LessonController@uploadVideo` -> `LessonService.php` -> Cloud Storage / Local Storage -> Return Signed URL -> Save DB `lessons`.
- **File liên quan**:
  - Frontend: [CreateLessonEditModal.tsx](file:///h:/du_an/website/mindnova-ai/src/features/instructor/create-course/components/CreateLessonEditModal.tsx)
  - Backend: [LessonController.php](file:///h:/du_an/website/website-MindNova-AI/app/Http/Controllers/Api/Instructor/LessonController.php#L50), [LessonService.php](file:///h:/du_an/website/website-MindNova-AI/app/Services/Instructor/LessonService.php#L80)
- **Kết quả test thủ công**:
  - [v] PASS
  - [ ] FAIL
  - [ ] PARTIAL
  - [ ] NOT TESTED
- **Ghi chú khi test**: ................................................................
+Đã test.
---

### [v] 14. Quản lý Quiz Thủ công (Manual Quiz Editor)
- **Vai trò**: Instructor
- **Mức độ**: Chức năng chính
- **Mô tả**: Tự nhập câu hỏi, các đáp án lựa chọn, tích chọn đáp án đúng, giải thích đáp án và thiết lập thời gian làm bài (phút), điểm đạt (passing score).
- **Vị trí hệ thống**:
  - Component: `QuizEditor.tsx` / `ManualQuizEditor.tsx`
  - Route Backend: `POST /api/instructor/lessons/{lesson}/quiz`, `GET /api/instructor/lessons/{lesson}/quiz`
- **Các bước tự test**:
  1. Chọn Bài học kiểu `quiz` -> Bấm "Chỉnh sửa bài thi".
  2. Thêm 3 câu hỏi trắc nghiệm (mỗi câu 4 lựa chọn, chọn 1 đáp án đúng).
  3. Nhập Thời gian làm bài: 15 phút, Điểm đạt: 80%.
  4. Bấm "Lưu bài thi".
- **Kết quả mong đợi**: Dữ liệu Quiz được lưu vào bảng `quizzes`, `questions`, `answers`.
- **Luồng kỹ thuật**: `QuizEditor.tsx` -> API `POST /api/instructor/lessons/{id}/quiz` -> `QuizController@store` -> `QuizService.php` -> DB Transaction (`quizzes` -> `questions` -> `answers`).
- **File liên quan**:
  - Frontend: [QuizEditor.tsx](file:///h:/du_an/website/mindnova-ai/src/features/instructor/create-course/components/QuizEditor.tsx)
  - Backend: [QuizController.php](file:///h:/du_an/website/website-MindNova-AI/app/Http/Controllers/Api/Instructor/QuizController.php)
- **Kết quả test thủ công**:
  - [v] PASS
  - [ ] FAIL
  - [ ] PARTIAL
  - [ ] NOT TESTED
- **Ghi chú khi test**: ................................................................
+Đã test. Chỉnh sửa và lưu bài học dạng quiz (cả trắc nghiệm và tự luận) lưu thành công vào DB không gặp lỗi 422.

**Đã thay đổi**
- Sửa [index.ts](file:///h:/du_an/website/mindnova-ai/src/features/instructor/lesson-management/api/index.ts): Bổ sung hàm `formatQuizPayloadForBackend` tự động chuẩn hóa định dạng câu hỏi (trắc nghiệm và tự luận) thành payload hợp lệ trước khi gửi API `POST /api/instructor/lessons/{id}/quiz`.
- Sửa [StoreQuizRequest.php](file:///h:/du_an/website/website-MindNova-AI/app/Http/Requests/Instructor/StoreQuizRequest.php) và [QuizService.php](file:///h:/du_an/website/website-MindNova-AI/app/Services/Instructor/QuizService.php): Hỗ trợ loại câu hỏi tự luận `essay` mà không bắt buộc mảng `answers` trắc nghiệm, lưu đầy đủ siêu dữ liệu câu hỏi (`explanation`, `sample_answer`, `rubric`, `points`, `difficulty`) vào DB.
- Sửa [LessonEditModal.tsx](file:///h:/du_an/website/mindnova-ai/src/features/instructor/lesson-management/components/LessonEditModal.tsx): Ánh ánh kiểu bài học (`type`) từ `document` sang `article` và `quiz` sang `quiz_module` trước khi gọi API cập nhật bài học.
- Sửa [StoreLessonRequest.php](file:///h:/du_an/website/website-MindNova-AI/app/Http/Requests/Instructor/StoreLessonRequest.php): Bổ sung hỗ trợ các alias `quiz`, `document` trong validation rules `in:...` và tự động chuyển đổi trong `prepareForValidation()`.
---

## 3.5. Quản lý Học viên & Báo cáo Doanh thu (Students & Financials)

---

### [ ] 15. Quản lý Danh sách Học viên & Xuất Báo cáo CSV
- **Vai trò**: Instructor
- **Mức độ**: Chức năng chính
- **Mô tả**: Xem danh sách tất cả học viên đã đăng ký các khóa học của mình, tiến độ hoàn thành (%), ngày đăng ký. Xuất danh sách ra file CSV.
- **Vị trí hệ thống**:
  - Page: `/instructor/students`
  - Route Backend: `GET /api/instructor/students`, `GET /api/instructor/students/export`
- **Các bước tự test**:
  1. Truy cập `/instructor/students`.
  2. Tìm kiếm tên học viên.
  3. Lọc theo khóa học cụ thể.
  4. Bấm nút "Xuất file CSV" -> Kiểm tra file `.csv` tải về máy.
- **Kết quả mong đợi**: File CSV tải xuống có UTF-8 bom (không lỗi font tiếng Việt), đầy đủ cột: Tên học sinh, Email, Khóa học, Tiến độ %, Ngày đăng ký.
- **Luồng kỹ thuật**: `StudentManagementContainer.tsx` -> `GET /api/instructor/students/export` -> `InstructorStudentController@exportCsv` -> Stream Response CSV.
- **File liên quan**:
  - Frontend: [StudentManagementContainer.tsx](file:///h:/du_an/website/mindnova-ai/src/features/instructor/student-management/components/StudentManagementContainer.tsx), [StudentTable.tsx](file:///h:/du_an/website/mindnova-ai/src/features/instructor/student-management/components/StudentTable.tsx)
  - Backend: [StudentController.php](file:///h:/du_an/website/website-MindNova-AI/app/Http/Controllers/Api/Instructor/StudentController.php#L30)
- **Kết quả test thủ công**:
  - [ ] PASS
  - [ ] FAIL
  - [ ] PARTIAL
  - [ ] NOT TESTED
- **Ghi chú khi test**: ................................................................

---

### [ ] 16. Phân tích Doanh thu & Yêu cầu Rút tiền (Revenue & Withdrawal)
- **Vai trò**: Instructor
- **Mức độ**: Chức năng chính
- **Mô tả**: Xem tổng số tiền khả dụng (Available Balance), doanh thu chờ xử lý, lịch sử các giao dịch mua khóa học và tạo yêu cầu rút tiền về tài khoản ngân hàng.
- **Vị trí hệ thống**:
  - Page: `/instructor/revenue`
  - Route Backend: `GET /api/instructor/revenue/overview`, `POST /api/instructor/revenue/withdraw`, `GET /api/instructor/revenue/transactions`
- **Các bước tự test**:
  1. Truy cập `/instructor/revenue`.
  2. Kiểm tra số dư khả dụng hiện có.
  3. Bấm nút "Rút tiền" -> Mở Modal `WithdrawalModal`.
  4. Nhập Số tiền rút (VD: 1.000.000 VNĐ), Tên ngân hàng, Số tài khoản, Tên chủ tài khoản -> Bấm "Xác nhận rút tiền".
- **Kết quả mong đợi**: Yêu cầu tạo thành công, số dư bị phong tỏa/trừ tương ứng, xuất hiện một bản ghi trạng thái `pending` trong lịch sử rút tiền.
- **Luồng kỹ thuật**: `WithdrawalModal.tsx` -> `POST /api/instructor/revenue/withdraw` -> `RevenueController@requestWithdraw` -> `RevenueService.php` -> DB `withdrawals`.
- **File liên quan**:
  - Frontend: [RevenueContainer.tsx](file:///h:/du_an/website/mindnova-ai/src/features/instructor/revenue/components/RevenueContainer.tsx), [WithdrawalModal.tsx](file:///h:/du_an/website/mindnova-ai/src/features/instructor/revenue/components/WithdrawalModal.tsx)
  - Backend: [RevenueController.php](file:///h:/du_an/website/website-MindNova-AI/app/Http/Controllers/Api/Instructor/RevenueController.php), [RevenueService.php](file:///h:/du_an/website/website-MindNova-AI/app/Services/Instructor/RevenueService.php)
- **Kết quả test thủ công**:
  - [ ] PASS
  - [ ] FAIL
  - [ ] PARTIAL
  - [ ] NOT TESTED
- **Ghi chú khi test**: ................................................................

---

# PHẦN 4 — TOÀN BỘ CHỨC NĂNG AI (AI FEATURES CHECKLIST)

---

## [ ] 17. AI Course Outline Generator (Tạo dàn ý khóa học tự động)
- **Vai trò**: Instructor
- **Mục đích**: Giúp Giảng viên xây dựng nhanh toàn bộ khung chương trình (Modules & Lessons) chỉ từ tên chủ đề và mô tả ngắn.
- **Input**: Tên chủ đề khóa học, Đối tượng học viên, Trình độ (Cơ bản/Nâng cao), Số lượng chương mong muốn.
- **AI Provider & Model**: OpenAI (`gpt-4o-mini`) / Gemini (`gemini-1.5-flash`) thông qua `AiRouterService`.
- **API / Service**: `POST /api/instructor/courses/ai-outline/generate` (`CourseOutlineController@generate`).
- **Prompt Location**: [CourseOutlineController.php](file:///h:/du_an/website/website-MindNova-AI/app/Http/Controllers/Api/Instructor/CourseOutlineController.php#L60)
- **Output**: JSON Tree chứa cấu trúc `chapters` và danh sách `lessons` (kèm loại bài học document/video/quiz).
- **Output hiển thị**: Modal `AIOutlineModal.tsx` hiển thị cây thư mục dàn ý cho phép Giảng viên xem trước, chỉnh sửa hoặc bấm "Áp dụng vào khóa học".
- **Lưu Database**: Khi bấm "Áp dụng", cấu trúc sẽ nạp vào Zustand Store và được lưu DB khi bấm "Lưu khóa học".
- **Các trường hợp cần test**:
  - [ ] Tạo dàn ý thành công với prompt bình thường.
  - [ ] Hiệu ứng Loading Spinner khi AI đang sinh dữ liệu.
  - [ ] Xử lý khi AI Key bị vô hiệu hóa hoặc hết quota (Trả về thông báo lỗi thân thiện).
  - [ ] Chỉnh sửa sửa đổi trực tiếp trên dàn ý do AI gợi ý trước khi áp dụng.
- **File liên quan**:
  - Frontend: [AIOutlineModal.tsx](file:///h:/du_an/website/mindnova-ai/src/features/instructor/create-course/components/AIOutlineModal.tsx)
  - Backend: [CourseOutlineController.php](file:///h:/du_an/website/website-MindNova-AI/app/Http/Controllers/Api/Instructor/CourseOutlineController.php)
- **Kết quả test thủ công**:
  - [ ] PASS
  - [ ] FAIL
  - [ ] PARTIAL
  - [ ] NOT TESTED
- **Ghi chú khi test**: ................................................................

---

## [ ] 18. AI Standalone & Attachment Quiz Generator (Tạo bộ đề thi thông minh)
- **Vai trò**: Instructor
- **Mục đích**: Tự động tạo bộ câu hỏi trắc nghiệm/tự luận từ văn bản prompt, tài liệu upload (PDF, DOCX) hoặc URL bài học.
- **Input**: Văn bản nguồn / File đính kèm, Số lượng câu hỏi, Độ khó (Easy, Medium, Hard), Loại câu hỏi (Multiple Choice, Essay, True/False).
- **AI Provider & Model**: Gemini / OpenAI (Cấu hình linh hoạt qua `AiRouterService`).
- **API / Service**: `POST /api/instructor/ai-quiz/generate`, `POST /api/instructor/ai-quiz/regenerate-question`, `POST /api/instructor/ai-quiz/store`, `POST /api/instructor/ai-quiz/{id}/attach`.
- **Prompt Location**: [AiQuizGeneratorService.php](file:///h:/du_an/website/website-MindNova-AI/app/Services/Instructor/AiQuizGeneratorService.php#L85)
- **Output**: Danh sách câu hỏi, các lựa chọn, đáp án đúng và lời giải chi tiết.
- **Output hiển thị**: Wizard 5 bước (`Step1SourceInput` -> `Step2ConfigForm` -> `Step3GeneratingState` -> `Step4ReviewEditor` -> `Step5SaveAndAttachModal`).
- **Lưu Database**: Lưu vào các bảng `quizzes`, `questions`, `answers`, `ai_generation_logs`.
- **Các trường hợp cần test**:
  - [ ] Sinh đề thi từ đoạn văn bản nhập trực tiếp.
  - [ ] Sinh đề thi từ upload file PDF bài giảng.
  - [ ] Sử dụng nút "Tạo lại câu hỏi này (Regenerate Question)" cho từng câu hỏi không ưng ý.
  - [ ] Gán bộ Quiz AI vừa tạo vào một Bài học hoặc Khóa học cụ thể.
- **File liên quan**:
  - Frontend: [QuizGeneratorWizard.tsx](file:///h:/du_an/website/mindnova-ai/src/features/instructor/quiz-generator/components/QuizGeneratorWizard.tsx), [Step1SourceInput.tsx](file:///h:/du_an/website/mindnova-ai/src/features/instructor/quiz-generator/components/Step1SourceInput.tsx), [Step4ReviewEditor.tsx](file:///h:/du_an/website/mindnova-ai/src/features/instructor/quiz-generator/components/Step4ReviewEditor.tsx)
  - Backend: [QuizGeneratorController.php](file:///h:/du_an/website/website-MindNova-AI/app/Http/Controllers/Api/Instructor/QuizGeneratorController.php), [AiQuizGeneratorService.php](file:///h:/du_an/website/website-MindNova-AI/app/Services/Instructor/AiQuizGeneratorService.php)
- **Kết quả test thủ công**:
  - [ ] PASS
  - [ ] FAIL
  - [ ] PARTIAL
  - [ ] NOT TESTED
- **Ghi chú khi test**: ................................................................

---

## [ ] 19. AI Student Notification Generator (Tạo thông báo AI cho Học viên)
- **Vai trò**: Instructor
- **Mục đích**: Giúp Giảng viên viết thông báo/email thúc đẩy học tập dựa trên tình trạng của học viên (VD: Nhắc học viên lâu ngày chưa vào học, khen ngợi học viên hoàn thành xuất sắc).
- **Input**: Nhóm học viên mục tiêu (VD: Inactive > 7 days), Tone giọng (Thân thiện, Nghiêm túc, Truyền cảm hứng), Mục tiêu thông báo.
- **AI Provider**: OpenAi / Gemini.
- **API / Service**: `POST /api/instructor/students/ai-notification/generate` (`InstructorStudentController@generateAiNotification`).
- **Output**: Tiêu đề và Nội dung thông báo được AI soạn sẵn.
- **Output hiển thị**: Modal `AINotificationModal.tsx` cho phép xem trước và bấm "Gửi thông báo".
- **Lưu Database**: Lưu vào bảng `notifications` của các học viên nhận.
- **Các trường hợp cần test**:
  - [ ] Chọn nhóm học viên "Tiến độ < 20%" -> Sinh thông báo AI -> Kiểm tra văn bản tạo ra hợp lý.
  - [ ] Chỉnh sửa nội dung AI sinh ra trước khi gửi -> Bấm Gửi -> Kiểm tra học viên nhận được notification.
- **File liên quan**:
  - Frontend: [AINotificationModal.tsx](file:///h:/du_an/website/mindnova-ai/src/features/instructor/student-management/components/AINotificationModal.tsx)
  - Backend: [StudentController.php](file:///h:/du_an/website/website-MindNova-AI/app/Http/Controllers/Api/Instructor/StudentController.php#L85)
- **Kết quả test thủ công**:
  - [ ] PASS
  - [ ] FAIL
  - [ ] PARTIAL
  - [ ] NOT TESTED
- **Ghi chú khi test**: ................................................................

---

## [ ] 20. AI Student Analytics & Engagement Insights
- **Vai trò**: Instructor
- **Mục đích**: Phân tích dữ liệu học tập của học viên trong khóa học và đưa ra các nhận xét, dự báo học viên có nguy cơ bỏ học (At-Risk).
- **Input**: Dữ liệu `lesson_completions`, `user_quiz_attempts` của học viên trong khóa.
- **API / Service**: `GET /api/instructor/student-analytics/dashboard-metrics`, `GET /api/instructor/student-analytics/engagement-chart`.
- **Output hiển thị**: Tab `AI Insights` trên giao diện Analytics (`AIInsightsTab.tsx`) hiển thị biểu đồ và các thẻ gợi ý hành động.
- **File liên quan**:
  - Frontend: [AIInsightsTab.tsx](file:///h:/du_an/website/mindnova-ai/src/features/instructor/analytic/components/AIInsightsTab.tsx)
  - Backend: [StudentAnalyticsController.php](file:///h:/du_an/website/website-MindNova-AI/app/Http/Controllers/Api/Instructor/StudentAnalyticsController.php)
- **Kết quả test thủ công**:
  - [ ] PASS
  - [ ] FAIL
  - [ ] PARTIAL
  - [ ] NOT TESTED
- **Ghi chú khi test**: ................................................................

---

## [ ] 21. AI Tutor / Study Assistant (Trợ lý AI giảng bài dựa trên nội dung Bài học)
- **Vai trò**: Student (Dữ liệu do Instructor tạo)
- **Mục đích**: Trả lời thắc mắc của học sinh ngay trong lúc học bài dựa trên chính nội dung văn bản/video bài học do Giảng viên cung cấp.
- **API / Service**: `POST /api/student/ai-tutor/chat` (`AiTutorController@streamChat`).
- **File liên quan**:
  - Backend: [AiTutorController.php](file:///h:/du_an/website/website-MindNova-AI/app/Http/Controllers/Api/Student/AiTutorController.php)
- **Kết quả test thủ công**:
  - [ ] PASS
  - [ ] FAIL
  - [ ] PARTIAL
  - [ ] NOT TESTED
- **Ghi chú khi test**: ................................................................

---

# PHẦN 5 — PHÂN VÀI ADMIN LIÊN QUAN ĐẾN INSTRUCTOR

---

### [ ] 22. Admin Duyệt Hồ sơ Xác minh & Bằng cấp Giảng viên
- **Vai trò**: Admin ↔ Instructor
- **Mô tả**: Admin xem danh sách hồ sơ xác minh do Giảng viên gửi lên, duyệt hoặc từ chối kèm lý do.
- **Vị trí hệ thống**:
  - Page Admin: `/admin/teacher-approvals`
  - Route Backend: `GET /api/admin/teachers/review-queue`, `PATCH /api/admin/teachers/{id}/verify`, `POST /api/admin/certificates/{certId}/approve`, `POST /api/admin/certificates/{certId}/reject`
- **Các bước tự test**:
  1. Giảng viên gửi Yêu cầu xác minh.
  2. Admin đăng nhập -> Vào trang Duyệt giảng viên `/admin/teacher-approvals`.
  3. Bấm xem chi tiết bằng cấp -> Bấm "Duyệt xác minh" (`verifyTeacher`).
- **Kết quả mong đợi**: Giảng viên nhận được Notification, Profile giảng viên xuất hiện Tích xanh Xác minh.
- **File liên quan**:
  - Frontend: [TeacherApprovalTable.tsx](file:///h:/du_an/website/mindnova-ai/src/features/admin/components/TeacherApprovalTable.tsx)
  - Backend: [UserManagementController.php](file:///h:/du_an/website/website-MindNova-AI/app/Http/Controllers/Api/Admin/UserManagementController.php#L80)
- **Kết quả test thủ công**:
  - [ ] PASS
  - [ ] FAIL
  - [ ] PARTIAL
  - [ ] NOT TESTED
- **Ghi chú khi test**: ................................................................

---

### [ ] 23. Admin Duyệt Khóa học (Content Moderation Workflow)
- **Vai trò**: Admin ↔ Instructor
- **Mô tả**: Admin kiểm duyệt khóa học do Giảng viên gửi lên (`pending_review`). Admin có thể Chấp nhận (`approve`), Từ chối (`reject`), hoặc Yêu cầu sửa đổi (`request-fixes`).
- **Vị trí hệ thống**:
  - Page Admin: `/admin/content` (Tab Content Review Workflow)
  - Route Backend: `GET /api/admin/reviews`, `PATCH /api/admin/reviews/{submission}/approve`, `PATCH /api/admin/reviews/{submission}/reject`, `PATCH /api/admin/reviews/{submission}/request-fixes`
- **Các bước tự test**:
  1. Instructor gửi duyệt khóa học.
  2. Admin mở danh sách chờ duyệt -> Bấm "Bắt đầu kiểm duyệt" (`startReview`).
  3. Admin bấm "Yêu cầu sửa" kèm comment -> Kiểm tra trạng thái bên Instructor chuyển thành `needs_fixes`.
  4. Instructor sửa lại và gửi duyệt -> Admin bấm "Duyệt xuất bản" (`approve`).
- **Kết quả mong đợi**: Trạng thái khóa học chuyển thành `published` và hiển thị công khai trên catalog học sinh.
- **File liên quan**:
  - Frontend: [AdminContentManagementPage.tsx](file:///h:/du_an/website/mindnova-ai/src/features/admin/components/AdminContentManagementPage.tsx)
  - Backend: [ReviewController.php](file:///h:/du_an/website/website-MindNova-AI/app/Http/Controllers/Api/Admin/ReviewController.php), [ContentReviewService.php](file:///h:/du_an/website/website-MindNova-AI/app/Services/ContentReviewService.php)
- **Kết quả test thủ công**:
  - [ ] PASS
  - [ ] FAIL
  - [ ] PARTIAL
  - [ ] NOT TESTED
- **Ghi chú khi test**: ................................................................

---

# PHẦN 6 — PHÂN VÀI STUDENT LIÊN QUAN ĐẾN INSTRUCTOR

---

### [ ] 24. Student Đăng ký & Học bài học của Instructor
- **Vai trò**: Student ↔ Instructor
- **Mô tả**: Học sinh thấy khóa học của Giảng viên, thực hiện mua/đăng ký, xem video bài học, làm bài Quiz và gửi thảo luận Q&A.
- **Luồng liên kết dữ liệu**:
  ```text
  Instructor tạo Course & Video Lesson
          ↓
  Admin duyệt Publish Course
          ↓
  Student tìm thấy trên Catalog (`/explore`)
          ↓
  Student bấm Mua / Đăng ký (`POST /api/orders`)
          ↓
  Student vào Giao diện Học (`/student/courses/{id}`)
          ↓
  Student xem Video & Bấm "Hoàn thành bài học" (`POST /api/student/lessons/{id}/complete`)
          ↓
  Tiến độ Student được cập nhật -> Instructor thấy trong Báo cáo Tiến độ Học viên
  ```
- **Các bước tự test**:
  1. Dùng tài khoản Student đăng ký khóa học do Instructor vừa publish.
  2. Xem bài học Video -> Kiểm tra lượt xem và tiến độ tăng lên.
  3. Gửi 1 câu hỏi trong phần Thảo luận bài học -> Đăng nhập tài khoản Instructor kiểm tra có nhận được thông báo Q&A không -> Instructor gửi câu trả lời.
- **Kết quả mong đợi**: Dữ liệu thảo luận hiển thị thời gian thực/gần thời gian thực, tiến độ đồng bộ chính xác.
- **File liên quan**:
  - Backend: [StudentCourseController.php](file:///h:/du_an/website/website-MindNova-AI/app/Http/Controllers/Api/Student/CourseController.php), [StudentLessonController.php](file:///h:/du_an/website/website-MindNova-AI/app/Http/Controllers/Api/Student/LessonController.php), [InstructorDiscussionController.php](file:///h:/du_an/website/website-MindNova-AI/app/Http/Controllers/Api/Instructor/DiscussionController.php)
- **Kết quả test thủ công**:
  - [ ] PASS
  - [ ] FAIL
  - [ ] PARTIAL
  - [ ] NOT TESTED
- **Ghi chú khi test**: ................................................................

---

# PHẦN 7 — CHỨC NĂNG NHỎ & UI STATES (SMALL FEATURES CHECKLIST)

---

### [ ] 25. Danh sách Kiểm thử Chức năng Phụ (Micro UI States)

| STT | Chức năng nhỏ | Vị trí xuất hiện | Cách test thủ công | Kết quả mong đợi | Trang thái test |
|---|---|---|---|---|---|
| 1 | **Search Debounce** | Các ô tìm kiếm Course, Student, Revenue | Gõ nhanh từ khóa "React" | Hệ thống chờ 300-500ms rồi mới gửi API request, không spam API | [ ] PASS [ ] FAIL |
| 2 | **Delete Confirmation Modal** | Xóa Course, Xóa Module, Xóa Lesson | Bấm nút Xóa biểu tượng Thùng rác | Mở Modal cảnh báo "Bạn có chắc chắn muốn xóa?", bấm Hủy thì không xóa, bấm Xác nhận mới xóa | [ ] PASS [ ] FAIL |
| 3 | **Close Modal (ESC & Backdrop)** | Tất cả các Popup Modals | Bấm phím `ESC` hoặc click ra vùng xám bên ngoài | Modal đóng lại mượt mà, reset state form nháp nếu có | [ ] PASS [ ] FAIL |
| 4 | **Form Validation Errors** | Đăng nhập, Tạo khóa học, Rút tiền | Để trống trường bắt buộc và bấm Submit | Hiển thị dòng thông báo lỗi đỏ bên dưới đúng ô input | [ ] PASS [ ] FAIL |
| 5 | **Empty State Display** | Danh sách Khóa học, Thảo luận, Học viên | Đăng nhập tài khoản mới chưa có dữ liệu | Hiển thị hình minh họa Empty State kèm thông điệp "Chưa có dữ liệu" và nút Tạo mới | [ ] PASS [ ] FAIL |
| 6 | **Loading Skeleton States** | Khi chuyển trang hoặc tải dữ liệu API | Reload trang hoặc chọn tab mới | Hiển thị các khối Skeleton nhấp nháy mượt mà trước khi nạp xong dữ liệu thật | [ ] PASS [ ] FAIL |
| 7 | **Toast Notifications** | Sau các hành động Lưu, Xóa, Gửi duyệt | Bấm Lưu bài học thành công | Hiển thị thông báo Toast xanh góc trên "Lưu thành công!" tự ẩn sau 3 giây | [ ] PASS [ ] FAIL |
| 8 | **Accordion Collapse / Expand** | Cấu trúc Chương & Bài học | Click vào header của Module | Nội dung bài học bên trong thu gọn hoặc mở rộng mượt mà | [ ] PASS [ ] FAIL |

---

# PHẦN 8 — PHÂN TÍCH LUỒNG DỮ LIỆU KỸ THUẬT (TECHNICAL PIPELINE)

---

### Sơ đồ Luồng Kỹ thuật Tạo Bài học & Upload Video:

```text
GIAO DIỆN (UI)
[CreateLessonEditModal.tsx]
       │
       │ (1) User chọn file Video (MP4) & bấm Lưu
       ▼
FRONTEND STATE & HOOK
[useCreateLesson / Axios multipart-form]
       │
       │ (2) HTTP POST /api/instructor/lessons/{id}/video
       ▼
BACKEND ROUTE & MIDDLEWARE
[routes/api.php -> auth:sanctum, role:teacher]
       │
       │ (3) Authorize user sở hữu lesson này
       ▼
CONTROLLER
[LessonController@uploadVideo]
       │
       │ (4) Gọi LessonService
       ▼
SERVICE LAYER
[LessonService.php]
       │
       ├── (5a) Upload file lên Cloud Storage (Cloudflare R2 / S3 / Storage disk)
       │        └── Trả về path: "lessons/videos/xyz123.mp4"
       │
       └── (5b) Đọc metadata video (Lấy thời lượng duration_seconds)
       │
       ▼
DATABASE ELOQUENT MODEL
[Lesson::where('id', $id)->update([...])]
       │
       │ (6) Cập nhật video_url, duration_seconds, status = 'ready' vào DB table `lessons`
       ▼
HTTP RESPONSE
[JSON { success: true, data: { video_url: "https://..." } }]
       │
       │ (7) Frontend nhận Response
       ▼
RENDER UI
[Cập nhật Video Player Preview & Toast "Upload video thành công"]
```

---

# PHẦN 9 — CÁC PHÁT HIỆN ĐẶC BIỆT & ĐIỂM CẦN LƯU Ý KHI TEST (AUDIT & WARNINGS)

---

### ⚠️ 1. Phát hiện Mock Data & Tự động Bypass trong Code Frontend
- **Vị trí**: [CreateCourseContainer.tsx — Line 172-179](file:///h:/du_an/website/mindnova-ai/src/features/instructor/create-course/components/CreateCourseContainer.tsx#L172-L179)
- **Mã nguồn**:
  ```typescript
  // We bypass upload if thumbnailFile is missing but preview exists (mock behavior or previously uploaded)
  thumbnail: courseInfo.thumbnailFile || new File(["mock"], "mock.png", { type: "image/png" })
  ```
- **Ảnh hưởng**: Nếu người dùng không chọn file ảnh mà chỉ dùng URL preview, frontend tự tạo một File giả lập tên `"mock.png"` để gửi lên Backend.
- **Mức độ**: Trung bình.
- **Cần chú ý khi test**: Kiểm tra xem Backend có lưu file mock 0 bytes này vào Cloud Storage không.

---

### ⚠️ 2. Rủi ro Mất Dữ liệu khi Reload trang trong Luồng Create Course Wizard
- **Vị trí**: [createCourseStore.ts](file:///h:/du_an/website/mindnova-ai/src/features/instructor/create-course/stores/createCourseStore.ts)
- **Chi tiết**: Dàn ý chương học (Modules & Lessons) ở Bước 2 của wizard được lưu hoàn toàn trong Zustand Store ở bộ nhớ RAM trình duyệt. Các API tạo `course_modules` và `lessons` chỉ thực sự được gọi khi bấm nút "Gửi duyệt" ở Bước 3.
- **Rủi ro**: Nếu người dùng dành 30 phút soạn thảo dàn ý ở Bước 2 rồi lỡ tay bấm F5 Reload trang hoặc bị mất mạng, toàn bộ dữ liệu chưa lưu sẽ bị xóa sạch.
- **Đề xuất khi test**: QA cần thực hiện kịch bản bấm F5 ở từng bước để ghi nhận hành vi hệ thống.

---

### ⚠️ 3. Phụ thuộc API Key cho các Tính năng AI
- **Vị trí**: [website-MindNova-AI/config/services.php](file:///h:/du_an/website/website-MindNova-AI/config/services.php) & `.env` (`OPENAI_API_KEY`, `GEMINI_API_KEY`).
- **Chi tiết**: Các chức năng AI (Outline Generator, Quiz Generator, Notification Generator) cần API Key hợp lệ.
- **Rủi ro**: Nếu chưa cấu hình Key trong Admin AI System Page (`/admin/ai-config`), các nút AI trên giao diện Instructor sẽ xoay Loading liên tục hoặc bắn lỗi HTTP 500.
- **Đề xuất khi test**: Kiểm tra trường hợp chưa nhập API Key xem giao diện có hiển thị thông báo lỗi rõ ràng hay không.

---

# PHẦN 10 — CHECKLIST KỊCH BẢN LUỒNG END-TO-END (E2E TEST SCENARIOS)

---

### [ ] Kịch bản E2E 1: Luồng Trọn vẹn từ Tạo Khóa học đến khi Học sinh Học & Nhận Báo cáo
```text
[ ] Step 1: Instructor Đăng nhập hệ thống.
[ ] Step 2: Vào /instructor/profile -> Thêm Bằng cấp chứng chỉ -> Gửi Yêu cầu xác minh.
[ ] Step 3: Admin Đăng nhập -> Vào /admin/teacher-approvals -> Duyệt xác minh cho Instructor.
[ ] Step 4: Instructor vào /instructor/create-course -> Tạo khóa học mới.
[ ] Step 5: Sử dụng AI Course Outline Generator để tạo tự động 2 Chương & 4 Bài học.
[ ] Step 6: Chỉnh sửa 1 Bài học Document (Soạn văn bản Rich Text) và 1 Bài học Video (Upload MP4).
[ ] Step 7: Sử dụng AI Quiz Generator để tạo 1 Bài thi trắc nghiệm 5 câu hỏi và gắn vào Bài học 3.
[ ] Step 8: Thiết lập giá 200.000 VNĐ -> Tạo Mã giảm giá `TEST50` -> Bấm Gửi Admin Duyệt.
[ ] Step 9: Admin vào /admin/content -> Mở yêu cầu duyệt -> Bấm Duyệt Xuất bản (Publish).
[ ] Step 10: Student đăng nhập -> Vào /explore -> Tìm thấy Khóa học vừa Publish.
[ ] Step 11: Student áp dụng mã `TEST50` (Giảm 50% còn 100.000 VNĐ) -> Thanh toán mua khóa học.
[ ] Step 12: Student học Bài học Video -> Làm bài thi Quiz đạt 100% -> Nhận chứng nhận hoàn thành.
[ ] Step 13: Student gửi 1 câu hỏi Thảo luận Q&A trong bài học.
[ ] Step 14: Instructor mở /instructor/discussions -> Thấy câu hỏi và gửi câu trả lời.
[ ] Step 15: Instructor mở /instructor/revenue -> Thấy doanh thu tăng cộng dồn -> Tạo Yêu cầu rút tiền.
[ ] Step 16: Admin vào Duyệt Yêu cầu rút tiền -> Hoàn tất luồng End-to-End.
```

---

# TỔNG KẾT
File checklist này được xây dựng từ việc quét và phân tích tĩnh (Static Code Analysis) toàn bộ codebase của dự án **MindNova AI**. 

Tester / QA có thể sử dụng trực tiếp file markdown này, mở website và tiến hành tích chọn các ô `[ ] PASS` / `[ ] FAIL` trực tiếp trong quá trình test thủ công.
