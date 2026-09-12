<?php

namespace App\Http\Requests\Instructor;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCourseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Policy handles auth
    }

    public function rules(): array
    {
        return [
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'category_id' => 'nullable|integer|exists:categories,id',
            'level' => 'sometimes|required|in:beginner,intermediate,advanced',
        ];
    }

    protected function prepareForValidation(): void
    {
        if (! $this->exists('category_id')) {
            return;
        }

        $categoryId = $this->input('category_id');
        if ($categoryId === '' || $categoryId === null) {
            $this->merge(['category_id' => null]);
            return;
        }

        $this->merge(['category_id' => (int) $categoryId]);
    }
}
