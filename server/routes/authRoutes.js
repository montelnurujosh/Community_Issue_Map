import express from 'express';
const router = express.Router();
import {
  registerUser,
  verifyUser,
  loginUser,
  forgotPassword,
} from '../controllers/authController.js';

// @route   POST /api/auth/register
router.post('/register', registerUser);

// @route   GET /api/auth/verify/:token
router.get('/verify/:token', verifyUser);

// @route   POST /api/auth/login
router.post('/login', loginUser);

// @route   POST /api/auth/forgot-password
router.post('/forgot-password', forgotPassword);

export default router;