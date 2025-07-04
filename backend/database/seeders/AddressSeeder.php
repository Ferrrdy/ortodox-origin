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
            'province' => 'Jawa Tengah',
            'city' => 'Semarang',
            'city_id' => '501',
            'district' => 'Tembalang',
            'postal_code' => '50275',
            'address_detail' => 'Jl. Melati No. 123 RT 01 RW 03, Tembalang',
        ]);
    }
}
