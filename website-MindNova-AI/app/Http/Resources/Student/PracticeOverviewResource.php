<?php

namespace App\Http\Resources\Student;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PracticeOverviewResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'assessment_info' => $this->resource['assessment_info'] ?? null,
            'readiness' => $this->resource['readiness'] ?? null,
            'instructions' => $this->resource['instructions'] ?? [],
            'ai_insight' => $this->resource['ai_insight'] ?? null,
            'prerequisites' => $this->resource['prerequisites'] ?? [],
            'recent_attempts' => $this->resource['recent_attempts'] ?? null,
        ];
    }
}
