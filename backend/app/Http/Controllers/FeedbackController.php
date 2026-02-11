<?php

namespace App\Http\Controllers;

use App\Mail\NewFeedbackNotification;
use App\Mail\FeedbackConfirmation;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Models\Feedback;
use App\Http\Controllers\SettingsController;
use App\Http\Requests\StoreFeedbackRequest;
use App\Http\Requests\UpdateFeedbackStatusRequest;
use App\Http\Resources\FeedbackResource;
use App\Services\FeedbackCacheService;
use App\Jobs\SendFeedbackNotificationEmail;

class FeedbackController extends Controller
{
    /**
     * List all feedback (admin). Supports limit, sort, order for dashboard.
     */
    public function index(Request $request)
    {
        $sort = $request->query('sort', 'date');
        $order = strtolower($request->query('order', 'desc')) === 'asc' ? 'asc' : 'desc';
        $limit = (int) ($request->query('limit') ?? 15);
        $page = (int) ($request->query('page') ?? 1);

        $column = $sort === 'rating' ? 'rating' : 'created_at';
        
        // Paginate instead of just limit
        $paginated = Feedback::orderBy($column, $order)
            ->paginate($limit, ['*'], 'page', $page);

        return response()->json([
            'data' => FeedbackResource::collection($paginated->items()),
            'pagination' => [
                'total' => $paginated->total(),
                'per_page' => $paginated->perPage(),
                'current_page' => $paginated->currentPage(),
                'last_page' => $paginated->lastPage(),
                'from' => $paginated->firstItem(),
                'to' => $paginated->lastItem(),
            ],
        ]);
    }

    /**
     * List approved feedback only (public). Supports limit, sort, order for home/reviews.
     */
    public function approved(Request $request)
    {
        $sort = $request->query('sort', 'date');
        $order = strtolower($request->query('order', 'desc')) === 'asc' ? 'asc' : 'desc';
        $limit = (int) ($request->query('limit') ?? 10);
        $page = (int) ($request->query('page') ?? 1);

        $column = $sort === 'rating' ? 'rating' : 'created_at';
        
        // Paginate approved feedback
        $paginated = Feedback::where('is_approved', true)
            ->orderBy($column, $order)
            ->paginate($limit, ['*'], 'page', $page);

        return response()->json([
            'data' => FeedbackResource::collection($paginated->items()),
            'pagination' => [
                'total' => $paginated->total(),
                'per_page' => $paginated->perPage(),
                'current_page' => $paginated->currentPage(),
                'last_page' => $paginated->lastPage(),
                'from' => $paginated->firstItem(),
                'to' => $paginated->lastItem(),
            ],
        ]);
    }

    /**
     * Store new feedback. Enforces allowAnonymousReviews and sends email if enableEmailNotifications.
     */
    public function store(StoreFeedbackRequest $request)
    {
        try {
            $settings = SettingsController::getMerged();
            $allowAnonymous = $settings['allowAnonymousReviews'] ?? true;
            $validated = $request->validated();

            $message = $validated['message'] ?? $validated['comment'] ?? $request->input('comment', '');
            if (strlen($message) < 10) {
                return response()->json([
                    'message' => 'Validation failed.',
                    'errors' => ['message' => ['The feedback text must be at least 10 characters.']],
                ], 422);
            }

            if (!$allowAnonymous) {
                $name = trim($request->input('name', ''));
                if (strlen($name) < 2) {
                    return response()->json([
                        'message' => 'Validation failed.',
                        'errors' => ['name' => ['Name is required and must be at least 2 characters.']],
                    ], 422);
                }
                $email = trim($request->input('email', ''));
                if (!$email || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
                    return response()->json([
                        'message' => 'Validation failed.',
                        'errors' => ['email' => ['A valid email address is required.']],
                    ], 422);
                }
            }

            $feedback = Feedback::create([
                'name' => $request->input('name') ?? 'Anonymous',
                'email' => $request->input('email') ?? '',
                'message' => $message,
                'rating' => (int) ($validated['rating'] ?? $request->input('rating', 0)),
            ]);

            // Invalidate stats cache
            FeedbackCacheService::invalidate();

            // Send email notification asynchronously if enabled (admin)
            if (!empty($settings['enableEmailNotifications'])) {
                $to = $settings['notification_email'] ?? config('mail.from.address');
                if ($to) {
                    SendFeedbackNotificationEmail::dispatch($feedback, $to);
                }
            }

            // Queue a confirmation email to the submitter if they provided an email
            if (!empty($feedback->email)) {
                try {
                    Mail::to($feedback->email)->queue(new FeedbackConfirmation($feedback));
                    \Illuminate\Support\Facades\Log::info('Feedback confirmation queued', [
                        'feedback_id' => $feedback->id,
                        'recipient' => $feedback->email,
                    ]);
                } catch (\Exception $e) {
                    \Illuminate\Support\Facades\Log::error('Failed to queue feedback confirmation', [
                        'feedback_id' => $feedback->id,
                        'recipient' => $feedback->email,
                        'error' => $e->getMessage(),
                    ]);
                }
            }

            return response()->json(new FeedbackResource($feedback), 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'An error occurred while storing feedback.',
            ], 500);
        }
    }

    /**
     * Update feedback status (approve / pending / hidden).
     */
    public function updateStatus(UpdateFeedbackStatusRequest $request, int $id)
    {
        try {
            $validated = $request->validated();
            $feedback = Feedback::findOrFail($id);
            
            // Set is_approved and is_hidden based on status
            switch ($validated['status']) {
                case 'approved':
                    $feedback->is_approved = true;
                    $feedback->is_hidden = false;
                    break;
                case 'hidden':
                    $feedback->is_approved = false;
                    $feedback->is_hidden = true;
                    break;
                case 'pending':
                default:
                    $feedback->is_approved = false;
                    $feedback->is_hidden = false;
                    break;
            }
            
            $feedback->save();

            // Invalidate stats cache
            FeedbackCacheService::invalidate();

            return response()->json(new FeedbackResource($feedback->fresh()));
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Feedback not found.',
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'An error occurred while updating feedback.',
            ], 500);
        }
    }

    /**
     * Delete feedback.
     */
    public function destroy(int $id)
    {
        try {
            $feedback = Feedback::findOrFail($id);
            $feedback->delete();

            // Invalidate stats cache
            FeedbackCacheService::invalidate();

            return response()->json(['message' => 'Feedback deleted successfully'], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Feedback not found.',
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'An error occurred while deleting feedback.',
            ], 500);
        }
    }

    /**
     * Get feedback statistics (for dashboard and elsewhere).
     * Returns both legacy keys and dashboard shape: totalFeedback, pendingReviews, approvedReviews, avgRating, thisWeekFeedback, lastWeekFeedback.
     */
    public function stats()
    {
        try {
            return response()->json(FeedbackCacheService::getStats(), 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'An error occurred while retrieving statistics.',
            ], 500);
        }
    }
}
