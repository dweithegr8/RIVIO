<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UsedCard extends Model
{
    protected $fillable = [
        'card_hash',
        'last_four',
        'plan',
    ];
}
