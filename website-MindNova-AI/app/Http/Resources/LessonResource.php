<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Resources\Json\JsonResource;

class LessonResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $quizData = null;
        if ($this->type === 'quiz_module' && $this->quiz) {
            $quizData = [
                'id' => $this->quiz->id,
                'title' => $this->quiz->title,
                'time_limit_minutes' => $this->quiz->time_limit_minutes,
                'passing_score' => $this->quiz->passing_score,
                'questions' => $this->quiz->questions->map(function ($q) {
                    return [
                        'id' => $q->id,
                        'content' => $q->content,
                        'order' => $q->order,
                        'answers' => $q->answers->map(function ($a) {
                            return [
                                'id' => $a->id,
                                'content' => $a->content,
                                'is_correct' => (bool) $a->is_correct,
                            ];
                        })->toArray(),
                    ];
                })->toArray(),
            ];
        }

        return [
            'id' => $this->id,
            'module_id' => $this->module_id,
            'title' => $this->title,
            'type' => $this->type,
            'content' => $this->content,
            'video_url' => $this->video_url,
            'signed_url' => $this->getSignedUrl(),
            'duration_seconds' => $this->duration_seconds,
            'order' => $this->order,
            'status' => $this->status,
            'quizData' => $quizData,
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
