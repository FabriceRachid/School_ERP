const Student = require('../models/student.model');
const User = require('../models/user.model');
const Class = require('../models/class.model');
const Grade = require('../models/grade.model');
const Payment = require('../models/payment.model');

class StudentService {
  static async createStudent(studentData) {
    // Check if user exists and is a student
    const user = await User.findById(studentData.user_id);
    if (!user) {
      throw new Error('User not found');
    }
    
    if (user.role !== 'student') {
      throw new Error('User must be a student');
    }
    
    // Check if class exists (if provided)
    if (studentData.class_id) {
      const classExists = await Class.findById(studentData.class_id);
      if (!classExists) {
        throw new Error('Class not found');
      }
    }
    
    // Check if student already exists
    const existingStudent = await Student.findByUserId(studentData.user_id);
    if (existingStudent) {
      throw new Error('Student record already exists for this user');
    }
    
    return await Student.create({
      ...studentData,
      enrollment_date: studentData.enrollment_date || new Date()
    });
  }
  
  static async getStudentProfile(studentId) {
    const student = await Student.findById(studentId);
    if (!student) {
      throw new Error('Student not found');
    }
    
    // Get academic record
    const academicRecord = await Student.getAcademicRecord(studentId);
    
    // Get payment history
    const paymentHistory = await Student.getPaymentHistory(studentId);
    
    return {
      ...student,
      academicRecord,
      paymentHistory
    };
  }
  
  static async getStudentAcademicRecord(studentId, filters = {}) {
    const student = await Student.findById(studentId);
    if (!student) {
      throw new Error('Student not found');
    }
    
    let grades = await Student.getAcademicRecord(studentId);
    
    // Apply filters
    if (filters.subject_id) {
      grades = grades.filter(grade => grade.subject_id === filters.subject_id);
    }
    
    if (filters.academic_year) {
      grades = grades.filter(grade => grade.academic_year === filters.academic_year);
    }
    
    if (filters.semester) {
      grades = grades.filter(grade => grade.semester === filters.semester);
    }
    
    // Calculate averages
    const subjectAverages = this.calculateSubjectAverages(grades);
    const overallAverage = this.calculateOverallAverage(grades);
    
    return {
      grades,
      subjectAverages,
      overallAverage,
      count: grades.length
    };
  }
  
  static async getStudentPaymentHistory(studentId) {
    const student = await Student.findById(studentId);
    if (!student) {
      throw new Error('Student not found');
    }
    
    const payments = await Student.getPaymentHistory(studentId);
    
    // Calculate payment summary
    const totalPaid = payments
      .filter(p => p.status === 'completed')
      .reduce((sum, payment) => sum + parseFloat(payment.amount), 0);
    
    const pendingPayments = payments.filter(p => p.status === 'pending').length;
    
    return {
      payments,
      summary: {
        totalPaid,
        pendingPayments,
        totalPayments: payments.length
      }
    };
  }
  
  static async updateStudentClass(studentId, classId) {
    const student = await Student.findById(studentId);
    if (!student) {
      throw new Error('Student not found');
    }
    
    if (classId) {
      const classExists = await Class.findById(classId);
      if (!classExists) {
        throw new Error('Class not found');
      }
    }
    
    return await Student.update(studentId, { class_id: classId });
  }
  
  static calculateSubjectAverages(grades) {
    const subjectGrades = {};
    
    grades.forEach(grade => {
      if (!subjectGrades[grade.subject_name]) {
        subjectGrades[grade.subject_name] = [];
      }
      subjectGrades[grade.subject_name].push(grade);
    });
    
    const averages = {};
    Object.keys(subjectGrades).forEach(subject => {
      const subjectGradesArray = subjectGrades[subject];
      const total = subjectGradesArray.reduce((sum, grade) => sum + (grade.score / grade.max_score * 20), 0);
      averages[subject] = total / subjectGradesArray.length;
    });
    
    return averages;
  }
  
  static calculateOverallAverage(grades) {
    if (grades.length === 0) return 0;
    
    const total = grades.reduce((sum, grade) => sum + (grade.score / grade.max_score * 20), 0);
    return total / grades.length;
  }
  
  static async getStudentsByClass(classId) {
    const classExists = await Class.findById(classId);
    if (!classExists) {
      throw new Error('Class not found');
    }
    
    return await Student.findByClass(classId);
  }
  
  static async getStudentsBySchool(schoolId) {
    return await Student.findBySchool(schoolId);
  }
}

module.exports = StudentService;