const { pool } = require('./index');
const User = require('./user.model');
const Student = require('./student.model');
const Class = require('./class.model');
const ParentStudentLink = require('./parent_student_link.model');

class AdminSetup {
  // Admin creates parent account (pre-activation)
  static async createParentAccount(schoolId, firstName, lastName, email) {
    // Check if email already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      throw new Error('Email already registered');
    }
    
    // Create parent account with pending status
    const parentData = {
      school_id: schoolId,
      first_name: firstName,
      last_name: lastName,
      email: email,
      password_hash: 'PENDING', // Special marker for unactivated accounts
      role: 'parent'
    };
    
    const parent = await User.create(parentData);
    return parent;
  }
  
  // Admin creates student account with temporary password
  static async createStudentAccount(schoolId, firstName, lastName, email, className) {
    // Check if email already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      throw new Error('Email already registered');
    }
    
    // Find or create class by name
    let classRecord = await Class.findByName(schoolId, className);
    if (!classRecord) {
      // Create the class if it doesn't exist
      classRecord = await Class.create({
        school_id: schoolId,
        name: className,
        academic_year: new Date().getFullYear().toString()
      });
    }
    
    // Generate temporary password
    const tempPassword = `Temp${Math.random().toString(36).slice(-8)}`;
    const passwordHash = await require('../utils/password').hash(tempPassword);
    
    // Create student user
    const userData = {
      school_id: schoolId,
      first_name: firstName,
      last_name: lastName,
      email: email,
      password_hash: passwordHash,
      role: 'student'
    };
    
    const user = await User.create(userData);
    
    // Generate student ID
    const studentId = `STD${Date.now().toString().slice(-6)}`;
    
    // Create student record
    const studentData = {
      user_id: user.id,
      student_id: studentId,
      class_id: classRecord.id,
      enrollment_date: new Date()
    };
    
    const student = await Student.create(studentData);
    
    return {
      user: user,
      student: student,
      temporary_password: tempPassword
    };
  }
  
  // Admin links parent to student
  static async linkParentToStudent(parentId, studentId, relationship = 'parent', isPrimary = true) {
    // Verify parent exists and is parent role
    const parent = await User.findById(parentId);
    if (!parent || parent.role !== 'parent') {
      throw new Error('Invalid parent user');
    }
    
    // Verify student exists
    const student = await Student.findById(studentId);
    if (!student) {
      throw new Error('Invalid student');
    }
    
    // Check if link already exists
    const existingLink = await ParentStudentLink.hasAccess(parentId, studentId);
    if (existingLink) {
      throw new Error('Parent-student link already exists');
    }
    
    // Create the link
    const link = await ParentStudentLink.createLink(parentId, studentId, relationship, isPrimary);
    return link;
  }
  
  // Get all unactivated parent accounts for school
  static async getUnactivatedParents(schoolId) {
    const query = `
      SELECT id, first_name, last_name, email, created_at
      FROM users
      WHERE school_id = $1 
      AND role = 'parent' 
      AND password_hash = 'PENDING'
      ORDER BY created_at DESC
    `;
    
    const result = await pool.query(query, [schoolId]);
    return result.rows;
  }
  
  // Get all students without parent links
  static async getStudentsWithoutParents(schoolId) {
    const query = `
      SELECT s.id, s.student_id, u.first_name, u.last_name, u.email, c.name as class_name
      FROM students s
      JOIN users u ON s.user_id = u.id
      LEFT JOIN classes c ON s.class_id = c.id
      LEFT JOIN parent_student_links psl ON s.id = psl.student_id
      WHERE u.school_id = $1 
      AND psl.id IS NULL
      ORDER BY u.last_name, u.first_name
    `;
    
    const result = await pool.query(query, [schoolId]);
    return result.rows;
  }
}

module.exports = AdminSetup;
