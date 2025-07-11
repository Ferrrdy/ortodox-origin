<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Services\OngkirManualService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Address;
use App\Models\Voucher;

class OrderController extends Controller
{

    public function index(Request $request)
    {
        $orders = $request->user()
            ->orders() 
            ->with('items.product') 
            ->latest()
            ->get();

        return response()->json($orders);
    }
    public function checkout(Request $request, OngkirManualService $ongkirService)
    {
        $user = auth()->user();

        $validated = $request->validate([
            'address_id'       => 'required|exists:addresses,id,user_id,'.$user->id,
            'items'            => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity'   => 'required|integer|min:1',
            'shipping_service' => 'required|string',
            'shipping_cost'    => 'required|integer|min:0',
            'voucher_code'     => 'nullable|string|exists:vouchers,code',
        ]);
        try {
            $order = DB::transaction(function () use ($user, $validated, $ongkirService) {
                $address = Address::findOrFail($validated['address_id']);
                $productIds = collect($validated['items'])->pluck('product_id');
                $products = Product::whereIn('id', $productIds)->lockForUpdate()->get()->keyBy('id');

                $itemsTotalPrice = 0;
                $totalWeight = 0;
                foreach ($validated['items'] as $item) {
                    $product = $products->get($item['product_id']);
                    if ($product->stock < $item['quantity']) {
                        throw new \Exception("Stok produk '{$product->name}' tidak cukup.");
                    }
                    $itemsTotalPrice += $product->price * $item['quantity'];
                    $totalWeight += ($product->weight ?? 1000) * $item['quantity'];
                }

                $verifiedShipping = $ongkirService->calculate($address->city_id, $totalWeight);
                if ($verifiedShipping['cost'] != $validated['shipping_cost']) {
                    throw new \Exception('Biaya ongkir tidak valid.');
                }

                $discount = 0;
                $voucherId = null;

                // Hitung diskon jika ada voucher
                if (!empty($validated['voucher_code'])) {
                    $voucher = Voucher::where('code', $validated['voucher_code'])->first();
                    
                    if ($voucher && (!$voucher->expires_at || !$voucher->expires_at->isPast())) {
                        if ($voucher->type === 'fixed') {
                            $discount = $voucher->amount;
                        } elseif ($voucher->type === 'percent') {
                            $discount = ($voucher->amount / 100) * $itemsTotalPrice;
                        }
                        $voucherId = $voucher->id;
                    } else {
                        throw new \Exception('Voucher yang digunakan tidak valid.');
                    }
                }

                $discount = min($discount, $itemsTotalPrice);

                $grandTotal = $itemsTotalPrice + $validated['shipping_cost'] - $discount;
                $order = Order::create([
                    'user_id'          => $user->id,
                    'address_id'       => $validated['address_id'],
                    'status'           => 'pending',
                    'shipping_service' => $validated['shipping_service'],
                    'shipping_cost'    => $validated['shipping_cost'],
                    'voucher_id'       => $voucherId,
                    'total_price'      => $grandTotal,
                ]);

                foreach ($validated['items'] as $item) {
                    $product = $products->get($item['product_id']);
                    $order->items()->create([
                        'product_id' => $product->id,
                        'quantity'   => $item['quantity'],
                        'price'      => $product->price,
                    ]);
                    $product->decrement('stock', $item['quantity']);
                }

                return $order;
            });
            $freshOrder = Order::with('items.product', 'address', 'voucher')->find($order->id);
            return response()->json([
                'message' => 'Checkout berhasil!',
                'order' => $freshOrder,
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
        return $order->load('items.product');
    }
}
