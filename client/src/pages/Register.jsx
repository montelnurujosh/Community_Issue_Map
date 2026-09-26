import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Mail, Lock, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { resendVerificationEmail } from '../utils/api';

function Register() {
   const { register } = useAuth();
   const [formData, setFormData] = useState({
     fullName: '',
     email: '',
     password: '',
     confirmPassword: '',
   });
   const [showPassword, setShowPassword] = useState(false);
   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
   const [isLoading, setIsLoading] = useState(false);
   const [errors, setErrors] = useState({});
   const [showSuccessMessage, setShowSuccessMessage] = useState(false);
   const [registrationData, setRegistrationData] = useState(null);
   const [isResending, setIsResending] = useState(false);
   const [resendCooldown, setResendCooldown] = useState(0);
   const navigate = useNavigate();

  const handleResend = async () => {
    if (!formData.email.trim()) {
      toast.error('Please enter your email above first');
      return;
    }
    setIsResending(true);
    try {
      const res = await resendVerificationEmail(formData.email.trim());
      if (res.verificationLink) {
        setRegistrationData(prev => ({ ...prev, verificationLink: res.verificationLink }));
      }
      toast.success(res.message || 'Verification link sent! Valid for 5 minutes.');
      setResendCooldown(60);
      const timer = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resend verification link');
    } finally {
      setIsResending(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.password.trim()) newErrors.password = 'Password is required';
    if (!formData.confirmPassword.trim()) newErrors.confirmPassword = 'Please confirm your password';

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

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
      const res = await register({
        name: formData.fullName,
        email: formData.email,
        password: formData.password
      });
      setRegistrationData(res);
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 30000);
    } catch (error) {
      console.error('Registration error:', error);
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      setErrors({ general: message });
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md"
      >
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-primary to-green-600 px-6 py-8 text-center text-white">
          <div className="flex items-center justify-center mb-2">
            <MapPin className="w-6 h-6 mr-2" />
            <span className="text-lg">🇰🇪</span>
          </div>
          <h1 className="text-2xl font-bold mb-2">Join CIMA Community</h1>
          <p className="text-green-50">Create an account to help map and solve local issues</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {errors.general}
            </div>
          )}

              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={`input-field pl-10 ${errors.fullName ? 'border-red-500' : ''}`}
                    placeholder="Enter your full name"
                  />
                </div>
                {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`input-field pl-10 ${errors.email ? 'border-red-500' : ''}`}
                    placeholder="Enter your email"
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`input-field pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`input-field pl-10 pr-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
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
            {isLoading ? 'Please wait…' : 'Register'}
          </button>
        </form>

        {showSuccessMessage && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mt-4 text-sm">
            <p className="font-semibold">Registered successfully!</p>
            <p className="mt-1">Kindly check your email or spam folder for your verification link (valid for 5 minutes).</p>
            {registrationData?.verificationLink && (
              <div className="mt-3 p-3 bg-white border border-green-300 rounded-lg text-center shadow-sm">
                <p className="text-xs text-gray-700 mb-2 font-medium">Or verify directly with one click:</p>
                <a
                  href={registrationData.verificationLink}
                  className="inline-block w-full bg-green-600 text-white font-bold py-2 px-4 rounded-md hover:bg-green-700 transition"
                >
                  Verify My Account Now
                </a>
              </div>
            )}
            <div className="mt-3 pt-2 border-t border-green-200 flex items-center justify-between">
              <span className="text-xs text-green-800">Didn't get the email?</span>
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending || resendCooldown > 0}
                className="text-xs font-bold text-green-900 underline hover:text-green-950 disabled:opacity-50"
              >
                {isResending ? 'Sending...' : resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Link'}
              </button>
            </div>
          </div>
        )}

        <div className="mt-6 text-center">
          <div className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-primary hover:text-green-700 font-medium transition-colors"
            >
              Login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Register;
