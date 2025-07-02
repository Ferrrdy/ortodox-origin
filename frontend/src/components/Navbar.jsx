import { Link } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center mb-6 relative px-4">
      {/* Kiri: Logo */}
      <h1 className="text-3xl font-bold text-slate-900">Ortodox</h1>

      {/* Tengah: Menu */}
      <div className="absolute left-1/2 transform -translate-x-1/2 flex gap-x-6">
        <Link to="/" className="text-lg font-medium text-gray-700 hover:text-blue-600">Home</Link>
        <Link to="/" className="text-lg font-medium text-gray-700 hover:text-blue-600">Shop</Link>
        <Link to="/" className="text-lg font-medium text-gray-700 hover:text-blue-600">About Us</Link>
        <Link to="/" className="text-lg font-medium text-gray-700 hover:text-blue-600">Contact</Link>
      </div>

      {/* Kanan: Icon Cart */}
      <div className="flex items-col gap-4 text-slate-700">
        <Link to="/login" className=' hover:text-blue-600 cursor-pointer'>Sign In</Link>
        <Link to="/register" className=' hover:text-blue-600 cursor-pointer'>Sign Up</Link>
        <Link to="/cart" className=' hover:text-blue-600 cursor-pointer'>
          <FaShoppingCart size={24} />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
