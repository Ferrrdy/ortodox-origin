import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiPlus, FiMinus, FiTrash2 } from 'react-icons/fi';
import { useCart } from '../../contexts/CartContext';

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const { fetchCartCount } = useCart();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      await axios.get('http://localhost:8000/sanctum/csrf-cookie', { withCredentials: true });
      const res = await axios.get('http://localhost:8000/api/cart', { withCredentials: true });
      setCart(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch cart data:', err);
    }
  };

  const updateQuantity = async (id, type) => {
    try {
      const url = `http://localhost:8000/api/cart/${id}/${type}`;
      await axios.patch(url, {}, { withCredentials: true });
      await fetchCart();      // Update view
      await fetchCartCount();  // Update badge
    } catch (err) {
      console.error('Failed to update quantity:', err);
    }
  };

  const deleteItem = async (id) => {
    if (!confirm('Are you sure you want to remove this item from the cart?')) return;
    try {
      await axios.delete(`http://localhost:8000/api/cart/${id}`, { withCredentials: true });
      await fetchCart();
      await fetchCartCount();
    } catch (err) {
      console.error('Failed to delete item:', err);
    }
  };

  const totalHarga = cart.reduce((acc, item) => acc + item.quantity * item.product.price, 0);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-gray-500">Loading your cart...</p>
      </div>
    );
  }

  return (
    <div className="">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight"></h1>
        </header>

        {cart.length === 0 ? (
          <div className="text-center bg-white p-12 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-700">Your cart is empty.</h2>
            <p className="text-gray-500 mt-2">Looks like you haven't added anything to your cart yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6 space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 border-b pb-4">Your Items ({cart.length})</h2>
              {cart.map((item) => (
                <div key={item.id} className="flex items-start sm:items-center gap-5">
                  <img
                    src={`http://localhost:8000/storage/${item.product.image}`}
                    alt={item.product.name}
                    className="w-24 h-24 object-cover rounded-lg shadow-sm"
                  />
                  <div className="flex-1 flex flex-col sm:flex-row justify-between items-start sm:items-center">
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
                          aria-label="Decrease quantity"
                        >
                          <FiMinus size={16} />
                        </button>
                        <span className="font-bold text-gray-800 w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 'increment')}
                          className="text-gray-600 hover:text-black transition-colors"
                          aria-label="Increase quantity"
                        >
                          <FiPlus size={16} />
                        </button>
                      </div>
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        aria-label="Remove item"
                      >
                        <FiTrash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
                <h2 className="text-2xl font-bold text-gray-800 border-b pb-4 mb-6">Order Summary</h2>
                <div className="space-y-4 text-gray-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>Rp {Number(totalHarga).toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="font-semibold text-green-600">FREE</span>
                  </div>
                </div>
                <div className="border-t mt-6 pt-6">
                  <div className="flex justify-between items-center text-lg font-bold text-gray-800">
                    <span>Total</span>
                    <span>Rp {Number(totalHarga).toLocaleString('id-ID')}</span>
                  </div>
                </div>
                <button className="w-full mt-6 bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                  Proceed to Checkout
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