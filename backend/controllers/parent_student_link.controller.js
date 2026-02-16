const ParentStudentLink = require('../models/parent_student_link.model');
const User = require('../models/user.model');
const Student = require('../models/student.model');
const { asyncHandler } = require('../middlewares/error.middleware');
const { roleMiddleware } = require('../middlewares/role.middleware');

class ParentStudentLinkController {
  // Admin creates parent-student link
  static createLink = [
    roleMiddleware('admin'),
    asyncHandler(async (req, res) => {
      const { parent_id, student_id, relationship, is_primary } = req.body;
      
      // Validate required fields
      if (!parent_id || !student_id) {
        return res.status(400).json({
          success: false,
          message: 'Parent ID and Student ID are required'
        });
      }
      
      // Verify parent exists and is parent role
      const parent = await User.findById(parent_id);
      if (!parent || parent.role !== 'parent') {
        return res.status(400).json({
          success: false,
          message: 'Invalid parent user'
        });
      }
      
      // Verify student exists
      const student = await Student.findById(student_id);
      if (!student) {
        return res.status(400).json({
          success: false,
          message: 'Invalid student'
        });
      }
      
      // Check if link already exists
      const existingLink = await ParentStudentLink.hasAccess(parent_id, student_id);
      if (existingLink) {
        return res.status(409).json({
          success: false,
          message: 'Parent-student link already exists'
        });
      }
      
      const link = await ParentStudentLink.createLink(
        parent_id, 
        student_id, 
        req.user.schoolId || student.school_id,
        relationship || 'parent', 
        is_primary || false,
        req.user.userId
      );
      
      res.status(201).json({
        success: true,
        message: 'Parent-student link created successfully',
        data: link
      });
    })
  ];
  
  // Get all students for logged-in parent
  static getParentStudents = [
    roleMiddleware('parent'),
    asyncHandler(async (req, res) => {
      const parentId = req.user.userId;
      const students = await ParentStudentLink.getStudentsForParent(parentId);
      
      res.json({
        success: true,
        message: 'Students retrieved successfully',
        data: students,
        count: students.length
      });
    })
  ];
  
  // Get all parents for a student (admin/teacher)
  static getStudentParents = [
    roleMiddleware('admin', 'teacher'),
    asyncHandler(async (req, res) => {
      const { student_id } = req.params;
      
      // Verify student exists
      const student = await Student.findById(student_id);
      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Student not found'
        });
      }
      
      const parents = await ParentStudentLink.getParentsForStudent(student_id);
      
      res.json({
        success: true,
        message: 'Parents retrieved successfully',
        data: parents,
        count: parents.length
      });
    })
  ];
  
  // Remove parent-student link (admin only)
  static removeLink = [
    roleMiddleware('admin'),
    asyncHandler(async (req, res) => {
      const { parent_id, student_id } = req.params;
      
      const result = await ParentStudentLink.removeLink(parent_id, student_id);
      
      if (!result) {
        return res.status(404).json({
          success: false,
          message: 'Parent-student link not found'
        });
      }
      
      res.json({
        success: true,
        message: 'Parent-student link removed successfully'
      });
    })
  ];
  
  // Create parent invitation (admin only)
  static createInvitation = [
    roleMiddleware('admin'),
    asyncHandler(async (req, res) => {
      const { student_id, parent_email } = req.body;
      
      if (!student_id || !parent_email) {
        return res.status(400).json({
          success: false,
          message: 'Student ID and parent email are required'
        });
      }
      
      // Verify student exists
      const student = await Student.findById(student_id);
      if (!student) {
        return res.status(400).json({
          success: false,
          message: 'Invalid student'
        });
      }
      
      // Verify parent email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(parent_email)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid email format'
        });
      }
      
      const invitation = await ParentStudentLink.createInvitation(
        req.user.schoolId || student.school_id,
        student_id,
        parent_email
      );
      
      res.status(201).json({
        success: true,
        message: 'Parent invitation created successfully',
        data: {
          invitation_code: invitation.invitation_code,
          expires_at: invitation.expires_at,
          parent_email: parent_email
        }
      });
    })
  ];
  
  // Parent registers using invitation (BUT must be pre-created by admin)
  static registerWithInvitation = asyncHandler(async (req, res) => {
    const { invitation_code, parent_email, first_name, last_name, password } = req.body;
    
    if (!invitation_code || !parent_email || !first_name || !last_name || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }
    
    // Validate invitation
    const invitation = await ParentStudentLink.validateInvitation(invitation_code, parent_email);
    if (!invitation) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired invitation code. Please contact your school administrator.'
      });
    }
    
    // Check if parent account already exists (created by admin)
    let existingParent = await User.findByEmail(parent_email);
    
    if (!existingParent) {
      // Parent account must be pre-created by admin
      return res.status(400).json({
        success: false,
        message: 'Parent account not found. Please contact your school administrator to create your account first.'
      });
    }
    
    // Verify it's a parent account
    if (existingParent.role !== 'parent') {
      return res.status(400).json({
        success: false,
        message: 'Account exists but is not configured as parent. Please contact administrator.'
      });
    }
    
    // Verify parent account doesn't already have password (not yet activated)
    if (existingParent.password_hash && existingParent.password_hash !== 'PENDING') {
      return res.status(400).json({
        success: false,
        message: 'Account already activated. Please use login instead.'
      });
    }
    
    // Set password for parent account
    const passwordValidation = require('../utils/password').validatePassword(password);
    if (!passwordValidation.valid) {
      return res.status(400).json({
        success: false,
        message: 'Password validation failed',
        errors: passwordValidation.errors
      });
    }
    
    const passwordHash = await require('../utils/password').hash(password);
    await User.update(existingParent.id, { password_hash: passwordHash });
    
    // Create parent-student link
    await ParentStudentLink.createLink(
      existingParent.id,
      invitation.student_id,
      invitation.school_id,
      'parent',
      true,
      null
    );
    
    // Mark invitation as used
    await ParentStudentLink.useInvitation(invitation.id);
    
    res.status(200).json({
      success: true,
      message: 'Parent account activated successfully',
      data: {
        user_id: existingParent.id,
        student_id: invitation.student_id
      }
    });
  });
}

module.exports = ParentStudentLinkController;
