// Quick test to verify school stats API
const axios = require('axios');

async function testSchoolStats() {
  try {
    // First login to get token
    const loginResponse = await axios.post('http://localhost:3001/api/auth/login', {
      email: 'admin@ecole.sn',
      password: 'admin123'
    });
    
    const token = loginResponse.data.data.token;
    console.log('✅ Login successful');
    
    // Test school stats endpoint
    const statsResponse = await axios.get('http://localhost:3001/api/school-stats/stats', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ School Stats API Response:');
    console.log(JSON.stringify(statsResponse.data, null, 2));
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testSchoolStats();