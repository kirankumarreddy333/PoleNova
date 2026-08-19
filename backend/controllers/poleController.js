const Pole = require('../models/Pole');
const Sensor = require('../models/Sensor');

// @desc Get all poles (search, filter, pagination)
// @route GET /api/poles
const getPoles = async (req, res, next) => {
  try {
    const { search, status, feeder, village, page = 1, limit = 10 } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { poleNumber: { $regex: search, $options: 'i' } },
        { area: { $regex: search, $options: 'i' } },
        { village: { $regex: search, $options: 'i' } }
      ];
    }
    if (status) query.status = status;
    if (feeder) query.feeder = feeder;
    if (village) query.village = village;

    const total = await Pole.countDocuments(query);
    const poles = await Pole.find(query)
      .sort({ sequenceIndex: 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      success: true,
      count: poles.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: poles
    });
  } catch (err) {
    next(err);
  }
};

// @desc Get single pole with latest sensor reading
// @route GET /api/poles/:id
const getPole = async (req, res, next) => {
  try {
    const pole = await Pole.findById(req.params.id);
    if (!pole) return res.status(404).json({ success: false, message: 'Pole not found' });

    const latestSensor = await Sensor.findOne({ pole: pole._id }).sort({ timestamp: -1 });

    res.json({ success: true, data: { ...pole.toObject(), latestSensor } });
  } catch (err) {
    next(err);
  }
};

// @desc Create pole
// @route POST /api/poles
const createPole = async (req, res, next) => {
  try {
    const count = await Pole.countDocuments();
    const pole = await Pole.create({
      ...req.body,
      sequenceIndex: req.body.sequenceIndex ?? count + 1,
      createdBy: req.user._id
    });
    res.status(201).json({ success: true, data: pole });
  } catch (err) {
    next(err);
  }
};

// @desc Update pole
// @route PUT /api/poles/:id
const updatePole = async (req, res, next) => {
  try {
    const pole = await Pole.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!pole) return res.status(404).json({ success: false, message: 'Pole not found' });
    res.json({ success: true, data: pole });
  } catch (err) {
    next(err);
  }
};

// @desc Delete pole
// @route DELETE /api/poles/:id
const deletePole = async (req, res, next) => {
  try {
    const pole = await Pole.findByIdAndDelete(req.params.id);
    if (!pole) return res.status(404).json({ success: false, message: 'Pole not found' });
    await Sensor.deleteMany({ pole: pole._id });
    res.json({ success: true, message: 'Pole deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getPoles, getPole, createPole, updatePole, deletePole };
