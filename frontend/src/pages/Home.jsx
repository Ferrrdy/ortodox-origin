import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FiTruck, FiShield, FiAward, FiArrowRight } from 'react-icons/fi';

// Data untuk kartu kategori sekunder
const secondaryCards = [
  {
    title: 'Koleksi Pria',
    description: 'Pakaian kasual dan formal untuk pria modern.',
    imageUrl: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1887&auto=format&fit=crop',
    alt: 'Pakaian Pria',
    link: '/user/koleksi?kategori=pria' // Contoh link dengan query
  },
  {
    title: 'Koleksi Wanita',
    description: 'Tampil gaya dengan pilihan busana wanita terkini.',
    imageUrl: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?q=80&w=1887&auto=format&fit=crop',
    alt: 'Pakaian Wanita',
    link: '/user/koleksi?kategori=wanita'
  },
];

// Data untuk bagian Keunggulan
const features = [
    {
        name: 'Pengiriman Cepat',
        description: 'Pesanan Anda akan kami proses dan kirim dalam waktu 1-2 hari kerja.',
        icon: FiTruck,
    },
    {
        name: 'Kualitas Premium',
        description: 'Dibuat dari bahan-bahan pilihan untuk kenyamanan dan daya tahan maksimal.',
        icon: FiAward,
    },
    {
        name: 'Pembayaran Aman',
        description: 'Kami menjamin keamanan setiap transaksi dengan enkripsi terbaik.',
        icon: FiShield,
    },
];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiBaseUrl = 'http://127.0.0.1:8000';

  useEffect(() => {
    axios.get(`${apiBaseUrl}/api/products`)
      .then(res => {
        // Ambil 4 produk pertama untuk ditampilkan sebagai produk terbaru
        setProducts(res.data.slice(0, 4));
      })
      .catch(err => {
        console.error('Gagal ambil produk:', err);
      })
      .finally(() => {
        setTimeout(() => setLoading(false), 500); // Sedikit jeda untuk UX
      });
  }, []);

  // Komponen untuk Skeleton Loader Produk
  const ProductSkeleton = () => (
    <div className="animate-pulse">
        <div className="bg-slate-200 h-64 w-full rounded-lg"></div>
        <div className="h-4 bg-slate-200 rounded-md mt-4 w-3/4"></div>
        <div className="h-6 bg-slate-200 rounded-md mt-2 w-1/2"></div>
    </div>
  );

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="w-full bg-white py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto grid max-w-2xl grid-cols-1 items-center gap-x-8 gap-y-16 rounded-3xl bg-slate-100 p-8 sm:p-16 lg:max-w-none lg:grid-cols-2">
            <div className="text-center lg:text-left">
              <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight mb-6">
                Gaya Terbaru, Harga Terbaik.
              </h2>
              <p className="mt-6 text-lg leading-8 text-slate-600">
                Mulai dari kasual hingga formal, temukan semua kebutuhan fashion Anda di sini. Kualitas premium, kenyamanan maksimal.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
                <Link 
                  to="/user/koleksi" 
                  className="rounded-md bg-slate-900 px-5 py-3 text-lg font-semibold text-white shadow-sm hover:bg-slate-700 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
                >
                  Belanja Sekarang
                </Link>
              </div>
            </div>
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

      {/* ✨ BAGIAN BARU: Keunggulan Kami ✨ */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center">
                <h2 className="text-base font-semibold leading-7 text-indigo-600">Layanan Terbaik</h2>
                <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                    Mengapa Memilih Ortodox?
                </p>
            </div>
            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                    {features.map((feature) => (
                        <div key={feature.name} className="flex flex-col">
                            <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                                <feature.icon className="h-5 w-5 flex-none text-indigo-600" aria-hidden="true" />
                                {feature.name}
                            </dt>
                            <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                                <p className="flex-auto">{feature.description}</p>
                            </dd>
                        </div>
                    ))}
                </dl>
            </div>
        </div>
      </section>

      {/* Bagian Kategori yang sudah ada */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-6 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:gap-8">
            <div className="relative flex flex-col justify-between rounded-2xl bg-slate-800 p-8 lg:row-span-2">
              <div className="relative z-10">
                <h3 className="text-3xl font-bold text-white">Fashion Esensial</h3>
                <p className="mt-2 text-base text-slate-300">
                  Dari atasan hingga bawahan, temukan potongan klasik yang wajib ada di lemari Anda.
                </p>
              </div>
              <div className="relative mt-16 h-80">
                <img
                  src="https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=2070&auto=format&fit=crop"
                  alt="Koleksi Pakaian"
                  className="rounded-2xl absolute bottom-0 right-0 h-[22rem] w-auto"
                />
              </div>
            </div>
            {secondaryCards.map((card) => (
              <Link to={card.link} key={card.title} className="relative flex items-center justify-between gap-x-8 rounded-2xl bg-slate-100 p-8 hover:bg-slate-200 transition-colors">
                <div className="flex-shrink-0">
                  <h3 className="text-3xl font-bold text-gray-900">{card.title}</h3>
                  <p className="mt-1 text-base text-gray-600">{card.description}</p>
                </div>
                <FiArrowRight className="h-8 w-8 text-gray-500" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
