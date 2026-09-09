<?php

namespace App\Services\Ai;

use App\Models\AiUsageLog;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Builder;

class AiUsageSummaryService
{
    private const TRUSTED_SOURCES = ['provider', 'estimated'];

    public function summarize(string $period): array
    {
        $period = $period === '30d' ? '30d' : '7d';
        $days = $period === '30d' ? 30 : 7;
        $timezone = config('app.timezone', 'UTC');
        $to = CarbonImmutable::now($timezone)->endOfDay();
        $from = $to->subDays($days - 1)->startOfDay();

        $query = AiUsageLog::query()->whereBetween('created_at', [$from, $to]);
        $requests = $this->requestCounts(clone $query);

        return [
            'period' => $period,
            'available' => true,
            'from' => $from->toDateString(),
            'to' => $to->toDateString(),
            'coverage' => 'recorded_requests',
            'requests' => $requests,
            'tokens' => $this->tokenSummary(clone $query),
            'cost' => $this->costSummary(clone $query),
            'daily_trend' => $this->dailyTrend(clone $query, $from, $days),
            'provider_breakdown' => $this->providerBreakdown(clone $query),
        ];
    }

    private function requestCounts(Builder $query): array
    {
        $counts = $query
            ->selectRaw('COUNT(*) as total')
            ->selectRaw("SUM(CASE WHEN status = 'success' THEN 1 ELSE 0 END) as successful")
            ->selectRaw("SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed")
            ->first();

        $total = (int) ($counts?->total ?? 0);
        $successful = (int) ($counts?->successful ?? 0);
        $failed = (int) ($counts?->failed ?? 0);

        return [
            'total' => $total,
            'successful' => $successful,
            'failed' => $failed,
            'status_unavailable' => $total - $successful - $failed,
        ];
    }

    private function tokenSummary(Builder $query): array
    {
        $trusted = $query->whereIn('token_source', self::TRUSTED_SOURCES);
        $totals = (clone $trusted)
            ->selectRaw('COUNT(*) as sourced_records')
            ->selectRaw('COALESCE(SUM(input_tokens), 0) as input_tokens')
            ->selectRaw('COALESCE(SUM(output_tokens), 0) as output_tokens')
            ->first();

        if ((int) ($totals?->sourced_records ?? 0) === 0) {
            return [
                'input' => null,
                'output' => null,
                'available' => false,
                'source' => 'unavailable',
            ];
        }

        return [
            'input' => (int) $totals->input_tokens,
            'output' => (int) $totals->output_tokens,
            'available' => true,
            'source' => $this->combinedSource(
                (clone $trusted)->distinct()->pluck('token_source')->all()
            ),
        ];
    }

    private function costSummary(Builder $query): array
    {
        $costs = $query
            ->whereIn('cost_source', self::TRUSTED_SOURCES)
            ->whereNotNull('cost_amount')
            ->whereNotNull('cost_currency')
            ->selectRaw('cost_currency, cost_source, SUM(cost_amount) as amount')
            ->groupBy('cost_currency', 'cost_source')
            ->get();

        if ($costs->isEmpty()) {
            return [
                'amount' => null,
                'currency' => null,
                'available' => false,
                'source' => 'unavailable',
            ];
        }

        $currencies = $costs->pluck('cost_currency')->unique()->values();

        if ($currencies->count() !== 1) {
            return [
                'amount' => null,
                'currency' => null,
                'available' => false,
                'source' => 'mixed',
            ];
        }

        return [
            'amount' => (float) $costs->sum(fn ($cost) => (float) $cost->amount),
            'currency' => (string) $currencies->first(),
            'available' => true,
            'source' => $this->combinedSource($costs->pluck('cost_source')->all()),
        ];
    }

    private function dailyTrend(Builder $query, CarbonImmutable $from, int $days): array
    {
        $counts = $query
            ->selectRaw('DATE(created_at) as usage_date, COUNT(*) as requests')
            ->groupByRaw('DATE(created_at)')
            ->pluck('requests', 'usage_date');

        return collect(range(0, $days - 1))
            ->map(function (int $offset) use ($counts, $from): array {
                $date = $from->addDays($offset)->toDateString();

                return [
                    'date' => $date,
                    'requests' => (int) ($counts->get($date) ?? 0),
                ];
            })
            ->all();
    }

    private function providerBreakdown(Builder $query): array
    {
        return $query
            ->selectRaw('provider, model, COUNT(*) as requests')
            ->groupBy('provider', 'model')
            ->orderByDesc('requests')
            ->orderBy('provider')
            ->orderBy('model')
            ->get()
            ->map(fn ($row) => [
                'provider' => $row->provider,
                'model' => $row->model,
                'requests' => (int) $row->requests,
            ])
            ->all();
    }

    private function combinedSource(array $sources): string
    {
        $sources = collect($sources)
            ->filter(fn ($source) => in_array($source, self::TRUSTED_SOURCES, true))
            ->unique()
            ->values();

        if ($sources->count() > 1) {
            return 'mixed';
        }

        return (string) ($sources->first() ?? 'unavailable');
    }
}
