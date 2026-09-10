<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCommissionSettingsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    public function rules(): array
    {
        return [
            'tiers' => ['required', 'array', 'min:1'],
            'tiers.*.tier' => ['required', 'string', 'alpha_dash', 'max:50', 'distinct'],
            'tiers.*.label' => ['sometimes', 'string', 'max:100'],
            'tiers.*.platform_commission_percent' => ['required', 'numeric', 'min:0', 'max:100'],
        ];
    }
}
