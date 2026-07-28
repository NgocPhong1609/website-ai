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
// 1. NHÓM API PUBLIC
// ==========================================
Route::middleware('throttle:5,1')->group(function () {

    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/reset-password', [AuthController::class, 'resetPassword']);

    Route::get('/auth/google', [AuthController::class, 'redirectToGoogle']);
    Route::get('/auth/google/callback', [AuthController::class, 'handleGoogleCallback']);

});

// ==========================================
// 2. API CẦN ĐĂNG NHẬP
// ==========================================
Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);

    Route::prefix('profile')->group(function () {

        Route::get('/', [UserController::class, 'getProfile']);
        Route::post('/update', [UserController::class, 'updateProfile']);
        Route::post('/change-password', [UserController::class, 'changePassword']);
        Route::post('/avatar', [UserController::class, 'uploadAvatar']);

        Route::get('/orders', [OrderController::class, 'index']);
        Route::post('/orders', [OrderController::class, 'store']);
    });

    // ==========================================
    // ADMIN
    // ==========================================
    Route::middleware('role:admin')->prefix('admin')->group(function () {

        Route::get('/overview', [AdminDashboardController::class, 'overview']);

        Route::get('/users', [AdminUserController::class, 'index']);
        Route::post('/users', [AdminUserController::class, 'store']);
        Route::post('/users/{id}/toggle-status', [AdminUserController::class, 'toggleStatus']);
        Route::delete('/users/{id}', [AdminUserController::class, 'destroy']);

        Route::post('/courses', [\App\Http\Controllers\Api\Admin\CourseController::class, 'store']);
    });

    // ==========================================
    // TEACHER
    // ==========================================
    Route::middleware('role:teacher')->prefix('teacher')->group(function () {

        // Reserved

    });

    // ==========================================
    // INSTRUCTOR
    // ==========================================

    Route::middleware('role:teacher')->prefix('instructor')->group(function () {

        Route::apiResource('courses', CourseController::class);

        Route::post('courses/{course}/thumbnail', [CourseController::class, 'uploadThumbnail']);
        Route::patch('courses/{course}/status', [CourseController::class, 'updateStatus']);
        Route::patch('courses/{course}/price', [CourseController::class, 'updatePrice']);

        // ================= Modules =================

        Route::get('courses/{course}/modules', [CourseModuleController::class, 'index']);

        Route::get('modules/{module}', [CourseModuleController::class, 'show']);

        Route::post('courses/{course}/modules', [CourseModuleController::class, 'store']);

        Route::put('modules/{module}', [CourseModuleController::class, 'update']);

        Route::delete('modules/{module}', [CourseModuleController::class, 'destroy']);

        // ================= Lessons =================

        Route::get('modules/{module}/lessons', [LessonController::class, 'index']);

        Route::get('lessons/{lesson}', [LessonController::class, 'show']);

        Route::post('modules/{module}/lessons', [LessonController::class, 'store']);

        Route::put('lessons/{lesson}', [LessonController::class, 'update']);

        Route::delete('lessons/{lesson}', [LessonController::class, 'destroy']);

        Route::post('lessons/{lesson}/video', [LessonController::class, 'uploadVideo']);

    });

});