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
            'quizData.id' => 'nullable',
            'quizData.quiz_id' => 'nullable',
            'quizData.title' => 'nullable|string|max:255',
            'quizData.description' => 'nullable|string',
            'quizData.thumbnail_url' => 'nullable|string|max:2048',
            'quizData.thumbnail_r2_key' => 'nullable|string|max:2048',
            'quizData.time_limit_minutes' => 'nullable|integer',
            'quizData.passing_score' => 'nullable|numeric',
            'quizData.difficulty' => 'nullable|string',
            'quizData.questions' => 'nullable|array',
            'quizData.questions.*.id' => 'nullable',
            'quizData.questions.*.type' => 'nullable|string',
            'quizData.questions.*.selection_type' => 'nullable|string',
            'quizData.questions.*.content' => 'nullable|string',
            'quizData.questions.*.question' => 'nullable|string',
            'quizData.questions.*.image_url' => 'nullable|string|max:2048',
            'quizData.questions.*.image_r2_key' => 'nullable|string|max:2048',
            'quizData.questions.*.explanation' => 'nullable|string',
            'quizData.questions.*.sample_answer' => 'nullable|string',
            'quizData.questions.*.rubric' => 'nullable|string',
            'quizData.questions.*.points' => 'nullable|numeric',
            'quizData.questions.*.difficulty' => 'nullable|string',
            'quizData.questions.*.order' => 'nullable|integer',
            'quizData.questions.*.options' => 'nullable|array',
            'quizData.questions.*.correct_answer_index' => 'nullable|integer',
            'quizData.questions.*.correct_answer_indices' => 'nullable|array',
            'quizData.questions.*.answer_images' => 'nullable|array',
            'quizData.questions.*.answer_images.*.url' => 'nullable|string|max:2048',
            'quizData.questions.*.answer_images.*.r2_key' => 'nullable|string|max:2048',
            'quizData.questions.*.answers' => 'nullable|array',
            'quizData.questions.*.answers.*.id' => 'nullable',
            'quizData.questions.*.answers.*.content' => 'nullable|string',
            'quizData.questions.*.answers.*.is_correct' => 'nullable|boolean',
            'quizData.questions.*.answers.*.image_url' => 'nullable|string|max:2048',
            'quizData.questions.*.answers.*.image_r2_key' => 'nullable|string|max:2048',
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $quizData = $this->input('quizData', []);
            if (!empty($quizData) && is_array($quizData)) {
                $this->validateMedia($validator, $quizData);
            }
        });
    }

    private function validateMedia($validator, array $quizData): void
    {
        $pairs = [[
            'url_path' => 'quizData.thumbnail_url',
            'key_path' => 'quizData.thumbnail_r2_key',
            'url' => $quizData['thumbnail_url'] ?? null,
            'key' => $quizData['thumbnail_r2_key'] ?? null,
        ]];

        foreach ($quizData['questions'] ?? [] as $qIndex => $question) {
            $pairs[] = [
                'url_path' => "quizData.questions.{$qIndex}.image_url",
                'key_path' => "quizData.questions.{$qIndex}.image_r2_key",
                'url' => $question['image_url'] ?? null,
                'key' => $question['image_r2_key'] ?? null,
            ];

            foreach ($question['answers'] ?? [] as $aIndex => $answer) {
                $pairs[] = [
                    'url_path' => "quizData.questions.{$qIndex}.answers.{$aIndex}.image_url",
                    'key_path' => "quizData.questions.{$qIndex}.answers.{$aIndex}.image_r2_key",
                    'url' => $answer['image_url'] ?? null,
                    'key' => $answer['image_r2_key'] ?? null,
                ];
            }

            foreach ($question['answer_images'] ?? [] as $imgIndex => $img) {
                if (is_array($img)) {
                    $pairs[] = [
                        'url_path' => "quizData.questions.{$qIndex}.answer_images.{$imgIndex}.url",
                        'key_path' => "quizData.questions.{$qIndex}.answer_images.{$imgIndex}.r2_key",
                        'url' => $img['url'] ?? null,
                        'key' => $img['r2_key'] ?? null,
                    ];
                }
            }
        }

        $lessonQuiz = $this->route('lesson')?->quiz;
        $media = app(\App\Services\Instructor\QuizMediaService::class);
        foreach ($pairs as $pair) {
            if ($pair['key']) {
                if (!$media->isManagedKeyValid($this->user(), $lessonQuiz, $pair['key'])) {
                    $validator->errors()->add($pair['key_path'], 'Managed quiz media key is invalid or not owned by this instructor.');
                }
                continue;
            }

            if ($pair['url']) {
                $scheme = strtolower((string) parse_url($pair['url'], PHP_URL_SCHEME));
                if (!filter_var($pair['url'], FILTER_VALIDATE_URL) || !in_array($scheme, ['http', 'https'], true)) {
                    $validator->errors()->add($pair['url_path'], 'Media URL must use HTTP or HTTPS.');
                }
            }
        }
    }

    public function messages(): array
    {
        return [
            'status.in' => 'Bài học chỉ có thể được tạo ở trạng thái bản nháp.',
        ];
    }
}
