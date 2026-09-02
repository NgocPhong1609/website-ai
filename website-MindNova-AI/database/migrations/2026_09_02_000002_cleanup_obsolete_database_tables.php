<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Clean up obsolete tables identified during Codebase & Database Audit:
     * - course_classes (replaced by courses -> course_modules -> lessons)
     * - ai_recommendations (replaced by dynamic AI analytics & ai_usage_logs)
     * - personal_access_tokens (unused default Sanctum token table)
     * - cache_locks (unused default cache locks table)
     */
    public function up(): void
    {
        Schema::disableForeignKeyConstraints();

        if (Schema::hasTable('enrollments')) {
            Schema::table('enrollments', function (Blueprint $table) {
                if (Schema::hasColumn('enrollments', 'course_class_id')) {
                    try {
                        $table->dropForeign(['course_class_id']);
                    } catch (\Throwable $e) {
                        // ignore if FK already dropped
                    }
                    $table->dropColumn('course_class_id');
                }
            });
        }

        Schema::dropIfExists('course_classes');
        Schema::dropIfExists('ai_recommendations');
        Schema::dropIfExists('cache_locks');

        if (!Schema::hasTable('personal_access_tokens')) {
            Schema::create('personal_access_tokens', function (Blueprint $table) {
                $table->id();
                $table->morphs('tokenable');
                $table->text('name');
                $table->string('token', 64)->unique();
                $table->text('abilities')->nullable();
                $table->timestamp('last_used_at')->nullable();
                $table->timestamp('expires_at')->nullable()->index();
                $table->timestamps();
            });
        }

        Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No-op for cleanup migration
    }
};
