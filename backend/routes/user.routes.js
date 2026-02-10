const express = require('express');
const UserController = require('../controllers/user.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// CRUD operations
router.post('/', ...UserController.create);
router.get('/', ...UserController.getAll);
router.get('/:id', ...UserController.getById);
router.put('/:id', ...UserController.update);
router.delete('/:id', ...UserController.delete);

// Additional routes
router.get('/search', ...UserController.search);

module.exports = router;