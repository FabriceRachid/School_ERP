const Notification = require('../models/notification.model');
const User = require('../models/user.model');
const { asyncHandler } = require('../middlewares/error.middleware');
const { roleMiddleware } = require('../middlewares/role.middleware');

class NotificationController {
  // Create new notification
  static create = [
    roleMiddleware('admin', 'teacher'),
    asyncHandler(async (req, res) => {
      const { recipient_id, title, message, type } = req.body;
      
      // Validate required fields
      if (!recipient_id || !title || !message || !type) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields',
          required: ['recipient_id', 'title', 'message', 'type']
        });
      }
      
      // Check if recipient exists
      const recipient = await User.findById(recipient_id);
      if (!recipient) {
        return res.status(404).json({
          success: false,
          message: 'Recipient not found'
        });
      }
      
      const notificationData = {
        sender_id: req.user.userId,
        recipient_id,
        title,
        message,
        type
      };
      
      const notification = await Notification.create(notificationData);
      
      res.status(201).json({
        success: true,
        message: 'Notification created successfully',
        data: notification
      });
    })
  ];
  
  // Get notifications for current user
  static getMyNotifications = [
    asyncHandler(async (req, res) => {
      const { limit } = req.query;
      const notifications = await Notification.findByRecipient(req.user.userId, limit || 50);
      
      res.json({
        success: true,
        message: 'Notifications retrieved successfully',
        data: notifications,
        count: notifications.length
      });
    })
  ];
  
  // Get notification by ID
  static getById = [
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      const notification = await Notification.findById(id);
      
      if (!notification) {
        return res.status(404).json({
          success: false,
          message: 'Notification not found'
        });
      }
      
      // Check if user can access this notification
      if (req.user.role !== 'admin' && 
          notification.recipient_id !== req.user.userId && 
          notification.sender_id !== req.user.userId) {
        return res.status(403).json({
          success: false,
          message: 'Access denied to this notification'
        });
      }
      
      res.json({
        success: true,
        message: 'Notification retrieved successfully',
        data: notification
      });
    })
  ];
  
  // Mark notification as read
  static markAsRead = [
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      
      // Verify notification exists and user can access it
      const notification = await Notification.findById(id);
      if (!notification) {
        return res.status(404).json({
          success: false,
          message: 'Notification not found'
        });
      }
      
      if (req.user.role !== 'admin' && notification.recipient_id !== req.user.userId) {
        return res.status(403).json({
          success: false,
          message: 'Access denied to mark this notification'
        });
      }
      
      const updatedNotification = await Notification.markAsRead(id);
      
      res.json({
        success: true,
        message: 'Notification marked as read',
        data: updatedNotification
      });
    })
  ];
  
  // Mark all notifications as read
  static markAllAsRead = [
    asyncHandler(async (req, res) => {
      const result = await Notification.markAllAsRead(req.user.userId);
      
      res.json({
        success: true,
        message: 'All notifications marked as read',
        data: result
      });
    })
  ];
  
  // Get unread notifications count
  static getUnreadCount = [
    asyncHandler(async (req, res) => {
      const count = await Notification.getUnreadCount(req.user.userId);
      
      res.json({
        success: true,
        message: 'Unread count retrieved successfully',
        data: { count }
      });
    })
  ];
  
  // Get recent notifications for school
  static getSchoolNotifications = [
    roleMiddleware('admin'),
    asyncHandler(async (req, res) => {
      const { school_id } = req.user;
      const { limit } = req.query;
      
      const notifications = await Notification.getRecentBySchool(school_id, limit || 20);
      
      res.json({
        success: true,
        message: 'School notifications retrieved successfully',
        data: notifications,
        count: notifications.length
      });
    })
  ];
  
  // Delete notification
  static delete = [
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      
      // Verify notification exists
      const notification = await Notification.findById(id);
      if (!notification) {
        return res.status(404).json({
          success: false,
          message: 'Notification not found'
        });
      }
      
      // Check if user can delete this notification
      if (req.user.role !== 'admin' && 
          notification.recipient_id !== req.user.userId && 
          notification.sender_id !== req.user.userId) {
        return res.status(403).json({
          success: false,
          message: 'Access denied to delete this notification'
        });
      }
      
      const deletedNotification = await Notification.delete(id);
      
      res.json({
        success: true,
        message: 'Notification deleted successfully'
      });
    })
  ];
}

module.exports = NotificationController;