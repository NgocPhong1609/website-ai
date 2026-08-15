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
            $table->json('onboarding_data')->nullable()->after('password');
            $table->boolean('is_onboarded')->default(false)->after('onboarding_data');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Phải có lệnh này để khi lùi database (rollback) nó không bị lỗi
            $table->dropColumn(['onboarding_data', 'is_onboarded']);
        });
    }
};
