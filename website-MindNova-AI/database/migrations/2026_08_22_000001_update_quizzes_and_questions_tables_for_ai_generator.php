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
        if (Schema::hasTable('quizzes')) {
            Schema::table('quizzes', function (Blueprint $table) {
                // Change lesson_id to nullable
                $table->foreignId('lesson_id')->nullable()->change();

                if (!Schema::hasColumn('quizzes', 'instructor_id')) {
                    $table->foreignId('instructor_id')->nullable()->after('id')->constrained('users')->onDelete('cascade');
                }
                if (!Schema::hasColumn('quizzes', 'description')) {
                    $table->text('description')->nullable()->after('title');
                }
                if (!Schema::hasColumn('quizzes', 'source_type')) {
                    $table->string('source_type')->default('content')->after('description'); // content, topic
                }
                if (!Schema::hasColumn('quizzes', 'source_content')) {
                    $table->longText('source_content')->nullable()->after('source_type');
                }
                if (!Schema::hasColumn('quizzes', 'difficulty')) {
                    $table->string('difficulty')->default('mixed')->after('source_content'); // easy, medium, hard, mixed
                }
                if (!Schema::hasColumn('quizzes', 'total_questions')) {
                    $table->integer('total_questions')->default(0)->after('difficulty');
                }
                if (!Schema::hasColumn('quizzes', 'mc_questions_count')) {
                    $table->integer('mc_questions_count')->default(0)->after('total_questions');
                }
                if (!Schema::hasColumn('quizzes', 'essay_questions_count')) {
                    $table->integer('essay_questions_count')->default(0)->after('mc_questions_count');
                }
                if (!Schema::hasColumn('quizzes', 'total_points')) {
                    $table->float('total_points')->default(10.0)->after('essay_questions_count');
                }
                if (!Schema::hasColumn('quizzes', 'status')) {
                    $table->string('status')->default('draft')->after('total_points'); // draft, published
                }
            });
        }

        if (Schema::hasTable('questions')) {
            Schema::table('questions', function (Blueprint $table) {
                if (!Schema::hasColumn('questions', 'type')) {
                    $table->string('type')->default('multiple_choice')->after('quiz_id'); // multiple_choice, essay
                }
                if (!Schema::hasColumn('questions', 'difficulty')) {
                    $table->string('difficulty')->default('medium')->after('type'); // easy, medium, hard
                }
                if (!Schema::hasColumn('questions', 'explanation')) {
                    $table->text('explanation')->nullable()->after('content');
                }
                if (!Schema::hasColumn('questions', 'sample_answer')) {
                    $table->text('sample_answer')->nullable()->after('explanation');
                }
                if (!Schema::hasColumn('questions', 'rubric')) {
                    $table->text('rubric')->nullable()->after('sample_answer');
                }
                if (!Schema::hasColumn('questions', 'points')) {
                    $table->float('points')->default(1.0)->after('rubric');
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('quizzes')) {
            Schema::table('quizzes', function (Blueprint $table) {
                $columnsToDrop = array_filter([
                    Schema::hasColumn('quizzes', 'instructor_id') ? 'instructor_id' : null,
                    Schema::hasColumn('quizzes', 'description') ? 'description' : null,
                    Schema::hasColumn('quizzes', 'source_type') ? 'source_type' : null,
                    Schema::hasColumn('quizzes', 'source_content') ? 'source_content' : null,
                    Schema::hasColumn('quizzes', 'difficulty') ? 'difficulty' : null,
                    Schema::hasColumn('quizzes', 'total_questions') ? 'total_questions' : null,
                    Schema::hasColumn('quizzes', 'mc_questions_count') ? 'mc_questions_count' : null,
                    Schema::hasColumn('quizzes', 'essay_questions_count') ? 'essay_questions_count' : null,
                    Schema::hasColumn('quizzes', 'total_points') ? 'total_points' : null,
                    Schema::hasColumn('quizzes', 'status') ? 'status' : null,
                ]);

                if (!empty($columnsToDrop)) {
                    $table->dropColumn(array_values($columnsToDrop));
                }
            });
        }

        if (Schema::hasTable('questions')) {
            Schema::table('questions', function (Blueprint $table) {
                $columnsToDrop = array_filter([
                    Schema::hasColumn('questions', 'type') ? 'type' : null,
                    Schema::hasColumn('questions', 'difficulty') ? 'difficulty' : null,
                    Schema::hasColumn('questions', 'explanation') ? 'explanation' : null,
                    Schema::hasColumn('questions', 'sample_answer') ? 'sample_answer' : null,
                    Schema::hasColumn('questions', 'rubric') ? 'rubric' : null,
                    Schema::hasColumn('questions', 'points') ? 'points' : null,
                ]);

                if (!empty($columnsToDrop)) {
                    $table->dropColumn(array_values($columnsToDrop));
                }
            });
        }
    }
};
