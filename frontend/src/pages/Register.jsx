// src/pages/Register.jsx

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Sesuaikan path

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    // role: 'user', // Jika ingin default user atau bisa dipilih
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
      const response = await axios.post('http://127.0.0.1:8000/api/register', formData);
      setMessage('✅ Registrasi berhasil! Anda akan diarahkan ke halaman utama.');
      console.log('Register successful:', response.data);

      // Setelah register, langsung login pengguna di frontend menggunakan AuthContext
      login(response.data.user); // Simpan data user ke context
      localStorage.setItem('token', response.data.access_token); // Simpan token

      // Redirect ke halaman utama setelah beberapa saat
      setTimeout(() => navigate('/'), 1500);

    } catch (error) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors);
        setMessage('❌ Registrasi gagal. Periksa kembali data Anda.');
      } else {
        setMessage('❌ Terjadi kesalahan saat registrasi.');
        console.error('Registration error:', error);
      }
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-white shadow-lg rounded-2xl my-10">
      <h2 className="text-3xl font-bold mb-6 text-center text-slate-800">Daftar Akun Baru</h2>
      {message && (
        <p className={`mb-4 text-sm text-center p-3 rounded-lg ${
          errors && Object.keys(errors).length > 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
        }`}>
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block font-medium text-gray-700">Nama Lengkap</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="w-full border p-2 rounded-lg mt-1" />
          {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name[0]}</p>}
        </div>
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
        <div>
          <label htmlFor="password_confirmation" className="block font-medium text-gray-700">Konfirmasi Password</label>
          <input type="password" id="password_confirmation" name="password_confirmation" value={formData.password_confirmation} onChange={handleChange} className="w-full border p-2 rounded-lg mt-1" />
        </div>
        {/* Opsional: Input role jika Anda ingin user bisa memilih role saat daftar (biasanya tidak disarankan untuk register umum) */}
        {/* <div>
            <label htmlFor="role" className="block font-medium text-gray-700">Peran</label>
            <select id="role" name="role" value={formData.role} onChange={handleChange} className="w-full border p-2 rounded-lg mt-1">
                <option value="user">Pengguna Biasa</option>
                <option value="admin">Admin</option>
            </select>
        </div> */}

        <button type="submit" className="w-full bg-slate-800 text-white px-6 py-2 rounded-lg hover:bg-slate-900 transition">
          Daftar
        </button>
      </form>
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">Sudah punya akun? <Link to="/login" className="text-blue-600 hover:underline">Login di sini</Link></p>
      </div>
    </div>
  );
};

export default Register;