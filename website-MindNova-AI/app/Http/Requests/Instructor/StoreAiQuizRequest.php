<?php

namespace App\Http\Requests\Instructor;

use Illuminate\Foundation\Http\FormRequest;

class StoreAiQuizRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() && $this->user()->hasRole('teacher');
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'source_type' => 'nullable|string|in:content,topic',
            'source_content' => 'nullable|string',
            'difficulty' => 'nullable|string|in:easy,medium,hard,mixed',
            'time_limit_minutes' => 'nullable|integer|min:0',
            'passing_score' => 'nullable|integer|min:0|max:100',
            'status' => 'nullable|string|in:draft,published',
            'questions' => 'required|array|min:1',
            'questions.*.type' => 'required|string|in:multiple_choice,essay',
            'questions.*.content' => 'required|string',
            'questions.*.difficulty' => 'nullable|string|in:easy,medium,hard',
            'questions.*.explanation' => 'nullable|string',
            'questions.*.sample_answer' => 'nullable|string',
            'questions.*.rubric' => 'nullable|string',
            'questions.*.points' => 'nullable|numeric|min:0',
            'questions.*.answers' => 'required_if:questions.*.type,multiple_choice|array',
            'questions.*.answers.*.content' => 'required|string',
            'questions.*.answers.*.is_correct' => 'required|boolean',
        ];
    }
}
