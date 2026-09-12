<?php

namespace App\Http\Requests\Instructor;

use Illuminate\Foundation\Http\FormRequest;

class StoreCourseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Middleware handles auth
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'category_id' => 'nullable|integer|exists:categories,id',
            'level' => 'required|in:beginner,intermediate,advanced',
            'price' => 'numeric|min:0',
            'thumbnail' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
        ];
    }

    protected function prepareForValidation(): void
    {
        $categoryId = $this->input('category_id');
        if ($categoryId === '' || $categoryId === null) {
            $this->merge(['category_id' => null]);
            return;
        }

        $this->merge(['category_id' => (int) $categoryId]);
    }
}
