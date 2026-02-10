<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FeedbackResource extends JsonResource
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
            'name' => $this->name,
            'email' => $this->email,
            'message' => $this->message,
            'comment' => $this->message, // Alias for API compatibility
            'rating' => (int) $this->rating,
            'is_approved' => (bool) $this->is_approved,
            'status' => $this->is_approved ? 'approved' : 'pending',
            'created_at' => $this->created_at?->toIso8601String(),
            'date' => $this->created_at?->toIso8601String(), // Alias
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
