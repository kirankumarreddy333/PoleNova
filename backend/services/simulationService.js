const Pole = require('../models/Pole');
const Sensor = require('../models/Sensor');

let simulationInterval = null;
let currentScenario = 'normal'; // 'normal', 'broken_wire', 'transformer_overheating', 'voltage_instability', 'offline', 'multi_fault'
const INTERVAL_MS = 5000;

const startSimulation = async (io) => {
  if (simulationInterval) return;

  const poles = await Pole.find().sort({ sequenceIndex: 1 });
  if (!poles.length) {
    console.log('Simulation failed: No poles found.');
    return;
  }

  console.log('Simulation started. Scenario:', currentScenario);

  simulationInterval = setInterval(async () => {
    for (const pole of poles) {
      let voltage = 220 + Math.random() * 15;
      let current = 7 + Math.random() * 5;
      let temperature = 30 + Math.random() * 15;
      
      // Apply scenario logic
      if (currentScenario === 'broken_wire' && (pole.poleNumber === 'A-P004' || pole.poleNumber === 'A-P005')) {
        voltage = Math.random() < 0.9 ? 4 : 40;
        current = 0.5 + Math.random(); // negligible current
      }
      
      if (currentScenario === 'transformer_overheating' && pole.poleNumber === 'A-P002') {
        temperature = 85 + Math.random() * 10;
        voltage = 205 + Math.random() * 5; // slight drop
      }
      
      if (currentScenario === 'voltage_instability') {
        if (Math.random() > 0.7) voltage = 170 + Math.random() * 90; // erratic voltage
      }
      
      if (currentScenario === 'offline' && pole.poleNumber === 'A-P003') {
        voltage = 0;
        current = 0;
      }
      
      if (currentScenario === 'multi_fault' && (pole.poleNumber === 'A-P004' || pole.poleNumber === 'A-P008')) {
        voltage = 10 + Math.random() * 5;
      }

      const reading = await Sensor.create({
        pole: pole._id,
        voltage,
        current,
        temperature,
        powerFactor: 0.85 + Math.random() * 0.1,
        frequency: 49.7 + Math.random() * 0.5,
        battery: 60 + Math.random() * 40,
        signalStrength: 50 + Math.random() * 50
      });

      let status = 'healthy';
      if (voltage <= 5) status = 'offline';
      else if (temperature > 75) status = 'warning';
      
      // Keep faulty status if there is an active fault
      if (pole.status !== 'fault' || status === 'offline') {
         pole.status = status;
      }
      
      await pole.save();
      
      if (io) {
        io.emit('sensor:update', { pole: pole._id, reading });
      }
    }
  }, INTERVAL_MS);
};

const stopSimulation = () => {
  if (simulationInterval) {
    clearInterval(simulationInterval);
    simulationInterval = null;
    console.log('Simulation stopped.');
  }
};

const setScenario = (scenario) => {
  currentScenario = scenario;
  console.log('Simulation scenario set to:', scenario);
};

const getStatus = () => {
  return {
    isRunning: !!simulationInterval,
    scenario: currentScenario
  };
};

module.exports = {
  startSimulation,
  stopSimulation,
  setScenario,
  getStatus
};
