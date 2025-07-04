import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
// ✨ Ikon FiLogIn tidak lagi diperlukan
import { FiShoppingCart, FiUser, FiGrid } from 'react-icons/fi';

const Navbar = () => {
  const { user, userRole } = useAuth();
  const { cartCount } = useCart();

  const activeLinkClass = "text-indigo-600 font-semibold";
  const defaultLinkClass = "text-slate-600 hover:text-indigo-600 transition-colors";

  return (
    // ✨ Menambahkan styling agar navbar terlihat lebih modern
    <header className="">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-slate-800">
              Ortodox
            </Link>
          </div>

          {/* Navigasi Utama (Desktop) */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <NavLink to="/" className={({ isActive }) => isActive ? activeLinkClass : defaultLinkClass}>Home</NavLink>
            <NavLink to="/user/koleksi" className={({ isActive }) => isActive ? activeLinkClass : defaultLinkClass}>Shop</NavLink>
            
            {userRole === 'admin' && (
              <NavLink 
                to="/admin/dashboard" 
                className={({ isActive }) => `flex items-center gap-1 ${isActive ? activeLinkClass : defaultLinkClass}`}
              >
                <FiGrid size={16} />
                Dashboard
              </NavLink>
            )}
            
            <NavLink to="/about" className={({ isActive }) => isActive ? activeLinkClass : defaultLinkClass}>About Us</NavLink>
            <NavLink to="/contact" className={({ isActive }) => isActive ? activeLinkClass : defaultLinkClass}>Contact</NavLink>
          </div>

          {/* Ikon Aksi (Kanan) */}
          <div className="flex items-center gap-4">
            <Link to="/cart" className="relative text-slate-600 hover:text-indigo-600 transition-colors">
              <FiShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                  {cartCount}
                </span>
              )}
            </Link>

            <div className="w-px h-6 bg-slate-200" />

            {/* --- ✨ LOGIKA PROFIL DIPERBARUI DI SINI ✨ --- */}
            <Link 
              // Jika user ada, arahkan ke /profil. Jika tidak, arahkan ke /login.
              to={user ? "/profil" : "/login"} 
              className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition-colors"
            >
              <FiUser size={22} />
              <span className="hidden sm:inline font-medium">
                {/* Jika user ada, tampilkan nama. Jika tidak, tampilkan "Profil". */}
                {user ? user.name : "Profil"}
              </span>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
