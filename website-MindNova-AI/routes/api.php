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
use App\Http\Controllers\Api\Student\OnboardingController;
use App\Http\Controllers\Api\Student\DashboardController as StudentDashboardController;
use App\Http\Controllers\Api\Student\StudyPlanController as StudentStudyPlanController;
use App\Http\Controllers\Api\Student\PracticeController as StudentPracticeController;
use App\Http\Controllers\Api\Student\ProgressController as StudentProgressController;
use App\Http\Controllers\Api\Student\HistoryController as StudentHistoryController;
use App\Http\Controllers\Api\Student\NotificationController as StudentNotificationController;

// Nhóm Dùng chung
use App\Http\Controllers\Api\RealtimeController;
use App\Http\Controllers\Api\ChatController;

// Nhóm Admin
use App\Http\Controllers\Api\Admin\AnalyticsController as AdminAnalyticsController;
use App\Http\Controllers\Api\Admin\ContentManagementController as AdminContentManagementController;
use App\Http\Controllers\Api\Admin\ModerationSupportController as AdminModerationSupportController;
use App\Http\Controllers\Api\Admin\SystemConfigController as AdminSystemConfigController;
use App\Http\Controllers\Api\Admin\UserManagementController as AdminUserManagementController;
use App\Http\Controllers\Api\Admin\ReviewController as AdminReviewController;
use App\Http\Controllers\Api\Admin\CouponController as AdminCouponController;
use App\Http\Controllers\Api\Admin\DashboardController as AdminDashboardController;

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
use App\Http\Controllers\Api\Instructor\CourseOutlineController;
use App\Http\Controllers\Api\Instructor\ContentReviewController as InstructorContentReviewController;

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

// Payment Webhooks / IPN (Public để bên thứ 3 gọi)
Route::get('/vnpay/ipn', [OrderController::class, 'vnpayIpn']);
Route::get('/student/payment/vnpay-ipn', [OrderController::class, 'vnpayIpn']);
Route::post('/student/payment/momo-ipn', [OrderController::class, 'momoIpn']);

// Public Student Routes (Khóa học công khai & Đánh giá)
Route::get('/student/courses/available', [StudentCourseController::class, 'getAvailableCourses']);
Route::get('/student/courses/detail/{id?}', [StudentCourseController::class, 'detail']);
Route::get('/student/courses/{course}/reviews', [\App\Http\Controllers\Api\Student\ReviewController::class, 'index']);

// ==========================================
// 2. NHÓM API PRIVATE (Bắt buộc phải có Bearer Token)
// ==========================================
Route::middleware('auth:sanctum')->group(function () {
    \Illuminate\Support\Facades\Broadcast::routes(['middleware' => ['auth:sanctum']]);

    // -- Đăng xuất --
    Route::post('/logout', [AuthController::class, 'logout']);

    // -- AI hỗ trợ học tập (Học sinh, Giáo viên, Admin đều dùng chung) --
    Route::post('/ai-chat', [AiTutorController::class, 'chat']);

    // -- Gửi tin nhắn Realtime (Dùng chung) --
    Route::post('/realtime/send', [RealtimeController::class, 'send']);

    // -- Chat & Messaging System --
    Route::prefix('chat')->group(function () {
        Route::get('/unread-count', [ChatController::class, 'unreadCount']);
        Route::get('/conversations', [ChatController::class, 'index']);
        Route::get('/conversations/{id}/messages', [ChatController::class, 'messages']);
        Route::post('/conversations/{id}/messages', [ChatController::class, 'sendMessage']);
        Route::post('/conversations/{id}/messages/{messageId}/recall', [ChatController::class, 'recallMessage']);
        Route::post('/conversations/{id}/read', [ChatController::class, 'markAsRead']);
    });

    // -- Quản lý Hồ sơ Cá nhân --
    Route::prefix('profile')->group(function () {
        Route::get('/', [UserController::class, 'getProfile']);
        Route::post('/update', [UserController::class, 'updateProfile']);
        Route::post('/change-password', [UserController::class, 'changePassword']);
        Route::post('/avatar', [UserController::class, 'uploadAvatar']);
        Route::post('/settings', [UserController::class, 'saveSettings']);
    });

    // -- Nhóm API Đơn hàng (Orders) --
    Route::get('/orders', [OrderController::class, 'index']);
    Route::post('/orders', [OrderController::class, 'store']);

    // ==========================================
    // 3. NHÓM API HỌC SINH (Student - Yêu cầu Auth)
    // ==========================================
    Route::prefix('student')->group(function () {

        // Onboarding & AI Analyze
        Route::post('/onboarding', [OnboardingController::class, 'store']);
        Route::get('/available-topics', [OnboardingController::class, 'getAvailableTopics']);
        Route::post('/analyze-lesson', [\App\Http\Controllers\Api\Student\AnalyzeLessonController::class, 'analyze']);

        // Dashboard, Study Plan & Overview
        Route::get('/dashboard', [StudentDashboardController::class, 'overview']);
        Route::get('/study-plan', [StudentStudyPlanController::class, 'overview']);
        Route::get('/practice/overview', [StudentPracticeController::class, 'overview']);
        Route::get('/progress/overview', [StudentProgressController::class, 'overview']);
        Route::get('/history/overview', [StudentHistoryController::class, 'overview']);
        Route::post('/study-plan/chat', [StudentStudyPlanController::class, 'chat'])->middleware('throttle:5,1');

        // Enrolled Courses & Orders
        Route::get('/courses/enrolled', [\App\Http\Controllers\Api\Student\CourseController::class, 'enrolledCourses']);
        Route::get('/orders/transaction/{transactionId}', [OrderController::class, 'showByTransaction']);

        // AI Tutor & Reviews
        Route::post('/ai-tutor/chat', [AiTutorController::class, 'streamChat']);
        Route::post('/courses/{course}/reviews', [\App\Http\Controllers\Api\Student\ReviewController::class, 'store']);
        Route::put('/courses/{course}/reviews/{review}', [\App\Http\Controllers\Api\Student\ReviewController::class, 'update']);
        Route::delete('/courses/{course}/reviews/{review}', [\App\Http\Controllers\Api\Student\ReviewController::class, 'destroy']);

        // Quiz
        Route::get('lessons/{lesson}/quiz', [StudentQuizController::class, 'show']);
        Route::post('lessons/{lesson}/quiz/submit', [StudentQuizController::class, 'submit']);

        // Lesson — Video URL, Completion, Quiz Answer Check
        Route::get('lessons/{lesson}/video-url', [\App\Http\Controllers\Api\Student\LessonController::class, 'videoUrl']);
        Route::post('lessons/{lesson}/complete', [\App\Http\Controllers\Api\Student\LessonController::class, 'complete']);
        Route::post('lessons/{lesson}/quiz/check-answer', [\App\Http\Controllers\Api\Student\LessonController::class, 'checkAnswer']);

        // Notifications
        Route::get('/notifications', [StudentNotificationController::class, 'index']);
        Route::patch('/notifications/{notification}/read', [StudentNotificationController::class, 'markRead']);
        Route::delete('/notifications/read', [StudentNotificationController::class, 'deleteRead']);

        // Discussions
        Route::get('lessons/{lesson}/discussions', [\App\Http\Controllers\Api\Student\DiscussionController::class, 'index']);
        Route::post('lessons/{lesson}/discussions', [\App\Http\Controllers\Api\Student\DiscussionController::class, 'store']);
        Route::put('lessons/{lesson}/discussions/{discussion}', [\App\Http\Controllers\Api\Student\DiscussionController::class, 'update']);
        Route::delete('lessons/{lesson}/discussions/{discussion}', [\App\Http\Controllers\Api\Student\DiscussionController::class, 'destroy']);
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
    Route::get('students/export', [InstructorStudentController::class, 'exportCsv']);
    Route::get('students/analytics', [InstructorStudentController::class, 'getAnalytics']);
    Route::get('students/discussions', [InstructorStudentController::class, 'getDiscussions']);
    Route::post('students/ai-notification/generate', [InstructorStudentController::class, 'generateAiNotification']);
    Route::post('students/notifications', [InstructorStudentController::class, 'sendNotification']);
    Route::get('students/notification-options', [InstructorStudentController::class, 'getNotificationOptions']);
    Route::get('students', [InstructorStudentController::class, 'index']);
    Route::get('students/{student}/progress', [InstructorStudentController::class, 'progress']);

    // Student Analytics Dashboard
    Route::get('student-analytics/dashboard-metrics', [\App\Http\Controllers\Api\Instructor\StudentAnalyticsController::class, 'dashboardMetrics']);
    Route::get('student-analytics/engagement-chart', [\App\Http\Controllers\Api\Instructor\StudentAnalyticsController::class, 'engagementChart']);

    // Discussions
    Route::get('discussions', [InstructorDiscussionController::class, 'index']);
    Route::post('discussions/{discussion}/replies', [InstructorDiscussionController::class, 'reply']);

    // Notifications
    Route::post('notifications', [InstructorNotificationController::class, 'store']);

    // Revenue & Finance
    Route::get('revenue/overview', [RevenueController::class, 'getOverview']);
    Route::post('revenue/withdraw', [RevenueController::class, 'requestWithdraw']);
    Route::get('revenue/transactions', [RevenueController::class, 'getTransactions']);
    Route::get('revenue/sales-report', [RevenueController::class, 'getSalesReport']);

    // Orders
    Route::get('orders', [\App\Http\Controllers\Api\Instructor\OrderController::class, 'index']);

    // Reviews
    Route::get('reviews', [\App\Http\Controllers\Api\Instructor\ReviewController::class, 'index']);

    // AI Course Outline
    Route::post('courses/ai-outline/generate', [CourseOutlineController::class, 'generate']);
    Route::post('courses/{course}/ai-outline/save', [CourseOutlineController::class, 'save']);

    // Content Review Workflow
    Route::post('courses/{course}/submit-review', [InstructorContentReviewController::class, 'submitForReview']);
    Route::get('courses/{course}/versions', [InstructorContentReviewController::class, 'versions']);
    Route::get('courses/{course}/submissions', [InstructorContentReviewController::class, 'submissions']);
    Route::get('submissions/{submission}', [InstructorContentReviewController::class, 'showSubmission']);
    Route::post('lessons/{lesson}/request-deletion', [InstructorContentReviewController::class, 'requestLessonDeletion']);
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
    Route::get('/teacher-approvals', [AdminUserManagementController::class, 'teacherQueue']);
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
    Route::get('/revenue', [AdminDashboardController::class, 'revenue']);

    // 4.5) Coupons
    Route::apiResource('/coupons', AdminCouponController::class);

    // 5) Moderation and support
    Route::get('/moderation/flags', [AdminModerationSupportController::class, 'flags']);
    Route::patch('/moderation/flags/{flag}', [AdminModerationSupportController::class, 'reviewFlag']);
    Route::get('/support/tickets', [AdminModerationSupportController::class, 'tickets']);
    Route::post('/support/tickets', [AdminModerationSupportController::class, 'createTicket']);
    Route::patch('/support/tickets/{ticket}', [AdminModerationSupportController::class, 'resolveTicket']);

    // 6) Content Review Workflow
    Route::get('/reviews', [AdminReviewController::class, 'index']);
    Route::get('/reviews/deletion-requests', [AdminReviewController::class, 'deletionRequests']);
    Route::get('/reviews/audit-log', [AdminReviewController::class, 'auditLog']);
    Route::get('/reviews/{submission}', [AdminReviewController::class, 'show']);
    Route::get('/reviews/{submission}/diff', [AdminReviewController::class, 'diff']);
    Route::patch('/reviews/{submission}/start', [AdminReviewController::class, 'startReview']);
    Route::patch('/reviews/{submission}/approve', [AdminReviewController::class, 'approve']);
    Route::patch('/reviews/{submission}/reject', [AdminReviewController::class, 'reject']);
    Route::patch('/reviews/{submission}/request-fixes', [AdminReviewController::class, 'requestFixes']);
    Route::post('/reviews/{submission}/comments', [AdminReviewController::class, 'addComment']);
    Route::patch('/reviews/deletion-requests/{deletionRequest}/approve', [AdminReviewController::class, 'approveDeletion']);
    Route::patch('/reviews/deletion-requests/{deletionRequest}/reject', [AdminReviewController::class, 'rejectDeletion']);
});

// ==========================================
// 6. DEV / TEST ENDPOINTS
// ==========================================
if (app()->environment('local', 'testing')) {
    Route::post('/dev/orders/{orderId}/complete', [App\Http\Controllers\Api\Student\OrderController::class, 'devCompleteOrder']);
    Route::post('/dev/orders/{orderId}/refund', [App\Http\Controllers\Api\Student\OrderController::class, 'devRefundOrder']);
}