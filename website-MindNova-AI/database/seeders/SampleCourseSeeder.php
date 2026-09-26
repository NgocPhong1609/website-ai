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

        for ($i = 1; $i <= 10; $i++) {
            $slug = 'ai-sample-course-' . $i;
            $title = 'AI Sample Course ' . $i;
            
            $course = DB::table('courses')->where('slug', $slug)->first();
            if (! $course) {
                // Tạm thời lấy ID tiếp theo (auto increment)
                $nextCourseId = DB::table('courses')->max('id') + 1;

                $versionId = DB::table('content_versions')->insertGetId([
                    'versionable_type' => 'App\\Models\\Course',
                    'versionable_id' => $nextCourseId,
                    'version_number' => 1,
                    'snapshot_data' => json_encode([
                        'title' => $title,
                        'slug' => $slug,
                        'description' => 'Sample AI course ' . $i . ' for UI testing',
                        'price' => rand(100000, 500000),
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
                    'title' => $title,
                    'slug' => $slug,
                    'description' => 'Khóa học AI mẫu số ' . $i . ' cho kiểm tra UI.',
                    'thumbnail' => '/images/sample-ai-course.jpg',
                    'price' => rand(100000, 500000),
                    'level' => 'beginner',
                    'status' => 'published',
                    'published_version_id' => $versionId,
                    'current_version' => 1,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                for ($m = 1; $m <= 3; $m++) {
                    $moduleId = DB::table('course_modules')->insertGetId([
                        'course_id' => $courseId,
                        'title' => 'Module ' . $m . ': Nội dung ' . $m,
                        'order' => $m,
                        'status' => 'published',
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);

                    for ($l = 1; $l <= 3; $l++) {
                        DB::table('lessons')->insert([
                            'module_id' => $moduleId,
                            'course_id' => $courseId,
                            'title' => 'Bài ' . $l . ' của Module ' . $m,
                            'type' => 'video',
                            'content' => 'Nội dung bài học mẫu.',
                            'video_url' => 'https://www.youtube.com/watch?v=example',
                            'duration_seconds' => rand(300, 1500),
                            'order' => $l,
                            'status' => 'published',
                            'published_version_id' => $versionId,
                            'current_version' => 1,
                            'is_free' => ($l == 1),
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]);
                    }
                }
            }
        }
    }
}
