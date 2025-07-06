const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const upload = require('../middleware/uploadMiddleware');
const { ensureAuthenticated } = require('../middleware/authMiddleware');
const sendApplicationEmail = require('../utils/mailer');
const Job = require('../models/Job');


// Apply to Job
router.post('/apply/:jobId', upload.single('cv'), async (req, res) => {
  const { name, email } = req.body;
  const cv = req.file.filename;

  const application = new Application({
    job: req.params.jobId,
    name,
    email,
    cv
  });

  await application.save();

  // Get job details for email
  const job = await Job.findById(req.params.jobId);

  // ✅ Send confirmation email
  await sendApplicationEmail(email, job.title);

  req.flash('success_msg', 'Application submitted! Confirmation email sent.');
  res.redirect('/');
});


// View Applications for a Job
router.get('/job/:jobId', ensureAuthenticated, async (req, res) => {
  const applications = await Application.find({ job: req.params.jobId });
  res.render('pages/applicationList', { applications });
});

module.exports = router;
