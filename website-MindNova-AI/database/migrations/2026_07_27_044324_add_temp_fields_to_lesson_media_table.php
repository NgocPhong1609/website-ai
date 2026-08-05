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
        if (!Schema::hasTable('lesson_media')) {
            return;
        }

        Schema::table('lesson_media', function (Blueprint $table) {
            if (!Schema::hasColumn('lesson_media', 'is_temp')) {
                $table->boolean('is_temp')->default(false)->after('status');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (!Schema::hasTable('lesson_media')) {
            return;
        }

        Schema::table('lesson_media', function (Blueprint $table) {
            if (Schema::hasColumn('lesson_media', 'is_temp')) {
                $table->dropColumn('is_temp');
            }
        });
    }
};
