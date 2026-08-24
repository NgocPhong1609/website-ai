<?php

namespace App\Http\Controllers\Api\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Models\Course;

class OnboardingController extends Controller
{
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
          \"phases\": [
            {
              \"phase_name\": \"Tên giai đoạn\",
              \"description\": \"Mô tả\",
              \"search_keywords\": [\"keyword1\", \"keyword2\"]
            }
          ]
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

        // Create dynamic fallback based on goal if Groq fails (e.g. IP block)
        $words = explode(' ', $goal);
        $query = Course::query()->where('status', 'published')->visibleInAdmin();
        $query->where(function ($q) use ($words) {
            foreach ($words as $word) {
                if (mb_strlen($word) > 2) {
                    $q->orWhere('title', 'LIKE', '%' . $word . '%')
                      ->orWhere('description', 'LIKE', '%' . $word . '%');
                }
            }
        });
        $fallbackCourses = $query->limit(3)->get(['id', 'title', 'thumbnail', 'slug']);
        
        if ($fallbackCourses->isEmpty()) {
            $fallbackCourses = Course::query()->where('status', 'published')->visibleInAdmin()->inRandomOrder()->limit(3)->get(['id', 'title', 'thumbnail', 'slug']);
        }

        $fallbackData = [
            'phases' => [
                [
                    'phase_name' => 'Nền tảng - ' . $goal,
                    'description' => 'Xây dựng kiến thức cơ bản cho ' . $goal,
                    'search_keywords' => ['basic', $goal],
                    'courses' => $fallbackCourses
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
}
