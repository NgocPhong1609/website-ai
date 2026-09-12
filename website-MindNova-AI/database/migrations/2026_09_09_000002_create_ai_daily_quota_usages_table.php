<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ai_daily_quota_usages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('feature', 64);
            $table->date('usage_date');
            $table->unsignedInteger('used')->default(0);
            $table->timestamps();
            $table->unique(['user_id', 'feature', 'usage_date'], 'ai_daily_quota_user_feature_date_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ai_daily_quota_usages');
    }
};
