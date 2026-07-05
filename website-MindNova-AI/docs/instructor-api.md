# MindNova AI - Instructor API Documentation

> Document Version: 1.0.0
> Actor: Instructor (Teacher)
> Base URL: `/api/instructor`
> Auth: Bearer Token (Sanctum) + Role `teacher`

---

## 1. Course Management (Module 1.1)

### 1.1. Lấy danh sách khóa học
- **Endpoint**: `GET /courses`
- **Description**: Lấy danh sách khóa học của instructor đang đăng nhập, hỗ trợ phân trang và filter.
- **Headers**:
  - `Authorization: Bearer {token}`
- **Query Parameters**:
  - `status` (optional): `draft` | `published` | `archived`
  - `search` (optional): Từ khóa tìm kiếm theo title
  - `sort_by` (optional): `created_at` (default)
  - `sort_dir` (optional): `desc` | `asc`
  - `per_page` (optional): integer (default 15)
- **Response**:
  ```json
  {
      "success": true,
      "message": "Success",
      "data": [
          {
              "id": 1,
              "title": "Laravel Mastery",
              "slug": "laravel-mastery",
              "description": "Learn Laravel...",
              "price": 49.99,
              "status": "draft",
              // ...
          }
      ],
      "meta": {
          "total": 1,
          "current_page": 1,
          "per_page": 15
      }
  }
  ```

### 1.2. Lấy chi tiết một khóa học
- **Endpoint**: `GET /courses/{id}`
- **Description**: Lấy chi tiết 1 khóa học. (Chỉ lấy được khóa học của chính mình).
- **Headers**: `Authorization: Bearer {token}`
- **Response**: 200 OK
  ```json
  {
      "success": true,
      "data": {
          "id": 1,
          "title": "Laravel Mastery"
          // ...
      }
  }
  ```
- **Error**: 403 Forbidden nếu không phải chủ khóa học.

### 1.3. Tạo khóa học mới
- **Endpoint**: `POST /courses`
- **Headers**: 
  - `Authorization: Bearer {token}`
  - `Accept: application/json`
- **Body**:
  ```json
  {
      "title": "Laravel Mastery",
      "description": "The best course ever",
      "category_id": 1, // optional
      "level": "beginner", // beginner, intermediate, advanced
      "price": 49.99
  }
  ```
- **Response**: 201 Created

### 1.4. Cập nhật khóa học
- **Endpoint**: `PUT /courses/{id}`
- **Description**: Cập nhật thông tin chung.
- **Body**: (Cung cấp các trường cần update)
  ```json
  {
      "title": "Laravel Mastery Updated"
  }
  ```
- **Response**: 200 OK

### 1.5. Cập nhật trạng thái khóa học
- **Endpoint**: `PATCH /courses/{id}/status`
- **Body**:
  ```json
  {
      "status": "published" // draft, published, archived
  }
  ```
- **Business Rule**: 
  - Không thể chuyển từ `published` về `draft`.
  - Cần ít nhất 1 module & 1 lesson để publish (Sẽ áp dụng logic ở phase sau).

### 1.6. Cập nhật giá khóa học
- **Endpoint**: `PATCH /courses/{id}/price`
- **Body**:
  ```json
  {
      "price": 99.00
  }
  ```

### 1.7. Upload Thumbnail
- **Endpoint**: `POST /courses/{id}/thumbnail`
- **Headers**: `Content-Type: multipart/form-data`
- **Body**:
  - `thumbnail`: File ảnh (jpg, png, webp), max 2MB.

### 1.8. Xóa khóa học
- **Endpoint**: `DELETE /courses/{id}`
- **Description**: Chỉ xóa được khóa học khi status là `draft`.
- **Response**: 204 No Content

---

## 2. Course Modules & Lessons (Module 1.2)

### 2.1. Quản lý Chương học (Modules)

**Tạo Module mới**
- **Endpoint**: `POST /courses/{course_id}/modules`
- **Body**:
  ```json
    {
        "title": "Chương 1: Giới thiệu",
        "order": 1
    }
  ```
- **Response**: 201 Created

**Cập nhật Module**
- **Endpoint**: `PUT /modules/{module_id}`
- **Body**:
  ```json
  {
      "title": "Chương 1: Mở đầu"
  }
  ```
- **Response**: 200 OK

**Xóa Module**
- **Endpoint**: `DELETE /modules/{module_id}`
- **Response**: 204 No Content

### 2.2. Quản lý Bài học (Lessons)

**Tạo Bài học mới**
- **Endpoint**: `POST /modules/{module_id}/lessons`
- **Body**:
  ```json
  {
      "title": "Bài 1: Cài đặt môi trường",
      "type": "video", // video, article, quiz_module
      "content": "Nội dung bài học...",
      "order": 1,
      "duration_minutes": 15
  }
  ```
- **Response**: 201 Created

**Cập nhật Bài học**
- **Endpoint**: `PUT /lessons/{lesson_id}`
- **Body**: Tương tự như tạo mới
- **Response**: 200 OK

**Xóa Bài học**
- **Endpoint**: `DELETE /lessons/{lesson_id}`
- **Response**: 204 No Content

**Upload Video cho Bài học**
- **Endpoint**: `POST /lessons/{lesson_id}/video`
- **Headers**: `Content-Type: multipart/form-data`
- **Body**:
  - `video`: File mp4, mov, avi, webm. Max 500MB.
- **Response**: 200 OK

