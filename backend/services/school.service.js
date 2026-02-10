const pool = require('../db');

class SchoolService {
  // Generate unique invitation code for school registration
  static async generateInvitationCode(schoolId, expiresInDays = 30) {
    try {
      const code = `ECOLE${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + expiresInDays);
      
      const result = await pool.query(
        'INSERT INTO school_invitations (school_id, invitation_code, expires_at, is_active) VALUES ($1, $2, $3, $4) RETURNING id',
        [schoolId, code, expiryDate, true]
      );
      
      return {
        success: true,
        code: code,
        expiresAt: expiryDate
      };
    } catch (error) {
      console.error('Error generating invitation code:', error);
      return { success: false, error: error.message };
    }
  }

  // Validate invitation code
  static async validateInvitationCode(code) {
    try {
      const result = await pool.query(
        'SELECT si.*, s.name as school_name FROM school_invitations si JOIN schools s ON si.school_id = s.id WHERE si.invitation_code = $1 AND si.is_active = true AND si.expires_at > NOW()',
        [code]
      );
      
      if (result.rows.length > 0) {
        return {
          success: true,
          schoolId: result.rows[0].school_id,
          schoolName: result.rows[0].school_name
        };
      } else {
        return { success: false, error: 'Code d\'invitation invalide ou expiré' };
      }
    } catch (error) {
      console.error('Error validating invitation code:', error);
      return { success: false, error: error.message };
    }
  }

  // Get all schools for dropdown selection
  static async getAllSchools() {
    try {
      const result = await pool.query(
        'SELECT id, name, address, email FROM schools WHERE id != $1 ORDER BY name',
        ['00000000-0000-0000-0000-000000000001'] // Exclude demo school
      );
      
      return {
        success: true,
        schools: result.rows
      };
    } catch (error) {
      console.error('Error fetching schools:', error);
      return { success: false, error: error.message };
    }
  }

  // Create new school (admin function)
  static async createSchool(schoolData) {
    try {
      const { name, address, phone, email, adminUserId } = schoolData;
      
      const result = await pool.query(
        'INSERT INTO schools (name, address, phone, email) VALUES ($1, $2, $3, $4) RETURNING id',
        [name, address, phone, email]
      );
      
      const schoolId = result.rows[0].id;
      
      // Optionally link admin user to this school
      if (adminUserId) {
        await pool.query(
          'UPDATE users SET school_id = $1 WHERE id = $2',
          [schoolId, adminUserId]
        );
      }
      
      return {
        success: true,
        schoolId: schoolId,
        message: 'École créée avec succès'
      };
    } catch (error) {
      console.error('Error creating school:', error);
      return { success: false, error: error.message };
    }
  }

  // Get parent's children and their schools
  static async getParentChildren(parentId) {
    try {
      const result = await pool.query(`
        SELECT 
          s.id as student_id,
          s.first_name,
          s.last_name,
          sch.id as school_id,
          sch.name as school_name,
          sch.address as school_address
        FROM students s
        JOIN schools sch ON s.school_id = sch.id
        WHERE s.parent_id = $1
        ORDER BY sch.name, s.first_name
      `, [parentId]);
      
      return {
        success: true,
        children: result.rows
      };
    } catch (error) {
      console.error('Error fetching parent children:', error);
      return { success: false, error: error.message };
    }
  }

  // Link parent to multiple schools (for parents with children in different schools)
  static async linkParentToSchool(parentId, schoolId, relationship = 'guardian') {
    try {
      await pool.query(`
        INSERT INTO parent_school_links (parent_id, school_id, relationship, is_primary_contact)
        VALUES ($1, $2, $3, false)
        ON CONFLICT (parent_id, school_id) DO NOTHING
      `, [parentId, schoolId, relationship]);
      
      return {
        success: true,
        message: 'Lien parent-école créé'
      };
    } catch (error) {
      console.error('Error linking parent to school:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = SchoolService;