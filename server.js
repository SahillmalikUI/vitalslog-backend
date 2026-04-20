const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const app = express();
app.use(express.json());

// Import routes
const authRoutes = require('./routes/auth');
const vitalsRoutes = require('./routes/vitals');

// Connect MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected Successfully!'))
  .catch((error) => console.log('❌ MongoDB Connection Failed:', error.message));

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/vitals', vitalsRoutes); // 🧒 New!

app.get('/', (req, res) => {
  res.json({
    message: '🏥 VitalsLog API is running!',
    status: 'success'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
  console.log(`🌍 Visit: http://localhost:${PORT}`);
});