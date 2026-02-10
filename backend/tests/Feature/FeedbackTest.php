<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Feedback;
use Illuminate\Foundation\Testing\RefreshDatabase;

class FeedbackTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test submit feedback with valid data.
     */
    public function test_submit_feedback_with_valid_data()
    {
        $response = $this->postJson('/api/feedback', [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'message' => 'This is a great product!',
            'rating' => 5,
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'id',
                'name',
                'email',
                'message',
                'rating',
                'is_approved',
                'status',
                'created_at',
            ])
            ->assertJsonPath('name', 'John Doe')
            ->assertJsonPath('rating', 5);

        $this->assertDatabaseHas('feedback', [
            'email' => 'john@example.com',
        ]);
    }

    /**
     * Test submit feedback with invalid rating.
     */
    public function test_submit_feedback_with_invalid_rating()
    {
        $response = $this->postJson('/api/feedback', [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'message' => 'This is feedback',
            'rating' => 10,
        ]);

        $response->assertStatus(422)
            ->assertJsonStructure(['message', 'errors']);
    }

    /**
     * Test submit feedback with short message.
     */
    public function test_submit_feedback_with_short_message()
    {
        $response = $this->postJson('/api/feedback', [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'message' => 'Short',
            'rating' => 5,
        ]);

        $response->assertStatus(422);
    }

    /**
     * Test get approved feedback (public).
     */
    public function test_get_approved_feedback_public()
    {
        Feedback::create([
            'name' => 'John',
            'email' => 'john@example.com',
            'message' => 'Great product!',
            'rating' => 5,
            'is_approved' => true,
        ]);

        Feedback::create([
            'name' => 'Jane',
            'email' => 'jane@example.com',
            'message' => 'Could be better',
            'rating' => 3,
            'is_approved' => false,
        ]);

        $response = $this->getJson('/api/feedback/approved');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data');
    }

    /**
     * Test get feedback statistics.
     */
    public function test_get_feedback_statistics()
    {
        Feedback::create([
            'name' => 'John',
            'email' => 'john@example.com',
            'message' => 'Great product!',
            'rating' => 5,
            'is_approved' => true,
        ]);

        Feedback::create([
            'name' => 'Jane',
            'email' => 'jane@example.com',
            'message' => 'Could be better',
            'rating' => 3,
            'is_approved' => false,
        ]);

        $response = $this->getJson('/api/feedback/stats');

        $response->assertStatus(200)
            ->assertJsonPath('total', 2)
            ->assertJsonPath('approved', 1)
            ->assertJsonPath('pending', 1);
    }

    /**
     * Test admin get all feedback (requires auth).
     */
    public function test_admin_get_all_feedback_requires_auth()
    {
        $response = $this->getJson('/api/feedback');

        $response->assertStatus(401);
    }

    /**
     * Test admin get all feedback with auth.
     */
    public function test_admin_get_all_feedback_with_auth()
    {
        $user = User::create([
            'name' => 'Admin',
            'email' => 'admin@test.com',
            'password' => bcrypt('password'),
        ]);

        $token = $user->createToken('test-token')->plainTextToken;

        Feedback::create([
            'name' => 'John',
            'email' => 'john@example.com',
            'message' => 'Feedback',
            'rating' => 5,
            'is_approved' => false,
        ]);

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->getJson('/api/feedback');

        $response->assertStatus(200)
            ->assertJsonStructure(['data', 'pagination']);
    }

    /**
     * Test update feedback status.
     */
    public function test_update_feedback_status()
    {
        $user = User::create([
            'name' => 'Admin',
            'email' => 'admin@test.com',
            'password' => bcrypt('password'),
        ]);

        $token = $user->createToken('test-token')->plainTextToken;

        $feedback = Feedback::create([
            'name' => 'John',
            'email' => 'john@example.com',
            'message' => 'Feedback',
            'rating' => 5,
            'is_approved' => false,
        ]);

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->patchJson("/api/feedback/{$feedback->id}/status", [
                'status' => 'approved',
            ]);

        $response->assertStatus(200)
            ->assertJsonPath('is_approved', true)
            ->assertJsonPath('status', 'approved');

        $this->assertDatabaseHas('feedback', [
            'id' => $feedback->id,
            'is_approved' => true,
        ]);
    }

    /**
     * Test delete feedback.
     */
    public function test_delete_feedback()
    {
        $user = User::create([
            'name' => 'Admin',
            'email' => 'admin@test.com',
            'password' => bcrypt('password'),
        ]);

        $token = $user->createToken('test-token')->plainTextToken;

        $feedback = Feedback::create([
            'name' => 'John',
            'email' => 'john@example.com',
            'message' => 'Feedback',
            'rating' => 5,
            'is_approved' => true,
        ]);

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->deleteJson("/api/feedback/{$feedback->id}");

        $response->assertStatus(200)
            ->assertJsonPath('message', 'Feedback deleted successfully');

        // Should be soft deleted, so still in database
        $this->assertSoftDeleted('feedback', ['id' => $feedback->id]);
    }

    /**
     * Test feedback rate limiting.
     */
    public function test_feedback_submission_rate_limiting()
    {
        // Submit 10 feedbacks (within limit)
        for ($i = 0; $i < 10; $i++) {
            $response = $this->postJson('/api/feedback', [
                'name' => "User $i",
                'email' => "user$i@example.com",
                'message' => 'This is feedback text number ' . $i,
                'rating' => 5,
            ]);
            $response->assertStatus(201);
        }

        // 11th should be rate limited
        $response = $this->postJson('/api/feedback', [
            'name' => 'User 11',
            'email' => 'user11@example.com',
            'message' => 'This should be rate limited',
            'rating' => 5,
        ]);
        $response->assertStatus(429);
    }
}
