import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { FiPlus, FiMinus, FiTrash2, FiShoppingCart, FiTag, FiTruck, FiCreditCard, FiMapPin } from 'react-icons/fi';
import { useCart } from '../../contexts/CartContext';
import { useNavigate, Link } from 'react-router-dom';

const CartPage = () => {
  // State untuk data dari API
  const [cart, setCart] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [shippingOptions, setShippingOptions] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  
  // State untuk pilihan pengguna
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [selectedShipping, setSelectedShipping] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);

  // State untuk voucher
  const [voucherCode, setVoucherCode] = useState('');
  const [voucherDiscount, setVoucherDiscount] = useState(0);
  const [voucherError, setVoucherError] = useState('');
  const [isApplyingVoucher, setIsApplyingVoucher] = useState(false);

  // State untuk UI
  const [loading, setLoading] = useState(true);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const { fetchCartCount } = useCart();
  const navigate = useNavigate();

  // Fetch semua data yang dibutuhkan saat halaman dimuat
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        await axios.get('http://localhost:8000/sanctum/csrf-cookie', { withCredentials: true });
        
        // Menggunakan Promise.all untuk fetch data secara paralel
        const [cartRes, addressesRes, shippingRes, paymentRes] = await Promise.all([
          axios.get('http://localhost:8000/api/cart', { withCredentials: true }),
          axios.get('http://localhost:8000/api/addresses', { withCredentials: true }), // API baru
          axios.get('http://localhost:8000/api/shipping-options', { withCredentials: true }), // API baru
          axios.get('http://localhost:8000/api/payment-methods', { withCredentials: true }) // API baru
        ]);

        setCart(cartRes.data);
        setAddresses(addressesRes.data);
        setShippingOptions(shippingRes.data);
        setPaymentMethods(paymentRes.data);

        // Set pilihan default jika memungkinkan
        if (addressesRes.data.length > 0) {
          setSelectedAddressId(addressesRes.data[0].id);
        }

      } catch (err) {
        console.error('Gagal mengambil data checkout:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Kalkulasi harga menggunakan useMemo agar lebih efisien
  const { subtotal, total } = useMemo(() => {
    const subtotal = cart.reduce((acc, item) => acc + item.quantity * item.product.price, 0);
    const shippingCost = selectedShipping ? selectedShipping.price : 0;
    const total = subtotal + shippingCost - voucherDiscount;
    return { subtotal, total };
  }, [cart, selectedShipping, voucherDiscount]);

  const handleApplyVoucher = async () => {
    if (!voucherCode) return;
    setIsApplyingVoucher(true);
    setVoucherError('');
    try {
      const response = await axios.post('http://localhost:8000/api/vouchers/validate', { code: voucherCode }, { withCredentials: true });
      setVoucherDiscount(response.data.discount_amount);
      alert(`Voucher "${voucherCode}" berhasil digunakan!`);
    } catch (error) {
      const message = error.response?.data?.message || 'Voucher tidak valid.';
      setVoucherError(message);
      setVoucherDiscount(0); // Reset diskon jika voucher gagal
    } finally {
      setIsApplyingVoucher(false);
    }
  };

  const handleCheckout = async () => {
    // Validasi sebelum checkout
    if (!selectedAddressId) {
      alert('Silakan pilih alamat pengiriman.');
      return;
    }
    if (!selectedShipping) {
      alert('Silakan pilih metode pengiriman.');
      return;
    }
    if (!selectedPayment) {
      alert('Silakan pilih metode pembayaran.');
      return;
    }

    setIsCheckingOut(true);

    const checkoutData = {
      items: cart.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity,
      })),
      address_id: selectedAddressId,
      shipping_option_id: selectedShipping.id,
      payment_method_id: selectedPayment.id,
      voucher_code: voucherCode,
    };

    try {
      const response = await axios.post('http://localhost:8000/api/checkout', checkoutData, { withCredentials: true });
      await axios.post('http://localhost:8000/api/cart/clear-all', {}, { withCredentials: true });
      setCart([]);
      await fetchCartCount();
      alert('Checkout berhasil!');
      navigate(`/order-success/${response.data.order.id}`);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Terjadi kesalahan saat checkout.';
      console.error('Detail kegagalan checkout:', error.response || error);
      alert(`Checkout Gagal: ${errorMessage}`);
    } finally {
      setIsCheckingOut(false);
    }
  };
  
  // Fungsi lain seperti deleteItem dan updateQuantity tetap sama...

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><p>Mempersiapkan Checkout...</p></div>;
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto"> 
        {cart.length === 0 ? (
          <div className="text-center bg-white p-12 rounded-lg shadow-md max-w-lg mx-auto">
            <FiShoppingCart className="mx-auto text-gray-300 w-24 h-24 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700">Keranjang Anda kosong.</h2>
            <Link to="/" className="mt-4 inline-block bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-indigo-700 transition-all">Mulai Belanja</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Kolom Kiri: Detail Checkout */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6 space-y-8">
              {/* Alamat Pengiriman */}
              <section>
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3 mb-4"><FiMapPin /> Alamat Pengiriman</h2>
                <div className="space-y-3">
                  {addresses.map(addr => (
                    <label key={addr.id} className={`flex items-start p-4 border rounded-lg cursor-pointer transition ${selectedAddressId === addr.id ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-slate-200'}`}>
                      <input type="radio" name="address" value={addr.id} checked={selectedAddressId === addr.id} onChange={() => setSelectedAddressId(addr.id)} className="mt-1" />
                      <div className="ml-4">
                        <p className="font-semibold">{addr.label}</p>
                        <p className="text-sm text-slate-600">{addr.full_address}</p>
                      </div>
                    </label>
                  ))}
                </div>
                <Link to="/profil" className="text-sm text-indigo-600 hover:underline mt-2 inline-block">Kelola Alamat</Link>
              </section>

              {/* Opsi Pengiriman */}
              <section>
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3 mb-4"><FiTruck /> Opsi Pengiriman</h2>
                <div className="space-y-3">
                  {shippingOptions.map(opt => (
                    <label key={opt.id} className={`flex justify-between p-4 border rounded-lg cursor-pointer transition ${selectedShipping?.id === opt.id ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-slate-200'}`}>
                      <div className="flex items-center">
                        <input type="radio" name="shipping" checked={selectedShipping?.id === opt.id} onChange={() => setSelectedShipping(opt)} />
                        <div className="ml-4">
                          <p className="font-semibold">{opt.name}</p>
                          <p className="text-sm text-slate-500">{opt.description}</p>
                        </div>
                      </div>
                      <p className="font-semibold">Rp {opt.price.toLocaleString('id-ID')}</p>
                    </label>
                  ))}
                </div>
              </section>

              {/* Metode Pembayaran */}
              <section>
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3 mb-4"><FiCreditCard /> Metode Pembayaran</h2>
                <div className="space-y-3">
                  {paymentMethods.map(method => (
                     <label key={method.id} className={`flex items-center p-4 border rounded-lg cursor-pointer transition ${selectedPayment?.id === method.id ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-slate-200'}`}>
                      <input type="radio" name="payment" checked={selectedPayment?.id === method.id} onChange={() => setSelectedPayment(method)} />
                      <p className="ml-4 font-semibold">{method.name}</p>
                    </label>
                  ))}
                </div>
              </section>
            </div>

            {/* Kolom Kanan: Ringkasan Pesanan */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
                <h2 className="text-xl font-bold text-slate-800 border-b pb-4 mb-4">Ringkasan Pesanan</h2>
                
                {/* Voucher */}
                <div className="mb-4">
                  <label htmlFor="voucher" className="text-sm font-medium text-slate-700 flex items-center gap-2 mb-2"><FiTag /> Punya Voucher?</label>
                  <div className="flex gap-2">
                    <input type="text" id="voucher" value={voucherCode} onChange={(e) => setVoucherCode(e.target.value.toUpperCase())} placeholder="Masukkan Kode Voucher" className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-indigo-500" />
                    <button onClick={handleApplyVoucher} disabled={isApplyingVoucher} className="px-4 bg-slate-800 text-white rounded-md hover:bg-slate-700 disabled:bg-slate-400">{isApplyingVoucher ? '...' : 'Gunakan'}</button>
                  </div>
                  {voucherError && <p className="text-xs text-red-500 mt-1">{voucherError}</p>}
                </div>

                {/* Rincian Harga */}
                <div className="space-y-2 text-slate-600 border-t pt-4">
                  <div className="flex justify-between"><span>Subtotal</span><span className="font-medium">Rp {subtotal.toLocaleString('id-ID')}</span></div>
                  <div className="flex justify-between"><span>Pengiriman</span><span className="font-medium">Rp {(selectedShipping?.price || 0).toLocaleString('id-ID')}</span></div>
                  {voucherDiscount > 0 && <div className="flex justify-between text-green-600"><span>Diskon Voucher</span><span className="font-medium">- Rp {voucherDiscount.toLocaleString('id-ID')}</span></div>}
                </div>
                
                {/* Total */}
                <div className="border-t mt-4 pt-4">
                  <div className="flex justify-between items-center text-lg font-bold text-slate-800"><span>Total</span><span>Rp {total.toLocaleString('id-ID')}</span></div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={isCheckingOut || !selectedAddressId || !selectedShipping || !selectedPayment}
                  className="w-full mt-6 bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition shadow-lg disabled:bg-indigo-300 disabled:cursor-not-allowed"
                >
                  {isCheckingOut ? 'Memproses...' : 'Buat Pesanan'}
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
