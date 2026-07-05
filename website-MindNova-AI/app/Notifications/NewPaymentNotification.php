<?php // Notification gửi email khi có thanh toán mới

namespace App\Notifications;

use App\Models\Payment; // Model Payment
use Illuminate\Bus\Queueable; // Hỗ trợ queue
use Illuminate\Notifications\Messages\MailMessage; // Tin nhắn email
use Illuminate\Notifications\Notification; // Lớp Notification

class NewPaymentNotification extends Notification
{
    use Queueable; // Sử dụng trait Queueable

    public function __construct(protected Payment $payment)
    {
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail']; // Gửi qua email
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Payment Successful') // Tiêu đề email
            ->line("A payment has been recorded for amount: {$this->payment->amount} {$this->payment->currency}.") // Nội dung số tiền
            ->line("Provider: {$this->payment->provider}") // Nội dung cổng thanh toán
            ->line("Status: {$this->payment->status}") // Nội dung trạng thái
            ->line('Thank you for your transaction.'); // Lời cảm ơn
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'payment_id' => $this->payment->id, // ID payment
            'amount' => $this->payment->amount, // Số tiền
            'currency' => $this->payment->currency, // Tiền tệ
            'provider' => $this->payment->provider, // Cổng thanh toán
            'status' => $this->payment->status, // Trạng thái
        ];
    }
}
