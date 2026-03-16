<?php

namespace App\Http\Controllers;

use App\Models\UsedCard;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class PaymentController extends Controller
{
    /**
     * List all subscriptions (admin).
     * GET /api/admin/subscriptions
     */
    public function index()
    {
        try {
            $subscriptions = UsedCard::orderBy('created_at', 'desc')->get();
            return response()->json([
                'success' => true,
                'data' => $subscriptions
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch subscriptions.'
            ], 500);
        }
    }

    /**
     * Hash a card number using SHA-256.
     */
    private function hashCard(string $cardNumber): string
    {
        $digits = preg_replace('/\D/', '', $cardNumber);
        return hash('sha256', $digits);
    }

    /**
     * Check if a card number has already been used.
     * POST /api/payment/validate-card
     */
    public function validateCard(Request $request)
    {
        $request->validate([
            'card_number' => 'required|string|min:13',
        ]);

        $cardHash = $this->hashCard($request->card_number);
        $exists = UsedCard::where('card_hash', $cardHash)->exists();

        return response()->json([
            'available' => !$exists,
            'message' => $exists
            ? 'This card has already been used. Please use a different card.'
            : 'Card is available.',
        ]);
    }

    /**
     * Process a subscription payment.
     * POST /api/payment/subscribe
     */
    public function subscribe(Request $request)
    {
        $request->validate([
            'card_number' => 'required|string|min:13',
            'plan' => 'required|in:monthly,yearly',
            'name' => 'required|string|min:2',
            'expiry' => 'required|string',
            'cvc' => 'required|string|min:3',
        ]);

        $cardHash = $this->hashCard($request->card_number);

        // Check for duplicate
        if (UsedCard::where('card_hash', $cardHash)->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'This card has already been used. Please use a different card.',
            ], 422);
        }

        // Extract last four digits
        $digits = preg_replace('/\D/', '', $request->card_number);
        $lastFour = substr($digits, -4);

        // Save the used card
        UsedCard::create([
            'card_hash' => $cardHash,
            'last_four' => $lastFour,
            'plan' => $request->plan,
        ]);

        // TODO: Integrate with a real payment gateway here

        return response()->json([
            'success' => true,
            'message' => 'Subscription activated successfully!',
            'plan' => $request->plan,
        ]);
    }
}
