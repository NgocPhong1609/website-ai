<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('questions', function (Blueprint $table) {
            $table->string('selection_type')
                ->default('single_choice')
                ->after('type');
        });

        Schema::table('user_quiz_attempt_answers', function (Blueprint $table) {
            $table->json('selected_answer_ids')
                ->nullable()
                ->after('user_answer');
        });
    }

    public function down(): void
    {
        Schema::table('user_quiz_attempt_answers', function (Blueprint $table) {
            $table->dropColumn('selected_answer_ids');
        });

        Schema::table('questions', function (Blueprint $table) {
            $table->dropColumn('selection_type');
        });
    }
};
