<?php

namespace App\Http\Requests\Instructor;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Storage;

class StoreAiQuizRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() && $this->user()->hasRole('teacher');
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('questions') && is_array($this->questions)) {
            $questions = array_map(function ($q) {
                if (is_array($q)) {
                    if (empty($q['content']) && !empty($q['question'])) {
                        $q['content'] = $q['question'];
                    }
                    if (isset($q['type']) && $q['type'] === 'tu_luan') {
                        $q['type'] = 'essay';
                    }
                }
                return $q;
            }, $this->questions);

            $this->merge(['questions' => $questions]);
        }
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'thumbnail_url' => $this->mediaUrlRules('thumbnail_r2_key'),
            'thumbnail_r2_key' => 'nullable|string|max:2048',
            'source_type' => 'nullable|string|in:content,topic,course,manual',
            'source_content' => 'nullable|string',
            'course_id' => 'nullable|integer|exists:courses,id',
            'difficulty' => 'nullable|string|in:easy,medium,hard,mixed',
            'time_limit_minutes' => 'nullable|integer|min:0',
            'passing_score' => 'nullable|integer|min:0|max:100',
            'status' => 'nullable|string|in:draft,published',
            'questions' => 'required|array|min:1',
            'questions.*.type' => 'required|string|in:multiple_choice,essay',
            'questions.*.selection_type' => 'nullable|string|in:single_choice,multiple_choice',
            'questions.*.content' => 'required|string',
            'questions.*.image_url' => $this->mediaUrlRules('questions.*.image_r2_key'),
            'questions.*.image_r2_key' => 'nullable|string|max:2048',
            'questions.*.difficulty' => 'nullable|string|in:easy,medium,hard',
            'questions.*.explanation' => 'nullable|string',
            'questions.*.sample_answer' => 'nullable|string',
            'questions.*.rubric' => 'nullable|string',
            'questions.*.points' => 'nullable|numeric|min:0',
            'questions.*.answers' => 'required_if:questions.*.type,multiple_choice|array',
            'questions.*.answers.*.content' => 'required|string',
            'questions.*.answers.*.is_correct' => 'required|boolean',
            'questions.*.answers.*.image_url' => $this->mediaUrlRules('questions.*.answers.*.image_r2_key'),
            'questions.*.answers.*.image_r2_key' => 'nullable|string|max:2048',
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
            if ($this->filled('course_id')) {
                $course = \App\Models\Course::find($this->input('course_id'));
                if (!$course || (int) $course->teacher_id !== (int) $this->user()->id) {
                    $validator->errors()->add(
                        'course_id',
                        'Bạn không có quyền quản lý khóa học này.'
                    );
                }
            }

            $questions = $this->input('questions', []);
            if (is_array($questions) && count($questions) > 0) {
                $totalPoints = 0.0;
                foreach ($questions as $qIndex => $q) {
                    $totalPoints += (float) ($q['points'] ?? 0);

                    if (($q['type'] ?? null) !== 'multiple_choice') {
                        continue;
                    }

                    $answers = $q['answers'] ?? [];
                    if (count($answers) < 2) {
                        $validator->errors()->add(
                            "questions.{$qIndex}.answers",
                            'Câu hỏi trắc nghiệm phải có ít nhất 2 đáp án.'
                        );
                        continue;
                    }

                    $correctCount = collect($answers)->where('is_correct', true)->count();
                    $selectionType = $q['selection_type'] ?? 'single_choice';
                    $validCorrectCount = $selectionType === 'multiple_choice'
                        ? $correctCount >= 2
                        : $correctCount === 1;

                    if (!$validCorrectCount) {
                        $requirement = $selectionType === 'multiple_choice'
                            ? 'ít nhất 2 đáp án đúng'
                            : 'đúng 1 đáp án đúng';
                        $validator->errors()->add(
                            "questions.{$qIndex}.answers",
                            "Câu hỏi " . ($qIndex + 1) . " phải có {$requirement} (hiện có {$correctCount})."
                        );
                    }
                }
                if (abs($totalPoints - 10.0) > 0.001) {
                    $validator->errors()->add(
                        'questions',
                        'Tổng điểm của đề kiểm tra phải bằng 10.'
                    );
                }
            }

            $this->validateManagedMediaKeys($validator);
        });
    }

    private function mediaUrlRules(string $keyPath): array
    {
        return ['nullable', 'string', 'max:2048', function (string $attribute, mixed $value, \Closure $fail) use ($keyPath) {
            $resolvedKeyPath = $keyPath;
            preg_match_all('/\.([0-9]+)(?:\.|$)/', $attribute, $matches);
            foreach ($matches[1] as $index) {
                $resolvedKeyPath = preg_replace('/\*/', $index, $resolvedKeyPath, 1);
            }

            if (data_get($this->all(), $resolvedKeyPath)) {
                return;
            }

            $scheme = is_string($value) ? strtolower((string) parse_url($value, PHP_URL_SCHEME)) : '';
            if (!filter_var($value, FILTER_VALIDATE_URL) || !in_array($scheme, ['http', 'https'], true)) {
                $fail('The :attribute field must be a valid HTTP or HTTPS URL.');
            }
        }];
    }

    private function validateManagedMediaKeys($validator): void
    {
        $pairs = [[
            'path' => 'thumbnail_r2_key',
            'key' => $this->input('thumbnail_r2_key'),
        ]];
        foreach ($this->input('questions', []) as $qIndex => $question) {
            $pairs[] = ['path' => "questions.{$qIndex}.image_r2_key", 'key' => $question['image_r2_key'] ?? null];
            foreach ($question['answers'] ?? [] as $aIndex => $answer) {
                $pairs[] = ['path' => "questions.{$qIndex}.answers.{$aIndex}.image_r2_key", 'key' => $answer['image_r2_key'] ?? null];
            }
        }

        $tempPrefix = 'temp/quiz-media/'.$this->user()->id.'/';
        $quiz = $this->route('quiz');
        $quizPrefix = $quiz ? "quizzes/{$quiz->id}/" : null;
        foreach ($pairs as $pair) {
            if (!$pair['key']) {
                continue;
            }
            $hasAllowedPrefix = str_starts_with($pair['key'], $tempPrefix)
                || ($quizPrefix && str_starts_with($pair['key'], $quizPrefix));
            if (!$hasAllowedPrefix || !Storage::disk('r2')->exists($pair['key'])) {
                $validator->errors()->add($pair['path'], 'Managed quiz media key is invalid or not owned by this instructor.');
            }
        }
    }
}
