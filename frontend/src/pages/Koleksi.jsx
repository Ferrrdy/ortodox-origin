import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { FaEdit, FaTrash } from 'react-icons/fa'

const Koleksi = () => {
  const [products, setProducts] = useState([])

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error('Gagal ambil produk:', err))
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
    <section className="min-h-screen px-6 py-12 bg-white text-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold text-slate-900">Koleksi Baju Kami</h1>
          <Link to="/tambah" className="bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold px-4 py-2 rounded-lg transition">
            + Tambah Produk
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map(product => (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden ring-1 ring-slate-100"
            >
              {product.image && (
                <img
                  src={`http://127.0.0.1:8000/storage/${product.image}`}
                  alt={product.name}
                  className="h-48 w-full object-cover"
                />
              )}

              <div className="p-4 flex flex-col justify-between h-[220px]">
                <div>
                  <h3 className="text-lg font-bold text-gray-800 truncate">{product.name}</h3>
                  <p className="text-gray-500 text-sm line-clamp-2">{product.description}</p>
                </div>

                <div className="mt-2">
                  <p className="text-green-600 font-bold text-base">
                    Rp {Number(product.price).toLocaleString('id-ID')}
                  </p>
                  <p className="text-sm text-gray-500">Stok: {product.stock}</p>
                </div>

                <div className="flex gap-4 mt-4 text-sm">
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
    </section>
  )
}

export default Koleksi
