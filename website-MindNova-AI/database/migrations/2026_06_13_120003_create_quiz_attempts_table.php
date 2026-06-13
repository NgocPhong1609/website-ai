<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Bảng quiz_attempts - Lưu lịch sử làm quiz.
     * Hỗ trợ nhiều lần làm (không unique constraint trên user_id + quiz_id).
     * quiz_id không FK constraint vì bảng quizzes chưa tạo (module khác).
     */
    public function up(): void
    {
        Schema::create('quiz_attempts', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->unsignedBigInteger('quiz_id')
                ->comment('FK tới quizzes table (sẽ tạo ở module khác)');

            $table->decimal('score', 5, 2)
                ->default(0)
                ->comment('Điểm quiz, hỗ trợ thập phân (vd: 85.50)');

            $table->timestamp('submitted_at')
                ->nullable()
                ->comment('Thời điểm nộp bài');

            $table->timestamps();

            // Index cho query performance
            $table->index('quiz_id');
            $table->index(['user_id', 'quiz_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quiz_attempts');
    }
};
