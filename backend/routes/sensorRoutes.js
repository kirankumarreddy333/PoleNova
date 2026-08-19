const express = require('express');
const router = express.Router();
const { addReading, getReadings, getLatestAll } = require('../controllers/sensorController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getLatestAll);
router.post('/', addReading);
router.get('/:poleId', getReadings);

module.exports = router;
