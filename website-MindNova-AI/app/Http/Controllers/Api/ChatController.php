<?php

namespace App\Http\Controllers\Api;

use App\Events\ChatMessageSent;
use App\Http\Controllers\Controller;
use App\Models\ChatAttachment;
use App\Models\ChatConversation;
use App\Models\ChatMessage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ChatController extends Controller
{
    /**
     * Get all conversations for the authenticated user.
     */
    public function index(Request $request): JsonResponse
    {
        $userId = $request->user()->id;

        $conversations = ChatConversation::whereHas('members', function ($query) use ($userId) {
            $query->where('user_id', $userId);
        })
        ->with(['course:id,title,thumbnail'])
        ->withCount(['messages as unread_count' => function ($query) use ($userId) {
            $query->where('id', '>', function ($subQuery) use ($userId) {
                $subQuery->selectRaw('COALESCE(last_read_message_id, 0)')
                    ->from('chat_conversation_members')
                    ->whereColumn('chat_conversation_members.chat_conversation_id', 'chat_conversations.id')
                    ->where('user_id', $userId)
                    ->limit(1);
            });
        }])
        ->get()
        ->map(function ($conversation) {
            // Get the last message manually or via relation
            $lastMessage = $conversation->messages()->latest()->first();
            $conversation->last_message = $lastMessage;
            return $conversation;
        });

        // Sort by latest message
        $conversations = $conversations->sortByDesc(function ($conv) {
            return $conv->last_message ? $conv->last_message->created_at : $conv->created_at;
        })->values();

        return response()->json([
            'status' => 'success',
            'data' => $conversations
        ]);
    }

    /**
     * Get paginated messages for a conversation.
     */
    public function messages(Request $request, $conversationId): JsonResponse
    {
        $userId = $request->user()->id;

        // Check permission
        $conversation = ChatConversation::whereHas('members', function ($query) use ($userId) {
            $query->where('user_id', $userId);
        })->findOrFail($conversationId);

        $limit = $request->get('limit', 30);
        $cursor = $request->get('cursor');

        $query = ChatMessage::with(['sender:id,name,avatar_url', 'attachments'])
            ->where('chat_conversation_id', $conversationId)
            ->orderBy('id', 'desc');

        if ($cursor) {
            $query->where('id', '<', $cursor);
        }

        $messages = $query->limit($limit)->get();

        return response()->json([
            'status' => 'success',
            'data' => $messages->reverse()->values(),
            'next_cursor' => $messages->count() === (int)$limit ? $messages->last()->id : null
        ]);
    }

    /**
     * Send a new message.
     */
    public function sendMessage(Request $request, $conversationId): JsonResponse
    {
        $request->validate([
            'content' => 'nullable|string|max:2000',
            'type' => 'required|in:text,image,file',
            'file' => 'nullable|file|max:10240', // 10MB limit
        ]);

        $userId = $request->user()->id;

        // Check permission
        $conversation = ChatConversation::whereHas('members', function ($query) use ($userId) {
            $query->where('user_id', $userId);
        })->findOrFail($conversationId);

        if (!$request->content && !$request->hasFile('file')) {
            return response()->json(['message' => 'Message content or file is required.'], 422);
        }

        DB::beginTransaction();

        try {
            $message = ChatMessage::create([
                'chat_conversation_id' => $conversationId,
                'sender_id' => $userId,
                'content' => $request->content,
                'type' => $request->type,
            ]);

            $attachment = null;
            if ($request->hasFile('file')) {
                $file = $request->file('file');
                $path = $file->store('chat_attachments', 's3'); // or whatever disk is default
                
                $attachment = ChatAttachment::create([
                    'chat_message_id' => $message->id,
                    'file_url' => Storage::disk('s3')->url($path),
                    'file_name' => $file->getClientOriginalName(),
                    'mime_type' => $file->getMimeType(),
                    'size' => $file->getSize(),
                ]);
            }

            DB::commit();

            $message->load(['sender:id,name,avatar_url', 'attachments']);

            // Broadcast the event
            broadcast(new ChatMessageSent($message))->toOthers();

            return response()->json([
                'status' => 'success',
                'data' => $message
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to send message.', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Mark a conversation as read.
     */
    public function markAsRead(Request $request, $conversationId): JsonResponse
    {
        $userId = $request->user()->id;

        $lastMessage = ChatMessage::where('chat_conversation_id', $conversationId)->latest()->first();

        if ($lastMessage) {
            DB::table('chat_conversation_members')
                ->where('chat_conversation_id', $conversationId)
                ->where('user_id', $userId)
                ->update(['last_read_message_id' => $lastMessage->id]);
        }

        return response()->json(['status' => 'success']);
    }

    /**
     * Recall a message.
     */
    public function recallMessage(Request $request, $conversationId, $messageId): JsonResponse
    {
        $userId = (int) $request->user()->id;

        // Check permission for conversation
        $conversation = ChatConversation::whereHas('members', function ($query) use ($userId) {
            $query->where('user_id', $userId);
        })->findOrFail($conversationId);

        $message = ChatMessage::where('chat_conversation_id', $conversationId)
            ->findOrFail($messageId);

        if ((int) $message->sender_id !== $userId) {
            return response()->json(['message' => 'Unauthorized. You can only recall your own messages.'], 403);
        }

        if ($message->is_recalled) {
            return response()->json(['message' => 'Message is already recalled.'], 400);
        }

        if ($message->created_at->diffInMinutes(now()) >= 60) {
            return response()->json(['message' => 'Message is too old to be recalled'], 400);
        }

        $message->update(['is_recalled' => true]);
        
        $message->load(['sender:id,name,avatar_url', 'attachments']);

        broadcast(new \App\Events\ChatMessageRecalled($message))->toOthers();

        return response()->json(['status' => 'success', 'data' => $message]);
    }
    /**
     * Get the total unread message count for the authenticated user.
     */
    public function unreadCount(Request $request): JsonResponse
    {
        $userId = $request->user()->id;

        $conversations = ChatConversation::whereHas('members', function ($query) use ($userId) {
            $query->where('user_id', $userId);
        })->get();

        $totalUnread = 0;

        foreach ($conversations as $conversation) {
            $lastReadMessageId = DB::table('chat_conversation_members')
                ->where('chat_conversation_id', $conversation->id)
                ->where('user_id', $userId)
                ->value('last_read_message_id');

            $unreadInConv = ChatMessage::where('chat_conversation_id', $conversation->id)
                ->where('id', '>', $lastReadMessageId ?? 0)
                ->count();
                
            $totalUnread += $unreadInConv;
        }

        return response()->json([
            'status' => 'success',
            'data' => [
                'unread_count' => $totalUnread
            ]
        ]);
    }
}
