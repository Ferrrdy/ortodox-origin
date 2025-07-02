import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white shadow p-4 flex justify-between items-center mb-6">
      <h1 className="text-xl font-bold text-blue-700">Ortodox</h1>
      <div className="flex gap-4">
        <Link to="/" className="text-gray-700 hover:text-blue-600">Home</Link>
        <Link to="/tambah" className="text-gray-700 hover:text-blue-600">Tambah Produk</Link>
      </div>
    </nav>
  );
};

export default Navbar;
