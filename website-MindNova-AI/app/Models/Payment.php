<?php // Model Payment lưu trữ thông tin thanh toán

namespace App\Models;

use App\Models\User; // Model User để thiết lập quan hệ
use Illuminate\Database\Eloquent\Attributes\Fillable; // Thuộc tính Fillable của Eloquent
use Illuminate\Database\Eloquent\Model; // Lớp cơ sở Model
use Illuminate\Database\Eloquent\Relations\BelongsTo; // Quan hệ belongsTo

#[Fillable(['user_id', 'transaction_id', 'amount', 'currency', 'provider', 'status', 'payment_method', 'description', 'metadata'])] // Các trường được phép gán hàng loạt
class Payment extends Model
{
    protected $casts = [
        'amount' => 'decimal:2', // Chuyển amount sang kiểu decimal với 2 chữ số thập phân
        'metadata' => 'array', // Chuyển metadata sang mảng
    ];

    public function user(): BelongsTo // Quan hệ Payment thuộc về 1 User
    {
        return $this->belongsTo(User::class); // Trả về relation belongsTo với User
    }
}
