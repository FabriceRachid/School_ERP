const Parent = require('../models/parent.model');
const Student = require('../models/student.model');
const { asyncHandler } = require('../middlewares/error.middleware');
const { roleMiddleware } = require('../middlewares/role.middleware');

class ParentController {
  // Create new parent
  static create = [
    roleMiddleware('admin'),
    asyncHandler(async (req, res) => {
      const { first_name, last_name, email, phone, address } = req.body;
      
      // Validate required fields
      if (!first_name || !last_name) {
        return res.status(400).json({
          success: false,
          message: 'First name and last name are required'
        });
      }
      
      // Check if email already exists
      if (email) {
        const existingParent = await Parent.findByEmail(email);
        if (existingParent) {
          return res.status(409).json({
            success: false,
            message: 'Parent with this email already exists'
          });
        }
      }
      
      const parentData = {
        first_name,
        last_name,
        email: email || null,
        phone: phone || null,
        address: address || null
      };
      
      const parent = await Parent.create(parentData);
      
      res.status(201).json({
        success: true,
        message: 'Parent created successfully',
        data: parent
      });
    })
  ];
  
  // Get parent by ID
  static getById = [
    roleMiddleware('admin', 'teacher'),
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      const parent = await Parent.findById(id);
      
      if (!parent) {
        return res.status(404).json({
          success: false,
          message: 'Parent not found'
        });
      }
      
      res.json({
        success: true,
        message: 'Parent retrieved successfully',
        data: parent
      });
    })
  ];
  
  // Get parents by student
  static getByStudent = [
    roleMiddleware('admin', 'teacher', 'student'),
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
      
      const parents = await Parent.findByStudent(student_id);
      
      res.json({
        success: true,
        message: 'Student parents retrieved successfully',
        data: parents,
        count: parents.length
      });
    })
  ];
  
  // Get students by parent
  static getStudents = [
    roleMiddleware('admin', 'parent'),
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      
      // Verify parent exists
      const parent = await Parent.findById(id);
      if (!parent) {
        return res.status(404).json({
          success: false,
          message: 'Parent not found'
        });
      }
      
      const students = await Parent.getStudents(id);
      
      res.json({
        success: true,
        message: 'Parent students retrieved successfully',
        data: students,
        count: students.length
      });
    })
  ];
  
  // Update parent
  static update = [
    roleMiddleware('admin'),
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      const updateData = req.body;
      
      const parent = await Parent.update(id, updateData);
      
      if (!parent) {
        return res.status(404).json({
          success: false,
          message: 'Parent not found'
        });
      }
      
      res.json({
        success: true,
        message: 'Parent updated successfully',
        data: parent
      });
    })
  ];
  
  // Delete parent
  static delete = [
    roleMiddleware('admin'),
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      const parent = await Parent.delete(id);
      
      if (!parent) {
        return res.status(404).json({
          success: false,
          message: 'Parent not found'
        });
      }
      
      res.json({
        success: true,
        message: 'Parent deleted successfully'
      });
    })
  ];
  
  // Link parent to student
  static linkToStudent = [
    roleMiddleware('admin'),
    asyncHandler(async (req, res) => {
      const { parent_id, student_id } = req.params;
      const { relationship, is_primary } = req.body;
      
      if (!relationship) {
        return res.status(400).json({
          success: false,
          message: 'Relationship is required'
        });
      }
      
      // Verify parent exists
      const parent = await Parent.findById(parent_id);
      if (!parent) {
        return res.status(404).json({
          success: false,
          message: 'Parent not found'
        });
      }
      
      // Verify student exists
      const student = await Student.findById(student_id);
      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Student not found'
        });
      }
      
      const link = await Parent.linkToStudent(parent_id, student_id, relationship, is_primary);
      
      res.json({
        success: true,
        message: 'Parent linked to student successfully',
        data: link
      });
    })
  ];
  
  // Unlink parent from student
  static unlinkFromStudent = [
    roleMiddleware('admin'),
    asyncHandler(async (req, res) => {
      const { parent_id, student_id } = req.params;
      
      const result = await Parent.unlinkFromStudent(parent_id, student_id);
      
      if (!result) {
        return res.status(404).json({
          success: false,
          message: 'Parent-student relationship not found'
        });
      }
      
      res.json({
        success: true,
        message: 'Parent unlinked from student successfully'
      });
    })
  ];
  
  // Set primary parent
  static setPrimaryParent = [
    roleMiddleware('admin'),
    asyncHandler(async (req, res) => {
      const { student_id, parent_id } = req.params;
      
      // Verify relationship exists
      const parents = await Parent.findByStudent(student_id);
      const relationshipExists = parents.some(p => p.id === parent_id);
      
      if (!relationshipExists) {
        return res.status(404).json({
          success: false,
          message: 'Parent-student relationship not found'
        });
      }
      
      const result = await Parent.setPrimaryParent(student_id, parent_id);
      
      res.json({
        success: true,
        message: 'Primary parent set successfully',
        data: result
      });
    })
  ];
}

module.exports = ParentController;