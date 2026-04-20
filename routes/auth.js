const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

// 🧒 Router is like a mini server just for auth routes
// Instead of putting everything in server.js, we organize it here
const router = express.Router();

// ═══════════════════════════════════════
// 📝 REGISTER API
// URL: POST http://localhost:5000/api/auth/register
// ═══════════════════════════════════════
router.post('/register', async (req, res) => {
  try {
    // 🧒 req.body is what Flutter sends to us
    // Like reading the order that came from the customer
    const { name, email, password } = req.body;

    // Step 1 — Check if all fields are provided
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email and password'
      });
    }

    // Step 2 — Check if email already exists
    // 🧒 Like checking if someone already registered with this email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered! Please login.'
      });
    }

    // Step 3 — Encrypt the password
    // 🧒 bcrypt turns "sahil123" into "$2b$10$xK9..." 
    // The 10 means how strong the encryption is
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Step 4 — Create new user in database
    // 🧒 Like filling out the form and putting it in the fridge
    const user = new User({
      name,
      email,
      password: hashedPassword  // Save encrypted password!
    });

    await user.save();

    // Step 5 — Create JWT token
    // 🧒 Like giving the user a wristband after registration
    const token = jwt.sign(
      { userId: user._id },           // What to put in token
      process.env.JWT_SECRET,          // Secret key to sign it
      { expiresIn: '7d' }             // Token expires in 7 days
    );

    // Step 6 — Send success response back
    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    // 🧒 If anything goes wrong, send error response
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// ═══════════════════════════════════════
// 🔐 LOGIN API
// URL: POST http://localhost:5000/api/auth/login
// ═══════════════════════════════════════
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Step 1 — Check if fields are provided
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Step 2 — Find user by email
    // 🧒 Like searching the fridge for the user's form
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Step 3 — Check password
    // 🧒 bcrypt compares "sahil123" with the encrypted version
    // It automatically handles the encryption comparison!
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Step 4 — Create JWT token
    // 🧒 Give user their wristband for 7 days
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Step 5 — Send success response
    res.status(200).json({
      success: true,
      message: 'Login successful!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// ═══════════════════════════════════════
// 👤 GET PROFILE API
// URL: GET http://localhost:5000/api/auth/profile
// ═══════════════════════════════════════
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    // 🧒 Find user by ID from token
    // req.userId comes from auth middleware!
    const user = await User.findById(req.userId).select('-password');
    // .select('-password') means get everything EXCEPT password
    // 🧒 Like giving someone your ID card but covering the PIN!

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found!'
      });
    }

    res.status(200).json({
      success: true,
      user
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = router;