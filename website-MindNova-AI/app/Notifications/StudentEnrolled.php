<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class StudentEnrolled extends Notification implements ShouldQueue
{
    use Queueable;

    protected $course;
    protected $student;

    /**
     * Create a new notification instance.
     */
    public function __construct($course, $student)
    {
        $this->course = $course;
        $this->student = $student;
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
                    ->subject('Học viên mới đã đăng ký khóa học của bạn')
                    ->line('Khóa học "' . $this->course->title . '" vừa có một học viên mới.')
                    ->line('Học viên: ' . $this->student->name . ' (' . $this->student->email . ')')
                    ->action('Xem danh sách học viên', url('/instructor/courses/' . $this->course->id . '/students'));
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
            'student_id' => $this->student->id,
            'title' => 'Học viên mới đăng ký',
            'message' => $this->student->name . ' vừa đăng ký khóa học "' . $this->course->title . '"'
        ];
    }
}
