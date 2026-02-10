const Teacher = require('../models/teacher.model');
const User = require('../models/user.model');
const { asyncHandler } = require('../middlewares/error.middleware');
const { roleMiddleware } = require('../middlewares/role.middleware');

class TeacherController {
  // Create new teacher
  static create = [
    roleMiddleware('admin'),
    asyncHandler(async (req, res) => {
      const { user_id, specialization, hire_date, salary } = req.body;
      
      // Validate required fields
      if (!user_id) {
        return res.status(400).json({
          success: false,
          message: 'User ID is required'
        });
      }
      
      // Check if user exists and is a teacher
      const user = await User.findById(user_id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      
      if (user.role !== 'teacher') {
        return res.status(400).json({
          success: false,
          message: 'User must be a teacher'
        });
      }
      
      // Check if teacher already exists
      const existingTeacher = await Teacher.findByUserId(user_id);
      if (existingTeacher) {
        return res.status(409).json({
          success: false,
          message: 'Teacher record already exists for this user'
        });
      }
      
      const teacherData = {
        user_id,
        specialization: specialization || null,
        hire_date: hire_date || null,
        salary: salary || null
      };
      
      const teacher = await Teacher.create(teacherData);
      
      res.status(201).json({
        success: true,
        message: 'Teacher created successfully',
        data: teacher
      });
    })
  ];
  
  // Get all teachers in school
  static getAll = [
    roleMiddleware('admin', 'teacher'),
    asyncHandler(async (req, res) => {
      const { school_id } = req.user;
      const teachers = await Teacher.findBySchool(school_id);
      
      res.json({
        success: true,
        message: 'Teachers retrieved successfully',
        data: teachers,
        count: teachers.length
      });
    })
  ];
  
  // Get teacher by ID
  static getById = [
    roleMiddleware('admin', 'teacher'),
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      const teacher = await Teacher.findById(id);
      
      if (!teacher) {
        return res.status(404).json({
          success: false,
          message: 'Teacher not found'
        });
      }
      
      res.json({
        success: true,
        message: 'Teacher retrieved successfully',
        data: teacher
      });
    })
  ];
  
  // Update teacher
  static update = [
    roleMiddleware('admin'),
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      const updateData = req.body;
      
      const teacher = await Teacher.update(id, updateData);
      
      if (!teacher) {
        return res.status(404).json({
          success: false,
          message: 'Teacher not found'
        });
      }
      
      res.json({
        success: true,
        message: 'Teacher updated successfully',
        data: teacher
      });
    })
  ];
  
  // Delete teacher
  static delete = [
    roleMiddleware('admin'),
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      const teacher = await Teacher.delete(id);
      
      if (!teacher) {
        return res.status(404).json({
          success: false,
          message: 'Teacher not found'
        });
      }
      
      res.json({
        success: true,
        message: 'Teacher deleted successfully'
      });
    })
  ];
  
  // Get teacher assignments
  static getAssignments = [
    roleMiddleware('admin', 'teacher'),
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      
      // Verify teacher exists
      const teacher = await Teacher.findById(id);
      if (!teacher) {
        return res.status(404).json({
          success: false,
          message: 'Teacher not found'
        });
      }
      
      const assignments = await Teacher.getAssignments(id);
      
      res.json({
        success: true,
        message: 'Teacher assignments retrieved successfully',
        data: assignments
      });
    })
  ];
  
  // Get teacher's students
  static getStudents = [
    roleMiddleware('admin', 'teacher'),
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      const { academic_year } = req.query;
      
      if (!academic_year) {
        return res.status(400).json({
          success: false,
          message: 'Academic year is required'
        });
      }
      
      // Verify teacher exists
      const teacher = await Teacher.findById(id);
      if (!teacher) {
        return res.status(404).json({
          success: false,
          message: 'Teacher not found'
        });
      }
      
      const students = await Teacher.getStudents(id, academic_year);
      
      res.json({
        success: true,
        message: 'Teacher students retrieved successfully',
        data: students,
        count: students.length
      });
    })
  ];
}

module.exports = TeacherController;