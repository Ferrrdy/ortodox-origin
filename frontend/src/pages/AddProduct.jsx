import React, { useState } from 'react';
import axios from 'axios';

const AddProduct = () => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    image: null,
  });

  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'image' && files.length > 0) {
      setForm({ ...form, image: files[0] });
      setPreview(URL.createObjectURL(files[0])); // untuk preview
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
    if (form.image) {
      formData.append('image', form.image);
    }

    try {
      await axios.post('http://127.0.0.1:8000/api/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setMessage('✅ Produk berhasil ditambahkan!');
      setForm({ name: '', description: '', price: '', stock: '', image: null });
      setPreview(null);
    } catch (error) {
      setErrors(error.response?.data?.errors || {});
      setMessage('❌ Gagal menambahkan produk');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded-lg mt-8">
      <h2 className="text-2xl font-bold mb-4">Tambah Produk</h2>
      {message && <p className="mb-4 text-sm text-center">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Nama Produk</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          {errors.name && <p className="text-red-600 text-sm">{errors.name[0]}</p>}
        </div>

        <div>
          <label className="block font-medium">Deskripsi</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          {errors.description && <p className="text-red-600 text-sm">{errors.description[0]}</p>}
        </div>

        <div>
          <label className="block font-medium">Harga</label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          {errors.price && <p className="text-red-600 text-sm">{errors.price[0]}</p>}
        </div>

        <div>
          <label className="block font-medium">Stok</label>
          <input
            type="number"
            name="stock"
            value={form.stock}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Gambar Produk</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="w-full"
          />
          {errors.image && <p className="text-red-600 text-sm">{errors.image[0]}</p>}
          {preview && (
            <img src={preview} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded" />
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Simpan Produk
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
