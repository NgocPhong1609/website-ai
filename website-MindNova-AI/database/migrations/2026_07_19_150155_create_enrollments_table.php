<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('enrollments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('course_id')->constrained('courses')->onDelete('cascade');

            // --- Các cột của đồng đội (Theo dõi tiến độ) ---
            $table->integer('progress_percentage')->default(0);
            $table->timestamp('enrolled_at')->useCurrent();

            // --- Các cột của bạn (Xếp lớp và Trạng thái) ---
            $table->foreignId('course_class_id')->nullable()->constrained('course_classes')->onDelete('set null');
            $table->enum('status', ['waiting', 'enrolled', 'completed', 'cancelled'])->default('waiting');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('enrollments');
    }
};
