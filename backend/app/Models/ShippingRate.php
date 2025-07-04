<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ShippingRate extends Model
{
    use HasFactory;
    protected $fillable = [
        'destination_city_id',
        'price_per_kg',
    ];
}
