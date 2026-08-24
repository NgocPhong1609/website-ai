<?php

namespace App\Http\Requests\Instructor;

use Illuminate\Foundation\Http\FormRequest;

class SaveCourseDraftRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'expected_lock_version' => ['required', 'integer', 'min:1'],
            'idempotency_key' => ['nullable', 'string', 'max:64'],
            'changes' => ['required', 'array', 'min:1'],
            'changes.title' => ['sometimes', 'string', 'max:255'],
            'changes.description' => ['sometimes', 'nullable', 'string'],
            'changes.category_id' => ['sometimes', 'nullable', 'integer', 'exists:categories,id'],
            'changes.level' => ['sometimes', 'nullable', 'string', 'max:100'],
            'changes.price' => ['sometimes', 'numeric', 'min:0'],
            'changes.sale_price' => ['sometimes', 'nullable', 'numeric', 'min:0'],
            'changes.sale_start_date' => ['sometimes', 'nullable', 'date'],
            'changes.sale_end_date' => ['sometimes', 'nullable', 'date', 'after_or_equal:changes.sale_start_date'],
            'changes.is_flash_sale' => ['sometimes', 'boolean'],
        ];
    }
}
