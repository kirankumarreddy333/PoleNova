const mongoose = require('mongoose');

const faultSchema = new mongoose.Schema(
  {
    poleFrom: { type: mongoose.Schema.Types.ObjectId, ref: 'Pole', required: true },
    poleTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Pole', required: true },
    severity: { type: String, enum: ['critical', 'medium', 'low'], default: 'medium' },
    priority: { type: String, enum: ['critical', 'medium', 'low'], default: 'medium' },
    status: { type: String, enum: ['open', 'in_progress', 'resolved'], default: 'open' },
    rootCause: {
      type: String,
      enum: ['broken_wire', 'transformer_failure', 'tree_fall', 'short_circuit', 'equipment_damage', 'unknown'],
      default: 'unknown'
    },
    confidence: { type: Number, min: 0, max: 100, default: 80 },
    aiRecommendation: { type: String, default: '' },
    detectedAt: { type: Date, default: Date.now },
    resolvedAt: { type: Date },
    resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    notes: { type: String, default: '' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Fault', faultSchema);
