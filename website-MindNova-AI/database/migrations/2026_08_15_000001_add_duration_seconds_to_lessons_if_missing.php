<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('lessons', function (Blueprint $table) {
            if (! Schema::hasColumn('lessons', 'duration_seconds')) {
                $table->unsignedInteger('duration_seconds')->default(0)->after('video_url');
            }
        });

        if (Schema::hasColumn('lessons', 'duration_minutes')) {
            DB::statement('UPDATE lessons SET duration_seconds = duration_minutes * 60 WHERE duration_seconds IS NULL OR duration_seconds = 0');
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('lessons', function (Blueprint $table) {
            if (Schema::hasColumn('lessons', 'duration_seconds')) {
                $table->dropColumn('duration_seconds');
            }
        });
    }
};
