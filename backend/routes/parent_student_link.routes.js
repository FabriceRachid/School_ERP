const express = require('express');
const ParentStudentLinkController = require('../controllers/parent_student_link.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');

const router = express.Router();

// Public route for parent registration with invitation
router.post('/register-with-invitation', ParentStudentLinkController.registerWithInvitation);

// All other routes require authentication
router.use(authMiddleware);

// Admin routes
router.post('/links', ParentStudentLinkController.createLink); // Create parent-student link
router.post('/invitations', ParentStudentLinkController.createInvitation); // Create invitation
router.delete('/links/:parent_id/:student_id', ParentStudentLinkController.removeLink); // Remove link

// Parent routes
router.get('/my-students', ParentStudentLinkController.getParentStudents); // Get parent's students

// Admin/Teacher routes
router.get('/students/:student_id/parents', ParentStudentLinkController.getStudentParents); // Get student's parents

module.exports = router;