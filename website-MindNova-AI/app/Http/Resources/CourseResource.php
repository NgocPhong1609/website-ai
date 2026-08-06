<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CourseResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'description' => $this->description,
            'thumbnail' => $this->thumbnail ? url($this->thumbnail) : null,
            'price' => (float) $this->price,
            'current_price' => (float) $this->current_price,
            'sale_price' => $this->sale_price ? (float) $this->sale_price : null,
            'is_flash_sale' => $this->is_flash_sale,
            'sale_start_date' => $this->sale_start_date,
            'sale_end_date' => $this->sale_end_date,
            'level' => $this->level,
            'status' => $this->status,
            'category_id' => $this->category_id,
            'totalLessons' => $this->total_lessons,
            'durationHours' => $this->duration_hours,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
