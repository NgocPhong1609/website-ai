# AGENTS.md

Context và quy tắc chính cho AI coding agent làm việc với repository **MindNova AI** (monorepo student + instructor + admin).

Đọc file này trước khi sửa code. Không copy toàn bộ source vào đây. Nếu chưa xác minh được từ code thì ghi **Unknown** hoặc **Needs verification**.

---

## Agent Rules

1. Đọc `AGENTS.md` này trước khi sửa code.
2. Đọc các file liên quan (route, controller/service, model/migration, FE feature + page, test) trước khi thay đổi.
3. Ưu tiên sửa root cause, không vá triệu chứng.
4. Không tự ý phá API contract, architecture, database schema, hoặc business logic trừ khi task yêu cầu rõ.
5. Kiểm tra dependency giữa module FE/BE/DB và backward compatibility (client Next.js đang gọi Laravel `/api/*`).
6. Không bịa thông tin. Chưa đọc được thì ghi Unknown / Needs verification, rồi đi đọc source.
7. Đụng đúng phạm vi. Không refactor drive-by, không thêm feature “cho chắc”.
8. UI: bám `mindnova-ai/DESIGN.md` và `mindnova-ai/src/shared/theme/palette.ts`. Không đưa lại brand red cũ.
9. Không commit secret (API key, password, token). Không log secret.
10. Sau thay đổi có ý nghĩa: chạy test liên quan; UI thì verify hành vi, không chỉ nhìn screenshot.
11. Cập nhật README/wiki khi thay đổi hành vi công khai, API, hoặc workflow.

---

## 1. Tổng quan dự án

MindNova AI là nền tảng học trực tuyến tiếng Việt, có AI tutor / study plan / quiz generator.

Ba vai trò:

- **student**: khám phá khóa học, mua, học bài, quiz, thảo luận, chat khóa học, streak, onboarding, AI hỗ trợ.
- **teacher** (FE thường gọi **instructor**): tạo/sửa khóa học, media, quiz, review workflow, học viên, doanh thu, xác minh giảng viên.
- **admin**: user, teacher verification, content moderation, coupon, analytics/revenue, support.

### Công nghệ chính

| Tầng | Công nghệ | Ghi chú |
|---|---|---|
| Frontend | Next.js 16.2 App Router, React 19, TypeScript, Tailwind CSS 4 | `mindnova-ai/` |
| State / data | TanStack Query, Zustand (onboarding + create-course), axios + server `fetch` | GraphQL trong `package.json` nhưng **không dùng trong source** |
| Backend | Laravel 13, PHP 8.3+, Sanctum | `website-MindNova-AI/` |
| DB | MySQL (`.env.example` = mysql). Config default nếu thiếu env là sqlite | Tests: MySQL `du_an_testing` |
| Auth API | Sanctum Bearer token | Web Blade/Breeze session vẫn còn, legacy |
| Realtime | Laravel Reverb + Echo/pusher-js trên FE | `config/broadcasting.php` **không có**, chỉ `.bak` |
| Storage | Local + Cloudflare R2 (S3-compatible) | Video/evidence signed URL |
| AI | Gemini (primary router), Groq (tutor/quiz/onboarding), OpenAI/Groq backup | |
| Payment | VNPay, MoMo; ZaloPay service tồn tại nhưng **chưa gắn route/config** | |
| Queue | `database` default | Worker cần chạy riêng |
| Timezone | `Asia/Ho_Chi_Minh` | `config/app.php` |

### Kiến trúc giao tiếp

```
Browser (Next.js :3000)
  ├── Client axios  → NEXT_PUBLIC_API_URL (thường http://127.0.0.1:8000) + /api/...
  ├── RSC apiClient → BACKEND_URL + /api/...
  ├── Same-origin fetch("/api/...") → next.config rewrite → Laravel /api/...
  └── Echo (Reverb) → /api/broadcasting/auth + private channels

Laravel (:8000)
  routes/api.php  → Controllers → Services → Eloquent → JSON
  CORS: FRONTEND_URL + localhost:3000, credentials true
```

Hai HTTP stack trên FE:

- Server: `mindnova-ai/src/shared/lib/api-client.ts` (cookie `accessToken`, timeout 15s).
- Browser: `mindnova-ai/src/shared/lib/axios.ts` (localStorage token ưu tiên, fallback cookie; 401 xóa token và về `/login`).

JSON instructor thường `{ success, message, data }` (`App\Traits\ApiResponse`). Auth/student/admin không luôn cùng shape — **Needs verification** từng endpoint trước khi giả định.

Repo GitHub ghi trong README root: `website-ai`. Product UI sống ở Next.js, không phải Blade.

---

## 2. Cấu trúc thư mục

```
/
├── AGENTS.md                          ← file này
├── README.md                          ← git workflow + tình trạng nhánh
├── wiki/Home.md                       ← wiki từ README
├── database.sql                       ← dump phpMyAdmin cũ (2026-06-11), KHÔNG phải schema hiện tại
├── INSTRUCTOR_FULL_FUNCTION_TEST_CHECKLIST.md
├── mindnova-ai/                       ← Frontend Next.js
└── website-MindNova-AI/               ← Backend Laravel
```

### Frontend `mindnova-ai/`

| Khu vực | Trách nhiệm |
|---|---|
| `app/` | App Router: page/layout mỏng, gom theo role |
| `app/(auth)/` | login, forgot-password, welcome (welcome đang stub) |
| `app/(dashboard)/` | student: explore, courses, protected (billing, checkout, practice, …) |
| `app/(onboarding)/` | wizard onboarding |
| `app/(instructor)/` | portal giáo viên |
| `app/(create-course)/` | wizard tạo khóa (chrome riêng, không sidebar instructor) |
| `app/admin/` | portal admin |
| `middleware.ts` | cookie `accessToken` + `userRole`; chặn route theo role |
| `src/features/student/` | UI + API client student |
| `src/features/instructor/` | UI + API client instructor |
| `src/features/admin/` | UI + API client admin |
| `src/features/chat/` | chat khóa học (dùng chung student/instructor) |
| `src/features/ads-hourly/` | demo chart — **không gắn route** |
| `src/shared/` | axios/api-client, guards, palette, providers, UI kit |
| `src/hooks/` | Echo chat, instructor hooks |
| `DESIGN.md` | token màu/type — nguồn UI |
| `scripts/sync-student-blue.mjs` | one-shot đổi palette cũ → Blue |

Khi sửa chức năng student: page trong `app/(dashboard)/` + feature trong `src/features/student/<module>/`.  
Instructor: `app/(instructor)/` + `src/features/instructor/<module>/`.  
Admin: `app/admin/` + `src/features/admin/`.

Alias TS: `@/*` → root FE, `@features/*` → `src/features/*` (và `src/features/student/*`), `@shared/*` → `src/shared/*`.  
Vitest alias `@` trỏ `./src` — **khác** Next (`@/*` = root FE).

### Backend `website-MindNova-AI/`

| Khu vực | Trách nhiệm |
|---|---|
| `routes/api.php` | REST chính cho Next.js |
| `routes/web.php`, `routes/auth.php` | Blade/Breeze legacy |
| `routes/channels.php` | Echo channel auth |
| `routes/console.php` | schedule: cleanup temp media daily |
| `app/Http/Controllers/Api/` | Auth, Student, Instructor, Admin, Chat |
| `app/Http/Requests/Instructor/` | validation instructor |
| `app/Http/Resources/` | transform JSON |
| `app/Http/Middleware/` | `role` → CheckRole; `admin`; `client` |
| `app/Services/` | business logic |
| `app/Models/` | Eloquent |
| `app/Policies/` | Course, CourseModule, Lesson, Quiz (ownership teacher) |
| `app/Events/` | chat + notification broadcast |
| `database/migrations/` | ~99 file — nguồn schema |
| `database/seeders/` | demo data |
| `tests/` | Pest feature/unit |
| `docs/instructor-api.md` | contract instructor (thiếu nhiều module sau này) |
| `docs/admin-email-queue.md` | mô tả endpoint **không có trong `api.php`** |
| `process.md` | nhật ký instructor BE — **stale** so với code |

Pattern: Request → middleware → Controller → Service → Model. Không có repository layer đầy đủ.

---

## 3. Module / feature chính

### 3.1 Auth + onboarding

- BE: `app/Http/Controllers/Api/Auth/AuthController.php`
- FE login/register: `src/features/student/auth/`
- FE onboarding: `src/features/student/onboarding/` + store Zustand
- Register nhận `role` `student|teacher`. Form FE hiện **cố định `student`**.
- Register gán `role_id` cứng: **2 = teacher, 3 = student** (giả định seed admin=1). Google callback luôn `role_id = 3`.
- Login từ chối `is_locked`.
- Token lưu `localStorage.accessToken` + cookie `accessToken` (middleware chỉ đọc cookie) + `userRole`.
- FE normalize role: `src/features/student/auth/components/login/AuthShared.tsx` (teacher/instructor/lecturer → instructor).

### 3.2 Student learning

| Feature | FE | BE |
|---|---|---|
| Dashboard | `features/student/dashboard/` | `Student\DashboardController` + `DashboardService` |
| Explore catalog | `features/student/explore/` | `GET /api/student/courses/available` |
| Course detail / lesson | `features/student/courses/` | `Student\CourseController`, `LessonController` |
| Quiz / practice | `features/student/quiz/` | `StudentQuizController`, `AiQuizGeneratorController`, `PracticeService` |
| Study plan + AI chat | `features/student/ai-study-plan/` | `StudyPlanController` + `StudyPlanService` (HTTP, không Echo) |
| Progress / history | `features/student/progress/`, `history/` | `ProgressController`, `HistoryController` |
| Profile | `features/student/profile/` | `UserController` `/api/profile` |
| Checkout / payment | `features/student/checkout/` | `OrderController`, `PaymentController`, `PaymentService` |
| Billing / certificates | UI gần như **mock**, chưa nối đủ API | `Certificate` model tồn tại |
| Streak check-in | dashboard | `POST /api/student/check-in` |
| Reviews | course detail | `Student\ReviewController` |
| Discussions | lesson workspace | `Student\DiscussionController` |

### 3.3 Instructor

| Feature | FE | BE service |
|---|---|---|
| Course list | `instructor/management/` | `Instructor\CourseService` |
| Create/edit 3 bước | `instructor/create-course/` (Zustand `mindnova_course_draft`) | Course + Module + Lesson + DraftRevision |
| Lessons/media | `instructor/lesson-management/` | `LessonService` (R2 signed URL) |
| AI outline | `useGenerateOutline` | `CourseOutlineController` |
| Quiz AI/manual | `instructor/quiz-generator/` | `AiQuizGeneratorService`, `QuizService` |
| Health / submit review | CourseHealthCard | `CourseHealthService`, `ContentReviewService` |
| Students / analytics | `student-management/`, `analytic/` | `StudentService`, `StudentAnalyticsController` |
| Discussions | `instructor/discussion/` | `DiscussionService` |
| Revenue / withdraw | `instructor/revenue/` | `RevenueService`, `RevenueUnlockService`, `InstructorPayoutService` |
| Coupons | `pricing/` (gắn Step3, `PricingContainer` không mount) | `Instructor\CouponController` |
| Profile / verification | `instructor/profile/` | `TeacherProfileController`, `TeacherVerificationService` |

Instructor **không tự publish**. Publish qua admin content-review. Policy: xóa course published = false; submit review chỉ từ `draft|needs_fixes|rejected`.

### 3.4 Admin

FE pages: `/admin` (analytics), users, teacher-approvals, content, coupons, revenue, moderation-support.

BE: `app/Http/Controllers/Api/Admin/*`.

Một số service FE (`admin-overview`, categories, invoices) trả empty khi API fail. README: analytics còn empty state giả — **Needs verification** từng chart.

`AdminAuthGuard` chỉ check token, **không check role admin**. Middleware Next mới chặn student/teacher khỏi `/admin`.

### 3.5 Chat realtime

- Tạo `ChatConversation` type `course` khi `Course` created; enrollment thêm member.
- FE: `src/features/chat/` + `useRealtimeChat.ts` + `useChatGlobalUnread.ts`
- BE: `ChatController`, events `ChatMessageSent` / `ChatMessageRecalled`
- Channel: `private-chat.conversation.{id}`, `private-App.Models.User.{id}`

### 3.6 AI

| Use | Primary | Router/fallback |
|---|---|---|
| Course outline, instructor quiz, self-assessment | Gemini via `AiRouterService` | BackupAiService |
| Student tutor, study-plan chat, analyze-lesson, student AI quiz | Groq | Backup tùy chỗ |
| Binding | `AiProviderInterface` → `GeminiAiService` | `AppServiceProvider` |

`MockAiService` cho test. `AiTutorController` đọc thêm key Claude/internal — **chưa phải provider chính**.

### 3.7 Payments & revenue

Checkout: `POST /api/orders` (`vnpay|momo|banking|free`) → IPN public → enroll + chat member + payout/allocation.

Commission:

- `partnership_tier=standard` → platform 30% / teacher 70%
- `exclusive` → 15% / 85%

Refund student: trong 30 ngày **và** progress ≤ 10% **và** completed lessons ≤ 5. Revenue `PENDING` unlock khi hết điều kiện refund (`RevenueUnlockService`). Command `revenue:unlock-pending` **chưa schedule**.

### Phụ thuộc module (rút gọn)

```
Auth → role pivot
Course create → ChatConversation
Enrollment / paid Order → Enrollment + chat member + RevenueAllocation
Lesson complete → LessonCompletion → progress → refund window / certificate (Needs verification certificate issue path)
Quiz attach (capability_assessment | end_of_course | after_lesson | in_module)
Submit review → ContentVersion snapshot → ReviewSubmission → admin approve → course published
Teacher verification → TeacherCertificate evidence R2 → admin queue
```

---

## 4. API / route quan trọng

Prefix Laravel: `/api`. Health: `GET /up`.

Chi tiết đầy đủ: `website-MindNova-AI/routes/api.php`. Dưới đây là nhóm agent hay đụng.

### Public (throttle 30/1) — không token

| Method | Endpoint | Auth | Handler | Mục đích |
|---|---|---|---|---|
| POST | `/api/register` | none | `Api\Auth\AuthController@register` | Đăng ký, trả token |
| POST | `/api/login` | none | `login` | Token Sanctum |
| POST | `/api/forgot-password` | none | `forgotPassword` | OTP email, 60s cooldown, 5 phút |
| POST | `/api/forgot-password/verify-otp` | none | `verifyResetOtp` | |
| POST | `/api/reset-password` | none | `resetPassword` | |
| GET | `/api/auth/google` | none | `redirectToGoogle` | Socialite |
| GET | `/api/auth/google/callback` | none | `handleGoogleCallback` | Redirect FE (URL hardcoded localhost — xem limitations) |

### Payment IPN — public

| Method | Endpoint | Handler |
|---|---|---|
| GET | `/api/vnpay/ipn` | `Student\OrderController@vnpayIpn` |
| GET | `/api/student/payment/vnpay-ipn` | same |
| POST | `/api/student/payment/momo-ipn` | `momoIpn` |
| GET | `/api/student/payments/callback/{provider}` | `Student\PaymentController@callback` |

### Student routes **không** `auth:sanctum` trong `api.php` hiện tại

`/api/student/study-plan`, practice/progress/history overview, courses available/detail, course reviews GET, study-plan chat (throttle 10/1), onboarding, available-topics, analyze-lesson, self-assessment, **toàn bộ** `/api/student/practice/generate-ai-quiz` + history/submit/delete.

Đây là điểm dễ regression bảo mật. Student AI quiz fallback `userId = 201` nếu không có auth (`AiQuizGeneratorController`).

### Sanctum (mọi role đã login)

| Method | Endpoint | Handler | Mục đích |
|---|---|---|---|
| POST | `/api/logout` | AuthController | Xóa current token |
| POST | `/api/student/check-in` | StreakController | Streak |
| POST | `/api/ai-chat` | AiTutorController | Tutor |
| POST | `/api/realtime/send` | RealtimeController | |
| GET/POST | `/api/chat/...` | ChatController | conversations, messages, recall, read, unread-count |
| GET/POST | `/api/profile*` | Student\UserController | profile, password OTP, avatar |
| GET/POST | `/api/orders` | OrderController | list / checkout |
| POST | `/api/coupons/apply` | Student\CouponController | |
| GET | `/api/student/dashboard` | DashboardController | |
| GET | `/api/student/courses/enrolled` | CourseController | |
| GET/POST | refund eligibility / request | OrderController | |
| POST | `/api/student/ai-tutor/chat` | streamChat | |
| CUD | `/api/student/courses/{course}/reviews` | ReviewController | |
| GET/POST | course/lesson quiz + grade-essay | StudentQuizController | |
| GET/POST | lesson video-url, complete, check-answer | LessonController | |
| GET/PATCH/DELETE | notifications | NotificationController | |
| CRUD | lesson discussions | DiscussionController | |
| POST | `/api/broadcasting/auth` | framework | Echo |

### Instructor — `auth:sanctum` + `role:teacher` (alias instructor)

Prefix `/api/instructor`. Controllers: `app/Http/Controllers/Api/Instructor/`.

- `apiResource courses` + thumbnail, status, price, health, draft, draft-revisions
- modules CRUD + reorder-items
- lessons CRUD + video, video-url, content-media
- `POST/DELETE media/temp`
- lesson quiz CRUD
- students, export, analytics, AI notification, send notification
- `student-analytics/*`
- discussions + replies
- revenue overview/withdraw/transactions/sales-report/payout-methods
- orders, reviews
- `ai-quiz/*` generate/store/attach/set-active
- AI outline generate/save
- submit-review, versions, submissions, request-deletion
- profile, certificates, verification
- coupons CRUD + toggle

Ownership: teacher chỉ đụng course của mình (Policy + service).

### Admin — `auth:sanctum` + `role:admin`

Prefix `/api/admin`.

- users: list/store, patch role, lock/unlock, destroy, activity
- teacher-approvals / teachers verify/revoke, certificates approve/reject, evidence signed URL
- content overview/courses moderate/restore/delete, resources, question-bank
- analytics/dashboard, revenue
- `apiResource coupons`
- moderation flags, support tickets
- reviews queue: start/approve/reject/request-fixes/comments, deletion-requests, audit-log

**Không có** trong `api.php` dù docs/test có thể nhắc: `POST /api/admin/notifications/test-email`, `GET /api/admin/overview`, `GET /api/admin/courses`.

### Local/testing only

`POST /api/dev/orders/{orderId}/complete|refund` — Sanctum. FE checkout dev có thể gọi complete.

### Web (Blade)

`/` welcome; `/dashboard` admin → `FRONTEND_URL/admin`; `/client/dashboard` middleware `role:client` (không khớp seed `student` trừ legacy column). Không dùng cho SPA.

---

## 5. Database và data model

Nguồn schema: `website-MindNova-AI/database/migrations/`.  
`database.sql` là dump sớm (DB `du_an_tot_nghiep`, 2026-06-11) — thiếu chat, review workflow, revenue_allocations, R2 media, verification, … **Không migrate từ dump này.**

Không SoftDeletes trên model. `users.deleted_at` có thể tồn tại trên DB cũ nhưng User model không dùng.

### Identity

- `users`: status active/banned/inactive; `is_locked`; dual role (`users.role` + pivot `role_user`); `teacher_verification_status` none/pending/approved/rejected/revoked; onboarding JSON; `payout_info`
- `roles` / `permissions` / `role_user` / `permission_role` — permission **gần như không enforce** ở middleware
- Seed names: `admin`, `teacher`, `student`
- `user_profiles` 1:1
- `password_otps`

### Catalog

- `categories` (parent/children)
- `courses`: teacher_id, status machine, partnership_tier, flash sale, `lock_version`, `published_version_id`, `admin_hidden_at`
- `course_modules`, `lessons` (type video/article/quiz_module)
- `lesson_media` (R2, temp, idempotency)
- `lesson_completions` unique (user, lesson)
- `enrollments` — **không unique (user, course)** trong migration; model `$timestamps = false`
- `Course::classes()` trỏ `CourseClass` đã drop (`course_classes` bị cleanup 2026-09-02) — **gọi sẽ lỗi**

Course/lesson status (sau content-review migration):  
`draft` → `pending_review` → `under_review` → `approved` | `needs_fixes` | `rejected` → `published` (| `archived` course).

`isPublished()` = status published **và** có `published_version_id`.

### Quiz

- `quizzes` (lesson_id nullable = bank), type `normal` (1 credit) / `capability_assessment` (3)
- `questions` (multiple_choice/essay), `answers`
- `quiz_course_attachments` position: `end_of_course` | `in_module` | `after_lesson` | `capability_assessment`; `is_active`
- `user_quiz_attempts`, `user_quiz_attempt_answers`
- `ai_generated_quizzes` — JSON quiz student, tách khỏi `quizzes`

### Commerce

- `orders` payment_method ENUM `vnpay|momo|banking|free`; status pending/completed/failed/refunded; `transaction_id` unique
- `order_items`
- `payments` provider string (có thể zalopay); không trùng ENUM orders
- `coupons` type percent/fixed; instructor_id/course_id optional
- `subscriptions` — model có, `SubscriptionService` **rỗng**
- `reviews` unique (course, user)

### Instructor money / verification

- `teacher_verifications`, `teacher_certificates`, `teacher_certificate_evidences`, `teacher_credentials`, `teacher_verification_logs`
- `revenue_allocations` status PENDING → AVAILABLE → WITHDRAWING → WITHDRAWN | REFUNDED
- `instructor_transactions`, `withdrawals`, `teacher_payouts` (ledger cũ, admin revenue vẫn đọc)

### Chat / community

- `chat_conversations`, `chat_conversation_members` (không unique pair), `chat_messages` (`is_recalled`), `chat_attachments`
- `discussions` (open/answered/closed), `discussion_replies` (`is_best_answer`)

### Content review

- `content_versions` morph snapshot
- `draft_revisions` morph + `idempotency_key` + hash; conflict → `DraftConflictException`
- `review_submissions` pending/under_review/approved/rejected/needs_fixes
- `review_submission_items`, `review_comments`
- `deletion_requests` (lesson published không xóa thẳng)
- `content_audit_logs`

### AI / ops

- `ai_tutor_conversations`, `ai_tutor_messages`
- `ai_generation_logs`, `ai_usage_logs`, `ai_moderation_flags`
- `admin_settings` KV
- `activity_logs`, `admin_logs`
- `support_tickets`
- `notifications` (custom, cap 50/user — không phải Laravel notifications table)
- `certificates` unique (user, course) — chứng chỉ hoàn thành
- `user_streaks`

Tables migrated nhưng **không có model**: `knowledge_topics`, `user_topic_performance`. Dropped: `course_classes`, `ai_recommendations`.

### Seeders (`database/seeders/`)

`DatabaseSeeder` gọi: InstructorSeeder → SampleCourseSeeder → DiscussionSeeder → QuizAssessmentSeeder → StudentFlowTestSeeder.

- InstructorSeeder: roles + teacher/student demo (email trong seeder; password hash local — không dùng như secret production).
- QuizAssessmentSeeder: **xóa toàn bộ quizzes** rồi insert — nguy hiểm trên DB có data thật.
- DiscussionSeeder tìm `users.role = 'instructor'` — lệch seed `teacher` — có thể flaky.
- SampleCourseSeeder hard-code `versionable_id => 1`.

---

## 6. Auth, middleware, storage, queue, websocket, integrations

### Authentication

- API: Sanctum personal access token, `Authorization: Bearer`.
- Token expiration Sanctum config: null (không hết hạn trừ khi xóa).
- Web session Breeze song song — đừng lẫn với API token.
- FE cookie 8h hoặc 30d (remember-me).

### Authorization

- Middleware alias `role` = `CheckRole`: pivot + legacy `users.role`; alias teacher↔instructor, student↔learner.
- `RoleMiddleware.php` JSON duplicate — **không alias, không dùng**.
- `admin` middleware: `x-admin-secret` == `ADMIN_SECRET` **hoặc** `isAdmin()`. Alias **không gắn** lên group `/api/admin` (group dùng `role:admin`). Vẫn là backdoor nếu ai gắn `admin`.
- `client`: user không phải admin.
- Policies instructor ownership. **Không có** `role:student` trên `/api/student/*`.
- FE middleware: teacher bị nhốt `/instructor` trừ `?preview=true`. Student không vào instructor/admin. Admin không bị middleware chặn student URL (guard client đẩy về `/admin`).

### Storage

- Disk `r2` trong `config/filesystems.php` (`CLOUDFLARE_R2_*`).
- Lesson video / teacher evidence: signed URL (khoảng 1h / evidence 15 phút — xem service).
- Thumbnail: R2 nếu có key, else public disk.
- `app:cleanup-temp-media` daily: xóa media temp > 24h.
- Next `images.remotePatterns` allow Unsplash, localhost, hai host `*.r2.dev`.

### Queue / mail

- Default `QUEUE_CONNECTION=database`.
- `composer dev` chạy `queue:listen`.
- Queued: một số Notification (`StudentEnrolled`, `CoursePublished`, `NewReview`), mailable `AdminSystemNotificationMail`.
- Không có `app/Jobs/`.
- `NotificationService.php` **rỗng**.

### Websocket

- FE Echo broadcaster `reverb`, auth `/api/broadcasting/auth`.
- Env FE: `NEXT_PUBLIC_REVERB_APP_KEY|HOST|PORT|SCHEME` (default key `mindnova_chat_key`, host localhost, port 8080).
- BE: package `laravel/reverb` + pusher-php-server; `BROADCAST_CONNECTION=log` trong `.env.example`; **thiếu `config/broadcasting.php`** (chỉ `.bak`). Channels `notifications.{id}` và `realtime-messages` **chưa** khai báo trong `channels.php`.
- Echo client là singleton — đổi token sau login có thể cần reload.

### Third-party (tên env, không ghi giá trị)

Google OAuth, OpenAI, Gemini, Groq, Backup AI, VNPay, MoMo, Cloudflare R2, AWS S3, SMTP, Slack (stock Laravel), Reverb/Pusher (bak). ZaloPay class tồn tại, **không có** `services.zalopay`.

---

## 7. Environment, commands, dependencies đặc biệt

Không ghi secret. `.env` thật không được commit.

### Backend `website-MindNova-AI/.env.example`

`APP_*`, `DB_*` (mysql), `SESSION_*`, `BROADCAST_CONNECTION`, `FILESYSTEM_DISK`, `QUEUE_CONNECTION`, `CACHE_STORE`, Redis, `MAIL_*`, `AWS_*`, `CLOUDFLARE_R2_*`, `VNPAY_*`, `MOMO_*`, `OPENAI_*`, `GEMINI_*`, `GROQ_*`, `BACKUP_AI_PROVIDER`, `BACKUP_AI_MODEL`.

Dùng trong code nhưng **thiếu** trên example: `FRONTEND_URL`, `ADMIN_SECRET`, `GOOGLE_CLIENT_ID/SECRET/REDIRECT_URI`, `BACKUP_AI_API_KEY`, `MOMO_ENDPOINT`, `SANCTUM_STATEFUL_DOMAINS`, `REVERB_*`, `AI_FORCE_PRIMARY_FAILURE`, v.v.

### Frontend

Không có `.env.example`. Cần:

- `BACKEND_URL` — RSC apiClient, payment callback
- `NEXT_PUBLIC_API_URL` — axios, rewrite, Echo, adminApi
- `NEXT_PUBLIC_REVERB_*`, `NEXT_PUBLIC_ENABLE_PUSHER_LOGS`

Rewrite: `/api/:path*` → `${NEXT_PUBLIC_API_URL}/api/:path*`. Nếu `NEXT_PUBLIC_API_URL` đã có `/api` thì dễ double-prefix — interceptor/axios và apiClient có logic cắt `/api` lặp.

### Commands

Frontend (`mindnova-ai/`):

```bash
pnpm install
pnpm dev          # next dev --turbo
pnpm build
pnpm start
pnpm lint
pnpm test         # vitest run
pnpm test:watch
```

Backend:

```bash
composer install
cp .env.example .env && php artisan key:generate
php artisan migrate
php artisan db:seed          # destructive với QuizAssessmentSeeder
php artisan serve
php artisan queue:work       # hoặc queue:listen
php artisan test             # Pest
php artisan reverb:start     # Needs verification nếu config chưa publish
php artisan storage:link
```

Khác: `app:cleanup-temp-media` (scheduled), `revenue:unlock-pending`, `chat:fix-missing-members`, lệnh demo `demo:revenue3` / `mock:purchases` **phá data**.

`composer.json` script `dev`: serve + queue:listen + pail + vite (Blade), **không** thay Next.js.

Tests BE: Pest, MySQL `du_an_testing` (`phpunit.xml`).  
Tests FE: `palette.test.ts`, `LearningHistory.test.tsx`, `LessonContent.test.tsx` (placeholder). `next.config.ts` **`typescript.ignoreBuildErrors: true`**.

Dependencies đặc biệt: `james-heinrich/getid3` (duration video), `openai-php/laravel`, `league/flysystem-aws-s3-v3`, CKEditor 5, laravel-echo, jspdf (admin export). FE `graphql` / `react-hook-form` / `zod` **installed unused**.

---

## 8. Workflow, invariant, limitation, regression

### Business rules cần bảo vệ

1. Teacher không tự `published`. Phải content-review + `published_version_id`.
2. Không xóa course/lesson đã published (lesson → deletion request).
3. Không publish nếu CourseHealth `can_submit=false` (title ≥3, mô tả ≥30, thumbnail, ≥1 module, ≥1 lesson, giá hợp lệ, flash sale hợp lệ).
4. Ownership: instructor chỉ sửa course `teacher_id` của mình.
5. Enroll: không mua trùng (check enrollments trong `OrderController@store`).
6. Coupon: active, hạn, max_uses, khớp course/instructor.
7. Refund: 30 ngày + progress ≤10% + ≤5 lesson hoàn thành. Unlock revenue khi hết điều kiện.
8. Commission 30/70 vs 15/85 theo `partnership_tier`.
9. Optimistic lock draft: `lock_version` / `DraftConflictException`.
10. Chat member: course create + enrollment.
11. Locked user không login.
12. Role alias teacher/instructor phải giữ đồng bộ FE middleware, CheckRole, AuthShared.
13. UI: một palette Blue; destructive dùng `rose-*`; cấm `#C0392B` và họ hàng (`palette.ts`).

### Invariant kỹ thuật

- Dual auth storage: sửa login/logout phải set **cả** localStorage và cookie, không thì middleware lệch.
- Dual role storage: pivot + `users.role`. Đừng chỉ sửa một bên.
- Register `role_id` 2/3 phụ thuộc thứ tự seed — fragile.
- API student nhiều GET/AI **public** — đừng “fix” bằng cách giả định đã auth.
- `PaymentService` callback: nếu không resolve user thì fallback `User::first()` — nguy hiểm, đừng nhân rộng.
- Enrollment/chat member không unique DB — race có thể duplicate (code dùng `firstOrCreate` member).
- JSON response shape không thống nhất toàn API.

### Docs / code lệch

- `process.md` đánh dấu AI/revenue chưa xong — code đã có.
- `docs/admin-email-queue.md` endpoint không tồn tại.
- `docs/instructor-api.md` thiếu revenue/AI/verification/review; rule “teacher publish” cũ.
- `RoleAccessTest` có URL admin cũ.
- Blade `role:client` vs API `student`.

### Workarounds / TODO / limitation

- Không có TODO/FIXME đáng kể trong app PHP/TS.
- HistoryService có placeholder stats khi thiếu data.
- Student billing: `GET /api/orders` (auth). Certificates: `GET/POST /api/student/certificates` (auth, bảng `certificates`). Practice modules: `GET /api/student/practice/overview` field `modules_list`. AI quiz practice routes yêu cầu Sanctum, không fallback userId 201.
- Billing + certificates student: UI tĩnh.
- `/welcome`, `app/loading.tsx`, `app/not-found.tsx` stub.
- `ads-hourly` không gắn.
- Google icon trên login; **FE không có handler OAuth** (BE có).
- MoMo verify callback mỏng (`resultCode === 0`).
- ZaloPay chưa production-ready.
- `NotificationService` / `SubscriptionService` rỗng.
- Broadcast config chưa publish; realtime production **Needs verification**.
- `revenue:unlock-pending` phải chạy thủ công hoặc cron — chưa schedule.
- Seed/demo commands có thể wipe quiz/order.
- Admin analytics: README nói chưa nối đủ API.
- Vitest `LessonContent` test không cover hành vi lesson thật.

### Điểm dễ regression

- Đổi prefix `/api` hoặc `NEXT_PUBLIC_API_URL` có/không `/api` → double path.
- Đổi cookie name `accessToken`/`userRole`.
- Publish course bỏ review workflow.
- Sửa progress calculation → vỡ refund + revenue unlock.
- Xóa/sửa `Course::booted` / `Enrollment::booted` → chat vỡ.
- Gọi `Course::classes()`.
- QuizAssessmentSeeder trên DB không phải local.
- Palette: script `sync-student-blue.mjs` rewrite hex hàng loạt — chạy có chủ đích.
- `ignoreBuildErrors: true` che lỗi TS.
- Dev complete-order chỉ local/testing — đừng để lọt production.

---

## 9. UI / design (FE)

Nguồn: `mindnova-ai/DESIGN.md`, `src/shared/theme/palette.ts`, `src/shared/styles/globals.css`.

- Primary `#3B82F6`, hover `#2563EB`, deep `#1D4ED8`, soft `#EFF6FF`, tint `#DBEAFE`, mid `#60A5FA`.
- Font: Source Sans 3. Admin chrome được phép Sora/Space Grotesk.
- Icon: Lucide, không dingbat/emoji hardcode.
- Checklist kỹ thuật FE: `mindnova-ai/checklist.md` (App Router, feature folder, RSC-first) — code thực tế nhiều `"use client"` và `any`.

---

## 10. Unknown / Needs verification

Các mục sau **không khẳng định** cho đến khi đọc thêm hoặc chạy môi trường:

- Production `DB_*`, Reverb host, queue worker, cron `revenue:unlock-pending` có chạy không.
- Role id thật trên DB production vs hardcoded 2/3.
- `config/broadcasting.php` có được publish lúc deploy không.
- Certificate: student claim khi enrollment `completed` hoặc `progress_percentage >= 100`; chưa generate PDF (`certificate_url` có thể null).
- Admin overview stats lấy từ `GET /api/admin/overview`; hero UI dùng 3 stat đầu.
- Google OAuth redirect production (code callback có hardcoded `http://localhost:3000/login-success?token=`).
- ZaloPay có dùng ở môi trường nào không (không có route).
- Coverage test Pest hiện tại pass/fail trên máy này — chưa chạy trong task này.
- `database.sql` có được team nào còn import không — không nên.

---

## 11. Việc không làm khi “chỉ sửa docs”

Task tạo file này không được sửa business logic, UI, API, database. Chỉ cập nhật `AGENTS.md`.
