# MINDNOVA AI — PROJECT KNOWLEDGE BASE

> **Trạng thái tài liệu:** Nguồn thông tin chính thống phản ánh **TRẠNG THÁI HIỆN TẠI** của codebase.  
> **Cập nhật lần cuối:** 2026-09-21  
> **Đối chiếu thực tế từ:** Codebase `mindnova-ai/`, `website-MindNova-AI/`, migrations, package manifests, route definitions và `AGENTS.md`.

---

## 1. Tổng quan dự án (Project Overview)

### Local verification — 2026-09-21

Clone `313caaa` đã setup trên Ubuntu 24.04 với Node 22, PHP 8.3 và MariaDB 10.11.
Database local `website_ai_local` tách biệt test DB `website_ai_testing`; env files
không được track. 109 migrations và demo seed hoàn tất. Next.js build/lint/tsc
đều pass; kiểm thử frontend tuần tự 104/106 pass, backend 204/279 pass (7 failures,
68 errors). Đăng nhập học viên/giảng viên và API smoke pass. Seed còn thiếu role
cho ba tài khoản scenario, thiếu chat initialization và phần lớn lesson versions.
Hướng dẫn: `docs/local-setup.md`; bằng chứng và giới hạn: `reviews/local-setup-test-report.md`.
Khởi động local: `bash scripts/start-local.sh`; smoke: `node scripts/smoke-local.mjs`.


- **Tên sản phẩm:** MindNova AI
- **Loại hệ thống:** Nền tảng học trực tuyến (e-learning) tiếng Việt tích hợp gia sư AI thông minh (AI Tutor), tạo lộ trình học cá nhân hóa (AI Study Plan) và hệ thống tạo/chấm bài tập tự động (AI Quiz Generator).
- **Mô hình người dùng (3 vai trò chính):**
  1. **Học viên (Student):** Khám phá và mua khóa học, xem video/đọc bài/làm quiz, trao đổi thảo luận bài học, chat nhóm khóa học realtime, làm bài đánh giá năng lực, điểm danh streak, nhận chứng chỉ hoàn thành khóa.
  2. **Giảng viên (Teacher / Instructor):** Soạn thảo và quản lý khóa học (wizard 3 bước), tải tài liệu/video qua Cloudflare R2, quản lý bài tập, tạo quiz thủ công hoặc bằng AI, theo dõi học viên và phân tích tương tác, quản lý doanh thu hoa hồng và yêu cầu rút tiền, gửi hồ sơ xác minh giảng viên.
  3. **Quản trị viên (Admin):** Kiểm duyệt nội dung khóa học trước khi xuất bản (Content Review Workflow), phê duyệt xác minh giảng viên, quản lý tài khoản người dùng, giám sát báo cáo doanh thu & tỷ lệ hoa hồng, quản trị mã giảm giá (coupon), hỗ trợ và xử lý vi phạm nội dung.
- **Múi giờ hệ thống:** `Asia/Ho_Chi_Minh` (`website-MindNova-AI/config/app.php`).

---

## 2. Công nghệ sử dụng (Tech Stack)

### 2.1 Frontend (`mindnova-ai/`)
- **Framework:** Next.js **16.2.6** (App Router), React **19.2.4**, TypeScript (với `ignoreBuildErrors: true` trong `next.config.ts`).
- **Styling / UI Tokens:** Tailwind CSS **4**, bám sát token màu Blue (`#3B82F6` làm primary) quy định tại `DESIGN.md` và `src/shared/theme/palette.ts`. Cấm dùng lại theme đỏ cũ.
- **Icons:** `lucide-react` (độc quyền theo `DESIGN.md`).
- **Data Fetching / Server State:** TanStack Query v5 (`staleTime: 60s`).
- **Client State:** Zustand v5 (chỉ dùng cho 2 luồng: `onboarding` và `create-course` draft).
- **HTTP Clients:**
  - Browser Client: `axios` (`src/shared/lib/axios.ts`), ưu tiên token `localStorage`, fallback cookie.
  - Server Client (RSC): `fetch` wrapper (`src/shared/lib/api-client.ts`), đọc cookie `accessToken`.
- **Rich Text Editor:** CKEditor 5 classic (`@ckeditor/ckeditor5-react`).
- **Realtime Client:** `laravel-echo` + `pusher-js` (kết nối qua Reverb).
- **Biểu đồ & Tiện ích:** `recharts`, `react-hot-toast`, `jspdf`.
- **Package Manager:** `pnpm` (quản lý qua `pnpm-lock.yaml`).
- *Lưu ý phụ thuộc:* `graphql`, `graphql-request`, `react-hook-form`, `zod` có trong `package.json` nhưng **không import sử dụng** trong code `src/`.

### 2.2 Backend (`website-MindNova-AI/`)
- **Runtime & Framework:** PHP **8.3+**, Laravel **13.8+**.
- **Xác thực API (Auth):** Laravel Sanctum 4.x (Bearer Token không hết hạn trừ khi xóa hoặc đăng xuất).
- **OAuth:** Laravel Socialite (Google OAuth).
- **Cơ sở dữ liệu:** MySQL 8.x (mặc định môi trường chuẩn `.env.example`).
- **Queue / Session / Cache:** Driver `database` mặc định trong `.env.example`.
- **Realtime Server:** Laravel Reverb (`laravel/reverb`), Pusher server protocol.
- **Lưu trữ Cloud (Storage):** Cloudflare R2 (tương thích AWS S3 qua Flysystem S3 V3) phục vụ video bài giảng và bằng chứng xác minh giảng viên với Signed URLs.
- **Tích hợp AI Providers:**
  - *Primary AI Router:* Google Gemini API (`GeminiAiService`, `AiRouterService`).
  - *Fast / Tutor / Quiz:* Groq API (`GroqAiService` cho AI tutor, study plan, student quiz).
  - *Backup AI:* OpenAI / Groq fallback khi primary fail.
- **Cổng thanh toán:** VNPay (Sandbox HMAC-SHA512), MoMo (Sandbox `captureWallet` HMAC-SHA256).
- **Kiểm thử tự động:** Pest PHP v4.7 (`phpunit.xml` trỏ MySQL database `du_an_testing`).

---

## 3. Kiến trúc hệ thống (Architecture)

### 3.1 Mô hình giao tiếp mạng
```
Browser (:3000 - Next.js App Router)
  ├── Client axios  ──► NEXT_PUBLIC_API_URL (/api/...) ──► Laravel (:8000)
  ├── RSC apiClient ──► BACKEND_URL (/api/...)          ──► Laravel (:8000)
  ├── Rewrite proxy ──► Same-origin fetch("/api/...")  ──► Laravel (/api/...)
  └── Echo Client   ──► Reverb WebSocket (:8080)        ──► /api/broadcasting/auth

Laravel (:8000)
  routes/api.php ──► Middleware ──► Controller ──► Service ──► Eloquent Model ──► MySQL
```

### 3.2 Backend Pattern
- Hệ thống đi theo mô hình: **Request → Middleware → Controller → Service → Model/Resource**.
- Không có tầng Repository layer tổng quát (ngoại trừ một số helper như `CommissionSettingsRepository`).
- Định dạng JSON trả về cho Instructor thường tuân theo `App\Traits\ApiResponse` (`{ success, message, data }`). Định dạng của Auth, Student và Admin có thể khác nhau và cần đối soát từng endpoint.

### 3.3 Frontend HTTP & Token Handling
- Token lưu song song ở:
  1. `localStorage.accessToken`: Ưu tiên đọc ở browser client (axios interceptor).
  2. Cookie `accessToken` + `userRole`: Bắt buộc để Next.js `middleware.ts` thực hiện route-guard tại tầng server edge.
- Nếu nhận lỗi `401 Unauthorized`: Axios interceptor tự động dọn sạch token ở cả `localStorage` lẫn cookie và chuyển hướng về `/login`.

---

## 4. Cấu trúc thư mục (Directory Structure)

```
/
├── AGENTS.md                          # Hướng dẫn chi tiết cho AI coding agent
├── README.md                          # Hướng dẫn cài đặt local & workflow git
├── PROJECT_CONTEXT.md                 # Ngữ cảnh chi tiết đã đối soát từ codebase
├── project_knowledge_base.md          # Tài liệu hiện trạng kiến trúc (file này)
├── CHANGELOG.md                       # Lịch sử thay đổi hệ thống
├── database.sql                       # Dump cũ phpMyAdmin (KHÔNG dùng để migrate)
├── mindnova-ai/                       # Ứng dụng Frontend (Next.js)
│   ├── app/                           # App Router (layout, page theo nhóm role)
│   │   ├── (auth)/                    # login, forgot-password, welcome
│   │   ├── (dashboard)/               # Explore, courses, billing, checkout, practice, study-plan
│   │   ├── (instructor)/              # Portal giảng viên (courses, students, revenue, profile)
│   │   ├── (create-course)/           # Wizard tạo khóa học riêng biệt
│   │   ├── (onboarding)/              # Wizard khảo sát học viên
│   │   └── admin/                     # Portal quản trị viên
│   ├── middleware.ts                  # Route guard đọc cookie accessToken & userRole
│   ├── src/
│   │   ├── features/                  # Module chức năng tách bạch: student, instructor, admin, chat
│   │   ├── shared/                    # Theme palette, axios, api-client, UI kit, guards
│   │   └── hooks/                     # Custom React hooks (realtime chat, unread counts)
│   └── DESIGN.md                      # Quy chuẩn thiết kế, token màu sắc & typography
└── website-MindNova-AI/               # Ứng dụng Backend (Laravel)
    ├── app/
    │   ├── Http/Controllers/Api/      # Controllers phân chia theo Auth, Student, Instructor, Admin, Chat
    │   ├── Http/Middleware/           # CheckRole, admin secret guard, client guard
    │   ├── Http/Requests/Instructor/  # Form request validation cho giảng viên
    │   ├── Services/                  # Business logic (Course, Order, Payment, AI, Lesson, Review)
    │   ├── Models/                    # Eloquent models
    │   ├── Policies/                  # Course, Module, Lesson, Quiz ownership policies
    │   └── Events/                    # ChatMessageSent, ChatMessageRecalled, Broadcast events
    ├── database/
    │   ├── migrations/                # ~99 file migration — NGUỒN CHÍNH XÁC DUY NHẤT CỦA SCHEMA
    │   └── seeders/                   # InstructorSeeder, DiscussionSeeder, StudentFlowTestSeeder...
    └── routes/
        ├── api.php                    # REST API toàn bộ cho Next.js
        ├── channels.php               # Kênh xác thực riêng tư cho Laravel Echo
        └── console.php                # Lịch trình dọn dẹp temp media hàng ngày
```

---

## 5. Phân quyền và Vai trò (RBAC)

### 5.1 Lưu trữ vai trò
- Vai trò được lưu trữ chuẩn hóa qua 2 bảng: `roles` và bảng liên kết `role_user` (pivot). Cột `users.role` cũ không còn được sử dụng để ghi.
- Các role chuẩn trong seed: `admin` (ID 1), `teacher` (ID 2), `student` (ID 3).
- FE tự động chuẩn hóa vai trò (`AuthShared.ts`):
  - `admin`, `administrator`, `super_admin` → `admin`
  - `teacher`, `instructor`, `lecturer` → `instructor`
  - Còn lại → `student`

### 5.2 Ranh giới quyền hạn
- **Student:**
  - Truy cập toàn bộ portal học tập, khám phá khóa học.
  - Bị middleware FE chặn vào `/instructor/*` và `/admin/*`.
  - Backend: Nhóm `/api/student/*` xác thực Sanctum cho tác vụ cá nhân, nhưng một số route catalog/study-plan tổng quan là public.
- **Instructor (Teacher):**
  - Quản lý khóa học thuộc quyền sở hữu của mình (`teacher_id = auth()->id()`).
  - **Không có quyền tự xuất bản khóa học (Publish):** Khóa học phải qua quy trình nộp duyệt và được Admin phê duyệt.
  - Bị middleware FE giới hạn trong portal `/instructor/*` (ngoại trừ khi có tham số `?preview=true` để xem thử bài giảng học viên).
- **Admin:**
  - Toàn quyền phê duyệt nội dung (`published_version_id`), duyệt tài khoản giảng viên, quản lý người dùng, cài đặt hoa hồng và xử lý tranh chấp.
  - `AdminAuthGuard` trên FE chỉ kiểm tra sự tồn tại của token; việc chặn học viên/giảng viên vào `/admin` được thực thi ở Next.js `middleware.ts`.

---

## 6. Các luồng nghiệp vụ cốt lõi (Business Workflows)

### 6.1 Quy trình tạo và xuất bản khóa học (Content Review Workflow)
1. Giảng viên tạo bản nháp khóa học tại `/instructor/create-course` (lưu state qua Zustand `mindnova_course_draft`) → Lưu vào DB với status `draft`.
2. Tạo module, bài học (lesson video/article), tài liệu đính kèm và quiz. Khi khóa học được tạo, hệ thống tự động sinh `ChatConversation` loại `course`.
3. Kiểm tra điều kiện chất lượng (`CourseHealthService`): Tiêu đề ≥ 3 ký tự, mô tả ≥ 30 ký tự, có ảnh đại diện, có ít nhất 1 module và 1 bài học, định giá hợp lệ.
4. Giảng viên gửi yêu cầu duyệt (`POST /api/instructor/courses/{id}/submit-review`) từ trạng thái `draft`, `needs_fixes` hoặc `rejected`. Hệ thống đóng băng nội dung vào `content_versions` và tạo bản ghi `review_submissions`.
5. Quản trị viên bắt đầu duyệt (`under_review`):
   - Nếu đạt yêu cầu: Phê duyệt (`approved`) → Khóa học chuyển sang `published` kèm `published_version_id`.
   - Nếu chưa đạt: Yêu cầu sửa đổi (`needs_fixes`) kèm bình luận góp ý (`review_comments`), hoặc từ chối (`rejected`).
6. **Điều kiện hiển thị trên Catalog học viên:** Khóa học bắt buộc phải có `status = 'published'` **VÀ** `published_version_id IS NOT NULL`.

### 6.2 Quy trình mua khóa học và thanh toán (Checkout & Order)
1. Học viên chọn khóa học và cổng thanh toán (`vnpay`, `momo`, `banking`, `free`) tại `/checkout`.
2. Hệ thống tạo đơn hàng `orders` (trạng thái `pending`) và các `order_items`. Nếu có mã giảm giá hợp lệ, số lượt dùng `used_count` được tăng ngay khi tạo đơn.
3. Nếu tổng tiền bằng 0 hoặc hình thức `free`: Đơn hàng hoàn tất ngay lập tức (`completed`), học viên được ghi danh vào `enrollments` và thêm vào nhóm chat của khóa học.
4. Nếu chọn cổng thanh toán:
   - **VNPay:** Tạo URL thanh toán bảo mật với chữ ký HMAC-SHA512 qua sandbox VNPay.
   - **MoMo:** Gửi yêu cầu `captureWallet` với chữ ký HMAC-SHA256 đến MoMo Sandbox.
5. Khi nhận IPN hợp lệ từ cổng thanh toán:
   - Cập nhật đơn hàng thành `completed`.
   - Ghi danh học viên vào bảng `enrollments`.
   - Tự động thêm học viên vào thành viên cuộc trò chuyện khóa học (`chat_conversation_members`).
   - Tạo bản ghi phân bổ doanh thu (`revenue_allocations`) ở trạng thái `PENDING` với thời hạn bảo lưu 30 ngày (phục vụ chính sách hoàn tiền).

### 6.3 Phân chia hoa hồng (Commission Tiers)
- Thiết lập lưu tại `CommissionSettingsRepository` (`commission.tiers.v1`):
  - **Hạng Standard:** Nền tảng hưởng 30%, Giảng viên nhận 70%.
  - **Hạng Exclusive:** Nền tảng hưởng 15%, Giảng viên nhận 85%.

### 6.4 Chính sách hoàn tiền (Refund Policy)
- Học viên chỉ được yêu cầu hoàn tiền khi thỏa mãn đồng thời:
  1. Đơn hàng hoàn tất trong vòng không quá 30 ngày (`diffInDays <= 30`).
  2. Tiến độ học tập `progress_percentage <= 10%`.
  3. Số bài học đã hoàn thành `<= 5 bài`.
- Khi chấp thuận hoàn tiền: Hủy ghi danh khóa học, xóa khỏi nhóm chat, chuyển trạng thái doanh thu giảng viên thành `REFUNDED`. Hệ thống hiện xử lý đối soát nội bộ trong DB, **không gọi API hoàn tiền trực tiếp của cổng VNPay/MoMo**.
- Hết thời hạn 30 ngày không có hoàn tiền, khoản doanh thu sẽ được mở khóa từ `PENDING` sang `AVAILABLE` để giảng viên rút tiền.

### 6.5 Học bài và Cấp chứng chỉ (Learning & Certification)
- Khi học viên bấm hoàn thành bài học: Ghi nhận vào `lesson_completions` và tính lại % tiến độ của khóa.
- Khi tiến độ đạt 100%: Học viên được phép yêu cầu cấp chứng chỉ (`POST /api/student/certificates/claim`), ghi nhận bản ghi vào bảng `certificates`.

---

## 7. Các tích hợp ngoại vi (External Integrations)

| Dịch vụ | Mục đích trong hệ sinh thái MindNova AI | Trạng thái kỹ thuật |
| :--- | :--- | :--- |
| **Google Gemini API** | Sinh dàn ý khóa học, đề xuất quiz giảng viên, phân tích lộ trình học. | Primary AI Router (`GeminiAiService`) |
| **Groq API** | Xử lý gia sư AI streaming, phản hồi nhanh lộ trình học, quiz luyện tập học viên. | Hoạt động qua `GroqAiService` / HTTP client |
| **Cloudflare R2** | Lưu trữ video bài giảng, hình ảnh đính kèm, tài liệu xác minh giảng viên. | Disk `r2` (AWS S3 SDK), ký Signed URL bảo mật |
| **VNPay Sandbox** | Cổng thanh toán thẻ ATM / QR nội địa. | URL IPN công khai, xác thực chữ ký HMAC-SHA512 |
| **MoMo Sandbox** | Cổng thanh toán ví điện tử MoMo. | API `captureWallet`, xác thực chữ ký HMAC-SHA256 |
| **Google OAuth** | Đăng nhập bằng tài khoản Google. | Laravel Socialite stateless |
| **Laravel Reverb** | Máy chủ WebSocket phục vụ tin nhắn khóa học tức thì. | Đang sử dụng client Echo; BE cần file config broadcasting chuẩn |

---

## 8. Các ràng buộc kiến trúc bắt buộc (Constraints — KHÔNG ĐƯỢC PHÁ VỠ)

1. **Không import `database.sql` để thiết lập cơ sở dữ liệu:** File `database.sql` là bản sao lưu phpMyAdmin cũ (tháng 06/2026), thiếu rất nhiều bảng quan trọng (chat, review workflow, revenue allocations, r2 media, verification). Toàn bộ cấu trúc chuẩn phải chạy qua `php artisan migrate`.
2. **Giảng viên tuyệt đối không được tự ý đổi status khóa học sang `published`:** Mọi hành vi xuất bản khóa học bắt buộc phải qua Admin Content Review Workflow để gắn `published_version_id`.
3. **Không lưu trữ thông tin thẻ thanh toán thô (Raw Card Data):** Bảng `student_payment_methods` chỉ lưu thông tin số tài khoản / số ví người dùng tự nhập để nhận tiền/hoàn tiền; hệ thống không lưu CVV hay token hóa thẻ ngân hàng quốc tế.
4. **Không đưa lại bảng màu đỏ cũ (TeacherColor Red):** Toàn bộ giao diện Student, Instructor, Admin bắt buộc tuân theo bảng màu Blue chuẩn (`palette.ts`, primary `#3B82F6`).
5. **Đảm bảo backward compatibility cho API REST:** Client Next.js đang tiêu thụ các endpoint của Laravel theo đúng contract hiện tại; không tự ý đổi cấu trúc JSON response nếu không có yêu cầu rõ ràng.
6. **Bảo mật biến môi trường:** Không commit file `.env`, `.env.local`, API keys của Gemini/Groq hay credentials của cổng thanh toán lên kho chứa Git.

---

## 9. Vấn đề kỹ thuật tồn đọng & Nợ kỹ thuật đã biết (Known Tech Debt)

### 9.1 Lỗ hổng & rủi ro bảo mật còn tồn đọng (Cần tiếp tục cải tiến)

1. **Thiếu `role:student` middleware (CWE-285, CVSS 5.3):** Nhóm `/api/student/*` bên trong `auth:sanctum` chưa áp dụng middleware `role:student` nghiêm ngặt — hiện tại giáo viên/admin đăng nhập vẫn có thể gọi các API cá nhân của học sinh nếu controller không kiểm tra role riêng.
2. **Ký số Cookie Role trên Frontend (Khuyến nghị nâng cấp tương lai):** Dù `middleware.ts` đã được gắn cảnh báo bảo mật và hệ thống thực sự bảo vệ tài nguyên qua backend Sanctum, Next.js frontend nên chuyển sang dùng signed cookie/HMAC hoặc session token để hoàn toàn ngăn chặn việc đổi cookie phía client để xem giao diện admin giả lập.

### 9.2 Nợ kỹ thuật kiến trúc & hạ tầng

3. **Thiếu ràng buộc Unique ở tầng cơ sở dữ liệu:**
   - `enrollments`: Chưa có unique key cho cặp `(user_id, course_id)`.
   - `chat_conversation_members`: Chưa có unique key cho cặp `(conversation_id, user_id)`.
4. **Cấu hình phát sóng Realtime:** File `config/broadcasting.php` đã được tạo chính thức (không còn chỉ có `.bak`). Tuy nhiên `.env.example` mặc định `BROADCAST_CONNECTION=log` — cần đảm bảo cấu hình Reverb đúng trên production.
5. **Lệnh tự động mở khóa doanh thu:** Command `revenue:unlock-pending` đã được viết trong Service nhưng chưa được đăng ký trong Scheduler của `routes/console.php`.
6. **Next.js TypeScript Build Errors:** Cấu hình `next.config.ts` đang bật `ignoreBuildErrors: true`. Cần chuẩn hóa dứt điểm các lỗi type còn sót lại giữa các component.
7. **`LessonWorkspace.tsx` quá lớn (1067 dòng):** Vi phạm Single Responsibility Principle — nên tách thành `<VideoWorkspace />`, `<QuizWorkspace />`, `<DiscussionPanel />`.

### 9.3 Các vấn đề và lỗ hổng đã được khắc phục hoàn toàn (Resolved on 2026-09-21)

- **[CRITICAL] Xóa Admin Backdoor `x-admin-secret` (CWE-798, CVSS 9.8):** Đã loại bỏ hoàn toàn việc bypass bằng header bí mật trong `AdminMiddleware.php`. Chỉ tài khoản có `$user->isAdmin()` mới được cấp quyền.
- **[CRITICAL] Ranh giới bảo mật Frontend Middleware (CWE-807):** Bổ sung tài liệu cảnh báo kiến trúc tại `middleware.ts`, xác định rõ middleware frontend chỉ đóng vai trò UX Guard, toàn bộ bảo mật kiểm soát truy cập phân quyền thuộc trách nhiệm backend Laravel Sanctum và middleware `role:*`.
- **[HIGH] Bảo vệ các Route cá nhân của Học sinh (CWE-306, CVSS 7.5):** Di chuyển các route học tập cá nhân (`/study-plan`, `/practice/overview`, `/progress/overview`, `/history/overview`, `/analyze-lesson`, `/courses/{courseId}/self-assessment/generate`, `/self-assessment/submit`) từ public vào bên trong nhóm middleware `auth:sanctum`. Chỉ giữ public danh mục khóa học và onboarding sơ bộ.
- **[HIGH] Google OAuth Dynamic Redirect:** Thay thế URL cứng `http://localhost:3000` bằng `env('FRONTEND_URL')` trong `AuthController.php`.
- **[MEDIUM] Prompt Injection AI Quiz:** Đã sanitize đầu vào `topic`, `title`, `custom_prompt` bằng `strip_tags()` và `Str::limit()`, đồng thời bổ sung chỉ dẫn guardrail nghiêm cấm ghi đè cấu hình trong system prompt của `AiQuizGeneratorController.php`.
- **[P1] WebSocket Reconnection Strategy:** Nâng cấp `useRealtimeChat.ts` và `getEchoInstance`: bổ sung tracking trạng thái kết nối (`isConnected`, `connectionState`), hàm `reconnect`, và tự động hủy kết nối instance cũ khi token thay đổi để tránh stale auth token.
- **[ACTION REQUIRED] Password Validation Regex:** Khắc phục regex kiểm tra ký tự đặc biệt trong `UserController.php`, chuyển sang danh sách ký tự cụ thể `[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]` để từ chối ký tự khoảng trắng (space).
- **[ACTION REQUIRED] ChatLayout TanStack Query Refactor:** Tạo custom hook `useChatConversations` sử dụng `@tanstack/react-query` thay thế cho manual fetch trong `useEffect`, tích hợp cơ chế invalidation cho unread count.
- **[ACTION REQUIRED] ProfileSidebar Accessibility & Design Fix:** Khôi phục `aria-current="page"` trên tab đang hoạt động, thêm `aria-label="Profile navigation"` cho `<nav>`, nâng mức tương phản màu biểu tượng kiểm tra thành `text-blue-600` đạt chuẩn WCAG.
- **`AiQuizGeneratorController` fallback `userId = 201`:** Đã xác minh giải quyết dứt điểm — controller hiện tại lấy user ID qua authentication, không còn hardcoded fallback.
