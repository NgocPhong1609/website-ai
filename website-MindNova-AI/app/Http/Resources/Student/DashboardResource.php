<?php

namespace App\Http\Resources\Student;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DashboardResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'user' => $this->resource['user'],
            'courses' => $this->resource['courses'],
            'focus_areas' => $this->resource['focus_areas'],
            'ai_suggestion' => $this->resource['ai_suggestion'],
            'overall_progress' => $this->resource['overall_progress'],
            'study_streak' => $this->resource['study_streak'],
            'advanced_recommendations' => $this->resource['advanced_recommendations'],
        ];
    }
}
