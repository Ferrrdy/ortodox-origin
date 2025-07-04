<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\ScraperService; // Impor service kita
use Illuminate\Http\Request;

class OngkirController extends Controller
{
    /**
     * Endpoint untuk cek ongkir JNE.
     */
    public function cekJne(Request $request, ScraperService $scraperService)
    {
        // 1. Validasi input dari pengguna
        $validated = $request->validate([
            'origin'      => 'required|string',
            'destination' => 'required|string',
            'weight'      => 'required|integer|min:1',
        ]);

        try {
            // 2. Panggil metode scraper dari service
            $rates = $scraperService->scrapeJneRates(
                $validated['origin'],
                $validated['destination'],
                $validated['weight']
            );
            
            // 3. Jika tidak ada hasil, beri pesan yang sesuai
            if (empty($rates)) {
                return response()->json(['message' => 'Tarif tidak ditemukan atau kota tidak valid.'], 404);
            }

            // 4. Kembalikan hasil sebagai JSON
            return response()->json($rates);

        } catch (\Exception $e) {
            // Tangani jika ada error saat proses scraping
            return response()->json(['message' => 'Gagal mengambil data ongkir.', 'error' => $e->getMessage()], 500);
        }
    }
}