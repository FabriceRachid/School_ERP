const express = require('express');
const StudentController = require('../controllers/student.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// CRUD operations
router.post('/', ...StudentController.create);
router.get('/', ...StudentController.getAll);
router.get('/:id', ...StudentController.getById);
router.put('/:id', ...StudentController.update);
router.delete('/:id', ...StudentController.delete);

// Additional routes
router.get('/class/:class_id', ...StudentController.getByClass);
router.get('/:id/academic-record', ...StudentController.getAcademicRecord);
router.get('/:id/payment-history', ...StudentController.getPaymentHistory);

module.exports = router;