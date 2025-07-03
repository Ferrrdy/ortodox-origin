// src/contexts/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useCart } from './CartContext';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const { fetchCartCount, setCartCount } = useCart(); // ambil fungsi dari cart

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        fetchCartCount(); // 🔄 Ambil cart count saat user ditemukan di localStorage
      } catch (e) {
        console.error('Gagal parsing user dari localStorage:', e);
        localStorage.removeItem('currentUser');
        setUser({ role: 'guest' });
        setCartCount(0);
      }
    } else {
      setUser({ role: 'guest' });
      setCartCount(0);
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('currentUser', JSON.stringify(userData));
    fetchCartCount(); // ✅ Update cart count saat login
    console.log('User logged in:', userData);
  };

  const logout = () => {
    setUser({ role: 'guest' });
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    setCartCount(0); // ✅ Reset badge saat logout
    console.log('User logged out');
  };

  const value = {
    user,
    userRole: user?.role || 'guest',
    isAuthenticated: !!user && user.role !== 'guest',
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
