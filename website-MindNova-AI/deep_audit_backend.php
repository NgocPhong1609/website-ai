<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use App\Models\User;
use App\Models\Course;
use App\Models\Quiz;
use App\Models\Lesson;

echo "=== 1. CONTROLLERS & AUTHORIZATION POLICIES AUDIT ===\n";
$routes = Route::getRoutes();
$missingAuthRoutes = [];
$apiRoutesCount = 0;

foreach ($routes as $route) {
    $uri = $route->uri();
    if (str_starts_with($uri, 'api/')) {
        $apiRoutesCount++;
        $middleware = $route->middleware();
        $hasAuth = in_array('auth:sanctum', $middleware) || in_array('auth', $middleware);
        if (!$hasAuth && !in_array($uri, ['api/login', 'api/register', 'api/reset-password', 'api/student/payment/momo-ipn', 'api/student/payment/vnpay-ipn', 'api/vnpay/ipn'])) {
            $missingAuthRoutes[] = [
                'methods' => implode('|', $route->methods()),
                'uri' => $uri,
                'action' => $route->getActionName()
            ];
        }
    }
}
echo "Total API Routes: {$apiRoutesCount}\n";
echo "Public API Routes missing auth: " . count($missingAuthRoutes) . "\n";
foreach ($missingAuthRoutes as $r) {
    echo "  [{$r['methods']}] {$r['uri']} -> {$r['action']}\n";
}

echo "\n=== 2. ESSAY GRADING LOGIC AUDIT ===\n";
$essayAttempts = DB::table('user_quiz_attempt_answers')
    ->where('question_type', 'essay')
    ->get();
echo "Total Essay Answers submitted: " . count($essayAttempts) . "\n";
foreach ($essayAttempts as $ea) {
    echo "Answer ID {$ea->id} | Attempt {$ea->user_quiz_attempt_id} | Q_ID {$ea->question_id} | Status: {$ea->grading_status} | Score: {$ea->score}/{$ea->max_score}\n";
}

echo "\n=== 3. QUIZ SCORE NORMALIZATION CHECK ===\n";
$attempts = DB::table('user_quiz_attempts')->get();
$invalidScores = [];
foreach ($attempts as $att) {
    if ($att->score_10 < 0 || $att->score_10 > 10) {
        $invalidScores[] = $att;
    }
}
echo "Total Quiz Attempts: " . count($attempts) . "\n";
echo "Invalid score_10 (>10 or <0): " . count($invalidScores) . "\n";

echo "\n=== 4. COURSE & LESSON COUNT DISCREPANCY CHECK ===\n";
$courses = Course::all();
foreach ($courses as $c) {
    $modCount = $c->modules()->count();
    $lesCount = DB::table('course_modules')
        ->join('lessons', 'course_modules.id', '=', 'lessons.module_id')
        ->where('course_modules.course_id', $c->id)
        ->count();
    $pubLesCount = DB::table('course_modules')
        ->join('lessons', 'course_modules.id', '=', 'lessons.module_id')
        ->where('course_modules.course_id', $c->id)
        ->where('lessons.status', 'published')
        ->count();
    echo "Course ID {$c->id} '{$c->title}' -> Modules: {$modCount}, Total Lessons: {$lesCount}, Published Lessons: {$pubLesCount}\n";
}

echo "\n=== 5. UNATTACHED/ORPHAN QUIZZES CHECK ===\n";
$orphanQuizzes = DB::table('quizzes')
    ->whereNull('course_id')
    ->whereNull('lesson_id')
    ->whereNull('module_id')
    ->get();
echo "Orphan Quizzes (no course/module/lesson directly in quiz table): " . count($orphanQuizzes) . "\n";
foreach ($orphanQuizzes as $oq) {
    $attCount = DB::table('quiz_course_attachments')->where('quiz_id', $oq->id)->count();
    echo "  Quiz ID {$oq->id} '{$oq->title}' -> Attachments count in pivot table: {$attCount}\n";
}

echo "\n=== 6. WEBSOCKET / REVERB CONFIG CHECK ===\n";
echo "BROADCAST_DRIVER: " . env('BROADCAST_DRIVER', 'null') . "\n";
echo "REVERB_APP_KEY: " . env('REVERB_APP_KEY', 'null') . "\n";
echo "REVERB_HOST: " . env('REVERB_HOST', 'null') . "\n";
echo "REVERB_PORT: " . env('REVERB_PORT', 'null') . "\n";
echo "REVERB_SCHEME: " . env('REVERB_SCHEME', 'null') . "\n";
