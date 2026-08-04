<?php

namespace App\Http\Controllers\Api\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class OnboardingController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'goal' => 'required|string',
            'level' => 'required|string',
            'topics' => 'required|array',
        ]);

        $goal = $data['goal'];
        $level = $data['level'];
        $topics = implode(', ', $data['topics']);

        $user = $request->user();
        if ($user) {
            $user->update([
                'onboarding_data' => json_encode($data),
                'is_onboarded' => true,
            ]);
        }

        $prompt = "You are an elite AI education architect. A student's goal is '{$goal}', their current level is '{$level}', and their chosen focus topics are: [{$topics}].
        Create a deeply customized, realistic learning path tailored specifically to this exact goal.
        Provide 3 progressive phases (Phase 1: Foundation, Phase 2: Core Practical Skills, Phase 3: Advanced Mastery). Inside each phase, provide 3 to 4 specific, high-value lessons.

        CRITICAL: Return ONLY a valid raw JSON object. No markdown, no backticks, no conversational text. Exact structure required:
        {
          \"status\": \"success\",
          \"data\": {
            \"profile\": {
              \"goal\": \"{$goal}\",
              \"level\": \"{$level}\",
              \"topics_count\": " . count($data['topics']) . ",
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
                  { \"name\": \"Lesson title here\", \"duration\": \"1 week\" },
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
                ]);

            if ($response->successful()) {
                $aiContent = $response->json('choices.0.message.content');
                $cleanJson = trim(str_replace(['```json', '```'], '', $aiContent));

                $firstOpen = strpos($cleanJson, '{');
                $lastClose = strrpos($cleanJson, '}');
                if ($firstOpen !== false && $lastClose !== false) {
                    $cleanJson = substr($cleanJson, $firstOpen, $lastClose - $firstOpen + 1);
                }

                $resultData = json_decode($cleanJson, true);
                if ($resultData && isset($resultData['data']['learning_path'])) {
                    return response()->json($resultData, 200);
                }
            }
        } catch (\Exception $e) {
            Log::error("Groq AI Error: " . $e->getMessage());
        }

        // Fallback động theo Goal (Đã sửa lại dấu => chuẩn PHP)
        return response()->json([
            'status' => 'success',
            'data' => [
                'profile' => [
                    'goal' => $goal,
                    'level' => $level,
                    'topics_count' => count($data['topics']),
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
        ], 200);
    }
}
