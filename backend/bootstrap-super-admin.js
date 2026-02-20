const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const pool = require('./db');
const Password = require('./utils/password');

async function bootstrapSuperAdmin() {
  const email = (process.env.SUPER_ADMIN_EMAIL || '').trim().toLowerCase();
  const password = process.env.SUPER_ADMIN_PASSWORD || '';
  const firstName = process.env.SUPER_ADMIN_FIRST_NAME || 'Super';
  const lastName = process.env.SUPER_ADMIN_LAST_NAME || 'Admin';
  const mustChange = (process.env.SUPER_ADMIN_MUST_CHANGE_PASSWORD || 'true').toLowerCase() === 'true';

  if (!email || !password) {
    console.log('Skipping bootstrap-super-admin: SUPER_ADMIN_EMAIL or SUPER_ADMIN_PASSWORD missing.');
    return;
  }

  const pwdValidation = Password.validatePassword(password);
  if (!pwdValidation.valid) {
    throw new Error(`Invalid SUPER_ADMIN_PASSWORD: ${pwdValidation.errors.join(', ')}`);
  }

  const existing = await pool.query(
    'SELECT id FROM users WHERE email = $1 AND status != $2 LIMIT 1',
    [email, 'disabled']
  );

  const hash = await Password.hash(password);

  if (existing.rows[0]) {
    await pool.query(
      `UPDATE users
       SET first_name = $2, last_name = $3, role = 'admin', school_id = NULL,
           password_hash = $4, must_change_password = $5, status = 'active', updated_at = NOW()
       WHERE id = $1`,
      [existing.rows[0].id, firstName, lastName, hash, mustChange]
    );
    console.log(`Super admin updated: ${email}`);
    return;
  }

  await pool.query(
    `INSERT INTO users (school_id, first_name, last_name, email, password_hash, role, must_change_password)
     VALUES (NULL, $1, $2, $3, $4, 'admin', $5)`,
    [firstName, lastName, email, hash, mustChange]
  );
  console.log(`Super admin created: ${email}`);
}

bootstrapSuperAdmin()
  .catch((error) => {
    console.error('bootstrap-super-admin failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
  });
