const Student = require('../models/student.model');
const User = require('../models/user.model');
const Class = require('../models/class.model');
const School = require('../models/school.model');
const { asyncHandler } = require('../middlewares/error.middleware');
const { roleMiddleware } = require('../middlewares/role.middleware');

class StudentController {
  // Self-registration for students
  static selfRegister = asyncHandler(async (req, res) => {
    const { 
      school_id, 
      first_name, 
      last_name, 
      email, 
      password,
      date_of_birth,
      gender,
      address,
      phone,
      parent_name,
      parent_phone,
      emergency_contact_name,
      emergency_contact_phone,
      medical_info
    } = req.body;
    
    // Validate required fields
    if (!school_id || !first_name || !last_name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
        required: ['school_id', 'first_name', 'last_name', 'email', 'password']
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
    
    // Check if email already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered'
      });
    }
    
    // Create user first
    const userData = {
      school_id,
      first_name,
      last_name,
      email,
      password,
      role: 'student',
      phone: phone || null,
      address: address || null,
      date_of_birth: date_of_birth || null
    };
    
    const user = await User.create(userData);
    
    // Generate student ID
    const studentId = `STD${Date.now().toString().slice(-6)}`;
    
    // Create student record
    const studentData = {
      user_id: user.id,
      student_id: studentId,
      parent_name: parent_name || null,
      parent_phone: parent_phone || null,
      date_of_birth: date_of_birth || null,
      gender: gender || null,
      address: address || null,
      emergency_contact_name: emergency_contact_name || null,
      emergency_contact_phone: emergency_contact_phone || null,
      medical_info: medical_info || null
    };
    
    const student = await Student.create(studentData);
    
    res.status(201).json({
      success: true,
      message: 'Student registered successfully',
      data: {
        user: { id: user.id, email: user.email, role: user.role },
        student: { id: student.id, student_id: student.student_id }
      }
    });
  });

  // Create new student (admin)
  static create = [
    roleMiddleware('admin'),
    asyncHandler(async (req, res) => {
      const { user_id, class_id, student_id, parent_name, parent_phone, enrollment_date } = req.body;
      
      // Validate required fields
      if (!user_id || !student_id) {
        return res.status(400).json({
          success: false,
          message: 'User ID and student ID are required'
        });
      }
      
      // Check if user exists and is a student
      const user = await User.findById(user_id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      
      if (user.role !== 'student') {
        return res.status(400).json({
          success: false,
          message: 'User must be a student'
        });
      }
      
      // Check if class exists (if provided)
      if (class_id) {
        const classExists = await Class.findById(class_id);
        if (!classExists) {
          return res.status(404).json({
            success: false,
            message: 'Class not found'
          });
        }
      }
      
      // Check if student already exists
      const existingStudent = await Student.findByUserId(user_id);
      if (existingStudent) {
        return res.status(409).json({
          success: false,
          message: 'Student record already exists for this user'
        });
      }
      
      const studentData = {
        user_id,
        class_id: class_id || null,
        student_id,
        parent_name: parent_name || null,
        parent_phone: parent_phone || null,
        enrollment_date: enrollment_date || new Date()
      };
      
      const student = await Student.create(studentData);
      
      res.status(201).json({
        success: true,
        message: 'Student created successfully',
        data: student
      });
    })
  ];
  
  // Get all students in school
  static getAll = [
    roleMiddleware('admin', 'teacher'),
    asyncHandler(async (req, res) => {
      const { school_id } = req.user;
      const students = await Student.findBySchool(school_id);
      
      res.json({
        success: true,
        message: 'Students retrieved successfully',
        data: students,
        count: students.length
      });
    })
  ];
  
  // Get student by ID
  static getById = [
    roleMiddleware('admin', 'teacher'),
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      const student = await Student.findById(id);
      
      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Student not found'
        });
      }
      
      res.json({
        success: true,
        message: 'Student retrieved successfully',
        data: student
      });
    })
  ];
  
  // Get students by class
  static getByClass = [
    roleMiddleware('admin', 'teacher'),
    asyncHandler(async (req, res) => {
      const { class_id } = req.params;
      const students = await Student.findByClass(class_id);
      
      res.json({
        success: true,
        message: 'Students retrieved successfully',
        data: students,
        count: students.length
      });
    })
  ];
  
  // Update student
  static update = [
    roleMiddleware('admin'),
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      const updateData = req.body;
      
      const student = await Student.update(id, updateData);
      
      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Student not found'
        });
      }
      
      res.json({
        success: true,
        message: 'Student updated successfully',
        data: student
      });
    })
  ];
  
  // Delete student
  static delete = [
    roleMiddleware('admin'),
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      const student = await Student.delete(id);
      
      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Student not found'
        });
      }
      
      res.json({
        success: true,
        message: 'Student deleted successfully'
      });
    })
  ];
  
  // Get student academic record
  static getAcademicRecord = [
    roleMiddleware('admin', 'teacher', 'student'),
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      
      // Verify student exists
      const student = await Student.findById(id);
      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Student not found'
        });
      }
      
      const academicRecord = await Student.getAcademicRecord(id);
      
      res.json({
        success: true,
        message: 'Academic record retrieved successfully',
        data: academicRecord
      });
    })
  ];
  
  // Get student payment history
  static getPaymentHistory = [
    roleMiddleware('admin', 'student'),
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      
      // Verify student exists
      const student = await Student.findById(id);
      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Student not found'
        });
      }
      
      const paymentHistory = await Student.getPaymentHistory(id);
      
      res.json({
        success: true,
        message: 'Payment history retrieved successfully',
        data: paymentHistory
      });
    })
  ];
}

module.exports = StudentController;