<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\OrderItem;
use App\Models\User;
use App\Models\Address;
use App\Models\Voucher;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;



class Order extends Model
{
    use HasFactory;
    protected $fillable = [
    'user_id',
    'address_id',
    'voucher_id',
    'shipping_service',
    'shipping_cost',
    'total_price',
    'status',
];


    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function address()
    {
        return $this->belongsTo(Address::class);
    }
    public function voucher(){
        return $this->belongsTo(Voucher::class);
    }

}

