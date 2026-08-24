<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class CoursePublished extends Notification implements ShouldQueue
{
    use Queueable;

    protected $course;

    /**
     * Create a new notification instance.
     */
    public function __construct($course)
    {
        $this->course = $course;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', \App\Channels\CustomDatabaseChannel::class];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
                    ->subject('Khóa học của bạn đã được xuất bản')
                    ->line('Chúc mừng! Khóa học "' . $this->course->title . '" đã được xuất bản.')
                    ->action('Xem khóa học', url('/courses/' . $this->course->slug))
                    ->line('Cảm ơn bạn đã đóng góp khóa học trên hệ thống!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'course_id' => $this->course->id,
            'title' => 'Khóa học đã xuất bản',
            'message' => 'Khóa học "' . $this->course->title . '" đã được xuất bản.'
        ];
    }
}
