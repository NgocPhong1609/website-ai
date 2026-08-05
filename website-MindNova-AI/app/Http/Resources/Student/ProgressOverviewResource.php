<?php

namespace App\Http\Resources\Student;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProgressOverviewResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'overview_card' => $this->resource['overview_card'] ?? null,
            'key_metrics' => $this->resource['key_metrics'] ?? null,
            'roadmap_modules' => $this->resource['roadmap_modules'] ?? [],
            'ai_insights' => $this->resource['ai_insights'] ?? null,
        ];
    }
}
