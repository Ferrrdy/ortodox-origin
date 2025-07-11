<?php

namespace Database\Seeders;

use App\Models\ShippingRate;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ShippingRateSeeder extends Seeder
{
    public function run(): void
    {
        // Data ongkir dari Surabaya (contoh)
        $rates = [
            ['city_id' => 152, 'price' => 17000], // Jakarta Pusat
            ['city_id' => 22,  'price' => 18000], // Bandung
            ['city_id' => 501, 'price' => 15000], // Semarang
            ['city_id' => 574, 'price' => 15000], // Yogyakarta
            ['city_id' => 114, 'price' => 20000], // Denpasar
        ];

        foreach ($rates as $rate) {
            ShippingRate::updateOrCreate(
                ['destination_city_id' => $rate['city_id']],
                ['price_per_kg' => $rate['price']]
            );
        }
    }
}