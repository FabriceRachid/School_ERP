const { pool } = require('./index');

class Class {
  static async create(classData) {
    const { school_id, name, academic_year, level } = classData;
    
    const query = `
      INSERT INTO classes (school_id, name, academic_year, level)
      VALUES ($1, $2, $3, $4)
      RETURNING id, school_id, name, academic_year, level, created_at
    `;
    
    const values = [school_id, name, academic_year, level];
    const result = await pool.query(query, values);
    return result.rows[0];
  }
  
  static async findById(id) {
    const query = `SELECT id, school_id, name, academic_year, level, created_at, updated_at FROM classes WHERE id = $1`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
  
  static async findBySchool(school_id) {
    const query = `
      SELECT id, school_id, name, academic_year, level, created_at
      FROM classes
      WHERE school_id = $1
      ORDER BY academic_year DESC, name
    `;
    
    const result = await pool.query(query, [school_id]);
    return result.rows;
  }
  
  static async findByAcademicYear(school_id, academic_year) {
    const query = `
      SELECT id, school_id, name, academic_year, level, created_at
      FROM classes
      WHERE school_id = $1 AND academic_year = $2
      ORDER BY name
    `;
    
    const result = await pool.query(query, [school_id, academic_year]);
    return result.rows;
  }
  
  static async update(id, updateData) {
    const allowedFields = ['name', 'academic_year', 'level'];
    const fields = Object.keys(updateData).filter(field => allowedFields.includes(field));
    
    if (fields.length === 0) {
      throw new Error('No valid fields to update');
    }
    
    const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
    const values = [id, ...fields.map(field => updateData[field])];
    
    const query = `
      UPDATE classes
      SET ${setClause}, updated_at = NOW()
      WHERE id = $1
      RETURNING id, school_id, name, academic_year, level, updated_at
    `;
    
    const result = await pool.query(query, values);
    return result.rows[0];
  }
  
  static async delete(id) {
    const query = `DELETE FROM classes WHERE id = $1 RETURNING id`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
  
  static async getStudents(class_id) {
    const query = `
      SELECT s.id, s.student_id,
             u.first_name, u.last_name, u.email
      FROM students s
      JOIN users u ON s.user_id = u.id
      WHERE s.class_id = $1
      ORDER BY u.last_name, u.first_name
    `;
    
    const result = await pool.query(query, [class_id]);
    return result.rows;
  }
  
  static async getSubjects(class_id) {
    const query = `
      SELECT s.id, s.name, s.code, s.coefficient
      FROM subjects s
      JOIN class_subjects cs ON s.id = cs.subject_id
      WHERE cs.class_id = $1
      ORDER BY s.name
    `;
    
    const result = await pool.query(query, [class_id]);
    return result.rows;
  }
  
  static async addSubject(class_id, subject_id) {
    const query = `
      INSERT INTO class_subjects (class_id, subject_id)
      VALUES ($1, $2)
      ON CONFLICT (class_id, subject_id) DO NOTHING
      RETURNING id
    `;
    
    const result = await pool.query(query, [class_id, subject_id]);
    return result.rows[0];
  }
  
  static async removeSubject(class_id, subject_id) {
    const query = `DELETE FROM class_subjects WHERE class_id = $1 AND subject_id = $2 RETURNING id`;
    const result = await pool.query(query, [class_id, subject_id]);
    return result.rows[0];
  }
}

module.exports = Class;