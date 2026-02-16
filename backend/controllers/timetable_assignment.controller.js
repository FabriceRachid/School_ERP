const { pool } = require('../models/index');
const { asyncHandler } = require('../middlewares/error.middleware');
const { roleMiddleware } = require('../middlewares/role.middleware');

class TimetableAssignmentController {
  // Get all teacher assignments for a class
  static getClassAssignments = [
    roleMiddleware('admin', 'teacher'),
    asyncHandler(async (req, res) => {
      const { class_id } = req.params;
      
      const query = `
        SELECT 
          ta.id,
          ta.teacher_id,
          ta.class_id,
          ta.subject_id,
          ta.academic_year,
          t.id as teacher_id,
          u.first_name as teacher_first_name,
          u.last_name as teacher_last_name,
          s.name as subject_name,
          s.coefficient as subject_coefficient
        FROM teacher_assignments ta
        JOIN teachers t ON ta.teacher_id = t.id
        JOIN users u ON t.user_id = u.id
        JOIN subjects s ON ta.subject_id = s.id
        WHERE ta.class_id = $1
        ORDER BY s.name, u.last_name, u.first_name
      `;
      
      const result = await pool.query(query, [class_id]);
      
      const assignments = result.rows.map(row => ({
        id: row.id,
        teacher_id: row.teacher_id,
        class_id: row.class_id,
        subject_id: row.subject_id,
        academic_year: row.academic_year,
        teacher_name: `${row.teacher_first_name} ${row.teacher_last_name}`,
        subject_name: row.subject_name,
        subject_coefficient: parseFloat(row.subject_coefficient)
      }));
      
      res.json({
        success: true,
        message: 'Class assignments retrieved successfully',
        data: assignments,
        count: assignments.length
      });
    })
  ];

  // Get subjects with their assigned teachers for a class
  static getClassSubjectTeachers = [
    roleMiddleware('admin', 'teacher'),
    asyncHandler(async (req, res) => {
      const { class_id } = req.params;
      
      const query = `
        SELECT 
          s.id as subject_id,
          s.name as subject_name,
          s.coefficient as subject_coefficient,
          t.id as teacher_id,
          u.first_name as teacher_first_name,
          u.last_name as teacher_last_name,
          u.email as teacher_email
        FROM subjects s
        JOIN class_subjects cs ON s.id = cs.subject_id
        LEFT JOIN teacher_assignments ta ON s.id = ta.subject_id AND cs.class_id = ta.class_id
        LEFT JOIN teachers t ON ta.teacher_id = t.id
        LEFT JOIN users u ON t.user_id = u.id
        WHERE cs.class_id = $1
        ORDER BY s.name, u.last_name, u.first_name
      `;
      
      const result = await pool.query(query, [class_id]);
      
      // Group by subject
      const subjectMap = new Map();
      
      result.rows.forEach(row => {
        const subjectId = row.subject_id;
        
        if (!subjectMap.has(subjectId)) {
          subjectMap.set(subjectId, {
            subject_id: row.subject_id,
            subject_name: row.subject_name,
            coefficient: parseFloat(row.subject_coefficient),
            teachers: []
          });
        }
        
        if (row.teacher_id) {
          subjectMap.get(subjectId).teachers.push({
            id: row.teacher_id,
            name: `${row.teacher_first_name} ${row.teacher_last_name}`,
            email: row.teacher_email
          });
        }
      });
      
      const subjectsWithTeachers = Array.from(subjectMap.values());
      
      res.json({
        success: true,
        message: 'Subject teachers retrieved successfully',
        data: subjectsWithTeachers,
        count: subjectsWithTeachers.length
      });
    })
  ];

  // Create new teacher assignment
  static createAssignment = [
    roleMiddleware('admin'),
    asyncHandler(async (req, res) => {
      const { teacher_id, class_id, subject_id, academic_year } = req.body;
      
      // Validate required fields
      if (!teacher_id || !class_id || !subject_id || !academic_year) {
        return res.status(400).json({
          success: false,
          message: 'Teacher ID, Class ID, Subject ID, and Academic Year are required'
        });
      }
      
      // Check if assignment already exists
      const existing = await pool.query(
        'SELECT id FROM teacher_assignments WHERE teacher_id = $1 AND class_id = $2 AND subject_id = $3 AND academic_year = $4',
        [teacher_id, class_id, subject_id, academic_year]
      );
      
      if (existing.rows.length > 0) {
        return res.status(409).json({
          success: false,
          message: 'Teacher is already assigned to this subject in this class for this academic year'
        });
      }
      
      // Ensure the subject is linked to the class
      await pool.query(
        `INSERT INTO class_subjects (class_id, subject_id)
         VALUES ($1, $2)
         ON CONFLICT (class_id, subject_id) DO NOTHING`,
        [class_id, subject_id]
      );
      
      // Create the assignment
      const result = await pool.query(
        `INSERT INTO teacher_assignments (teacher_id, class_id, subject_id, academic_year)
         VALUES ($1, $2, $3, $4)
         RETURNING id, teacher_id, class_id, subject_id, academic_year, created_at`,
        [teacher_id, class_id, subject_id, academic_year]
      );
      
      res.status(201).json({
        success: true,
        message: 'Teacher assignment created successfully',
        data: result.rows[0]
      });
    })
  ];

  // Delete teacher assignment
  static deleteAssignment = [
    roleMiddleware('admin'),
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      
      const result = await pool.query(
        'DELETE FROM teacher_assignments WHERE id = $1 RETURNING id',
        [id]
      );
      
      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Assignment not found'
        });
      }
      
      res.json({
        success: true,
        message: 'Teacher assignment deleted successfully'
      });
    })
  ];

  // Get all assignments for a teacher
  static getTeacherAssignments = [
    roleMiddleware('admin', 'teacher'),
    asyncHandler(async (req, res) => {
      const { teacher_id } = req.params;
      
      const query = `
        SELECT 
          ta.id,
          ta.class_id,
          ta.subject_id,
          ta.academic_year,
          c.name as class_name,
          c.level as class_level,
          s.name as subject_name,
          s.coefficient as subject_coefficient
        FROM teacher_assignments ta
        JOIN classes c ON ta.class_id = c.id
        JOIN subjects s ON ta.subject_id = s.id
        WHERE ta.teacher_id = $1
        ORDER BY ta.academic_year DESC, c.name, s.name
      `;
      
      const result = await pool.query(query, [teacher_id]);
      
      res.json({
        success: true,
        message: 'Teacher assignments retrieved successfully',
        data: result.rows,
        count: result.rows.length
      });
    })
  ];
}

module.exports = TimetableAssignmentController;