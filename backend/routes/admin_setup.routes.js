const express = require('express');
const AdminSetupController = require('../controllers/admin_setup.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');

const router = express.Router();

// All routes require authentication and admin role
router.use(authMiddleware);

// Admin setup routes
router.post('/parents', AdminSetupController.createParentAccount); // Create parent account
router.post('/students', AdminSetupController.createStudentAccount); // Create student account
router.post('/links', AdminSetupController.linkParentToStudent); // Link parent to student

// Admin management routes
router.get('/unactivated-parents', AdminSetupController.getUnactivatedParents); // Get unactivated parents
router.get('/students-without-parents', AdminSetupController.getStudentsWithoutParents); // Get students without parents

module.exports = router;