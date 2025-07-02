<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Category; // Pastikan ini ditambahkan untuk relasi kategori


class Product extends Model
{
    use HasFactory;

    protected $fillable = [
    'name',
    'description',
    'price',
    'stock',
    'category_id',
    'image'
];
        public function category()
    {
        return $this->belongsTo(Category::class);
    }
    
}
