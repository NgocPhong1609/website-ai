<?php

namespace App\Http\Controllers\Api;

use App\Events\NotificationCreated;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreNotificationRequest;
use App\Models\Notification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $notifications = Notification::when($request->filled('user_id'), fn ($query) => $query->where('user_id', $request->user_id))
            ->latest()
            ->get();

        return response()->json(['data' => $notifications]);
    }

    public function store(StoreNotificationRequest $request): JsonResponse
    {
        $data = $request->validated();
        $notification = Notification::create($data);

        event(new NotificationCreated($notification->toArray()));

        return response()->json(['message' => 'Notification created.', 'data' => $notification], 201);
    }

    public function markRead(Notification $notification): JsonResponse
    {
        $notification->update(['is_read' => true]);

        return response()->json(['message' => 'Notification marked as read.', 'data' => $notification]);
    }

    public function destroy(Notification $notification): JsonResponse
    {
        $notification->delete();

        return response()->json(['message' => 'Notification deleted.']);
    }
}
