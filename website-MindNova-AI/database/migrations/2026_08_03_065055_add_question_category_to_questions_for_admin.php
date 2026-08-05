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
        if (!Schema::hasTable('questions')) {
            return;
        }

        Schema::table('questions', function (Blueprint $table) {
            if (!Schema::hasColumn('questions', 'question_category')) {
                $table->string('question_category')->nullable()->after('content');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (!Schema::hasTable('questions') || !Schema::hasColumn('questions', 'question_category')) {
            return;
        }

        Schema::table('questions', function (Blueprint $table) {
            $table->dropColumn('question_category');
        });
    }
};
