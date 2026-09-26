# Thông báo lỗi cho người dùng

Frontend dùng `src/shared/lib/user-error.ts` cho lỗi Axios, fetch và lỗi thông thường.

- `getErrorMessage(error, fallback)`: nhận nguyên lỗi để giữ thông tin HTTP/network; trả lời tiếng Việt, có hướng xử lý.
- `readApiResponse(response, fallback)`: kiểm tra HTTP trước khi hiển thị; xử lý được JSON, HTML từ proxy và phản hồi sai định dạng. Giữ HTTP status và lỗi từng trường trong `ApiError`.
- `getValidationErrors(error)`: giữ lỗi theo trường cho form, chuyển các thông báo validation thông dụng của Laravel sang tiếng Việt.
- `isUnauthorizedError(error)`: nhận diện lỗi đăng nhập bằng status hoặc tên lỗi khi React truyền lỗi server sang client ở development. Production có thể ẩn chi tiết lỗi server; lúc đó màn hình hiển thị thông báo chung và nút thử lại/đăng nhập.

Không đưa response body, SQL, stack trace, URL nội bộ, lỗi parse JSON hoặc mã lỗi provider vào thông báo người dùng.
Thông báo nghiệp vụ tiếng Việt rõ ràng (mã xác nhận hết hạn, tài khoản bị khóa, hết lượt AI...) được giữ nếu không chứa chi tiết kỹ thuật.
Thông báo gửi thành công không thay đổi; không tự retry request ghi dữ liệu/thanh toán.

Các điểm gọi hiện tại: đăng nhập/đăng ký/quên mật khẩu, quản trị, giảng viên, học viên, thanh toán/hoàn tiền,
điểm danh, gia sư AI, onboarding và error boundary. Onboarding lỗi sẽ hiển thị thông báo để người dùng thử lại,
thay vì chuyển về trang chủ mà không giải thích.

## Lỗi trong ảnh ngày 26/09/2026

`POST /api/forgot-password` trả HTTP 502 và `Application failed to respond`.
Đây là lỗi phản hồi của tầng backend/gateway; ảnh không đủ để khẳng định do mail, database hay tiến trình backend.
Kiểm tra sau đó: Railway `/up` trả 200; GET `/api/forgot-password` ở cả Railway và Vercel trả 405
(đúng vì route chỉ hỗ trợ POST), chứng minh proxy kết nối được tại thời điểm kiểm tra.
Không gửi email OTP thật để thử nghiệm. Cần log Railway đúng thời điểm lỗi để xác định nguyên nhân vận hành.
Bản sửa thông báo không tự khắc phục việc backend ngừng phản hồi.

## Kiểm thử

```bash
cd mindnova-ai
pnpm test src/shared/lib/__tests__/user-error.test.ts src/features/student/auth/components/__tests__/AuthErrors.test.tsx src/features/admin/lib/__tests__/admin-api.test.ts
pnpm exec tsc --noEmit
pnpm build
```

Test mô phỏng 400/401/403/404/409/413/422/429/5xx, timeout/mất kết nối, JSON/HTML,
validation, thử lại OTP và onboarding. Các lỗi test tồn tại trước đó ở quiz aliases, lịch sử học và màu tin nhắn
được báo riêng; không đổi logic sản phẩm để che lỗi test.

## Khôi phục mật khẩu: JSON validation (26/09/2026)

Cả ba POST `/api/forgot-password`, `/api/forgot-password/verify-otp`, `/api/reset-password`
gửi `Accept: application/json` cùng `Content-Type: application/json`. Khi validation thất bại,
Laravel trả JSON 422 để giao diện giữ người dùng ở bước hiện tại và hiển thị lỗi có thể sửa,
thay vì chuyển hướng sang HTML rồi báo `INVALID_RESPONSE`.

Lỗi trường email `The selected email is invalid.` được dịch thành email chưa được đăng ký,
kèm hướng dẫn dùng email đã đăng ký tài khoản. Lỗi email sai định dạng được giữ riêng.
Không thay đổi điều kiện xác thực, gửi mail hay cập nhật mật khẩu ở backend.

Regression: 5 test mới kiểm tra JSON negotiation ở từng bước, thông báo email chưa đăng ký,
và phân biệt lỗi email/field khác; thất bại trước sửa, đạt sau sửa. Bộ auth/error liên quan: 40 test đạt.

## Lưu ảnh tài liệu và SMTP Railway (26/09/2026)

- Migration `2026_09_26_170000_allow_unassigned_lesson_media` cho phép `lesson_media.lesson_id` null trước khi tạo bài; giữ foreign key và cascade khi đã gắn bài. Rollback từ chối chạy nếu còn media chưa gắn, tránh mất dữ liệu.
- Upload/move R2 trả false phải báo thất bại. Khi gắn nhiều ảnh, lưu URL đã chuyển thành công trước khi xử lý ảnh tiếp theo; lỗi một ảnh không làm hỏng URL ảnh trước, có thể thử lại trên bài hiện tại.
- Test `TemporaryLessonMediaTest`: tải ảnh, lưu/gắn bài, đọc lại URL lâu dài, cascade; thất bại lưu R2; thất bại move; lỗi giữa nhiều ảnh và retry.
- Backend Railway hiện dùng Hobby, Gmail SMTP 587; kiểm tra TCP từ container cho cả 587/465 đều timeout. Railway chỉ cho SMTP từ Pro: cần email HTTPS API hoặc nâng gói, không coi thay đổi thông báo/tăng timeout là sửa gửi mail. Chưa thay nhà cung cấp hoặc nâng gói.
