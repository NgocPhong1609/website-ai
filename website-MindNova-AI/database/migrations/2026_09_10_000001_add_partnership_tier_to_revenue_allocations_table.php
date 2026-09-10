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
                $table->string('partnership_tier', 50)->nullable()->after('instructor_id');
            });
        }

        DB::table('revenue_allocations')
            ->whereNull('partnership_tier')
            ->orderBy('id')
            ->chunkById(200, function ($allocations): void {
                $tiers = DB::table('courses')
                    ->whereIn('id', $allocations->pluck('course_id'))
                    ->pluck('partnership_tier', 'id');

                foreach ($allocations as $allocation) {
                    DB::table('revenue_allocations')
                        ->where('id', $allocation->id)
                        ->update(['partnership_tier' => $tiers[$allocation->course_id] ?? null]);
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
