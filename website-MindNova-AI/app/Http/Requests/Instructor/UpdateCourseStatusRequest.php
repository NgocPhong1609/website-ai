<?php

namespace App\Http\Requests\Instructor;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCourseStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Policy handles auth
    }

    protected function prepareForValidation()
    {
        // If frontend tries to publish, force it to draft
        if ($this->input('status') === 'published') {
            $this->merge(['status' => 'draft']);
        }
    }

    public function rules(): array
    {
        return [
            // RULE 1 & 2: Teacher can ONLY set draft or pending_review
            // Teacher CANNOT set: published, approved, archived
            'status' => 'required|in:draft,pending_review',
        ];
    }

    public function messages(): array
    {
        return [
            'status.in' => 'Giáo viên chỉ có thể chuyển trạng thái sang "Bản nháp" hoặc "Gửi kiểm duyệt".',
        ];
    }
}
