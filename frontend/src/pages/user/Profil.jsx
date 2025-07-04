import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiMapPin, FiShield, FiShoppingBag, FiEdit, FiTrash2, FiPlus, FiX, FiSave, FiLogOut } from 'react-icons/fi';

const ProfilPage = () => {
  // ✨ Mengambil user langsung dari context, tidak perlu state 'user' lagi
  const { user, logout, setUser: setAuthUser } = useAuth();
  const navigate = useNavigate();

  // State hanya untuk data yang spesifik untuk halaman ini
  const [addresses, setAddresses] = useState(user?.addresses || []);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Loading untuk data halaman ini (pesanan)
  const [activeTab, setActiveTab] = useState('alamat');

  // State untuk modal form alamat
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [addressLabel, setAddressLabel] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // ✨ useEffect sekarang HANYA mengambil data pesanan
  useEffect(() => {
    // Pastikan user sudah ada dari context sebelum fetch data
    if (user) {
      setIsLoading(true);
      // Set alamat dari user context
      setAddresses(user.addresses || []);

      // Fetch riwayat pesanan
      axios.get('http://localhost:8000/api/orders', { withCredentials: true })
        .then(response => {
          setOrders(response.data || []);
        })
        .catch(error => {
          console.error("Gagal mengambil riwayat pesanan:", error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [user]); // Bergantung pada 'user' dari context

  const handleLogout = () => {
    if (window.confirm('Apakah Anda yakin ingin logout?')) {
      logout();
      navigate('/login');
    }
  };

  // --- Logika untuk Modal Alamat (tidak berubah) ---
  const openAddressModal = (address = null) => {
    if (address) {
      setEditingAddress(address);
      setAddressLabel(address.label);
      setFullAddress(address.full_address);
    } else {
      setEditingAddress(null);
      setAddressLabel('');
      setFullAddress('');
    }
    setShowAddressModal(true);
  };

  const closeAddressModal = () => {
    setShowAddressModal(false);
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const url = editingAddress ? `http://localhost:8000/api/addresses/${editingAddress.id}` : 'http://localhost:8000/api/addresses';
    const method = editingAddress ? 'put' : 'post';

    try {
      const response = await axios[method](url, { label: addressLabel, full_address: fullAddress }, { withCredentials: true });
      const savedAddress = response.data.address;
      
      // Update state alamat
      if (editingAddress) {
        setAddresses(prev => prev.map(addr => addr.id === editingAddress.id ? savedAddress : addr));
      } else {
        setAddresses(prev => [...prev, savedAddress]);
      }

      // ✨ Update user di context agar data alamat sinkron di seluruh aplikasi
      const updatedUser = { ...user, addresses: editingAddress ? addresses.map(addr => addr.id === editingAddress.id ? savedAddress : addr) : [...addresses, savedAddress] };
      if (setAuthUser) {
        setAuthUser(updatedUser);
      }

      closeAddressModal();
    } catch (error) {
      console.error('Gagal menyimpan alamat:', error);
      alert('Gagal menyimpan alamat.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (window.confirm('Yakin ingin menghapus alamat ini?')) {
      try {
        await axios.delete(`http://localhost:8000/api/addresses/${addressId}`, { withCredentials: true });
        const updatedAddresses = addresses.filter(addr => addr.id !== addressId);
        setAddresses(updatedAddresses);

        // Update user di context
        const updatedUser = { ...user, addresses: updatedAddresses };
        if (setAuthUser) {
          setAuthUser(updatedUser);
        }
      } catch (error) {
        console.error('Gagal menghapus alamat:', error);
        alert('Gagal menghapus alamat.');
      }
    }
  };
  
  // -- Fungsi Utilitas (tidak berubah) --
  const getInitials = (name) => !name ? '?' : name.split(' ').map(n => n[0]).slice(0, 2).join('');
  const formatDate = (dateString) => !dateString ? '-' : new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  const formatCurrency = (amount) => `Rp ${Number(amount).toLocaleString('id-ID')}`;
  
  const getStatusBadge = (status) => {
    switch (status) {
        case 'pending': return 'bg-yellow-100 text-yellow-800';
        case 'paid': return 'bg-green-100 text-green-800';
        case 'cancelled': return 'bg-red-100 text-red-800';
        default: return 'bg-slate-100 text-slate-800';
    }
  };

  // Tampilkan loading jika context masih memverifikasi atau halaman ini sedang fetch data
  if (!user) {
    return <div className="flex justify-center items-center h-screen"><p>Mengarahkan...</p></div>;
  }

  return (
    <>
      <div className="mt-15">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-slate-800 mb-8">Akun Saya</h1>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Navigasi Kiri (Tab) */}
            <aside className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-md p-4 sticky top-24">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-indigo-500 rounded-full flex items-center justify-center text-white text-xl font-bold">{getInitials(user?.name)}</div>
                    <div>
                        <p className="font-bold text-slate-800 truncate">{user?.name}</p>
                        <p className="text-sm text-slate-500">Edit Profil</p>
                    </div>
                </div>
                <nav className="space-y-2">
                  <button onClick={() => setActiveTab('alamat')} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left transition ${activeTab === 'alamat' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}><FiMapPin /> Alamat Saya</button>
                  <button onClick={() => setActiveTab('pesanan')} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left transition ${activeTab === 'pesanan' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}><FiShoppingBag /> Pesanan Saya</button>
                  <button onClick={() => setActiveTab('keamanan')} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left transition ${activeTab === 'keamanan' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}><FiShield /> Keamanan</button>
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left text-red-600 hover:bg-red-50 transition"><FiLogOut /> Logout</button>
                </nav>
              </div>
            </aside>

            {/* Konten Kanan (berdasarkan Tab) */}
            <main className="lg:col-span-3">
              <div className="bg-white rounded-xl shadow-md p-6 sm:p-8 min-h-[400px]">
                {/* Tampilkan loading HANYA untuk konten tab, bukan seluruh halaman */}
                {isLoading ? (
                    <div className="flex justify-center items-center h-full"><p>Memuat data...</p></div>
                ) : (
                    <>
                        {/* Konten Alamat */}
                        {activeTab === 'alamat' && (
                            <div>
                                <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-slate-800">Daftar Alamat</h2>
                                <button onClick={() => openAddressModal()} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition text-sm"><FiPlus /> Tambah Baru</button>
                                </div>
                                <div className="space-y-4">
                                {addresses.length > 0 ? addresses.map(addr => (
                                    <div key={addr.id} className="p-4 border border-slate-200 rounded-lg flex justify-between items-start">
                                    <div>
                                        <span className="font-bold text-slate-800 block">{addr.label}</span>
                                        <p className="text-sm mt-1 text-slate-600">{addr.full_address}</p>
                                    </div>
                                    <div className="flex gap-2 flex-shrink-0 ml-2">
                                        <button onClick={() => openAddressModal(addr)} className="p-1 text-slate-500 hover:text-indigo-600"><FiEdit size={16} /></button>
                                        <button onClick={() => handleDeleteAddress(addr.id)} className="p-1 text-slate-500 hover:text-red-600"><FiTrash2 size={16} /></button>
                                    </div>
                                    </div>
                                )) : (
                                    <div className="text-center py-10 px-4 border-2 border-dashed border-slate-200 rounded-lg">
                                    <FiMapPin className="mx-auto text-4xl text-slate-300 mb-3" />
                                    <h3 className="font-semibold text-slate-700">Anda belum punya alamat</h3>
                                    <p className="text-sm text-slate-500 mt-1">Ayo tambahkan alamat pertamamu!</p>
                                    </div>
                                )}
                                </div>
                            </div>
                        )}
                        {/* Konten Pesanan */}
                        {activeTab === 'pesanan' && (
                            <div>
                                <h2 className="text-xl font-bold text-slate-800 mb-6">Riwayat Pesanan</h2>
                                <div className="space-y-4">
                                {orders.length > 0 ? orders.map(order => (
                                    <div key={order.id} className="p-4 border border-slate-200 rounded-lg">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="font-bold text-indigo-600">ORDER #{order.id}</p>
                                                <p className="text-xs text-slate-500">{formatDate(order.created_at)}</p>
                                            </div>
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(order.status)}`}>{order.status}</span>
                                        </div>
                                        <div className="border-t my-3"></div>
                                        <div className="flex justify-between items-center text-sm">
                                            <p className="text-slate-600">Total Pembayaran</p>
                                            <p className="font-bold text-slate-800">{formatCurrency(order.total_price)}</p>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="text-center py-10 px-4 border-2 border-dashed border-slate-200 rounded-lg">
                                        <FiShoppingBag className="mx-auto text-4xl text-slate-300 mb-3" />
                                        <h3 className="font-semibold text-slate-700">Belum ada pesanan</h3>
                                        <p className="text-sm text-slate-500 mt-1">Mulai belanja sekarang untuk melihat riwayat pesanan Anda.</p>
                                    </div>
                                )}
                                </div>
                            </div>
                        )}
                        {/* Konten Keamanan */}
                        {activeTab === 'keamanan' && (
                            <div>
                                <h2 className="text-xl font-bold text-slate-800 mb-6">Keamanan Akun</h2>
                                <div className="flex justify-between items-center p-4 border border-slate-200 rounded-lg">
                                    <div>
                                        <h3 className="font-semibold text-slate-800">Password</h3>
                                        <p className="text-sm text-slate-500">Ubah password Anda secara berkala untuk keamanan.</p>
                                    </div>
                                    <button className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition text-sm">Ubah</button>
                                </div>
                            </div>
                        )}
                    </>
                )}
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Modal untuk Form Alamat */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="flex justify-between items-center p-5 border-b">
              <h3 className="font-bold text-lg text-slate-800">{editingAddress ? 'Edit Alamat' : 'Tambah Alamat Baru'}</h3>
              <button onClick={closeAddressModal} className="text-slate-400 hover:text-slate-600"><FiX size={20} /></button>
            </div>
            <form onSubmit={handleSaveAddress} className="p-5 space-y-4">
              <div>
                <label htmlFor="label" className="block text-sm font-medium text-slate-700 mb-1">Label Alamat</label>
                <input type="text" id="label" value={addressLabel} onChange={(e) => setAddressLabel(e.target.value)} className="w-full p-2 border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" placeholder="Contoh: Rumah, Kantor" required />
              </div>
              <div>
                <label htmlFor="full_address" className="block text-sm font-medium text-slate-700 mb-1">Alamat Lengkap</label>
                <textarea id="full_address" value={fullAddress} onChange={(e) => setFullAddress(e.target.value)} className="w-full p-2 border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" rows="3" placeholder="Masukkan alamat lengkap Anda..." required />
              </div>
              <div className="pt-2">
                <button type="submit" disabled={isSaving} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition disabled:bg-indigo-400">
                  <FiSave size={16} /> {isSaving ? 'Menyimpan...' : 'Simpan Alamat'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfilPage;
