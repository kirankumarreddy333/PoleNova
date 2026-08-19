const express = require('express');
const router = express.Router();
const { getOverview, getTrends } = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/overview', getOverview);
router.get('/trends', getTrends);

module.exports = router;
