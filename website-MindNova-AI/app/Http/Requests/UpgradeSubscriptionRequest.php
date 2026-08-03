<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpgradeSubscriptionRequest extends FormRequest
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
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'plan' => ['required', 'string', 'in:free,premium'],
            'expires_at' => ['nullable', 'date', 'after:today'],
            'payment_id' => ['nullable', 'integer', 'exists:payments,id'],
            'metadata' => ['nullable', 'array'],
            'metadata.*' => ['string'],
        ];
    }
}
