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
            'time_limit_minutes' => $this->time_limit_minutes,
            'passing_score' => $this->passing_score,
            'questions' => $this->whenLoaded('questions', function () {
                return $this->questions->map(function ($question) {
                    return [
                        'id' => $question->id,
                        'content' => $question->content,
                        'order' => $question->order,
                        'answers' => $question->answers->map(function ($answer) {
                            return [
                                'id' => $answer->id,
                                'content' => $answer->content,
                                'is_correct' => $answer->is_correct,
                            ];
                        }),
                    ];
                });
            }),
            'questions_count' => $this->whenCounted('questions'),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
