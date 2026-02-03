const express = require('express');
const SubjectController = require('../controllers/subject.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// CRUD operations
router.post('/', ...SubjectController.create);
router.get('/', ...SubjectController.getAll);
router.get('/:id', ...SubjectController.getById);
router.get('/code/:code', ...SubjectController.getByCode);
router.put('/:id', ...SubjectController.update);
router.delete('/:id', ...SubjectController.delete);

// Additional routes
router.get('/:id/classes', ...SubjectController.getClasses);
router.get('/:id/teachers', ...SubjectController.getTeachers);

module.exports = router;