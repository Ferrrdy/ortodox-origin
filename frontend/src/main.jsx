import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Navbar from './components/Navbar.jsx'  

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <div className='container mx-auto px-4'>
      <Navbar />
      <App />
    </div>
  </React.StrictMode>,
)
