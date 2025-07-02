import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { FaEdit, FaTrash } from 'react-icons/fa'

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
      await axios.delete(`http://127.0.0.1:8000/api/products/${id}`)
      setProducts(products.filter(p => p.id !== id))
    } catch (err) {
      console.error('Gagal hapus produk:', err)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-8">
      <h1 className="text-4xl font-bold text-center text-blue-800 mb-10 tracking-wide drop-shadow-sm">
        Koleksi Baju Kami
      </h1>

      <div className="flex flex-wrap justify-center gap-8">
        {products.map(product => (
          <div
            key={product.id}
            className="bg-white rounded-2xl shadow-lg overflow-hidden w-72 hover:shadow-xl transition duration-300"
          >
            {product.image && (
              <img
                src={`http://127.0.0.1:8000/storage/${product.image}`}
                alt={product.name}
                className="h-48 w-full object-cover"
              />
            )}

            <div className="p-5 flex flex-col justify-between h-[220px]">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 truncate">{product.name}</h3>
                <p className="text-gray-500 text-sm line-clamp-2">{product.description}</p>
              </div>

              <div className="mt-3">
                <p className="text-green-600 font-bold text-lg">
                  Rp {Number(product.price).toLocaleString('id-ID')}
                </p>
                <p className="text-sm text-gray-500">Stok: {product.stock}</p>
              </div>

              <div className="flex gap-3 mt-4 text-sm">
                <Link
                  to={`/edit/${product.id}`}
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition"
                >
                  <FaEdit className="text-xs" /> Edit
                </Link>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="flex items-center gap-1 text-red-600 hover:text-red-800 transition"
                >
                  <FaTrash className="text-xs" /> Hapus
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Home
