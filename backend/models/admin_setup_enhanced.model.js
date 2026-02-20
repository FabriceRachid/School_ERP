// Enhanced Admin Setup Model with ALL Mandatory Fields Support
const { pool } = require('./index');
const User = require('./user.model');
const Student = require('./student.model');
const ParentStudentLink = require('./parent_student_link.model');
const Class = require('./class.model');
const Teacher = require('./teacher.model');

class AdminSetup {
  // Admin creates parent account with ALL mandatory fields
  static async createParentAccount(schoolId, firstName, lastName, email, phone, address) {
    // Check if email already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      throw new Error('Email already registered');
    }
    
    // Create parent account with pending status and ALL information
    const parentData = {
      school_id: schoolId,
      first_name: firstName,
      last_name: lastName,
      email: email,
      password_hash: 'PENDING', // Special marker for unactivated accounts
      role: 'parent',
      phone: phone,
      address: address
    };
    
    const parent = await User.create(parentData);
    return parent;
  }
  
  // Admin creates student account with ALL mandatory fields and auto-class creation
  static async createStudentAccount(
    schoolId, firstName, lastName, email, phone, address, dateOfBirth,
    className, parentName, parentPhone, gender, medicalInfo,
    emergencyContactName, emergencyContactPhone
  ) {
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
        academic_year: new Date().getFullYear().toString(),
        level: this.inferLevelFromClass(className) // Auto-detect level
      });
    }
    
    // Generate temporary password
    const tempPassword = `Temp${Math.random().toString(36).slice(-8)}`;
    const passwordHash = await require('../utils/password').hash(tempPassword);
    
    // Create student user with ALL information
    const userData = {
      school_id: schoolId,
      first_name: firstName,
      last_name: lastName,
      email: email,
      password_hash: passwordHash,
      role: 'student',
      phone: phone,
      address: address,
      date_of_birth: dateOfBirth
    };
    
    const user = await User.create(userData);
    
    // Generate student ID
    const studentId = `STD${Date.now().toString().slice(-6)}`;
    
    // Create student record with ALL mandatory fields
    const studentData = {
      user_id: user.id,
      student_id: studentId,
      class_id: classRecord.id,
      parent_name: parentName,
      parent_phone: parentPhone,
      date_of_birth: dateOfBirth,
      gender: gender,
      address: address,
      emergency_contact_name: emergencyContactName,
      emergency_contact_phone: emergencyContactPhone,
      medical_info: medicalInfo,
      enrollment_date: new Date()
    };
    
    const student = await Student.create(studentData);
    
    return {
      user: user,
      student: student,
      temporary_password: tempPassword,
      class: classRecord
    };
  }
  
  // Admin creates teacher account with ALL mandatory fields
  static async createTeacherAccount(
    schoolId, firstName, lastName, email, phone, address, dateOfBirth,
    specialization, hireDate, salary
  ) {
    // Check if email already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      throw new Error('Email already registered');
    }
    
    // Generate temporary password for teacher
    const tempPassword = `Teach${Math.random().toString(36).slice(-8)}`;
    const passwordHash = await require('../utils/password').hash(tempPassword);
    
    // Create teacher user with ALL information
    const userData = {
      school_id: schoolId,
      first_name: firstName,
      last_name: lastName,
      email: email,
      password_hash: passwordHash,
      role: 'teacher',
      phone: phone,
      address: address,
      date_of_birth: dateOfBirth
    };
    
    const user = await User.create(userData);
    
    // Create teacher record with ALL mandatory fields
    const teacherData = {
      user_id: user.id,
      specialization: specialization,
      hire_date: hireDate,
      salary: salary
    };
    
    const teacher = await Teacher.create(teacherData);
    
    return {
      user: user,
      teacher: teacher,
      temporary_password: tempPassword
    };
  }
  
  // Admin links parent to student
  static async linkParentToStudent(parentId, studentId, relationship = 'parent', isPrimary = false) {
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
      SELECT id, first_name, last_name, email, phone, address, created_at
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
      SELECT s.id, s.student_id, u.first_name, u.last_name, u.email, u.phone, u.address,
             c.name as class_name, s.parent_name, s.parent_phone, s.gender
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
  
  // Helper method to infer level from class name
  static inferLevelFromClass(className) {
    const classNameLower = className.toLowerCase();
    
    // Primary school detection
    if (classNameLower.includes('cp') || classNameLower.includes('ce1') || 
        classNameLower.includes('ce2') || classNameLower.includes('cm1') || 
        classNameLower.includes('cm2') || /\b[1-6][a-z]?\b/i.test(className)) {
      return 'Primaire';
    }
    
    // Secondary school detection
    if (classNameLower.includes('6e') || classNameLower.includes('5e') || 
        classNameLower.includes('4e') || classNameLower.includes('3e') ||
        /\b[7-9][a-z]?\b/i.test(className)) {
      return 'Secondaire';
    }
    
    // High school detection
    if (classNameLower.includes('2nde') || classNameLower.includes('1ere') || 
        classNameLower.includes('terminale') || classNameLower.includes('tle') ||
        /\b1[0-2][a-z]?\b/i.test(className)) {
      return 'Lycée';
    }
    
    return 'Secondaire'; // Default fallback
  }
}

module.exports = AdminSetup;