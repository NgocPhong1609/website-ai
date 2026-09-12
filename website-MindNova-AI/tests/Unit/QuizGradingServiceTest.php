<?php

namespace Tests\Unit;

use App\Models\Answer;
use App\Models\Question;
use App\Models\Quiz;
use App\Services\Student\QuizGradingService;
use Tests\TestCase;

class QuizGradingServiceTest extends TestCase
{
    public function test_multiple_correct_scoring_matrix_is_partial_capped_and_non_negative(): void
    {
        $cases = [
            'none selected' => [[], 0.0, false],
            'one correct' => [[101], 1.0, false],
            'all correct' => [[101, 102], 2.0, true],
            'all correct plus wrong' => [[101, 102, 103], 1.0, false],
            'duplicate ids' => [[101, 101, 102], 2.0, true],
        ];

        foreach ($cases as $label => [$selectedIds, $expectedScore, $expectedCorrect]) {
            $result = $this->grade($this->multipleCorrectQuestion(), $selectedIds);
            $questionResult = $result['question_results'][0];

            $this->assertSame($expectedScore, $questionResult['score'], $label);
            $this->assertSame($expectedCorrect, $questionResult['is_correct'], $label);
            $this->assertGreaterThanOrEqual(0.0, $questionResult['score'], $label);
        }
    }

    public function test_multiple_correct_rejects_answer_ids_from_another_question(): void
    {
        $result = $this->grade($this->multipleCorrectQuestion(), [999]);
        $questionResult = $result['question_results'][0];

        $this->assertSame(0.0, $questionResult['score']);
        $this->assertSame([999], $questionResult['invalid_answer_ids']);
        $this->assertFalse($questionResult['is_correct']);
    }

    public function test_legacy_single_choice_scalar_grading_is_unchanged(): void
    {
        $question = $this->multipleCorrectQuestion();
        $question->selection_type = 'single_choice';
        $question->answers[1]->is_correct = false;

        $result = $this->grade($question, '101');
        $questionResult = $result['question_results'][0];

        $this->assertSame(2.0, $questionResult['score']);
        $this->assertTrue($questionResult['is_correct']);
        $this->assertSame('101', $questionResult['user_answer']);
    }

    private function grade(Question $question, mixed $submittedAnswer): array
    {
        $quiz = new Quiz(['passing_score' => 70]);
        $quiz->setRelation('questions', collect([$question]));

        return app(QuizGradingService::class)->gradeAttempt(
            $quiz,
            [(string) $question->id => $submittedAnswer],
        );
    }

    private function multipleCorrectQuestion(): Question
    {
        $question = new Question([
            'type' => 'multiple_choice',
            'selection_type' => 'multiple_choice',
            'content' => 'Select all correct answers',
            'points' => 2,
            'order' => 1,
        ]);
        $question->id = 10;

        $answers = collect([
            new Answer(['content' => 'A', 'is_correct' => true]),
            new Answer(['content' => 'B', 'is_correct' => true]),
            new Answer(['content' => 'C', 'is_correct' => false]),
        ]);
        foreach ([101, 102, 103] as $index => $id) {
            $answers[$index]->id = $id;
        }
        $question->setRelation('answers', $answers);

        return $question;
    }
}
