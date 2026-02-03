const User = require('../models/user.model');
const School = require('../models/school.model');
const Password = require('../utils/password');
const JWT = require('../utils/jwt');
const { asyncHandler } = require('../middlewares/error.middleware');

class AuthController {
  // Register new user
  static register = asyncHandler(async (req, res) => {
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
    
    // Check if school exists
    const school = await School.findById(school_id);
    if (!school) {
      return res.status(400).json({
        success: false,
        message: 'School not found'
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
      message: 'User registered successfully',
      data: user
    });
  });
  
  // Login user
  static login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }
    
    // Find user by email
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // Check password
    const isPasswordValid = await Password.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // Check if user is active
    if (user.status !== 'active') {
      return res.status(401).json({
        success: false,
        message: 'Account is not active'
      });
    }
    
    // Generate tokens
    const payload = {
      userId: user.id,
      schoolId: user.school_id,
      role: user.role
    };
    
    const accessToken = JWT.generateToken(payload);
    const refreshToken = JWT.generateRefreshToken(payload);
    
    // Remove sensitive data
    delete user.password_hash;
    
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user,
        accessToken,
        refreshToken
      }
    });
  });
  
  // Refresh token
  static refreshToken = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required'
      });
    }
    
    try {
      const newAccessToken = JWT.refreshAccessToken(refreshToken);
      
      res.json({
        success: true,
        message: 'Token refreshed successfully',
        data: {
          accessToken: newAccessToken
        }
      });
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }
  });
  
  // Get current user profile
  static getProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.userId);
    
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
      message: 'Profile retrieved successfully',
      data: user
    });
  });
  
  // Update user profile
  static updateProfile = asyncHandler(async (req, res) => {
    const { first_name, last_name, phone, address, date_of_birth } = req.body;
    
    const updateData = {};
    if (first_name) updateData.first_name = first_name;
    if (last_name) updateData.last_name = last_name;
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;
    if (date_of_birth) updateData.date_of_birth = date_of_birth;
    
    const user = await User.update(req.user.userId, updateData);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });
  });
  
  // Change password
  static changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
    }
    
    // Validate new password
    const passwordValidation = Password.validatePassword(newPassword);
    if (!passwordValidation.valid) {
      return res.status(400).json({
        success: false,
        message: 'New password validation failed',
        errors: passwordValidation.errors
      });
    }
    
    // Get current user with password hash
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Check current password
    const isCurrentPasswordValid = await Password.compare(currentPassword, user.password_hash);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }
    
    // Hash new password
    const newPasswordHash = await Password.hash(newPassword);
    
    // Update password
    await User.update(req.user.userId, { password_hash: newPasswordHash });
    
    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  });
}

module.exports = AuthController;