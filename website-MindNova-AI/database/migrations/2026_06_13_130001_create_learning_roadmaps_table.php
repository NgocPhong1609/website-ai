<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Bảng learning_roadmaps - Lưu roadmap tổng.
     * Mỗi user có thể có nhiều roadmap (draft/active/completed).
     */
    public function up(): void
    {
        Schema::create('learning_roadmaps', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->string('goal', 255)
                ->comment('Mục tiêu học tập: Interview, Career, etc.');

            $table->enum('level', ['beginner', 'intermediate', 'advanced'])
                ->default('beginner')
                ->comment('Trình độ của user khi tạo roadmap');

            $table->enum('status', ['draft', 'active', 'completed'])
                ->default('draft')
                ->comment('Trạng thái roadmap');

            $table->enum('generated_by', ['rule', 'gemini'])
                ->default('rule')
                ->comment('Phương thức sinh: rule-based hoặc Gemini AI');

            $table->unsignedInteger('estimated_total_days')
                ->nullable()
                ->comment('Tổng số ngày ước tính hoàn thành');

            $table->timestamps();
            $table->softDeletes();

            // Index cho query performance
            $table->index(['user_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('learning_roadmaps');
    }
};
