<?php

namespace App\Http\Requests\Instructor;

use Illuminate\Foundation\Http\FormRequest;

class AttachQuizRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() && $this->user()->hasRole('teacher');
    }

    public function rules(): array
    {
        return [
            'course_id' => 'required|exists:courses,id',
            'position' => 'required|in:end_of_course,in_module,after_lesson',
            'module_id' => 'required_if:position,in_module|nullable|exists:course_modules,id',
            'after_lesson_id' => 'required_if:position,after_lesson|nullable|exists:lessons,id',
        ];
    }
}
