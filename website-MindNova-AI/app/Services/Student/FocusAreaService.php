<?php

namespace App\Services\Student;

use App\Models\AiGeneratedQuiz;
use Illuminate\Support\Facades\DB;

/**
 * Weakest topics of a learner, derived from quizzes they actually took:
 * completed AI practice quizzes (grouped by topic) and course quiz attempts
 * (grouped by quiz). Topics at or above MASTERED_ACCURACY are left out.
 */
class FocusAreaService
{
    public const MASTERED_ACCURACY = 80;

    private const REVIEW_BELOW = 50;

    /**
     * @return array<int, array{id: string, topic: string, accuracy: int, action: string, attempts: int}>
     */
    public function forUser(int $userId, int $limit = 2): array
    {
        $areas = [];

        $aiQuizzes = AiGeneratedQuiz::query()
            ->where('user_id', $userId)
            ->where('is_completed', true)
            ->whereNotNull('topic')
            ->get(['topic', 'score']);

        foreach ($aiQuizzes->groupBy(fn ($quiz) => mb_strtolower(trim($quiz->topic))) as $key => $group) {
            if ($key === '') {
                continue;
            }
            $areas[] = $this->area('ai-'.md5($key), trim($group->first()->topic), $group->avg('score'), $group->count());
        }

        $courseAttempts = DB::table('user_quiz_attempts')
            ->join('quizzes', 'quizzes.id', '=', 'user_quiz_attempts.quiz_id')
            ->where('user_quiz_attempts.user_id', $userId)
            ->groupBy('quizzes.id', 'quizzes.title')
            ->selectRaw('quizzes.id, quizzes.title, avg(user_quiz_attempts.accuracy) as accuracy, count(*) as attempts')
            ->get();

        foreach ($courseAttempts as $row) {
            $areas[] = $this->area('quiz-'.$row->id, $row->title, $row->accuracy, (int) $row->attempts);
        }

        $areas = array_filter($areas, fn ($area) => $area['accuracy'] < self::MASTERED_ACCURACY);
        usort($areas, fn ($a, $b) => [$a['accuracy'], -$a['attempts']] <=> [$b['accuracy'], -$b['attempts']]);

        return array_slice(array_values($areas), 0, $limit);
    }

    private function area(string $id, string $topic, float|int|string|null $accuracy, int $attempts): array
    {
        $accuracy = (int) round((float) $accuracy);

        return [
            'id' => $id,
            'topic' => $topic,
            'accuracy' => max(0, min(100, $accuracy)),
            'action' => $accuracy < self::REVIEW_BELOW ? 'review' : 'practice',
            'attempts' => $attempts,
        ];
    }
}
