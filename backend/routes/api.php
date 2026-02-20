<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FeedbackController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PaymentController;

// Health check (always available)
Route::get('/health', function () {
    return response()->json(['status' => 'ok'], 200);
});

// Debug test endpoint (remove in production)
Route::post('/test', function () {
    return response()->json(['message' => 'API working']);
});

// ========== AUTHENTICATION (Public) ==========
Route::post('/admin/login', [AuthController::class , 'login']);

// ========== PROTECTED ADMIN ROUTES ==========
Route::middleware('auth:sanctum')->group(function () {
    // Auth endpoints
    Route::get('/admin/user', [AuthController::class , 'user']);
    Route::post('/admin/logout', [AuthController::class , 'logout']);
    Route::get('/admin/verify', [AuthController::class , 'verify']);

    // Admin feedback management
    Route::get('/feedback', [FeedbackController::class , 'index']);
    Route::patch('/feedback/{id}/status', [FeedbackController::class , 'updateStatus']);
    Route::delete('/feedback/{id}', [FeedbackController::class , 'destroy']);

    // Admin settings management
    Route::get('/settings', [SettingsController::class , 'index']);
    Route::put('/settings', [SettingsController::class , 'update']);
});

// ========== PUBLIC ROUTES ==========
// Public feedback submission (with rate limiting)
Route::post('/feedback', [FeedbackController::class , 'store'])->middleware('throttle:10,1');

// Public feedback viewing
Route::get('/feedback/approved', [FeedbackController::class , 'approved']);
Route::get('/feedback/stats', [FeedbackController::class , 'stats']);

// Public settings
Route::get('/settings/public', [SettingsController::class , 'public']);

// ========== PAYMENT ROUTES ==========
Route::post('/payment/validate-card', [PaymentController::class , 'validateCard']);
Route::post('/payment/subscribe', [PaymentController::class , 'subscribe']);
