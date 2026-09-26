<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('lesson_media', function (Blueprint $table) {
            $table->unsignedBigInteger('lesson_id')->nullable()->change();
        });
    }

    public function down(): void
    {
        if (DB::table('lesson_media')->whereNull('lesson_id')->exists()) {
            throw new RuntimeException('Cannot require lesson_id while unattached media still exists.');
        }
        Schema::table('lesson_media', function (Blueprint $table) {
            $table->unsignedBigInteger('lesson_id')->nullable(false)->change();
        });
    }
};
