const User = require('../models/user.model');
const Password = require('../utils/password');
const JWT = require('../utils/jwt');

class AuthService {
  static async register(userData) {
    // Validate password
    const passwordValidation = Password.validatePassword(userData.password);
    if (!passwordValidation.valid) {
      throw new Error(`Password validation failed: ${passwordValidation.errors.join(', ')}`);
    }
    
    // Check if email already exists
    const existingUser = await User.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('Email already registered');
    }
    
    // Hash password
    const password_hash = await Password.hash(userData.password);
    
    // Create user
    const user = await User.create({
      ...userData,
      password_hash
    });
    
    delete user.password_hash;
    return user;
  }
  
  static async login(email, password) {
    // Find user
    const user = await User.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    // Check password
    const isPasswordValid = await Password.compare(password, user.password_hash);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }
    
    // Check if user is active
    if (user.status !== 'active') {
      throw new Error('Account is not active');
    }
    
    // Generate tokens
    const payload = {
      userId: user.id,
      schoolId: user.school_id,
      role: user.role
    };
    
    const accessToken = JWT.generateToken(payload);
    const refreshToken = JWT.generateRefreshToken(payload);
    
    delete user.password_hash;
    
    return {
      user,
      accessToken,
      refreshToken
    };
  }
  
  static async refreshAccessToken(refreshToken) {
    return JWT.refreshAccessToken(refreshToken);
  }
  
  static async changePassword(userId, currentPassword, newPassword) {
    // Validate new password
    const passwordValidation = Password.validatePassword(newPassword);
    if (!passwordValidation.valid) {
      throw new Error(`New password validation failed: ${passwordValidation.errors.join(', ')}`);
    }
    
    // Get current user
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    // Check current password
    const isCurrentPasswordValid = await Password.compare(currentPassword, user.password_hash);
    if (!isCurrentPasswordValid) {
      throw new Error('Current password is incorrect');
    }
    
    // Hash new password
    const newPasswordHash = await Password.hash(newPassword);
    
    // Update password
    await User.update(userId, { password_hash: newPasswordHash });
    
    return { message: 'Password changed successfully' };
  }
  
  static async validateToken(token) {
    try {
      const decoded = JWT.verifyToken(token);
      const user = await User.findById(decoded.userId);
      
      if (!user || user.status !== 'active') {
        throw new Error('Invalid user');
      }
      
      return decoded;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }
}

module.exports = AuthService;