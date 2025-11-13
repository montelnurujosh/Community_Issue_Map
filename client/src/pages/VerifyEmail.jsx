import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../utils/api';

function VerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await api.get(`/api/auth/verify/${token}`);
        setMessage(response.data.message);
        toast.success('Email verified successfully! You can now log in.');
        setTimeout(() => navigate('/login'), 3000);
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Verification failed';
        setMessage(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      verifyEmail();
    }
  }, [token, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md text-center"
      >
        <h1 className="text-2xl font-bold mb-4">Email Verification</h1>
        {loading ? (
          <div className="flex justify-center">
            <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <p className="text-gray-700">{message}</p>
        )}
      </motion.div>
    </div>
  );
}

export default VerifyEmail;