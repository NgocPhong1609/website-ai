<?php

namespace App\Http\Requests\Instructor;

use Illuminate\Foundation\Http\FormRequest;

class StoreAiQuizRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() && $this->user()->hasRole('teacher');
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('questions') && is_array($this->questions)) {
            $questions = array_map(function ($q) {
                if (is_array($q)) {
                    if (empty($q['content']) && !empty($q['question'])) {
                        $q['content'] = $q['question'];
                    }
                    if (isset($q['type']) && $q['type'] === 'tu_luan') {
                        $q['type'] = 'essay';
                    }
                }
                return $q;
            }, $this->questions);

            $this->merge(['questions' => $questions]);
        }
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'source_type' => 'nullable|string|in:content,topic,course,manual',
            'source_content' => 'nullable|string',
            'course_id' => 'nullable|integer|exists:courses,id',
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

    public function messages(): array
    {
        return [
            'course_id.required' => 'Vui lòng chọn khóa học trước khi tạo Quiz.',
            'course_id.exists' => 'Khóa học được chọn không tồn tại trong hệ thống.',
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            if ($this->filled('course_id')) {
                $course = \App\Models\Course::find($this->input('course_id'));
                if (!$course || (int) $course->teacher_id !== (int) $this->user()->id) {
                    $validator->errors()->add(
                        'course_id',
                        'Bạn không có quyền quản lý khóa học này.'
                    );
                }
            }

            $questions = $this->input('questions', []);
            if (is_array($questions) && count($questions) > 0) {
                $totalPoints = 0.0;
                foreach ($questions as $q) {
                    $totalPoints += (float) ($q['points'] ?? 0);
                }
                if (abs($totalPoints - 10.0) > 0.001) {
                    $validator->errors()->add(
                        'questions',
                        'Tổng điểm của đề kiểm tra phải bằng 10.'
                    );
                }
            }
        });
    }
}
