const express = require('express');
const router = express.Router();
const { runDetection, getFaults, updateFault, deleteFault } = require('../controllers/faultController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/', getFaults);
router.post('/detect', authorize('super_admin', 'admin', 'engineer'), runDetection);
router.put('/:id', authorize('super_admin', 'admin', 'engineer', 'technician'), updateFault);
router.delete('/:id', authorize('super_admin', 'admin'), deleteFault);

module.exports = router;
