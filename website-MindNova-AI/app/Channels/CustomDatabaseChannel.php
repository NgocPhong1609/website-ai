<?php

namespace App\Channels;

use Illuminate\Notifications\Notification;
use App\Models\Notification as NotificationModel;

class CustomDatabaseChannel
{
    /**
     * Send the given notification.
     */
    public function send(object $notifiable, Notification $notification): void
    {
        $data = $notification->toArray($notifiable);

        NotificationModel::create([
            'user_id' => $notifiable->id,
            'type' => get_class($notification),
            'title' => $data['title'] ?? 'Thông báo mới',
            'body' => $data['message'] ?? ($data['body'] ?? ''),
            'metadata' => $data,
            'is_read' => false,
        ]);
    }
}
