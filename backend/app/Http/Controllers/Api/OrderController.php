<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Services\ScraperService; // Ganti dengan ScraperService
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Address;

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
   public function checkout(Request $request)
    {
        $user = auth()->user();

        $validated = $request->validate([
            'address_id' => 'required|exists:addresses,id',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        try {
            $order = DB::transaction(function () use ($validated, $user) {
                // Ambil alamat
                $address = Address::where('id', $validated['address_id'])
                            ->where('user_id', $user->id)
                            ->firstOrFail();

                // Ambil produk
                $productIds = collect($validated['items'])->pluck('product_id');
                $products = Product::whereIn('id', $productIds)->lockForUpdate()->get()->keyBy('id');

                $totalWeight = 0;
                $totalProductPrice = 0;

                foreach ($validated['items'] as $item) {
                    $product = $products->get($item['product_id']);
                    $quantity = $item['quantity'];

                    if (!$product) {
                        throw new \Exception("Produk dengan ID {$item['product_id']} tidak ditemukan.");
                    }

                    if ($product->stock < $quantity) {
                        throw new \Exception("Stok produk '{$product->name}' tidak cukup.");
                    }

                    $weight = $product->weight ?? 500; // default 500 gram
                    $totalWeight += $weight * $quantity;
                    $totalProductPrice += $product->price * $quantity;
                }

                // Hitung berat dalam kg dan bulat ke atas
                $totalWeightKg = ceil($totalWeight / 1000);

                // Ambil ongkir dari shipping_rates
                $shippingRate = \App\Models\ShippingRate::where('destination_city_id', $address->city_id)->first();
                if (!$shippingRate) {
                    throw new \Exception("Tarif pengiriman ke kota tujuan tidak tersedia.");
                }

                $shippingCost = $shippingRate->price_per_kg * $totalWeightKg;

                // Simpan Order
                $order = Order::create([
                    'user_id' => $user->id,
                    'address_id' => $address->id,
                    'status' => 'pending',
                    'shipping_service' => 'manual/local rate',
                    'shipping_cost' => $shippingCost,
                    'total_price' => $totalProductPrice + $shippingCost,
                ]);

                // Simpan item pesanan & kurangi stok
                foreach ($validated['items'] as $item) {
                    $product = $products->get($item['product_id']);

                    $order->items()->create([
                        'product_id' => $product->id,
                        'quantity' => $item['quantity'],
                        'price' => $product->price,
                    ]);

                    $product->decrement('stock', $item['quantity']);
                }

                return $order;
            });

            return response()->json([
                'message' => 'Checkout berhasil!',
                'order' => $order->load('items.product', 'address'),
            ], 201);

        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    public function show(Request $request, $id)
    {
        $order = Order::with(['items.product', 'address.city', 'address.province'])
                        ->where('id', $id)
                        ->first();

        if (!$order) {
            return response()->json(['message' => "Pesanan dengan ID {$id} tidak ditemukan."], 404);
        }

        if ($request->user()->id !== $order->user_id) {
            return response()->json(['message' => 'Anda tidak memiliki akses ke pesanan ini.'], 403);
        }

        // 4. Jika semua aman, kembalikan data pesanan beserta item-itemnya
        return $order->load('items.product');
    }
}
