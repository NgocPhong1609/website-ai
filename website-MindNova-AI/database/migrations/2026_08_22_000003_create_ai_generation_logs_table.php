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
        if (!Schema::hasTable('ai_generation_logs')) {
            Schema::create('ai_generation_logs', function (Blueprint $table) {
                $table->id();
                $table->foreignId('instructor_id')->constrained('users')->onDelete('cascade');
                $table->foreignId('quiz_id')->nullable()->constrained('quizzes')->onDelete('set null');
                $table->string('feature')->default('ai_quiz_generator');
                $table->integer('prompt_tokens')->default(0);
                $table->integer('completion_tokens')->default(0);
                $table->json('raw_response')->nullable();
                $table->string('status')->default('success'); // success, failed
                $table->text('error_message')->nullable();
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ai_generation_logs');
    }
};
