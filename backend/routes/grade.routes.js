const express = require('express');
const GradeController = require('../controllers/grade.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// CRUD operations
router.post('/', ...GradeController.create);
router.put('/:id', ...GradeController.update);
router.delete('/:id', ...GradeController.delete);

// Read operations
router.get('/student/:student_id', ...GradeController.getByStudent);
router.get('/class/:class_id/subject/:subject_id', ...GradeController.getByClassAndSubject);

// Additional routes
router.get('/class/:class_id/subject/:subject_id/average', ...GradeController.getClassAverage);

module.exports = router;