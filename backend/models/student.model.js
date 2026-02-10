const { pool } = require('./index');

class Student {
  static async create(studentData) {
    const { user_id, class_id, student_id, parent_name, parent_phone, enrollment_date } = studentData;
    
    const query = `
      INSERT INTO students (user_id, class_id, student_id, parent_name, parent_phone, enrollment_date)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, user_id, class_id, student_id, parent_name, parent_phone, enrollment_date, created_at
    `;
    
    const values = [user_id, class_id, student_id, parent_name, parent_phone, enrollment_date];
    const result = await pool.query(query, values);
    return result.rows[0];
  }
  
  static async findById(id) {
    const query = `
      SELECT s.id, s.user_id, s.class_id, s.student_id, s.parent_name, s.parent_phone, 
             s.enrollment_date, s.created_at, s.updated_at,
             u.first_name, u.last_name, u.email, u.phone as user_phone,
             c.name as class_name, c.academic_year
      FROM students s
      JOIN users u ON s.user_id = u.id
      LEFT JOIN classes c ON s.class_id = c.id
      WHERE s.id = $1
    `;
    
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
  
  static async findByUserId(user_id) {
    const query = `SELECT id, user_id, class_id, student_id, parent_name, parent_phone, enrollment_date FROM students WHERE user_id = $1`;
    const result = await pool.query(query, [user_id]);
    return result.rows[0];
  }
  
  static async findByClass(class_id) {
    const query = `
      SELECT s.id, s.student_id, s.parent_name, s.enrollment_date,
             u.first_name, u.last_name, u.email
      FROM students s
      JOIN users u ON s.user_id = u.id
      WHERE s.class_id = $1
      ORDER BY u.last_name, u.first_name
    `;
    
    const result = await pool.query(query, [class_id]);
    return result.rows;
  }
  
  static async findBySchool(school_id) {
    const query = `
      SELECT s.id, s.student_id, s.parent_name, s.enrollment_date,
             u.first_name, u.last_name, u.email,
             c.name as class_name
      FROM students s
      JOIN users u ON s.user_id = u.id
      LEFT JOIN classes c ON s.class_id = c.id
      WHERE u.school_id = $1
      ORDER BY u.last_name, u.first_name
    `;
    
    const result = await pool.query(query, [school_id]);
    return result.rows;
  }
  
  static async update(id, updateData) {
    const allowedFields = ['class_id', 'student_id', 'parent_name', 'parent_phone', 'enrollment_date'];
    const fields = Object.keys(updateData).filter(field => allowedFields.includes(field));
    
    if (fields.length === 0) {
      throw new Error('No valid fields to update');
    }
    
    const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
    const values = [id, ...fields.map(field => updateData[field])];
    
    const query = `
      UPDATE students
      SET ${setClause}, updated_at = NOW()
      WHERE id = $1
      RETURNING id, user_id, class_id, student_id, parent_name, parent_phone, enrollment_date, updated_at
    `;
    
    const result = await pool.query(query, values);
    return result.rows[0];
  }
  
  static async delete(id) {
    const query = `DELETE FROM students WHERE id = $1 RETURNING id`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
  
  static async getAcademicRecord(student_id) {
    const query = `
      SELECT g.id, g.score, g.max_score, g.evaluation_type, g.date, g.comments,
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
  
  static async getPaymentHistory(student_id) {
    const query = `
      SELECT p.id, p.amount, p.payment_date, p.payment_method, p.reference_number, p.status,
             f.name as fee_name, f.amount as fee_amount, f.due_date
      FROM payments p
      JOIN fees f ON p.fee_id = f.id
      WHERE p.student_id = $1
      ORDER BY p.payment_date DESC
    `;
    
    const result = await pool.query(query, [student_id]);
    return result.rows;
  }
}

module.exports = Student;