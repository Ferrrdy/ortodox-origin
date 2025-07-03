<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\OrderItem;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function checkout(Request $request)
    {
        $user = auth()->user();

        $validated = $request->validate([
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        $order = Order::create([
            'user_id' => $user->id,
            'status' => 'pending',
            'total_price' => 0, // Akan dihitung di bawah
        ]);

        $total = 0;

        foreach ($validated['items'] as $item) {
            $product = Product::find($item['product_id']);

            // Validasi harga produk
            if (!$product || !$product->exists) {
                return response()->json([
                    'message' => "Produk dengan ID {$item['product_id']} tidak ditemukan."
                ], 404);
            }

            if ($product->price === null || $product->price <= 0) {
                return response()->json([
                    'message' => "Produk '{$product->name}' tidak memiliki harga valid.",
                ], 422);
            }

            // Cek stok cukup
            if ($product->stock < $item['quantity']) {
                return response()->json([
                    'message' => "Stok produk '{$product->name}' tidak cukup.",
                ], 422);
            }

            $subtotal = $product->price * $item['quantity'];
            $total += $subtotal;

            // Simpan item ke order
            $order->items()->create([
                'product_id' => $product->id,
                'quantity' => $item['quantity'],
                'price' => $product->price,
            ]);

            // Kurangi stok
            $product->stock -= $item['quantity'];
            $product->save();
        }

        $order->update(['total_price' => $total]);

        return response()->json([
            'message' => 'Checkout berhasil!',
            'order' => $order->load('items.product')
        ], 201);
    }
    
    public function show(Order $order)
    {
        // Pastikan hanya pemilik order yang bisa melihat
        if (auth()->user()->id !== $order->user_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return $order->load('items.product');
    }
}
