<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TeacherCertificateEvidence extends Model
{
    use HasFactory;

    protected $table = 'teacher_certificate_evidences';

    protected $fillable = [
        'certificate_id',
        'evidence_path',
        'evidence_type',
        'original_name',
        'file_size',
        'mime_type',
    ];

    public function certificate(): BelongsTo
    {
        return $this->belongsTo(TeacherCertificate::class, 'certificate_id');
    }
}
