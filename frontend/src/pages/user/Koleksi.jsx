import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { FiShoppingCart, FiZap, FiChevronDown, FiAlertTriangle, FiSearch, FiPackage, FiStar, FiMapPin } from 'react-icons/fi';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';

const Koleksi = () => {
  // State untuk data dari API
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  
  // State untuk UI & interaksi
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingProductId, setProcessingProductId] = useState(null);
  
  // State untuk filter, sorting, dan search
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortOption, setSortOption] = useState('latest');
  const [searchTerm, setSearchTerm] = useState('');

  // State untuk paginasi
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12; // Jumlah produk per halaman

  const { fetchCartCount } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    setError(null);
    const fetchInitialData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          axios.get('http://127.0.0.1:8000/api/products'),
          axios.get('http://127.0.0.1:8000/api/categories')
        ]);
        
        if (Array.isArray(productsRes.data)) setProducts(productsRes.data);
        if (Array.isArray(categoriesRes.data)) setCategories(categoriesRes.data);

      } catch (err) {
        console.error('Gagal mengambil data:', err);
        setError('Gagal memuat data. Silakan periksa koneksi atau API Anda.');
      } finally {
        setTimeout(() => setLoading(false), 500);
      }
    };
    fetchInitialData();
  }, []);

  // Logika untuk memfilter, mencari, dan mengurutkan produk
  const processedProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];
    let processed = [...products];
    if (searchTerm) {
      processed = processed.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    if (selectedCategory !== 'all') {
      processed = processed.filter(p => p.category_id === selectedCategory);
    }
    switch (sortOption) {
      case 'price_asc':
        processed.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        processed.sort((a, b) => b.price - a.price);
        break;
      case 'latest':
      default:
        processed.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
    }
    return processed;
  }, [products, selectedCategory, sortOption, searchTerm]);

  // Logika untuk paginasi
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * productsPerPage;
    return processedProducts.slice(startIndex, startIndex + productsPerPage);
  }, [processedProducts, currentPage, productsPerPage]);

  const totalPages = Math.ceil(processedProducts.length / productsPerPage);

  const handleAction = async (productId, type = 'cart') => {
    if (!isAuthenticated) { navigate('/login'); return; }
    setProcessingProductId(productId);
    try {
      if (type === 'cart') {
        await axios.post('http://localhost:8000/api/cart', { product_id: productId, quantity: 1 }, { withCredentials: true });
        await fetchCartCount();
        alert('Produk berhasil ditambahkan ke keranjang!');
      } else {
        const response = await axios.post('http://localhost:8000/api/checkout', { items: [{ product_id: productId, quantity: 1 }] }, { withCredentials: true });
        navigate(`/order-success/${response.data.order.id}`);
      }
    } catch (error) {
      alert(`Aksi gagal: ${error.response?.data?.message || 'Terjadi kesalahan.'}`);
    } finally {
      setProcessingProductId(null);
    }
  };

  const SkeletonCard = () => (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
      <div className="h-48 w-full bg-slate-200" />
      <div className="p-4 space-y-3">
        <div className="h-4 w-full bg-slate-200 rounded-md" />
        <div className="h-4 w-3/4 bg-slate-200 rounded-md" />
        <div className="h-6 w-1/2 bg-slate-200 rounded-md mt-2" />
        <div className="h-4 w-1/4 bg-slate-200 rounded-md" />
      </div>
    </div>
  );

  return (
    <section className="mt-15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Banner */}
        <div className="relative rounded-2xl overflow-hidden mb-12 shadow-lg">
            <img src="https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?q=80&w=2070&auto=format&fit=crop" alt="Hero Banner" className="w-full h-64 object-cover"/>
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/70 to-slate-900/20 flex items-center p-8 md:p-12">
                <div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">Koleksi Musim Panas</h1>
                    <p className="text-lg text-slate-200 mt-3 max-w-lg">Diskon hingga 30% untuk semua item pilihan. Jangan sampai ketinggalan!</p>
                </div>
            </div>
        </div>

        {/* Panel Kontrol (Filter, Search, Sort) */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-8 sticky top-5 z-30">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
                <div className="relative lg:col-span-2">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3"><FiSearch className="h-5 w-5 text-slate-400" /></span>
                    <input type="text" placeholder="Cari di Ortodox..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-slate-200 bg-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"/>
                </div>
                <div className="relative">
                    <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full appearance-none bg-white border border-slate-200 rounded-lg pl-4 pr-8 py-2.5 text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-indigo-500">
                        <option value="all">Semua Kategori</option>
                        {Array.isArray(categories) && categories.map(category => (
                            <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                    </select>
                    <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
                </div>
                <div className="relative">
                    <select value={sortOption} onChange={(e) => setSortOption(e.target.value)} className="w-full appearance-none bg-white border border-slate-200 rounded-lg pl-4 pr-8 py-2.5 text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-indigo-500">
                        <option value="latest">Paling Sesuai</option>
                        <option value="price_asc">Harga Terendah</option>
                        <option value="price_desc">Harga Tertinggi</option>
                    </select>
                    <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
                </div>
            </div>
        </div>

        {error && (
            <div className="text-center py-10 bg-red-50 text-red-700 rounded-xl shadow-md"><FiAlertTriangle className="mx-auto text-3xl mb-2" /><h3 className="text-xl font-semibold">{error}</h3></div>
        )}

        {/* Grid Produk */}
        <main>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {loading ? (
              Array.from({ length: 10 }).map((_, index) => <SkeletonCard key={index} />)
            ) : !error && paginatedProducts.length === 0 ? (
              <div className="col-span-full text-center py-20 bg-white rounded-xl shadow-md">
                <FiPackage className="mx-auto text-5xl text-slate-300 mb-4" />
                <h3 className="text-xl font-semibold text-slate-600">Tidak Ada Produk Ditemukan</h3>
                <p className="text-slate-500 mt-2">Coba ubah filter atau kata kunci pencarian Anda.</p>
              </div>
            ) : (
              !error && paginatedProducts.map(product => (
                <div key={product.id} className="bg-white rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden group">
                  {/* Link untuk ke halaman detail produk */}
                  <Link to={`/products/${product.id}`} className="relative">
                    <img src={`http://127.0.0.1:8000/storage/${product.image}`} alt={product.name} className="h-48 w-full object-cover" onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/400x400/e2e8f0/94a3b8?text=Gambar' }} />
                  </Link>
                  <div className="p-4 flex flex-col justify-between flex-grow">
                    <div>
                      <h3 className="font-semibold text-slate-800 text-sm line-clamp-2 h-10">{product.name}</h3>
                      <p className="text-lg font-extrabold text-slate-800 mt-2">Rp {Number(product.price).toLocaleString('id-ID')}</p>
                    </div>
                    <div className="text-xs text-slate-500 mt-2">
                        <div className="flex items-center gap-1">
                            <FiStar className="text-amber-400 fill-current" size={14}/>
                            <span>4.8</span>
                            <span className="mx-1">|</span>
                            <span>Terjual 100+</span>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                            <FiMapPin size={14}/>
                            <span>Jakarta Barat</span>
                        </div>
                    </div>
                  </div>
                  {/* Tombol Aksi di bagian bawah kartu */}
                  <div className="p-4 pt-0 mt-2">
                    <button 
                        onClick={() => handleAction(product.id, 'cart')}
                        disabled={processingProductId === product.id || product.stock === 0}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 text-sm font-semibold rounded-lg hover:bg-indigo-100 transition-colors disabled:opacity-50"
                    >
                        <FiShoppingCart size={16}/>
                        Tambah Keranjang
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>

        {/* Paginasi */}
        {!loading && !error && totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-12">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
                    <button 
                        key={pageNumber} 
                        onClick={() => setCurrentPage(pageNumber)}
                        className={`h-10 w-10 rounded-lg font-semibold transition ${currentPage === pageNumber ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-slate-700 hover:bg-slate-200'}`}
                    >
                        {pageNumber}
                    </button>
                ))}
            </div>
        )}
      </div>
    </section>
  );
};

export default Koleksi;
