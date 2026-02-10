const express = require('express');
const ParentController = require('../controllers/parent.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// CRUD operations
router.post('/', ...ParentController.create);
router.get('/:id', ...ParentController.getById);
router.put('/:id', ...ParentController.update);
router.delete('/:id', ...ParentController.delete);

// Relationship operations
router.get('/student/:student_id', ...ParentController.getByStudent);
router.get('/:id/students', ...ParentController.getStudents);
router.post('/:parent_id/student/:student_id/link', ...ParentController.linkToStudent);
router.delete('/:parent_id/student/:student_id/unlink', ...ParentController.unlinkFromStudent);
router.put('/student/:student_id/parent/:parent_id/primary', ...ParentController.setPrimaryParent);

module.exports = router;