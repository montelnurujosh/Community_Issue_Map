import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white shadow-md p-4 flex justify-between items-center"
    >
      <Link to="/" className="flex items-center space-x-2">
        <MapPin className="w-8 h-8 text-primary" />
        <span className="text-2xl font-bold text-gray-900">CIMA</span>
      </Link>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-gray-700">Hi, {user.name}</span>
            <button
              onClick={logout}
              className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="text-green-600 hover:underline">
            Login
          </Link>
        )}
      </div>
    </motion.nav>
  );
}

export default Navbar;
