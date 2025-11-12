import Report from '../models/Report.js';

// @desc    Get all reports
// @route   GET /api/reports
// @access  Public
const getReports = async (req, res) => {
  try {
    const reports = await Report.find({}).populate('createdBy', 'name email');
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new report
// @route   POST /api/reports
// @access  Private
const createReport = async (req, res) => {
  const { title, description, category, location, imageUrl } = req.body;

  try {
    const report = await Report.create({
      title,
      description,
      category,
      location,
      imageUrl,
      createdBy: req.user._id,
    });

    const populatedReport = await Report.findById(report._id).populate('createdBy', 'name email');

    // Emit real-time update
    const io = req.app.get('io');
    io.emit('newReport', populatedReport);

    res.status(201).json(populatedReport);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  getReports,
  createReport,
};