<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Api\Admin\UserController as AdminUserController;

use App\Http\Controllers\Api\Instructor\CourseController;
use App\Http\Controllers\Api\Instructor\CourseModuleController;
use App\Http\Controllers\Api\Instructor\LessonController;

// ==========================================
// 1. NHÓM API PUBLIC (Không cần đăng nhập)
// ==========================================
Route::middleware('throttle:5,1')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/reset-password', [AuthController::class, 'resetPassword']);

    // ĐẢM BẢO 2 DÒNG NÀY ĐÃ CÓ VÀ NẰM Ở ĐÂY:
    Route::get('/auth/google', [AuthController::class, 'redirectToGoogle']);
    Route::get('/auth/google/callback', [AuthController::class, 'handleGoogleCallback']);
});

// ==========================================
// 2. NHÓM API PRIVATE (Bắt buộc phải có Bearer Token)
// ==========================================
Route::middleware('auth:sanctum')->group(function () {

    // -- Đăng xuất --
    Route::post('/logout', [AuthController::class, 'logout']);

    // -- Quản lý Hồ sơ Cá nhân (Học sinh & Giáo viên dùng chung) --
    Route::prefix('profile')->group(function () {
        Route::get('/', [UserController::class, 'getProfile']);
        Route::post('/update', [UserController::class, 'updateProfile']);
        Route::post('/change-password', [UserController::class, 'changePassword']);
        Route::post('/avatar', [UserController::class, 'uploadAvatar']);
        // -- Nhóm API Đơn hàng (Orders) --
        Route::get('/orders', [OrderController::class, 'index']);
        Route::post('/orders', [OrderController::class, 'store']);
    });

    // ==========================================
    // 3. NHÓM API QUẢN TRỊ (Dành riêng cho Admin)
    // ==========================================
    Route::middleware('role:admin')->prefix('admin')->group(function () {

        Route::get('/overview', [AdminDashboardController::class, 'overview']);

        // Quản lý người dùng
        Route::get('/users', [AdminUserController::class, 'index']);
        Route::post('/users', [AdminUserController::class, 'store']);
        Route::post('/users/{id}/toggle-status', [AdminUserController::class, 'toggleStatus']);
        Route::delete('/users/{id}', [AdminUserController::class, 'destroy']);

        // Quản lý khóa học
        Route::post('/courses', [\App\Http\Controllers\Api\Admin\CourseController::class, 'store']);

    });

    // ==========================================
    // 4. NHÓM API GIÁO VIÊN (Dành cho Teacher & Admin)
    // ==========================================
    Route::middleware('role:teacher,admin')->prefix('teacher')->group(function () {
        // Nơi này sau này bạn sẽ thêm các Route như: tạo khóa học, sửa bài giảng...
    });

    Route::middleware(['auth:sanctum', 'role:teacher'])->prefix('instructor')->group(function () {
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
    });


});
