<?php

namespace App\Http\Controllers\Api\Instructor;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        // Get reviews for all courses owned by this instructor
        $reviews = Review::whereHas('course', function ($q) use ($user) {
            $q->where('teacher_id', $user->id);
        })
        ->with(['user:id,name,email,avatar', 'course:id,title,thumbnail'])
        ->orderBy('created_at', 'desc')
        ->paginate(15);

        return response()->json($reviews);
    }
}
