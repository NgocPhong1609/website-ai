<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (!Schema::hasColumn('lessons', 'duration_seconds')) {
            Schema::table('lessons', function (Blueprint $table) {
                $table->integer('duration_seconds')->default(0)->after('video_url');
            });
        }
        
        if (Schema::hasColumn('lessons', 'duration_minutes')) {
            Schema::table('lessons', function (Blueprint $table) {
                $table->dropColumn('duration_minutes');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('lessons', function (Blueprint $table) {
            $table->dropColumn('duration_seconds');
            $table->integer('duration_minutes')->default(0)->after('video_url');
        });
    }
};
