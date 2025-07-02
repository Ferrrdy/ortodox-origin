import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="flex justify-between items-center mb-6 relative px-4">
      {/* Kiri: Logo */}
      <h1 className="text-3xl font-bold text-slate-900">Ortodox</h1>

      {/* Tengah: Menu */}
      <div className="absolute left-1/2 transform -translate-x-1/2 flex gap-x-6">
        <Link to="/" className="text-lg font-medium text-gray-700 hover:text-blue-600">Home</Link>
        <Link to="/" className="text-lg font-medium text-gray-700 hover:text-blue-600">Shop</Link>
        <Link to="/" className="text-lg font-medium text-gray-700 hover:text-blue-600">About Us</Link>
        <Link to="/" className="text-lg font-medium text-gray-700 hover:text-blue-600">Contact</Link>
      </div>

      {/* Kanan: Auth + Cart */}
      <div className="flex items-center gap-4 text-slate-700">
        {isAuthenticated ? (
          <>
            <span className="text-sm font-medium text-gray-700">{user?.name}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-3 py-1 rounded-3xl hover:bg-red-600 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-blue-600 cursor-pointer">Sign In</Link>
            <Link to="/register" className="hover:text-blue-600 cursor-pointer">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
