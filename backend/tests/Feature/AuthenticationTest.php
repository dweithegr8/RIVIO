<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Feedback;
use Illuminate\Foundation\Testing\RefreshDatabase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test admin login with valid credentials.
     */
    public function test_admin_login_with_valid_credentials()
    {
        $user = User::create([
            'name' => 'Admin User',
            'email' => 'admin@test.com',
            'password' => bcrypt('password123'),
        ]);

        $response = $this->postJson('/api/admin/login', [
            'email' => 'admin@test.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'user' => ['id', 'name', 'email', 'created_at'],
                'token',
            ])
            ->assertJsonPath('user.email', 'admin@test.com');
    }

    /**
     * Test admin login with invalid credentials.
     */
    public function test_admin_login_with_invalid_credentials()
    {
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@test.com',
            'password' => bcrypt('password123'),
        ]);

        $response = $this->postJson('/api/admin/login', [
            'email' => 'admin@test.com',
            'password' => 'wrongpassword',
        ]);

        $response->assertStatus(422)
            ->assertJsonPath('message', 'Invalid credentials');
    }

    /**
     * Test get current authenticated user.
     */
    public function test_get_current_user()
    {
        $user = User::create([
            'name' => 'Admin User',
            'email' => 'admin@test.com',
            'password' => bcrypt('password123'),
        ]);

        $token = $user->createToken('test-token')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->getJson('/api/admin/user');

        $response->assertStatus(200)
            ->assertJsonPath('user.email', 'admin@test.com');
    }

    /**
     * Test logout revokes token.
     */
    public function test_admin_logout()
    {
        $user = User::create([
            'name' => 'Admin User',
            'email' => 'admin@test.com',
            'password' => bcrypt('password123'),
        ]);

        $token = $user->createToken('test-token')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->postJson('/api/admin/logout');

        $response->assertStatus(200)
            ->assertJsonPath('message', 'Logged out successfully');
    }
}
