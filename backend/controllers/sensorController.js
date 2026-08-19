const Sensor = require('../models/Sensor');
const Pole = require('../models/Pole');

// @desc Ingest a new sensor reading for a pole (from device or simulator)
// @route POST /api/sensors
const addReading = async (req, res, next) => {
  try {
    const { pole, voltage, current, temperature, powerFactor, frequency, battery, signalStrength } = req.body;

    const poleExists = await Pole.findById(pole);
    if (!poleExists) return res.status(404).json({ success: false, message: 'Pole not found' });

    const reading = await Sensor.create({
      pole,
      voltage,
      current,
      temperature,
      powerFactor,
      frequency,
      battery,
      signalStrength
    });

    // Update pole status based on reading
    let status = 'healthy';
    if (voltage <= 5) status = 'offline';
    else if (temperature > 75) status = 'warning';
    poleExists.status = status;
    await poleExists.save();

    // Broadcast via socket.io if available
    const io = req.app.get('io');
    if (io) io.emit('sensor:update', { pole: poleExists._id, reading });

    res.status(201).json({ success: true, data: reading });
  } catch (err) {
    next(err);
  }
};

// @desc Get sensor history for a pole
// @route GET /api/sensors/:poleId
const getReadings = async (req, res, next) => {
  try {
    const { limit = 50 } = req.query;
    const readings = await Sensor.find({ pole: req.params.poleId })
      .sort({ timestamp: -1 })
      .limit(Number(limit));
    res.json({ success: true, count: readings.length, data: readings });
  } catch (err) {
    next(err);
  }
};

// @desc Get latest reading for every pole (for dashboard/table view)
// @route GET /api/sensors
const getLatestAll = async (req, res, next) => {
  try {
    const latest = await Sensor.aggregate([
      { $sort: { timestamp: -1 } },
      { $group: { _id: '$pole', reading: { $first: '$$ROOT' } } }
    ]);

    const populated = await Pole.populate(latest, { path: '_id' });

    const data = populated.map((item) => ({
      pole: item._id,
      reading: item.reading
    }));

    res.json({ success: true, count: data.length, data });
  } catch (err) {
    next(err);
  }
};

module.exports = { addReading, getReadings, getLatestAll };
