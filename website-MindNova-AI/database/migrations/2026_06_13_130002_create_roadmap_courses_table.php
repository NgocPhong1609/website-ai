<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Bảng roadmap_courses - Lưu course thuộc roadmap.
     * priority tăng dần (1 = học trước).
     * course_id không FK constraint vì bảng courses chưa tạo (module khác).
     */
    public function up(): void
    {
        Schema::create('roadmap_courses', function (Blueprint $table) {
            $table->id();

            $table->foreignId('roadmap_id')
                ->constrained('learning_roadmaps')
                ->cascadeOnDelete();

            $table->unsignedBigInteger('course_id')
                ->comment('FK tới courses table (sẽ tạo ở module khác)');

            $table->unsignedSmallInteger('priority')
                ->comment('Thứ tự ưu tiên học, tăng dần (1 = đầu tiên)');

            $table->text('reason')
                ->nullable()
                ->comment('Lý do AI chọn course này');

            $table->unsignedInteger('estimated_days')
                ->nullable()
                ->comment('Số ngày ước tính cho course này');

            $table->timestamps();

            // Mỗi course chỉ xuất hiện 1 lần trong 1 roadmap
            $table->unique(['roadmap_id', 'course_id'], 'roadmap_courses_unique');

            // Index cho query performance
            $table->index('course_id');
            $table->index(['roadmap_id', 'priority']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('roadmap_courses');
    }
};
