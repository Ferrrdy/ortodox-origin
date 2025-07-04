import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useCart } from './CartContext'; // Pastikan path ini benar

// 1. Buat Context
const AuthContext = createContext(null);

// 2. Buat Provider (Komponen yang akan membungkus aplikasi Anda)
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true); // State untuk loading verifikasi awal
  const { fetchCartCount, setCartCount } = useCart();

  // useEffect ini akan berjalan sekali saat aplikasi pertama kali dimuat
  // untuk memeriksa apakah ada sesi login yang valid di server.
  useEffect(() => {
    const verifyUser = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/profile', {
          withCredentials: true,
        });
        
        if (response.data) {
          // Jika berhasil, set user dan role dari data yang diterima
          setUser(response.data);
          setUserRole(response.data.role);
          fetchCartCount();
        }
      } catch (error) {
        console.log('Sesi tidak ditemukan, pengguna belum login.');
        setUser(null);
        setUserRole(null);
        setCartCount(0);
      } finally {
        setLoading(false);
      }
    };
    
    verifyUser();
  }, [fetchCartCount, setCartCount]);

  /**
   * ✨ INI PERUBAHAN UTAMANYA ✨
   * Fungsi login sekarang langsung menyetel user DAN userRole dari satu objek data.
   * Ini memastikan semua state langsung sinkron saat login.
   */
  const login = (userData) => {
    setUser(userData);
    setUserRole(userData.role); // Langsung ambil peran dari objek userData
    fetchCartCount();
    console.log('User logged in, role set to:', userData.role);
  };

  // Fungsi untuk logout
  const logout = async () => {
    try {
      await axios.post('http://localhost:8000/api/logout', {}, {
        withCredentials: true,
      });
    } catch (error) {
      console.error("Logout di server gagal, tapi tetap melanjutkan di frontend:", error);
    } finally {
      setUser(null);
      setUserRole(null);
      setCartCount(0);
    }
  };

  // Nilai yang akan dibagikan ke seluruh komponen
  const value = {
    user,
    userRole,
    isAuthenticated: !!user, 
    loading,
    login,
    logout,
    setUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {/* Tampilkan anak-anak (aplikasi Anda) hanya setelah proses verifikasi selesai */}
      {!loading && children}
    </AuthContext.Provider>
  );
};

// 3. Buat custom hook untuk mempermudah penggunaan context
export const useAuth = () => {
  return useContext(AuthContext);
};
