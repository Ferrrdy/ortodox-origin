import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom';

const Home = () => {
  const [products, setProducts] = useState([])

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/products')
      .then(res => {
        setProducts(res.data)
      })
      .catch(err => {
        console.error('Gagal ambil produk:', err)
      })
  }, [])
const handleDelete = async (id) => {
  if (!confirm('Yakin ingin menghapus produk ini?')) return;

  try {
    await axios.delete(`http://127.0.0.1:8000/api/products/${id}`);
    setProducts(products.filter(p => p.id !== id));
  } catch (err) {
    console.error('Gagal hapus produk:', err);
  }
};

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6 text-center text-blue-700">Daftar Baju</h1>

      <div className="flex flex-wrap gap-6 justify-center">
        {products.map(product => (
          <div
            key={product.id}
            className="bg-white border border-gray-200 rounded-lg shadow-md p-4 w-64"
          >
            <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
            <p className="text-gray-600 text-sm">{product.description}</p>
            <p className="text-green-600 font-bold mt-2">
              Rp {Number(product.price).toLocaleString('id-ID')}
            </p>
            <p className="text-gray-600 text-sm">Stok: {product.stock}</p>
            {product.image && (
              <img
                src={`http://127.0.0.1:8000/storage/${product.image}`}
                alt={product.name}
                className="mt-2 rounded-md"
              />
            )}
            <Link to={`/edit/${product.id}`} className="text-blue-600 hover:underline text-sm">Edit</Link>
            <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:underline text-sm">
              Hapus
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Home
