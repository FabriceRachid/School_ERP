const { pool } = require('./index');

class Fee {
  static async create(feeData) {
    const { school_id, name, amount, description, academic_year, due_date } = feeData;
    
    const query = `
      INSERT INTO fees (school_id, name, amount, description, academic_year, due_date)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, school_id, name, amount, description, academic_year, due_date, created_at
    `;
    
    const values = [school_id, name, amount, description, academic_year, due_date];
    const result = await pool.query(query, values);
    return result.rows[0];
  }
  
  static async findById(id) {
    const query = `SELECT id, school_id, name, amount, description, academic_year, due_date, created_at, updated_at FROM fees WHERE id = $1`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
  
  static async findBySchool(school_id) {
    const query = `
      SELECT id, school_id, name, amount, description, academic_year, due_date, created_at
      FROM fees
      WHERE school_id = $1
      ORDER BY academic_year DESC, due_date
    `;
    
    const result = await pool.query(query, [school_id]);
    return result.rows;
  }
  
  static async findByAcademicYear(school_id, academic_year) {
    const query = `
      SELECT id, school_id, name, amount, description, academic_year, due_date, created_at
      FROM fees
      WHERE school_id = $1 AND academic_year = $2
      ORDER BY name
    `;
    
    const result = await pool.query(query, [school_id, academic_year]);
    return result.rows;
  }
  
  static async update(id, updateData) {
    const allowedFields = ['name', 'amount', 'description', 'academic_year', 'due_date'];
    const fields = Object.keys(updateData).filter(field => allowedFields.includes(field));
    
    if (fields.length === 0) {
      throw new Error('No valid fields to update');
    }
    
    const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
    const values = [id, ...fields.map(field => updateData[field])];
    
    const query = `
      UPDATE fees
      SET ${setClause}, updated_at = NOW()
      WHERE id = $1
      RETURNING id, school_id, name, amount, description, academic_year, due_date, updated_at
    `;
    
    const result = await pool.query(query, values);
    return result.rows[0];
  }
  
  static async delete(id) {
    const query = `DELETE FROM fees WHERE id = $1 RETURNING id`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
  
  static async getPaymentStats(fee_id) {
    const query = `
      SELECT 
        COUNT(*) as total_payments,
        SUM(CASE WHEN status = 'completed' THEN amount ELSE 0 END) as total_paid,
        SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) as pending_amount,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_count,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_count
      FROM payments
      WHERE fee_id = $1
    `;
    
    const result = await pool.query(query, [fee_id]);
    return result.rows[0];
  }
}

module.exports = Fee;