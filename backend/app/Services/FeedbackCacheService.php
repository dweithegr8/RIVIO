<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use App\Models\Feedback;
use Carbon\Carbon;

class FeedbackCacheService
{
    /**
     * Cache key for stats.
     */
    private const STATS_CACHE_KEY = 'feedback_stats';
    private const STATS_CACHE_TTL = 300; // 5 minutes

    /**
     * Get cached stats or calculate fresh.
     */
    public static function getStats(): array
    {
        return Cache::remember(self::STATS_CACHE_KEY, self::STATS_CACHE_TTL, function () {
            return self::calculateStats();
        });
    }

    /**
     * Calculate fresh stats.
     */
    private static function calculateStats(): array
    {
        $total = Feedback::count();
        $approved = Feedback::where('is_approved', true)->count();
        $pending = Feedback::where('is_approved', false)->count();
        $avgRating = (float) Feedback::avg('rating');

        $now = Carbon::now();
        $startThisWeek = $now->copy()->startOfWeek();
        $startLastWeek = $now->copy()->subWeek()->startOfWeek();
        $endLastWeek = $startThisWeek->copy()->subSecond();

        $thisWeekFeedback = Feedback::where('created_at', '>=', $startThisWeek)->count();
        $lastWeekFeedback = Feedback::whereBetween('created_at', [$startLastWeek, $endLastWeek])->count();
        $responseRate = $total > 0 ? round($approved / $total * 100, 1) : 0;

        return [
            'total' => $total,
            'approved' => $approved,
            'pending' => $pending,
            'average_rating' => round($avgRating, 2),
            'totalFeedback' => $total,
            'pendingReviews' => $pending,
            'approvedReviews' => $approved,
            'avgRating' => round($avgRating, 2),
            'thisWeekFeedback' => $thisWeekFeedback,
            'lastWeekFeedback' => $lastWeekFeedback,
            'totalReviews' => $approved,
            'totalUsers' => $total,
            'responseRate' => $responseRate,
        ];
    }

    /**
     * Invalidate stats cache (call after creating/updating/deleting feedback).
     */
    public static function invalidate(): void
    {
        Cache::forget(self::STATS_CACHE_KEY);
    }
}
