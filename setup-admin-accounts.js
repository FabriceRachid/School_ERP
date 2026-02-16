const axios = require('axios');
const { pool } = require('./models');

async function setupAdminAccounts() {
  try {
    console.log('Setting up proper admin accounts...');
    
    // First, let's check if we have a default school
    const schoolResult = await pool.query('SELECT id FROM schools LIMIT 1');
    let schoolId;
    
    if (schoolResult.rows.length === 0) {
      // Create default school if none exists
      const newSchool = await pool.query(`
        INSERT INTO schools (name, address, phone, email)
        VALUES ($1, $2, $3, $4)
        RETURNING id
      `, ['Default School', '123 School Street', '123-456-7890', 'info@school.edu']);
      schoolId = newSchool.rows[0].id;
      console.log('Created default school:', schoolId);
    } else {
      schoolId = schoolResult.rows[0].id;
      console.log('Using existing school:', schoolId);
    }
    
    // Create Super Admin account
    console.log('\nCreating Super Admin account...');
    try {
      const superAdminResponse = await axios.post('http://localhost:3001/api/auth/register', {
        school_id: schoolId,
        first_name: 'Super',
        last_name: 'Administrator',
        email: 'superadmin@school.edu',
        password: 'SuperAdmin123!',
        role: 'admin'
      });
      console.log('Super Admin created:', superAdminResponse.data);
    } catch (error) {
      if (error.response?.data?.message?.includes('Email already registered')) {
        console.log('Super Admin already exists');
      } else {
        console.error('Error creating Super Admin:', error.response?.data || error.message);
      }
    }
    
    // Create regular Admin account
    console.log('\nCreating Admin account...');
    try {
      const adminResponse = await axios.post('http://localhost:3001/api/auth/register', {
        school_id: schoolId,
        first_name: 'School',
        last_name: 'Administrator',
        email: 'admin@school.edu',
        password: 'Admin123!',
        role: 'admin'
      });
      console.log('Admin created:', adminResponse.data);
    } catch (error) {
      if (error.response?.data?.message?.includes('Email already registered')) {
        console.log('Admin already exists');
      } else {
        console.error('Error creating Admin:', error.response?.data || error.message);
      }
    }
    
    // Test login with Super Admin
    console.log('\nTesting Super Admin login...');
    try {
      const loginResponse = await axios.post('http://localhost:3001/api/auth/login', {
        email: 'superadmin@school.edu',
        password: 'SuperAdmin123!'
      });
      console.log('Super Admin login successful');
      console.log('Token:', loginResponse.data.data.accessToken.substring(0, 50) + '...');
    } catch (error) {
      console.error('Super Admin login failed:', error.response?.data || error.message);
    }
    
    // Test login with regular Admin
    console.log('\nTesting Admin login...');
    try {
      const loginResponse = await axios.post('http://localhost:3001/api/auth/login', {
        email: 'admin@school.edu',
        password: 'Admin123!'
      });
      console.log('Admin login successful');
      console.log('Token:', loginResponse.data.data.accessToken.substring(0, 50) + '...');
    } catch (error) {
      console.error('Admin login failed:', error.response?.data || error.message);
    }
    
    console.log('\n=== ADMIN ACCOUNTS SETUP COMPLETE ===');
    console.log('Use these credentials to test:');
    console.log('1. Super Admin: superadmin@school.edu / SuperAdmin123!');
    console.log('2. Admin: admin@school.edu / Admin123!');
    console.log('Both have full admin access to the web interface.');
    
  } catch (error) {
    console.error('Setup failed:', error);
  } finally {
    await pool.end();
  }
}

setupAdminAccounts();