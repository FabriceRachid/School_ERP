const express = require('express');
const TimetableAssignmentController = require('../controllers/timetable_assignment.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Assignment routes
router.get('/assignments/class/:class_id', ...TimetableAssignmentController.getClassAssignments);
router.get('/class/:class_id/subjects-teachers', ...TimetableAssignmentController.getClassSubjectTeachers);
router.post('/assignments', ...TimetableAssignmentController.createAssignment);
router.delete('/assignments/:id', ...TimetableAssignmentController.deleteAssignment);
router.get('/assignments/teacher/:teacher_id', ...TimetableAssignmentController.getTeacherAssignments);

module.exports = router;