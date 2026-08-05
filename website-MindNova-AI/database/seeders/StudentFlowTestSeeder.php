<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\LessonCompletion;
use App\Models\UserQuizAttempt;
use App\Models\CourseModule;
use App\Models\Lesson;
use App\Models\Quiz;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class StudentFlowTestSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Đảm bảo có ít nhất 1 Course với Module, Lesson, Quiz
        $course = Course::first();
        if (!$course) {
            $course = Course::create([
                'title' => 'Khóa học Test AI & Fullstack',
                'description' => 'Khóa học dành cho kiểm thử luồng học viên',
                'price' => 0,
                'thumbnail' => 'https://images.unsplash.com/photo-1555066931-4365d14bab8c',
                'status' => 'published',
            ]);
        }

        $module = CourseModule::firstOrCreate(
            ['course_id' => $course->id],
            ['title' => 'Module 1: Nhập môn', 'order' => 1]
        );

        $lesson1 = Lesson::firstOrCreate(
            ['module_id' => $module->id, 'title' => 'Bài 1: Tổng quan'],
            ['content' => 'Nội dung bài 1', 'order' => 1, 'course_id' => $course->id]
        );

        $lesson2 = Lesson::firstOrCreate(
            ['module_id' => $module->id, 'title' => 'Bài 2: Thực hành'],
            ['content' => 'Nội dung bài 2', 'order' => 2, 'course_id' => $course->id]
        );

        $quiz = Quiz::firstOrCreate(
            ['lesson_id' => $lesson1->id],
            ['title' => 'Trắc nghiệm Bài 1', 'passing_score' => 60, 'time_limit_minutes' => 15]
        );

        // 2. Tạo User 1: Empty state (Không có khóa học nào)
        $user1 = User::firstOrCreate(
            ['email' => 'student.empty@mindnova.com'],
            ['name' => 'Tân Sinh Viên', 'password' => Hash::make('password123'), 'role' => 'student']
        );
        // Xóa mọi dữ liệu cũ nếu có
        Enrollment::where('user_id', $user1->id)->delete();
        LessonCompletion::where('user_id', $user1->id)->delete();
        UserQuizAttempt::where('user_id', $user1->id)->delete();

        // 3. Tạo User 2: In-progress state (Đang học dở 35%)
        $user2 = User::firstOrCreate(
            ['email' => 'student.progress@mindnova.com'],
            ['name' => 'Học Viên Chăm Chỉ', 'password' => Hash::make('password123'), 'role' => 'student']
        );
        // Xóa dữ liệu cũ
        Enrollment::where('user_id', $user2->id)->delete();
        LessonCompletion::where('user_id', $user2->id)->delete();
        UserQuizAttempt::where('user_id', $user2->id)->delete();

        Enrollment::create([
            'user_id' => $user2->id,
            'course_id' => $course->id,
            'progress_percentage' => 35,
            'enrolled_at' => Carbon::now()->subDays(5),
            'status' => 'enrolled'
        ]);
        LessonCompletion::create([
            'user_id' => $user2->id,
            'lesson_id' => $lesson1->id,
            'completed_at' => Carbon::now()->subDays(1)
        ]);
        UserQuizAttempt::create([
            'user_id' => $user2->id,
            'quiz_id' => $quiz->id,
            'score' => 75,
            'accuracy' => 75,
            'time_taken_seconds' => 600,
            'status' => 'passed',
            'created_at' => Carbon::now()->subHours(5)
        ]);

        // 4. Tạo User 3: Completed state (Đã học xong 100%)
        $user3 = User::firstOrCreate(
            ['email' => 'student.completed@mindnova.com'],
            ['name' => 'Học Viên Xuất Sắc', 'password' => Hash::make('password123'), 'role' => 'student']
        );
        // Xóa dữ liệu cũ
        Enrollment::where('user_id', $user3->id)->delete();
        LessonCompletion::where('user_id', $user3->id)->delete();
        UserQuizAttempt::where('user_id', $user3->id)->delete();

        Enrollment::create([
            'user_id' => $user3->id,
            'course_id' => $course->id,
            'progress_percentage' => 100,
            'enrolled_at' => Carbon::now()->subDays(30),
            'status' => 'completed'
        ]);
        LessonCompletion::create([
            'user_id' => $user3->id,
            'lesson_id' => $lesson1->id,
            'completed_at' => Carbon::now()->subDays(10)
        ]);
        LessonCompletion::create([
            'user_id' => $user3->id,
            'lesson_id' => $lesson2->id,
            'completed_at' => Carbon::now()->subDays(9)
        ]);
        UserQuizAttempt::create([
            'user_id' => $user3->id,
            'quiz_id' => $quiz->id,
            'score' => 100,
            'accuracy' => 100,
            'time_taken_seconds' => 450,
            'status' => 'passed',
            'created_at' => Carbon::now()->subDays(9)
        ]);

        $this->command->info('Dữ liệu test đã được sinh ra:');
        $this->command->info('User 1 (Trống): student.empty@mindnova.com / password123');
        $this->command->info('User 2 (Đang học): student.progress@mindnova.com / password123');
        $this->command->info('User 3 (Đã xong): student.completed@mindnova.com / password123');
    }
}
