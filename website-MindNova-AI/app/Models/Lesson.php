<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Lesson extends Model
{
    protected $fillable = [
        'course_id',
        'module_id',
        'title',
        'type', // video, article, quiz_module
        'content',
        'video_url',
        'duration_minutes',
        'order',
        'status',
    ];

    public function module(): BelongsTo
    {
        return $this->belongsTo(CourseModule::class, 'module_id');
    }

    public function media()
    {
        return $this->hasMany(LessonMedia::class);
    }
<<<<<<< HEAD

    public function quiz()
    {
        return $this->hasOne(Quiz::class);
    }
=======
>>>>>>> 83c13480e0df972562db35c4fc048e4e29106ede
}
