const express = require('express');
const PaymentController = require('../controllers/payment.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// CRUD operations
router.post('/', ...PaymentController.create);
router.get('/:id', ...PaymentController.getById);
router.put('/:id', ...PaymentController.update);
router.delete('/:id', ...PaymentController.delete);

// Read operations
router.get('/student/:student_id', ...PaymentController.getByStudent);
router.get('/fee/:fee_id', ...PaymentController.getByFee);

// Additional routes
router.get('/stats/school', ...PaymentController.getSchoolStats);

module.exports = router;