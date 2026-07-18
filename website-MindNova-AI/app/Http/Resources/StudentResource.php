<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StudentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'avatar_url' => $this->avatar_url,
            'progress' => $this->when(isset($this->pivot->progress_percentage), function () {
                return $this->pivot->progress_percentage;
            }),
            'enrolled_at' => $this->when(isset($this->pivot->enrolled_at), function () {
                return $this->pivot->enrolled_at;
            }),
        ];
    }
}
