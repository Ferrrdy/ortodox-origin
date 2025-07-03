import { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'

const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0)

  const fetchCartCount = async () => {
    try {
      // Ambil CSRF cookie jika pakai Sanctum
      await axios.get('http://localhost:8000/sanctum/csrf-cookie', {
        withCredentials: true
      })

      // Ambil data cart
      const res = await axios.get('http://localhost:8000/api/cart', {
        withCredentials: true
      })

      // Hitung total quantity semua item
      const total = res.data.reduce((sum, item) => sum + item.quantity, 0)
      setCartCount(total)
    } catch (err) {
      console.error('Gagal ambil cart count:', err)
    }
  }

  useEffect(() => {
    fetchCartCount()
  }, [])

  return (
    <CartContext.Provider value={{ cartCount, setCartCount, fetchCartCount }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
