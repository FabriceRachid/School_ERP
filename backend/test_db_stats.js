// Direct database test for school statistics
const { pool } = require('./models');

async function testDatabaseStats() {
  try {
    console.log('🔍 Testing database statistics...');
    
    // Test students count
    const studentsQuery = `
      SELECT COUNT(*) as total_students
      FROM students s
      JOIN users u ON s.user_id = u.id
      WHERE u.role = 'student'
    `;
    const studentsResult = await pool.query(studentsQuery);
    console.log('✅ Students count:', studentsResult.rows[0].total_students);
    
    // Test parents count
    const parentsQuery = `
      SELECT COUNT(*) as total_parents
      FROM users
      WHERE role = 'parent'
    `;
    const parentsResult = await pool.query(parentsQuery);
    console.log('✅ Parents count:', parentsResult.rows[0].total_parents);
    
    // Test teachers count
    const teachersQuery = `
      SELECT COUNT(*) as total_teachers
      FROM users
      WHERE role = 'teacher'
    `;
    const teachersResult = await pool.query(teachersQuery);
    console.log('✅ Teachers count:', teachersResult.rows[0].total_teachers);
    
    // Test classes count
    const classesQuery = `
      SELECT COUNT(*) as total_classes
      FROM classes
    `;
    const classesResult = await pool.query(classesQuery);
    console.log('✅ Classes count:', classesResult.rows[0].total_classes);
    
    console.log('\n🎉 All database statistics working correctly!');
    
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
  } finally {
    await pool.end();
  }
}

testDatabaseStats();