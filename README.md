# 🧠 MindNova AI - Nền tảng học tập thông minh

> Backend: Laravel 13 | Frontend: NextJS | AI: Google Gemini

---

## 📋 Yêu cầu hệ thống

| Phần mềm | Phiên bản tối thiểu |
|---|---|
| PHP | 8.3+ |
| Composer | 2.x |
| MySQL | 8.0+ (hoặc MariaDB 10.5+) |
| Node.js | 18+ |
| Git | 2.x |

---

## 🚀 Hướng dẫn cài đặt (Setup từ đầu)

### Bước 1: Clone project

```bash
git clone https://github.com/NgocPhong1609/website-ai.git
cd website-ai
```

### Bước 2: Cài đặt Backend (Laravel)

```bash
# Di chuyển vào thư mục Laravel
cd website-MindNova-AI

# Cài đặt dependencies PHP
composer install

# Copy file cấu hình môi trường
cp .env.example .env

# Tạo application key
php artisan key:generate
```

### Bước 3: Cấu hình Database

Mở file `.env` và sửa thông tin database:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=NovaAI
DB_USERNAME=root
DB_PASSWORD=your_password_here
```

> ⚠️ **Tạo database trước**: Vào MySQL tạo database tên `NovaAI`
>
> ```sql
> CREATE DATABASE NovaAI CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
> ```

### Bước 4: Chạy Migration

```bash
php artisan migrate
```

Kết quả mong đợi — tạo thành công các bảng:
- `users`, `sessions`, `cache`, `jobs` (Laravel mặc định)
- `user_learning_profiles` (Onboarding)
- `user_progress` (Tiến độ học)
- `quiz_attempts` (Lịch sử quiz)
- `knowledge_gaps` (Chủ đề yếu)
- `learning_roadmaps` (Roadmap tổng)
- `roadmap_courses` (Course trong roadmap)

### Bước 5: Cấu hình Gemini AI (Tùy chọn)

Lấy API key từ [Google AI Studio](https://aistudio.google.com/apikey), sau đó thêm vào `.env`:

```env
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.0-flash
```

> 💡 **Không bắt buộc**: Nếu chưa có API key, hệ thống sẽ tự động dùng **rule-based fallback** thay vì Gemini.

### Bước 6: Tạo user test (Development)

```bash
php artisan tinker --execute="App\Models\User::create(['name'=>'Test User','email'=>'test@mindnova.ai','password'=>bcrypt('password123')]);"
```

### Bước 7: Chạy server

```bash
php artisan serve
```

Server chạy tại: **http://127.0.0.1:8000**

---

## 🧪 Test API

### Generate Roadmap

**Endpoint**: `POST http://127.0.0.1:8000/api/ai/generate-roadmap`

**Headers**: `Content-Type: application/json`

**Body**:
```json
{
    "goal": "fresher",
    "level": "beginner",
    "topics": ["dotnet", "php"]
}
```

**curl (PowerShell)**:
```powershell
curl -X POST http://127.0.0.1:8000/api/ai/generate-roadmap `
  -H "Content-Type: application/json" `
  -d '{"goal":"fresher","level":"beginner","topics":["dotnet","php"]}'
```

**curl (CMD / Git Bash)**:
```bash
curl -X POST http://127.0.0.1:8000/api/ai/generate-roadmap \
  -H "Content-Type: application/json" \
  -d '{"goal":"fresher","level":"beginner","topics":["dotnet","php"]}'
```

---

## 📁 Cấu trúc Project

```
website-ai/
├── planAI.md                          ← Operating memory cho AI module
├── README.md                          ← File này
└── website-MindNova-AI/               ← Laravel Backend
    ├── app/
    │   ├── Http/
    │   │   ├── Controllers/
    │   │   │   └── Api/
    │   │   │       └── RoadmapController.php
    │   │   └── Requests/
    │   │       └── GenerateRoadmapRequest.php
    │   ├── Models/
    │   │   ├── User.php
    │   │   ├── LearningRoadmap.php
    │   │   └── RoadmapCourse.php
    │   └── Services/
    │       ├── GeminiService.php
    │       └── RoadmapGeneratorService.php
    ├── database/
    │   └── migrations/                ← Database schema
    ├── routes/
    │   ├── web.php
    │   └── api.php                    ← API routes
    └── config/
        └── services.php               ← Gemini config
```

---

## 🔀 Hướng dẫn Git (Làm việc team)

### 1. Clone và tạo branch

```bash
git clone https://github.com/NgocPhong1609/website-ai.git
cd website-ai
git checkout -b feature/[ten-thanh-vien]
```

### 2. Commit và push

```bash
git add .
git commit -m "feat: mô tả thay đổi"
git push origin feature/[ten-branch]
```

### 3. Tạo Pull Request

- Vào GitHub → tab **Pull requests** → **New pull request**
- Base: `main` ← Compare: `feature/[ten-branch]`
- Nhập mô tả → **Create pull request**
- Chờ review và merge

### 4. Cập nhật code mới nhất

```bash
git checkout main
git pull origin main
git checkout feature/[ten-branch]
git merge main
```

---

## ⚠️ Quy tắc làm việc

- ✅ Mỗi thành viên chỉ làm trong module được giao
- ✅ Không sửa code module người khác
- ✅ Đọc `planAI.md` trước khi bắt đầu (module AI)
- ✅ Tạo migration MỚI, không sửa migration cũ
- ✅ Dùng Eloquent, không viết raw SQL
- ❌ Không push trực tiếp vào `main`
- ❌ Không tự thêm package (phải discuss với team)

---

## 📞 Troubleshooting

| Lỗi | Giải pháp |
|---|---|
| `SQLSTATE: Unknown database 'NovaAI'` | Tạo database trước: `CREATE DATABASE NovaAI;` |
| `No query results for model [User] 1` | Chưa có user, chạy Bước 6 tạo user test |
| `Gemini API key not configured` | Thêm `GEMINI_API_KEY` vào `.env` (hoặc dùng rule-based) |
| `composer: command not found` | Cài Composer: https://getcomposer.org |
| `php: command not found` | Cài PHP 8.3+: https://www.php.net/downloads |
| Port 8000 bị chiếm | `php artisan serve --port=8080` |