<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration 
{
    public function up(): void
    {
        Schema::create('used_cards', function (Blueprint $table) {
            $table->id();
            $table->string('card_hash', 64)->unique(); // SHA-256 hash of raw card digits
            $table->string('last_four', 4);
            $table->string('plan', 10); // 'monthly' or 'yearly'
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('used_cards');
    }
};
