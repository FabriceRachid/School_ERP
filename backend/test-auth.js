const { pool } = require('./models');

async function testAuth() {
  try {
    // First create a test school
    console.log('Creating test school...');
    const schoolResult = await pool.query(`
      INSERT INTO schools (name, address, phone, email)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name
    `, ['Test School', '123 Test Street', '123-456-7890', 'test@school.com']);
    
    const schoolId = schoolResult.rows[0].id;
    console.log('School created:', schoolResult.rows[0]);
    
    // Test registration
    console.log('\nTesting registration...');
    const registerResponse = await fetch('http://localhost:3001/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        school_id: schoolId,
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        password: 'Password123!',
        role: 'admin'
      })
    });
    
    const registerData = await registerResponse.json();
    console.log('Registration response:', registerData);
    
    if (registerData.success) {
      // Test login
      console.log('\nTesting login...');
      const loginResponse = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: 'john.doe@example.com',
          password: 'Password123!'
        })
      });
      
      const loginData = await loginResponse.json();
      console.log('Login response:', loginData);
      
      if (loginData.success) {
        // Test profile access
        console.log('\nTesting profile access...');
        const profileResponse = await fetch('http://localhost:3001/api/auth/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${loginData.data.accessToken}`
          }
        });
        
        const profileData = await profileResponse.json();
        console.log('Profile response:', profileData);
      }
    }
    
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await pool.end();
  }
}

testAuth();