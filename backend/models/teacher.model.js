const { pool } = require('./index');

class Teacher {
  static async create(teacherData) {
    const { user_id, specialization, hire_date, salary } = teacherData;
    
    const query = `
      INSERT INTO teachers (user_id, specialization, hire_date, salary)
      VALUES ($1, $2, $3, $4)
      RETURNING id, user_id, specialization, hire_date, salary, created_at
    `;
    
    const values = [user_id, specialization, hire_date, salary];
    const result = await pool.query(query, values);
    return result.rows[0];
  }
  
  static async findById(id) {
    const query = `
      SELECT t.id, t.user_id, t.specialization, t.hire_date, t.salary, t.created_at, t.updated_at,
             u.first_name, u.last_name, u.email, u.phone
      FROM teachers t
      JOIN users u ON t.user_id = u.id
      WHERE t.id = $1
    `;
    
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
  
  static async findByUserId(user_id) {
    const query = `SELECT id, user_id, specialization, hire_date, salary FROM teachers WHERE user_id = $1`;
    const result = await pool.query(query, [user_id]);
    return result.rows[0];
  }
  
  static async findBySchool(school_id) {
    const query = `
      SELECT t.id, t.specialization, t.hire_date, t.salary,
             u.first_name, u.last_name, u.email, u.phone
      FROM teachers t
      JOIN users u ON t.user_id = u.id
      WHERE u.school_id = $1 AND u.status = $2
      ORDER BY u.last_name, u.first_name
    `;
    
    const result = await pool.query(query, [school_id, 'active']);
    return result.rows;
  }
  
  static async update(id, updateData) {
    const allowedFields = ['specialization', 'hire_date', 'salary'];
    const fields = Object.keys(updateData).filter(field => allowedFields.includes(field));
    
    if (fields.length === 0) {
      throw new Error('No valid fields to update');
    }
    
    const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
    const values = [id, ...fields.map(field => updateData[field])];
    
    const query = `
      UPDATE teachers
      SET ${setClause}, updated_at = NOW()
      WHERE id = $1
      RETURNING id, user_id, specialization, hire_date, salary, updated_at
    `;
    
    const result = await pool.query(query, values);
    return result.rows[0];
  }
  
  static async delete(id) {
    const query = `DELETE FROM teachers WHERE id = $1 RETURNING id`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
  
  static async getAssignments(teacher_id) {
    const query = `
      SELECT ta.id, ta.class_id, ta.subject_id, ta.academic_year,
             c.name as class_name, c.level,
             s.name as subject_name, s.coefficient
      FROM teacher_assignments ta
      JOIN classes c ON ta.class_id = c.id
      JOIN subjects s ON ta.subject_id = s.id
      WHERE ta.teacher_id = $1
      ORDER BY ta.academic_year DESC, c.name, s.name
    `;
    
    const result = await pool.query(query, [teacher_id]);
    return result.rows;
  }
  
  static async getStudents(teacher_id, academic_year) {
    const query = `
      SELECT DISTINCT s.id as student_id, s.student_id as student_number,
             u.first_name, u.last_name, u.email,
             c.name as class_name, c.level
      FROM teacher_assignments ta
      JOIN classes c ON ta.class_id = c.id
      JOIN students st ON st.class_id = c.id
      JOIN users u ON st.user_id = u.id
      JOIN subjects s ON ta.subject_id = s.id
      WHERE ta.teacher_id = $1 AND ta.academic_year = $2
      ORDER BY c.name, u.last_name, u.first_name
    `;
    
    const result = await pool.query(query, [teacher_id, academic_year]);
    return result.rows;
  }
}

module.exports = Teacher;