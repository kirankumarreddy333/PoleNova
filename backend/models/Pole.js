const mongoose = require('mongoose');

const poleSchema = new mongoose.Schema(
  {
    poleNumber: { type: String, required: true, unique: true, trim: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    area: { type: String, required: true },
    village: { type: String, required: true },
    feeder: { type: String, required: true },
    transformer: { type: String, default: '' },
    installationDate: { type: Date, default: Date.now },
    sequenceIndex: { type: Number, required: true }, // used to determine adjacency for AI fault detection
    status: {
      type: String,
      enum: ['healthy', 'warning', 'fault', 'offline'],
      default: 'healthy'
    },
    healthScore: { type: Number, default: 100, min: 0, max: 100 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Pole', poleSchema);
