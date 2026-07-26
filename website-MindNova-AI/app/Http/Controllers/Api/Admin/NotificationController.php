<?php

namespace App\Http\Controllers\Api\Admin;

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

        Mail::raw($message, function ($mail) use ($recipient, $subject): void {
            $mail->to($recipient)->subject($subject);
        });

        return response()->json([
            'message' => 'Notification email sent successfully.',
        ]);
    }
}
