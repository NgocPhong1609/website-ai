<?php

namespace App\Services;

use App\Models\LearningRoadmap;
use App\Models\RoadmapCourse;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class RoadmapGeneratorService
{
    /**
     * Maximum number of courses in a roadmap.
     */
    private const MAX_COURSES = 8;

    private GeminiService $geminiService;

    public function __construct(GeminiService $geminiService)
    {
        $this->geminiService = $geminiService;
    }

    /**
     * Generate a learning roadmap for a user.
     *
     * Flow:
     * 1. Lấy available courses (giả lập / từ DB)
     * 2. Gửi prompt đến Gemini
     * 3. Validate response
     * 4. Nếu valid → lưu DB
     * 5. Nếu invalid → fallback rule-based
     *
     * @param User $user
     * @param array $input ['goal', 'level', 'topics']
     * @return LearningRoadmap
     */
    public function generateRoadmap(User $user, array $input): LearningRoadmap
    {
        $goal = $input['goal'];
        $level = $input['level'];
        $topics = $input['topics'];

        // Step 1: Lấy available courses
        $availableCourses = $this->getAvailableCourses();

        // Step 2: Gửi Gemini
        $geminiResult = $this->callGemini($goal, $level, $topics, $availableCourses);

        // Step 3: Validate AI response
        $validCourseIds = collect($availableCourses)->pluck('id')->toArray();
        $isValid = $this->validateGeminiResponse($geminiResult, $validCourseIds);

        // Step 4 & 5: Lưu DB
        if ($isValid) {
            return $this->saveRoadmap(
                $user,
                $goal,
                $level,
                'gemini',
                $geminiResult['roadmap'],
                $geminiResult['estimated_total_days'] ?? null
            );
        }

        // Fallback rule-based
        Log::warning('RoadmapGeneratorService: Gemini response invalid, using rule-based fallback.', [
            'user_id' => $user->id,
            'gemini_result' => $geminiResult,
        ]);

        $ruleBasedCourses = $this->generateRuleBasedRoadmap($goal, $level, $topics, $availableCourses);

        return $this->saveRoadmap(
            $user,
            $goal,
            $level,
            'rule',
            $ruleBasedCourses,
            $this->estimateTotalDays($ruleBasedCourses)
        );
    }

    /**
     * Lấy danh sách courses khả dụng.
     *
     * TODO: Thay bằng query từ courses table khi module Course được tạo.
     * Hiện tại dùng static data cho MVP.
     *
     * @return array
     */
    private function getAvailableCourses(): array
    {
        // TODO: Replace with Course::all() or filtered query when courses table exists
        // Đây là sample data cho development/testing
        return [
            [
                'id' => 1,
                'title' => 'ML Basics',
                'level' => 'beginner',
                'topics' => ['Machine Learning'],
            ],
            [
                'id' => 2,
                'title' => 'Statistics for Data Science',
                'level' => 'beginner',
                'topics' => ['Statistics', 'Data Science'],
            ],
            [
                'id' => 3,
                'title' => 'Python Programming',
                'level' => 'beginner',
                'topics' => ['Programming', 'Python'],
            ],
            [
                'id' => 4,
                'title' => 'NLP Fundamentals',
                'level' => 'intermediate',
                'topics' => ['NLP', 'Machine Learning'],
            ],
            [
                'id' => 5,
                'title' => 'Deep Learning',
                'level' => 'intermediate',
                'topics' => ['Deep Learning', 'Machine Learning'],
            ],
            [
                'id' => 6,
                'title' => 'Computer Vision',
                'level' => 'intermediate',
                'topics' => ['Computer Vision', 'Deep Learning'],
            ],
            [
                'id' => 7,
                'title' => 'Advanced NLP with Transformers',
                'level' => 'advanced',
                'topics' => ['NLP', 'Deep Learning'],
            ],
            [
                'id' => 8,
                'title' => 'Interview Practice - ML Engineer',
                'level' => 'advanced',
                'topics' => ['Interview', 'Machine Learning'],
            ],
        ];
    }

    /**
     * Gửi request đến Gemini API.
     *
     * @param string $goal
     * @param string $level
     * @param array $topics
     * @param array $availableCourses
     * @return array|null
     */
    private function callGemini(string $goal, string $level, array $topics, array $availableCourses): ?array
    {
        $systemPrompt = $this->buildSystemPrompt();

        $userPrompt = json_encode([
            'goal' => $goal,
            'level' => $level,
            'topics' => $topics,
            'available_courses' => $availableCourses,
        ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

        return $this->geminiService->generateJson($systemPrompt, $userPrompt);
    }

    /**
     * System prompt cho Gemini.
     *
     * @return string
     */
    private function buildSystemPrompt(): string
    {
        return <<<'PROMPT'
You are a Learning Roadmap Engine.

Your task: Given a learner's data and a list of valid courses, create a personalized learning roadmap.

STRICT RULES:
1. ONLY select courses from the provided "available_courses" list.
2. Do NOT invent or create new courses.
3. Do NOT use any course_id that is not in the available_courses list.
4. Order courses from easy to hard (priority 1 = first to study).
5. Prioritize courses that match the learner's goal.
6. Maximum 8 courses in the roadmap.
7. Each course MUST have a reason explaining why it was selected.
8. Respond ONLY with valid JSON. No markdown. No explanation outside JSON.
9. estimated_days per course should be reasonable (7-30 days).

OUTPUT JSON SCHEMA:
{
  "roadmap": [
    {
      "course_id": <integer from available_courses>,
      "priority": <integer starting from 1>,
      "reason": "<string explaining why this course is recommended>",
      "estimated_days": <integer>
    }
  ],
  "estimated_total_days": <integer, sum of all estimated_days>
}
PROMPT;
    }

    /**
     * Validate JSON response từ Gemini.
     *
     * Kiểm tra:
     * - Response không null
     * - Có key 'roadmap' và là array
     * - Mỗi item có course_id, priority, reason
     * - course_id phải nằm trong danh sách valid
     * - Không có duplicate course_id
     * - Không quá MAX_COURSES items
     *
     * @param array|null $response
     * @param array $validCourseIds
     * @return bool
     */
    private function validateGeminiResponse(?array $response, array $validCourseIds): bool
    {
        // Null check
        if ($response === null) {
            return false;
        }

        // Must have 'roadmap' key as array
        if (!isset($response['roadmap']) || !is_array($response['roadmap'])) {
            Log::warning('Validation failed: missing or invalid roadmap key.');
            return false;
        }

        $roadmap = $response['roadmap'];

        // Must not be empty
        if (empty($roadmap)) {
            Log::warning('Validation failed: roadmap is empty.');
            return false;
        }

        // Must not exceed max courses
        if (count($roadmap) > self::MAX_COURSES) {
            Log::warning('Validation failed: roadmap exceeds max courses.', [
                'count' => count($roadmap),
            ]);
            return false;
        }

        $seenCourseIds = [];

        foreach ($roadmap as $index => $item) {
            // Required fields
            if (!isset($item['course_id']) || !isset($item['priority']) || !isset($item['reason'])) {
                Log::warning('Validation failed: missing required fields.', [
                    'index' => $index,
                    'item' => $item,
                ]);
                return false;
            }

            $courseId = $item['course_id'];

            // course_id must be in valid list
            if (!in_array($courseId, $validCourseIds, true)) {
                Log::warning('Validation failed: invalid course_id.', [
                    'course_id' => $courseId,
                    'valid_ids' => $validCourseIds,
                ]);
                return false;
            }

            // No duplicates
            if (in_array($courseId, $seenCourseIds, true)) {
                Log::warning('Validation failed: duplicate course_id.', [
                    'course_id' => $courseId,
                ]);
                return false;
            }

            $seenCourseIds[] = $courseId;
        }

        return true;
    }

    /**
     * Fallback: Sinh roadmap theo rule khi Gemini fail.
     *
     * Logic:
     * 1. Lọc courses match với topics của user
     * 2. Sort theo level phù hợp (beginner → intermediate → advanced)
     * 3. Thêm courses liên quan đến goal
     * 4. Giới hạn MAX_COURSES
     *
     * @param string $goal
     * @param string $level
     * @param array $topics
     * @param array $availableCourses
     * @return array
     */
    private function generateRuleBasedRoadmap(string $goal, string $level, array $topics, array $availableCourses): array
    {
        $levelOrder = ['beginner' => 1, 'intermediate' => 2, 'advanced' => 3];
        $levelLabel = ['beginner' => 'cơ bản', 'intermediate' => 'trung cấp', 'advanced' => 'nâng cao'];
        $userLevelValue = $levelOrder[$level] ?? 1;

        // Score each course
        $scored = [];
        foreach ($availableCourses as $course) {
            $score = 0;
            $reasons = [];

            $courseTitle = $course['title'] ?? 'Unknown';
            $courseLevel = $course['level'] ?? 'beginner';
            $courseTopics = $course['topics'] ?? [];
            $courseLevelValue = $levelOrder[$courseLevel] ?? 1;

            // Topic match scoring
            $matchedTopics = array_intersect(
                array_map('strtolower', $courseTopics),
                array_map('strtolower', $topics)
            );

            if (!empty($matchedTopics)) {
                $score += count($matchedTopics) * 10;
                $reasons[] = 'Liên quan trực tiếp đến chủ đề bạn quan tâm: ' . implode(', ', $matchedTopics);
            }

            // Goal match scoring
            $goalLower = strtolower($goal);
            if (str_contains(strtolower($courseTitle), $goalLower)) {
                $score += 5;
                $reasons[] = 'Phù hợp với mục tiêu "' . $goal . '" của bạn';
            }

            // Level compatibility scoring - always add reason
            if ($courseLevelValue <= $userLevelValue + 1) {
                $score += 3;
            }
            if ($courseLevelValue <= $userLevelValue) {
                $score += 2;
            }

            // Build level-based reason
            if ($courseLevelValue == $userLevelValue) {
                $reasons[] = 'Trình độ ' . ($levelLabel[$courseLevel] ?? $courseLevel) . ' — phù hợp với level hiện tại của bạn';
            } elseif ($courseLevelValue < $userLevelValue) {
                $reasons[] = 'Khóa ' . ($levelLabel[$courseLevel] ?? $courseLevel) . ' — giúp củng cố nền tảng trước khi nâng cao';
            } elseif ($courseLevelValue == $userLevelValue + 1) {
                $reasons[] = 'Khóa ' . ($levelLabel[$courseLevel] ?? $courseLevel) . ' — bước tiếp theo để nâng trình độ';
            }

            // Course content reason (always describe what the course teaches)
            if (!empty($courseTopics)) {
                $reasons[] = 'Nội dung: ' . implode(', ', $courseTopics);
            }

            // Build learning path context
            if ($courseLevelValue == 1 && $userLevelValue == 1) {
                $reasons[] = 'Nên học trước để xây dựng kiến thức nền tảng';
            }

            // Only include courses within reachable level
            if ($score > 0) {
                $scored[] = [
                    'course_id' => $course['id'],
                    'title' => $courseTitle,
                    'score' => $score,
                    'level_value' => $courseLevelValue,
                    'reason' => implode('. ', $reasons),
                    'estimated_days' => $this->estimateCourseDays($courseLevel),
                ];
            }
        }

        // Sort: higher score first, then by level (easy → hard)
        usort($scored, function ($a, $b) {
            if ($b['score'] !== $a['score']) {
                return $b['score'] - $a['score'];
            }
            return $a['level_value'] - $b['level_value'];
        });

        // Take top MAX_COURSES and assign priority with learning path context
        $result = [];
        $priority = 1;
        $total = min(count($scored), self::MAX_COURSES);

        foreach (array_slice($scored, 0, self::MAX_COURSES) as $index => $item) {
            // Add position context
            $positionNote = '';
            if ($priority === 1) {
                $positionNote = ' → Bắt đầu từ đây.';
            } elseif ($priority === $total) {
                $positionNote = ' → Khóa cuối trong lộ trình.';
            }

            $result[] = [
                'course_id' => $item['course_id'],
                'priority' => $priority,
                'reason' => $item['reason'] . $positionNote,
                'estimated_days' => $item['estimated_days'],
            ];
            $priority++;
        }

        return $result;
    }

    /**
     * Ước tính số ngày cho course dựa trên level.
     *
     * @param string $level
     * @return int
     */
    private function estimateCourseDays(string $level): int
    {
        return match ($level) {
            'beginner' => 14,
            'intermediate' => 21,
            'advanced' => 28,
            default => 14,
        };
    }

    /**
     * Tính tổng estimated days cho roadmap.
     *
     * @param array $courses
     * @return int
     */
    private function estimateTotalDays(array $courses): int
    {
        return collect($courses)->sum('estimated_days') ?: 0;
    }

    /**
     * Lưu roadmap và courses vào database.
     *
     * @param User $user
     * @param string $goal
     * @param string $level
     * @param string $generatedBy
     * @param array $courses
     * @param int|null $estimatedTotalDays
     * @return LearningRoadmap
     */
    private function saveRoadmap(
        User $user,
        string $goal,
        string $level,
        string $generatedBy,
        array $courses,
        ?int $estimatedTotalDays
    ): LearningRoadmap {
        return DB::transaction(function () use ($user, $goal, $level, $generatedBy, $courses, $estimatedTotalDays) {
            // Tạo roadmap
            $roadmap = LearningRoadmap::create([
                'user_id' => $user->id,
                'goal' => $goal,
                'level' => $level,
                'status' => 'active',
                'generated_by' => $generatedBy,
                'estimated_total_days' => $estimatedTotalDays,
            ]);

            // Tạo roadmap courses
            foreach ($courses as $course) {
                RoadmapCourse::create([
                    'roadmap_id' => $roadmap->id,
                    'course_id' => $course['course_id'],
                    'priority' => $course['priority'],
                    'reason' => $course['reason'] ?? null,
                    'estimated_days' => $course['estimated_days'] ?? null,
                ]);
            }

            // Eager load courses để trả về
            $roadmap->load('courses');

            return $roadmap;
        });
    }
}
