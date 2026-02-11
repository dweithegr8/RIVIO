<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Setting;
use App\Http\Requests\UpdateSettingsRequest;

class SettingsController extends Controller
{
    private const SETTINGS_KEY = 'app_settings';

    /**
     * Default values used when no settings exist (matches frontend Settings.jsx).
     */
    private static function defaults(): array
    {
        return [
            'enablePublicReviews' => true,
            'requireApproval' => true,
            'enableEmailNotifications' => true,
            'showRatingsBreakdown' => true,
            'allowAnonymousReviews' => true,
            'minimumRatingToShow' => 1,
        ];
    }

    /**
     * Return merged settings array (for use in other controllers).
     */
    public static function getMerged(): array
    {
        try {
            $row = Setting::where('key', self::SETTINGS_KEY)->first();
            $value = $row ? json_decode($row->value, true) : null;
            $defaults = self::defaults();
            return is_array($value) ? array_merge($defaults, $value) : $defaults;
        } catch (\Exception $e) {
            return self::defaults();
        }
    }

    /**
     * GET /api/settings/public - Return only settings needed for public/reviews/submission (no auth).
     */
    public function public(): \Illuminate\Http\JsonResponse
    {
        try {
            $all = self::getMerged();
            $keys = [
                'enablePublicReviews',
                'requireApproval',
                'showRatingsBreakdown',
                'allowAnonymousReviews',
                'minimumRatingToShow',
            ];
            $public = [];
            foreach ($keys as $key) {
                $public[$key] = $all[$key] ?? self::defaults()[$key];
            }
            return response()->json($public, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'An error occurred while retrieving public settings.',
            ], 500);
        }
    }

    /**
     * GET /api/settings - Return current settings (for admin Settings page).
     */
    public function index()
    {
        try {
            $settings = self::getMerged();
            return response()->json($settings, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'An error occurred while retrieving settings.',
            ], 500);
        }
    }

    /**
     * PUT /api/settings - Update settings (from admin Settings page).
     */
    public function update(UpdateSettingsRequest $request)
    {
        try {
            $validated = $request->validated();

            $row = Setting::where('key', self::SETTINGS_KEY)->first();
            $current = $row ? json_decode($row->value, true) : null;
            $merged = is_array($current) ? array_merge(self::defaults(), $current, $validated) : array_merge(self::defaults(), $validated);

            Setting::updateOrCreate(
                ['key' => self::SETTINGS_KEY],
                ['value' => json_encode($merged)]
            );

            return response()->json($merged, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'An error occurred while updating settings.',
            ], 500);
        }
    }
}
