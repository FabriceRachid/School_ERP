const express = require('express');
const NotificationController = require('../controllers/notification.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// CRUD operations
router.post('/', ...NotificationController.create);
router.get('/:id', ...NotificationController.getById);
router.delete('/:id', ...NotificationController.delete);

// Read operations
router.get('/', ...NotificationController.getMyNotifications);
router.get('/unread/count', ...NotificationController.getUnreadCount);

// Update operations
router.put('/:id/read', ...NotificationController.markAsRead);
router.put('/read-all', ...NotificationController.markAllAsRead);

// Admin routes
router.get('/school/recent', ...NotificationController.getSchoolNotifications);

module.exports = router;