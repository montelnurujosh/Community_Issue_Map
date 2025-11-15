import Report from '../models/Report.js';
import User from '../models/User.js';
import sgMail from '@sendgrid/mail';

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

    // Send email notifications to users with emailNotifications enabled
    try {
      const users = await User.find({ 'preferences.emailNotifications': true, isVerified: true });
      const notificationEmails = users.map(user => user.email);

      if (notificationEmails.length > 0) {
        const subject = 'New Report Submitted in CIMA';
        const html = `
          <p>A new report has been submitted in CIMA:</p>
          <p><strong>Title:</strong> ${populatedReport.title}</p>
          <p><strong>Category:</strong> ${populatedReport.category}</p>
          <p><strong>Submitted by:</strong> ${populatedReport.createdBy.name}</p>
          <p><strong>Description:</strong> ${populatedReport.description}</p>
          <p>You can view all reports in the CIMA app.</p>
        `;

        await sgMail.send({
          from: process.env.EMAIL_USER,
          to: notificationEmails,
          subject,
          html,
        });
      }
    } catch (emailError) {
      console.error('Email notification failed:', emailError);
      // Continue without failing the report creation
    }

    res.status(201).json(populatedReport);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  getReports,
  createReport,
};