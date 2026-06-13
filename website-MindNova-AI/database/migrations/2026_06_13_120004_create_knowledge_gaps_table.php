<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Bảng knowledge_gaps - Lưu chủ đề yếu của user.
     * weakness_score: 0 (mạnh) → 100 (rất yếu).
     * Unique (user_id, topic): mỗi user chỉ có 1 record per topic.
     */
    public function up(): void
    {
        Schema::create('knowledge_gaps', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->string('topic', 255)
                ->comment('Tên chủ đề yếu');

            $table->unsignedTinyInteger('weakness_score')
                ->default(0)
                ->comment('Điểm yếu: 0 (mạnh) → 100 (rất yếu)');

            $table->timestamps();

            // Mỗi user chỉ có 1 gap record per topic
            $table->unique(['user_id', 'topic'], 'knowledge_gaps_user_topic_unique');

            // Index cho query theo user
            $table->index('user_id');
        });

        // Check constraint: weakness_score phải trong khoảng 0-100
        // Sử dụng raw SQL vì Laravel Blueprint không hỗ trợ check constraint trực tiếp
        DB::statement('ALTER TABLE knowledge_gaps ADD CONSTRAINT knowledge_gaps_weakness_score_check CHECK (weakness_score >= 0 AND weakness_score <= 100)');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('knowledge_gaps');
    }
};
