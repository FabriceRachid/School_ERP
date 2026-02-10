const { pool } = require('./index');

class School {
  static async create(schoolData) {
    const { name, address, phone, email } = schoolData;
    
    const query = `
      INSERT INTO schools (name, address, phone, email)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, address, phone, email, created_at
    `;
    
    const values = [name, address, phone, email];
    const result = await pool.query(query, values);
    return result.rows[0];
  }
  
  static async findById(id) {
    const query = `SELECT id, name, address, phone, email, created_at, updated_at FROM schools WHERE id = $1`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
  
  static async findAll() {
    const query = `SELECT id, name, address, phone, email, created_at FROM schools ORDER BY name`;
    const result = await pool.query(query);
    return result.rows;
  }
  
  static async update(id, updateData) {
    const allowedFields = ['name', 'address', 'phone', 'email'];
    const fields = Object.keys(updateData).filter(field => allowedFields.includes(field));
    
    if (fields.length === 0) {
      throw new Error('No valid fields to update');
    }
    
    const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
    const values = [id, ...fields.map(field => updateData[field])];
    
    const query = `
      UPDATE schools
      SET ${setClause}, updated_at = NOW()
      WHERE id = $1
      RETURNING id, name, address, phone, email, updated_at
    `;
    
    const result = await pool.query(query, values);
    return result.rows[0];
  }
  
  static async delete(id) {
    const query = `DELETE FROM schools WHERE id = $1 RETURNING id`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
  
  static async getStats(id) {
    const stats = {};
    
    // Count users
    const userCount = await pool.query(
      'SELECT COUNT(*) as count FROM users WHERE school_id = $1 AND status = $2',
      [id, 'active']
    );
    stats.userCount = parseInt(userCount.rows[0].count);
    
    // Count classes
    const classCount = await pool.query(
      'SELECT COUNT(*) as count FROM classes WHERE school_id = $1',
      [id]
    );
    stats.classCount = parseInt(classCount.rows[0].count);
    
    // Count students
    const studentCount = await pool.query(
      `SELECT COUNT(*) as count FROM students s 
       JOIN users u ON s.user_id = u.id 
       WHERE u.school_id = $1 AND u.status = $2`,
      [id, 'active']
    );
    stats.studentCount = parseInt(studentCount.rows[0].count);
    
    // Count teachers
    const teacherCount = await pool.query(
      `SELECT COUNT(*) as count FROM teachers t 
       JOIN users u ON t.user_id = u.id 
       WHERE u.school_id = $1 AND u.status = $2`,
      [id, 'active']
    );
    stats.teacherCount = parseInt(teacherCount.rows[0].count);
    
    return stats;
  }
}

module.exports = School;