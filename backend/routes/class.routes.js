const express = require('express');
const ClassController = require('../controllers/class.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// CRUD operations
router.post('/', ...ClassController.create);
router.get('/', ...ClassController.getAll);
router.get('/academic-year/:academic_year', ...ClassController.getByAcademicYear);
router.get('/:id', ...ClassController.getById);
router.put('/:id', ...ClassController.update);
router.delete('/:id', ...ClassController.delete);

// Additional routes
router.get('/:id/students', ...ClassController.getStudents);
router.get('/:id/subjects', ...ClassController.getSubjects);
router.post('/:id/subjects', ...ClassController.addSubject);
router.delete('/:id/subjects', ...ClassController.removeSubject);

module.exports = router;