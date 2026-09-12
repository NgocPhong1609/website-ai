# Thông tin các bảng cơ sở dữ liệu

Nguồn: `website-MindNova-AI/database/migrations/` (schema sau khi chạy hết migration).
Định dạng cột theo mẫu báo cáo: STT, Tên, Kiểu dữ liệu, Độ dài, Không để trống, Khóa chính, Ghi chú.
`X` = bắt buộc (NOT NULL). PK = khóa chính. FK = khóa ngoại.
Đã loại bảng bị drop: `course_classes`, `ai_recommendations`, `cache_locks`.

## Bảng `users`

| STT | Tên | Kiểu dữ liệu | Độ dài | Không để trống | Khóa chính | Ghi chú |
|---|---|---|---|---|---|---|
| 1 | id | bigint | 20 | X | PK | Khóa chính, tự tăng |
| 2 | name | varchar | 255 | X |  | Tên hiển thị |
| 3 | email | varchar | 255 | X |  | Unique |
| 4 | email_verified_at | timestamp |  |  |  | Thời điểm xác thực email |
| 5 | password | varchar | 255 | X |  | Mật khẩu đã hash |
| 6 | remember_token | varchar | 100 |  |  | Token ghi nhớ đăng nhập |
| 7 | created_at | timestamp |  |  |  | Thời điểm tạo bản ghi |
| 8 | updated_at | timestamp |  |  |  | Thời điểm cập nhật bản ghi |
| 9 | role | varchar | 255 | X |  | Vai trò legacy trên users |
| 10 | is_locked | tinyint | 1 | X |  | Khóa tài khoản |
| 11 | last_login_at | timestamp |  |  |  |  |
| 12 | google_id | varchar | 255 |  |  | ID Google OAuth |
| 13 | avatar_url | varchar | 255 |  |  | Đường dẫn ảnh đại diện |
| 14 | status | enum('active,banned,inactive') |  | X |  | Trạng thái bản ghi |
| 15 | deleted_at | timestamp |  |  |  | Thời điểm xóa mềm (cột tồn tại, model không dùng SoftDeletes) |
| 16 | teacher_verification_status | varchar | 255 | X |  |  |
| 17 | teacher_verified_at | timestamp |  |  |  |  |
| 18 | teacher_verification_note | text |  |  |  |  |
| 19 | onboarding_data | json |  |  |  |  |
| 20 | is_onboarded | tinyint | 1 | X |  |  |
| 21 | notification_email | tinyint | 1 |  |  |  |
| 22 | weekly_report | tinyint | 1 |  |  |  |
| 23 | ai_suggestions | tinyint | 1 |  |  |  |
| 24 | is_verified | tinyint | 1 | X |  |  |
| 25 | payout_info | json |  |  |  |  |

## Bảng `password_reset_tokens`

| STT | Tên | Kiểu dữ liệu | Độ dài | Không để trống | Khóa chính | Ghi chú |
|---|---|---|---|---|---|---|
| 1 | email | varchar | 255 | X | PK | Email đăng nhập, duy nhất |
| 2 | token | varchar | 255 | X |  |  |
| 3 | created_at | timestamp |  |  |  | Thời điểm tạo bản ghi |

## Bảng `sessions`

| STT | Tên | Kiểu dữ liệu | Độ dài | Không để trống | Khóa chính | Ghi chú |
|---|---|---|---|---|---|---|
| 1 | id | varchar | 255 | X | PK | Khóa chính, tự tăng |
| 2 | user_id | bigint | 20 |  | FK | Khóa ngoại tới users.id |
| 3 | ip_address | varchar | 45 |  |  |  |
| 4 | user_agent | text |  |  |  |  |
| 5 | payload | longtext |  | X |  |  |
| 6 | last_activity | int | 11 | X |  |  |

## Bảng `cache`

| STT | Tên | Kiểu dữ liệu | Độ dài | Không để trống | Khóa chính | Ghi chú |
|---|---|---|---|---|---|---|
| 1 | key | varchar | 255 | X | PK |  |
| 2 | value | mediumtext |  | X |  |  |
| 3 | expiration | bigint | 20 | X |  |  |

## Bảng `jobs`

| STT | Tên | Kiểu dữ liệu | Độ dài | Không để trống | Khóa chính | Ghi chú |
|---|---|---|---|---|---|---|
| 1 | id | bigint | 20 | X | PK | Khóa chính, tự tăng |
| 2 | queue | varchar | 255 | X |  |  |
| 3 | payload | longtext |  | X |  |  |
| 4 | attempts | smallint | 6 | X |  |  |
| 5 | reserved_at | int | 11 |  |  |  |
| 6 | available_at | int | 11 | X |  |  |
| 7 | created_at | int | 11 | X |  | Thời điểm tạo bản ghi |

## Bảng `job_batches`

| STT | Tên | Kiểu dữ liệu | Độ dài | Không để trống | Khóa chính | Ghi chú |
|---|---|---|---|---|---|---|
| 1 | id | varchar | 255 | X | PK | Khóa chính, tự tăng |
| 2 | name | varchar | 255 | X |  | Tên hiển thị |
| 3 | total_jobs | int | 11 | X |  |  |
| 4 | pending_jobs | int | 11 | X |  |  |
| 5 | failed_jobs | int | 11 | X |  |  |
| 6 | failed_job_ids | longtext |  | X |  |  |
| 7 | options | mediumtext |  |  |  |  |
| 8 | cancelled_at | int | 11 |  |  |  |
| 9 | created_at | int | 11 | X |  | Thời điểm tạo bản ghi |
| 10 | finished_at | int | 11 |  |  |  |

## Bảng `failed_jobs`

| STT | Tên | Kiểu dữ liệu | Độ dài | Không để trống | Khóa chính | Ghi chú |
|---|---|---|---|---|---|---|
| 1 | id | bigint | 20 | X | PK | Khóa chính, tự tăng |
| 2 | uuid | varchar | 255 | X |  | Unique |
| 3 | connection | varchar | 255 | X |  |  |
| 4 | queue | varchar | 255 | X |  |  |
| 5 | payload | longtext |  | X |  |  |
| 6 | exception | longtext |  | X |  |  |
| 7 | failed_at | timestamp |  | X |  |  |

## Bảng `payments`

| STT | Tên | Kiểu dữ liệu | Độ dài | Không để trống | Khóa chính | Ghi chú |
|---|---|---|---|---|---|---|
| 1 | id | bigint | 20 | X | PK | Khóa chính, tự tăng |
| 2 | user_id | bigint | 20 |  | FK | Khóa ngoại tới users.id |
| 3 | transaction_id | varchar | 255 |  |  | Unique |
| 4 | amount | decimal | 12,2 | X |  | Số tiền |
| 5 | currency | varchar | 3 | X |  | Đơn vị tiền |
| 6 | provider | varchar | 255 |  |  | Nhà cung cấp / cổng |
| 7 | status | varchar | 255 | X |  | Trạng thái bản ghi |
| 8 | payment_method | varchar | 255 |  |  | Cổng thanh toán: vnpay, momo, banking, free |
| 9 | description | text |  |  |  | Mô tả |
| 10 | metadata | json |  |  |  |  |
| 11 | created_at | timestamp |  |  |  | Thời điểm tạo bản ghi |
| 12 | updated_at | timestamp |  |  |  | Thời điểm cập nhật bản ghi |

## Bảng `activity_logs`

| STT | Tên | Kiểu dữ liệu | Độ dài | Không để trống | Khóa chính | Ghi chú |
|---|---|---|---|---|---|---|
| 1 | id | bigint | 20 | X | PK | Khóa chính, tự tăng |
| 2 | user_id | bigint | 20 |  | FK | Khóa ngoại tới users.id |
| 3 | action | varchar | 255 | X |  |  |
| 4 | subject_type | varchar | 255 |  |  |  |
| 5 | subject_id | bigint | 20 |  |  |  |
| 6 | ip_address | varchar | 255 |  |  |  |
| 7 | user_agent | text |  |  |  |  |
| 8 | metadata | json |  |  |  |  |
| 9 | created_at | timestamp |  |  |  | Thời điểm tạo bản ghi |
| 10 | updated_at | timestamp |  |  |  | Thời điểm cập nhật bản ghi |

## Bảng `notifications`

| STT | Tên | Kiểu dữ liệu | Độ dài | Không để trống | Khóa chính | Ghi chú |
|---|---|---|---|---|---|---|
| 1 | id | bigint | 20 | X | PK | Khóa chính, tự tăng |
| 2 | user_id | bigint | 20 |  | FK | Khóa ngoại tới users.id |
| 3 | type | varchar | 255 |  |  | Loại bản ghi |
| 4 | title | varchar | 255 | X |  | Tiêu đề |
| 5 | body | text |  | X |  |  |
| 6 | is_read | tinyint | 1 | X |  | Đã đọc thông báo |
| 7 | metadata | json |  |  |  |  |
| 8 | created_at | timestamp |  |  |  | Thời điểm tạo bản ghi |
| 9 | updated_at | timestamp |  |  |  | Thời điểm cập nhật bản ghi |

## Bảng `subscriptions`

| STT | Tên | Kiểu dữ liệu | Độ dài | Không để trống | Khóa chính | Ghi chú |
|---|---|---|---|---|---|---|
| 1 | id | bigint | 20 | X | PK | Khóa chính, tự tăng |
| 2 | user_id | bigint | 20 | X | FK | Khóa ngoại tới users.id |
| 3 | plan | varchar | 255 | X |  |  |
| 4 | status | varchar | 255 | X |  | Trạng thái bản ghi |
| 5 | payment_id | bigint | 20 |  | FK | Khóa ngoại tới payments.id |
| 6 | started_at | timestamp |  |  |  |  |
| 7 | expires_at | timestamp |  |  |  |  |
| 8 | metadata | json |  |  |  |  |
| 9 | created_at | timestamp |  |  |  | Thời điểm tạo bản ghi |
| 10 | updated_at | timestamp |  |  |  | Thời điểm cập nhật bản ghi |

## Bảng `admin_logs`

| STT | Tên | Kiểu dữ liệu | Độ dài | Không để trống | Khóa chính | Ghi chú |
|---|---|---|---|---|---|---|
| 1 | id | bigint | 20 | X | PK | Khóa chính, tự tăng |
| 2 | admin_id | bigint | 20 |  | FK |  |
| 3 | action | varchar | 255 | X |  |  |
| 4 | target_type | varchar | 255 |  |  |  |
| 5 | target_id | bigint | 20 |  |  |  |
| 6 | details | text |  |  |  |  |
| 7 | metadata | json |  |  |  |  |
| 8 | created_at | timestamp |  |  |  | Thời điểm tạo bản ghi |
| 9 | updated_at | timestamp |  |  |  | Thời điểm cập nhật bản ghi |

## Bảng `personal_access_tokens`

| STT | Tên | Kiểu dữ liệu | Độ dài | Không để trống | Khóa chính | Ghi chú |
|---|---|---|---|---|---|---|
| 1 | id | bigint | 20 | X | PK | Khóa chính, tự tăng |
| 2 | tokenable_type | varchar | 255 | X |  | Morph type |
| 3 | tokenable_id | bigint | 20 | X | FK | Morph id |
| 4 | name | text |  | X |  | Tên hiển thị |
| 5 | token | varchar | 64 | X |  | Unique |
| 6 | abilities | text |  |  |  |  |
| 7 | last_used_at | timestamp |  |  |  |  |
| 8 | expires_at | timestamp |  |  |  |  |
| 9 | created_at | timestamp |  |  |  | Thời điểm tạo bản ghi |
| 10 | updated_at | timestamp |  |  |  | Thời điểm cập nhật bản ghi |

## Bảng `categories`

| STT | Tên | Kiểu dữ liệu | Độ dài | Không để trống | Khóa chính | Ghi chú |
|---|---|---|---|---|---|---|
| 1 | id | bigint | 20 | X | PK | Khóa chính, tự tăng |
| 2 | name | varchar | 255 | X |  | Tên hiển thị |
| 3 | slug | varchar | 255 | X |  | Unique |
| 4 | description | text |  |  |  | Mô tả |
| 5 | parent_id | bigint | 20 |  |  |  |
| 6 | created_at | timestamp |  |  |  | Thời điểm tạo bản ghi |
| 7 | updated_at | timestamp |  |  |  | Thời điểm cập nhật bản ghi |
| 8 | status | varchar | 255 | X |  | Trạng thái bản ghi |

## Bảng `courses`

| STT | Tên | Kiểu dữ liệu | Độ dài | Không để trống | Khóa chính | Ghi chú |
|---|---|---|---|---|---|---|
| 1 | id | bigint | 20 | X | PK | Khóa chính, tự tăng |
| 2 | teacher_id | bigint | 20 | X | FK | Khóa ngoại giảng viên (users.id) |
| 3 | category_id | bigint | 20 |  | FK |  |
| 4 | title | varchar | 255 | X |  | Tiêu đề |
| 5 | slug | varchar | 255 | X |  | Unique |
| 6 | description | text |  | X |  | Mô tả |
| 7 | thumbnail | varchar | 255 |  |  | Ảnh thumbnail |
| 8 | price | decimal | 12,2 | X |  | Giá |
| 9 | level | enum('beginner,intermediate,advanced') |  | X |  |  |
| 10 | status | enum('draft','pending_review','under_review','approved','needs_fixes','rejected','published','archived') |  | X |  | Trạng thái bản ghi |
| 11 | created_at | timestamp |  |  |  | Thời điểm tạo bản ghi |
| 12 | updated_at | timestamp |  |  |  | Thời điểm cập nhật bản ghi |
| 13 | views_count | int | 11 | X |  |  |
| 14 | admin_hidden_at | timestamp |  |  |  |  |
| 15 | sale_price | decimal | 12,2 |  |  |  |
| 16 | sale_start_date | timestamp |  |  |  |  |
| 17 | sale_end_date | timestamp |  |  |  |  |
| 18 | is_flash_sale | tinyint | 1 | X |  |  |
| 19 | published_version_id | bigint | 20 |  |  | Phiên bản nội dung đang public |
| 20 | current_version | int | 11 | X |  |  |
| 21 | partnership_tier | varchar | 20 | X |  | Hạng hợp tác: standard hoặc exclusive |

## Bảng `orders`

| STT | Tên | Kiểu dữ liệu | Độ dài | Không để trống | Khóa chính | Ghi chú |
|---|---|---|---|---|---|---|
| 1 | id | bigint | 20 | X | PK | Khóa chính, tự tăng |
| 2 | user_id | bigint | 20 | X | FK | Khóa ngoại tới users.id |
| 3 | total_amount | decimal | 10,2 | X |  | Tổng tiền đơn hàng |
| 4 | payment_method | enum('vnpay', 'momo', 'banking', 'free') |  | X |  | Cổng thanh toán: vnpay, momo, banking, free |
| 5 | status | enum('pending,completed,failed,refunded') |  | X |  | Trạng thái bản ghi |
| 6 | transaction_id | varchar | 100 |  |  | Unique |
| 7 | created_at | timestamp |  |  |  | Thời điểm tạo bản ghi |
| 8 | updated_at | timestamp |  |  |  | Thời điểm cập nhật bản ghi |

## Bảng `order_items`

| STT | Tên | Kiểu dữ liệu | Độ dài | Không để trống | Khóa chính | Ghi chú |
|---|---|---|---|---|---|---|
| 1 | id | bigint | 20 | X | PK | Khóa chính, tự tăng |
| 2 | order_id | bigint | 20 | X | FK | Khóa ngoại tới orders.id |
| 3 | course_id | bigint | 20 |  | FK | Khóa ngoại tới courses.id |
| 4 | price | decimal | 10,2 | X |  | Giá |
| 5 | created_at | timestamp |  |  |  | Thời điểm tạo bản ghi |
| 6 | updated_at | timestamp |  |  |  | Thời điểm cập nhật bản ghi |

## Bảng `roles`

| STT | Tên | Kiểu dữ liệu | Độ dài | Không để trống | Khóa chính | Ghi chú |
|---|---|---|---|---|---|---|
| 1 | id | bigint | 20 | X | PK | Khóa chính, tự tăng |
| 2 | name | varchar | 255 | X |  | Unique |
| 3 | display_name | varchar | 255 |  |  |  |
| 4 | description | varchar | 255 |  |  | Mô tả |
| 5 | created_at | timestamp |  |  |  | Thời điểm tạo bản ghi |
| 6 | updated_at | timestamp |  |  |  | Thời điểm cập nhật bản ghi |

## Bảng `permissions`

| STT | Tên | Kiểu dữ liệu | Độ dài | Không để trống | Khóa chính | Ghi chú |
|---|---|---|---|---|---|---|
| 1 | id | bigint | 20 | X | PK | Khóa chính, tự tăng |
| 2 | name | varchar | 255 | X |  | Unique |
| 3 | display_name | varchar | 255 |  |  |  |
| 4 | description | text |  |  |  | Mô tả |
| 5 | created_at | timestamp |  |  |  | Thời điểm tạo bản ghi |
| 6 | updated_at | timestamp |  |  |  | Thời điểm cập nhật bản ghi |

## Bảng `role_user`

| STT | Tên | Kiểu dữ liệu | Độ dài | Không để trống | Khóa chính | Ghi chú |
|---|---|---|---|---|---|---|
| 1 | role_id | bigint | 20 | X | FK |  |
| 2 | user_id | bigint | 20 | X | FK | Khóa ngoại tới users.id |
| 3 | created_at | timestamp |  |  |  | Thời điểm tạo bản ghi |
| 4 | updated_at | timestamp |  |  |  | Thời điểm cập nhật bản ghi |
| 5 | id | bigint | 20 | X | PK | Khóa chính, tự tăng |

## Bảng `permission_role`

| STT | Tên | Kiểu dữ liệu | Độ dài | Không để trống | Khóa chính | Ghi chú |
|---|---|---|---|---|---|---|
| 1 | permission_id | bigint | 20 | X |  |  |
| 2 | role_id | bigint | 20 | X |  |  |
| 3 | created_at | timestamp |  |  |  | Thời điểm tạo bản ghi |
| 4 | updated_at | timestamp |  |  |  | Thời điểm cập nhật bản ghi |

## Bảng `lessons`

| STT | Tên | Kiểu dữ liệu | Độ dài | Không để trống | Khóa chính | Ghi chú |
|---|---|---|---|---|---|---|
| 1 | id | bigint | 20 | X | PK | Khóa chính, tự tăng |
| 2 | course_id | bigint | 20 | X | FK | Khóa ngoại tới courses.id |
| 3 | title | varchar | 255 | X |  | Tiêu đề |
| 4 | content | text |  |  |  | Nội dung |
| 5 | video_url | varchar | 255 |  |  |  |
| 6 | order | int | 11 | X |  |  |
| 7 | is_free | tinyint | 1 | X |  |  |
| 8 | created_at | timestamp |  |  |  | Thời điểm tạo bản ghi |
| 9 | updated_at | timestamp |  |  |  | Thời điểm cập nhật bản ghi |
| 10 | status | enum('draft','pending_review','under_review','approved','needs_fixes','rejected','published') |  | X |  | Trạng thái bản ghi |
| 11 | module_id | bigint | 20 |  | FK | Khóa ngoại tới course_modules.id |
| 12 | type | enum('video,article,quiz_module') |  | X |  | Loại bản ghi |
| 13 | duration_seconds | int | 11 | X |  |  |
| 14 | published_version_id | bigint | 20 |  |  | Phiên bản nội dung đang public |
| 15 | current_version | int | 11 | X |  |  |

## Bảng `discussions`

| STT | Tên | Kiểu dữ liệu | Độ dài | Không để trống | Khóa chính | Ghi chú |
|---|---|---|---|---|---|---|
| 1 | id | bigint | 20 | X | PK | Khóa chính, tự tăng |
| 2 | lesson_id | bigint | 20 | X | FK | Khóa ngoại tới lessons.id |
| 3 | student_id | bigint | 20 | X | FK |  |
| 4 | title | varchar | 255 | X |  | Tiêu đề |
| 5 | content | text |  | X |  | Nội dung |
| 6 | status | enum('open,answered,closed') |  | X |  | Trạng thái bản ghi |
| 7 | created_at | timestamp |  |  |  | Thời điểm tạo bản ghi |
| 8 | updated_at | timestamp |  |  |  | Thời điểm cập nhật bản ghi |
| 9 | is_pinned | tinyint | 1 | X |  |  |
| 10 | is_resolved | tinyint | 1 | X |  |  |

## Bảng `discussion_replies`

| STT | Tên | Kiểu dữ liệu | Độ dài | Không để trống | Khóa chính | Ghi chú |
|---|---|---|---|---|---|---|
| 1 | id | bigint | 20 | X | PK | Khóa chính, tự tăng |
| 2 | discussion_id | bigint | 20 | X | FK |  |
| 3 | user_id | bigint | 20 | X | FK | Khóa ngoại tới users.id |
| 4 | content | text |  | X |  | Nội dung |
| 5 | created_at | timestamp |  |  |  | Thời điểm tạo bản ghi |
| 6 | updated_at | timestamp |  |  |  | Thời điểm cập nhật bản ghi |
| 7 | is_best_answer | tinyint | 1 | X |  |  |

## Bảng `enrollments`

| STT | Tên | Kiểu dữ liệu | Độ dài | Không để trống | Khóa chính | Ghi chú |
|---|---|---|---|---|---|---|
| 1 | id | bigint | 20 | X | PK | Khóa chính, tự tăng |
| 2 | user_id | bigint | 20 | X | FK | Khóa ngoại tới users.id |
| 3 | course_id | bigint | 20 | X | FK | Khóa ngoại tới courses.id |
| 4 | progress_percentage | int | 11 | X |  | Phần trăm hoàn thành |
| 5 | enrolled_at | timestamp |  | X |  | Thời điểm ghi danh |
| 6 | status | enum('waiting,enrolled,completed,cancelled') |  | X |  | Trạng thái bản ghi |
| 7 | created_at | timestamp |  |  |  | Thời điểm tạo bản ghi |
| 8 | updated_at | timestamp |  |  |  | Thời điểm cập nhật bản ghi |

## Bảng `lesson_media`

| STT | Tên | Kiểu dữ liệu | Độ dài | Không để trống | Khóa chính | Ghi chú |
|---|---|---|---|---|---|---|
| 1 | id | bigint | 20 | X | PK | Khóa chính, tự tăng |
| 2 | lesson_id | bigint | 20 | X | FK | Khóa ngoại tới lessons.id |
| 3 | media_type | enum('video,image') |  | X |  |  |
| 4 | r2_key | varchar | 500 | X |  | Key object trên Cloudflare R2 |
| 5 | original_filename | varchar | 255 | X |  |  |
| 6 | file_size | bigint | 20 | X |  |  |
| 7 | mime_type | varchar | 100 | X |  |  |
| 8 | duration_seconds | int | 11 |  |  |  |
| 9 | status | enum('processing,ready,failed') |  | X |  | Trạng thái bản ghi |
| 10 | created_at | timestamp |  |  |  | Thời điểm tạo bản ghi |
| 11 | updated_at | timestamp |  |  |  | Thời điểm cập nhật bản ghi |
| 12 | is_temp | tinyint | 1 | X |  | File tạm trên R2 |
| 13 | uploaded_by | bigint | 20 |  | FK |  |
| 14 | upload_id | varchar | 255 |  |  | Unique |
| 15 | idempotency_key | char | 64 |  |  | Unique |
| 16 | attempts | smallint | 6 | X |  |  |
| 17 | last_error | text |  |  |  |  |
| 18 | processing_started_at | timestamp |  |  |  |  |
| 19 | ready_at | timestamp |  |  |  |  |
| 20 | expires_at | timestamp |  |  |  |  |

## Bảng `user_profiles`

| STT | Tên | Kiểu dữ liệu | Độ dài | Không để trống | Khóa chính | Ghi chú |
|---|---|---|---|---|---|---|
| 1 | id | bigint | 20 | X | PK | Khóa chính, tự tăng |
| 2 | user_id | bigint | 20 | X | FK | Unique |
| 3 | learning_goal | varchar | 255 |  |  |  |
| 4 | skill_level | varchar | 255 |  |  |  |
| 5 | bio | text |  |  |  |  |
| 6 | phone | varchar | 20 |  |  |  |
| 7 | address | varchar | 255 |  |  |  |
| 8 | created_at | timestamp |  |  |  | Thời điểm tạo bản ghi |
| 9 | updated_at | timestamp |  |  |  | Thời điểm cập nhật bản ghi |
| 10 | cv_path | varchar | 255 |  |  |  |

## Bảng `course_modules`

| STT | Tên | Kiểu dữ liệu | Độ dài | Không để trống | Khóa chính | Ghi chú |
|---|---|---|---|---|---|---|
| 1 | id | bigint | 20 | X | PK | Khóa chính, tự tăng |
| 2 | course_id | bigint | 20 | X | FK | Khóa ngoại tới courses.id |
| 3 | title | varchar | 255 | X |  | Tiêu đề |
| 4 | order | int | 11 | X |  |  |
| 5 | created_at | timestamp |  |  |  | Thời điểm tạo bản ghi |
| 6 | updated_at | timestamp |  |  |  | Thời điểm cập nhật bản ghi |
| 7 | status | enum('draft,published') |  | X |  | Trạng thái bản ghi |

## Bảng `knowledge_topics`

| STT | Tên | Kiểu dữ liệu | Độ dài | Không để trống | Khóa chính | Ghi chú |
|---|---|---|---|---|---|---|
| 1 | id | bigint | 20 | X | PK | Khóa chính, tự tăng |
| 2 | course_id | bigint | 20 | X | FK | Khóa ngoại tới courses.id |
| 3 | name | varchar | 255 | X |  | Tên hiển thị |
| 4 | description | text |  |  |  | Mô tả |
| 5 | created_at | timestamp |  |  |  | Thời điểm tạo bản ghi |
| 6 | updated_at | timestamp |  |  |  | Thời điểm cập nhật bản ghi |

## Bảng `quizzes`

| STT | Tên | Kiểu dữ liệu | Độ dài | Không để trống | Khóa chính | Ghi chú |
|---|---|---|---|---|---|---|
| 1 | id | bigint | 20 | X | PK | Khóa chính, tự tăng |
| 2 | lesson_id | bigint | 20 |  | FK | Khóa ngoại tới lessons.id |
| 3 | title | varchar | 255 | X |  | Tiêu đề |
| 4 | time_limit_minutes | int | 11 | X |  |  |
| 5 | passing_score | int | 11 | X |  |  |
| 6 | created_at | timestamp |  |  |  | Thời điểm tạo bản ghi |
| 7 | updated_at | timestamp |  |  |  | Thời điểm cập nhật bản ghi |
| 8 | instructor_id | bigint | 20 |  | FK |  |
| 9 | description | text |  |  |  | Mô tả |
| 10 | source_type | varchar | 255 | X |  |  |
| 11 | source_content | longtext |  |  |  |  |
| 12 | difficulty | varchar | 255 | X |  |  |
| 13 | total_questions | int | 11 | X |  |  |
| 14 | mc_questions_count | int | 11 | X |  |  |
| 15 | essay_questions_count | int | 11 | X |  |  |
| 16 | total_points | float |  | X |  |  |
| 17 | status | varchar | 255 | X |  | Trạng thái bản ghi |
| 18 | type | varchar | 255 | X |  | Loại bản ghi |
| 19 | credits | int | 11 | X |  |  |
| 20 | thumbnail_url | text |  |  |  |  |
| 21 | thumbnail_r2_key | text |  |  |  |  |

## Bảng `questions`

| STT | Tên | Kiểu dữ liệu | Độ dài | Không để trống | Khóa chính | Ghi chú |
|---|---|---|---|---|---|---|
| 1 | id | bigint | 20 | X | PK | Khóa chính, tự tăng |
| 2 | quiz_id | bigint | 20 | X | FK | Khóa ngoại tới quizzes.id |
| 3 | topic_id | bigint | 20 |  | FK |  |
| 4 | content | text |  | X |  | Nội dung |
| 5 | ai_insight | text |  |  |  |  |
| 6 | created_at | timestamp |  |  |  | Thời điểm tạo bản ghi |
| 7 | updated_at | timestamp |  |  |  | Thời điểm cập nhật bản ghi |
| 8 | order | int | 11 | X |  |  |
| 9 | question_category | varchar | 255 |  |  |  |
| 10 | type | varchar | 255 | X |  | Loại bản ghi |
| 11 | difficulty | varchar | 255 | X |  |  |
| 12 | explanation | text |  |  |  |  |
| 13 | sample_answer | text |  |  |  |  |
| 14 | rubric | text |  |  |  |  |
| 15 | points | float |  | X |  |  |
| 16 | selection_type | varchar | 255 | X |  |  |
| 17 | image_url | text |  |  |  |  |
| 18 | image_r2_key | text |  |  |  |  |

## Bảng `answers`

| STT | Tên | Kiểu dữ liệu | Độ dài | Không để trống | Khóa chính | Ghi chú |
|---|---|---|---|---|---|---|
| 1 | id | bigint | 20 | X | PK | Khóa chính, tự tăng |
| 2 | question_id | bigint | 20 | X | FK | Khóa ngoại tới questions.id |
| 3 | content | text |  | X |  | Nội dung |
| 4 | is_correct | tinyint | 1 | X |  | Đáp án đúng |
| 5 | created_at | timestamp |  |  |  | Thời điểm tạo bản ghi |
| 6 | updated_at | timestamp |  |  |  | Thời điểm cập nhật bản ghi |
| 7 | image_url | text |  |  |  |  |
| 8 | image_r2_key | text |  |  |  |  |

## Bảng `lesson_completions`

| STT | Tên | Kiểu dữ liệu | Độ dài | Không để trống | Khóa chính | Ghi chú |
|---|---|---|---|---|---|---|
| 1 | id | bigint | 20 | X | PK | Khóa chính, tự tăng |
| 2 | user_id | bigint | 20 | X | FK | Khóa ngoại tới users.id |
| 3 | lesson_id | bigint | 20 | X | FK | Khóa ngoại tới lessons.id |
| 4 | completed_at | timestamp |  | X |  |  |

## Bảng `user_quiz_attempts`

| STT | Tên | Kiểu dữ liệu | Độ dài | Không để trống | Khóa chính | Ghi chú |
|---|---|---|---|---|---|---|
| 1 | id | bigint | 20 | X | PK | Khóa chính, tự tăng |
| 2 | user_id | bigint | 20 | X | FK | Khóa ngoại tới users.id |
| 3 | quiz_id | bigint | 20 | X | FK | Khóa ngoại tới quizzes.id |
| 4 | score | int | 11 | X |  |  |
| 5 | accuracy | int | 11 | X |  |  |
| 6 | time_taken_seconds | int | 11 | X |  |  |
| 7 | status | enum('passed,failed') |  | X |  | Trạng thái bản ghi |
| 8 | created_at | timestamp |  | X |  | Thời điểm tạo bản ghi |
| 9 | score_10 | float |  |  |  |  |
| 10 | grading_status | varchar | 255 | X |  |  |

## Bảng `user_topic_performance`

| STT | Tên | Kiểu dữ liệu | Độ dài | Không để trống | Khóa chính | Ghi chú |
|---|---|---|---|---|---|---|
| 1 | id | bigint | 20 | X | PK | Khóa chính, tự tăng |
| 2 | user_id | bigint | 20 | X | FK | Khóa ngoại tới users.id |
| 3 | topic_id | bigint | 20 | X | FK |  |
| 4 | total_answered | int | 11 | X |  |  |
| 5 | total_correct | int | 11 | X |  |  |
| 6 | accuracy_percentage | int | 11 | X |  |  |
| 7 | updated_at | timestamp |  | X |  | Thời điểm cập nhật bản ghi |

## Bảng `ai_tutor_conversations`

| STT | Tên | Kiểu dữ liệu | Độ dài | Không để trống | Khóa chính | Ghi chú |
|---|---|---|---|---|---|---|
| 1 | id | bigint | 20 | X | PK | Khóa chính, tự tăng |
| 2 | user_id | bigint | 20 | X | FK | Khóa ngoại tới users.id |
| 3 | lesson_id | bigint | 20 |  | FK | Khóa ngoại tới lessons.id |
| 4 | title | varchar | 255 | X |  | Tiêu đề |
| 5 | created_at | timestamp |  |  |  | Thời điểm tạo bản ghi |
| 6 | updated_at | timestamp |  |  |  | Thời điểm cập nhật bản ghi |

## Bảng `ai_tutor_messages`

| STT | Tên | Kiểu dữ liệu | Độ dài | Không để trống | Khóa chính | Ghi chú |
|---|---|---|---|---|---|---|
| 1 | id | bigint | 20 | X | PK | Khóa chính, tự tăng |
| 2 | conversation_id | bigint | 20 | X | FK |  |
| 3 | sender | enum('user,ai') |  | X |  |  |
| 4 | message | longtext |  | X |  |  |
| 5 | created_at | timestamp |  | X |  | Thời điểm tạo bản ghi |

## Bảng `admin_settings`

| STT | Tên | Kiểu dữ liệu | Độ dài | Không để trống | Khóa chính | Ghi chú |
|---|---|---|---|---|---|---|
| 1 | id | bigint | 20 | X | PK | Khóa chính, tự tăng |
| 2 | key | varchar | 255 | X |  | Unique |
| 3 | value | json |  |  |  |  |
| 4 | created_at | timestamp |  |  |  | Thời điểm tạo bản ghi |
| 5 | updated_at | timestamp |  |  |  | Thời điểm cập nhật bản ghi |

## Bảng `ai_usage_logs`

| STT | Tên | Kiểu dữ liệu | Độ dài | Không để trống | Khóa chính | Ghi chú |
|---|---|---|---|---|---|---|
| 1 | id | bigint | 20 | X | PK | Khóa chính, tự tăng |
| 2 | user_id | bigint | 20 |  | FK | Khóa ngoại tới users.id |
| 3 | actor_type | varchar | 255 | X |  |  |
| 4 | actor_key | varchar | 255 |  |  |  |
| 5 | provider | varchar | 255 |  |  | Nhà cung cấp / cổng |
| 6 | model | varchar | 255 |  |  |  |
| 7 | input_text | longtext |  |  |  |  |
| 8 | output_text | longtext |  |  |  |  |
| 9 | input_tokens | int | 11 | X |  |  |
| 10 | output_tokens | int | 11 | X |  |  |
| 11 | cost_estimate | decimal | 12,6 | X |  |  |
| 12 | system_prompt | longtext |  |  |  |  |
| 13 | meta | json |  |  |  |  |
| 14 | created_at | timestamp |  |  |  | Thời điểm tạo bản ghi |
| 15 | updated_at | timestamp |  |  |  | Thời điểm cập nhật bản ghi |
| 16 | request_id | varchar | 64 |  |  |  |
| 17 | provider_request_id | varchar | 255 |  |  |  |
| 18 | status | varchar | 32 |  |  | Trạng thái bản ghi |
| 19 | error_code | varchar | 100 |  |  |  |
| 20 | duration_ms | int | 11 |  |  |  |
| 21 | fallback_used | tinyint | 1 |  |  |  |
| 22 | token_source | varchar | 32 |  |  |  |
| 23 | cost_source | varchar | 32 |  |  |  |
| 24 | cost_amount | decimal | 12,6 |  |  |  |
| 25 | cost_currency | char | 3 |  |  |  |

## Bảng `ai_moderation_flags`

| STT | Tên | Kiểu dữ liệu | Độ dài | Không để trống | Khóa chính | Ghi chú |
|---|---|---|---|---|---|---|
| 1 | id | bigint | 20 | X | PK | Khóa chính, tự tăng |
| 2 | user_id | bigint | 20 |  | FK | Khóa ngoại tới users.id |
| 3 | actor_type | varchar | 255 | X |  |  |
| 4 | actor_key | varchar | 255 |  |  |  |
| 5 | source | varchar | 255 | X |  |  |
| 6 | reason | varchar | 255 | X |  |  |
| 7 | input_text | longtext |  |  |  |  |
| 8 | output_text | longtext |  |  |  |  |
| 9 | status | varchar | 255 | X |  | Trạng thái bản ghi |
| 10 | review_notes | text |  |  |  |  |
| 11 | reviewed_by | bigint | 20 |  | FK |  |
| 12 | reviewed_at | timestamp |  |  |  |  |
| 13 | created_at | timestamp |  |  |  | Thời điểm tạo bản ghi |
| 14 | updated_at | timestamp |  |  |  | Thời điểm cập nhật bản ghi |

## Bảng `support_tickets`

| STT | Tên | Kiểu dữ liệu | Độ dài | Không để trống | Khóa chính | Ghi chú |
|---|---|---|---|---|---|---|
| 1 | id | bigint | 20 | X | PK | Khóa chính, tự tăng |
| 2 | reporter_id | bigint | 20 |  | FK |  |
| 3 | target_user_id | bigint | 20 |  | FK |  |
| 4 | type | varchar | 255 | X |  | Loại bản ghi |
| 5 | title | varchar | 255 | X |  | Tiêu đề |
| 6 | description | text |  | X |  | Mô tả |
| 7 | status | varchar | 255 | X |  | Trạng thái bản ghi |
| 8 | resolution | text |  |  |  |  |
| 9 | handled_by | bigint | 20 |  | FK |  |
| 10 | handled_at | timestamp |  |  |  |  |
| 11 | created_at | timestamp |  |  |  | Thời điểm tạo bản ghi |
| 12 | updated_at | timestamp |  |  |  | Thời điểm cập nhật bản ghi |

## Bảng `shared_resources`

| STT | Tên | Kiểu dữ liệu | Độ dài | Không để trống | Khóa chính | Ghi chú |
|---|---|---|---|---|---|---|
| 1 | id | bigint | 20 | X | PK | Khóa chính, tự tăng |
| 2 | title | varchar | 255 | X |  | Tiêu đề |
| 3 | type | varchar | 255 | X |  | Loại bản ghi |
| 4 | url | varchar | 255 | X |  |  |
| 5 | description | text |  |  |  | Mô tả |
| 6 | status | varchar | 255 | X |  | Trạng thái bản ghi |
| 7 | uploaded_by | bigint | 20 |  | FK |  |
| 8 | created_at | timestamp |  |  |  | Thời điểm tạo bản ghi |
| 9 | updated_at | timestamp |  |  |  | Thời điểm cập nhật bản ghi |

## Bảng `teacher_payouts`

| STT | Tên | Kiểu dữ liệu | Độ dài | Không để trống | Khóa chính | Ghi chú |
|---|---|---|---|---|---|---|
| 1 | id | bigint | 20 | X | PK | Khóa chính, tự tăng |
| 2 | order_id | bigint | 20 | X | FK | Khóa ngoại tới orders.id |
| 3 | course_id | bigint | 20 | X | FK | Khóa ngoại tới courses.id |
| 4 | teacher_id | bigint | 20 | X | FK | Khóa ngoại giảng viên (users.id) |
| 5 | student_id | bigint | 20 | X | FK |  |
| 6 | gross_amount | decimal | 12,2 | X |  |  |
| 7 | teacher_amount | decimal | 12,2 | X |  |  |
| 8 | admin_share_amount | decimal | 12,2 | X |  |  |
| 9 | commission_rate | decimal | 5,2 | X |  |  |
| 10 | status | varchar | 255 | X |  | Trạng thái bản ghi |
| 11 | paid_at | timestamp |  |  |  |  |
| 12 | metadata | json |  |  |  |  |
| 13 | created_at | timestamp |  |  |  | Thời điểm tạo bản ghi |
| 14 | updated_at | timestamp |  |  |  | Thời điểm cập nhật bản ghi |

## Bảng `instructor_transactions`

| STT | Tên | Kiểu dữ liệu | Độ dài | Không để trống | Khóa chính | Ghi chú |
|---|---|---|---|---|---|---|
| 1 | id | bigint | 20 | X | PK | Khóa chính, tự tăng |
| 2 | instructor_id | bigint | 20 | X | FK |  |
| 3 | type | varchar | 255 | X |  | Loại bản ghi |
| 4 | amount | decimal | 12,2 | X |  | Số tiền |
| 5 | status | varchar | 255 | X |  | Trạng thái bản ghi |
| 6 | reference_type | varchar | 255 |  |  | Morph type |
| 7 | reference_id | bigint | 20 |  | FK | Morph id |
| 8 | description | varchar | 255 |  |  | Mô tả |
| 9 | available_at | timestamp |  |  |  |  |
| 10 | created_at | timestamp |  |  |  | Thời điểm tạo bản ghi |
| 11 | updated_at | timestamp |  |  |  | Thời điểm cập nhật bản ghi |

## Bảng `withdrawals`

| STT | Tên | Kiểu dữ liệu | Độ dài | Không để trống | Khóa chính | Ghi chú |
|---|---|---|---|---|---|---|
| 1 | id | bigint | 20 | X | PK | Khóa chính, tự tăng |
| 2 | instructor_id | bigint | 20 | X | FK |  |
| 3 | amount | decimal | 12,2 | X |  | Số tiền |
| 4 | bank_info | json |  | X |  |  |
| 5 | status | varchar | 255 | X |  | Trạng thái bản ghi |
| 6 | admin_note | text |  |  |  |  |
| 7 | created_at | timestamp |  |  |  | Thời điểm tạo bản ghi |
| 8 | updated_at | timestamp |  |  |  | Thời điểm cập nhật bản ghi |

## Bảng `certificates`

| STT | Tên | Kiểu dữ liệu | Độ dài | Không để trống | Khóa chính | Ghi chú |
|---|---|---|---|---|---|---|
| 1 | id | bigint | 20 | X | PK | Khóa chính, tự tăng |
| 2 | user_id | bigint | 20 | X | FK | Khóa ngoại tới users.id |
| 3 | course_id | bigint | 20 | X | FK | Khóa ngoại tới courses.id |
| 4 | certificate_url | varchar | 255 |  |  | URL file chứng chỉ (có thể null) |
| 5 | issued_at | timestamp |  | X |  |  |
| 6 | created_at | timestamp |  |  |  | Thời điểm tạo bản ghi |
| 7 | updated_at | timestamp |  |  |  | Thời điểm cập nhật bản ghi |

## Bảng `reviews`

| STT | Tên | Kiểu dữ liệu | Độ dài | Không để trống | Khóa chính | Ghi chú |
|---|---|---|---|---|---|---|
| 1 | id | bigint | 20 | X | PK | Khóa chính, tự tăng |
| 2 | course_id | bigint | 20 | X | FK | Khóa ngoại tới courses.id |
| 3 | user_id | bigint | 20 | X | FK | Khóa ngoại tới users.id |
| 4 | rating | int | 11 | X |  |  |
| 5 | comment | text |  |  |  |  |
| 6 | created_at | timestamp |  |  |  | Thời điểm tạo bản ghi |
| 7 | updated_at | timestamp |  |  |  | Thời điểm cập nhật bản ghi |

## Bảng `coupons`

| STT | Tên | Kiểu dữ liệu | Độ dài | Không để trống | Khóa chính | Ghi chú |
|---|---|---|---|---|---|---|
| 1 | id | bigint | 20 | X | PK | Khóa chính, tự tăng |
| 2 | code | varchar | 255 | X |  | Unique |
| 3 | type | enum('percent,fixed') |  | X |  | Loại bản ghi |
| 4 | value | decimal | 10,2 | X |  |  |
| 5 | max_uses | int | 11 |  |  |  |
| 6 | used_count | int | 11 | X |  |  |
| 7 | expires_at | timestamp |  |  |  |  |
| 8 | status | enum('active,disabled,expired') |  | X |  | Trạng thái bản ghi |
| 9 | instructor_id | bigint | 20 | X | FK |  |
| 10 | course_id | bigint | 20 |  |  | Khóa ngoại tới courses.id |
| 11 | created_at | timestamp |  |  |  | Thời điểm tạo bản ghi |
| 12 | updated_at | timestamp |  |  |  | Thời điểm cập nhật bản ghi |
| 13 | title | varchar | 255 |  |  | Tiêu đề |
| 14 | description | text |  |  |  | Mô tả |
| 15 | discount_type | enum('percent,fixed') |  | X |  |  |
| 16 | min_order_amount | decimal | 10,2 |  |  |  |
| 17 | max_discount_amount | decimal | 10,2 |  |  |  |
| 18 | is_active | tinyint | 1 | X |  |  |
| 19 | starts_at | timestamp |  |  |  |  |
| 20 | usage_limit | int | 11 |  |  |  |

## Bảng `teacher_credentials`

| STT | Tên | Kiểu dữ liệu | Độ dài | Không để trống | Khóa chính | Ghi chú |
|---|---|---|---|---|---|---|
| 1 | id | bigint | 20 | X | PK | Khóa chính, tự tăng |
| 2 | user_id | bigint | 20 | X | FK | Khóa ngoại tới users.id |
| 3 | title | varchar | 255 |  |  | Tiêu đề |
| 4 | file_path | varchar | 255 | X |  |  |
| 5 | created_at | timestamp |  |  |  | Thời điểm tạo bản ghi |
| 6 | updated_at | timestamp |  |  |  | Thời điểm cập nhật bản ghi |

## Bảng `content_versions`

| STT | Tên | Kiểu dữ liệu | Độ dài | Không để trống | Khóa chính | Ghi chú |
|---|---|---|---|---|---|---|
| 1 | id | bigint | 20 | X | PK | Khóa chính, tự tăng |
| 2 | versionable_type | varchar | 255 | X |  |  |
| 3 | versionable_id | bigint | 20 | X |  |  |
| 4 | version_number | int | 11 | X |  |  |
| 5 | snapshot_data | json |  | X |  |  |
| 6 | status | enum('
                draft,pending_review,under_review,
                approved,rejected,needs_fixes,published,
            ') |  | X |  | Trạng thái bản ghi |
| 7 | is_published | tinyint | 1 | X |  |  |
| 8 | created_by | bigint | 20 |  |  |  |
| 9 | created_at | timestamp |  |  |  | Thời điểm tạo bản ghi |
| 10 | updated_at | timestamp |  |  |  | Thời điểm cập nhật bản ghi |

## Bảng `review_submissions`

| STT | Tên | Kiểu dữ liệu | Độ dài | Không để trống | Khóa chính | Ghi chú |
|---|---|---|---|---|---|---|
| 1 | id | bigint | 20 | X | PK | Khóa chính, tự tăng |
| 2 | course_id | bigint | 20 | X | FK | Khóa ngoại tới courses.id |
| 3 | course_version_id | bigint | 20 | X |  |  |
| 4 | submitted_by | bigint | 20 | X | FK |  |
| 5 | submitted_at | timestamp |  | X |  |  |
| 6 | status | enum('
                pending,under_review,approved,rejected,needs_fixes,
            ') |  | X |  | Trạng thái bản ghi |
| 7 | reviewed_by | bigint | 20 |  |  |  |
| 8 | reviewed_at | timestamp |  |  |  |  |
| 9 | review_feedback | text |  |  |  |  |
| 10 | stale_at | timestamp |  |  |  |  |
| 11 | metadata | json |  |  |  |  |
| 12 | created_at | timestamp |  |  |  | Thời điểm tạo bản ghi |
| 13 | updated_at | timestamp |  |  |  | Thời điểm cập nhật bản ghi |

## Bảng `review_submission_items`

| STT | Tên | Kiểu dữ liệu | Độ dài | Không để trống | Khóa chính | Ghi chú |
|---|---|---|---|---|---|---|
| 1 | id | bigint | 20 | X | PK | Khóa chính, tự tăng |
| 2 | submission_id | bigint | 20 | X | FK |  |
| 3 | lesson_id | bigint | 20 | X | FK | Khóa ngoại tới lessons.id |
| 4 | lesson_version_id | bigint | 20 | X |  |  |
| 5 | change_type | enum('new,modified,deleted,reordered') |  | X |  |  |
| 6 | created_at | timestamp |  |  |  | Thời điểm tạo bản ghi |
| 7 | updated_at | timestamp |  |  |  | Thời điểm cập nhật bản ghi |

## Bảng `review_comments`

| STT | Tên | Kiểu dữ liệu | Độ dài | Không để trống | Khóa chính | Ghi chú |
|---|---|---|---|---|---|---|
| 1 | id | bigint | 20 | X | PK | Khóa chính, tự tăng |
| 2 | submission_id | bigint | 20 | X | FK |  |
| 3 | commentable_type | varchar | 255 |  |  |  |
| 4 | commentable_id | bigint | 20 |  |  |  |
| 5 | user_id | bigint | 20 | X | FK | Khóa ngoại tới users.id |
| 6 | content | text |  | X |  | Nội dung |
| 7 | created_at | timestamp |  |  |  | Thời điểm tạo bản ghi |
| 8 | updated_at | timestamp |  |  |  | Thời điểm cập nhật bản ghi |

## Bảng `content_audit_logs`

| STT | Tên | Kiểu dữ liệu | Độ dài | Không để trống | Khóa chính | Ghi chú |
|---|---|---|---|---|---|---|
| 1 | id | bigint | 20 | X | PK | Khóa chính, tự tăng |
| 2 | user_id | bigint | 20 | X | FK | Khóa ngoại tới users.id |
| 3 | user_role | varchar | 50 | X |  |  |
| 4 | action | varchar | 100 | X |  |  |
| 5 | entity_type | varchar | 100 | X |  |  |
| 6 | entity_id | bigint | 20 | X |  |  |
| 7 | old_status | varchar | 50 |  |  |  |
| 8 | new_status | varchar | 50 |  |  |  |
| 9 | version_number | int | 11 |  |  |  |
| 10 | metadata | json |  |  |  |  |
| 11 | created_at | timestamp |  | X |  | Thời điểm tạo bản ghi |
| 12 | course_id | bigint | 20 |  | FK | Khóa ngoại tới courses.id |
| 13 | correlation_id | char | 36 |  |  |  |

## Bảng `deletion_requests`

| STT | Tên | Kiểu dữ liệu | Độ dài | Không để trống | Khóa chính | Ghi chú |
|---|---|---|---|---|---|---|
| 1 | id | bigint | 20 | X | PK | Khóa chính, tự tăng |
| 2 | lesson_id | bigint | 20 | X | FK | Khóa ngoại tới lessons.id |
| 3 | course_id | bigint | 20 | X | FK | Khóa ngoại tới courses.id |
| 4 | requested_by | bigint | 20 | X | FK |  |
| 5 | requested_at | timestamp |  | X |  |  |
| 6 | status | enum('pending,approved,rejected') |  | X |  | Trạng thái bản ghi |
| 7 | reviewed_by | bigint | 20 |  |  |  |
| 8 | reviewed_at | timestamp |  |  |  |  |
| 9 | reason | text |  |  |  |  |
| 10 | created_at | timestamp |  |  |  | Thời điểm tạo bản ghi |
| 11 | updated_at | timestamp |  |  |  | Thời điểm cập nhật bản ghi |

## Bảng `chat_conversations`

| STT | Tên | Kiểu dữ liệu | Độ dài | Không để trống | Khóa chính | Ghi chú |
|---|---|---|---|---|---|---|
| 1 | id | bigint | 20 | X | PK | Khóa chính, tự tăng |
| 2 | course_id | bigint | 20 |  | FK | Khóa ngoại tới courses.id |
| 3 | title | varchar | 255 |  |  | Tiêu đề |
| 4 | type | enum('course,group,direct') |  | X |  | Loại bản ghi |
| 5 | created_at | timestamp |  |  |  | Thời điểm tạo bản ghi |
| 6 | updated_at | timestamp |  |  |  | Thời điểm cập nhật bản ghi |

## Bảng `chat_conversation_members`

| STT | Tên | Kiểu dữ liệu | Độ dài | Không để trống | Khóa chính | Ghi chú |
|---|---|---|---|---|---|---|
| 1 | id | bigint | 20 | X | PK | Khóa chính, tự tăng |
| 2 | chat_conversation_id | bigint | 20 | X | FK |  |
| 3 | user_id | bigint | 20 | X | FK | Khóa ngoại tới users.id |
| 4 | last_read_message_id | bigint | 20 |  |  |  |
| 5 | created_at | timestamp |  |  |  | Thời điểm tạo bản ghi |
| 6 | updated_at | timestamp |  |  |  | Thời điểm cập nhật bản ghi |

## Bảng `chat_messages`

| STT | Tên | Kiểu dữ liệu | Độ dài | Không để trống | Khóa chính | Ghi chú |
|---|---|---|---|---|---|---|
| 1 | id | bigint | 20 | X | PK | Khóa chính, tự tăng |
| 2 | chat_conversation_id | bigint | 20 | X | FK |  |
| 3 | sender_id | bigint | 20 | X | FK |  |
| 4 | content | text |  |  |  | Nội dung |
| 5 | type | enum('text,file,image') |  | X |  | Loại bản ghi |
| 6 | created_at | timestamp |  |  |  | Thời điểm tạo bản ghi |
| 7 | updated_at | timestamp |  |  |  | Thời điểm cập nhật bản ghi |
| 8 | is_recalled | tinyint | 1 | X |  | Tin nhắn đã thu hồi |

## Bảng `chat_attachments`

| STT | Tên | Kiểu dữ liệu | Độ dài | Không để trống | Khóa chính | Ghi chú |
|---|---|---|---|---|---|---|
| 1 | id | bigint | 20 | X | PK | Khóa chính, tự tăng |
| 2 | chat_message_id | bigint | 20 | X | FK |  |
| 3 | file_url | varchar | 255 | X |  |  |
| 4 | file_name | varchar | 255 | X |  |  |
| 5 | mime_type | varchar | 255 |  |  |  |
| 6 | size | bigint | 20 |  |  |  |
| 7 | created_at | timestamp |  |  |  | Thời điểm tạo bản ghi |
| 8 | updated_at | timestamp |  |  |  | Thời điểm cập nhật bản ghi |

## Bảng `password_otps`

| STT | Tên | Kiểu dữ liệu | Độ dài | Không để trống | Khóa chính | Ghi chú |
|---|---|---|---|---|---|---|
| 1 | id | bigint | 20 | X | PK | Khóa chính, tự tăng |
| 2 | email | varchar | 255 | X |  | Email đăng nhập, duy nhất |
| 3 | otp_hash | varchar | 255 | X |  | OTP đã hash |
| 4 | type | varchar | 255 | X |  | Loại bản ghi |
| 5 | expires_at | timestamp |  | X |  |  |
| 6 | verified_at | timestamp |  |  |  |  |
| 7 | attempts | int | 11 | X |  |  |
| 8 | created_at | timestamp |  |  |  | Thời điểm tạo bản ghi |
| 9 | updated_at | timestamp |  |  |  | Thời điểm cập nhật bản ghi |

## Bảng `teacher_certificates`

| STT | Tên | Kiểu dữ liệu | Độ dài | Không để trống | Khóa chính | Ghi chú |
|---|---|---|---|---|---|---|
| 1 | id | bigint | 20 | X | PK | Khóa chính, tự tăng |
| 2 | teacher_id | bigint | 20 | X | FK | Khóa ngoại giảng viên (users.id) |
| 3 | certificate_name | varchar | 255 | X |  |  |
| 4 | issuing_organization | varchar | 255 |  |  |  |
| 5 | certificate_number | varchar | 255 |  |  |  |
| 6 | specialization | varchar | 255 |  |  |  |
| 7 | issue_date | date |  |  |  |  |
| 8 | expiry_date | date |  |  |  |  |
| 9 | description | text |  |  |  | Mô tả |
| 10 | certificate_image | varchar | 255 |  |  |  |
| 11 | verification_url | varchar | 255 |  |  |  |
| 12 | verification_status | varchar | 255 | X |  |  |
| 13 | verification_note | text |  |  |  |  |
| 14 | verified_at | timestamp |  |  |  |  |
| 15 | verified_by | bigint | 20 |  | FK |  |
| 16 | is_public | tinyint | 1 | X |  |  |
| 17 | created_at | timestamp |  |  |  | Thời điểm tạo bản ghi |
| 18 | updated_at | timestamp |  |  |  | Thời điểm cập nhật bản ghi |

## Bảng `teacher_certificate_evidences`

| STT | Tên | Kiểu dữ liệu | Độ dài | Không để trống | Khóa chính | Ghi chú |
|---|---|---|---|---|---|---|
| 1 | id | bigint | 20 | X | PK | Khóa chính, tự tăng |
| 2 | certificate_id | bigint | 20 | X | FK |  |
| 3 | evidence_path | varchar | 255 | X |  |  |
| 4 | evidence_type | varchar | 255 | X |  |  |
| 5 | original_name | varchar | 255 |  |  |  |
| 6 | file_size | bigint | 20 |  |  |  |
| 7 | mime_type | varchar | 255 |  |  |  |
| 8 | created_at | timestamp |  |  |  | Thời điểm tạo bản ghi |
| 9 | updated_at | timestamp |  |  |  | Thời điểm cập nhật bản ghi |

## Bảng `teacher_verifications`

| STT | Tên | Kiểu dữ liệu | Độ dài | Không để trống | Khóa chính | Ghi chú |
|---|---|---|---|---|---|---|
| 1 | id | bigint | 20 | X | PK | Khóa chính, tự tăng |
| 2 | teacher_id | bigint | 20 | X | FK | Khóa ngoại giảng viên (users.id) |
| 3 | status | varchar | 255 | X |  | Trạng thái bản ghi |
| 4 | submitted_at | timestamp |  | X |  |  |
| 5 | reviewed_at | timestamp |  |  |  |  |
| 6 | reviewed_by | bigint | 20 |  | FK |  |
| 7 | rejection_reason | text |  |  |  |  |
| 8 | admin_note | text |  |  |  |  |
| 9 | verified_at | timestamp |  |  |  |  |
| 10 | revoked_at | timestamp |  |  |  |  |
| 11 | created_at | timestamp |  |  |  | Thời điểm tạo bản ghi |
| 12 | updated_at | timestamp |  |  |  | Thời điểm cập nhật bản ghi |

## Bảng `teacher_verification_logs`

| STT | Tên | Kiểu dữ liệu | Độ dài | Không để trống | Khóa chính | Ghi chú |
|---|---|---|---|---|---|---|
| 1 | id | bigint | 20 | X | PK | Khóa chính, tự tăng |
| 2 | teacher_id | bigint | 20 | X | FK | Khóa ngoại giảng viên (users.id) |
| 3 | admin_id | bigint | 20 |  | FK |  |
| 4 | certificate_id | bigint | 20 |  | FK |  |
| 5 | action | varchar | 255 | X |  |  |
| 6 | old_status | varchar | 255 |  |  |  |
| 7 | new_status | varchar | 255 |  |  |  |
| 8 | reason | text |  |  |  |  |
| 9 | metadata | json |  |  |  |  |
| 10 | created_at | timestamp |  |  |  | Thời điểm tạo bản ghi |
| 11 | updated_at | timestamp |  |  |  | Thời điểm cập nhật bản ghi |

## Bảng `draft_revisions`

| STT | Tên | Kiểu dữ liệu | Độ dài | Không để trống | Khóa chính | Ghi chú |
|---|---|---|---|---|---|---|
| 1 | id | bigint | 20 | X | PK | Khóa chính, tự tăng |
| 2 | revisionable_type | varchar | 255 | X |  |  |
| 3 | revisionable_id | bigint | 20 | X |  |  |
| 4 | revision_number | int | 11 | X |  |  |
| 5 | snapshot_data | json |  | X |  |  |
| 6 | content_hash | char | 64 | X |  |  |
| 7 | idempotency_key | char | 64 |  |  | Unique |
| 8 | reason | varchar | 32 | X |  |  |
| 9 | created_by | bigint | 20 | X | FK |  |
| 10 | parent_revision_id | bigint | 20 |  | FK |  |
| 11 | created_at | timestamp |  |  |  | Thời điểm tạo bản ghi |
| 12 | updated_at | timestamp |  |  |  | Thời điểm cập nhật bản ghi |

## Bảng `quiz_course_attachments`

| STT | Tên | Kiểu dữ liệu | Độ dài | Không để trống | Khóa chính | Ghi chú |
|---|---|---|---|---|---|---|
| 1 | id | bigint | 20 | X | PK | Khóa chính, tự tăng |
| 2 | quiz_id | bigint | 20 | X | FK | Khóa ngoại tới quizzes.id |
| 3 | course_id | bigint | 20 | X | FK | Khóa ngoại tới courses.id |
| 4 | module_id | bigint | 20 |  | FK | Khóa ngoại tới course_modules.id |
| 5 | after_lesson_id | bigint | 20 |  | FK |  |
| 6 | position | varchar | 255 | X |  |  |
| 7 | created_at | timestamp |  |  |  | Thời điểm tạo bản ghi |
| 8 | updated_at | timestamp |  |  |  | Thời điểm cập nhật bản ghi |
| 9 | order | int | 11 | X |  |  |
| 10 | is_active | tinyint | 1 | X |  |  |

## Bảng `ai_generation_logs`

| STT | Tên | Kiểu dữ liệu | Độ dài | Không để trống | Khóa chính | Ghi chú |
|---|---|---|---|---|---|---|
| 1 | id | bigint | 20 | X | PK | Khóa chính, tự tăng |
| 2 | instructor_id | bigint | 20 | X | FK |  |
| 3 | quiz_id | bigint | 20 |  | FK | Khóa ngoại tới quizzes.id |
| 4 | feature | varchar | 255 | X |  |  |
| 5 | prompt_tokens | int | 11 | X |  |  |
| 6 | completion_tokens | int | 11 | X |  |  |
| 7 | raw_response | json |  |  |  |  |
| 8 | status | varchar | 255 | X |  | Trạng thái bản ghi |
| 9 | error_message | text |  |  |  |  |
| 10 | created_at | timestamp |  |  |  | Thời điểm tạo bản ghi |
| 11 | updated_at | timestamp |  |  |  | Thời điểm cập nhật bản ghi |

## Bảng `user_quiz_attempt_answers`

| STT | Tên | Kiểu dữ liệu | Độ dài | Không để trống | Khóa chính | Ghi chú |
|---|---|---|---|---|---|---|
| 1 | id | bigint | 20 | X | PK | Khóa chính, tự tăng |
| 2 | user_quiz_attempt_id | bigint | 20 | X | FK |  |
| 3 | question_id | bigint | 20 | X | FK | Khóa ngoại tới questions.id |
| 4 | question_type | varchar | 255 | X |  |  |
| 5 | user_answer | longtext |  |  |  |  |
| 6 | is_correct | tinyint | 1 |  |  | Đáp án đúng |
| 7 | score | float |  | X |  |  |
| 8 | max_score | float |  | X |  |  |
| 9 | feedback | text |  |  |  |  |
| 10 | ai_analysis | json |  |  |  |  |
| 11 | grading_status | varchar | 255 | X |  |  |
| 12 | created_at | timestamp |  |  |  | Thời điểm tạo bản ghi |
| 13 | updated_at | timestamp |  |  |  | Thời điểm cập nhật bản ghi |
| 14 | selected_answer_ids | json |  |  |  |  |

## Bảng `user_streaks`

| STT | Tên | Kiểu dữ liệu | Độ dài | Không để trống | Khóa chính | Ghi chú |
|---|---|---|---|---|---|---|
| 1 | id | bigint | 20 | X | PK | Khóa chính, tự tăng |
| 2 | user_id | bigint | 20 | X | FK | Khóa ngoại tới users.id |
| 3 | current_streak | int | 11 | X |  | Chuỗi ngày học hiện tại |
| 4 | longest_streak | int | 11 | X |  |  |
| 5 | freeze_count | int | 11 | X |  |  |
| 6 | last_checkin_date | date |  |  |  |  |
| 7 | created_at | timestamp |  |  |  | Thời điểm tạo bản ghi |
| 8 | updated_at | timestamp |  |  |  | Thời điểm cập nhật bản ghi |

## Bảng `ai_generated_quizzes`

| STT | Tên | Kiểu dữ liệu | Độ dài | Không để trống | Khóa chính | Ghi chú |
|---|---|---|---|---|---|---|
| 1 | id | bigint | 20 | X | PK | Khóa chính, tự tăng |
| 2 | user_id | bigint | 20 | X |  | Khóa ngoại tới users.id |
| 3 | title | varchar | 255 | X |  | Tiêu đề |
| 4 | topic | varchar | 255 | X |  |  |
| 5 | difficulty | varchar | 255 | X |  |  |
| 6 | questions_count | int | 11 | X |  |  |
| 7 | time_limit_minutes | int | 11 | X |  |  |
| 8 | passing_percentage | int | 11 | X |  |  |
| 9 | description | text |  |  |  | Mô tả |
| 10 | questions_data | json |  | X |  |  |
| 11 | user_answers | json |  |  |  |  |
| 12 | score | int | 11 |  |  |  |
| 13 | correct_count | int | 11 |  |  |  |
| 14 | is_completed | tinyint | 1 | X |  | Đã hoàn thành |
| 15 | created_at | timestamp |  |  |  | Thời điểm tạo bản ghi |
| 16 | updated_at | timestamp |  |  |  | Thời điểm cập nhật bản ghi |

## Bảng `revenue_allocations`

| STT | Tên | Kiểu dữ liệu | Độ dài | Không để trống | Khóa chính | Ghi chú |
|---|---|---|---|---|---|---|
| 1 | id | bigint | 20 | X | PK | Khóa chính, tự tăng |
| 2 | order_id | bigint | 20 | X | FK | Khóa ngoại tới orders.id |
| 3 | order_item_id | bigint | 20 |  | FK |  |
| 4 | course_id | bigint | 20 | X | FK | Khóa ngoại tới courses.id |
| 5 | student_id | bigint | 20 | X | FK |  |
| 6 | instructor_id | bigint | 20 | X | FK |  |
| 7 | original_price | decimal | 12,2 | X |  |  |
| 8 | discount_amount | decimal | 12,2 | X |  |  |
| 9 | paid_amount | decimal | 12,2 | X |  |  |
| 10 | platform_fee_percent | decimal | 5,2 | X |  |  |
| 11 | platform_fee_amount | decimal | 12,2 | X |  |  |
| 12 | instructor_percent | decimal | 5,2 | X |  |  |
| 13 | instructor_amount | decimal | 12,2 | X |  |  |
| 14 | status | varchar | 255 | X |  | Trạng thái bản ghi |
| 15 | refund_deadline | timestamp |  | X |  |  |
| 16 | unlocked_at | timestamp |  |  |  |  |
| 17 | refunded_at | timestamp |  |  |  |  |
| 18 | created_at | timestamp |  |  |  | Thời điểm tạo bản ghi |
| 19 | updated_at | timestamp |  |  |  | Thời điểm cập nhật bản ghi |
| 20 | partnership_tier | varchar | 20 |  |  | Hạng hợp tác: standard hoặc exclusive |

## Bảng `lesson_attachments`

| STT | Tên | Kiểu dữ liệu | Độ dài | Không để trống | Khóa chính | Ghi chú |
|---|---|---|---|---|---|---|
| 1 | id | bigint | 20 | X | PK | Khóa chính, tự tăng |
| 2 | lesson_id | bigint | 20 | X | FK | Khóa ngoại tới lessons.id |
| 3 | uploaded_by | bigint | 20 |  | FK |  |
| 4 | display_name | varchar | 255 | X |  |  |
| 5 | original_name | varchar | 255 | X |  |  |
| 6 | mime_type | varchar | 150 | X |  |  |
| 7 | extension | varchar | 10 | X |  |  |
| 8 | size_bytes | bigint | 20 | X |  |  |
| 9 | r2_key | varchar | 255 | X |  | Unique |
| 10 | created_at | timestamp |  |  |  | Thời điểm tạo bản ghi |
| 11 | updated_at | timestamp |  |  |  | Thời điểm cập nhật bản ghi |

## Bảng `ai_daily_quota_usages`

| STT | Tên | Kiểu dữ liệu | Độ dài | Không để trống | Khóa chính | Ghi chú |
|---|---|---|---|---|---|---|
| 1 | id | bigint | 20 | X | PK | Khóa chính, tự tăng |
| 2 | user_id | bigint | 20 | X | FK | Khóa ngoại tới users.id |
| 3 | feature | varchar | 64 | X |  |  |
| 4 | usage_date | date |  | X |  |  |
| 5 | used | int | 11 | X |  |  |
| 6 | created_at | timestamp |  |  |  | Thời điểm tạo bản ghi |
| 7 | updated_at | timestamp |  |  |  | Thời điểm cập nhật bản ghi |

## Bảng `student_payment_methods`

| STT | Tên | Kiểu dữ liệu | Độ dài | Không để trống | Khóa chính | Ghi chú |
|---|---|---|---|---|---|---|
| 1 | id | bigint | 20 | X | PK | Khóa chính, tự tăng |
| 2 | user_id | bigint | 20 | X | FK | Khóa ngoại tới users.id |
| 3 | provider | varchar | 20 | X |  | Nhà cung cấp / cổng |
| 4 | holder_name | varchar | 255 | X |  | Chủ tài khoản |
| 5 | account_number | varchar | 255 | X |  | Số tài khoản / số ví (ẩn trên API, chỉ trả last4) |
| 6 | bank_name | varchar | 255 |  |  | Tên ngân hàng |
| 7 | is_default | tinyint | 1 | X |  | Tài khoản thanh toán mặc định |
| 8 | created_at | timestamp |  |  |  | Thời điểm tạo bản ghi |
| 9 | updated_at | timestamp |  |  |  | Thời điểm cập nhật bản ghi |
