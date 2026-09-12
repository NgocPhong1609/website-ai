<?php

namespace App\Services\Ai;

use App\Models\AiDailyQuotaUsage;
use App\Models\User;
use App\Settings\AiSettingsRepository;
use Carbon\CarbonImmutable;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class AiDailyQuotaService
{
    public function __construct(private readonly AiSettingsRepository $settings) {}

    /**
     * Reserve and commit before the caller performs any provider I/O.
     *
     * @return array{allowed: bool, package: string, daily_limit: int, used: int, remaining: int, resets_at: string}
     */
    public function reserve(User $user, string $feature = 'ai_tutor'): array
    {
        $package = $this->settings->packageForUser($user);
        $packages = $this->settings->packages();
        $validated = Validator::make([
            'daily_requests' => $packages[$package]['daily_requests'] ?? null,
        ], [
            'daily_requests' => ['required', 'integer', 'min:1', 'max:'.($package === 'premium' ? 10000 : 2000)],
        ])->validate();
        $limit = (int) $validated['daily_requests'];
        $instant = CarbonImmutable::now(config('app.timezone'));
        $usageDate = $instant->toDateString();
        $resetsAt = $instant->addDay()->startOfDay();

        for ($attempt = 1; ; $attempt++) {
            try {
                return DB::transaction(function () use ($user, $feature, $package, $limit, $usageDate, $resetsAt): array {
                    AiDailyQuotaUsage::query()->firstOrCreate([
                        'user_id' => $user->id,
                        'feature' => $feature,
                        'usage_date' => $usageDate,
                    ], ['used' => 0]);

                    $usage = AiDailyQuotaUsage::query()
                        ->where('user_id', $user->id)
                        ->where('feature', $feature)
                        ->whereDate('usage_date', $usageDate)
                        ->lockForUpdate()
                        ->sole();

                    $allowed = $usage->used < $limit;
                    if ($allowed) {
                        $usage->increment('used');
                        $usage->refresh();
                    }

                    return [
                        'allowed' => $allowed,
                        'package' => $package,
                        'daily_limit' => $limit,
                        'used' => $usage->used,
                        'remaining' => max(0, $limit - $usage->used),
                        'resets_at' => $resetsAt->toIso8601String(),
                    ];
                }, 5);
            } catch (UniqueConstraintViolationException $exception) {
                // A concurrent first insert can be invisible to MySQL's old snapshot.
                // Retry the whole transaction so firstOrCreate sees the committed row.
                if ($attempt >= 5) {
                    throw $exception;
                }
            }
        }
    }
}
