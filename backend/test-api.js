const { pool } = require('./models');

async function testAPI() {
  try {
    console.log('Testing School ERP API endpoints...\n');
    
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await fetch('http://localhost:3001/health');
    const healthData = await healthResponse.json();
    console.log('Health response:', healthData);
    
    // Get access token from previous test
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
    const accessToken = loginData.data.accessToken;
    
    console.log('\n2. Testing schools endpoint...');
    const schoolResponse = await fetch('http://localhost:3001/api/schools', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        name: 'New Test School',
        address: '456 Test Avenue',
        phone: '987-654-3210',
        email: 'test@newschool.com'
      })
    });
    
    const schoolData = await schoolResponse.json();
    console.log('School creation response:', schoolData);
    
    if (schoolData.success) {
      const schoolId = schoolData.data.id;
      
      console.log('\n3. Testing users endpoint...');
      const userResponse = await fetch('http://localhost:3001/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          school_id: schoolId,
          first_name: 'Jane',
          last_name: 'Smith',
          email: 'jane.smith@example.com',
          password: 'Password123!',
          role: 'teacher',
          phone: '555-123-4567'
        })
      });
      
      const userData = await userResponse.json();
      console.log('User creation response:', userData);
      
      if (userData.success) {
        const userId = userData.data.id;
        
        console.log('\n4. Testing teacher creation...');
        const teacherResponse = await fetch('http://localhost:3001/api/teachers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify({
            user_id: userId,
            specialization: 'Mathematics',
            hire_date: '2024-01-15',
            salary: 50000
          })
        });
        
        const teacherData = await teacherResponse.json();
        console.log('Teacher creation response:', teacherData);
      }
    }
    
    console.log('\n5. Testing GET endpoints...');
    const schoolsGetResponse = await fetch('http://localhost:3001/api/schools', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    const schoolsData = await schoolsGetResponse.json();
    console.log('Get schools response:', schoolsData);
    
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await pool.end();
  }
}

testAPI();