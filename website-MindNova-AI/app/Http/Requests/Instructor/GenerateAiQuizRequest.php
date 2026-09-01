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
            'source_type' => 'nullable|in:content,topic,course',
            'course_id' => 'required|integer|exists:courses,id',
            'content' => 'nullable|string',
            'topic' => 'nullable|string',
            'difficulty' => 'required|string|in:easy,medium,hard,mixed',
            'total_questions' => 'required|integer|min:1|max:50',
            'multiple_choice_count' => 'required|integer|min:0',
            'essay_count' => 'required|integer|min:0',
            'time_limit_minutes' => 'nullable|integer|min:0',
            'passing_score' => 'nullable|integer|min:0|max:100',
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
            $total = (int) $this->input('total_questions');
            $mc = (int) $this->input('multiple_choice_count');
            $essay = (int) $this->input('essay_count');

            if ($mc + $essay !== $total) {
                $validator->errors()->add(
                    'total_questions',
                    "Tổng số câu hỏi ({$total}) phải bằng tổng số câu trắc nghiệm ({$mc}) + tự luận ({$essay})."
                );
            }

            if ($this->filled('course_id')) {
                $course = \App\Models\Course::find($this->input('course_id'));
                if (!$course) {
                    $validator->errors()->add('course_id', 'Khóa học không tồn tại.');
                } elseif ((int) $course->teacher_id !== (int) $this->user()->id && !$this->user()->hasRole('admin')) {
                    $validator->errors()->add(
                        'course_id',
                        'Bạn không có quyền quản lý khóa học này.'
                    );
                }
            }
        });
    }

    protected function failedValidation(\Illuminate\Contracts\Validation\Validator $validator)
    {
        throw new \Illuminate\Http\Exceptions\HttpResponseException(
            response()->json([
                'success' => false,
                'message' => $validator->errors()->first(),
                'error_code' => 'VALIDATION_ERROR',
                'errorCode' => 'VALIDATION_ERROR',
                'errors' => $validator->errors(),
            ], 422)
        );
    }
}
