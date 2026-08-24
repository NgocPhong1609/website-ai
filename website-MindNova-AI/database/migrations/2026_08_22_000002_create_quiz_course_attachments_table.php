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
        if (!Schema::hasTable('quiz_course_attachments')) {
            Schema::create('quiz_course_attachments', function (Blueprint $table) {
                $table->id();
                $table->foreignId('quiz_id')->constrained('quizzes')->onDelete('cascade');
                $table->foreignId('course_id')->constrained('courses')->onDelete('cascade');
                $table->foreignId('module_id')->nullable()->constrained('course_modules')->onDelete('cascade');
                $table->foreignId('after_lesson_id')->nullable()->constrained('lessons')->onDelete('cascade');
                $table->string('position')->default('end_of_course'); // end_of_course, in_module, after_lesson
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quiz_course_attachments');
    }
};
