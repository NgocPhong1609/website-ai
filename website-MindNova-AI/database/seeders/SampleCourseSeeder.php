<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SampleCourseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $category = DB::table('categories')->where('slug', 'ai-sample-course')->first();
        if (! $category) {
            $categoryId = DB::table('categories')->insertGetId([
                'name' => 'AI Sample Course',
                'slug' => 'ai-sample-course',
                'description' => 'Sample AI category for testing UI',
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        } else {
            $categoryId = $category->id;
        }

        $course = DB::table('courses')->where('slug', 'ai-sample-course')->first();
        if (! $course) {
            $versionId = DB::table('content_versions')->insertGetId([
                'versionable_type' => 'App\\Models\\Course',
                'versionable_id' => 1,
                'version_number' => 1,
                'snapshot_data' => json_encode([
                    'title' => 'AI Sample Course',
                    'slug' => 'ai-sample-course',
                    'description' => 'Sample AI course for UI testing',
                    'price' => 0,
                ]),
                'status' => 'published',
                'is_published' => true,
                'created_by' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            $courseId = DB::table('courses')->insertGetId([
                'teacher_id' => 1,
                'category_id' => $categoryId,
                'title' => 'AI Sample Course',
                'slug' => 'ai-sample-course',
                'description' => 'Khóa học AI mẫu cho kiểm tra UI.',
                'thumbnail' => '/images/sample-ai-course.jpg',
                'price' => 0,
                'level' => 'beginner',
                'status' => 'published',
                'published_version_id' => $versionId,
                'current_version' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            $moduleId = DB::table('course_modules')->insertGetId([
                'course_id' => $courseId,
                'title' => 'Module 1: Giới thiệu AI',
                'order' => 1,
                'status' => 'published',
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            DB::table('lessons')->insert([
                'module_id' => $moduleId,
                'course_id' => $courseId,
                'title' => 'Bài 1: Khái niệm AI',
                'type' => 'video',
                'content' => 'Nội dung bài học AI mẫu cho UI.',
                'video_url' => 'https://www.youtube.com/watch?v=example',
                'duration_minutes' => 15,
                'order' => 1,
                'status' => 'published',
                'published_version_id' => $versionId,
                'current_version' => 1,
                'is_free' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
