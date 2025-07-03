import React from 'react';
import apiClient from '../api/axiosConfig';

const ProductCard = ({ product }) => {
  const handleAddToCart = async () => {
    try {
      await apiClient.post('/cart', {
        product_id: product.id,
        quantity: 1
      });
      alert('Produk berhasil ditambahkan ke keranjang!');
    } catch (error) {
      console.error('Gagal menambahkan ke keranjang', error);
      alert('Gagal menambahkan ke keranjang.');
    }
  };

  return (
    <div className="border p-4 rounded shadow hover:shadow-lg transition">
      <img src={product.image_url} alt={product.name} className="w-full h-40 object-cover rounded" />
      <h3 className="mt-2 font-semibold text-lg">{product.name}</h3>
      <p className="text-gray-600">Rp {product.price}</p>
      <button
        onClick={handleAddToCart}
        className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Tambah ke Keranjang
      </button>
    </div>
  );
};

export default ProductCard;
