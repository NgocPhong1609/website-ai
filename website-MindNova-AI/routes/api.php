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
use App\Http\Controllers\Api\Student\DashboardController as StudentDashboardController;
use App\Http\Controllers\Api\Student\StudyPlanController as StudentStudyPlanController;
use App\Http\Controllers\Api\Student\PracticeController as StudentPracticeController;
use App\Http\Controllers\Api\Student\ProgressController as StudentProgressController;
use App\Http\Controllers\Api\Student\HistoryController as StudentHistoryController;

// Nhóm Dùng chung
use App\Http\Controllers\Api\RealtimeController;

// Nhóm Admin
use App\Http\Controllers\Api\Admin\AnalyticsController as AdminAnalyticsController;
use App\Http\Controllers\Api\Admin\ContentManagementController as AdminContentManagementController;
use App\Http\Controllers\Api\Admin\ModerationSupportController as AdminModerationSupportController;
use App\Http\Controllers\Api\Admin\SystemConfigController as AdminSystemConfigController;
use App\Http\Controllers\Api\Admin\UserManagementController as AdminUserManagementController;

// Nhóm Instructor (Giáo viên)
use App\Http\Controllers\Api\Instructor\CourseController;
use App\Http\Controllers\Api\Instructor\CourseModuleController;
use App\Http\Controllers\Api\Instructor\LessonController;
use App\Http\Controllers\Api\Instructor\MediaController;
use App\Http\Controllers\Api\Instructor\QuizController;
use App\Http\Controllers\Api\Instructor\StudentController as InstructorStudentController;
use App\Http\Controllers\Api\Instructor\DiscussionController as InstructorDiscussionController;
use App\Http\Controllers\Api\Instructor\NotificationController as InstructorNotificationController;
use App\Http\Controllers\Api\Instructor\RevenueController;
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
});

// -- API VNPay IPN (Webhooks) --
Route::get('/vnpay/ipn', [OrderController::class, 'vnpayIpn']);

// API Student Dashboard, Study Plan & Quizzes (Áp dụng cho mọi phiên học viên)
Route::get('/student/dashboard', [StudentDashboardController::class, 'overview']);
Route::get('/student/study-plan', [StudentStudyPlanController::class, 'overview']);
Route::get('/student/practice/overview', [StudentPracticeController::class, 'overview']);
Route::get('/student/progress/overview', [StudentProgressController::class, 'overview']);
Route::get('/student/history/overview', [StudentHistoryController::class, 'overview']);
Route::get('/student/courses/available', [StudentCourseController::class, 'getAvailableCourses']);
Route::get('/student/courses/detail/{id?}', [StudentCourseController::class, 'detail']);
Route::post('/student/study-plan/chat', [StudentStudyPlanController::class, 'chat'])->middleware('throttle:5,1');
Route::get('/student/lessons/{lesson}/quiz', [StudentQuizController::class, 'show']);
Route::post('/student/lessons/{lesson}/quiz/submit', [StudentQuizController::class, 'submit']);

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
    // 3. NHÓM API HỌC SINH (Student) - Các tiện ích cần xác thực
    // ==========================================
    Route::prefix('student')->group(function () {
        // TÍNH NĂNG AI TUTOR & Các tiện ích nâng cao khác
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
    Route::get('/students/export', [App\Http\Controllers\Api\Instructor\StudentController::class, 'exportCsv']);
    Route::get('/students/analytics', [App\Http\Controllers\Api\Instructor\StudentController::class, 'getAnalytics']);
    Route::get('/students/discussions', [App\Http\Controllers\Api\Instructor\StudentController::class, 'getDiscussions']);
    Route::post('/students/ai-notification/generate', [App\Http\Controllers\Api\Instructor\StudentController::class, 'generateAiNotification']);
    Route::post('/students/notifications', [App\Http\Controllers\Api\Instructor\StudentController::class, 'sendNotification']);
    Route::get('/students', [App\Http\Controllers\Api\Instructor\StudentController::class, 'index']);

    // Student Analytics Dashboard
    Route::get('/student-analytics/dashboard-metrics', [\App\Http\Controllers\Api\Instructor\StudentAnalyticsController::class, 'dashboardMetrics']);
    Route::get('/student-analytics/engagement-chart', [\App\Http\Controllers\Api\Instructor\StudentAnalyticsController::class, 'engagementChart']);
    
    Route::get('/students/{id}/progress', [App\Http\Controllers\Api\Instructor\StudentController::class, 'progress']);

    // Discussions
    Route::get('discussions', [InstructorDiscussionController::class, 'index']);
    Route::post('discussions/{discussion}/replies', [InstructorDiscussionController::class, 'reply']);
    Route::patch('discussions/{discussion}/pin', [InstructorDiscussionController::class, 'pin']);
    Route::patch('discussions/{discussion}/best-answer', [InstructorDiscussionController::class, 'bestAnswer']);
    Route::patch('discussions/{discussion}/resolved', [InstructorDiscussionController::class, 'toggleResolved']);
    Route::delete('discussions/{discussion}', [InstructorDiscussionController::class, 'destroy']);

    // Notifications
    Route::post('notifications', [InstructorNotificationController::class, 'store']);

    // Revenue & Finance
    Route::get('revenue/overview', [RevenueController::class, 'getOverview']);
    Route::post('revenue/withdraw', [RevenueController::class, 'requestWithdraw']);
    Route::get('revenue/transactions', [RevenueController::class, 'getTransactions']);
    Route::get('revenue/sales-report', [RevenueController::class, 'getSalesReport']);
});

// ==========================================
// 5. NHÓM API QUẢN TRỊ (Dành riêng cho Admin)
// ==========================================
Route::middleware(['auth:sanctum', 'role:admin'])->prefix('admin')->group(function () {

    // 1) User management
    Route::get('/users', [AdminUserManagementController::class, 'index']);
    Route::post('/users', [AdminUserManagementController::class, 'store']);
    Route::patch('/users/{id}/role', [AdminUserManagementController::class, 'updateRole']);
    Route::post('/users/{id}/lock', [AdminUserManagementController::class, 'lock']);
    Route::post('/users/{id}/unlock', [AdminUserManagementController::class, 'unlock']);
    Route::delete('/users/{id}', [AdminUserManagementController::class, 'destroy']);
    Route::get('/users/{id}/activity', [AdminUserManagementController::class, 'activity']);
    Route::get('/teachers/review-queue', [AdminUserManagementController::class, 'teacherQueue']);
    Route::patch('/teachers/{id}/verify', [AdminUserManagementController::class, 'verifyTeacher']);

    // 2) AI and system configuration
    Route::get('/ai-config', [AdminSystemConfigController::class, 'show']);
    Route::put('/ai-config', [AdminSystemConfigController::class, 'update']);

    // 3) Content management
    Route::get('/content/overview', [AdminContentManagementController::class, 'overview']);
    Route::get('/content/courses', [AdminContentManagementController::class, 'courses']);
    Route::get('/content/courses/{course}', [AdminContentManagementController::class, 'showCourse']);
    Route::patch('/content/courses/{course}/moderate', [AdminContentManagementController::class, 'moderateCourse']);
    Route::patch('/content/courses/{course}/restore-admin', [AdminContentManagementController::class, 'restoreCourse']);
    Route::delete('/content/courses/{course}', [AdminContentManagementController::class, 'removeCourse']);
    Route::get('/content/resources', [AdminContentManagementController::class, 'resources']);
    Route::post('/content/resources', [AdminContentManagementController::class, 'storeResource']);
    Route::put('/content/resources/{resource}', [AdminContentManagementController::class, 'updateResource']);
    Route::delete('/content/resources/{resource}', [AdminContentManagementController::class, 'deleteResource']);
    Route::get('/content/question-bank', [AdminContentManagementController::class, 'questionBank']);
    Route::patch('/content/question-bank/{question}', [AdminContentManagementController::class, 'updateQuestionCategory']);

    // 4) Analytics and reports
    Route::get('/analytics/dashboard', [AdminAnalyticsController::class, 'dashboard']);

    // 5) Moderation and support
    Route::get('/moderation/flags', [AdminModerationSupportController::class, 'flags']);
    Route::patch('/moderation/flags/{flag}', [AdminModerationSupportController::class, 'reviewFlag']);
    Route::get('/support/tickets', [AdminModerationSupportController::class, 'tickets']);
    Route::post('/support/tickets', [AdminModerationSupportController::class, 'createTicket']);
    Route::patch('/support/tickets/{ticket}', [AdminModerationSupportController::class, 'resolveTicket']);

});
