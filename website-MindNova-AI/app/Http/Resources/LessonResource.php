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
        if (($this->type === 'quiz_module' || $this->type === 'quiz') && $this->quiz) {
            $quizData = [
                'id' => $this->quiz->id,
                'quiz_id' => $this->quiz->id,
                'title' => $this->quiz->title,
                'description' => $this->quiz->description,
                'time_limit_minutes' => $this->quiz->time_limit_minutes ?? 15,
                'passing_score' => $this->quiz->passing_score ?? 70,
                'difficulty' => $this->quiz->difficulty ?? 'mixed',
                'questions' => $this->quiz->questions ? $this->quiz->questions->map(function ($q) {
                    $answers = $q->answers ? $q->answers->map(function ($a) {
                        return [
                            'id' => $a->id,
                            'content' => $a->content,
                            'is_correct' => (bool) $a->is_correct,
                        ];
                    })->values()->toArray() : [];

                    $options = $q->answers ? $q->answers->pluck('content')->toArray() : [];
                    $correctIdx = 0;
                    if ($q->answers) {
                        $found = $q->answers->search(fn($a) => (bool)$a->is_correct);
                        if ($found !== false) {
                            $correctIdx = $found;
                        }
                    }

                    return [
                        'id' => $q->id,
                        'type' => $q->type ?? 'multiple_choice',
                        'question' => $q->content,
                        'content' => $q->content,
                        'explanation' => $q->explanation,
                        'sample_answer' => $q->sample_answer,
                        'rubric' => $q->rubric,
                        'points' => (float) ($q->points ?? 1.0),
                        'difficulty' => $q->difficulty ?? 'medium',
                        'order' => $q->order,
                        'options' => $options,
                        'correct_answer_index' => $correctIdx,
                        'answers' => $answers,
                    ];
                })->values()->toArray() : [],
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
            // ── Versioning info ──
            'current_version' => $this->current_version,
            'published_version_id' => $this->published_version_id,
            'is_published' => $this->isPublished(),
            'has_pending_revision' => $this->status !== 'published' && $this->published_version_id !== null,
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
