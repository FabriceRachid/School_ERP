const Class = require('../models/class.model');
const Subject = require('../models/subject.model');
const { asyncHandler } = require('../middlewares/error.middleware');
const { roleMiddleware } = require('../middlewares/role.middleware');

class ClassController {
  // Create new class
  static create = [
    roleMiddleware('admin'),
    asyncHandler(async (req, res) => {
      const { name, academic_year, level } = req.body;
      
      // Validate required fields
      if (!name || !academic_year) {
        return res.status(400).json({
          success: false,
          message: 'Class name and academic year are required'
        });
      }
      
      const classData = {
        school_id: req.user.schoolId,
        name,
        academic_year,
        level: level || null
      };
      
      const classObj = await Class.create(classData);
      
      res.status(201).json({
        success: true,
        message: 'Class created successfully',
        data: classObj
      });
    })
  ];
  
  // Get all classes in school
  static getAll = [
    roleMiddleware('admin', 'teacher', 'student'),
    asyncHandler(async (req, res) => {
      const { school_id } = req.user;
      const classes = await Class.findBySchool(school_id);
      
      res.json({
        success: true,
        message: 'Classes retrieved successfully',
        data: classes,
        count: classes.length
      });
    })
  ];
  
  // Get classes by academic year
  static getByAcademicYear = [
    roleMiddleware('admin', 'teacher', 'student'),
    asyncHandler(async (req, res) => {
      const { school_id } = req.user;
      const { academic_year } = req.params;
      
      const classes = await Class.findByAcademicYear(school_id, academic_year);
      
      res.json({
        success: true,
        message: 'Classes retrieved successfully',
        data: classes,
        count: classes.length
      });
    })
  ];
  
  // Get class by ID
  static getById = [
    roleMiddleware('admin', 'teacher', 'student'),
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      const classObj = await Class.findById(id);
      
      if (!classObj) {
        return res.status(404).json({
          success: false,
          message: 'Class not found'
        });
      }
      
      res.json({
        success: true,
        message: 'Class retrieved successfully',
        data: classObj
      });
    })
  ];
  
  // Update class
  static update = [
    roleMiddleware('admin'),
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      const updateData = req.body;
      
      const classObj = await Class.update(id, updateData);
      
      if (!classObj) {
        return res.status(404).json({
          success: false,
          message: 'Class not found'
        });
      }
      
      res.json({
        success: true,
        message: 'Class updated successfully',
        data: classObj
      });
    })
  ];
  
  // Delete class
  static delete = [
    roleMiddleware('admin'),
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      const classObj = await Class.delete(id);
      
      if (!classObj) {
        return res.status(404).json({
          success: false,
          message: 'Class not found'
        });
      }
      
      res.json({
        success: true,
        message: 'Class deleted successfully'
      });
    })
  ];
  
  // Get class students
  static getStudents = [
    roleMiddleware('admin', 'teacher'),
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      
      // Verify class exists
      const classObj = await Class.findById(id);
      if (!classObj) {
        return res.status(404).json({
          success: false,
          message: 'Class not found'
        });
      }
      
      const students = await Class.getStudents(id);
      
      res.json({
        success: true,
        message: 'Class students retrieved successfully',
        data: students,
        count: students.length
      });
    })
  ];
  
  // Get class subjects
  static getSubjects = [
    roleMiddleware('admin', 'teacher', 'student'),
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      
      // Verify class exists
      const classObj = await Class.findById(id);
      if (!classObj) {
        return res.status(404).json({
          success: false,
          message: 'Class not found'
        });
      }
      
      const subjects = await Class.getSubjects(id);
      
      res.json({
        success: true,
        message: 'Class subjects retrieved successfully',
        data: subjects,
        count: subjects.length
      });
    })
  ];
  
  // Add subject to class
  static addSubject = [
    roleMiddleware('admin'),
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      const { subject_id } = req.body;
      
      if (!subject_id) {
        return res.status(400).json({
          success: false,
          message: 'Subject ID is required'
        });
      }
      
      // Verify class exists
      const classObj = await Class.findById(id);
      if (!classObj) {
        return res.status(404).json({
          success: false,
          message: 'Class not found'
        });
      }
      
      // Verify subject exists
      const subject = await Subject.findById(subject_id);
      if (!subject) {
        return res.status(404).json({
          success: false,
          message: 'Subject not found'
        });
      }
      
      const result = await Class.addSubject(id, subject_id);
      
      res.json({
        success: true,
        message: 'Subject added to class successfully',
        data: result
      });
    })
  ];
  
  // Remove subject from class
  static removeSubject = [
    roleMiddleware('admin'),
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      const { subject_id } = req.body;
      
      if (!subject_id) {
        return res.status(400).json({
          success: false,
          message: 'Subject ID is required'
        });
      }
      
      // Verify class exists
      const classObj = await Class.findById(id);
      if (!classObj) {
        return res.status(404).json({
          success: false,
          message: 'Class not found'
        });
      }
      
      const result = await Class.removeSubject(id, subject_id);
      
      if (!result) {
        return res.status(404).json({
          success: false,
          message: 'Subject not found in class'
        });
      }
      
      res.json({
        success: true,
        message: 'Subject removed from class successfully'
      });
    })
  ];
}

module.exports = ClassController;