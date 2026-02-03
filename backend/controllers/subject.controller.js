const Subject = require('../models/subject.model');
const { asyncHandler } = require('../middlewares/error.middleware');
const { roleMiddleware } = require('../middlewares/role.middleware');

class SubjectController {
  // Create new subject
  static create = [
    roleMiddleware('admin'),
    asyncHandler(async (req, res) => {
      const { name, code, coefficient } = req.body;
      
      // Validate required fields
      if (!name) {
        return res.status(400).json({
          success: false,
          message: 'Subject name is required'
        });
      }
      
      const subjectData = {
        school_id: req.user.schoolId,
        name,
        code: code || null,
        coefficient: coefficient || 1.00
      };
      
      const subject = await Subject.create(subjectData);
      
      res.status(201).json({
        success: true,
        message: 'Subject created successfully',
        data: subject
      });
    })
  ];
  
  // Get all subjects in school
  static getAll = [
    roleMiddleware('admin', 'teacher', 'student'),
    asyncHandler(async (req, res) => {
      const { school_id } = req.user;
      const subjects = await Subject.findBySchool(school_id);
      
      res.json({
        success: true,
        message: 'Subjects retrieved successfully',
        data: subjects,
        count: subjects.length
      });
    })
  ];
  
  // Get subject by ID
  static getById = [
    roleMiddleware('admin', 'teacher', 'student'),
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      const subject = await Subject.findById(id);
      
      if (!subject) {
        return res.status(404).json({
          success: false,
          message: 'Subject not found'
        });
      }
      
      res.json({
        success: true,
        message: 'Subject retrieved successfully',
        data: subject
      });
    })
  ];
  
  // Get subject by code
  static getByCode = [
    roleMiddleware('admin', 'teacher', 'student'),
    asyncHandler(async (req, res) => {
      const { code } = req.params;
      const subject = await Subject.findByCode(code);
      
      if (!subject) {
        return res.status(404).json({
          success: false,
          message: 'Subject not found'
        });
      }
      
      res.json({
        success: true,
        message: 'Subject retrieved successfully',
        data: subject
      });
    })
  ];
  
  // Update subject
  static update = [
    roleMiddleware('admin'),
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      const updateData = req.body;
      
      const subject = await Subject.update(id, updateData);
      
      if (!subject) {
        return res.status(404).json({
          success: false,
          message: 'Subject not found'
        });
      }
      
      res.json({
        success: true,
        message: 'Subject updated successfully',
        data: subject
      });
    })
  ];
  
  // Delete subject
  static delete = [
    roleMiddleware('admin'),
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      const subject = await Subject.delete(id);
      
      if (!subject) {
        return res.status(404).json({
          success: false,
          message: 'Subject not found'
        });
      }
      
      res.json({
        success: true,
        message: 'Subject deleted successfully'
      });
    })
  ];
  
  // Get classes for subject
  static getClasses = [
    roleMiddleware('admin', 'teacher'),
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      
      // Verify subject exists
      const subject = await Subject.findById(id);
      if (!subject) {
        return res.status(404).json({
          success: false,
          message: 'Subject not found'
        });
      }
      
      const classes = await Subject.getClasses(id);
      
      res.json({
        success: true,
        message: 'Subject classes retrieved successfully',
        data: classes,
        count: classes.length
      });
    })
  ];
  
  // Get teachers for subject
  static getTeachers = [
    roleMiddleware('admin', 'teacher'),
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      
      // Verify subject exists
      const subject = await Subject.findById(id);
      if (!subject) {
        return res.status(404).json({
          success: false,
          message: 'Subject not found'
        });
      }
      
      const teachers = await Subject.getTeachers(id);
      
      res.json({
        success: true,
        message: 'Subject teachers retrieved successfully',
        data: teachers,
        count: teachers.length
      });
    })
  ];
}

module.exports = SubjectController;