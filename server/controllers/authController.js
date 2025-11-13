import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import User from '../models/User.js';

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Generate verification token
    const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1d' });

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      verificationToken,
    });

    if (user) {
      // Send verification email
      const verificationLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify/${verificationToken}`;
      console.log(`Verification link for ${email}: ${verificationLink}`);

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Verify your CIMA account',
        html: `<p>Click <a href="${verificationLink}">here</a> to verify your account.</p>`,
      });

      res.status(201).json({
        message: 'User registered successfully. Please check your email for verification link.',
        _id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify user email
// @route   GET /api/auth/verify/:token
// @access  Public
const verifyUser = async (req, res) => {
  const { token } = req.params;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return res.status(400).json({ message: 'Invalid token' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'User already verified' });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.json({ message: 'Email verified successfully. You can now log in.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      if (!user.isVerified) {
        return res.status(401).json({ message: 'Please verify your email first' });
      }

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Forgot password (mock implementation)
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // In a real app, you'd send an email with a reset link
    // For now, just log the reset link
    const resetToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '10m' });
    const resetLink = `http://localhost:5000/api/auth/reset-password/${resetToken}`;

    console.log(`Password reset link for ${email}: ${resetLink}`);

    res.json({ message: 'Password reset link sent to your email' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  registerUser,
  verifyUser,
  loginUser,
  forgotPassword,
};