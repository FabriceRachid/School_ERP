const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const pool = require('./db');
const Password = require('./utils/password');

const IDS = {
  school: '11111111-1111-1111-1111-111111111111',
  class: '11111111-1111-1111-1111-111111111112',
  subjectMath: '11111111-1111-1111-1111-111111111113'
};

async function upsertUser({
  email,
  password,
  firstName,
  lastName,
  role,
  schoolId = null,
  mustChangePassword = false
}) {
  const password_hash = await Password.hash(password);
  const normalizedEmail = email.trim().toLowerCase();

  const result = await pool.query(
    `
    INSERT INTO users (school_id, first_name, last_name, email, password_hash, role, status, must_change_password)
    VALUES ($1, $2, $3, $4, $5, $6, 'active', $7)
    ON CONFLICT (email)
    DO UPDATE SET
      school_id = EXCLUDED.school_id,
      first_name = EXCLUDED.first_name,
      last_name = EXCLUDED.last_name,
      password_hash = EXCLUDED.password_hash,
      role = EXCLUDED.role,
      status = 'active',
      must_change_password = EXCLUDED.must_change_password,
      updated_at = NOW()
    RETURNING id, email, role, school_id
  `,
    [schoolId, firstName, lastName, normalizedEmail, password_hash, role, mustChangePassword]
  );

  return result.rows[0];
}

async function seedDemo() {
  await pool.query(
    `
    INSERT INTO schools (id, name, address, phone, email, is_active)
    VALUES ($1, $2, $3, $4, $5, true)
    ON CONFLICT (id)
    DO UPDATE SET
      name = EXCLUDED.name,
      address = EXCLUDED.address,
      phone = EXCLUDED.phone,
      email = EXCLUDED.email,
      is_active = true,
      updated_at = NOW()
  `,
    [IDS.school, 'Lycée Victor Hugo', 'Rue 12, Plateau, Abidjan', '+225 07 00 00 01', 'contact@lycee-victor.edu']
  );

  await pool.query(
    `
    INSERT INTO classes (id, school_id, name, academic_year, level, cycle_name, capacity, fees)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    ON CONFLICT (id)
    DO UPDATE SET
      school_id = EXCLUDED.school_id,
      name = EXCLUDED.name,
      academic_year = EXCLUDED.academic_year,
      level = EXCLUDED.level,
      cycle_name = EXCLUDED.cycle_name,
      capacity = EXCLUDED.capacity,
      fees = EXCLUDED.fees,
      updated_at = NOW()
  `,
    [IDS.class, IDS.school, 'Terminale A', '2025-2026', 'Secondaire', 'Second Cycle', 45, 150000]
  );

  await pool.query(
    `
    INSERT INTO subjects (id, school_id, name, code, coefficient)
    VALUES ($1, $2, $3, $4, $5)
    ON CONFLICT (id)
    DO UPDATE SET
      school_id = EXCLUDED.school_id,
      name = EXCLUDED.name,
      code = EXCLUDED.code,
      coefficient = EXCLUDED.coefficient,
      updated_at = NOW()
  `,
    [IDS.subjectMath, IDS.school, 'Mathématiques', 'MATH', 5]
  );

  const superAdmin = await upsertUser({
    email: 'superadmin@erp.edu',
    password: 'admin123',
    firstName: 'Jean',
    lastName: 'Dupont',
    role: 'admin',
    schoolId: null,
    mustChangePassword: false
  });

  const schoolAdmin = await upsertUser({
    email: 'admin@lycee-victor.edu',
    password: 'admin123',
    firstName: 'Marie',
    lastName: 'Kouassi',
    role: 'admin',
    schoolId: IDS.school,
    mustChangePassword: false
  });

  const teacherUser = await upsertUser({
    email: 'prof.math@lycee-victor.edu',
    password: 'prof123',
    firstName: 'Ibrahim',
    lastName: 'Traoré',
    role: 'teacher',
    schoolId: IDS.school,
    mustChangePassword: false
  });

  let teacherId;
  const existingTeacher = await pool.query('SELECT id FROM teachers WHERE user_id = $1 LIMIT 1', [teacherUser.id]);
  if (existingTeacher.rows[0]) {
    teacherId = existingTeacher.rows[0].id;
    await pool.query('UPDATE teachers SET specialization = $2, updated_at = NOW() WHERE id = $1', [teacherId, 'Mathématiques']);
  } else {
    const teacherResult = await pool.query(
      `
      INSERT INTO teachers (user_id, specialization, hire_date)
      VALUES ($1, $2, NOW())
      RETURNING id
    `,
      [teacherUser.id, 'Mathématiques']
    );
    teacherId = teacherResult.rows[0].id;
  }

  await pool.query(
    `
    INSERT INTO teacher_assignments (teacher_id, class_id, subject_id, academic_year)
    VALUES ($1, $2, $3, '2025-2026')
    ON CONFLICT (teacher_id, class_id, subject_id, academic_year) DO NOTHING
  `,
    [teacherId, IDS.class, IDS.subjectMath]
  );

  await pool.query(
    `
    INSERT INTO teacher_school_links (teacher_id, school_id)
    VALUES ($1, $2)
    ON CONFLICT (teacher_id, school_id) DO NOTHING
  `,
    [teacherId, IDS.school]
  );

  await pool.query(
    `
    INSERT INTO timetable_slots (class_id, subject_id, teacher_id, day_of_week, start_time, end_time, room)
    VALUES ($1, $2, $3, 'monday', '08:00', '10:00', 'Salle 101')
    ON CONFLICT DO NOTHING
  `,
    [IDS.class, IDS.subjectMath, teacherId]
  );

  console.log('Demo accounts seeded successfully');
  console.log(`- Super Admin: ${superAdmin.email} / admin123`);
  console.log(`- Admin École: ${schoolAdmin.email} / admin123`);
  console.log(`- Enseignant: ${teacherUser.email} / prof123`);
}

seedDemo()
  .catch((error) => {
    console.error('seed-demo-accounts failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
  });
