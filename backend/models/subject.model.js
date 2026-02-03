const { pool } = require('./index');

class Subject {
  static async create(subjectData) {
    const { school_id, name, code, coefficient } = subjectData;
    
    const query = `
      INSERT INTO subjects (school_id, name, code, coefficient)
      VALUES ($1, $2, $3, $4)
      RETURNING id, school_id, name, code, coefficient, created_at
    `;
    
    const values = [school_id, name, code, coefficient];
    const result = await pool.query(query, values);
    return result.rows[0];
  }
  
  static async findById(id) {
    const query = `SELECT id, school_id, name, code, coefficient, created_at, updated_at FROM subjects WHERE id = $1`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
  
  static async findBySchool(school_id) {
    const query = `
      SELECT id, school_id, name, code, coefficient, created_at
      FROM subjects
      WHERE school_id = $1
      ORDER BY name
    `;
    
    const result = await pool.query(query, [school_id]);
    return result.rows;
  }
  
  static async findByCode(code) {
    const query = `SELECT id, school_id, name, code, coefficient FROM subjects WHERE code = $1`;
    const result = await pool.query(query, [code]);
    return result.rows[0];
  }
  
  static async update(id, updateData) {
    const allowedFields = ['name', 'code', 'coefficient'];
    const fields = Object.keys(updateData).filter(field => allowedFields.includes(field));
    
    if (fields.length === 0) {
      throw new Error('No valid fields to update');
    }
    
    const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
    const values = [id, ...fields.map(field => updateData[field])];
    
    const query = `
      UPDATE subjects
      SET ${setClause}, updated_at = NOW()
      WHERE id = $1
      RETURNING id, school_id, name, code, coefficient, updated_at
    `;
    
    const result = await pool.query(query, values);
    return result.rows[0];
  }
  
  static async delete(id) {
    const query = `DELETE FROM subjects WHERE id = $1 RETURNING id`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
  
  static async getClasses(subject_id) {
    const query = `
      SELECT c.id, c.name, c.academic_year, c.level
      FROM classes c
      JOIN class_subjects cs ON c.id = cs.class_id
      WHERE cs.subject_id = $1
      ORDER BY c.academic_year DESC, c.name
    `;
    
    const result = await pool.query(query, [subject_id]);
    return result.rows;
  }
  
  static async getTeachers(subject_id) {
    const query = `
      SELECT DISTINCT t.id, u.first_name, u.last_name, u.email
      FROM teachers t
      JOIN users u ON t.user_id = u.id
      JOIN teacher_assignments ta ON t.id = ta.teacher_id
      WHERE ta.subject_id = $1
      ORDER BY u.last_name, u.first_name
    `;
    
    const result = await pool.query(query, [subject_id]);
    return result.rows;
  }
}

module.exports = Subject;