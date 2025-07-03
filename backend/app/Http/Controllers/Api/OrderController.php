<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\OrderItem;
use Illuminate\Support\Facades\Auth;
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

        $total = 0;
        $itemsData = [];

        foreach ($validated['items'] as $item) {
            $product = Product::find($item['product_id']);

            if (!$product || !$product->exists) {
                return response()->json([
                    'message' => "Produk dengan ID {$item['product_id']} tidak ditemukan.",
                ], 404);
            }

            if ($product->price === null || $product->price <= 0) {
                return response()->json([
                    'message' => "Produk '{$product->name}' tidak memiliki harga valid.",
                ], 422);
            }

            if ($product->stock < $item['quantity']) {
                return response()->json([
                    'message' => "Stok produk '{$product->name}' tidak cukup.",
                ], 422);
            }

            $subtotal = $product->price * $item['quantity'];
            $total += $subtotal;

            $itemsData[] = [
                'product_id' => $product->id,
                'quantity' => $item['quantity'],
                'price' => $product->price,
            ];
        }

        $order = Order::create([
            'user_id' => $user->id,
            'status' => 'pending',
            'total_price' => $total,
        ]);

        foreach ($itemsData as $item) {
            $order->items()->create($item);

            $product = Product::findOrFail($item['product_id']);
            $product->stock -= $item['quantity'];
            $product->save();
        }

        return response()->json([
            'message' => 'Checkout berhasil!',
            'order' => $order->load('items.product')
        ], 201);
    }
}
