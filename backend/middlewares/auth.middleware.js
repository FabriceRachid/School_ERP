const JWT = require('../utils/jwt');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }
    
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token not provided'
      });
    }
    
    const decoded = JWT.verifyToken(token);
    
    // Add user info to request object
    req.user = {
      userId: decoded.userId,
      schoolId: decoded.schoolId,
      role: decoded.role
    };
    
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
      error: error.message
    });
  }
};

// Optional authentication middleware - doesn't require auth but adds user info if present
const optionalAuthMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      if (token) {
        const decoded = JWT.verifyToken(token);
        req.user = {
          userId: decoded.userId,
          schoolId: decoded.schoolId,
          role: decoded.role
        };
      }
    }
    
    next();
  } catch (error) {
    // Silently continue without user info
    next();
  }
};

module.exports = {
  authMiddleware,
  optionalAuthMiddleware
};