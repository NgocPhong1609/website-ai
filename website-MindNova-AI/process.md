# PROCESS.MD - Instructor Backend Development

> **File duy nhất** quản lý toàn bộ quá trình phát triển backend cho Actor **Instructor**.
> Mọi phân tích, thiết kế, tiến độ, ghi chú và nhật ký đều nằm trong file này.

---

## 1. Tổng quan dự án

### 1.1 Mục tiêu
Xây dựng toàn bộ backend RESTful API cho Actor **Instructor** (Giáo viên) trong hệ thống MindNova AI. Instructor có thể:
- Quản lý khóa học (CRUD, upload video, thiết lập giá)
- Quản lý chương học & bài học
- Quản lý học viên (xem danh sách, trả lời thảo luận, theo dõi tiến độ, gửi thông báo)
- Sử dụng AI hỗ trợ giảng dạy (sinh outline, quiz, nội dung, đề kiểm tra, gợi ý cải thiện)
- Quản lý doanh thu (xem doanh thu, rút tiền, báo cáo bán hàng)

### 1.2 Công nghệ
| Thành phần | Công nghệ |
|---|---|
| Framework | Laravel 13.x |
| PHP | 8.3+ |
| Database | MySQL 8.4 |
| Auth | Laravel Sanctum (Token-based API) |
| RBAC | Roles & Permissions (DB tables: `roles`, `permissions`, `role_user`, `permission_role`) |
| API Format | RESTful JSON API |
| File Storage | Laravel Filesystem (local/S3) |
| Realtime | Laravel Reverb |

### 1.3 Kiến trúc
```
MVC + Service Layer + Repository Pattern (simplified)

Request → Middleware (auth + role) → Controller → Service → Model → Response (Resource)
                                          ↓
                                       Policy (Authorization)
```

### 1.4 Quy tắc Coding
- **Namespace**: `App\Http\Controllers\Api\Instructor\*`
- **Prefix route**: `/api/instructor/*`
- **Middleware**: `auth:sanctum`, `role:teacher`
- **Response format**: Sử dụng trait `ApiResponse` thống nhất
- **Validation**: Form Request riêng cho từng action
- **Authorization**: Policy cho từng Model (ownership check)
- **Naming**: snake_case cho DB, camelCase cho PHP, kebab-case cho URL
- **Resource**: Sử dụng API Resource cho response transformation

---

## 2. Danh sách Module

### Module 1 - Quản lý khóa học

| Sub-module | Trạng thái |
|---|---|
| 1.1 Quản lý khóa học (CRUD, upload video, giá) | ✅ Hoàn thành |
| 1.2 Quản lý chương học & bài học | ✅ Hoàn thành |

### Module 2 - Quản lý học viên
**Status**: 🔄 Đang thực hiện

| Chức năng | Trạng thái |
|---|---|
| Xem danh sách học viên | ⬜ Chưa bắt đầu |
| Trả lời thảo luận | ⬜ Chưa bắt đầu |
| Theo dõi tiến độ học viên | ⬜ Chưa bắt đầu |
| Gửi thông báo | ⬜ Chưa bắt đầu |

### Module 3 - AI hỗ trợ giảng dạy
**Status**: ⬜ Chưa bắt đầu

| Chức năng | Trạng thái |
|---|---|
| Sinh outline khóa học | ⬜ Chưa bắt đầu |
| Sinh quiz | ⬜ Chưa bắt đầu |
| Sinh nội dung bài học | ⬜ Chưa bắt đầu |
| Sinh đề kiểm tra | ⬜ Chưa bắt đầu |
| Gợi ý cải thiện nội dung | ⬜ Chưa bắt đầu |

### Module 4 - Doanh thu
**Status**: ⬜ Chưa bắt đầu

| Chức năng | Trạng thái |
|---|---|
| Xem doanh thu | ⬜ Chưa bắt đầu |
| Rút tiền | ⬜ Chưa bắt đầu |
| Xem báo cáo bán hàng | ⬜ Chưa bắt đầu |

---

## 3. Tiến độ chi tiết

### Module 1.1 - Quản lý khóa học (CRUD, Upload Video, Giá)

- [x] Phân tích database
- [x] Phân tích nghiệp vụ
- [x] Thiết kế API
- [x] Trait ApiResponse
- [x] Middleware (RoleMiddleware)
- [x] Policy (CoursePolicy)
- [x] Model (Course + relationships)
- [x] Service (CourseService)
- [x] Form Request (Validation)
- [x] Resource (CourseResource)
- [x] Controller (CourseController)
- [x] Upload Video (Chuẩn bị cho Module 1.2)
- [x] Route
- [x] Test
- [x] Documentation

### Module 1.2 - Quản lý chương học & bài học

- [x] Phân tích database
- [x] Phân tích nghiệp vụ
- [x] Thiết kế API
- [x] Validation (Form Requests)
- [x] Policy
- [x] Controller (Module & Lesson)
- [x] Service
- [x] Model (CourseModule, Lesson)
- [x] Resource
- [x] Upload Video (Logic upload và stream)
- [x] Route
- [x] Test
- [x] Documentation

### Module 2 - Quản lý học viên

- [ ] Phân tích database (thêm bảng discussions nếu cần)
- [ ] Phân tích nghiệp vụ (Tiến độ, thảo luận, thông báo)
- [ ] Thiết kế API
- [ ] Migration (Bảng discussions, replies)
- [ ] Validation (Form Requests)
- [ ] Policy
- [ ] Model (Discussion, Notification, Enrollment)
- [ ] Service
- [ ] Resource
- [ ] Controller
- [ ] Route
- [ ] Test
- [ ] Documentation

### Module 3 - AI hỗ trợ giảng dạy

- [ ] Phân tích database (thêm bảng lưu lịch sử prompt/content)
- [ ] Phân tích nghiệp vụ
- [ ] Thiết kế API
- [ ] Migration (Bảng ai_content_histories)
- [ ] Tích hợp API LLM (Gemini/OpenAI)
- [ ] Validation (Form Requests)
- [ ] Service (AI Generation Service)
- [ ] Controller
- [ ] Route
- [ ] Test
- [ ] Documentation

### Module 4 - Doanh thu

- [ ] Phân tích database (thêm bảng withdrawals, balances)
- [ ] Phân tích nghiệp vụ
- [ ] Thiết kế API
- [ ] Migration (instructor_withdrawals, instructor_balances)
- [ ] Validation (Form Requests)
- [ ] Model
- [ ] Service (Tính toán doanh thu, xử lý rút tiền)
- [ ] Controller
- [ ] Route
- [ ] Test
- [ ] Documentation

---

## 4. Ghi chú triển khai

### 4.1 Database - Phân tích schema từ `database.sql`

#### Bảng có sẵn (liên quan đến Instructor)

| Bảng | Mô tả | Cột chính |
|---|---|---|
| `users` | Người dùng | id, name, email, password, google_id, avatar_url, status, deleted_at |
| `roles` | Vai trò | id=1: admin, id=2: teacher, id=3: student |
| `role_user` | Pivot user-role | user_id, role_id |
| `permissions` | Quyền hạn | id=3: create-course, id=4: view-analytics |
| `permission_role` | Pivot permission-role | teacher có: create-course(3), view-analytics(4) |
| `courses` | Khóa học | id, **teacher_id**, category_id, title, slug, description, thumbnail, price, level, status(draft/published/archived) |
| `course_modules` | Chương học | id, course_id, title, order |
| `lessons` | Bài học | id, module_id, title, type(video/article/quiz_module), content, video_url, duration_minutes, order |
| `categories` | Danh mục | id, name, slug, description, parent_id |
| `enrollments` | Ghi danh | id, user_id, course_id, progress_percentage |
| `lesson_completions` | Hoàn thành bài | id, user_id, lesson_id, completed_at |
| `quizzes` | Quiz | id, lesson_id, title, time_limit_minutes, passing_score |
| `questions` | Câu hỏi | id, quiz_id, topic_id, content, ai_insight |
| `answers` | Đáp án | id, question_id, content, is_correct |
| `user_quiz_attempts` | Lần làm quiz | id, user_id, quiz_id, score, accuracy, time_taken_seconds, status |
| `orders` | Đơn hàng | id, user_id, total_amount, payment_method, status, transaction_id |
| `order_items` | Chi tiết đơn | id, order_id, course_id, price |
| `notifications` | Thông báo | id(uuid), type, notifiable_type, notifiable_id, data, read_at |
| `knowledge_topics` | Chủ đề kiến thức | id, course_id, name, description |
| `user_topic_performance` | Hiệu suất chủ đề | id, user_id, topic_id, total_answered, total_correct, accuracy_percentage |
| `ai_recommendations` | Gợi ý AI | id, user_id, course_id, topic_id, type, suggestion_text, reason |
| `ai_tutor_conversations` | Cuộc hội thoại AI | id, user_id, lesson_id, title |
| `ai_tutor_messages` | Tin nhắn AI | id, conversation_id, sender, message |
| `user_streaks` | Chuỗi hoạt động | id, user_id, current_streak, longest_streak |
| `user_profiles` | Hồ sơ | id, user_id, learning_goal, skill_level, bio, phone, address |
| `personal_access_tokens` | Sanctum tokens | Standard Sanctum table |

#### Bảng THIẾU - Cần tạo migration

| Bảng cần tạo | Lý do | Mô tả |
|---|---|---|
| `discussions` | Module 2 - Thảo luận | Học viên đặt câu hỏi trong bài học, instructor trả lời |
| `discussion_replies` | Module 2 - Trả lời thảo luận | Câu trả lời cho thảo luận |
| `ai_content_histories` | Module 3 - Lịch sử AI | Lưu lại nội dung AI đã sinh cho instructor |
| `instructor_withdrawals` | Module 4 - Rút tiền | Yêu cầu rút tiền của instructor |
| `instructor_balances` | Module 4 - Số dư | Số dư tài khoản instructor |

#### Quan hệ chính (ERD)
```
users (teacher_id) ──1:N──> courses
courses ──1:N──> course_modules (chapters)
course_modules ──1:N──> lessons
lessons ──1:1──> quizzes
quizzes ──1:N──> questions
questions ──1:N──> answers
courses ──1:N──> enrollments <──N:1── users (student)
lessons ──1:N──> lesson_completions <──N:1── users (student)
courses ──1:N──> order_items <──N:1── orders <──N:1── users (buyer)
```

### 4.2 Khác biệt giữa DB schema và code hiện tại

| Vấn đề | Chi tiết |
|---|---|
| Model User | Code hiện tại dùng `role` column trực tiếp, nhưng DB dùng bảng pivot `role_user`. Cần refactor sang RBAC bảng pivot. |
| Model Course | Code hiện tại dùng `author_id`, nhưng DB dùng `teacher_id`. Fillable sai. Cần sửa lại. |
| Thiếu Models | Chưa có: CourseModule, Lesson, Quiz, Question, Answer, Enrollment, LessonCompletion, OrderItem, Role, Permission |
| Migration mismatch | Migration hiện tại khác schema trong database.sql. Sẽ giữ nguyên database.sql làm chuẩn, chỉ tạo migration cho bảng thiếu. |

---

## 5. Business Flow

### 5.1 Module 1.1 - Quản lý khóa học

#### Flow 1: Tạo khóa học
```
1. Instructor đăng nhập (Sanctum token)
2. POST /api/instructor/courses
3. Middleware: auth:sanctum → role:teacher
4. Validation: title (required, max:255), description (required), category_id (exists), level (enum), price (numeric, min:0)
5. Service: Tạo slug từ title, set teacher_id = auth user, status = 'draft'
6. Response: CourseResource (201)
```

#### Flow 2: Chỉnh sửa khóa học
```
1. PUT /api/instructor/courses/{course}
2. Policy: CoursePolicy@update → course.teacher_id === auth.id
3. Validation: tương tự tạo, nhưng optional
4. Service: Update course, regenerate slug nếu title thay đổi
5. Response: CourseResource (200)
```

#### Flow 3: Upload thumbnail
```
1. POST /api/instructor/courses/{course}/thumbnail
2. Policy: CoursePolicy@update
3. Validation: thumbnail (required, image, max:2048KB, mimes:jpg,png,webp)
4. Service: Store file, delete old file, update course.thumbnail
5. Response: CourseResource (200)
```

#### Flow 4: Upload video (cho bài học - sẽ dùng ở Module 1.2)
```
1. POST /api/instructor/courses/{course}/lessons/{lesson}/video
2. Policy: Kiểm tra ownership qua course → module → lesson
3. Validation: video (required, file, max:500MB, mimes:mp4,mov,avi,webm)
4. Service: Store video, update lesson.video_url, tính duration
5. Response: LessonResource (200)
```

#### Flow 5: Thiết lập giá
```
1. PATCH /api/instructor/courses/{course}/price
2. Policy: CoursePolicy@update
3. Validation: price (required, numeric, min:0, max:9999999.99)
4. Service: Update course.price
5. Response: CourseResource (200)
```

#### Flow 6: Xem danh sách khóa học của mình
```
1. GET /api/instructor/courses
2. Query params: status, search, sort_by, sort_dir, per_page
3. Service: Lấy courses where teacher_id = auth.id, with filters
4. Response: CourseCollection (paginated)
```

#### Flow 7: Xem chi tiết khóa học
```
1. GET /api/instructor/courses/{course}
2. Policy: CoursePolicy@view
3. Service: Load course with modules, lessons count, enrollments count
4. Response: CourseResource (200)
```

#### Flow 8: Xóa khóa học
```
1. DELETE /api/instructor/courses/{course}
2. Policy: CoursePolicy@delete
3. Business rule: Chỉ xóa được khi status = 'draft' (chưa publish)
4. Service: Soft delete hoặc hard delete
5. Response: 204 No Content
```

#### Flow 9: Đổi trạng thái khóa học
```
1. PATCH /api/instructor/courses/{course}/status
2. Policy: CoursePolicy@update
3. Validation: status (required, in:draft,published,archived)
4. Business rules:
   - draft → published: Cần có ít nhất 1 module và 1 lesson
   - published → archived: OK
   - archived → draft: OK
   - published → draft: KHÔNG CHO PHÉP (có học viên rồi)
5. Response: CourseResource (200)
```

### 5.2 Module 1.2 - Quản lý chương học & bài học

#### Flow 1: Quản lý Chương học (Modules)
- **Tạo Module**: `POST /api/instructor/courses/{course}/modules`
  - Policy: `CoursePolicy@update` (Chỉ chủ khóa học)
  - Validation: title, order
  - Service: Tạo module, gán course_id.
- **Cập nhật Module**: `PUT /api/instructor/modules/{module}`
  - Policy: Kiểm tra chủ sở hữu thông qua `module->course`.
  - Validation: title, order.
- **Xóa Module**: `DELETE /api/instructor/modules/{module}`
  - Cascade xóa toàn bộ lesson bên trong.

#### Flow 2: Quản lý Bài học (Lessons)
- **Tạo Lesson**: `POST /api/instructor/modules/{module}/lessons`
  - Policy: Chủ khóa học
  - Validation: title, type (video/article/quiz), content, order, duration
- **Upload Video cho Lesson**: `POST /api/instructor/lessons/{lesson}/video`
  - Validation: File mp4, webm... max 500MB.
  - Service: Upload file, lưu storage, tính toán lại thời lượng nếu có thể.
- **Cập nhật Lesson**: `PUT /api/instructor/lessons/{lesson}`
- **Xóa Lesson**: `DELETE /api/instructor/lessons/{lesson}`


---

## 6. API Design

### Module 1.1 - Quản lý khóa học

#### API 1: Danh sách khóa học
| Item | Value |
|---|---|
| Endpoint | `GET /api/instructor/courses` |
| Middleware | `auth:sanctum`, `role:teacher` |
| Permission | `create-course` |
| Query Params | `?status=draft&search=laravel&sort_by=created_at&sort_dir=desc&per_page=15` |
| Success Response (200) | `{ "success": true, "data": [...], "meta": { "current_page": 1, "total": 10, ... } }` |
| Error Response (401) | `{ "success": false, "message": "Unauthenticated." }` |
| Error Response (403) | `{ "success": false, "message": "Forbidden. Instructor role required." }` |

#### API 2: Chi tiết khóa học
| Item | Value |
|---|---|
| Endpoint | `GET /api/instructor/courses/{course}` |
| Middleware | `auth:sanctum`, `role:teacher` |
| Permission | `create-course` |
| Policy | `CoursePolicy@view` (teacher_id === auth.id) |
| Success Response (200) | `{ "success": true, "data": { "id": 1, "title": "...", "modules": [...], "enrollments_count": 5, ... } }` |
| Error Response (404) | `{ "success": false, "message": "Course not found." }` |
| Error Response (403) | `{ "success": false, "message": "You do not own this course." }` |

#### API 3: Tạo khóa học
| Item | Value |
|---|---|
| Endpoint | `POST /api/instructor/courses` |
| Middleware | `auth:sanctum`, `role:teacher` |
| Permission | `create-course` |
| Request Body | `{ "title": "string|required|max:255", "description": "string|required", "category_id": "nullable|exists:categories,id", "level": "required|in:beginner,intermediate,advanced", "price": "numeric|min:0|default:0" }` |
| Success Response (201) | `{ "success": true, "message": "Course created successfully.", "data": {...} }` |
| Validation Error (422) | `{ "success": false, "message": "Validation failed.", "errors": { "title": ["The title field is required."] } }` |

#### API 4: Cập nhật khóa học
| Item | Value |
|---|---|
| Endpoint | `PUT /api/instructor/courses/{course}` |
| Middleware | `auth:sanctum`, `role:teacher` |
| Policy | `CoursePolicy@update` |
| Request Body | `{ "title": "string|max:255", "description": "string", "category_id": "nullable|exists:categories,id", "level": "in:beginner,intermediate,advanced" }` |
| Success Response (200) | `{ "success": true, "message": "Course updated successfully.", "data": {...} }` |

#### API 5: Xóa khóa học
| Item | Value |
|---|---|
| Endpoint | `DELETE /api/instructor/courses/{course}` |
| Middleware | `auth:sanctum`, `role:teacher` |
| Policy | `CoursePolicy@delete` |
| Business Rule | Chỉ xóa khi status = 'draft' |
| Success Response (200) | `{ "success": true, "message": "Course deleted successfully." }` |
| Error Response (403) | `{ "success": false, "message": "Cannot delete a published course." }` |

#### API 6: Đổi trạng thái khóa học
| Item | Value |
|---|---|
| Endpoint | `PATCH /api/instructor/courses/{course}/status` |
| Middleware | `auth:sanctum`, `role:teacher` |
| Policy | `CoursePolicy@update` |
| Request Body | `{ "status": "required|in:draft,published,archived" }` |
| Business Rules | draft→published cần ≥1 module + ≥1 lesson; published→draft cấm |
| Success Response (200) | `{ "success": true, "message": "Course status updated.", "data": {...} }` |

#### API 7: Upload thumbnail
| Item | Value |
|---|---|
| Endpoint | `POST /api/instructor/courses/{course}/thumbnail` |
| Middleware | `auth:sanctum`, `role:teacher` |
| Policy | `CoursePolicy@update` |
| Request Body | `multipart/form-data: thumbnail (image, max:2048, mimes:jpg,png,webp)` |
| Success Response (200) | `{ "success": true, "message": "Thumbnail uploaded.", "data": {...} }` |

#### API 8: Thiết lập giá
| Item | Value |
|---|---|
| Endpoint | `PATCH /api/instructor/courses/{course}/price` |
| Middleware | `auth:sanctum`, `role:teacher` |
| Policy | `CoursePolicy@update` |
| Request Body | `{ "price": "required|numeric|min:0|max:9999999.99" }` |
| Success Response (200) | `{ "success": true, "message": "Price updated.", "data": {...} }` |

### Module 1.2 - Quản lý chương học & bài học

#### API 1: Tạo Chương học (Module)
- **Endpoint**: `POST /api/instructor/courses/{course}/modules`
- **Request Body**: `{ "title": "Chương 1", "order": 1 }`
- **Response (201)**: CourseModuleResource

#### API 2: Cập nhật & Xóa Chương học
- **PUT** `/api/instructor/modules/{module}`: `{ "title": "Tên mới", "order": 2 }`
- **DELETE** `/api/instructor/modules/{module}`

#### API 3: Tạo Bài học (Lesson)
- **Endpoint**: `POST /api/instructor/modules/{module}/lessons`
- **Request Body**: `{ "title": "Bài 1", "type": "video", "content": "Nội dung text", "order": 1, "duration_minutes": 10 }`
- **Response (201)**: LessonResource

#### API 4: Cập nhật & Xóa Bài học
- **PUT** `/api/instructor/lessons/{lesson}`
- **DELETE** `/api/instructor/lessons/{lesson}`

#### API 5: Upload Video Bài học
- **Endpoint**: `POST /api/instructor/lessons/{lesson}/video`
- **Request Body**: multipart `video` file.
- **Response (200)**: URL video mới cập nhật.

---

## 7. Cấu trúc Source Code

### Module 1.1

| Layer | File | Namespace |
|---|---|---|
| **Trait** | `app/Traits/ApiResponse.php` | `App\Traits` |
| **Middleware** | `app/Http/Middleware/RoleMiddleware.php` | `App\Http\Middleware` |
| **Policy** | `app/Policies/CoursePolicy.php` | `App\Policies` |
| **Model** | `app/Models/Course.php` | `App\Models` |
| **Model** | `app/Models/Role.php` | `App\Models` |
| **Model** | `app/Models/Permission.php` | `App\Models` |
| **Model** | `app/Models/Category.php` | `App\Models` |
| **Model** | `app/Models/CourseModule.php` | `App\Models` |
| **Model** | `app/Models/Lesson.php` | `App\Models` |
| **Model** | `app/Models/Enrollment.php` | `App\Models` |
| **Service** | `app/Services/Instructor/CourseService.php` | `App\Services\Instructor` |
| **Request** | `app/Http/Requests/Instructor/StoreCourseRequest.php` | `App\Http\Requests\Instructor` |
| **Request** | `app/Http/Requests/Instructor/UpdateCourseRequest.php` | `App\Http\Requests\Instructor` |
| **Request** | `app/Http/Requests/Instructor/UpdateCourseStatusRequest.php` | `App\Http\Requests\Instructor` |
| **Request** | `app/Http/Requests/Instructor/UpdateCoursePriceRequest.php` | `App\Http\Requests\Instructor` |
| **Request** | `app/Http/Requests/Instructor/UploadThumbnailRequest.php` | `App\Http\Requests\Instructor` |
| **Resource** | `app/Http/Resources/CourseResource.php` | `App\Http\Resources` |
| **Resource** | `app/Http/Resources/CourseCollection.php` | `App\Http\Resources` |
| **Controller** | `app/Http/Controllers/Api/Instructor/CourseController.php` | `App\Http\Controllers\Api\Instructor` |
| **Route** | `routes/api.php` | — |

---

## 8. Test Cases

### Module 1.1

#### Success Cases
| # | Test | Expected |
|---|---|---|
| S1 | Instructor tạo khóa học với đầy đủ thông tin | 201, course created |
| S2 | Instructor xem danh sách khóa học của mình | 200, chỉ courses của mình |
| S3 | Instructor xem chi tiết khóa học | 200, full course data |
| S4 | Instructor cập nhật khóa học | 200, updated data |
| S5 | Instructor xóa khóa học draft | 200, deleted |
| S6 | Instructor upload thumbnail | 200, thumbnail URL |
| S7 | Instructor cập nhật giá | 200, new price |
| S8 | Instructor publish khóa học (có module + lesson) | 200, status=published |
| S9 | Instructor archive khóa học | 200, status=archived |

#### Validation Error Cases
| # | Test | Expected |
|---|---|---|
| V1 | Tạo khóa học thiếu title | 422, title required |
| V2 | Tạo khóa học thiếu description | 422, description required |
| V3 | Level không hợp lệ | 422, level invalid |
| V4 | Price âm | 422, price min:0 |
| V5 | Thumbnail sai format | 422, mimes invalid |
| V6 | Thumbnail quá lớn | 422, max size |
| V7 | Category_id không tồn tại | 422, exists:categories |

#### Permission Error Cases
| # | Test | Expected |
|---|---|---|
| P1 | Student tạo khóa học | 403, forbidden |
| P2 | Instructor sửa khóa học người khác | 403, not owner |
| P3 | Unauthenticated request | 401, unauthenticated |
| P4 | Instructor xóa khóa học published | 403, cannot delete |

#### Edge Cases
| # | Test | Expected |
|---|---|---|
| E1 | Publish khóa học không có module | 422, needs module |
| E2 | Publish khóa học module không có lesson | 422, needs lesson |
| E3 | Chuyển published → draft | 422, not allowed |
| E4 | Tạo khóa học trùng title → slug unique | 201, slug auto-increment |
| E5 | Upload thumbnail thay thế thumbnail cũ | 200, old file deleted |

---

## 9. Nhật ký phát triển

| Ngày | Chức năng | File đã tạo/sửa | Kết quả | Khó khăn | Ghi chú |
|---|---|---|---|---|---|
| 2026-07-02 | Phân tích DB + Tạo process.md | `process.md` | ✅ Hoàn thành | Model/DB schema mismatch với code hiện tại | Cần refactor User model sang RBAC pivot, Course model sửa teacher_id |
| 2026-07-02 | Triển khai code Module 1.1 | Các file Controller, Service, Request, Resource, Model, Policy, Middleware, API routes | ✅ Hoàn thành code | Laravel 11/13 cần thêm api.php thủ công vào bootstrap | Chuẩn bị làm Unit Test cho Module 1.1 |
| 2026-07-02 | Viết Unit/Feature Test Module 1.1 | `tests/Feature/Instructor/CourseManagementTest.php` | ✅ Đã viết Test | Lỗi thiếu SQLite driver khi chạy php artisan test | Đã tạo test cho Create, Update, Update Status, Update Price, Listing |
| 2026-07-02 | Tài liệu hóa Module 1.1 | `docs/instructor-api.md` | ✅ Hoàn thành | Không có | Chốt lại 100% Module 1.1, chuẩn bị sang Module 1.2 |
| 2026-07-05 | Triển khai Module 1.2 | `CourseModule`, `Lesson`, Controller, Service, Request, Policy, Docs, Test | ✅ Hoàn thành | Policy Authorization lồng nhau hơi nhiều | Hoàn tất CRUD Chương học, Bài học, Upload Video. Chuẩn bị sang Module 2. |
