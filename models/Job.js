const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  companyName: { type: String, required: true },
  companyLogo: { type: String }, // ✅ New: Store path to logo image
  description: { type: String, required: true },
  location: { type: String },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Job', JobSchema);
