/**
 * Seeds the database with demo users, poles, and initial sensor readings.
 * Run with: npm run seed
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Pole = require('../models/Pole');
const Sensor = require('../models/Sensor');
const Fault = require('../models/Fault');

const VILLAGES = ['Rampur', 'Shivpur', 'Ganeshpur', 'Lakshmipur'];
const FEEDERS = ['Feeder-A', 'Feeder-B'];

const run = async () => {
  await connectDB();

  console.log('Clearing existing data...');
  await Promise.all([User.deleteMany(), Pole.deleteMany(), Sensor.deleteMany(), Fault.deleteMany()]);

  console.log('Creating users...');
  const users = await User.create([
    { name: 'Super Admin', email: 'superadmin@polenova.ai', password: 'password123', role: 'super_admin' },
    { name: 'Admin User', email: 'admin@polenova.ai', password: 'password123', role: 'admin' },
    { name: 'Engineer User', email: 'engineer@polenova.ai', password: 'password123', role: 'engineer' },
    { name: 'Technician User', email: 'technician@polenova.ai', password: 'password123', role: 'technician' }
  ]);

  console.log('Creating poles...');
  const poles = [];
  let seq = 1;
  for (const feeder of FEEDERS) {
    for (let i = 1; i <= 8; i++) {
      poles.push({
        poleNumber: `${feeder.slice(-1)}-P${String(i).padStart(3, '0')}`,
        latitude: 17.385 + Math.random() * 0.05,
        longitude: 78.4867 + Math.random() * 0.05,
        area: `Sector ${i}`,
        village: VILLAGES[i % VILLAGES.length],
        feeder,
        transformer: `TR-${feeder.slice(-1)}-${Math.ceil(i / 4)}`,
        sequenceIndex: seq++,
        createdBy: users[0]._id
      });
    }
  }
  const createdPoles = await Pole.insertMany(poles);

  console.log('Creating initial sensor readings...');
  const readings = createdPoles.map((pole, idx) => {
    // simulate a fault on the 3rd pole of Feeder-A (index 2)
    const isFaultDemo = pole.poleNumber === 'A-P003' || pole.poleNumber === 'A-P004';
    const voltage = isFaultDemo ? 0 : 225 + Math.random() * 10;
    return {
      pole: pole._id,
      voltage,
      current: isFaultDemo ? 0 : 8 + Math.random() * 4,
      temperature: 35 + Math.random() * 15,
      powerFactor: 0.85 + Math.random() * 0.1,
      frequency: 49.8 + Math.random() * 0.4,
      battery: 70 + Math.random() * 30,
      signalStrength: 60 + Math.random() * 40
    };
  });
  await Sensor.insertMany(readings);

  console.log('Demo credentials:');
  console.log('  Super Admin : superadmin@polenova.ai / password123');
  console.log('  Admin       : admin@polenova.ai / password123');
  console.log('  Engineer    : engineer@polenova.ai / password123');
  console.log('  Technician  : technician@polenova.ai / password123');
  console.log(`Seeded ${createdPoles.length} poles across ${FEEDERS.length} feeders.`);
  console.log('Tip: POST /api/faults/detect (as engineer/admin) to run AI detection on the seeded fault at A-P003 -> A-P004.');

  await mongoose.connection.close();
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
