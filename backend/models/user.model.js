const { pool } = require('./index');

class User {
  static async create(userData) {
    const { school_id, first_name, last_name, email, password_hash, role, phone, address, date_of_birth } = userData;
    
    const query = `
      INSERT INTO users (school_id, first_name, last_name, email, password_hash, role, phone, address, date_of_birth)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id, school_id, first_name, last_name, email, role, status, phone, address, date_of_birth, created_at
    `;
    
    const values = [school_id, first_name, last_name, email, password_hash, role, phone, address, date_of_birth];
    const result = await pool.query(query, values);
    return result.rows[0];
  }
  
  static async findById(id) {
    const query = `
      SELECT id, school_id, first_name, last_name, email, role, status, phone, address, date_of_birth, created_at, updated_at
      FROM users
      WHERE id = $1 AND status != 'disabled'
    `;
    
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
  
  static async findByEmail(email) {
    const query = `
      SELECT id, school_id, first_name, last_name, email, password_hash, role, status, phone, address, date_of_birth, created_at
      FROM users
      WHERE email = $1 AND status != 'disabled'
    `;
    
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }
  
  static async findBySchool(school_id) {
    const query = `
      SELECT id, school_id, first_name, last_name, email, role, status, phone, address, date_of_birth, created_at
      FROM users
      WHERE school_id = $1 AND status != 'disabled'
      ORDER BY created_at DESC
    `;
    
    const result = await pool.query(query, [school_id]);
    return result.rows;
  }
  
  static async update(id, updateData) {
    const allowedFields = ['first_name', 'last_name', 'email', 'role', 'status', 'phone', 'address', 'date_of_birth'];
    const fields = Object.keys(updateData).filter(field => allowedFields.includes(field));
    
    if (fields.length === 0) {
      throw new Error('No valid fields to update');
    }
    
    const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
    const values = [id, ...fields.map(field => updateData[field])];
    
    const query = `
      UPDATE users
      SET ${setClause}, updated_at = NOW()
      WHERE id = $1
      RETURNING id, school_id, first_name, last_name, email, role, status, phone, address, date_of_birth, updated_at
    `;
    
    const result = await pool.query(query, values);
    return result.rows[0];
  }
  
  static async delete(id) {
    const query = `UPDATE users SET status = 'disabled', updated_at = NOW() WHERE id = $1 RETURNING id`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
  
  static async search(school_id, searchTerm) {
    const query = `
      SELECT id, school_id, first_name, last_name, email, role, status, phone, created_at
      FROM users
      WHERE school_id = $1 
      AND status != 'disabled'
      AND (first_name ILIKE $2 OR last_name ILIKE $2 OR email ILIKE $2)
      ORDER BY first_name, last_name
    `;
    
    const result = await pool.query(query, [school_id, `%${searchTerm}%`]);
    return result.rows;
  }
}

module.exports = User;