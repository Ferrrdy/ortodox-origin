import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit, FiTrash2, FiSearch, FiPackage } from 'react-icons/fi';

const KoleksiAdmin = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Mengambil data produk dari API saat komponen dimuat
  useEffect(() => {
    setLoading(true);
    axios.get('http://127.0.0.1:8000/api/products')
      .then(res => {
        setProducts(res.data);
      })
      .catch(err => console.error('Gagal ambil produk:', err))
      .finally(() => setLoading(false));
  }, []);

  // Fungsi untuk menghapus produk
  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus produk ini? Operasi ini tidak dapat dibatalkan.')) return;

    try {
      // Pastikan Anda mengirim kredensial jika endpoint ini terproteksi
      await axios.delete(`http://127.0.0.1:8000/api/products/${id}`, { withCredentials: true });
      setProducts(products.filter(p => p.id !== id));
      alert('Produk berhasil dihapus.');
    } catch (err) {
      console.error('Gagal hapus produk:', err);
      alert('Gagal menghapus produk. Pastikan Anda memiliki hak akses.');
    }
  };

  // Memoized filtering untuk performa yang lebih baik
  const filteredProducts = useMemo(() => {
    if (!searchTerm) {
      return products;
    }
    return products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  // Helper untuk format tanggal
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric',
  });

  // Helper untuk status stok dengan visual
  const getStockStatus = (stock) => {
    if (stock > 10) {
      return <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">Tersedia</span>;
    }
    if (stock > 0) {
      return <span className="px-2 py-1 text-xs font-semibold text-yellow-800 bg-yellow-100 rounded-full">Menipis</span>;
    }
    return <span className="px-2 py-1 text-xs font-semibold text-red-800 bg-red-100 rounded-full">Habis</span>;
  };

  // Komponen Skeleton untuk loading state
  const TableRowSkeleton = () => (
    <tr className="animate-pulse">
      <td className="p-4"><div className="flex items-center gap-3"><div className="w-12 h-12 bg-slate-200 rounded-md"></div><div className="w-32 h-4 bg-slate-200 rounded"></div></div></td>
      <td className="p-4"><div className="w-20 h-4 bg-slate-200 rounded"></div></td>
      <td className="p-4"><div className="w-24 h-4 bg-slate-200 rounded"></div></td>
      <td className="p-4"><div className="w-20 h-4 bg-slate-200 rounded"></div></td>
      <td className="p-4"><div className="w-20 h-4 bg-slate-200 rounded"></div></td>
      <td className="p-4"><div className="flex gap-2"><div className="w-8 h-8 bg-slate-200 rounded-md"></div><div className="w-8 h-8 bg-slate-200 rounded-md"></div></div></td>
    </tr>
  );

  return (
    <div className="bg-slate-50 min-h-screen p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Halaman */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Manajemen Produk</h1>
            <p className="text-base text-slate-500 mt-1">Kelola semua produk yang ada di toko Anda.</p>
          </div>
          <Link to="/admin/tambah" className="mt-4 sm:mt-0 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2.5 rounded-lg transition flex items-center gap-2 shadow-sm">
            <FiPlus /> Tambah Produk Baru
          </Link>
        </header>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <FiSearch className="h-5 w-5 text-slate-400" />
            </span>
            <input
              type="text"
              placeholder="Cari produk berdasarkan nama..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full max-w-sm pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
          </div>
        </div>

        {/* Tabel Produk */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-600">
              <thead className="text-xs text-slate-700 uppercase bg-slate-100">
                <tr>
                  <th scope="col" className="p-4">Produk</th>
                  <th scope="col" className="p-4">Kategori</th>
                  <th scope="col" className="p-4">Harga</th>
                  <th scope="col" className="p-4">Stok</th>
                  <th scope="col" className="p-4">Tanggal Dibuat</th>
                  <th scope="col" className="p-4">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, index) => <TableRowSkeleton key={index} />)
                ) : filteredProducts.length > 0 ? (
                  filteredProducts.map(product => (
                    <tr key={product.id} className="bg-white border-b hover:bg-slate-50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={`http://127.0.0.1:8000/storage/${product.image}`}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded-md"
                            onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/48x48/e2e8f0/94a3b8?text=!' }}
                          />
                          <span className="font-semibold text-slate-800">{product.name}</span>
                        </div>
                      </td>
                      <td className="p-4">{product.category?.name || 'N/A'}</td>
                      <td className="p-4 font-medium text-slate-800">Rp {Number(product.price).toLocaleString('id-ID')}</td>
                      <td className="p-4">{getStockStatus(product.stock)} ({product.stock})</td>
                      <td className="p-4">{formatDate(product.created_at)}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Link to={`/admin/edit/${product.id}`} className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition" title="Edit Produk">
                            <FiEdit size={16} />
                          </Link>
                          <button onClick={() => handleDelete(product.id)} className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-md transition" title="Hapus Produk">
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-16">
                      <div className="flex flex-col items-center text-slate-500">
                        <FiPackage size={48} className="mb-3" />
                        <h3 className="text-lg font-semibold">Tidak Ada Produk Ditemukan</h3>
                        <p className="text-sm mt-1">Coba ubah kata kunci pencarian Anda atau tambahkan produk baru.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KoleksiAdmin;
