const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Login GET
router.get('/login', (req, res) => {
  res.render('auth/login');
});

// Login POST
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      req.flash('error_msg', 'No user found');
      return res.redirect('/auth/login');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      req.flash('error_msg', 'Incorrect password');
      return res.redirect('/auth/login');
    }

    req.session.user = user; // Save HR user in session
    req.flash('success_msg', 'You are now logged in');
    res.redirect('/dashboard');

  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Server error');
    res.redirect('/auth/login');
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/auth/login');
  });
});
// GET Register HR
router.get('/register', (req, res) => {
  res.render('auth/hrRegister');
});

// POST Register HR
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    req.flash('error_msg', 'Email already registered');
    return res.redirect('/auth/register');
  }

  const hashed = await bcrypt.hash(password, 10);
  const newHR = new User({
    name,
    email,
    password: hashed
  });

  await newHR.save();
  req.flash('success_msg', 'HR Registered! Please login.');
  res.redirect('/auth/login');
});


module.exports = router;
