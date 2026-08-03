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
        Schema::table('lesson_media', function (Blueprint $table) {
            $table->foreignId('lesson_id')->nullable()->change();
            $table->boolean('is_temp')->default(false)->after('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('lesson_media', function (Blueprint $table) {
            $table->foreignId('lesson_id')->nullable(false)->change();
            $table->dropColumn('is_temp');
        });
    }
};
