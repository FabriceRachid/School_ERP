const { pool } = require('./index');

class ParentStudentLink {
  // Create parent-student link (admin only)
  static async createLink(parentId, studentId, schoolId, relationship = 'parent', isPrimary = false, approvedBy = null) {
    const query = `
      INSERT INTO parent_student_links (parent_id, student_id, school_id, relationship, is_primary, approved_by)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, parent_id, student_id, relationship, is_primary, approved_at, created_at
    `;
    
    const values = [parentId, studentId, schoolId, relationship, isPrimary, approvedBy];
    const result = await pool.query(query, values);
    return result.rows[0];
  }
  
  // Get all students for a parent
  static async getStudentsForParent(parentId) {
    const query = `
      SELECT 
        s.id as student_id,
        s.student_id as student_number,
        s.enrollment_date,
        u.first_name as student_first_name,
        u.last_name as student_last_name,
        u.email as student_email,
        ps.relationship,
        ps.is_primary,
        c.name as class_name,
        sch.id as school_id,
        sch.name as school_name
      FROM parent_student_links ps
      JOIN students s ON ps.student_id = s.id
      JOIN users u ON s.user_id = u.id
      LEFT JOIN classes c ON s.class_id = c.id
      JOIN schools sch ON u.school_id = sch.id
      WHERE ps.parent_id = $1
      ORDER BY ps.is_primary DESC, u.last_name, u.first_name
    `;
    
    const result = await pool.query(query, [parentId]);
    return result.rows;
  }
  
  // Get all parents for a student
  static async getParentsForStudent(studentId) {
    const query = `
      SELECT 
        u.id as parent_user_id,
        u.first_name as parent_first_name,
        u.last_name as parent_last_name,
        u.email as parent_email,
        ps.relationship,
        ps.is_primary
      FROM parent_student_links ps
      JOIN users u ON ps.parent_id = u.id
      WHERE ps.student_id = $1
      ORDER BY ps.is_primary DESC, u.last_name, u.first_name
    `;
    
    const result = await pool.query(query, [studentId]);
    return result.rows;
  }
  
  // Check if parent has access to student
  static async hasAccess(parentId, studentId) {
    const query = `
      SELECT id FROM parent_student_links 
      WHERE parent_id = $1 AND student_id = $2
    `;
    
    const result = await pool.query(query, [parentId, studentId]);
    return result.rows.length > 0;
  }
  
  // Remove parent-student link
  static async removeLink(parentId, studentId) {
    const query = `
      DELETE FROM parent_student_links 
      WHERE parent_id = $1 AND student_id = $2
      RETURNING id
    `;
    
    const result = await pool.query(query, [parentId, studentId]);
    return result.rows[0];
  }
  
  // Create parent invitation (admin only)
  static async createInvitation(schoolId, studentId, parentEmail) {
    const code = `PARENT${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7); // 7 days expiry
    
    const query = `
      INSERT INTO parent_invitations (school_id, student_id, invitation_code, parent_email, expires_at)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, invitation_code, expires_at
    `;
    
    const values = [schoolId, studentId, code, parentEmail, expiryDate];
    const result = await pool.query(query, values);
    return result.rows[0];
  }
  
  // Validate parent invitation
  static async validateInvitation(code, parentEmail) {
    const query = `
      SELECT pi.*, s.user_id as student_user_id, sch.name as school_name
      FROM parent_invitations pi
      JOIN students s ON pi.student_id = s.id
      JOIN schools sch ON pi.school_id = sch.id
      WHERE pi.invitation_code = $1 
      AND pi.parent_email = $2 
      AND pi.is_used = false 
      AND pi.expires_at > NOW()
    `;
    
    const result = await pool.query(query, [code, parentEmail]);
    return result.rows[0];
  }
  
  // Mark invitation as used
  static async useInvitation(invitationId) {
    const query = `
      UPDATE parent_invitations 
      SET is_used = true, used_at = NOW()
      WHERE id = $1
      RETURNING id
    `;
    
    const result = await pool.query(query, [invitationId]);
    return result.rows[0];
  }
}

module.exports = ParentStudentLink;
