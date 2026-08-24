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
use App\Http\Controllers\Api\Student\StreakController;
use App\Http\Controllers\Api\Student\AiQuizGeneratorController;
use App\Http\Controllers\Api\Student\AnalyzeLessonController;
use App\Http\Controllers\Api\Student\SelfAssessmentController;
use App\Http\Controllers\Api\Student\PaymentController as StudentPaymentController;
use App\Http\Controllers\Api\Student\ReviewController as StudentReviewController;
use App\Http\Controllers\Api\Student\LessonController as StudentLessonController;
use App\Http\Controllers\Api\Student\DiscussionController as StudentDiscussionController;

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
use App\Http\Controllers\Api\Instructor\TeacherProfileController;
use App\Http\Controllers\Api\Instructor\DraftRevisionController;
use App\Http\Controllers\Api\Instructor\QuizGeneratorController;
use App\Http\Controllers\Api\Instructor\StudentAnalyticsController;
use App\Http\Controllers\Api\Instructor\OrderController as InstructorOrderController;
use App\Http\Controllers\Api\Instructor\ReviewController as InstructorReviewController;

// ==========================================
// 1. NHÓM API PUBLIC (Không cần đăng nhập)
// ==========================================
Route::middleware('throttle:30,1')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/forgot-password/verify-otp', [AuthController::class, 'verifyResetOtp']);
    Route::post('/reset-password', [AuthController::class, 'resetPassword']);
    Route::get('/auth/google', [AuthController::class, 'redirectToGoogle']);
    Route::get('/auth/google/callback', [AuthController::class, 'handleGoogleCallback']);
});

// -- API Payment Callbacks & Webhooks --
Route::get('/vnpay/ipn', [OrderController::class, 'vnpayIpn']);
Route::get('/student/payments/callback/{provider}', [StudentPaymentController::class, 'callback']);
Route::get('/student/payment/vnpay-ipn', [OrderController::class, 'vnpayIpn']);
Route::post('/student/payment/momo-ipn', [OrderController::class, 'momoIpn']);

// -- Nhóm AI Quiz Generator & Review --
Route::prefix('student/practice')->group(function () {
    Route::post('/generate-ai-quiz', [AiQuizGeneratorController::class, 'generate']);
    Route::get('/ai-quizzes/history', [AiQuizGeneratorController::class, 'history']);
    Route::get('/ai-quizzes/{id}', [AiQuizGeneratorController::class, 'show']);
    Route::post('/ai-quizzes/{id}/submit', [AiQuizGeneratorController::class, 'submit']);
    Route::delete('/ai-quizzes/{id}', [AiQuizGeneratorController::class, 'destroy']);
});

// -- API Student Public Routes --
Route::prefix('student')->group(function () {
    Route::get('/dashboard', [StudentDashboardController::class, 'overview']);
    Route::get('/study-plan', [StudentStudyPlanController::class, 'overview']);
    Route::get('/practice/overview', [StudentPracticeController::class, 'overview']);
    Route::get('/progress/overview', [StudentProgressController::class, 'overview']);
    Route::get('/history/overview', [StudentHistoryController::class, 'overview']);
    Route::get('/courses/available', [StudentCourseController::class, 'getAvailableCourses']);
    Route::get('/courses/detail/{id?}', [StudentCourseController::class, 'detail']);
    Route::get('/courses/{course}/reviews', [StudentReviewController::class, 'index']);
    Route::post('/study-plan/chat', [StudentStudyPlanController::class, 'chat'])->middleware('throttle:10,1');
    Route::post('/onboarding', [OnboardingController::class, 'store']);
    Route::get('/available-topics', [OnboardingController::class, 'getAvailableTopics']);
    Route::post('/analyze-lesson', [AnalyzeLessonController::class, 'analyze']);
    Route::post('/courses/{courseId}/self-assessment/generate', [SelfAssessmentController::class, 'generate']);
    Route::post('/self-assessment/submit', [SelfAssessmentController::class, 'submit']);
});

// ==========================================
// 2. NHÓM API PRIVATE (Bắt buộc phải có Bearer Token)
// ==========================================
Route::middleware('auth:sanctum')->group(function () {
    \Illuminate\Support\Facades\Broadcast::routes(['middleware' => ['auth:sanctum']]);

    // -- Đăng xuất --
    Route::post('/logout', [AuthController::class, 'logout']);

    // API Điểm danh
    Route::post('/student/check-in', [StreakController::class, 'checkIn']);

    // -- AI hỗ trợ học tập (Dùng chung) --
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
        Route::post('/change-password/request-otp', [UserController::class, 'requestChangePasswordOtp']);
        Route::post('/change-password', [UserController::class, 'changePassword']);
        Route::post('/avatar', [UserController::class, 'uploadAvatar']);
    });

    // -- Nhóm API Đơn hàng (Orders) --
    Route::get('/orders', [OrderController::class, 'index']);
    Route::post('/orders', [OrderController::class, 'store']);

    // ==========================================
    // 3. NHÓM API HỌC SINH (Student Authenticated Actions)
    // ==========================================
    Route::prefix('student')->group(function () {
        // Enrolled Courses
        Route::get('/courses/enrolled', [StudentCourseController::class, 'enrolledCourses']);

        // Check Order Status by Transaction ID
        Route::get('/orders/transaction/{transactionId}', [OrderController::class, 'showByTransaction']);

        // TÍNH NĂNG AI TUTOR & Đánh giá khóa học
        Route::post('/ai-tutor/chat', [AiTutorController::class, 'streamChat']);
        Route::post('/courses/{course}/reviews', [StudentReviewController::class, 'store']);
        Route::put('/courses/{course}/reviews/{review}', [StudentReviewController::class, 'update']);
        Route::delete('/courses/{course}/reviews/{review}', [StudentReviewController::class, 'destroy']);

        // Quiz bài học
        Route::get('lessons/{lesson}/quiz', [StudentQuizController::class, 'show']);
        Route::post('lessons/{lesson}/quiz/submit', [StudentQuizController::class, 'submit']);

        // Lesson — Video URL, Hoàn thành, Kiểm tra đáp án Quiz
        Route::get('lessons/{lesson}/video-url', [StudentLessonController::class, 'videoUrl']);
        Route::post('lessons/{lesson}/complete', [StudentLessonController::class, 'complete']);
        Route::post('lessons/{lesson}/quiz/check-answer', [StudentLessonController::class, 'checkAnswer']);

        // Notifications
        Route::get('/notifications', [StudentNotificationController::class, 'index']);
        Route::patch('/notifications/{notification}/read', [StudentNotificationController::class, 'markRead']);
        Route::delete('/notifications/read', [StudentNotificationController::class, 'deleteRead']);

        // Discussions (Thảo luận bài học)
        Route::get('lessons/{lesson}/discussions', [StudentDiscussionController::class, 'index']);
        Route::post('lessons/{lesson}/discussions', [StudentDiscussionController::class, 'store']);
        Route::put('lessons/{lesson}/discussions/{discussion}', [StudentDiscussionController::class, 'update']);
        Route::delete('lessons/{lesson}/discussions/{discussion}', [StudentDiscussionController::class, 'destroy']);
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
    Route::get('courses/{course}/health', [CourseController::class, 'health']);
    Route::put('courses/{course}/draft', [DraftRevisionController::class, 'saveCourseDraft']);
    Route::get('courses/{course}/draft-revisions', [DraftRevisionController::class, 'index']);
    Route::get('courses/{course}/draft-revisions/{revision}/diff', [DraftRevisionController::class, 'diff']);
    Route::post('courses/{course}/draft-revisions/{revision}/restore', [DraftRevisionController::class, 'restore']);

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
    Route::get('student-analytics/dashboard-metrics', [StudentAnalyticsController::class, 'dashboardMetrics']);
    Route::get('student-analytics/engagement-chart', [StudentAnalyticsController::class, 'engagementChart']);

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
    Route::get('orders', [InstructorOrderController::class, 'index']);

    // Reviews
    Route::get('reviews', [InstructorReviewController::class, 'index']);

    // AI Quiz Generator (Instructor Standalone & Attachment)
    Route::get('ai-quiz', [QuizGeneratorController::class, 'index']);
    Route::post('ai-quiz/generate', [QuizGeneratorController::class, 'generate']);
    Route::post('ai-quiz/regenerate-question', [QuizGeneratorController::class, 'regenerateQuestion']);
    Route::post('ai-quiz/store', [QuizGeneratorController::class, 'store']);
    Route::get('ai-quiz/{quiz}', [QuizGeneratorController::class, 'show']);
    Route::put('ai-quiz/{quiz}', [QuizGeneratorController::class, 'update']);
    Route::delete('ai-quiz/{quiz}', [QuizGeneratorController::class, 'destroy']);
    Route::post('ai-quiz/{quiz}/attach', [QuizGeneratorController::class, 'attach']);

    // AI Course Outline
    Route::post('courses/ai-outline/generate', [CourseOutlineController::class, 'generate']);
    Route::post('courses/{course}/ai-outline/save', [CourseOutlineController::class, 'save']);

    // Content Review Workflow
    Route::post('courses/{course}/submit-review', [InstructorContentReviewController::class, 'submitForReview']);
    Route::get('courses/{course}/versions', [InstructorContentReviewController::class, 'versions']);
    Route::get('courses/{course}/submissions', [InstructorContentReviewController::class, 'submissions']);
    Route::get('submissions/{submission}', [InstructorContentReviewController::class, 'showSubmission']);
    Route::post('lessons/{lesson}/request-deletion', [InstructorContentReviewController::class, 'requestLessonDeletion']);

    // Teacher Profile & Verification
    Route::get('profile', [TeacherProfileController::class, 'getProfile']);
    Route::put('profile', [TeacherProfileController::class, 'updateProfile']);
    Route::post('avatar', [TeacherProfileController::class, 'uploadAvatar']);
    Route::get('certificates', [TeacherProfileController::class, 'getCertificates']);
    Route::post('certificates', [TeacherProfileController::class, 'storeCertificate']);
    Route::put('certificates/{id}', [TeacherProfileController::class, 'updateCertificate']);
    Route::delete('certificates/{id}', [TeacherProfileController::class, 'destroyCertificate']);
    Route::post('verification/request', [TeacherProfileController::class, 'submitVerificationRequest']);
    Route::get('verification/status', [TeacherProfileController::class, 'getVerificationStatus']);
});

// ==========================================
// 5. NHÓM API QUẢN TRỊ (Dành riêng cho Admin)
// ==========================================
Route::middleware(['auth:sanctum', 'role:admin'])->prefix('admin')->group(function () {

    // 1) User management & Teacher Verification Review
    Route::get('/users', [AdminUserManagementController::class, 'index']);
    Route::post('/users', [AdminUserManagementController::class, 'store']);
    Route::patch('/users/{id}/role', [AdminUserManagementController::class, 'updateRole']);
    Route::post('/users/{id}/lock', [AdminUserManagementController::class, 'lock']);
    Route::post('/users/{id}/unlock', [AdminUserManagementController::class, 'unlock']);
    Route::delete('/users/{id}', [AdminUserManagementController::class, 'destroy']);
    Route::get('/users/{id}/activity', [AdminUserManagementController::class, 'activity']);
    Route::get('/teachers/review-queue', [AdminUserManagementController::class, 'teacherQueue']);
    Route::get('/teacher-approvals', [AdminUserManagementController::class, 'teacherQueue']);
    Route::get('/teacher-approvals/{id}', [AdminUserManagementController::class, 'showTeacherVerificationDetail']);
    Route::patch('/teachers/{id}/verify', [AdminUserManagementController::class, 'verifyTeacher']);
    Route::post('/teachers/{id}/revoke-verification', [AdminUserManagementController::class, 'revokeVerification']);
    Route::post('/certificates/{certId}/approve', [AdminUserManagementController::class, 'approveCertificate']);
    Route::post('/certificates/{certId}/reject', [AdminUserManagementController::class, 'rejectCertificate']);
    Route::get('/certificates/evidence/{evidenceId}', [AdminUserManagementController::class, 'getEvidenceSignedUrl']);

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
// 6. DEV / TEST ENDPOINTS (Protected)
// ==========================================
if (app()->environment('local', 'testing')) {
    Route::middleware(['auth:sanctum'])->group(function () {
        Route::post('/dev/orders/{orderId}/complete', [OrderController::class, 'devCompleteOrder']);
        Route::post('/dev/orders/{orderId}/refund', [OrderController::class, 'devRefundOrder']);
    });
}