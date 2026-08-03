<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// ==========================================
// IMPORT CÁC CONTROLLER TỪ ĐÚNG THƯ MỤC
// ==========================================

// Nhóm Auth
use App\Http\Controllers\Api\Auth\AuthController;

// Nhóm Student (Học sinh)
use App\Http\Controllers\Api\Student\UserController;
use App\Http\Controllers\Api\Student\OrderController;
use App\Http\Controllers\Api\Student\AiTutorController;
use App\Http\Controllers\Api\Student\CourseController as StudentCourseController;
use App\Http\Controllers\Api\StudentQuizController;

// Nhóm Dùng chung
use App\Http\Controllers\Api\RealtimeController;

// Nhóm Admin
use App\Http\Controllers\Api\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Api\Admin\UserController as AdminUserController;
use App\Http\Controllers\Api\Admin\CourseController as AdminCourseController;
use App\Http\Controllers\Api\Admin\CategoryController as AdminCategoryController;
use App\Http\Controllers\Api\Admin\NotificationController as AdminNotificationController;
use App\Http\Controllers\Api\Admin\InvoiceController as AdminInvoiceController;

// Nhóm Instructor (Giáo viên)
use App\Http\Controllers\Api\Instructor\CourseController;
use App\Http\Controllers\Api\Instructor\CourseModuleController;
use App\Http\Controllers\Api\Instructor\LessonController;
use App\Http\Controllers\Api\Student\DashboardController as StudentDashboardController;
use App\Http\Controllers\Api\Student\StudyPlanController as StudentStudyPlanController;

// ==========================================
// 1. NHÓM API PUBLIC (Không cần đăng nhập)
// ==========================================
Route::middleware('throttle:30,1')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/reset-password', [AuthController::class, 'resetPassword']);
    Route::get('/auth/google', [AuthController::class, 'redirectToGoogle']);
    Route::get('/auth/google/callback', [AuthController::class, 'handleGoogleCallback']);

    // API Student Dashboard Overview (Hỗ trợ cả guest dev và logged-in sanctum user)
    Route::get('/student/dashboard', [StudentDashboardController::class, 'overview']);
    Route::get('/student/study-plan', [StudentStudyPlanController::class, 'overview']);
    Route::post('/student/study-plan/chat', [StudentStudyPlanController::class, 'chat']);
});

// ==========================================
// 2. NHÓM API PRIVATE (Bắt buộc phải có Bearer Token)
// ==========================================
Route::middleware('auth:sanctum')->group(function () {

    // -- Đăng xuất --
    Route::post('/logout', [AuthController::class, 'logout']);

    // -- Gửi tin nhắn Realtime (Dùng chung) --
    Route::post('/realtime/send', [RealtimeController::class, 'send']);

    // -- Quản lý Hồ sơ Cá nhân --
    Route::prefix('profile')->group(function () {
        Route::get('/', [UserController::class, 'getProfile']);
        Route::post('/update', [UserController::class, 'updateProfile']);
        Route::post('/change-password', [UserController::class, 'changePassword']);
        Route::post('/avatar', [UserController::class, 'uploadAvatar']);
    });

    // -- Nhóm API Đơn hàng (Orders) --
    Route::get('/orders', [OrderController::class, 'index']);
    Route::post('/orders', [OrderController::class, 'store']);

    // ==========================================
    // 3. NHÓM API HỌC SINH (Student)
    // ==========================================
    Route::prefix('student')->group(function () {
        // TÍNH NĂNG AI TUTOR (PB-025)


        // Quiz
        Route::get('lessons/{lesson}/quiz', [StudentQuizController::class, 'show']);
        Route::post('lessons/{lesson}/quiz/submit', [StudentQuizController::class, 'submit']);
    });
});

// ==========================================
// 4. NHÓM API GIÁO VIÊN (Dành cho Teacher)
// ==========================================
Route::middleware(['auth:sanctum', 'role:teacher'])->prefix('instructor')->group(function () {

    // Khóa học
    Route::apiResource('courses', CourseController::class);
    Route::post('courses/{course}/thumbnail', [CourseController::class, 'uploadThumbnail']);
    Route::patch('courses/{course}/status', [CourseController::class, 'updateStatus']);
    Route::patch('courses/{course}/price', [CourseController::class, 'updatePrice']);

    // Modules
    Route::get('courses/{course}/modules', [CourseModuleController::class, 'index']);
    Route::get('modules/{module}', [CourseModuleController::class, 'show']);
    Route::post('courses/{course}/modules', [CourseModuleController::class, 'store']);
    Route::put('modules/{module}', [CourseModuleController::class, 'update']);
    Route::delete('modules/{module}', [CourseModuleController::class, 'destroy']);

    // Lessons
    Route::get('modules/{module}/lessons', [LessonController::class, 'index']);
    Route::get('lessons/{lesson}', [LessonController::class, 'show']);
    Route::post('modules/{module}/lessons', [LessonController::class, 'store']);
    Route::put('lessons/{lesson}', [LessonController::class, 'update']);
    Route::delete('lessons/{lesson}', [LessonController::class, 'destroy']);
    Route::post('lessons/{lesson}/video', [LessonController::class, 'uploadVideo']);
    Route::get('lessons/{lesson}/video-url', [LessonController::class, 'getVideoUrl']);
    Route::post('lessons/{lesson}/content-media', [LessonController::class, 'uploadContentMedia']);

    // Temporary Media
    Route::post('media/temp', [MediaController::class, 'uploadTemp']);
    Route::delete('media/temp/{media}', [MediaController::class, 'deleteTemp']);

    // Quiz (Instructor CRUD)
    Route::get('lessons/{lesson}/quiz', [QuizController::class, 'show']);
    Route::post('lessons/{lesson}/quiz', [QuizController::class, 'store']);
    Route::delete('lessons/{lesson}/quiz', [QuizController::class, 'destroy']);

    // Students
    Route::get('students', [InstructorStudentController::class, 'index']);
    Route::get('students/{student}/progress', [InstructorStudentController::class, 'progress']);

    // Discussions
    Route::get('discussions', [InstructorDiscussionController::class, 'index']);
    Route::post('discussions/{discussion}/replies', [InstructorDiscussionController::class, 'reply']);

    // Notifications
    Route::post('notifications', [InstructorNotificationController::class, 'store']);
});

// ==========================================
// 5. NHÓM API QUẢN TRỊ (Dành riêng cho Admin)
// ==========================================
Route::middleware(['auth:sanctum', 'role:admin'])->prefix('admin')->group(function () {

    Route::get('/overview', [AdminDashboardController::class, 'overview']);

    // Quản lý người dùng
    Route::get('/users', [AdminUserController::class, 'index']);
    Route::post('/users', [AdminUserController::class, 'store']);
    Route::post('/users/{id}/toggle-status', [AdminUserController::class, 'toggleStatus']);
    Route::delete('/users/{id}', [AdminUserController::class, 'destroy']);

    // Quản lý danh mục
    Route::get('/categories', [AdminCategoryController::class, 'index']);
    Route::post('/categories', [AdminCategoryController::class, 'store']);
    Route::put('/categories/{category}', [AdminCategoryController::class, 'update']);
    Route::delete('/categories/{category}', [AdminCategoryController::class, 'destroy']);

    // Quản lý khóa học
    Route::get('/courses', [AdminCourseController::class, 'index']);
    Route::post('/courses', [AdminCourseController::class, 'store']);
    Route::get('/courses/{course}', [AdminCourseController::class, 'show']);
    Route::put('/courses/{course}', [AdminCourseController::class, 'update']);
    Route::delete('/courses/{course}', [AdminCourseController::class, 'destroy']);

    // Quản lý hóa đơn
    Route::get('/invoices', [AdminInvoiceController::class, 'index']);

    // Email thông báo
    Route::post('/notifications/test-email', [AdminNotificationController::class, 'sendTestEmail']);

});
