<?php

namespace App\Http\Requests\Instructor;

use Illuminate\Foundation\Http\FormRequest;

class GenerateAiQuizRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() && $this->user()->hasRole('teacher');
    }

    public function rules(): array
    {
        return [
            'source_type' => 'required|in:content,topic',
            'content' => 'required_if:source_type,content|nullable|string|min:10',
            'topic' => 'required_if:source_type,topic|nullable|string|min:3',
            'difficulty' => 'required|string|in:easy,medium,hard,mixed',
            'total_questions' => 'required|integer|min:1|max:50',
            'multiple_choice_count' => 'required|integer|min:0',
            'essay_count' => 'required|integer|min:0',
            'time_limit_minutes' => 'nullable|integer|min:0',
            'passing_score' => 'nullable|integer|min:0|max:100',
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $total = (int) $this->input('total_questions');
            $mc = (int) $this->input('multiple_choice_count');
            $essay = (int) $this->input('essay_count');

            if ($mc + $essay !== $total) {
                $validator->errors()->add(
                    'total_questions',
                    "Tổng số câu hỏi ({$total}) phải bằng tổng số câu trắc nghiệm ({$mc}) + tự luận ({$essay})."
                );
            }
        });
    }
}
