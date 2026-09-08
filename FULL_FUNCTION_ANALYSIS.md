# FULL PROJECT FUNCTION ANALYSIS & INVENTORY

> **Dự án**: MindNova AI — Hệ thống Quản lý & Học tập Trực tuyến Thông minh tích hợp AI
> **Ngày phân tích code**: 04/09/2026
> **Phạm vi phân tích**:
> - Frontend (`mindnova-ai` — Next.js 16, React 19, TypeScript, TailwindCSS, Zustand)
> - Backend (`website-MindNova-AI` — Laravel 13, PHP 8.3, Sanctum Auth)
> - Database (MySQL — 60 Eloquent Models, 99 Migration Files)
> - API & Routes (`routes/api.php`, `routes/auth.php`, `routes/web.php`)
> - AI Providers (OpenAI PHP Client, Google Gemini Service, Mock/Backup Routers)
> - Storage & Realtime (Cloudflare R2 / AWS S3, Laravel Reverb / Pusher WebSockets)
> - Roles System (Student, Instructor / Teacher, Admin, Guest / Public User)

---

## MỤC LỤC

1. [PHẦN 1 — TỔNG QUAN HỆ THỐNG](#phần-1--tổng-quan-hệ-thống)
2. [PHẦN 2 — THỐNG KÊ CHỨC NĂNG](#phần-2--thống-kê-chức-năng)
3. [PHẦN 3 — SƠ ĐỒ CẤU TRÚC CHỨC NĂNG (ASCII TREE)](#phần-3--sơ-đồ-cấu-trúc-chức-năng-ascii-tree)
4. [PHẦN 4 — CHI TIẾT TỪNG CHỨC NĂNG (DETAILED BREAKDOWN)](#phần-4--chi-tiết-từng-chức-năng-detailed-breakdown)
5. [PHẦN 5 — CHỨC NĂNG LIÊN KẾT GIỮA CÁC ROLE (CROSS-ROLE WORKFLOWS)](#phần-5--chức-năng-liên-kết-giữa-các-role-cross-role-workflows)
6. [PHẦN 6 — AI FEATURES MATRIX & CHI TIẾT](#phần-6--ai-features-matrix--chi-tiết)
7. [PHẦN 7 — API / FRONTEND / BACKEND GAP ANALYSIS](#phần-7--api--frontend--backend-gap-analysis)
8. [PHẦN 8 — DANH SÁCH TỔNG HỢP CUỐI CÙNG (MASTER FUNCTION TABLE)](#phần-8--danh-sách-tổng-hợp-cuối-cùng-master-function-table)

---

# PHẦN 1 — TỔNG QUAN HỆ THỐNG

### Công nghệ phát hiện

#### Frontend (`mindnova-ai`)
- **Framework**: Next.js 16.2.6 (App Router), React 19.2.4
- **Language**: TypeScript 5
- **Styling**: TailwindCSS 4, PostCSS
- **State Management**: Zustand 5.0.13, React Query (@tanstack/react-query 5.100.14)
- **UI Components & Rich Text**: CKEditor 5 (@ckeditor/ckeditor5-react 11.2.0), Lucide React Icons
- **Data Visualization**: Recharts 3.10.1
- **Realtime Connection**: Laravel Echo 1.16.1, Pusher JS 8.4.0
- **HTTP & Utilities**: Axios 1.16.1, Zod 4.4.3, jsPDF 4.2.1

#### Backend (`website-MindNova-AI`)
- **Framework**: Laravel 13.8, PHP 8.3
- **Authentication**: Laravel Sanctum 4.0, Socialite 5.27 (Google OAuth)
- **Realtime Engine**: Laravel Reverb, Pusher PHP Server 7.3
- **AI Integrations**: OpenAI PHP Client (`openai-php/client` & `openai-php/laravel`), Custom Gemini AI Service (`GeminiAiService`), Backup/Router AI Service (`AiRouterService`)
- **Cloud Storage**: Flysystem AWS S3 / Cloudflare R2 (`league/flysystem-aws-s3-v3`)
- **Media Processing**: getID3 1.9 (Extract video duration & metadata)
- **Testing & Tooling**: Pest PHP 4.7, Laravel Pail, Laravel Pint

#### Database & Storage
- **Relational DB**: MySQL (60 Eloquent Models, 99 Database Migration Files)
- **Caching & Sessions**: Database/Redis Cache Drivers & Sessions table

#### Hierarchy Roles
- **Guest / Public**: Xem danh sách khóa học public, Đăng ký, Đăng nhập, Quên mật khẩu.
- **Student**: Dashboard cá nhân, Học bài, Quiz & Chấm điểm luận AI, Luyện tập, Lộ trình AI, Điểm danh Streak, Mua khóa học (VNPay/MoMo), Thảo luận, Đánh giá.
- **Instructor / Teacher**: Quản lý khóa học, Bài học, Video media, Quản lý bản nháp, AI Course Outline Generator, AI Quiz Generator, Quản lý học sinh, Thống kê Doanh thu & Rút tiền, Nộp duyệt khóa học.
- **Admin**: Quản lý Users, Duyệt xác minh Giáo viên & Bằng cấp, Quản lý & Cấu hình AI, Kiểm duyệt Nội dung Khóa học, Xử lý Báo cáo/Support Ticket, Workflow Duyệt Khóa học/Xóa bài học.

---

# PHẦN 2 — THỐNG KÊ CHỨC NĂNG

| Nhóm chức năng | Số lượng phát hiện | Ghi chú |
| :--- | ---: | :--- |
| **Authentication & Profile** | 8 | Đăng nhập, Đăng ký, Google OAuth, Đổi MK OTP, Profile, Avatar |
| **Student Features** | 16 | Dashboard, Course Player, Quiz, Streak, Study Plan, Refund |
| **Instructor Features** | 20 | CRUD Course, Draft Revisions, Video Upload, Health, Outline AI |
| **Admin Features** | 9 | User Lock/Role, Teacher Review, AI Config, Content Review |
| **AI Features** | 10 | AI Tutor, AI Quiz Gen, AI Essay Grade, AI Outline, AI Lesson |
| **Payment & Finance** | 4 | Order Checkout (VNPay/MoMo), Coupon, Revenue Share, Withdrawal |
| **Chat & Realtime System** | 2 | Realtime Messaging, Conversations & Recall Message |
| **Micro Features** | 7 | Search, Filter, Sort, Pagination, CSV Export, Draft Restore, Signed URL |
| **Gaps & Unused Code** | 3 | Standalone UI Ads-Hourly, ZaloPay Service, Dev Payment Endpoints |
| **TỔNG CỘNG** | **79** | Các chức năng được phân loại duy nhất có bằng chứng source code |

---

# PHẦN 3 — SƠ ĐỒ CẤU TRÚC CHỨC NĂNG (ASCII TREE)

```text
HỆ THỐNG MINDNOVA AI
│
├── 1. AUTHENTICATION & USER PROFILE
│   ├── 1.1 Đăng ký tài khoản (AUTH-01)
│   ├── 1.2 Đăng nhập Email/Password (AUTH-02)
│   ├── 1.3 Đăng xuất & Thu hồi Sanctum Token (AUTH-03)
│   ├── 1.4 Quên mật khẩu & Đặt lại bằng mã OTP (AUTH-04)
│   ├── 1.5 Đăng nhập mạng xã hội Google OAuth (AUTH-05)
│   ├── 1.6 Xem & Cập nhật Hồ sơ Cá nhân (USER-01, USER-02)
│   ├── 1.7 Upload Ảnh đại diện Avatar (USER-03)
│   └── 1.8 Yêu cầu OTP & Đổi mật khẩu tài khoản (USER-04)
│
├── 2. STUDENT LEARNING SYSTEM
│   ├── 2.1 Student Dashboard Overview (STUDENT-01)
│   ├── 2.2 Onboarding Survey & Chọn chủ đề quan tâm (STUDENT-02)
│   ├── 2.3 Tìm kiếm & Khám phá khóa học (STUDENT-03)
│   ├── 2.4 Quản lý khóa học đã đăng ký (STUDENT-04)
│   ├── 2.5 Xem Video Bài học & Đánh dấu hoàn thành (STUDENT-05)
│   ├── 2.6 Thảo luận & Hỏi đáp theo bài học (STUDENT-06)
│   ├── 2.7 Làm bài kiểm tra Quiz Bài học (STUDENT-07)
│   ├── 2.8 Làm bài thi Tổng hợp / Thi cuối khóa (STUDENT-08)
│   ├── 2.9 Đánh giá & Phản hồi Khóa học (STUDENT-09)
│   ├── 2.10 Điểm danh hàng ngày & Chuỗi Streak (STUDENT-10)
│   ├── 2.11 Lộ trình học tập tùy chỉnh AI (STUDENT-11)
│   ├── 2.12 Trung tâm Luyện tập & Lịch sử (STUDENT-12, STUDENT-14)
│   ├── 2.13 Phân tích Tiến độ Học tập Chi tiết (STUDENT-13)
│   ├── 2.14 Thông báo Học sinh & Đánh dấu đã đọc (STUDENT-15)
│   └── 2.15 Yêu cầu Hoàn tiền Khóa học (STUDENT-16)
│
├── 3. INSTRUCTOR MANAGEMENT SYSTEM
│   ├── 3.1 Quản lý Khóa học CRUD & Giá bán (INSTRUCTOR-01, INSTRUCTOR-04)
│   ├── 3.2 Upload Thumbnail & Video Bài học (INSTRUCTOR-02, INSTRUCTOR-08)
│   ├── 3.3 Kiểm tra Sức khỏe Khóa học Course Health (INSTRUCTOR-05)
│   ├── 3.4 Bản nháp & Lịch sử Khôi phục Draft Revisions (INSTRUCTOR-06)
│   ├── 3.5 Quản lý Chương học Module & Sắp xếp (INSTRUCTOR-07)
│   ├── 3.6 Upload Media Tạm thời Temp (INSTRUCTOR-09)
│   ├── 3.7 Quản lý Quiz Bài học (INSTRUCTOR-10)
│   ├── 3.8 Quản lý Học sinh & Xuất báo cáo CSV (INSTRUCTOR-11)
│   ├── 3.9 Thống kê Học sinh & Engagement Chart (INSTRUCTOR-12)
│   ├── 3.10 Thảo luận & Trả lời Học sinh (INSTRUCTOR-13)
│   ├── 3.11 Doanh thu, Báo cáo Bán hàng & Rút tiền (INSTRUCTOR-14)
│   ├── 3.12 Xem Đơn hàng & Đánh giá của Học sinh (INSTRUCTOR-15, INSTRUCTOR-16)
│   ├── 3.13 Hồ sơ Giáo viên, Bằng cấp & Xác minh (INSTRUCTOR-17, INSTRUCTOR-18)
│   ├── 3.14 Quản lý Mã giảm giá Coupon Giáo viên (INSTRUCTOR-19)
│   └── 3.15 Quy trình Nộp Duyệt Khóa học & Yêu cầu xóa bài (INSTRUCTOR-20)
│
├── 4. ADMIN CONTROL PANEL
│   ├── 4.1 Quản lý Người dùng & Khóa/Mở tài khoản (ADMIN-01)
│   ├── 4.2 Hàng chờ Duyệt Hồ sơ & Bằng cấp Giáo viên (ADMIN-02)
│   ├── 4.3 Quản lý & Cấu hình AI System (ADMIN-03)
│   ├── 4.4 Kiểm duyệt Nội dung & Ngân hàng câu hỏi (ADMIN-04)
│   ├── 4.5 Quản lý Tài nguyên Dùng chung Shared Resources (ADMIN-05)
│   ├── 4.6 Dashboard Analytics & Doanh thu Hệ thống (ADMIN-06)
│   ├── 4.7 Quản lý Mã giảm giá Coupon Toàn hệ thống (ADMIN-07)
│   ├── 4.8 Xử lý Báo cáo Vi phạm & Support Tickets (ADMIN-08)
│   └── 4.9 Content Review Workflow Duyệt Khóa học / Diff View (ADMIN-09)
│
├── 5. AI ENGINE & INTEGRATIONS
│   ├── 5.1 AI Tutor Chat & Interactive Streaming (AI-01)
│   ├── 5.2 AI Quiz Generator cho Học sinh (AI-02)
│   ├── 5.3 AI Quiz Generator & Attach cho Giáo viên (AI-03)
│   ├── 5.4 AI Essay Automatic Grading (AI-04)
│   ├── 5.5 AI Course Outline Generator (AI-05)
│   ├── 5.6 AI Lesson Content Analyzer (AI-06)
│   ├── 5.7 AI Self-Assessment Evaluation (AI-07)
│   ├── 5.8 AI Study Plan Personalized Chat (AI-08)
│   ├── 5.9 AI Student Reminders / Notification Generator (AI-09)
│   └── 5.10 AI Student Analytics & Insights (AI-10)
│
├── 6. PAYMENT, REVENUE & REALTIME MESSAGING
│   ├── 6.1 Checkout Đơn hàng & Cổng VNPay / MoMo (PAYMENT-01)
│   ├── 6.2 Áp dụng Coupon Giảm giá (PAYMENT-02)
│   ├── 6.3 Phân bổ Doanh thu Tự động (PAYMENT-03)
│   ├── 6.4 Yêu cầu Rút tiền & Cấu hình Payout (PAYMENT-04)
│   ├── 6.5 Realtime Chat & Thu hồi Tin nhắn (CHAT-01)
│   └── 6.6 WebSockets Broadcast & Push Events (CHAT-02)
│
└── 7. GAPS & UNUSED CODE
    ├── 7.1 Standalone UI Component Ads-Hourly (GAP-01)
    ├── 7.2 Unlinked ZaloPay Service Class (GAP-02)
    └── 7.3 Dev Environment Test Payment Routes (GAP-03)
```

---

# PHẦN 4 — CHI TIẾT TỪNG CHỨC NĂNG (DETAILED BREAKDOWN)

---

### [PHÁT HIỆN] AUTH-01. Đăng ký tài khoản (Register)
* **Nhóm chức năng**: Authentication
* **Vai trò sử dụng**: Guest / User
* **Mức độ**: Major Feature
* **Trạng thái phát hiện trong code**: `Có Frontend + Backend + Database`
* **Mô tả**: Cho phép người dùng đăng ký tài khoản mới bằng Email/Password, tạo User record đi kèm cấp token Sanctum và thiết lập thông báo mặc định.
* **Vị trí hệ thống**:
  * Frontend Page: `app/(auth)/welcome/page.tsx`
  * Frontend Component: `src/features/student/auth/components/AuthModal.tsx`
  * Backend Route/API: `POST /api/register`
* **Luồng kỹ thuật chi tiết**:
```text
[AuthModal.tsx]
→ [POST /api/register]
→ [AuthController@register]
→ [User Model + UserProfile Model]
→ [Database Table: users, user_profiles]
```
* **Bằng chứng phát hiện**:
  * Route: `routes/api.php:73` (`Route::post('/register', [AuthController::class, 'register']);`)
  * Controller: `app/Http/Controllers/Api/Auth/AuthController.php@register`
  * Component FE: `src/features/student/auth/components/AuthModal.tsx`
* **Mức độ hoàn chỉnh dựa trên code**:
  * [x] Có Frontend
  * [x] Có Backend
  * [x] Có API
  * [x] Có Database
  * [x] Có Business Logic
  * [ ] Có AI
  * [ ] Có dấu hiệu Mock Data
  * [ ] Có TODO/FIXME

---

### [PHÁT HIỆN] AUTH-02. Đăng nhập Email/Password (Login)
* **Nhóm chức năng**: Authentication
* **Vai trò sử dụng**: All Roles (Student, Instructor, Admin)
* **Mức độ**: Major Feature
* **Trạng thái phát hiện trong code**: `Có Frontend + Backend + Database`
* **Mô tả**: Đăng nhập bằng Email và Mật khẩu, xác minh hash Bcrypt, kiểm tra trạng thái khóa tài khoản (`is_locked`), cập nhật `last_login_at` và trả về Bearer Token Sanctum cùng thông tin User Role.
* **Vị trí hệ thống**:
  * Frontend Page: `app/(auth)/login/page.tsx`
  * Backend Route/API: `POST /api/login`
* **Luồng kỹ thuật chi tiết**:
```text
[Login Form]
→ [POST /api/login]
→ [AuthController@login]
→ [Hash::check + Sanctum createToken]
→ [Database Table: users, personal_access_tokens]
```
* **Bằng chứng phát hiện**:
  * Route: `routes/api.php:74`
  * Controller: `app/Http/Controllers/Api/Auth/AuthController.php@login`
* **Mức độ hoàn chỉnh dựa trên code**:
  * [x] Có Frontend
  * [x] Có Backend
  * [x] Có API
  * [x] Có Database
  * [x] Có Business Logic

---

### [PHÁT HIỆN] AUTH-04. Quên mật khẩu & Đặt lại bằng mã OTP
* **Nhóm chức năng**: Authentication
* **Vai trò sử dụng**: All Users
* **Mức độ**: User Feature
* **Trạng thái phát hiện trong code**: `Có Frontend + Backend + Database`
* **Mô tả**: Gửi mã OTP khôi phục mật khẩu qua Email, xác minh mã OTP khả dụng (thời hạn 10 phút) và cập nhật mật khẩu mới.
* **Vị trí hệ thống**:
  * Frontend Page: `app/(auth)/forgot-password/page.tsx`
  * Backend Route/API: `POST /api/forgot-password`, `POST /api/forgot-password/verify-otp`, `POST /api/reset-password`
* **Bằng chứng phát hiện**:
  * Route: `routes/api.php:75-77`
  * Controller: `AuthController.php@forgotPassword`, `verifyResetOtp`, `resetPassword`
  * Model: `PasswordOtp.php`
  * Database: `password_otps` table

---

### [PHÁT HIỆN] STUDENT-05. Xem Video Bài học & Đánh dấu hoàn thành
* **Nhóm chức năng**: Student Learning
* **Vai trò sử dụng**: Student
* **Mức độ**: Major Feature
* **Trạng thái phát hiện trong code**: `Có Frontend + Backend + Database`
* **Mô tả**: Trình phát bài học video cho học sinh đã đăng ký khóa học, bảo mật đường dẫn video qua Signed URL, cập nhật thời lượng theo dõi và ghi nhận hoàn thành bài học.
* **Vị trí hệ thống**:
  * Frontend Page: `app/(dashboard)/courses/page.tsx`
  * Backend Route/API: `GET /api/student/lessons/{lesson}/video-url`, `POST /api/student/lessons/{lesson}/complete`
* **Luồng kỹ thuật chi tiết**:
```text
[Lesson Video Component]
→ [GET /api/student/lessons/{lesson}/video-url]
→ [StudentLessonController@videoUrl]
→ [Storage S3/R2 Temporary Url]
→ [POST /api/student/lessons/{lesson}/complete]
→ [LessonCompletion Model → Table: lesson_completions]
```
* **Bằng chứng phát hiện**:
  * Route: `routes/api.php:189-190`
  * Controller: `app/Http/Controllers/Api/Student/LessonController.php`
  * Model: `LessonCompletion.php`, `LessonMedia.php`

---

### [PHÁT HIỆN] STUDENT-10. Điểm danh hàng ngày & Chuỗi Streak
* **Nhóm chức năng**: Student Engagement
* **Vai trò sử dụng**: Student
* **Mức độ**: User Feature / Micro-feature
* **Trạng thái phát hiện trong code**: `Có Frontend + Backend + Database`
* **Mô tả**: Tính năng điểm danh hàng ngày giúp học sinh duy trì chuỗi ngày học liên tục (Streak), tự động tính số ngày liên tiếp và khôi phục khi ngắt quãng.
* **Vị trí hệ thống**:
  * Frontend Page: `app/(dashboard)/page.tsx`
  * Backend Route/API: `POST /api/student/check-in`
* **Bằng chứng phát hiện**:
  * Route: `routes/api.php:124`
  * Controller: `app/Http/Controllers/Api/Student/StreakController.php`
  * Model: `UserStreak.php`
  * Database Table: `user_streaks`

---

### [PHÁT HIỆN] INSTRUCTOR-05. Kiểm tra Sức khỏe / Chất lượng Khóa học (Course Health Check)
* **Nhóm chức năng**: Instructor Course Management
* **Vai trò sử dụng**: Instructor
* **Mức độ**: Micro-feature / Quality Audit
* **Trạng thái phát hiện trong code**: `Có Frontend + Backend + Database`
* **Mô tả**: Tự động quét toàn bộ cấu trúc khóa học của giáo viên (tỷ lệ bài học có video, quiz, độ dài tiêu đề, mô tả, số lượng câu hỏi) để đưa ra điểm số sức khỏe khóa học (Health Score) và cảnh báo chất lượng.
* **Vị trí hệ thống**:
  * Frontend Component: `src/features/instructor/create-course/components/CourseHealthCard.tsx`
  * Backend Route/API: `GET /api/instructor/courses/{course}/health`
* **Bằng chứng phát hiện**:
  * Route: `routes/api.php:216`
  * Service: `app/Services/Instructor/CourseHealthService.php`
  * Controller: `app/Http/Controllers/Api/Instructor/CourseController.php@health`

---

### [PHÁT HIỆN] INSTRUCTOR-06. Quản lý Bản nháp & Lịch sử Khôi phục (Draft Revisions)
* **Nhóm chức năng**: Instructor Course Management
* **Vai trò sử dụng**: Instructor
* **Mức độ**: User Feature
* **Trạng thái phát hiện trong code**: `Có Frontend + Backend + Database`
* **Mô tả**: Tự động lưu bản nháp khóa học khi chỉnh sửa, tạo các phiên bản revision, xem điểm khác biệt (Diff View) và cho phép khôi phục về phiên bản cũ.
* **Vị trí hệ thống**:
  * Backend Route/API: `PUT /api/instructor/courses/{course}/draft`, `GET /draft-revisions`, `GET /diff`, `POST /restore`
* **Bằng chứng phát hiện**:
  * Route: `routes/api.php:217-220`
  * Service: `app/Services/Instructor/DraftRevisionService.php`
  * Model: `DraftRevision.php`
  * Database Table: `draft_revisions`

---

### [PHÁT HIỆN] ADMIN-02. Hàng chờ Duyệt Hồ sơ & Bằng cấp Giáo viên
* **Nhóm chức năng**: Admin Governance
* **Vai trò sử dụng**: Admin
* **Mức độ**: Major Feature
* **Trạng thái phát hiện trong code**: `Có Frontend + Backend + Database`
* **Mô tả**: Hàng chờ quản trị viên xem xét bằng cấp, hồ sơ kinh nghiệm, bằng chứng chứng chỉ của người dùng đăng ký trở thành Giáo viên; thực hiện Phê duyệt (Approve) hoặc Từ chối (Reject) kèm lý do.
* **Vị trí hệ thống**:
  * Frontend Page: `app/admin/teacher-approvals/page.tsx`
  * Backend Route/API: `GET /api/admin/teachers/review-queue`, `PATCH /api/admin/teachers/{id}/verify`, `POST /api/admin/certificates/{certId}/approve`
* **Bằng chứng phát hiện**:
  * Route: `routes/api.php:339-346`
  * Service: `app/Services/TeacherVerificationService.php`
  * Models: `TeacherVerification.php`, `TeacherCertificate.php`, `TeacherCertificateEvidence.php`

---

### [PHÁT HIỆN] ADMIN-09. Quy trình Duyệt Nội dung Khóa học Chi tiết (Content Review Workflow)
* **Nhóm chức năng**: Admin Content Moderation
* **Vai trò sử dụng**: Admin & Instructor
* **Mức độ**: Major Feature
* **Trạng thái phát hiện trong code**: `Có Frontend + Backend + Database`
* **Mô tả**: Workflow xét duyệt nội dung khóa học nghiêm ngặt: Giáo viên nộp bài -> Admin xem bản so sánh Diff -> Bắt đầu Review -> Chấp thuận xuất bản / Từ chối / Yêu cầu sửa đổi kèm Comment chi tiết -> Xử lý cả Yêu cầu xóa bài học.
* **Vị trí hệ thống**:
  * Frontend Component: `src/features/admin/components/ContentReviewDetail.tsx`
  * Backend Route/API: `GET/PATCH/POST /api/admin/reviews/...`
* **Bằng chứng phát hiện**:
  * Route: `routes/api.php:380-392`
  * Service: `app/Services/ContentReviewService.php`
  * Models: `ReviewSubmission.php`, `ReviewSubmissionItem.php`, `ContentVersion.php`, `DeletionRequest.php`, `ContentAuditLog.php`

---

# PHẦN 5 — CHỨC NĂNG LIÊN KẾT GIỮA CÁC ROLE (CROSS-ROLE WORKFLOWS)

### Workflow 1: Instructor Nộp Khóa học → Admin Kiểm duyệt → Student Đăng ký & Học

```text
[INSTRUCTOR]
1. Tạo Khóa học & Bài học (INSTRUCTOR-01, INSTRUCTOR-08)
2. Kiểm tra sức khỏe khóa học đạt chuẩn (INSTRUCTOR-05)
3. Nộp duyệt khóa học (POST /api/instructor/courses/{course}/submit-review)
        ↓
[DATABASE: review_submissions (status: pending)]
        ↓
[ADMIN]
4. Xem danh sách hàng chờ duyệt (GET /api/admin/reviews)
5. Xem bản diff nội dung khóa học (GET /api/admin/reviews/{submission}/diff)
6. Chấp thuận nộp duyệt (PATCH /api/admin/reviews/{submission}/approve)
        ↓
[DATABASE: courses (status: published), content_versions]
        ↓
[STUDENT]
7. Xem khóa học trên trang khám phá (GET /api/student/courses/available)
8. Mua/Đăng ký khóa học qua VNPay/MoMo (POST /api/orders)
9. Tiến hành xem Video & Làm Quiz bài học (STUDENT-05, STUDENT-07)
```

---

### Workflow 2: User Đăng ký Giáo viên → Admin Duyệt Bằng cấp → Instructor Hoạt động

```text
[USER / INSTRUCTOR UNVERIFIED]
1. Tạo hồ sơ Giáo viên & Upload Bằng cấp/Chứng chỉ (INSTRUCTOR-17)
2. Nộp yêu cầu xác minh tài khoản (POST /api/instructor/verification/request)
        ↓
[DATABASE: teacher_verifications, teacher_certificates]
        ↓
[ADMIN]
3. Kiểm tra hàng chờ phê duyệt (GET /api/admin/teachers/review-queue)
4. Lấy Signed URL xem bằng chứng hình ảnh (GET /api/admin/certificates/evidence/{id})
5. Phê duyệt chứng chỉ & Xác minh Giáo viên (PATCH /api/admin/teachers/{id}/verify)
        ↓
[DATABASE: users (role: teacher, is_verified: true)]
```

---

### Workflow 3: Student Mua Khóa học → Phân bổ Doanh thu → Instructor Rút tiền

```text
[STUDENT]
1. Thanh toán đơn hàng thành công qua VNPay / MoMo (PAYMENT-01)
        ↓
[BACKEND PAYMENT SERVICE]
2. Tạo Enrollment cho Student
3. Tự động tính toán tỷ lệ phân bổ Doanh thu (Ví dụ: 70% Giáo viên / 30% Nền tảng)
4. Tạo bản ghi RevenueAllocation với trạng thái 'locked' (chờ hết hạn hoàn tiền)
        ↓
[BACKGROUND / SCHEDULED CRON]
5. Chạy RevenueUnlockService giải phóng tiền sang 'available' sau 14 ngày
        ↓
[INSTRUCTOR]
6. Xem tổng quan số dư doanh thu (GET /api/instructor/revenue/overview)
7. Gửi yêu cầu rút tiền về tài khoản ngân hàng (POST /api/instructor/revenue/withdraw)
```

---

# PHẦN 6 — AI FEATURES MATRIX & CHI TIẾT

### Bảng tổng hợp AI Features

| AI Feature ID | Tên chức năng | Role | Provider | Model | Input | Output | Save DB | Trạng thái Code |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **AI-01** | AI Tutor Interactive Chat | Student | Google / OpenAI | `gemini-1.5-flash` / `gpt-4o` | Text prompt, context bài học | Realtime stream text response | Có (`ai_tutor_conversations`) | `Có AI Logic` |
| **AI-02** | Student AI Quiz Generator | Student | Gemini / OpenAI | Configured LLM | Topic, độ khó, số câu hỏi | Đề thi trắc nghiệm JSON | Có (`ai_generated_quizzes`) | `Có AI Logic` |
| **AI-03** | Instructor AI Quiz Generator | Instructor | Gemini / OpenAI | Configured LLM | Nội dung bài học / Văn bản | Bộ Quiz gắn bài học | Có (`quizzes`, `questions`) | `Có AI Logic` |
| **AI-04** | AI Automatic Essay Grading | Student | Gemini / OpenAI | Configured LLM | Bài luận học sinh, Đề bài | Điểm số, Nhận xét chi tiết | Có (`user_quiz_attempt_answers`) | `Có AI Logic` |
| **AI-05** | AI Course Outline Generator | Instructor | Gemini / OpenAI | Configured LLM | Tên khóa học, Đối tượng | Khung chương trình (Modules/Lessons) | Có (`course_modules`, `lessons`) | `Có AI Logic` |
| **AI-06** | AI Lesson Content Analyzer | Student | Gemini / OpenAI | Configured LLM | Nội dung văn bản bài học | Tóm tắt, Từ khóa chính, Ý chính | Không | `Có AI Logic` |
| **AI-07** | AI Self-Assessment Evaluation | Student | Gemini / OpenAI | Configured LLM | Câu trả lời khảo sát năng lực | Đánh giá điểm mạnh/yếu | Có (`user_topic_performance`) | `Có AI Logic` |
| **AI-08** | AI Personalized Study Plan | Student | Gemini / OpenAI | Configured LLM | Mục tiêu học tập, Thời gian | Lộ trình học cá nhân hóa | Có (`study_plans`) | `Có AI Logic` |
| **AI-09** | AI Student Notification Gen | Instructor | Gemini / OpenAI | Configured LLM | Tình trạng học tập của học sinh | Lời nhắn nhắc nhở động viên | Có (`notifications`) | `Có AI Logic` |
| **AI-10** | AI Student Analytics Insights | Instructor | Gemini / OpenAI | Configured LLM | Dữ liệu tương tác & điểm số | Báo cáo Insight xu hướng lớp | Không | `Có AI Logic` |

---

# PHẦN 7 — API / FRONTEND / BACKEND GAP ANALYSIS

### 1. Có API / Backend nhưng chưa thấy UI gọi hoặc chưa hoàn thiện
* **GAP-02: ZaloPay Payment Integration**
  * **File**: `app/Services/ZaloPayService.php`
  * **Mô tả**: Hệ thốngBackend có Service xử lý thanh toán `ZaloPayService.php` riêng biệt, tuy nhiên trong `routes/api.php` hiện chỉ khai báo Callback/IPN cho VNPay (`vnpayIpn`) và MoMo (`momoIpn`).
  * **Trạng thái**: `Có Backend/API nhưng chưa tìm thấy UI/Route kích hoạt đầy đủ`.

### 2. Có UI Component nhưng chưa gắn vào Page (Unused Code)
* **GAP-01: Standalone Ads Hourly Performance Section**
  * **File**: `src/features/ads-hourly/AdsHourlySection.tsx`
  * **Mô tả**: Component UI theo dõi hiệu suất quảng cáo theo giờ với biểu đồ tương tác Recharts và dữ liệu `MOCK_HOURLY_DATA`. Tìm kiếm trên toàn bộ codebase cho thấy component này chỉ xuất hiện trong file `index.ts` của chính thư mục đó và không được import ở bất kỳ `app/.../page.tsx` nào.
  * **Trạng thái**: `Có code nhưng chưa xác định đang được sử dụng` + `Có Mock Data`.

### 3. Dev / Test Protected Routes
* **GAP-03: Local Payment Test Overrides**
  * **File**: `routes/api.php:398-402` (`POST /api/dev/orders/{orderId}/complete`, `POST /api/dev/orders/{orderId}/refund`)
  * **Mô tả**: Các route hoàn tất/hoàn tiền đơn hàng tức thì phục vụ mục đích kiểm thử Dev. Chỉ hoạt động khi `app()->environment('local', 'testing')`.
  * **Trạng thái**: `Có Backend/API (Dev Only)`.

### 4. Bảng tổng hợp TODO / FIXME trong Source Code
* **PaymentService.php:69**: `// 1. Look up Order in orders table by transaction_id (e.g. ORD-XXXXXX)` (Ghi chú định dạng mã đơn hàng).
* **StudentQuizController.php:208**: `// GRADE ATTEMPT VIA QuizGradingService (MCQ + AI Essay Grading)` (Ghi chú luồng chấm điểm kết hợp AI).
* **AiProjectionCard.tsx:13**: `const AI_INSIGHT_PLACEHOLDER = ...` (Dữ liệu hiển thị mặc định khi chưa chọn chủ đề).

---

# PHẦN 8 — DANH SÁCH TỔNG HỢP CUỐI CÙNG (MASTER FUNCTION TABLE)

| STT | Mã chức năng | Tên chức năng | Nhóm chức năng | Role | FE | BE | API | DB | AI | Trạng thái phát hiện trong code |
| --: | :--- | :--- | :--- | :--- | :-: | :-: | :-: | :-: | :-: | :--- |
| 1 | AUTH-01 | Đăng ký tài khoản | Auth | Guest | ✓ | ✓ | ✓ | ✓ | | Có Frontend + Backend + Database |
| 2 | AUTH-02 | Đăng nhập Email/Password | Auth | All | ✓ | ✓ | ✓ | ✓ | | Có Frontend + Backend + Database |
| 3 | AUTH-03 | Đăng xuất Sanctum Token | Auth | All | ✓ | ✓ | ✓ | ✓ | | Có Frontend + Backend + Database |
| 4 | AUTH-04 | Quên mật khẩu & OTP | Auth | All | ✓ | ✓ | ✓ | ✓ | | Có Frontend + Backend + Database |
| 5 | AUTH-05 | Đăng nhập Google OAuth | Auth | All | ✓ | ✓ | ✓ | | | Có Frontend + Backend |
| 6 | USER-01 | Xem hồ sơ cá nhân | User Profile | All | ✓ | ✓ | ✓ | ✓ | | Có Frontend + Backend + Database |
| 7 | USER-02 | Cập nhật thông tin cá nhân | User Profile | All | ✓ | ✓ | ✓ | ✓ | | Có Frontend + Backend + Database |
| 8 | USER-03 | Upload Ảnh đại diện | User Profile | All | ✓ | ✓ | ✓ | ✓ | | Có Frontend + Backend + Database |
| 9 | USER-04 | Đổi mật khẩu kèm OTP | User Profile | All | ✓ | ✓ | ✓ | ✓ | | Có Frontend + Backend + Database |
| 10 | STUDENT-01| Student Dashboard | Student | Student | ✓ | ✓ | ✓ | ✓ | | Có Frontend + Backend + Database |
| 11 | STUDENT-02| Onboarding Khảo sát | Student | Student | ✓ | ✓ | ✓ | ✓ | | Có Frontend + Backend + Database |
| 12 | STUDENT-03| Khám phá Khóa học | Student | Student | ✓ | ✓ | ✓ | ✓ | | Có Frontend + Backend + Database |
| 13 | STUDENT-04| Khóa học đã đăng ký | Student | Student | ✓ | ✓ | ✓ | ✓ | | Có Frontend + Backend + Database |
| 14 | STUDENT-05| Xem Video & Hoàn thành Bài | Student | Student | ✓ | ✓ | ✓ | ✓ | | Có Frontend + Backend + Database |
| 15 | STUDENT-06| Thảo luận Bài học | Student | Student | ✓ | ✓ | ✓ | ✓ | | Có Frontend + Backend + Database |
| 16 | STUDENT-07| Làm Quiz Bài học | Student | Student | ✓ | ✓ | ✓ | ✓ | | Có Frontend + Backend + Database |
| 17 | STUDENT-08| Thi Quiz Cuối khóa | Student | Student | ✓ | ✓ | ✓ | ✓ | | Có Frontend + Backend + Database |
| 18 | STUDENT-09| Đánh giá Khóa học | Student | Student | ✓ | ✓ | ✓ | ✓ | | Có Frontend + Backend + Database |
| 19 | STUDENT-10| Điểm danh Chuỗi Streak | Student | Student | ✓ | ✓ | ✓ | ✓ | | Có Frontend + Backend + Database |
| 20 | STUDENT-11| Lộ trình Học tập | Student | Student | ✓ | ✓ | ✓ | ✓ | ✓ | Có AI Logic + FE + BE + DB |
| 21 | STUDENT-12| Trung tâm Luyện tập | Student | Student | ✓ | ✓ | ✓ | ✓ | | Có Frontend + Backend + Database |
| 22 | STUDENT-13| Phân tích Tiến độ | Student | Student | ✓ | ✓ | ✓ | ✓ | | Có Frontend + Backend + Database |
| 23 | STUDENT-14| Lịch sử Học tập | Student | Student | ✓ | ✓ | ✓ | ✓ | | Có Frontend + Backend + Database |
| 24 | STUDENT-15| Thông báo Học sinh | Student | Student | ✓ | ✓ | ✓ | ✓ | | Có Frontend + Backend + Database |
| 25 | STUDENT-16| Yêu cầu Hoàn tiền | Student | Student | ✓ | ✓ | ✓ | ✓ | | Có Frontend + Backend + Database |
| 26 | INST-01 | Quản lý Khóa học CRUD | Instructor | Teacher | ✓ | ✓ | ✓ | ✓ | | Có Frontend + Backend + Database |
| 27 | INST-02 | Upload Course Thumbnail | Instructor | Teacher | ✓ | ✓ | ✓ | ✓ | | Có Frontend + Backend + Database |
| 28 | INST-03 | Đổi Trạng thái Khóa học | Instructor | Teacher | ✓ | ✓ | ✓ | ✓ | | Có Frontend + Backend + Database |
| 29 | INST-04 | Đổi Giá bán Khóa học | Instructor | Teacher | ✓ | ✓ | ✓ | ✓ | | Có Frontend + Backend + Database |
| 30 | INST-05 | Course Health Check Audit | Instructor | Teacher | ✓ | ✓ | ✓ | ✓ | | Có Frontend + Backend + Database |
| 31 | INST-06 | Quản lý Draft Revisions | Instructor | Teacher | ✓ | ✓ | ✓ | ✓ | | Có Frontend + Backend + Database |
| 32 | INST-07 | Quản lý Module Chương học | Instructor | Teacher | ✓ | ✓ | ✓ | ✓ | | Có Frontend + Backend + Database |
| 33 | INST-08 | Upload Video Bài học | Instructor | Teacher | ✓ | ✓ | ✓ | ✓ | | Có Frontend + Backend + Database |
| 34 | INST-09 | Upload Temp Media Storage | Instructor | Teacher | ✓ | ✓ | ✓ | ✓ | | Có Frontend + Backend + Database |
| 35 | INST-10 | Quản lý Quiz Bài học | Instructor | Teacher | ✓ | ✓ | ✓ | ✓ | | Có Frontend + Backend + Database |
| 36 | INST-11 | Quản lý Học sinh & Export CSV| Instructor | Teacher | ✓ | ✓ | ✓ | ✓ | | Có Frontend + Backend + Database |
| 37 | INST-12 | Engagement Analytics | Instructor | Teacher | ✓ | ✓ | ✓ | ✓ | | Có Frontend + Backend + Database |
| 38 | INST-13 | Trả lời Thảo luận Học sinh | Instructor | Teacher | ✓ | ✓ | ✓ | ✓ | | Có Frontend + Backend + Database |
| 39 | INST-14 | Quản lý Doanh thu & Rút tiền| Instructor | Teacher | ✓ | ✓ | ✓ | ✓ | | Có Frontend + Backend + Database |
| 40 | INST-15 | Xem Đơn hàng đã bán | Instructor | Teacher | ✓ | ✓ | ✓ | ✓ | | Có Frontend + Backend + Database |
| 41 | INST-16 | Xem Đánh giá của Học sinh | Instructor | Teacher | ✓ | ✓ | ✓ | ✓ | | Có Frontend + Backend + Database |
| 42 | INST-17 | Quản lý Bằng cấp Hồ sơ | Instructor | Teacher | ✓ | ✓ | ✓ | ✓ | | Có Frontend + Backend + Database |
| 43 | INST-18 | Yêu cầu Xác minh Giáo viên | Instructor | Teacher | ✓ | ✓ | ✓ | ✓ | | Có Frontend + Backend + Database |
| 44 | INST-19 | Quản lý Coupon Giáo viên | Instructor | Teacher | ✓ | ✓ | ✓ | ✓ | | Có Frontend + Backend + Database |
| 45 | INST-20 | Nộp Duyệt Khóa học / Xóa bài| Instructor | Teacher | ✓ | ✓ | ✓ | ✓ | | Có Frontend + Backend + Database |
| 46 | ADMIN-01 | Quản lý & Khóa User | Admin | Admin | ✓ | ✓ | ✓ | ✓ | | Có Frontend + Backend + Database |
| 47 | ADMIN-02 | Duyệt Giáo viên & Bằng cấp | Admin | Admin | ✓ | ✓ | ✓ | ✓ | | Có Frontend + Backend + Database |
| 48 | ADMIN-03 | Cấu hình Hệ thống AI | Admin | Admin | ✓ | ✓ | ✓ | ✓ | | Có Frontend + Backend + Database |
| 49 | ADMIN-04 | Kiểm duyệt Nội dung & Q-Bank | Admin | Admin | ✓ | ✓ | ✓ | ✓ | | Có Frontend + Backend + Database |
| 50 | ADMIN-05 | Quản lý Shared Resources | Admin | Admin | ✓ | ✓ | ✓ | ✓ | | Có Frontend + Backend + Database |
| 51 | ADMIN-06 | Dashboard System Analytics | Admin | Admin | ✓ | ✓ | ✓ | ✓ | | Có Frontend + Backend + Database |
| 52 | ADMIN-07 | Quản lý System Coupons | Admin | Admin | ✓ | ✓ | ✓ | ✓ | | Có Frontend + Backend + Database |
| 53 | ADMIN-08 | Moderate Flags & Support | Admin | Admin | ✓ | ✓ | ✓ | ✓ | | Có Frontend + Backend + Database |
| 54 | ADMIN-09 | Content Review & Diff View | Admin | Admin | ✓ | ✓ | ✓ | ✓ | | Có Frontend + Backend + Database |
| 55 | AI-01 | AI Tutor Chat Streaming | AI | Student | ✓ | ✓ | ✓ | ✓ | ✓ | Có AI Logic + Streaming |
| 56 | AI-02 | Student AI Quiz Gen | AI | Student | ✓ | ✓ | ✓ | ✓ | ✓ | Có AI Logic |
| 57 | AI-03 | Instructor AI Quiz Gen | AI | Teacher | ✓ | ✓ | ✓ | ✓ | ✓ | Có AI Logic |
| 58 | AI-04 | AI Automatic Essay Grading | AI | Student | ✓ | ✓ | ✓ | ✓ | ✓ | Có AI Logic |
| 59 | AI-05 | AI Course Outline Generator | AI | Teacher | ✓ | ✓ | ✓ | ✓ | ✓ | Có AI Logic |
| 60 | AI-06 | AI Lesson Content Analyzer | AI | Student | ✓ | ✓ | ✓ | | ✓ | Có AI Logic |
| 61 | AI-07 | AI Self-Assessment Eval | AI | Student | ✓ | ✓ | ✓ | ✓ | ✓ | Có AI Logic |
| 62 | AI-08 | AI Study Plan Chat | AI | Student | ✓ | ✓ | ✓ | ✓ | ✓ | Có AI Logic |
| 63 | AI-09 | AI Student Notification Gen | AI | Teacher | ✓ | ✓ | ✓ | ✓ | ✓ | Có AI Logic |
| 64 | AI-10 | AI Student Analytics Insights | AI | Teacher | ✓ | ✓ | ✓ | | ✓ | Có AI Logic |
| 65 | PAY-01 | Checkout VNPay / MoMo | Payment | Student | ✓ | ✓ | ✓ | ✓ | | Có Frontend + Backend + Database |
| 66 | PAY-02 | Áp dụng Mã Giảm giá | Payment | Student | ✓ | ✓ | ✓ | ✓ | | Có Frontend + Backend + Database |
| 67 | PAY-03 | Phân bổ Doanh thu Tự động | Finance | System | | ✓ | | ✓ | | Có Backend + Database |
| 68 | PAY-04 | Cấu hình Payout & Rút tiền | Finance | Teacher | ✓ | ✓ | ✓ | ✓ | | Có Frontend + Backend + Database |
| 69 | CHAT-01 | Realtime Conversation & Recall| Messaging| All | ✓ | ✓ | ✓ | ✓ | | Có Frontend + Backend + Database |
| 70 | CHAT-02 | Reverb / Pusher WebSockets | Messaging| All | ✓ | ✓ | ✓ | | | Có Frontend + Backend |
| 71 | MIC-01 | Phân trang (Pagination) | Utility | All | ✓ | ✓ | ✓ | ✓ | | Có Frontend + Backend |
| 72 | MIC-02 | Search & Filtering | Utility | All | ✓ | ✓ | ✓ | ✓ | | Có Frontend + Backend |
| 73 | MIC-03 | Sorting Records | Utility | All | ✓ | ✓ | ✓ | ✓ | | Có Frontend + Backend |
| 74 | MIC-04 | Export CSV Data | Utility | Teacher | ✓ | ✓ | ✓ | | | Có Frontend + Backend |
| 75 | MIC-05 | Draft Restore & Confirm Delete| Utility | Teacher | ✓ | ✓ | ✓ | ✓ | | Có Frontend + Backend |
| 76 | MIC-06 | Storage S3/R2 Media Upload | Utility | All | ✓ | ✓ | ✓ | ✓ | | Có Frontend + Backend |
| 77 | MIC-07 | Signed URL Evidence Access | Utility | Admin | ✓ | ✓ | ✓ | ✓ | | Có Frontend + Backend |
| 78 | GAP-01 | Component UI Ads-Hourly | Standalone| - | ✓ | | | | | Có UI + Mock / Chưa xác định dùng |
| 79 | GAP-02 | ZaloPay Service Class | Unlinked | - | | ✓ | | | | Có Backend Service / Chưa thấy Route |

---
*Tài liệu Code Audit & Function Inventory hoàn tất dựa trên 100% bằng chứng kiểm tra Source Code dự án MindNova AI.*
