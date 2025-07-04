<?php

namespace Database\Seeders;

use App\Models\City;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        City::create(['id' => 501, 'name' => 'Semarang']);
        City::create(['id' => 152, 'name' => 'Jakarta Pusat']);
        City::create(['id' => 22,  'name' => 'Bandung']);
        City::create(['id' => 574, 'name' => 'Yogyakarta']);
        City::create(['id' => 114, 'name' => 'Denpasar']);
    }
}
