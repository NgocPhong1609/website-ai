<?php

namespace App\Http\Requests\Instructor;

use Illuminate\Foundation\Http\FormRequest;

class StoreLessonRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'type' => 'required|in:video,article,quiz_module',
            'content' => 'nullable|string',
            'order' => 'integer|min:0',
            'duration_minutes' => 'integer|min:0',
        ];
    }
}
