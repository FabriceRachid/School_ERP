const Grade = require('../models/grade.model');
const Student = require('../models/student.model');
const Subject = require('../models/subject.model');
const Teacher = require('../models/teacher.model');
const { asyncHandler } = require('../middlewares/error.middleware');
const { roleMiddleware } = require('../middlewares/role.middleware');

class GradeController {
  // Create new grade
  static create = [
    roleMiddleware('admin', 'teacher'),
    asyncHandler(async (req, res) => {
      const { student_id, subject_id, evaluation_type, score, max_score, academic_year, semester, date, comments } = req.body;
      
      // Validate required fields
      if (!student_id || !subject_id || !evaluation_type || !score || !academic_year || !semester || !date) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields',
          required: ['student_id', 'subject_id', 'evaluation_type', 'score', 'academic_year', 'semester', 'date']
        });
      }
      
      // Check if student exists
      const student = await Student.findById(student_id);
      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Student not found'
        });
      }
      
      // Check if subject exists
      const subject = await Subject.findById(subject_id);
      if (!subject) {
        return res.status(404).json({
          success: false,
          message: 'Subject not found'
        });
      }
      
      // Validate score
      const maxScore = max_score || 20.00;
      if (score < 0 || score > maxScore) {
        return res.status(400).json({
          success: false,
          message: `Score must be between 0 and ${maxScore}`
        });
      }
      
      // Get teacher ID from authenticated user
      let teacher_id = null;
      if (req.user.role === 'teacher') {
        const teacher = await Teacher.findByUserId(req.user.userId);
        if (teacher) {
          teacher_id = teacher.id;
        }
      }
      
      const gradeData = {
        student_id,
        subject_id,
        teacher_id,
        evaluation_type,
        score,
        max_score: maxScore,
        academic_year,
        semester,
        date,
        comments: comments || null
      };
      
      const grade = await Grade.create(gradeData);
      
      res.status(201).json({
        success: true,
        message: 'Grade created successfully',
        data: grade
      });
    })
  ];
  
  // Get grades by student
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
      
      const grades = await Grade.findByStudent(student_id);
      
      res.json({
        success: true,
        message: 'Student grades retrieved successfully',
        data: grades,
        count: grades.length
      });
    })
  ];
  
  // Get grades by class and subject
  static getByClassAndSubject = [
    roleMiddleware('admin', 'teacher'),
    asyncHandler(async (req, res) => {
      const { class_id, subject_id } = req.params;
      const { academic_year, semester } = req.query;
      
      if (!academic_year || !semester) {
        return res.status(400).json({
          success: false,
          message: 'Academic year and semester are required'
        });
      }
      
      const grades = await Grade.findByClassAndSubject(class_id, subject_id, academic_year, semester);
      
      res.json({
        success: true,
        message: 'Class grades retrieved successfully',
        data: grades,
        count: grades.length
      });
    })
  ];
  
  // Update grade
  static update = [
    roleMiddleware('admin', 'teacher'),
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      const updateData = req.body;
      
      // Validate score if provided
      if (updateData.score !== undefined && updateData.max_score !== undefined) {
        if (updateData.score < 0 || updateData.score > updateData.max_score) {
          return res.status(400).json({
            success: false,
            message: `Score must be between 0 and ${updateData.max_score}`
          });
        }
      }
      
      const grade = await Grade.update(id, updateData);
      
      if (!grade) {
        return res.status(404).json({
          success: false,
          message: 'Grade not found'
        });
      }
      
      res.json({
        success: true,
        message: 'Grade updated successfully',
        data: grade
      });
    })
  ];
  
  // Delete grade
  static delete = [
    roleMiddleware('admin'),
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      const grade = await Grade.delete(id);
      
      if (!grade) {
        return res.status(404).json({
          success: false,
          message: 'Grade not found'
        });
      }
      
      res.json({
        success: true,
        message: 'Grade deleted successfully'
      });
    })
  ];
  
  // Get class average
  static getClassAverage = [
    roleMiddleware('admin', 'teacher'),
    asyncHandler(async (req, res) => {
      const { class_id, subject_id } = req.params;
      const { academic_year, semester } = req.query;
      
      if (!academic_year || !semester) {
        return res.status(400).json({
          success: false,
          message: 'Academic year and semester are required'
        });
      }
      
      const average = await Grade.getClassAverage(class_id, subject_id, academic_year, semester);
      
      res.json({
        success: true,
        message: 'Class average calculated successfully',
        data: average
      });
    })
  ];
}

module.exports = GradeController;