const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// GET Register User
router.get('/register', (req, res) => {
  res.render('auth/userRegister');
});

// POST Register User
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    req.flash('error_msg', 'Email already registered');
    return res.redirect('/users/register');
  }

  const hashed = await bcrypt.hash(password, 10);
  const newUser = new User({
    name,
    email,
    password: hashed,
    role: 'user'
  });

  await newUser.save();
  req.flash('success_msg', 'Registered! Please login.');
  res.redirect('/users/login');
});

// GET Login User
router.get('/login', (req, res) => {
  res.render('auth/userLogin');
});

// POST Login User
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    req.flash('error_msg', 'No user found');
    return res.redirect('/users/login');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    req.flash('error_msg', 'Incorrect password');
    return res.redirect('/users/login');
  }

  req.session.user = user;
  req.flash('success_msg', 'Logged in!');
  res.redirect('/');
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

module.exports = router;
