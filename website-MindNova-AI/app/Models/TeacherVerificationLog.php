<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TeacherVerificationLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'teacher_id',
        'admin_id',
        'certificate_id',
        'action',
        'old_status',
        'new_status',
        'reason',
        'metadata',
    ];

    protected $casts = [
        'metadata' => 'array',
    ];

    public function teacher(): BelongsTo
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    public function admin(): BelongsTo
    {
        return $this->belongsTo(User::class, 'admin_id');
    }

    public function certificate(): BelongsTo
    {
        return $this->belongsTo(TeacherCertificate::class, 'certificate_id');
    }
}
