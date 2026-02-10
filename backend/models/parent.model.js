const { pool } = require('./index');

class Parent {
  static async create(parentData) {
    const { first_name, last_name, email, phone, address } = parentData;
    
    const query = `
      INSERT INTO parents (first_name, last_name, email, phone, address)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, first_name, last_name, email, phone, address, created_at
    `;
    
    const values = [first_name, last_name, email, phone, address];
    const result = await pool.query(query, values);
    return result.rows[0];
  }
  
  static async findById(id) {
    const query = `
      SELECT id, first_name, last_name, email, phone, address, created_at, updated_at
      FROM parents
      WHERE id = $1
    `;
    
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
  
  static async findByEmail(email) {
    const query = `
      SELECT id, first_name, last_name, email, phone, address, created_at
      FROM parents
      WHERE email = $1
    `;
    
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }
  
  static async findByStudent(student_id) {
    const query = `
      SELECT p.id, p.first_name, p.last_name, p.email, p.phone, sp.relationship, sp.is_primary
      FROM parents p
      JOIN student_parents sp ON p.id = sp.parent_id
      WHERE sp.student_id = $1
      ORDER BY sp.is_primary DESC, p.last_name, p.first_name
    `;
    
    const result = await pool.query(query, [student_id]);
    return result.rows;
  }
  
  static async getStudents(parent_id) {
    const query = `
      SELECT s.id, s.student_id, s.enrollment_date,
             u.first_name, u.last_name, u.email,
             c.name as class_name,
             sp.relationship, sp.is_primary
      FROM students s
      JOIN users u ON s.user_id = u.id
      LEFT JOIN classes c ON s.class_id = c.id
      JOIN student_parents sp ON s.id = sp.student_id
      WHERE sp.parent_id = $1
      ORDER BY sp.is_primary DESC, u.last_name, u.first_name
    `;
    
    const result = await pool.query(query, [parent_id]);
    return result.rows;
  }
  
  static async update(id, updateData) {
    const allowedFields = ['first_name', 'last_name', 'email', 'phone', 'address'];
    const fields = Object.keys(updateData).filter(field => allowedFields.includes(field));
    
    if (fields.length === 0) {
      throw new Error('No valid fields to update');
    }
    
    const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
    const values = [id, ...fields.map(field => updateData[field])];
    
    const query = `
      UPDATE parents
      SET ${setClause}, updated_at = NOW()
      WHERE id = $1
      RETURNING id, first_name, last_name, email, phone, address, updated_at
    `;
    
    const result = await pool.query(query, values);
    return result.rows[0];
  }
  
  static async delete(id) {
    const query = `DELETE FROM parents WHERE id = $1 RETURNING id`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
  
  static async linkToStudent(parent_id, student_id, relationship, is_primary = false) {
    const query = `
      INSERT INTO student_parents (student_id, parent_id, relationship, is_primary)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (student_id, parent_id) DO UPDATE
      SET relationship = $3, is_primary = $4
      RETURNING id, student_id, parent_id, relationship, is_primary
    `;
    
    const values = [student_id, parent_id, relationship, is_primary];
    const result = await pool.query(query, values);
    return result.rows[0];
  }
  
  static async unlinkFromStudent(parent_id, student_id) {
    const query = `DELETE FROM student_parents WHERE parent_id = $1 AND student_id = $2 RETURNING id`;
    const result = await pool.query(query, [parent_id, student_id]);
    return result.rows[0];
  }
  
  static async setPrimaryParent(student_id, parent_id) {
    // First set all parents for this student to non-primary
    await pool.query(
      'UPDATE student_parents SET is_primary = false WHERE student_id = $1',
      [student_id]
    );
    
    // Then set the specified parent as primary
    const query = `UPDATE student_parents SET is_primary = true WHERE student_id = $1 AND parent_id = $2 RETURNING id`;
    const result = await pool.query(query, [student_id, parent_id]);
    return result.rows[0];
  }
}

module.exports = Parent;