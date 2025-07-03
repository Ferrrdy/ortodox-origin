// src/pages/admin/AddCategory.jsx

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const AddCategory = () => {
  const [categoryName, setCategoryName] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setErrors({});

    try {
      // Asumsi API endpoint untuk menambah kategori adalah /api/categories
      await axios.post('http://127.0.0.1:8000/api/categories', { name: categoryName });
      setMessage('✅ Kategori berhasil ditambahkan!');
      setCategoryName(''); // Kosongkan input
      setErrors({}); // Bersihkan error

      // Opsional: Kembali ke halaman tambah produk atau daftar kategori setelah beberapa detik
      setTimeout(() => navigate('/admin/tambah'), 1500); // Kembali ke form AddProduct

    } catch (error) {
      if (error.response && error.response.status === 422) {
        // Error validasi dari backend
        setErrors(error.response.data.errors);
        setMessage('❌ Gagal menambahkan kategori. Periksa kembali nama kategori.');
      } else {
        // Error lain (misal: server down)
        setMessage('❌ Gagal menambahkan kategori. Terjadi kesalahan pada server.');
        console.error('Error adding category:', error);
      }
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-white shadow-lg rounded-2xl my-10">
      <h2 className="text-3xl font-bold mb-6 text-center text-slate-800">Tambah Kategori Baru</h2>
      {message && (
        <p className={`mb-4 text-sm text-center p-3 rounded-lg ${
          errors && Object.keys(errors).length > 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
        }`}>
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="categoryName" className="block font-medium text-gray-700">Nama Kategori</label>
          <input
            type="text"
            id="categoryName"
            name="categoryName"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            className="w-full border p-2 rounded-lg mt-1"
          />
          {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name[0]}</p>}
        </div>

        <div className="flex justify-end">
          <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition">
            Simpan Kategori
          </button>
        </div>
      </form>
      <div className="mt-6 text-center">
        <Link to="/admin/tambah" className="text-blue-600 hover:underline text-sm">
          &larr; Kembali ke Tambah Produk
        </Link>
      </div>
    </div>
  );
};

export default AddCategory;