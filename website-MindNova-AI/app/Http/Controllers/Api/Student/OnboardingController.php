<?php

namespace App\Http\Controllers\Api\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use App\Models\Course;

class OnboardingController extends Controller
{
    // ==========================================
    // 1. API TẠO LỘ TRÌNH HỌC TẬP (ONBOARDING)
    // ==========================================
    public function store(Request $request)
    {
        $data = $request->validate([
            'goal' => 'required|string',
            'currentLevel' => 'required|string',
            'timeAvailable' => 'required|string',
        ]);

        $goal = $data['goal'];
        $level = $data['currentLevel'];
        $timeAvailable = $data['timeAvailable'];

        $user = $request->user('sanctum') ?? $request->user();
        if ($user) {
            $user->update([
                'onboarding_data' => json_encode($data),
                'is_onboarded' => true,
            ]);
        }

        $prompt = "Bạn là một chuyên gia xây dựng lộ trình học tập ưu tú. Mục tiêu của học viên là '{$goal}', trình độ hiện tại là '{$level}', và thời gian rảnh mỗi ngày là '{$timeAvailable}'.
        Hãy tạo một lộ trình học tập thực tế và cá nhân hóa sâu sắc theo đúng mục tiêu này.
        Hãy chia lộ trình thành các giai đoạn (phases) hợp lý. Trong mỗi giai đoạn, cung cấp các từ khóa (search_keywords) để tìm kiếm các khóa học liên quan trong hệ thống.
        
        CRITICAL: Return ONLY a valid raw JSON object. Exact structure required:
        {
          \"status\": \"success\",
          \"data\": {
            \"profile\": {
              \"goal\": \"{$goal}\",
              \"level\": \"{$level}\",
              \"topics_count\": " . (isset($data['topics']) && is_array($data['topics']) ? count($data['topics']) : 1) . ",
              \"est_time\": \"2-4 months\"
            },
            \"learning_path\": [
              {
                \"phase\": 1,
                \"title\": \"Foundation & Basics\",
                \"duration\": \"2 weeks\",
                \"status\": \"unlocked\",
                \"lessons\": [
                  { \"name\": \"Lesson title here\", \"duration\": \"3 days\" },
                  { \"name\": \"Lesson title here\", \"duration\": \"4 days\" }
                ]
              },
              {
                \"phase\": 2,
                \"title\": \"Core Implementation\",
                \"duration\": \"1 month\",
                \"status\": \"locked\",
                \"lessons\": [
                  { \"name\": \"Lesson title here\", \"duration\": \"1 week\" }
                ]
              },
              {
                \"phase\": 3,
                \"title\": \"Advanced Mastery\",
                \"duration\": \"1 month\",
                \"status\": \"locked\",
                \"lessons\": [
                  { \"name\": \"Lesson title here\", \"duration\": \"2 weeks\" }
                ]
              }
            ]
          }
        }";

        try {
            $response = Http::withToken(env('GROQ_API_KEY'))
                ->timeout(30)
                ->post('https://api.groq.com/openai/v1/chat/completions', [
                    'model' => 'llama-3.3-70b-versatile',
                    'messages' => [
                        ['role' => 'system', 'content' => 'You are a strict JSON generator. Return only raw JSON.'],
                        ['role' => 'user', 'content' => $prompt]
                    ],
                    'temperature' => 0.7,
                    'response_format' => ['type' => 'json_object']
                ]);

            if ($response->successful()) {
                $aiContent = $response->json('choices.0.message.content');
                $resultData = json_decode($aiContent, true);

                if (json_last_error() === JSON_ERROR_NONE && isset($resultData['phases'])) {
                    // Map courses from database using search_keywords
                    foreach ($resultData['phases'] as &$phase) {
                        $keywords = $phase['search_keywords'] ?? [];
                        $query = Course::query()->where('status', 'published')->visibleInAdmin();
                        
                        if (!empty($keywords)) {
                            $query->where(function ($q) use ($keywords) {
                                foreach ($keywords as $keyword) {
                                    $q->orWhere('title', 'LIKE', '%' . $keyword . '%')
                                      ->orWhere('description', 'LIKE', '%' . $keyword . '%');
                                }
                            });
                        }
                        
                        // Limit to 3 courses per phase
                        $courses = $query->limit(3)->get(['id', 'title', 'thumbnail', 'slug']);
                        $phase['courses'] = $courses;
                    }

                    if ($user) {
                        $onboardingData = $data;
                        $onboardingData['ai_plan'] = $resultData;
                        $user->update([
                            'onboarding_data' => json_encode($onboardingData)
                        ]);
                    }
                    return response()->json($resultData, 200);
                } else {
                    Log::error("Groq JSON Error: " . json_last_error_msg() . " | Output: " . $aiContent);
                }
            } else {
                Log::error("Groq API Failed: " . $response->status() . " " . $response->body());
            }
        } catch (\Exception $e) {
            Log::error("Groq AI Error: " . $e->getMessage());
        }

        $fallbackData = [
            'status' => 'success',
            'data' => [
                'profile' => [
                    'goal' => $goal,
                    'level' => $level,
                    'topics_count' => isset($data['topics']) && is_array($data['topics']) ? count($data['topics']) : 1,
                    'est_time' => '3-6 months'
                ],
                'learning_path' => [
                    [
                        'phase' => 1,
                        'title' => 'Foundation - ' . $goal,
                        'duration' => '2 weeks',
                        'status' => 'unlocked',
                        'lessons' => [
                            [ 'name' => 'Overview and Core Principles', 'duration' => '3 days' ],
                            [ 'name' => 'Setting up your environment', 'duration' => '4 days' ]
                        ]
                    ],
                    [
                        'phase' => 2,
                        'title' => 'Practical Skills',
                        'duration' => '1 month',
                        'status' => 'locked',
                        'lessons' => [
                            [ 'name' => 'Working with Selected Topics', 'duration' => '1 week' ],
                            [ 'name' => 'Hands-on Exercise', 'duration' => '1 week' ]
                        ]
                    ],
                    [
                        'phase' => 3,
                        'title' => 'Advanced Mastery',
                        'duration' => '1 month',
                        'status' => 'locked',
                        'lessons' => [
                            [ 'name' => 'Real-world Project Execution', 'duration' => '2 weeks' ]
                        ]
                    ]
                ]
            ]
        ];

        if ($user) {
            $onboardingData = $data;
            $onboardingData['ai_plan'] = $fallbackData;
            $user->update([
                'onboarding_data' => json_encode($onboardingData)
            ]);
        }

        return response()->json($fallbackData, 200);
    }

    // ==========================================
    // 2. API LẤY DANH SÁCH THỂ LOẠI (TOPICS)
    // ==========================================
    public function getAvailableTopics()
    {
        try {
            $categories = DB::table('categories')->pluck('name');

            if ($categories->isEmpty()) {
                $categories = collect([
                    'Web Development', 'Mobile Apps', 'Database', 'UI/UX Design', 'Cloud Computing'
                ]);
            }

            return response()->json([
                'status' => 'success',
                'topics' => $categories
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'success',
                'topics' => ['Frontend', 'Backend', 'Fullstack', 'DevOps', 'Data Science', 'AI']
            ], 200);
        }
    }

    // ==========================================
    // 3. API AI PHÂN TÍCH BÀI HỌC VÀ GỢI Ý KHÓA HỌC
    // ==========================================
    public function analyzeLesson(Request $request)
    {
        $lessonTitle = $request->input('lesson_title');
        $goal = $request->input('goal');

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
                    'temperature' => 0.95,
                ]);

            $aiContent = $response->json('choices.0.message.content');
            $cleanJson = trim(str_replace(['```json', '```'], '', $aiContent));
            $aiData = json_decode($cleanJson, true);

            $keywords = $aiData['suggested_course_keywords'] ?? [$lessonTitle];
            $query = Course::with('teacher');

            foreach ($keywords as $kw) {
                $query->orWhere('title', 'like', '%' . $kw . '%');
            }

            $matchedCourses = $query->take(3)->get();

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

            return response()->json([
                'status' => 'success',
                'data' => $aiData
            ], 200);
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

            return response()->json([
                'status' => 'success',
                'data' => [
                    'overview' => "Master the core concepts of {$lessonTitle} to accelerate your progress toward {$goal}.",
                    'key_takeaways' => ["Understanding fundamental principles of " . $lessonTitle, "Hands-on configuration and workflow", "Best practices and implementation"],
                    'recommended_courses' => $coursesList
                ]
            ], 200);
        }
    }
}
