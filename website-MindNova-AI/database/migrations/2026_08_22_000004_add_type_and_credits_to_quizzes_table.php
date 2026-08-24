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
                if (!Schema::hasColumn('quizzes', 'type')) {
                    $table->string('type')->default('normal')->after('source_content'); // normal, capability_assessment
                }
                if (!Schema::hasColumn('quizzes', 'credits')) {
                    $table->integer('credits')->default(1)->after('type'); // 1 credit for normal, 3 credits for capability_assessment
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
                if (Schema::hasColumn('quizzes', 'type')) {
                    $table->dropColumn('type');
                }
                if (Schema::hasColumn('quizzes', 'credits')) {
                    $table->dropColumn('credits');
                }
            });
        }
    }
};
