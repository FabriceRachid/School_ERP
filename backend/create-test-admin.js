const axios = require('axios');

async function createTestAdmin() {
  try {
    const response = await axios.post('http://localhost:3001/api/auth/register', {
      school_id: '00000000-0000-0000-0000-000000000001',
      first_name: 'Admin',
      last_name: 'User',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin'
    });
    
    console.log('Admin user created successfully:', response.data);
  } catch (error) {
    console.error('Error creating admin user:', error.response?.data || error.message);
  }
}

createTestAdmin();