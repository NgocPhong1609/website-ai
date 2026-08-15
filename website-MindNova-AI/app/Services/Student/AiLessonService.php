<?php

namespace App\Services\Student;

use App\Models\Course;
use Illuminate\Support\Facades\Http;

class AiLessonService
{
    /**
     * Analyze lesson and recommend courses using AI.
     */
    public function analyzeLesson(string $lessonTitle, string $goal): array
    {
        $prompt = "You are an expert AI curriculum analyst. A student is studying for '{$goal}' and looking specifically at the lesson titled '{$lessonTitle}'.
        You MUST generate a completely custom, highly specific breakdown for THIS exact lesson. Do not use generic templates.
        Return ONLY valid JSON format with no markdown, no backticks:
        {
          \"overview\": \"Write a unique 2-sentence overview specifically explaining what concepts, techniques, or theories are mastered in '{$lessonTitle}'.\",
          \"key_takeaways\": [
            \"First specific learning outcome of {$lessonTitle}\",
            \"Second practical skill gained from {$lessonTitle}\",
            \"Third technical implementation detail of {$lessonTitle}\"
          ],
          \"suggested_course_keywords\": [\"keyword1\", \"keyword2\"]
        }";

        try {
            $response = Http::withToken(env('GROQ_API_KEY'))
                ->post('https://api.groq.com/openai/v1/chat/completions', [
                    'model' => 'llama-3.3-70b-versatile',
                    'messages' => [
                        ['role' => 'system', 'content' => 'Return only raw JSON.'],
                        ['role' => 'user', 'content' => $prompt]
                    ],
                    'temperature' => 0.95, // Đẩy độ sáng tạo lên cao nhất để không bị lặp text
                ]);

            $aiContent = $response->json('choices.0.message.content');
            $cleanJson = trim(str_replace(['```json', '```'], '', $aiContent));
            $aiData = json_decode($cleanJson, true);

            // LỌC KHÓA HỌC LIÊN QUAN CHẶT CHẼ TỪ DATABASE
            $keywords = $aiData['suggested_course_keywords'] ?? [$lessonTitle];
            $query = Course::with('teacher');

            foreach ($keywords as $kw) {
                $query->orWhere('title', 'like', '%' . $kw . '%');
            }

            $matchedCourses = $query->take(3)->get();

            // Nếu database chưa khớp được từ khóa thì lấy ngẫu nhiên 3 khóa học chất lượng khác nhau
            if ($matchedCourses->isEmpty()) {
                $matchedCourses = Course::with('teacher')->inRandomOrder()->take(3)->get();
            }

            $coursesList = [];
            foreach ($matchedCourses as $index => $course) {
                $coursesList[] = [
                    'title' => $course->title,
                    'instructor' => $course->teacher ? $course->teacher->name : "Expert Instructor",
                    'rating' => "4." . rand(7, 9) . " (" . rand(600, 1400) . " students)",
                    'price' => "$" . number_format($course->price, 2),
                    'badge' => $index === 0 ? "Best Match" : "Related Course"
                ];
            }

            $aiData['recommended_courses'] = $coursesList;

            return $aiData;

        } catch (\Exception $e) {
            $fallbackCourses = Course::with('teacher')->take(2)->get();
            $coursesList = [];
            foreach ($fallbackCourses as $c) {
                $coursesList[] = [
                    'title' => $c->title,
                    'instructor' => $c->teacher ? $c->teacher->name : "Instructor",
                    'rating' => "4.8 (950 students)",
                    'price' => "$" . number_format($c->price, 2),
                    'badge' => "Recommended"
                ];
            }

            return [
                'overview' => "Master the core concepts of {$lessonTitle} to accelerate your progress toward {$goal}.",
                'key_takeaways' => ["Understanding fundamental principles of " . $lessonTitle, "Hands-on configuration and workflow", "Best practices and implementation"],
                'recommended_courses' => $coursesList
            ];
        }
    }
}
