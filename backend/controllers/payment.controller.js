const Payment = require('../models/payment.model');
const Student = require('../models/student.model');
const Fee = require('../models/fee.model');
const { asyncHandler } = require('../middlewares/error.middleware');
const { roleMiddleware } = require('../middlewares/role.middleware');

class PaymentController {
  // Create new payment
  static create = [
    roleMiddleware('admin'),
    asyncHandler(async (req, res) => {
      const { student_id, fee_id, amount, payment_date, payment_method, reference_number, status } = req.body;
      
      // Validate required fields
      if (!student_id || !fee_id || !amount || !payment_date) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields',
          required: ['student_id', 'fee_id', 'amount', 'payment_date']
        });
      }
      
      // Check if student exists
      const student = await Student.findById(student_id);
      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Student not found'
        });
      }
      
      // Check if fee exists
      const fee = await Fee.findById(fee_id);
      if (!fee) {
        return res.status(404).json({
          success: false,
          message: 'Fee not found'
        });
      }
      
      // Validate amount
      if (amount <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Amount must be greater than 0'
        });
      }
      
      const paymentData = {
        student_id,
        fee_id,
        amount,
        payment_date,
        payment_method: payment_method || null,
        reference_number: reference_number || null,
        status: status || 'completed'
      };
      
      const payment = await Payment.create(paymentData);
      
      res.status(201).json({
        success: true,
        message: 'Payment created successfully',
        data: payment
      });
    })
  ];
  
  // Get payment by ID
  static getById = [
    roleMiddleware('admin', 'student'),
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      const payment = await Payment.findById(id);
      
      if (!payment) {
        return res.status(404).json({
          success: false,
          message: 'Payment not found'
        });
      }
      
      res.json({
        success: true,
        message: 'Payment retrieved successfully',
        data: payment
      });
    })
  ];
  
  // Get payments by student
  static getByStudent = [
    roleMiddleware('admin', 'student'),
    asyncHandler(async (req, res) => {
      const { student_id } = req.params;
      
      // Verify student exists
      const student = await Student.findById(student_id);
      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Student not found'
        });
      }
      
      const payments = await Payment.findByStudent(student_id);
      
      res.json({
        success: true,
        message: 'Student payments retrieved successfully',
        data: payments,
        count: payments.length
      });
    })
  ];
  
  // Get payments by fee
  static getByFee = [
    roleMiddleware('admin'),
    asyncHandler(async (req, res) => {
      const { fee_id } = req.params;
      
      // Verify fee exists
      const fee = await Fee.findById(fee_id);
      if (!fee) {
        return res.status(404).json({
          success: false,
          message: 'Fee not found'
        });
      }
      
      const payments = await Payment.findByFee(fee_id);
      
      res.json({
        success: true,
        message: 'Fee payments retrieved successfully',
        data: payments,
        count: payments.length
      });
    })
  ];
  
  // Update payment
  static update = [
    roleMiddleware('admin'),
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      const updateData = req.body;
      
      // Validate amount if provided
      if (updateData.amount !== undefined && updateData.amount <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Amount must be greater than 0'
        });
      }
      
      const payment = await Payment.update(id, updateData);
      
      if (!payment) {
        return res.status(404).json({
          success: false,
          message: 'Payment not found'
        });
      }
      
      res.json({
        success: true,
        message: 'Payment updated successfully',
        data: payment
      });
    })
  ];
  
  // Delete payment
  static delete = [
    roleMiddleware('admin'),
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      const payment = await Payment.delete(id);
      
      if (!payment) {
        return res.status(404).json({
          success: false,
          message: 'Payment not found'
        });
      }
      
      res.json({
        success: true,
        message: 'Payment deleted successfully'
      });
    })
  ];
  
  // Get school payment statistics
  static getSchoolStats = [
    roleMiddleware('admin'),
    asyncHandler(async (req, res) => {
      const { school_id } = req.user;
      const { academic_year } = req.query;
      
      if (!academic_year) {
        return res.status(400).json({
          success: false,
          message: 'Academic year is required'
        });
      }
      
      const stats = await Payment.getSchoolStats(school_id, academic_year);
      
      res.json({
        success: true,
        message: 'School payment statistics retrieved successfully',
        data: stats
      });
    })
  ];
}

module.exports = PaymentController;