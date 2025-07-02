import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { AuthProvider } from './contexts/AuthContext';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
    <AuthProvider>
       <App />
    </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// Konfigurasi Axios Interceptor
axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token'); // Ambil token dari localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Tambahkan header Authorization
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);
