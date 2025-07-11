<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Order;


class Address extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'label',
        'receiver_name',
        'phone',
        'province',
        'city',
        'city_id', // <--- tambahkan ini
        'district',
        'postal_code',
        'address_detail',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function orders()
    {
        return $this->hasMany(Order::class);
    }   
    public function city()
    {
        // Pastikan Anda memiliki model City
        return $this->belongsTo(City::class);
    }

}
