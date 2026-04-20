const mongoose = require('mongoose');

// 🧒 This is the "form template" for a Vital record
// Every vital reading saved must follow this structure
const vitalSchema = new mongoose.Schema({

  // 🧒 This links each vital record to a specific user
  // Like writing your name on top of your form!
  userId: {
    type: mongoose.Schema.Types.ObjectId,  // Special ID type in MongoDB
    ref: 'User',                           // Links to User model
    required: true
  },

  // Heart Rate in bpm
  heartRate: {
    type: Number,
    required: true
  },

  // SpO2 percentage
  spo2: {
    type: Number,
    required: true
  },

  // Blood Pressure
  bloodPressure: {
    systolic: {
      type: Number,
      required: true
    },
    diastolic: {
      type: Number,
      required: true
    }
  },

  // Temperature in Fahrenheit
  temperature: {
    type: Number,
    required: true
  },

  // Status based on readings
  status: {
    type: String,
    enum: ['Normal', 'Warning', 'Critical'],  // Only these 3 values allowed
    default: 'Normal'
  },

  // Notes (optional)
  notes: {
    type: String,
    default: ''
  },

  // When was this reading taken
  createdAt: {
    type: Date,
    default: Date.now
  }

});

// 🧒 This automatically calculates status based on readings
// Before saving, check if readings are normal or warning
vitalSchema.pre('save', async function() {
  const isWarning =
    this.heartRate < 60 || this.heartRate > 100 ||
    this.spo2 < 95 ||
    this.bloodPressure.systolic > 130 ||
    this.temperature > 99.5;

  const isCritical =
    this.heartRate < 50 || this.heartRate > 120 ||
    this.spo2 < 90 ||
    this.bloodPressure.systolic > 140 ||
    this.temperature > 101;

  if (isCritical) {
    this.status = 'Critical';
  } else if (isWarning) {
    this.status = 'Warning';
  } else {
    this.status = 'Normal';
  }
});

const Vital = mongoose.model('Vital', vitalSchema);

module.exports = Vital;