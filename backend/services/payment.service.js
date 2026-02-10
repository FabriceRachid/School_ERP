const Payment = require('../models/payment.model');
const Student = require('../models/student.model');
const Fee = require('../models/fee.model');

class PaymentService {
  static async createPayment(paymentData) {
    // Validate student
    const student = await Student.findById(paymentData.student_id);
    if (!student) {
      throw new Error('Student not found');
    }
    
    // Validate fee
    const fee = await Fee.findById(paymentData.fee_id);
    if (!fee) {
      throw new Error('Fee not found');
    }
    
    // Validate amount
    if (paymentData.amount <= 0) {
      throw new Error('Amount must be greater than 0');
    }
    
    return await Payment.create({
      ...paymentData,
      status: paymentData.status || 'completed'
    });
  }
  
  static async getPaymentSummary(studentId) {
    const student = await Student.findById(studentId);
    if (!student) {
      throw new Error('Student not found');
    }
    
    const payments = await Payment.findByStudent(studentId);
    
    const summary = {
      totalPayments: payments.length,
      totalAmount: 0,
      completedPayments: 0,
      completedAmount: 0,
      pendingPayments: 0,
      pendingAmount: 0,
      failedPayments: 0,
      failedAmount: 0
    };
    
    payments.forEach(payment => {
      const amount = parseFloat(payment.amount);
      summary.totalAmount += amount;
      
      switch (payment.status) {
        case 'completed':
          summary.completedPayments++;
          summary.completedAmount += amount;
          break;
        case 'pending':
          summary.pendingPayments++;
          summary.pendingAmount += amount;
          break;
        case 'failed':
          summary.failedPayments++;
          summary.failedAmount += amount;
          break;
      }
    });
    
    return {
      payments,
      summary
    };
  }
  
  static async getFeePaymentStats(feeId) {
    const fee = await Fee.findById(feeId);
    if (!fee) {
      throw new Error('Fee not found');
    }
    
    const stats = await Fee.getPaymentStats(feeId);
    
    return {
      fee,
      stats
    };
  }
  
  static async getSchoolPaymentStats(schoolId, academicYear) {
    const stats = await Payment.getSchoolStats(schoolId, academicYear);
    
    // Get fees for the academic year
    const fees = await Fee.findByAcademicYear(schoolId, academicYear);
    
    const totalFees = fees.reduce((sum, fee) => sum + parseFloat(fee.amount), 0);
    
    return {
      ...stats,
      totalFees,
      collectionRate: stats.total_amount ? (stats.total_amount / totalFees) * 100 : 0
    };
  }
  
  static async processBulkPayments(paymentsData) {
    const results = [];
    
    for (const paymentData of paymentsData) {
      try {
        const payment = await this.createPayment(paymentData);
        results.push({
          success: true,
          payment,
          error: null
        });
      } catch (error) {
        results.push({
          success: false,
          payment: null,
          error: error.message
        });
      }
    }
    
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    
    return {
      results,
      summary: {
        total: results.length,
        successful,
        failed
      }
    };
  }
  
  static async getPaymentHistory(studentId, filters = {}) {
    const student = await Student.findById(studentId);
    if (!student) {
      throw new Error('Student not found');
    }
    
    let payments = await Payment.findByStudent(studentId);
    
    // Apply filters
    if (filters.status) {
      payments = payments.filter(p => p.status === filters.status);
    }
    
    if (filters.startDate) {
      payments = payments.filter(p => new Date(p.payment_date) >= new Date(filters.startDate));
    }
    
    if (filters.endDate) {
      payments = payments.filter(p => new Date(p.payment_date) <= new Date(filters.endDate));
    }
    
    // Sort by date
    payments.sort((a, b) => new Date(b.payment_date) - new Date(a.payment_date));
    
    return payments;
  }
  
  static async updatePaymentStatus(paymentId, status) {
    const validStatuses = ['pending', 'completed', 'failed', 'refunded'];
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid status. Valid statuses: ${validStatuses.join(', ')}`);
    }
    
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      throw new Error('Payment not found');
    }
    
    return await Payment.update(paymentId, { status });
  }
}

module.exports = PaymentService;