<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Khởi tạo bảng cha (discussions) trước
        Schema::create('discussions', function (Blueprint $table) {
            $table->id();

            // Chú ý: Bảng 'lessons' bắt buộc phải được migrate trước file này.
            // Nếu hệ thống hiện tại chưa có bảng lessons, bạn cần tạo file migration cho nó trước.
            $table->foreignId('lesson_id')->constrained('lessons')->onDelete('cascade');

            $table->foreignId('student_id')->constrained('users')->onDelete('cascade');
            $table->string('title');
            $table->text('content');
            $table->enum('status', ['open', 'answered', 'closed'])->default('open');
            $table->timestamps();
        });

        // 2. Khởi tạo bảng con (discussion_replies) sau khi bảng cha đã tồn tại
        Schema::create('discussion_replies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('discussion_id')->constrained('discussions')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->text('content');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        // Khi rollback (xóa bảng), phải xóa bảng con trước để tránh kẹt khóa ngoại
        Schema::dropIfExists('discussion_replies');
        Schema::dropIfExists('discussions');
    }
};
