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

        $thumbnails = [
            'https://images.unsplash.com/photo-1517694712202-14dd9538aa97',
            'https://images.unsplash.com/photo-1555066931-4365d14bab8c',
            'https://images.unsplash.com/photo-1504639725590-34d0984388bd',
            'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
            'https://images.unsplash.com/photo-1551288049-bebda4e38f71',
            'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5',
            'https://images.unsplash.com/photo-1518770660439-4636190af475',
            'https://images.unsplash.com/photo-1531297172867-4f54131b79bd',
            'https://images.unsplash.com/photo-1519389950473-47ba0277781c',
            'https://images.unsplash.com/photo-1451187580459-43490279c0fa',
        ];

        for ($i = 1; $i <= 10; $i++) {
            $slug = 'ai-sample-course-' . $i;
            $title = 'AI Sample Course ' . $i;
            $thumb = $thumbnails[$i - 1];
            
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
                    'thumbnail' => $thumb,
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
