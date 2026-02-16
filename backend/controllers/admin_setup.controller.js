const AdminSetup = require('../models/admin_setup.model');
const ParentStudentLink = require('../models/parent_student_link.model');
const User = require('../models/user.model');
const Student = require('../models/student.model');
const { asyncHandler } = require('../middlewares/error.middleware');
const { roleMiddleware } = require('../middlewares/hierarchical-role.middleware');

class AdminSetupController {
  // Admin creates parent account (pre-activation)
  static createParentAccount = [
    roleMiddleware('admin'),
    asyncHandler(async (req, res) => {
      const { first_name, last_name, email } = req.body;
      
      if (!first_name || !last_name || !email) {
        return res.status(400).json({
          success: false,
          message: 'First name, last name, and email are required'
        });
      }
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid email format'
        });
      }
      
      try {
        const parent = await AdminSetup.createParentAccount(
          req.user.schoolId,
          first_name,
          last_name,
          email
        );
        
        res.status(201).json({
          success: true,
          message: 'Parent account created successfully. Parent needs to activate account with invitation code.',
          data: {
            parent_id: parent.id,
            email: parent.email,
            name: `${parent.first_name} ${parent.last_name}`
          }
        });
      } catch (error) {
        if (error.message === 'Email already registered') {
          return res.status(409).json({
            success: false,
            message: 'Email already registered'
          });
        }
        throw error;
      }
    })
  ];
  
  // Admin creates student account with temporary password
  static createStudentAccount = [
    roleMiddleware('admin'),
    asyncHandler(async (req, res) => {
      const { first_name, last_name, email, class_name } = req.body;
      
      if (!first_name || !last_name || !email || !class_name) {
        return res.status(400).json({
          success: false,
          message: 'First name, last name, email, and class name are required'
        });
      }
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid email format'
        });
      }
      
      try {
        const result = await AdminSetup.createStudentAccount(
          req.user.schoolId,
          first_name,
          last_name,
          email,
          class_name  // Pass class_name instead of class_id
        );
        
        res.status(201).json({
          success: true,
          message: 'Student account created successfully',
          data: result
        });
      } catch (error) {
        if (error.message === 'Email already registered') {
          return res.status(409).json({
            success: false,
            message: 'Email already registered'
          });
        }
        throw error;
      }
    })
  ];
  
  // Admin links parent to student
  static linkParentToStudent = [
    roleMiddleware('admin'),
    asyncHandler(async (req, res) => {
      const { parent_id, student_id, relationship, is_primary } = req.body;
      
      if (!parent_id || !student_id) {
        return res.status(400).json({
          success: false,
          message: 'Parent ID and Student ID are required'
        });
      }
      
      try {
        const link = await AdminSetup.linkParentToStudent(
          parent_id,
          student_id,
          relationship || 'parent',
          is_primary !== undefined ? is_primary : true
        );
        
        res.status(201).json({
          success: true,
          message: 'Parent-student link created successfully',
          data: link
        });
      } catch (error) {
        if (error.message === 'Invalid parent user' || error.message === 'Invalid student') {
          return res.status(400).json({
            success: false,
            message: error.message
          });
        }
        if (error.message === 'Parent-student link already exists') {
          return res.status(409).json({
            success: false,
            message: error.message
          });
        }
        throw error;
      }
    })
  ];
  
  // Get unactivated parents for admin to manage
  static getUnactivatedParents = [
    roleMiddleware('admin'),
    asyncHandler(async (req, res) => {
      const parents = await AdminSetup.getUnactivatedParents(req.user.schoolId);
      
      res.json({
        success: true,
        message: 'Unactivated parents retrieved successfully',
        data: parents,
        count: parents.length
      });
    })
  ];
  
  // Get students without parents for admin to manage
  static getStudentsWithoutParents = [
    roleMiddleware('admin'),
    asyncHandler(async (req, res) => {
      const students = await AdminSetup.getStudentsWithoutParents(req.user.schoolId);
      
      res.json({
        success: true,
        message: 'Students without parents retrieved successfully',
        data: students,
        count: students.length
      });
    })
  ];
}

module.exports = AdminSetupController;
