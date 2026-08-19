const mongoose = require('mongoose');

const sensorSchema = new mongoose.Schema(
  {
    pole: { type: mongoose.Schema.Types.ObjectId, ref: 'Pole', required: true },
    voltage: { type: Number, required: true },
    current: { type: Number, required: true },
    temperature: { type: Number, required: true },
    powerFactor: { type: Number, default: 0.9 },
    frequency: { type: Number, default: 50 },
    battery: { type: Number, default: 100 },
    signalStrength: { type: Number, default: 90 },
    timestamp: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

sensorSchema.index({ pole: 1, timestamp: -1 });

module.exports = mongoose.model('Sensor', sensorSchema);
