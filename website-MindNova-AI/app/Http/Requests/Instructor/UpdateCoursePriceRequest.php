<?php

namespace App\Http\Requests\Instructor;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCoursePriceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $rules = [
            'price' => 'required|numeric|min:0|max:100000000',
            'partnership_tier' => 'nullable|string|in:standard,exclusive',
            'is_flash_sale' => 'sometimes|boolean',
            'sale_start_date' => 'nullable|date',
            'sale_end_date' => 'nullable|date|after:sale_start_date',
        ];

        // Only enforce sale_price < price when the course is paid (price > 0).
        // For free courses (price = 0), sale_price is simply ignored/nullable.
        if ($this->input('price') > 0 && $this->boolean('is_flash_sale') && $this->filled('sale_price')) {
            $rules['sale_price'] = 'nullable|numeric|min:0|lt:price';
        } else {
            $rules['sale_price'] = 'nullable';
        }

        return $rules;
    }
}
