const roleMiddleware = (...allowedRoles) => {
  return async (req, res, next) => {
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }
    
    // Define role hierarchy levels
    const roleHierarchy = {
      'super_admin': 4,  // Highest level - Full system access
      'admin': 3,        // School admin - School management
      'teacher': 2,      // Teacher - Class/subject management
      'parent': 1,       // Parent - View child data only
      'student': 0       // Student - Limited self-access
    };
    
    const userRole = req.user.role;
    const userLevel = roleHierarchy[userRole] || 0;
    
    // Check if user has required minimum role level
    const hasPermission = allowedRoles.some(requiredRole => {
      const requiredLevel = roleHierarchy[requiredRole] || 0;
      return userLevel >= requiredLevel;
    });
    
    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
        requiredRoles: allowedRoles,
        userRole: userRole,
        userLevel: userLevel
      });
    }
    
    // Add role information to request for use in controllers
    req.user.roleLevel = userLevel;
    req.user.highestRole = userRole;
    
    next();
  };
};

// Specific middleware for role levels
const superAdminOnly = roleMiddleware('super_admin');
const adminOrSuper = roleMiddleware('admin', 'super_admin');
const teacherOrAbove = roleMiddleware('teacher', 'admin', 'super_admin');
const parentOrAbove = roleMiddleware('parent', 'teacher', 'admin', 'super_admin');

// Middleware to check if user belongs to specific school
const schoolAccessMiddleware = (schoolId) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }
    
    // Super admins can access any school
    if (req.user.role === 'super_admin') {
      next();
      return;
    }
    
    // Admins can access their school and manage users
    if (req.user.role === 'admin' && req.user.schoolId === schoolId) {
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

// Middleware to ensure user can only access their own data or has appropriate permissions
const ownershipMiddleware = (getResourceOwnerId) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }
    
    // Super admins and admins have broader access
    if (req.user.role === 'super_admin' || req.user.role === 'admin') {
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
    
    // Users can only access their own resources or related resources
    if (req.user.userId !== ownerId) {
      // Parents can access their children's data
      if (req.user.role === 'parent') {
        // Here you would check parent-child relationships
        // For now, we'll be strict
        return res.status(403).json({
          success: false,
          message: 'Access denied to this resource'
        });
      }
      
      return res.status(403).json({
        success: false,
        message: 'Access denied to this resource'
      });
    }
    
    next();
  };
};

// Middleware for system-wide operations (Super Admin only)
const systemAdminMiddleware = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }
  
  if (req.user.role !== 'super_admin') {
    return res.status(403).json({
      success: false,
      message: 'System administrator access required'
    });
  }
  
  next();
};

module.exports = {
  roleMiddleware,
  superAdminOnly,
  adminOrSuper,
  teacherOrAbove,
  parentOrAbove,
  schoolAccessMiddleware,
  ownershipMiddleware,
  systemAdminMiddleware
};