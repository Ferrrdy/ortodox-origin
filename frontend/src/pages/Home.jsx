import { useEffect, useState } from 'react'
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
    <div style={{ padding: '2rem' }}>
      <h1>Daftar Baju</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
        {products.map(product => (
          <div key={product.id} style={{ border: '1px solid #ddd', padding: '1rem', width: '200px' }}>
            <h3>{product.name}</h3>
            <p>Rp {product.price}</p>
            <p style={{ fontSize: '0.8rem' }}>{product.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Home
