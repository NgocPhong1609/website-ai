<?php

namespace App\Http\Requests\Instructor;

use App\Services\Instructor\QuizMediaService;
use Illuminate\Foundation\Http\FormRequest;

class StoreQuizRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'thumbnail_url' => 'nullable|string|max:2048',
            'thumbnail_r2_key' => 'nullable|string|max:2048',
            'time_limit_minutes' => 'nullable|integer|min:0',
            'passing_score' => 'nullable|numeric|min:0|max:100',
            'questions' => 'required|array|min:1',
            'questions.*.type' => 'nullable|string|in:multiple_choice,essay,true_false',
            'questions.*.selection_type' => 'nullable|string|in:single_choice,multiple_choice',
            'questions.*.content' => 'required|string',
            'questions.*.image_url' => 'nullable|string|max:2048',
            'questions.*.image_r2_key' => 'nullable|string|max:2048',
            'questions.*.explanation' => 'nullable|string',
            'questions.*.sample_answer' => 'nullable|string',
            'questions.*.rubric' => 'nullable|string',
            'questions.*.points' => 'nullable|numeric',
            'questions.*.answers' => 'nullable|array',
            'questions.*.answers.*.content' => 'required_with:questions.*.answers|string',
            'questions.*.answers.*.is_correct' => 'required_with:questions.*.answers|boolean',
            'questions.*.answers.*.image_url' => 'nullable|string|max:2048',
            'questions.*.answers.*.image_r2_key' => 'nullable|string|max:2048',
        ];
    }

    /**
     * Custom validation for single- and multiple-correct questions.
     */
    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $questions = $this->input('questions', []);
            foreach ($questions as $qIndex => $question) {
                $type = $question['type'] ?? 'multiple_choice';
                if ($type === 'essay') {
                    continue;
                }
                $answers = $question['answers'] ?? [];
                if (count($answers) < 2) {
                    $validator->errors()->add(
                        "questions.{$qIndex}.answers",
                        "Câu hỏi trắc nghiệm " . ($qIndex + 1) . " phải có ít nhất 2 đáp án."
                    );
                    continue;
                }
                $correctCount = collect($answers)->where('is_correct', true)->count();
                $selectionType = $question['selection_type'] ?? 'single_choice';
                $validCorrectCount = $selectionType === 'multiple_choice'
                    ? $correctCount >= 2
                    : $correctCount === 1;

                if (!$validCorrectCount) {
                    $requirement = $selectionType === 'multiple_choice'
                        ? 'ít nhất 2 đáp án đúng'
                        : 'đúng 1 đáp án đúng';
                    $validator->errors()->add(
                        "questions.{$qIndex}.answers",
                        "Câu hỏi " . ($qIndex + 1) . " phải có {$requirement} (hiện có {$correctCount})."
                    );
                }
            }

            $this->validateMedia($validator, $questions);
        });
    }

    private function validateMedia($validator, array $questions): void
    {
        $pairs = [['url_path' => 'thumbnail_url', 'key_path' => 'thumbnail_r2_key', 'url' => $this->input('thumbnail_url'), 'key' => $this->input('thumbnail_r2_key')]];
        foreach ($questions as $qIndex => $question) {
            $pairs[] = ['url_path' => "questions.{$qIndex}.image_url", 'key_path' => "questions.{$qIndex}.image_r2_key", 'url' => $question['image_url'] ?? null, 'key' => $question['image_r2_key'] ?? null];
            foreach ($question['answers'] ?? [] as $aIndex => $answer) {
                $pairs[] = ['url_path' => "questions.{$qIndex}.answers.{$aIndex}.image_url", 'key_path' => "questions.{$qIndex}.answers.{$aIndex}.image_r2_key", 'url' => $answer['image_url'] ?? null, 'key' => $answer['image_r2_key'] ?? null];
            }
        }

        $lessonQuiz = $this->route('lesson')?->quiz;
        $media = app(QuizMediaService::class);
        foreach ($pairs as $pair) {
            if ($pair['key']) {
                if (!$media->isManagedKeyValid($this->user(), $lessonQuiz, $pair['key'])) {
                    $validator->errors()->add($pair['key_path'], 'Managed quiz media key is invalid or not owned by this instructor.');
                }
                continue;
            }

            if ($pair['url']) {
                $scheme = strtolower((string) parse_url($pair['url'], PHP_URL_SCHEME));
                if (!filter_var($pair['url'], FILTER_VALIDATE_URL) || !in_array($scheme, ['http', 'https'], true)) {
                    $validator->errors()->add($pair['url_path'], 'Media URL must use HTTP or HTTPS.');
                }
            }
        }
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Tiêu đề bài kiểm tra là bắt buộc.',
            'questions.required' => 'Bài kiểm tra phải có ít nhất 1 câu hỏi.',
            'questions.min' => 'Bài kiểm tra phải có ít nhất 1 câu hỏi.',
            'questions.*.content.required' => 'Nội dung câu hỏi không được để trống.',
            'questions.*.answers.required' => 'Mỗi câu hỏi phải có đáp án.',
            'questions.*.answers.min' => 'Mỗi câu hỏi phải có ít nhất 2 đáp án.',
            'questions.*.answers.max' => 'Mỗi câu hỏi tối đa 4 đáp án.',
            'questions.*.answers.*.content.required' => 'Nội dung đáp án không được để trống.',
        ];
    }
}
