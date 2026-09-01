<?php

namespace App\Http\Requests\Instructor;

use Illuminate\Foundation\Http\FormRequest;

class StoreLessonRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation()
    {
        $mergeData = [];

        if (!$this->has('status')) {
            $mergeData['status'] = 'draft';
        }

        if ($this->type === 'quiz') {
            $mergeData['type'] = 'quiz_module';
        } elseif ($this->type === 'document') {
            $mergeData['type'] = 'article';
        }

        if (!empty($mergeData)) {
            $this->merge($mergeData);
        }
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'type' => 'required|in:video,article,quiz_module,quiz,document',
            'content' => 'nullable|string',
            'video_url' => 'nullable|string',
            'order' => 'integer|min:0',
            'status' => 'sometimes|in:draft,published',
            'temp_media_ids' => 'nullable|array',
            'temp_media_ids.*' => 'integer|exists:lesson_media,id',
            'quizData' => 'nullable|array',
            'quizData.time_limit_minutes' => 'nullable|integer',
            'quizData.passing_score' => 'nullable|numeric',
            'quizData.questions' => 'nullable|array',
        ];
    }

    public function messages(): array
    {
        return [
            'status.in' => 'Bài học chỉ có thể được tạo ở trạng thái bản nháp.',
        ];
    }
}
