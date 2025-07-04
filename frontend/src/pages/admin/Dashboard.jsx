import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FiDollarSign, FiShoppingCart, FiPackage, FiUsers, FiArrowRight, FiAlertCircle } from 'react-icons/fi';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ sales: 0, orders: 0, products: 0, customers: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Menggunakan Promise.all untuk mengambil semua data secara paralel
        const [statsRes, ordersRes, lowStockRes] = await Promise.all([
          axios.get('http://127.0.0.1:8000/api/admin/stats', { withCredentials: true }),
          axios.get('http://127.0.0.1:8000/api/admin/orders/recent', { withCredentials: true }),
          axios.get('http://127.0.0.1:8000/api/admin/products/low-stock', { withCredentials: true }),
        ]);
        
        setStats(statsRes.data);
        setRecentOrders(ordersRes.data);
        setLowStockProducts(lowStockRes.data);

      } catch (error) {
        console.error("Gagal mengambil data dasbor:", error);
        // Set data default jika gagal agar halaman tidak crash
        setStats({ sales: 'N/A', orders: 'N/A', products: 'N/A', customers: 'N/A' });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatCurrency = (amount) => `Rp ${Number(amount).toLocaleString('id-ID')}`;
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  const getStatusBadge = (status) => {
    switch (status) {
        case 'pending': return 'bg-yellow-100 text-yellow-800';
        case 'paid': return 'bg-green-100 text-green-800';
        case 'cancelled': return 'bg-red-100 text-red-800';
        default: return 'bg-slate-100 text-slate-800';
    }
  };

  // Komponen untuk kartu statistik
  const StatCard = ({ icon, title, value, loading }) => (
    <div className="bg-white p-6 rounded-xl shadow-md flex items-center gap-5">
      <div className="bg-indigo-100 text-indigo-600 p-3 rounded-full">
        {React.createElement(icon, { size: 24 })}
      </div>
      <div>
        <p className="text-sm text-slate-500">{title}</p>
        {loading ? (
            <div className="animate-pulse h-7 w-24 bg-slate-200 rounded-md mt-1"></div>
        ) : (
            <p className="text-2xl font-bold text-slate-800">{value}</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-slate-50 min-h-screen p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Dasbor Admin</h1>
          <p className="text-base text-slate-500 mt-1">Selamat datang kembali! Berikut ringkasan toko Anda.</p>
        </header>

        {/* Grid Statistik Utama */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard icon={FiDollarSign} title="Total Penjualan" value={formatCurrency(stats.sales)} loading={loading} />
          <StatCard icon={FiShoppingCart} title="Total Pesanan" value={stats.orders} loading={loading} />
          <StatCard icon={FiPackage} title="Jumlah Produk" value={stats.products} loading={loading} />
          <StatCard icon={FiUsers} title="Jumlah Pelanggan" value={stats.customers} loading={loading} />
        </div>

        {/* Grid Konten Utama (Pesanan Terbaru & Stok Menipis) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Kolom Pesanan Terbaru */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-slate-800">Pesanan Terbaru</h2>
              <Link to="/admin/orders" className="text-sm font-semibold text-indigo-600 hover:underline">Lihat Semua</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <tbody>
                  {loading ? (
                     Array.from({ length: 5 }).map((_, i) => (
                        <tr key={i} className="animate-pulse"><td className="py-3"><div className="h-5 bg-slate-200 rounded-md"></div></td></tr>
                     ))
                  ) : recentOrders.map(order => (
                    <tr key={order.id} className="border-b last:border-0">
                      <td className="py-3 pr-4">
                        <p className="font-semibold text-slate-700">ORDER #{order.id}</p>
                        <p className="text-xs text-slate-500">{order.user?.name || 'Guest'}</p>
                      </td>
                      <td className="py-3 px-4 text-slate-500">{formatDate(order.created_at)}</td>
                      <td className="py-3 px-4"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(order.status)}`}>{order.status}</span></td>
                      <td className="py-3 pl-4 text-right font-semibold text-slate-800">{formatCurrency(order.total_price)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Kolom Stok Menipis */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-slate-800">Stok Menipis</h2>
              <Link to="/admin/koleksi" className="text-sm font-semibold text-indigo-600 hover:underline">Kelola Stok</Link>
            </div>
            <div className="space-y-4">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="animate-pulse flex items-center gap-3"><div className="w-10 h-10 bg-slate-200 rounded-md"></div><div className="flex-1 space-y-2"><div className="h-4 bg-slate-200 rounded"></div><div className="h-3 w-1/2 bg-slate-200 rounded"></div></div></div>
                ))
              ) : lowStockProducts.map(product => (
                <div key={product.id} className="flex items-center gap-4">
                  <img src={`http://127.0.0.1:8000/storage/${product.image}`} alt={product.name} className="w-12 h-12 object-cover rounded-md flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-semibold text-slate-700 text-sm truncate">{product.name}</p>
                    <p className="text-xs text-red-600 font-semibold flex items-center gap-1"><FiAlertCircle size={12}/> Sisa {product.stock} unit</p>
                  </div>
                  <Link to={`/admin/edit/${product.id}`} className="p-2 text-slate-400 hover:text-indigo-600"><FiEdit size={16} /></Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
