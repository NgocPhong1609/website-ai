<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('revenue_allocations')) {
            Schema::create('revenue_allocations', function (Blueprint $table) {
                $table->id();
                $table->foreignId('order_id')->constrained('orders')->cascadeOnDelete();
                $table->foreignId('order_item_id')->nullable()->constrained('order_items')->cascadeOnDelete();
                $table->foreignId('course_id')->constrained('courses')->cascadeOnDelete();
                $table->foreignId('student_id')->constrained('users')->cascadeOnDelete();
                $table->foreignId('instructor_id')->constrained('users')->cascadeOnDelete();

                // Financial Snapshot at Time of Purchase
                $table->decimal('original_price', 12, 2);
                $table->decimal('discount_amount', 12, 2)->default(0);
                $table->decimal('paid_amount', 12, 2);

                $table->decimal('platform_fee_percent', 5, 2); // e.g. 30.00 or 15.00
                $table->decimal('platform_fee_amount', 12, 2); // Admin share

                $table->decimal('instructor_percent', 5, 2); // e.g. 70.00 or 85.00
                $table->decimal('instructor_amount', 12, 2); // Teacher share

                // Allocation Status & Timestamps
                // Statuses: PENDING, AVAILABLE, WITHDRAWING, WITHDRAWN, REFUNDED
                $table->string('status')->default('PENDING'); 
                $table->timestamp('refund_deadline');
                $table->timestamp('unlocked_at')->nullable();
                $table->timestamp('refunded_at')->nullable();

                $table->timestamps();

                $table->index(['instructor_id', 'status']);
                $table->index(['order_id', 'course_id']);
                $table->index(['status', 'refund_deadline']);
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('revenue_allocations');
    }
};
