// src/pages/Login.jsx

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from "../api/axiosConfig";
import { useAuth } from "../contexts/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { login } = useAuth(); // Ambil fungsi login dari AuthContext

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setMessage('');
  setErrors({});

  try {
    const response = await apiClient.post('/login', formData);
    const token = response.data.token;
    const user = response.data.user;

    console.log('TOKEN YANG AKAN DISIMPAN:', token);
    console.log("FULL LOGIN RESPONSE:", response.data);

    // ✅ Simpan token ke localStorage sebelum login()
    localStorage.setItem('token', token);

    // ✅ Set user ke context
    login(user);

    setMessage('✅ Login berhasil! Anda akan diarahkan ke halaman utama.');
    setTimeout(() => {
      navigate('/');
    }, 1500);

    } catch (error) {
      if (error.response) {
        if (error.response.status === 422) {
          setErrors(error.response.data.errors);
          setMessage('❌ Login gagal. Periksa kembali data yang Anda masukkan.');
        } else if (error.response.status === 401) {
          setMessage('❌ Email atau password salah.');
        } else {
          setMessage('❌ Terjadi kesalahan pada server. Silakan coba lagi.');
        }
      } else {
        setMessage('❌ Tidak dapat terhubung ke server. Periksa koneksi internet Anda.');
        console.error('Login error:', error);
      }
    }
  };

  // --- Bagian Tampilan (JSX) tidak berubah ---
  return (
    <div className="max-w-md mx-auto p-8 bg-white shadow-lg rounded-2xl my-10">
      <h2 className="text-3xl font-bold mb-6 text-center text-slate-800">Login</h2>
      {message && (
        <p className={`mb-4 text-sm text-center p-3 rounded-lg ${
          (errors && Object.keys(errors).length > 0) || message.includes('❌') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
        }`}>
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block font-medium text-gray-700">Email</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="w-full border p-2 rounded-lg mt-1" />
          {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email[0]}</p>}
        </div>
        <div>
          <label htmlFor="password" className="block font-medium text-gray-700">Password</label>
          <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} className="w-full border p-2 rounded-lg mt-1" />
          {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password[0]}</p>}
        </div>

        <button type="submit" className="w-full bg-slate-800 text-white px-6 py-2 rounded-lg hover:bg-slate-900 transition">
          Login
        </button>
      </form>
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">Belum punya akun? <Link to="/register" className="text-blue-600 hover:underline">Daftar sekarang</Link></p>
      </div>
    </div>
  );
};

export default Login;