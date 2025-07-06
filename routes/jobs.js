const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const { ensureAuthenticated } = require('../middleware/authMiddleware');
const multer = require('multer');

// ✅ Multer config: uploads folder public ke andar
const upload = multer({ dest: 'public/uploads/' });
// ➕ Add New Job
router.post('/add', ensureAuthenticated, upload.single('companyLogo'), async (req, res) => {
  const { title, companyName, description, location } = req.body;

  // ✅ If logo uploaded, set path
  const logoPath = req.file ? '/uploads/' + req.file.filename : '';

  const job = new Job({
    title,
    companyName,
    companyLogo: logoPath,
    description,
    location,
    postedBy: req.session.user._id
  });

  await job.save();
  req.flash('success_msg', 'Job posted!');
  res.redirect('/dashboard');
});
// ✏️ Update Job
router.post('/edit/:id', ensureAuthenticated, upload.single('companyLogo'), async (req, res) => {
  const { title, companyName, description, location } = req.body;

  const job = await Job.findById(req.params.id);

  // ✅ Agar naya logo aaya toh replace karo
  if (req.file) {
    job.companyLogo = '/uploads/' + req.file.filename;
  }

  job.title = title;
  job.companyName = companyName;
  job.description = description;
  job.location = location;

  await job.save();
  req.flash('success_msg', 'Job updated!');
  res.redirect('/dashboard');
});

// 🏠 Home Page - Show all jobs
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find().populate('postedBy');
    res.render('pages/index', { jobs });
  } catch (err) {
    console.error(err);
    res.send('Error loading jobs');
  }
});

// 📝 Job Details Page
router.get('/job/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('postedBy');
    res.render('pages/jobDetails', { job });
  } catch (err) {
    console.error(err);
    res.send('Error loading job details');
  }
});

// ✅ Admin Dashboard
router.get('/dashboard', ensureAuthenticated, async (req, res) => {
  const jobs = await Job.find({ postedBy: req.session.user._id });
  res.render('pages/adminDashboard', { jobs });
});

// ➕ Add Job Form
router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('pages/jobForm', { job: {} });
});

// ➕ Post Job
router.post('/add', ensureAuthenticated, async (req, res) => {
  const { title, company, description, location } = req.body;
  const job = new Job({
    title,
    company,
    description,
    location,
    postedBy: req.session.user._id
  });
  await job.save();
  req.flash('success_msg', 'Job posted!');
  res.redirect('/dashboard');
});

// ✏️ Edit Job Form
router.get('/edit/:id', ensureAuthenticated, async (req, res) => {
  const job = await Job.findById(req.params.id);
  res.render('pages/jobForm', { job });
});

// ✏️ Update Job
router.post('/edit/:id', ensureAuthenticated, async (req, res) => {
  const { title, company, description, location } = req.body;
  await Job.findByIdAndUpdate(req.params.id, {
    title, company, description, location
  });
  req.flash('success_msg', 'Job updated!');
  res.redirect('/dashboard');
});

// ❌ Delete Job
router.post('/delete/:id', ensureAuthenticated, async (req, res) => {
  await Job.findByIdAndDelete(req.params.id);
  req.flash('success_msg', 'Job deleted!');
  res.redirect('/dashboard');
});

module.exports = router;
