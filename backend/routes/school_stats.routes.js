const express = require('express');
const router = express.Router();
const SchoolStatsController = require('../controllers/school_stats.controller');

// Get real school statistics
router.get('/stats', SchoolStatsController.getSchoolStats);

// Get students distribution by class (for charts)
router.get('/students-by-class', SchoolStatsController.getStudentsByClass);

// Get account status distribution (for charts)
router.get('/account-status', SchoolStatsController.getAccountStatusDistribution);

module.exports = router;