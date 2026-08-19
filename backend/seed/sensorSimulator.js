/**
 * Continuously generates realistic dummy sensor data for every pole and
 * broadcasts it over Socket.io (via a lightweight client connection) and
 * writes it to MongoDB, simulating live IoT sensor traffic.
 *
 * Run with: npm run simulate   (requires the backend server to already be running)
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Pole = require('../models/Pole');
const Sensor = require('../models/Sensor');

const INTERVAL_MS = 5000;

const run = async () => {
  await connectDB();
  const poles = await Pole.find();

  if (!poles.length) {
    console.log('No poles found. Run "npm run seed" first.');
    process.exit(0);
  }

  console.log(`Simulating live sensor data for ${poles.length} poles every ${INTERVAL_MS / 1000}s...`);

  setInterval(async () => {
    for (const pole of poles) {
      const isKnownFault = pole.poleNumber === 'A-P003' || pole.poleNumber === 'A-P004';
      const voltage = isKnownFault ? Math.random() < 0.9 ? 0 : 40 : 220 + Math.random() * 15;
      const reading = await Sensor.create({
        pole: pole._id,
        voltage,
        current: isKnownFault ? 0 : 7 + Math.random() * 5,
        temperature: 30 + Math.random() * 25,
        powerFactor: 0.85 + Math.random() * 0.1,
        frequency: 49.7 + Math.random() * 0.5,
        battery: 60 + Math.random() * 40,
        signalStrength: 50 + Math.random() * 50
      });

      let status = 'healthy';
      if (voltage <= 5) status = 'offline';
      else if (reading.temperature > 75) status = 'warning';
      pole.status = status;
      await pole.save();
    }
    console.log(`[${new Date().toLocaleTimeString()}] Generated readings for ${poles.length} poles`);
  }, INTERVAL_MS);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
