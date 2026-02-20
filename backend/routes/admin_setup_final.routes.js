const express = require('express');
const router = express.Router();
const AdminSetupController = require('../controllers/admin_setup_final.controller');

// Admin creates parent account (pre-activation) - ALL FIELDS MANDATORY
router.post('/parents', AdminSetupController.createParentAccount);

// Admin creates student account with temporary password - ALL FIELDS MANDATORY
router.post('/students', AdminSetupController.createStudentAccount);

// Admin creates teacher account - ALL FIELDS MANDATORY - AUTOMATIC school_id
router.post('/teachers', AdminSetupController.createTeacherAccount);

// Admin links parent to student - ALL FIELDS MANDATORY
router.post('/links', AdminSetupController.linkParentToStudent);

// Get all unactivated parent accounts for school
router.get('/unauthenticated-parents', AdminSetupController.getUnactivatedParents);

// Get all students without parent links
router.get('/students-without-parents', AdminSetupController.getStudentsWithoutParents);

module.exports = router;