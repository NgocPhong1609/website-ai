<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InvoiceController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Order::query()
            ->with([
                'user:id,name,email',
                'orderItems:id,order_id,course_id',
                'orderItems.course:id,title',
            ])
            ->latest();

        if ($request->filled('status')) {
            $query->where('status', (string) $request->string('status'));
        }

        if ($request->filled('payment_method')) {
            $query->where('payment_method', (string) $request->string('payment_method'));
        }

        if ($request->filled('search')) {
            $search = trim((string) $request->string('search'));
            $query->where(function ($builder) use ($search) {
                $builder
                    ->where('transaction_id', 'like', '%' . $search . '%')
                    ->orWhereHas('user', function ($userQuery) use ($search) {
                        $userQuery
                            ->where('name', 'like', '%' . $search . '%')
                            ->orWhere('email', 'like', '%' . $search . '%');
                    })
                    ->orWhereHas('orderItems.course', function ($courseQuery) use ($search) {
                        $courseQuery->where('title', 'like', '%' . $search . '%');
                    });
            });
        }

        $orders = $query->get()->map(function (Order $order) {
            $courseTitle = $order->orderItems
                ->map(fn (OrderItem $item) => $item->course?->title)
                ->filter()
                ->unique()
                ->implode(', ');

            return [
                'id' => $order->id,
                'transaction_id' => $order->transaction_id,
                'course_title' => $courseTitle !== '' ? $courseTitle : null,
                'student_name' => $order->user?->name,
                'student_email' => $order->user?->email,
                'total_amount' => (float) $order->total_amount,
                'payment_method' => $order->payment_method,
                'status' => $order->status,
                'created_at' => $order->created_at,
            ];
        })->values();

        return response()->json(['data' => $orders]);
    }
}
