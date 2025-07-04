<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    // Method untuk mengambil statistik utama
    public function getStats()
    {
        $stats = [
            'sales' => Order::where('status', 'paid')->sum('total_price'),
            'orders' => Order::count(),
            'products' => Product::count(),
            'customers' => User::where('role', 'user')->count(),
        ];
        return response()->json($stats);
    }

    // Method untuk mengambil pesanan terbaru
    public function getRecentOrders()
    {
        $orders = Order::with('user:id,name') // Hanya ambil ID dan nama user
            ->latest() // Urutkan dari yang terbaru
            ->take(5) // Ambil 5 pesanan terakhir
            ->get();
        return response()->json($orders);
    }

    // Method untuk mengambil produk dengan stok menipis
    public function getLowStockProducts()
    {
        $products = Product::where('stock', '<=', 10) // Stok 10 atau kurang
            ->orderBy('stock', 'asc') // Urutkan dari stok paling sedikit
            ->take(5) // Ambil 5 produk
            ->get();
        return response()->json($products);
    }
}