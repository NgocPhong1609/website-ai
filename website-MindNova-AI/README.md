# MindNova AI - Backend Service (Laravel 13)

Nền tảng API Service cho hệ thống **MindNova AI** (Student + Instructor + Admin).

---

## 1. Yêu cầu môi trường (Prerequisites)

Trước khi bắt đầu, hãy đảm bảo máy tính của bạn đã cài đặt các công cụ sau:

- **PHP**: `>= 8.3` (Yêu cầu các extension: `pdo_mysql`, `mbstring`, `openssl`, `bcmath`, `curl`, `gd`, `fileinfo`)
- **Composer**: `>= 2.x`
- **Database**: MySQL `>= 8.0` hoặc MariaDB (Khuyên dùng Laragon, XAMPP hoặc Docker)
- **Node.js**: `>= 20.x` & **PNPM** (đối với Frontend Next.js)

---

## 2. Hướng dẫn cài đặt từng bước (Setup Guide)

### Bước 1: Clone dự án từ GitHub

```bash
git clone https://github.com/NgocPhong1609/website-ai.git
cd website-ai
```

### Bước 2: Chuyển vào thư mục Backend

```bash
cd website-MindNova-AI
```

### Bước 3: Cài đặt các thư viện PHP (Composer)

```bash
composer install
```

> **Lưu ý trên Windows**: Nếu gặp lỗi `Resource temporarily unavailable` hoặc lock file `vendor/composer/installed.php`, hãy tắt các tiến trình PHP/Artisan server đang chạy ngầm rồi thử lại.

### Bước 4: Cấu hình tệp môi trường (`.env`)

Tạo file `.env` từ file mẫu `.env.example`:

```bash
# บน Windows PowerShell
copy .env.example .env

# Hoặc trên Bash / Linux / macOS
cp .env.example .env
```

Mở tệp `.env` và cập nhật thông tin kết nối Database của bạn:

```env
APP_NAME="MindNova AI"
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=du_an
DB_USERNAME=root
DB_PASSWORD=your_mysql_password
```

### Bước 5: Khởi tạo Application Key

```bash
php artisan key:generate
```

### Bước 6: Chạy Database Migrations và Seeder

Tạo cơ sở dữ liệu (ví dụ tên DB `du_an` trong MySQL) trước khi chạy lệnh:

```bash
# Chạy migration tạo toàn bộ bảng database
php artisan migrate

# (Tùy chọn) Nạp dữ liệu mẫu thử nghiệm (Seeders)
php artisan db:seed
```

### Bước 7: Tạo symbolic link cho bộ nhớ Storage

```bash
php artisan storage:link
```

### Bước 8: Khởi chạy Backend Server

```bash
php artisan serve
```

Server Backend Laravel sẽ hoạt động tại địa chỉ: `http://127.0.0.1:8000`

---

## 3. Khởi chạy hệ thống Frontend (Next.js)

Để giao diện web hiển thị đầy đủ, khởi chạy ứng dụng Frontend `mindnova-ai`:

```bash
# Mở một cửa sổ Terminal mới tại thư mục gốc dự án website-ai
cd mindnova-ai

# Cài đặt thư viện frontend
pnpm install

# Khởi chạy Frontend Dev Server
pnpm dev
```

Frontend Next.js sẽ hoạt động tại địa chỉ: `http://localhost:3000`

---

## 4. Kiểm thử & Các lệnh thường dùng

### Chạy kiểm thử (Automated Tests - Pest)

```bash
php artisan test
```

### Xóa Cache hệ thống khi thay đổi `.env` hoặc Config

```bash
php artisan config:clear
php artisan route:clear
php artisan cache:clear
```

### Khởi chạy Queue Worker (Xử lý tác vụ ngầm như Email, AI)

```bash
php artisan queue:work
```

### Khởi chạy Reverb WebSocket Server (Chat Realtime)

```bash
php artisan reverb:start
```

---

## 5. Cấu trúc dự án Backend chính

- `app/Http/Controllers/Api/`: Các API Controllers cho Auth, Student, Instructor, Admin, Chat.
- `app/Services/`: Xử lý Business Logic chính (AI Router, Thanh toán VNPay/MoMo, Doanh thu, Content Review).
- `app/Models/`: Danh sách các Eloquent Models.
- `routes/api.php`: Định nghĩa toàn bộ RESTful API endpoints.
- `database/migrations/`: Nguồn quản lý cấu trúc cơ sở dữ liệu (~99 migrations).
