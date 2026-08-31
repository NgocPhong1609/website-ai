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
            'time_limit_minutes' => 'nullable|integer|min:0',
            'passing_score' => 'nullable|numeric|min:0|max:100',
            'questions' => 'required|array|min:1',
            'questions.*.type' => 'nullable|string|in:multiple_choice,essay,true_false',
            'questions.*.content' => 'required|string',
            'questions.*.explanation' => 'nullable|string',
            'questions.*.sample_answer' => 'nullable|string',
            'questions.*.rubric' => 'nullable|string',
            'questions.*.points' => 'nullable|numeric',
            'questions.*.answers' => 'nullable|array',
            'questions.*.answers.*.content' => 'required_with:questions.*.answers|string',
            'questions.*.answers.*.is_correct' => 'required_with:questions.*.answers|boolean',
        ];
    }

    /**
     * Custom validation: multiple choice questions must have at least 2 answers and exactly one correct answer.
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
