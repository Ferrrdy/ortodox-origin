import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const OrderSuccessPage = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        // Pastikan teman Anda sudah menambahkan endpoint ini di backend
        const fetchOrderDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/orders/${orderId}`, {
                    withCredentials: true,
                });
                setOrder(response.data);
            } catch (err) {
                console.error("Gagal mengambil detail pesanan:", err);
                setError("Tidak dapat menemukan detail pesanan Anda.");
            } finally {
                setLoading(false);
            }
        };

        if (orderId) {
            fetchOrderDetails();
        }
    }, [orderId]);

    if (loading) {
        return <div className="text-center p-10">Memuat detail pesanan...</div>;
    }

    if (error) {
        return <div className="text-center p-10 text-red-500">{error}</div>;
    }

    return (
        <div className="bg-gray-50 min-h-screen flex items-center justify-center">
            <div className="container mx-auto px-4 py-8 max-w-2xl">
                <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                    <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                        <svg className="text-green-600 w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Pesanan Berhasil!</h1>
                    <p className="text-gray-600 mb-6">
                        Terima kasih telah berbelanja. Pesanan Anda sedang kami proses.
                    </p>

                    {order && (
                        <div className="text-left bg-gray-50 p-6 rounded-lg border">
                            <h2 className="text-xl font-semibold mb-4 border-b pb-2">Detail Pesanan</h2>
                            <div className="space-y-3">
                                <p><strong>ID Pesanan:</strong> #{order.id}</p>
                                <p><strong>Status:</strong> <span className="font-semibold capitalize text-orange-500">{order.status}</span></p>
                                <p><strong>Total Pembayaran:</strong> <span className="font-bold">Rp {Number(order.total_price).toLocaleString('id-ID')}</span></p>
                                
                                <div className="pt-4">
                                    <h3 className="font-semibold mb-2">Item yang Dipesan:</h3>
                                    <ul className="space-y-2">
                                        {order.items.map(item => (
                                            <li key={item.id} className="flex justify-between items-center text-sm">
                                                <span>{item.product.name} (x{item.quantity})</span>
                                                <span>Rp {Number(item.price * item.quantity).toLocaleString('id-ID')}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                    <Link to="/" className="mt-8 inline-block bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-indigo-700 transition-all">
                        Kembali ke Beranda
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccessPage;