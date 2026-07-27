<?php

namespace App\Http\Requests\Instructor;

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
            'time_limit_minutes' => 'integer|min:0',
            'passing_score' => 'integer|min:0|max:100',
            'questions' => 'required|array|min:1',
            'questions.*.content' => 'required|string',
            'questions.*.answers' => 'required|array|min:2|max:4',
            'questions.*.answers.*.content' => 'required|string',
            'questions.*.answers.*.is_correct' => 'required|boolean',
        ];
    }

    /**
     * Custom validation: each question must have exactly one correct answer.
     */
    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $questions = $this->input('questions', []);
            foreach ($questions as $qIndex => $question) {
                $answers = $question['answers'] ?? [];
                $correctCount = collect($answers)->where('is_correct', true)->count();
                if ($correctCount !== 1) {
                    $validator->errors()->add(
                        "questions.{$qIndex}.answers",
                        "Câu hỏi " . ($qIndex + 1) . " phải có đúng 1 đáp án đúng (hiện có {$correctCount})."
                    );
                }
            }
        });
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
