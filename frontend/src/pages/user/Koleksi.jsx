import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FiShoppingCart } from 'react-icons/fi';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';

const Koleksi = () => {
  const [products, setProducts] = useState([]);
  const [isProcessing, setIsProcessing] = useState(null); // State untuk loading per tombol
  const { fetchCartCount } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error('Gagal ambil produk:', err));
  }, []);

  const handleAddToCart = async (productId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setIsProcessing(productId); // Tampilkan loading
    try {
      await axios.get('http://localhost:8000/sanctum/csrf-cookie', { withCredentials: true });
      await axios.post('http://localhost:8000/api/cart', {
        product_id: productId,
        quantity: 1
      }, {
        withCredentials: true
      });
      await fetchCartCount();
      alert('Produk berhasil ditambahkan ke keranjang!');
    } catch (err) {
      console.error('Gagal menambahkan ke keranjang:', err.response?.data || err.message);
      alert('Gagal menambahkan ke keranjang.');
    } finally {
        setIsProcessing(null); // Hentikan loading
    }
  };

  /**
   * ✨ FUNGSI DIPERBARUI DENGAN LOGIKA YANG BENAR ✨
   * Langsung membuat order untuk 1 item dan navigasi ke halaman sukses.
   */
  const handleBuyNow = async (productId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setIsProcessing(productId); // Tampilkan loading di tombol yang diklik

    // Siapkan data untuk API checkout, sama seperti di halaman keranjang
    const checkoutData = {
      items: [{
        product_id: productId,
        quantity: 1,
      }],
    };

    try {
      // 1. Langsung panggil API checkout
      const response = await axios.post(
        'http://localhost:8000/api/checkout',
        checkoutData,
        { withCredentials: true }
      );

      // 2. Jika berhasil, dapatkan ID pesanan dari respons
      const orderId = response.data.order.id;

      // 3. Navigasi ke halaman sukses DENGAN membawa ID pesanan
      navigate(`/order-success/${orderId}`);

    } catch (error) {
      console.error('Gagal saat Beli Sekarang:', error.response?.data || error.message);
      alert(`Pembelian Gagal: ${error.response?.data?.message || 'Terjadi kesalahan'}`);
    } finally {
      setIsProcessing(null); // Hentikan loading
    }
  };

  return (
    <section className="min-h-screen px-6 py-12 bg-white text-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10 border-b pb-4 border-slate-200">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Product recommendations</h1>
            <p className="text-base text-slate-500 mt-1">
              Tak perlu repot, cukup pilih produk incaranmu dan nikmati kemudahan berbelanja.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map(product => (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden ring-1 ring-slate-100"
            >
              {product.image && (
                <img
                  src={`http://127.0.0.1:8000/storage/${product.image}`}
                  alt={product.name}
                  className="h-48 w-full object-cover"
                />
              )}

              <div className="p-4 flex flex-col justify-between h-[260px]">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 truncate">{product.name}</h3>
                  <p className="text-gray-500 text-base line-clamp-2">{product.description}</p>
                </div>

                <div className="mt-2">
                  <p className="text-green-600 font-bold text-xl">
                    Rp {Number(product.price).toLocaleString('id-ID')}
                  </p>
                  <p className="text-base text-gray-500">Stok: {product.stock}</p>

                  <div className="mt-3 flex flex-col gap-2">
                    <button
                      onClick={() => handleAddToCart(product.id)}
                      disabled={isProcessing === product.id}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 border rounded-2xl hover:bg-gray-200 transition disabled:opacity-50"
                      title="Tambah ke Keranjang"
                    >
                      <FiShoppingCart size={18} />
                    </button>

                    <button
                      onClick={() => handleBuyNow(product.id)}
                      disabled={isProcessing === product.id}
                      className="w-full px-4 py-2 bg-green-600 text-white rounded-2xl hover:bg-green-700 transition text-base disabled:opacity-50 disabled:cursor-wait"
                    >
                      {isProcessing === product.id ? 'Memproses...' : 'Beli Sekarang'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Koleksi;
