<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Voucher extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'type',
        'amount',
        'expires_at',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
    ];
}
