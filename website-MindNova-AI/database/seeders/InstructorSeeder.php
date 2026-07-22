<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Course;
use App\Models\CourseClass;
use App\Models\CourseModule;
use App\Models\Discussion;
use App\Models\DiscussionReply;
use App\Models\Enrollment;
use App\Models\Lesson;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class InstructorSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Khởi tạo Roles nếu chưa có
        $adminRole = Role::firstOrCreate(
            ['name' => 'admin'],
            ['display_name' => 'Quản trị viên', 'description' => 'Quản trị toàn quyền hệ thống']
        );
        $teacherRole = Role::firstOrCreate(
            ['name' => 'teacher'],
            ['display_name' => 'Giáo viên', 'description' => 'Người tạo, quản lý khóa học và xem tiến độ học sinh']
        );
        $studentRole = Role::firstOrCreate(
            ['name' => 'student'],
            ['display_name' => 'Học sinh', 'description' => 'Người tham gia học tập và làm quiz']
        );

        // 2. Tạo Tài khoản Giảng viên (Teacher)
        $teacher = User::updateOrCreate(
            ['email' => 'teacher@mindnova.ai'],
            [
                'name' => 'Alex Rivera',
                'password' => Hash::make('password'),
                'status' => 'active',
                'email_verified_at' => now(),
            ]
        );
        $teacher->roles()->syncWithoutDetaching([$teacherRole->id]);

        // Tạo thêm 1 Giảng viên phụ
        $teacher2 = User::updateOrCreate(
            ['email' => 'alex.teacher@mindnova.ai'],
            [
                'name' => 'Dr. Alex Rivera',
                'password' => Hash::make('password'),
                'status' => 'active',
                'email_verified_at' => now(),
            ]
        );
        $teacher2->roles()->syncWithoutDetaching([$teacherRole->id]);

        // 3. Tạo Các Tài khoản Học viên (Students)
        $student1 = User::updateOrCreate(
            ['email' => 'hieu.student@mindnova.ai'],
            [
                'name' => 'Hiếu Nguyễn',
                'password' => Hash::make('password'),
                'status' => 'active',
                'email_verified_at' => now(),
            ]
        );
        $student1->roles()->syncWithoutDetaching([$studentRole->id]);

        $student2 = User::updateOrCreate(
            ['email' => 'long.student@mindnova.ai'],
            [
                'name' => 'Trần Hoàng Long',
                'password' => Hash::make('password'),
                'status' => 'active',
                'email_verified_at' => now(),
            ]
        );
        $student2->roles()->syncWithoutDetaching([$studentRole->id]);

        $student3 = User::updateOrCreate(
            ['email' => 'anh.student@mindnova.ai'],
            [
                'name' => 'Lê Minh Anh',
                'password' => Hash::make('password'),
                'status' => 'active',
                'email_verified_at' => now(),
            ]
        );
        $student3->roles()->syncWithoutDetaching([$studentRole->id]);

        // 4. Tạo Danh mục khóa học (Categories)
        $catWeb = Category::firstOrCreate(
            ['slug' => 'lap-trinh-web'],
            ['name' => 'Lập trình Web', 'description' => 'Các khóa học lập trình Frontend và Backend chuyên sâu']
        );
        $catAI = Category::firstOrCreate(
            ['slug' => 'tri-tue-nhan-tao-ai'],
            ['name' => 'Trí tuệ nhân tạo (AI)', 'description' => 'Machine Learning, Deep Learning và Ứng dụng AI']
        );
        $catDesign = Category::firstOrCreate(
            ['slug' => 'thiet-ke-do-hoa-ui-ux'],
            ['name' => 'Thiết kế UI/UX', 'description' => 'Thiết kế giao diện và trải nghiệm người dùng chuyên nghiệp']
        );

        // 5. Tạo Khóa học (Courses) cho Teacher
        $course1 = Course::updateOrCreate(
            ['slug' => 'lap-trinh-nextjs-15-react-fullstack'],
            [
                'teacher_id' => $teacher->id,
                'category_id' => $catWeb->id,
                'title' => 'Lập trình Next.js 15 & React Fullstack Chuyên Sâu',
                'description' => 'Xây dựng ứng dụng Web hiện đại với Next.js App Router, TailwindCSS và RESTful API Backend.',
                'thumbnail' => 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80',
                'price' => 1290000,
                'level' => 'intermediate',
                'status' => 'published',
            ]
        );

        $course2 = Course::updateOrCreate(
            ['slug' => 'xay-dung-ung-dung-ai-python-openai'],
            [
                'teacher_id' => $teacher->id,
                'category_id' => $catAI->id,
                'title' => 'Xây dựng ứng dụng AI với Python & OpenAI API',
                'description' => 'Tích hợp mô hình AI, RAG và LLM Agent vào sản phẩm phần mềm thực tế.',
                'thumbnail' => 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80',
                'price' => 1590000,
                'level' => 'advanced',
                'status' => 'published',
            ]
        );

        $course3 = Course::updateOrCreate(
            ['slug' => 'thiet-ke-giao-dien-ui-ux-figma'],
            [
                'teacher_id' => $teacher->id,
                'category_id' => $catDesign->id,
                'title' => 'Thiết kế Giao diện UI/UX chuyên nghiệp với Figma',
                'description' => 'Hướng dẫn thiết kế Design System, Wireframe và Prototype chuẩn xu hướng.',
                'thumbnail' => 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&q=80',
                'price' => 890000,
                'level' => 'beginner',
                'status' => 'draft',
            ]
        );

        // 6. Tạo Chương học (Course Modules)
        $mod1 = CourseModule::updateOrCreate(
            ['course_id' => $course1->id, 'title' => 'Chương 1: Khởi động dự án Next.js 15'],
            ['order' => 1]
        );
        $mod2 = CourseModule::updateOrCreate(
            ['course_id' => $course1->id, 'title' => 'Chương 2: Server Components & Data Fetching'],
            ['order' => 2]
        );
        $mod3 = CourseModule::updateOrCreate(
            ['course_id' => $course1->id, 'title' => 'Chương 3: Tích hợp RESTful API Backend'],
            ['order' => 3]
        );

        $modAI1 = CourseModule::updateOrCreate(
            ['course_id' => $course2->id, 'title' => 'Chương 1: Tổng quan về LLMs & OpenAI API'],
            ['order' => 1]
        );

        // 7. Tạo Bài học (Lessons)
        $les1 = Lesson::updateOrCreate(
            ['course_id' => $course1->id, 'title' => 'Bài 1: Cấu trúc thư mục dự án App Router'],
            [
                'module_id' => $mod1->id,
                'type' => 'video',
                'content' => 'Hướng dẫn chi tiết kiến trúc thư mục app/ trong Next.js 15.',
                'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'duration_minutes' => 15,
                'order' => 1,
                'is_free' => true,
                'status' => 'published',
            ]
        );

        $les2 = Lesson::updateOrCreate(
            ['course_id' => $course1->id, 'title' => 'Bài 2: Tối ưu hóa Fonts, Images & Metadata'],
            [
                'module_id' => $mod1->id,
                'type' => 'video',
                'content' => 'Cách sử dụng next/font và next/image để tối ưu hóa SEO và hiệu năng trang.',
                'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'duration_minutes' => 20,
                'order' => 2,
                'is_free' => false,
                'status' => 'published',
            ]
        );

        $les3 = Lesson::updateOrCreate(
            ['course_id' => $course1->id, 'title' => 'Bài 3: React Server Components vs Client Components'],
            [
                'module_id' => $mod2->id,
                'type' => 'article',
                'content' => 'Phân tích điểm khác biệt giữa Server Components và Client Components trong React 19.',
                'duration_minutes' => 25,
                'order' => 1,
                'is_free' => false,
                'status' => 'published',
            ]
        );

        // 8. Tạo Lớp học (Course Classes)
        $class1 = CourseClass::updateOrCreate(
            ['class_name' => 'Lớp NextJS-K01'],
            [
                'course_id' => $course1->id,
                'teacher_id' => $teacher->id,
                'start_date' => '2026-07-01',
                'end_date' => '2026-09-30',
                'schedule' => 'Thứ 2 - 4 - 6 (19h30 - 21h30)',
                'status' => 'ongoing',
            ]
        );

        $class2 = CourseClass::updateOrCreate(
            ['class_name' => 'Lớp AI-K02'],
            [
                'course_id' => $course2->id,
                'teacher_id' => $teacher->id,
                'start_date' => '2026-07-15',
                'end_date' => '2026-10-15',
                'schedule' => 'Thứ 3 - 5 - 7 (19h30 - 21h30)',
                'status' => 'ongoing',
            ]
        );

        // 9. Tạo Đăng ký học viên (Enrollments)
        Enrollment::updateOrCreate(
            ['user_id' => $student1->id, 'course_id' => $course1->id],
            [
                'course_class_id' => $class1->id,
                'progress_percentage' => 75,
                'status' => 'enrolled',
                'enrolled_at' => now()->subDays(10),
            ]
        );

        Enrollment::updateOrCreate(
            ['user_id' => $student2->id, 'course_id' => $course1->id],
            [
                'course_class_id' => $class1->id,
                'progress_percentage' => 40,
                'status' => 'enrolled',
                'enrolled_at' => now()->subDays(5),
            ]
        );

        Enrollment::updateOrCreate(
            ['user_id' => $student3->id, 'course_id' => $course2->id],
            [
                'course_class_id' => $class2->id,
                'progress_percentage' => 90,
                'status' => 'completed',
                'enrolled_at' => now()->subDays(20),
            ]
        );

        // 10. Tạo Hỏi đáp / Thảo luận (Discussions & Replies)
        $disc1 = Discussion::updateOrCreate(
            ['title' => 'Cách dùng Server Actions để revalidate path?'],
            [
                'lesson_id' => $les1->id,
                'student_id' => $student1->id,
                'content' => 'Thầy ơi, khi thực hiện revalidatePath trong Server Action thì client tự render lại dữ liệu như thế nào ạ?',
                'status' => 'answered',
            ]
        );

        DiscussionReply::updateOrCreate(
            ['discussion_id' => $disc1->id, 'user_id' => $teacher->id],
            [
                'content' => 'Chào bạn, Server Actions khi revalidatePath sẽ xóa cache của route đó ở server và gửi dữ liệu payload mới xuống để client tự động cập nhật DOM nhé!',
            ]
        );

        Discussion::updateOrCreate(
            ['title' => 'Lỗi kết nối API từ Next.js Server Component'],
            [
                'lesson_id' => $les2->id,
                'student_id' => $student2->id,
                'content' => 'Khi em fetch API từ Server Component bị báo timeout hoặc connection refused thì nguyên nhân là gì ạ?',
                'status' => 'open',
            ]
        );
    }
}
