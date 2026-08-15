<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SharedResource extends Model
{
    protected $fillable = [
        'title',
        'type',
        'url',
        'description',
        'status',
        'uploaded_by',
    ];
}
