const { pool } = require('./index');

class Grade {
  static async create(gradeData) {
    const { student_id, subject_id, teacher_id, evaluation_type, score, max_score, academic_year, semester, date, comments } = gradeData;
    
    const query = `
      INSERT INTO grades (student_id, subject_id, teacher_id, evaluation_type, score, max_score, academic_year, semester, date, comments)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING id, student_id, subject_id, teacher_id, evaluation_type, score, max_score, academic_year, semester, date, comments, created_at
    `;
    
    const values = [student_id, subject_id, teacher_id, evaluation_type, score, max_score, academic_year, semester, date, comments];
    const result = await pool.query(query, values);
    return result.rows[0];
  }
  
  static async findById(id) {
    const query = `
      SELECT g.id, g.student_id, g.subject_id, g.teacher_id, g.evaluation_type, 
             g.score, g.max_score, g.academic_year, g.semester, g.date, g.comments,
             g.created_at, g.updated_at,
             s.name as subject_name, s.coefficient,
             u.first_name as teacher_first_name, u.last_name as teacher_last_name
      FROM grades g
      JOIN subjects s ON g.subject_id = s.id
      LEFT JOIN teachers t ON g.teacher_id = t.id
      LEFT JOIN users u ON t.user_id = u.id
      WHERE g.id = $1
    `;
    
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
  
  static async findByStudent(student_id) {
    const query = `
      SELECT g.id, g.evaluation_type, g.score, g.max_score, g.date, g.comments,
             s.name as subject_name, s.coefficient,
             u.first_name as teacher_first_name, u.last_name as teacher_last_name
      FROM grades g
      JOIN subjects s ON g.subject_id = s.id
      LEFT JOIN teachers t ON g.teacher_id = t.id
      LEFT JOIN users u ON t.user_id = u.id
      WHERE g.student_id = $1
      ORDER BY g.date DESC, s.name
    `;
    
    const result = await pool.query(query, [student_id]);
    return result.rows;
  }
  
  static async findByClassAndSubject(class_id, subject_id, academic_year, semester) {
    const query = `
      SELECT g.id, g.score, g.max_score, g.date,
             s.student_id as student_number,
             u.first_name, u.last_name
      FROM grades g
      JOIN students st ON g.student_id = st.id
      JOIN users u ON st.user_id = u.id
      JOIN subjects sub ON g.subject_id = sub.id
      WHERE st.class_id = $1 AND g.subject_id = $2 
      AND g.academic_year = $3 AND g.semester = $4
      ORDER BY u.last_name, u.first_name
    `;
    
    const result = await pool.query(query, [class_id, subject_id, academic_year, semester]);
    return result.rows;
  }
  
  static async update(id, updateData) {
    const allowedFields = ['evaluation_type', 'score', 'max_score', 'date', 'comments'];
    const fields = Object.keys(updateData).filter(field => allowedFields.includes(field));
    
    if (fields.length === 0) {
      throw new Error('No valid fields to update');
    }
    
    const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
    const values = [id, ...fields.map(field => updateData[field])];
    
    const query = `
      UPDATE grades
      SET ${setClause}, updated_at = NOW()
      WHERE id = $1
      RETURNING id, student_id, subject_id, teacher_id, evaluation_type, score, max_score, date, comments, updated_at
    `;
    
    const result = await pool.query(query, values);
    return result.rows[0];
  }
  
  static async delete(id) {
    const query = `DELETE FROM grades WHERE id = $1 RETURNING id`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
  
  static async getClassAverage(class_id, subject_id, academic_year, semester) {
    const query = `
      SELECT AVG(g.score) as average_score, COUNT(*) as count
      FROM grades g
      JOIN students s ON g.student_id = s.id
      WHERE s.class_id = $1 AND g.subject_id = $2 
      AND g.academic_year = $3 AND g.semester = $4
    `;
    
    const result = await pool.query(query, [class_id, subject_id, academic_year, semester]);
    return result.rows[0];
  }
}

module.exports = Grade;