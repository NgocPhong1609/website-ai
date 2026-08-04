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
            'video_url' => 'nullable|string',
            'order' => 'integer|min:0',
            'status' => 'required|in:draft,published',
            'temp_media_ids' => 'nullable|array',
            'temp_media_ids.*' => 'integer|exists:lesson_media,id',
            'quizData' => 'nullable|array',
            'quizData.time_limit_minutes' => 'nullable|integer',
            'quizData.passing_score' => 'nullable|numeric',
            'quizData.questions' => 'nullable|array',
        ];
    }
}
