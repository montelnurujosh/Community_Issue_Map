import express from 'express';
const router = express.Router();
import {
  getUsers,
  getReports,
  deleteReport,
  promoteUser,
} from '../controllers/adminController.js';

import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';

// @route   GET /api/admin/users
router.get('/users', protect, admin, getUsers);

// @route   GET /api/admin/reports
router.get('/reports', protect, admin, getReports);

// @route   DELETE /api/admin/reports/:id
router.delete('/reports/:id', protect, admin, deleteReport);

// @route   PATCH /api/admin/users/:id/promote
router.patch('/users/:id/promote', protect, admin, promoteUser);

export default router;