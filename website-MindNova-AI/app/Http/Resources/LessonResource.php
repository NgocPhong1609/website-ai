<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Resources\Json\JsonResource;

class LessonResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'module_id' => $this->module_id,
            'title' => $this->title,
            'type' => $this->type,
            'content' => $this->content,
            'signed_url' => $this->getSignedUrl(),
            'duration_minutes' => $this->duration_minutes,
            'order' => $this->order,
            'status' => $this->status,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }

    private function getSignedUrl(): ?string
    {
        $media = $this->media()->where('media_type', 'video')->where('status', 'ready')->latest()->first();
        if ($media) {
            return Storage::disk('r2')->temporaryUrl($media->r2_key, now()->addHours(1));
        }
        return null;
    }
}
