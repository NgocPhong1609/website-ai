<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Lesson;
use App\Models\LessonCompletion;
use App\Models\Quiz;
use App\Models\UserQuizAttempt;
use App\Services\Instructor\QuizService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class StudentQuizController extends Controller
{
    use ApiResponse;

    public function __construct(private readonly QuizService $quizService)
    {
    }

    /**
     * GET /student/lessons/{lesson}/quiz
     * Returns quiz with questions and answers (is_correct hidden).
     */
    public function show(Lesson $lesson)
    {
        $quiz = $this->quizService->getQuizWithDetails($lesson);

        if (!$quiz) {
            return $this->notFoundResponse('Bài kiểm tra không tồn tại.');
        }

        // Hide is_correct from student response
        $quizData = [
            'id' => $quiz->id,
            'title' => $quiz->title,
            'time_limit_minutes' => $quiz->time_limit_minutes,
            'passing_score' => $quiz->passing_score,
            'questions_count' => $quiz->questions->count(),
            'questions' => $quiz->questions->map(function ($question) {
                return [
                    'id' => $question->id,
                    'content' => $question->content,
                    'order' => $question->order,
                    'answers' => $question->answers->map(function ($answer) {
                        return [
                            'id' => $answer->id,
                            'content' => $answer->content,
                            // Note: is_correct is intentionally omitted
                        ];
                    }),
                ];
            }),
        ];

        return $this->successResponse($quizData, 'Quiz retrieved for student.');
    }

    /**
     * POST /student/lessons/{lesson}/quiz/submit
     * Submit answers and get grading result.
     */
    public function submit(Request $request, Lesson $lesson)
    {
        $request->validate([
            'answers' => 'required|array',
            'answers.*' => 'required|integer', // question_id => answer_id
            'time_taken_seconds' => 'integer|min:0',
        ]);

        $quiz = $this->quizService->getQuizWithDetails($lesson);

        if (!$quiz) {
            return $this->notFoundResponse('Bài kiểm tra không tồn tại.');
        }

        $result = $this->quizService->gradeSubmission($quiz, $request->input('answers'));

        // Record the attempt
        $attempt = UserQuizAttempt::create([
            'user_id' => $request->user()->id,
            'quiz_id' => $quiz->id,
            'score' => $result['score'],
            'accuracy' => $result['accuracy'],
            'time_taken_seconds' => $request->input('time_taken_seconds', 0),
            'status' => $result['passed'] ? 'passed' : 'failed',
        ]);

        // If passed, mark lesson as completed
        if ($result['passed']) {
            LessonCompletion::firstOrCreate([
                'user_id' => $request->user()->id,
                'lesson_id' => $lesson->id,
            ]);
        }

        return $this->successResponse([
            'attempt_id' => $attempt->id,
            ...$result,
        ], $result['passed'] ? 'Chúc mừng! Bạn đã vượt qua bài kiểm tra.' : 'Bạn chưa đạt. Hãy thử lại!');
    }
}
