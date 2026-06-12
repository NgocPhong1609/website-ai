<?php // Khai báo file PHP cho migration

use Illuminate\Database\Migrations\Migration; // Sử dụng lớp Migration để định nghĩa migration
use Illuminate\Database\Schema\Blueprint; // Sử dụng Blueprint để xây dựng cấu trúc bảng
use Illuminate\Support\Facades\Schema; // Sử dụng Schema facade để thao tác với cơ sở dữ liệu

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) { // Tạo bảng payments
            $table->id(); // Khóa chính tự động tăng
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete(); // Quan hệ khóa ngoại tới bảng users, cho phép null, đặt về null khi user bị xóa
            $table->string('transaction_id')->nullable()->unique(); // Mã giao dịch duy nhất
            $table->decimal('amount', 12, 2); // Số tiền thanh toán
            $table->string('currency', 3)->default('VND'); // Loại tiền tệ
            $table->string('provider')->nullable(); // Cổng thanh toán sử dụng
            $table->string('status')->default('pending'); // Trạng thái giao dịch
            $table->string('payment_method')->nullable(); // Phương thức thanh toán
            $table->text('description')->nullable(); // Mô tả thanh toán
            $table->json('metadata')->nullable(); // Dữ liệu bổ sung dạng JSON
            $table->timestamps(); // Tạo created_at và updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments'); // Xóa bảng payments khi rollback
    }
};
