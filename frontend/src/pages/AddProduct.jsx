// src/pages/AddProduct.jsx

import React, { useState, useEffect } from 'react'; // <-- 1. Tambahkan useEffect
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // <-- 2. Impor useNavigate jika belum ada

const AddProduct = () => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category_id: '', // <-- 3. Tambahkan category_id di state form
    image: null,
  });

  const [categories, setCategories] = useState([]); // <-- 4. State baru untuk menampung daftar kategori
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  
  const navigate = useNavigate(); // <-- 5. Panggil hook useNavigate

  // <-- 6. useEffect baru untuk mengambil data kategori saat komponen dimuat
  // Ganti useEffect Anda dengan ini
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/categories');
        
        // PENTING: Untuk debugging, lihat struktur asli dari API di console
        console.log('Data mentah dari API:', response.data); 

        // Cek jika respons adalah objek yang memiliki properti 'data' berisi array
        if (response.data && Array.isArray(response.data.data)) {
          // Ini untuk format { data: [...] }
          setCategories(response.data.data); 
        } 
        // Cek jika respons itu sendiri adalah sebuah array
        else if (Array.isArray(response.data)) {
          // Ini untuk format [ ... ]
          setCategories(response.data);
        } else {
          console.error("Data kategori dari API tidak dalam format yang diharapkan (bukan array atau object dengan key 'data').");
        }
        
      } catch (error) {
        console.error('Gagal mengambil kategori:', error);
      }
    };

    fetchCategories();
  }, []); // Array dependensi kosong agar hanya berjalan sekali saat komponen dimuat

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'image' && files.length > 0) {
      const file = files[0];
      setForm({ ...form, image: file });
      setPreview(URL.createObjectURL(file));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setErrors({});

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('description', form.description);
    formData.append('price', form.price);
    formData.append('stock', form.stock);
    formData.append('category_id', form.category_id); // <-- 7. Tambahkan category_id ke FormData
    if (form.image) {
      formData.append('image', form.image);
    }

    try {
      await axios.post('http://127.0.0.1:8000/api/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      // Mengganti pesan dengan navigasi kembali ke halaman utama
      navigate('/'); 

    } catch (error) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors);
        setMessage('❌ Gagal menambahkan produk. Periksa kembali data Anda.');
      } else {
        setMessage('❌ Gagal menambahkan produk. Terjadi kesalahan pada server.');
        console.error(error);
      }
    }
  };

  return (
    <div className="max-w-xl mx-auto p-8 bg-white shadow-lg rounded-2xl my-10">
      <h2 className="text-3xl font-bold mb-6 text-center text-slate-800">Tambah Produk</h2>
      {message && <p className={`mb-4 text-sm text-center p-3 rounded-lg ${errors.length > 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ... input untuk nama, deskripsi, harga ... (tidak ada perubahan) */}
        
        <div>
          <label className="block font-medium text-gray-700">Nama Produk</label>
          <input type="text" name="name" value={form.name} onChange={handleChange} className="w-full border p-2 rounded-lg mt-1" />
          {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name[0]}</p>}
        </div>

        <div>
            <label className="block font-medium text-gray-700">Deskripsi</label>
            <textarea name="description" value={form.description} onChange={handleChange} className="w-full border p-2 rounded-lg mt-1" rows="3"/>
            {errors.description && <p className="text-red-600 text-xs mt-1">{errors.description[0]}</p>}
        </div>

        <div>
            <label className="block font-medium text-gray-700">Harga</label>
            <input type="number" name="price" value={form.price} onChange={handleChange} className="w-full border p-2 rounded-lg mt-1" />
            {errors.price && <p className="text-red-600 text-xs mt-1">{errors.price[0]}</p>}
        </div>
        
        <div>
            <label className="block font-medium text-gray-700">Stok</label>
            <input type="number" name="stock" value={form.stock} onChange={handleChange} className="w-full border p-2 rounded-lg mt-1" />
            {errors.stock && <p className="text-red-600 text-xs mt-1">{errors.stock[0]}</p>}
        </div>

        {/* --- 8. BAGIAN BARU UNTUK DROPDOWN KATEGORI --- */}
        <div>
          <label htmlFor="category_id" className="block font-medium text-gray-700">Kategori</label>
          <select
            name="category_id"
            id="category_id"
            value={form.category_id}
            onChange={handleChange}
            className="w-full border p-2 rounded-lg mt-1 bg-white"
          >
            <option value="" disabled>Pilih Kategori</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.category_id && <p className="text-red-600 text-xs mt-1">{errors.category_id[0]}</p>}
        </div>
        {/* --- AKHIR BAGIAN BARU --- */}

        <div>
          <label className="block font-medium text-gray-700">Gambar Produk</label>
          <input type="file" name="image" accept="image/*" onChange={handleChange} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 mt-1"/>
          {errors.image && <p className="text-red-600 text-xs mt-1">{errors.image[0]}</p>}
          {preview && (
            <img src={preview} alt="Preview" className="mt-4 w-32 h-32 object-cover rounded-lg" />
          )}
        </div>

        <div className="flex justify-end">
            <button type="submit" className="bg-slate-800 text-white px-6 py-2 rounded-lg hover:bg-slate-900 transition">
              Simpan Produk
            </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;