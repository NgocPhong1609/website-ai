<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DiscussionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'lesson' => [
                'id' => $this->lesson->id,
                'title' => $this->lesson->title,
            ],
            'student' => [
                'id' => $this->student->id,
                'name' => $this->student->name,
            ],
            'title' => $this->title,
            'content' => $this->content,
            'status' => $this->status,
            'is_pinned' => (boolean) $this->is_pinned,
            'is_resolved' => (boolean) $this->is_resolved,
            'course' => [
                'title' => $this->lesson->module->course->title ?? '',
            ],
            'replies' => DiscussionReplyResource::collection($this->whenLoaded('replies')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
