<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Menampilkan semua produk + relasi kategori
        return Product::with('category')->get();
    }

    /**
     * Store a newly created resource in storage.
     */
public function store(Request $request)
{
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'description' => 'nullable|string',
        'price' => 'required|numeric',
        'stock' => 'nullable|integer',
        'weight' => 'required|integer|min:1', // berat dalam gram
        'category_id' => 'required|exists:categories,id',
        'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        
    ]);

    // 💡 LOGIKA YANG PERLU DITAMBAHKAN
    // Cek apakah ada file gambar yang di-upload
    if ($request->hasFile('image')) {
        // Simpan gambar secara permanen dan dapatkan path-nya
        $path = $request->file('image')->store('products', 'public');
        
        // Ganti isi 'image' di dalam array $validated dengan path yang baru
        $validated['image'] = $path;
    }

    // Buat produk dengan data yang sudah divalidasi (dan path gambar yang sudah benar)
    $product = Product::create($validated);

    return response()->json([
        'message' => 'Produk berhasil ditambahkan',
        'data' => $product
    ], 201);
}

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return Product::with('category')->findOrFail($id);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric',
            'stock' => 'nullable|integer',
            'category_id' => 'required|exists:categories,id',
            'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('products', 'public');
        }

        $product->update($validated);

        return response()->json([
            'message' => 'Produk berhasil diperbarui',
            'data' => $product
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $product = Product::findOrFail($id);
        $product->delete();

        return response()->json([
            'message' => 'Produk berhasil dihapus'
        ]);
    }
}
