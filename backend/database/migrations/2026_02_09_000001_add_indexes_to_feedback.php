<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations - adds indexes for frequently queried columns.
     */
    public function up(): void
    {
        Schema::table('feedback', function (Blueprint $table) {
            $table->index('created_at');
            $table->index('is_approved');
            $table->index('rating');
            $table->index(['is_approved', 'created_at']); // Composite index for approved feedback queries
            $table->index('deleted_at'); // For soft delete queries
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('feedback', function (Blueprint $table) {
            $table->dropIndex(['created_at']);
            $table->dropIndex(['is_approved']);
            $table->dropIndex(['rating']);
            $table->dropIndex(['is_approved', 'created_at']);
            $table->dropIndex(['deleted_at']);
        });
    }
};
