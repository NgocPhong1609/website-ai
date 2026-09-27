<?php

namespace App\Services\Student;

use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Throwable;

class AiLessonService
{
    private const ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';

    public function __construct(private readonly OnboardingPlanService $planService)
    {
    }

    /**
     * Explain one lesson of the learning path and recommend published courses for it.
     *
     * @return array{overview: string, key_takeaways: array<int, string>, recommended_courses: array<int, array<string, mixed>>, source: string}
     */
    public function analyzeLesson(string $lessonTitle, string $goal): array
    {
        $analysis = $this->requestAnalysis($lessonTitle, $goal);
        $keywords = array_merge($analysis['keywords'] ?? [], [$lessonTitle]);

        return [
            'overview' => $analysis['overview'] ?? "Bài \"{$lessonTitle}\" giúp bạn xây dựng kiến thức cần thiết cho mục tiêu {$goal}. Hãy học kỹ phần lý thuyết rồi thực hành ngay để ghi nhớ lâu hơn.",
            'key_takeaways' => $analysis['key_takeaways'] ?? [
                "Hiểu các khái niệm cốt lõi của {$lessonTitle}",
                'Áp dụng kiến thức vào bài tập thực hành',
                'Biết cách tự kiểm tra và khắc phục lỗi thường gặp',
            ],
            'recommended_courses' => $this->planService->matchCourses($keywords),
            'source' => $analysis ? 'ai' : 'fallback',
        ];
    }

    /**
     * @return array{overview: string, key_takeaways: array<int, string>, keywords: array<int, string>}|null
     */
    private function requestAnalysis(string $lessonTitle, string $goal): ?array
    {
        $apiKey = config('services.groq.key');
        if (blank($apiKey)) {
            return null;
        }

        $prompt = <<<PROMPT
Học viên đang theo mục tiêu "{$goal}" và muốn tìm hiểu bài học "{$lessonTitle}".
Viết bằng tiếng Việt (giữ nguyên tên công nghệ). Chỉ trả về JSON:
{
  "overview": "2 câu giải thích bài học này dạy gì và vì sao quan trọng với mục tiêu",
  "key_takeaways": ["3 kết quả học tập cụ thể"],
  "keywords": ["2-3 từ khóa ngắn để tìm khóa học liên quan"]
}
PROMPT;

        try {
            $response = Http::withToken($apiKey)
                ->timeout(20)
                ->post(self::ENDPOINT, [
                    'model' => config('services.groq.model'),
                    'messages' => [
                        ['role' => 'system', 'content' => 'Bạn là chuyên gia phân tích giáo trình. Chỉ trả về JSON hợp lệ.'],
                        ['role' => 'user', 'content' => $prompt],
                    ],
                    'temperature' => 0.4,
                    'response_format' => ['type' => 'json_object'],
                ]);

            if ($response->failed()) {
                Log::warning('Analyze lesson: AI request failed', ['status' => $response->status()]);

                return null;
            }

            $data = json_decode((string) $response->json('choices.0.message.content'), true);
            $overview = is_array($data) ? trim((string) ($data['overview'] ?? '')) : '';
            $takeaways = array_values(array_filter(array_map(
                fn ($item) => is_string($item) ? Str::limit(trim($item), 200) : '',
                Arr::wrap($data['key_takeaways'] ?? []),
            )));

            if ($overview === '' || ! $takeaways) {
                return null;
            }

            return [
                'overview' => Str::limit($overview, 600),
                'key_takeaways' => array_slice($takeaways, 0, 5),
                'keywords' => array_values(array_filter(Arr::wrap($data['keywords'] ?? []), 'is_string')),
            ];
        } catch (Throwable $e) {
            Log::warning('Analyze lesson: AI error', ['message' => $e->getMessage()]);

            return null;
        }
    }
}
