<?php

namespace App\Http\Controllers\Api\Instructor;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    /**
     * Lấy danh sách order liên quan đến khóa học của instructor
     */
    public function index(Request $request)
    {
        $user = $request->user();

        // Query orders that have order_items related to courses owned by this user
        $orders = Order::whereHas('orderItems.course', function ($q) use ($user) {
            $q->where('teacher_id', $user->id);
        })
        ->with([
            'user:id,name,email,avatar',
            'orderItems' => function ($q) use ($user) {
                $q->whereHas('course', function ($q2) use ($user) {
                    $q2->where('teacher_id', $user->id);
                })->with('course:id,title,thumbnail');
            }
        ])
        ->orderBy('created_at', 'desc')
        ->paginate(15);

        return response()->json($orders);
    }
}
