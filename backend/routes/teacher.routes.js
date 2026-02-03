const express = require('express');
const TeacherController = require('../controllers/teacher.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// CRUD operations
router.post('/', ...TeacherController.create);
router.get('/', ...TeacherController.getAll);
router.get('/:id', ...TeacherController.getById);
router.put('/:id', ...TeacherController.update);
router.delete('/:id', ...TeacherController.delete);

// Additional routes
router.get('/:id/assignments', ...TeacherController.getAssignments);
router.get('/:id/students', ...TeacherController.getStudents);

module.exports = router;