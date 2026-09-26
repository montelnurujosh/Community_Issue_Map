import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Home, AlertCircle, RefreshCw } from 'lucide-react';
import api, { resendVerificationEmail } from '../utils/api';
import toast from 'react-hot-toast';

function VerifyEmail() {
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [expired, setExpired] = useState(false);
  const [email, setEmail] = useState('');
  const [resending, setResending] = useState(false);
  const [resentSuccess, setResentSuccess] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        await api.get(`/api/auth/verify/${token}`);
        setSuccess(true);
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Verification failed';
        setError(errorMessage);
        if (error.response?.data?.expired) {
          setExpired(true);
          if (error.response?.data?.email) {
            setEmail(error.response.data.email);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      verifyEmail();
    }
  }, [token]);

  const handleResend = async (e) => {
    if (e) e.preventDefault();
    if (!email.trim()) {
      toast.error('Please enter your email address');
      return;
    }

    setResending(true);
    try {
      await resendVerificationEmail(email.trim());
      setResentSuccess(true);
      toast.success('Fresh verification link sent! Valid for 5 minutes.');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to resend verification email.';
      toast.error(msg);
    } finally {
      setResending(false);
    }
  };

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
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md text-center"
      >
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold mb-2 text-gray-900">
          {expired ? 'Verification Link Expired' : 'Verification Failed'}
        </h1>
        <p className="text-gray-600 mb-6 text-sm">{error}</p>

        {resentSuccess ? (
          <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg mb-6 text-sm">
            ✅ A fresh verification link has been sent to <strong>{email}</strong> (valid for 5 minutes). Please check your inbox and spam folder.
          </div>
        ) : (
          <form onSubmit={handleResend} className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6 text-left">
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              Enter your email to receive a new link (valid for 5 mins):
            </label>
            <div className="flex gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              />
              <button
                type="submit"
                disabled={resending}
                className="bg-green-600 text-white px-4 py-2 text-sm font-semibold rounded-lg hover:bg-green-700 transition disabled:opacity-50 inline-flex items-center whitespace-nowrap"
              >
                {resending ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Resend Link'}
              </button>
            </div>
          </form>
        )}

        <div className="flex justify-center items-center gap-3">
          <Link
            to="/login"
            className="text-sm font-semibold text-green-700 hover:underline"
          >
            Go to Login
          </Link>
          <span className="text-gray-300">•</span>
          <Link
            to="/"
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Go to Homepage
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default VerifyEmail;