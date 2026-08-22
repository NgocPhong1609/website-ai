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

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $courseId = $this->input('course_id');
            if ($courseId) {
                $course = \App\Models\Course::find($courseId);
                if (!$course || (int) $course->teacher_id !== (int) $this->user()->id) {
                    $validator->errors()->add('course_id', 'Bạn không có quyền quản lý khóa học này.');
                    return;
                }

                if ($this->input('position') === 'in_module' && $this->filled('module_id')) {
                    $module = \App\Models\CourseModule::find($this->input('module_id'));
                    if (!$module || (int) $module->course_id !== (int) $courseId) {
                        $validator->errors()->add('module_id', 'Module không thuộc khóa học được chọn.');
                    }
                }

                if ($this->input('position') === 'after_lesson' && $this->filled('after_lesson_id')) {
                    $lesson = \App\Models\Lesson::find($this->input('after_lesson_id'));
                    if (!$lesson || (int) $lesson->course_id !== (int) $courseId) {
                        $validator->errors()->add('after_lesson_id', 'Bài học không thuộc khóa học được chọn.');
                    }
                }
            }
        });
    }
}
