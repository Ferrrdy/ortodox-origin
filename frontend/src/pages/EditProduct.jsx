import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    image: null,
  });
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/products/${id}`)
      .then(res => setForm(res.data))
      .catch(err => console.error(err));
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm({ ...form, image: files[0] });
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('description', form.description);
    formData.append('price', form.price);
    formData.append('stock', form.stock);
    if (form.image instanceof File) {
      formData.append('image', form.image);
    }

    try {
      await axios.post(`http://127.0.0.1:8000/api/products/${id}?_method=PUT`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate('/');
    } catch (err) {
      console.error('Gagal update produk:', err);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white mt-8 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Edit Produk</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Nama Produk" className="w-full border p-2 rounded" />
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Deskripsi" className="w-full border p-2 rounded" />
        <input type="number" name="price" value={form.price} onChange={handleChange} placeholder="Harga" className="w-full border p-2 rounded" />
        <input type="number" name="stock" value={form.stock} onChange={handleChange} placeholder="Stok" className="w-full border p-2 rounded" />
        <input type="file" name="image" onChange={handleChange} className="w-full" />
        {preview && <img src={preview} alt="Preview" className="w-32 h-32 mt-2 object-cover rounded" />}
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Update</button>
      </form>
    </div>
  );
};

export default EditProduct;
