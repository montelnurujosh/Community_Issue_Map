import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Home } from 'lucide-react';
import api from '../utils/api';

function VerifyEmail() {
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        await api.get(`/api/auth/verify/${token}`);
        setSuccess(true);
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Verification failed';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      verifyEmail();
    }
  }, [token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md text-center"
        >
          <h1 className="text-2xl font-bold mb-4">Email Verification</h1>
          <div className="flex justify-center">
            <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md text-center"
        >
          <div className="bg-gradient-to-r from-primary to-green-600 px-6 py-8 text-center text-white rounded-t-2xl">
            <CheckCircle className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Verification Successful!</h1>
            <p className="text-green-50">Your email has been verified. You can now log in to your account.</p>
          </div>

          <div className="px-6 py-8">
            <Link
              to="/login"
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors inline-flex items-center justify-center"
            >
              <Home className="w-5 h-5 mr-2" />
              Go to Login
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md text-center"
      >
        <h1 className="text-2xl font-bold mb-4 text-red-600">Verification Failed</h1>
        <p className="text-gray-700 mb-4">{error}</p>
        <Link
          to="/"
          className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors inline-block"
        >
          Go to Homepage
        </Link>
      </motion.div>
    </div>
  );
}

export default VerifyEmail;