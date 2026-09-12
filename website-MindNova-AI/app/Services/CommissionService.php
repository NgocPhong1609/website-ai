<?php

namespace App\Services;

use App\Settings\CommissionSettingsRepository;

class CommissionService
{
    public function __construct(private readonly CommissionSettingsRepository $settings) {}

    public function tiers(): array
    {
        return $this->settings->tiers();
    }

    public function quote(string $tier, float|int|string $grossAmount): array
    {
        $definition = $this->settings->tier($tier);
        $gross = round((float) $grossAmount, 2);
        $platformPercent = round((float) $definition['platform_commission_percent'], 2);
        $platformAmount = round($gross * $platformPercent / 100, 2);

        return [
            'tier' => $definition['tier'],
            'gross_amount' => $gross,
            'platform_commission_percent' => $platformPercent,
            'platform_amount' => $platformAmount,
            'instructor_percent' => round(100.0 - $platformPercent, 2),
            'instructor_amount' => round($gross - $platformAmount, 2),
        ];
    }
}
