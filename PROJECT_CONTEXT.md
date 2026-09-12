# PROJECT_CONTEXT.md

Tài liệu nguồn cho AI viết/chỉnh sửa báo cáo dự án. Mọi mô tả dưới đây lấy từ source code, migration, `package.json` / `composer.json`, `routes/api.php`, và tài liệu trong repo (`AGENTS.md`, `DESIGN.md`). Không dùng kiến thức chung để điền chỗ trống. Chỗ chưa đủ bằng chứng ghi rõ.

Nguồn schema: `website-MindNova-AI/database/migrations/`. File `database.sql` (dump phpMyAdmin 2026-06-11, DB `du_an_tot_nghiep`) **không phải schema hiện tại**.

---

## 1. TỔNG QUAN DỰ ÁN

| Mục | Giá trị từ code |
|---|---|
| Tên product | **MindNova AI** (`mindnova-ai/package.json` name `mindnova-ai`; UI copy “MindNova AI”) |
| Repo | README root ghi GitHub `website-ai` |
| Loại hệ thống | Nền tảng học trực tuyến (e-learning) tiếng Việt, có AI tutor / study plan / quiz |
| Mục tiêu (từ metadata FE + BE) | Học viên mua và học khóa; giảng viên tạo nội dung, kiếm doanh thu; admin kiểm duyệt user/nội dung/payout |
| Đối tượng | **student**, **teacher** (FE gọi **instructor**), **admin** |
| Timezone | `Asia/Ho_Chi_Minh` (`website-MindNova-AI/config/app.php`) |

**Module chính (có code):**

- Auth + onboarding
- Catalog khóa học / bài học / quiz
- Thanh toán (VNPay, MoMo, banking, free) + hoàn tiền
- Content review (giảng viên không tự publish)
- Chat khóa học realtime, thảo luận bài học
- AI: tutor, study-plan chat, outline, quiz generator, self-assessment, analyze-lesson
- Doanh thu giảng viên / hoa hồng / rút tiền
- Xác minh giảng viên, chứng chỉ hoàn thành khóa, streak, thông báo in-app

---

## 2. KIẾN TRÚC HỆ THỐNG

Hai ứng dụng trong một repo:

```
Browser  :3000  (Next.js App Router — mindnova-ai/)
    │
    ├── Client axios  → NEXT_PUBLIC_API_URL (mặc định http://127.0.0.1:8000) + /api/...
    ├── RSC apiClient → BACKEND_URL (mặc định http://127.0.0.1:8000) + /api/...
    ├── Same-origin fetch("/api/...") → next.config rewrite → Laravel /api/...
    └── Echo (Reverb) → /api/broadcasting/auth + private channels

Laravel  :8000  (website-MindNova-AI/)
    routes/api.php → Middleware → Controller → Service → Eloquent (MySQL) → JSON
    CORS: FRONTEND_URL + localhost:3000, credentials true (config/cors.php)
```

Pattern backend: **Controller → Service → Model**. Không có repository layer đầy đủ. Instructor JSON thường `{ success, message, data }` (`App\Traits\ApiResponse`). Auth/student/admin **không luôn cùng shape**.

Frontend có hai HTTP stack:

- Browser: `mindnova-ai/src/shared/lib/axios.ts` — token localStorage ưu tiên, fallback cookie; 401 xóa token rồi `/login`
- RSC: `mindnova-ai/src/shared/lib/api-client.ts` — cookie `accessToken`, timeout 15s
- Admin: `mindnova-ai/src/features/admin/lib/admin-api.ts`

`next.config.ts` rewrite `/api/:path*` → Laravel. Hằng `BACKEND_URL` được đọc nhưng **không dùng** trong `rewrites`. Callback thanh toán RSC gọi thẳng `BACKEND_URL`, không qua rewrite.

---

## 3. CÔNG NGHỆ SỬ DỤNG

### Frontend (`mindnova-ai/package.json`)

| Thành phần | Công nghệ | Ghi chú |
|---|---|---|
| Framework | Next.js **16.2.6** App Router, React **19.2.4**, TypeScript | `typescript.ignoreBuildErrors: true` |
| CSS | Tailwind CSS **4** | Token `DESIGN.md` / `src/shared/theme/palette.ts` |
| Data fetching | TanStack Query 5 | `staleTime` 60s |
| Client state | Zustand 5 | Chỉ 2 store: onboarding + create-course |
| HTTP | axios | |
| Icon | lucide-react | DESIGN.md: Lucide only |
| Toast | react-hot-toast | |
| Editor | CKEditor 5 classic via `@ckeditor/ckeditor5-react` | Package `ckeditor5` standalone **không import** |
| Realtime | laravel-echo + pusher-js | Broadcaster `reverb` |
| Charts | recharts | |
| PDF | jspdf | `AdminTopbar.tsx` |
| Package manager | pnpm (`pnpm-lock.yaml`) | |

**Cài nhưng không import trong `*.ts`/`*.tsx`:** `graphql`, `graphql-request`, `react-hook-form`, `zod`.

### Backend (`website-MindNova-AI/composer.json`)

| Thành phần | Công nghệ |
|---|---|
| Runtime | PHP `^8.3` |
| Framework | Laravel `^13.8` |
| Auth API | Sanctum `^4.0` Bearer |
| OAuth | Socialite `^5.27` (Google) |
| Queue / cache / session default | `database` |
| Realtime package | `laravel/reverb` `*`, `pusher/pusher-php-server` |
| Storage | `league/flysystem-aws-s3-v3` (disk `r2`) |
| Video duration | `james-heinrich/getid3` |
| AI PHP | `openai-php/laravel` + `openai-php/client` |
| Test | Pest `^4.7` |
| Web legacy | Laravel Breeze (Blade session) |

### Database / ORM

- Eloquent. `.env.example`: `DB_CONNECTION=mysql`. `config/database.php` default nếu thiếu env là **sqlite**.
- Tests: MySQL `du_an_testing` (`phpunit.xml`) — Needs verification trên máy không có PHP.

### Auth / payment / AI / storage (tên, không giá trị)

- Auth: Sanctum personal access token + cookie/localStorage phía FE; Breeze session song song (legacy).
- Payment: VNPay sandbox URL trong `OrderController`; MoMo `captureWallet` sandbox endpoint; `banking` trả URL tĩnh; `free` hoàn tất ngay.
- AI: Gemini (router primary), Groq (tutor/onboarding/student quiz), OpenAI hoặc Groq backup.
- Storage: Cloudflare R2 (S3-compatible) + local/public.

---

## 4. CẤU TRÚC SOURCE CODE

```
/
├── AGENTS.md
├── README.md
├── wiki/Home.md
├── database.sql                 ← dump cũ, không migrate từ đây
├── mindnova-ai/                 ← Frontend Next.js
└── website-MindNova-AI/         ← Backend Laravel
```

### Frontend `mindnova-ai/`

| Đường dẫn | Trách nhiệm |
|---|---|
| `app/` | Page/layout mỏng, gom theo role. Route groups `(auth)`, `(dashboard)`, `(protected)`, `(instructor)`, `(onboarding)`, `(create-course)` **không** xuất hiện trên URL |
| `app/(auth)/` | `/login`, `/forgot-password`, `/welcome` (stub). Không có `app/.../register/page.tsx` |
| `app/(dashboard)/` | Student chrome: Sidebar + Topbar + FloatingAiChat |
| `app/(dashboard)/(protected)/` | Cookie `accessToken` bắt buộc (billing, checkout, practice, …) |
| `app/(instructor)/` | Portal giảng viên |
| `app/(create-course)/` | Wizard tạo khóa, chrome riêng, **không** `InstructorRoleGuard` |
| `app/(onboarding)/` | Wizard onboarding, không sidebar |
| `app/admin/` | Portal admin |
| `middleware.ts` | Cookie `accessToken` + `userRole` |
| `src/features/student/` | UI + API client student |
| `src/features/instructor/` | UI + API client instructor |
| `src/features/admin/` | UI + API client admin |
| `src/features/chat/` | Chat khóa học (student + instructor) |
| `src/features/ads-hourly/` | Demo chart — **không gắn route `app/`** |
| `src/shared/` | axios, api-client, guards, palette, providers, UI kit |
| `src/hooks/` | Echo chat, unread, instructor hooks |
| `DESIGN.md` | Token màu/type |
| `scripts/sync-student-blue.mjs` | One-shot đổi palette cũ → Blue |

Alias TypeScript: `@/*` → root FE. Vitest alias `@` trỏ `./src` — **khác** Next.

### Backend `website-MindNova-AI/`

| Đường dẫn | Trách nhiệm |
|---|---|
| `routes/api.php` | REST cho Next.js (prefix `/api`) |
| `routes/web.php`, `routes/auth.php` | Blade/Breeze legacy |
| `routes/channels.php` | Echo channel auth |
| `routes/console.php` | `app:cleanup-temp-media` daily |
| `app/Http/Controllers/Api/` | Auth, Student, Instructor, Admin, Chat |
| `app/Http/Requests/Instructor/` | Validation instructor |
| `app/Http/Resources/` | Transform JSON |
| `app/Http/Middleware/` | `role` → CheckRole; `admin`; `client` |
| `app/Services/` | Business logic |
| `app/Models/` | Eloquent |
| `app/Policies/` | Course, CourseModule, Lesson, Quiz |
| `app/Events/` | Chat + notification broadcast |
| `database/migrations/` | ~99 file — nguồn schema |
| `tests/` | Pest |
| `docs/` | `instructor-api.md` (thiếu module sau này); `admin-email-queue.md` mô tả endpoint **không có** trong `api.php` |
| `process.md` | Nhật ký instructor — stale so với code |

File rỗng: `app/Services/NotificationService.php`, `app/Services/SubscriptionService.php`.

`config/broadcasting.php` **không có**; chỉ `config/broadcasting.php.bak`.

---

## 5. PHÂN QUYỀN NGƯỜI DÙNG

### Role trong code

Seed `InstructorSeeder.php`: tên pivot `admin`, `teacher`, `student`.

Dual storage:

- Role nằm ở `roles` + `role_user`; API vẫn trả field `role` từ accessor.
- Pivot `role_user` + bảng `roles`

`User::getRoleAttribute()` ưu tiên `roles.name`, rồi `attributes['role']`.

FE normalize (`src/features/student/auth/components/login/AuthShared.ts`):

- admin: `admin` \| `administrator` \| `super_admin` \| `super-admin`
- instructor: `instructor` \| `teacher` \| `lecturer`
- còn lại: student

Register API nhận `role` `student|teacher`. Form FE **cố định `student`**. BE gán `role_id` cứng: **2 = teacher, 3 = student** (giả định seed admin=1). Google callback luôn `role_id = 3`.

Permission table tồn tại; **gần như không enforce** ở middleware.

### Quyền theo role (từ middleware + policy + service)

**Student**

- FE: không vào `/instructor`, `/admin`. Vào student URL.
- BE: **không có** `role:student` trên `/api/student/*`. User Sanctum bất kỳ role vẫn gọi được student authenticated routes nếu có token.
- Catalog/explore/detail: một số GET **public** (không Sanctum).

**Teacher / instructor**

- FE: bị nhốt `/instructor/*` trừ `?preview=true`.
- BE: `auth:sanctum` + `role:teacher` (alias instructor). Ownership: chỉ course `teacher_id` của mình.
- **Không tự publish.** Policy: không xóa course published; submit review chỉ từ `draft|needs_fixes|rejected`.

**Admin**

- FE: `AdminAuthGuard` **chỉ check token**, không check role. Next middleware cho admin đi `/admin`; **không** đẩy admin ra khỏi student URL.
- BE: `auth:sanctum` + `role:admin`.
- Middleware `admin` (header `x-admin-secret` == `ADMIN_SECRET` hoặc `isAdmin()`) **không gắn** lên group `/api/admin`.

**Web Blade `role:client`:** không khớp seed `student` trừ khi pivot `roles.name` đúng chữ `client`.

---

## 6. AUTHENTICATION & AUTHORIZATION (chi tiết)

### Đăng ký / đăng nhập / logout (API SPA)

1. `POST /api/register` — tạo user `status=active`, `is_locked=0`, profile, streak; trả Sanctum token.
2. `POST /api/login` — email+password; 403 nếu `is_locked`; ActivityLog `login`; trả token + `user.roles`.
3. FE ghi `localStorage.accessToken` + `userInfo`; cookie `accessToken` + `userRole` (8h hoặc 30 ngày remember-me). Register luôn 8h.
4. `POST /api/logout` — xóa `currentAccessToken()`.

Forgot password: OTP 6 số, type `forgot_password`, cooldown 60s, hết hạn 5 phút, tối đa 5 lần; hash `otp_hash`; `Mail::raw`.

Google: Socialite stateless. Redirect **hardcode** `http://localhost:3000/login-success?token=` (`AuthController`). FE login form có `GoogleIcon` nhưng **không gọi OAuth**.

Token Sanctum expiration: `null` (`config/sanctum.php`).

### Protected route FE (`middleware.ts`)

Không token → `/login` nếu path:

- `/instructor`, `/admin`
- `/courses/lesson`, `/courses/assignment`, `/courses/certificates`
- `/practice`, `/study-plan`, `/progress`, `/history`, `/profile`, `/billing`, `/checkout`, `/payment`, `/messages`, `/onboarding`

**Không** cookie-gate: `/`, `/explore`, `/courses` (list), `/courses/detail`, `/welcome`, `/forgot-password`, `/login`.

`(protected)/layout.tsx` thêm check cookie cho billing/checkout/practice/…

`/register` được middleware coi là auth route nhưng **không có page**. Register thực tế: `/login?mode=register`.

---

## 7. CHỨC NĂNG HỆ THỐNG

### 7.1 Route / page chính

#### Student

| URL | Mục đích | Đối tượng | Component / API chính |
|---|---|---|---|
| `/` | Dashboard | student (guest thấy CTA login) | `getDashboardOverview` |
| `/explore` | Catalog | student/guest | `GET /api/student/courses/available` |
| `/courses` | Khóa đã enroll | student | `GET /api/student/courses/enrolled` |
| `/courses/detail?courseId=` | Chi tiết khóa | student | `CourseDetailWorkspace` |
| `/courses/lesson` | Học bài (video/article/quiz) | student; instructor `preview=true` | `LessonWorkspace` |
| `/courses/assignment` | UI nộp bài | student | `AssignmentSubmission` — copy tĩnh, **không fetch API** |
| `/courses/certificates` | Chứng chỉ | student | `GET/POST /api/student/certificates` |
| `/billing` | Đơn + tài khoản TT + hoàn tiền | student | orders + payment-methods |
| `/checkout?courseId=` | Thanh toán | student | `POST /api/orders` — **thiếu courseId mặc định `1`** |
| `/payment/callback` | Return từ cổng TT | student | RSC → `PaymentController@callback` hoặc `showByTransaction` |
| `/practice` | Hub quiz + tạo đề AI | student | practice overview + generate-ai-quiz |
| `/practice/quiz/question` | Làm quiz | student | lesson / course / AI quiz |
| `/practice/quiz/result` | Kết quả | student | |
| `/study-plan` | Lộ trình AI + chat | student | `GET /api/student/study-plan` (public), chat Sanctum |
| `/progress` | Tiến trình | student | `GET /api/student/progress/overview` (public) |
| `/history` | Lịch sử học | student | `GET /api/student/history/overview` (public) |
| `/profile` | Hồ sơ | student | `/api/profile*` |
| `/messages` | Chat 1:1 | student | `ChatLayout` — **không có trên sidebar** |
| `/onboarding/*` | Wizard | student | Zustand; `POST /api/student/onboarding` **public** |

#### Instructor

| URL | Mục đích |
|---|---|
| `/instructor` | Redirect `/instructor/courses` |
| `/instructor/courses` | Quản lý khóa |
| `/instructor/courses/[id]/edit` | Sửa khóa |
| `/instructor/courses/[id]/lessons` | Deprecated → redirect edit |
| `/instructor/create-course` | Wizard 3 bước (Zustand `mindnova_course_draft`) |
| `/instructor/quiz-generator` (+ create/manual-create/[quizId]) | Quiz AI/manual |
| `/instructor/discussions` | Q&A |
| `/instructor/messages` | Chat |
| `/instructor/students` | Học viên |
| `/instructor/analytics` | Analytics |
| `/instructor/revenue` (+ history, sales-report) | Doanh thu / rút tiền |
| `/instructor/profile` | Hồ sơ + verification |

`PricingContainer.tsx` **không có route**; `CouponSection` gắn Step 3 tạo khóa.

#### Admin

`/admin`, `/admin/users`, `/admin/teacher-approvals`, `/admin/content`, `/admin/coupons`, `/admin/revenue`, `/admin/analytics`, `/admin/moderation-support`.

#### Auth / stub

`/login`, `/forgot-password`, `/welcome` (stub `<h1>Welcome Page</h1>`), `app/loading.tsx` (`"loading"`), `app/not-found.tsx` (`"Not found"`).

### 7.2 UI pattern

- Student: sidebar trái (thu gọn), topbar (chat/bell/settings/avatar), `main` `overflow-y-auto` `pb-24`, nút nổi **Hỏi Gia sư AI** (`FloatingAiChat`) — ẩn trên `/study-plan`.
- Instructor: sidebar ~234px, topbar, floating AI.
- Admin: `AdminDashboardShell` max 1600px, Sora/Space Grotesk; **không** floating AI.
- Palette Blue: primary `#3B82F6`. Cấm brand red cũ (`palette.ts`).
- Component: card, modal, table, form input, toast. Topbar student còn SVG nội bộ (bell/settings), không phải Lucide.

### 7.3 Notification

- Bảng custom `notifications` (`App\Models\Notification`), **không** Laravel `notifications` mặc định.
- Cap **50 / user** (xóa bản cũ nhất).
- Student: `GET /api/student/notifications`, `PATCH .../read`, `DELETE .../read`.
- Instructor: `POST /api/instructor/notifications`, `POST /api/instructor/students/notifications`.
- Laravel Notification classes: `StudentEnrolled`, `CoursePublished`, `NewCourseNotification`, `NewPaymentNotification`, `NewReview` — `via` mail + `CustomDatabaseChannel`.
- `NotificationService.php` **rỗng**.

### 7.4 Discussion / chat

**Discussion (Q&A bài học):** student CRUD trên lesson (`status` `open`); instructor list + reply. Enum `open|answered|closed`. `is_pinned`, `is_best_answer`. Method pin/best-answer trên instructor controller — **không có route** trong `api.php`.

**Chat khóa học:** `Course::created` tạo `ChatConversation` type `course`. Enrollment thêm member (`firstOrCreate`). Sanctum chat APIs. Recall 60 phút, chỉ người gửi. Broadcast `ChatMessageSent` / `ChatMessageRecalled`. `ChatConversationMember` **không unique** (conversation, user).

**RealtimeController** `POST /api/realtime/send` bắn event `MessageSent` — **không** ghi bảng chat khóa học.

### 7.5 File upload / storage

- Disk `r2` (`config/filesystems.php`, `CLOUDFLARE_R2_*`).
- Video/ảnh/attachment/temp: `LessonService` → R2. Temp key `temp/{videos|images}/{uuid}.ext`, `LessonMedia.is_temp=true`. Signed URL `temporaryUrl` ~1 giờ. Evidence verification ~15 phút.
- Thumbnail: R2 nếu có `CLOUDFLARE_R2_ACCESS_KEY_ID`, không thì `public`.
- Chat attachment: disk default, **không** bắt buộc R2.
- Avatar: student `POST /api/profile/avatar`; instructor `POST /api/instructor/avatar`.
- Cleanup: `app:cleanup-temp-media` daily, temp > 24h.
- Next `images.remotePatterns`: Unsplash, localhost, hai host `*.r2.dev`.

### 7.6 AI (chức năng)

| Use | Provider trong code | Endpoint FE |
|---|---|---|
| Tutor stream (enrolled + lesson context + quota) | `CourseAiTutorService` → `AiRouterService` (Gemini → backup) | `POST /api/student/ai-tutor/chat` |
| Study-plan / floating chat | cùng tutor path qua `StudyPlanController@chat` | `POST /api/student/study-plan/chat` (Sanctum, throttle 10/1) |
| Student generate AI quiz | Groq HTTP trực tiếp trong `AiQuizGeneratorController` | `POST /api/student/practice/generate-ai-quiz` (Sanctum) |
| Instructor quiz generate | `AiQuizGeneratorService` + router | `/api/instructor/ai-quiz/*` |
| Course outline | router | `/api/instructor/courses/ai-outline/generate` |
| Self-assessment | router | **public** generate/submit |
| Analyze-lesson / onboarding | Groq | **public** |
| Quota tutor | `AiDailyQuotaService` feature `ai_tutor` | free 5/ngày, premium 200/ngày nếu `subscriptions.plan=premium` |

`POST /api/ai-chat` trỏ `AiTutorController@chat` — file `AiTutorController.php` **chỉ có** `streamChat`. Route này **chưa đủ bằng chứng hoạt động**.

`AiTutorService` (Groq legacy) **không** được controller hiện tại gọi.

`MockAiService` không bind trong `AppServiceProvider`.

`CLAUDE_API_KEY` / `INTERNAL_AI_KEY` đọc trong config — **chưa phải provider chính**.

---

## 8. DATABASE

Nguồn: migrations + models `website-MindNova-AI/app/Models/`. Không SoftDeletes trên model. `users.deleted_at` có thể tồn tại từ migration cũ.

### Identity

- `users` — status `active|banned|inactive`; `is_locked`; role qua pivot `role_user`; `teacher_verification_status`; `onboarding_data`; `payout_info`
- `roles`, `permissions`, `role_user`, `permission_role`
- `user_profiles` 1:1
- `password_otps`

### Catalog / học

- `categories`
- `courses` — `partnership_tier` default `standard`; `lock_version`; `published_version_id`; `admin_hidden_at`
- `course_modules` status `draft|published`
- `lessons` type `video|article|quiz_module`
- `lesson_media`, `lesson_attachments`
- `lesson_completions` unique `(user_id, lesson_id)`
- `enrollments` — **không unique (user, course)**; model `$timestamps = false`
- `Course::classes()` trỏ `CourseClass` **đã drop** — gọi sẽ lỗi

### Quiz

- `quizzes` (`lesson_id` nullable = bank), type `normal` (1 credit) / `capability_assessment` (3)
- `questions`, `answers`
- `quiz_course_attachments` position `end_of_course|in_module|after_lesson|capability_assessment`
- `user_quiz_attempts`, `user_quiz_attempt_answers`
- `ai_generated_quizzes` — JSON quiz học viên, tách `quizzes`

### Commerce

- `orders` `payment_method` ENUM `vnpay|momo|banking|free`; status `pending|completed|failed|refunded`; `transaction_id` unique
- `order_items`
- `payments` — **không có `order_id`**; provider string (có thể zalopay); không trùng ENUM orders
- `student_payment_methods` — lưu `account_number` plain, API ẩn, trả `last4`
- `coupons` type percent/fixed
- `subscriptions` — model có; `SubscriptionService` rỗng
- `reviews` unique `(course, user)`
- `certificates` unique `(user, course)`

### Revenue / verification

- `revenue_allocations` PENDING → AVAILABLE → (docs: WITHDRAWING/WITHDRAWN) | REFUNDED
- `instructor_transactions`, `withdrawals`, `teacher_payouts` (ledger cũ)
- `teacher_verifications`, `teacher_certificates`, `teacher_certificate_evidences`, `teacher_credentials`, `teacher_verification_logs`

### Chat / community / review

- `chat_conversations`, `chat_conversation_members`, `chat_messages`, `chat_attachments`
- `discussions`, `discussion_replies`
- `content_versions`, `draft_revisions`, `review_submissions`, `review_submission_items`, `review_comments`, `deletion_requests`, `content_audit_logs`

### AI / ops

- `ai_tutor_conversations`, `ai_tutor_messages`
- `ai_usage_logs`, `ai_daily_quota_usages`, `ai_generation_logs`, `ai_moderation_flags`
- `admin_settings` KV, `activity_logs`, `admin_logs`, `support_tickets`, `notifications` (cap 50), `user_streaks`, `shared_resources`

**Không có model:** `knowledge_topics`, `user_topic_performance`. **Dropped:** `course_classes`, `ai_recommendations`.

**Unique quan trọng thiếu:** enrollments (user, course); chat members (conversation, user); student_payment_methods default.

### Quan hệ (đã verify)

```
User ──teacher──► Course ──► Module ──► Lesson ──► Media/Attachment/Quiz
User ──► Enrollment ──► Course
User ──► Order ──► OrderItem ──► Course
User ──► StudentPaymentMethod
User ──► Payment          (KHÔNG FK Order)
Enrollment / paid Order ──► ChatConversationMember
Course created ──► ChatConversation (type=course)
User+Course ──► Certificate, Review
Order completed ──► Enrollment + RevenueAllocation(PENDING)
Course/Lesson morph ──► ContentVersion, DraftRevision
```

`User::orders()`, `Course::reviews()`, `Order::payments()` **không** khai báo trên model dù bảng tồn tại.

---

## 9. API

Prefix Laravel `/api`. Health `GET /up`. Chi tiết đầy đủ: `website-MindNova-AI/routes/api.php`.

### Public auth (`throttle:30,1`)

`POST /register`, `/login`, `/forgot-password`, `/forgot-password/verify-otp`, `/reset-password`; `GET /auth/google`, `/auth/google/callback`.

### Public IPN

| Method | Path | Handler |
|---|---|---|
| GET | `/vnpay/ipn` | `OrderController@vnpayIpn` |
| GET | `/student/payment/vnpay-ipn` | same |
| POST | `/student/payment/momo-ipn` | `momoIpn` |
| GET | `/student/payments/callback/{provider}` | `PaymentController@callback` |

### Student **không** Sanctum (public)

`GET /student/study-plan`, `/practice/overview`, `/progress/overview`, `/history/overview`, `/courses/available`, `/courses/detail/{id?}`, `/courses/{course}/reviews`; `POST /student/onboarding`; `GET /available-topics`; `POST /analyze-lesson`; self-assessment generate/submit.

Các endpoint này **có thể** đọc `user('sanctum')` nếu có token (ví dụ `is_enrolled`).

### Sanctum (đã login)

Logout, check-in, chat, profile, `GET/POST /orders`, coupons/apply, dashboard, enrolled, practice AI quizzes, certificates, payment-methods, refund, tutor stream, reviews CUD, quizzes, video-url, complete lesson, notifications, discussions, `POST /broadcasting/auth`.

`PaymentController@index/store/checkout/show` **tồn tại trong class, không đăng ký route**. Chỉ `callback` được route.

Dev local/testing: `POST /api/dev/orders/{id}/complete|refund`.

### Instructor (`role:teacher`)

Prefix `/api/instructor`: courses CRUD + thumbnail/status/price/health/draft; modules/lessons/media/attachments; quiz; students/analytics; discussions; revenue/withdraw; AI quiz; outline; submit-review; profile/certificates/verification; coupons; `commission-tiers`.

### Admin (`role:admin`)

Prefix `/api/admin`: `GET /overview` (có trong `api.php` hiện tại), users, teacher-approvals, content, analytics, revenue + commission-tiers, coupons, flags, tickets, review queue.

Docs `admin-email-queue.md` nhắc `POST /admin/notifications/test-email` — **không có** trong `api.php`.

JSON lỗi throttle (`bootstrap/app.php`): thông báo tutor >5 câu/phút cho `api/*` hoặc `*student/*`.

---

## 10. CÁC LUỒNG NGHIỆP VỤ

### 10.1 Đăng ký → đăng nhập

1. FE `/login?mode=register` → `POST /api/register` (role form = student).
2. Token + cookie + localStorage.
3. Middleware: student → `/explore` nếu vào `/login` khi đã login.
4. Onboarding: `/onboarding` → goal → skills → topics → generating → plan; `POST /api/student/onboarding` **không bắt buộc Sanctum**.

### 10.2 Tạo khóa → kiểm duyệt → public

1. Instructor `/instructor/create-course` (Zustand draft) → `POST /api/instructor/courses` status `draft`.
2. Modules/lessons/media/quiz. `Course::created` tạo chat course.
3. Health (`CourseHealthService`): title ≥3, mô tả ≥30, thumbnail, ≥1 module, ≥1 lesson, giá hợp lệ, flash sale hợp lệ; `can_submit`.
4. `POST .../submit-review` từ `draft|needs_fixes|rejected` → `pending_review` + snapshot `content_versions` + `review_submissions`.
5. Admin start → `under_review`; approve → course/lessons `published` + `published_version_id`; reject → `rejected`; request-fixes → `needs_fixes`.
6. Catalog student chỉ hiện `status=published` **và** `published_version_id` not null.
7. Teacher **không** set `published` qua `updateStatus` (`UpdateCourseStatusRequest` chỉ `draft,pending_review`; `published` bị rewrite thành `draft`).
8. Lesson published không xóa thẳng → `deletion_requests`.

### 10.3 Mua khóa → thanh toán → quyền học

1. Checkout chọn VNPay/MoMo/banking hoặc tài khoản đã lưu (`payment_method_id` → overwrite provider).
2. `POST /api/orders` với `course_ids`, `payment_method`, optional coupon.
3. Chặn nếu đã enroll.
4. Tạo `orders` pending + `order_items`. Coupon cộng `used_count` **lúc tạo đơn**, không lúc IPN.
5. `totalAmount <= 0` hoặc `free`: completed ngay, enroll, notify, chat member.
6. VNPay/MoMo: trả `payment_url` → FE redirect. Banking: URL tĩnh `https://your-website.com/banking-instruction` (placeholder trong code).
7. IPN thành công + order `pending` → completed, `insertOrIgnore` enrollments, chat member, `InstructorPayoutService::createForOrder` (allocation PENDING, deadline +30 ngày).
8. Return URL VNPay **hardcode** `http://localhost:3000/payment/callback`.

**Không** có tokenization gateway. `student_payment_methods` chỉ lưu số TK/ví do user gõ; checkout vẫn tạo giao dịch cổng mới.

### 10.4 VNPay (đúng code `OrderController`)

1. `vnp_Command=pay`, `vnp_Amount = total * 100`, HMAC-SHA512 `http_build_query` + `VNPAY_HASH_SECRET`.
2. URL: `https://sandbox.vnpayment.vn/paymentv2/vpcpay.html`.
3. IPN: filter `vnp_*`, bỏ hash, ksort, HMAC-SHA512; `vnp_ResponseCode == '00'`.
4. `VNPayService::verifyCallback` (dùng cho `PaymentController@callback`) ký chuỗi urlencoded key=value — **khác** cách `OrderController@vnpayIpn` dùng `http_build_query`. Hai đường verify không đồng nhất.

### 10.5 MoMo (đúng code)

1. `requestType=captureWallet`, HMAC-SHA256 raw `accessKey&amount&...&requestType`, POST `MOMO_ENDPOINT` default `https://test-payment.momo.vn/v2/gateway/api/create`.
2. Trả `payUrl`.
3. IPN `OrderController@momoIpn`: HMAC-SHA256 các field IPN; `resultCode == 0`.
4. `MomoService::verifyCallback` (PaymentController path): **không HMAC**, chỉ `orderId` + `resultCode === 0`.

### 10.6 Hoàn tiền

Điều kiện (`OrderController` + `RevenueUnlockService`):

1. Order completed chứa khóa, `diffInDays(created_at) <= 30`
2. `progress_percentage <= 10` **và** completed lessons `<= 5`

Thực hiện: xóa enrollment, gỡ chat member, allocation `REFUNDED`, transaction type `refund`, order `refunded`. Nếu user có saved methods thì bắt `payment_method_id`. **Không gọi API hoàn tiền VNPay/MoMo.**

Revenue unlock `PENDING` → `AVAILABLE` khi hết điều kiện refund. Command `revenue:unlock-pending` **chưa schedule**.

### 10.7 Hoa hồng

`CommissionSettingsRepository` key `commission.tiers.v1`:

- `standard`: platform 30% / instructor 70%
- `exclusive`: 15% / 85%

Admin `PUT /api/admin/revenue/commission-tiers`. Snapshot trên `revenue_allocations`.

### 10.8 Học bài

1. Lesson published. Video: `GET .../video-url` signed R2 hoặc URL ngoài (YouTube/Vimeo embed).
2. `POST .../complete` → `lesson_completions`. Progress enrollment.
3. Quiz lesson / course (`general` / final) / AI quiz riêng bảng `ai_generated_quizzes`.
4. Chứng chỉ: `POST /api/student/certificates/claim` khi enrollment `completed` hoặc progress ≥ 100. `certificate_url` có thể null (chưa generate PDF trong code đã đọc).

---

## 11. TÍCH HỢP BÊN THỨ BA

| Service | Dùng trong code | Ghi chú |
|---|---|---|
| VNPay | `OrderController`, `VNPayService` | Sandbox URL hardcode |
| MoMo | `OrderController`, `MomoService` | `captureWallet`, sandbox default |
| ZaloPay | `ZaloPayService` | **Không** trong enum orders; **không** route OrderController |
| Gemini | `GeminiAiService`, `AiRouterService` | Primary |
| Groq | tutor/onboarding/student quiz | `GROQ_API_KEY` |
| OpenAI | backup nếu `BACKUP_AI_PROVIDER` không phải groq | |
| Google OAuth | Socialite | Redirect localhost |
| Cloudflare R2 | disk `r2` | Video/evidence |
| AWS S3 env | `AWS_*` trong example | Disk s3 Laravel stock |
| SMTP | `MAIL_*` | OTP, queued notifications |
| Laravel Reverb | Echo FE | Thiếu `config/broadcasting.php` |
| Slack / Postmark / Resend | tên trong config Laravel | Chưa thấy business code MindNova gọi |

---

## 12. CONFIGURATION & ENVIRONMENT VARIABLES

Chỉ **tên biến**. Không ghi giá trị. Nếu source có placeholder, không copy.

### Backend `.env.example`

`APP_NAME`, `APP_ENV`, `APP_KEY`, `APP_DEBUG`, `APP_URL`, `APP_LOCALE`, `APP_FALLBACK_LOCALE`, `APP_FAKER_LOCALE`, `APP_MAINTENANCE_DRIVER`, `BCRYPT_ROUNDS`, `LOG_*`, `DB_*`, `SESSION_*`, `BROADCAST_CONNECTION`, `FILESYSTEM_DISK`, `QUEUE_CONNECTION`, `CACHE_STORE`, `REDIS_*`, `MAIL_*`, `AWS_*`, `CLOUDFLARE_R2_*`, `VITE_APP_NAME`, `VNPAY_TMN_CODE`, `VNPAY_HASH_SECRET`, `MOMO_PARTNER_CODE`, `MOMO_ACCESS_KEY`, `MOMO_SECRET_KEY`, `OPENAI_API_KEY`, `OPENAI_ORGANIZATION`, `GEMINI_API_KEY`, `GEMINI_MODEL`, `GROQ_API_KEY`, `GROQ_MODEL`, `BACKUP_AI_PROVIDER`, `BACKUP_AI_MODEL`.

### Dùng trong config/code nhưng thiếu trên `.env.example`

`FRONTEND_URL`, `ADMIN_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI`, `BACKUP_AI_API_KEY`, `MOMO_ENDPOINT`, `SANCTUM_STATEFUL_DOMAINS`, `AI_FORCE_PRIMARY_FAILURE`, `REVERB_*`, `CLAUDE_API_KEY`, `INTERNAL_AI_KEY`, `VNP_TMN_CODE` / `VNP_HASH_SECRET` (alias trong `config/services.php`).

### Frontend (không có `.env.example`)

`BACKEND_URL` (RSC + payment callback), `NEXT_PUBLIC_API_URL` (axios, rewrite, Echo), `NEXT_PUBLIC_REVERB_APP_KEY|HOST|PORT|SCHEME`, `NEXT_PUBLIC_ENABLE_PUSHER_LOGS`.

---

## 13. TRẠNG THÁI HIỆN TẠI CỦA PROJECT

### Đã hoàn thiện / đang dùng (có route + service + UI)

- Auth email/password, OTP reset, Sanctum
- Catalog, enroll, lesson player, quiz, discussion
- Content review admin
- Chat khóa học (API + Echo client)
- VNPay/MoMo create + IPN trên `OrderController`
- Saved payment accounts (form ngân hàng/số TK) + checkout/refund chọn tài khoản
- Billing/certificates/dashboard nối API (không còn mock Visa 4242 / Alex Chen trên các page đó)
- AI tutor (stream), study-plan chat, instructor outline/quiz gen, student AI quiz (Sanctum)
- Revenue split + withdraw request
- Teacher verification queue
- R2 media + signed URL

### Chưa hoàn thiện / placeholder / lệch

| Mục | Phân loại |
|---|---|
| `/welcome`, loading, not-found | stub |
| `/courses/assignment` | UI tĩnh, chưa API |
| Banking payment URL | placeholder domain |
| VNPay return URL | hardcode localhost:3000 |
| ZaloPay | service không gắn order flow |
| Tokenization thẻ | **không có** trong code |
| Hoàn tiền cổng | chỉ cập nhật DB, không gọi VNPay/MoMo refund |
| `POST /api/ai-chat` | method `chat` không có trên controller |
| `config/broadcasting.php` | thiếu (chỉ `.bak`); `.env.example` `BROADCAST_CONNECTION=log` |
| `revenue:unlock-pending` | chưa schedule |
| `NotificationService` / `SubscriptionService` | file rỗng |
| Google OAuth FE | icon, không handler; BE redirect localhost |
| `PaymentService` callback user | fallback `User::first()` |
| `Course::classes()` | broken |
| `ads-hourly` | không gắn route |
| graphql / RHF / zod | installed unused |
| QuizAssessmentSeeder | xóa toàn bộ quizzes |
| DiscussionSeeder | tìm `role=instructor` và model `Module` — lệch |
| Register `role_id` 2/3 | phụ thuộc thứ tự seed |
| `ignoreBuildErrors: true` | che lỗi TS |
| Pin/best-answer discussion | method không có route |
| Certificate PDF | claim row; `certificate_url` có thể null |

### Frontend có UI, backend tương ứng

- Billing lưu TK: có API `payment-methods` — **không** phải token gateway.
- Pro upgrade trên billing: **toast**, không API gói Pro.

### Backend có, FE hạn chế

- `GET /api/admin/overview` — hero admin dùng 3 stat đầu.
- Google callback — FE không có `/login-success` trong `app/` đã liệt kê.
- Instructor pin discussion — không route.

---

## 14. VALIDATION, ERROR, SECURITY (kiến trúc)

- Instructor: Form Requests. Student/admin: validator inline nhiều chỗ.
- FE checkout: checkbox xác nhận tài khoản; coupon `/api/coupons/apply`.
- Password: hashed (Laravel). OTP hashed.
- CORS credentials + stateful Sanctum localhost:3000.
- CSRF: SPA dùng Bearer, không cookie CSRF cho API token. Breeze web vẫn CSRF.
- Payment: IPN `OrderController` verify HMAC; `MomoService::verifyCallback` **không** HMAC; amount lấy từ order DB khi complete, không tin FE cho enroll.
- File: R2 private + signed URL; temp cleanup.
- Student GET/AI public: study-plan overview, catalog, onboarding, analyze-lesson, self-assessment — điểm regression bảo mật.
- `ADMIN_SECRET` backdoor chỉ nếu gắn middleware `admin` (hiện group dùng `role:admin`).
- Secret phải ở backend; không commit `.env`. FE không bundle `VNPAY_HASH_SECRET` / `MOMO_SECRET_KEY` (chỉ gọi API).

---

## 15. CÁC ĐIỂM CẦN LƯU Ý KHI VIẾT BÁO CÁO

1. **Không mô tả hệ thống “lưu thẻ/token VNPay/MoMo”.** Code hiện lưu `holder_name` + `account_number` do user nhập; API trả `•••• last4`. Checkout vẫn redirect cổng. Spec tokenization từng được yêu cầu rồi **revert**.
2. **Giảng viên không tự xuất bản khóa.** Phải admin content-review + `published_version_id`.
3. **Hoa hồng** 30/70 standard vs 15/85 exclusive — từ `CommissionSettingsRepository`, không bịa số khác.
4. **Refund** 30 ngày + progress ≤10% + ≤5 lesson; không gọi refund gateway.
5. **Nhiều API student GET/AI không cần login.** Đừng viết “toàn bộ API yêu cầu JWT”.
6. **Hai HTTP client FE** (axios vs RSC) + dual token storage (localStorage + cookie). Middleware chỉ đọc cookie.
7. **AdminAuthGuard không check role admin.**
8. **Broadcast production chưa đủ bằng chứng** (thiếu `broadcasting.php`, example `log`).
9. **`database.sql` không phải schema live.**
10. **ZaloPay / Stripe:** stripe đã bỏ khỏi ENUM orders; ZaloPay service không gắn `OrderController`.
11. **UI ≠ chức năng:** assignment page, welcome, Pro upgrade toast, banking instruction URL.
12. **Hai đường verify VNPay/MoMo** (`OrderController` IPN vs `PaymentService` callback) khác thuật toán — đừng gộp thành một “chuẩn duy nhất” nếu không đọc cả hai file.
13. Palette báo cáo: Blue `#3B82F6`, không mô tả theme đỏ TeacherColor cũ trên nhánh hiện tại.
14. Tên vai trò: DB `teacher`, UI `instructor`, alias `lecturer`.

---

## 16. LỆNH CHẠY (từ package scripts)

Frontend (`mindnova-ai/`): `pnpm install`, `pnpm dev`, `pnpm build`, `pnpm test`.

Backend: `composer install`, `php artisan migrate`, `php artisan serve`, `php artisan queue:work`, `php artisan test`. Seed `QuizAssessmentSeeder` **destructive**. `composer dev` chạy vite Blade, **không** thay Next.js.

---

*Sinh từ quét `mindnova-ai/`, `website-MindNova-AI/` (routes, models, migrations, services, controllers, package manifests) và đối chiếu `AGENTS.md`. Không chứa secret thật.*
