<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Address;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AddressController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $addresses = Address::where('user_id', $user->id)->with('city')->latest()->get();

        return response()->json($addresses);
    }

    public function store(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'label'          => 'required|string|max:50',
            'receiver_name'  => 'required|string|max:100',
            'phone'          => 'required|string|max:20',
            'province_id'    => 'required|integer',
            'province_name'  => 'required|string',
            'city_id'        => 'required|integer',
            'city_name'      => 'required|string',
            'district_id'    => 'required|integer',
            'district_name'  => 'required|string',
            'postal_code'    => 'nullable|string',
            'address_detail' => 'required|string',
        ]);

        $address = $user->addresses()->create($validated);

        return response()->json([
            'message' => 'Alamat berhasil ditambahkan.',
            'data'    => $address,
        ], 201);
    }
    public function show($id)
    {
        $user = Auth::user();
        $address = $user->addresses()->with('city')->findOrFail($id);

        return response()->json($address);
    }
    public function update(Request $request, $id)
    {
        $user = Auth::user();
        $address = $user->addresses()->findOrFail($id);
        $validated = $request->validate([
            'label'          => 'required|string|max:50',
            'receiver_name'  => 'required|string|max:100',
            'phone'          => 'required|string|max:20',
            'province_id'    => 'required|integer',
            'province_name'  => 'required|string',
            'city_id'        => 'required|integer',
            'city_name'      => 'required|string',
            'district_id'    => 'required|integer',
            'district_name'  => 'required|string',
            'postal_code'    => 'nullable|string',
            'address_detail' => 'required|string',
        ]);

        $address->update($validated);

        return response()->json([
            'message' => 'Alamat berhasil diperbarui.',
            'data'    => $address->load('city'),
        ]);
    }
    public function destroy($id)
    {
        $user = Auth::user();
        $address = $user->addresses()->findOrFail($id);

        $address->delete();

        return response()->json(['message' => 'Alamat berhasil dihapus.']);
    }
}