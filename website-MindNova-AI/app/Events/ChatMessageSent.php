<?php

namespace App\Events;

use App\Models\ChatMessage;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ChatMessageSent implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public ChatMessage $message;

    /**
     * Create a new event instance.
     */
    public function __construct(ChatMessage $message)
    {
        $this->message = $message;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        $channels = [
            new PrivateChannel('chat.conversation.' . $this->message->chat_conversation_id),
        ];

        // Broadcast to other members' global user channel for unread notification
        $members = \App\Models\ChatConversationMember::where('chat_conversation_id', $this->message->chat_conversation_id)
            ->where('user_id', '!=', $this->message->sender_id)
            ->get();

        foreach ($members as $member) {
            $channels[] = new PrivateChannel('App.Models.User.' . $member->user_id);
        }

        return $channels;
    }
    
    /**
     * Get the data to broadcast.
     *
     * @return array<string, mixed>
     */
    public function broadcastWith(): array
    {
        return [
            'id' => $this->message->id,
            'chat_conversation_id' => $this->message->chat_conversation_id,
            'sender_id' => $this->message->sender_id,
            'content' => $this->message->content,
            'type' => $this->message->type,
            'created_at' => $this->message->created_at,
            'sender' => $this->message->sender,
            'attachments' => $this->message->attachments,
        ];
    }
}
