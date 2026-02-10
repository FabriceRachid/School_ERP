async function testParentAPI() {
  try {
    console.log('Testing Parent API functionality...\n');
    
    // Get access token
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
    
    console.log('1. Creating a parent...');
    const parentResponse = await fetch('http://localhost:3001/api/parents', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        first_name: 'Mary',
        last_name: 'Johnson',
        email: 'mary.johnson@example.com',
        phone: '+1234567890',
        address: '789 Family Street'
      })
    });
    
    const parentData = await parentResponse.json();
    console.log('Parent creation response:', parentData);
    
    if (parentData.success) {
      const parentId = parentData.data.id;
      
      console.log('\n2. Getting parent by ID...');
      const getParentResponse = await fetch(`http://localhost:3001/api/parents/${parentId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      
      const getParentData = await getParentResponse.json();
      console.log('Get parent response:', getParentData);
      
      console.log('\n3. Updating parent...');
      const updateParentResponse = await fetch(`http://localhost:3001/api/parents/${parentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          phone: '+0987654321'
        })
      });
      
      const updateParentData = await updateParentResponse.json();
      console.log('Update parent response:', updateParentData);
    }
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testParentAPI();