<?php

namespace App\Services;

use App\Models\ShippingRate;

class OngkirManualService
{
    // Tarif default jika kota tujuan tidak ada di daftar populer kita
    const DEFAULT_FLAT_RATE = 50000;
    const DEFAULT_SERVICE_NAME = 'Reguler';
    const UNCOVERED_SERVICE_NAME = 'Luar Jangkauan';

    /**
     * Kalkulasi ongkir berdasarkan tabel manual di database.
     *
     * @param int $destination_city_id
     * @param int $total_weight_grams
     * @return array
     */
    public function calculate(int $destination_city_id, int $total_weight_grams): array
    {
        $rate = ShippingRate::where('destination_city_id', $destination_city_id)->first();

        // Konversi berat ke KG dan bulatkan ke atas
        $weightInKg = (int) ceil($total_weight_grams / 1000);
        if ($weightInKg === 0) {
            $weightInKg = 1; // Berat minimum dihitung 1 kg
        }

        if ($rate) {
            // Jika kota tujuan ada di daftar populer kita
            return [
                'cost'    => $rate->price_per_kg * $weightInKg,
                'service' => self::DEFAULT_SERVICE_NAME
            ];
        }

        // Jika tidak ada, gunakan tarif flat-rate untuk "Luar Jangkauan"
        return [
            'cost'    => self::DEFAULT_FLAT_RATE,
            'service' => self::UNCOVERED_SERVICE_NAME
        ];
    }
}