# MindNova AI — Backend (Laravel 13)

API cho student, instructor, admin. Product UI là Next.js ở `../mindnova-ai` (`:3000`). Hướng dẫn đầy đủ (clone → FE + BE) nằm ở [README gốc](../README.md).

## Yêu cầu

Đối chiếu `composer.json` / `composer.lock`:

- PHP `^8.3` với `pdo_mysql`, `mbstring`, `openssl`, `tokenizer`, `xml`, `ctype`, `json`, `fileinfo`, `curl` (Laravel còn dùng `dom`, `filter`, `hash`, `pcre`, `session`)
- Composer 2
- MySQL 8 hoặc MariaDB. Config default nếu thiếu env là sqlite — local chuẩn dùng MySQL
- Redis không bắt buộc: `.env.example` để cache/session/queue = `database`

## Cài backend

Từ root repo:

```bash
cd website-MindNova-AI
composer install
cp .env.example .env
php artisan key:generate
```

Tạo DB rồi khớp `DB_*`:

```sql
CREATE DATABASE du_an CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

`.env` local tối thiểu (đã có trong `.env.example`):

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

`APP_URL` dùng `127.0.0.1:8000` cho khớp `php artisan serve` và fallback frontend (`NEXT_PUBLIC_API_URL` / `BACKEND_URL`).

```bash
php artisan migrate
php artisan db:seed
php artisan storage:link
php artisan serve --host=127.0.0.1 --port=8000
```

API: http://127.0.0.1:8000/api

Không import `../database.sql` để cài. Schema đi từ `database/migrations/`.

Queue (mail OTP, job) — terminal riêng:

```bash
php artisan queue:listen --tries=1 --timeout=0
```

Không dùng `composer run dev` cho product UI (script đó chạy Vite/Blade legacy).

## Tài khoản seed

Từ `database/seeders/InstructorSeeder.php` (password `password`):

- `teacher@mindnova.ai`
- `hieu.student@mindnova.ai`

Seeder không tạo user admin.

## Frontend

```bash
cd ../mindnova-ai
pnpm install
cp .env.example .env.local
pnpm dev
```

`.env.local`: `NEXT_PUBLIC_API_URL=http://127.0.0.1:8000`, `BACKEND_URL=http://127.0.0.1:8000`. App: http://localhost:3000

## Test

`phpunit.xml` dùng MySQL `du_an_testing` — tạo DB này trước:

```sql
CREATE DATABASE du_an_testing CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

```bash
php artisan test
```

## Realtime

`php artisan reverb:start` **chưa dùng được trên main**: `config/broadcasting.php` chỉ còn `.bak`, `.env.example` để `BROADCAST_CONNECTION=log`. REST API vẫn chạy thiếu Reverb.

## Cấu trúc

- `app/Http/Controllers/Api/` — Auth, Student, Instructor, Admin, Chat
- `app/Services/` — business logic
- `app/Models/`
- `routes/api.php`
- `database/migrations/`
