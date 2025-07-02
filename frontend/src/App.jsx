import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'; // Pastikan path ini benar
import Home from './pages/Home'; // Pastikan path ini benar
import AddProduct from './pages/admin/AddProduct'; // Pastikan path ini benar
import AddCategory from './pages/admin/AddCategory'; // Pastikan path ini benar
import EditProduct from './pages/admin/EditProduct'; // Pastikan path ini benar
import Login from './pages/Login'; // Pastikan path ini benar
import Register from './pages/Register'; // Pastikan path ini benar
import Koleksi from './pages/Koleksi'; // Pastikan path ini benar
import KoleksiAdmin from './pages/admin/KoleksiAdmin'; // Pastikan path ini benar
import ProtectedRoute from './components/ProtectedRoute'; // Pastikan path ini benar

const App = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      {/* Navbar diletakkan di luar Routes agar muncul di semua halaman */}
      <Navbar />

      <Routes>
        {/* Rute Umum / Public */}
        <Route path="/" element={<Home />} /> {/* Home sebagai landing page utama */}
        <Route path="/koleksi" element={<Koleksi />} /> {/* Koleksi produk untuk semua user */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rute yang dilindungi untuk Admin */}
        {/* Semua rute di dalam ProtectedRoute hanya bisa diakses oleh user dengan role 'admin' */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          {/* Menggunakan path yang konsisten: /admin/nama-halaman */}
          <Route path="/admin/tambah" element={<AddProduct />} />
          <Route path="/admin/aKoleksi" element={<KoleksiAdmin />} />
          <Route path="/admin/kategori" element={<AddCategory />} />
          <Route path="/admin/edit/:id" element={<EditProduct />} />
          {/* Jika ada halaman admin dashboard, bisa ditambahkan di sini */}
          {/* <Route path="/admin/dashboard" element={<AdminDashboard />} /> */}
        </Route>

        {/* Rute fallback untuk halaman yang tidak ditemukan (404) */}
        <Route path="*" element={<h2 className="text-center text-red-500">Halaman tidak ditemukan</h2>} />
      </Routes>
    </div>
  );
};

export default App;