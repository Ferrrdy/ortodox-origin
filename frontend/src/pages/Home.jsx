import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaArrowRight } from 'react-icons/fa';

// Komponen untuk showcase kategori (mengadaptasi desain baru)
  const secondaryCards = [
    {
      title: 'Koleksi Pria',
      description: 'Pakaian kasual dan formal untuk pria modern.',
      imageUrl: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1887&auto=format&fit=crop',
      alt: 'Pakaian Pria',
    },
    {
      title: 'Koleksi Wanita',
      description: 'Tampil gaya dengan pilihan busana wanita terkini.',
      imageUrl: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?q=80&w=1887&auto=format&fit=crop',
      alt: 'Pakaian Wanita',
    },
  ];
// Komponen Utama Home
const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiBaseUrl = 'http://127.0.0.1:8000';

  useEffect(() => {
    axios.get(`${apiBaseUrl}/api/products`)
      .then(res => {
        // Menyesuaikan dengan format data Anda (asumsi array langsung)
        setProducts(res.data);
      })
      .catch(err => {
        console.error('Gagal ambil produk:', err)
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus produk ini?')) return;
    try {
      await axios.delete(`${apiBaseUrl}/api/products/${id}`);
      setProducts(products.filter(p => p.id !== id));
    } catch (err) {
      console.error('Gagal hapus produk:', err);
    }
  };

  return (
    <div className="bg-white py-16">
      {/* Hero Section yang sudah ada */}
      <section className="w-full bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 items-center gap-x-8 gap-y-16 rounded-3xl bg-slate-100 p-8 sm:p-16 lg:max-w-none lg:grid-cols-2">
          
        {/* Kolom Teks */}
          <div className="text-center lg:text-left">
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight mb-6">
              Gaya Terbaru, Harga Terbaik.
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              Mulai dari kasual hingga formal, temukan semua kebutuhan fashion Anda di sini. Kualitas premium, kenyamanan maksimal.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
              <Link 
                to="/shop" 
                className="rounded-md bg-slate-900 px-5 py-3 text-lg font-semibold text-white shadow-sm hover:bg-slate-700 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
              >
                Belanja Sekarang
              </Link>
              <Link 
                to="/koleksi" 
                className="text-lg font-semibold leading-6 text-slate-800 group"
              >
                Lihat Koleksi <span className="inline-block transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
              </Link>
            </div>
          </div>

          {/* Kolom Gambar */}
          <div className="flex h-80 w-full items-center justify-center lg:h-full">
            <img 
              className="h-full w-full max-w-xl rounded-2xl object-cover shadow-xl"
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop"
              alt="Koleksi Pakaian"
            />
          </div>

        </div>
      </div>
    </section>

      <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-6 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:gap-8">
          
          {/* Kartu Besar di Kiri */}
          <div className="relative flex flex-col justify-between rounded-2xl bg-slate-800 p-8 lg:row-span-2">
            <div className="relative z-10">
              <h3 className="text-3xl font-bold text-white">Fashion Esensial</h3>
              <p className="mt-2 text-base text-slate-300">
                Dari atasan hingga bawahan, temukan potongan klasik yang wajib ada di lemari Anda.
              </p>
              <Link to="/shop" className="mt-8 inline-flex items-center gap-2 rounded-md bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-200">
                <span>Lihat Semua</span>
                <FaArrowRight />
              </Link>
            </div>
            <div className="relative mt-16 h-80">
              <img
                src="https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=2070&auto=format&fit=crop"
                alt="Koleksi Pakaian"
                className="absolute bottom-0 right-0 h-[22rem] w-auto"
              />
            </div>
          </div>

          {/* Dua Kartu Kecil di Kanan */}
          {secondaryCards.map((card) => (
            <div key={card.title} className="relative flex items-center justify-between gap-x-8 rounded-2xl bg-slate-100 p-8">
              <div className="flex-shrink-0">
                <h3 className="text-3xl font-bold text-gray-900">{card.title}</h3>
                <p className="mt-1 text-base text-gray-600">{card.description}</p>
                <Link to="/shop" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-800 group">
                  <span className='text-lg'>Explore Now</span>
                  <FaArrowRight className="transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    </div>
  );
};

export default Home;