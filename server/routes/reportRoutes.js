import express from 'express';
const router = express.Router();
import {
  getReports,
  createReport,
} from '../controllers/reportController.js';

import { protect } from '../middleware/authMiddleware.js';

// @route   GET /api/reports
router.get('/', getReports);

// @route   POST /api/reports
router.post('/', protect, createReport);

export default router;