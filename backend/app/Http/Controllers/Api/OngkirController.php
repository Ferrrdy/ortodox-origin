<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Address;
use App\Models\Product;
use App\Services\OngkirManualService; 
use Illuminate\Http\Request;

class OngkirController extends Controller{
     public function check(Request $request, OngkirManualService $ongkirService)
    {
        $validated = $request->validate([
            'address_id' => 'required|exists:addresses,id,user_id,'.auth()->id(),
            'items'      => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity'   => 'required|integer|min:1',
        ]);
    try {
            $address = Address::findOrFail($validated['address_id']);
            $productIds = collect($validated['items'])->pluck('product_id');
            $products = Product::whereIn('id', $productIds)->get();
            $totalWeight = 0;
            foreach ($validated['items'] as $item) {
                $product = $products->find($item['product_id']);
                $totalWeight += ($product->weight ?? 1000) * $item['quantity'];
            }
            $shipping = $ongkirService->calculate($address->city_id, $totalWeight);
            return response()->json([$shipping]);

        } catch (\Exception $e) {
            return response()->json(['message' => 'Gagal memproses permintaan ongkir.', 'error' => $e->getMessage()], 500);
        }
    }
}
