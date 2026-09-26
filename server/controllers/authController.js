import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import sgMail from '@sendgrid/mail';
import nodemailer from 'nodemailer';
import User from '../models/User.js';

// Set SendGrid API key if available
if (process.env.SENDGRID_API_KEY) {
  try {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  } catch (err) {
    console.warn('Failed to set SendGrid API key:', err.message);
  }
}

// Persistent pooled mail transporter to prevent connection delays
let mailTransporter = null;
const getMailTransporter = () => {
  if (!mailTransporter && process.env.EMAIL_PASS) {
    mailTransporter = nodemailer.createTransport({
      service: 'gmail',
      pool: true,
      maxConnections: 3,
      connectionTimeout: 4000,
      greetingTimeout: 3000,
      socketTimeout: 4000,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS.replace(/\s+/g, ''),
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }
  return mailTransporter;
};

// Universal email sender supporting HTTP APIs (port 443 - works on Render) & Nodemailer SMTP (localhost)
const sendEmailPayload = async ({ to, subject, html }) => {
  // 1. Brevo HTTP API (Port 443 HTTPS - Works on Render free tier!)
  if (process.env.BREVO_API_KEY) {
    try {
      const res = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'api-key': process.env.BREVO_API_KEY,
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          sender: {
            name: 'CIMA Community',
            email: process.env.EMAIL_USER || 'cimaspprt@gmail.com',
          },
          to: [{ email: to }],
          subject,
          htmlContent: html,
        }),
      });
      if (res.ok) {
        console.log(`✅ Email sent via Brevo HTTP API to ${to}`);
        return true;
      }
      const errData = await res.json();
      console.warn('Brevo API error:', errData);
    } catch (e) {
      console.warn('Brevo request failed:', e.message);
    }
  }

  // 2. Resend HTTP API (Port 443 HTTPS - Works on Render free tier!)
  if (process.env.RESEND_API_KEY) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM || 'CIMA <onboarding@resend.dev>',
          to: [to],
          subject,
          html,
        }),
      });
      if (res.ok) {
        console.log(`✅ Email sent via Resend HTTP API to ${to}`);
        return true;
      }
      const errData = await res.json();
      console.warn('Resend API error:', errData);
    } catch (e) {
      console.warn('Resend request failed:', e.message);
    }
  }

  // 3. SendGrid HTTP API (Port 443 HTTPS - Works on Render free tier!)
  if (process.env.SENDGRID_API_KEY) {
    try {
      await sgMail.send({
        from: process.env.EMAIL_USER || 'cimaspprt@gmail.com',
        to,
        subject,
        html,
      });
      console.log(`✅ Email sent via SendGrid API to ${to}`);
      return true;
    } catch (e) {
      console.warn('SendGrid API error:', e?.response?.body || e.message);
    }
  }

  // 4. Nodemailer Gmail SMTP (local development / environments allowing port 465/587)
  const transporter = getMailTransporter();
  if (transporter) {
    await transporter.sendMail({
      from: `"CIMA" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`✅ Email sent via Nodemailer SMTP to ${to}`);
    return true;
  }

  throw new Error('No working email service configured or available');
};

const sendVerificationEmail = async (email, link) => {
  return await sendEmailPayload({
    to: email,
    subject: 'Verify your CIMA account',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #15803d; text-align: center;">Welcome to CIMA</h2>
        <p>Thank you for joining our community to help map and solve local issues.</p>
        <p>Please click the button below to verify your email address (link valid for 5 minutes):</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${link}" style="background-color: #15803d; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Verify My Email</a>
        </div>
        <p style="color: #666; font-size: 13px;">Or copy and paste this link into your browser:</p>
        <p style="word-break: break-all; font-size: 13px; color: #15803d;">${link}</p>
      </div>
    `,
  });
};

const sendResetEmail = async (email, link) => {
  return await sendEmailPayload({
    to: email,
    subject: 'Reset your CIMA password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #15803d; text-align: center;">CIMA Password Reset</h2>
        <p>You requested to reset your password. Click the button below to set a new password (valid for 10 minutes):</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${link}" style="background-color: #15803d; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Reset Password</a>
        </div>
        <p style="color: #666; font-size: 13px;">This link expires in 10 minutes. If you did not request this, please ignore this email.</p>
        <p style="word-break: break-all; font-size: 13px; color: #15803d;">${link}</p>
      </div>
    `,
  });
};

// Helper to get the correct frontend base URL (supporting FRONTEND_URL, CLIENT_URL, or request Origin)
const getFrontendBaseUrl = (req) => {
  if (process.env.FRONTEND_URL && !process.env.FRONTEND_URL.includes('localhost')) {
    return process.env.FRONTEND_URL.replace(/\/$/, '');
  }
  if (process.env.CLIENT_URL && !process.env.CLIENT_URL.includes('localhost')) {
    return process.env.CLIENT_URL.replace(/\/$/, '');
  }
  if (req && req.headers && req.headers.origin && !req.headers.origin.includes('localhost')) {
    return req.headers.origin.replace(/\/$/, '');
  }
  const fallback = process.env.FRONTEND_URL || process.env.CLIENT_URL || 'http://localhost:5173';
  return fallback.replace(/\/$/, '');
};

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({ email });

    if (user) {
      if (user.isVerified) {
        return res.status(400).json({ message: 'This email is already registered and verified. Please log in.' });
      }

      // Existing unverified user: refresh token and resend verification link!
      const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '5m' });
      user.verificationToken = verificationToken;
      user.lastVerificationEmailSentAt = new Date();
      if (name) user.name = name;
      if (password) user.password = password;
      await user.save();

      const baseUrl = getFrontendBaseUrl(req);
      const verificationLink = `${baseUrl}/verify/${verificationToken}`;
      console.log(`\n============================================================`);
      console.log(`RESENDING VERIFICATION LINK FOR ${email} (valid 5 mins):`);
      console.log(`${verificationLink}`);
      console.log(`============================================================\n`);

      let emailSent = false;
      try {
        await sendVerificationEmail(email, verificationLink);
        emailSent = true;
        console.log(`Verification email resent successfully to ${email}`);
      } catch (emailError) {
        console.warn('Email sending failed (e.g. SendGrid quota or network):', emailError?.response?.body || emailError.message);
      }

      return res.status(200).json({
        message: emailSent
          ? 'Account is already registered but unverified. A new verification link has been sent to your email (valid for 5 minutes)!'
          : 'Verification link generated. Click the button below to verify your account:',
        verificationLink: !emailSent ? verificationLink : undefined,
        _id: user._id,
        name: user.name,
        email: user.email,
        isVerified: false,
      });
    }

    // Generate verification token (expires in 5 minutes)
    const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '5m' });

    // Create user (isVerified is false by default)
    user = await User.create({
      name,
      email,
      password,
      verificationToken,
      lastVerificationEmailSentAt: new Date(),
    });

    if (user) {
      // Send verification email
      const baseUrl = getFrontendBaseUrl(req);
      const verificationLink = `${baseUrl}/verify/${verificationToken}`;
      console.log(`\n============================================================`);
      console.log(`VERIFICATION LINK FOR ${email} (valid 5 mins):`);
      console.log(`${verificationLink}`);
      console.log(`============================================================\n`);

      let emailSent = false;
      try {
        await sendVerificationEmail(email, verificationLink);
        emailSent = true;
        console.log(`Verification email sent successfully to ${email}`);
      } catch (emailError) {
        console.warn('Email sending failed (e.g. SendGrid quota or network):', emailError?.response?.body || emailError.message);
      }

      res.status(201).json({
        message: emailSent
          ? 'User registered successfully. Please check your email for the verification link (valid for 5 minutes).'
          : 'User registered successfully! Click the button below to verify your account:',
        verificationLink: !emailSent ? verificationLink : undefined,
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
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtErr) {
      if (jwtErr.name === 'TokenExpiredError') {
        const payload = jwt.decode(token);
        return res.status(400).json({
          message: 'This verification link has expired (links are valid for 5 minutes). Please request a new verification link below.',
          expired: true,
          email: payload?.email,
        });
      }
      return res.status(400).json({ message: 'Invalid or malformed verification link.' });
    }

    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return res.status(400).json({ message: 'Account not found.' });
    }

    if (user.isVerified) {
      return res.status(200).json({ message: 'Your account is already verified! You can log in.' });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.json({ message: 'Email verified successfully! You can now log in.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Resend verification email
// @route   POST /api/auth/resend-verification
// @access  Public
const resendVerification = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Please provide an email address' });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return res.status(404).json({ message: 'No account found with this email' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'This account is already verified. Please log in.' });
    }

    // Rate limiting cooldown (60 seconds)
    const now = new Date();
    if (user.lastVerificationEmailSentAt && (now - new Date(user.lastVerificationEmailSentAt)) < 60000) {
      const waitSeconds = Math.ceil((60000 - (now - new Date(user.lastVerificationEmailSentAt))) / 1000);
      return res.status(429).json({
        message: `Please wait ${waitSeconds}s before requesting another verification email.`,
      });
    }

    // Generate fresh 5-minute token
    const verificationToken = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '5m' });
    user.verificationToken = verificationToken;
    user.lastVerificationEmailSentAt = now;
    await user.save();

    const baseUrl = getFrontendBaseUrl(req);
    const verificationLink = `${baseUrl}/verify/${verificationToken}`;

    console.log(`\n============================================================`);
    console.log(`RESENDING VERIFICATION LINK FOR ${user.email} (valid 5 mins):`);
    console.log(`${verificationLink}`);
    console.log(`============================================================\n`);

    let emailSent = false;
    try {
      await sendVerificationEmail(user.email, verificationLink);
      emailSent = true;
      console.log(`Verification email resent successfully to ${user.email}`);
    } catch (emailError) {
      console.warn('Resend verification email failed:', emailError?.response?.body || emailError.message);
    }

    res.json({
      message: emailSent
        ? 'A fresh verification link has been sent to your email (valid for 5 minutes).'
        : 'Verification link generated! Click below to verify your account:',
      verificationLink: !emailSent ? verificationLink : undefined,
    });
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

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const resetToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '10m' });
    const baseUrl = getFrontendBaseUrl(req);
    const resetLink = `${baseUrl}/reset-password/${resetToken}`;

    console.log(`\n============================================================`);
    console.log(`PASSWORD RESET LINK FOR ${email}:`);
    console.log(`${resetLink}`);
    console.log(`============================================================\n`);

    let emailSent = false;
    try {
      await sendResetEmail(email, resetLink);
      emailSent = true;
    } catch (emailError) {
      console.warn('Password reset email failed:', emailError?.response?.body || emailError.message);
    }

    res.json({
      message: emailSent
        ? 'Password reset link sent to your email (valid for 10 minutes).'
        : 'Password reset link generated! Click below to reset your password:',
      resetLink: !emailSent ? resetLink : undefined,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
  const { token, password } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return res.status(400).json({ message: 'Invalid token' });
    }

    user.password = password; // Will be hashed by pre-save middleware
    await user.save();

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  const { name, email } = req.body;

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if email is being changed and if it's already taken
    if (email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: 'Email already in use' });
      }
      user.email = email;
      user.isVerified = false; // Require re-verification for email change
    }

    user.name = name;
    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check current password
    if (!(await user.matchPassword(currentPassword))) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    user.password = newPassword; // Will be hashed by pre-save middleware
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update notification preferences
// @route   PUT /api/auth/notifications
// @access  Private
const updateNotifications = async (req, res) => {
  const { emailNotifications, reportUpdates } = req.body;

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.preferences = {
      emailNotifications: emailNotifications ?? true,
      reportUpdates: reportUpdates ?? true,
    };

    await user.save();

    res.json({
      message: 'Notification preferences updated',
      preferences: user.preferences,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  registerUser,
  verifyUser,
  resendVerification,
  loginUser,
  forgotPassword,
  resetPassword,
  updateProfile,
  changePassword,
  updateNotifications,
};