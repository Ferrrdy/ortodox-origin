import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUserCircle } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const Navbar = () => {
  const { isAuthenticated, user } = useAuth();
  const { cartCount } = useCart();

  return (
    <nav className="flex justify-between items-center mb-6 relative px-4">
      {/* Kiri: Logo */}
      <h1 className="text-3xl font-bold text-slate-900">Ortodox</h1>

      {/* Tengah: Menu */}
      <div className="absolute left-1/2 transform -translate-x-1/2 flex gap-x-6">
        <Link to="/" className="text-lg font-medium text-gray-700 hover:text-blue-600">Home</Link>
        <Link to="/user/koleksi" className="text-lg font-medium text-gray-700 hover:text-blue-600">Shop</Link>
        <Link to="/" className="text-lg font-medium text-gray-700 hover:text-blue-600">About Us</Link>
        <Link to="/" className="text-lg font-medium text-gray-700 hover:text-blue-600">Contact</Link>
      </div>

      {/* Kanan: Auth + Cart */}
      <div className="flex items-center font-medium gap-x-6 text-slate-700">
        {!isAuthenticated ? (
          <>
            <Link to="/login" className="hover:text-blue-600 cursor-pointer">Sign In</Link>
            <Link to="/register" className="hover:text-blue-600 cursor-pointer">Sign Up</Link>
          </>
        ) : (
          <>
            {/* Icon Keranjang */}
            <Link to="/cart" className="relative">
              <FaShoppingCart className="text-2xl cursor-pointer" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Icon Profil */}
            <Link to="/profil" className="relative flex items-center gap-x-4">
              <FaUserCircle className="text-2xl cursor-pointer" />
              <span className="text-sm font-medium text-gray-700">{user?.name}</span>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
