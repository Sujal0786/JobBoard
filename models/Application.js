const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
  name: String,
  email: String,
  cv: String,  // CV file path
  status: { type: String, default: 'Pending' }
});

module.exports = mongoose.model('Application', ApplicationSchema);
