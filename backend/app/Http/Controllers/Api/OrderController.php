<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB; // Impor DB Facade

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $orders = $request->user()
            ->orders() // Asumsi ada relasi 'orders()' di model User
            ->with('items.product') // Eager load item dan produknya jika perlu
            ->latest() // Urutkan dari yang terbaru
            ->get();

        return response()->json($orders);
    }
    /**
     * Memproses checkout dari keranjang atau "Beli Sekarang".
     */
    public function checkout(Request $request)
    {
        $user = auth()->user();

        $validated = $request->validate([
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        // Menggunakan transaksi database untuk memastikan semua operasi berhasil atau semua dibatalkan.
        try {
            $order = DB::transaction(function () use ($user, $validated) {
                // 1. Buat pesanan baru
                $order = Order::create([
                    'user_id' => $user->id,
                    'status' => 'pending',
                    'total_price' => 0, // Dihitung di bawah
                ]);

                $total = 0;

                foreach ($validated['items'] as $item) {
                    // Kunci produk untuk mencegah race condition saat update stok
                    $product = Product::lockForUpdate()->find($item['product_id']);

                    // Cek stok lagi untuk keamanan
                    if ($product->stock < $item['quantity']) {
                        // Melempar exception akan otomatis membatalkan (rollback) transaksi
                        throw new \Exception("Stok produk '{$product->name}' tidak cukup.");
                    }

                    $subtotal = $product->price * $item['quantity'];
                    $total += $subtotal;

                    // Buat item pesanan yang terhubung dengan pesanan utama
                    $order->items()->create([
                        'product_id' => $product->id,
                        'quantity' => $item['quantity'],
                        'price' => $product->price,
                    ]);

                    // Kurangi stok produk
                    $product->decrement('stock', $item['quantity']);
                }

                // Update total harga pada pesanan
                $order->update(['total_price' => $total]);
                
                return $order;
            });

            // Jika transaksi berhasil, kembalikan respons sukses
            return response()->json([
                'message' => 'Checkout berhasil!',
                'order' => $order->load('items.product') // Muat relasi untuk dikirim ke frontend
            ], 201);

        } catch (\Exception $e) {
            // Jika terjadi error di dalam transaksi, kembalikan pesan errornya
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }
    
    /**
     * Menampilkan detail satu pesanan.
     * Method ini tidak lagi menggunakan Route Model Binding otomatis untuk kontrol yang lebih baik.
     */
    public function show(Request $request, $id)
    {
        // 1. Cari pesanan berdasarkan ID yang diberikan di URL
        $order = Order::find($id);

        // 2. Jika pesanan tidak ada, beri pesan error yang jelas
        if (!$order) {
            return response()->json(['message' => "Pesanan dengan ID {$id} tidak ditemukan."], 404);
        }

        // 3. Pastikan hanya pemilik pesanan yang bisa melihatnya
        if ($request->user()->id !== $order->user_id) {
            return response()->json(['message' => 'Anda tidak memiliki akses ke pesanan ini.'], 403);
        }

        // 4. Jika semua aman, kembalikan data pesanan beserta item-itemnya
        return $order->load('items.product');
    }

}
