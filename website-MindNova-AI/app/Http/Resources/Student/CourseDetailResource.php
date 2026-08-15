<?php

namespace App\Http\Resources\Student;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CourseDetailResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'header_info' => $this->resource['header_info'] ?? null,
            'progress_card' => $this->resource['progress_card'] ?? null,
            'ai_insight' => $this->resource['ai_insight'] ?? null,
            'instructor' => $this->resource['instructor'] ?? null,
            'modules' => $this->resource['modules'] ?? [],
            'resources' => $this->resource['resources'] ?? [],
        ];
    }
}
