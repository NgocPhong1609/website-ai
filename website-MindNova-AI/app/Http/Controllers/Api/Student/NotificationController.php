<?php

namespace App\Http\Controllers\Api\Student;

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
        $notifications = Notification::where('user_id', $request->user()->id)
            ->latest()
            ->take(50)
            ->get()
            ->map(function ($notif) {
                $meta = [];
                if ($notif->metadata) {
                    $meta = is_string($notif->metadata) ? json_decode($notif->metadata, true) : $notif->metadata;
                }
                
                $sender = null;
                if (!empty($meta['sender_id'])) {
                    $teacher = \App\Models\User::find($meta['sender_id']);
                    if ($teacher) {
                        $sender = [
                            'id' => $teacher->id,
                            'name' => $teacher->name,
                            'avatar' => $teacher->avatar_url,
                        ];
                    }
                }

                return [
                    'id' => $notif->id,
                    'title' => $notif->title,
                    'content' => $notif->body,
                    'sender' => $sender,
                    'created_at' => $notif->created_at,
                    'is_read' => (bool) $notif->is_read,
                    'type' => $notif->type,
                    'action_url' => $meta['action_url'] ?? null,
                    'course_ids' => $meta['course_ids'] ?? [],
                ];
            });

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

    public function deleteRead(Request $request): JsonResponse
    {
        $deleted = Notification::where('user_id', $request->user()->id)
            ->where('is_read', true)
            ->delete();

        return response()->json([
            'message' => 'Read notifications deleted.',
            'deleted_count' => $deleted
        ]);
    }
}
