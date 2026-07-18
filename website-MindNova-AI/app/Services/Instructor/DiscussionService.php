<?php

namespace App\Services\Instructor;

use App\Models\Discussion;
use App\Models\DiscussionReply;
use Illuminate\Support\Facades\DB;

class DiscussionService
{
    public function replyToDiscussion(Discussion $discussion, int $teacherId, string $content): DiscussionReply
    {
        return DB::transaction(function () use ($discussion, $teacherId, $content) {
            $reply = $discussion->replies()->create([
                'user_id' => $teacherId,
                'content' => $content,
            ]);

            $discussion->update(['status' => 'answered']);

            return $reply;
        });
    }
}
