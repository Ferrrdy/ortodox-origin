// src/components/ProtectedRoute.jsx

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, userRole } = useAuth();

  if (!isAuthenticated) {
    // Jika belum login, arahkan ke halaman login
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Jika user login tapi tidak memiliki peran yang diizinkan, arahkan ke halaman lain
    // Misalnya, halaman 403 Forbidden atau kembali ke beranda
    alert('Anda tidak memiliki izin untuk mengakses halaman ini.');
    return <Navigate to="/" replace />;
  }

  // Jika sudah login dan memiliki peran yang diizinkan, tampilkan konten anak
  return <Outlet />;
};

export default ProtectedRoute;