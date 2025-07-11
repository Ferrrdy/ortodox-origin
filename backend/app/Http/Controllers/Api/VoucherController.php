<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Voucher; 
use Illuminate\Http\Request;

class VoucherController extends Controller
{
    public function check(Request $request)
    { 
        $validated = $request->validate([
            'code' => 'required|string',
        ]);

        $voucher = Voucher::where('code', $validated['code'])->first();

        if(!$voucher || ($voucher->expires_at && $voucher->expires_at->isPast())){
            return response()->json(['message' => 'Kode Voucher tidak valid atau sudah kadaluarsa.'], 404);             
        }
        return response()->json($voucher);
    }
}
