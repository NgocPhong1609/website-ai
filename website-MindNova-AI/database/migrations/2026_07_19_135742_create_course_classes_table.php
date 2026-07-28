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
        Schema::create('course_classes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_id')->constrained('courses')->onDelete('cascade');
            $table->foreignId('teacher_id')->constrained('users')->onDelete('cascade'); // Giáo viên dạy lớp này
            $table->string('class_name'); // Tên lớp (vd: Lớp Web K1, Lớp K2)
            $table->date('start_date'); // Ngày bắt đầu khai giảng
            $table->date('end_date')->nullable(); // Ngày kết thúc dự kiến
            $table->string('schedule')->nullable(); // Lịch học (vd: 2-4-6, 18h-20h)
            $table->enum('status', ['upcoming', 'ongoing', 'completed', 'cancelled'])->default('upcoming');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('course_classes');
    }
};
