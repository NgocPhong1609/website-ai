<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ai_usage_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('actor_type')->default('guest');
            $table->string('actor_key')->nullable()->index();
            $table->string('provider')->nullable();
            $table->string('model')->nullable();
            $table->longText('input_text')->nullable();
            $table->longText('output_text')->nullable();
            $table->unsignedInteger('input_tokens')->default(0);
            $table->unsignedInteger('output_tokens')->default(0);
            $table->decimal('cost_estimate', 12, 6)->default(0);
            $table->longText('system_prompt')->nullable();
            $table->json('meta')->nullable();
            $table->timestamps();

            $table->index(['created_at', 'actor_type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ai_usage_logs');
    }
};
