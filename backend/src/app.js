const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { initDatabase } = require('../models');

const app = express();

// Import middlewares
const { errorMiddleware, notFoundMiddleware } = require('../middlewares/error.middleware');

// Import routes
const authRoutes = require('../routes/auth.routes');
const schoolRoutes = require('../routes/school.routes');
const userRoutes = require('../routes/user.routes');
const studentRoutes = require('../routes/student.routes');
const teacherRoutes = require('../routes/teacher.routes');
const classRoutes = require('../routes/class.routes');
const subjectRoutes = require('../routes/subject.routes');
const gradeRoutes = require('../routes/grade.routes');
const paymentRoutes = require('../routes/payment.routes');
const notificationRoutes = require('../routes/notification.routes');

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Initialize database
const initializeApp = async () => {
  try {
    await initDatabase();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  }
};

// Health check endpoint
app.get('/health', async (req, res) => {
  res.json({
    status: 'OK',
    message: 'School ERP API is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/schools', schoolRoutes);
app.use('/api/users', userRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/grades', gradeRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/notifications', notificationRoutes);

// 404 handler
app.use(notFoundMiddleware);

// Error handler
app.use(errorMiddleware);

// Initialize app
initializeApp();

module.exports = app;