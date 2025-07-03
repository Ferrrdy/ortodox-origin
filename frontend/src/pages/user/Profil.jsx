import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';

const ProfilPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Profil Pengguna</h1>
      <div className="flex items-center gap-4 border p-4 rounded-md shadow-sm">
        <FaUserCircle className="text-4xl text-gray-600" />
        <div>
          <p className="text-lg font-semibold text-gray-800">{user?.name}</p>
          <p className="text-sm text-gray-500">{user?.email}</p>
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="mt-6 bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition"
      >
        Logout
      </button>
    </div>
  );
};

export default ProfilPage;
