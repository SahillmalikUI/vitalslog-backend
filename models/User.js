const mongoose = require('mongoose');

// 🧒 This is the "form template" for a User
// Every user in database must have these fields
const userSchema = new mongoose.Schema({
  
  // Full name of the user
  name: {
    type: String,      // Must be text
    required: true,    // Cannot be empty
    trim: true         // Removes extra spaces
  },

  // Email address
  email: {
    type: String,
    required: true,
    unique: true,      // No 2 users can have same email
    lowercase: true,   // Always saved as lowercase
    trim: true
  },

  // Password (will be encrypted before saving)
  password: {
    type: String,
    required: true,
    minlength: 6       // Minimum 6 characters
  },

  // Age
  age: {
    type: Number,
    default: 0
  },

  // Weight in kg
  weight: {
    type: Number,
    default: 0
  },

  // Height in cm
  height: {
    type: Number,
    default: 0
  },

  // Blood group
  bloodGroup: {
    type: String,
    default: 'Unknown'
  },

  // When was this user created
  createdAt: {
    type: Date,
    default: Date.now  // Automatically saves current date
  }

});

// 🧒 This creates the actual "User" table in MongoDB
// Think of mongoose.model like creating a drawer labeled "Users"
const User = mongoose.model('User', userSchema);

module.exports = User;