import express from 'express';
const router = express.Router();
import { protect } from '../middleware/authMiddleware.js';
import {
  registerUser,
  verifyUser,
  loginUser,
  forgotPassword,
  resetPassword,
  updateProfile,
  changePassword,
  updateNotifications,
} from '../controllers/authController.js';

// @route   POST /api/auth/register
router.post('/register', registerUser);

// @route   GET /api/auth/verify/:token
router.get('/verify/:token', verifyUser);

// @route   POST /api/auth/login
router.post('/login', loginUser);

// @route   POST /api/auth/forgot-password
router.post('/forgot-password', forgotPassword);

// @route   POST /api/auth/reset-password
router.post('/reset-password', resetPassword);


// @route   PUT /api/auth/profile
router.put('/profile', protect, updateProfile);

// @route   PUT /api/auth/change-password
router.put('/change-password', protect, changePassword);

// @route   PUT /api/auth/notifications
router.put('/notifications', protect, updateNotifications);

export default router;