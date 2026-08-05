<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DiscussionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Lấy 1 giảng viên và 1 học sinh bất kỳ
        $teacher = \App\Models\User::where('role', 'instructor')->first();
        $student = \App\Models\User::where('role', 'student')->first();
        
        // Lấy 1 bài học bất kỳ thuộc khóa học của giảng viên
        $lesson = \App\Models\Lesson::whereHas('module.course', function ($query) use ($teacher) {
            $query->where('teacher_id', $teacher->id ?? 1);
        })->first();

        // Nếu không có dữ liệu thật, tạo fake data
        if (!$teacher) {
            $teacher = \App\Models\User::factory()->create(['role' => 'instructor', 'name' => 'Giảng viên Test']);
        }
        if (!$student) {
            $student = \App\Models\User::factory()->create(['role' => 'student', 'name' => 'Học viên Test']);
        }
        if (!$lesson) {
            // Tạo course, module, lesson
            $course = \App\Models\Course::factory()->create(['teacher_id' => $teacher->id]);
            $module = \App\Models\Module::factory()->create(['course_id' => $course->id]);
            $lesson = \App\Models\Lesson::factory()->create(['module_id' => $module->id]);
        }

        // Tạo Discussion 1: Cần chú ý (Chưa trả lời, đã ghim)
        $d1 = \App\Models\Discussion::create([
            'lesson_id' => $lesson->id,
            'student_id' => $student->id,
            'title' => 'Khó khăn khi áp dụng Material Tonal Layering',
            'content' => 'Thưa thầy, em đang gặp khó khăn khi áp dụng Material Tonal Layering. Làm sao để đảm bảo độ tương phản (Accessibility) khi sử dụng các bảng màu Surface và Surface-variant cạnh nhau?',
            'status' => 'open',
            'is_pinned' => true,
            'is_resolved' => false,
            'created_at' => now()->subHours(2),
            'updated_at' => now()->subHours(2),
        ]);

        // Tạo Discussion 2: Đã giải quyết và có câu trả lời hay nhất
        $d2 = \App\Models\Discussion::create([
            'lesson_id' => $lesson->id,
            'student_id' => $student->id,
            'title' => 'Sử dụng revalidatePath vs revalidateTag',
            'content' => 'Khi nào chúng ta nên gọi revalidatePath so với revalidateTag trong Next.js 15?',
            'status' => 'open',
            'is_pinned' => false,
            'is_resolved' => true,
            'created_at' => now()->subHours(5),
            'updated_at' => now()->subHours(5),
        ]);

        // Trả lời của giảng viên và được đánh dấu best answer
        \App\Models\DiscussionReply::create([
            'discussion_id' => $d2->id,
            'user_id' => $teacher->id,
            'content' => 'Câu hỏi rất hay! Em nên dùng revalidateTag khi muốn xóa cache các fetch request cụ thể, và dùng revalidatePath khi muốn xóa cache toàn bộ giao diện của một đường dẫn.',
            'is_best_answer' => true,
            'created_at' => now()->subHours(4),
            'updated_at' => now()->subHours(4),
        ]);

        // Tạo Discussion 3: Cần phản hồi (bị lỗi)
        \App\Models\Discussion::create([
            'lesson_id' => $lesson->id,
            'student_id' => $student->id,
            'title' => 'Lỗi flex gap bị wrap sai',
            'content' => 'Thầy ơi, thuộc tính flex gap của em bị wrap sai khi chuyển sang giao diện mobile trên Figma.',
            'status' => 'open',
            'is_pinned' => false,
            'is_resolved' => false,
            'created_at' => now()->subDay(),
            'updated_at' => now()->subDay(),
        ]);
    }
}
