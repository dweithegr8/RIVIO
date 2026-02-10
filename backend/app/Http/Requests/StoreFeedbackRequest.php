<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Http\Controllers\SettingsController;

class StoreFeedbackRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Public endpoint
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        $settings = SettingsController::getMerged();
        $allowAnonymous = $settings['allowAnonymousReviews'] ?? true;

        return [
            'name' => [$allowAnonymous ? 'nullable' : 'required', 'string', 'max:255', 'min:2'],
            'email' => [$allowAnonymous ? 'nullable' : 'required', 'email', 'max:255'],
            'message' => ['nullable', 'string', 'min:10', 'max:1000'],
            'comment' => ['nullable', 'string', 'min:10', 'max:1000'],
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
        ];
    }

    /**
     * Custom messages for validation errors.
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Name is required.',
            'name.min' => 'Name must be at least 2 characters.',
            'email.required' => 'Email is required.',
            'email.email' => 'Please provide a valid email address.',
            'message.min' => 'Feedback text must be at least 10 characters.',
            'message.max' => 'Feedback text cannot exceed 1000 characters.',
            'rating.required' => 'Rating is required.',
            'rating.min' => 'Rating must be between 1 and 5.',
            'rating.max' => 'Rating must be between 1 and 5.',
        ];
    }
}
