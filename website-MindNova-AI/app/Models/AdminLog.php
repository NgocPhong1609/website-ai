<?php

// Khai báo namespace, giúp tự động mapping lớp vào vị trí đúng trong ứng dụng.
namespace App\Models;

// Import model User để định nghĩa quan hệ giữa AdminLog và User.
use App\Models\User;
// Import attribute Fillable của Eloquent để khai báo các trường có thể gán hàng loạt.
use Illuminate\Database\Eloquent\Attributes\Fillable;
// Import lớp Model cơ sở để AdminLog kế thừa các tính năng ORM của Laravel.
use Illuminate\Database\Eloquent\Model;
// Import kiểu quan hệ BelongsTo để định nghĩa quan hệ một-nhiều ngược.
use Illuminate\Database\Eloquent\Relations\BelongsTo;

// Định nghĩa model AdminLog để lưu trữ lịch sử hành động của admin.
// Mỗi bản ghi lưu thông tin ai làm gì, tác động vào đối tượng nào, và metadata kèm theo.
#[Fillable(['admin_id', 'action', 'target_type', 'target_id', 'details', 'metadata'])]
class AdminLog extends Model
{
    // Chuyển đổi trường metadata tự động giữa JSON và mảng PHP.
    // Khi đọc ra từ database, metadata là mảng; khi ghi vào, Laravel sẽ serialize thành JSON.
    protected $casts = [
        'metadata' => 'array',
    ];

    // Hàm định nghĩa quan hệ ngược belongsTo với User.
    // Điều này giúp truy vấn admin đã thực hiện hành động trong log.
    public function admin(): BelongsTo
    {
        // Nói với Eloquent rằng admin_id là khóa ngoại tham chiếu đến bảng users.
        return $this->belongsTo(User::class, 'admin_id');
    }
}
