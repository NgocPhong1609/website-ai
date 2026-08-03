<?php

namespace App\Http\Controllers\Api\Admin;

use App\Mail\AdminSystemNotificationMail;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class NotificationController extends Controller
{
    public function sendTestEmail(Request $request): JsonResponse
    {
        $data = $request->validate([
            'email' => ['nullable', 'email'],
            'subject' => ['nullable', 'string', 'max:255'],
            'message' => ['nullable', 'string', 'max:2000'],
        ]);

        $recipient = $data['email'] ?? $request->user()?->email;

        if (!$recipient) {
            return response()->json([
                'message' => 'No recipient email found.',
            ], 422);
        }

        $subject = $data['subject'] ?? 'MindNova Admin Notification';
        $message = $data['message'] ?? 'Thong bao he thong tu trang quan tri MindNova.';

        $mailable = new AdminSystemNotificationMail(
            subject: $subject,
            message: $message,
            senderName: $request->user()?->name,
        );

        Mail::to($recipient)->queue($mailable);

        return response()->json([
            'message' => 'Notification email queued successfully.',
            'meta' => [
                'recipient' => $recipient,
                'queue' => config('queue.connections.' . config('queue.default') . '.queue', 'default'),
            ],
        ]);
    }
}
