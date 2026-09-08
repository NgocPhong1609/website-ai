<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class QuizResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'lesson_id' => $this->lesson_id,
            'title' => $this->title,
            'thumbnail_url' => $this->thumbnail_url,
            'thumbnail_r2_key' => $this->thumbnail_r2_key,
            'time_limit_minutes' => $this->time_limit_minutes,
            'passing_score' => $this->passing_score,
            'questions' => $this->whenLoaded('questions', function () {
                return $this->questions->map(function ($q) {
                    $answers = $q->answers ? $q->answers->map(function ($a) {
                        return [
                            'id' => $a->id,
                            'content' => $a->content,
                            'is_correct' => (bool) $a->is_correct,
                            'image_url' => $a->image_url,
                            'image_r2_key' => $a->image_r2_key,
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
                        'selection_type' => $q->selection_type ?? 'single_choice',
                        'image_url' => $q->image_url,
                        'image_r2_key' => $q->image_r2_key,
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
                });
            }),
            'questions_count' => $this->whenCounted('questions'),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
