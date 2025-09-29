const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is running!', timestamp: new Date() });
});

// GET all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET user by ID
app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create new user
app.post('/api/users', async (req, res) => {
  try {
    // Validate required fields
    const { first_name, last_name, date_of_birth, email_id,gender,country,state,city,address,pincode } = req.body;
    
    if (!first_name || !last_name || !date_of_birth || !email_id ||!gender || !country || !state ||!city || 
      !address ||!pincode
    ) {
      return res.status(400).json({ 
        message: 'Missing required fields: first_name, last_name, date_of_birth, and email_id are required',
        required: ['first_name', 'last_name', 'date_of_birth', 'email_id', 'gender','country','state','city','address','pincode'],
        received: Object.keys(req.body)
      });
    }

    // Normalize email (trim and lowercase)
    const normalizedEmail = email_id.trim().toLowerCase();
    
    // Check if email already exists before creating user (exact match, case-insensitive)
    const existingUser = await User.findOne({ 
      email_id: normalizedEmail 
    });
    if (existingUser) {
      return res.status(409).json({ 
        message: 'Email already exists. Please use a different email address.',
        suggestion: 'Try using a different email or update the existing user instead.',
        existingUser: {
          id: existingUser._id,
          name: `${existingUser.first_name} ${existingUser.last_name}`,
          email: existingUser.email_id
        }
      });
    }

    // Update the email in req.body to use normalized version
    req.body.email_id = normalizedEmail;

    const newUser = new User(req.body);
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation Error',
        errors: Object.keys(error.errors).map(key => ({
          field: key,
          message: error.errors[key].message
        }))
      });
    }
    if (error.code === 11000) {
      // Extract field name from error
      const field = Object.keys(error.keyPattern || {})[0] || 'email_id';
      const value = Object.values(error.keyValue || {})[0] || 'unknown';
      
      return res.status(409).json({ 
        message: `A user with this ${field === 'email_id' ? 'email' : field} already exists.`,
        field: field,
        value: value,
        suggestion: 'Please use a different email address or update the existing user.'
      });
    }
    res.status(500).json({ message: error.message });
  }
});

// GET check if email exists
app.get('/api/users/check-email/:email', async (req, res) => {
  try {
    const email = req.params.email;
    const existingUser = await User.findOne({ email_id: email });
    
    res.json({
      exists: !!existingUser,
      email: email,
      user: existingUser ? {
        id: existingUser._id,
        name: `${existingUser.first_name} ${existingUser.last_name}`
      } : null
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT update user
app.put('/api/users/:id', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE user
app.delete('/api/users/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});