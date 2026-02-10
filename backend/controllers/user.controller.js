const User = require('../models/user.model');
const Password = require('../utils/password');
const { asyncHandler } = require('../middlewares/error.middleware');
const { roleMiddleware, schoolAccessMiddleware } = require('../middlewares/role.middleware');

class UserController {
  // Create new user (admin only)
  static create = [
    roleMiddleware('admin'),
    asyncHandler(async (req, res) => {
      const { school_id, first_name, last_name, email, password, role, phone, address, date_of_birth } = req.body;
      
      // Validate required fields
      if (!school_id || !first_name || !last_name || !email || !password || !role) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields',
          required: ['school_id', 'first_name', 'last_name', 'email', 'password', 'role']
        });
      }
      
      // Validate role
      const validRoles = ['admin', 'teacher', 'student'];
      if (!validRoles.includes(role)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid role',
          validRoles
        });
      }
      
      // Validate password
      const passwordValidation = Password.validatePassword(password);
      if (!passwordValidation.valid) {
        return res.status(400).json({
          success: false,
          message: 'Password validation failed',
          errors: passwordValidation.errors
        });
      }
      
      // Check if email already exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'Email already registered'
        });
      }
      
      // Hash password
      const password_hash = await Password.hash(password);
      
      // Create user
      const userData = {
        school_id,
        first_name,
        last_name,
        email,
        password_hash,
        role,
        phone: phone || null,
        address: address || null,
        date_of_birth: date_of_birth || null
      };
      
      const user = await User.create(userData);
      
      // Remove sensitive data
      delete user.password_hash;
      
      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: user
      });
    })
  ];
  
  // Get all users in school (admin/teacher)
  static getAll = [
    roleMiddleware('admin', 'teacher'),
    asyncHandler(async (req, res) => {
      const { school_id } = req.user;
      const users = await User.findBySchool(school_id);
      
      // Remove sensitive data
      const sanitizedUsers = users.map(user => {
        delete user.password_hash;
        return user;
      });
      
      res.json({
        success: true,
        message: 'Users retrieved successfully',
        data: sanitizedUsers,
        count: sanitizedUsers.length
      });
    })
  ];
  
  // Get user by ID
  static getById = [
    roleMiddleware('admin', 'teacher'),
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      const user = await User.findById(id);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      
      // Check school access
      if (req.user.role !== 'admin' && user.school_id !== req.user.schoolId) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }
      
      // Remove sensitive data
      delete user.password_hash;
      
      res.json({
        success: true,
        message: 'User retrieved successfully',
        data: user
      });
    })
  ];
  
  // Update user
  static update = [
    roleMiddleware('admin'),
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      const updateData = req.body;
      
      const user = await User.update(id, updateData);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      
      // Remove sensitive data
      delete user.password_hash;
      
      res.json({
        success: true,
        message: 'User updated successfully',
        data: user
      });
    })
  ];
  
  // Delete user (soft delete)
  static delete = [
    roleMiddleware('admin'),
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      const user = await User.delete(id);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      
      res.json({
        success: true,
        message: 'User deleted successfully'
      });
    })
  ];
  
  // Search users
  static search = [
    roleMiddleware('admin', 'teacher'),
    asyncHandler(async (req, res) => {
      const { q } = req.query;
      const { school_id } = req.user;
      
      if (!q) {
        return res.status(400).json({
          success: false,
          message: 'Search query is required'
        });
      }
      
      const users = await User.search(school_id, q);
      
      res.json({
        success: true,
        message: 'Users searched successfully',
        data: users,
        count: users.length
      });
    })
  ];
}

module.exports = UserController;