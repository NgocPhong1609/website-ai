<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CourseClass extends Model
{
    protected $fillable = [
        'course_id', 'teacher_id', 'class_name', 'start_date', 'end_date', 'schedule', 'status'
    ];

    // Khai báo lớp này thuộc về khóa học nào
    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    // Khai báo lớp này do giáo viên nào dạy
    public function teacher(): BelongsTo
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    public function enrollments()
    {
        return $this->hasMany(Enrollment::class, 'course_class_id');
    }
}
