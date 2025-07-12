<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\OrderItemController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\AddressController;
use App\Http\Middleware\IsAdmin;
use App\Http\Controllers\Api\OngkirController;
use App\Http\Controllers\Api\VoucherController;
use App\Http\Controllers\Api\MidtransWebhookController;



/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Tes koneksi
Route::get('/hello', function () {
    return response()->json(['message' => 'Halo dari Laravel!']);
});

// 🔐 Auth
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', function (Request $request) {
        $request->user()->tokens()->delete();
        return response()->json(['message' => 'Logout berhasil']);
    });

    Route::get('/profile', function (Request $request) {
        return $request->user();
    });

    // ✅ Admin only
    Route::middleware('is.admin')->group(function () {
        Route::post('/products', [ProductController::class, 'store']);
        Route::put('/products/{id}', [ProductController::class, 'update']);
        Route::delete('/products/{id}', [ProductController::class, 'destroy']);
        Route::post('/categories', [CategoryController::class, 'store']);
    });
});
// 🔓 Public (semua bisa lihat)
Route::get('/products',        [ProductController::class, 'index']);
Route::get('/products/{id}',   [ProductController::class, 'show']);
Route::apiResource('categories', CategoryController::class)->only(['index', 'show']);
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/cart', [CartController::class, 'index']);
    Route::post('/cart', [CartController::class, 'store']);
    Route::put('/cart/{id}', [CartController::class, 'update']); // ini untuk update
    Route::delete('/cart/{id}', [CartController::class, 'destroy']);
    Route::patch('/cart/{id}/decrement', [CartController::class, 'decrement']);
    Route::patch('/cart/{id}/increment', [CartController::class, 'increment']);
    Route::post('/cart/clear-all', [CartController::class, 'clearAll']);
    Route::delete('/cart/item/{id}', [CartController::class, 'destroy']); 
});
Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/orders/checkout', [OrderController::class, 'checkout']);
    Route::get('/orders', [OrderController::class, 'index']); // optional
    Route::get('/orders/{id}', [OrderController::class, 'show']);
});


Route::middleware(['auth:sanctum', 'is.admin'])->prefix('admin')->group(function () {
    // Rute untuk Dasbor
    Route::get('/stats', [DashboardController::class, 'getStats']);
    Route::get('/orders/recent', [DashboardController::class, 'getRecentOrders']);
    Route::get('/products/low-stock', [DashboardController::class, 'getLowStockProducts']);
});
// alamat
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/addresses', [AddressController::class, 'index']);
    Route::post('/addresses', [AddressController::class, 'store']);
    Route::put('/addresses/{id}', [AddressController::class, 'update']);
    Route::delete('/addresses/{id}', [AddressController::class, 'destroy']);
    Route::get('/addresses/{id}', [AddressController::class, 'show']);
});

// Ongkir
Route::prefix('ongkir')->group(function () {
    Route::get('/provinces', [OngkirController::class, 'provinces']);
    Route::get('/cities', [OngkirController::class, 'cities']);
    Route::post('/cost', [OngkirController::class, 'cost']);
});
// Order Items
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/order-items', [OrderItemController::class, 'index']);
    Route::get('/order-items/{id}', [OrderItemController::class, 'show']);
    Route::post('/order-items', [OrderItemController::class, 'store']);
    Route::put('/order-items/{id}', [OrderItemController::class, 'update']);
    Route::delete('/order-items/{id}', [OrderItemController::class, 'destroy']);
});
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/orders/calculate', [OrderController::class, 'calculate']);
});
Route::middleware(['auth:sanctum', 'is.admin'])->prefix('admin')->group(function () {
    // Rute untuk Dasbor
    Route::get('/stats', [DashboardController::class, 'getStats']);
    Route::get('/orders/recent', [DashboardController::class, 'getRecentOrders']);
    Route::get('/products/low-stock', [DashboardController::class, 'getLowStockProducts']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/ongkir/check', [OngkirController::class, 'check']);
    Route::post('/checkout', [OrderController::class, 'checkout']);
    // ... rute lain yang butuh otentikasi ...
    Route::post('/vouchers/check', [VoucherController::class, 'check'])->middleware('auth:sanctum');
    Route::post('/orders/{order}/pay', [OrderController::class, 'createPayment'])->middleware('auth:sanctum');
    Route::post('/midtrans/notification', [MidtransWebhookController::class, 'handle']);
});
