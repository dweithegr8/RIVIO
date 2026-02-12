<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSettingsRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() !== null; // Admin only
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'enablePublicReviews' => ['boolean'],
            'requireApproval' => ['boolean'],
            'enableEmailNotifications' => ['boolean'],
            'showRatingsBreakdown' => ['boolean'],
            'allowAnonymousReviews' => ['boolean'],
            'minimumRatingToShow' => ['integer', 'min:1', 'max:5'],
        ];
    }

    /**
     * Custom messages for validation errors.
     */
    public function messages(): array
    {
        return [
            'notification_email.email' => 'Please provide a valid email address.',
            'minimumRatingToShow.min' => 'Minimum rating must be at least 1.',
            'minimumRatingToShow.max' => 'Minimum rating cannot exceed 5.',
        ];
    }
}
