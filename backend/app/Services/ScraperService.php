<?php

namespace App\Services;

use Goutte\Client;
use Symfony\Component\HttpClient\HttpClient;

class ScraperService
{
    /**
     * Melakukan scraping ongkos kirim dari situs JNE (versi final).
     */
    public function scrapeJneRates(string $origin, string $destination, int $weight)
    {
        $client = new Client(HttpClient::create(['timeout' => 20]));
        
        // URL Action dari form cek tarif
        $url = 'https://www.jne.co.id/shipping-fee';

        try {
            // 1. Buka halaman awal untuk mendapatkan token CSRF jika ada (praktik terbaik)
            $crawler = $client->request('GET', 'https://www.jne.co.id/');
            
            // 2. Temukan form berdasarkan tombolnya, isi, lalu submit
            $form = $crawler->selectButton('Check')->form([
                'origin'      => $origin,
                'destination' => $destination,
                'weight'      => $weight / 1000, // Form JNE kemungkinan besar menggunakan satuan KG
            ]);

            $crawler = $client->submit($form);

            $results = [];

            // 3. Ambil data dari tabel hasil yang muncul
            // Selector ini harus Anda verifikasi kembali dengan "Inspect Element" pada halaman hasil
            $crawler->filter('table.table-custom tbody tr')->each(function ($node) use (&$results) {
                if ($node->filter('td')->count() >= 5) {
                    $service = $node->filter('td')->eq(1)->text();
                    $etd = $node->filter('td')->eq(3)->text();
                    $price = $node->filter('td')->eq(4)->text();

                    if (!empty(trim($service))) {
                        $results[] = [
                            'layanan'  => trim($service),
                            'estimasi' => trim($etd),
                            'tarif'    => trim($price),
                        ];
                    }
                }
            });

            return $results;

        } catch (\Exception $e) {
            // Jika ada error (misal: tombol 'Check' tidak ditemukan), kembalikan array kosong
            // atau log errornya.
            // Log::error('Scraper Gagal: ' . $e->getMessage());
            return [];
        }
    }
}