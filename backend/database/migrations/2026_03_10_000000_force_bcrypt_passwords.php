<?php

use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Hash;

return new class extends Migration 
{
    /**
     * Run the migrations to fix passwords that aren't hashed with Bcrypt.
     */
    public function up(): void
    {
        $emails = ['admin@example.com', 'test@example.com'];

        foreach ($emails as $email) {
            $user = User::where('email', $email)->first();
            if ($user) {
                // Force a new Bcrypt hash
                $user->password = Hash::make('password123');
                $user->save();
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
    // No reverse needed for a data fix
    }
};
