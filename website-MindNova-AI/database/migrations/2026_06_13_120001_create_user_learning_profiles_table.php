<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Bảng user_learning_profiles - Lưu thông tin onboarding.
     * Mỗi user chỉ có 1 profile (user_id unique).
     * interested_topics lưu dạng JSON để linh hoạt cho MVP.
     */
    public function up(): void
    {
        Schema::create('user_learning_profiles', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                ->unique()
                ->constrained('users')
                ->cascadeOnDelete();

            $table->string('goal', 255)
                ->comment('Mục tiêu học tập của user');

            $table->enum('level', ['beginner', 'intermediate', 'advanced'])
                ->default('beginner')
                ->comment('Trình độ hiện tại');

            $table->json('interested_topics')
                ->nullable()
                ->comment('Danh sách chủ đề quan tâm, JSON array');

            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_learning_profiles');
    }
};
