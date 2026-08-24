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
        Schema::table('enrollments', function (Blueprint $table) {
            if (! Schema::hasColumn('enrollments', 'course_class_id')) {
                $table->foreignId('course_class_id')->nullable()->after('enrolled_at')
                    ->constrained('course_classes')->onDelete('set null');
            }

            if (! Schema::hasColumn('enrollments', 'status')) {
                $table->enum('status', ['waiting', 'enrolled', 'completed', 'cancelled'])
                    ->default('waiting')->after('course_class_id');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('enrollments', function (Blueprint $table) {
            if (Schema::hasColumn('enrollments', 'status')) {
                $table->dropColumn('status');
            }

            if (Schema::hasColumn('enrollments', 'course_class_id')) {
                $table->dropForeign(['course_class_id']);
                $table->dropColumn('course_class_id');
            }
        });
    }
};
