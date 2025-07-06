const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const User = require('./models/User');
const connectDB = require('./config/db');
connectDB();

const app = express();

// ✅ Smart Seeding
(async () => {
  const existingHR = await User.findOne({ email: 'hr@company.com' });
  if (!existingHR) {
    const hashed = await bcrypt.hash('admin123', 10);
    const user = new User({
      name: 'Admin HR',
      email: 'hr@company.com',
      password: hashed
    });
    await user.save();
    console.log('✅ HR User Created');
  } else {
    console.log('✅ HR User Already Exists');
  }
})();

// EJS
app.set('view engine', 'ejs');

// Static
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session & Flash
app.use(session({
  secret: 'secretkey',
  resave: false,
  saveUninitialized: false
}));
app.use(flash());

// Global Vars
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  next();
});

// Routes
app.use('/', require('./routes/jobs'));
app.use('/auth', require('./routes/auth'));
app.use('/users', require('./routes/userAuth'));

app.use('/applications', require('./routes/applications'));

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
