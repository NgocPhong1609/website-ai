<?php

namespace App\Http\Controllers\Api\Instructor;

use App\Http\Controllers\Controller;
use App\Http\Requests\Instructor\StoreDiscussionReplyRequest;
use App\Http\Resources\DiscussionResource;
use App\Http\Resources\DiscussionReplyResource;
use App\Models\Discussion;
use App\Services\Instructor\DiscussionService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class DiscussionController extends Controller
{
    use ApiResponse;

    public function __construct(private readonly DiscussionService $discussionService)
    {
    }

    public function index(Request $request)
    {
        $teacherId = $request->user()->id;
        
        $query = Discussion::whereHas('lesson.module.course', function ($q) use ($teacherId) {
            $q->where('teacher_id', $teacherId);
        })->with(['lesson', 'student', 'replies.user']);

        $filter = $request->input('filter', 'all');

        if ($filter === 'needs_attention') {
            $query->where(function ($q) {
                $q->where('status', 'open')
                  ->orWhereDoesntHave('replies', function ($r) {
                      // Missing a way to check if reply is from instructor without joining roles.
                      // Simplified: Needs attention if not answered or not resolved.
                  });
            })->where('is_resolved', false);
        } elseif ($filter === 'unanswered') {
            $query->doesntHave('replies');
        }

        // Always sort pinned first, then by latest
        $discussions = $query->orderBy('is_pinned', 'desc')->latest()->paginate($request->input('per_page', 15));

        return $this->successResponse(DiscussionResource::collection($discussions)->response()->getData(true));
    }

    public function reply(StoreDiscussionReplyRequest $request, Discussion $discussion)
    {
        if ($discussion->lesson->module->course->teacher_id !== $request->user()->id) {
            return $this->forbiddenResponse('You do not own the course this discussion belongs to.');
        }

        $reply = $this->discussionService->replyToDiscussion(
            $discussion,
            $request->user()->id,
            $request->content
        );

        return $this->createdResponse(new DiscussionReplyResource($reply), 'Replied successfully.');
    }

    public function pin(Request $request, Discussion $discussion)
    {
        if ($discussion->lesson->module->course->teacher_id !== $request->user()->id) {
            return $this->forbiddenResponse('You do not own the course this discussion belongs to.');
        }

        $updated = $this->discussionService->togglePin($discussion);
        return $this->successResponse(new DiscussionResource($updated), 'Toggled pin status successfully.');
    }

    public function bestAnswer(Request $request, Discussion $discussion)
    {
        if ($discussion->lesson->module->course->teacher_id !== $request->user()->id) {
            return $this->forbiddenResponse('You do not own the course this discussion belongs to.');
        }

        $request->validate([
            'reply_id' => 'required|exists:discussion_replies,id',
        ]);

        // Validate the reply belongs to this discussion
        if ($discussion->replies()->where('id', $request->reply_id)->doesntExist()) {
            return $this->errorResponse('Reply does not belong to this discussion.', 422);
        }

        $this->discussionService->markBestAnswer($discussion, $request->reply_id);
        
        return $this->successResponse(null, 'Marked best answer successfully.');
    }

    public function toggleResolved(Request $request, Discussion $discussion)
    {
        if ($discussion->lesson->module->course->teacher_id !== $request->user()->id) {
            return $this->forbiddenResponse('You do not own the course this discussion belongs to.');
        }

        $updated = $this->discussionService->toggleResolved($discussion);
        
        return $this->successResponse(new DiscussionResource($updated), 'Toggled resolved status successfully.');
    }

    public function destroy(Request $request, Discussion $discussion)
    {
        if ($discussion->lesson->module->course->teacher_id !== $request->user()->id) {
            return $this->forbiddenResponse('You do not own the course this discussion belongs to.');
        }

        $this->discussionService->deleteDiscussion($discussion);
        
        return $this->successResponse(null, 'Deleted discussion successfully.');
    }
}
