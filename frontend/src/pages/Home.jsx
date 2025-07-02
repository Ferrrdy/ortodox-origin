import React, { useEffect, useState } from 'react'
import axios from 'axios'

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
          </div>
        ))}
      </div>
    </div>
  )
}

export default Home
