const { startSimulation, stopSimulation, setScenario, getStatus } = require('../services/simulationService');
const Pole = require('../models/Pole');
const Fault = require('../models/Fault');
const Sensor = require('../models/Sensor');

// @desc Start the sensor simulation
// @route POST /api/simulation/start
const start = async (req, res, next) => {
  try {
    const io = req.app.get('io');
    await startSimulation(io);
    res.json({ success: true, message: 'Simulation started', status: getStatus() });
  } catch (err) {
    next(err);
  }
};

// @desc Stop the sensor simulation
// @route POST /api/simulation/stop
const stop = async (req, res, next) => {
  try {
    stopSimulation();
    res.json({ success: true, message: 'Simulation stopped', status: getStatus() });
  } catch (err) {
    next(err);
  }
};

// @desc Change the simulation scenario
// @route POST /api/simulation/scenario
const changeScenario = async (req, res, next) => {
  try {
    const { scenario } = req.body;
    if (!scenario) return res.status(400).json({ success: false, message: 'Scenario is required' });
    
    setScenario(scenario);
    res.json({ success: true, message: `Scenario changed to ${scenario}`, status: getStatus() });
  } catch (err) {
    next(err);
  }
};

// @desc Get simulation status
// @route GET /api/simulation/status
const getSimStatus = async (req, res, next) => {
  try {
    res.json({ success: true, status: getStatus() });
  } catch (err) {
    next(err);
  }
};

// @desc Reset the network to healthy state (for demo)
// @route POST /api/simulation/reset
const resetNetwork = async (req, res, next) => {
  try {
    // Delete all open faults
    await Fault.deleteMany({});
    
    // Reset all poles to healthy
    await Pole.updateMany({}, { status: 'healthy' });
    
    // Clear recent erratic sensor readings
    // await Sensor.deleteMany({}); // Might be too destructive, keep history for now
    
    setScenario('normal');
    
    const io = req.app.get('io');
    if (io) io.emit('network:reset');

    res.json({ success: true, message: 'Network reset to healthy state' });
  } catch (err) {
    next(err);
  }
};

module.exports = { start, stop, changeScenario, getSimStatus, resetNetwork };
