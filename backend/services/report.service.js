const School = require('../models/school.model');
const User = require('../models/user.model');
const Student = require('../models/student.model');
const Teacher = require('../models/teacher.model');
const Class = require('../models/class.model');
const Subject = require('../models/subject.model');
const Grade = require('../models/grade.model');
const Payment = require('../models/payment.model');
const Fee = require('../models/fee.model');

class ReportService {
  static async getSchoolDashboardStats(schoolId) {
    // Get school stats
    const schoolStats = await School.getStats(schoolId);
    
    // Get recent activities
    const recentStudents = await Student.findBySchool(schoolId);
    const recentTeachers = await Teacher.findBySchool(schoolId);
    
    // Get payment stats for current academic year
    const currentYear = new Date().getFullYear();
    const academicYear = `${currentYear}-${currentYear + 1}`;
    
    const paymentStats = await Payment.getSchoolStats(schoolId, academicYear);
    
    return {
      schoolStats,
      recentActivities: {
        students: recentStudents.slice(0, 5),
        teachers: recentTeachers.slice(0, 5)
      },
      paymentStats: {
        ...paymentStats,
        academicYear
      }
    };
  }
  
  static async getClassPerformanceReport(classId, academicYear, semester) {
    const classObj = await Class.findById(classId);
    if (!classObj) {
      throw new Error('Class not found');
    }
    
    // Get students in class
    const students = await Class.getStudents(classId);
    
    // Get subjects for class
    const subjects = await Class.getSubjects(classId);
    
    // Get grades for each subject
    const subjectPerformance = [];
    
    for (const subject of subjects) {
      const grades = await Grade.findByClassAndSubject(classId, subject.id, academicYear, semester);
      
      if (grades.length > 0) {
        const average = await Grade.getClassAverage(classId, subject.id, academicYear, semester);
        
        subjectPerformance.push({
          subject: subject.name,
          average: parseFloat(average.average_score) || 0,
          studentCount: parseInt(average.count) || 0,
          grades: grades.length
        });
      }
    }
    
    return {
      class: {
        id: classObj.id,
        name: classObj.name,
        academicYear: classObj.academic_year,
        level: classObj.level
      },
      studentCount: students.length,
      subjects: subjectPerformance,
      academicYear,
      semester
    };
  }
  
  static async getStudentPerformanceReport(studentId, academicYear) {
    const student = await Student.findById(studentId);
    if (!student) {
      throw new Error('Student not found');
    }
    
    // Get academic record
    const academicRecord = await Student.getAcademicRecord(studentId);
    
    // Filter by academic year
    const yearGrades = academicRecord.filter(grade => grade.academic_year === academicYear);
    
    // Calculate subject averages
    const subjectAverages = {};
    const subjectGrades = {};
    
    yearGrades.forEach(grade => {
      if (!subjectGrades[grade.subject_name]) {
        subjectGrades[grade.subject_name] = [];
      }
      subjectGrades[grade.subject_name].push(grade);
    });
    
    Object.keys(subjectGrades).forEach(subject => {
      const grades = subjectGrades[subject];
      const total = grades.reduce((sum, grade) => sum + (grade.score / grade.max_score * 20), 0);
      subjectAverages[subject] = total / grades.length;
    });
    
    // Overall average
    const overallAverage = yearGrades.length > 0 ? 
      yearGrades.reduce((sum, grade) => sum + (grade.score / grade.max_score * 20), 0) / yearGrades.length : 0;
    
    return {
      student: {
        id: student.id,
        studentId: student.student_id,
        firstName: student.first_name,
        lastName: student.last_name,
        className: student.class_name
      },
      academicYear,
      subjectAverages,
      overallAverage,
      totalGrades: yearGrades.length
    };
  }
  
  static async getFinancialReport(schoolId, academicYear) {
    // Get payment stats
    const paymentStats = await Payment.getSchoolStats(schoolId, academicYear);
    
    // Get fees
    const fees = await Fee.findByAcademicYear(schoolId, academicYear);
    
    // Calculate totals
    const totalFees = fees.reduce((sum, fee) => sum + parseFloat(fee.amount), 0);
    const collectionRate = paymentStats.total_amount ? (paymentStats.total_amount / totalFees) * 100 : 0;
    
    // Get payment methods breakdown
    const payments = await Payment.findByFee(fees[0]?.id || '');
    const paymentMethods = {};
    
    payments.forEach(payment => {
      const method = payment.payment_method || 'Unknown';
      if (!paymentMethods[method]) {
        paymentMethods[method] = 0;
      }
      paymentMethods[method] += parseFloat(payment.amount);
    });
    
    return {
      academicYear,
      financialSummary: {
        totalFees,
        totalCollected: parseFloat(paymentStats.total_amount) || 0,
        collectionRate,
        pendingAmount: parseFloat(paymentStats.pending_amount) || 0
      },
      fees: fees.map(fee => ({
        id: fee.id,
        name: fee.name,
        amount: parseFloat(fee.amount),
        dueDate: fee.due_date
      })),
      paymentMethods
    };
  }
  
  static async getTeacherPerformanceReport(teacherId, academicYear) {
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      throw new Error('Teacher not found');
    }
    
    // Get teacher assignments
    const assignments = await Teacher.getAssignments(teacherId);
    
    // Filter by academic year
    const yearAssignments = assignments.filter(a => a.academic_year === academicYear);
    
    // Get student performance for each class/subject
    const classPerformance = [];
    
    for (const assignment of yearAssignments) {
      const students = await Teacher.getStudents(teacherId, academicYear);
      
      classPerformance.push({
        class: assignment.class_name,
        subject: assignment.subject_name,
        studentCount: students.length,
        level: assignment.level
      });
    }
    
    return {
      teacher: {
        id: teacher.id,
        firstName: teacher.first_name,
        lastName: teacher.last_name,
        specialization: teacher.specialization
      },
      academicYear,
      assignments: classPerformance
    };
  }
  
  static async getEnrollmentReport(schoolId) {
    // Get all classes
    const classes = await Class.findBySchool(schoolId);
    
    // Get enrollment stats for each class
    const enrollmentStats = [];
    
    for (const classObj of classes) {
      const students = await Class.getStudents(classObj.id);
      
      enrollmentStats.push({
        class: classObj.name,
        academicYear: classObj.academic_year,
        level: classObj.level,
        studentCount: students.length,
        students: students.map(s => ({
          id: s.id,
          studentId: s.student_id,
          firstName: s.first_name,
          lastName: s.last_name
        }))
      });
    }
    
    // Overall stats
    const totalStudents = enrollmentStats.reduce((sum, stat) => sum + stat.studentCount, 0);
    const averageClassSize = enrollmentStats.length > 0 ? totalStudents / enrollmentStats.length : 0;
    
    return {
      enrollmentStats,
      summary: {
        totalClasses: classes.length,
        totalStudents,
        averageClassSize: Math.round(averageClassSize * 100) / 100
      }
    };
  }
}

module.exports = ReportService;