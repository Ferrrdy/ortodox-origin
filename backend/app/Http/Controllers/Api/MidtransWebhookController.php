<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Midtrans\Config;
use Midtrans\Notification;

class MidtransWebhookController extends Controller
{
    public function handle(Request $request)
    {
        Config::$serverKey = config('services.midtrans.server_key');
        Config::$isProduction = config('services.midtrans.is_production');

        try {
            $notification = new Notification();

            $transactionStatus = $notification->transaction_status;
            $orderIdParts = explode('-', $notification->order_id);
            $orderId = $orderIdParts[0];

            $order = Order::find($orderId);

            if ($transactionStatus == 'settlement' || $transactionStatus == 'capture') {
                $order->update(['status' => 'paid']);
            }

            return response()->json(['status' => 'ok']);

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}