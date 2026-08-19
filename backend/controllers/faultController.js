const Fault = require('../models/Fault');
const Pole = require('../models/Pole');
const Sensor = require('../models/Sensor');
const { detectFaults } = require('../services/aiFaultDetection');

// @desc Run AI fault detection across all poles (grouped by feeder) and persist new faults
// @route POST /api/faults/detect
const runDetection = async (req, res, next) => {
  try {
    const poles = await Pole.find();
    const feederGroups = {};
    poles.forEach((p) => {
      if (!feederGroups[p.feeder]) feederGroups[p.feeder] = [];
      feederGroups[p.feeder].push(p);
    });

    const allCandidates = [];

    for (const feeder of Object.keys(feederGroups)) {
      const feederPoles = feederGroups[feeder];
      const readings = await Promise.all(
        feederPoles.map(async (pole) => {
          const latestSensor = await Sensor.findOne({ pole: pole._id }).sort({ timestamp: -1 });
          return { pole, latestSensor };
        })
      );
      const candidates = detectFaults(readings);
      allCandidates.push(...candidates);
    }

    const created = [];
    for (const c of allCandidates) {
      // avoid duplicate open faults between the same pole pair
      const existing = await Fault.findOne({
        poleFrom: c.poleFromId,
        poleTo: c.poleToId,
        status: { $ne: 'resolved' }
      });
      if (existing) continue;

      const fault = await Fault.create({
        poleFrom: c.poleFromId,
        poleTo: c.poleToId,
        severity: c.severity,
        priority: c.priority,
        rootCause: c.rootCause,
        confidence: c.confidence,
        evidence: c.evidence,
        aiRecommendation: c.aiRecommendation
      });

      const poleTo = await Pole.findById(c.poleToId);
      if (poleTo) {
        poleTo.status = 'fault';
        await poleTo.save();
      }

      created.push(fault);
    }

    const io = req.app.get('io');
    if (io && created.length) io.emit('fault:new', created);

    res.json({ success: true, detected: allCandidates.length, created: created.length, data: created });
  } catch (err) {
    next(err);
  }
};

// @desc Get all faults (filter by status/severity)
// @route GET /api/faults
const getFaults = async (req, res, next) => {
  try {
    const { status, severity, page = 1, limit = 10 } = req.query;
    const query = {};
    if (status) query.status = status;
    if (severity) query.severity = severity;

    const total = await Fault.countDocuments(query);
    const faults = await Fault.find(query)
      .populate('poleFrom', 'poleNumber area village')
      .populate('poleTo', 'poleNumber area village')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      success: true,
      count: faults.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: faults
    });
  } catch (err) {
    next(err);
  }
};

// @desc Update fault status/rootCause/notes
// @route PUT /api/faults/:id
const updateFault = async (req, res, next) => {
  try {
    const updates = { ...req.body };
    if (updates.status === 'resolved') {
      updates.resolvedAt = new Date();
      updates.resolvedBy = req.user._id;
      
      const existingFault = await Fault.findById(req.params.id);
      if (existingFault && existingFault.createdAt) {
        updates.downtimeMinutes = Math.round((new Date().getTime() - new Date(existingFault.createdAt).getTime()) / 60000);
      }
    }

    const fault = await Fault.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true
    });
    if (!fault) return res.status(404).json({ success: false, message: 'Fault not found' });

    if (updates.status === 'resolved') {
      const poleTo = await Pole.findById(fault.poleTo);
      if (poleTo) {
        poleTo.status = 'healthy';
        await poleTo.save();
      }
    }

    res.json({ success: true, data: fault });
  } catch (err) {
    next(err);
  }
};

// @desc Delete fault
// @route DELETE /api/faults/:id
const deleteFault = async (req, res, next) => {
  try {
    const fault = await Fault.findByIdAndDelete(req.params.id);
    if (!fault) return res.status(404).json({ success: false, message: 'Fault not found' });
    res.json({ success: true, message: 'Fault deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { runDetection, getFaults, updateFault, deleteFault };
