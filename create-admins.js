const axios = require('axios');

async function createAdminAccounts() {
  try {
    console.log('Creating admin accounts...');
    
    // Create Super Admin
    console.log('\nCreating Super Admin account...');
    try {
      const superAdminResponse = await axios.post('http://localhost:3001/api/auth/register', {
        school_id: '00000000-0000-0000-0000-000000000001',
        first_name: 'Super',
        last_name: 'Administrator',
        email: 'superadmin@school.edu',
        password: 'SuperAdmin123!',
        role: 'admin'
      });
      console.log('Super Admin created successfully');
    } catch (error) {
      if (error.response?.data?.message?.includes('Email already registered')) {
        console.log('Super Admin already exists');
      } else {
        console.log('Super Admin creation response:', error.response?.data || error.message);
      }
    }
    
    // Create Regular Admin
    console.log('\nCreating Admin account...');
    try {
      const adminResponse = await axios.post('http://localhost:3001/api/auth/register', {
        school_id: '00000000-0000-0000-0000-000000000001',
        first_name: 'School',
        last_name: 'Administrator',
        email: 'admin@school.edu',
        password: 'Admin123!',
        role: 'admin'
      });
      console.log('Admin created successfully');
    } catch (error) {
      if (error.response?.data?.message?.includes('Email already registered')) {
        console.log('Admin already exists');
      } else {
        console.log('Admin creation response:', error.response?.data || error.message);
      }
    }
    
    // Test logins
    console.log('\nTesting logins...');
    
    // Test Super Admin login
    try {
      const superLogin = await axios.post('http://localhost:3001/api/auth/login', {
        email: 'superadmin@school.edu',
        password: 'SuperAdmin123!'
      });
      console.log('✅ Super Admin login successful');
    } catch (error) {
      console.log('❌ Super Admin login failed:', error.response?.data?.message || error.message);
    }
    
    // Test Admin login
    try {
      const adminLogin = await axios.post('http://localhost:3001/api/auth/login', {
        email: 'admin@school.edu',
        password: 'Admin123!'
      });
      console.log('✅ Admin login successful');
    } catch (error) {
      console.log('❌ Admin login failed:', error.response?.data?.message || error.message);
    }
    
    console.log('\n=== SETUP COMPLETE ===');
    console.log('Test credentials:');
    console.log('Super Admin: superadmin@school.edu / SuperAdmin123!');
    console.log('Admin: admin@school.edu / Admin123!');
    
  } catch (error) {
    console.error('Setup failed:', error.message);
  }
}

createAdminAccounts();