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
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('notification_email')->default(true)->after('status')->nullable();
            $table->boolean('weekly_report')->default(true)->after('notification_email')->nullable();
            $table->boolean('ai_suggestions')->default(true)->after('weekly_report')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['notification_email', 'weekly_report', 'ai_suggestions']);
        });
    }
};
