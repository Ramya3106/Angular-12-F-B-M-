const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  date_of_birth: { type: String, required: true },
  email_id: { type: String, required: true, unique: true }, // ✅ match JSON
  gender: { type: String, required: true },
  country: { type: String, required: true },
  state: { type: String, required: true },
  city: { type: String, required: true },
  address: { type: String, required: true },
  pincode: { type: String, required: true }
});

module.exports = mongoose.model('User', userSchema);
