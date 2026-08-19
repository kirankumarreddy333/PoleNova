const express = require('express');
const router = express.Router();
const { getPoles, getPole, createPole, updatePole, deletePole } = require('../controllers/poleController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getPoles)
  .post(authorize('super_admin', 'admin', 'engineer'), createPole);

router.route('/:id')
  .get(getPole)
  .put(authorize('super_admin', 'admin', 'engineer'), updatePole)
  .delete(authorize('super_admin', 'admin'), deletePole);

module.exports = router;
