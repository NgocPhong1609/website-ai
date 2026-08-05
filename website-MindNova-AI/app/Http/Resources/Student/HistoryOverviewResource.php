<?php

namespace App\Http\Resources\Student;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class HistoryOverviewResource extends JsonResource
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
            'metrics_row' => $this->resource['metrics_row'] ?? null,
            'timeline_groups' => $this->resource['timeline_groups'] ?? [],
            'total_activities_count' => $this->resource['total_activities_count'] ?? 142,
        ];
    }
}
