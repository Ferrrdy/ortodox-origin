import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiPlus, FiMinus, FiTrash2, FiShoppingCart } from 'react-icons/fi';
import { useCart } from '../../contexts/CartContext';
import { useNavigate, Link } from 'react-router-dom';

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const { fetchCartCount } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  /**
   * Mengambil data keranjang dari server.
   */
  const fetchCart = async () => {
    try {
      await axios.get('http://localhost:8000/sanctum/csrf-cookie', { withCredentials: true });
      const res = await axios.get('http://localhost:8000/api/cart', { withCredentials: true });
      setCart(res.data);
    } catch (err) {
      console.error('Gagal mengambil data keranjang:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Memperbarui kuantitas item di keranjang.
   * @param {number} id - ID item keranjang.
   * @param {string} type - 'increment' atau 'decrement'.
   */
  const updateQuantity = async (id, type) => {
    try {
      const url = `http://localhost:8000/api/cart/${id}/${type}`;
      await axios.patch(url, {}, { withCredentials: true });
      await fetchCart();
      await fetchCartCount();
    } catch (err) {
      console.error('Gagal memperbarui kuantitas:', err);
    }
  };

  /**
   * Menghapus item dari keranjang.
   * @param {number} id - ID item keranjang.
   */
  const deleteItem = async (id) => {
    // Menggunakan modal custom akan lebih baik, tapi confirm() sederhana untuk contoh
    if (!window.confirm('Yakin hapus item ini dari keranjang?')) return;
    try {
      await axios.delete(`http://localhost:8000/api/cart/${id}`, { withCredentials: true });
      await fetchCart();
      await fetchCartCount();
    } catch (err) {
      console.error('Gagal menghapus item:', err);
    }
  };

  /**
   * Menangani proses checkout.
   */
  const handleCheckout = async () => {
    if (cart.length === 0) return;

    setIsCheckingOut(true);

    const checkoutData = {
      items: cart.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity,
      })),
    };

    try {
      const response = await axios.post(
        'http://localhost:8000/api/checkout',
        checkoutData,
        { withCredentials: true }
      );

      // Membersihkan keranjang di backend setelah checkout berhasil
      await axios.delete('http://localhost:8000/api/cart/clear', {
        withCredentials: true,
      });

      // Mengosongkan state keranjang di frontend
      setCart([]);
      await fetchCartCount();

      alert('Checkout berhasil!');
      navigate(`/order-success/${response.data.order.id}`);

    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Terjadi kesalahan saat checkout.';
      console.error('Checkout gagal:', errorMessage);
      alert(`Checkout Gagal: ${errorMessage}`);
    } finally {
      setIsCheckingOut(false);
    }
  };

  const totalHarga = cart.reduce((acc, item) => acc + item.quantity * item.product.price, 0);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-lg text-gray-500">Memuat keranjang Anda...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 tracking-tight mb-8 text-center">Keranjang Belanja</h1>

        {cart.length === 0 ? (
          <div className="text-center bg-white p-12 rounded-lg shadow-md max-w-lg mx-auto">
            <FiShoppingCart className="mx-auto text-gray-300 w-24 h-24 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700">Keranjang Anda kosong.</h2>
            <p className="text-gray-500 mt-2 mb-6">Sepertinya Anda belum menambahkan produk apa pun.</p>
            <Link to="/" className="bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-indigo-700 transition-all">
              Mulai Belanja
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Daftar Item Keranjang */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6 space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 border-b pb-4">Item Anda ({cart.length})</h2>
              {cart.map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-5 border-b pb-6 last:border-b-0 last:pb-0">
                  <img
                    src={`http://localhost:8000/storage/${item.product.image}`}
                    alt={item.product.name}
                    className="w-28 h-28 object-cover rounded-lg shadow-sm flex-shrink-0"
                    onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/112x112/e2e8f0/94a3b8?text=Gambar' }}
                  />
                  <div className="flex-1 flex flex-col sm:flex-row justify-between items-start sm:items-center w-full">
                    <div className="mb-3 sm:mb-0">
                      <h3 className="text-lg font-bold text-gray-800">{item.product.name}</h3>
                      <p className="text-gray-600 font-semibold">
                        Rp {Number(item.product.price).toLocaleString('id-ID')}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3 bg-gray-100 rounded-full px-3 py-1">
                        <button
                          onClick={() => updateQuantity(item.id, 'decrement')}
                          className="text-gray-600 hover:text-black transition-colors"
                          aria-label="Kurangi kuantitas"
                        >
                          <FiMinus size={16} />
                        </button>
                        <span className="font-bold text-gray-800 w-8 text-center" aria-live="polite">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 'increment')}
                          className="text-gray-600 hover:text-black transition-colors"
                          aria-label="Tambah kuantitas"
                        >
                          <FiPlus size={16} />
                        </button>
                      </div>
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        aria-label="Hapus item"
                      >
                        <FiTrash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Ringkasan Pesanan */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
                <h2 className="text-2xl font-bold text-gray-800 border-b pb-4 mb-6">Ringkasan Pesanan</h2>
                <div className="space-y-4 text-gray-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>Rp {Number(totalHarga).toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pengiriman</span>
                    <span className="font-semibold text-green-600">GRATIS</span>
                  </div>
                </div>
                <div className="border-t mt-6 pt-6">
                  <div className="flex justify-between items-center text-lg font-bold text-gray-800">
                    <span>Total</span>
                    <span>Rp {Number(totalHarga).toLocaleString('id-ID')}</span>
                  </div>
                </div>
                <button
                  onClick={handleCheckout}
                  disabled={isCheckingOut || cart.length === 0}
                  className="w-full mt-6 bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:bg-indigo-400 disabled:cursor-not-allowed"
                >
                  {isCheckingOut ? 'Memproses...' : 'Lanjutkan ke Checkout'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
