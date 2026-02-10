<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use App\Http\Requests\AdminLoginRequest;
use App\Http\Resources\UserResource;

class AuthController extends Controller
{
    /**
     * Admin login - issue Sanctum token.
     */
    public function login(AdminLoginRequest $request)
    {
        try {
            $validated = $request->validated();

            $user = User::where('email', $validated['email'])->first();

            if (!$user || !Hash::check($validated['password'], $user->password)) {
                Log::warning('Failed login attempt', ['email' => $validated['email']]);
                return response()->json([
                    'message' => 'Invalid credentials',
                ], 422);
            }

            $token = $user->createToken('api-token')->plainTextToken;

            return response()->json([
                'user' => new UserResource($user),
                'token' => $token,
            ], 200);
        } catch (\Exception $e) {
            Log::error('Login error', ['error' => $e->getMessage()]);
            return response()->json([
                'message' => 'An error occurred during login',
            ], 500);
        }
    }

    /**
     * Get current authenticated user.
     */
    public function user(Request $request)
    {
        try {
            return response()->json([
                'user' => new UserResource($request->user()),
            ], 200);
        } catch (\Exception $e) {
            Log::error('Get user error', ['error' => $e->getMessage()]);
            return response()->json([
                'message' => 'An error occurred.',
            ], 500);
        }
    }

    /**
     * Admin logout - revoke current token.
     */
    public function logout(Request $request)
    {
        try {
            $request->user()->currentAccessToken()->delete();

            return response()->json([
                'message' => 'Logged out successfully',
            ], 200);
        } catch (\Exception $e) {
            Log::error('Logout error', ['error' => $e->getMessage()]);
            return response()->json([
                'message' => 'An error occurred during logout',
            ], 500);
        }
    }

    /**
     * Verify token is valid.
     */
    public function verify(Request $request)
    {
        try {
            return response()->json([
                'valid' => true,
                'user' => new UserResource($request->user()),
            ], 200);
        } catch (\Exception $e) {
            Log::error('Verify error', ['error' => $e->getMessage()]);
            return response()->json([
                'message' => 'An error occurred.',
            ], 500);
        }
    }
}
