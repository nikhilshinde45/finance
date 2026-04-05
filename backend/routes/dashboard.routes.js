const express = require('express');
const { getDashboardSummary } = require('../controllers/dashboard.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect);

router.get('/summary', authorize('analyst', 'admin', 'viewer'), getDashboardSummary);

module.exports = router;
