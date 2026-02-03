const pool = require('../db');

// Database schema initialization
const initDatabase = async () => {
  try {
    // Enable UUID extension
    await pool.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    
    // Schools table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS schools (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(255) NOT NULL,
        address TEXT,
        phone VARCHAR(20),
        email VARCHAR(255),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    
    // Users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'teacher', 'student')),
        status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'disabled')),
        phone VARCHAR(20),
        address TEXT,
        date_of_birth DATE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    
    // Classes table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS classes (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
        name VARCHAR(100) NOT NULL,
        academic_year VARCHAR(9) NOT NULL,
        level VARCHAR(50),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(school_id, name, academic_year)
      )
    `);
    
    // Subjects table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS subjects (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
        name VARCHAR(100) NOT NULL,
        code VARCHAR(20) UNIQUE,
        coefficient DECIMAL(3,2) DEFAULT 1.00,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    
    // Class-Subject relationship
    await pool.query(`
      CREATE TABLE IF NOT EXISTS class_subjects (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
        subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(class_id, subject_id)
      )
    `);
    
    // Students table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS students (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        class_id UUID REFERENCES classes(id) ON DELETE SET NULL,
        student_id VARCHAR(50) UNIQUE,
        parent_name VARCHAR(200),
        parent_phone VARCHAR(20),
        enrollment_date DATE DEFAULT NOW(),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    
    // Teachers table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS teachers (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        specialization TEXT,
        hire_date DATE,
        salary DECIMAL(10,2),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    
    // Teacher-Subject-Class assignment
    await pool.query(`
      CREATE TABLE IF NOT EXISTS teacher_assignments (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
        class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
        subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
        academic_year VARCHAR(9) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(teacher_id, class_id, subject_id, academic_year)
      )
    `);
    
    // Grades table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS grades (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        student_id UUID REFERENCES students(id) ON DELETE CASCADE,
        subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
        teacher_id UUID REFERENCES teachers(id) ON DELETE SET NULL,
        evaluation_type VARCHAR(50) NOT NULL,
        score DECIMAL(5,2),
        max_score DECIMAL(5,2) DEFAULT 20.00,
        academic_year VARCHAR(9) NOT NULL,
        semester VARCHAR(20) NOT NULL,
        date DATE NOT NULL,
        comments TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    
    // Fees table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS fees (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
        name VARCHAR(100) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        description TEXT,
        academic_year VARCHAR(9) NOT NULL,
        due_date DATE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    
    // Payments table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        student_id UUID REFERENCES students(id) ON DELETE CASCADE,
        fee_id UUID REFERENCES fees(id) ON DELETE CASCADE,
        amount DECIMAL(10,2) NOT NULL,
        payment_date DATE NOT NULL,
        payment_method VARCHAR(50),
        reference_number VARCHAR(100),
        status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    
    // Notifications table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
        recipient_id UUID REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        type VARCHAR(50) NOT NULL,
        status VARCHAR(20) DEFAULT 'unread' CHECK (status IN ('read', 'unread', 'archived')),
        created_at TIMESTAMP DEFAULT NOW(),
        read_at TIMESTAMP
      )
    `);
    
    console.log('Database schema initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

module.exports = {
  initDatabase,
  pool
};