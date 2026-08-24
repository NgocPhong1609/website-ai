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
            'total_activities_count' => $this->resource['total_activities_count'] ?? 0,
            'pagination' => $this->resource['pagination'] ?? [
                'current_page' => 1,
                'per_page' => 10,
                'total_items' => 0,
                'total_pages' => 1,
                'has_more' => false,
            ],
        ];
    }
}
