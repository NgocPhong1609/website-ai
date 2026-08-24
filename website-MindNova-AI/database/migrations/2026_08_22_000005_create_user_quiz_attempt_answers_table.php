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
        if (!Schema::hasTable('user_quiz_attempt_answers')) {
            Schema::create('user_quiz_attempt_answers', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_quiz_attempt_id')->constrained('user_quiz_attempts')->onDelete('cascade');
                $table->foreignId('question_id')->constrained('questions')->onDelete('cascade');
                $table->string('question_type')->default('multiple_choice'); // multiple_choice, essay
                $table->longText('user_answer')->nullable(); // choice ID or typed essay string
                $table->boolean('is_correct')->nullable(); // true, false, null for essay partial credit
                $table->float('score')->default(0); // points earned for this question
                $table->float('max_score')->default(1.0); // maximum possible points for this question
                $table->text('feedback')->nullable(); // AI grading feedback or explanation
                $table->json('ai_analysis')->nullable(); // JSON: matched_points, missing_points, raw_ai_response
                $table->string('grading_status')->default('graded'); // graded, pending, failed
                $table->timestamps();
            });
        }

        if (Schema::hasTable('user_quiz_attempts')) {
            Schema::table('user_quiz_attempts', function (Blueprint $table) {
                if (!Schema::hasColumn('user_quiz_attempts', 'score_10')) {
                    $table->float('score_10')->nullable()->after('score');
                }
                if (!Schema::hasColumn('user_quiz_attempts', 'grading_status')) {
                    $table->string('grading_status')->default('graded')->after('status');
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_quiz_attempt_answers');

        if (Schema::hasTable('user_quiz_attempts')) {
            Schema::table('user_quiz_attempts', function (Blueprint $table) {
                if (Schema::hasColumn('user_quiz_attempts', 'score_10')) {
                    $table->dropColumn('score_10');
                }
                if (Schema::hasColumn('user_quiz_attempts', 'grading_status')) {
                    $table->dropColumn('grading_status');
                }
            });
        }
    }
};
