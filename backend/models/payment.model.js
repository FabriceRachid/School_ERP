const { pool } = require('./index');

class Payment {
  static async create(paymentData) {
    const { student_id, fee_id, amount, payment_date, payment_method, reference_number, status } = paymentData;
    
    const query = `
      INSERT INTO payments (student_id, fee_id, amount, payment_date, payment_method, reference_number, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, student_id, fee_id, amount, payment_date, payment_method, reference_number, status, created_at
    `;
    
    const values = [student_id, fee_id, amount, payment_date, payment_method, reference_number, status || 'completed'];
    const result = await pool.query(query, values);
    return result.rows[0];
  }
  
  static async findById(id) {
    const query = `
      SELECT p.id, p.student_id, p.fee_id, p.amount, p.payment_date, 
             p.payment_method, p.reference_number, p.status, p.created_at, p.updated_at,
             f.name as fee_name, f.amount as fee_amount,
             s.student_id as student_number,
             u.first_name, u.last_name
      FROM payments p
      JOIN fees f ON p.fee_id = f.id
      JOIN students s ON p.student_id = s.id
      JOIN users u ON s.user_id = u.id
      WHERE p.id = $1
    `;
    
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
  
  static async findByStudent(student_id) {
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
  
  static async findByFee(fee_id) {
    const query = `
      SELECT p.id, p.amount, p.payment_date, p.payment_method, p.reference_number, p.status,
             s.student_id as student_number,
             u.first_name, u.last_name
      FROM payments p
      JOIN students s ON p.student_id = s.id
      JOIN users u ON s.user_id = u.id
      WHERE p.fee_id = $1
      ORDER BY p.payment_date DESC
    `;
    
    const result = await pool.query(query, [fee_id]);
    return result.rows;
  }
  
  static async update(id, updateData) {
    const allowedFields = ['amount', 'payment_date', 'payment_method', 'reference_number', 'status'];
    const fields = Object.keys(updateData).filter(field => allowedFields.includes(field));
    
    if (fields.length === 0) {
      throw new Error('No valid fields to update');
    }
    
    const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
    const values = [id, ...fields.map(field => updateData[field])];
    
    const query = `
      UPDATE payments
      SET ${setClause}, updated_at = NOW()
      WHERE id = $1
      RETURNING id, student_id, fee_id, amount, payment_date, payment_method, reference_number, status, updated_at
    `;
    
    const result = await pool.query(query, values);
    return result.rows[0];
  }
  
  static async delete(id) {
    const query = `DELETE FROM payments WHERE id = $1 RETURNING id`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
  
  static async getSchoolStats(school_id, academic_year) {
    const query = `
      SELECT 
        COUNT(*) as total_payments,
        SUM(p.amount) as total_amount,
        COUNT(CASE WHEN p.status = 'completed' THEN 1 END) as completed_count,
        SUM(CASE WHEN p.status = 'completed' THEN p.amount ELSE 0 END) as completed_amount,
        COUNT(CASE WHEN p.status = 'pending' THEN 1 END) as pending_count
      FROM payments p
      JOIN fees f ON p.fee_id = f.id
      WHERE f.school_id = $1 AND f.academic_year = $2
    `;
    
    const result = await pool.query(query, [school_id, academic_year]);
    return result.rows[0];
  }
}

module.exports = Payment;