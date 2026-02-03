const { pool } = require('./index');

class Notification {
  static async create(notificationData) {
    const { sender_id, recipient_id, title, message, type } = notificationData;
    
    const query = `
      INSERT INTO notifications (sender_id, recipient_id, title, message, type)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, sender_id, recipient_id, title, message, type, status, created_at
    `;
    
    const values = [sender_id, recipient_id, title, message, type];
    const result = await pool.query(query, values);
    return result.rows[0];
  }
  
  static async findById(id) {
    const query = `
      SELECT n.id, n.sender_id, n.recipient_id, n.title, n.message, n.type, 
             n.status, n.created_at, n.read_at,
             s.first_name as sender_first_name, s.last_name as sender_last_name,
             r.first_name as recipient_first_name, r.last_name as recipient_last_name
      FROM notifications n
      JOIN users s ON n.sender_id = s.id
      JOIN users r ON n.recipient_id = r.id
      WHERE n.id = $1
    `;
    
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
  
  static async findByRecipient(recipient_id, limit = 50) {
    const query = `
      SELECT n.id, n.sender_id, n.title, n.message, n.type, n.status, n.created_at,
             u.first_name as sender_first_name, u.last_name as sender_last_name
      FROM notifications n
      JOIN users u ON n.sender_id = u.id
      WHERE n.recipient_id = $1
      ORDER BY n.created_at DESC
      LIMIT $2
    `;
    
    const result = await pool.query(query, [recipient_id, limit]);
    return result.rows;
  }
  
  static async getUnreadCount(recipient_id) {
    const query = `SELECT COUNT(*) as count FROM notifications WHERE recipient_id = $1 AND status = 'unread'`;
    const result = await pool.query(query, [recipient_id]);
    return parseInt(result.rows[0].count);
  }
  
  static async markAsRead(id) {
    const query = `UPDATE notifications SET status = 'read', read_at = NOW() WHERE id = $1 RETURNING id, status, read_at`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
  
  static async markAllAsRead(recipient_id) {
    const query = `UPDATE notifications SET status = 'read', read_at = NOW() WHERE recipient_id = $1 AND status = 'unread' RETURNING COUNT(*) as count`;
    const result = await pool.query(query, [recipient_id]);
    return result.rows[0];
  }
  
  static async delete(id) {
    const query = `DELETE FROM notifications WHERE id = $1 RETURNING id`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
  
  static async getRecentBySchool(school_id, limit = 20) {
    const query = `
      SELECT n.id, n.title, n.message, n.type, n.created_at,
             s.first_name as sender_first_name, s.last_name as sender_last_name,
             r.first_name as recipient_first_name, r.last_name as recipient_last_name
      FROM notifications n
      JOIN users s ON n.sender_id = s.id
      JOIN users r ON n.recipient_id = r.id
      WHERE s.school_id = $1 OR r.school_id = $1
      ORDER BY n.created_at DESC
      LIMIT $2
    `;
    
    const result = await pool.query(query, [school_id, limit]);
    return result.rows;
  }
}

module.exports = Notification;