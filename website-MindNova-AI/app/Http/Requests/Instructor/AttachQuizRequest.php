<?php

namespace App\Http\Requests\Instructor;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class AttachQuizRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() && ($this->user()->hasRole('teacher') || $this->user()->isAdmin());
    }

    public function rules(): array
    {
        return [
            'course_id' => 'required|exists:courses,id',
            'position' => 'required|in:capability_assessment,end_of_course,in_module,after_lesson',
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
                if (!$course) {
                    $validator->errors()->add('course_id', 'Không tìm thấy khóa học.');
                    return;
                }

                if ((int) $course->teacher_id !== (int) $this->user()->id && !$this->user()->isAdmin()) {
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
                    $lessonCourseId = (int) ($lesson->course_id ?? $lesson->module?->course_id ?? 0);
                    if (!$lesson || $lessonCourseId !== (int) $courseId) {
                        $validator->errors()->add('after_lesson_id', 'Bài học không thuộc khóa học được chọn.');
                    }
                }
            }
        });
    }

    protected function failedValidation(Validator $validator)
    {
        $errors = $validator->errors()->all();
        throw new HttpResponseException(response()->json([
            'success' => false,
            'message' => implode(' ', $errors),
            'error_code' => 'VALIDATION_ERROR',
            'errorCode' => 'VALIDATION_ERROR',
            'errors' => $validator->errors(),
        ], 422));
    }
}
