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
        Schema::table('lessons', function (Blueprint $table) {
            if (!Schema::hasColumn('lessons', 'module_id')) {
                $table->foreignId('module_id')->nullable()->after('id')->constrained('course_modules')->onDelete('cascade');
            }
            if (!Schema::hasColumn('lessons', 'type')) {
                $table->enum('type', ['video', 'article', 'quiz_module'])->default('video')->after('title');
            }
            if (!Schema::hasColumn('lessons', 'duration_minutes')) {
                $table->integer('duration_minutes')->default(0)->after('video_url');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('lessons', function (Blueprint $table) {
            if (Schema::hasColumn('lessons', 'module_id')) {
                $table->dropForeign(['module_id']);
                $table->dropColumn('module_id');
            }
            $table->dropColumn(['type', 'duration_minutes']);
        });
    }
};
