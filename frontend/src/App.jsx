import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';

function App() {
  return (
    <div className="container mx-auto px-4 py-6">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tambah" element={<AddProduct />} />
        <Route path="/edit/:id" element={<EditProduct />} />
        <Route path="*" element={<h2 className="text-center text-red-500">Halaman tidak ditemukan</h2>} />
      </Routes>
    </div>
  );
}

export default App;
