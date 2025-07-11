<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Address;
use App\Models\User;

class AddressSeeder extends Seeder
{
    public function run(): void
    {
        // Pastikan ada minimal satu user terlebih dahulu
        $user = User::first(); // ambil user pertama

        if (!$user) {
            $this->command->warn('Tidak ada user ditemukan. Seeder Address tidak dijalankan.');
            return;
        }

        Address::create([
            'user_id' => $user->id,
            'label' => 'Rumah',
            'receiver_name' => 'Budi Santoso',
            'phone' => '081234567890',
            'province_id'    => 10, 
            'province_name'  => 'Jawa Tengah',
            'city_id'        => 501,
            'city_name'      => 'Semarang',
            'district_id'    => 5573, 
            'district_name'  => 'Tembalang',
            'postal_code'    => '50275',
            'address_detail' => 'Jl. Melati No. 123 RT 01 RW 03, Tembalang',
        ]);
    }
}
