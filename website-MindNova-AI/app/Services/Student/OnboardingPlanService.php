<?php

namespace App\Services\Student;

use App\Models\Course;
use App\Models\Review;
use App\Models\User;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Throwable;

/**
 * Builds the personalised learning path shown at the end of onboarding.
 *
 * The plan shape (`learning_path[].phase|title|duration|lessons[].name|duration`)
 * is also read by DashboardService and StudyPlanService, so keep it stable.
 */
class OnboardingPlanService
{
    private const ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';

    private const MAX_PHASES = 4;

    private const MAX_LESSONS = 5;

    private const COURSES_PER_PHASE = 3;

    /**
     * @param  array{goal: string, currentLevel: string, timeAvailable: string, topics?: array<int, string>}  $input
     * @return array<string, mixed>
     */
    public function generate(array $input, ?User $user): array
    {
        $topics = array_values($input['topics'] ?? []);

        $aiPlan = $this->requestAiPlan($input, $topics);
        $source = $aiPlan ? 'ai' : 'fallback';
        $plan = $aiPlan ?? $this->fallbackPlan($input, $topics);

        $excludeIds = [];
        foreach ($plan['learning_path'] as &$phase) {
            $phase['courses'] = $this->matchCourses(
                array_merge($phase['search_keywords'], $topics),
                $excludeIds,
            );
            $excludeIds = array_merge($excludeIds, array_column($phase['courses'], 'id'));
            unset($phase['search_keywords']);
        }
        unset($phase);

        $result = [
            'profile' => [
                'goal' => $input['goal'],
                'level' => $input['currentLevel'],
                'time_available' => $input['timeAvailable'],
                'topics' => $topics,
                'est_time' => $plan['est_time'],
            ],
            'learning_path' => $plan['learning_path'],
            'source' => $source,
        ];

        if ($user) {
            $user->update([
                'onboarding_data' => [
                    'goal' => $input['goal'],
                    'currentLevel' => $input['currentLevel'],
                    'timeAvailable' => $input['timeAvailable'],
                    'topics' => $topics,
                    'ai_plan' => $result,
                ],
                'is_onboarded' => true,
            ]);
        }

        return $result;
    }

    /**
     * @param  array<int, string>  $topics
     * @return array{est_time: string, learning_path: array<int, array<string, mixed>>}|null
     */
    private function requestAiPlan(array $input, array $topics): ?array
    {
        $apiKey = config('services.groq.key');
        if (blank($apiKey)) {
            return null;
        }

        $topicText = $topics ? implode(', ', $topics) : 'chưa chọn, hãy tự đề xuất theo mục tiêu';
        $prompt = <<<PROMPT
Học viên có mục tiêu "{$input['goal']}", trình độ hiện tại "{$input['currentLevel']}", thời gian học mỗi ngày "{$input['timeAvailable']}", chủ đề quan tâm: {$topicText}.
Hãy thiết kế lộ trình học thực tế gồm 3 đến 4 giai đoạn, sắp xếp từ nền tảng đến nâng cao, bỏ qua kiến thức học viên đã vững theo trình độ.
Mỗi giai đoạn có 3 đến 5 bài học cụ thể. Thời lượng phải khớp với thời gian học mỗi ngày.
Viết toàn bộ bằng tiếng Việt (giữ nguyên tên công nghệ). Chỉ trả về JSON đúng cấu trúc:
{
  "est_time": "ví dụ: 3–4 tháng",
  "learning_path": [
    {
      "title": "Tên giai đoạn",
      "description": "Một câu mô tả mục tiêu của giai đoạn",
      "duration": "ví dụ: 3 tuần",
      "search_keywords": ["2-4 từ khóa ngắn để tìm khóa học liên quan"],
      "lessons": [{ "name": "Tên bài học", "duration": "ví dụ: 4 ngày" }]
    }
  ]
}
PROMPT;

        try {
            $response = Http::withToken($apiKey)
                ->timeout(30)
                ->post(self::ENDPOINT, [
                    'model' => config('services.groq.model'),
                    'messages' => [
                        ['role' => 'system', 'content' => 'Bạn là chuyên gia thiết kế lộ trình học tập. Chỉ trả về JSON hợp lệ, không kèm giải thích.'],
                        ['role' => 'user', 'content' => $prompt],
                    ],
                    'temperature' => 0.5,
                    'response_format' => ['type' => 'json_object'],
                ]);

            if ($response->failed()) {
                Log::warning('Onboarding plan: AI request failed', ['status' => $response->status()]);

                return null;
            }

            $decoded = json_decode((string) $response->json('choices.0.message.content'), true);

            return is_array($decoded) ? $this->normalizePlan($decoded) : null;
        } catch (Throwable $e) {
            Log::warning('Onboarding plan: AI error', ['message' => $e->getMessage()]);

            return null;
        }
    }

    /**
     * Coerce model output into the stable plan shape; null when unusable.
     *
     * @return array{est_time: string, learning_path: array<int, array<string, mixed>>}|null
     */
    private function normalizePlan(array $raw): ?array
    {
        $phases = [];
        foreach (array_slice(Arr::wrap($raw['learning_path'] ?? []), 0, self::MAX_PHASES) as $phase) {
            if (! is_array($phase) || blank($phase['title'] ?? null)) {
                continue;
            }

            $lessons = [];
            foreach (array_slice(Arr::wrap($phase['lessons'] ?? []), 0, self::MAX_LESSONS) as $lesson) {
                $name = is_array($lesson) ? ($lesson['name'] ?? null) : $lesson;
                if (is_string($name) && trim($name) !== '') {
                    $lessons[] = [
                        'name' => Str::limit(trim($name), 120),
                        'duration' => $this->text(is_array($lesson) ? ($lesson['duration'] ?? null) : null, ''),
                    ];
                }
            }
            if (! $lessons) {
                continue;
            }

            $phases[] = [
                'phase' => count($phases) + 1,
                'title' => Str::limit(trim((string) $phase['title']), 120),
                'description' => $this->text($phase['description'] ?? null, ''),
                'duration' => $this->text($phase['duration'] ?? null, ''),
                'status' => $phases ? 'locked' : 'unlocked',
                'search_keywords' => array_values(array_filter(
                    array_map(fn ($kw) => is_string($kw) ? trim($kw) : '', Arr::wrap($phase['search_keywords'] ?? [])),
                )),
                'lessons' => $lessons,
            ];
        }

        if (count($phases) < 2) {
            return null;
        }

        return [
            'est_time' => $this->text($raw['est_time'] ?? null, 'Khoảng 3–6 tháng'),
            'learning_path' => $phases,
        ];
    }

    /**
     * Deterministic plan used when the AI provider is unavailable.
     *
     * @param  array<int, string>  $topics
     * @return array{est_time: string, learning_path: array<int, array<string, mixed>>}
     */
    private function fallbackPlan(array $input, array $topics): array
    {
        $goal = $input['goal'];
        $focus = $topics ?: [$goal];
        $half = (int) ceil(count($focus) / 2);
        $core = array_slice($focus, 0, $half);
        $advanced = array_slice($focus, $half) ?: $core;

        $lessons = fn (array $items, string $prefix) => array_map(
            fn ($item) => ['name' => "{$prefix} {$item}", 'duration' => '1 tuần'],
            array_slice($items, 0, self::MAX_LESSONS),
        );

        return [
            'est_time' => 'Khoảng 3–6 tháng',
            'learning_path' => [
                [
                    'phase' => 1,
                    'title' => 'Nền tảng',
                    'description' => "Nắm vững kiến thức cốt lõi cho mục tiêu {$goal}.",
                    'duration' => '3–4 tuần',
                    'status' => 'unlocked',
                    'search_keywords' => $core,
                    'lessons' => [
                        ['name' => "Tổng quan lộ trình {$goal}", 'duration' => '2 ngày'],
                        ...$lessons($core, 'Kiến thức cơ bản về'),
                    ],
                ],
                [
                    'phase' => 2,
                    'title' => 'Thực hành chuyên sâu',
                    'description' => 'Áp dụng kiến thức qua bài tập và dự án nhỏ.',
                    'duration' => '1–2 tháng',
                    'status' => 'locked',
                    'search_keywords' => $advanced,
                    'lessons' => $lessons($advanced, 'Thực hành'),
                ],
                [
                    'phase' => 3,
                    'title' => 'Dự án và hoàn thiện',
                    'description' => 'Tổng hợp kỹ năng bằng một dự án hoàn chỉnh.',
                    'duration' => '1 tháng',
                    'status' => 'locked',
                    'search_keywords' => [$goal],
                    'lessons' => [
                        ['name' => 'Xây dựng dự án cá nhân', 'duration' => '2 tuần'],
                        ['name' => 'Rà soát, tối ưu và tổng kết', 'duration' => '1 tuần'],
                    ],
                ],
            ],
        ];
    }

    /**
     * Published courses whose title/description match any keyword.
     *
     * @param  array<int, string>  $keywords
     * @param  array<int, int>  $excludeIds
     * @return array<int, array<string, mixed>>
     */
    public function matchCourses(array $keywords, array $excludeIds = [], int $limit = self::COURSES_PER_PHASE): array
    {
        $keywords = array_values(array_unique(array_filter(
            array_map(fn ($kw) => Str::limit(trim((string) $kw), 60, ''), $keywords),
            fn ($kw) => mb_strlen($kw) >= 2,
        )));
        if (! $keywords) {
            return [];
        }

        return Course::query()
            ->published()
            ->visibleInAdmin()
            ->whereNotIn('id', $excludeIds)
            ->where(function ($query) use ($keywords) {
                foreach ($keywords as $keyword) {
                    $query->orWhere('title', 'like', "%{$keyword}%")
                        ->orWhere('description', 'like', "%{$keyword}%");
                }
            })
            ->with('teacher:id,name')
            ->withCount('enrollments')
            ->addSelect(['rating' => Review::query()
                ->selectRaw('avg(rating)')
                ->whereColumn('course_id', 'courses.id')])
            ->limit($limit)
            ->get()
            ->map(fn (Course $course) => [
                'id' => $course->id,
                'title' => $course->title,
                'slug' => $course->slug,
                'thumbnail' => $course->thumbnail ? url($course->thumbnail) : null,
                'price' => (float) $course->price,
                'instructor' => $course->teacher?->name,
                'students_count' => (int) $course->enrollments_count,
                'rating' => $course->rating !== null ? round((float) $course->rating, 1) : null,
            ])
            ->all();
    }

    private function text(mixed $value, string $default): string
    {
        return is_string($value) && trim($value) !== '' ? Str::limit(trim($value), 200) : $default;
    }
}
