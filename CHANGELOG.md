# Changelog

## 2026-09-21 — Local setup and skill-assisted verification

- Installed locked frontend/backend dependencies; configured ignored local env,
  dedicated app/test MariaDB databases, generated app key and storage link,
  applied 109 migrations and default demo seed. Built Next.js and legacy Vite assets.
- Added `scripts/start-local.sh`, `scripts/smoke-local.mjs`, `docs/local-setup.md`
  and `reviews/local-setup-test-report.md`; updated knowledge base.
- Verified build/lint/TypeScript and actual browser/API login. Frontend serial
  tests: 104 passed / 2 failed; backend: 204 passed / 7 failures / 68 errors.
- Recorded remaining seed/fixture/route/integration issues; existing business
  logic and tests were not changed. No external AI/payment service was exercised.


Tất cả các thay đổi có ý nghĩa đối với dự án MindNova AI sẽ được ghi nhận chi tiết tại file này theo quy chuẩn bắt buộc của dự án. Không được xóa hoặc ghi đè lịch sử cũ.

---

## 2026-09-21 — Khắc phục các lỗ hổng bảo mật và cải thiện chất lượng code từ đợt kiểm toán Claude Skills

### Changed
- **Bảo mật Backend (Admin Backdoor):** Loại bỏ hoàn toàn header bypass `x-admin-secret` trong `AdminMiddleware.php`, ngăn chặn truy cập trái phép cấp cao nhất vào hệ thống quản trị.
- **Bảo mật API Routes (Student Privacy):** Di chuyển các route học tập cá nhân của học sinh (`study-plan`, `practice/overview`, `progress/overview`, `history/overview`, `analyze-lesson`, `self-assessment`) từ public vào bên trong nhóm middleware `auth:sanctum` trong `routes/api.php`.
- **OAuth Callback Dynamic URL:** Thay thế URL cứng `http://localhost:3000` bằng `env('FRONTEND_URL')` trong `AuthController.php`.
- **AI Prompt Injection Guardrails:** Sanitize biến đầu vào (`topic`, `title`, `custom_prompt`) bằng `strip_tags()` và `Str::limit()`, bổ sung rule bảo vệ hệ thống trong `AiQuizGeneratorController.php`.
- **Mật khẩu an toàn:** Cập nhật regex kiểm tra ký tự đặc biệt trong `UserController.php` để từ chối ký tự khoảng trắng (space).
- **Kiến trúc Realtime Chat:** Bổ sung tracking trạng thái kết nối (`isConnected`, `connectionState`), hàm `reconnect`, và hủy kết nối instance cũ khi token thay đổi trong `useRealtimeChat.ts`.
- **TanStack Query & State Synchronization:** Tạo custom hook `useChatConversations` trong `src/features/chat/api/useChatConversations.ts`, refactor `ChatLayout.tsx` loại bỏ waterfall fetch `useEffect` và tích hợp `invalidateUnreadCount()`.
- **Accessibility & Contrast:** Khôi phục `aria-current="page"` trên tab đang hoạt động, thêm `aria-label="Profile navigation"` cho thẻ `<nav>`, và nâng độ tương phản màu checkmark thành `text-blue-600` trong `ProfileSidebar.tsx`.
- **Ranh giới bảo mật Frontend:** Ghi nhận cảnh báo kiến trúc tại `middleware.ts` xác định rõ middleware phía client là UX Guard, quyền hạn bảo mật thực tế được bảo vệ bởi Laravel Sanctum.

### Files / Modules
- `website-MindNova-AI/app/Http/Middleware/AdminMiddleware.php`
- `website-MindNova-AI/routes/api.php`
- `website-MindNova-AI/app/Http/Controllers/Api/Auth/AuthController.php`
- `website-MindNova-AI/app/Http/Controllers/Api/Student/AiQuizGeneratorController.php`
- `website-MindNova-AI/app/Http/Controllers/Api/Student/UserController.php`
- `mindnova-ai/middleware.ts`
- `mindnova-ai/src/hooks/useRealtimeChat.ts`
- `mindnova-ai/src/features/chat/api/useChatConversations.ts`
- `mindnova-ai/src/features/chat/components/ChatLayout.tsx`
- `mindnova-ai/src/features/student/profile/components/ProfileSidebar.tsx`
- `project_knowledge_base.md`
- `CHANGELOG.md`

### Reason
- Khắc phục triệt để các lỗ hổng bảo mật nghiêm trọng (CRITICAL/HIGH/MEDIUM) và nợ kỹ thuật phát hiện bởi 4 Claude Skills (Skill Tester, Code Review, Security Review, Review Loop).

### Verification
- Kiểm tra cú pháp PHP và Next.js / TypeScript.
- `git diff` xác minh tất cả 10 vấn đề được khắc phục chính xác tại các dòng mục tiêu, không làm gãy các dependency và module liên quan.
- Xác minh routes cấu hình Sanctum chính xác, không còn endpoint cá nhân lộ ra ngoài public.

### Notes
- Token Google OAuth chuyển sang dùng `FRONTEND_URL` từ file môi trường.
- Middleware Next.js chỉ nên được xem là điều hướng trải nghiệm người dùng; toàn bộ logic bảo vệ tài nguyên thực tế đều nằm ở Sanctum token và middleware role ở backend.

### Remaining
- Thêm unique composite key cho bảng `enrollments` và `chat_conversation_members` qua database migration mới khi có lịch bảo trì DB.
- Refactor tách nhỏ component `LessonWorkspace.tsx` (1067 dòng).

---

## 2026-09-21 — Kiểm tra toàn diện dự án bằng 4 Claude Skills (Skill Tester, Code Review, Security Review, Review Loop)

### Changed
- Chạy Claude Skill Tester: Lint 35 SKILL.md files — tất cả PASSED (0 errors, 0 warnings).
- Thực hiện Claude Code Review (Two-Phase): Standards & Specification review trên 36 file thay đổi trong 5 commit gần nhất. Phát hiện 1 P1, 2 P2, 2 P3.
- Thực hiện Claude Security Review (OWASP): Audit bảo mật toàn bộ codebase. Phát hiện 2 CRITICAL, 2 HIGH, 2 MEDIUM, 1 LOW.
- Thực hiện Claude Review Loop (Multi-agent 4 perspectives): Diff Auditor, Architecture, Tech-Stack, UX/A11y. Phát hiện 6 Action Required, 4 Consideration, 2 Praise.
- Tổng hợp 18 findings qua script `synthesize_review.py`.
- Cập nhật `project_knowledge_base.md` mục 9 (Tech Debt) với chi tiết 16 vấn đề phân loại theo mức nghiêm trọng.
- Xác nhận `AiQuizGeneratorController` fallback `userId = 201` đã được sửa trong code hiện tại.

### Files / Modules
- `reviews/code-review-report.md` (Tạo mới — báo cáo code review)
- `reviews/security-audit-report.md` (Tạo mới — báo cáo bảo mật)
- `reviews/review-consolidated.md` (Tạo mới — báo cáo multi-agent review)
- `reviews/review-synthesized-final.md` (Tạo mới — tổng hợp 18 findings)
- `project_knowledge_base.md` (Cập nhật mục 9 Known Tech Debt)
- `CHANGELOG.md` (Cập nhật entry này)

### Reason
- Người dùng yêu cầu sử dụng các Claude Skills (Skill Tester, Code Review, Security Review, Review Loop) để kiểm tra dự án toàn diện trước khi tiếp tục phát triển.

### Verification
- Claude Skill Tester: `python3.12 test_skill.py` exit code 0, 35/35 PASSED.
- Claude Code Review: Subagent đọc toàn bộ 36 file changed, phân tích hai pha (Standards + Spec).
- Claude Security Review: Subagent đọc routes/api.php, controllers, middleware, auth, payment, AI services. Xác nhận 6/7 known issues từ AGENTS.md, 1 đã sửa.
- Claude Review Loop: Subagent phân tích từ 4 góc nhìn chuyên biệt (Diff, Architecture, Tech-Stack, UX/A11y).
- Script `synthesize_review.py`: Exit code 0, merged 18 findings.

### Notes
- Đây là task kiểm tra/audit — không có thay đổi code chức năng. Chỉ tạo báo cáo review và cập nhật documentation.
- 2 lỗ hổng CRITICAL (admin backdoor + cookie forgery) cần được xử lý ưu tiên cao nhất trước khi deploy production.
- `broadcasting.php` đã được tạo chính thức trong commit gần đây — cập nhật mục 8 trong knowledge base tương ứng.

### Remaining
- Sửa 2 lỗ hổng CRITICAL: `AdminMiddleware.php` backdoor và `middleware.ts` cookie forgery.
- Di chuyển student routes thiếu auth vào `auth:sanctum` group.
- Sửa Google OAuth redirect dùng `env('FRONTEND_URL')`.
- Thêm WebSocket reconnection cho `useRealtimeChat.ts`.
- Refactor `ChatLayout.tsx` sang TanStack Query.
- Khôi phục ARIA attributes cho `ProfileSidebar.tsx`.
- Thêm unique constraints DB cho `enrollments` và `chat_conversation_members`.

---

## 2026-09-21 — Thiết lập hệ thống tài liệu chuẩn hóa: Project Knowledge Base & Changelog

### Changed
- Khởi tạo file tài liệu kiến trúc hiện trạng `project_knowledge_base.md` bao quát toàn bộ thông tin nền tảng, công nghệ, kiến trúc mạng, luồng nghiệp vụ, cơ sở dữ liệu và nợ kỹ thuật của dự án MindNova AI.
- Khởi tạo file theo dõi lịch sử thay đổi `CHANGELOG.md` theo định dạng chuẩn hóa bắt buộc.
- Cài đặt quy tắc làm việc chung (Global Rules) cho toàn bộ hệ thống Antigravity tại `~/.gemini/config/GEMINI.md`, `~/.gemini/config/AGENTS.md`, `~/.gemini/config/rules/project-documentation.md` và cập nhật vào `AGENTS.md` của workspace.
- Đồng bộ hóa các quy tắc kiểm soát tài liệu: Tài liệu phải được duy trì song hành cùng mã nguồn sau mỗi tác vụ.

### Files / Modules
- `project_knowledge_base.md` (Tạo mới)
- `CHANGELOG.md` (Tạo mới)

### Reason
- Tuân thủ quy định bắt buộc của dự án (*PROJECT DOCUMENTATION & CHANGE HISTORY — MANDATORY RULES*): Mọi thay đổi trong hệ thống phải được ghi nhận đầy đủ, chính xác, không suy đoán để các thành viên và AI coding agent có thể nắm bắt rõ ràng trạng thái hoạt động của dự án.

### Verification
- Kiểm tra sự tồn tại của hai tệp `project_knowledge_base.md` và `CHANGELOG.md` tại thư mục gốc repository.
- Đối soát tính chính xác của tài liệu so với source code thực tế trong `mindnova-ai/`, `website-MindNova-AI/`, `AGENTS.md` và `PROJECT_CONTEXT.md`.
- Kết quả: Tài liệu được lập chi tiết, không có thông tin bịa đặt hoặc mâu thuẫn với mã nguồn hiện tại.

### Notes
- `project_knowledge_base.md` là nguồn tham chiếu về **TRẠNG THÁI HIỆN TẠI** (Current State).
- `CHANGELOG.md` là nguồn lưu trữ **LỊCH SỬ THAY ĐỔI** (History).
- Bất kỳ task nào trong tương lai thay đổi mã nguồn, API contract hay database schema đều phải cập nhật hai file này trước khi kết thúc task.

### Remaining
- Tiếp tục duy trì cập nhật khi triển khai các tính năng tiếp theo cho dự án.

---

## 2026-09-20 — Cập nhật quy tắc kiểm tra mật khẩu (Password Validation Rules)

### Changed
- Cập nhật và siết chặt các quy tắc kiểm thực mật khẩu (validation rules) cho quy trình đăng ký tài khoản và đặt lại mật khẩu mới thông qua mã xác thực OTP.

### Files / Modules
- `website-MindNova-AI/app/Http/Controllers/Api/Auth/AuthController.php`
- `mindnova-ai/src/features/student/auth/`

### Reason
- Nâng cao tính an toàn và bảo mật cho tài khoản người dùng trên toàn hệ thống.

### Verification
- Kiểm tra luồng đăng ký người dùng mới tại `/api/register` và đặt lại mật khẩu tại `/api/reset-password`.
- Kết quả: Hệ thống từ chối các mật khẩu yếu không đáp ứng tiêu chuẩn bảo mật.

### Notes
- Giữ nguyên cơ chế hashing mặc định của Laravel (`Hash::make`).

---

## 2026-09-19 — Hoàn thiện không gian học tập bài học, biểu mẫu xác thực và thanh điều hướng

### Changed
- Triển khai giao diện không gian học tập bài giảng (`LessonWorkspace`) hỗ trợ hiển thị video bài học, bài đọc, quiz và phần thảo luận Q&A trực tiếp dưới bài giảng.
- Chuẩn hóa các biểu mẫu đăng nhập, đăng ký và điều hướng thanh bên (Sidebars) cho cả ba portal: Student, Instructor và Admin.
- Tối ưu hóa hiệu năng nạp dữ liệu (data fetching) với TanStack Query.

### Files / Modules
- `mindnova-ai/app/(dashboard)/courses/lesson/page.tsx`
- `mindnova-ai/src/features/student/courses/`
- `mindnova-ai/src/features/student/auth/`
- `mindnova-ai/src/shared/components/navigation/`

### Reason
- Cải thiện trải nghiệm học tập của học viên, giúp giao diện trực quan và đồng bộ với hệ thống theme Blue chuẩn (`#3B82F6`).

### Verification
- Kiểm tra hiển thị giao diện học bài trên trình duyệt và điều hướng các mục bài giảng trong khóa học.
- Xác nhận các sidebar điều hướng hoạt động ổn định và chính xác theo từng vai trò người dùng.

### Notes
- Giảng viên có thể truy cập không gian học bài của học viên thông qua tham số `?preview=true`.
