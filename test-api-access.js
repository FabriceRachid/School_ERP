const axios = require('axios');

async function testApiAccess() {
  try {
    console.log('Testing API access with authentication token...');
    
    // Use the token from our successful login
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI3N2UzYTdiYy04MmRiLTQzOWQtOGYwNC02NTExYjUzNjUyZjEiLCJzY2hvb2xJZCI6IjQ3NDZiZjc3LTkzNjAtNGViMS05MDY2LWI5ZTM4YjdiYTZhYiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc3MDc2NzIxNyw';
    
    const response = await axios.get('http://localhost:3001/api/students', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('API access successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('API access failed:', error.response?.data || error.message);
    return null;
  }
}

testApiAccess();