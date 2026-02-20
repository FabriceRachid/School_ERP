const axios = require('axios');

async function testLogin() {
  try {
    console.log('Testing login with existing user...');
    
    const response = await axios.post('http://localhost:3001/api/auth/login', {
      email: 'john.doe@example.com',
      password: 'Password123!'
    });
    
    console.log('Login successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Login failed:', error.response?.data || error.message);
    return null;
  }
}

testLogin();