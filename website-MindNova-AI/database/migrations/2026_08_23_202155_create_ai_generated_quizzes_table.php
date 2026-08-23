<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ai_generated_quizzes', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->index();
            $table->string('title');
            $table->string('topic');
            $table->string('difficulty')->default('Trung bình');
            $table->integer('questions_count')->default(10);
            $table->integer('time_limit_minutes')->default(15);
            $table->integer('passing_percentage')->default(70);
            $table->text('description')->nullable();

            // Lưu toàn bộ câu hỏi, đáp án, giải thích từ AI
            $table->json('questions_data');

            // Lưu đáp án học sinh chọn và kết quả chấm điểm
            $table->json('user_answers')->nullable();
            $table->integer('score')->nullable(); // Điểm số đạt được (%)
            $table->integer('correct_count')->nullable(); // Số câu đúng
            $table->boolean('is_completed')->default(false); // Đã làm bài chưa

            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ai_generated_quizzes');
    }
};
