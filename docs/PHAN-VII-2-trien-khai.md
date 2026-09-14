# 2. Triển khai hệ thống

Nguồn: README.md nhánh `main` (repo `website-ai`). Product UI là Next.js; Laravel chỉ là API `/api/*`. Không import `database.sql` để cài — schema đi từ `website-MindNova-AI/database/migrations/`.

## 2.1 Mô tả chung về môi trường

Hệ thống MindNova AI chạy local bằng hai tiến trình:

- Frontend: `mindnova-ai/` — Next.js 16.2 + React 19, cổng **3000**
- Backend: `website-MindNova-AI/` — Laravel (PHP 8.3), cổng **8000**

Phần mềm cần thiết (đối chiếu `composer.json`, `package.json`, `.env.example`):

- Hệ điều hành: Windows (Laragon/XAMPP), macOS hoặc Linux
- Git
- PHP 8.3+ với extension: `pdo_mysql`, `mbstring`, `openssl`, `tokenizer`, `xml`, `ctype`, `json`, `fileinfo`, `curl`
- Composer 2
- MySQL 8 (hoặc MariaDB). phpMyAdmin chỉ là công cụ GUI, không bắt buộc
- Node.js 20.9+ (Next.js 16.2)
- pnpm (frontend khóa `pnpm-lock.yaml`, không dùng npm/yarn)
- Redis không bắt buộc: cache, session, queue mặc định là `database`

## 2.2 Cài đặt môi trường

### a. Cài đặt công cụ

Cài PHP 8.3, Composer, MySQL, Node.js 20.9+, pnpm, Git. Thêm PHP và Composer vào PATH. Kiểm tra:

```text
php -v
composer -V
node -v
pnpm -v
git --version
```

### b. Tạo cơ sở dữ liệu

Tạo database `du_an` (chạy app) và `du_an_testing` (Pest, khai báo trong `phpunit.xml`). Có thể dùng phpMyAdmin hoặc MySQL CLI:

```sql
CREATE DATABASE du_an CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE du_an_testing CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Hình 2.2. Tạo database `du_an` và `du_an_testing`

### c. Cấu hình file `.env`

Trong `website-MindNova-AI/`, copy `.env.example` thành `.env` rồi khớp MySQL máy local:

```env
APP_NAME="MindNova AI"
APP_URL=http://127.0.0.1:8000
FRONTEND_URL=http://localhost:3000
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=du_an
DB_USERNAME=root
DB_PASSWORD=
```

`SESSION_DRIVER`, `CACHE_STORE`, `QUEUE_CONNECTION` giữ `database` như `.env.example`. Không đổi sqlite trừ khi chủ đích.

Frontend tạo `mindnova-ai/.env.local` (không commit):

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
BACKEND_URL=http://127.0.0.1:8000
NEXT_PUBLIC_REVERB_HOST=localhost
NEXT_PUBLIC_REVERB_PORT=8080
NEXT_PUBLIC_REVERB_APP_KEY=mindnova_chat_key
NEXT_PUBLIC_REVERB_SCHEME=http
```

Các key AI, VNPay/MoMo, Cloudflare R2 để trống thì app vẫn boot; thiếu key thì đúng chức năng đó tắt/lỗi.

## 2.3 Cài đặt dự án

### a. Clone mã nguồn

```bash
git clone https://github.com/NgocPhong1609/website-ai.git
cd website-ai
```

Hình 2.3a. Clone repository `website-ai`

Thư mục chính: `mindnova-ai/` (Next.js), `website-MindNova-AI/` (Laravel).

### b. Cài package backend

```bash
cd website-MindNova-AI
composer install
copy .env.example .env
php artisan key:generate
```

Trên Linux/macOS dùng `cp .env.example .env` thay cho `copy`.

### c. Migration, seed, storage

```bash
php artisan migrate
php artisan db:seed
php artisan storage:link
```

Hình 2.3b. Cài backend Laravel: Composer, `.env`, migrate, seed

### d. Cài package frontend

Mở terminal mới từ root repo:

```bash
cd mindnova-ai
pnpm install
copy .env.example .env.local
```

Hình 2.3c. Cài frontend Next.js bằng pnpm

Không chạy `composer run dev` để dùng product — script đó mở Vite/Blade legacy, dễ trùng cổng với Next.js.

## 2.4 Khởi chạy ứng dụng

Terminal 1 — API Laravel:

```bash
cd website-MindNova-AI
php artisan serve --host=127.0.0.1 --port=8000
```

Hình 2.4a. Backend chạy tại http://127.0.0.1:8000

Terminal 2 — UI Next.js:

```bash
cd mindnova-ai
pnpm dev
```

Hình 2.4b. Frontend chạy tại http://localhost:3000

Truy cập:

- Giao diện: http://localhost:3000
- API: http://127.0.0.1:8000/api
- Đăng ký: `/login?mode=register` (không có page `/register`)

Tài khoản sau `db:seed` (chỉ dùng local):

- Giảng viên: `teacher@mindnova.ai` / `password`
- Học viên: `hieu.student@mindnova.ai` / `password`

Seeder không tạo tài khoản admin. Role `admin` có trong bảng `roles`.

Queue (mail OTP, job) — terminal riêng, không bắt buộc để mở UI:

```bash
php artisan queue:listen --tries=1 --timeout=0
```

Chat realtime trên `main` chưa chạy nếu chỉ copy env (`config/broadcasting.php` chỉ còn file `.bak`, `BROADCAST_CONNECTION=log`). Học bài và REST API không phụ thuộc Reverb.
