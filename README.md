# MindNova AI

Nền tảng học trực tuyến tiếng Việt: học viên mua và học khóa, giảng viên tạo nội dung, admin duyệt user / khóa / payout. Có AI tutor, quiz, study plan.

Product UI là **Next.js**, không phải Blade. Laravel chỉ là API (`/api/*`).

Repo: https://github.com/NgocPhong1609/website-ai.git

```
Browser  :3000   mindnova-ai/                 Next.js 16 + React 19
    │
    └── /api/*  →  :8000   website-MindNova-AI/   Laravel (PHP 8.3) + MySQL
```

Chi tiết kiến trúc: `AGENTS.md`, `PROJECT_CONTEXT.md`, `mindnova-ai/DESIGN.md`, `wiki/Home.md`.

## Yêu cầu máy

Đã đối chiếu với `composer.json`, `package.json`, `.env.example` trên nhánh `main`:

- Git
- PHP **8.3+** với: `pdo_mysql`, `mbstring`, `openssl`, `tokenizer`, `xml`, `ctype`, `json`, `fileinfo`, `curl`
- Composer 2
- MySQL 8 (hoặc MariaDB tương đương). Default trong config nếu thiếu env là sqlite — **local chuẩn dùng MySQL**
- Node.js **20.9+** (Next.js 16.2)
- pnpm (frontend có `pnpm-lock.yaml`, không dùng npm/yarn)
- Không bắt buộc Redis: cache/session/queue default là `database`

## Cài đặt local

### 1. Clone

```bash
git clone https://github.com/NgocPhong1609/website-ai.git
cd website-ai
```

Không import `database.sql` để cài. File đó là dump cấu trúc; schema chuẩn đi từ `website-MindNova-AI/database/migrations/`.

### 2. Backend (Laravel, port 8000)

```bash
cd website-MindNova-AI
composer install
cp .env.example .env
php artisan key:generate
```

Tạo database rồi sửa `DB_*` trong `.env` cho khớp user MySQL của máy:

```sql
CREATE DATABASE du_an CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Các giá trị local bắt buộc (đã để sẵn trong `.env.example`):

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

`SESSION_DRIVER`, `CACHE_STORE`, `QUEUE_CONNECTION` để `database` như `.env.example`. Không đổi sang sqlite trừ khi biết mình đang làm gì.

```bash
php artisan migrate
php artisan db:seed
php artisan storage:link
php artisan serve --host=127.0.0.1 --port=8000
```

Kiểm tra: http://127.0.0.1:8000 phải lên Laravel. API prefix là `/api`.

Terminal riêng nếu cần queue (mail OTP, job):

```bash
php artisan queue:listen --tries=1 --timeout=0
```

Không chạy `composer run dev` để dùng product. Script đó mở Vite/Blade legacy + `pail`, dễ trùng port với Next.js.

### 3. Frontend (Next.js, port 3000)

Mở terminal mới từ root repo:

```bash
cd mindnova-ai
pnpm install
cp .env.example .env.local
pnpm dev
```

`.env.local` (không commit):

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
BACKEND_URL=http://127.0.0.1:8000
NEXT_PUBLIC_REVERB_HOST=localhost
NEXT_PUBLIC_REVERB_PORT=8080
NEXT_PUBLIC_REVERB_APP_KEY=mindnova_chat_key
NEXT_PUBLIC_REVERB_SCHEME=http
```

Mở http://localhost:3000

`next.config.ts` rewrite `/api/:path*` → Laravel. Callback thanh toán RSC đọc `BACKEND_URL`. Axios browser đọc `NEXT_PUBLIC_API_URL`; để trống sẽ dùng proxy cùng origin. `BACKEND_URL` mặc định local là `http://127.0.0.1:8000`.

Đăng ký nằm ở `/login?mode=register` (không có page `/register`).

## Tài khoản sau `db:seed`

Từ `database/seeders/InstructorSeeder.php` và `StudentFlowTestSeeder.php`. Mật khẩu seed chỉ dùng local.

Giảng viên (password: `password`):

- `teacher@mindnova.ai`
- `alex.teacher@mindnova.ai`

Học viên (password: `password`):

- `hieu.student@mindnova.ai`
- `long.student@mindnova.ai`
- `anh.student@mindnova.ai`

Học viên kịch bản test (password: `password123`):

- `student.empty@mindnova.com`
- `student.progress@mindnova.com`
- `student.completed@mindnova.com`

Seeder **không tạo tài khoản admin**. Role `admin` có trong bảng `roles`, nhưng không có user gắn sẵn.

## Biến tùy chọn (không cần để boot app)

Để trống thì app vẫn chạy; thiếu key thì từng chức năng đó tắt/lỗi.

- AI: `GEMINI_API_KEY`, `GROQ_API_KEY`, `OPENAI_API_KEY` (Gemini primary, Groq tutor/quiz, OpenAI backup)
- Thanh toán sandbox: `VNPAY_TMN_CODE`, `VNPAY_HASH_SECRET`, `MOMO_PARTNER_CODE`, `MOMO_ACCESS_KEY`, `MOMO_SECRET_KEY`
- Video/media cloud: `CLOUDFLARE_R2_*` — default `FILESYSTEM_DISK=local`
- Mail OTP quên mật khẩu: `MAIL_*` (`.env.example` đang trỏ SMTP Gmail)
- Google login: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI` — callback quay về `${FRONTEND_URL}/login-success`

Return URL VNPay/MoMo dùng `${FRONTEND_URL}/payment/callback`; cấu hình domain/cổng bằng env backend.

## Realtime chat

FE Echo/Reverb đọc `NEXT_PUBLIC_REVERB_*` (default host `localhost`, port `8080`, key `mindnova_chat_key`).

Trên `main` hiện **chưa chạy được chat realtime nếu chỉ copy env**:

- `config/broadcasting.php` không có, chỉ còn `config/broadcasting.php.bak`
- `.env.example` để `BROADCAST_CONNECTION=log`

Học bài / REST API không phụ thuộc Reverb.

## Test

Frontend:

```bash
cd mindnova-ai
pnpm test
```

Backend (Pest). `phpunit.xml` trỏ MySQL database `du_an_testing` — tạo DB này trước:

```sql
CREATE DATABASE du_an_testing CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

```bash
cd website-MindNova-AI
php artisan test
```

## Git (làm việc nhóm)

Làm trên branch riêng, không commit thẳng lên `main` trừ khi được giao rõ.

```bash
git checkout main
git pull origin main
git checkout -b feature/[ten-thanh-vien]
# ... commit
git push origin feature/[ten-thanh-vien]
```

Mở Pull Request: base `main` ← compare `feature/[ten-thanh-vien]`.

Cập nhật từ `main`:

```bash
git checkout main
git pull origin main
git checkout feature/[ten-branch]
git merge main
```

Không commit file `.env`, `.env.local`, hay service-account JSON.


## Cấu hình local và deploy

Các URL ứng dụng nằm trong biến môi trường; không sửa domain trong source để chuyển môi trường.
Xem [hướng dẫn cấu hình kết nối](docs/environment-urls.md) cho frontend local dùng backend Railway,
Vercel, callback đăng nhập/thanh toán và WebSocket.

Thông báo lỗi frontend dùng bộ xử lý chung; xem [quy ước và kiểm thử thông báo lỗi](docs/user-error-messages.md).
