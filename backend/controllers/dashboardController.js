const Pole = require('../models/Pole');
const Fault = require('../models/Fault');
const Sensor = require('../models/Sensor');

// @desc Aggregated stats for dashboard overview cards + charts
// @route GET /api/dashboard/overview
const getOverview = async (req, res, next) => {
  try {
    const totalPoles = await Pole.countDocuments();
    const healthyPoles = await Pole.countDocuments({ status: 'healthy' });
    const warningPoles = await Pole.countDocuments({ status: 'warning' });
    const faultyPoles = await Pole.countDocuments({ status: 'fault' });
    const offlinePoles = await Pole.countDocuments({ status: 'offline' });

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const todaysFaults = await Fault.countDocuments({ createdAt: { $gte: startOfToday } });
    const openFaults = await Fault.countDocuments({ status: { $ne: 'resolved' } });

    const recentAlerts = await Fault.find()
      .populate('poleFrom', 'poleNumber')
      .populate('poleTo', 'poleNumber')
      .sort({ createdAt: -1 })
      .limit(5);

    const networkHealthPercent = totalPoles > 0 ? Math.round((healthyPoles / totalPoles) * 100) : 100;

    res.json({
      success: true,
      data: {
        totalPoles,
        healthyPoles,
        warningPoles,
        faultyPoles,
        offlinePoles,
        todaysFaults,
        openFaults,
        networkHealthPercent,
        recentAlerts
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc Recent sensor trend data (last N readings) for charts
// @route GET /api/dashboard/trends
const getTrends = async (req, res, next) => {
  try {
    const { limit = 20 } = req.query;
    const readings = await Sensor.find().sort({ timestamp: -1 }).limit(Number(limit)).populate('pole', 'poleNumber');
    res.json({ success: true, data: readings.reverse() });
  } catch (err) {
    next(err);
  }
};

module.exports = { getOverview, getTrends };
