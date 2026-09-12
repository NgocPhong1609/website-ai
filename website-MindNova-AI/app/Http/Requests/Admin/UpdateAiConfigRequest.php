<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class UpdateAiConfigRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    public function rules(): array
    {
        return [
            'packages' => ['required', 'array:free,premium'],
            'packages.free.daily_requests' => ['required', 'integer', 'min:1', 'max:2000'],
            'packages.free.daily_tokens' => ['nullable', 'integer', 'min:1'],
            'packages.premium.daily_requests' => ['required', 'integer', 'min:1', 'max:10000'],
            'packages.premium.daily_tokens' => ['nullable', 'integer', 'min:1'],
            'prompts' => ['required', 'array:ai_tro_giang,ai_cham_bai'],
            'prompts.ai_tro_giang' => ['required', 'string', 'max:4000'],
            'prompts.ai_cham_bai' => ['required', 'string', 'max:4000'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            $this->rejectUnknownKeys($validator, '', ['packages', 'prompts']);
            $this->rejectUnknownKeys($validator, 'packages', ['free', 'premium']);
            $this->rejectUnknownKeys($validator, 'packages.free', ['daily_requests', 'daily_tokens']);
            $this->rejectUnknownKeys($validator, 'packages.premium', ['daily_requests', 'daily_tokens']);
            $this->rejectUnknownKeys($validator, 'prompts', ['ai_tro_giang', 'ai_cham_bai']);
        });
    }

    private function rejectUnknownKeys(Validator $validator, string $path, array $allowed): void
    {
        $data = $path === '' ? $this->all() : $this->input($path);

        if (! is_array($data)) {
            return;
        }

        foreach (array_keys($data) as $key) {
            if (! in_array($key, $allowed, true)) {
                $attribute = $path === '' ? $key : "{$path}.{$key}";
                $validator->errors()->add($attribute, 'This setting is not writable.');
            }
        }
    }
}
