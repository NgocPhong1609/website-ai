# Kết nối theo môi trường

Frontend: `mindnova-ai/` (Next.js). Backend: `website-MindNova-AI/` (Laravel).
`.env.local` và `.env` không được commit. Không thay cấu hình lưu trữ bên thứ ba trong thay đổi này.

## Frontend local dùng backend Railway

Tạo `mindnova-ai/.env.local`:

```dotenv
BACKEND_URL=https://website-ai-production-086a.up.railway.app
NEXT_PUBLIC_API_URL=
# Điền thông số Reverb thực tế nếu sử dụng chat realtime:
NEXT_PUBLIC_REVERB_HOST=website-ai-production-086a.up.railway.app
NEXT_PUBLIC_REVERB_PORT=443
NEXT_PUBLIC_REVERB_SCHEME=https
NEXT_PUBLIC_REVERB_APP_KEY=<public-app-key-cua-Reverb>
```

Chạy `pnpm install --frozen-lockfile`, sau đó `pnpm dev` trong `mindnova-ai/`.
Không cần chạy Laravel local. HTTP API đi qua `/api` của Next.js, được chuyển tới `BACKEND_URL`.
WebSocket kết nối trực tiếp tới host Reverb; host API không nhất thiết là host WebSocket.
Ví dụ Railway trên giữ thông số host/cổng trước đây, không xác nhận dịch vụ Reverb đang hoạt động.

Mọi thao tác ghi vẫn dùng dữ liệu của backend Railway. Muốn dữ liệu thử nghiệm riêng cần backend staging.

## Vercel

Đặt `BACKEND_URL` tới backend thật. Để `NEXT_PUBLIC_API_URL` trống để dùng proxy hoặc đặt URL backend
nếu cần gọi trực tiếp. Khi gọi trực tiếp, cấu hình CORS backend phải cho phép domain frontend.
Cả hai biến chấp nhận URL gốc hoặc URL kết thúc `/api`; không thêm `/api` hai lần.
Đặt các `NEXT_PUBLIC_REVERB_*` theo dịch vụ WebSocket thực tế; source không còn ghi đè bằng host Railway.
Khởi động lại dev server sau khi thay env; trên Vercel cần build/deploy lại để cập nhật biến public.

## Laravel / Railway

```dotenv
APP_URL=https://website-ai-production-086a.up.railway.app
FRONTEND_URL=https://website-mindnova-ai.vercel.app
CORS_ALLOWED_ORIGINS=https://website-mindnova-ai.vercel.app,http://localhost:3000
```

`FRONTEND_URL` điều khiển nơi quay về sau Google login, thanh toán và chuyển hướng web admin.
`APP_URL` điều khiển URL backend, bao gồm callback MoMo. Các giá trị được đọc qua Laravel config
nên dùng được với `php artisan config:cache` (chạy lại sau khi đổi env).
Google OAuth vẫn cần `GOOGLE_REDIRECT_URI` đăng ký đúng tại Google; đây là callback về backend.

`CORS_ALLOWED_ORIGINS` là danh sách origin phân cách bằng dấu phẩy, gồm scheme, host, cổng nếu có;
không chứa path. Nếu không đặt, giữ danh sách tương thích cũ: `FRONTEND_URL` và các origin local.
Đặt rõ danh sách để thêm cổng local khác/IP LAN/domain preview hoặc loại bỏ các origin local.
CORS không phải cơ chế xác thực; quyền API tiếp tục do backend kiểm tra.

Một backend có một `FRONTEND_URL`: local và Vercel cùng dùng Railway thì callback đều quay về domain
đã cấu hình trên Railway. Bản sửa này không tự tin tưởng Origin/URL do client gửi để chọn nơi nhận token.
Muốn thử callback local độc lập, dùng backend staging có `FRONTEND_URL` local.

## Kiểm tra

```bash
cd mindnova-ai
pnpm test
pnpm build
```

```bash
cd website-MindNova-AI
composer install
vendor/bin/pest tests/Unit/EnvironmentUrlsTest.php
```

Test URL dùng các địa chỉ giả, không gửi dữ liệu tới production. Thay đổi không sửa DB schema.
