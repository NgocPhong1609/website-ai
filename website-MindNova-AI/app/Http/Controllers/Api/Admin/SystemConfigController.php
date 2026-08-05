<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\AdminSetting;
use App\Models\AiUsageLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SystemConfigController extends Controller
{
    public function show(): JsonResponse
    {
        return response()->json([
            'providers' => $this->getSetting('ai.providers', [
                'primary' => 'openai',
                'connections' => [
                    ['name' => 'openai', 'enabled' => true, 'has_key' => false],
                    ['name' => 'gemini', 'enabled' => false, 'has_key' => false],
                    ['name' => 'claude', 'enabled' => false, 'has_key' => false],
                    ['name' => 'internal', 'enabled' => false, 'has_key' => false],
                ],
            ]),
            'quotas' => $this->getSetting('ai.quotas', [
                'student_daily_questions' => 30,
                'guest_daily_questions' => 5,
            ]),
            'prompts' => $this->getSetting('ai.prompts', [
                'ai_tro_giang' => 'Ban la AI tro giang, tra loi ngan gon, de hieu, uu tien tieng Viet.',
                'ai_cham_bai' => 'Ban la AI cham bai, phan tich theo tieu chi ro rang va cong bang.',
            ]),
            'usage_today' => [
                'total_requests' => AiUsageLog::whereDate('created_at', now()->toDateString())->count(),
                'estimated_cost' => (float) AiUsageLog::whereDate('created_at', now()->toDateString())->sum('cost_estimate'),
            ],
        ]);
    }

    public function update(Request $request): JsonResponse
    {
        $data = $request->validate([
            'providers' => ['nullable', 'array'],
            'providers.primary' => ['nullable', 'string'],
            'providers.connections' => ['nullable', 'array'],
            'quotas' => ['nullable', 'array'],
            'quotas.student_daily_questions' => ['nullable', 'integer', 'min:1', 'max:2000'],
            'quotas.guest_daily_questions' => ['nullable', 'integer', 'min:1', 'max:500'],
            'prompts' => ['nullable', 'array'],
            'prompts.ai_tro_giang' => ['nullable', 'string', 'max:4000'],
            'prompts.ai_cham_bai' => ['nullable', 'string', 'max:4000'],
        ]);

        if (array_key_exists('providers', $data)) {
            $this->setSetting('ai.providers', $data['providers']);
        }

        if (array_key_exists('quotas', $data)) {
            $this->setSetting('ai.quotas', $data['quotas']);
        }

        if (array_key_exists('prompts', $data)) {
            $this->setSetting('ai.prompts', $data['prompts']);
        }

        return response()->json([
            'message' => 'Cap nhat cau hinh AI va he thong thanh cong.',
        ]);
    }

    private function getSetting(string $key, mixed $default): mixed
    {
        $setting = AdminSetting::where('key', $key)->first();
        return $setting?->value ?? $default;
    }

    private function setSetting(string $key, mixed $value): void
    {
        AdminSetting::updateOrCreate(
            ['key' => $key],
            ['value' => $value]
        );
    }
}
