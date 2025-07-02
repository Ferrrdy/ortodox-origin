import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center mb-6 relative">
      <h1 className="text-3xl font-bold text-slate-900">Ortodox</h1>
      <div className="absolute left-1/2 transform -translate-x-1/2 flex gap-x-6">
        <Link to="/" className="text-lg font-medium text-gray-700 hover:text-blue-600">Home</Link>
        <Link to="/" className="text-lg font-medium text-gray-700 hover:text-blue-600">Shop</Link>
        <Link to="/" className="text-lg font-medium text-gray-700 hover:text-blue-600">About Us</Link>
        <Link to="/" className="text-lg font-medium text-gray-700 hover:text-blue-600">Contact</Link>
      </div>
    </nav>
  );
};

export default Navbar;
