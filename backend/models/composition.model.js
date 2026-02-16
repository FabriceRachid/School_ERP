const { pool } = require('./index');

class Composition {
  static async create(data) {
    const query = `
      INSERT INTO compositions (school_id, class_id, academic_year, trimester, exam_date, instructions, status, created_by)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING *
    `;
    const values = [
      data.school_id,
      data.class_id,
      data.academic_year,
      data.trimester,
      data.exam_date,
      data.instructions || '',
      data.status || 'planned',
      data.created_by
    ];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async listBySchool(schoolId, academicYear) {
    const values = [schoolId];
    let where = 'WHERE c.school_id = $1';
    if (academicYear) {
      values.push(academicYear);
      where += ` AND c.academic_year = $${values.length}`;
    }

    const query = `
      SELECT c.*, cl.name AS class_name,
             u.first_name AS created_by_first_name,
             u.last_name AS created_by_last_name,
             COALESCE(up.upload_count, 0) AS upload_count
      FROM compositions c
      LEFT JOIN classes cl ON cl.id = c.class_id
      LEFT JOIN users u ON u.id = c.created_by
      LEFT JOIN (
        SELECT composition_id, COUNT(*) AS upload_count
        FROM composition_uploads
        GROUP BY composition_id
      ) up ON up.composition_id = c.id
      ${where}
      ORDER BY c.exam_date DESC, c.created_at DESC
    `;

    const { rows } = await pool.query(query, values);
    return rows;
  }

  static async findById(id) {
    const { rows } = await pool.query('SELECT * FROM compositions WHERE id = $1 LIMIT 1', [id]);
    return rows[0] || null;
  }

  static async update(id, payload) {
    const query = `
      UPDATE compositions
      SET exam_date = COALESCE($2, exam_date),
          instructions = COALESCE($3, instructions),
          status = COALESCE($4, status),
          updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `;
    const { rows } = await pool.query(query, [id, payload.exam_date || null, payload.instructions || null, payload.status || null]);
    return rows[0] || null;
  }

  static async upsertUpload(data) {
    const query = `
      INSERT INTO composition_uploads (composition_id, teacher_id, subject_id, subject_title, file_url, notes_summary, notes_uploaded)
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      ON CONFLICT (composition_id, teacher_id, subject_id)
      DO UPDATE SET
        subject_title = EXCLUDED.subject_title,
        file_url = EXCLUDED.file_url,
        notes_summary = EXCLUDED.notes_summary,
        notes_uploaded = EXCLUDED.notes_uploaded,
        updated_at = NOW()
      RETURNING *
    `;
    const { rows } = await pool.query(query, [
      data.composition_id,
      data.teacher_id,
      data.subject_id,
      data.subject_title || '',
      data.file_url || '',
      data.notes_summary || '',
      !!data.notes_uploaded
    ]);
    return rows[0];
  }

  static async getUploads(compositionId) {
    const query = `
      SELECT cu.*, sub.name AS subject_name,
             u.first_name AS teacher_first_name,
             u.last_name AS teacher_last_name
      FROM composition_uploads cu
      LEFT JOIN subjects sub ON sub.id = cu.subject_id
      LEFT JOIN teachers t ON t.id = cu.teacher_id
      LEFT JOIN users u ON u.id = t.user_id
      WHERE cu.composition_id = $1
      ORDER BY cu.updated_at DESC
    `;
    const { rows } = await pool.query(query, [compositionId]);
    return rows;
  }
}

module.exports = Composition;
