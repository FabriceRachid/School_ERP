const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }
    
    // Check if user has required role
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
        requiredRoles: allowedRoles,
        userRole: req.user.role
      });
    }
    
    next();
  };
};

// Middleware to check if user belongs to specific school
const schoolAccessMiddleware = (schoolId) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }
    
    // Admins can access any school
    if (req.user.role === 'admin') {
      next();
      return;
    }
    
    // Check if user belongs to the specified school
    if (req.user.schoolId !== schoolId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied to this school'
      });
    }
    
    next();
  };
};

// Middleware to ensure user can only access their own data
const ownershipMiddleware = (getResourceOwnerId) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }
    
    // Admins have full access
    if (req.user.role === 'admin') {
      next();
      return;
    }
    
    // Get the owner ID of the resource being accessed
    const ownerId = getResourceOwnerId(req);
    
    if (!ownerId) {
      return res.status(400).json({
        success: false,
        message: 'Unable to determine resource owner'
      });
    }
    
    // Users can only access their own resources
    if (req.user.userId !== ownerId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied to this resource'
      });
    }
    
    next();
  };
};

module.exports = {
  roleMiddleware,
  schoolAccessMiddleware,
  ownershipMiddleware
};