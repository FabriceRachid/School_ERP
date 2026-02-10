const express = require('express');
const SchoolController = require('../controllers/school.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// CRUD operations
router.post('/', SchoolController.create);
router.get('/', SchoolController.getAll);
router.get('/:id', SchoolController.getById);
router.put('/:id', SchoolController.update);
router.delete('/:id', SchoolController.delete);

// Additional routes
router.get('/:id/stats', SchoolController.getStats);

module.exports = router;