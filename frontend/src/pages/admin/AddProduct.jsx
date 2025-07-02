import React, { useState, useEffect } from 'react';
import apiClient from '../../api/axiosConfig'; // Menggunakan instance Axios terpusat
import { useNavigate, Link } from 'react-router-dom';

const AddProduct = () => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category_id: '',
    image: null,
  });

  const [categories, setCategories] = useState([]);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // useEffect untuk mengambil kategori saat komponen dimuat
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Menggunakan apiClient, otentikasi & base URL sudah diatur terpusat
        const response = await apiClient.get('/categories');
        
        if (response.data && Array.isArray(response.data.data)) {
          setCategories(response.data.data);
        } else {
          console.error("Format data kategori tidak sesuai harapan:", response.data);
          setCategories([]);
        }
      } catch (error) {
        console.error('Gagal mengambil kategori:', error);
        setMessage('❌ Gagal memuat daftar kategori.');
      }
    };
    
    fetchCategories();
  }, []);

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
    formData.append('category_id', form.category_id);
    if (form.image) {
      formData.append('image', form.image);
    }

    try {
      // Menggunakan apiClient, otentikasi & base URL sudah diatur terpusat
      await apiClient.post('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setMessage('✅ Produk berhasil ditambahkan!');
      setForm({
        name: '',
        description: '',
        price: '',
        stock: '',
        category_id: '',
        image: null,
      });
      setPreview(null);
      setErrors({});
      setTimeout(() => navigate('/koleksi'), 1500);

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

  // --- BAGIAN TAMPILAN (JSX) TIDAK DIUBAH SAMA SEKALI ---
  return (
    <div className="max-w-xl mx-auto p-8 bg-white shadow-lg rounded-2xl my-10">
      <h2 className="text-3xl font-bold mb-6 text-center text-slate-800">Tambah Produk Baru</h2>
      {message && (
        <p className={`mb-4 text-sm text-center p-3 rounded-lg ${
          errors && Object.keys(errors).length > 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
        }`}>
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
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

        <div>
          <label htmlFor="category_id" className="block font-medium text-gray-700 mb-1">Kategori</label>
          <div className="flex gap-2 items-center">
            <select
              name="category_id"
              id="category_id"
              value={form.category_id}
              onChange={handleChange}
              className="flex-grow border p-2 rounded-lg bg-white"
            >
              <option value="" disabled>Pilih Kategori</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <Link
              to="/kategori"
              className="bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold px-3 py-2 rounded-lg transition whitespace-nowrap"
            >
              + Kategori Baru
            </Link>
          </div>
          {errors.category_id && <p className="text-red-600 text-xs mt-1">{errors.category_id[0]}</p>}
        </div>

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