<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewReview extends Notification implements ShouldQueue
{
    use Queueable;

    protected $review;

    /**
     * Create a new notification instance.
     */
    public function __construct($review)
    {
        $this->review = $review;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
                    ->subject('Có đánh giá mới cho khóa học của bạn')
                    ->line('Khóa học "' . $this->review->course->title . '" vừa nhận được một đánh giá ' . $this->review->rating . ' sao.')
                    ->line('Nội dung: ' . $this->review->comment)
                    ->action('Xem đánh giá', url('/instructor/courses/' . $this->review->course_id . '/reviews'));
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'course_id' => $this->review->course_id,
            'review_id' => $this->review->id,
            'title' => 'Đánh giá mới (' . $this->review->rating . ' sao)',
            'message' => 'Bạn có đánh giá mới từ ' . $this->review->user->name
        ];
    }
}
