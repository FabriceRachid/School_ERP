const pool = require('./db');

async function createDefaultSchool() {
  try {
    // Check if school already exists
    const existing = await pool.query(
      'SELECT id FROM schools WHERE id = $1', 
      ['00000000-0000-0000-0000-000000000001']
    );
    
    if (existing.rows.length > 0) {
      console.log('Default school already exists');
      return;
    }
    
    // Create default school
    const result = await pool.query(
      'INSERT INTO schools (id, name, address, phone, email) VALUES ($1, $2, $3, $4, $5)',
      ['00000000-0000-0000-0000-000000000001', 'École Démo', 'Adresse de démonstration', '0123456789', 'contact@ecole-demo.com']
    );
    
    console.log('Default school created successfully');
  } catch (error) {
    console.error('Error creating default school:', error);
  } finally {
    await pool.end();
  }
}

createDefaultSchool();