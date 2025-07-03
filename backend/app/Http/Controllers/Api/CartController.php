<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Product;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function index(Request $request)
    {
        $carts = Cart::with('product')
            ->where('user_id', $request->user()->id)
            ->get();

        return response()->json($carts);
    }

 public function store(Request $request)
{
    $validated = $request->validate([
        'product_id' => 'required|exists:products,id',
        'quantity' => 'required|integer|min:1',
    ]);

    $cart = Cart::where('user_id', $request->user()->id)
                ->where('product_id', $validated['product_id'])
                ->first();

    if ($cart) {
        $cart->quantity += $validated['quantity'];
        $cart->save();
    } else {
        $cart = Cart::create([
            'user_id' => $request->user()->id,
            'product_id' => $validated['product_id'],
            'quantity' => $validated['quantity'],
        ]);
    }

    return response()->json([
        'message' => 'Berhasil ditambahkan ke keranjang',
        'data' => $cart
    ]);
}

public function update(Request $request, $id)
{
    $cartItem = Cart::where('id', $id)
                    ->where('user_id', auth()->id())
                    ->firstOrFail();

    $request->validate([
        'quantity' => 'required|integer|min:1'
    ]);

    $cartItem->quantity = $request->quantity;
    $cartItem->save();

    return response()->json([
        'message' => 'Jumlah produk diperbarui',
        'data' => $cartItem
    ]);
}
public function decrement($id)
{
    $cart = Cart::where('id', $id)->where('user_id', auth()->id())->firstOrFail();

    if ($cart->quantity > 1) {
        $cart->quantity -= 1;
        $cart->save();
    } else {
        // Jika quantity sudah 1, hapus item
        $cart->delete();
        return response()->json([
            'message' => 'Item keranjang dihapus karena quantity sudah 1.'
        ]);
    }

    return response()->json([
        'message' => 'Quantity dikurangi 1',
        'data' => $cart
    ]);
}
public function increment($id)
{
    $cart = Cart::where('id', $id)->where('user_id', auth()->id())->firstOrFail();

    $cart->quantity += 1;
    $cart->save();

    return response()->json([
        'message' => 'Quantity ditambah 1',
        'data' => $cart
    ])->setStatusCode(200, 'OK');
}       

    public function destroy(Request $request, $id)
    {
        $cart = Cart::where('id', $id)
                    ->where('user_id', $request->user()->id)
                    ->firstOrFail();

        $cart->delete();

        return response()->json(['message' => 'Produk dihapus dari keranjang']);
    }

// CartController.php
public function clearAll()
{
    $user = auth()->user();

    // Menghapus semua item di keranjang user
    \App\Models\Cart::where('user_id', $user->id)->delete();

    return response()->json(['message' => 'Keranjang berhasil dikosongkan']);
}

    
}
