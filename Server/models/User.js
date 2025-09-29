const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  date_of_birth: { type: String, required: true },
  email_id: { 
    type: String, 
    required: true, 
    unique: true,
    match: [/.+@.+\..+/, 'Please enter a valid email address']
  },
  gender: { type: String, required: false, default: 'Male' },
  country: { type: String, required: false },
  state: { type: String, required: false },
  city: { type: String, required: false },
  address: { type: String, required: false },
  pincode: { type: String, required: false }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);