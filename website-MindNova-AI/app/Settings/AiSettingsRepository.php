<?php

namespace App\Settings;

use App\Models\AdminSetting;
use App\Models\User;

class AiSettingsRepository
{
    private const PACKAGE_DEFAULTS = [
        'free' => [
            'daily_requests' => 30,
            'daily_tokens' => null,
        ],
        'premium' => [
            'daily_requests' => 200,
            'daily_tokens' => null,
        ],
    ];

    private const PROMPT_DEFAULTS = [
        'ai_tro_giang' => 'Ban la AI tro giang, tra loi ngan gon, de hieu, uu tien tieng Viet.',
        'ai_cham_bai' => 'Ban la AI cham bai, phan tich theo tieu chi ro rang va cong bang.',
    ];

    public function packages(): array
    {
        $storedPackages = $this->settingValue('ai.packages.v1');

        if (is_array($storedPackages)) {
            return array_replace_recursive(self::PACKAGE_DEFAULTS, $this->packageValues($storedPackages));
        }

        $packages = self::PACKAGE_DEFAULTS;
        $legacyQuotas = $this->settingValue('ai.quotas');

        if (is_array($legacyQuotas) && isset($legacyQuotas['student_daily_questions'])) {
            $packages['free']['daily_requests'] = $legacyQuotas['student_daily_questions'];
        }

        return $packages;
    }

    public function prompts(): array
    {
        $storedPrompts = $this->settingValue('ai.prompts');

        if (! is_array($storedPrompts)) {
            return self::PROMPT_DEFAULTS;
        }

        return array_replace(self::PROMPT_DEFAULTS, array_intersect_key($storedPrompts, self::PROMPT_DEFAULTS));
    }

    public function packageForUser(?User $user): string
    {
        if ($user === null) {
            return 'free';
        }

        $subscription = $user->subscriptions()
            ->where('plan', 'premium')
            ->where('status', 'active')
            ->latest('created_at')
            ->first();

        if ($subscription !== null && ($subscription->expires_at === null || $subscription->expires_at->isFuture())) {
            return 'premium';
        }

        return 'free';
    }

    public function providerReadiness(): array
    {
        $primary = config('services.gemini');
        $backup = config('services.backup_ai');
        $backupProvider = trim((string) ($backup['provider'] ?? '')) ?: 'openai';
        $backupApiKey = $backup['api_key'] ?? null;

        if (! $this->configured($backupApiKey)) {
            $backupApiKey = $backupProvider === 'groq'
                ? config('services.groq.key')
                : config('services.openai.key');
        }

        return [
            'primary' => [
                'name' => 'gemini',
                'model' => $primary['model'] ?? null,
                'configured' => $this->configured($primary['api_key'] ?? null),
            ],
            'backup' => [
                'name' => $backupProvider,
                'model' => $backup['model'] ?? null,
                'configured' => $this->configured($backupApiKey),
            ],
        ];
    }

    public function saveWritable(array $validated): void
    {
        AdminSetting::updateOrCreate(
            ['key' => 'ai.packages.v1'],
            ['value' => $validated['packages']]
        );

        AdminSetting::updateOrCreate(
            ['key' => 'ai.prompts'],
            ['value' => $validated['prompts']]
        );
    }

    public function updatedAt(): ?string
    {
        $setting = AdminSetting::query()
            ->whereIn('key', ['ai.packages.v1', 'ai.prompts'])
            ->latest('updated_at')
            ->first();

        return $setting?->updated_at?->toISOString();
    }

    private function settingValue(string $key): mixed
    {
        return AdminSetting::query()->where('key', $key)->first()?->value;
    }

    private function packageValues(array $storedPackages): array
    {
        $packages = [];

        foreach (array_keys(self::PACKAGE_DEFAULTS) as $package) {
            if (! isset($storedPackages[$package]) || ! is_array($storedPackages[$package])) {
                continue;
            }

            $packages[$package] = array_intersect_key(
                $storedPackages[$package],
                self::PACKAGE_DEFAULTS[$package]
            );
        }

        return $packages;
    }

    private function configured(mixed $apiKey): bool
    {
        return is_string($apiKey) && trim($apiKey) !== '';
    }
}
