<?php 
$teacher = App\Models\User::firstOrCreate(['email' => 'teacher@example.com'], ['name' => 'Teacher', 'password' => bcrypt('password'), 'role' => 'teacher']);
$student = App\Models\User::firstOrCreate(['email' => 'student@example.com'], ['name' => 'Student', 'password' => bcrypt('password'), 'role' => 'student']);
$course = App\Models\Course::firstOrCreate(['title' => 'Test Course', 'teacher_id' => $teacher->id], ['description' => 'Test', 'price' => 0, 'status' => 'published']);
$module = App\Models\CourseModule::firstOrCreate(['course_id' => $course->id, 'title' => 'Test Module']);
$lesson = App\Models\Lesson::firstOrCreate(['module_id' => $module->id, 'title' => 'Test Lesson'], ['course_id' => $course->id, 'type' => 'video', 'duration_seconds' => 3600]);
$enrollment = App\Models\Enrollment::firstOrCreate(['user_id' => $student->id, 'course_id' => $course->id], ['enrolled_at' => null, 'progress_percentage' => 10, 'status' => 'active']);

Auth::login($teacher);
request()->setUserResolver(function () use ($teacher) { return $teacher; });

echo '--- Testing StudentController@index ---';
try {
    $c = app(App\Http\Controllers\Api\Instructor\StudentController::class);
    $c->index(request());
    echo 'OK';
} catch (\Throwable $e) {
    echo 'ERROR: ' . $e->getMessage() . ' in ' . $e->getFile() . ':' . $e->getLine();
}

echo '--- Testing StudentAnalyticsController@dashboardMetrics ---';
try {
    $ac = app(App\Http\Controllers\Api\Instructor\StudentAnalyticsController::class);
    $ac->dashboardMetrics();
    echo 'OK';
} catch (\Throwable $e) {
    echo 'ERROR: ' . $e->getMessage() . ' in ' . $e->getFile() . ':' . $e->getLine();
}

