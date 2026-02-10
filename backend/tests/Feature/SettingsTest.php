<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

class SettingsTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test get public settings (no auth required).
     */
    public function test_get_public_settings()
    {
        $response = $this->getJson('/api/settings/public');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'enablePublicReviews',
                'requireApproval',
                'showRatingsBreakdown',
                'allowAnonymousReviews',
                'minimumRatingToShow',
            ]);
    }

    /**
     * Test get admin settings (requires auth).
     */
    public function test_get_admin_settings_requires_auth()
    {
        $response = $this->getJson('/api/settings');

        $response->assertStatus(401);
    }

    /**
     * Test get admin settings with auth.
     */
    public function test_get_admin_settings_with_auth()
    {
        $user = User::create([
            'name' => 'Admin',
            'email' => 'admin@test.com',
            'password' => bcrypt('password'),
        ]);

        $token = $user->createToken('test-token')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->getJson('/api/settings');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'enablePublicReviews',
                'requireApproval',
                'enableEmailNotifications',
                'showRatingsBreakdown',
                'allowAnonymousReviews',
                'minimumRatingToShow',
                'notification_email',
            ]);
    }

    /**
     * Test update settings (requires auth).
     */
    public function test_update_settings_requires_auth()
    {
        $response = $this->putJson('/api/settings', [
            'allowAnonymousReviews' => false,
        ]);

        $response->assertStatus(401);
    }

    /**
     * Test update settings with auth.
     */
    public function test_update_settings_with_auth()
    {
        $user = User::create([
            'name' => 'Admin',
            'email' => 'admin@test.com',
            'password' => bcrypt('password'),
        ]);

        $token = $user->createToken('test-token')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->putJson('/api/settings', [
                'allowAnonymousReviews' => false,
                'minimumRatingToShow' => 3,
            ]);

        $response->assertStatus(200)
            ->assertJsonPath('allowAnonymousReviews', false)
            ->assertJsonPath('minimumRatingToShow', 3);
    }

    /**
     * Test update settings with invalid data.
     */
    public function test_update_settings_with_invalid_data()
    {
        $user = User::create([
            'name' => 'Admin',
            'email' => 'admin@test.com',
            'password' => bcrypt('password'),
        ]);

        $token = $user->createToken('test-token')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->putJson('/api/settings', [
                'minimumRatingToShow' => 10, // Invalid: > 5
            ]);

        $response->assertStatus(422);
    }
}
