<?php

namespace App\Http\Requests\Student;

use Illuminate\Foundation\Http\FormRequest;

class AiChatRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'message' => 'required|string|max:2000',
            'lesson_id' => 'nullable|integer|min:1',
            'history' => 'nullable|array|max:4',
            'history.*.sender' => 'required|in:user,ai',
            'history.*.text' => 'required|string|max:2000',
        ];
    }
}
