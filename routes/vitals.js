const express = require('express');
const Vital = require('../models/Vital');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// POST - Save vitals
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { heartRate, spo2, systolic, diastolic, temperature, notes } = req.body;

    if (!heartRate || !spo2 || !systolic || !diastolic || !temperature) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all vital readings!'
      });
    }

    const vital = new Vital({
      userId: req.userId,
      heartRate: Number(heartRate),
      spo2: Number(spo2),
      bloodPressure: {
        systolic: Number(systolic),
        diastolic: Number(diastolic)
      },
      temperature: Number(temperature),
      notes: notes || ''
    });

    await vital.save();

    res.status(201).json({
      success: true,
      message: 'Vitals saved successfully!',
      vital
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// GET - Get all vitals
router.get('/', authMiddleware, async (req, res) => {
  try {
    const vitals = await Vital.find({ userId: req.userId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: vitals.length,
      vitals
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// GET - Today's vitals
router.get('/today', authMiddleware, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const vitals = await Vital.find({
      userId: req.userId,
      createdAt: { $gte: today, $lt: tomorrow }
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: vitals.length,
      vitals
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// DELETE - Delete vital
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const vital = await Vital.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!vital) {
      return res.status(404).json({
        success: false,
        message: 'Vital record not found!'
      });
    }

    await vital.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Vital record deleted successfully!'
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