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
            
            // Notify student
            if ($discussion->student_id !== $teacherId) {
                $lesson = $discussion->lesson;
                $module = $lesson->module;
                $course = $module->course;
                
                \App\Models\Notification::create([
                    'user_id' => $discussion->student_id,
                    'type' => 'discussion_reply',
                    'title' => 'Bạn có phản hồi mới',
                    'body' => "Bình luận ở bài \"{$lesson->title}\", chương \"{$module->title}\", khóa \"{$course->title}\" đã được phản hồi.",
                    'metadata' => [
                        'discussion_id' => $discussion->id,
                        'course_id' => $course->id,
                        'lesson_id' => $lesson->id,
                        'action_url' => "/courses/lesson?courseId={$course->id}&lessonId={$lesson->id}",
                    ],
                ]);
            }

            return $reply;
        });
    }

    public function togglePin(Discussion $discussion): Discussion
    {
        $discussion->update(['is_pinned' => !$discussion->is_pinned]);
        return $discussion;
    }

    public function markBestAnswer(Discussion $discussion, int $replyId): void
    {
        DB::transaction(function () use ($discussion, $replyId) {
            // Unmark any previous best answer in this discussion
            $discussion->replies()->update(['is_best_answer' => false]);
            
            // Mark the new one
            $reply = $discussion->replies()->findOrFail($replyId);
            $reply->update(['is_best_answer' => true]);

            // Resolve discussion
            $discussion->update(['is_resolved' => true, 'status' => 'closed']);

            // Notify student if applicable
            if ($discussion->student_id !== $reply->user_id) {
                \App\Models\Notification::create([
                    'user_id' => $discussion->student_id,
                    'type' => 'best_answer',
                    'title' => 'Câu trả lời hay nhất',
                    'body' => 'Thảo luận của bạn đã được đánh dấu câu trả lời hay nhất và được giải quyết.',
                    'metadata' => ['discussion_id' => $discussion->id],
                ]);
            }
        });
    }

    public function toggleResolved(Discussion $discussion): Discussion
    {
        $discussion->update([
            'is_resolved' => !$discussion->is_resolved,
            'status' => !$discussion->is_resolved ? 'closed' : 'open',
        ]);
        return $discussion;
    }

    public function deleteDiscussion(Discussion $discussion): void
    {
        $discussion->delete();
    }
}
