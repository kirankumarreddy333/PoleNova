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
    evidence: [{ type: String }],
    aiRecommendation: { type: String, default: '' },
    detectedAt: { type: Date, default: Date.now },
    resolvedAt: { type: Date },
    resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    notes: { type: String, default: '' },
    downtimeMinutes: { type: Number, default: 0 }
  },
  { timestamps: true }
);

// Indexes for common queries
faultSchema.index({ status: 1 });
faultSchema.index({ severity: 1 });
faultSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Fault', faultSchema);
