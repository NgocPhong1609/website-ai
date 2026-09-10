<?php

namespace App\Settings;

use App\Models\AdminSetting;
use InvalidArgumentException;

class CommissionSettingsRepository
{
    public const SETTING_KEY = 'commission.tiers.v1';

    private const DEFAULTS = [
        'standard' => [
            'label' => 'Đối Tác Tiêu Chuẩn',
            'platform_commission_percent' => 30.0,
        ],
        'exclusive' => [
            'label' => 'Hợp Tác Độc Quyền MindNova',
            'platform_commission_percent' => 15.0,
        ],
    ];

    public function tiers(): array
    {
        $stored = AdminSetting::query()->where('key', self::SETTING_KEY)->first()?->value;
        $definitions = is_array($stored) ? $stored : self::DEFAULTS;

        return collect($definitions)
            ->map(function (mixed $definition, string|int $key): ?array {
                if (! is_array($definition)) {
                    return null;
                }

                $tier = is_string($key) ? $key : ($definition['tier'] ?? null);
                $percent = $definition['platform_commission_percent'] ?? null;
                if (! is_string($tier) || ! is_numeric($percent)) {
                    return null;
                }

                $platformPercent = (float) $percent;

                return [
                    'tier' => $tier,
                    'label' => (string) ($definition['label'] ?? self::DEFAULTS[$tier]['label'] ?? $tier),
                    'platform_commission_percent' => $platformPercent,
                    'instructor_percent' => 100.0 - $platformPercent,
                ];
            })
            ->filter()
            ->values()
            ->all();
    }

    public function tier(string $tier): array
    {
        foreach ($this->tiers() as $definition) {
            if ($definition['tier'] === $tier) {
                return $definition;
            }
        }

        throw new InvalidArgumentException("Unknown partnership tier [{$tier}].");
    }

    public function tierKeys(): array
    {
        return array_column($this->tiers(), 'tier');
    }

    public function save(array $tiers): array
    {
        $current = collect($this->tiers())->keyBy('tier');
        $stored = $current->mapWithKeys(fn (array $definition): array => [
            $definition['tier'] => [
                'label' => $definition['label'],
                'platform_commission_percent' => $definition['platform_commission_percent'],
            ],
        ])->all();
        $seen = [];

        foreach ($tiers as $definition) {
            if (! is_array($definition)
                || ! isset($definition['tier'], $definition['platform_commission_percent'])
                || ! is_string($definition['tier'])
                || ! is_numeric($definition['platform_commission_percent'])) {
                throw new InvalidArgumentException('Each commission tier must include a tier and numeric platform percentage.');
            }

            $tier = $definition['tier'];
            $percent = (float) $definition['platform_commission_percent'];
            if (isset($seen[$tier]) || $percent < 0 || $percent > 100) {
                throw new InvalidArgumentException("Invalid commission tier [{$tier}].");
            }
            $seen[$tier] = true;
            $stored[$tier] = [
                'label' => (string) ($definition['label'] ?? $current->get($tier)['label'] ?? $tier),
                'platform_commission_percent' => $percent,
            ];
        }

        AdminSetting::updateOrCreate(
            ['key' => self::SETTING_KEY],
            ['value' => $stored],
        );

        return $this->tiers();
    }
}
