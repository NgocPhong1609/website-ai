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
            'partnership_tier' => $this->partnership_tier ?? 'standard',
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
            'modules' => $this->whenLoaded('modules', function () {
                return $this->modules->map(function ($module) {
                    return [
                        'id' => $module->id,
                        'title' => $module->title,
                        'order' => $module->order,
                        'lessons' => $module->relationLoaded('lessons') ? $module->lessons->map(function ($lesson) {
                            return [
                                'id' => $lesson->id,
                                'title' => $lesson->title,
                                'type' => $lesson->type,
                                'content' => $lesson->content,
                                'video_url' => $lesson->video_url,
                                'duration_seconds' => $lesson->duration_seconds ?? 0,
                                'order' => $lesson->order,
                            ];
                        }) : [],
                    ];
                });
            }),
            'lessons' => $this->whenLoaded('lessons', function () {
                return $this->lessons->map(function ($lesson) {
                    return [
                        'id' => $lesson->id,
                        'title' => $lesson->title,
                        'type' => $lesson->type,
                        'content' => $lesson->content,
                        'video_url' => $lesson->video_url,
                        'duration_seconds' => $lesson->duration_seconds ?? 0,
                        'order' => $lesson->order,
                    ];
                });
            }),
            // ── Versioning info ──
            'current_version' => $this->current_version,
            'lock_version' => $this->lock_version,
            'published_version_id' => $this->published_version_id,
            'is_published' => $this->isPublished(),
            'has_pending_submission' => $this->hasPendingSubmission(),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
