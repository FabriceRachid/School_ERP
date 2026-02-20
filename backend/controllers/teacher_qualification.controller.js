const { pool } = require('../models/index');
const { asyncHandler } = require('../middlewares/error.middleware');
const { roleMiddleware } = require('../middlewares/role.middleware');

class TeacherQualificationController {
  // Get all qualified subjects for a teacher
  static getQualifiedSubjects = [
    roleMiddleware('admin', 'teacher'),
    asyncHandler(async (req, res) => {
      const { teacher_id } = req.params;
      
      const query = `
        SELECT s.id, s.name, s.code, s.coefficient, s.school_id
        FROM subjects s
        JOIN teacher_subjects ts ON s.id = ts.subject_id
        WHERE ts.teacher_id = $1
        ORDER BY s.name
      `;
      
      const result = await pool.query(query, [teacher_id]);
      
      res.json({
        success: true,
        message: 'Qualified subjects retrieved successfully',
        data: result.rows,
        count: result.rows.length
      });
    })
  ];

  // Add subject qualification to teacher
  static addSubjectQualification = [
    roleMiddleware('admin'),
    asyncHandler(async (req, res) => {
      const { teacher_id, subject_id } = req.body;
      
      // Validate required fields
      if (!teacher_id || !subject_id) {
        return res.status(400).json({
          success: false,
          message: 'Teacher ID and Subject ID are required'
        });
      }
      
      // Check if qualification already exists
      const existing = await pool.query(
        'SELECT id FROM teacher_subjects WHERE teacher_id = $1 AND subject_id = $2',
        [teacher_id, subject_id]
      );
      
      if (existing.rows.length > 0) {
        return res.status(409).json({
          success: false,
          message: 'Teacher is already qualified for this subject'
        });
      }
      
      // Insert qualification
      const result = await pool.query(
        `INSERT INTO teacher_subjects (teacher_id, subject_id)
         VALUES ($1, $2)
         RETURNING id, teacher_id, subject_id, created_at`,
        [teacher_id, subject_id]
      );
      
      res.status(201).json({
        success: true,
        message: 'Subject qualification added successfully',
        data: result.rows[0]
      });
    })
  ];

  // Remove subject qualification from teacher
  static removeSubjectQualification = [
    roleMiddleware('admin'),
    asyncHandler(async (req, res) => {
      const { teacher_id, subject_id } = req.params;
      
      const result = await pool.query(
        'DELETE FROM teacher_subjects WHERE teacher_id = $1 AND subject_id = $2 RETURNING id',
        [teacher_id, subject_id]
      );
      
      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Qualification not found'
        });
      }
      
      res.json({
        success: true,
        message: 'Subject qualification removed successfully'
      });
    })
  ];

  // Get all teachers qualified for a subject
  static getQualifiedTeachers = [
    roleMiddleware('admin', 'teacher'),
    asyncHandler(async (req, res) => {
      const { subject_id } = req.params;
      
      const query = `
        SELECT t.id, u.first_name, u.last_name, u.email
        FROM teachers t
        JOIN users u ON t.user_id = u.id
        JOIN teacher_subjects ts ON t.id = ts.teacher_id
        WHERE ts.subject_id = $1
        ORDER BY u.last_name, u.first_name
      `;
      
      const result = await pool.query(query, [subject_id]);
      
      res.json({
        success: true,
        message: 'Qualified teachers retrieved successfully',
        data: result.rows,
        count: result.rows.length
      });
    })
  ];

  // Bulk update teacher qualifications
  static bulkUpdateQualifications = [
    roleMiddleware('admin'),
    asyncHandler(async (req, res) => {
      const { teacher_id, subject_ids } = req.body;
      
      if (!teacher_id || !Array.isArray(subject_ids)) {
        return res.status(400).json({
          success: false,
          message: 'Teacher ID and array of Subject IDs are required'
        });
      }
      
      // Start transaction
      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        
        // Remove all existing qualifications for this teacher
        await client.query('DELETE FROM teacher_subjects WHERE teacher_id = $1', [teacher_id]);
        
        // Add new qualifications
        for (const subject_id of subject_ids) {
          await client.query(
            'INSERT INTO teacher_subjects (teacher_id, subject_id) VALUES ($1, $2)',
            [teacher_id, subject_id]
          );
        }
        
        await client.query('COMMIT');
        
        res.json({
          success: true,
          message: 'Teacher qualifications updated successfully'
        });
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    })
  ];
}

module.exports = TeacherQualificationController;