<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\Course;
use App\Models\CourseModule;
use App\Models\Lesson;
use App\Models\Enrollment;
use App\Models\LessonCompletion;
use App\Models\Certificate;
use App\Models\ActivityLog;
use Carbon\Carbon;

echo "Bắt đầu tạo dữ liệu mẫu cho Analytics...\n";

// 1. Tìm hoặc tạo Instructor
$instructor = User::whereHas('roles', function($q) {
    $q->where('name', 'teacher');
})->first();

if (!$instructor) {
    $instructor = User::first();
    if (!$instructor) {
        $instructor = User::create([
            'name' => 'Instructor Test',
            'email' => 'instructor@example.com',
            'password' => bcrypt('password'),
        ]);
    }
}
echo "Sử dụng Instructor: {$instructor->name} (ID: {$instructor->id})\n";

// 2. Tìm hoặc tạo Khóa học của Instructor này
$course = Course::where('teacher_id', $instructor->id)->first();
if (!$course) {
    $course = Course::create([
        'teacher_id' => $instructor->id,
        'title' => 'Khóa học AI Foundation',
        'slug' => 'ai-foundation',
        'description' => 'Mô tả khóa học',
        'price' => 1000,
        'status' => 'published',
    ]);
}
echo "Khóa học: {$course->title} (ID: {$course->id})\n";

// 3. Tìm hoặc tạo Module và Lesson
$module = CourseModule::firstOrCreate(
    ['course_id' => $course->id],
    ['title' => 'Chuyên đề 1: Khởi động', 'order' => 1]
);

$lesson1 = Lesson::firstOrCreate(
    ['module_id' => $module->id, 'title' => 'Bài 1: Giới thiệu AI'],
    ['course_id' => $course->id, 'type' => 'video', 'duration_seconds' => 3600, 'order' => 1]
);
$lesson2 = Lesson::firstOrCreate(
    ['module_id' => $module->id, 'title' => 'Bài 2: Các khái niệm cơ bản'],
    ['course_id' => $course->id, 'type' => 'video', 'duration_seconds' => 7200, 'order' => 2]
);

// 4. Tạo Học viên mới
$students = [];
for ($i = 1; $i <= 5; $i++) {
    $student = User::firstOrCreate(
        ['email' => "student_analytic_{$i}@example.com"],
        ['name' => "Học viên Test {$i}", 'password' => bcrypt('password')]
    );
    $students[] = $student;
}

// 5. Tạo Enrollments, Completions, Certificates, ActivityLogs
foreach ($students as $index => $student) {
    // Gia nhập ngẫu nhiên trong 30 ngày qua
    $enrolledDate = Carbon::now()->subDays(rand(1, 29));
    
    $enrollment = Enrollment::firstOrCreate(
        ['user_id' => $student->id, 'course_id' => $course->id],
        ['enrolled_at' => $enrolledDate, 'progress_percentage' => rand(10, 100)]
    );

    // Một số học viên hoàn thành bài học
    if (rand(0, 1)) {
        LessonCompletion::firstOrCreate([
            'user_id' => $student->id,
            'lesson_id' => $lesson1->id
        ], [
            'completed_at' => Carbon::now()->subDays(rand(1, 10))
        ]);
    }
    if (rand(0, 1)) {
        LessonCompletion::firstOrCreate([
            'user_id' => $student->id,
            'lesson_id' => $lesson2->id
        ], [
            'completed_at' => Carbon::now()->subDays(rand(1, 10))
        ]);
    }

    // Một số học viên có chứng chỉ
    if (rand(0, 1)) {
        Certificate::firstOrCreate([
            'user_id' => $student->id,
            'course_id' => $course->id
        ], [
            'certificate_url' => 'http://example.com/cert.pdf',
            'issued_at' => Carbon::now()->subDays(rand(1, 5))
        ]);
    }

    // Tạo Activity Logs (Lịch sử hoạt động) cho 14 ngày qua
    // Để biểu đồ vẽ được
    for ($d = 0; $d <= 14; $d++) {
        $numActivities = rand(0, 5); // 0-5 hoạt động mỗi ngày
        for ($a = 0; $a < $numActivities; $a++) {
            $date = Carbon::now()->subDays($d)->startOfDay()->addHours(rand(8, 20));
            ActivityLog::create([
                'user_id' => $student->id,
                'action' => 'lesson_viewed',
                'subject_type' => 'App\Models\Lesson',
                'subject_id' => $lesson1->id,
                'created_at' => $date,
                'updated_at' => $date
            ]);
        }
    }
}

echo "Đã tạo xong dữ liệu mẫu thành công!\n";
