<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Address;
use Illuminate\Support\Facades\Auth;

class AddressController extends Controller
{
    // GET /api/addresses
    public function index()
    {
        $user = Auth::user();
        $addresses = Address::where('user_id', $user->id)->get();

        return response()->json([
            'data' => $addresses,
        ]);
    }

    // POST /api/addresses
    public function store(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'label' => 'required|string|max:50',
            'receiver_name' => 'required|string|max:100',
            'phone' => 'required|string|max:20',
            'province' => 'required|string',
            'city' => 'required|string',
            'district' => 'nullable|string',
            'postal_code' => 'nullable|string',
            'address_detail' => 'required|string',
        ]);

        $address = new Address($validated);
        $address->user_id = $user->id;
        $address->save();

        return response()->json([
            'message' => 'Alamat berhasil ditambahkan.',
            'data' => $address,
        ], 201);
    }
    // PUT /api/addresses/{id}
    public function update(Request $request, $id)
    {
        $user = Auth::user();
        $address = Address::where('id', $id)->where('user_id', $user->id)->first();
        if (!$address) {
            throw new \Exception('Alamat tidak ditemukan atau tidak milik user ini.');
        }
        $validated = $request->validate([
            'label' => 'required|string|max:50',
            'receiver_name' => 'required|string|max:100',
            'phone' => 'required|string|max:20',
            'province' => 'required|string',
            'city' => 'required|string',
            'district' => 'nullable|string',
            'postal_code' => 'nullable|string',
            'address_detail' => 'required|string',
        ]);
        $address->update($validated);
        return response()->json([
            'message' => 'Alamat berhasil diperbarui.',
            'data' => $address,
        ]);
    }
    // DELETE /api/addresses/{id}
    public function destroy($id)
    {
        $user = Auth::user();
        $address = Address::where('id', $id)->where('user_id', $user->id)->firstOrFail();
        $address->delete();
        return response()->json([
            'message' => 'Alamat berhasil dihapus.',
        ]);
    }
    // GET /api/addresses/{id}
    public function show($id)
    {
        $user = Auth::user();
        $address = Address::where('id', $id)->where('user_id', $user->id)->firstOrFail();
        return response()->json([
            'data' => $address,
        ]); 
    }
}
