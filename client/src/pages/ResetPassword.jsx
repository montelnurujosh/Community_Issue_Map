import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Home } from 'lucide-react';
import api from '../utils/api';

function ResetPassword() {
  const { token } = useParams();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isValidToken, setIsValidToken] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Validate token on mount
    const validateToken = async () => {
      try {
        // You might want to add a backend endpoint to validate the token
        // For now, we'll assume it's valid if present
        setIsValidToken(true);
      } catch (error) {
        setIsValidToken(false);
        toast.error('Invalid or expired reset link');
      }
    };

    if (token) {
      validateToken();
    }
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.password.trim()) newErrors.password = 'Password is required';
    if (!formData.confirmPassword.trim()) newErrors.confirmPassword = 'Please confirm your password';
    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setIsLoading(true);

    try {
      await api.post('/api/auth/reset-password', {
        token,
        password: formData.password,
      });
      setSuccess(true);
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to reset password';
      setErrors({ general: message });
    } finally {
      setIsLoading(false);
    }
  };

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
            <h1 className="text-2xl font-bold mb-2">Password Reset Successful!</h1>
            <p className="text-green-50">Your password has been reset. You can now log in with your new password.</p>
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

  if (isValidToken === false) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md text-center"
        >
          <h1 className="text-2xl font-bold mb-4">Invalid Reset Link</h1>
          <p className="text-gray-700">This password reset link is invalid or has expired.</p>
          <Link
            to="/forgot-password"
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 inline-block"
          >
            Request New Reset Link
          </Link>
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
        className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md"
      >
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2">Reset Your Password</h1>
          <p className="text-gray-600">Enter your new password below</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {errors.general}
            </div>
          )}

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`input-field ${errors.password ? 'border-red-500' : ''}`}
              placeholder="Enter new password"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`input-field ${errors.confirmPassword ? 'border-red-500' : ''}`}
              placeholder="Confirm new password"
            />
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 rounded-md text-white transition duration-200 ${
              isLoading ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'
            } flex items-center justify-center`}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            ) : null}
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export default ResetPassword;