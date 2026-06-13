<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Bảng user_progress - Theo dõi tiến độ học.
     * Unique constraint (user_id, course_id, lesson_id) tránh duplicate.
     * course_id và lesson_id không FK constraint vì bảng courses/lessons chưa tạo (module khác).
     */
    public function up(): void
    {
        Schema::create('user_progress', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->unsignedBigInteger('course_id')
                ->comment('FK tới courses table (sẽ tạo ở module khác)');

            $table->unsignedBigInteger('lesson_id')
                ->comment('FK tới lessons table (sẽ tạo ở module khác)');

            $table->enum('status', ['not_started', 'in_progress', 'completed'])
                ->default('not_started')
                ->comment('Trạng thái: NotStarted, InProgress, Completed');

            $table->timestamp('started_at')
                ->nullable()
                ->comment('Thời điểm bắt đầu học');

            $table->timestamp('completed_at')
                ->nullable()
                ->comment('Thời điểm hoàn thành');

            $table->timestamps();
            $table->softDeletes();

            // Tránh duplicate progress cho cùng user + course + lesson
            $table->unique(['user_id', 'course_id', 'lesson_id'], 'user_progress_unique');

            // Index cho query performance
            $table->index('course_id');
            $table->index('lesson_id');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_progress');
    }
};
