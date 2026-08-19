const express = require('express');
const router = express.Router();
const { start, stop, changeScenario, getSimStatus, resetNetwork } = require('../controllers/simulationController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/status', getSimStatus);
router.post('/start', authorize('super_admin', 'admin', 'engineer'), start);
router.post('/stop', authorize('super_admin', 'admin', 'engineer'), stop);
router.post('/scenario', authorize('super_admin', 'admin', 'engineer'), changeScenario);
router.post('/reset', authorize('super_admin', 'admin', 'engineer'), resetNetwork);

module.exports = router;
