import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AddProduct from './pages/AddProduct';

function App() {
  return (
    <div className="container mx-auto px-4 py-6">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tambah" element={<AddProduct />} />
      </Routes>
    </div>
  );
}

export default App;
