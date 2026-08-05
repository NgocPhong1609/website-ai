<?php

namespace App\Http\Resources\Student;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StudyPlanResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'active_syllabus' => $this->resource['active_syllabus'] ?? null,
            'core_concepts' => $this->resource['core_concepts'] ?? [],
            'lesson_resources' => $this->resource['lesson_resources'] ?? [],
            'ai_insight' => $this->resource['ai_insight'] ?? null,
            'initial_messages' => $this->resource['initial_messages'] ?? [],
        ];
    }
}
