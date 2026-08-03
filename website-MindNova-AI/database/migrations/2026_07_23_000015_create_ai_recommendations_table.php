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
        Schema::create('ai_recommendations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('course_id')->nullable()->constrained('courses')->onDelete('cascade');
            $table->foreignId('topic_id')->nullable()->constrained('knowledge_topics')->onDelete('cascade');
            $table->enum('type', ['review_lesson', 'practice_quiz', 'explore_new']);
            $table->text('suggestion_text');
            $table->string('reason')->nullable();
            $table->integer('estimated_minutes')->default(15);
            $table->boolean('is_completed')->default(false);
            $table->timestamp('created_at')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ai_recommendations');
    }
};
