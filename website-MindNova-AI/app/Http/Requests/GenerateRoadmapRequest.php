<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class GenerateRoadmapRequest extends FormRequest
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
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'goal' => ['required', 'string', 'max:255'],
            'level' => ['required', 'string', 'in:beginner,intermediate,advanced'],
            'topics' => ['required', 'array', 'min:1', 'max:10'],
            'topics.*' => ['required', 'string', 'max:100'],
        ];
    }

    /**
     * Custom error messages.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'goal.required' => 'Mục tiêu học tập là bắt buộc.',
            'goal.max' => 'Mục tiêu không được vượt quá 255 ký tự.',
            'level.required' => 'Trình độ là bắt buộc.',
            'level.in' => 'Trình độ phải là: beginner, intermediate, hoặc advanced.',
            'topics.required' => 'Chủ đề quan tâm là bắt buộc.',
            'topics.min' => 'Phải có ít nhất 1 chủ đề.',
            'topics.max' => 'Tối đa 10 chủ đề.',
            'topics.*.string' => 'Mỗi chủ đề phải là chuỗi ký tự.',
            'topics.*.max' => 'Mỗi chủ đề không được vượt quá 100 ký tự.',
        ];
    }

    /**
     * Handle a failed validation attempt.
     * Return JSON thay vì redirect (API mode).
     */
    protected function failedValidation(Validator $validator): void
    {
        throw new HttpResponseException(
            response()->json([
                'success' => false,
                'data' => null,
                'message' => 'Validation failed.',
                'errors' => $validator->errors(),
                'timestamp' => now()->toISOString(),
            ], 422)
        );
    }
}
