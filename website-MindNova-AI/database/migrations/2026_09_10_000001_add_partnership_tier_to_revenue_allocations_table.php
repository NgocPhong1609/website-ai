<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('revenue_allocations', 'partnership_tier')) {
            Schema::table('revenue_allocations', function (Blueprint $table) {
                $table->string('partnership_tier', 20)->nullable()->after('instructor_id');
            });
        }

        DB::table('revenue_allocations')
            ->whereNull('partnership_tier')
            ->orderBy('id')
            ->chunkById(200, function ($allocations): void {
                $tiers = DB::table('courses')
                    ->whereIn('id', $allocations->pluck('course_id'))
                    ->pluck('partnership_tier', 'id');
                $payoutTiers = DB::table('teacher_payouts')
                    ->whereIn('order_id', $allocations->pluck('order_id'))
                    ->whereIn('course_id', $allocations->pluck('course_id'))
                    ->get(['order_id', 'course_id', 'metadata'])
                    ->mapWithKeys(function ($payout): array {
                        $metadata = is_string($payout->metadata) ? json_decode($payout->metadata, true) : $payout->metadata;
                        $tier = is_array($metadata) ? ($metadata['partnership_tier'] ?? null) : null;

                        return ["{$payout->order_id}:{$payout->course_id}" => is_string($tier) && strlen($tier) <= 20 ? $tier : null];
                    });

                foreach ($allocations as $allocation) {
                    // Payout metadata is the historical snapshot; the course is only a legacy metadata fallback.
                    $tier = $payoutTiers->get("{$allocation->order_id}:{$allocation->course_id}")
                        ?? $tiers[$allocation->course_id]
                        ?? null;
                    DB::table('revenue_allocations')
                        ->where('id', $allocation->id)
                        ->update(['partnership_tier' => $tier]);
                }
            });
    }

    public function down(): void
    {
        if (Schema::hasColumn('revenue_allocations', 'partnership_tier')) {
            Schema::table('revenue_allocations', function (Blueprint $table) {
                $table->dropColumn('partnership_tier');
            });
        }
    }
};
