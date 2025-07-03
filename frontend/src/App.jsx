import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AddProduct from './pages/admin/AddProduct';
import AddCategory from './pages/admin/AddCategory';
import EditProduct from './pages/admin/EditProduct';
import Login from './pages/Login';
import Register from './pages/Register';
import Koleksi from './pages/user/Koleksi';
import Cart from './pages/user/Cart';
import Profil from './pages/user/Profil';
import OrderSuccessPage from './pages/user/OrderSuccessPage';
import KoleksiAdmin from './pages/admin/KoleksiAdmin';
import { useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  const { user, userRole } = useAuth();

  console.log("Current user:", user);
  console.log("Current role:", userRole);

  return (
    <div className="container mx-auto px-4 py-6">
      <Navbar />

      <Routes>
        {/* Rute Umum */}
        <Route path="/" element={<Home />} />
        <Route
          path="/user/koleksi"
          element={
            userRole === 'admin'
              ? <Navigate to="/admin/aKoleksi" replace />
              : <Koleksi />
          }
        />
        <Route path="/cart" element={<Cart />} />
        <Route path="/order-success/:orderId" element={<OrderSuccessPage />} />
        <Route path="/profil" element={<Profil />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rute Admin */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin/tambah" element={<AddProduct />} />
          <Route path="/admin/aKoleksi" element={<KoleksiAdmin />} />
          <Route path="/admin/kategori" element={<AddCategory />} />
          <Route path="/admin/edit/:id" element={<EditProduct />} />
        </Route>

        {/* Fallback 404 */}
        <Route path="*" element={<h2 className="text-center text-red-500">Halaman tidak ditemukan</h2>} />
      </Routes>
    </div>
  );
};

export default App;
