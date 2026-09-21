# Changelog

Tất cả các thay đổi có ý nghĩa đối với dự án MindNova AI sẽ được ghi nhận chi tiết tại file này theo quy chuẩn bắt buộc của dự án. Không được xóa hoặc ghi đè lịch sử cũ.

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
