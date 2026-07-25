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

        $status = $request->input('status');
        if ($status) {
            $query->where('status', $status);
        }

        $discussions = $query->latest()->paginate($request->input('per_page', 15));

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
}
