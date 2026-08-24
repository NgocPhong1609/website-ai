<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TeacherCertificate extends Model
{
    use HasFactory;

    protected $fillable = [
        'teacher_id',
        'certificate_name',
        'issuing_organization',
        'certificate_number',
        'specialization',
        'issue_date',
        'expiry_date',
        'description',
        'certificate_image',
        'verification_url',
        'verification_status',
        'verification_note',
        'verified_at',
        'verified_by',
        'is_public',
    ];

    protected $casts = [
        'issue_date' => 'date',
        'expiry_date' => 'date',
        'verified_at' => 'datetime',
        'is_public' => 'boolean',
    ];

    public function teacher(): BelongsTo
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    public function evidences(): HasMany
    {
        return $this->hasMany(TeacherCertificateEvidence::class, 'certificate_id');
    }
}
